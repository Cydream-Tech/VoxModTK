const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const Color = CS.UnityEngine.Color;
const Mathf = CS.UnityEngine.Mathf;
const ForceMode = CS.UnityEngine.ForceMode;
const QueryTriggerInteraction = CS.UnityEngine.QueryTriggerInteraction;
const ConfigurableJointMotion = CS.UnityEngine.ConfigurableJointMotion;
const LayerMasksHelper = VX.Engine.LayerMasksHelper;
const PxPhysics = CS.Px5.Unity.PxPhysics;
const Giz = VX.Utility.Giz;
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const ModAPI = VX.Mod.ModAPI;

const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const LineRendererType = puerts.$typeof(CS.UnityEngine.LineRenderer);

type HandKey = "left" | "right";

interface HandState {
    key: HandKey;
    isLeft: boolean;
    firePressedLastFrame: boolean;
    isGrappling: boolean;
    grappleHitPoint: CS.UnityEngine.Vector3;
    rayHitInfo: CS.Px5.UnityExtensions.RaycastHit | null;
    prevControllerLocalPos: CS.UnityEngine.Vector3 | null;
    ropeLength: number;
    joint: CS.Px5.Unity.PxD6Joint | null;
    jointBody: CS.Px5.Unity.PxRigidBody | null;
    lineRenderer: CS.UnityEngine.LineRenderer;
    savedDrags: number[] | null;
    pendingReelInertiaClear: boolean;
    hadStrongReelPullLastFrame: boolean;
    wasAbilityBoostActive: boolean;
    reelSoundActive: boolean;
    // The rope-shooting animation status (< 0 indicates it is not playing).
    fireAnimElapsed: number;
    fireAnimStartPos: CS.UnityEngine.Vector3;
    fireAnimEndPos: CS.UnityEngine.Vector3;
    fireAnimPerp: CS.UnityEngine.Vector3;
}

export class OdmAvatar {
    private readonly odmSwordItemKey = "Items/MeleeWeapons/ODM";  // js:com.cydream.attackontitan/ODM
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null;
    private input: VX.Mod.ModAPI.Input;

    private readonly shotDistance = 200.0;
    private readonly shotRadius = 0.5;
    private stopPullDistance = 0.8;
    private readonly reelSpeedMultiplier = 8.0;
    private readonly abilityPullSpeed = 18.0;
    private readonly reelPullInertiaClearThreshold = 0.04;
    private readonly allowClearInertia = true;
    private readonly dashAntiGravity = true;
    private readonly swingForceMultiplier = 80.0;
    private readonly ropeWidth = 0.022;

    private readonly hands: HandState[];

