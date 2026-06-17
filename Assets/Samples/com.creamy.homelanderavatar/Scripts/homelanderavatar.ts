/**
 * HomelanderAvatar — pressing the right controller trigger fires two parallel
 * red laser beams from the avatar's eyes. Each frame while held:
 *   1. Aim follows the main camera's forward (head rb pitch is joint-clamped,
 *      so we cannot use head transform — it stops tracking at extreme angles).
 *   2. PxPhysics.RaycastAll once from the eye-midpoint forward.
 *   3. The LaserEffects prefab from JsProperties is placed in world-space using
 *      camera basis vectors and truncated to the hit distance (or full length on miss).
 *   4. Carve voxels once along the central ray (CylinderClear + DemolishSphere).
 *   5. Continuous "Weapon_Energy_Beam" persistent sound, started/stopped on
 *      trigger edges (mirrors EntityLaserItem.Activate/Deactivate).
 */

const ModAPI = VX.Mod.ModAPI;
const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const VoxelDestructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
const PxRigidBodyType = puerts.$typeof(CS.Px5.Unity.PxRigidBody);
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const LineRendererType = puerts.$typeof(CS.UnityEngine.LineRenderer);
const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const GameObject = CS.UnityEngine.GameObject;
const UnityObject = CS.UnityEngine.Object;
const PxPhysics = CS.Px5.Unity.PxPhysics;

const SOUND_BEAM = "Weapon_Energy_Beam";
const SOUND_CHARGE = "Weapon_Energy_Charge";

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

interface LaserVisual {
    go: CS.UnityEngine.GameObject;
    t: CS.UnityEngine.Transform;
    sideSign: number; // -1 left, +1 right
    lineRenderers: CS.UnityEngine.LineRenderer[];
    flame: CS.UnityEngine.Transform | null;
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

export class HomelanderAvatar {
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null = null;
    private headRb: CS.Px5.Unity.PxRigidBody | null = null;

    private input: VX.Mod.ModAPI.Input | null = null;
    private lasers: LaserVisual[] = [];
    private laserEffectsTemplate: CS.UnityEngine.Transform | null = null;
    private laserActive: boolean = false;
    private loggedLaserActive: boolean = false;

    private readonly triggerThreshold: number = 0.5;
    private readonly laserMaxLength: number = 30;
    private readonly laserThickness: number = 0.04;
    // Eye anchor offsets in CAMERA basis (right/up/forward), since head rb
    // can't always pitch with the camera.
    private readonly eyeForwardOffset: number = -0.40;
    private readonly eyeUpOffset: number = -0.065;
    private readonly eyeSideOffset: number = 0.065;

    // Voxel-burn parameters.
    private readonly carveRadius: number = 0.18;
    private readonly fragmentForce: number = 25;
    private readonly fragmentSpread: number = Math.PI;
    private readonly fragmentMax: number = 4;
    private readonly fragmentRadius: number = 0.25;
    private burnLayerMask: number = 0;

    // Hit VFX — same key the C# lightsaber uses on contact.
    private readonly hitVFXKey: string = "Sparks";
    private readonly hitVFXIntervalSec: number = 0.05;
    private readonly hitVFXBurstCount: number = 3;
    private readonly hitVFXJitterRadius: number = 0.06;
    private nextHitVFXTime: number = 0;

    // Continuous laser beam sound (mirrors EntityLaserItem.Activate/Deactivate).
    // Resolved against SoundManager singleton at runtime — string-keyed.
    private soundMgr: any = null;
    private soundOwner: CS.UnityEngine.Transform | null = null;
    private soundPlaying: boolean = false;

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

    private readonly flightCullRadiusMax: number = 1.0;
    private readonly flightCullForwardOffset: number = 0.5;
    private readonly flightCullSpeedThreshold: number = 4.0;
    private readonly flightCullSpeedForFull: number = 8.0;
    private readonly flightVerticalSpeedBoost: number = 1.8;
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
    private hasLastChestPosition: boolean = false;
    private lastChestPosition: CS.UnityEngine.Vector3 = Vec3.zero;

    private readonly limbBodies: Array<{ name: string; rb: CS.Px5.Unity.PxRigidBody; handler: CollisionCallback; nextAllowedTime: number }> = [];

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        if (!this.character) {
            CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] no EntityCharacter on bound proxy");
            return;
        }

        this.setupImpactBodies();

