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
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const LineRendererType = puerts.$typeof(CS.UnityEngine.LineRenderer);
const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const GameObject = CS.UnityEngine.GameObject;
const UnityObject = CS.UnityEngine.Object;
const PxPhysics = CS.Px5.Unity.PxPhysics;

const SOUND_BEAM = "Weapon_Energy_Beam";
const SOUND_CHARGE = "Weapon_Energy_Charge";

interface LaserVisual {
    go: CS.UnityEngine.GameObject;
    t: CS.UnityEngine.Transform;
    sideSign: number; // -1 left, +1 right
    lineRenderers: CS.UnityEngine.LineRenderer[];
    flame: CS.UnityEngine.Transform | null;
}

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
    private readonly eyeForwardOffset: number = -0.25;
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

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (_dt) => this.onUpdate();
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        if (!this.character) {
            CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] no EntityCharacter on bound proxy");
            return;
        }

        this.headRb = ModAPI.GetCharacterBody(this.character, "Head");
        if (!this.headRb) {
            CS.UnityEngine.Debug.LogWarning("[HomelanderAvatar] head rigidbody not found");
            return;
        }

        this.input = new ModAPI.Input();
        this.soundMgr = this.resolveSoundManager();
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

        // Mirrors LayerMasksHelper.bulletHitLayerMask used in C# weapons.
        const LayerMask = CS.UnityEngine.LayerMask;
        const layerNames = ["Ragdoll", "Ragdoll_VRCam_Hide", "Item", "Item_Projectile_Ignore", "Building"];
        let mask = 0;
        for (const n of layerNames) {
            const idx = LayerMask.NameToLayer(n);
            if (idx >= 0) mask |= (1 << idx);
        }
        this.burnLayerMask = mask;
    }

    private onUpdate(): void {
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
