const Vec3 = CS.UnityEngine.Vector3;
const Quat = CS.UnityEngine.Quaternion;
const Color = CS.UnityEngine.Color;
const ForceMode = CS.UnityEngine.ForceMode;
const QueryTriggerInteraction = CS.UnityEngine.QueryTriggerInteraction;
const PxPhysics = CS.Px5.Unity.PxPhysics;
const Giz = VX.Utility.Giz;
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const EntityType = puerts.$typeof(VX.Entity.Entity);
const EntityCharacterType = puerts.$typeof(VX.Entity.EntityCharacter);
const EntityFirableWeaponType = puerts.$typeof(VX.Entity.EntityFirableWeapon);
const RendererType = puerts.$typeof(CS.UnityEngine.Renderer);
const ModAPI = VX.Mod.ModAPI;

interface HiddenWeaponCache {
    gameObject: CS.UnityEngine.GameObject;
    entity: VX.Entity.Entity | null;
    weapon: VX.Entity.EntityFirableWeapon | null;
    triggerHeld: boolean;
}

/**
 * Ironman component implementation using JsComponentProxy.
 */
export class Ironman {
    private bindTo: VX.Mod.JsComponentProxy;
    private character: VX.Entity.EntityCharacter | null;
    private input: VX.Mod.ModAPI.Input;

    private readonly airThrusterAcceleration = 45.0;
    private readonly moveInputDeadZoneSqr = 0.0001;
    private readonly rocketLauncherItemKey = "Items/Guns/Rocket Launcher";
    private readonly rocketSpawnForwardOffset = 0.4;
    private readonly rocketSpawnUpOffset = 0.28;
    private readonly rocketSpawnOutwardOffset = 0.14;
    private readonly rocketFallbackSideOffset = 0.45;
    private readonly rocketAmmo = 999;
    private readonly repulsorItemKey = "Items/Guns/Laser Rifle";
    private readonly repulsorForwardOffset = 0.1;
    private readonly repulsorOutwardOffset = 0.0;
    private readonly repulsorFallbackSideOffset = 0.45;
    private readonly repulsorAimDistance = 80.0;
    private readonly repulsorAmmo = 999;

    private moveJetSound: CS.Sonity.SoundEvent | null = null;
    private wasAbilityLPressed = false;
    private wasAbilityRPressed = false;
    private leftRocketLauncher: HiddenWeaponCache | null = null;
    private rightRocketLauncher: HiddenWeaponCache | null = null;
    private leftRepulsorGun: HiddenWeaponCache | null = null;
    private rightRepulsorGun: HiddenWeaponCache | null = null;
    private thrusterFX_L: CS.UnityEngine.Transform | null = null;
    private thrusterFX_R: CS.UnityEngine.Transform | null = null;
    private thrusterFX_L_Attached = false;
    private thrusterFX_R_Attached = false;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Ironman constructor");
        this.bindTo = bindTo;
        this.character = bindTo.GetComponent(EntityCharacterType) as VX.Entity.EntityCharacter | null;
        this.input = new VX.Mod.ModAPI.Input();
        this.readProperties();

