const ModAPI = VX.Mod.ModAPI;
const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const VoxelDestructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
const PxRigidBodyType = puerts.$typeof(CS.Px5.Unity.PxRigidBody);
const Vec3 = CS.UnityEngine.Vector3;

type CollisionCallback = (collision: CS.Px5.UnityExtensions.Collision) => void;

interface CollisionRegistrableActor {
    RegisterOnCollisionEnter(cb: CollisionCallback): void;
    UnregisterOnCollisionEnter(cb: CollisionCallback): void;
    enableCollisionEvent: boolean;
}

interface KnockoutableCharacter {
    KnockOut(): void;
    IsKnockedOut(): boolean;
}

const STRIKE_BODY_NAMES = [
    "Hip", "Torso", "Head",
    "LeftArmUp", "RightArmUp",
    "LeftArmLow", "RightArmLow",
    "LeftHand", "RightHand",
    "LeftLegUp", "RightLegUp",
] as const;

const LAUNCH_LIMBS = new Set<string>([
    "LeftHand", "RightHand",
]);

export class OmniMan {
    private readonly bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null = null;

    private readonly velocityThreshold: number = 1.0;
    private readonly demolishWallThreshold: number = 1.0;
    private readonly knockoutThreshold: number = 2.0;
    private readonly explosionOffsetMin: number = -0.15;
    private readonly explosionOffsetMax: number = 0.6;
    private readonly demolishRadius: number = 0.6;
    private readonly demolishForce: number = 30;
    private readonly spreadAngle: number = 45;
    private readonly maxFragments: number = 32;

    private readonly victimImpulsePerBone: number = 10;
    private readonly victimUpBias: number = 0.4;
    private readonly torqueImpulse: number = 4.0;
    private readonly speedScaleMax: number = 2.0;
    private readonly punchDirectionWeight: number = 0.7;

    private readonly cooldownSeconds: number = 0.05;

    // Flight-mode voxel plow. Mask mirrors LayerMasksHelper.bulletHitLayerMask:
    // Ragdoll, Ragdoll_VRCam_Hide, Item, Item_Projectile_Ignore, Building.
    private readonly flightCullRadiusMax: number = 1.0;
    private readonly flightCullForwardOffset: number = 0.5;
    private readonly flightCullSpeedThreshold: number = 4.0;
    private readonly flightCullSpeedForFull: number = 8.0;
    private readonly flightVerticalSpeedBoost: number = 1.8;
    // Leading "strike" sphere: small ball further forward that fires DemolishVoxelSphere
    // (fragments + force) on overlap, before the cull cylinder silently carves the trail.
    private readonly flightStrikeRadius: number = 1.0;
    private readonly flightStrikeRadiusMin: number = 0.2;
    private readonly flightStrikeForwardOffset: number = 1.5;
    private readonly flightStrikeForwardOffsetMin: number = 0.25;
    private readonly flightStrikeForce: number = 25;
    private readonly flightStrikeMaxFragments: number = 6;
    private readonly flightStrikeSpreadAngle: number = 60;
    private readonly flightImpactSoundIntervalMin: number = 0.35;
    private readonly flightImpactSoundIntervalMax: number = 0.7;
    private readonly flightImpactSoundVolumeMin: number = 28;
    private readonly flightImpactSoundVolumeMax: number = 56;
    private readonly flightMetalSweetenerChance: number = 0.28;
    private readonly flightMetalSweetenerIntervalMin: number = 0.6;
    private readonly flightMetalSweetenerIntervalMax: number = 1.4;
    private readonly woodMaterialId: number = 1;
    private flightCullLayerMask: number = 0;
    private readonly seenDestructorIds = new Set<number>();
    private nextFlightCullDebugLogTime: number = 0;
    private nextFlightImpactSoundTime: number = 0;
    private nextFlightMetalSweetenerTime: number = 0;
    private soundMgr: any = null;
    private hasLastChestPosition: boolean = false;
    private lastChestPosition: CS.UnityEngine.Vector3 = Vec3.zero;