    private moveJetSound: CS.Sonity.SoundEvent | null = null;
    private reelRopeSound: CS.Sonity.SoundEvent | null = null;
    private hookShotSound: CS.Sonity.SoundEvent | null = null;
    private smokeParticles: CS.UnityEngine.ParticleSystem | null = null;
    private moveJetSoundActive = false;
    private reelRopeSoundActive = false;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        this.input = new VX.Mod.ModAPI.Input();
        this.readProperties();
        this.hands = [
            this.createHandState("left", true),
            this.createHandState("right", false),
        ];

        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
        CS.UnityEngine.Debug.LogError("ODM ctor " + this.bindTo.transform.name);
    }

    private createHandState(key: HandKey, isLeft: boolean): HandState {
        return {
            key,
            isLeft,
            firePressedLastFrame: false,
            isGrappling: false,
            grappleHitPoint: Vec3.zero,
            rayHitInfo: null,
            prevControllerLocalPos: null,
            ropeLength: 0,
            joint: null,
            jointBody: null,
            lineRenderer: this.createLineRenderer(`odm-rope-${key}`, isLeft),
            savedDrags: null,
            pendingReelInertiaClear: false,
            hadStrongReelPullLastFrame: false,
            wasAbilityBoostActive: false,
            reelSoundActive: false,
            fireAnimElapsed: -1,
            fireAnimStartPos: Vec3.zero,
            fireAnimEndPos: Vec3.zero,
            fireAnimPerp: Vec3.up,
        };
    }

    private onStart(): void {
        CS.UnityEngine.Debug.LogError("ODM onStart " + this.bindTo.transform.name);

        if (this.smokeParticles) {
            const hip = ModAPI.GetCharacterBody(ModAPI.ControlledCharacter, "Hip");
            if (this.isValidRigidBody(hip)) {
                this.smokeParticles.transform.SetParent(hip.transform);
                this.smokeParticles.transform.localPosition = Vec3.zero;
                this.smokeParticles.transform.localRotation = Quat.identity;
                this.smokeParticles.transform.localScale = Vec3.one;
                CS.UnityEngine.Debug.LogError("hip is valid " + hip.name + ", and smokeParticles is valid " + this.smokeParticles.name);
            } else {
                CS.UnityEngine.Debug.LogError("hip is not valid");
            }
        } else {
            CS.UnityEngine.Debug.LogError("smokeParticles is not valid");
        }

    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        this.moveJetSound = props.Get("moveJetSound") as CS.Sonity.SoundEvent;
        this.reelRopeSound = props.Get("reelRopeSound") as CS.Sonity.SoundEvent;
        this.hookShotSound = props.Get("hookShotSound") as CS.Sonity.SoundEvent;
        this.smokeParticles = props.Get("smokeParticles") as CS.UnityEngine.ParticleSystem;
    }

    private createLineRenderer(name: string, isLeft: boolean): CS.UnityEngine.LineRenderer {
        const go = new CS.UnityEngine.GameObject(name);
        go.transform.SetParent(this.bindTo.transform);
        go.transform.localPosition = Vec3.zero;
        go.transform.localRotation = Quat.identity;
        go.transform.localScale = Vec3.one;

        const renderer = go.AddComponent(LineRendererType) as CS.UnityEngine.LineRenderer;
        renderer.useWorldSpace = true;
        renderer.positionCount = 2;
        renderer.enabled = false;
        renderer.startWidth = this.ropeWidth;
        renderer.endWidth = this.ropeWidth * 0.8;
        renderer.shadowCastingMode = CS.UnityEngine.Rendering.ShadowCastingMode.Off;
        renderer.receiveShadows = false;

        const shader = CS.UnityEngine.Shader.Find("Sprites/Default");
        if (shader) {
            renderer.material = new CS.UnityEngine.Material(shader);
        }

        const color = new Color(0.1, 0.1, 0.1, 0.95);
        renderer.startColor = color;
        renderer.endColor = color;
        return renderer;
    }

    private onDestroy(): void {
        CS.UnityEngine.Debug.LogError("ODM onDestroy " + this.bindTo.transform.name);
        for (const hand of this.hands) {
            this.releaseHand(hand);
            if (hand.lineRenderer) {
                CS.UnityEngine.Object.Destroy(hand.lineRenderer.gameObject);
            }
        }

        this.stopContinuousSound(this.moveJetSound);
        this.stopContinuousSound(this.reelRopeSound);
        this.moveJetSoundActive = false;
        this.reelRopeSoundActive = false;
        this.input.Dispose();

        if (this.smokeParticles != null && this.smokeParticles.gameObject != null) {
            CS.UnityEngine.Object.Destroy(this.smokeParticles.gameObject);
        }
    }

    private onUpdate(_deltaTime: number): void {
        const character = this.getCharacter();
        if (!character) {
            this.onCharacterLost();
            return;
        }

        for (const hand of this.hands) {
            const shotPose = this.getShotPose(hand.isLeft);

            if (hand.isGrappling) {
                this.updateActiveGrapple(character, hand, shotPose.position);
                if (!this.tickFireAnimation(hand, _deltaTime, shotPose.position)) {
                    this.updateRopeRenderer(hand, shotPose.position);
                }
            } else {
                hand.hadStrongReelPullLastFrame = false;
                hand.pendingReelInertiaClear = false;
                hand.wasAbilityBoostActive = false;
                hand.prevControllerLocalPos = null;
                hand.reelSoundActive = false;
                hand.rayHitInfo = this.findGrappleTarget(character, shotPose.position, shotPose.forward, hand);
                this.hideRopeRenderer(hand);
                if (ModAPI.ShowHUD)
                    this.drawAimPreview(shotPose.position, shotPose.forward, hand);
            }

            const firePressed = this.getFireInput(hand.isLeft);
            if (firePressed > 0.5 && !hand.firePressedLastFrame) {
                this.tryStartGrapple(character, hand);
            } else if (firePressed <= 0.5 && hand.firePressedLastFrame) {
                this.releaseHand(hand);
            }
            hand.firePressedLastFrame = firePressed > 0.5;
        }

        this.updateContinuousSounds(character);
    }

    private onFixedUpdate(_deltaTime: number): void {
        const character = this.getCharacter();
        if (!character) {
            this.onCharacterLost();
            return;
        }

        let anyAbilityActive = false;
        for (const hand of this.hands) {
            if (!hand.isGrappling) {
                hand.wasAbilityBoostActive = false;
                continue;
            }

            let clearInertia = false;
            if (hand.pendingReelInertiaClear) {
                clearInertia = true;
                hand.pendingReelInertiaClear = false;
            }

            const abilityPressed = this.getAbilityInput(hand.isLeft);
            if (abilityPressed && !hand.wasAbilityBoostActive) {
                clearInertia = true;
            }
            hand.wasAbilityBoostActive = abilityPressed > 0.5;

            if (clearInertia && this.allowClearInertia) {
                this.clearCharacterInertia(character);
            }

            if (abilityPressed > 0.5) {
                anyAbilityActive = true;
                this.applyAbilityPull(character, hand);
            }

            // [Experimental] Dampen high-speed contact: only clear velocity when very
            // close to the anchor AND moving fast, to avoid floating in mid-air.
            if (hand.ropeLength <= 1.6 && this.isValidRigidBody(hand.jointBody) && hand.jointBody.velocity.magnitude > 6) {
                this.clearCharacterInertia(character);
            }
        }

        // Apply anti-gravity once per tick regardless of how many hands have ability active.
        if (anyAbilityActive && this.dashAntiGravity) {
            const rigidbodies = ModAPI.GetEntityRigidbodies(character);
            for (let i = 0; i < rigidbodies.Length; i++) {
                const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
                if (this.isValidRigidBody(rb)) {
                    rb.AddForce(Vec3.op_UnaryNegation(PxPhysics.gravity), ForceMode.Acceleration);
                }
            }
        }

        this.applySwingAssist(character);
    }

    private onCharacterLost(): void {
        // If we lose control (character becomes null / not ControlledCharacter), we still need to
        // explicitly stop any continuous sounds that were started on this transform.
        if (this.moveJetSoundActive) {
            this.stopContinuousSound(this.moveJetSound);
            this.moveJetSoundActive = false;
        }
        if (this.reelRopeSoundActive) {
            this.stopContinuousSound(this.reelRopeSound);
            this.reelRopeSoundActive = false;
        }

        // Also reset/cleanup any active grapple visuals/physics so they don't linger.
        for (const hand of this.hands) {
            if (hand.isGrappling || hand.fireAnimElapsed >= 0 || hand.lineRenderer.enabled) {
                this.releaseHand(hand);
            } else {
                hand.reelSoundActive = false;
                this.hideRopeRenderer(hand);
            }
        }
    }

    private getCharacter(): VX.Entity.EntityCharacter | null {
        if (!this.character) {
            this.character = this.bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;;
        }
        if (this.character != ModAPI.ControlledCharacter) {
            return null;
        }
        return this.character;
    }

    private getFireInput(isLeft: boolean): number {
        return isLeft ? this.input.GetFireLInput() : this.input.GetFireRInput();
    }

    private getAbilityInput(isLeft: boolean): number {
        return isLeft ? this.input.GetAbilityLInput() : this.input.GetAbilityRInput();
    }

    private getShotPose(isLeft: boolean): { position: CS.UnityEngine.Vector3; forward: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion } {
        const controller = this.getControllerTransform(isLeft);
        const cam = ModAPI.GetMainCamera();
        if (controller) {
            const controllerForward = controller.gameObject.activeInHierarchy ? controller.forward : (cam ? cam.transform.forward : this.bindTo.transform.forward);
            const safeForward = this.safeDirection(controllerForward, this.bindTo.transform.forward);
            return {
                position: this.getHandRbPosition(isLeft) ?? controller.position,
                forward: safeForward,
                rotation: controller.rotation,
            };
        }

        const fallbackForward = this.safeDirection(cam ? cam.transform.forward : this.bindTo.transform.forward, Vec3.forward);
        return {
            position: this.bindTo.transform.position,
            forward: fallbackForward,
            rotation: Quat.LookRotation(fallbackForward, Vec3.up),
        };
    }

    private getHandRbPosition(isLeft: boolean): CS.UnityEngine.Vector3 | null {
        const character = this.getCharacter();
        if (!character) {
            return null;
        }
        const bodyName = isLeft ? "LeftHand" : "RightHand";
        const rb = ModAPI.GetCharacterBody(character, bodyName);
        if (!this.isValidRigidBody(rb)) {
            return null;
        }

        return rb.worldCenterOfMass;
    }

    private getControllerTransform(isLeft: boolean): CS.UnityEngine.Transform | null {
        return ModAPI.GetXRControllerTransform(isLeft);
    }

    private findGrappleTarget(
        character: VX.Entity.EntityCharacter,
        origin: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        hand: HandState
    ): CS.Px5.UnityExtensions.RaycastHit | null {
        const layerMask = LayerMasksHelper.grabMask.value | 1 | (1 << LayerMasksHelper.layerMask_Building.value);
        const hits = PxPhysics.SphereCastAll(origin, this.shotRadius, direction, this.shotDistance, layerMask, QueryTriggerInteraction.Ignore);

        if (!hits || hits.Length <= 0) {
            hand.rayHitInfo = null;
            return null;
        }

        let chosen: CS.Px5.UnityExtensions.RaycastHit | null = null;
        let chosenPoint: CS.UnityEngine.Vector3 | null = null;
        let bestDist = Number.POSITIVE_INFINITY;
        const ownRigidbodies = ModAPI.GetEntityRigidbodies(character);

        for (let i = 0; i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
            if (!hit || !hit.collider) {
                continue;
            }

            if (!this.isFiniteVector(hit.point)) {
                continue;
            }

            if (!this.isFiniteScalar(hit.distance)) {
                continue;
            }

            if (hit.point.x === 0 && hit.point.y === 0 && hit.point.z === 0) {
                continue;
            }

            if (this.containsRigidbody(ownRigidbodies, hit.rigidbody)) {
                continue;
            }

            if (this.isValidRigidBody(hit.rigidbody) && ModAPI.IsCharacterCarryingRigidbody(character, hit.rigidbody)) {
                continue;
            }

            const closestPoint = hit.collider.ClosestPoint(hit.point);
            if (!this.isFiniteVector(closestPoint)) {
                continue;
            }

            if (hit.distance < bestDist) {
                bestDist = hit.distance;
                chosen = hit;
                chosenPoint = closestPoint;
            }
        }

        if (!chosen || !chosenPoint) {
            hand.rayHitInfo = null;
            return null;
        }

        const preciseHit = this.findPreciseRaycastTarget(character, origin, direction, layerMask, ownRigidbodies);
        if (preciseHit && this.shouldPreferPreciseRaycast(preciseHit.hit.distance, chosen.distance)) {
            hand.grappleHitPoint = preciseHit.point;
            return preciseHit.hit;
        }

        hand.grappleHitPoint = chosenPoint;
        return chosen;
    }

    private findPreciseRaycastTarget(
        character: VX.Entity.EntityCharacter,
        origin: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        layerMask: number,
        ownRigidbodies: CS.System.Array$1<CS.Px5.Unity.PxRigidBody>
    ): { hit: CS.Px5.UnityExtensions.RaycastHit; point: CS.UnityEngine.Vector3 } | null {
        const hits = PxPhysics.RaycastAll(origin, direction, this.shotDistance, layerMask, QueryTriggerInteraction.Ignore);
        if (!hits || hits.Length <= 0) {
            return null;
        }

        let chosen: CS.Px5.UnityExtensions.RaycastHit | null = null;
        let chosenPoint: CS.UnityEngine.Vector3 | null = null;
        let bestDist = Number.POSITIVE_INFINITY;

        for (let i = 0; i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
            if (!hit || !hit.collider) {
                continue;
            }

            if (!this.isFiniteVector(hit.point) || !this.isFiniteScalar(hit.distance)) {
                continue;
            }

            if (hit.point.x === 0 && hit.point.y === 0 && hit.point.z === 0) {
                continue;
            }

            if (this.containsRigidbody(ownRigidbodies, hit.rigidbody)) {
                continue;
            }

            if (this.isValidRigidBody(hit.rigidbody) && ModAPI.IsCharacterCarryingRigidbody(character, hit.rigidbody)) {
                continue;
            }

            if (hit.distance < bestDist) {
                bestDist = hit.distance;
                chosen = hit;
                chosenPoint = hit.point;
            }
        }

        return chosen && chosenPoint ? { hit: chosen, point: chosenPoint } : null;
    }

    private shouldPreferPreciseRaycast(rayDistance: number, sphereDistance: number): boolean {
        const maxDistanceDelta = Math.max(this.shotRadius * 1.5, 0.25);
        return Math.abs(rayDistance - sphereDistance) <= maxDistanceDelta;
    }

    private containsRigidbody(rigidbodies: CS.System.Array$1<CS.Px5.Unity.PxRigidBody>, target: CS.Px5.Unity.PxRigidBody | null): boolean {
        if (!this.isValidRigidBody(target) || !rigidbodies) {
            return false;
        }

        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (this.isValidRigidBody(rb) && rb === target) {
                return true;
            }
        }

        return false;
    }

    private drawAimPreview(origin: CS.UnityEngine.Vector3, direction: CS.UnityEngine.Vector3, hand: HandState): void {
        const safeDirection = this.safeDirection(direction, this.bindTo.transform.forward);
        const rotation = Quat.LookRotation(safeDirection, Vec3.up);
        const hit = hand.rayHitInfo;
        const color = hit ? Color.white : new Color(0.7, 0.7, 0.7, 1.0);
        const targetPos = hit ? hand.grappleHitPoint : Vec3.op_Addition(origin, Vec3.op_Multiply(safeDirection, this.shotDistance));
        Giz.DrawCrosshair(targetPos, rotation, 1.0, color);
        Giz.DrawDashedLine(origin, targetPos, 0.3, 0.3, color);
        if (hit && Giz.show) {
            Giz.DrawLine(hit.point, hand.grappleHitPoint, Color.yellow);
        }
    }

    private tryStartGrapple(character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.rayHitInfo) {
            return;
        }

        const shotPose = this.getShotPose(hand.isLeft);
        hand.isGrappling = true;
        ModAPI.SetCharacterHanging(character, hand.isGrappling);
        hand.pendingReelInertiaClear = false;
        hand.hadStrongReelPullLastFrame = false;
        hand.wasAbilityBoostActive = false;
        hand.prevControllerLocalPos = null;
        this.setGrappleDrags(character, hand);
        this.attachJoint(character, hand, hand.rayHitInfo);
        this.startFireAnimation(hand, shotPose.position, hand.grappleHitPoint);
        this.playHookShot(hand.rayHitInfo, hand.grappleHitPoint);
    }

    private updateActiveGrapple(
        character: VX.Entity.EntityCharacter,
        hand: HandState,
        shotPosition: CS.UnityEngine.Vector3
    ): void {
        const torsoPos = this.getBodyJointPos(character, hand);
        const anchorPos = this.getAnchorWorldPos(hand);
        const toAnchor = Vec3.op_Subtraction(anchorPos, torsoPos);
        const dist = toAnchor.magnitude;

        hand.ropeLength = Mathf.Min(hand.ropeLength, dist);

        const handDelta = this.getControllerPullDelta(hand);
        // Take the larger of two pull signals:
        //   - movement along character-backward (-Hip.forward): reliable when swinging around a pole
        //   - movement away from anchor (rope direction): reliable when anchor is not directly forward (e.g. above)
        const hipBody = ModAPI.GetCharacterBody(character, "Hip");
        const ropeDir = dist > 0.0001 ? toAnchor.normalized : Vec3.zero;
        const pullFromBack = this.isValidRigidBody(hipBody) ? -Vec3.Dot(handDelta, hipBody.transform.forward) : 0;
        const pullFromRope = -Vec3.Dot(handDelta, ropeDir);
        const pullInput = Math.max(pullFromBack, pullFromRope);

        const strongReelPull = pullInput > this.reelPullInertiaClearThreshold;
        if (strongReelPull && !hand.hadStrongReelPullLastFrame) {
            hand.pendingReelInertiaClear = true;
        }
        hand.hadStrongReelPullLastFrame = strongReelPull;
        hand.reelSoundActive = pullInput * this.reelSpeedMultiplier > 0.05;

        this.updateJointMode(hand, anchorPos, dist, pullInput, shotPosition);
    }

    private getControllerPullDelta(hand: HandState): CS.UnityEngine.Vector3 {
        const controller = this.getControllerTransform(hand.isLeft);
        if (!controller) {
            hand.prevControllerLocalPos = null;
            return Vec3.zero;
        }

        const currentLocalPos = controller.localPosition;
        if (!hand.prevControllerLocalPos) {
            hand.prevControllerLocalPos = currentLocalPos;
            return Vec3.zero;
        }

        const localDelta = Vec3.op_Subtraction(currentLocalPos, hand.prevControllerLocalPos);
        hand.prevControllerLocalPos = currentLocalPos;
        return controller.parent ? controller.parent.TransformDirection(localDelta) : localDelta;
    }

    private updateJointMode(
        hand: HandState,
        anchorPos: CS.UnityEngine.Vector3,
        dist: number,
        pullInput: number,
        shotPos: CS.UnityEngine.Vector3
    ): void {
        if (!hand.joint) {
            return;
        }

        hand.ropeLength = Mathf.Min(hand.ropeLength, dist);
        hand.ropeLength -= pullInput * this.reelSpeedMultiplier;
        hand.ropeLength = Mathf.Max(hand.ropeLength, this.stopPullDistance);

        const lim = hand.joint.linearLimit;
        lim.limit = Mathf.Max(hand.ropeLength, 0.01);
        hand.joint.linearLimit = lim;

        Giz.DrawRay(shotPos, Vec3.op_Multiply(Vec3.op_Subtraction(anchorPos, shotPos).normalized, pullInput * this.reelSpeedMultiplier), Color.yellow);
        if (Giz.show) {
            var pA = hand.joint.transform.TransformPoint(hand.joint.anchor);
            const connectedBody = hand.joint.connectedBody;
            var pB = this.isValidRigidBody(connectedBody) ? connectedBody.transform.TransformPoint(hand.joint.connectedAnchor) : Vec3.zero;
            Giz.DrawLine(pA, pB, Color.red);
            Giz.DrawLabel(Vec3.Lerp(pA, pB, 0.5), "RopeLen: " + hand.ropeLength.toFixed(2), Color.red);
        }
    }

    private applyAbilityPull(character: VX.Entity.EntityCharacter, hand: HandState): void {
        const anchorPos = this.getAnchorWorldPos(hand);
        const torsoPos = this.getBodyJointPos(character, hand);
        const toAnchor = Vec3.op_Subtraction(anchorPos, torsoPos);
        const dist = toAnchor.magnitude;
        if (dist <= this.stopPullDistance) {
            return;
        }

        const pullDir = toAnchor.normalized;
        const rigidbodies = ModAPI.GetEntityRigidbodies(character);
        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!this.isValidRigidBody(rb)) {
                continue;
            }

            rb.AddForce(Vec3.op_Multiply(pullDir, this.abilityPullSpeed), ForceMode.Acceleration);
        }

        hand.ropeLength = Mathf.Max(hand.ropeLength - this.abilityPullSpeed * CS.UnityEngine.Time.fixedDeltaTime, this.stopPullDistance);
        if (hand.joint) {
            const lim = hand.joint.linearLimit;
            lim.limit = Mathf.Max(hand.ropeLength, 0.01);
            hand.joint.linearLimit = lim;
        }
    }

    private applySwingAssist(character: VX.Entity.EntityCharacter): void {
        const cam = CS.UnityEngine.Camera.main;
        const moveInput = this.input.GetMoveInput();
        const rawMove = new Vec3(moveInput.x, 0, moveInput.y);
        let move = rawMove;
        if (cam) {
            move = Quat.op_Multiply(cam.transform.rotation, move);
        }
        if (move.y < 0) {
            move.y = 0;
        }
        if (Giz.show) {
            const debugHip = ModAPI.GetCharacterBody(character, "Hip");
            var pos = this.isValidRigidBody(debugHip) ? debugHip.transform.position : Vec3.zero;
            Giz.DrawRayArrow(pos, move, Color.red);
            Giz.DrawLabel(pos, "move: " + move.magnitude.toFixed(2) + "\nIsGrounded: " + ModAPI.IsCharacterGrounded(character), Color.red);
        }

        const grounded = ModAPI.IsCharacterGrounded(character);
        if (grounded) {
            move = Vec3.zero;
        }

        if (this.smokeParticles) {
            const ps = this.smokeParticles; // UnityEngine.ParticleSystem
            const em = ps.emission;
            if (em)
                em.rateOverTimeMultiplier = move.magnitude * 25;
        }

        if (move.sqrMagnitude <= 0.0001) {
            return;
        }

        const vel = Vec3.op_Multiply(move, CS.UnityEngine.Time.fixedDeltaTime * this.swingForceMultiplier);
        const hipRb = ModAPI.GetCharacterBody(character, "Hip");

        if (this.isValidRigidBody(hipRb)) {
            hipRb.AddForce(vel, ForceMode.VelocityChange);
        }
        ModAPI.AddCharacterMotion(character, vel, ForceMode.VelocityChange);
    }

    // Returns the world-space position of the joint's anchor on the character body.
    // When the joint exists, use its actual transform point so that rope-length
    // comparisons are consistent with the physics constraint; fall back to the
    // Torso bone or main rigidbody when the joint is not yet created.
    private getBodyJointPos(character: VX.Entity.EntityCharacter, hand: HandState): CS.UnityEngine.Vector3 {
        if (hand.joint) {
            return hand.joint.transform.TransformPoint(hand.joint.anchor);
        }
        const torso = ModAPI.GetCharacterBody(character, "Torso");
        if (this.isValidRigidBody(torso)) {
            return torso.transform.position;
        }
        const mainRb = ModAPI.GetEntityMainRigidbody(character);
        return this.isValidRigidBody(mainRb) ? mainRb.transform.position : this.bindTo.transform.position;
    }

    private attachJoint(
        character: VX.Entity.EntityCharacter,
        hand: HandState,
        hit: CS.Px5.UnityExtensions.RaycastHit
    ): void {
        const hitRb = this.isValidRigidBody(hit.rigidbody) ? hit.rigidbody : null;
        this.stopPullDistance = hitRb && !hitRb.isKinematic ? 0.3 : 0.8;
        const joint = ModAPI.AttachJointToCharacter(character, hitRb as CS.Px5.Unity.PxRigidBody);
        if (!joint) {
            return;
        }

        // Use the joint's own transform position (anchor = zero) so that the initial
        // ropeLength is consistent with what getBodyJointPos will measure every frame,
        // preventing an immediate Mathf.Min shrink on the first update tick.
        hand.ropeLength = Vec3.Distance(joint.transform.position, hand.grappleHitPoint);

        joint.autoConfigureConnectedAnchor = false;
        joint.enableCollision = true;
        joint.connectedBody = hitRb as CS.Px5.Unity.PxRigidBody;
        joint.connectedAnchor = hitRb
            ? hitRb.transform.InverseTransformPoint(hand.grappleHitPoint)
            : hand.grappleHitPoint;
        joint.anchor = Vec3.zero;

        joint.xMotion = ConfigurableJointMotion.Limited;
        joint.yMotion = ConfigurableJointMotion.Limited;
        joint.zMotion = ConfigurableJointMotion.Limited;
        joint.angularXMotion = ConfigurableJointMotion.Free;
        joint.angularYMotion = ConfigurableJointMotion.Free;
        joint.angularZMotion = ConfigurableJointMotion.Free;

        const linearLimit = joint.linearLimit;
        linearLimit.limit = hand.ropeLength;
        linearLimit.bounciness = 0;
        linearLimit.contactDistance = 0;
        joint.linearLimit = linearLimit;

        const spring = joint.linearLimitSpring;
        spring.spring = 50000;
        spring.damper = 500;
        joint.linearLimitSpring = spring;

        hand.joint = joint;
        hand.jointBody = ModAPI.GetEntityMainRigidbody(character);
    }
    private getAnchorWorldPos(hand: HandState): CS.UnityEngine.Vector3 {
        if (hand.joint) {
            const connectedBody = hand.joint.connectedBody;
            const connectedAnchor = hand.joint.connectedAnchor; 
            if (this.isValidRigidBody(connectedBody)) {
                return connectedBody.transform.TransformPoint(connectedAnchor);
            }
            return connectedAnchor;
        }
        return hand.grappleHitPoint;
    }

    private updateRopeRenderer(hand: HandState, shotPosition: CS.UnityEngine.Vector3): void {
        const renderer = hand.lineRenderer;
        renderer.enabled = true;
        renderer.positionCount = 2;
        renderer.SetPosition(0, shotPosition);
        renderer.SetPosition(1, this.getAnchorWorldPos(hand));
    }

    private hideRopeRenderer(hand: HandState): void {
        if (hand.lineRenderer.enabled) {
            hand.lineRenderer.enabled = false;
        }
    }

    private setGrappleDrags(character: VX.Entity.EntityCharacter, hand: HandState): void {
        const rigidbodies = ModAPI.GetEntityRigidbodies(character);
        hand.savedDrags = new Array<number>(rigidbodies.Length);

        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!this.isValidRigidBody(rb)) {
                hand.savedDrags[i] = 0;
                continue;
            }

            hand.savedDrags[i] = rb.drag;
            rb.drag = 0.2;
        }
    }

    private restoreGrappleDrags(character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.savedDrags) {
            return;
        }

        const rigidbodies = ModAPI.GetEntityRigidbodies(character);
        for (let i = 0; i < rigidbodies.Length && i < hand.savedDrags.length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!this.isValidRigidBody(rb)) {
                continue;
            }

            rb.drag = hand.savedDrags[i];
        }

        hand.savedDrags = null;
    }

    private clearCharacterInertia(character: VX.Entity.EntityCharacter): void {
        const rigidbodies = ModAPI.GetEntityRigidbodies(character);
        for (let i = 0; i < rigidbodies.Length; i++) {
            const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
            if (!this.isValidRigidBody(rb)) {
                continue;
            }

            rb.velocity = Vec3.zero;
            rb.angularVelocity = Vec3.zero;
        }

        ModAPI.SetCharacterVelocity(character, Vec3.zero);
    }

    private updateContinuousSounds(character: VX.Entity.EntityCharacter): void {
        let reelActive = false;
        let abilityActive = false;

        for (const hand of this.hands) {
            reelActive = reelActive || hand.reelSoundActive;
            abilityActive = abilityActive || (hand.isGrappling && this.getAbilityInput(hand.isLeft) > 0.5);
        }

        const moveInput = this.input.GetMoveInput();
        const swingActive = !ModAPI.IsCharacterGrounded(character) && (moveInput.x * moveInput.x + moveInput.y * moveInput.y) > 0;

        this.moveJetSoundActive = this.setContinuousSoundState(this.moveJetSound, abilityActive || swingActive, this.moveJetSoundActive);
        this.reelRopeSoundActive = this.setContinuousSoundState(this.reelRopeSound, reelActive, this.reelRopeSoundActive);
    }

    private setContinuousSoundState(soundEvent: CS.Sonity.SoundEvent | null, active: boolean, wasActive: boolean): boolean {
        if (soundEvent == null) {
            return false;
        }

        if (active && !wasActive) {
            ModAPI.PlaySoundOnTransform(soundEvent, this.bindTo.transform);
            return true;
        }

        if (!active && wasActive) {
            ModAPI.StopSoundOnTransform(soundEvent, this.bindTo.transform);
            return false;
        }

        return wasActive;
    }

    private stopContinuousSound(soundEvent: CS.Sonity.SoundEvent | null): void {
        if (soundEvent == null) {
            return;
        }

        ModAPI.StopSoundOnTransform(soundEvent, this.bindTo.transform);
    }

    private playHookShot(hit: CS.Px5.UnityExtensions.RaycastHit, position: CS.UnityEngine.Vector3): void {
        if (this.hookShotSound) {
            ModAPI.PlaySoundAtPosition(this.hookShotSound, this.bindTo.transform, position);
        }
        ModAPI.PlayBulletHitSound(this.getBulletHitMaterialId(hit, position), position);
    }

    private getBulletHitMaterialId(hit: CS.Px5.UnityExtensions.RaycastHit | null, _position: CS.UnityEngine.Vector3): number {
        if (!hit) {
            return 0;
        }

        const voxel = ModAPI.GetVoxelAtHit(hit);
        return voxel && voxel.IsSolid() ? voxel.ID : 0;
    }

    private startFireAnimation(hand: HandState, startPos: CS.UnityEngine.Vector3, endPos: CS.UnityEngine.Vector3): void {
        const dir = Vec3.op_Subtraction(endPos, startPos).normalized;

        // Vertical offset axis: Take the component of up perpendicular to the rope direction.
        const upDot = Vec3.Dot(Vec3.up, dir);
        let perp = Vec3.op_Subtraction(Vec3.up, Vec3.op_Multiply(dir, upDot));
        if (perp.sqrMagnitude < 0.001) {
            const fwdDot = Vec3.Dot(Vec3.forward, dir);
            perp = Vec3.op_Subtraction(Vec3.forward, Vec3.op_Multiply(dir, fwdDot));
        }

        hand.fireAnimElapsed  = 0;
        hand.fireAnimStartPos = startPos;
        hand.fireAnimEndPos   = endPos;
        hand.fireAnimPerp     = perp.normalized;

        hand.lineRenderer.enabled       = true;
        hand.lineRenderer.positionCount = 14;
    }

    // The animation is driven every frame and returns true if the animation is still playing (the caller skips regular rope rendering).
    private tickFireAnimation(hand: HandState, dt: number, shotPosition: CS.UnityEngine.Vector3): boolean {
        const FIRE_SEGMENTS   = 24;
        const FIRE_DURATION   = 0.13;
        const FIRE_CURVATURE  = 0.01;
        const FIRE_CYCLES     = 1.5;
        const SETTLE_DURATION = 0.30;
        const SETTLE_AMP      = 0.025;
        const SETTLE_FREQ     = 24.0;

        if (hand.fireAnimElapsed < 0) {
            return false;
        }

        hand.fireAnimElapsed += dt;

        const startPos = shotPosition;
        // Read the anchor point world coordinates dynamically every frame, following the target object.
        const liveEnd  = this.getAnchorWorldPos(hand);
        const perp     = hand.fireAnimPerp;
        const totalLen = Vec3.Distance(hand.fireAnimStartPos, hand.fireAnimEndPos);
        const lr       = hand.lineRenderer;

        lr.enabled       = true;
        lr.positionCount = FIRE_SEGMENTS;

        if (hand.fireAnimElapsed <= FIRE_DURATION) {
            // ── Phase 1：The rope shoots forward in waves. ──────────────────────────
            const t         = Mathf.Clamp01(hand.fireAnimElapsed / FIRE_DURATION);
            const tipPos    = Vec3.Lerp(startPos, liveEnd, t);
            const amplitude = t * (1 - t) * 4.0 * totalLen * FIRE_CURVATURE;

            for (let i = 0; i < FIRE_SEGMENTS; i++) {
                const frac     = i / (FIRE_SEGMENTS - 1);
                const straight = Vec3.Lerp(startPos, tipPos, frac);
                const wave     = Mathf.Sin(frac * Mathf.PI * FIRE_CYCLES * 2.0) * amplitude * (1.0 - frac);
                lr.SetPosition(i, Vec3.op_Addition(straight, Vec3.op_Multiply(perp, wave)));
            }
        } else if (hand.fireAnimElapsed <= FIRE_DURATION + SETTLE_DURATION) {
            // ── Phase 2：Slight elastic oscillation decay after impact ──────────────────────
            const settleT   = hand.fireAnimElapsed - FIRE_DURATION;
            const t         = Mathf.Clamp01(settleT / SETTLE_DURATION);
            const amplitude = (1 - t) * (1 - t) * totalLen * SETTLE_AMP;

            for (let i = 0; i < FIRE_SEGMENTS; i++) {
                const frac     = i / (FIRE_SEGMENTS - 1);
                // Standing waves: spatially largest in the middle, oscillating in time.
                const straight = Vec3.Lerp(startPos, liveEnd, frac);
                const wave     = Mathf.Sin(frac * Mathf.PI) * Mathf.Sin(settleT * SETTLE_FREQ) * amplitude;
                lr.SetPosition(i, Vec3.op_Addition(straight, Vec3.op_Multiply(perp, wave)));
            }
        } else {
            // The animation ends, and the rope returns to normal at 2 points.
            hand.fireAnimElapsed    = -1;
            lr.positionCount        = 2;
            return false;
        }

        return true;
    }

    private releaseHand(hand: HandState): void {
        const character = this.getCharacter();
        if (character) {
            this.restoreGrappleDrags(character, hand);
        }

        if (hand.joint) {
            CS.UnityEngine.Object.Destroy(hand.joint);
        }

        hand.fireAnimElapsed = -1;
        hand.lineRenderer.positionCount = 2;
        this.hideRopeRenderer(hand);
        hand.isGrappling = false;
        hand.joint = null;
        hand.jointBody = null;
        hand.rayHitInfo = null;
        hand.prevControllerLocalPos = null;
        hand.ropeLength = 0;
        hand.pendingReelInertiaClear = false;
        hand.hadStrongReelPullLastFrame = false;
        hand.wasAbilityBoostActive = false;
        hand.reelSoundActive = false;

        let stillGrappling = false;
        for (const other of this.hands) {
            if (other !== hand && other.isGrappling) {
                stillGrappling = true;
                break;
            }
        }
        if (!stillGrappling) {
            if (character) {
                ModAPI.SetCharacterHanging(character, false);
            }
            this.stopContinuousSound(this.moveJetSound);
            this.stopContinuousSound(this.reelRopeSound);
            this.moveJetSoundActive = false;
            this.reelRopeSoundActive = false;
        }
    }

    private isValidRigidBody(rb: CS.Px5.Unity.PxRigidBody | null): rb is CS.Px5.Unity.PxRigidBody {
        return !!rb && rb.valid;
    }

    private isFiniteScalar(value: number): boolean {
        return value === value && value !== Number.POSITIVE_INFINITY && value !== Number.NEGATIVE_INFINITY;
    }

    private isFiniteVector(value: CS.UnityEngine.Vector3 | null): value is CS.UnityEngine.Vector3 {
        return !!value && this.isFiniteScalar(value.x) && this.isFiniteScalar(value.y) && this.isFiniteScalar(value.z);
    }

    private safeDirection(direction: CS.UnityEngine.Vector3, fallback: CS.UnityEngine.Vector3): CS.UnityEngine.Vector3 {
        if (direction.sqrMagnitude > 0.0001) {
            return direction.normalized;
        }
        if (fallback.sqrMagnitude > 0.0001) {
            return fallback.normalized;
        }
        return Vec3.forward;
    }
}
