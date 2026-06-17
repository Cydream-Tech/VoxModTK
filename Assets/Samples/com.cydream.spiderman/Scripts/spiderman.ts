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
const PxD6JointType = puerts.$typeof(CS.Px5.Unity.PxD6Joint);

type HandKey = "left" | "right";

interface HandState {
    key: HandKey;
    isLeft: boolean;
    firePressedLastFrame: boolean;
    abilityPressedLastFrame: boolean;
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
    hoveredLink: ObjectLink | null;
    // The rope-shooting animation status (< 0 indicates it is not playing).
    fireAnimElapsed: number;
    fireAnimStartPos: CS.UnityEngine.Vector3;
    fireAnimEndPos: CS.UnityEngine.Vector3;
    fireAnimPerp: CS.UnityEngine.Vector3;
    fireAnimFollowAnchor: LinkAnchor | null;
    linkCompleteAnimElapsed: number;
    linkCompleteAnimStartPos: CS.UnityEngine.Vector3;
    linkCompleteAnimAnchorA: LinkAnchor | null;
    linkCompleteAnimAnchorB: LinkAnchor | null;
}

interface LinkAnchor {
    rigidbody: CS.Px5.Unity.PxRigidBody;
    localAnchor: CS.UnityEngine.Vector3;
}

interface ObjectLink {
    joint: CS.Px5.Unity.PxD6Joint;
    rigidbodyA: CS.Px5.Unity.PxRigidBody;
    localAnchorA: CS.UnityEngine.Vector3;
    rigidbodyB: CS.Px5.Unity.PxRigidBody;
    localAnchorB: CS.UnityEngine.Vector3;
    lineRenderer: CS.UnityEngine.LineRenderer;
    targetLength: number;
    visualDelay: number;
    age: number;
}

export class Spiderman {
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null;
    private input: VX.Mod.ModAPI.Input;

    private readonly shotDistance = 200.0;
    private readonly shotRadius = 0.5;
    private readonly stopPullDistance = 0.8;
    private readonly reelSpeedMultiplier = 8.0;
    private readonly abilityPullSpeed = 18.0;
    private readonly linkJointSpring = 90000;
    private readonly linkJointDamper = 0;
    private readonly linkAutoReelSpeed = 0.7;
    private readonly linkAutoReelMinLength = 0.25;
    private readonly linkAutoReelMaxOverpull = 1.5;
    private readonly linkHitRadius = 0.25;
    private readonly linkCompleteAnimDuration = 0.22;
    private readonly linkDissolveDuration = 60.0;
    private readonly linkDissolveEndAlpha = 0.5;
    private readonly reelPullInertiaClearThreshold = 0.04;
    private readonly allowClearInertia = true;
    private readonly dashAntiGravity = true;
    private readonly swingForceMultiplier = 45.0;
    private readonly ropeWidth = 0.035;

    private readonly hands: HandState[];
    private readonly objectLinks: ObjectLink[] = [];
    private pendingLinkAnchor: LinkAnchor | null = null;
    private pendingLinkHandKey: HandKey | null = null;
    private readonly linkPreviewLineRenderer: CS.UnityEngine.LineRenderer;
    private readonly objectLinkColor = new Color(1.0, 1.0, 1.0, 1.0);

