/**
 * Train: drives the host transform along +X every frame (no physics).
 * Attach via JsComponentProxy with modId = "com.creamy.subwaystation"
 * and className = "Train".
 */
const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const Vec3 = CS.UnityEngine.Vector3;
const PxPhysics = CS.Px5.Unity.PxPhysics;
const QueryTriggerInteraction = CS.UnityEngine.QueryTriggerInteraction;
const LayerMasksHelper = (CS.VoxelPlayground as any).Engine.LayerMasksHelper;
const PxRigidBodyType = puerts.$typeof(CS.Px5.Unity.PxRigidBody);
const PxD6JointType = puerts.$typeof(CS.Px5.Unity.PxD6Joint);
const PxColliderType = puerts.$typeof(CS.Px5.Unity.PxCollider);
const ConfigurableJointMotion = CS.UnityEngine.ConfigurableJointMotion;

type IgnoredCollisionPair = {
    characterCollider: CS.Px5.Unity.PxCollider;
    trainCollider: CS.Px5.Unity.PxCollider;
};

export class Train {
    private bindTo: VX.Mod.JsComponentProxy;
    private speed: number = 5.2; // meters per second along world +X
    private transform: CS.UnityEngine.Transform | null = null;
    private spawnPoints: CS.UnityEngine.Transform | null = null;
    private trainRigidbody: CS.Px5.Unity.PxRigidBody | null = null;
    private attachedJoints: CS.Px5.Unity.PxD6Joint[] = [];
    private ignoredCollisionPairs: IgnoredCollisionPair[] = [];
    private elapsedTime: number = 0;
    private readonly startDelaySeconds: number = 10;
    private readonly raycastStartHeight: number = 50;
    private readonly raycastDistance: number = 300;
    private readonly buildingRaycastMask: number = 1 << LayerMasksHelper.layerMask_Building.value;
    private readonly minimalSpeedForMoveAnimation: number = 5;
    private readonly spawnCharacterIds: string[] = [
        "Characters/Worker 1",
        "Characters/Worker 2",
        "Characters/Soldier Normal 1",
        "Characters/Soldier Normal 2",
    ];

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onFixedUpdate = (dt) => this.onFixedUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
        this.bindTo.onDisable = () => this.onDestroy();
    }

    private onStart(): void {
        this.transform = this.bindTo.transform;
        this.trainRigidbody = this.findTrainRigidbody();
        this.readProperties();
        if (!this.spawnPoints) {
            this.spawnPoints = this.findTransformRecursive(this.bindTo.transform, "SpawnPoints");
        }
        this.spawnCharacters();
        CS.UnityEngine.Debug.Log("[Train] Driving transform on " + this.bindTo.gameObject.name);
    }

    private onFixedUpdate(dt: number): void {
        if (!this.transform) return;
        this.elapsedTime += dt;
        if (this.elapsedTime < this.startDelaySeconds) {
            return;
        }

        const movingTransform = this.trainRigidbody ? this.trainRigidbody.transform : this.transform;
        const p = movingTransform.position;
        const nextPosition = new CS.UnityEngine.Vector3(
            p.x + this.speed * dt,
            p.y,
            p.z
        );

        if (this.trainRigidbody) {
            this.trainRigidbody.MovePosition(nextPosition);
            return;
        }

        this.transform.position = nextPosition;
    }

    private onDestroy(): void {
        this.restoreIgnoredCollisions();

        for (let i = 0; i < this.attachedJoints.length; i++) {
            const joint = this.attachedJoints[i];
            if (joint) {
                CS.UnityEngine.Object.Destroy(joint);
            }
        }
        this.attachedJoints = [];
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (!props) {
            CS.UnityEngine.Debug.LogWarning("[Train] JsProperties component not found on " + this.bindTo.gameObject.name + ".");
            return;
        }

        const pairs = props.Pairs;
        CS.UnityEngine.Debug.Log("[Train] JsProperties pair count on " + this.bindTo.gameObject.name + ": " + pairs.Length);
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            const value = pair.value as any;
            CS.UnityEngine.Debug.Log("[Train] JsProperties pair: " + pair.key + " value=" + value);
            if (pair.key === "SpawnPoints" && value != null) {
                this.spawnPoints = value.transform != null
                    ? value.transform as CS.UnityEngine.Transform
                    : value as CS.UnityEngine.Transform;
                CS.UnityEngine.Debug.Log("[Train] SpawnPoints property resolved to " + this.spawnPoints.name + ".");
            }
        }
    }

    private spawnCharacters(): void {
        if (!this.spawnPoints) {
            CS.UnityEngine.Debug.LogWarning("[Train] SpawnPoints is not assigned; skip character spawn.");
            return;
        }

        CS.UnityEngine.Debug.Log("[Train] SpawnPoints childCount=" + this.spawnPoints.childCount + ".");
        const prefabIdResolver = (CS.VoxelPlayground as any).Gaming.PrefabIdResolver;
        for (let i = 0; i < this.spawnPoints.childCount; i++) {
            const spawnPoint = this.spawnPoints.GetChild(i);
            const characterId = this.getRandomCharacterId();
            const spawnPosition = spawnPoint.position;
            const task = prefabIdResolver.SpawnCharacterById(characterId, spawnPosition) as any;
            this.disableAiWhenSpawned(task, characterId, spawnPoint.name);
            CS.UnityEngine.Debug.Log("[Train] Requested spawn " + characterId + " at " + spawnPoint.name + ".");
        }
    }

    private getRandomCharacterId(): string {
        const index = Math.floor(Math.random() * this.spawnCharacterIds.length);
        return this.spawnCharacterIds[index];
    }

    private resolveGroundedSpawnPosition(spawnPoint: CS.UnityEngine.Transform): CS.UnityEngine.Vector3 {
        const source = spawnPoint.position;
        const origin = new Vec3(source.x, source.y + this.raycastStartHeight, source.z);

        const bestHit = this.findGroundHit(spawnPoint.name, origin, this.buildingRaycastMask, "Building");

        if (bestHit) {
            const p = bestHit.point;
            CS.UnityEngine.Debug.Log("[Train] Grounded " + spawnPoint.name + " on " + bestHit.transform.name + " layer=" + bestHit.transform.gameObject.layer + ".");
            return new Vec3(p.x, p.y, p.z);
        }

        CS.UnityEngine.Debug.LogWarning("[Train] No Building-layer ground hit below " + spawnPoint.name + "; using original spawn point.");
        return source;
    }

    private findGroundHit(
        spawnPointName: string,
        origin: CS.UnityEngine.Vector3,
        layerMask: number,
        label: string
    ): CS.Px5.UnityExtensions.RaycastHit | null {
        const hits = PxPhysics.RaycastAll(
            origin,
            Vec3.down,
            this.raycastDistance,
            layerMask,
            QueryTriggerInteraction.Ignore
        );

        let bestHit: CS.Px5.UnityExtensions.RaycastHit | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        CS.UnityEngine.Debug.Log("[Train] Raycast " + label + " for " + spawnPointName + " mask=" + layerMask + " hits=" + (hits == null ? 0 : hits.Length) + ".");
        for (let i = 0; hits != null && i < hits.Length; i++) {
            const hit = hits.get_Item(i) as CS.Px5.UnityExtensions.RaycastHit;
            if (!hit || !hit.transform) {
                continue;
            }

            if (hit.distance < bestDistance) {
                bestDistance = hit.distance;
                bestHit = hit;
            }
        }

        return bestHit;
    }

    private disableAiWhenSpawned(task: any, characterId: string, spawnPointName: string): void {
        if (task == null) {
            CS.UnityEngine.Debug.LogWarning("[Train] Spawn task is null for " + characterId + " at " + spawnPointName + ".");
            return;
        }

        if (typeof task.GetAwaiter === "function") {
            const awaiter = task.GetAwaiter();
            awaiter.OnCompleted(() => {
                const character = awaiter.GetResult();
                this.disableAi(character, characterId, spawnPointName);
                this.configureCharacterAnimation(character, characterId, spawnPointName);
                this.attachCharacterToTrain(character, characterId, spawnPointName);
            });
            return;
        }

        if (typeof task.Forget === "function") {
            task.Forget();
        }
    }

    private disableAi(character: any, characterId: string, spawnPointName: string): void {
        if (character == null) {
            CS.UnityEngine.Debug.LogWarning("[Train] Spawn returned null for " + characterId + " at " + spawnPointName + ".");
            return;
        }

        const aiNamespace = (CS.VoxelPlayground as any).AI;
        const aiControllerType = puerts.$typeof(aiNamespace.AIController);
        const aiController = character.GetComponent(aiControllerType) as any;
        if (aiController == null) {
            CS.UnityEngine.Debug.LogWarning("[Train] Spawned " + characterId + " has no AIController.");
            return;
        }

        aiController.SetBlockState(aiNamespace.AIController.BlockState.Disabled);
        CS.UnityEngine.Debug.Log("[Train] Spawned " + characterId + " at " + spawnPointName + " with AI disabled.");
    }

    private configureCharacterAnimation(character: any, characterId: string, spawnPointName: string): void {
        if (character == null) {
            return;
        }

        character.minimalSpeedForMoveAnimation = this.minimalSpeedForMoveAnimation;
        CS.UnityEngine.Debug.Log("[Train] Set minimalSpeedForMoveAnimation=" + this.minimalSpeedForMoveAnimation + " for " + characterId + " at " + spawnPointName + ".");
    }

    private attachCharacterToTrain(character: any, characterId: string, spawnPointName: string): void {
        if (character == null) {
            return;
        }

        const trainRb = this.trainRigidbody || this.findTrainRigidbody();
        this.trainRigidbody = trainRb;
        if (!trainRb) {
            CS.UnityEngine.Debug.LogWarning("[Train] Cannot attach " + characterId + " at " + spawnPointName + ": train PxRigidBody not found.");
            return;
        }

        const bodyRb = this.getCharacterBodyRigidbody(character);
        if (!bodyRb) {
            CS.UnityEngine.Debug.LogWarning("[Train] Cannot attach " + characterId + " at " + spawnPointName + ": character BodyRigidbody not found.");
            return;
        }

        this.ignoreCharacterTrainCollisions(character, trainRb, characterId, spawnPointName);

        const joint = trainRb.gameObject.AddComponent(PxD6JointType) as CS.Px5.Unity.PxD6Joint;
        joint.autoConfigureConnectedAnchor = false;
        joint.connectedBody = bodyRb;

        const anchorWorld = this.getCharacterHipPosition(character, bodyRb);
        joint.anchor = trainRb.transform.InverseTransformPoint(anchorWorld);
        joint.connectedAnchor = bodyRb.transform.InverseTransformPoint(anchorWorld);

        joint.xMotion = ConfigurableJointMotion.Locked;
        joint.yMotion = ConfigurableJointMotion.Locked;
        joint.zMotion = ConfigurableJointMotion.Locked;
        joint.angularXMotion = ConfigurableJointMotion.Free;
        joint.angularYMotion = ConfigurableJointMotion.Free;
        joint.angularZMotion = ConfigurableJointMotion.Free;

        this.attachedJoints.push(joint);
        CS.UnityEngine.Debug.Log("[Train] Attached " + characterId + " at " + spawnPointName + " to train rb " + trainRb.name + ".");
    }

    private ignoreCharacterTrainCollisions(
        character: any,
        trainRb: CS.Px5.Unity.PxRigidBody,
        characterId: string,
        spawnPointName: string
    ): void {
        if (character == null || character.gameObject == null || trainRb == null || trainRb.gameObject == null) {
            return;
        }

        const characterColliders = character.gameObject.GetComponentsInChildren(PxColliderType, true);
        const trainColliders = trainRb.gameObject.GetComponentsInChildren(PxColliderType, true);
        let ignoredCount = 0;

        for (let i = 0; characterColliders != null && i < characterColliders.Length; i++) {
            const characterCollider = characterColliders.get_Item(i) as CS.Px5.Unity.PxCollider;
            if (!characterCollider) {
                continue;
            }

            for (let j = 0; trainColliders != null && j < trainColliders.Length; j++) {
                const trainCollider = trainColliders.get_Item(j) as CS.Px5.Unity.PxCollider;
                if (!trainCollider) {
                    continue;
                }

                PxPhysics.IgnoreCollision(characterCollider, trainCollider, true);
                this.ignoredCollisionPairs.push({ characterCollider, trainCollider });
                ignoredCount++;
            }
        }

        CS.UnityEngine.Debug.Log(
            "[Train] Ignored " + ignoredCount + " character/train collider pairs for " + characterId + " at " + spawnPointName + "."
        );
    }

    private restoreIgnoredCollisions(): void {
        for (let i = 0; i < this.ignoredCollisionPairs.length; i++) {
            const pair = this.ignoredCollisionPairs[i];
            if (pair.characterCollider && pair.trainCollider) {
                PxPhysics.IgnoreCollision(pair.characterCollider, pair.trainCollider, false);
            }
        }

        this.ignoredCollisionPairs = [];
    }

    private getCharacterBodyRigidbody(character: any): CS.Px5.Unity.PxRigidBody | null {
        if (character.BodyRigidbody != null) {
            return character.BodyRigidbody as CS.Px5.Unity.PxRigidBody;
        }

        if (character.muscleHip != null && character.muscleHip.rb != null) {
            return character.muscleHip.rb as CS.Px5.Unity.PxRigidBody;
        }

        if (character.characterController != null && character.characterController.locoBall != null) {
            return character.characterController.locoBall as CS.Px5.Unity.PxRigidBody;
        }

        return null;
    }

    private getCharacterHipPosition(character: any, fallbackBody: CS.Px5.Unity.PxRigidBody): CS.UnityEngine.Vector3 {
        if (character.HipPosition != null) {
            return character.HipPosition as CS.UnityEngine.Vector3;
        }

        if (character.muscleHip != null && character.muscleHip.rb != null) {
            return character.muscleHip.rb.transform.position;
        }

        return fallbackBody.transform.position;
    }

    private findTrainRigidbody(): CS.Px5.Unity.PxRigidBody | null {
        const fromSelfOrParent = this.bindTo.GetComponentInParent(PxRigidBodyType) as CS.Px5.Unity.PxRigidBody | null;
        if (fromSelfOrParent) {
            CS.UnityEngine.Debug.Log("[Train] Train PxRigidBody resolved from parent/self: " + fromSelfOrParent.name + ".");
            return fromSelfOrParent;
        }

        const fromChildren = this.bindTo.GetComponentInChildren(PxRigidBodyType, true) as CS.Px5.Unity.PxRigidBody | null;
        if (fromChildren) {
            CS.UnityEngine.Debug.Log("[Train] Train PxRigidBody resolved from children: " + fromChildren.name + ".");
            return fromChildren;
        }

        CS.UnityEngine.Debug.LogWarning("[Train] Train PxRigidBody not found on " + this.bindTo.gameObject.name + ".");
        return null;
    }

    private findTransformRecursive(parent: CS.UnityEngine.Transform, name: string): CS.UnityEngine.Transform | null {
        for (let i = 0; i < parent.childCount; i++) {
            const child = parent.GetChild(i);
            if (child.name === name) {
                CS.UnityEngine.Debug.Log("[Train] Found SpawnPoints by hierarchy fallback.");
                return child;
            }

            const found = this.findTransformRecursive(child, name);
            if (found) {
                return found;
            }
        }
        return null;
    }
                                                                     
    // --- physics-driven version (disabled for now) ---
    // private rigidBody: CS.Px5.Unity.PxRigidBody | null = null;
    // private forceMagnitude: number = 500;
    // private onStartPhysics(): void {
    //     const rbType = puer.$typeof(CS.Px5.Unity.PxRigidBody);
    //     this.rigidBody = this.bindTo.GetComponent(rbType) as CS.Px5.Unity.PxRigidBody
    //         || this.bindTo.GetComponentInChildren(rbType) as CS.Px5.Unity.PxRigidBody
    //         || this.bindTo.GetComponentInParent(rbType) as CS.Px5.Unity.PxRigidBody;
    // }
    // private onFixedUpdatePhysics(_dt: number): void {
    //     if (!this.rigidBody || !this.rigidBody.valid) return;
    //     const force = new CS.UnityEngine.Vector3(this.forceMagnitude, 0, 0);
    //     this.rigidBody.AddForce(force, CS.UnityEngine.ForceMode.Force);
    // }
}
