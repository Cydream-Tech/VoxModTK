/**
 * Gipsy Mech Controller implementation using JsComponentProxy.
 * Converted from MechController.cs - all inspector bindings use GetComponent/Find.
 */
const Vec3 = CS.UnityEngine.Vector3;
const Color = CS.UnityEngine.Color;
const Giz = VX.Utility.Giz;
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);

export class MechController {
    private bindTo: VX.Mod.JsComponentProxy;

    // Body reference
    private bodyT: CS.UnityEngine.Transform | null = null;
    private bodyRb: CS.Px5.Unity.PxRigidBody | null = null;

    // Hover state
    private hoverContact: number = 0;
    private hoverHit: CS.Px5.UnityExtensions.RaycastHit;

    // Floor collision tracking
    private isCollidedFloor: boolean = false;
    /** Public: MechMuscle increments/decrements on kinematic floor contact. */
    public collidedFloorMuscleCount: number = 0;

    // Getup timer
    private getupTimer: number = 0;

    // Swing state
    private swingSpeed: number = 2;
    private currLegSwingAngle: number = 0;

    private input: VX.Mod.ModAPI.Input;

    // Joint transforms (found via Find)
    private jointTransLegUpL: CS.UnityEngine.Transform | null = null;
    private jointTransLegUpR: CS.UnityEngine.Transform | null = null;
    private jointTransLegLowL: CS.UnityEngine.Transform | null = null;
    private jointTransLegLowR: CS.UnityEngine.Transform | null = null;
    private jointTransFootL: CS.UnityEngine.Transform | null = null;
    private jointTransFootR: CS.UnityEngine.Transform | null = null;

    // Joint components
    private jointLegUpL: CS.Px5.Unity.PxD6Joint | null = null;
    private jointLegUpR: CS.Px5.Unity.PxD6Joint | null = null;
    private jointLegLowL: CS.Px5.Unity.PxD6Joint | null = null;
    private jointLegLowR: CS.Px5.Unity.PxD6Joint | null = null;
    private jointFootL: CS.Px5.Unity.PxD6Joint | null = null;
    private jointFootR: CS.Px5.Unity.PxD6Joint | null = null;

    // All joints array
    private joints: CS.Px5.Unity.PxD6Joint[] | null = null;

    // Voxel colliders
    private voxelColliders: VX.Destruction.VoxelDestructor[] | null = null;

    // === Configurable Settings (from inspector) ===
    private hoverHeight: number = 32;
    private hoverHeightPadding: number = 6;
    private groundLayer: number = 1 << 16; // LayerMask, set appropriately

    private hoverStrength: number = 20;
    private uprightStrength: number = 40;
    private yawStrength: number = 3;
    private targetYaw: number = 0;
    private alwaysUpright: boolean = true;
    /** Public: MechMuscle may disable when voxel muscle is destroyed. */
    public enableFloating: boolean = true;

    private getupTime: number = 5;

    private turnSpeed: number = 0.3;
    private moveSpeed: number = 18;

    private swingSpeedMlp: number = 1.16;
    private legSwingAngleMax: number = 15;

    private muscleStrengthFreefall: number = 0;
    private muscleStrengthIdle: number = 1000;
    private muscleStrengthWalking: number = 4000;

    private enableMuscleCollisionGroundCheck: boolean = false;

    // Axes constant
    private static readonly AXES: CS.UnityEngine.Vector3[] = [
        CS.UnityEngine.Vector3.right,
        CS.UnityEngine.Vector3.up,
        CS.UnityEngine.Vector3.forward,
    ];

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Gipsy constructor");
        this.bindTo = bindTo;
        this.hoverHit = new CS.Px5.UnityExtensions.RaycastHit();

        // Initialize and find all components
        this.initializeComponents();

        this.readProperties();
        this.bindSeatVehicle();

        // Bind callbacks
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onEnable = () => this.onEnable();
        this.bindTo.onDisable = () => this.onDisable();
        this.bindTo.onDestroy = () => this.onDestroy();
        
        this.input = new VX.Mod.ModAPI.Input();