        this.bindTo.onUpdate = (_dt) => this.onUpdate();
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
        CS.UnityEngine.Debug.Log("Ironman initialized");
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        this.moveJetSound = props.Get("moveJetSound") as CS.Sonity.SoundEvent;
        this.thrusterFX_L = props.Get("thrusterFX_L") as CS.UnityEngine.Transform;
        this.thrusterFX_R = props.Get("thrusterFX_R") as CS.UnityEngine.Transform;
    }

    private onStart(): void {
        this.attachThrusterFX(this.getCharacter());
    }

    private onUpdate(): void {
        const character = this.getCharacter();
        this.updateAbilityRockets(character);
        this.updateRepulsors(character);
        this.keepHiddenWeaponsHidden();

        const active = character != null && this.isAirThrusterActive(character);
        this.setContinuousSoundState(this.moveJetSound, active);
    }

    private onFixedUpdate(deltaTime: number): void {
        const character = this.getCharacter();
        this.updateThrusterFX(character);
        if (character == null || ModAPI.IsCharacterGrounded(character)) {
            return;
        }

        const move = this.getCameraRelativeMove();
        if (move.sqrMagnitude <= this.moveInputDeadZoneSqr) {
            return;
        }

        const sprintMul = 1 + this.input.GetSprintInput() * 2;
        const thrust = Vec3.op_Multiply(move.normalized, this.airThrusterAcceleration * deltaTime * sprintMul);
        const hipRb = ModAPI.GetCharacterBody(character, "Hip");
        if (hipRb) {
            hipRb.AddForce(thrust, ForceMode.VelocityChange);
        }

        ModAPI.AddCharacterMotion(character, thrust, ForceMode.VelocityChange);
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

    private getCameraRelativeMove(): CS.UnityEngine.Vector3 {
        const moveInput = this.input.GetMoveInput();
        let movement = new Vec3(moveInput.x, 0, moveInput.y);
        const cam = ModAPI.GetMainCamera();
        movement = cam ? Quat.op_Multiply(cam.transform.rotation, movement) : movement;
        const jump = this.input.GetJumpInput();
        movement.y += jump * 1.5;
        return movement;
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

        const pose = this.getHandRepulsorPose(character, isLeft);
        this.drawRepulsorAimPreview(character, pose);

        cache = cache ?? this.ensureRepulsorGun(isLeft);
        if (!cache) {
            return;
        }

        this.syncHiddenWeapon(cache, pose.position, pose.rotation);
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
            ModAPI.Log("Ironman: failed to spawn " + itemKey);
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
            ModAPI.Log("Ironman: spawned " + label + " has no EntityFirableWeapon.");
        }

        const cache = { gameObject: obj, entity, weapon, triggerHeld: false };
        this.enforceHiddenWeaponState(cache);
        return cache;
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
        this.enforceHiddenWeaponState(cache);
    }

    private setRepulsorTrigger(cache: HiddenWeaponCache | null, pressed: boolean): void {
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

    private drawRepulsorAimPreview(
        character: VX.Entity.EntityCharacter,
        pose: { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion; forward: CS.UnityEngine.Vector3 }
    ): void {
        const origin = pose.position;
        const direction = this.safeDirection(pose.forward, this.bindTo.transform.forward);
        const targetPos =
            this.findRepulsorAimPoint(character, origin, direction) ??
            Vec3.op_Addition(origin, Vec3.op_Multiply(direction, this.repulsorAimDistance));
        if (!this.isValidAimPoint(origin, targetPos)) {
            return;
        }

        const color = new Color(1.0, 0.05, 0.02, 1.0);
        Giz.DrawCrosshair(targetPos, pose.rotation, 0.5, color);
        Giz.DrawDashedLine(origin, targetPos, 0.3, 0.3, color);
    }

    private findRepulsorAimPoint(
        character: VX.Entity.EntityCharacter,
        origin: CS.UnityEngine.Vector3,
        direction: CS.UnityEngine.Vector3
    ): CS.UnityEngine.Vector3 | null {
        if (!this.isFiniteVector(origin) || !this.isFiniteVector(direction)) {
            return null;
        }

        const hits = PxPhysics.RaycastAll(origin, direction, this.repulsorAimDistance, -1, QueryTriggerInteraction.Ignore);
        if (!hits || hits.Length <= 0) {
            return null;
        }

        const ownRigidbodies = ModAPI.GetEntityRigidbodies(character);
        let bestPoint: CS.UnityEngine.Vector3 | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        for (let i = 0; i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
            if (!hit || !this.isFiniteVector(hit.point) || !this.isFiniteScalar(hit.distance)) {
                continue;
            }

            if (hit.distance <= 0.05 || hit.distance >= bestDistance) {
                continue;
            }

            if (this.containsRigidbody(ownRigidbodies, hit.rigidbody)) {
                continue;
            }

            if (!this.isValidAimPoint(origin, hit.point)) {
                continue;
            }

            bestDistance = hit.distance;
            bestPoint = hit.point;
        }

        return bestPoint;
    }

    private getHandRepulsorPose(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion; forward: CS.UnityEngine.Vector3 } {
        const cam = ModAPI.GetMainCamera();
        const side = cam ? cam.transform.right : this.bindTo.transform.right;
        const handBodyName = isLeft ? "LeftHand" : "RightHand";
        const hand = ModAPI.GetCharacterBody(character, handBodyName) as CS.Px5.Unity.PxRigidBody | null;
        let forward = cam ? cam.transform.forward : this.bindTo.transform.forward;
        let up = cam ? cam.transform.up : Vec3.up;

        let position: CS.UnityEngine.Vector3;
        if (hand) {
            position = hand.worldCenterOfMass;
            forward = hand.transform.forward;
            up = hand.transform.up;
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

    private updateAbilityRockets(character: VX.Entity.EntityCharacter | null): void {
        const abilityLPressed = this.input.GetAbilityLInput() > 0.5;
        const abilityRPressed = this.input.GetAbilityRInput() > 0.5;

        if (character != null) {
            if (abilityLPressed && !this.wasAbilityLPressed) {
                this.fireShoulderRocket(character, true);
            }

            if (abilityRPressed && !this.wasAbilityRPressed) {
                this.fireShoulderRocket(character, false);
            }
        }

        this.wasAbilityLPressed = abilityLPressed;
        this.wasAbilityRPressed = abilityRPressed;
    }

    private fireShoulderRocket(character: VX.Entity.EntityCharacter, isLeft: boolean): void {
        const launcher = this.ensureRocketLauncher(isLeft);
        if (!launcher || !launcher.weapon) {
            return;
        }

        const pose = this.getShoulderRocketPose(character, isLeft);
        this.syncHiddenWeapon(launcher, pose.position, pose.rotation);
        this.fireRocketLauncher(launcher);
    }

    private ensureRocketLauncher(isLeft: boolean): HiddenWeaponCache | null {
        const existing = isLeft ? this.leftRocketLauncher : this.rightRocketLauncher;
        if (existing) {
            return existing;
        }

        const cache = this.createHiddenWeapon(this.rocketLauncherItemKey, this.rocketAmmo, "rocket launcher");
        if (!cache) {
            return null;
        }

        if (isLeft) {
            this.leftRocketLauncher = cache;
        } else {
            this.rightRocketLauncher = cache;
        }
        return cache;
    }

    private fireRocketLauncher(cache: HiddenWeaponCache): void {
        if (!cache.weapon) {
            return;
        }

        this.setWeaponAmmo(cache.weapon, this.rocketAmmo);
        const weaponView = cache.weapon as any;
        if (weaponView.ForceFire) {
            weaponView.ForceFire();
            this.enforceHiddenWeaponState(cache);
            return;
        }

        if (weaponView.FireOnce) {
            weaponView.FireOnce();
            this.enforceHiddenWeaponState(cache);
            return;
        }

        ModAPI.SetWeaponTriggerPressed(cache.weapon, true);
        ModAPI.SetWeaponTriggerPressed(cache.weapon, false);
        this.enforceHiddenWeaponState(cache);
    }

    private keepHiddenWeaponsHidden(): void {
        this.enforceHiddenWeaponState(this.leftRocketLauncher);
        this.enforceHiddenWeaponState(this.rightRocketLauncher);
        this.enforceHiddenWeaponState(this.leftRepulsorGun);
        this.enforceHiddenWeaponState(this.rightRepulsorGun);
    }

    private enforceHiddenWeaponState(cache: HiddenWeaponCache | null): void {
        if (!cache || !cache.gameObject) {
            return;
        }

        if (cache.entity) {
            ModAPI.SetEntityPinned(cache.entity, true);
            ModAPI.SetEntityGravityEnabled(cache.entity, false);
            ModAPI.SetEntityVisible(cache.entity, false);
            this.disableHiddenWeaponPhysics(cache.entity);
        }

        const renderers = cache.gameObject.GetComponentsInChildren(RendererType, true);
        for (let i = 0; i < renderers.Length; i++) {
            const renderer = renderers.get_Item(i) as CS.UnityEngine.Renderer | null;
            if (renderer) {
                renderer.enabled = false;
            }
        }
    }

    private getShoulderRocketPose(
        character: VX.Entity.EntityCharacter,
        isLeft: boolean
    ): { position: CS.UnityEngine.Vector3; rotation: CS.UnityEngine.Quaternion; forward: CS.UnityEngine.Vector3 } {
        const cam = ModAPI.GetMainCamera();
        const forward = cam ? cam.transform.forward : this.bindTo.transform.forward;
        const up = cam ? cam.transform.up : Vec3.up;
        const side = cam ? cam.transform.right : this.bindTo.transform.right;
        const shoulderBodyName = isLeft ? "LeftArmUp" : "RightArmUp";
        const shoulder = ModAPI.GetCharacterBody(character, shoulderBodyName);

        let position: CS.UnityEngine.Vector3;
        if (shoulder) {
            position = shoulder.worldCenterOfMass;
        } else {
            position = this.getFallbackShoulderPosition(character, isLeft);
        }

        position = Vec3.op_Addition(position, Vec3.op_Multiply(forward, this.rocketSpawnForwardOffset));
        position = Vec3.op_Addition(position, Vec3.op_Multiply(up, this.rocketSpawnUpOffset));
        position = Vec3.op_Addition(
            position,
            Vec3.op_Multiply(side, isLeft ? -this.rocketSpawnOutwardOffset : this.rocketSpawnOutwardOffset)
        );
        return {
            position,
            rotation: Quat.LookRotation(forward, up),
            forward,
        };
    }

    private getFallbackShoulderPosition(character: VX.Entity.EntityCharacter, isLeft: boolean): CS.UnityEngine.Vector3 {
        const torso = ModAPI.GetCharacterBody(character, "Torso");
        const basePos = torso ? torso.worldCenterOfMass : this.bindTo.transform.position;
        const cam = ModAPI.GetMainCamera();
        const side = cam ? cam.transform.right : this.bindTo.transform.right;
        const sideOffset = Vec3.op_Multiply(side, isLeft ? -this.rocketFallbackSideOffset : this.rocketFallbackSideOffset);
        return Vec3.op_Addition(basePos, sideOffset);
    }

    private isAirThrusterActive(character: VX.Entity.EntityCharacter): boolean {
        if (ModAPI.IsCharacterGrounded(character)) {
            return false;
        }

        return this.getCameraRelativeMove().sqrMagnitude > this.moveInputDeadZoneSqr;
    }

    private containsRigidbody(
        rigidbodies: CS.System.Array$1<CS.Px5.Unity.PxRigidBody>,
        target: CS.Px5.Unity.PxRigidBody | null
    ): boolean {
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

        return Vec3.Distance(origin, point) <= this.repulsorAimDistance + 1.0;
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
        this.setContinuousSoundState(this.moveJetSound, false);
        this.destroyHiddenWeapon(this.leftRocketLauncher);
        this.destroyHiddenWeapon(this.rightRocketLauncher);
        this.destroyRepulsor(this.leftRepulsorGun);
        this.destroyRepulsor(this.rightRepulsorGun);
        this.leftRocketLauncher = null;
        this.rightRocketLauncher = null;
        this.leftRepulsorGun = null;
        this.rightRepulsorGun = null;
        this.destroyThrusterFX(this.thrusterFX_L);
        this.destroyThrusterFX(this.thrusterFX_R);
        this.thrusterFX_L = null;
        this.thrusterFX_R = null;
        this.thrusterFX_L_Attached = false;
        this.thrusterFX_R_Attached = false;
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
