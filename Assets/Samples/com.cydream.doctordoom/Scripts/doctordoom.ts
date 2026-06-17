const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const Color = CS.UnityEngine.Color;
const Mathf = CS.UnityEngine.Mathf;
const ForceMode = CS.UnityEngine.ForceMode;
const QueryTriggerInteraction = CS.UnityEngine.QueryTriggerInteraction;
const PxPhysics = CS.Px5.Unity.PxPhysics;
const Giz = VX.Utility.Giz;
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const EntityType = puerts.$typeof(VX.Entity.Entity);
const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const EntityFirableWeaponType = puerts.$typeof(VX.Entity.EntityFirableWeapon);
const LineRendererType = puerts.$typeof(CS.UnityEngine.LineRenderer);
const ParticleSystemType = puerts.$typeof(CS.UnityEngine.ParticleSystem);
const PxColliderType = puerts.$typeof(CS.Px5.Unity.PxCollider);
const PxBoxColliderType = puerts.$typeof(CS.Px5.Unity.PxBoxCollider);
const PxRigidBodyType = puerts.$typeof(CS.Px5.Unity.PxRigidBody);
const VoxelDestructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
const ModAPI = VX.Mod.ModAPI;

interface HiddenWeaponCache {
    gameObject: CS.UnityEngine.GameObject;
    entity: VX.Entity.Entity | null;
    weapon: VX.Entity.EntityFirableWeapon | null;
    triggerHeld: boolean;
}

interface MagicHandPose {
    position: CS.UnityEngine.Vector3;
    forward: CS.UnityEngine.Vector3;
}

/**
 * Doctor Doom sample mod.
 *
 * Features and controls:
 * - Flight: hold both Grip buttons, then pull both hands back. Release either Grip to stop flying and fall.
 * - Magic charge: hold both Triggers with palms facing each other to merge the hand orbs into one charged orb.
 * - Magic beam: turn one charged palm away from the charge pose to fire a sustained palm beam.
 * - Magic shield: hold either Trigger to raise a full-body shield centered on the head. The shield is disabled while firing the magic beam.
 *
 * Prefab notes:
 * - Hand/middle magic balls are optional Transform properties and are scaled to show/hide.
 * - laserFX, laserBeginFX, laserHitFX, and laserShockwave are optional beam visuals.
 * - magicShield should contain the configured full-body collider/kinematic body used as the physical barrier.
 */
export class DoctorDoom {
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null;
    private input: VX.Mod.ModAPI.Input;

    private readonly gripInputThreshold = 0.5;
    private readonly gripFlightStartPullDistance = 0.10;
    private readonly gripFlightFullPullDistance = 0.75;
    private readonly gripFlightMinSpeed = 12.0;
    private readonly gripFlightMaxSpeed = 62.0;
    private readonly gripFlightAcceleration = 95.0;
    private readonly flightDemolishRadius = 3.5;
    private readonly flightDemolishForwardOffset = 2.2;
    private readonly flightDemolishForce = 72.0;
    private readonly flightDemolishSpreadAngle = 70.0;
    private readonly flightDemolishMaxFragments = 80;
    private readonly flightDemolishInterval = 0.035;
    private readonly magicTriggerThreshold = 0.5;
    private readonly magicChargeBreakDot = 0.6427876097; // cos(50deg)
    private readonly magicPalmFacingDot = this.magicChargeBreakDot;
    private readonly magicChargeBreakGraceSeconds = 0.2;
    private readonly magicBeamSecondsPerChargeSecond = 1.0;
    private readonly magicBeamLength = 60.0;
    private readonly magicBeamItemKey = "Items/Guns/Laser";
    private readonly magicBeamGunCount = 5;
    private readonly magicBeamGunCircleRadius = 0.18;
    private readonly magicBeamGunRotationSpeed = 7.0;
    private readonly magicBeamForwardOffset = 0.08;
    private readonly magicBeamAmmo = 999;
    private readonly magicBeamHitDemolishRadius = 0.7;
    private readonly magicBeamHitDemolishForce = 42.0;
    private readonly magicBeamHitDemolishSpreadAngle = 60.0;
    private readonly magicBeamHitDemolishMaxFragments = 18;
    private readonly magicBeamHitDemolishInterval = 0.035;
    private readonly laserFXFallbackLength = 80.0;
    private readonly magicHandOrbRadius = 0.13;
    private readonly magicChargeOrbBaseRadius = 0.28;
    private readonly magicHandBallScale = 0.35;
    private readonly magicChargeBallBaseScale = 0.8;
    private readonly magicChargeBallGrowthPerSecond = 0.08;
    private readonly magicChargeBallMaxGrowth = 1.2;
    private readonly magicBallScaleSpeed = 5.0;
    private readonly magicBackwardPalmDot = -0.15;
    private readonly magicShieldEnableDelay = 0.2;
    private readonly magicBeamColor = new Color(0.3, 1.0, 0.55, 1.0);
    private readonly magicChargeColor = new Color(0.35, 1.0, 0.85, 1.0);
    private readonly shieldGizColor = new Color(0.2, 0.9, 1.0, 0.9);
    private readonly repulsorItemKey = "Items/Guns/Laser Rifle";
    private readonly repulsorForwardOffset = 0.18;
    private readonly repulsorOutwardOffset = 0.06;
    private readonly repulsorFallbackSideOffset = 0.45;
    private readonly repulsorAmmo = 999;

