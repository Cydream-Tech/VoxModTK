const ModAPI = VX.Mod.ModAPI;
const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const Mathf = CS.UnityEngine.Mathf;
const ForceMode = CS.UnityEngine.ForceMode;
const QueryTriggerInteraction = CS.UnityEngine.QueryTriggerInteraction;
const PxPhysics = CS.Px5.Unity.PxPhysics;
const Color = CS.UnityEngine.Color;
const UnityObject = CS.UnityEngine.Object;
const Giz = VX.Utility.Giz;
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const VoxelDestructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
const PxRigidBodyType = puerts.$typeof(CS.Px5.Unity.PxRigidBody);
const ParticleSystemType = puerts.$typeof(CS.UnityEngine.ParticleSystem);
const AnimationType = puerts.$typeof(CS.UnityEngine.Animation);

enum GojoAbilityMode {
    None,
    Slowdown,
    Singularity,
    RedCharge,
    RedBallCharge,
    PurpleCharge,
}

interface SlowedCharacter {
    character: VX.Entity.EntityCharacter;
    animator: CS.UnityEngine.Animator | null;
    animatorSpeed: number;
}

interface SlowedRigidBody {
    rb: CS.Px5.Unity.PxRigidBody;
    maxLinearVelocity: number;
    maxAngularVelocity: number;
}

interface RedLaunchedCharacter {
    character: VX.Entity.EntityCharacter;
    direction: CS.UnityEngine.Vector3;
    startTime: number;
    startPosition: CS.UnityEngine.Vector3;
    lastPosition: CS.UnityEngine.Vector3;
    lastSampleTime: number;
}

interface RedProjectile {
    ownerIsLeft: boolean;
    position: CS.UnityEngine.Vector3;
    direction: CS.UnityEngine.Vector3;
    distance: number;
    piercedVoxelIds: Set<number>;
    fx: CS.UnityEngine.Transform | null;
}

interface RedBallProjectile {
    ownerIsLeft: boolean;
    position: CS.UnityEngine.Vector3;
    direction: CS.UnityEngine.Vector3;
    distance: number;
    fx: CS.UnityEngine.Transform | null;
}

interface PurpleProjectile {
    position: CS.UnityEngine.Vector3;
    direction: CS.UnityEngine.Vector3;
    distance: number;
    nextDemolishTime: number;
    voidStartTime: number;
    nextVortexRefreshTime: number;
    vortexRigidbodies: CS.Px5.Unity.PxRigidBody[];
    fx: CS.UnityEngine.Transform | null;
}

interface PendingRedBallExplosion {
    character: VX.Entity.EntityCharacter;
    direction: CS.UnityEngine.Vector3;
    triggerTime: number;
}

interface HandState {
    isLeft: boolean;
    gripHeld: boolean;
    rb: CS.Px5.Unity.PxRigidBody | null;
}

interface HandFxRefs {
    handMagicOrb: CS.UnityEngine.Transform | null;
    slowdownFX: CS.UnityEngine.Transform | null;
    singularityFX: CS.UnityEngine.Transform | null;
    redFxRoot: CS.UnityEngine.Transform | null;
    redDotFX: CS.UnityEngine.Transform | null;
    redDotHitFX: CS.UnityEngine.Transform | null;
    redBallFX: CS.UnityEngine.Transform | null;
    redBallHitFX: CS.UnityEngine.Transform | null;
    slowdownFXBaseScale: CS.UnityEngine.Vector3;
    singularityFXBaseScale: CS.UnityEngine.Vector3;
    redDotFXBaseScale: CS.UnityEngine.Vector3;
    redDotHitFXBaseScale: CS.UnityEngine.Vector3;
    redBallFXBaseScale: CS.UnityEngine.Vector3;
    redBallHitFXBaseScale: CS.UnityEngine.Vector3;
    orbAttachedHandIsLeft: boolean | null;
    redHitFxTimer: number;
    redBallHitFxTimer: number;
}

interface HandAbilityRuntime {
    isLeft: boolean;
    mode: GojoAbilityMode;
    fx: HandFxRefs;
    singularityLocalOffset: CS.UnityEngine.Vector3 | null;
    singularityTargetPosition: CS.UnityEngine.Vector3 | null;
    previousControlHandLocalPosition: CS.UnityEngine.Vector3 | null;
    lastSingularityHandWorldDelta: CS.UnityEngine.Vector3;
    singularityOrbFlightScaleExtra: number;
    attractedRigidbodies: Map<number, CS.Px5.Unity.PxRigidBody>;
    ccdRigidbodyOriginalModes: Map<number, CS.UnityEngine.CollisionDetectionMode>;
    nextSingularityDemolishTime: number;
    redProjectilePosition: CS.UnityEngine.Vector3;
    redProjectileDirection: CS.UnityEngine.Vector3;
    redPiercedVoxelIds: Set<number>;
    redBallPosition: CS.UnityEngine.Vector3;
    redBallDirection: CS.UnityEngine.Vector3;
}

/**
 * Satoru Gojo avatar ability.
 *
 * Controls:
 * - Hold either Grip while the hand is in front of the body.
 * - Quickly swing along that hand body's forward direction to activate.
 * - Keep holding Grip to maintain the slow field. Release Grip to cancel.
 *
 * Prefab contract:
 * - JsComponentProxy ClassName: Gojo
 * - JsProperties Transform property: blueFxRoot
 * - Optional legacy JsProperties Transform property: handMagicOrb
 * - Optional JsProperties Transform properties: slowdownFX, singularityFX, redFxRoot, redDotFX, redDotHitFX, redBallFX, redBallHitFX
 * - Optional JsProperties Transform properties: purpleFxRoot, purpleFx, purpleHitFx
 */
export class Gojo {
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null;
    private input: VX.Mod.ModAPI.Input;

    private readonly gripThreshold = 0.5;
    private readonly triggerThreshold = 0.5;
    private readonly activationSwingSpeed = 1.0;
    private readonly singularityActivationSwingSpeed = 0.9;
    private readonly redActivationSwingSpeed = 0.9;
    private readonly handInFrontDot = 0.18;
    private readonly slowRadius = 7.0;
    private readonly slowRadiusSqr = this.slowRadius * this.slowRadius;
    private readonly slowMovementScale = 0.002;
    private readonly slowAnimatorScale = 0.04;
    private readonly slowRigidBodyMaxLinearSpeed = 0.001;
    private readonly slowRigidBodyMaxAngularSpeed = 0.001;
    private readonly orbForwardOffset = 0.18;
    private readonly orbScale = 0.22;
    private readonly singularityOrbScale = 0.36;
    private readonly singularityOrbFlySpeedStart = 4.0;
    private readonly singularityOrbFlySpeedFull = 50.0;
    private readonly singularityOrbFlyMaxExtraScale = 0.45;
    private readonly singularityOrbFlyRecoverSpeed = 0.9;
    private readonly orbScaleSpeed = 6.0;
    private readonly orbPositionLerpSpeed = 12.0;
    private readonly abilityFxScaleSpeed = 6.0;
    private readonly singularityMinDistance = 0.25;
    private readonly singularityHandDeltaMultiplier = 8.0;
    private readonly singularityDeltaBoostStart = 0.015;
    private readonly singularityDeltaBoostFull = 0.18;
    private readonly singularityDeltaExtraMultiplier = 4.0;
    private readonly singularityDistanceBoostStart = 2.0;
    private readonly singularityDistanceBoostFull = 12.0;
    private readonly singularityDistanceExtraMultiplier = 3.0;
    private readonly singularityHighSpeedStart = 0.25;
    private readonly singularityHighSpeedFull = 4.0;
    private readonly singularityHighSpeedExtraMultiplier = 5.0;
    private readonly singularityMaxTargetMoveSpeed = 185.0;
    private readonly singularityStickDeadzone = 0.12;
    private readonly singularityStickPushSpeed = 7.0;
    private readonly singularityStickDistanceExtraMultiplier = 2.5;
    private readonly singularityAttractRadius = 8.0;
    private readonly singularityAttractRadiusSqr = this.singularityAttractRadius * this.singularityAttractRadius;
    private readonly singularityOrbitRadius = 2.0;
    private readonly singularityAttractSpeed = 45.0;
    private readonly singularityRadialSpringSpeed = 30.0;
    private readonly singularityOrbitSpeed = 51.0;
    private readonly singularityVerticalSpringSpeed = 18.0;
    private readonly singularityVelocityBlend = 0.46;
    private readonly singularityDemolishRadius = 2.5;
    private readonly singularityDemolishForce = 10.0;
    private readonly singularityDemolishSpreadAngle = 100.0;
    private readonly singularityDemolishMaxFragments = 32;
    private readonly singularityDemolishInterval = 0.08;
    private readonly singularityDemolishMinRbVolume = 1.0;
    private readonly singularityCcdRbVolume = 1.0;
    private readonly singularityCcdSelectionModulo = 20;
    private readonly redDotForwardOffset = 0.24;
    private readonly redDotFollowTime = 0.03;
    private readonly redProjectileRadius = 0.22;
    private readonly redProjectileSpeed = 68.0;
    private readonly redProjectileMaxDistance = 120.0;
    private readonly redBallForwardOffset = 0.34;
    private readonly redBallFollowTime = 0.04;
    private readonly redBallProjectileRadius = 0.46;
    private readonly redBallProjectileSpeed = 56.0;
    private readonly redBallProjectileMaxDistance = 90.0;
    private readonly redBallLaunchExtraOffset = 0.65;
    private readonly redBallDigRadius = 1.7;
    private readonly redBallCharacterDigRadius = 0.25;
    private readonly redBallCharacterDigRadiusBoundsScale = 0.3;
    private readonly redBallCharacterDigMaxRadius = 1.25;
    private readonly redBallCharacterDigRepeatRadiusStart = 0.7;
    private readonly redBallCharacterDigRepeatRadiusStep = 0.35;
    private readonly redBallCharacterDigMaxPasses = 5;
    private readonly redBallCharacterDigPassBackOffset = -0.35;
    private readonly redBallCharacterDigPassForwardOffset = 0.65;
    private readonly redBallCharacterDigMaxFragments = 30;
    private readonly redBallCharacterHardnessCap = 100.0;
    private readonly redBallDigForce = 85.0;
    private readonly redBallDigMaxFragments = 48;
    private readonly redBallExplosionDelay = 1.0;
    private readonly redBallExplosionRadius = 12.0;
    private readonly redBallExplosionForce = 30.0;
    private readonly redBallExplosionMaxFragments = 60;
    private readonly redBallExplosionObjectVelocityMultiplier = 0.45;
    private readonly redNpcPushVelocity = 95.0;
    private readonly redObjectPushVelocity = 42.0;
    private readonly redDemolishRadius = 1.25;
    private readonly redDemolishForce = 70.0;
    private readonly redDemolishSpreadAngle = 45.0;
    private readonly redDemolishMaxFragments = 42;
    private readonly redHitFxDuration = 0.35;
    private readonly redLaunchedExplosionRadius = 4.5;
    private readonly redLaunchedExplosionForce = 95.0;
    private readonly redLaunchedExplosionMaxFragments = 72;
    private readonly redLaunchedContactRadius = 1.35;
    private readonly redLaunchedExplosionGraceTime = 0.12;
    private readonly redLaunchedWallImpactGraceTime = 0.35;
    private readonly redLaunchedWallImpactMinTravel = 2.0;
    private readonly redLaunchedWallMinHorizontalContact = 0.42;
    private readonly redLaunchedWallForwardDot = 0.18;
    private readonly redLaunchedForcedExplosionTime = 2.0;
    private readonly redLaunchedMaxTrackTime = 3.0;
    private readonly purpleCombineDistance = 0.9;
    private readonly purpleFollowTime = 0.1;
    private readonly purpleManualAppearDuration = 0.6;
    private readonly purpleIngredientFadeDuration = 0.4;
    private readonly purpleIngredientFadeMinScale = 0.4;
    private readonly purpleIngredientMergeLerpSpeed = 18.0;
    private readonly purpleHandForwardDot = 0.72;
    private readonly purpleHandForwardOffset = 3.0;
    private readonly purpleScale = 0.72;
    private readonly purpleProjectileRadius = 10.0;
    private readonly purpleProjectileSpeed = 18.0;
    private readonly purpleProjectileMaxDistance = 80.0;
    private readonly purpleDemolishInterval = 0.2;
    private readonly purpleChargeDemolishRadius = 6.0;
    private readonly purpleChargeDemolishInterval = 0.22;
    private readonly purpleIndestructibleProbeRadius = 1.5;
    private readonly purpleVoidRaycastDistance = 100.0;
    private readonly purpleVoidTerminateDelay = 4.0;
    private readonly purpleProjectileMaxScaleMultiplier = 6.0;
    private readonly purpleDemolishForce = 40;
    private readonly purpleDemolishMaxFragments = 36;
    private readonly purpleHardnessCap = 100.0;
    private readonly purpleVortexOrbitRadiusMultiplier = 0.5;
    private readonly purpleVortexAttractSpeed = 34.0;
    private readonly purpleVortexRadialSpringSpeed = 22.0;
    private readonly purpleVortexOrbitSpeed = 48.0;
    private readonly purpleVortexAxialSpringSpeed = 24.0;
    private readonly purpleVortexVelocityBlend = 0.42;
    private readonly purpleVortexAttractRadiusMultiplier = 1.8;
    private readonly purpleVortexOverlapInterval = 0.1;
    private readonly purpleVortexMaxRigidbodiesPerRefresh = 64;
    private readonly purpleVortexMaxRbVolume = 120.0;
    private readonly purpleHitFxDuration = 0.65;

