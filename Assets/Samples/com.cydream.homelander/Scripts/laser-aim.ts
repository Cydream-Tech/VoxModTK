/**
 * Laser aimer component using JsComponentProxy.
 * Aims a laser beam at the player-controlled character with smooth tracking.
 */
export class LaserAim {
    private bindTo: VX.Mod.JsComponentProxy;
    private laserGun: VX.Entity.Entity | null = null;
    private laserGunObject: CS.UnityEngine.GameObject | null = null;
    private laserGunView: any = null;
    private readonly modAPI = VX.Mod.ModAPI;

    // Configurable settings
    private rayAngleLimit: number = 80;
    private minAimDistance: number = 135;
    private laserScaleRange: CS.UnityEngine.Vector2 = new CS.UnityEngine.Vector2(4, 10);
    private aimTargetOffset: CS.UnityEngine.Vector3 = CS.UnityEngine.Vector3.zero;
    private aimSmoothness: number = 0.16;
    private aimRandomRange: number = 6;
    private offsetLaserGun: number = 0.5;

    private currAimPos: CS.UnityEngine.Vector3 = CS.UnityEngine.Vector3.zero;
    private resetAimAnim: boolean = true;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("LaserAim constructor");
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
    }

    private onStart(): void {

        // Spawn laser gun entity
        const pos = this.bindTo.transform.position;
        const rot = this.bindTo.transform.rotation;
        const gunObj = this.modAPI.SpawnItem("Items/Guns/Laser", pos, rot);
        if (!gunObj) {
            return;
        }
        this.laserGunObject = gunObj;
        this.laserGun = gunObj.GetComponent(puerts.$typeof(VX.Entity.Entity)) as VX.Entity.Entity;
        this.laserGunView = this.laserGun as any;
        this.modAPI.SetEntityPinned(this.laserGun, true);

        const voxelDestructor = gunObj.GetComponent(puerts.$typeof(VX.Destruction.VoxelDestructor)) as VX.Destruction.VoxelDestructor;
        if (voxelDestructor) voxelDestructor.enabled = false;

        // Hide gun body
        const volume = gunObj.GetComponentInChildren(puerts.$typeof(VX.Engine.VoxelVolume), true) as VX.Engine.VoxelVolume;
        if (volume) volume.gameObject.SetActive(false);

        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
    }

    private onUpdate(deltaTime: number): void {
        // Find aim target from player-controlled entity
        let aimTarget: CS.UnityEngine.Transform | null = null;

        // TODO: get current player or car, as we do not have HandControlSM anymore
        const ModAPI = VX.Mod.ModAPI;
        const vehicle = ModAPI.ControlledVehicle;
        if (vehicle) {
            aimTarget = ModAPI.GetVehicleTransform(vehicle);
        }
        if (!aimTarget) {
            const controlledChar = ModAPI.ControlledCharacter;
            if (controlledChar) {
                const mainRigidbody = ModAPI.GetEntityMainRigidbody(controlledChar);
                aimTarget = mainRigidbody ? mainRigidbody.transform : null;
            }
        }

        // Check angle and height limits
        if (aimTarget) {
            const toAimDir = CS.UnityEngine.Vector3.op_Subtraction(aimTarget.position, this.bindTo.transform.position);
            const fw = new CS.UnityEngine.Vector3(0, 0, -1);
            if (aimTarget.position.y < -10 || CS.UnityEngine.Vector3.Angle(fw, toAimDir.normalized) > this.rayAngleLimit) {
                aimTarget = null as unknown as CS.UnityEngine.Transform;
            }
        }

        if (aimTarget) {
            this.aim(aimTarget);
        } else {
            this.resetAim();
        }
    }

    private aim(aimTarget: CS.UnityEngine.Transform): void {
        const targetPos = aimTarget.position;
        const randomSphere = CS.UnityEngine.Random.insideUnitSphere;
        const randomOffset = CS.UnityEngine.Vector3.op_Multiply(randomSphere, this.aimRandomRange);
        const aimPos = CS.UnityEngine.Vector3.op_Addition(
            CS.UnityEngine.Vector3.op_Addition(targetPos, this.aimTargetOffset),
            randomOffset
        );

        if (this.resetAimAnim) {
            this.resetAimAnim = false;
            this.currAimPos = aimPos;
        } else {
            const t = CS.UnityEngine.Time.deltaTime / this.aimSmoothness;
            this.currAimPos = CS.UnityEngine.Vector3.Lerp(this.currAimPos, aimPos, t);
        }

        const diff = CS.UnityEngine.Vector3.op_Subtraction(this.currAimPos, this.bindTo.transform.position);
        const dist = diff.magnitude;
        this.bindTo.transform.rotation = CS.UnityEngine.Quaternion.LookRotation(diff.normalized, CS.UnityEngine.Vector3.up);

        if (dist > this.minAimDistance) {
            this.resetAim();
            return;
        }

        if (this.laserGun && this.laserGunObject) {
            this.modAPI.SetEntityActivated(this.laserGun, true);
            this.laserGunView.laserMaxDistance = dist;
            const t2 = CS.UnityEngine.Mathf.InverseLerp(this.minAimDistance, 20, dist);
            const scale = CS.UnityEngine.Mathf.Lerp(this.laserScaleRange.x, this.laserScaleRange.y, t2);
            this.laserGunObject.transform.localScale = CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.one, scale);
            this.laserGunObject.transform.rotation = this.bindTo.transform.rotation;
            const fwdUp = CS.UnityEngine.Vector3.op_Addition(this.bindTo.transform.forward, this.bindTo.transform.up);
            this.laserGunObject.transform.position = CS.UnityEngine.Vector3.op_Subtraction(
                this.bindTo.transform.position,
                CS.UnityEngine.Vector3.op_Multiply(fwdUp, this.offsetLaserGun)
            );
        }
    }

    private resetAim(): void {
        if (this.laserGun) {
            this.modAPI.SetEntityActivated(this.laserGun, false);
        }

        this.resetAimAnim = true;
    }
}