        CS.UnityEngine.Debug.Log("Gipsy initialized, " + this.bodyT + " " + this.jointLegUpR);
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }
    }

    private bindSeatVehicle(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        let vehicle = props?.Get("vehicle") as VX.Entity.IVehicle | null;
        let seat = props?.Get("seat") as any | null;

        if (vehicle == null) {
            vehicle = this.findVehicleProxy();
        }
        if (seat == null && vehicle != null) {
            seat = (vehicle as any).driverSeat;
        }
        if (seat != null && vehicle != null) {
            seat.vehicle = vehicle;
        } else {
            CS.UnityEngine.Debug.LogWarning("Gipsy Seat.vehicle binding skipped, vehicle=" + vehicle + " seat=" + seat);
        }
    }

    private findVehicleProxy(): VX.Entity.IVehicle | null {
        const gameObject = this.bindTo.gameObject;
        const componentCount = gameObject.GetComponentCount();

        for (let i = 0; i < componentCount; i++) {
            const component = gameObject.GetComponentAtIndex(i) as VX.Entity.IVehicle | null;
            if (component != null && VX.Mod.ModAPI.IsVehicleProxy(component)) {
                return component;
            }
        }

        return null;
    }

    private initializeComponents(): void {
        // Find body transform by name (normally assigned in inspector)
        this.bodyT = this.bindTo.transform.Find("Body");
        if (!this.bodyT) {
            // Fallback to self transform
            this.bodyT = this.bindTo.transform;
        }

        // Get Rigidbody from body
        if (this.bodyT) {
            this.bodyRb = this.bodyT.GetComponent(puerts.$typeof(CS.Px5.Unity.PxRigidBody)) as CS.Px5.Unity.PxRigidBody;
        }

        // Get all joints in children
        const jointType = puerts.$typeof(CS.Px5.Unity.PxD6Joint);
        const jointsList = this.bindTo.GetComponentsInChildren(jointType, true);
        this.joints = [];
        for (let i = 0; i < jointsList.Length; i++) {
            this.joints.push(jointsList.get_Item(i) as CS.Px5.Unity.PxD6Joint);
        }

        // Get all voxel destructors
        const destructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
        const destructorsList = this.bindTo.GetComponentsInChildren(destructorType, true);
        this.voxelColliders = [];
        for (let i = 0; i < destructorsList.Length; i++) {
            this.voxelColliders.push(destructorsList.get_Item(i) as VX.Destruction.VoxelDestructor);
        }

        // Find leg joint transforms by name
        this.jointTransLegUpL = this.findTransform("LegUpL");
        this.jointTransLegUpR = this.findTransform("LegUpR");
        this.jointTransLegLowL = this.findTransform("LegLowL");
        this.jointTransLegLowR = this.findTransform("LegLowR");
        this.jointTransFootL = this.findTransform("FootL");
        this.jointTransFootR = this.findTransform("FootR");

        CS.UnityEngine.Debug.Log("jointTransLegUpR " + this.jointTransLegUpR);

        // Get joint components from transforms
        if (this.jointTransLegUpL) {
            this.jointLegUpL = this.jointTransLegUpL.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }
        if (this.jointTransLegUpR) {
            this.jointLegUpR = this.jointTransLegUpR.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }
        if (this.jointTransLegLowL) {
            this.jointLegLowL = this.jointTransLegLowL.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }
        if (this.jointTransLegLowR) {
            this.jointLegLowR = this.jointTransLegLowR.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }
        if (this.jointTransFootL) {
            this.jointFootL = this.jointTransFootL.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }
        if (this.jointTransFootR) {
            this.jointFootR = this.jointTransFootR.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;
        }

        CS.UnityEngine.Debug.Log("Gipsy components initialized");
    }

    private findTransform(name: string): CS.UnityEngine.Transform | null {
        // First try direct child
        let t = this.bindTo.transform.Find(name);
        if (t) return t;

        // Try recursive find
        return this.findTransformRecursive(this.bindTo.transform, name);
    }

    private findTransformRecursive(parent: CS.UnityEngine.Transform, name: string): CS.UnityEngine.Transform | null {
        CS.UnityEngine.Debug.Log("findTransformRecursive " + parent + " count " + parent.childCount);
        for (let i = 0; i < parent.childCount; i++) {
            const child = parent.GetChild(i);
            if (child.name === name) {
                return child;
            }
            const found = this.findTransformRecursive(child, name);
            if (found) return found;
        }
        return null;
    }

    private onEnable(): void {
        CS.UnityEngine.Debug.Log("Gipsy onEnable");
        this.setJointsSlerpDriveSpring(this.muscleStrengthIdle);
    }

    private onDisable(): void {
        CS.UnityEngine.Debug.Log("Gipsy onDisable");
        this.setJointsSlerpDriveSpring(0);
    }

    private onDestroy(): void {
        this.input.Dispose();
    }

    private onUpdate(deltaTime: number): void {
        // Use fixed delta time for physics
        const fixedDt = CS.UnityEngine.Time.fixedDeltaTime;

        if (!this.isValidRigidBody(this.bodyRb)) return;

        // === Raycast Hover ===
        const worldCenter = this.bodyRb.worldCenterOfMass;
        let hitRef = puerts.$ref(this.hoverHit);
        const raySuccess = CS.Px5.Unity.PxPhysics.Raycast(
            worldCenter,
            CS.UnityEngine.Vector3.down,
            hitRef,
            90,
            this.groundLayer,
            CS.UnityEngine.QueryTriggerInteraction.Ignore
        );
        this.hoverHit = puerts.$unref(hitRef);
        if (raySuccess && Giz.show) {
            var hit = this.hoverHit;
            Giz.DrawLine(worldCenter, hit.point, Color.gray);
            Giz.DrawLabel(hit.point, `RayHit Dist ${this.hoverHit.distance.toFixed(1)} ${hit.collider.name}`);
        }

        if (raySuccess) {
            const distance = this.hoverHit.distance;
            // hoverContact: [0, 1]  0: HitDist >= HoverHeight+Padding; 1: HitDist <= HoverHeight
            let contact = this.inverseLerp(this.hoverHeight + this.hoverHeightPadding, this.hoverHeight, distance);
            contact = this.clamp01(contact);
            // Slope reduces contact
            if (this.hoverHit.normal.y < 0) {
                contact = 0;
            } else if (this.hoverHit.normal.y > 0) {
                contact *= this.hoverHit.normal.y;
            }
            this.hoverContact = contact;
        } else {
            this.hoverContact = 0;
            this.hoverHit.distance = 999;
        }

        // Floor collision check
        this.isCollidedFloor = this.collidedFloorMuscleCount > 0;
        if (!this.isCollidedFloor && this.enableMuscleCollisionGroundCheck) {
            this.hoverContact = 0;
        }

        // Getup timer
        this.getupTimer += fixedDt * (this.hoverContact > 0 ? 1 : -1);
        this.getupTimer = this.clamp(this.getupTimer, 0, this.getupTime);
        this.hoverContact *= this.getupTimer / this.getupTime;

        if (!this.voxelColliders) return;
        // Fortify voxel colliders based on contact
        for (const vc of this.voxelColliders) {
            if (vc) {
                VX.Mod.ModAPI.SetVoxelFortified(vc, this.hoverContact > 0);
            }
        }

        // === Floating (Linear Velocity) ===
        if (this.hoverContact > 0 && this.enableFloating) {
            let d = this.hoverHeight - this.hoverHit.distance;
            d = this.clamp(d, -0.2, 0.2);
            let v = d * this.hoverStrength;
            v *= this.hoverContact;

            this.bodyRb.AddForce(
                CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, v),
                CS.UnityEngine.ForceMode.VelocityChange
            );
        }

        // === Upright (Angular Velocity) ===
        if (this.hoverContact > 0 || this.alwaysUpright) {
            const currentUp = this.bodyRb.transform.up;
            const torqueAxis = CS.UnityEngine.Vector3.Cross(currentUp, CS.UnityEngine.Vector3.up);

            for (let i = 0; i < 3; i++) {
                const axis = MechController.AXES[i];
                const d = CS.UnityEngine.Vector3.Dot(torqueAxis, axis);
                let v = d * this.uprightStrength;
                if (!this.alwaysUpright) {
                    v *= this.hoverContact;
                }

                this.bodyRb.AddTorque(
                    CS.UnityEngine.Vector3.op_Multiply(axis, v),
                    CS.UnityEngine.ForceMode.VelocityChange
                );
            }

            // Yaw correction
            const currentYaw = this.bodyRb.rotation.eulerAngles.y;
            const yawDelta = CS.UnityEngine.Mathf.DeltaAngle(currentYaw, this.targetYaw);
            const yawTorque = yawDelta * this.yawStrength * this.hoverContact;
            this.bodyRb.AddTorque(
                CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, yawTorque),
                CS.UnityEngine.ForceMode.VelocityChange
            );
        }

        // === Movement Control ===
        let moveSpeedMlp = 1;
        let moveDirection = this.getMovementWSADQE();
        moveDirection = CS.UnityEngine.Quaternion.op_Multiply(CS.UnityEngine.Camera.main.transform.rotation, moveDirection);
        {
            if (moveDirection.sqrMagnitude > 0.01) {
                const destYaw = Math.atan2(-moveDirection.x, -moveDirection.z) * (180 / Math.PI);
                this.targetYaw = this.lerpAngle(this.targetYaw, destYaw, this.turnSpeed * fixedDt);

                const angleDiff = Math.abs(destYaw - this.targetYaw);
                moveSpeedMlp = this.lerp(1, 0, this.clamp01(angleDiff / 60));
            }

            const desiredVelocity = CS.UnityEngine.Vector3.op_Multiply(
                CS.UnityEngine.Vector3.Normalize(moveDirection),
                this.moveSpeed
            );
            const velocityDiff = CS.UnityEngine.Vector3.op_Subtraction(desiredVelocity, this.bodyRb.velocity);
            const velocityChange = CS.UnityEngine.Vector3.ClampMagnitude(velocityDiff, 0.05 * this.moveSpeed);
            this.bodyRb.AddForce(
                CS.UnityEngine.Vector3.op_Multiply(velocityChange, moveSpeedMlp),
                CS.UnityEngine.ForceMode.VelocityChange
            );

            this.swingSpeed = moveDirection.magnitude * this.legSwingAngleMax * (this.swingSpeed > 0 ? 1 : -1);
        }

        // === Leg Animation ===
        let isWalking = false;
        if (Math.abs(this.swingSpeed) > 0.01) {
            isWalking = true;
            this.currLegSwingAngle += this.swingSpeed * fixedDt * this.swingSpeedMlp;

            if (Math.abs(this.currLegSwingAngle) >= this.legSwingAngleMax) {
                this.swingSpeed *= -1;
            }

            // Apply to joints
            if (this.jointLegUpL) {
                this.jointLegUpL.targetRotation = CS.UnityEngine.Quaternion.Euler(this.currLegSwingAngle, 0, 0);
            }
            if (this.jointLegUpR) {
                this.jointLegUpR.targetRotation = CS.UnityEngine.Quaternion.Euler(-this.currLegSwingAngle, 0, 0);
            }
            if (this.jointLegLowL) {
                this.jointLegLowL.targetRotation = CS.UnityEngine.Quaternion.Euler(-this.currLegSwingAngle, 0, 0);
            }
            if (this.jointLegLowR) {
                this.jointLegLowR.targetRotation = CS.UnityEngine.Quaternion.Euler(this.currLegSwingAngle, 0, 0);
            }
            if (this.jointFootL) {
                this.jointFootL.targetRotation = CS.UnityEngine.Quaternion.Euler(this.currLegSwingAngle, 0, 0);
            }
            if (this.jointFootR) {
                this.jointFootR.targetRotation = CS.UnityEngine.Quaternion.Euler(-this.currLegSwingAngle, 0, 0);
            }
        }
        if (Giz.show) {
            Giz.DrawLabel(worldCenter, `Mech C${this.collidedFloorMuscleCount} H${this.hoverContact.toFixed(2)}, SwAng ${this.currLegSwingAngle.toFixed(2)} SwSpd ${this.swingSpeed.toFixed(2)}\n
            movMlp ${moveSpeedMlp}`);
            const V3Add = CS.UnityEngine.Vector3.op_Addition;
            const V3Mul = CS.UnityEngine.Vector3.op_Multiply;
            Giz.DrawRayArrow(worldCenter, V3Mul(moveDirection, moveSpeedMlp), Color.red);
            Giz.DrawRayArrow(worldCenter, moveDirection);
        }

        // === Set Muscle Strength ===
        let muscleStrength: number;
        if (isWalking) {
            muscleStrength = this.muscleStrengthWalking;
        } else if (this.hoverContact < 0.1) {
            muscleStrength = this.muscleStrengthFreefall;
        } else {
            muscleStrength = this.muscleStrengthIdle;
        }
        this.setJointsSlerpDriveSpring(muscleStrength);
    }

    private setJointsSlerpDriveSpring(spring: number): void {
        if (!this.joints) return;

        for (const j of this.joints) {
            if (!j) continue;

            const drive = j.slerpDrive;
            drive.positionSpring = spring;
            j.slerpDrive = drive;

            j.angularYZDrive = drive;
            j.angularXDrive = drive;
        }
    }

    // === Input Helpers ===

    private getAxisHorizontalVertical(): CS.UnityEngine.Vector2 {
        const move = this.input.GetMoveInput();
        const h = move.x;
        const v = move.y;
        return new CS.UnityEngine.Vector2(h, v);
    }

    private getMovementWSADQE(): CS.UnityEngine.Vector3 {
        const hv = this.getAxisHorizontalVertical();
        //const vehicle2 = this.input.GetVehicleSecondaryControl();
        return new CS.UnityEngine.Vector3(hv.x, 0, hv.y);
    }

    // === Math Helpers ===

    private clamp01(value: number): number {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }

    private clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    private inverseLerp(a: number, b: number, value: number): number {
        if (a !== b) {
            return (value - a) / (b - a);
        }
        return 0;
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private lerpAngle(a: number, b: number, t: number): number {
        let delta = CS.UnityEngine.Mathf.DeltaAngle(a, b);
        return a + delta * t;
    }

    private isValidRigidBody(rb: CS.Px5.Unity.PxRigidBody | null): rb is CS.Px5.Unity.PxRigidBody {
        return !!rb && rb.valid;
    }
}