        this.headRb = ModAPI.GetCharacterBody(this.character, "Head");
        if (!this.headRb) {
            CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] head rigidbody not found");
        } else {
            this.input = new ModAPI.Input();
            this.soundOwner = this.headRb.transform;
            this.readProperties();

            if (this.laserEffectsTemplate) {
                // Laser_effects instances live in scene root and are placed via
                // SetPositionAndRotation each frame so aim follows the camera.
                this.lasers.push(this.createLaserEffect(-1, this.laserEffectsTemplate));
                this.lasers.push(this.createLaserEffect(+1, this.laserEffectsTemplate));
                CS.UnityEngine.Debug.Log(
                    "[HomelanderAvatar] LaserEffects setup: template=" + this.getTransformPath(this.laserEffectsTemplate) +
                    ", left=" + this.describeLaser(this.lasers[0]) +
                    ", right=" + this.describeLaser(this.lasers[1])
                );
            } else {
                CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] JsProperties LaserEffects missing; eye lasers will not have visuals");
            }
        }

        this.soundMgr = this.resolveSoundManager();

        // Mirrors LayerMasksHelper.bulletHitLayerMask used in C# weapons.
        const LayerMask = CS.UnityEngine.LayerMask;
        const layerNames = ["Ragdoll", "Ragdoll_VRCam_Hide", "Item", "Item_Projectile_Ignore", "Building"];
        let mask = 0;
        for (const n of layerNames) {
            const idx = LayerMask.NameToLayer(n);
            if (idx >= 0) mask |= (1 << idx);
        }
        this.burnLayerMask = mask;
        this.flightCullLayerMask = mask;
    }

    private onUpdate(deltaTime: number): void {
        this.updateFlightDestruction(deltaTime);

        if (!this.input || !this.headRb || this.lasers.length === 0) return;

        const trigger = this.input.GetFireRInput();
        const shouldFire = trigger >= this.triggerThreshold;

        if (shouldFire !== this.laserActive) {
            for (const l of this.lasers) l.go.SetActive(shouldFire);
            this.laserActive = shouldFire;
            this.setLaserSound(shouldFire);
        }

        if (!shouldFire) return;

        this.fireLaser();
    }

    private onDestroy(): void {
        this.setLaserSound(false);
        this.teardownImpactBodies();
        for (const l of this.lasers) {
            if (l.go) UnityObject.Destroy(l.go);
        }
        this.lasers.length = 0;
        if (this.input) {
            this.input.Dispose();
            this.input = null;
        }
    }

    /**
     * String-keyed persistent beam sound. Mirrors EntityLaserItem:
     *   PlayPersistentSound("Weapon_Energy_Beam", trans, trans.position) / Stop
     * SoundManager isn't fully in TS typings, so we go through `as any`.
     */
    private setLaserSound(on: boolean): void {
        if (!this.soundMgr || !this.soundOwner) return;
        const owner = this.soundOwner;
        if (on && !this.soundPlaying) {
            // One-shot charge sting plus the persistent beam loop.
            ModAPI.PlaySoundAt(SOUND_CHARGE, owner.position);
            this.soundMgr.PlayPersistentSound(SOUND_BEAM, owner, owner.position);
            this.soundPlaying = true;
        } else if (!on && this.soundPlaying) {
            this.soundMgr.StopPersistentSound(SOUND_BEAM, owner);
            this.soundPlaying = false;
        }
    }

    private resolveSoundManager(): any {
        const smCtor = (CS.VoxelPlayground.Sound as any).SoundManager;
        const inst = smCtor ? smCtor.Instance : null;
        if (!inst) {
            CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] SoundManager.Instance not available");
        }
        return inst;
    }

    private fireLaser(): void {
        const cam = ModAPI.GetMainCamera();
        const camT = cam ? cam.transform : null;
        // Fall back to head transform only as last resort — has the joint-clamp bug.
        const fwd = camT ? camT.forward : this.headRb!.transform.forward;
        const up = camT ? camT.up : this.headRb!.transform.up;
        const right = camT ? camT.right : this.headRb!.transform.right;
        const camOrigin = camT ? camT.position : this.headRb!.transform.position;

        // Eye-midpoint anchor in camera basis (origin for raycast and visual base).
        const eyeMid = Vec3.op_Addition(
            Vec3.op_Addition(
                Vec3.op_Addition(camOrigin, Vec3.op_Multiply(fwd, this.eyeForwardOffset)),
                Vec3.op_Multiply(up, this.eyeUpOffset)
            ),
            Vec3.zero
        );

        const hits = PxPhysics.RaycastAll(eyeMid, fwd, this.laserMaxLength, this.burnLayerMask);

        let length = this.laserMaxLength;
        let hitVd: VX.Destruction.VoxelDestructor | null = null;
        let hitPoint: CS.UnityEngine.Vector3 = Vec3.op_Addition(eyeMid, Vec3.op_Multiply(fwd, this.laserMaxLength));

        if (hits && hits.Length > 0) {
            const charT = this.character ? this.character.transform : null;
            let bestDist = Number.POSITIVE_INFINITY;
            for (let i = 0; i < hits.Length; i++) {
                const h = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
                if (!h) continue;
                if (h.distance >= bestDist) continue;
                if (charT && h.transform && h.transform.IsChildOf(charT)) continue;

                bestDist = h.distance;
                hitPoint = h.point;
                length = h.distance;
                const collider = h.collider as CS.Px5.Unity.PxCollider | null;
                hitVd = collider ? (collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null) : null;
            }
        }

        // Place the Laser_effects roots in world space along camera basis.
        // Each root sits at an eye lane; Line/Line_glow are stretched
        // along local +Z, and flame is moved to the hit endpoint.
        const lookRot = Quat.LookRotation(fwd, up);
        for (const l of this.lasers) {
            const lane = Vec3.op_Addition(eyeMid, Vec3.op_Multiply(right, l.sideSign * this.eyeSideOffset));
            l.t.SetPositionAndRotation(lane, lookRot);
            this.setLaserVisualLength(l, length);
        }

        if (!this.loggedLaserActive) {
            this.loggedLaserActive = true;
            CS.UnityEngine.Debug.Log(
                "[HomelanderAvatar] Laser active: visualCount=" + this.lasers.length +
                ", length=" + length.toFixed(2) +
                ", hit=" + (length < this.laserMaxLength)
            );
        }

        if (hitVd && ModAPI.IsVoxelDestructible(hitVd)) {
            ModAPI.ClearVoxelCylinder(hitVd, eyeMid, hitPoint, this.carveRadius);
            ModAPI.DemolishVoxelSphere(
                hitVd,
                hitPoint,
                this.fragmentRadius,
                this.fragmentForce,
                fwd,
                this.fragmentSpread,
                this.fragmentMax
            );
        }

        // Throttled spark VFX at impact (sound is the continuous beam, not per-hit).
        // Burst a few sparks with tiny random offset so it doesn't look like a
        // single particle stack on the exact hit point.
        if (length < this.laserMaxLength) {
            const now = CS.UnityEngine.Time.time;
            if (now >= this.nextHitVFXTime) {
                for (let i = 0; i < this.hitVFXBurstCount; i++) {
                    const jitter = Vec3.op_Multiply(
                        CS.UnityEngine.Random.insideUnitSphere,
                        this.hitVFXJitterRadius
                    );
                    ModAPI.PlayVFX(this.hitVFXKey, Vec3.op_Addition(hitPoint, jitter));
                }
                this.nextHitVFXTime = now + this.hitVFXIntervalSec;
            }
        }
    }

    private setupImpactBodies(): void {
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

    private teardownImpactBodies(): void {
        for (const entry of this.limbBodies) {
            (entry.rb as unknown as CollisionRegistrableActor).UnregisterOnCollisionEnter(entry.handler);
        }
        this.limbBodies.length = 0;
    }

    private updateFlightDestruction(deltaTime: number): void {
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

        const strikeForwardOffset = this.flightStrikeForwardOffsetMin + (this.flightStrikeForwardOffset - this.flightStrikeForwardOffsetMin) * easedSpeedScale;
        const strikeRadius = this.flightStrikeRadiusMin + (this.flightStrikeRadius - this.flightStrikeRadiusMin) * easedSpeedScale;
        const origin = chestPosition;
        const strikeCenter = Vec3.op_Addition(origin, Vec3.op_Multiply(flightDir, strikeForwardOffset));
        const strikeColliders = PxPhysics.OverlapSphere(strikeCenter, strikeRadius, this.flightCullLayerMask);
        if (strikeColliders && strikeColliders.Length > 0) {
            const struckIds = new Set<number>();
            for (let i = 0; i < strikeColliders.Length; i++) {
                const c = strikeColliders.get_Item(i) as CS.Px5.Unity.PxCollider;
                if (!c) continue;
                const vd = c.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
                if (!vd || !ModAPI.IsVoxelDestructible(vd)) continue;
                if (vd.transform.IsChildOf(characterTransform)) continue;
                const hitCharacter = c.GetComponentInParent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
                if (hitCharacter !== null) continue;
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
                this.playFlightImpactSound(vd, strikeCenter, easedSpeedScale, false);
            }
        }

        const center = Vec3.op_Addition(origin, Vec3.op_Multiply(flightDir, this.flightCullForwardOffset));
        const colliders = PxPhysics.OverlapSphere(center, radius, this.flightCullLayerMask);
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
            const hitCharacter = col.GetComponentInParent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
            if (hitCharacter !== null) continue;

            const id = vd.GetInstanceID();
            if (this.seenDestructorIds.has(id)) continue;
            this.seenDestructorIds.add(id);

            ModAPI.ClearVoxelCylinder(vd, end1, end2, radiusJittered);
        }
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

        this.soundMgr.PlaySound(sweetenerMaterialId, impactLargeType, hitPoint, volume, null, impactType, "HomelanderAvatarImpactSweetener");
    }

    private logFlightCullDebug(now: number, message: string): void {
        if (now < this.nextFlightCullDebugLogTime) return;
        this.nextFlightCullDebugLogTime = now + 1.0;
        CS.UnityEngine.Debug.Log(`[HomelanderAvatar] flightCull ${message}`);
    }

    private getStrikeDirection(limbRb: CS.Px5.Unity.PxRigidBody, collision: CS.Px5.UnityExtensions.Collision): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        const camDir = cam && cam.transform ? cam.transform.forward : limbRb.transform.forward;

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

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (!props) {
            return;
        }

        const pairs = props.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            const value = pair.value as any;
            if (pair.key === "LaserEffects" && value != null && value.transform != null) {
                this.laserEffectsTemplate = value.transform as CS.UnityEngine.Transform;
            }
        }
    }

    private createLaserEffect(sideSign: number, template: CS.UnityEngine.Transform): LaserVisual {
        const go = sideSign < 0
            ? template.gameObject
            : UnityObject.Instantiate(template.gameObject) as CS.UnityEngine.GameObject;
        go.name = `EyeLaser_${sideSign < 0 ? "L" : "R"}_Laser_effects`;

        const t = go.transform;
        t.SetParent(null as never as CS.UnityEngine.Transform);
        t.localScale = Vec3.one;

        const lineRenderers: CS.UnityEngine.LineRenderer[] = [];
        const renderers = go.GetComponentsInChildren(LineRendererType, true);
        for (let i = 0; i < renderers.Length; i++) {
            const lr = renderers.get_Item(i) as CS.UnityEngine.LineRenderer;
            if (lr) {
                lr.useWorldSpace = false;
                lr.positionCount = 2;
                lineRenderers.push(lr);
            }
        }

        const flame = t.Find("flame");
        go.SetActive(false);
        return { go, t, sideSign, lineRenderers, flame };
    }

    private setLaserVisualLength(laser: LaserVisual, length: number): void {
        for (const lr of laser.lineRenderers) {
            lr.enabled = true;
            lr.SetPosition(0, Vec3.zero);
            lr.SetPosition(1, new Vec3(0, 0, length / this.getSafeLossyScaleX(lr.transform)));
        }

        if (laser.flame) {
            laser.flame.gameObject.SetActive(length < this.laserMaxLength);
            laser.flame.localPosition = new Vec3(laser.flame.localPosition.x, laser.flame.localPosition.y, length);
        }
    }

    private getSafeLossyScaleX(transform: CS.UnityEngine.Transform): number {
        const x = transform.lossyScale.x;
        return x > 0.0001 ? x : 1;
    }

    private describeLaser(laser: LaserVisual | undefined): string {
        if (!laser) {
            return "null";
        }
        return this.getTransformPath(laser.t) + " lineRenderers=" + laser.lineRenderers.length + " flame=" + this.getTransformPath(laser.flame);
    }

    private getTransformPath(transform: CS.UnityEngine.Transform | null): string {
        if (!transform) {
            return "null";
        }

        let path = transform.name;
        let parent = transform.parent;
        while (parent != null) {
            path = parent.name + "/" + path;
            parent = parent.parent;
        }
        return path;
    }
}