    private moveJetSound: CS.Sonity.SoundEvent | null = null;
    private magicChargingSound: CS.Sonity.SoundEvent | null = null;
    private leftRepulsorGun: HiddenWeaponCache | null = null;
    private rightRepulsorGun: HiddenWeaponCache | null = null;
    private magicBeamGuns: HiddenWeaponCache[] = [];
    private thrusterFX_L: CS.UnityEngine.Transform | null = null;
    private thrusterFX_R: CS.UnityEngine.Transform | null = null;
    private magicball_L: CS.UnityEngine.Transform | null = null;
    private magicball_R: CS.UnityEngine.Transform | null = null;
    private magicball_Middle: CS.UnityEngine.Transform | null = null;
    private laserFX: CS.UnityEngine.Transform | null = null;
    private laserBeginFX: CS.UnityEngine.Transform | null = null;
    private laserHitFX: CS.UnityEngine.Transform | null = null;
    private laserShockwave: CS.UnityEngine.Transform | null = null;
    private magicShield: CS.UnityEngine.Transform | null = null;
    private thrusterFX_L_Attached = false;
    private thrusterFX_R_Attached = false;
    private magicball_L_Attached = false;
    private magicball_R_Attached = false;
    private magicball_Middle_Attached = false;
    private magicShield_Attached = false;
    private magicShield_CollisionIgnored = false;
    private laserFX_Attached = false;
    private laserBeginFX_Attached = false;
    private laserHitFX_Attached = false;
    private laserShockwave_Attached = false;
    private laserLineRenderers: CS.UnityEngine.LineRenderer[] | null = null;
    private laserShockwavePlayed = false;
    private nextFlightDemolishTime = 0;
    private nextShieldDemolishTime = 0;
    private nextMagicBeamHitDemolishTime = 0;
    private magicShieldTriggerStartTime = -1;
    private gripFlightActive = false;
    private gripFlightSpeed = 0;
    private gripFlightBaselineLeft: CS.UnityEngine.Vector3 | null = null;
    private gripFlightBaselineRight: CS.UnityEngine.Vector3 | null = null;
    private gripFlightBaselineForward: CS.UnityEngine.Vector3 | null = null;
    private magicCharging = false;
    private magicChargeTime = 0;
    private magicChargeCenter: CS.UnityEngine.Vector3 | null = null;
    private magicBeamActive = false;
    private magicBeamRemaining = 0;
    private magicBeamFireHandIsLeft = false;
    private magicball_L_TargetScale = 0;
    private magicball_R_TargetScale = 0;
    private magicball_Middle_TargetScale = 0;
    private magicball_L_TargetPosition: CS.UnityEngine.Vector3 | null = null;
    private magicball_R_TargetPosition: CS.UnityEngine.Vector3 | null = null;
    private magicball_Middle_TargetPosition: CS.UnityEngine.Vector3 | null = null;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("DoctorDoom constructor");
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        this.input = new VX.Mod.ModAPI.Input();
        this.readProperties();

        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
        CS.UnityEngine.Debug.Log("DoctorDoom initialized");
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        this.moveJetSound = props.Get("moveJetSound") as CS.Sonity.SoundEvent;
        this.magicChargingSound = props.Get("magicCharging") as CS.Sonity.SoundEvent;
        this.thrusterFX_L = props.Get("thrusterFX_L") as CS.UnityEngine.Transform;
        this.thrusterFX_R = props.Get("thrusterFX_R") as CS.UnityEngine.Transform;
        this.magicball_L = props.Get("magicball_L") as CS.UnityEngine.Transform;
        this.magicball_R = props.Get("magicball_R") as CS.UnityEngine.Transform;
        this.magicball_Middle = props.Get("magicball_Middle") as CS.UnityEngine.Transform;
        this.laserFX = props.Get("laserFX") as CS.UnityEngine.Transform;
        this.laserBeginFX = props.Get("laserBeginFX") as CS.UnityEngine.Transform;
        this.laserHitFX = props.Get("laserHitFX") as CS.UnityEngine.Transform;
        this.laserShockwave = props.Get("laserShockwave") as CS.UnityEngine.Transform;
        this.magicShield = props.Get("magicShield") as CS.UnityEngine.Transform;
    }

    private onStart(): void {
        const character = this.getCharacter();
        this.attachThrusterFX(character);
        this.attachMagicBallFX(character);
        this.attachShieldFX(character);
        this.attachLaserFX(character);
        this.hideMagicBallImmediately(this.magicball_L);
        this.hideMagicBallImmediately(this.magicball_R);
        this.hideMagicBallImmediately(this.magicball_Middle);
        this.hideLaserFX();
        this.setShieldActive(this.magicShield, false);
    }

    private onUpdate(deltaTime: number): void {
        const character = this.getCharacter();
        this.updateGripFlightState(character);
        this.resetMagicBallTargets();
        this.updateMagicBeam(character, deltaTime);
        this.updateMagicBallFX(deltaTime);
        this.releaseRepulsor(this.leftRepulsorGun);
        this.releaseRepulsor(this.rightRepulsorGun);

        const active = character != null && (this.gripFlightActive || this.isMagicHoverActive());
        this.setContinuousSoundState(this.moveJetSound, active);
        this.setContinuousSoundState(this.magicChargingSound, character != null && this.magicCharging);
    }

    private onFixedUpdate(deltaTime: number): void {
        const character = this.getCharacter();
        this.updateThrusterFX(character);
        if (character == null) {
            return;
        }

        if (this.gripFlightActive) {
            this.applyGripFlight(character, deltaTime);
        } else if (this.isMagicHoverActive()) {
            this.applyFlightAntiGravity(character);
        }
    }

    private getCharacter(): VX.Entity.EntityCharacter | null {
        if (this.character != null) {
            return this.character;
        }

        this.character = this.bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        return this.character;
    }

    private attachThrusterFX(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            return;
        }

        this.thrusterFX_L_Attached = this.attachFootThrusterFX(
            this.thrusterFX_L,
            character,
            "LeftFoot",
            this.thrusterFX_L_Attached
        );
        this.thrusterFX_R_Attached = this.attachFootThrusterFX(
            this.thrusterFX_R,
            character,
            "RightFoot",
            this.thrusterFX_R_Attached
        );
    }

    private updateThrusterFX(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            return;
        }

        this.attachThrusterFX(character);
        this.updateFootThrusterFX(this.thrusterFX_L, character, "LeftFoot");
        this.updateFootThrusterFX(this.thrusterFX_R, character, "RightFoot");
    }

    private attachFootThrusterFX(
        thrusterFX: CS.UnityEngine.Transform | null,
        character: VX.Entity.EntityCharacter,
        footBodyName: string,
        alreadyAttached: boolean
    ): boolean {
        if (!thrusterFX || alreadyAttached) {
            return alreadyAttached;
        }

        const foot = ModAPI.GetCharacterBody(character, footBodyName) as CS.Px5.Unity.PxRigidBody | null;
        if (!foot) {
            return false;
        }

        thrusterFX.SetParent(foot.transform);
        thrusterFX.localScale = Vec3.one;
        this.updateFootThrusterFX(thrusterFX, character, footBodyName);
        return true;
    }

    private updateFootThrusterFX(
        thrusterFX: CS.UnityEngine.Transform | null,
        character: VX.Entity.EntityCharacter,
        footBodyName: string
    ): void {
        if (!thrusterFX) {
            return;
        }

        const foot = ModAPI.GetCharacterBody(character, footBodyName) as CS.Px5.Unity.PxRigidBody | null;
        if (!foot) {
            return;
        }

        thrusterFX.position = Vec3.op_Addition(foot.worldCenterOfMass, new Vec3(0, -0.24, 0));
        thrusterFX.rotation = Quat.LookRotation(Vec3.down, Vec3.forward);
    }

    private updateGripFlightState(character: VX.Entity.EntityCharacter | null): void {
        const gripsHeld = this.input.GetGripLInput() > this.gripInputThreshold
            && this.input.GetGripRInput() > this.gripInputThreshold;
        if (!character || !gripsHeld) {
            this.deactivateGripFlight(character);
            this.resetGripFlightTracking();
            return;
        }

        const leftController = this.getControllerTransform(true);
        const rightController = this.getControllerTransform(false);
        if (!leftController || !rightController) {
            this.deactivateGripFlight(character);
            this.resetGripFlightTracking();
            return;
        }

        if (!this.gripFlightBaselineLeft || !this.gripFlightBaselineRight) {
            this.captureGripFlightBaseline(leftController, rightController);
            return;
        }

        const pullDistance = this.getGripFlightPullDistance(leftController.position, rightController.position);
        if (!this.gripFlightActive && pullDistance < -0.03) {
            this.captureGripFlightBaseline(leftController, rightController);
            return;
        }

        if (this.gripFlightActive) {
            this.gripFlightSpeed = this.getGripFlightSpeed(pullDistance);
            return;
        }

        if (pullDistance >= this.gripFlightStartPullDistance) {
            this.gripFlightActive = true;
            this.gripFlightSpeed = this.getGripFlightSpeed(pullDistance);
        }
    }

    private captureGripFlightBaseline(
        leftController: CS.UnityEngine.Transform,
        rightController: CS.UnityEngine.Transform
    ): void {
        this.gripFlightBaselineLeft = leftController.position;
        this.gripFlightBaselineRight = rightController.position;
        this.gripFlightBaselineForward = this.getViewForward();
        this.gripFlightSpeed = 0;
    }

    private resetGripFlightTracking(): void {
        this.gripFlightBaselineLeft = null;
        this.gripFlightBaselineRight = null;
        this.gripFlightBaselineForward = null;
    }

    private deactivateGripFlight(character: VX.Entity.EntityCharacter | null): void {
        if (!this.gripFlightActive) {
            return;
        }

        this.gripFlightActive = false;
        this.gripFlightSpeed = 0;
        if (character) {
            ModAPI.SetCharacterHanging(character, false);
        }
    }

    private getGripFlightPullDistance(
        leftPosition: CS.UnityEngine.Vector3,
        rightPosition: CS.UnityEngine.Vector3
    ): number {
        if (!this.gripFlightBaselineLeft || !this.gripFlightBaselineRight) {
            return 0;
        }

        const viewForward = this.gripFlightBaselineForward || this.getViewForward();
        const leftPull = Vec3.Dot(Vec3.op_Subtraction(this.gripFlightBaselineLeft, leftPosition), viewForward);
        const rightPull = Vec3.Dot(Vec3.op_Subtraction(this.gripFlightBaselineRight, rightPosition), viewForward);
        return Math.min(leftPull, rightPull);
    }

    private getGripFlightSpeed(pullDistance: number): number {
        const range = Math.max(this.gripFlightFullPullDistance - this.gripFlightStartPullDistance, 0.001);
        const t = Mathf.Clamp01((pullDistance - this.gripFlightStartPullDistance) / range);
        return Mathf.Lerp(this.gripFlightMinSpeed, this.gripFlightMaxSpeed, t);
    }

    private getFlightReferencePosition(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        if (cam) {
            return cam.transform.position;
        }

        const head = ModAPI.GetCharacterBody(character, "Head");
        if (head) {
            return head.worldCenterOfMass;
        }

        return this.bindTo.transform.position;
    }

    private getControllerTransform(isLeft: boolean): CS.UnityEngine.Transform | null {
        return ModAPI.GetXRControllerTransform(isLeft);
    }

    private applyGripFlight(character: VX.Entity.EntityCharacter, deltaTime: number): void {
        this.applyFlightAntiGravity(character);

        const flightDirection = this.getViewForward();
        const targetSpeed = Math.max(this.gripFlightSpeed, this.gripFlightMinSpeed);
        const hipRb = ModAPI.GetCharacterBody(character, "Hip");
        let velocityChange = Vec3.op_Multiply(flightDirection, this.gripFlightAcceleration * deltaTime);
        if (hipRb) {
            const targetVelocity = Vec3.op_Multiply(flightDirection, targetSpeed);
            const neededVelocityChange = Vec3.op_Subtraction(targetVelocity, hipRb.velocity);
            const maxVelocityChange = this.gripFlightAcceleration * deltaTime;
            velocityChange = neededVelocityChange.magnitude > maxVelocityChange
                ? Vec3.op_Multiply(neededVelocityChange.normalized, maxVelocityChange)
                : neededVelocityChange;
        }

        if (hipRb) {
            hipRb.AddForce(velocityChange, ForceMode.VelocityChange);
        }

        ModAPI.AddCharacterMotion(character, velocityChange, ForceMode.VelocityChange);
        this.demolishNearFlight(character, flightDirection);
    }

    private applyFlightAntiGravity(character: VX.Entity.EntityCharacter): void {
        const antiGravity = Vec3.op_UnaryNegation(PxPhysics.gravity);
        const rigidbodies = ModAPI.GetEntityRigidbodies(character);
        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (rb) {
                rb.AddForce(antiGravity, ForceMode.Acceleration);
            }
        }
    }

    private demolishNearFlight(character: VX.Entity.EntityCharacter, flightDirection: CS.UnityEngine.Vector3): void {
        const now = CS.UnityEngine.Time.time;
        if (now < this.nextFlightDemolishTime) {
            return;
        }

        const hip = ModAPI.GetCharacterBody(character, "Hip");
        const origin = hip ? hip.worldCenterOfMass : this.bindTo.transform.position;
        const strikeCenter = Vec3.op_Addition(
            origin,
            Vec3.op_Multiply(flightDirection, this.flightDemolishForwardOffset)
        );
        const demolished = this.demolishVoxelSphere(
            strikeCenter,
            this.flightDemolishRadius,
            this.flightDemolishForce,
            flightDirection,
            this.flightDemolishSpreadAngle,
            this.flightDemolishMaxFragments,
            character,
            null
        );

        if (demolished) {
            this.nextFlightDemolishTime = now + this.flightDemolishInterval;
        }
    }

    private updateMagicBeam(character: VX.Entity.EntityCharacter | null, deltaTime: number): void {
        if (!character) {
            this.cancelMagicCharge();
            this.releaseMagicBeamGuns();
            this.magicBeamActive = false;
            this.magicBeamRemaining = 0;
            this.updateMagicShield(null, false);
            return;
        }

        const leftTrigger = this.input.GetFireLInput() > this.magicTriggerThreshold;
        const rightTrigger = this.input.GetFireRInput() > this.magicTriggerThreshold;
        const leftPose = this.getMagicHandPose(character, true);
        const rightPose = this.getMagicHandPose(character, false);

        if (this.magicBeamActive) {
            this.updateMagicShield(character, false);
            this.updateActiveMagicBeam(leftPose, rightPose, deltaTime);
            return;
        }

        this.releaseMagicBeamGuns();

        if (this.magicCharging) {
            this.updateMagicShield(character, leftTrigger || rightTrigger);
            this.updateMagicCharge(leftTrigger, rightTrigger, leftPose, rightPose, deltaTime);
            return;
        }

        const shouldCharge = leftTrigger && rightTrigger && leftPose && rightPose && this.arePalmsFacing(leftPose, rightPose);
        if (shouldCharge) {
            this.updateMagicShield(character, true);
            this.startMagicCharge(leftPose, rightPose);
            this.drawMagicChargeOrb();
            return;
        }

        this.updateMagicShield(character, leftTrigger || rightTrigger);

        if (leftTrigger && leftPose) {
            this.drawMagicOrb(leftPose.position, this.magicHandOrbRadius);
            this.setMagicBallTarget(true, leftPose.position, this.magicHandBallScale);
        }
        if (rightTrigger && rightPose) {
            this.drawMagicOrb(rightPose.position, this.magicHandOrbRadius);
            this.setMagicBallTarget(false, rightPose.position, this.magicHandBallScale);
        }
    }

    private updateMagicCharge(
        leftTrigger: boolean,
        rightTrigger: boolean,
        leftPose: MagicHandPose | null,
        rightPose: MagicHandPose | null,
        deltaTime: number
    ): void {
        if (!leftTrigger || !rightTrigger || !leftPose || !rightPose) {
            this.cancelMagicCharge();
            return;
        }

        this.magicChargeTime += deltaTime;
        this.magicChargeCenter = Vec3.op_Multiply(Vec3.op_Addition(leftPose.position, rightPose.position), 0.5);
        this.drawMagicChargeOrb();
        this.setMagicBallTarget(true, leftPose.position, 0);
        this.setMagicBallTarget(false, rightPose.position, 0);
        this.setMiddleMagicBallTarget();

        const fireHandIsLeft = this.getMagicBreakFireHand(leftPose, rightPose);
        if (fireHandIsLeft == null || this.magicChargeTime < this.magicChargeBreakGraceSeconds) {
            return;
        }

        this.startMagicBeam(fireHandIsLeft, leftPose, rightPose);
    }

    private startMagicCharge(leftPose: MagicHandPose, rightPose: MagicHandPose): void {
        this.magicCharging = true;
        this.magicChargeTime = 0;
        this.magicChargeCenter = Vec3.op_Multiply(Vec3.op_Addition(leftPose.position, rightPose.position), 0.5);
        this.setMagicBallTarget(true, leftPose.position, 0);
        this.setMagicBallTarget(false, rightPose.position, 0);
        this.setMiddleMagicBallTarget();
    }

    private cancelMagicCharge(): void {
        this.magicCharging = false;
        this.magicChargeTime = 0;
        this.magicChargeCenter = null;
    }

    private startMagicBeam(
        fireHandIsLeft: boolean,
        leftPose: MagicHandPose,
        rightPose: MagicHandPose
    ): void {
        this.magicBeamActive = true;
        this.magicBeamFireHandIsLeft = fireHandIsLeft;
        this.magicBeamRemaining = Math.max(this.magicChargeTime * this.magicBeamSecondsPerChargeSecond, 0.05);
        this.cancelMagicCharge();
        this.resetMagicBallTargets();
        this.updateMagicBeamWeapons(fireHandIsLeft ? leftPose : rightPose);
    }

    private updateActiveMagicBeam(
        leftPose: MagicHandPose | null,
        rightPose: MagicHandPose | null,
        deltaTime: number
    ): void {
        this.magicBeamRemaining -= deltaTime;
        if (this.magicBeamRemaining <= 0) {
            this.releaseMagicBeamGuns();
            this.magicBeamActive = false;
            this.magicBeamRemaining = 0;
            return;
        }

        const pose = this.magicBeamFireHandIsLeft ? leftPose : rightPose;
        if (!pose) {
            this.releaseMagicBeamGuns();
            this.magicBeamActive = false;
            this.magicBeamRemaining = 0;
            return;
        }

        this.setMagicBallTarget(this.magicBeamFireHandIsLeft, pose.position, this.magicHandBallScale);
        this.updateMagicBeamWeapons(pose);
    }

    private drawMagicOrb(position: CS.UnityEngine.Vector3, radius: number): void {
        if (this.hasMagicBallFX()) {
            return;
        }

        Giz.DrawWireSphere(position, radius, this.magicChargeColor);
    }

    private drawMagicChargeOrb(): void {
        if (!this.magicChargeCenter) {
            return;
        }

        const radius = this.magicChargeOrbBaseRadius + Math.min(this.magicChargeTime * 0.05, 0.9);
        this.drawMagicOrb(this.magicChargeCenter, radius);
        this.setMiddleMagicBallTarget();
    }

    private drawMagicBeam(pose: MagicHandPose): void {
        const end = Vec3.op_Addition(pose.position, Vec3.op_Multiply(pose.forward, this.magicBeamLength));
        Giz.DrawLine(pose.position, end, this.magicBeamColor);
    }

    private updateMagicBeamWeapons(pose: MagicHandPose): void {
        if (this.hasLaserFX()) {
            this.updateLaserFX(pose);
            this.releaseHiddenMagicBeamGuns();
            return;
        }

        this.ensureMagicBeamGuns();
        if (this.magicBeamGuns.length <= 0) {
            this.drawMagicBeam(pose);
            return;
        }

        const forward = this.safeDirection(pose.forward, this.getViewForward());
        const viewUp = this.getViewUp();
        const right = this.safeDirection(Vec3.Cross(viewUp, forward), this.bindTo.transform.right);
        const up = this.safeDirection(Vec3.Cross(forward, right), viewUp);
        const rotation = Quat.LookRotation(forward, up);
        const spin = CS.UnityEngine.Time.time * this.magicBeamGunRotationSpeed;
        for (let i = 0; i < this.magicBeamGuns.length; i++) {
            const gun = this.magicBeamGuns[i];
            if (gun.gameObject) {
                gun.gameObject.SetActive(true);
            }
            const angle = spin + (Math.PI * 2 * i) / this.magicBeamGuns.length;
            let circleOffset = Vec3.op_Multiply(right, Math.cos(angle) * this.magicBeamGunCircleRadius);
            circleOffset = Vec3.op_Addition(circleOffset, Vec3.op_Multiply(up, Math.sin(angle) * this.magicBeamGunCircleRadius));
            let position = Vec3.op_Addition(pose.position, Vec3.op_Multiply(forward, this.magicBeamForwardOffset));
            position = Vec3.op_Addition(position, circleOffset);
            this.syncHiddenWeapon(gun, position, rotation);
            this.setHiddenWeaponTrigger(gun, true);
        }
    }

    private ensureMagicBeamGuns(): void {
        while (this.magicBeamGuns.length < this.magicBeamGunCount) {
            const cache = this.createHiddenWeapon(this.magicBeamItemKey, this.magicBeamAmmo, "magic beam laser");
            if (!cache) {
                return;
            }

            this.magicBeamGuns.push(cache);
        }
    }

    private releaseMagicBeamGuns(): void {
        this.releaseHiddenMagicBeamGuns();
        this.hideLaserFX();
    }

    private releaseHiddenMagicBeamGuns(): void {
        for (const gun of this.magicBeamGuns) {
            this.setHiddenWeaponTrigger(gun, false);
            if (gun.gameObject) {
                gun.gameObject.SetActive(false);
            }
        }
    }

    private hasLaserFX(): boolean {
        return this.laserFX != null;
    }

    private updateLaserFX(pose: MagicHandPose): void {
        this.attachLaserFX(this.getCharacter());
        const forward = this.safeDirection(pose.forward, this.getViewForward());
        const up = this.getViewUp();
        const rotation = Quat.LookRotation(forward, up);
        const start = Vec3.op_Addition(pose.position, Vec3.op_Multiply(forward, this.magicBeamForwardOffset));
        const end = this.getLaserEndPoint(start, forward);
        this.demolishMagicBeamHit(end, forward);

        if (this.laserFX && this.laserFX.gameObject) {
            this.laserFX.gameObject.SetActive(true);
            this.laserFX.SetPositionAndRotation(start, rotation);
        }
        if (this.laserBeginFX && this.laserBeginFX.gameObject) {
            this.laserBeginFX.gameObject.SetActive(true);
            this.laserBeginFX.SetPositionAndRotation(start, rotation);
        }
        if (this.laserHitFX && this.laserHitFX.gameObject) {
            this.laserHitFX.gameObject.SetActive(true);
            this.laserHitFX.SetPositionAndRotation(end, rotation);
        }
        if (this.laserShockwave && this.laserShockwave.gameObject) {
            this.laserShockwave.gameObject.SetActive(true);
            this.laserShockwave.SetPositionAndRotation(start, rotation);
            if (!this.laserShockwavePlayed) {
                this.playParticleSystems(this.laserShockwave);
                this.laserShockwavePlayed = true;
            }
        }

        const renderers = this.getLaserLineRenderers();
        for (const renderer of renderers) {
            if (!renderer) {
                continue;
            }

            renderer.enabled = true;
            renderer.useWorldSpace = true;
            renderer.positionCount = 2;
            renderer.SetPosition(0, start);
            renderer.SetPosition(1, end);
        }
    }

    private getLaserEndPoint(start: CS.UnityEngine.Vector3, forward: CS.UnityEngine.Vector3): CS.UnityEngine.Vector3 {
        const character = this.getCharacter();
        const hits = PxPhysics.RaycastAll(
            start,
            forward,
            this.laserFXFallbackLength,
            VX.Engine.LayerMasksHelper.bulletHitLayerMask.value,
            QueryTriggerInteraction.Ignore
        );
        if (!hits || hits.Length <= 0) {
            return Vec3.op_Addition(start, Vec3.op_Multiply(forward, this.laserFXFallbackLength));
        }

        let bestPoint: CS.UnityEngine.Vector3 | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let i = 0; i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit | null;
            if (!hit || hit.distance <= 0.05 || hit.distance >= bestDistance) {
                continue;
            }

            if (character && hit.rigidbody && hit.rigidbody.transform.IsChildOf(character.transform)) {
                continue;
            }

            bestDistance = hit.distance;
            bestPoint = hit.point;
        }

        return bestPoint ?? Vec3.op_Addition(start, Vec3.op_Multiply(forward, this.laserFXFallbackLength));
    }

    private demolishMagicBeamHit(hitPoint: CS.UnityEngine.Vector3, forward: CS.UnityEngine.Vector3): void {
        const character = this.getCharacter();
        if (!character) {
            return;
        }

        const now = CS.UnityEngine.Time.time;
        if (now < this.nextMagicBeamHitDemolishTime) {
            return;
        }

        const demolished = this.demolishVoxelSphere(
            hitPoint,
            this.magicBeamHitDemolishRadius,
            this.magicBeamHitDemolishForce,
            forward,
            this.magicBeamHitDemolishSpreadAngle,
            this.magicBeamHitDemolishMaxFragments,
            character,
            null
        );
        if (demolished) {
            this.nextMagicBeamHitDemolishTime = now + this.magicBeamHitDemolishInterval;
        }
    }

    private getLaserLineRenderers(): CS.UnityEngine.LineRenderer[] {
        if (this.laserLineRenderers != null) {
            return this.laserLineRenderers;
        }

        const renderers: CS.UnityEngine.LineRenderer[] = [];
        if (this.laserFX) {
            const list = this.laserFX.GetComponentsInChildren(LineRendererType, true);
            for (let i = 0; i < list.Length; i++) {
                const renderer = list.get_Item(i) as CS.UnityEngine.LineRenderer | null;
                if (renderer) {
                    renderers.push(renderer);
                }
            }
        }

        this.laserLineRenderers = renderers;
        return renderers;
    }

    private hideLaserFX(): void {
        if (this.laserFX && this.laserFX.gameObject) {
            this.laserFX.gameObject.SetActive(false);
        }
        if (this.laserBeginFX && this.laserBeginFX.gameObject) {
            this.laserBeginFX.gameObject.SetActive(false);
        }
        if (this.laserHitFX && this.laserHitFX.gameObject) {
            this.laserHitFX.gameObject.SetActive(false);
        }
        if (this.laserShockwave && this.laserShockwave.gameObject) {
            this.laserShockwave.gameObject.SetActive(false);
        }

        for (const renderer of this.getLaserLineRenderers()) {
            if (renderer) {
                renderer.enabled = false;
            }
        }
        this.laserShockwavePlayed = false;
    }

    private attachLaserFX(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            return;
        }

        this.laserFX_Attached = this.attachTransformToBody(this.laserFX, character, "Torso", this.laserFX_Attached);
        this.laserBeginFX_Attached = this.attachTransformToBody(this.laserBeginFX, character, "Torso", this.laserBeginFX_Attached);
        this.laserHitFX_Attached = this.attachTransformToBody(this.laserHitFX, character, "Torso", this.laserHitFX_Attached);
        this.laserShockwave_Attached = this.attachTransformToBody(
            this.laserShockwave,
            character,
            "Torso",
            this.laserShockwave_Attached
        );
    }

    private playParticleSystems(root: CS.UnityEngine.Transform): void {
        const systems = root.GetComponentsInChildren(ParticleSystemType, true);
        for (let i = 0; i < systems.Length; i++) {
            const ps = systems.get_Item(i) as CS.UnityEngine.ParticleSystem | null;
            if (!ps) {
                continue;
            }

            if (ps.gameObject) {
                ps.gameObject.SetActive(true);
            }
            ps.Stop(true, CS.UnityEngine.ParticleSystemStopBehavior.StopEmittingAndClear);
            ps.Play(true);
        }
    }

    private arePalmsFacing(leftPose: MagicHandPose, rightPose: MagicHandPose): boolean {
        const leftToRight = this.safeDirection(Vec3.op_Subtraction(rightPose.position, leftPose.position), Vec3.right);
        const rightToLeft = Vec3.op_UnaryNegation(leftToRight);
        return Vec3.Dot(leftPose.forward, leftToRight) >= this.magicPalmFacingDot
            && Vec3.Dot(rightPose.forward, rightToLeft) >= this.magicPalmFacingDot;
    }

    private getMagicBreakFireHand(leftPose: MagicHandPose, rightPose: MagicHandPose): boolean | null {
        const leftToRight = this.safeDirection(Vec3.op_Subtraction(rightPose.position, leftPose.position), Vec3.right);
        const rightToLeft = Vec3.op_UnaryNegation(leftToRight);
        const leftFacingDot = Vec3.Dot(leftPose.forward, leftToRight);
        const rightFacingDot = Vec3.Dot(rightPose.forward, rightToLeft);
        const leftBroken = leftFacingDot < this.magicChargeBreakDot;
        const rightBroken = rightFacingDot < this.magicChargeBreakDot;
        const leftCanFire = leftBroken && this.canMagicHandFire(leftPose);
        const rightCanFire = rightBroken && this.canMagicHandFire(rightPose);

        if (!leftCanFire && !rightCanFire) {
            return null;
        }

        if (leftCanFire && rightCanFire) {
            return leftFacingDot <= rightFacingDot;
        }

        return leftCanFire;
    }

    private canMagicHandFire(pose: MagicHandPose): boolean {
        return Vec3.Dot(pose.forward, this.getViewForward()) > this.magicBackwardPalmDot;
    }

    private hasMagicBallFX(): boolean {
        return this.magicball_L != null || this.magicball_R != null || this.magicball_Middle != null;
    }

    private resetMagicBallTargets(): void {
        this.magicball_L_TargetScale = 0;
        this.magicball_R_TargetScale = 0;
        this.magicball_Middle_TargetScale = 0;
        this.magicball_L_TargetPosition = null;
        this.magicball_R_TargetPosition = null;
        this.magicball_Middle_TargetPosition = null;
    }

    private setMagicBallTarget(isLeft: boolean, position: CS.UnityEngine.Vector3, scale: number): void {
        if (isLeft) {
            this.magicball_L_TargetPosition = position;
            this.magicball_L_TargetScale = scale;
        } else {
            this.magicball_R_TargetPosition = position;
            this.magicball_R_TargetScale = scale;
        }
    }

    private setMiddleMagicBallTarget(): void {
        if (!this.magicChargeCenter) {
            return;
        }

        this.magicball_Middle_TargetPosition = this.magicChargeCenter;
        this.magicball_Middle_TargetScale = this.magicChargeBallBaseScale
            + Math.min(this.magicChargeTime * this.magicChargeBallGrowthPerSecond, this.magicChargeBallMaxGrowth);
    }

    private updateMagicBallFX(deltaTime: number): void {
        this.attachMagicBallFX(this.getCharacter());
        this.updateMagicBallTransform(
            this.magicball_L,
            this.magicball_L_TargetPosition,
            this.magicball_L_TargetScale,
            deltaTime
        );
        this.updateMagicBallTransform(
            this.magicball_R,
            this.magicball_R_TargetPosition,
            this.magicball_R_TargetScale,
            deltaTime
        );
        this.updateMagicBallTransform(
            this.magicball_Middle,
            this.magicball_Middle_TargetPosition,
            this.magicball_Middle_TargetScale,
            deltaTime
        );
    }

    private updateMagicBallTransform(
        magicBall: CS.UnityEngine.Transform | null,
        targetPosition: CS.UnityEngine.Vector3 | null,
        targetScale: number,
        deltaTime: number
    ): void {
        if (!magicBall || !magicBall.gameObject) {
            return;
        }

        const currentScale = magicBall.localScale.x;
        const nextScale = Mathf.MoveTowards(currentScale, targetScale, this.magicBallScaleSpeed * deltaTime);
        if (targetScale > 0) {
            magicBall.gameObject.SetActive(true);
            if (targetPosition) {
                magicBall.position = targetPosition;
            }
        }

        magicBall.localScale = Vec3.op_Multiply(Vec3.one, nextScale);
        if (targetScale <= 0 && nextScale <= 0.001) {
            magicBall.localScale = Vec3.zero;
            magicBall.gameObject.SetActive(false);
        }
    }

    private hideMagicBallImmediately(magicBall: CS.UnityEngine.Transform | null): void {
        if (!magicBall || !magicBall.gameObject) {
            return;
        }

        magicBall.localScale = Vec3.zero;
        magicBall.gameObject.SetActive(false);
    }

    private attachMagicBallFX(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            return;
        }

        this.magicball_L_Attached = this.attachMagicBallToBody(
            this.magicball_L,
            character,
            "LeftHand",
            this.magicball_L_Attached
        );
        this.magicball_R_Attached = this.attachMagicBallToBody(
            this.magicball_R,
            character,
            "RightHand",
            this.magicball_R_Attached
        );
        this.magicball_Middle_Attached = this.attachMagicBallToBody(
            this.magicball_Middle,
            character,
            "Torso",
            this.magicball_Middle_Attached
        );
    }

    private attachMagicBallToBody(
        magicBall: CS.UnityEngine.Transform | null,
        character: VX.Entity.EntityCharacter,
        bodyName: string,
        alreadyAttached: boolean
    ): boolean {
        return this.attachTransformToBody(magicBall, character, bodyName, alreadyAttached);
    }

    private attachTransformToBody(
        transform: CS.UnityEngine.Transform | null,
        character: VX.Entity.EntityCharacter,
        bodyName: string,
        alreadyAttached: boolean
    ): boolean {
        if (!transform || alreadyAttached) {
            return alreadyAttached;
        }

        const body = ModAPI.GetCharacterBody(character, bodyName) as CS.Px5.Unity.PxRigidBody | null;
        if (!body) {
            return false;
        }

        transform.SetParent(body.transform);
        return true;
    }

    private updateMagicShield(character: VX.Entity.EntityCharacter | null, active: boolean): void {
        if (!character) {
            this.magicShieldTriggerStartTime = -1;
            this.setShieldActive(this.magicShield, false);
            return;
        }

        this.attachShieldFX(character);
        if (!this.magicShield_CollisionIgnored) {
            this.magicShield_CollisionIgnored = this.ignoreShieldCharacterCollisions(this.magicShield, character);
        }

        const shield = this.magicShield;
        if (!shield || !shield.gameObject) {
            return;
        }

        if (!active) {
            this.magicShieldTriggerStartTime = -1;
            shield.gameObject.SetActive(false);
            return;
        }

        const now = CS.UnityEngine.Time.time;
        if (this.magicShieldTriggerStartTime < 0) {
            this.magicShieldTriggerStartTime = now;
        }

        const delayFinished = now - this.magicShieldTriggerStartTime >= this.magicShieldEnableDelay;
        shield.gameObject.SetActive(delayFinished);
        if (!delayFinished) {
            return;
        }

        shield.position = this.getShieldCenter(character);
        shield.rotation = Quat.identity;
        this.enableShieldPhysics(shield);
        this.drawShieldWireBoxes(shield);
        this.demolishNearShield(shield, character);
    }

    private attachShieldFX(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            return;
        }

        this.magicShield_Attached = this.attachTransformToBody(
            this.magicShield,
            character,
            "Head",
            this.magicShield_Attached
        );
    }

    private getShieldCenter(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const head = ModAPI.GetCharacterBody(character, "Head");
        return head ? head.worldCenterOfMass : this.bindTo.transform.position;
    }

    private ignoreShieldCharacterCollisions(
        shield: CS.UnityEngine.Transform | null,
        character: VX.Entity.EntityCharacter
    ): boolean {
        if (!shield) {
            return true;
        }

        const shieldColliders = shield.GetComponentsInChildren(PxColliderType, true);
        const characterColliders = character.GetComponentsInChildren(PxColliderType, true);
        if (shieldColliders.Length <= 0 || characterColliders.Length <= 0) {
            return false;
        }

        for (let i = 0; i < shieldColliders.Length; i++) {
            const shieldCollider = shieldColliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!shieldCollider) {
                continue;
            }

            for (let j = 0; j < characterColliders.Length; j++) {
                const characterCollider = characterColliders.get_Item(j) as CS.Px5.Unity.PxCollider | null;
                if (!characterCollider || characterCollider === shieldCollider) {
                    continue;
                }

                PxPhysics.IgnoreCollision(shieldCollider, characterCollider, true);
            }
        }

        return true;
    }

    private setShieldActive(shield: CS.UnityEngine.Transform | null, active: boolean): void {
        if (shield && shield.gameObject) {
            shield.gameObject.SetActive(active);
            if (active) {
                this.enableShieldPhysics(shield);
            }
        }
    }

    private enableShieldPhysics(shield: CS.UnityEngine.Transform): void {
        const colliders = shield.GetComponentsInChildren(PxColliderType, true);
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            (collider as any).enabled = true;
            collider.isTrigger = false;
            collider.UpdatePose();
        }

        const rigidbodies = shield.GetComponentsInChildren(PxRigidBodyType, true);
        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!rb) {
                continue;
            }

            (rb as any).enabled = true;
            rb.isKinematic = true;
            rb.useGravity = false;
            rb.detectCollisions = true;
            rb.velocity = Vec3.zero;
            rb.angularVelocity = Vec3.zero;
        }
    }

    private drawShieldWireBoxes(shield: CS.UnityEngine.Transform): void {
        if (!Giz.show) {
            return;
        }

        const boxes = shield.GetComponentsInChildren(PxBoxColliderType, true);
        for (let i = 0; i < boxes.Length; i++) {
            const box = boxes.get_Item(i) as CS.Px5.Unity.PxBoxCollider | null;
            if (!box) {
                continue;
            }

            const center = box.transform.TransformPoint(box.center);
            const scale = box.transform.lossyScale;
            const size = new Vec3(
                Math.abs(box.size.x * scale.x),
                Math.abs(box.size.y * scale.y),
                Math.abs(box.size.z * scale.z)
            );
            Giz.DrawWireBox(center, box.transform.rotation, size, this.shieldGizColor);
        }
    }

    private demolishNearShield(
        shield: CS.UnityEngine.Transform,
        character: VX.Entity.EntityCharacter
    ): void {
        const now = CS.UnityEngine.Time.time;
        if (now < this.nextShieldDemolishTime) {
            return;
        }

        const strikeCenter = this.getShieldCenter(character);
        const strikeDirection = this.getViewForward();
        const demolished = this.demolishVoxelSphere(
            strikeCenter,
            this.flightDemolishRadius,
            this.flightDemolishForce,
            strikeDirection,
            this.flightDemolishSpreadAngle,
            this.flightDemolishMaxFragments,
            character,
            shield
        );

        if (demolished) {
            this.nextShieldDemolishTime = now + this.flightDemolishInterval;
        }
    }

    private demolishVoxelSphere(
        strikeCenter: CS.UnityEngine.Vector3,
        strikeRadius: number,
        strikeForce: number,
        strikeDirection: CS.UnityEngine.Vector3,
        spreadAngleDegrees: number,
        maxFragments: number,
        character: VX.Entity.EntityCharacter,
        ignoreChildOf: CS.UnityEngine.Transform | null
    ): boolean {
        const colliders = PxPhysics.OverlapSphere(
            strikeCenter,
            strikeRadius,
            VX.Engine.LayerMasksHelper.bulletHitLayerMask.value,
            CS.UnityEngine.QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return false;
        }

        let demolished = false;
        const seen = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider || (ignoreChildOf && collider.transform.IsChildOf(ignoreChildOf))) {
                continue;
            }

            const vd = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (!vd || !ModAPI.IsVoxelDestructible(vd) || vd.transform.IsChildOf(character.transform)) {
                continue;
            }

            const id = vd.GetInstanceID();
            if (seen.has(id)) {
                continue;
            }

            seen.add(id);
            ModAPI.DemolishVoxelSphere(
                vd,
                strikeCenter,
                strikeRadius,
                strikeForce,
                strikeDirection,
                spreadAngleDegrees * (Math.PI / 180),
                maxFragments
            );
            demolished = true;
        }

        return demolished;
    }

    private getMagicHandPose(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): MagicHandPose | null {
        const hand = ModAPI.GetCharacterBody(character, isLeft ? "LeftHand" : "RightHand") as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        return {
            position: hand.transform.TransformPoint(new Vec3(0.03, 0.1, 0.05)),
            forward: this.safeDirection(hand.transform.forward, this.getViewForward()),
        };
    }

    private isMagicHoverActive(): boolean {
        return this.magicCharging || this.magicBeamActive;
    }

    private getViewForward(): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        const forward = cam ? cam.transform.forward : this.bindTo.transform.forward;
        return this.safeDirection(forward, Vec3.forward);
    }

    private getViewUp(): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        const up = cam ? cam.transform.up : this.bindTo.transform.up;
        return this.safeDirection(up, Vec3.up);
    }

    private safeDirection(
        direction: CS.UnityEngine.Vector3,
        fallback: CS.UnityEngine.Vector3
    ): CS.UnityEngine.Vector3 {
        if (direction.sqrMagnitude > 0.0001) {
            return direction.normalized;
        }

        return fallback.sqrMagnitude > 0.0001 ? fallback.normalized : Vec3.forward;
    }

    private updateRepulsors(character: VX.Entity.EntityCharacter | null): void {
        if (character == null) {
            this.releaseRepulsor(this.leftRepulsorGun);
            this.releaseRepulsor(this.rightRepulsorGun);
            return;
        }

        this.updateHandRepulsor(character, true, this.input.GetFireLInput() > 0.5);
        this.updateHandRepulsor(character, false, this.input.GetFireRInput() > 0.5);
    }

    private updateHandRepulsor(character: VX.Entity.EntityCharacter, isLeft: boolean, triggerPressed: boolean): void {
        let cache = this.getRepulsorGun(isLeft);
        if (!triggerPressed) {
            if (cache && cache.triggerHeld) {
                this.syncRepulsorGun(character, isLeft, cache);
                this.setRepulsorTrigger(cache, false);
            }
            return;
        }

        cache = cache ?? this.ensureRepulsorGun(isLeft);
        if (!cache) {
            return;
        }

        this.syncRepulsorGun(character, isLeft, cache);
        if (!cache.triggerHeld) {
            this.setRepulsorTrigger(cache, true);
        }
    }

    private getRepulsorGun(isLeft: boolean): HiddenWeaponCache | null {
        return isLeft ? this.leftRepulsorGun : this.rightRepulsorGun;
    }

    private ensureRepulsorGun(isLeft: boolean): HiddenWeaponCache | null {
        const existing = this.getRepulsorGun(isLeft);
        if (existing) {
            return existing;
        }

        const cache = this.createHiddenWeapon(this.repulsorItemKey, this.repulsorAmmo, "repulsor gun");
        if (!cache) {
            return null;
        }
        if (isLeft) {
            this.leftRepulsorGun = cache;
        } else {
            this.rightRepulsorGun = cache;
        }
        return cache;
    }

    private createHiddenWeapon(itemKey: string, ammo: number, label: string): HiddenWeaponCache | null {
        const obj = ModAPI.SpawnItem(itemKey, this.bindTo.transform.position, this.bindTo.transform.rotation);
        if (!obj) {
            ModAPI.Log("DoctorDoom: failed to spawn " + itemKey);
            return null;
        }

        const entity = obj.GetComponent(EntityType) as VX.Entity.Entity | null;
        const weapon = obj.GetComponent(EntityFirableWeaponType) as VX.Entity.EntityFirableWeapon | null;
        if (entity) {
            ModAPI.SetEntityPinned(entity, true);
            ModAPI.SetEntityGravityEnabled(entity, false);
            ModAPI.SetEntityVisible(entity, false);
            this.disableHiddenWeaponPhysics(entity);
        }

        if (weapon) {
            this.setWeaponAmmo(weapon, ammo);
        } else {
            ModAPI.Log("DoctorDoom: spawned " + label + " has no EntityFirableWeapon.");
        }

        return { gameObject: obj, entity, weapon, triggerHeld: false };
    }

    private setWeaponAmmo(weapon: VX.Entity.EntityFirableWeapon, ammo: number): void {
        const weaponView = weapon as any;
        weaponView.magAmmo = ammo;
        weaponView.ammoLeft = ammo;
    }

    private disableHiddenWeaponPhysics(entity: VX.Entity.Entity): void {
        const rigidbodies = ModAPI.GetEntityRigidbodies(entity);
        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!rb) {
                continue;
            }

            rb.velocity = Vec3.zero;
            rb.angularVelocity = Vec3.zero;
            rb.useGravity = false;
            rb.detectCollisions = false;
        }
    }

    private syncRepulsorGun(character: VX.Entity.EntityCharacter, isLeft: boolean, cache: HiddenWeaponCache): void {
        const pose = this.getHandRepulsorPose(character, isLeft);
        this.syncHiddenWeapon(cache, pose.position, pose.rotation);
    }

    private syncHiddenWeapon(
        cache: HiddenWeaponCache,
        position: CS.UnityEngine.Vector3,
        rotation: CS.UnityEngine.Quaternion
    ): void {
        cache.gameObject.transform.position = position;
        cache.gameObject.transform.rotation = rotation;
        if (cache.entity) {
            const rb = ModAPI.GetEntityMainRigidbody(cache.entity);
            if (rb) {
                rb.position = position;
                rb.rotation = rotation;
                rb.velocity = Vec3.zero;
                rb.angularVelocity = Vec3.zero;
                rb.detectCollisions = false;
            }
        }
    }

    private setRepulsorTrigger(cache: HiddenWeaponCache | null, pressed: boolean): void {
        this.setHiddenWeaponTrigger(cache, pressed);
    }

    private setHiddenWeaponTrigger(cache: HiddenWeaponCache | null, pressed: boolean): void {
        if (!cache || !cache.weapon) {
            return;
        }

        ModAPI.SetWeaponTriggerPressed(cache.weapon, pressed);
        cache.triggerHeld = pressed;
    }

    private releaseRepulsor(cache: HiddenWeaponCache | null): void {
        if (cache && cache.triggerHeld) {
            this.setRepulsorTrigger(cache, false);
        }
    }

    private getHandRepulsorPose(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion; forward: CS.UnityEngine.Vector3 } {
        const cam = ModAPI.GetMainCamera();
        const forward = cam ? cam.transform.forward : this.bindTo.transform.forward;
        const up = cam ? cam.transform.up : Vec3.up;
        const side = cam ? cam.transform.right : this.bindTo.transform.right;
        const handBodyName = isLeft ? "LeftHand" : "RightHand";
        const hand = ModAPI.GetCharacterBody(character, handBodyName);

        let position: CS.UnityEngine.Vector3;
        if (hand) {
            position = hand.worldCenterOfMass;
        } else {
            const torso = ModAPI.GetCharacterBody(character, "Torso");
            const basePos = torso ? torso.worldCenterOfMass : this.bindTo.transform.position;
            const sideOffset = Vec3.op_Multiply(side, isLeft ? -this.repulsorFallbackSideOffset : this.repulsorFallbackSideOffset);
            position = Vec3.op_Addition(basePos, sideOffset);
        }

        position = Vec3.op_Addition(position, Vec3.op_Multiply(forward, this.repulsorForwardOffset));
        position = Vec3.op_Addition(
            position,
            Vec3.op_Multiply(side, isLeft ? -this.repulsorOutwardOffset : this.repulsorOutwardOffset)
        );
        return {
            position,
            rotation: Quat.LookRotation(forward, up),
            forward,
        };
    }

    private setContinuousSoundState(soundEvent: CS.Sonity.SoundEvent | null, active: boolean): void {
        if (soundEvent == null) {
            return;
        }

        if (active) {
            if (!ModAPI.IsSoundPlaying(soundEvent, this.bindTo.transform)) {
                ModAPI.PlaySoundOnTransform(soundEvent, this.bindTo.transform);
            }
        } else {
            ModAPI.StopSoundOnTransform(soundEvent, this.bindTo.transform);
        }
    }

    private onDestroy(): void {
        this.deactivateGripFlight(this.getCharacter());
        this.cancelMagicCharge();
        this.releaseMagicBeamGuns();
        this.magicBeamActive = false;
        this.magicBeamRemaining = 0;
        this.hideMagicBallImmediately(this.magicball_L);
        this.hideMagicBallImmediately(this.magicball_R);
        this.hideMagicBallImmediately(this.magicball_Middle);
        this.setShieldActive(this.magicShield, false);
        this.setContinuousSoundState(this.moveJetSound, false);
        this.setContinuousSoundState(this.magicChargingSound, false);
        for (const gun of this.magicBeamGuns) {
            this.destroyHiddenWeapon(gun);
        }
        this.destroyRepulsor(this.leftRepulsorGun);
        this.destroyRepulsor(this.rightRepulsorGun);
        this.leftRepulsorGun = null;
        this.rightRepulsorGun = null;
        this.magicBeamGuns = [];
        this.destroyThrusterFX(this.thrusterFX_L);
        this.destroyThrusterFX(this.thrusterFX_R);
        this.thrusterFX_L = null;
        this.thrusterFX_R = null;
        this.thrusterFX_L_Attached = false;
        this.thrusterFX_R_Attached = false;
        this.magicball_L_Attached = false;
        this.magicball_R_Attached = false;
        this.magicball_Middle_Attached = false;
        this.magicShield_Attached = false;
        this.magicShield_CollisionIgnored = false;
        this.laserFX_Attached = false;
        this.laserBeginFX_Attached = false;
        this.laserHitFX_Attached = false;
        this.laserShockwave_Attached = false;
        this.laserLineRenderers = null;
        this.laserShockwavePlayed = false;
    }

    private destroyRepulsor(cache: HiddenWeaponCache | null): void {
        this.destroyHiddenWeapon(cache);
    }

    private destroyThrusterFX(thrusterFX: CS.UnityEngine.Transform | null): void {
        if (thrusterFX && thrusterFX.gameObject) {
            CS.UnityEngine.Object.Destroy(thrusterFX.gameObject);
        }
    }

    private destroyHiddenWeapon(cache: HiddenWeaponCache | null): void {
        if (!cache) {
            return;
        }

        this.releaseRepulsor(cache);
        CS.UnityEngine.Object.Destroy(cache.gameObject);
    }
}
