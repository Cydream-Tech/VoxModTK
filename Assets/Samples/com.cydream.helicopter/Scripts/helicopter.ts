export class Helicopter {
    private readonly bindTo: VX.Mod.JsComponentProxy;

    private vehicle: any = null;
    private body: any = null;
    private vehicleTransform: any = null;
    private centerOfMass: any = null;
    private rotorTransform: any = null;

    private engineEnabled = false;
    private hoverHoldEnabled = false;

    private throttleInput = 0;
    private brakeInput = 0;
    private pitchInput = 0;
    private yawInput = 0;
    private rollInput = 0;
    private auxInput = 0;

    private collective = 0;
    private rotorRpm = 0;
    private hoverTargetHeight = 0;

    private readonly hoverBaseCollective = 0.58;
    private readonly rotorSpoolRate = 0.65;
    private readonly rotorDecayRate = 0.45;
    private readonly maxLiftForce = 34;
    private readonly liftVelocityCompensation = 3.8;
    private readonly hoverHeightGain = 1.8;
    private readonly hoverVelocityGain = 2.1;
    private readonly forwardForce = 10;
    private readonly lateralForce = 7;
    private readonly verticalControlForce = 13;
    private readonly rollTorque = 5.5;
    private readonly pitchTorque = 5;
    private readonly yawTorque = 4.5;
    private readonly levelTorque = 7.5;
    private readonly angularDamping = 2.4;
    private readonly hoverAngularDamping = 3.4;
    private readonly lateralDamping = 1.1;
    private readonly hoverLateralDamping = 2.2;
    private readonly landingBrakeDamping = 2.8;
    private readonly maxTiltAngle = 24;
    private readonly rotorVisualSpeed = 1800;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        this.vehicle = this.findVehicleProxy();
        if (this.vehicle == null) {
            return;
        }

        this.vehicleTransform = CS.VoxelPlayground.Mod.ModAPI.GetVehicleTransform(this.vehicle);
        this.centerOfMass = CS.VoxelPlayground.Mod.ModAPI.GetVehicleCenterOfMass(this.vehicle);
        this.body = CS.VoxelPlayground.Mod.ModAPI.GetEntityMainRigidbody(this.vehicle);
        this.rotorTransform = this.resolveRotateCenter();

        if (this.rotorTransform == null && this.vehicleTransform != null) {
            this.rotorTransform = this.vehicleTransform.Find("RootTransform/rotor");
        }

        if (this.body == null || this.vehicleTransform == null || this.centerOfMass == null) {
            return;
        }

        this.body.maxAngularVelocity = 12;
        this.body.drag = 0.15;
        this.body.angularDrag = 0.2;

        CS.VoxelPlayground.Mod.ModAPI.SetVehicleProxyEngineEnabledHandler(this.vehicle, (enabled: boolean) => {
            this.engineEnabled = enabled;
            if (!enabled) {
                this.hoverHoldEnabled = false;
            }
        });

        CS.VoxelPlayground.Mod.ModAPI.SetVehicleProxyThrottleHandler(this.vehicle, (value: number) => {
            this.throttleInput = this.clamp01(value);
        });

        CS.VoxelPlayground.Mod.ModAPI.SetVehicleProxyBrakeHandler(this.vehicle, (value: number) => {
            this.brakeInput = this.clamp01(value);
        });

        CS.VoxelPlayground.Mod.ModAPI.SetVehicleProxySteeringHandler(this.vehicle, (value: any) => {
            this.rollInput = this.clampSigned(-value.y);
            this.pitchInput = this.clampSigned(-value.x);
            this.yawInput = this.clampSigned(value.z);
            this.auxInput = this.clampSigned(value.w);
        });

        CS.VoxelPlayground.Mod.ModAPI.SetVehicleProxyAbilityPressedHandler(this.vehicle, () => {
            if (!this.engineEnabled || this.body == null) {
                return;
            }

            this.hoverHoldEnabled = !this.hoverHoldEnabled;
            if (this.hoverHoldEnabled) {
                this.hoverTargetHeight = this.body.position.y;
            }
        });
    }

    private onUpdate(deltaTime: number): void {
        const rpmTarget = this.engineEnabled ? 1 : 0;
        const rpmRate = this.engineEnabled ? this.rotorSpoolRate : this.rotorDecayRate;
        this.rotorRpm = CS.UnityEngine.Mathf.MoveTowards(this.rotorRpm, rpmTarget, rpmRate * deltaTime);

        if (this.rotorTransform != null && this.rotorRpm > 0) {
            const spin = this.rotorVisualSpeed * this.rotorRpm * deltaTime;
            this.rotorTransform.Rotate(0, spin, 0);
        }
    }

    private onFixedUpdate(deltaTime: number): void {
        if (this.body == null || this.vehicleTransform == null || this.centerOfMass == null) {
            return;
        }

        const Mathf = CS.UnityEngine.Mathf;
        const ForceMode = CS.UnityEngine.ForceMode;
        const verticalSpeed = CS.UnityEngine.Vector3.Dot(this.body.linearVelocity, this.vehicleTransform.up);
        const localVelocity = this.vehicleTransform.InverseTransformDirection(this.body.linearVelocity);
        const liftBlend = this.computeCollective(deltaTime);
        const liftForce = this.computeLiftForce(liftBlend, verticalSpeed);

        this.body.AddForceAtPosition(
            this.scaleVector(this.vehicleTransform.up, liftForce),
            this.centerOfMass.position,
            ForceMode.Acceleration,
        );

        const levelStrength = this.hoverHoldEnabled ? 1 : 0.55;
        const levelTorque = this.computeLevelTorque(levelStrength);
        const desiredPitch = -this.pitchInput * this.maxTiltAngle;
        const desiredRoll = -this.rollInput * this.maxTiltAngle;

        const pitchAssist = this.scaleVector(
            this.vehicleTransform.right,
            (desiredPitch / this.maxTiltAngle) * this.pitchTorque,
        );
        const rollAssist = this.scaleVector(
            this.vehicleTransform.forward,
            (-desiredRoll / this.maxTiltAngle) * this.rollTorque,
        );
        const yawAssist = this.scaleVector(this.vehicleTransform.up, this.yawInput * this.yawTorque * this.rotorRpm);

        const damping = this.hoverHoldEnabled ? this.hoverAngularDamping : this.angularDamping;
        const angularDampingTorque = this.scaleVector(this.body.angularVelocity, -damping);

        this.body.AddTorque(
            this.addVectors(levelTorque, pitchAssist, rollAssist, yawAssist, angularDampingTorque),
            ForceMode.Acceleration,
        );

        const forwardAssist = this.scaleVector(
            this.vehicleTransform.forward,
            this.pitchInput * this.forwardForce * this.rotorRpm,
        );
        const lateralAssist = this.scaleVector(
            this.vehicleTransform.right,
            this.rollInput * this.lateralForce * this.rotorRpm,
        );
        const horizontalDamping = this.makeVector3(-localVelocity.x, 0, -localVelocity.z);
        const dampingScale = this.hoverHoldEnabled ? this.hoverLateralDamping : this.lateralDamping;
        const landingBoost = this.brakeInput > 0.25 ? this.landingBrakeDamping * this.brakeInput : 0;
        const horizontalStabilize = this.scaleVector(
            this.vehicleTransform.TransformDirection(horizontalDamping),
            dampingScale + landingBoost,
        );

        this.body.AddForce(
            this.addVectors(forwardAssist, lateralAssist, horizontalStabilize),
            ForceMode.Acceleration,
        );

        if (!this.engineEnabled && this.rotorRpm <= 0.01) {
            this.collective = 0;
            return;
        }

        if (this.hoverHoldEnabled && this.throttleInput < 0.05 && this.brakeInput < 0.05) {
            const heightError = this.hoverTargetHeight - this.body.position.y;
            const hoverCorrection = Mathf.Clamp(
                heightError * this.hoverHeightGain - verticalSpeed * this.hoverVelocityGain,
                -this.verticalControlForce,
                this.verticalControlForce,
            );
            this.body.AddForce(this.scaleVector(this.vehicleTransform.up, hoverCorrection), ForceMode.Acceleration);
        }
    }

    private onDestroy(): void {
        if (this.vehicle != null) {
            CS.VoxelPlayground.Mod.ModAPI.ClearVehicleProxyCallbacks(this.vehicle);
        }
    }

    private findVehicleProxy(): any | null {
        const gameObject = this.bindTo.gameObject;
        const componentCount = gameObject.GetComponentCount();

        for (let i = 0; i < componentCount; i++) {
            const component: any = gameObject.GetComponentAtIndex(i);
            if (component != null && CS.VoxelPlayground.Mod.ModAPI.IsVehicleProxy(component)) {
                return component;
            }
        }

        return null;
    }

    private resolveRotateCenter(): any | null {
        const gameObject = this.bindTo.gameObject;
        const componentCount = gameObject.GetComponentCount();

        for (let i = 0; i < componentCount; i++) {
            const component: any = gameObject.GetComponentAtIndex(i);
            if (component == null || component.Pairs == null) {
                continue;
            }

            const pairs = component.Pairs;
            const length = pairs.Length ?? 0;
            for (let j = 0; j < length; j++) {
                const pair = pairs.GetValue(j);
                if (pair != null && pair.key === "rotateCenter" && pair.value != null) {
                    return pair.value;
                }
            }
        }

        return null;
    }

    private computeCollective(deltaTime: number): number {
        const Mathf = CS.UnityEngine.Mathf;
        const inputCollective = this.throttleInput - this.brakeInput;
        let targetCollective = this.hoverBaseCollective + inputCollective * 0.45;

        if (!this.engineEnabled) {
            targetCollective = 0;
        } else if (this.hoverHoldEnabled && this.throttleInput < 0.05 && this.brakeInput < 0.05) {
            targetCollective = this.hoverBaseCollective;
        }

        targetCollective = Mathf.Clamp(targetCollective, 0, 1);
        this.collective = Mathf.MoveTowards(this.collective, targetCollective, deltaTime * 0.8);
        return this.collective;
    }

    private computeLiftForce(collective: number, verticalSpeed: number): number {
        const Mathf = CS.UnityEngine.Mathf;
        const rotorLift = this.rotorRpm * collective;
        const compensation = -verticalSpeed * this.liftVelocityCompensation;
        return Mathf.Max(0, rotorLift * this.maxLiftForce + compensation);
    }

    private computeLevelTorque(levelStrength: number): any {
        if (this.vehicleTransform == null) {
            return CS.UnityEngine.Vector3.zero;
        }

        const worldUp = this.makeVector3(0, 1, 0);
        const correctionAxis = CS.UnityEngine.Vector3.Cross(this.vehicleTransform.up, worldUp);
        return this.scaleVector(correctionAxis, this.levelTorque * this.rotorRpm * levelStrength);
    }

    private clamp01(value: number): number {
        return CS.UnityEngine.Mathf.Clamp(value, 0, 1);
    }

    private clampSigned(value: number): number {
        return CS.UnityEngine.Mathf.Clamp(value, -1, 1);
    }

    private makeVector3(x: number, y: number, z: number): any {
        return new CS.UnityEngine.Vector3(x, y, z);
    }

    private scaleVector(vector: any, scale: number): any {
        return this.makeVector3(vector.x * scale, vector.y * scale, vector.z * scale);
    }

    private addVectors(...vectors: any[]): any {
        let x = 0;
        let y = 0;
        let z = 0;

        for (const vector of vectors) {
            x += vector.x;
            y += vector.y;
            z += vector.z;
        }

        return this.makeVector3(x, y, z);
    }

}