    private handMagicOrb: CS.UnityEngine.Transform | null = null;
    private slowdownFX: CS.UnityEngine.Transform | null = null;
    private singularityFX: CS.UnityEngine.Transform | null = null;
    private redFxRoot: CS.UnityEngine.Transform | null = null;
    private redDotFX: CS.UnityEngine.Transform | null = null;
    private redDotHitFX: CS.UnityEngine.Transform | null = null;
    private redBallFX: CS.UnityEngine.Transform | null = null;
    private redBallHitFX: CS.UnityEngine.Transform | null = null;
    private purpleFxRoot: CS.UnityEngine.Transform | null = null;
    private purpleFX: CS.UnityEngine.Transform | null = null;
    private purpleHitFX: CS.UnityEngine.Transform | null = null;
    private purpleFXBaseScale: CS.UnityEngine.Vector3 = Vec3.one;
    private purpleHitFXBaseScale: CS.UnityEngine.Vector3 = Vec3.one;
    private purpleFXHasAnimation = false;
    private purpleChargeIntroActive = false;
    private purpleChargeIntroTime = 0;
    private purpleChargeIntroFrom: CS.UnityEngine.Vector3 = Vec3.zero;
    private purpleChargeIntroTo: CS.UnityEngine.Vector3 = Vec3.zero;
    private purpleIngredientFadeTime = 0;
    private mode = GojoAbilityMode.None;
    private leftAbility: HandAbilityRuntime;
    private rightAbility: HandAbilityRuntime;
    private slowedCharacters = new Map<number, SlowedCharacter>();
    private slowedRigidbodies = new Map<number, SlowedRigidBody>();
    private redProjectiles: RedProjectile[] = [];
    private redBallProjectiles: RedBallProjectile[] = [];
    private pendingRedBallExplosions: PendingRedBallExplosion[] = [];
    private redLaunchedCharacters = new Map<number, RedLaunchedCharacter>();
    private purplePosition: CS.UnityEngine.Vector3 = Vec3.zero;
    private purpleDirection: CS.UnityEngine.Vector3 = Vec3.forward;
    private purpleControlHandIsLeft: boolean | null = null;
    private purpleBlueIngredientHandIsLeft: boolean | null = null;
    private purpleRedIngredientHandIsLeft: boolean | null = null;
    private purpleBlueIngredientPosition: CS.UnityEngine.Vector3 = Vec3.zero;
    private purpleRedIngredientPosition: CS.UnityEngine.Vector3 = Vec3.zero;
    private purpleProjectiles: PurpleProjectile[] = [];
    private purpleHitFxTimer = 0;
    private purpleHitFxScale: CS.UnityEngine.Vector3 = Vec3.one;
    private nextPurpleChargeDemolishTime = 0;
    private nextPurpleChargeVortexRefreshTime = 0;
    private purpleChargeVortexRigidbodies: CS.Px5.Unity.PxRigidBody[] = [];

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Gojo constructor");
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        this.input = new VX.Mod.ModAPI.Input();
        this.leftAbility = this.createHandRuntime(true);
        this.rightAbility = this.createHandRuntime(false);
        this.readProperties();

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
        CS.UnityEngine.Debug.Log("Gojo initialized");
    }

    private createHandRuntime(isLeft: boolean): HandAbilityRuntime {
        return {
            isLeft,
            mode: GojoAbilityMode.None,
            fx: this.createEmptyHandFxRefs(),
            singularityLocalOffset: null,
            singularityTargetPosition: null,
            previousControlHandLocalPosition: null,
            lastSingularityHandWorldDelta: Vec3.zero,
            singularityOrbFlightScaleExtra: 0,
            attractedRigidbodies: new Map<number, CS.Px5.Unity.PxRigidBody>(),
            ccdRigidbodyOriginalModes: new Map<number, CS.UnityEngine.CollisionDetectionMode>(),
            nextSingularityDemolishTime: 0,
            redProjectilePosition: Vec3.zero,
            redProjectileDirection: Vec3.forward,
            redPiercedVoxelIds: new Set<number>(),
            redBallPosition: Vec3.zero,
            redBallDirection: Vec3.forward,
        };
    }

    private createEmptyHandFxRefs(): HandFxRefs {
        return {
            handMagicOrb: null,
            slowdownFX: null,
            singularityFX: null,
            redFxRoot: null,
            redDotFX: null,
            redDotHitFX: null,
            redBallFX: null,
            redBallHitFX: null,
            slowdownFXBaseScale: Vec3.one,
            singularityFXBaseScale: Vec3.one,
            redDotFXBaseScale: Vec3.one,
            redDotHitFXBaseScale: Vec3.one,
            redBallFXBaseScale: Vec3.one,
            redBallHitFXBaseScale: Vec3.one,
            orbAttachedHandIsLeft: null,
            redHitFxTimer: 0,
            redBallHitFxTimer: 0,
        };
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (!props) {
            return;
        }

        this.handMagicOrb = (props.Get("blueFxRoot") as CS.UnityEngine.Transform)
            ?? (props.Get("handMagicOrb") as CS.UnityEngine.Transform);
        this.slowdownFX = props.Get("slowdownFX") as CS.UnityEngine.Transform;
        this.singularityFX = props.Get("singularityFX") as CS.UnityEngine.Transform;
        this.redFxRoot = props.Get("redFxRoot") as CS.UnityEngine.Transform;
        this.redDotFX = (props.Get("redDotFX") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.redFxRoot, "redDotFX");
        this.redDotHitFX = (props.Get("redDotHitFX") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.redFxRoot, "redDotHitFX");
        this.redBallFX = (props.Get("redBallFX") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.redFxRoot, "redBallFX");
        this.redBallHitFX = (props.Get("redBallHitFX") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.redFxRoot, "redBallHitFX");
        this.purpleFxRoot = props.Get("purpleFxRoot") as CS.UnityEngine.Transform;
        this.purpleFX = (props.Get("purpleFx") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.purpleFxRoot, "purpleFx");
        this.purpleHitFX = (props.Get("purpleHitFx") as CS.UnityEngine.Transform)
            ?? this.findChildTransform(this.purpleFxRoot, "purpleHitFx");
        this.purpleFXBaseScale = this.getConfiguredFxScale(this.purpleFX);
        this.purpleHitFXBaseScale = this.getConfiguredFxScale(this.purpleHitFX);
        this.purpleFXHasAnimation = this.hasAnimationComponent(this.purpleFX);
    }

    private onStart(): void {
        const character = this.getCharacter();
        this.setupPerHandFx(character);
        this.ensurePurpleFxRootAttachedToHand(character, false);
        this.hideOrbImmediately(this.leftAbility);
        this.hideOrbImmediately(this.rightAbility);
        this.hideAbilityFxImmediately(this.leftAbility);
        this.hideAbilityFxImmediately(this.rightAbility);
        this.hideRedFxImmediately(this.leftAbility);
        this.hideRedFxImmediately(this.rightAbility);
        this.hidePurpleFxImmediately();
    }

    private setupPerHandFx(character: VX.Entity.EntityCharacter | null): void {
        const leftBlueRoot = this.handMagicOrb;
        const rightBlueRoot = this.cloneTransform(leftBlueRoot, "Right");
        const leftRedRoot = this.redFxRoot;
        const rightRedRoot = this.cloneTransform(leftRedRoot, "Right");

        this.assignHandFxRefs(
            this.leftAbility,
            leftBlueRoot,
            this.slowdownFX,
            this.singularityFX,
            leftRedRoot,
            this.redDotFX,
            this.redDotHitFX,
            this.redBallFX,
            this.redBallHitFX
        );
        this.assignHandFxRefs(
            this.rightAbility,
            rightBlueRoot,
            this.findMirroredChild(rightBlueRoot, this.slowdownFX, "slowdownFX"),
            this.findMirroredChild(rightBlueRoot, this.singularityFX, "singularityFX"),
            rightRedRoot,
            this.findMirroredChild(rightRedRoot, this.redDotFX, "redDotFX"),
            this.findMirroredChild(rightRedRoot, this.redDotHitFX, "redDotHitFX"),
            this.findMirroredChild(rightRedRoot, this.redBallFX, "redBallFX"),
            this.findMirroredChild(rightRedRoot, this.redBallHitFX, "redBallHitFX")
        );

        this.ensureOrbAttachedToHand(this.leftAbility, character, true);
        this.ensureOrbAttachedToHand(this.rightAbility, character, false);
        this.ensureRedFxRootAttachedToHand(this.leftAbility, character, true);
        this.ensureRedFxRootAttachedToHand(this.rightAbility, character, false);
    }

    private assignHandFxRefs(
        runtime: HandAbilityRuntime,
        blueRoot: CS.UnityEngine.Transform | null,
        slowdownFX: CS.UnityEngine.Transform | null,
        singularityFX: CS.UnityEngine.Transform | null,
        redRoot: CS.UnityEngine.Transform | null,
        redDotFX: CS.UnityEngine.Transform | null,
        redDotHitFX: CS.UnityEngine.Transform | null,
        redBallFX: CS.UnityEngine.Transform | null,
        redBallHitFX: CS.UnityEngine.Transform | null
    ): void {
        runtime.fx.handMagicOrb = blueRoot;
        runtime.fx.slowdownFX = slowdownFX;
        runtime.fx.singularityFX = singularityFX;
        runtime.fx.redFxRoot = redRoot;
        runtime.fx.redDotFX = redDotFX;
        runtime.fx.redDotHitFX = redDotHitFX;
        runtime.fx.redBallFX = redBallFX;
        runtime.fx.redBallHitFX = redBallHitFX;
        runtime.fx.slowdownFXBaseScale = this.getConfiguredFxScale(slowdownFX);
        runtime.fx.singularityFXBaseScale = this.getConfiguredFxScale(singularityFX);
        runtime.fx.redDotFXBaseScale = this.getConfiguredFxScale(redDotFX);
        runtime.fx.redDotHitFXBaseScale = this.getConfiguredFxScale(redDotHitFX);
        runtime.fx.redBallFXBaseScale = this.getConfiguredFxScale(redBallFX);
        runtime.fx.redBallHitFXBaseScale = this.getConfiguredFxScale(redBallHitFX);
        runtime.fx.orbAttachedHandIsLeft = null;
        runtime.fx.redHitFxTimer = 0;
        runtime.fx.redBallHitFxTimer = 0;
    }

    private cloneTransform(source: CS.UnityEngine.Transform | null, suffix: string): CS.UnityEngine.Transform | null {
        if (!this.isUnityObjectAlive(source)) {
            return null;
        }

        const cloneObject = UnityObject.Instantiate(source.gameObject) as CS.UnityEngine.GameObject | null;
        if (!cloneObject) {
            return null;
        }

        cloneObject.name = source.gameObject.name + "_" + suffix;
        return cloneObject.transform;
    }

    private findMirroredChild(
        clonedRoot: CS.UnityEngine.Transform | null,
        originalChild: CS.UnityEngine.Transform | null,
        fallbackName: string
    ): CS.UnityEngine.Transform | null {
        if (!this.isUnityObjectAlive(clonedRoot)) {
            return this.cloneTransform(originalChild, "Right");
        }

        const childName = this.isUnityObjectAlive(originalChild) ? originalChild.name : fallbackName;
        return this.findChildTransformRecursive(clonedRoot, childName)
            ?? this.findChildTransformRecursive(clonedRoot, fallbackName)
            ?? null;
    }

    private onUpdate(deltaTime: number): void {
        const character = this.getCharacter();
        this.updateOrbAttachment(this.leftAbility, character);
        this.updateOrbAttachment(this.rightAbility, character);
        this.updateAbilityState(character);
        this.updateSlowField(character);
        this.updateSingularityTarget(this.leftAbility, character, deltaTime);
        this.updateSingularityTarget(this.rightAbility, character, deltaTime);
        this.updateRedDotFx(this.leftAbility, character, deltaTime);
        this.updateRedDotFx(this.rightAbility, character, deltaTime);
        this.updateRedBallFx(this.leftAbility, character, deltaTime);
        this.updateRedBallFx(this.rightAbility, character, deltaTime);
        this.updatePurpleFx(character, deltaTime);
        this.updateRedHitFx(this.leftAbility, deltaTime);
        this.updateRedHitFx(this.rightAbility, deltaTime);
        this.updateRedBallHitFx(this.leftAbility, deltaTime);
        this.updateRedBallHitFx(this.rightAbility, deltaTime);
        this.updatePurpleHitFx(deltaTime);
        this.updateOrb(this.leftAbility, character, deltaTime);
        this.updateOrb(this.rightAbility, character, deltaTime);
        this.updateAbilityFx(this.leftAbility, deltaTime);
        this.updateAbilityFx(this.rightAbility, deltaTime);
    }

    private onFixedUpdate(deltaTime: number): void {
        const character = this.getCharacter();
        if (character && this.hasActiveSlowdown()) {
            this.updateSlowRigidbodies(character);
        } else {
            this.restoreAllSlowedRigidbodies();
        }

        if (character && this.leftAbility.mode === GojoAbilityMode.Singularity) {
            this.updateSingularityPhysics(this.leftAbility, character, deltaTime);
        }

        if (character && this.rightAbility.mode === GojoAbilityMode.Singularity) {
            this.updateSingularityPhysics(this.rightAbility, character, deltaTime);
        }

        if (character && this.redProjectiles.length > 0) {
            this.updateRedProjectiles(character, deltaTime);
        }

        if (character && this.redBallProjectiles.length > 0) {
            this.updateRedBallProjectiles(character, deltaTime);
        }

        if (character && this.purpleProjectiles.length > 0) {
            this.updatePurpleProjectiles(character, deltaTime);
        }

        if (character && this.mode === GojoAbilityMode.PurpleCharge) {
            this.updatePurpleChargeDemolish(character, deltaTime);
        }

        if (character) {
            this.updateRedLaunchedCharacters(character);
            this.updatePendingRedBallExplosions(character);
        }
    }

    private updateAbilityState(character: VX.Entity.EntityCharacter | null): void {
        if (!character) {
            this.deactivateAllAbilities();
            return;
        }

        const left = this.getHandState(character, true);
        const right = this.getHandState(character, false);
        if (this.mode === GojoAbilityMode.PurpleCharge) {
            this.updatePurpleChargeInput(character, left, right);
            return;
        }

        if (this.updatePurpleFormation(character, left, right)) {
            return;
        }

        this.updateHandAbilityState(this.leftAbility, character, left);
        this.updateHandAbilityState(this.rightAbility, character, right);
    }

    private updateHandAbilityState(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        hand: HandState
    ): void {
        if (runtime.mode === GojoAbilityMode.RedCharge) {
            if (!hand.gripHeld) {
                this.beginRedProjectile(runtime, character, hand);
                return;
            }

            if (this.isTriggerHeld(hand.isLeft)) {
                this.beginRedBallCharge(runtime, character, hand);
            }
            return;
        }

        if (runtime.mode === GojoAbilityMode.RedBallCharge) {
            if (!hand.gripHeld) {
                this.deactivateHandAbility(runtime);
                return;
            }

            if (!this.isTriggerHeld(hand.isLeft)) {
                this.beginRedBallProjectile(runtime, character, hand);
            }
            return;
        }

        if (runtime.mode === GojoAbilityMode.Slowdown || runtime.mode === GojoAbilityMode.Singularity) {
            if (!hand.gripHeld) {
                this.deactivateHandAbility(runtime);
                return;
            }

            if (runtime.mode === GojoAbilityMode.Slowdown && this.isSingularityUpgradeGesture(character, hand)) {
                this.beginSingularity(runtime, character);
            }
            return;
        }

        if (this.isDirectSingularityGesture(character, hand)) {
            this.beginSingularity(runtime, character, this.getHandOrbStartPosition(character, hand.isLeft));
            return;
        }

        if (!this.isHandBlueOccupied(runtime.isLeft) && this.isRedActivationGesture(character, hand)) {
            this.beginRedCharge(runtime, character, hand.isLeft);
            return;
        }

        if (this.isActivationGesture(character, hand)) {
            this.beginAbility(runtime, character, hand.isLeft);
        }
    }

    private beginAbility(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, isLeft: boolean): void {
        this.deactivateHandAbility(runtime);
        runtime.mode = GojoAbilityMode.Slowdown;
        this.ensureOrbAttachedToHand(runtime, character, isLeft);
        this.snapOrbToCurrentTarget(runtime, character);
    }

    private beginSingularity(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        startPosition: CS.UnityEngine.Vector3 | null = null
    ): void {
        runtime.mode = GojoAbilityMode.Singularity;
        runtime.singularityLocalOffset = this.createInitialSingularityLocalOffset(runtime, character, startPosition);
        runtime.singularityTargetPosition = this.getSingularityWorldTarget(runtime, character);
        const sample = this.getControlHandSample(runtime, character);
        runtime.previousControlHandLocalPosition = sample ? sample.localPosition : null;
        runtime.lastSingularityHandWorldDelta = Vec3.zero;
        this.restoreCcdRigidbodies(runtime);
        runtime.attractedRigidbodies.clear();
        this.detachMagicOrbFromHand(runtime);
        this.snapOrbToCurrentTarget(runtime, character);
        runtime.nextSingularityDemolishTime = 0;
    }

    private beginRedCharge(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, isLeft: boolean): void {
        if (this.isHandBlueOccupied(runtime.isLeft)) {
            return;
        }

        this.deactivateHandAbility(runtime);
        runtime.mode = GojoAbilityMode.RedCharge;

        const target = this.getRedDotHandTarget(character, isLeft);
        runtime.redProjectilePosition = target ? target.position : this.getCharacterCenter(character);
        runtime.redProjectileDirection = target ? target.direction : this.getViewForward();
        runtime.redPiercedVoxelIds.clear();
        this.detachRedDotFx(runtime);
        this.restartRedDotToPosition(runtime, runtime.redProjectilePosition, runtime.redProjectileDirection);
    }

    private cancelRedProjectilesForHand(isLeft: boolean): void {
        if (this.redProjectiles.length <= 0) {
            return;
        }

        const remaining: RedProjectile[] = [];
        for (const projectile of this.redProjectiles) {
            if (projectile.ownerIsLeft !== isLeft) {
                remaining.push(projectile);
            } else {
                this.destroyProjectileFx(projectile.fx);
            }
        }

        this.redProjectiles = remaining;
    }

    private beginRedProjectile(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.rb) {
            this.deactivateHandAbility(runtime);
            return;
        }

        const target = this.getRedDotHandTarget(character, hand.isLeft);
        runtime.redProjectilePosition = target ? target.position : runtime.redProjectilePosition;
        runtime.redProjectileDirection = this.safeDirection(hand.rb.transform.up, this.getViewForward());
        runtime.redPiercedVoxelIds.clear();
        const projectileFx = this.createProjectileFxClone(
            runtime.fx.redDotFX,
            "RedDotProjectile",
            runtime.redProjectilePosition,
            runtime.redProjectileDirection,
            runtime.fx.redDotFXBaseScale
        );
        this.redProjectiles.push({
            ownerIsLeft: runtime.isLeft,
            position: runtime.redProjectilePosition,
            direction: runtime.redProjectileDirection,
            distance: 0,
            piercedVoxelIds: new Set<number>(),
            fx: projectileFx,
        });
        runtime.mode = GojoAbilityMode.None;
        this.detachRedDotFx(runtime);
        this.hideRedDotImmediately(runtime);
    }

    private beginRedBallCharge(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.rb) {
            this.deactivateHandAbility(runtime);
            return;
        }

        runtime.mode = GojoAbilityMode.RedBallCharge;
        const target = this.getRedBallHandTarget(character, hand.isLeft);
        runtime.redBallPosition = target ? target.position : hand.rb.worldCenterOfMass;
        runtime.redBallDirection = target ? target.direction : this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        this.hideRedDotImmediately(runtime);
        this.hideRedBallImmediately(runtime);
        this.restartRedBallToPosition(runtime, runtime.redBallPosition, runtime.redBallDirection);
    }

    private cancelRedBallProjectilesForHand(isLeft: boolean): void {
        if (this.redBallProjectiles.length <= 0) {
            return;
        }

        const remaining: RedBallProjectile[] = [];
        for (const projectile of this.redBallProjectiles) {
            if (projectile.ownerIsLeft !== isLeft) {
                remaining.push(projectile);
            } else {
                this.destroyProjectileFx(projectile.fx);
            }
        }

        this.redBallProjectiles = remaining;
    }

    private beginRedBallProjectile(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.rb) {
            this.deactivateHandAbility(runtime);
            return;
        }

        const target = this.getRedBallHandTarget(character, hand.isLeft);
        runtime.redBallPosition = target ? target.position : runtime.redBallPosition;
        runtime.redBallDirection = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        runtime.redBallPosition = Vec3.op_Addition(
            runtime.redBallPosition,
            Vec3.op_Multiply(runtime.redBallDirection, this.redBallLaunchExtraOffset)
        );
        const projectileFx = this.createProjectileFxClone(
            runtime.fx.redBallFX,
            "RedBallProjectile",
            runtime.redBallPosition,
            runtime.redBallDirection,
            runtime.fx.redBallFXBaseScale
        );
        this.redBallProjectiles.push({
            ownerIsLeft: runtime.isLeft,
            position: runtime.redBallPosition,
            direction: runtime.redBallDirection,
            distance: 0,
            fx: projectileFx,
        });
        runtime.mode = GojoAbilityMode.None;
        this.hideRedBallImmediately(runtime);
    }

    private updatePurpleFormation(
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState
    ): boolean {
        this.updatePurpleIngredientLatches(character, left, right);

        const blue = this.getPurpleBlueIngredient(character);
        const red = this.getPurpleRedIngredient(character);
        if (!blue || !red || blue.isLeft === red.isLeft) {
            return false;
        }

        const distance = Vec3.Distance(blue.position, red.position);
        if (distance > this.purpleCombineDistance) {
            return false;
        }

        this.beginPurpleCharge(
            character,
            blue.isLeft,
            red.isLeft,
            Vec3.Lerp(blue.position, red.position, 0.5),
            this.safeDirection(Vec3.op_Addition(blue.direction, red.direction), this.getViewForward())
        );
        return true;
    }

    private updatePurpleIngredientLatches(
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState
    ): void {
        const blueHand = this.getActiveHandForMode(GojoAbilityMode.Singularity);
        const redHand = this.getActiveHandForMode(GojoAbilityMode.RedBallCharge);

        this.purpleBlueIngredientHandIsLeft = this.updatePurpleIngredientLatch(
            this.purpleBlueIngredientHandIsLeft,
            blueHand,
            character,
            left,
            right,
            true
        );
        this.purpleRedIngredientHandIsLeft = this.updatePurpleIngredientLatch(
            this.purpleRedIngredientHandIsLeft,
            redHand,
            character,
            left,
            right,
            false
        );
    }

    private updatePurpleIngredientLatch(
        current: boolean | null,
        forcedHand: boolean | null,
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState,
        isBlue: boolean
    ): boolean | null {
        if (forcedHand !== null) {
            if (isBlue && this.isHandRedOccupied(forcedHand)) {
                return null;
            }

            if (!isBlue && this.isHandBlueOccupied(forcedHand)) {
                return null;
            }

            return forcedHand;
        }

        if (current !== null) {
            if (isBlue && this.isHandRedOccupied(current)) {
                return null;
            }

            if (!isBlue && this.isHandBlueOccupied(current)) {
                return null;
            }

            const hand = current ? left : right;
            if (this.isGripAndTriggerHeld(hand)) {
                return current;
            }
        }

        if (isBlue) {
            if (!this.isHandRedOccupied(true) && this.isPurpleBlueIngredientGesture(character, left)) {
                return true;
            }
            if (!this.isHandRedOccupied(false) && this.isPurpleBlueIngredientGesture(character, right)) {
                return false;
            }
        } else {
            if (!this.isHandBlueOccupied(true) && this.isPurpleRedIngredientGesture(character, left)) {
                return true;
            }
            if (!this.isHandBlueOccupied(false) && this.isPurpleRedIngredientGesture(character, right)) {
                return false;
            }
        }

        return null;
    }

    private isHandBlueOccupied(isLeft: boolean): boolean {
        const runtime = this.getHandRuntime(isLeft);
        return runtime.mode === GojoAbilityMode.Slowdown
            || runtime.mode === GojoAbilityMode.Singularity
            || this.purpleBlueIngredientHandIsLeft === isLeft;
    }

    private isHandRedOccupied(isLeft: boolean): boolean {
        const runtime = this.getHandRuntime(isLeft);
        return runtime.mode === GojoAbilityMode.RedCharge
            || runtime.mode === GojoAbilityMode.RedBallCharge
            || this.purpleRedIngredientHandIsLeft === isLeft;
    }

    private getActiveHandForMode(mode: GojoAbilityMode): boolean | null {
        if (this.leftAbility.mode === mode) {
            return true;
        }

        if (this.rightAbility.mode === mode) {
            return false;
        }

        return null;
    }

    private getPurpleBlueIngredient(
        character: VX.Entity.EntityCharacter
    ): { isLeft: boolean; position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3 } | null {
        const activeBlueRuntime = this.getActiveRuntimeForMode(GojoAbilityMode.Singularity);
        if (activeBlueRuntime && activeBlueRuntime.singularityTargetPosition) {
            const direction = this.getPurpleHandDirection(character, activeBlueRuntime.isLeft);
            this.purpleBlueIngredientPosition = activeBlueRuntime.singularityTargetPosition;
            return {
                isLeft: activeBlueRuntime.isLeft,
                position: activeBlueRuntime.singularityTargetPosition,
                direction,
            };
        }

        if (this.purpleBlueIngredientHandIsLeft === null) {
            return null;
        }

        const target = this.getBlueIngredientHandTarget(character, this.purpleBlueIngredientHandIsLeft);
        if (!target) {
            return null;
        }

        this.purpleBlueIngredientPosition = target.position;
        return {
            isLeft: this.purpleBlueIngredientHandIsLeft,
            position: target.position,
            direction: target.direction,
        };
    }

    private getPurpleRedIngredient(
        character: VX.Entity.EntityCharacter
    ): { isLeft: boolean; position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3 } | null {
        const activeRedRuntime = this.getActiveRuntimeForMode(GojoAbilityMode.RedBallCharge);
        if (activeRedRuntime) {
            this.purpleRedIngredientPosition = activeRedRuntime.redBallPosition;
            return {
                isLeft: activeRedRuntime.isLeft,
                position: activeRedRuntime.redBallPosition,
                direction: activeRedRuntime.redBallDirection,
            };
        }

        if (this.purpleRedIngredientHandIsLeft === null) {
            return null;
        }

        const target = this.getRedBallHandTargetForHand(character, this.purpleRedIngredientHandIsLeft);
        if (!target) {
            return null;
        }

        this.purpleRedIngredientPosition = target.position;
        return {
            isLeft: this.purpleRedIngredientHandIsLeft,
            position: target.position,
            direction: target.direction,
        };
    }

    private getActiveRuntimeForMode(mode: GojoAbilityMode): HandAbilityRuntime | null {
        if (this.leftAbility.mode === mode) {
            return this.leftAbility;
        }

        if (this.rightAbility.mode === mode) {
            return this.rightAbility;
        }

        return null;
    }

    private beginPurpleCharge(
        character: VX.Entity.EntityCharacter,
        blueHandIsLeft: boolean,
        redHandIsLeft: boolean,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        this.restoreAllSlowedCharacters();
        this.restoreAllSlowedRigidbodies();
        this.deactivateHandAbility(this.leftAbility, true);
        this.deactivateHandAbility(this.rightAbility, true);
        this.mode = GojoAbilityMode.PurpleCharge;
        this.purpleBlueIngredientHandIsLeft = blueHandIsLeft;
        this.purpleRedIngredientHandIsLeft = redHandIsLeft;
        this.purpleControlHandIsLeft = null;
        const holdPosition = this.getPurpleSafeHoldPosition(character, blueHandIsLeft, redHandIsLeft) ?? position;
        this.purpleChargeIntroActive = true;
        this.purpleChargeIntroTime = 0;
        this.purpleChargeIntroFrom = position;
        this.purpleChargeIntroTo = holdPosition;
        this.purplePosition = position;
        this.purpleDirection = this.safeDirection(direction, this.getViewForward());
        this.nextPurpleChargeDemolishTime = 0;
        this.nextPurpleChargeVortexRefreshTime = 0;
        this.purpleIngredientFadeTime = 0;
        this.purpleChargeVortexRigidbodies = [];
        this.restartPurpleToPosition(this.purplePosition, this.purpleDirection);
    }

    private updatePurpleChargeInput(
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState
    ): void {
        const leftHeld = this.isGripAndTriggerHeld(left);
        const rightHeld = this.isGripAndTriggerHeld(right);
        this.updatePurpleIngredientFade(CS.UnityEngine.Time.deltaTime);
        const introStillPlaying = this.updatePurpleChargeIntro(CS.UnityEngine.Time.deltaTime);
        if (introStillPlaying && leftHeld && rightHeld) {
            return;
        }

        if (this.purpleControlHandIsLeft === null) {
            if (leftHeld && rightHeld) {
                const leftTarget = this.getPurpleForwardHandTargetOrNull(character, true);
                const rightTarget = this.getPurpleForwardHandTargetOrNull(character, false);
                let targetPosition: CS.UnityEngine.Vector3;
                let targetDirection: CS.UnityEngine.Vector3;
                if (leftTarget && rightTarget) {
                    targetPosition = Vec3.Lerp(leftTarget.position, rightTarget.position, 0.5);
                    targetDirection = this.safeDirection(
                        Vec3.op_Addition(leftTarget.direction, rightTarget.direction),
                        this.getViewForward()
                    );
                } else if (leftTarget) {
                    targetPosition = leftTarget.position;
                    targetDirection = leftTarget.direction;
                } else if (rightTarget) {
                    targetPosition = rightTarget.position;
                    targetDirection = rightTarget.direction;
                } else {
                    targetPosition = this.getPurplePlayerFrontPosition(character);
                    targetDirection = this.getViewForward();
                }
                this.purplePosition = Vec3.Lerp(
                    this.purplePosition,
                    targetPosition,
                    this.getPurpleFollowLerp(CS.UnityEngine.Time.deltaTime)
                );
                this.purpleDirection = targetDirection;
                return;
            }

            if (leftHeld) {
                this.purpleControlHandIsLeft = true;
                return;
            }

            if (rightHeld) {
                this.purpleControlHandIsLeft = false;
                return;
            }

            this.beginPurpleProjectile(character, this.purpleDirection);
            return;
        }

        const controlHand = this.purpleControlHandIsLeft ? left : right;
        if (!this.isGripAndTriggerHeld(controlHand)) {
            const direction = controlHand.rb
                ? this.safeDirection(controlHand.rb.transform.forward, this.purpleDirection)
                : this.purpleDirection;
            this.beginPurpleProjectile(character, direction);
            return;
        }

        const target = this.getPurpleForwardHandTargetOrNull(character, this.purpleControlHandIsLeft);
        const targetPosition = target ? target.position : this.getPurplePlayerFrontPosition(character);
        const targetDirection = target ? target.direction : this.getViewForward();
        this.purplePosition = Vec3.Lerp(
            this.purplePosition,
            targetPosition,
            this.getPurpleFollowLerp(CS.UnityEngine.Time.deltaTime)
        );
        this.purpleDirection = targetDirection;
    }

    private getPurpleFollowLerp(deltaTime: number): number {
        return Mathf.Clamp01(1.0 - Math.exp(-Math.max(0, deltaTime) / Math.max(0.001, this.purpleFollowTime)));
    }

    private beginPurpleProjectile(character: VX.Entity.EntityCharacter, direction: CS.UnityEngine.Vector3): void {
        const shootDirection = this.safeDirection(direction, this.getViewForward());
        this.purpleChargeIntroActive = false;
        this.purpleChargeIntroTime = this.purpleManualAppearDuration;
        this.purpleIngredientFadeTime = this.purpleIngredientFadeDuration;
        const projectileFx = this.createProjectileFxClone(
            this.purpleFX,
            "PurpleProjectile",
            this.purplePosition,
            shootDirection,
            this.getPurpleFxScale(0)
        );
        this.purpleProjectiles.push({
            position: this.purplePosition,
            direction: shootDirection,
            distance: 0,
            nextDemolishTime: 0,
            voidStartTime: -1,
            nextVortexRefreshTime: 0,
            vortexRigidbodies: [],
            fx: projectileFx,
        });
        this.purpleDirection = shootDirection;
        this.mode = GojoAbilityMode.None;
        this.purpleControlHandIsLeft = null;
        this.purpleBlueIngredientHandIsLeft = null;
        this.purpleRedIngredientHandIsLeft = null;
        this.hidePurpleImmediately();
    }

    private updatePurpleChargeIntro(deltaTime: number): boolean {
        if (!this.purpleChargeIntroActive) {
            return false;
        }

        this.purpleChargeIntroTime = Math.min(
            this.purpleManualAppearDuration,
            this.purpleChargeIntroTime + Math.max(0, deltaTime)
        );
        const t = this.getPurpleChargeIntroProgress();
        this.purplePosition = Vec3.Lerp(this.purpleChargeIntroFrom, this.purpleChargeIntroTo, t);

        if (this.purpleChargeIntroTime >= this.purpleManualAppearDuration) {
            this.purpleChargeIntroActive = false;
            this.purplePosition = this.purpleChargeIntroTo;
            return false;
        }

        return true;
    }

    private getPurpleChargeIntroProgress(): number {
        if (this.purpleManualAppearDuration <= 0) {
            return 1;
        }

        const t = Mathf.Clamp01(this.purpleChargeIntroTime / this.purpleManualAppearDuration);
        return t * t * (3.0 - 2.0 * t);
    }

    private updatePurpleIngredientFade(deltaTime: number): void {
        this.purpleIngredientFadeTime = Math.min(
            this.purpleIngredientFadeDuration,
            this.purpleIngredientFadeTime + Math.max(0, deltaTime)
        );
    }

    private getPurpleIngredientFadeScale(): number {
        if (this.purpleIngredientFadeDuration <= 0) {
            return this.purpleIngredientFadeMinScale;
        }

        const t = Mathf.Clamp01(this.purpleIngredientFadeTime / this.purpleIngredientFadeDuration);
        const smoothT = t * t * (3.0 - 2.0 * t);
        return Mathf.Lerp(1.0, this.purpleIngredientFadeMinScale, smoothT);
    }

    private getPurpleIngredientMergePosition(
        current: CS.UnityEngine.Vector3,
        deltaTime: number
    ): CS.UnityEngine.Vector3 {
        const lerp = Mathf.Clamp01(
            1.0 - Math.exp(-Math.max(0, deltaTime) * this.purpleIngredientMergeLerpSpeed)
        );
        return Vec3.Lerp(current, this.purpleChargeIntroFrom, lerp);
    }

    private getActivatingHand(
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState
    ): HandState | null {
        if (this.isActivationGesture(character, left)) {
            return left;
        }

        if (this.isActivationGesture(character, right)) {
            return right;
        }

        return null;
    }

    private getDirectSingularityActivatingHand(
        character: VX.Entity.EntityCharacter,
        left: HandState,
        right: HandState
    ): HandState | null {
        if (this.isDirectSingularityGesture(character, left)) {
            return left;
        }

        if (this.isDirectSingularityGesture(character, right)) {
            return right;
        }

        return null;
    }

    private getRedActivatingHand(character: VX.Entity.EntityCharacter, left: HandState, right: HandState): HandState | null {
        if (this.isRedActivationGesture(character, left)) {
            return left;
        }

        if (this.isRedActivationGesture(character, right)) {
            return right;
        }

        return null;
    }

    private isActivationGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        if (!hand.gripHeld || !hand.rb) {
            return false;
        }

        if (!this.isHandInFrontOfBody(character, hand.rb)) {
            return false;
        }

        const palmForward = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        const swingTowardPalm = Vec3.Dot(this.getHandGestureVelocity(character, hand.rb), palmForward);
        return swingTowardPalm >= this.activationSwingSpeed;
    }

    private isDirectSingularityGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        if (!hand.gripHeld || !hand.rb || !this.isTriggerHeld(hand.isLeft)) {
            return false;
        }

        if (!this.isHandInFrontOfBody(character, hand.rb)) {
            return false;
        }

        const palmForward = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        const swingTowardPalm = Vec3.Dot(this.getHandGestureVelocity(character, hand.rb), palmForward);
        return swingTowardPalm >= this.singularityActivationSwingSpeed;
    }

    private isRedActivationGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        if (!hand.gripHeld || !hand.rb) {
            return false;
        }

        if (!this.isHandInFrontOfBody(character, hand.rb)) {
            return false;
        }

        const palmForward = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        const swingBackward = Vec3.Dot(this.getHandGestureVelocity(character, hand.rb), Vec3.op_UnaryNegation(palmForward));
        return swingBackward >= this.redActivationSwingSpeed;
    }

    private isSingularityUpgradeGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        if (!hand.rb || !this.isTriggerHeld(hand.isLeft)) {
            return false;
        }

        const palmForward = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        const swingTowardPalm = Vec3.Dot(this.getHandGestureVelocity(character, hand.rb), palmForward);
        return swingTowardPalm >= this.singularityActivationSwingSpeed;
    }

    private isPurpleBlueIngredientGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        return this.isDirectSingularityGesture(character, hand);
    }

    private isPurpleRedIngredientGesture(character: VX.Entity.EntityCharacter, hand: HandState): boolean {
        if (!this.isGripAndTriggerHeld(hand) || !hand.rb) {
            return false;
        }

        if (!this.isHandInFrontOfBody(character, hand.rb)) {
            return false;
        }

        const palmForward = this.safeDirection(hand.rb.transform.forward, this.getViewForward());
        const swingBackward = Vec3.Dot(this.getHandGestureVelocity(character, hand.rb), Vec3.op_UnaryNegation(palmForward));
        return swingBackward >= this.redActivationSwingSpeed;
    }

    private isGripAndTriggerHeld(hand: HandState): boolean {
        return hand.gripHeld && this.isTriggerHeld(hand.isLeft);
    }

    private isTriggerHeld(isLeft: boolean): boolean {
        return isLeft
            ? this.input.GetFireLInput() > this.triggerThreshold
            : this.input.GetFireRInput() > this.triggerThreshold;
    }

    private getHandState(character: VX.Entity.EntityCharacter, isLeft: boolean): HandState {
        return {
            isLeft,
            gripHeld: isLeft
                ? this.input.GetGripLInput() > this.gripThreshold
                : this.input.GetGripRInput() > this.gripThreshold,
            rb: ModAPI.GetCharacterBody(character, isLeft ? "LeftHand" : "RightHand") as CS.Px5.Unity.PxRigidBody | null,
        };
    }

    private getHandGestureVelocity(
        character: VX.Entity.EntityCharacter,
        hand: CS.Px5.Unity.PxRigidBody
    ): CS.UnityEngine.Vector3 {
        return Vec3.op_Subtraction(hand.velocity, this.getCharacterBodyVelocity(character));
    }

    private getCharacterBodyVelocity(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const hip = ModAPI.GetCharacterBody(character, "Hip") as CS.Px5.Unity.PxRigidBody | null;
        if (this.isValidRigidBody(hip)) {
            return hip.velocity;
        }

        const torso = ModAPI.GetCharacterBody(character, "Torso") as CS.Px5.Unity.PxRigidBody | null;
        if (this.isValidRigidBody(torso)) {
            return torso.velocity;
        }

        return Vec3.zero;
    }

    private isHandInFrontOfBody(
        character: VX.Entity.EntityCharacter,
        hand: CS.Px5.Unity.PxRigidBody
    ): boolean {
        const bodyCenter = this.getCharacterCenter(character);
        const toHand = Vec3.op_Subtraction(hand.worldCenterOfMass, bodyCenter);
        if (toHand.sqrMagnitude <= 0.0225) {
            return false;
        }

        return Vec3.Dot(toHand.normalized, this.getViewForward()) >= this.handInFrontDot;
    }

    private updateSlowField(character: VX.Entity.EntityCharacter | null): void {
        if (!this.hasActiveSlowdown() || !character) {
            this.restoreAllSlowedCharacters();
            return;
        }

        const center = this.getCharacterCenter(character);
        const selfId = character.GetInstanceID();
        const allCharacters = ModAPI.GetAllCharacters();
        const stillInRange = new Set<number>();

        for (let i = 0; i < allCharacters.Length; i++) {
            const target = allCharacters.get_Item(i) as VX.Entity.EntityCharacter | null;
            if (!target || target.GetInstanceID() === selfId) {
                continue;
            }

            if (!this.isCharacterWithinSlowRadius(center, target)) {
                continue;
            }

            const id = target.GetInstanceID();
            stillInRange.add(id);
            if (!this.slowedCharacters.has(id)) {
                this.slowCharacter(id, target);
            } else {
                this.keepCharacterAnimatorSlow(id);
            }
        }

        this.restoreCharactersOutside(stillInRange);
    }

    private hasActiveSlowdown(): boolean {
        return this.leftAbility.mode === GojoAbilityMode.Slowdown
            || this.rightAbility.mode === GojoAbilityMode.Slowdown;
    }

    private isCharacterWithinSlowRadius(
        center: CS.UnityEngine.Vector3,
        target: VX.Entity.EntityCharacter
    ): boolean {
        const delta = Vec3.op_Subtraction(this.getCharacterCenter(target), center);
        return delta.sqrMagnitude <= this.slowRadiusSqr;
    }

    private slowCharacter(id: number, character: VX.Entity.EntityCharacter): void {
        const animator = ModAPI.GetCharacterAnimator(character) as CS.UnityEngine.Animator | null;
        const animatorView = animator as any;
        const animatorSpeed = animator && animatorView.speed !== undefined ? animatorView.speed as number : 1.0;

        ModAPI.ScaleCharacterMovementSpeedMultiplier(character, this.slowMovementScale);
        if (animator) {
            animatorView.speed = animatorSpeed * this.slowAnimatorScale;
        }

        this.slowedCharacters.set(id, {
            character,
            animator,
            animatorSpeed,
        });
    }

    private keepCharacterAnimatorSlow(id: number): void {
        const slowed = this.slowedCharacters.get(id);
        if (slowed && slowed.animator) {
            (slowed.animator as any).speed = slowed.animatorSpeed * this.slowAnimatorScale;
        }
    }

    private restoreCharactersOutside(stillInRange: Set<number>): void {
        const toRestore: number[] = [];
        this.slowedCharacters.forEach((_slowed, id) => {
            if (!stillInRange.has(id)) {
                toRestore.push(id);
            }
        });

        for (const id of toRestore) {
            this.restoreSlowedCharacter(id);
        }
    }

    private restoreAllSlowedCharacters(): void {
        const ids: number[] = [];
        this.slowedCharacters.forEach((_slowed, id) => ids.push(id));
        for (const id of ids) {
            this.restoreSlowedCharacter(id);
        }
    }

    private restoreSlowedCharacter(id: number): void {
        const slowed = this.slowedCharacters.get(id);
        if (!slowed) {
            return;
        }

        ModAPI.UnscaleCharacterMovementSpeedMultiplier(slowed.character, this.slowMovementScale);
        if (slowed.animator) {
            (slowed.animator as any).speed = slowed.animatorSpeed;
        }

        this.slowedCharacters.delete(id);
    }

    private updateSlowRigidbodies(character: VX.Entity.EntityCharacter): void {
        const center = this.getCharacterCenter(character);
        const colliders = PxPhysics.OverlapSphere(
            center,
            this.slowRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        const stillInRange = new Set<number>();

        if (colliders && colliders.Length > 0) {
            for (let i = 0; i < colliders.Length; i++) {
                const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
                if (!collider) {
                    continue;
                }

                const rb = this.getColliderRigidBody(collider);
                if (!this.isValidRigidBody(rb) || ModAPI.CharacterContainsRigidbody(character, rb)) {
                    continue;
                }

                const id = rb.GetInstanceID();
                if (stillInRange.has(id)) {
                    continue;
                }

                stillInRange.add(id);
                this.slowRigidBody(id, rb);
            }
        }

        this.restoreRigidbodiesOutside(stillInRange);
    }

    private slowRigidBody(id: number, rb: CS.Px5.Unity.PxRigidBody): void {
        if (!this.slowedRigidbodies.has(id)) {
            this.slowedRigidbodies.set(id, {
                rb,
                maxLinearVelocity: rb.maxLinearVelocity,
                maxAngularVelocity: rb.maxAngularVelocity,
            });
        }

        rb.maxLinearVelocity = Math.min(rb.maxLinearVelocity, this.slowRigidBodyMaxLinearSpeed);
        rb.maxAngularVelocity = Math.min(rb.maxAngularVelocity, this.slowRigidBodyMaxAngularSpeed);
        rb.velocity = Vec3.ClampMagnitude(rb.velocity, this.slowRigidBodyMaxLinearSpeed);
        rb.angularVelocity = Vec3.ClampMagnitude(rb.angularVelocity, this.slowRigidBodyMaxAngularSpeed);
        rb.WakeUp();
    }

    private restoreRigidbodiesOutside(stillInRange: Set<number>): void {
        const toRestore: number[] = [];
        this.slowedRigidbodies.forEach((_slowed, id) => {
            if (!stillInRange.has(id)) {
                toRestore.push(id);
            }
        });

        for (const id of toRestore) {
            this.restoreSlowedRigidBody(id);
        }
    }

    private restoreAllSlowedRigidbodies(): void {
        const ids: number[] = [];
        this.slowedRigidbodies.forEach((_slowed, id) => ids.push(id));
        for (const id of ids) {
            this.restoreSlowedRigidBody(id);
        }
    }

    private restoreSlowedRigidBody(id: number): void {
        const slowed = this.slowedRigidbodies.get(id);
        if (!slowed) {
            return;
        }

        if (this.isValidRigidBody(slowed.rb)) {
            slowed.rb.maxLinearVelocity = slowed.maxLinearVelocity;
            slowed.rb.maxAngularVelocity = slowed.maxAngularVelocity;
        }

        this.slowedRigidbodies.delete(id);
    }

    private deactivateAllAbilities(): void {
        this.deactivateHandAbility(this.leftAbility);
        this.deactivateHandAbility(this.rightAbility);
        this.mode = GojoAbilityMode.None;
        this.purpleControlHandIsLeft = null;
        this.purpleBlueIngredientHandIsLeft = null;
        this.purpleRedIngredientHandIsLeft = null;
        this.hidePurpleImmediately();
        this.restoreAllSlowedCharacters();
        this.restoreAllSlowedRigidbodies();
    }

    private deactivateHandAbility(runtime: HandAbilityRuntime, keepPurpleIngredientFx = false): void {
        if (runtime.mode === GojoAbilityMode.None) {
            return;
        }

        const previousMode = runtime.mode;
        runtime.mode = GojoAbilityMode.None;
        runtime.singularityLocalOffset = null;
        runtime.singularityTargetPosition = null;
        runtime.previousControlHandLocalPosition = null;
        runtime.lastSingularityHandWorldDelta = Vec3.zero;
        runtime.singularityOrbFlightScaleExtra = 0;
        this.restoreCcdRigidbodies(runtime);
        runtime.attractedRigidbodies.clear();
        runtime.redPiercedVoxelIds.clear();
        this.hideRedDotImmediately(runtime);
        if (!keepPurpleIngredientFx || previousMode !== GojoAbilityMode.RedBallCharge) {
            this.hideRedBallImmediately(runtime);
        }
        if (!this.hasActiveSlowdown()) {
            this.restoreAllSlowedCharacters();
            this.restoreAllSlowedRigidbodies();
        }
    }

    private isAbilityActive(runtime: HandAbilityRuntime): boolean {
        return runtime.mode !== GojoAbilityMode.None;
    }

    private updateSingularityTarget(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter | null,
        deltaTime: number
    ): void {
        if (runtime.mode !== GojoAbilityMode.Singularity || !character) {
            runtime.previousControlHandLocalPosition = null;
            runtime.lastSingularityHandWorldDelta = Vec3.zero;
            return;
        }

        if (!runtime.singularityLocalOffset) {
            runtime.singularityLocalOffset = this.createInitialSingularityLocalOffset(runtime, character);
        }

        const sample = this.getControlHandSample(runtime, character);
        if (sample && runtime.previousControlHandLocalPosition && deltaTime > 0.0001) {
            const localPositionDelta = Vec3.op_Subtraction(sample.localPosition, runtime.previousControlHandLocalPosition);
            const worldDelta = sample.parent
                ? sample.parent.TransformDirection(localPositionDelta)
                : localPositionDelta;
            runtime.lastSingularityHandWorldDelta = worldDelta;

            const targetWorldBefore = this.getSingularityWorldTarget(runtime, character);
            const controlDistance = Vec3.Distance(sample.worldPosition, targetWorldBefore);
            const boostedWorldDelta = this.getScaledSingularityPositionDelta(worldDelta, deltaTime, controlDistance);
            this.addSingularityOrbFlightScale(runtime, boostedWorldDelta, deltaTime);
            const reference = this.getSingularityReference();
            const localDelta = reference
                ? reference.InverseTransformDirection(boostedWorldDelta)
                : boostedWorldDelta;
            runtime.singularityLocalOffset = Vec3.op_Addition(runtime.singularityLocalOffset, localDelta);
            runtime.singularityLocalOffset = this.clampSingularityLocalOffset(runtime.singularityLocalOffset);
        }

        this.applySingularityStickPush(runtime, character, deltaTime);

        runtime.previousControlHandLocalPosition = sample ? sample.localPosition : null;
        runtime.singularityTargetPosition = this.getSingularityWorldTarget(runtime, character);
        this.drawSingularityGizmos(runtime, character, sample);
    }

    private getScaledSingularityPositionDelta(
        positionDelta: CS.UnityEngine.Vector3,
        deltaTime: number,
        controlDistance: number
    ): CS.UnityEngine.Vector3 {
        if (positionDelta.sqrMagnitude <= 0.000001) {
            return Vec3.zero;
        }

        const handSpeed = positionDelta.magnitude / Math.max(deltaTime, 0.0001);
        const speedT = Math.max(0,
            (handSpeed - this.singularityHighSpeedStart) /
            Math.max(0.001, this.singularityHighSpeedFull - this.singularityHighSpeedStart)
        );
        const deltaT = Mathf.Clamp01(
            (positionDelta.magnitude - this.singularityDeltaBoostStart) /
            Math.max(0.001, this.singularityDeltaBoostFull - this.singularityDeltaBoostStart)
        );
        const distanceT = Mathf.Clamp01(
            (controlDistance - this.singularityDistanceBoostStart) /
            Math.max(0.001, this.singularityDistanceBoostFull - this.singularityDistanceBoostStart)
        );
        const speedMultiplier = 1.0
            + speedT * this.singularityHighSpeedExtraMultiplier
            + speedT * speedT * 1.1;
        const multiplier = this.singularityHandDeltaMultiplier
            * speedMultiplier
            * (1.0 + deltaT * this.singularityDeltaExtraMultiplier)
            * (1.0 + distanceT * this.singularityDistanceExtraMultiplier);
        return Vec3.ClampMagnitude(
            Vec3.op_Multiply(positionDelta, multiplier),
            this.singularityMaxTargetMoveSpeed * deltaTime
        );
    }

    private addSingularityOrbFlightScale(
        runtime: HandAbilityRuntime,
        targetDelta: CS.UnityEngine.Vector3,
        deltaTime: number
    ): void {
        if (deltaTime <= 0.0001 || targetDelta.sqrMagnitude <= 0.000001) {
            return;
        }

        const targetSpeed = targetDelta.magnitude / deltaTime;
        const t = Mathf.Clamp01(
            (targetSpeed - this.singularityOrbFlySpeedStart) /
            Math.max(0.001, this.singularityOrbFlySpeedFull - this.singularityOrbFlySpeedStart)
        );
        runtime.singularityOrbFlightScaleExtra = Math.max(
            runtime.singularityOrbFlightScaleExtra,
            t * this.singularityOrbFlyMaxExtraScale
        );
    }

    private applySingularityStickPush(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, deltaTime: number): void {
        if (!runtime.singularityLocalOffset || deltaTime <= 0.0001) {
            return;
        }

        const look = this.input.GetLookInput();
        const y = look.y;
        if (Math.abs(y) <= this.singularityStickDeadzone) {
            return;
        }

        const shaped = this.shapeSignedAxis(y);
        const distance = runtime.singularityLocalOffset.magnitude;
        if (distance <= 0.0001) {
            runtime.singularityLocalOffset = this.createInitialSingularityLocalOffset(runtime, character);
            return;
        }

        const distanceT = Mathf.Clamp01(
            (distance - this.singularityDistanceBoostStart) /
            Math.max(0.001, this.singularityDistanceBoostFull - this.singularityDistanceBoostStart)
        );
        const speed = this.singularityStickPushSpeed * (1.0 + distanceT * this.singularityStickDistanceExtraMultiplier);
        const radialDelta = Vec3.op_Multiply(runtime.singularityLocalOffset.normalized, shaped * speed * deltaTime);
        runtime.singularityLocalOffset = this.clampSingularityLocalOffset(
            Vec3.op_Addition(runtime.singularityLocalOffset, radialDelta)
        );
    }

    private shapeSignedAxis(value: number): number {
        const abs = Math.abs(value);
        if (abs <= this.singularityStickDeadzone) {
            return 0;
        }

        const normalized = Mathf.Clamp01((abs - this.singularityStickDeadzone) / (1.0 - this.singularityStickDeadzone));
        return (value < 0 ? -1 : 1) * normalized * normalized;
    }

    private createInitialSingularityLocalOffset(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        startPosition: CS.UnityEngine.Vector3 | null = null
    ): CS.UnityEngine.Vector3 {
        const reference = this.getSingularityReference();
        const center = this.getCharacterCenter(character);
        const initialPosition = startPosition ?? this.getCurrentOrbPositionOrHandTarget(runtime, character);
        const worldOffset = Vec3.op_Subtraction(initialPosition, center);
        return reference ? reference.InverseTransformDirection(worldOffset) : worldOffset;
    }

    private getSingularityWorldTarget(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const center = this.getCharacterCenter(character);
        const offset = runtime.singularityLocalOffset ?? this.createInitialSingularityLocalOffset(runtime, character);
        const reference = this.getSingularityReference();
        const worldOffset = reference ? reference.TransformDirection(offset) : offset;
        return Vec3.op_Addition(center, worldOffset);
    }

    private clampSingularityLocalOffset(offset: CS.UnityEngine.Vector3): CS.UnityEngine.Vector3 {
        const magnitude = offset.magnitude;
        if (magnitude <= 0.0001) {
            return offset;
        }

        if (magnitude < this.singularityMinDistance) {
            return Vec3.op_Multiply(offset.normalized, this.singularityMinDistance);
        }

        return offset;
    }

    private getControlHandSample(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter
    ): { worldPosition: CS.UnityEngine.Vector3; localPosition: CS.UnityEngine.Vector3; parent: CS.UnityEngine.Transform | null } | null {
        const controller = ModAPI.GetXRControllerTransform(runtime.isLeft);
        if (controller) {
            return {
                worldPosition: controller.position,
                localPosition: controller.localPosition,
                parent: controller.parent,
            };
        }

        const hand = ModAPI.GetCharacterBody(
            character,
            runtime.isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        return hand
            ? { worldPosition: hand.worldCenterOfMass, localPosition: hand.worldCenterOfMass, parent: null }
            : null;
    }

    private getSingularityReference(): CS.UnityEngine.Transform | null {
        return this.bindTo.transform;
    }

    private updateSingularityPhysics(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter, deltaTime: number): void {
        const center = runtime.singularityTargetPosition ?? this.getSingularityWorldTarget(runtime, character);
        this.pullRigidbodiesToSingularity(runtime, character, center, deltaTime);
        this.demolishAtSingularity(runtime, character, center);
    }

    private demolishAtSingularity(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3
    ): void {
        const now = CS.UnityEngine.Time.time;
        if (now < runtime.nextSingularityDemolishTime) {
            return;
        }

        const colliders = PxPhysics.OverlapSphere(
            center,
            this.singularityDemolishRadius,
            VX.Engine.LayerMasksHelper.bulletHitLayerMask.value,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        const seen = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = (collider.attachedRigidbody as CS.Px5.Unity.PxRigidBody | null)
                ?? (collider.GetComponentInParent(PxRigidBodyType) as CS.Px5.Unity.PxRigidBody | null);
            if (
                this.isValidRigidBody(rb) &&
                runtime.attractedRigidbodies.has(rb.GetInstanceID()) &&
                this.getRigidBodyBoundsVolume(rb) < this.singularityDemolishMinRbVolume
            ) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (!voxel || !ModAPI.IsVoxelDestructible(voxel) || voxel.transform.IsChildOf(character.transform)) {
                continue;
            }

            const id = voxel.GetInstanceID();
            if (seen.has(id)) {
                continue;
            }

            seen.add(id);
            const direction = this.safeDirection(
                Vec3.op_Subtraction(center, voxel.transform.position),
                Vec3.up
            );
            ModAPI.DemolishVoxelSphere(
                voxel,
                center,
                this.singularityDemolishRadius,
                this.singularityDemolishForce,
                direction,
                this.singularityDemolishSpreadAngle * Mathf.Deg2Rad,
                this.singularityDemolishMaxFragments
            );
        }

        runtime.nextSingularityDemolishTime = now + this.singularityDemolishInterval;
    }

    private pullRigidbodiesToSingularity(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        deltaTime: number
    ): void {
        const colliders = PxPhysics.OverlapSphere(
            center,
            this.singularityAttractRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        const seen = new Set<number>();
        if (colliders && colliders.Length > 0) {
            for (let i = 0; i < colliders.Length; i++) {
                const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
                if (!collider) {
                    continue;
                }

                const rb = collider.attachedRigidbody as CS.Px5.Unity.PxRigidBody | null;
                if (!this.isValidRigidBody(rb) || ModAPI.CharacterContainsRigidbody(character, rb)) {
                    continue;
                }

                const id = rb.GetInstanceID();
                runtime.attractedRigidbodies.set(id, rb);
                this.tryEnableCcdForAttractedFragment(runtime, id, rb);
                if (seen.has(id)) {
                    continue;
                }
                seen.add(id);
                this.applySingularityVelocity(rb, center, deltaTime, false);
            }
        }

        this.pullCachedRigidbodiesToSingularity(runtime, character, center, deltaTime, seen);
    }

    private pullCachedRigidbodiesToSingularity(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        deltaTime: number,
        alreadyApplied: Set<number> | null = null
    ): void {
        const toRemove: number[] = [];
        runtime.attractedRigidbodies.forEach((rb, id) => {
            if (!this.isValidRigidBody(rb)) {
                toRemove.push(id);
                return;
            }

            if (alreadyApplied && alreadyApplied.has(id)) {
                return;
            }

            if (ModAPI.CharacterContainsRigidbody(character, rb)) {
                toRemove.push(id);
                return;
            }

            const toCenter = Vec3.op_Subtraction(center, rb.worldCenterOfMass);
            if (toCenter.sqrMagnitude > this.singularityAttractRadiusSqr) {
                toRemove.push(id);
                return;
            }

            this.applySingularityVelocity(rb, center, deltaTime, true);
        });

        for (const id of toRemove) {
            const rb = runtime.attractedRigidbodies.get(id) ?? null;
            this.restoreRigidbodyCcd(runtime, id, rb);
            runtime.attractedRigidbodies.delete(id);
        }
    }

    private tryEnableCcdForAttractedFragment(runtime: HandAbilityRuntime, id: number, rb: CS.Px5.Unity.PxRigidBody): void {
        if (runtime.ccdRigidbodyOriginalModes.has(id)) {
            return;
        }

        if (this.getRigidBodyBoundsVolume(rb) >= this.singularityCcdRbVolume) {
            return;
        }

        if (Math.abs(id) % this.singularityCcdSelectionModulo !== 0) {
            return;
        }

        runtime.ccdRigidbodyOriginalModes.set(id, rb.collisionDetectionMode);
        rb.collisionDetectionMode = CS.UnityEngine.CollisionDetectionMode.ContinuousDynamic;
    }

    private restoreRigidbodyCcd(runtime: HandAbilityRuntime, id: number, rb: CS.Px5.Unity.PxRigidBody | null): void {
        if (!runtime.ccdRigidbodyOriginalModes.has(id)) {
            return;
        }

        const originalMode = runtime.ccdRigidbodyOriginalModes.get(id)!;
        if (this.isValidRigidBody(rb)) {
            rb.collisionDetectionMode = originalMode;
        }
        runtime.ccdRigidbodyOriginalModes.delete(id);
    }

    private restoreCcdRigidbodies(runtime: HandAbilityRuntime): void {
        const ids: number[] = [];
        runtime.ccdRigidbodyOriginalModes.forEach((_mode, id) => ids.push(id));
        for (const id of ids) {
            const rb = runtime.attractedRigidbodies.get(id) ?? null;
            this.restoreRigidbodyCcd(runtime, id, rb);
        }
        runtime.ccdRigidbodyOriginalModes.clear();
    }

    private getRigidBodyBoundsVolume(rb: CS.Px5.Unity.PxRigidBody): number {
        const size = rb.WorldBound().size;
        return Math.max(0, size.x) * Math.max(0, size.y) * Math.max(0, size.z);
    }

    private updateRedProjectiles(character: VX.Entity.EntityCharacter, deltaTime: number): void {
        if (deltaTime <= 0.0001) {
            return;
        }

        const stepDistance = this.redProjectileSpeed * deltaTime;
        if (stepDistance <= 0.0001) {
            return;
        }

        const remaining: RedProjectile[] = [];
        for (const projectile of this.redProjectiles) {
            const hits = PxPhysics.SphereCastAll(
                projectile.position,
                this.redProjectileRadius,
                projectile.direction,
                stepDistance,
                -1,
                QueryTriggerInteraction.Ignore
            );
            const sortedHits: CS.Px5.UnityExtensions.RaycastHit[] = [];
            if (hits && hits.Length > 0) {
                for (let i = 0; i < hits.Length; i++) {
                    const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
                    if (hit.collider) {
                        sortedHits.push(hit);
                    }
                }
            }
            sortedHits.sort((a, b) => a.distance - b.distance);

            let stopped = false;
            for (const hit of sortedHits) {
                if (this.processRedProjectileHit(character, hit, projectile)) {
                    projectile.position = hit.point;
                    const owner = this.getHandRuntime(projectile.ownerIsLeft);
                    this.playRedHitFx(owner, hit.point, projectile.direction);
                    this.destroyProjectileFx(projectile.fx);
                    stopped = true;
                    break;
                }
            }

            if (stopped) {
                continue;
            }

            projectile.position = Vec3.op_Addition(
                projectile.position,
                Vec3.op_Multiply(projectile.direction, stepDistance)
            );
            projectile.distance += stepDistance;
            if (projectile.distance < this.redProjectileMaxDistance) {
                this.updateProjectileFxTransform(
                    projectile.fx,
                    projectile.position,
                    projectile.direction,
                    this.getHandRuntime(projectile.ownerIsLeft).fx.redDotFXBaseScale
                );
                remaining.push(projectile);
            } else {
                this.destroyProjectileFx(projectile.fx);
            }
        }

        this.redProjectiles = remaining;
    }

    private processRedProjectileHit(
        self: VX.Entity.EntityCharacter,
        hit: CS.Px5.UnityExtensions.RaycastHit,
        projectile: RedProjectile
    ): boolean {
        const collider = hit.collider as CS.Px5.Unity.PxCollider | null;
        if (!collider) {
            return false;
        }

        if (collider.transform && collider.transform.IsChildOf(self.transform)) {
            return false;
        }

        const rb = (hit.rigidbody as CS.Px5.Unity.PxRigidBody | null) ?? this.getColliderRigidBody(collider);
        if (this.isValidRigidBody(rb) && ModAPI.CharacterContainsRigidbody(self, rb)) {
            return false;
        }

        const hitCharacter = this.getHitCharacter(self, collider, rb);
        if (hitCharacter) {
            this.launchCharacterWithRed(hitCharacter, projectile.direction);
            return true;
        }

        const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
        if (voxel && ModAPI.IsVoxelDestructible(voxel)) {
            ModAPI.DemolishVoxelSphere(
                voxel,
                hit.point,
                this.redDemolishRadius,
                this.redDemolishForce,
                projectile.direction,
                this.redDemolishSpreadAngle * Mathf.Deg2Rad,
                this.redDemolishMaxFragments
            );
            this.pushRedHitRigidbody(rb, projectile.direction);
            this.playRedHitFx(this.getHandRuntime(projectile.ownerIsLeft), hit.point, projectile.direction);
            return false;
        }

        if (this.isValidRigidBody(rb)) {
            this.pushRedHitRigidbody(rb, projectile.direction);
            this.playRedHitFx(this.getHandRuntime(projectile.ownerIsLeft), hit.point, projectile.direction);
            return false;
        }

        return true;
    }

    private updateRedBallProjectiles(character: VX.Entity.EntityCharacter, deltaTime: number): void {
        if (deltaTime <= 0.0001) {
            return;
        }

        const stepDistance = this.redBallProjectileSpeed * deltaTime;
        if (stepDistance <= 0.0001) {
            return;
        }

        const remaining: RedBallProjectile[] = [];
        for (const projectile of this.redBallProjectiles) {
            const hits = PxPhysics.SphereCastAll(
                projectile.position,
                this.redBallProjectileRadius,
                projectile.direction,
                stepDistance,
                -1,
                QueryTriggerInteraction.Ignore
            );
            const sortedHits: CS.Px5.UnityExtensions.RaycastHit[] = [];
            if (hits && hits.Length > 0) {
                for (let i = 0; i < hits.Length; i++) {
                    const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
                    if (hit.collider) {
                        sortedHits.push(hit);
                    }
                }
            }
            sortedHits.sort((a, b) => a.distance - b.distance);

            let stopped = false;
            for (const hit of sortedHits) {
                if (this.processRedBallProjectileHit(character, hit, projectile)) {
                    projectile.position = hit.point;
                    this.destroyProjectileFx(projectile.fx);
                    stopped = true;
                    break;
                }
            }

            if (stopped) {
                continue;
            }

            projectile.position = Vec3.op_Addition(
                projectile.position,
                Vec3.op_Multiply(projectile.direction, stepDistance)
            );
            projectile.distance += stepDistance;
            if (projectile.distance < this.redBallProjectileMaxDistance) {
                this.updateProjectileFxTransform(
                    projectile.fx,
                    projectile.position,
                    projectile.direction,
                    this.getHandRuntime(projectile.ownerIsLeft).fx.redBallFXBaseScale
                );
                remaining.push(projectile);
            } else {
                this.destroyProjectileFx(projectile.fx);
            }
        }

        this.redBallProjectiles = remaining;
    }

    private processRedBallProjectileHit(
        self: VX.Entity.EntityCharacter,
        hit: CS.Px5.UnityExtensions.RaycastHit,
        projectile: RedBallProjectile
    ): boolean {
        const collider = hit.collider as CS.Px5.Unity.PxCollider | null;
        if (!collider) {
            return false;
        }

        if (collider.transform && collider.transform.IsChildOf(self.transform)) {
            return false;
        }

        const rb = (hit.rigidbody as CS.Px5.Unity.PxRigidBody | null) ?? this.getColliderRigidBody(collider);
        if (this.isValidRigidBody(rb) && ModAPI.CharacterContainsRigidbody(self, rb)) {
            return false;
        }

        const hitDirection = this.safeDirection(projectile.direction, this.getViewForward());
        const hitCharacter = this.getHitCharacter(self, collider, rb);
        if (!hitCharacter) {
            this.demolishRedBallBuildingHole(self, hit.point, hitDirection);
            return false;
        }

        const characterDigRadius = this.getRedBallCharacterDigRadius(rb);
        const characterDigCenter = Vec3.op_Addition(
            hit.point,
            Vec3.op_Multiply(hitDirection, characterDigRadius * 0.75)
        );
        this.demolishRedBallCharacterHole(self, hitCharacter, collider, characterDigCenter, characterDigRadius, hitDirection);
        this.playRedBallHitFx(this.getHandRuntime(projectile.ownerIsLeft), hit.point, hitDirection);
        this.pendingRedBallExplosions.push({
            character: hitCharacter,
            direction: hitDirection,
            triggerTime: CS.UnityEngine.Time.time + this.redBallExplosionDelay,
        });
        return true;
    }

    private demolishRedBallBuildingHole(
        self: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const colliders = PxPhysics.OverlapSphere(
            center,
            this.redBallDigRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        const seenVoxels = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (this.isCharacterColliderOrBody(self, collider, rb)) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (!voxel || !ModAPI.IsVoxelDestructible(voxel)) {
                continue;
            }

            const voxelId = voxel.GetInstanceID();
            if (seenVoxels.has(voxelId)) {
                continue;
            }

            seenVoxels.add(voxelId);
            ModAPI.DemolishVoxelSphere(
                voxel,
                center,
                this.redBallDigRadius,
                this.redBallDigForce,
                direction,
                this.redDemolishSpreadAngle * Mathf.Deg2Rad,
                this.redBallDigMaxFragments
            );
        }
    }

    private demolishRedBallCharacterHole(
        self: VX.Entity.EntityCharacter,
        target: VX.Entity.EntityCharacter,
        hitCollider: CS.Px5.Unity.PxCollider,
        center: CS.UnityEngine.Vector3,
        radius: number,
        direction: CS.UnityEngine.Vector3
    ): void {
        const seenVoxels = new Set<number>();
        const directVoxel = this.findCharacterVoxelForHitCollider(target, hitCollider);
        this.demolishRedBallCharacterVoxel(directVoxel, seenVoxels, center, radius, direction);

        const childVoxels = target.transform.GetComponentsInChildren(VoxelDestructorType, true);
        if (childVoxels) {
            for (let i = 0; i < childVoxels.Length; i++) {
                const voxel = childVoxels.get_Item(i) as VX.Destruction.VoxelDestructor | null;
                this.demolishRedBallCharacterVoxel(voxel, seenVoxels, center, radius, direction);
            }
        }

        const colliders = PxPhysics.OverlapSphere(
            center,
            Math.max(radius, this.redBallProjectileRadius),
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (this.isCharacterColliderOrBody(self, collider, rb)) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            this.demolishRedBallCharacterVoxel(voxel, seenVoxels, center, radius, direction);
        }
    }

    private findCharacterVoxelForHitCollider(
        target: VX.Entity.EntityCharacter,
        hitCollider: CS.Px5.Unity.PxCollider
    ): VX.Destruction.VoxelDestructor | null {
        const directVoxel = hitCollider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
        if (directVoxel) {
            return directVoxel;
        }

        let current = hitCollider.transform as CS.UnityEngine.Transform | null;
        while (current && current !== target.transform) {
            const voxel = current.GetComponent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (voxel) {
                return voxel;
            }

            current = current.parent;
        }

        return null;
    }

    private demolishRedBallCharacterVoxel(
        voxel: VX.Destruction.VoxelDestructor | null,
        seenVoxels: Set<number>,
        center: CS.UnityEngine.Vector3,
        radius: number,
        direction: CS.UnityEngine.Vector3
    ): void {
        if (!voxel) {
            return;
        }

        const voxelId = voxel.GetInstanceID();
        if (seenVoxels.has(voxelId)) {
            return;
        }

        seenVoxels.add(voxelId);
        const passCount = this.getRedBallCharacterDigPassCount(radius);
        for (let i = 0; i < passCount; i++) {
            const t = passCount <= 1 ? 0.5 : i / (passCount - 1);
            const offset = Mathf.Lerp(
                this.redBallCharacterDigPassBackOffset,
                this.redBallCharacterDigPassForwardOffset,
                t
            ) * radius;
            const passCenter = Vec3.op_Addition(center, Vec3.op_Multiply(direction, offset));
            ModAPI.DemolishVoxelSphere(
                voxel,
                passCenter,
                radius,
                this.redBallDigForce,
                direction,
                this.redDemolishSpreadAngle * Mathf.Deg2Rad,
                this.redBallCharacterDigMaxFragments,
                this.redBallCharacterHardnessCap
            );
        }
    }

    private getRedBallCharacterDigRadius(rb: CS.Px5.Unity.PxRigidBody | null): number {
        if (!this.isValidRigidBody(rb)) {
            return this.redBallCharacterDigRadius;
        }

        const bounds = rb.WorldBound();
        const size = bounds.size;
        const limbSize = Math.max(Math.max(size.x, size.y), size.z);
        if (!Number.isFinite(limbSize) || limbSize <= 0.001) {
            return this.redBallCharacterDigRadius;
        }

        return Mathf.Clamp(
            limbSize * this.redBallCharacterDigRadiusBoundsScale,
            this.redBallCharacterDigRadius,
            this.redBallCharacterDigMaxRadius
        );
    }

    private getRedBallCharacterDigPassCount(radius: number): number {
        if (radius <= this.redBallCharacterDigRepeatRadiusStart) {
            return 1;
        }

        const extraPasses = Math.ceil(
            (radius - this.redBallCharacterDigRepeatRadiusStart)
            / Math.max(0.001, this.redBallCharacterDigRepeatRadiusStep)
        );
        return Math.min(this.redBallCharacterDigMaxPasses, 1 + Math.max(0, extraPasses));
    }

    private updatePurpleProjectiles(character: VX.Entity.EntityCharacter, deltaTime: number): void {
        if (deltaTime <= 0.0001) {
            return;
        }

        const stepDistance = this.purpleProjectileSpeed * deltaTime;
        if (stepDistance <= 0.0001) {
            return;
        }

        const remaining: PurpleProjectile[] = [];
        const now = CS.UnityEngine.Time.time;
        for (const projectile of this.purpleProjectiles) {
            projectile.position = Vec3.op_Addition(
                projectile.position,
                Vec3.op_Multiply(projectile.direction, stepDistance)
            );
            projectile.distance += stepDistance;

            if (this.isPurpleOverVoid(projectile.position)) {
                if (projectile.voidStartTime < 0) {
                    projectile.voidStartTime = now;
                }

                if (now - projectile.voidStartTime >= this.purpleVoidTerminateDelay) {
                    this.playPurpleHitFx(projectile.position, projectile.direction, projectile.distance);
                    this.destroyProjectileFx(projectile.fx);
                    continue;
                }
            } else {
                projectile.voidStartTime = -1;
            }

            if (now >= projectile.nextDemolishTime) {
                this.demolishPurpleAt(character, projectile.position, projectile.direction, this.purpleProjectileRadius);
                projectile.nextDemolishTime = now + this.purpleDemolishInterval;
            }
            this.updatePurpleProjectileVortex(
                character,
                projectile,
                projectile.position,
                projectile.direction,
                this.purpleProjectileRadius,
                now,
                deltaTime
            );

            if (projectile.distance < this.purpleProjectileMaxDistance) {
                this.updateProjectileFxTransform(
                    projectile.fx,
                    projectile.position,
                    projectile.direction,
                    this.getPurpleFxScale(projectile.distance)
                );
                remaining.push(projectile);
            } else {
                this.playPurpleHitFx(projectile.position, projectile.direction, projectile.distance);
                this.destroyProjectileFx(projectile.fx);
            }
        }

        this.purpleProjectiles = remaining;
    }

    private updatePurpleChargeDemolish(character: VX.Entity.EntityCharacter, deltaTime: number): void {
        const now = CS.UnityEngine.Time.time;
        if (now < this.nextPurpleChargeDemolishTime) {
            this.updatePurpleChargeVortex(
                character,
                this.purplePosition,
                this.safeDirection(this.purpleDirection, this.getViewForward()),
                this.purpleChargeDemolishRadius,
                now,
                deltaTime
            );
            return;
        }

        this.demolishPurpleAt(
            character,
            this.purplePosition,
            this.safeDirection(this.purpleDirection, this.getViewForward()),
            this.purpleChargeDemolishRadius
        );
        this.nextPurpleChargeDemolishTime = now + this.purpleChargeDemolishInterval;
        this.updatePurpleChargeVortex(
            character,
            this.purplePosition,
            this.safeDirection(this.purpleDirection, this.getViewForward()),
            this.purpleChargeDemolishRadius,
            now,
            deltaTime
        );
    }

    private getPurpleProjectileStopPosition(
        self: VX.Entity.EntityCharacter,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        stepDistance: number
    ): CS.UnityEngine.Vector3 | null {
        const floorHit = this.getPurpleFloorHit(self, position, direction, stepDistance);
        if (floorHit) {
            return floorHit.point;
        }

        return null;
    }

    private getPurpleFloorHit(
        self: VX.Entity.EntityCharacter,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        stepDistance: number
    ): CS.Px5.UnityExtensions.RaycastHit | null {
        const hits = PxPhysics.SphereCastAll(
            position,
            this.purpleIndestructibleProbeRadius,
            direction,
            stepDistance,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!hits || hits.Length <= 0) {
            return null;
        }

        const sortedHits: CS.Px5.UnityExtensions.RaycastHit[] = [];
        for (let i = 0; i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
            if (hit.collider) {
                sortedHits.push(hit);
            }
        }
        sortedHits.sort((a, b) => a.distance - b.distance);

        for (const hit of sortedHits) {
            const collider = hit.collider as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = (hit.rigidbody as CS.Px5.Unity.PxRigidBody | null) ?? this.getColliderRigidBody(collider);
            if (this.isPurpleFloorCollider(self, collider, rb)) {
                return hit;
            }
        }

        return null;
    }

    private isPurpleFloorCollider(
        self: VX.Entity.EntityCharacter,
        collider: CS.Px5.Unity.PxCollider,
        rb: CS.Px5.Unity.PxRigidBody | null
    ): boolean {
        if (this.isCharacterColliderOrBody(self, collider, rb)) {
            return false;
        }

        if (this.getHitCharacter(self, collider, rb)) {
            return false;
        }

        return collider.transform ? this.hasTagInParents(collider.transform, "Floor") : collider.CompareTag("Floor");
    }

    private hasTagInParents(transform: CS.UnityEngine.Transform, tag: string): boolean {
        let current = transform as CS.UnityEngine.Transform | null;
        while (current) {
            if (current.CompareTag(tag)) {
                return true;
            }

            current = current.parent;
        }

        return false;
    }

    private isPurpleOverVoid(position: CS.UnityEngine.Vector3): boolean {
        return !PxPhysics.Raycast(
            position,
            Vec3.down,
            this.purpleVoidRaycastDistance,
            -1,
            QueryTriggerInteraction.Ignore
        );
    }

    private demolishPurpleAt(
        self: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        radius: number
    ): void {
        const colliders = PxPhysics.OverlapSphere(
            center,
            radius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        const seenVoxels = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (this.isCharacterColliderOrBody(self, collider, rb)) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (!voxel) {
                continue;
            }

            const voxelId = voxel.GetInstanceID();
            if (seenVoxels.has(voxelId)) {
                continue;
            }

            seenVoxels.add(voxelId);
            ModAPI.DemolishVoxelSphere(
                voxel,
                center,
                radius,
                this.purpleDemolishForce,
                direction,
                Mathf.PI,
                this.purpleDemolishMaxFragments,
                this.purpleHardnessCap
            );
        }
    }

    private updatePurpleProjectileVortex(
        self: VX.Entity.EntityCharacter,
        projectile: PurpleProjectile,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        radius: number,
        now: number,
        deltaTime: number
    ): void {
        if (deltaTime <= 0.0001 || radius <= 0.0001) {
            return;
        }

        const attractRadius = radius * this.purpleVortexAttractRadiusMultiplier;
        if (now >= projectile.nextVortexRefreshTime) {
            projectile.vortexRigidbodies = this.collectPurpleVortexRigidbodies(self, center, attractRadius);
            projectile.nextVortexRefreshTime = now + this.purpleVortexOverlapInterval;
        }

        this.applyPurpleVortexToRigidbodies(
            projectile.vortexRigidbodies,
            center,
            this.safeDirection(direction, this.getViewForward()),
            radius,
            attractRadius,
            deltaTime
        );
    }

    private updatePurpleChargeVortex(
        self: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        radius: number,
        now: number,
        deltaTime: number
    ): void {
        if (deltaTime <= 0.0001 || radius <= 0.0001) {
            return;
        }

        const attractRadius = radius * this.purpleVortexAttractRadiusMultiplier;
        if (now >= this.nextPurpleChargeVortexRefreshTime) {
            this.purpleChargeVortexRigidbodies = this.collectPurpleVortexRigidbodies(self, center, attractRadius);
            this.nextPurpleChargeVortexRefreshTime = now + this.purpleVortexOverlapInterval;
        }

        this.applyPurpleVortexToRigidbodies(
            this.purpleChargeVortexRigidbodies,
            center,
            this.safeDirection(direction, this.getViewForward()),
            radius,
            attractRadius,
            deltaTime
        );
    }

    private collectPurpleVortexRigidbodies(
        self: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        attractRadius: number
    ): CS.Px5.Unity.PxRigidBody[] {
        const colliders = PxPhysics.OverlapSphere(
            center,
            attractRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return [];
        }

        const result: CS.Px5.Unity.PxRigidBody[] = [];
        const seen = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            if (result.length >= this.purpleVortexMaxRigidbodiesPerRefresh) {
                break;
            }

            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (!this.isValidRigidBody(rb)) {
                continue;
            }

            const id = rb.GetInstanceID();
            if (seen.has(id)) {
                continue;
            }

            if (this.isCharacterColliderOrBody(self, collider, rb) || this.getHitCharacter(self, collider, rb)) {
                continue;
            }

            if (this.getRigidBodyBoundsVolume(rb) > this.purpleVortexMaxRbVolume) {
                continue;
            }

            seen.add(id);
            result.push(rb);
        }

        return result;
    }

    private applyPurpleVortexToRigidbodies(
        rigidbodies: CS.Px5.Unity.PxRigidBody[],
        center: CS.UnityEngine.Vector3,
        axis: CS.UnityEngine.Vector3,
        radius: number,
        attractRadius: number,
        deltaTime: number
    ): void {
        for (const rb of rigidbodies) {
            if (!this.isValidRigidBody(rb)) {
                continue;
            }

            this.applyPurpleVortexVelocity(rb, center, axis, radius, attractRadius, deltaTime);
        }
    }

    private applyPurpleVortexVelocity(
        rb: CS.Px5.Unity.PxRigidBody,
        center: CS.UnityEngine.Vector3,
        axis: CS.UnityEngine.Vector3,
        radius: number,
        attractRadius: number,
        deltaTime: number
    ): void {
        const bodyPos = rb.worldCenterOfMass;
        const fromCenter = Vec3.op_Subtraction(bodyPos, center);
        const axialDistance = Vec3.Dot(fromCenter, axis);
        const axialOffset = Vec3.op_Multiply(axis, axialDistance);
        let radialOut = Vec3.op_Subtraction(fromCenter, axialOffset);
        if (radialOut.sqrMagnitude <= 0.0001) {
            radialOut = Vec3.Cross(axis, Vec3.up);
            if (radialOut.sqrMagnitude <= 0.0001) {
                radialOut = Vec3.Cross(axis, Vec3.right);
            }
        }

        radialOut = this.safeDirection(radialOut, Vec3.right);
        const radialDistance = Math.max(Vec3.op_Subtraction(fromCenter, axialOffset).magnitude, 0.0001);
        const orbitRadius = Math.max(0.25, radius * this.purpleVortexOrbitRadiusMultiplier);
        const radiusStrength = Mathf.Clamp01(1.0 - fromCenter.magnitude / Math.max(0.001, attractRadius));

        const orbitError = radialDistance - orbitRadius;
        const radialDirection = orbitError >= 0
            ? Vec3.op_UnaryNegation(radialOut)
            : radialOut;
        const radialSpeed = Mathf.Clamp(
            Math.abs(orbitError) * this.purpleVortexRadialSpringSpeed + radiusStrength * 2.0,
            0,
            this.purpleVortexAttractSpeed
        );

        const tangent = this.safeDirection(Vec3.Cross(radialOut, axis), Vec3.up);
        const orbitSpeed = this.purpleVortexOrbitSpeed * (0.85 + radiusStrength * 0.35);
        const axialVelocity = Vec3.op_Multiply(
            axis,
            Mathf.Clamp(
                -axialDistance * this.purpleVortexAxialSpringSpeed,
                -this.purpleVortexAttractSpeed,
                this.purpleVortexAttractSpeed
            )
        );

        const radialVelocity = Vec3.op_Multiply(radialDirection, radialSpeed);
        const orbitVelocity = Vec3.op_Multiply(tangent, orbitSpeed);
        const desiredVelocity = Vec3.op_Addition(Vec3.op_Addition(radialVelocity, orbitVelocity), axialVelocity);
        const blend = Mathf.Clamp01(this.purpleVortexVelocityBlend + deltaTime * 2.0);
        rb.maxLinearVelocity = Math.max(rb.maxLinearVelocity, desiredVelocity.magnitude);
        rb.velocity = Vec3.Lerp(rb.velocity, desiredVelocity, blend);
        rb.angularVelocity = Vec3.Lerp(rb.angularVelocity, Vec3.op_Multiply(axis, 4.0), blend);
        rb.AddForce(Vec3.op_UnaryNegation(PxPhysics.gravity), ForceMode.Acceleration);
        rb.WakeUp();
    }

    private killRedBallHitCharacter(character: VX.Entity.EntityCharacter): void {
        ModAPI.SetCharacterHanging(character, false);
        ModAPI.SetCharacterCurrentState(character, "KnockedOut");
        ModAPI.SetCharacterCurrentState(character, "Dead");
    }

    private getHitCharacter(
        self: VX.Entity.EntityCharacter,
        collider: CS.Px5.Unity.PxCollider,
        rb: CS.Px5.Unity.PxRigidBody | null
    ): VX.Entity.EntityCharacter | null {
        if (this.isValidRigidBody(rb)) {
            const allCharacters = ModAPI.GetAllCharacters();
            const selfId = self.GetInstanceID();
            for (let i = 0; i < allCharacters.Length; i++) {
                const candidate = allCharacters.get_Item(i) as VX.Entity.EntityCharacter | null;
                if (!candidate || candidate.GetInstanceID() === selfId) {
                    continue;
                }

                if (ModAPI.CharacterContainsRigidbody(candidate, rb)) {
                    return candidate;
                }
            }
        }

        const directCharacter = collider.GetComponentInParent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        if (directCharacter && directCharacter.GetInstanceID() !== self.GetInstanceID()) {
            return directCharacter;
        }

        const allCharacters = ModAPI.GetAllCharacters();
        const selfId = self.GetInstanceID();
        for (let i = 0; i < allCharacters.Length; i++) {
            const candidate = allCharacters.get_Item(i) as VX.Entity.EntityCharacter | null;
            if (!candidate || candidate.GetInstanceID() === selfId) {
                continue;
            }

            if (collider.transform && collider.transform.IsChildOf(candidate.transform)) {
                return candidate;
            }

            const center = this.getCharacterCenter(candidate);
            const point = collider.ClosestPoint(center);
            if (Vec3.Distance(point, center) <= 1.4) {
                return candidate;
            }
        }

        return null;
    }

    private launchCharacterWithRed(
        character: VX.Entity.EntityCharacter,
        direction: CS.UnityEngine.Vector3
    ): void {
        const pushDirection = this.safeDirection(direction, this.getViewForward());
        const pushVelocity = Vec3.op_Multiply(pushDirection, this.redNpcPushVelocity);
        ModAPI.SetCharacterHanging(character, false);
        ModAPI.SetCharacterCurrentState(character, "KnockedOut");
        ModAPI.SetCharacterVelocity(character, pushVelocity);
        ModAPI.AddCharacterVelocity(character, pushVelocity, ForceMode.VelocityChange);

        this.applyRedVelocityToCharacterBody(character, "Hip", pushVelocity);
        this.applyRedVelocityToCharacterBody(character, "Torso", pushVelocity);
        this.applyRedVelocityToCharacterBody(character, "Head", pushVelocity);
        this.applyRedVelocityToCharacterBody(character, "LeftHand", pushVelocity);
        this.applyRedVelocityToCharacterBody(character, "RightHand", pushVelocity);

        const startPosition = this.getCharacterCenter(character);
        this.redLaunchedCharacters.set(character.GetInstanceID(), {
            character,
            direction: pushDirection,
            startTime: CS.UnityEngine.Time.time,
            startPosition,
            lastPosition: startPosition,
            lastSampleTime: CS.UnityEngine.Time.time,
        });
    }

    private applyRedVelocityToCharacterBody(
        character: VX.Entity.EntityCharacter,
        bodyName: string,
        velocity: CS.UnityEngine.Vector3
    ): void {
        const rb = ModAPI.GetCharacterBody(character, bodyName) as CS.Px5.Unity.PxRigidBody | null;
        if (!this.isValidRigidBody(rb)) {
            return;
        }

        rb.maxLinearVelocity = Math.max(rb.maxLinearVelocity, this.redNpcPushVelocity);
        rb.velocity = velocity;
        rb.AddForce(velocity, ForceMode.VelocityChange);
        rb.WakeUp();
    }

    private pushRedHitRigidbody(
        rb: CS.Px5.Unity.PxRigidBody | null,
        direction: CS.UnityEngine.Vector3
    ): void {
        if (!this.isValidRigidBody(rb)) {
            return;
        }

        const velocity = Vec3.op_Multiply(
            this.safeDirection(direction, this.getViewForward()),
            this.redObjectPushVelocity
        );
        rb.maxLinearVelocity = Math.max(rb.maxLinearVelocity, this.redObjectPushVelocity);
        rb.velocity = Vec3.op_Addition(rb.velocity, velocity);
        rb.AddForce(velocity, ForceMode.VelocityChange);
        rb.WakeUp();
    }

    private updateRedLaunchedCharacters(self: VX.Entity.EntityCharacter): void {
        const now = CS.UnityEngine.Time.time;
        const toRemove: number[] = [];
        this.redLaunchedCharacters.forEach((launched, id) => {
            if (!this.isUnityObjectAlive(launched.character)) {
                toRemove.push(id);
                return;
            }

            const age = now - launched.startTime;
            const center = this.getCharacterCenter(launched.character);
            const currentSpeed = this.getRedLaunchedCharacterSpeed(launched, center, now);
            const traveled = Vec3.Distance(center, launched.startPosition);
            this.drawRedLaunchedSpeedDebug(center, currentSpeed, age, traveled);
            const canExplodeOnWall = age >= this.redLaunchedWallImpactGraceTime
                && traveled >= this.redLaunchedWallImpactMinTravel;

            if (age >= this.redLaunchedForcedExplosionTime) {
                this.explodeRedLaunchedCharacter(self, launched.character, center, launched.direction);
                toRemove.push(id);
                return;
            }

            if (canExplodeOnWall && this.hasRedLaunchedCharacterHitObject(self, launched.character, center, launched.direction)) {
                this.explodeRedLaunchedCharacter(self, launched.character, center, launched.direction);
                toRemove.push(id);
                return;
            }

            if (age > this.redLaunchedMaxTrackTime) {
                toRemove.push(id);
                return;
            }

            launched.lastPosition = center;
            launched.lastSampleTime = now;
        });

        for (const id of toRemove) {
            this.redLaunchedCharacters.delete(id);
        }
    }

    private drawRedLaunchedSpeedDebug(
        center: CS.UnityEngine.Vector3,
        speed: number,
        age: number,
        traveled: number
    ): void {
        if (!Giz.show) {
            return;
        }

        const labelPos = Vec3.op_Addition(center, Vec3.op_Multiply(Vec3.up, 0.75));
        const canWallExplode = age >= this.redLaunchedWallImpactGraceTime
            && traveled >= this.redLaunchedWallImpactMinTravel;
        const color = canWallExplode
            ? new Color(1.0, 0.8, 0.1, 1.0)
            : new Color(0.35, 0.8, 1.0, 1.0);
        Giz.DrawLabel(
            labelPos,
            "RedLaunch"
                + "\nspd " + speed.toFixed(2)
                + "\ntravel " + traveled.toFixed(2) + " / " + this.redLaunchedWallImpactMinTravel.toFixed(1)
                + "\nwallReady " + canWallExplode
                + "\nage " + age.toFixed(2)
                + " / force " + this.redLaunchedForcedExplosionTime.toFixed(1),
            color,
            13
        );
    }

    private getRedLaunchedCharacterSpeed(
        launched: RedLaunchedCharacter,
        center: CS.UnityEngine.Vector3,
        now: number
    ): number {
        const dt = Math.max(now - launched.lastSampleTime, 0.0001);
        const travelSpeed = Vec3.Distance(center, launched.lastPosition) / dt;
        const hip = ModAPI.GetCharacterBody(launched.character, "Hip") as CS.Px5.Unity.PxRigidBody | null;
        const torso = ModAPI.GetCharacterBody(launched.character, "Torso") as CS.Px5.Unity.PxRigidBody | null;
        const hipSpeed = this.isValidRigidBody(hip) ? hip.velocity.magnitude : 0;
        const torsoSpeed = this.isValidRigidBody(torso) ? torso.velocity.magnitude : 0;
        return Math.max(travelSpeed, hipSpeed, torsoSpeed);
    }

    private hasRedLaunchedCharacterHitObject(
        self: VX.Entity.EntityCharacter,
        launched: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): boolean {
        const colliders = PxPhysics.OverlapSphere(
            center,
            this.redLaunchedContactRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return false;
        }

        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (this.isCharacterColliderOrBody(self, collider, rb) || this.isCharacterColliderOrBody(launched, collider, rb)) {
                continue;
            }

            if (!this.isRedLaunchedWallLikeContact(collider, center, direction)) {
                continue;
            }

            return true;
        }

        return false;
    }

    private isRedLaunchedWallLikeContact(
        collider: CS.Px5.Unity.PxCollider,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): boolean {
        const closest = collider.ClosestPoint(center);
        const toContact = Vec3.op_Subtraction(closest, center);
        const flatContact = new Vec3(toContact.x, 0, toContact.z);
        const horizontalDistance = flatContact.magnitude;
        if (horizontalDistance < this.redLaunchedWallMinHorizontalContact) {
            return false;
        }

        const flatDirection = new Vec3(direction.x, 0, direction.z);
        if (flatDirection.sqrMagnitude <= 0.0001) {
            return true;
        }

        const forwardDot = Vec3.Dot(flatContact.normalized, flatDirection.normalized);
        return forwardDot >= this.redLaunchedWallForwardDot;
    }

    private explodeRedLaunchedCharacter(
        self: VX.Entity.EntityCharacter,
        launched: VX.Entity.EntityCharacter,
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const towardPlayer = this.safeDirection(
            Vec3.op_Subtraction(this.getCharacterCenter(self), center),
            direction
        );
        this.drawRedExplosionDebug(center, towardPlayer);
        ModAPI.PlayVFX("Concrete_Debris", center, 8.0);
        ModAPI.PlayVFX("Concrete_Debris", center, 14.0);
        ModAPI.PlayVFX("Concrete_Debris", center, 28.0);
        this.playRedHitFx(this.getPrimaryRedFxRuntime(), center, towardPlayer);
        const colliders = PxPhysics.OverlapSphere(
            center,
            this.redLaunchedExplosionRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        const seenVoxels = new Set<number>();
        const seenRigidbodies = new Set<number>();
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (this.isCharacterColliderOrBody(self, collider, rb) || this.isCharacterColliderOrBody(launched, collider, rb)) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (voxel && ModAPI.IsVoxelDestructible(voxel)) {
                const voxelId = voxel.GetInstanceID();
                if (!seenVoxels.has(voxelId)) {
                    seenVoxels.add(voxelId);
                    ModAPI.DemolishVoxelSphere(
                        voxel,
                        center,
                        this.redLaunchedExplosionRadius,
                        this.redLaunchedExplosionForce,
                        towardPlayer,
                        this.redDemolishSpreadAngle * Mathf.Deg2Rad,
                        this.redLaunchedExplosionMaxFragments
                    );
                }
            }

            if (this.isValidRigidBody(rb)) {
                const rbId = rb.GetInstanceID();
                if (seenRigidbodies.has(rbId)) {
                    continue;
                }
                seenRigidbodies.add(rbId);
                const velocity = Vec3.op_Multiply(towardPlayer, this.redObjectPushVelocity);
                rb.maxLinearVelocity = Math.max(rb.maxLinearVelocity, this.redObjectPushVelocity);
                rb.velocity = Vec3.op_Addition(rb.velocity, velocity);
                rb.AddForce(velocity, ForceMode.VelocityChange);
                rb.WakeUp();
            }
        }
    }

    private drawRedExplosionDebug(
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        if (!Giz.show) {
            return;
        }

        Giz.PushDuration(3.0);
        const color = new Color(1.0, 0.1, 0.02, 1.0);
        Giz.DrawWireSphere(center, this.redLaunchedExplosionRadius, color);
        Giz.DrawSphereOutline(center, this.redLaunchedExplosionRadius * 0.65, new Color(1.0, 0.55, 0.0, 1.0));
        Giz.DrawRayArrow(center, Vec3.op_Multiply(direction, this.redLaunchedExplosionRadius), Color.red);
        Giz.DrawLabel(
            Vec3.op_Addition(center, Vec3.op_Multiply(Vec3.up, this.redLaunchedExplosionRadius + 0.35)),
            "Red Explosion\nConcrete_Debris",
            color,
            16
        );
        Giz.PopDuration();
    }

    private updatePendingRedBallExplosions(self: VX.Entity.EntityCharacter): void {
        if (this.pendingRedBallExplosions.length <= 0) {
            return;
        }

        const now = CS.UnityEngine.Time.time;
        const remaining: PendingRedBallExplosion[] = [];
        for (const pending of this.pendingRedBallExplosions) {
            if (!this.isUnityObjectAlive(pending.character)) {
                continue;
            }

            if (now < pending.triggerTime) {
                remaining.push(pending);
                continue;
            }

            this.explodeRedBallCharacter(self, pending.character, pending.direction);
        }

        this.pendingRedBallExplosions = remaining;
    }

    private explodeRedBallCharacter(
        self: VX.Entity.EntityCharacter,
        target: VX.Entity.EntityCharacter,
        direction: CS.UnityEngine.Vector3
    ): void {
        const center = this.getCharacterCenter(target);
        const explodeDirection = this.safeDirection(direction, this.getViewForward());
        this.killRedBallHitCharacter(target);
        this.drawRedBallExplosionDebug(center, explodeDirection);
        ModAPI.PlayVFX("Concrete_Debris", center, 10.0);
        ModAPI.PlayVFX("Concrete_Debris", center, 18.0);
        this.playRedBallHitFx(this.getPrimaryRedFxRuntime(), center, explodeDirection);

        const colliders = PxPhysics.OverlapSphere(
            center,
            this.redBallExplosionRadius,
            -1,
            QueryTriggerInteraction.Ignore
        );
        if (!colliders || colliders.Length <= 0) {
            return;
        }

        const seenVoxels = new Set<number>();
        const seenRigidbodies = new Set<number>();
        for (let i = 0; i < colliders.Length; i++) {
            const collider = colliders.get_Item(i) as CS.Px5.Unity.PxCollider | null;
            if (!collider) {
                continue;
            }

            const rb = this.getColliderRigidBody(collider);
            if (
                this.isCharacterColliderOrBody(self, collider, rb)
                || this.isCharacterColliderOrBody(target, collider, rb)
                || this.isAnyNonSelfCharacterColliderOrBody(self, collider, rb)
            ) {
                continue;
            }

            const voxel = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
            if (voxel && ModAPI.IsVoxelDestructible(voxel)) {
                const voxelId = voxel.GetInstanceID();
                if (!seenVoxels.has(voxelId)) {
                    seenVoxels.add(voxelId);
                    ModAPI.DemolishVoxelSphere(
                        voxel,
                        center,
                        this.redBallExplosionRadius,
                        this.redBallExplosionForce,
                        explodeDirection,
                        Mathf.PI,
                        this.redBallExplosionMaxFragments
                    );
                }
            }

            if (this.isValidRigidBody(rb)) {
                const rbId = rb.GetInstanceID();
                if (seenRigidbodies.has(rbId)) {
                    continue;
                }
                seenRigidbodies.add(rbId);
                const outward = this.safeDirection(Vec3.op_Subtraction(rb.worldCenterOfMass, center), explodeDirection);
                const explosionVelocity = this.redObjectPushVelocity * this.redBallExplosionObjectVelocityMultiplier;
                const velocity = Vec3.op_Multiply(outward, explosionVelocity);
                rb.maxLinearVelocity = Math.max(rb.maxLinearVelocity, explosionVelocity);
                rb.velocity = Vec3.op_Addition(rb.velocity, velocity);
                rb.AddForce(velocity, ForceMode.VelocityChange);
                rb.WakeUp();
            }
        }
    }

    private drawRedBallExplosionDebug(
        center: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        if (!Giz.show) {
            return;
        }

        Giz.PushDuration(3.0);
        const color = new Color(1.0, 0.0, 0.0, 1.0);
        Giz.DrawWireSphere(center, this.redBallExplosionRadius, color);
        Giz.DrawSphereOutline(center, this.redBallDigRadius, new Color(1.0, 0.35, 0.35, 1.0));
        Giz.DrawRayArrow(center, Vec3.op_Multiply(direction, this.redBallExplosionRadius), color);
        Giz.DrawLabel(
            Vec3.op_Addition(center, Vec3.op_Multiply(Vec3.up, this.redBallExplosionRadius + 0.35)),
            "Red Ball Explosion",
            color,
            16
        );
        Giz.PopDuration();
    }

    private isCharacterColliderOrBody(
        character: VX.Entity.EntityCharacter,
        collider: CS.Px5.Unity.PxCollider,
        rb: CS.Px5.Unity.PxRigidBody | null
    ): boolean {
        if (collider.transform && collider.transform.IsChildOf(character.transform)) {
            return true;
        }

        return this.isValidRigidBody(rb) && ModAPI.CharacterContainsRigidbody(character, rb);
    }

    private isAnyNonSelfCharacterColliderOrBody(
        self: VX.Entity.EntityCharacter,
        collider: CS.Px5.Unity.PxCollider,
        rb: CS.Px5.Unity.PxRigidBody | null
    ): boolean {
        const allCharacters = ModAPI.GetAllCharacters();
        const selfId = self.GetInstanceID();
        for (let i = 0; i < allCharacters.Length; i++) {
            const candidate = allCharacters.get_Item(i) as VX.Entity.EntityCharacter | null;
            if (!candidate || candidate.GetInstanceID() === selfId) {
                continue;
            }

            if (this.isCharacterColliderOrBody(candidate, collider, rb)) {
                return true;
            }
        }

        return false;
    }

    private applySingularityVelocity(
        rb: CS.Px5.Unity.PxRigidBody,
        center: CS.UnityEngine.Vector3,
        deltaTime: number,
        ignoreAttractRadius: boolean
    ): void {
        const bodyPos = rb.worldCenterOfMass;
        const toCenter = Vec3.op_Subtraction(center, bodyPos);
        const distSqr = Math.max(toCenter.sqrMagnitude, 0.0001);
        if (!ignoreAttractRadius && distSqr > this.singularityAttractRadiusSqr) {
            return;
        }

        const distance = Math.sqrt(distSqr);
        const flatToCenter = new Vec3(toCenter.x, 0, toCenter.z);
        const flatDistance = Math.max(flatToCenter.magnitude, 0.0001);
        const inward = this.safeDirection(flatToCenter, this.safeDirection(toCenter, Vec3.forward));
        let tangent = Vec3.Cross(inward, Vec3.up);
        if (tangent.sqrMagnitude <= 0.0001) {
            tangent = Vec3.Cross(inward, this.getViewForward());
        }
        tangent = this.safeDirection(tangent, Vec3.right);

        const radiusStrength = Mathf.Clamp01(1.0 - flatDistance / this.singularityAttractRadius);
        const orbitError = flatDistance - this.singularityOrbitRadius;
        const radialDirection = orbitError >= 0
            ? inward
            : Vec3.op_UnaryNegation(inward);
        const radialSpeed = Mathf.Clamp(
            Math.abs(orbitError) * this.singularityRadialSpringSpeed + radiusStrength * 1.5,
            0,
            this.singularityAttractSpeed
        );
        const orbitSpeed = this.singularityOrbitSpeed * (0.85 + radiusStrength * 0.35);
        const verticalSpeed = Mathf.Clamp(
            (center.y - bodyPos.y) * this.singularityVerticalSpringSpeed,
            -this.singularityAttractSpeed,
            this.singularityAttractSpeed
        );

        const radialVelocity = Vec3.op_Multiply(radialDirection, radialSpeed);
        const orbitVelocity = Vec3.op_Multiply(tangent, orbitSpeed);
        const verticalVelocity = Vec3.op_Multiply(Vec3.up, verticalSpeed);
        const desiredVelocity = Vec3.op_Addition(Vec3.op_Addition(radialVelocity, orbitVelocity), verticalVelocity);

        const blend = Mathf.Clamp01(this.singularityVelocityBlend + deltaTime * 2.0);
        rb.velocity = Vec3.Lerp(rb.velocity, desiredVelocity, blend);
        rb.angularVelocity = Vec3.Lerp(rb.angularVelocity, Vec3.op_Multiply(tangent, 4.6), blend);
        rb.AddForce(Vec3.op_UnaryNegation(PxPhysics.gravity), ForceMode.Acceleration);
        rb.WakeUp();
    }

    private updateOrbAttachment(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter | null
    ): void {
        if (this.shouldFadePurpleBlueIngredient(runtime)) {
            return;
        }

        if (runtime.mode === GojoAbilityMode.Singularity) {
            this.detachMagicOrbFromHand(runtime);
        } else if (this.shouldKeepDetachedOrbForFade(runtime)) {
            return;
        } else {
            this.ensureOrbAttachedToHand(runtime, character, runtime.isLeft);
        }
    }

    private shouldKeepDetachedOrbForFade(runtime: HandAbilityRuntime): boolean {
        const orb = runtime.fx.handMagicOrb;
        return runtime.mode === GojoAbilityMode.None
            && this.isUnityObjectAlive(orb)
            && orb.parent == null
            && orb.gameObject.activeSelf
            && orb.localScale.sqrMagnitude > 0.000001;
    }

    private detachMagicOrbFromHand(runtime: HandAbilityRuntime): void {
        const orb = runtime.fx.handMagicOrb;
        if (!this.isUnityObjectAlive(orb)) {
            return;
        }

        if (orb.parent != null) {
            orb.SetParent(null as never as CS.UnityEngine.Transform);
        }
        runtime.fx.orbAttachedHandIsLeft = null;
    }

    private updateOrb(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter | null, deltaTime: number): void {
        const orb = runtime.fx.handMagicOrb;
        if (!this.isUnityObjectAlive(orb)) {
            runtime.fx.handMagicOrb = null;
            return;
        }

        const showPurpleBlueIngredient = this.shouldShowPurpleBlueIngredient(runtime);
        if (this.shouldFadePurpleBlueIngredient(runtime)) {
            this.detachMagicOrbFromHand(runtime);
            orb.gameObject.SetActive(true);
            orb.position = this.getPurpleIngredientMergePosition(orb.position, deltaTime);
            orb.rotation = Quat.LookRotation(this.safeDirection(this.purpleDirection, this.getViewForward()), Vec3.up);
            const scale = this.singularityOrbScale * this.getPurpleIngredientFadeScale();
            orb.localScale = Vec3.op_Multiply(Vec3.one, scale);
            if (scale <= 0.001) {
                orb.localScale = Vec3.zero;
                orb.gameObject.SetActive(false);
            }
            return;
        }

        const targetScale = (runtime.mode === GojoAbilityMode.Singularity || showPurpleBlueIngredient)
            ? this.singularityOrbScale + runtime.singularityOrbFlightScaleExtra
            : (runtime.mode === GojoAbilityMode.Slowdown ? this.orbScale : 0);
        const currentScale = orb.localScale.x;
        const nextScale = Mathf.MoveTowards(currentScale, targetScale, this.orbScaleSpeed * deltaTime);
        if (runtime.mode === GojoAbilityMode.Singularity) {
            runtime.singularityOrbFlightScaleExtra = Mathf.MoveTowards(
                runtime.singularityOrbFlightScaleExtra,
                0,
                this.singularityOrbFlyRecoverSpeed * deltaTime
            );
        } else {
            runtime.singularityOrbFlightScaleExtra = 0;
        }

        const target = character
            ? (showPurpleBlueIngredient ? this.getPurpleBlueOrbTarget(character, runtime) : this.getOrbTarget(runtime, character))
            : null;
        if ((this.isAbilityActive(runtime) || showPurpleBlueIngredient) && target) {
            orb.gameObject.SetActive(true);
            const lerp = Mathf.Clamp01(this.orbPositionLerpSpeed * deltaTime);
            orb.position = Vec3.Lerp(orb.position, target.position, lerp);
            orb.rotation = target.rotation;
        }

        orb.localScale = Vec3.op_Multiply(Vec3.one, nextScale);
        if (!this.isAbilityActive(runtime) && !showPurpleBlueIngredient && nextScale <= 0.001) {
            orb.localScale = Vec3.zero;
            orb.gameObject.SetActive(false);
        }
    }

    private shouldShowPurpleBlueIngredient(runtime: HandAbilityRuntime): boolean {
        return this.mode !== GojoAbilityMode.PurpleCharge
            && runtime.mode !== GojoAbilityMode.Singularity
            && this.purpleBlueIngredientHandIsLeft === runtime.isLeft;
    }

    private shouldFadePurpleBlueIngredient(runtime: HandAbilityRuntime): boolean {
        return this.mode === GojoAbilityMode.PurpleCharge
            && this.purpleBlueIngredientHandIsLeft === runtime.isLeft
            && this.purpleIngredientFadeTime < this.purpleIngredientFadeDuration;
    }

    private updateRedDotFx(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter | null, deltaTime: number): void {
        const fx = runtime.fx.redDotFX;
        if (!this.isUnityObjectAlive(fx)) {
            runtime.fx.redDotFX = null;
            return;
        }

        if (runtime.mode === GojoAbilityMode.RedCharge && character) {
            const target = this.getRedDotHandTarget(character, runtime.isLeft);
            if (!target) {
                this.deactivateHandAbility(runtime);
                return;
            }

            runtime.redProjectileDirection = target.direction;
            const follow = Mathf.Clamp01(1.0 - Math.exp(-deltaTime / Math.max(0.001, this.redDotFollowTime)));
            runtime.redProjectilePosition = Vec3.Lerp(runtime.redProjectilePosition, target.position, follow);
            this.showRedFxRoot(runtime);
            fx.gameObject.SetActive(true);
            fx.position = runtime.redProjectilePosition;
            fx.rotation = Quat.LookRotation(target.direction, this.safeDirection(target.up, Vec3.up));
            fx.localScale = runtime.fx.redDotFXBaseScale;
            return;
        }

        fx.localScale = Vec3.zero;
        fx.gameObject.SetActive(false);
    }

    private updateRedBallFx(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter | null, deltaTime: number): void {
        const fx = runtime.fx.redBallFX;
        if (!this.isUnityObjectAlive(fx)) {
            runtime.fx.redBallFX = null;
            return;
        }

        if (runtime.mode === GojoAbilityMode.RedBallCharge && character) {
            const target = this.getRedBallHandTarget(character, runtime.isLeft);
            if (!target) {
                this.deactivateHandAbility(runtime);
                return;
            }

            runtime.redBallDirection = target.direction;
            const follow = Mathf.Clamp01(1.0 - Math.exp(-deltaTime / Math.max(0.001, this.redBallFollowTime)));
            runtime.redBallPosition = Vec3.Lerp(runtime.redBallPosition, target.position, follow);
            this.showRedFxRoot(runtime);
            fx.gameObject.SetActive(true);
            fx.position = runtime.redBallPosition;
            fx.rotation = Quat.LookRotation(target.direction, this.safeDirection(target.up, Vec3.up));
            fx.localScale = runtime.fx.redBallFXBaseScale;
            return;
        }

        if (this.shouldFadePurpleRedIngredient(runtime)) {
            const scale = this.getPurpleIngredientFadeScale();
            this.showRedFxRoot(runtime);
            fx.gameObject.SetActive(true);
            fx.position = this.getPurpleIngredientMergePosition(fx.position, deltaTime);
            fx.rotation = Quat.LookRotation(this.safeDirection(this.purpleDirection, this.getViewForward()), Vec3.up);
            fx.localScale = Vec3.op_Multiply(runtime.fx.redBallFXBaseScale, scale);
            if (scale <= 0.001) {
                fx.localScale = Vec3.zero;
                fx.gameObject.SetActive(false);
            }
            return;
        }

        if (this.shouldShowPurpleRedIngredient(runtime) && character) {
            const target = this.getRedBallHandTargetForHand(character, runtime.isLeft);
            if (target) {
                runtime.redBallPosition = target.position;
                runtime.redBallDirection = target.direction;
                this.showRedFxRoot(runtime);
                fx.gameObject.SetActive(true);
                fx.position = runtime.redBallPosition;
                fx.rotation = Quat.LookRotation(target.direction, this.safeDirection(target.up, Vec3.up));
                fx.localScale = runtime.fx.redBallFXBaseScale;
                return;
            }
        }

        fx.localScale = Vec3.zero;
        fx.gameObject.SetActive(false);
    }

    private shouldShowPurpleRedIngredient(runtime: HandAbilityRuntime): boolean {
        return this.mode !== GojoAbilityMode.PurpleCharge
            && runtime.mode !== GojoAbilityMode.RedBallCharge
            && this.purpleRedIngredientHandIsLeft === runtime.isLeft;
    }

    private shouldFadePurpleRedIngredient(runtime: HandAbilityRuntime): boolean {
        return this.mode === GojoAbilityMode.PurpleCharge
            && this.purpleRedIngredientHandIsLeft === runtime.isLeft
            && this.purpleIngredientFadeTime < this.purpleIngredientFadeDuration;
    }

    private updateRedHitFx(runtime: HandAbilityRuntime, deltaTime: number): void {
        const fx = runtime.fx.redDotHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            runtime.fx.redDotHitFX = null;
            return;
        }

        if (runtime.fx.redHitFxTimer > 0) {
            runtime.fx.redHitFxTimer = Math.max(0, runtime.fx.redHitFxTimer - deltaTime);
            this.showRedFxRoot(runtime);
            fx.gameObject.SetActive(true);
            fx.localScale = runtime.fx.redDotHitFXBaseScale;
            if (runtime.fx.redHitFxTimer <= 0) {
                fx.localScale = Vec3.zero;
                fx.gameObject.SetActive(false);
            }
            return;
        }

        if (fx.gameObject.activeSelf) {
            fx.localScale = Vec3.zero;
            fx.gameObject.SetActive(false);
        }
    }

    private updateRedBallHitFx(runtime: HandAbilityRuntime, deltaTime: number): void {
        const fx = runtime.fx.redBallHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            runtime.fx.redBallHitFX = null;
            return;
        }

        if (runtime.fx.redBallHitFxTimer > 0) {
            runtime.fx.redBallHitFxTimer = Math.max(0, runtime.fx.redBallHitFxTimer - deltaTime);
            this.showRedFxRoot(runtime);
            fx.gameObject.SetActive(true);
            fx.localScale = runtime.fx.redBallHitFXBaseScale;
            if (runtime.fx.redBallHitFxTimer <= 0) {
                fx.localScale = Vec3.zero;
                fx.gameObject.SetActive(false);
            }
            return;
        }

        if (fx.gameObject.activeSelf) {
            fx.localScale = Vec3.zero;
            fx.gameObject.SetActive(false);
        }
    }

    private updatePurpleFx(character: VX.Entity.EntityCharacter | null, deltaTime: number): void {
        const fx = this.purpleFX;
        if (!this.isUnityObjectAlive(fx)) {
            this.purpleFX = null;
            return;
        }

        if (this.mode === GojoAbilityMode.PurpleCharge) {
            this.showPurpleFxRoot();
            fx.gameObject.SetActive(true);
            fx.position = this.purplePosition;
            fx.rotation = Quat.LookRotation(this.safeDirection(this.purpleDirection, this.getViewForward()), Vec3.up);
            const targetScale = this.getPurpleFxScale(0);
            if (!this.purpleFXHasAnimation && this.purpleChargeIntroTime < this.purpleManualAppearDuration) {
                fx.localScale = Vec3.Lerp(Vec3.zero, targetScale, this.getPurpleChargeIntroProgress());
            } else {
                fx.localScale = Vec3.Lerp(fx.localScale, targetScale, Mathf.Clamp01(this.abilityFxScaleSpeed * deltaTime));
            }
            return;
        }

        fx.localScale = Vec3.zero;
        fx.gameObject.SetActive(false);
    }

    private updatePurpleHitFx(deltaTime: number): void {
        const fx = this.purpleHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            this.purpleHitFX = null;
            return;
        }

        if (this.purpleHitFxTimer > 0) {
            this.purpleHitFxTimer = Math.max(0, this.purpleHitFxTimer - deltaTime);
            this.showPurpleFxRoot();
            fx.gameObject.SetActive(true);
            fx.localScale = this.purpleHitFxScale;
            if (this.purpleHitFxTimer <= 0) {
                fx.localScale = Vec3.zero;
                fx.gameObject.SetActive(false);
            }
            return;
        }

        if (fx.gameObject.activeSelf) {
            fx.localScale = Vec3.zero;
            fx.gameObject.SetActive(false);
        }
    }

    private playRedHitFx(runtime: HandAbilityRuntime, position: CS.UnityEngine.Vector3, direction: CS.UnityEngine.Vector3): void {
        const fx = runtime.fx.redDotHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.showRedFxRoot(runtime);
        fx.gameObject.SetActive(true);
        fx.position = position;
        fx.rotation = Quat.LookRotation(this.safeDirection(direction, this.getViewForward()), Vec3.up);
        fx.localScale = runtime.fx.redDotHitFXBaseScale;
        runtime.fx.redHitFxTimer = this.redHitFxDuration;
    }

    private playRedBallHitFx(runtime: HandAbilityRuntime, position: CS.UnityEngine.Vector3, direction: CS.UnityEngine.Vector3): void {
        const fx = runtime.fx.redBallHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.showRedFxRoot(runtime);
        fx.gameObject.SetActive(false);
        fx.position = position;
        fx.rotation = Quat.LookRotation(this.safeDirection(direction, this.getViewForward()), Vec3.up);
        fx.localScale = runtime.fx.redBallHitFXBaseScale;
        fx.gameObject.SetActive(true);
        this.restartParticleSystems(fx);
        runtime.fx.redBallHitFxTimer = this.redHitFxDuration;
    }

    private playPurpleHitFx(position: CS.UnityEngine.Vector3, direction: CS.UnityEngine.Vector3, distance: number): void {
        const fx = this.purpleHitFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.purpleHitFxScale = this.getPurpleHitFxScale(distance);
        this.showPurpleFxRoot();
        fx.gameObject.SetActive(false);
        fx.position = position;
        fx.rotation = Quat.LookRotation(this.safeDirection(direction, this.getViewForward()), Vec3.up);
        fx.localScale = this.purpleHitFxScale;
        fx.gameObject.SetActive(true);
        this.restartParticleSystems(fx);
        this.purpleHitFxTimer = this.purpleHitFxDuration;
    }

    private getPurpleFxScale(distance: number): CS.UnityEngine.Vector3 {
        return Vec3.op_Multiply(
            this.purpleFXBaseScale,
            this.purpleScale * this.getPurpleDistanceScaleMultiplier(distance)
        );
    }

    private getPurpleHitFxScale(distance: number): CS.UnityEngine.Vector3 {
        return Vec3.op_Multiply(
            this.purpleHitFXBaseScale,
            this.getPurpleDistanceScaleMultiplier(distance)
        );
    }

    private getPurpleDistanceScaleMultiplier(distance: number): number {
        const t = Mathf.Clamp01(distance / Math.max(0.001, this.purpleProjectileMaxDistance));
        return Mathf.Lerp(1.0, this.purpleProjectileMaxScaleMultiplier, t);
    }

    private showRedFxRoot(runtime: HandAbilityRuntime): void {
        const root = runtime.fx.redFxRoot;
        if (this.isUnityObjectAlive(root)) {
            if (root.parent != null) {
                root.SetParent(null as never as CS.UnityEngine.Transform);
            }
            root.gameObject.SetActive(true);
        }
    }

    private getHandRuntime(isLeft: boolean): HandAbilityRuntime {
        return isLeft ? this.leftAbility : this.rightAbility;
    }

    private getPrimaryRedFxRuntime(): HandAbilityRuntime {
        if (this.leftAbility.fx.redDotHitFX || this.leftAbility.fx.redBallHitFX) {
            return this.leftAbility;
        }

        return this.rightAbility;
    }

    private getLatestRedProjectileForHand(isLeft: boolean): RedProjectile | null {
        for (let i = this.redProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.redProjectiles[i];
            if (projectile.ownerIsLeft === isLeft) {
                return projectile;
            }
        }

        return null;
    }

    private getLatestRedBallProjectileForHand(isLeft: boolean): RedBallProjectile | null {
        for (let i = this.redBallProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.redBallProjectiles[i];
            if (projectile.ownerIsLeft === isLeft) {
                return projectile;
            }
        }

        return null;
    }

    private showPurpleFxRoot(): void {
        const root = this.purpleFxRoot;
        if (this.isUnityObjectAlive(root)) {
            if (root.parent != null) {
                root.SetParent(null as never as CS.UnityEngine.Transform);
            }
            root.gameObject.SetActive(true);
        }
    }

    private getRedDotHandTarget(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        const direction = this.safeDirection(hand.transform.up, this.getViewForward());
        const up = this.safeDirection(hand.transform.forward, Vec3.up);
        return {
            position: Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(direction, this.redDotForwardOffset)),
            direction,
            up,
        };
    }

    private getRedBallHandTarget(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        return this.getRedBallHandTargetForHand(character, isLeft);
    }

    private getRedBallHandTargetForHand(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        const direction = this.safeDirection(hand.transform.forward, this.getViewForward());
        const up = this.safeDirection(hand.transform.up, Vec3.up);
        return {
            position: Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(direction, this.redBallForwardOffset)),
            direction,
            up,
        };
    }

    private getBlueIngredientHandTarget(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        const direction = this.safeDirection(hand.transform.forward, this.getViewForward());
        const up = this.safeDirection(hand.transform.up, Vec3.up);
        return {
            position: Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(direction, this.orbForwardOffset)),
            direction,
            up,
        };
    }

    private getPurpleBlueOrbTarget(
        character: VX.Entity.EntityCharacter,
        runtime: HandAbilityRuntime
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion } | null {
        if (this.purpleBlueIngredientHandIsLeft !== runtime.isLeft) {
            return null;
        }

        const target = this.getBlueIngredientHandTarget(character, runtime.isLeft);
        if (!target) {
            return null;
        }

        this.purpleBlueIngredientPosition = target.position;
        return {
            position: target.position,
            rotation: Quat.LookRotation(target.direction, target.up),
        };
    }

    private getPurpleHandTarget(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        const direction = this.safeDirection(hand.transform.forward, this.getViewForward());
        const up = this.safeDirection(hand.transform.up, Vec3.up);
        return {
            position: Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(direction, this.purpleHandForwardOffset)),
            direction,
            up,
        };
    }

    private getPurpleSafeHoldPosition(
        character: VX.Entity.EntityCharacter,
        leftHandIsLeft: boolean,
        rightHandIsLeft: boolean
    ): CS.UnityEngine.Vector3 | null {
        const leftTarget = this.getPurpleForwardHandTargetOrNull(character, leftHandIsLeft);
        const rightTarget = this.getPurpleForwardHandTargetOrNull(character, rightHandIsLeft);
        if (leftTarget && rightTarget) {
            return Vec3.Lerp(leftTarget.position, rightTarget.position, 0.5);
        }

        if (leftTarget) {
            return leftTarget.position;
        }

        if (rightTarget) {
            return rightTarget.position;
        }

        return this.getPurplePlayerFrontPosition(character);
    }

    private getPurpleForwardHandTargetOrNull(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; direction: CS.UnityEngine.Vector3; up: CS.UnityEngine.Vector3 } | null {
        const target = this.getPurpleHandTarget(character, isLeft);
        if (!target) {
            return null;
        }

        if (Vec3.Dot(target.direction, this.getViewForward()) < this.purpleHandForwardDot) {
            return null;
        }

        return target;
    }

    private getPurplePlayerFrontPosition(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        return Vec3.op_Addition(
            this.getCharacterCenter(character),
            Vec3.op_Multiply(this.getViewForward(), this.purpleHandForwardOffset)
        );
    }

    private getPurpleHandDirection(character: VX.Entity.EntityCharacter, isLeft: boolean): CS.UnityEngine.Vector3 {
        const target = this.getPurpleHandTarget(character, isLeft);
        return target ? target.direction : this.getViewForward();
    }

    private snapRedDotToPosition(
        runtime: HandAbilityRuntime,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = runtime.fx.redDotFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.showRedFxRoot(runtime);
        fx.gameObject.SetActive(true);
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = runtime.fx.redDotFXBaseScale;
    }

    private snapRedBallToPosition(
        runtime: HandAbilityRuntime,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = runtime.fx.redBallFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.showRedFxRoot(runtime);
        fx.gameObject.SetActive(true);
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = runtime.fx.redBallFXBaseScale;
    }

    private snapPurpleToPosition(
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = this.purpleFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        this.showPurpleFxRoot();
        fx.gameObject.SetActive(true);
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = this.getPurpleFxScale(0);
    }

    private cancelPurpleProjectiles(): void {
        if (this.purpleProjectiles.length <= 0) {
            return;
        }

        for (const projectile of this.purpleProjectiles) {
            this.destroyProjectileFx(projectile.fx);
        }
        this.purpleProjectiles = [];
    }

    private restartRedDotToPosition(
        runtime: HandAbilityRuntime,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = runtime.fx.redDotFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        fx.gameObject.SetActive(false);
        this.showRedFxRoot(runtime);
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = runtime.fx.redDotFXBaseScale;
        fx.gameObject.SetActive(true);
        this.restartParticleSystems(fx);
    }

    private restartRedBallToPosition(
        runtime: HandAbilityRuntime,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = runtime.fx.redBallFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        fx.gameObject.SetActive(false);
        this.showRedFxRoot(runtime);
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = runtime.fx.redBallFXBaseScale;
        fx.gameObject.SetActive(true);
        this.restartParticleSystems(fx);
    }

    private restartPurpleToPosition(
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): void {
        const fx = this.purpleFX;
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        fx.gameObject.SetActive(false);
        this.showPurpleFxRoot();
        fx.position = position;
        fx.rotation = Quat.LookRotation(direction, Vec3.up);
        fx.localScale = this.purpleFXHasAnimation ? this.getPurpleFxScale(0) : Vec3.zero;
        fx.gameObject.SetActive(true);
        this.restartParticleSystems(fx);
    }

    private createProjectileFxClone(
        source: CS.UnityEngine.Transform | null,
        suffix: string,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        scale: CS.UnityEngine.Vector3
    ): CS.UnityEngine.Transform | null {
        if (!this.isUnityObjectAlive(source)) {
            return null;
        }

        const fx = this.cloneTransform(source, suffix);
        if (!this.isUnityObjectAlive(fx)) {
            return null;
        }

        if (fx.parent != null) {
            fx.SetParent(null as never as CS.UnityEngine.Transform);
        }
        this.updateProjectileFxTransform(fx, position, direction, scale);
        this.restartParticleSystems(fx);
        return fx;
    }

    private updateProjectileFxTransform(
        fx: CS.UnityEngine.Transform | null,
        position: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        scale: CS.UnityEngine.Vector3
    ): void {
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        fx.gameObject.SetActive(true);
        fx.position = position;
        fx.rotation = Quat.LookRotation(this.safeDirection(direction, this.getViewForward()), Vec3.up);
        fx.localScale = scale;
    }

    private destroyProjectileFx(fx: CS.UnityEngine.Transform | null): void {
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        UnityObject.Destroy(fx.gameObject);
    }

    private destroyAllProjectileFx(): void {
        for (const projectile of this.redProjectiles) {
            this.destroyProjectileFx(projectile.fx);
        }
        this.redProjectiles = [];

        for (const projectile of this.redBallProjectiles) {
            this.destroyProjectileFx(projectile.fx);
        }
        this.redBallProjectiles = [];

        for (const projectile of this.purpleProjectiles) {
            this.destroyProjectileFx(projectile.fx);
        }
        this.purpleProjectiles = [];
    }

    private restartParticleSystems(root: CS.UnityEngine.Transform): void {
        const systems = root.GetComponentsInChildren(ParticleSystemType, true);
        if (!systems || systems.Length <= 0) {
            return;
        }

        for (let i = 0; i < systems.Length; i++) {
            const ps = systems.get_Item(i) as CS.UnityEngine.ParticleSystem | null;
            if (!ps) {
                continue;
            }

            const particleSystemView = ps as any;
            ps.Stop(true);
            if (typeof particleSystemView.Clear === "function") {
                particleSystemView.Clear(true);
            }
            ps.Play(true);
        }
    }

    private detachRedDotFx(runtime: HandAbilityRuntime): void {
        this.showRedFxRoot(runtime);
    }

    private updateAbilityFx(runtime: HandAbilityRuntime, deltaTime: number): void {
        this.updateFxScale(
            runtime.fx.slowdownFX,
            runtime.fx.slowdownFXBaseScale,
            runtime.mode === GojoAbilityMode.Slowdown,
            deltaTime
        );
        this.updateFxScale(
            runtime.fx.singularityFX,
            runtime.fx.singularityFXBaseScale,
            runtime.mode === GojoAbilityMode.Singularity || this.shouldFadePurpleBlueIngredient(runtime),
            deltaTime
        );
    }

    private updateFxScale(
        fx: CS.UnityEngine.Transform | null,
        baseScale: CS.UnityEngine.Vector3,
        visible: boolean,
        deltaTime: number
    ): void {
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        if (visible) {
            fx.gameObject.SetActive(true);
        }

        const targetScale = visible ? baseScale : Vec3.zero;
        const nextScale = Vec3.Lerp(
            fx.localScale,
            targetScale,
            Mathf.Clamp01(this.abilityFxScaleSpeed * deltaTime)
        );
        fx.localScale = nextScale;

        if (!visible && nextScale.sqrMagnitude <= 0.000001) {
            fx.localScale = Vec3.zero;
            fx.gameObject.SetActive(false);
        }
    }

    private hideAbilityFxImmediately(runtime: HandAbilityRuntime): void {
        this.hideFxImmediately(runtime.fx.slowdownFX);
        this.hideFxImmediately(runtime.fx.singularityFX);
    }

    private hideRedDotImmediately(runtime: HandAbilityRuntime): void {
        this.hideFxImmediately(runtime.fx.redDotFX);
    }

    private hideRedBallImmediately(runtime: HandAbilityRuntime): void {
        this.hideFxImmediately(runtime.fx.redBallFX);
    }

    private hidePurpleImmediately(): void {
        this.purpleChargeIntroActive = false;
        this.purpleChargeIntroTime = this.purpleManualAppearDuration;
        this.hideFxImmediately(this.purpleFX);
    }

    private hideRedFxImmediately(runtime: HandAbilityRuntime): void {
        runtime.fx.redHitFxTimer = 0;
        runtime.fx.redBallHitFxTimer = 0;
        this.hideFxImmediately(runtime.fx.redDotFX);
        this.hideFxImmediately(runtime.fx.redDotHitFX);
        this.hideFxImmediately(runtime.fx.redBallFX);
        this.hideFxImmediately(runtime.fx.redBallHitFX);
    }

    private hidePurpleFxImmediately(): void {
        this.purpleHitFxTimer = 0;
        this.purpleChargeIntroActive = false;
        this.purpleChargeIntroTime = this.purpleManualAppearDuration;
        this.hideFxImmediately(this.purpleFX);
        this.hideFxImmediately(this.purpleHitFX);
    }

    private hideFxImmediately(fx: CS.UnityEngine.Transform | null): void {
        if (!this.isUnityObjectAlive(fx)) {
            return;
        }

        fx.localScale = Vec3.zero;
        fx.gameObject.SetActive(false);
    }

    private getConfiguredFxScale(fx: CS.UnityEngine.Transform | null): CS.UnityEngine.Vector3 {
        if (!this.isUnityObjectAlive(fx)) {
            return Vec3.one;
        }

        return fx.localScale.sqrMagnitude > 0.000001 ? fx.localScale : Vec3.one;
    }

    private hasAnimationComponent(fx: CS.UnityEngine.Transform | null): boolean {
        if (!this.isUnityObjectAlive(fx)) {
            return false;
        }

        const animation = fx.GetComponent(AnimationType) as CS.UnityEngine.Animation | null;
        return this.isUnityObjectAlive(animation);
    }

    private findChildTransform(
        root: CS.UnityEngine.Transform | null,
        name: string
    ): CS.UnityEngine.Transform | null {
        if (!this.isUnityObjectAlive(root)) {
            return null;
        }

        const child = root.Find(name) as CS.UnityEngine.Transform | null;
        return this.isUnityObjectAlive(child) ? child : null;
    }

    private findChildTransformRecursive(
        root: CS.UnityEngine.Transform | null,
        name: string
    ): CS.UnityEngine.Transform | null {
        if (!this.isUnityObjectAlive(root)) {
            return null;
        }

        if (root.name === name) {
            return root;
        }

        const direct = root.Find(name) as CS.UnityEngine.Transform | null;
        if (this.isUnityObjectAlive(direct)) {
            return direct;
        }

        for (let i = 0; i < root.childCount; i++) {
            const found = this.findChildTransformRecursive(root.GetChild(i), name);
            if (found) {
                return found;
            }
        }

        return null;
    }

    private snapOrbToCurrentTarget(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter): void {
        const orb = runtime.fx.handMagicOrb;
        const target = this.getOrbTarget(runtime, character);
        if (!this.isUnityObjectAlive(orb) || !target) {
            return;
        }

        orb.gameObject.SetActive(true);
        orb.position = target.position;
        orb.rotation = target.rotation;
    }

    private getCurrentOrbPositionOrHandTarget(runtime: HandAbilityRuntime, character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const orb = runtime.fx.handMagicOrb;
        if (this.isUnityObjectAlive(orb) && orb.gameObject.activeSelf) {
            return orb.position;
        }

        const handTarget = this.getSlowdownOrbTarget(runtime, character);
        return handTarget ? handTarget.position : this.getCharacterCenter(character);
    }

    private getHandOrbStartPosition(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): CS.UnityEngine.Vector3 {
        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return this.getCharacterCenter(character);
        }

        const forward = this.safeDirection(hand.transform.forward, this.getViewForward());
        return Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(forward, this.orbForwardOffset));
    }

    private getOrbTarget(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion } | null {
        if (runtime.mode === GojoAbilityMode.Singularity) {
            const target = runtime.singularityTargetPosition ?? this.getSingularityWorldTarget(runtime, character);
            return {
                position: target,
                rotation: Quat.LookRotation(this.getViewForward(), Vec3.up),
            };
        }

        if (runtime.mode !== GojoAbilityMode.Slowdown) {
            return null;
        }

        return this.getSlowdownOrbTarget(runtime, character);
    }

    private getSlowdownOrbTarget(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion } | null {
        const hand = ModAPI.GetCharacterBody(
            character,
            runtime.isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return null;
        }

        const forward = this.safeDirection(hand.transform.forward, this.getViewForward());
        const up = this.safeDirection(hand.transform.up, Vec3.up);
        return {
            position: Vec3.op_Addition(hand.worldCenterOfMass, Vec3.op_Multiply(forward, this.orbForwardOffset)),
            rotation: Quat.LookRotation(forward, up),
        };
    }

    private drawSingularityGizmos(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter,
        sample: { worldPosition: CS.UnityEngine.Vector3; localPosition: CS.UnityEngine.Vector3; parent: CS.UnityEngine.Transform | null } | null
    ): void {
        if (!Giz.show || !runtime.singularityTargetPosition) {
            return;
        }

        const center = runtime.singularityTargetPosition;
        Giz.DrawWireSphere(center, this.singularityDemolishRadius, Color.yellow);
        Giz.DrawWireSphere(center, this.singularityOrbitRadius, Color.green);
        Giz.DrawWireSphere(center, this.singularityAttractRadius, Color.cyan);
        Giz.DrawLine(this.getCharacterCenter(character), center, Color.cyan);
        if (sample) {
            Giz.DrawLine(sample.worldPosition, center, Color.magenta);
            Giz.DrawRayArrow(sample.worldPosition, Vec3.op_Multiply(runtime.lastSingularityHandWorldDelta, 8.0), Color.green);
        }
        const orb = runtime.fx.handMagicOrb;
        if (this.isUnityObjectAlive(orb)) {
            Giz.DrawLine(orb.position, center, Color.yellow);
        }
    }

    private hideOrbImmediately(runtime: HandAbilityRuntime): void {
        const orb = runtime.fx.handMagicOrb;
        if (!this.isUnityObjectAlive(orb)) {
            runtime.fx.handMagicOrb = null;
            return;
        }

        orb.localScale = Vec3.zero;
        orb.gameObject.SetActive(false);
    }

    private ensureOrbAttachedToHand(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter | null,
        isLeft: boolean
    ): boolean {
        const orb = runtime.fx.handMagicOrb;
        if (!character || !this.isUnityObjectAlive(orb)) {
            if (orb != null && !this.isUnityObjectAlive(orb)) {
                runtime.fx.handMagicOrb = null;
            }
            return false;
        }

        if (runtime.fx.orbAttachedHandIsLeft === isLeft) {
            return true;
        }

        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return false;
        }

        orb.SetParent(hand.transform);
        orb.localScale = Vec3.zero;
        orb.gameObject.SetActive(false);
        runtime.fx.orbAttachedHandIsLeft = isLeft;
        return true;
    }

    private ensureRedFxRootAttachedToHand(
        runtime: HandAbilityRuntime,
        character: VX.Entity.EntityCharacter | null,
        isLeft: boolean
    ): boolean {
        const root = runtime.fx.redFxRoot;
        if (!character || !this.isUnityObjectAlive(root)) {
            if (root != null && !this.isUnityObjectAlive(root)) {
                runtime.fx.redFxRoot = null;
                runtime.fx.redDotFX = null;
                runtime.fx.redDotHitFX = null;
                runtime.fx.redBallFX = null;
                runtime.fx.redBallHitFX = null;
            }
            return false;
        }

        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return false;
        }

        root.SetParent(hand.transform);
        root.localPosition = Vec3.zero;
        root.localRotation = Quat.identity;
        root.gameObject.SetActive(true);
        this.hideRedFxImmediately(runtime);
        return true;
    }

    private ensurePurpleFxRootAttachedToHand(
        character: VX.Entity.EntityCharacter | null,
        isLeft: boolean
    ): boolean {
        const root = this.purpleFxRoot;
        if (!character || !this.isUnityObjectAlive(root)) {
            if (root != null && !this.isUnityObjectAlive(root)) {
                this.purpleFxRoot = null;
                this.purpleFX = null;
                this.purpleHitFX = null;
            }
            return false;
        }

        const hand = ModAPI.GetCharacterBody(
            character,
            isLeft ? "LeftHand" : "RightHand"
        ) as CS.Px5.Unity.PxRigidBody | null;
        if (!hand) {
            return false;
        }

        root.SetParent(hand.transform);
        root.localPosition = Vec3.zero;
        root.localRotation = Quat.identity;
        root.gameObject.SetActive(true);
        this.hidePurpleFxImmediately();
        return true;
    }

    private getCharacter(): VX.Entity.EntityCharacter | null {
        if (this.character) {
            return this.character;
        }

        this.character = this.bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        if (this.character) {
            return this.character;
        }

        return ModAPI.ControlledCharacter as VX.Entity.EntityCharacter | null;
    }

    private getCharacterCenter(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector3 {
        const hip = ModAPI.GetCharacterBody(character, "Hip") as CS.Px5.Unity.PxRigidBody | null;
        if (hip) {
            return hip.worldCenterOfMass;
        }

        const torso = ModAPI.GetCharacterBody(character, "Torso") as CS.Px5.Unity.PxRigidBody | null;
        if (torso) {
            return torso.worldCenterOfMass;
        }

        return character.transform.position;
    }

    private getViewForward(): CS.UnityEngine.Vector3 {
        const cam = ModAPI.GetMainCamera();
        const forward = cam ? cam.transform.forward : this.bindTo.transform.forward;
        return this.safeDirection(forward, Vec3.forward);
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

    private getColliderRigidBody(collider: CS.Px5.Unity.PxCollider): CS.Px5.Unity.PxRigidBody | null {
        return (collider.attachedRigidbody as CS.Px5.Unity.PxRigidBody | null)
            ?? (collider.GetComponentInParent(PxRigidBodyType) as CS.Px5.Unity.PxRigidBody | null);
    }

    private isValidRigidBody(rb: CS.Px5.Unity.PxRigidBody | null): rb is CS.Px5.Unity.PxRigidBody {
        return !!rb && rb.valid;
    }

    private isUnityObjectAlive<T extends CS.UnityEngine.Object>(obj: T | null): obj is T {
        if (obj == null) {
            return false;
        }

        return !UnityObject.op_Equality(obj, null as never as CS.UnityEngine.Object);
    }

    private onDestroy(): void {
        this.deactivateAllAbilities();
        this.hideOrbImmediately(this.leftAbility);
        this.hideOrbImmediately(this.rightAbility);
        this.hideAbilityFxImmediately(this.leftAbility);
        this.hideAbilityFxImmediately(this.rightAbility);
        this.hideRedFxImmediately(this.leftAbility);
        this.hideRedFxImmediately(this.rightAbility);
        this.hidePurpleFxImmediately();
        this.destroyAllProjectileFx();
        this.input.Dispose();
    }
}