    private readonly limbBodies: Array<{ name: string; rb: CS.Px5.Unity.PxRigidBody; handler: CollisionCallback; nextAllowedTime: number }> = [];

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);

        CS.UnityEngine.Debug.Log(
            `[OmniMan DEBUG 2026-05-06] constructor loaded: flightCullSpeedThreshold=${this.flightCullSpeedThreshold}, explosionOffsetMin=${this.explosionOffsetMin}, explosionOffsetMax=${this.explosionOffsetMax}`
        );

        const LayerMask = CS.UnityEngine.LayerMask;
        const layerNames = ["Ragdoll", "Ragdoll_VRCam_Hide", "Item", "Item_Projectile_Ignore", "Building"];
        let mask = 0;
        for (const n of layerNames) {
            const idx = LayerMask.NameToLayer(n);
            if (idx >= 0) mask |= (1 << idx);
        }
        this.flightCullLayerMask = mask;
    }

    private onUpdate(deltaTime: number): void {
        if (!this.character) return;

        const ch = this.character as unknown as { IsFlying: boolean };
        if (ch.IsFlying !== true) {
            if (this.hasLastChestPosition) {
                this.logFlightCullDebug(CS.UnityEngine.Time.time, "RESET not flying");
            }
            this.hasLastChestPosition = false;
            return;
        }

        const chestRb = ModAPI.GetCharacterBody(this.character, "Torso") as CS.Px5.Unity.PxRigidBody | null;
        if (!chestRb || deltaTime <= 0) {
            this.hasLastChestPosition = false;
            this.logFlightCullDebug(
                CS.UnityEngine.Time.time,
                `RESET invalid sample hasChest=${chestRb !== null} dt=${deltaTime.toFixed(3)}`
            );
            return;
        }

        const chestPosition = chestRb.transform.position;
        if (!this.hasLastChestPosition) {
            this.lastChestPosition = chestPosition;
            this.hasLastChestPosition = true;
            this.logFlightCullDebug(
                CS.UnityEngine.Time.time,
                `FIRST_SAMPLE source=chestPositionDelta(Torso) pos=(${chestPosition.x.toFixed(2)}, ${chestPosition.y.toFixed(2)}, ${chestPosition.z.toFixed(2)})`
            );
            return;
        }

        const chestDelta = Vec3.op_Subtraction(chestPosition, this.lastChestPosition);
        this.lastChestPosition = chestPosition;

        const flightDir = chestDelta.sqrMagnitude > 1e-6 ? chestDelta.normalized : this.character.transform.forward;
        const rawSpeed = chestDelta.magnitude / deltaTime;
        const verticalAmount = Math.abs(flightDir.y);
        const speed = rawSpeed * (1 + (this.flightVerticalSpeedBoost - 1) * verticalAmount);
        const velocityText = `delta=(${chestDelta.x.toFixed(3)}, ${chestDelta.y.toFixed(3)}, ${chestDelta.z.toFixed(3)}) dt=${deltaTime.toFixed(3)}`;
        const now = CS.UnityEngine.Time.time;
        if (speed < this.flightCullSpeedThreshold) {
            this.logFlightCullDebug(now, `BLOCKED source=chestPositionDelta(Torso) rawSpeed=${rawSpeed.toFixed(2)} boostedSpeed=${speed.toFixed(2)} vertical=${verticalAmount.toFixed(2)} ${velocityText} threshold=${this.flightCullSpeedThreshold}`);
            return;
        }

        const speedScale = Math.min(1, (speed - this.flightCullSpeedThreshold) / (this.flightCullSpeedForFull - this.flightCullSpeedThreshold));
        const easedSpeedScale = speedScale * speedScale * (3 - 2 * speedScale);
        const radius = this.flightCullRadiusMax * easedSpeedScale;
        if (radius <= 0.01) return;
        this.logFlightCullDebug(now, `ACTIVE source=chestPositionDelta(Torso) rawSpeed=${rawSpeed.toFixed(2)} boostedSpeed=${speed.toFixed(2)} vertical=${verticalAmount.toFixed(2)} ${velocityText} dir=(${flightDir.x.toFixed(2)}, ${flightDir.y.toFixed(2)}, ${flightDir.z.toFixed(2)}) radius=${radius.toFixed(2)} threshold=${this.flightCullSpeedThreshold}`);

        const characterTransform = this.character.transform;

        // Strike sphere: fragments + force on overlap.
        const strikeForwardOffset = this.flightStrikeForwardOffsetMin + (this.flightStrikeForwardOffset - this.flightStrikeForwardOffsetMin) * easedSpeedScale;
        const strikeRadius = this.flightStrikeRadiusMin + (this.flightStrikeRadius - this.flightStrikeRadiusMin) * easedSpeedScale;
        const origin = chestPosition;
        const strikeCenter = Vec3.op_Addition(origin, Vec3.op_Multiply(flightDir, strikeForwardOffset));
        const strikeColliders = CS.Px5.Unity.PxPhysics.OverlapSphere(strikeCenter, strikeRadius, this.flightCullLayerMask);
        if (strikeColliders && strikeColliders.Length > 0) {
            const struckIds = new Set<number>();
            for (let i = 0; i < strikeColliders.Length; i++) {
                const c = strikeColliders.get_Item(i) as CS.Px5.Unity.PxCollider;
                if (!c) continue;
                const vd = c.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
                if (!vd || !ModAPI.IsVoxelDestructible(vd)) continue;
                if (vd.transform.IsChildOf(characterTransform)) continue;
                const hitCharacter = c.GetComponentInParent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
                const isOtherCharacter = hitCharacter !== null && hitCharacter !== this.character;
                const id = vd.GetInstanceID();
                if (struckIds.has(id)) continue;
                struckIds.add(id);
                ModAPI.DemolishVoxelSphere(
                    vd,
                    strikeCenter,
                    strikeRadius,
                    this.flightStrikeForce,
                    flightDir,
                    this.flightStrikeSpreadAngle * (Math.PI / 180),
                    this.flightStrikeMaxFragments
                );
                this.playFlightImpactSound(vd, strikeCenter, easedSpeedScale, isOtherCharacter);
            }
        }

        // Cull cylinder: silent trail clear with per-frame shape jitter.
        const center = Vec3.op_Addition(origin, Vec3.op_Multiply(flightDir, this.flightCullForwardOffset));
        const colliders = CS.Px5.Unity.PxPhysics.OverlapSphere(center, radius, this.flightCullLayerMask);
        if (!colliders || colliders.Length === 0) return;

        this.seenDestructorIds.clear();

        const wobbleVec = CS.UnityEngine.Random.insideUnitSphere;
        const wobbleAlongFwd = Vec3.Dot(wobbleVec, flightDir);
        const lateralWobble = Vec3.op_Subtraction(wobbleVec, Vec3.op_Multiply(flightDir, wobbleAlongFwd));
        const wobbleStrength = radius * 0.4;
        const end1 = origin;
        const end2Base = Vec3.op_Addition(center, Vec3.op_Multiply(flightDir, radius));
        const end2 = Vec3.op_Addition(end2Base, Vec3.op_Multiply(lateralWobble, wobbleStrength));
        const radiusJittered = radius * (0.85 + CS.UnityEngine.Random.value * 0.3);

        for (let i = 0; i < colliders.Length; i++) {
            const col = colliders.get_Item(i) as CS.Px5.Unity.PxCollider;
            if (!col) continue;

            const vd = col.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (!vd || !ModAPI.IsVoxelDestructible(vd)) continue;
            if (vd.transform.IsChildOf(characterTransform)) continue;

            const id = vd.GetInstanceID();
            if (this.seenDestructorIds.has(id)) continue;
            this.seenDestructorIds.add(id);

            ModAPI.ClearVoxelCylinder(vd, end1, end2, radiusJittered);
        }
    }

    private onStart(): void {
        CS.UnityEngine.Debug.Log(
            `[OmniMan DEBUG 2026-05-06] onStart: hasCharacter=${this.character !== null}, flightCullSpeedThreshold=${this.flightCullSpeedThreshold}, explosionOffsetMin=${this.explosionOffsetMin}`
        );
        this.soundMgr = this.resolveSoundManager();
        if (!this.character) return;

        for (const name of STRIKE_BODY_NAMES) {
            const rb = ModAPI.GetCharacterBody(this.character, name);
            if (!rb) continue;

            const penetrable = rb as unknown as { hasContactModify: boolean; easyKinematicPenetration: boolean };
            penetrable.hasContactModify = true;
            penetrable.easyKinematicPenetration = true;

            const actor = rb as unknown as CollisionRegistrableActor;
            actor.enableCollisionEvent = true;

            const entry = { name, rb, handler: null as unknown as CollisionCallback, nextAllowedTime: 0 };
            entry.handler = (collision) => this.onLimbCollision(entry, collision);
            actor.RegisterOnCollisionEnter(entry.handler);
            this.limbBodies.push(entry);
        }
    }

    private onDestroy(): void {
        for (const entry of this.limbBodies) {
            (entry.rb as unknown as CollisionRegistrableActor).UnregisterOnCollisionEnter(entry.handler);
        }
        this.limbBodies.length = 0;
    }

    private onLimbCollision(entry: { name: string; rb: CS.Px5.Unity.PxRigidBody; nextAllowedTime: number }, collision: CS.Px5.UnityExtensions.Collision): void {
        const limbName = entry.name;
        const limbRb = entry.rb;
        if (!collision || !collision.collider) return;

        const speed = collision.relativeVelocity.magnitude;
        const now = CS.UnityEngine.Time.time;

        if (now < entry.nextAllowedTime) return;

        const minThreshold = Math.min(this.demolishWallThreshold, this.velocityThreshold);
        if (speed < minThreshold) return;

        const direction = this.getStrikeDirection(limbRb, collision);
        const center = Vec3.op_Addition(
            limbRb.transform.position,
            Vec3.op_Multiply(direction, this.getExplosionOffset(speed))
        );

        const victim = collision.collider.GetComponentInParent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        const isOtherCharacter = victim && victim !== this.character;

        const directHit = collision.collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
        const demolishThreshold = isOtherCharacter ? this.velocityThreshold : this.demolishWallThreshold;

        let effectiveDemolishRadius: number;
        if (isOtherCharacter) {
            const t = Math.min(1, speed / (this.velocityThreshold * this.speedScaleMax));
            const easing = t * t * (3 - 2 * t);
            effectiveDemolishRadius = this.demolishRadius * easing;
        } else {
            effectiveDemolishRadius = this.demolishRadius * 2;
        }
        if (directHit && ModAPI.IsVoxelDestructible(directHit) && speed >= demolishThreshold) {
            ModAPI.DemolishVoxelSphere(
                directHit,
                center,
                effectiveDemolishRadius,
                this.demolishForce,
                direction,
                this.spreadAngle,
                this.maxFragments
            );
        }

        const canLaunch = LAUNCH_LIMBS.has(limbName) && speed >= this.velocityThreshold;
        if (isOtherCharacter && canLaunch) {
            if (speed >= this.knockoutThreshold) {
                this.tryKnockout(victim);
            }
            this.launchVictim(victim, direction, speed);
        }

        entry.nextAllowedTime = now + this.cooldownSeconds;
    }

    private launchVictim(victim: VX.Entity.EntityCharacter, strikeDirection: CS.UnityEngine.Vector3, speed: number): void {
        const Impulse = CS.UnityEngine.ForceMode.Impulse;

        const flat = new CS.UnityEngine.Vector3(strikeDirection.x, 0, strikeDirection.z);
        const flatN = flat.sqrMagnitude > 1e-6 ? flat.normalized : Vec3.forward;
        const launchDir = Vec3.op_Addition(flatN, Vec3.op_Multiply(Vec3.up, this.victimUpBias)).normalized;

        const rawScale = Math.min(this.speedScaleMax, speed / this.velocityThreshold);
        const t = rawScale / this.speedScaleMax;
        const easing = t * t * (3 - 2 * t);
        const speedScale = easing * this.speedScaleMax;

        const victimGo = (victim as unknown as { gameObject: CS.UnityEngine.GameObject }).gameObject;
        const rbList = victimGo.GetComponentsInChildren(PxRigidBodyType, true);
        if (!rbList || rbList.Length === 0) return;

        for (let i = 0; i < rbList.Length; i++) {
            const rb = rbList.get_Item(i) as CS.Px5.Unity.PxRigidBody;
            if (!rb) continue;

            if (rb.isKinematic) rb.isKinematic = false;

            const randomFactor = 0.85 + Math.random() * 0.3;
            const force = Vec3.op_Multiply(launchDir, this.victimImpulsePerBone * speedScale * randomFactor);
            rb.AddForce(force, Impulse);
            rb.AddTorque(
                Vec3.op_Multiply(CS.UnityEngine.Random.insideUnitSphere, this.torqueImpulse * speedScale * randomFactor),
                Impulse
            );
        }
    }

    private getExplosionOffset(speed: number): number {
        const t = Math.min(1, Math.max(0, speed / (this.velocityThreshold * this.speedScaleMax)));
        const eased = t * t * (3 - 2 * t);
        return this.explosionOffsetMin + (this.explosionOffsetMax - this.explosionOffsetMin) * eased;
    }

    private playFlightImpactSound(vd: VX.Destruction.VoxelDestructor, hitPoint: CS.UnityEngine.Vector3, intensity01: number, characterHit: boolean): void {
        const now = CS.UnityEngine.Time.time;
        if (now < this.nextFlightImpactSoundTime) return;
        this.nextFlightImpactSoundTime = now + this.randomRange(this.flightImpactSoundIntervalMin, this.flightImpactSoundIntervalMax);

        const volume = this.flightImpactSoundVolumeMin + (this.flightImpactSoundVolumeMax - this.flightImpactSoundVolumeMin) * Math.min(1, Math.max(0, intensity01));
        if (characterHit) {
            this.playCharacterImpactSound(hitPoint, volume);
            return;
        }

        const materialId = this.sampleVoxelMaterialId(vd, hitPoint);
        this.playMaterialBreakSound(materialId, hitPoint, volume);
    }

    private playCharacterImpactSound(hitPoint: CS.UnityEngine.Vector3, volume: number): void {
        if (!this.soundMgr) return;

        const soundEffectType = (CS.VoxelPlayground.Engine as any).SoundEffectType;
        const impactType = soundEffectType ? soundEffectType.Impact : 2;
        this.soundMgr.PlaySound(VX.Engine.PointDataV2.ID_SKIN, impactType, hitPoint, volume);
    }

    private playMaterialBreakSound(materialId: number, hitPoint: CS.UnityEngine.Vector3, volume: number): void {
        if (!this.soundMgr) return;

        const soundEffectType = (CS.VoxelPlayground.Engine as any).SoundEffectType;
        const breakType = soundEffectType ? soundEffectType.Break : 10;
        const impactLargeType = soundEffectType ? soundEffectType.ImpactLarge : 9;
        const impactType = soundEffectType ? soundEffectType.Impact : 2;

        // Vary the material destruction sound shape so long fly-throughs do not repeat
        // the exact same break/impact pair every time.
        const roll = Math.random();
        if (roll < 0.45) {
            this.soundMgr.PlaySound(materialId, breakType, hitPoint, volume, null, impactLargeType);
        } else if (roll < 0.75) {
            this.soundMgr.PlaySound(materialId, impactLargeType, hitPoint, volume * 0.75, null, impactType);
        } else {
            this.soundMgr.PlaySound(materialId, breakType, hitPoint, volume * 0.85, null, impactLargeType);
            this.soundMgr.PlaySound(materialId, impactLargeType, hitPoint, volume * 0.35, null, impactType);
        }

        this.tryPlayFlightMetalSweetener(hitPoint, volume);
    }

    private sampleVoxelMaterialId(vd: VX.Destruction.VoxelDestructor, worldPos: CS.UnityEngine.Vector3): number {
        const volume = vd.GetComponent(puerts.$typeof(VX.Engine.VoxelVolume)) as VX.Engine.VoxelVolume | null;
        if (volume) {
            const voxel = ModAPI.GetVoxelAtWorld(volume, worldPos);
            if (voxel.IsSolid() && voxel.ID !== 0) {
                return voxel.ID;
            }
        }
        return VX.Engine.PointDataV2.ID_STONE;
    }

    private randomRange(min: number, max: number): number {
        return min + (max - min) * Math.random();
    }

    private tryPlayFlightMetalSweetener(hitPoint: CS.UnityEngine.Vector3, baseVolume: number): void {
        const now = CS.UnityEngine.Time.time;
        if (now < this.nextFlightMetalSweetenerTime) return;
        if (Math.random() > this.flightMetalSweetenerChance) return;

        this.nextFlightMetalSweetenerTime = now + this.randomRange(
            this.flightMetalSweetenerIntervalMin,
            this.flightMetalSweetenerIntervalMax
        );

        if (!this.soundMgr) return;
        const soundEffectType = (CS.VoxelPlayground.Engine as any).SoundEffectType;
        const impactLargeType = soundEffectType ? soundEffectType.ImpactLarge : 9;
        const impactType = soundEffectType ? soundEffectType.Impact : 2;
        const sweetenerMaterialId = Math.random() < 0.55 ? VX.Engine.PointDataV2.ID_METAL : this.woodMaterialId;
        const volume = baseVolume * this.randomRange(0.35, 0.7);

        this.soundMgr.PlaySound(sweetenerMaterialId, impactLargeType, hitPoint, volume, null, impactType, "OmniManImpactSweetener");
    }

    private resolveSoundManager(): any {
        const smCtor = (CS.VoxelPlayground.Sound as any).SoundManager;
        const inst = smCtor ? smCtor.Instance : null;
        if (!inst) {
            CS.UnityEngine.Debug.LogWarning("[OmniMan] SoundManager.Instance not available; flight impact sounds disabled");
        }
        return inst;
    }

    private logFlightCullDebug(now: number, message: string): void {
        if (now < this.nextFlightCullDebugLogTime) return;
        this.nextFlightCullDebugLogTime = now + 1.0;
        CS.UnityEngine.Debug.Log(`[OmniMan DEBUG 2026-05-06] flightCull ${message}`);
    }

    private getStrikeDirection(limbRb: CS.Px5.Unity.PxRigidBody, collision: CS.Px5.UnityExtensions.Collision): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        const camDir = cam && cam.transform ? cam.transform.forward : limbRb.transform.forward;

        // Px5's relativeVelocity points other -> self; negate to get the punch direction.
        const relVel = collision.relativeVelocity;
        if (relVel.sqrMagnitude < 1e-4) return camDir;
        const punchDir = Vec3.op_Multiply(relVel.normalized, -1);

        const w = this.punchDirectionWeight;
        const blended = Vec3.op_Addition(
            Vec3.op_Multiply(punchDir, w),
            Vec3.op_Multiply(camDir, 1 - w)
        );
        if (blended.sqrMagnitude < 1e-6) return camDir;
        return blended.normalized;
    }

    private tryKnockout(victim: VX.Entity.EntityCharacter): void {
        const ko = victim as unknown as KnockoutableCharacter;
        if (typeof ko.IsKnockedOut === "function" && ko.IsKnockedOut()) return;
        ko.KnockOut();
    }
}