    private moveJetSound: CS.Sonity.SoundEvent | null = null;
    private reelRopeSound: CS.Sonity.SoundEvent | null = null;
    private hookShotSound: CS.Sonity.SoundEvent | null = null;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        this.input = new VX.Mod.ModAPI.Input();
        this.readProperties();
        this.linkPreviewLineRenderer = this.createLineRenderer("spiderman-link-preview", false, new Color(0.85, 1.0, 0.85, 0.65));
        this.hands = [
            this.createHandState("left", true),
            this.createHandState("right", false),
        ];

        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private createHandState(key: HandKey, isLeft: boolean): HandState {
        return {
            key,
            isLeft,
            firePressedLastFrame: false,
            abilityPressedLastFrame: false,
            isGrappling: false,
            grappleHitPoint: Vec3.zero,
            rayHitInfo: null,
            prevControllerLocalPos: null,
            ropeLength: 0,
            joint: null,
            jointBody: null,
            lineRenderer: this.createLineRenderer(`spiderman-rope-${key}`, isLeft),
            savedDrags: null,
            pendingReelInertiaClear: false,
            hadStrongReelPullLastFrame: false,
            wasAbilityBoostActive: false,
            reelSoundActive: false,
            hoveredLink: null,
            fireAnimElapsed: -1,
            fireAnimStartPos: Vec3.zero,
            fireAnimEndPos: Vec3.zero,
            fireAnimPerp: Vec3.up,
            fireAnimFollowAnchor: null,
            linkCompleteAnimElapsed: -1,
            linkCompleteAnimStartPos: Vec3.zero,
            linkCompleteAnimAnchorA: null,
            linkCompleteAnimAnchorB: null,
        };
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        const pairs = props.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            if (pair.key === "moveJetSound" && pair.value != null) {
                this.moveJetSound = pair.value as CS.Sonity.SoundEvent;
                continue;
            }

            if (pair.key === "reelRopeSound" && pair.value != null) {
                this.reelRopeSound = pair.value as CS.Sonity.SoundEvent;
                continue;
            }

            if (pair.key === "hookShotSound" && pair.value != null) {
                this.hookShotSound = pair.value as CS.Sonity.SoundEvent;
            }
        }
    }

    private createLineRenderer(name: string, isLeft: boolean, colorOverride: CS.UnityEngine.Color | null = null): CS.UnityEngine.LineRenderer {
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

        const color = colorOverride ?? new Color(1.0, 0.95, 0.88, 0.95);
        renderer.startColor = color;
        renderer.endColor = color;
        return renderer;
    }

    private onDestroy(): void {
        for (const hand of this.hands) {
            this.releaseHand(hand);
            if (hand.lineRenderer) {
                CS.UnityEngine.Object.Destroy(hand.lineRenderer.gameObject);
            }
        }

        this.clearPendingLinkAnchor();
        this.destroyAllObjectLinks();
        if (this.linkPreviewLineRenderer) {
            CS.UnityEngine.Object.Destroy(this.linkPreviewLineRenderer.gameObject);
        }

        this.stopContinuousSound(this.moveJetSound);
        this.stopContinuousSound(this.reelRopeSound);
        this.input.Dispose();
    }

    private onUpdate(_deltaTime: number): void {
        const character = this.getCharacter();
        if (!character) {
            return;
        }

        let linkAbilityHandled = false;
        for (const hand of this.hands) {
            const shotPose = this.getShotPose(hand.isLeft);
            hand.hoveredLink = null;

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

                if (this.tickLinkCompleteAnimation(hand, _deltaTime)) {
                    // The link-complete animation owns this line renderer for this frame.
                } else if (!this.tickFireAnimation(hand, _deltaTime, shotPose.position)) {
                    if (this.pendingLinkHandKey === hand.key && this.pendingLinkAnchor) {
                        this.updatePendingLinkRenderer(hand, shotPose.position);
                    } else {
                        this.hideRopeRenderer(hand);
                    }
                }
                this.drawAimPreview(shotPose.position, shotPose.forward, hand);
            }

            const firePressed = this.getFireInput(hand.isLeft);
            if (firePressed > 0.5 && !hand.firePressedLastFrame) {
                this.tryStartGrapple(character, hand);
            } else if (firePressed <= 0.5 && hand.firePressedLastFrame) {
                this.releaseHand(hand);
            }
            hand.firePressedLastFrame = firePressed > 0.5;

            const abilityPressed = this.getAbilityInput(hand.isLeft);
            if (!linkAbilityHandled && !hand.isGrappling && abilityPressed > 0.5 && !hand.abilityPressedLastFrame) {
                this.tryHandleLinkAbility(character, hand);
                linkAbilityHandled = true;
            }
            hand.abilityPressedLastFrame = abilityPressed > 0.5;
        }

        this.updateObjectLinks();
        this.updateLinkPreview();
        this.updateContinuousSounds(character);
    }

    private onFixedUpdate(_deltaTime: number): void {
        const character = this.getCharacter();
        if (!character) {
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
            if (hand.ropeLength <= 1.6 && hand.jointBody && hand.jointBody.velocity.magnitude > 6) {
                this.clearCharacterInertia(character);
            }
        }

        // Apply anti-gravity once per tick regardless of how many hands have ability active.
        if (anyAbilityActive && this.dashAntiGravity) {
            const rigidbodies = ModAPI.GetEntityRigidbodies(character);
            for (let i = 0; i < rigidbodies.Length; i++) {
                const rb = rigidbodies.get_Item(i) as CS.Px5.Unity.PxRigidBody | null;
                if (rb) {
                    rb.AddForce(Vec3.op_UnaryNegation(PxPhysics.gravity), ForceMode.Acceleration);
                }
            }
        }

        // Air thrust is disabled; grapple and reel physics remain active.
        this.applySwingAssist(character);
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
            return {
                position: this.getHandRbPosition(isLeft) ?? controller.position,
                forward: controller.gameObject.activeInHierarchy ? controller.forward : cam.transform.forward, 
                rotation: controller.rotation,
            };
        }

        const fallbackForward = cam ? cam.transform.forward : this.bindTo.transform.forward;
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
        return rb ? rb.worldCenterOfMass : null;
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

            if (hit.rigidbody && ModAPI.IsCharacterCarryingRigidbody(character, hit.rigidbody)) {
                continue;
            }

            const closestPoint = hit.collider.ClosestPoint(hit.point);
            if (!this.isValidAimPoint(origin, closestPoint)) {
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

            if (hit.rigidbody && ModAPI.IsCharacterCarryingRigidbody(character, hit.rigidbody)) {
                continue;
            }

            if (!this.isValidAimPoint(origin, hit.point)) {
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
        const targetPos = hit && this.isValidAimPoint(origin, hand.grappleHitPoint)
            ? hand.grappleHitPoint
            : Vec3.op_Addition(origin, Vec3.op_Multiply(safeDirection, this.shotDistance));
        if (!this.isValidAimPoint(origin, targetPos)) {
            return;
        }

        Giz.DrawCrosshair(targetPos, rotation, 1.0, color);
        Giz.DrawDashedLine(origin, targetPos, 0.3, 0.3, color);
        if (hit && Giz.show && this.isValidAimPoint(origin, hit.point)) {
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

    private tryHandleLinkAbility(character: VX.Entity.EntityCharacter, hand: HandState): void {
        if (!hand.rayHitInfo) {
            this.clearPendingLinkAnchor();
            return;
        }

        const anchor = this.getLinkAnchorFromHit(hand.rayHitInfo, hand.grappleHitPoint);
        if (!anchor || this.containsRigidbody(ModAPI.GetEntityRigidbodies(character), anchor.rigidbody)) {
            this.clearPendingLinkAnchor();
            return;
        }

        if (!this.pendingLinkAnchor) {
            this.pendingLinkAnchor = anchor;
            this.pendingLinkHandKey = hand.key;
            const shotPose = this.getShotPose(hand.isLeft);
            this.startFireAnimation(hand, shotPose.position, this.getAnchorWorldPosition(anchor), anchor);
            this.playHookShot(hand.rayHitInfo, this.getAnchorWorldPosition(anchor));
            return;
        }

        if (this.pendingLinkAnchor.rigidbody === anchor.rigidbody) {
            this.clearPendingLinkAnchor();
            this.playHookShot(hand.rayHitInfo, this.getAnchorWorldPosition(anchor));
            return;
        }

        const shotPose = this.getShotPose(hand.isLeft);
        this.startLinkCompleteAnimation(hand, this.pendingLinkAnchor, shotPose.position, anchor);
        this.createObjectLink(this.pendingLinkAnchor, anchor, this.linkCompleteAnimDuration);
        this.playHookShot(hand.rayHitInfo, this.getAnchorWorldPosition(anchor));
        this.clearPendingLinkAnchor();
    }

    private getLinkAnchorFromHit(hit: CS.Px5.UnityExtensions.RaycastHit, worldPoint: CS.UnityEngine.Vector3): LinkAnchor | null {
        const rb = hit.rigidbody;
        if (!this.isValidRigidBody(rb)) {
            return null;
        }

        return {
            rigidbody: rb,
            localAnchor: rb.transform.InverseTransformPoint(worldPoint),
        };
    }

    private createObjectLink(anchorA: LinkAnchor, anchorB: LinkAnchor, visualDelay: number = 0): void {
        const joint = anchorB.rigidbody.gameObject.AddComponent(PxD6JointType) as CS.Px5.Unity.PxD6Joint;
        if (!joint) {
            return;
        }

        const worldA = this.getAnchorWorldPosition(anchorA);
        const worldB = this.getAnchorWorldPosition(anchorB);
        const distance = Vec3.Distance(worldA, worldB);

        joint.autoConfigureConnectedAnchor = false;
        joint.enableCollision = true;
        joint.connectedBody = anchorA.rigidbody;
        joint.anchor = anchorB.localAnchor;
        joint.connectedAnchor = anchorA.localAnchor;

        joint.xMotion = ConfigurableJointMotion.Limited;
        joint.yMotion = ConfigurableJointMotion.Limited;
        joint.zMotion = ConfigurableJointMotion.Limited;
        joint.angularXMotion = ConfigurableJointMotion.Free;
        joint.angularYMotion = ConfigurableJointMotion.Free;
        joint.angularZMotion = ConfigurableJointMotion.Free;

        const linearLimit = joint.linearLimit;
        linearLimit.limit = Mathf.Max(distance, 0.01);
        linearLimit.bounciness = 0;
        linearLimit.contactDistance = 0;
        joint.linearLimit = linearLimit;

        const spring = joint.linearLimitSpring;
        spring.spring = this.linkJointSpring;
        spring.damper = this.linkJointDamper;
        joint.linearLimitSpring = spring;

        const lineRenderer = this.createLineRenderer(`spiderman-object-link-${this.objectLinks.length}`, false, this.objectLinkColor);
        lineRenderer.startWidth = this.ropeWidth * 1.15;
        lineRenderer.endWidth = this.ropeWidth;

        const link: ObjectLink = {
            joint,
            rigidbodyA: anchorA.rigidbody,
            localAnchorA: anchorA.localAnchor,
            rigidbodyB: anchorB.rigidbody,
            localAnchorB: anchorB.localAnchor,
            lineRenderer,
            targetLength: linearLimit.limit,
            visualDelay,
            age: 0,
        };

        this.objectLinks.push(link);
        this.updateObjectLinkRenderer(link);
    }

    private updateObjectLinks(): void {
        for (let i = this.objectLinks.length - 1; i >= 0; i--) {
            const link = this.objectLinks[i];
            if (!link.joint || !link.joint.valid || !this.isValidRigidBody(link.rigidbodyA) || !this.isValidRigidBody(link.rigidbodyB)) {
                this.destroyObjectLinkAt(i);
                continue;
            }

            link.age += CS.UnityEngine.Time.deltaTime;
            if (link.age >= this.linkDissolveDuration) {
                this.destroyObjectLinkAt(i);
                continue;
            }

            this.updateObjectLinkReel(link);
            if (link.visualDelay > 0) {
                link.visualDelay -= CS.UnityEngine.Time.deltaTime;
                if (link.lineRenderer) {
                    link.lineRenderer.enabled = false;
                }
                continue;
            }
            this.updateObjectLinkRenderer(link);
        }
    }

    private updateObjectLinkReel(link: ObjectLink): void {
        const pointA = link.rigidbodyA.transform.TransformPoint(link.localAnchorA);
        const pointB = link.rigidbodyB.transform.TransformPoint(link.localAnchorB);
        const currentLength = Vec3.Distance(pointA, pointB);
        const overpull = currentLength - link.targetLength;
        if (overpull > this.linkAutoReelMaxOverpull || link.targetLength <= this.linkAutoReelMinLength) {
            return;
        }

        const nextTargetLength = Mathf.Max(
            this.linkAutoReelMinLength,
            link.targetLength - this.linkAutoReelSpeed * CS.UnityEngine.Time.deltaTime
        );
        if (nextTargetLength >= link.targetLength) {
            return;
        }

        link.targetLength = nextTargetLength;
        const limit = link.joint.linearLimit;
        limit.limit = link.targetLength;
        link.joint.linearLimit = limit;
    }

    private updateObjectLinkRenderer(link: ObjectLink): void {
        const renderer = link.lineRenderer;
        if (!renderer) {
            return;
        }

        const color = this.getObjectLinkDissolveColor(link);
        renderer.startColor = color;
        renderer.endColor = color;
        renderer.enabled = true;
        renderer.positionCount = 2;
        renderer.SetPosition(0, link.rigidbodyA.transform.TransformPoint(link.localAnchorA));
        renderer.SetPosition(1, link.rigidbodyB.transform.TransformPoint(link.localAnchorB));
    }

    private updatePendingLinkRenderer(hand: HandState, shotPosition: CS.UnityEngine.Vector3): void {
        if (!this.pendingLinkAnchor || !this.isValidRigidBody(this.pendingLinkAnchor.rigidbody)) {
            this.clearPendingLinkAnchor();
            this.hideRopeRenderer(hand);
            return;
        }

        const renderer = hand.lineRenderer;
        renderer.enabled = true;
        renderer.positionCount = 2;
        renderer.SetPosition(0, shotPosition);
        renderer.SetPosition(1, this.getAnchorWorldPosition(this.pendingLinkAnchor));
    }

    private startLinkCompleteAnimation(
        hand: HandState,
        anchorA: LinkAnchor,
        startPos: CS.UnityEngine.Vector3,
        anchorB: LinkAnchor
    ): void {
        hand.fireAnimElapsed = -1;
        hand.fireAnimFollowAnchor = null;
        hand.linkCompleteAnimElapsed = 0;
        hand.linkCompleteAnimStartPos = startPos;
        hand.linkCompleteAnimAnchorA = anchorA;
        hand.linkCompleteAnimAnchorB = anchorB;
        hand.lineRenderer.enabled = true;
        hand.lineRenderer.positionCount = 2;
    }

    private tickLinkCompleteAnimation(hand: HandState, dt: number): boolean {
        if (hand.linkCompleteAnimElapsed < 0) {
            return false;
        }

        const anchorA = hand.linkCompleteAnimAnchorA;
        const anchorB = hand.linkCompleteAnimAnchorB;
        if (!anchorA || !anchorB || !this.isValidRigidBody(anchorA.rigidbody) || !this.isValidRigidBody(anchorB.rigidbody)) {
            this.finishLinkCompleteAnimation(hand);
            return false;
        }

        hand.linkCompleteAnimElapsed += dt;
        const t = Mathf.Clamp01(hand.linkCompleteAnimElapsed / this.linkCompleteAnimDuration);
        const ease = 1 - (1 - t) * (1 - t);
        const pointA = this.getAnchorWorldPosition(anchorA);
        const pointB = this.getAnchorWorldPosition(anchorB);
        const flyingEnd = Vec3.Lerp(hand.linkCompleteAnimStartPos, pointB, ease);

        const renderer = hand.lineRenderer;
        renderer.enabled = true;
        renderer.positionCount = 2;
        renderer.SetPosition(0, pointA);
        renderer.SetPosition(1, flyingEnd);

        if (t >= 1) {
            this.finishLinkCompleteAnimation(hand);
        }

        return true;
    }

    private finishLinkCompleteAnimation(hand: HandState): void {
        hand.linkCompleteAnimElapsed = -1;
        hand.linkCompleteAnimAnchorA = null;
        hand.linkCompleteAnimAnchorB = null;
        this.hideRopeRenderer(hand);
    }

    private getObjectLinkDissolveColor(link: ObjectLink): CS.UnityEngine.Color {
        const t = Mathf.Clamp01(link.age / this.linkDissolveDuration);
        const alpha = Mathf.Lerp(this.objectLinkColor.a, this.linkDissolveEndAlpha, t);
        return new Color(this.objectLinkColor.r * alpha, this.objectLinkColor.g * alpha, this.objectLinkColor.b * alpha, alpha);
    }

    private isObjectLinkHovered(link: ObjectLink): boolean {
        for (const hand of this.hands) {
            if (hand.hoveredLink === link) {
                return true;
            }
        }
        return false;
    }

    private findHoveredObjectLink(origin: CS.UnityEngine.Vector3, direction: CS.UnityEngine.Vector3, maxRayDistance: number): ObjectLink | null {
        if (this.objectLinks.length <= 0 || direction.sqrMagnitude <= 0.0001) {
            return null;
        }

        const dir = direction.normalized;
        const maxDistanceSqr = this.linkHitRadius * this.linkHitRadius;
        let bestLink: ObjectLink | null = null;
        let bestRayDistance = Number.POSITIVE_INFINITY;

        for (const link of this.objectLinks) {
            if (!link.joint || !link.joint.valid || !this.isValidRigidBody(link.rigidbodyA) || !this.isValidRigidBody(link.rigidbodyB)) {
                continue;
            }

            const pointA = link.rigidbodyA.transform.TransformPoint(link.localAnchorA);
            const pointB = link.rigidbodyB.transform.TransformPoint(link.localAnchorB);
            const hit = this.getRaySegmentDistance(origin, dir, pointA, pointB);
            if (hit.rayDistance <= maxRayDistance && hit.distanceSqr <= maxDistanceSqr && hit.rayDistance < bestRayDistance) {
                bestRayDistance = hit.rayDistance;
                bestLink = link;
            }
        }

        return bestLink;
    }

    private getRaySegmentDistance(
        origin: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        pointA: CS.UnityEngine.Vector3,
        pointB: CS.UnityEngine.Vector3
    ): { distanceSqr: number; rayDistance: number } {
        const linkDelta = Vec3.op_Subtraction(pointB, pointA);
        const linkLengthSqr = linkDelta.sqrMagnitude;
        if (linkLengthSqr <= 0.000001) {
            return this.getRayPointDistance(origin, direction, pointA);
        }

        const rayEnd = Vec3.op_Addition(origin, Vec3.op_Multiply(direction, this.shotDistance));
        const fromOrigin = Vec3.op_Subtraction(pointA, origin);
        const linkParallel = Vec3.op_Multiply(direction, Vec3.Dot(linkDelta, direction));
        const linkPerp = Vec3.op_Subtraction(linkDelta, linkParallel);
        const pointParallel = Vec3.op_Multiply(direction, Vec3.Dot(fromOrigin, direction));
        const pointPerp = Vec3.op_Subtraction(fromOrigin, pointParallel);

        const candidates = [0, 1];
        const perpLenSqr = linkPerp.sqrMagnitude;
        if (perpLenSqr > 0.000001) {
            candidates.push(Mathf.Clamp01(-Vec3.Dot(pointPerp, linkPerp) / perpLenSqr));
        }
        candidates.push(Mathf.Clamp01(-Vec3.Dot(Vec3.op_Subtraction(pointA, origin), linkDelta) / linkLengthSqr));
        candidates.push(Mathf.Clamp01(-Vec3.Dot(Vec3.op_Subtraction(pointA, rayEnd), linkDelta) / linkLengthSqr));

        let bestDistanceSqr = Number.POSITIVE_INFINITY;
        let bestRayDistance = Number.POSITIVE_INFINITY;
        for (const t of candidates) {
            const point = Vec3.op_Addition(pointA, Vec3.op_Multiply(linkDelta, t));
            const hit = this.getRayPointDistance(origin, direction, point);
            if (hit.distanceSqr < bestDistanceSqr) {
                bestDistanceSqr = hit.distanceSqr;
                bestRayDistance = hit.rayDistance;
            }
        }

        return { distanceSqr: bestDistanceSqr, rayDistance: bestRayDistance };
    }

    private getRayPointDistance(
        origin: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3,
        point: CS.UnityEngine.Vector3
    ): { distanceSqr: number; rayDistance: number } {
        const toPoint = Vec3.op_Subtraction(point, origin);
        const rayDistance = Mathf.Clamp(Vec3.Dot(toPoint, direction), 0, this.shotDistance);
        const closestPoint = Vec3.op_Addition(origin, Vec3.op_Multiply(direction, rayDistance));
        return {
            distanceSqr: Vec3.op_Subtraction(point, closestPoint).sqrMagnitude,
            rayDistance,
        };
    }

    private updateLinkPreview(): void {
        if (!this.pendingLinkAnchor || !this.isValidRigidBody(this.pendingLinkAnchor.rigidbody)) {
            this.clearPendingLinkAnchor();
            return;
        }

        const start = this.getAnchorWorldPosition(this.pendingLinkAnchor);
        let end: CS.UnityEngine.Vector3 | null = null;
        for (const hand of this.hands) {
            if (hand.key !== this.pendingLinkHandKey || hand.isGrappling || !hand.rayHitInfo) {
                continue;
            }

            const hoverAnchor = this.getLinkAnchorFromHit(hand.rayHitInfo, hand.grappleHitPoint);
            if (hoverAnchor && hoverAnchor.rigidbody !== this.pendingLinkAnchor.rigidbody) {
                end = this.getAnchorWorldPosition(hoverAnchor);
                break;
            }
        }

        Giz.DrawCrosshair(start, Quat.identity, 0.7, new Color(0.45, 1.0, 0.85, 1.0));
        if (!end) {
            this.hideLinkPreview();
            return;
        }

        this.linkPreviewLineRenderer.enabled = true;
        this.linkPreviewLineRenderer.positionCount = 2;
        this.linkPreviewLineRenderer.SetPosition(0, start);
        this.linkPreviewLineRenderer.SetPosition(1, end);
    }

    private hideLinkPreview(): void {
        if (this.linkPreviewLineRenderer.enabled) {
            this.linkPreviewLineRenderer.enabled = false;
        }
    }

    private clearPendingLinkAnchor(): void {
        this.pendingLinkAnchor = null;
        this.pendingLinkHandKey = null;
        this.hideLinkPreview();
    }

    private getAnchorWorldPosition(anchor: LinkAnchor): CS.UnityEngine.Vector3 {
        return anchor.rigidbody.transform.TransformPoint(anchor.localAnchor);
    }

    private destroyObjectLinkAt(index: number): void {
        const link = this.objectLinks[index];
        if (!link) {
            return;
        }

        for (const hand of this.hands) {
            if (hand.hoveredLink === link) {
                hand.hoveredLink = null;
            }
        }

        if (link.joint) {
            CS.UnityEngine.Object.Destroy(link.joint);
        }
        if (link.lineRenderer) {
            CS.UnityEngine.Object.Destroy(link.lineRenderer.gameObject);
        }

        this.objectLinks.splice(index, 1);
    }

    private destroyObjectLink(link: ObjectLink): void {
        const index = this.objectLinks.indexOf(link);
        if (index >= 0) {
            this.destroyObjectLinkAt(index);
        }
    }

    private destroyAllObjectLinks(): void {
        for (let i = this.objectLinks.length - 1; i >= 0; i--) {
            this.destroyObjectLinkAt(i);
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

    private isValidAimPoint(origin: CS.UnityEngine.Vector3, point: CS.UnityEngine.Vector3 | null): point is CS.UnityEngine.Vector3 {
        if (!this.isFiniteVector(origin) || !this.isFiniteVector(point)) {
            return false;
        }

        const maxPreviewDistance = this.shotDistance + this.shotRadius * 4.0;
        return Vec3.Distance(origin, point) <= maxPreviewDistance;
    }

    private safeDirection(direction: CS.UnityEngine.Vector3, fallback: CS.UnityEngine.Vector3): CS.UnityEngine.Vector3 {
        if (this.isFiniteVector(direction) && direction.sqrMagnitude > 0.0001) {
            return direction.normalized;
        }
        if (this.isFiniteVector(fallback) && fallback.sqrMagnitude > 0.0001) {
            return fallback.normalized;
        }
        return Vec3.forward;
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
        const pullFromBack = hipBody ? -Vec3.Dot(handDelta, hipBody.transform.forward) : 0;
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
            var pB = hand.joint.connectedBody?.transform.TransformPoint(hand.joint.connectedAnchor) ?? Vec3.zero;
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
            if (!rb) {
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

        const grounded = ModAPI.IsCharacterGrounded(character);
        if (grounded) {
            return;
        }

        if (move.sqrMagnitude <= 0.0001) {
            return;
        }

        const vel = Vec3.op_Multiply(move, CS.UnityEngine.Time.fixedDeltaTime * this.swingForceMultiplier);
        const hipRb = ModAPI.GetCharacterBody(character, "Hip");

        if (hipRb) {
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
        if (torso) {
            return torso.transform.position;
        }
        const mainRb = ModAPI.GetEntityMainRigidbody(character);
        return mainRb ? mainRb.transform.position : this.bindTo.transform.position;
    }

    private attachJoint(
        character: VX.Entity.EntityCharacter,
        hand: HandState,
        hit: CS.Px5.UnityExtensions.RaycastHit
    ): void {
        const joint = ModAPI.AttachJointToCharacter(character, hit.rigidbody);
        if (!joint) {
            return;
        }

        // Use the joint's own transform position (anchor = zero) so that the initial
        // ropeLength is consistent with what getBodyJointPos will measure every frame,
        // preventing an immediate Mathf.Min shrink on the first update tick.
        hand.ropeLength = Vec3.Distance(joint.transform.position, hand.grappleHitPoint);

        joint.autoConfigureConnectedAnchor = false;
        joint.enableCollision = true;
        joint.connectedBody = hit.rigidbody;
        joint.connectedAnchor = hit.rigidbody
            ? hit.rigidbody.transform.InverseTransformPoint(hand.grappleHitPoint)
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
            if (connectedBody?.valid) {
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
            if (!rb) {
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
            if (!rb) {
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
            if (!rb) {
                continue;
            }

            rb.velocity = Vec3.zero;
            rb.angularVelocity = Vec3.zero;
        }

        ModAPI.SetCharacterVelocity(character, Vec3.zero);
    }

    private updateContinuousSounds(_character: VX.Entity.EntityCharacter): void {
        let reelActive = false;

        for (const hand of this.hands) {
            reelActive = reelActive || hand.reelSoundActive;
        }

        this.setContinuousSoundState(this.moveJetSound, false);
        this.setContinuousSoundState(this.reelRopeSound, reelActive);
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

    private startFireAnimation(
        hand: HandState,
        startPos: CS.UnityEngine.Vector3,
        endPos: CS.UnityEngine.Vector3,
        followAnchor: LinkAnchor | null = null
    ): void {
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
        hand.fireAnimFollowAnchor = followAnchor;

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
        const liveEnd  = this.getFireAnimationEndPos(hand);
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
            hand.fireAnimFollowAnchor = null;
            lr.positionCount        = 2;
            return false;
        }

        return true;
    }

    private getFireAnimationEndPos(hand: HandState): CS.UnityEngine.Vector3 {
        const followAnchor = hand.fireAnimFollowAnchor;
        if (followAnchor && this.isValidRigidBody(followAnchor.rigidbody)) {
            return this.getAnchorWorldPosition(followAnchor);
        }

        return hand.isGrappling ? this.getAnchorWorldPos(hand) : hand.fireAnimEndPos;
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
        hand.fireAnimFollowAnchor = null;
        hand.linkCompleteAnimElapsed = -1;
        hand.linkCompleteAnimAnchorA = null;
        hand.linkCompleteAnimAnchorB = null;
        hand.lineRenderer.positionCount = 2;
        this.hideRopeRenderer(hand);
        hand.isGrappling = false;
        if (character) {
            ModAPI.SetCharacterHanging(character, hand.isGrappling);
        }
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
            this.stopContinuousSound(this.moveJetSound);
            this.stopContinuousSound(this.reelRopeSound);
        }
    }
}
