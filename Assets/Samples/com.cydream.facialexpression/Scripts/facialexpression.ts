const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const ModAPI = VX.Mod.ModAPI;

enum FacialState {
    Dead = 0,
    KnockOut = 1,
    HitStun = 2,
    Move = 3,
    Attack = 4,
    ClearObstacle = 5,
    Escape = 6,
    Search = 7,
}

interface FacialSettings {
    atlas: CS.UnityEngine.Texture2D | null;
    animFPS: number;
}

interface TrackedCharacter {
    id: number;
    character: VX.Entity.EntityCharacter;
    voxelVolume: VX.Engine.VoxelVolume;
    faceMaterial: CS.UnityEngine.Material;
    meshScaleOffset: CS.UnityEngine.Vector4;
    stateHandler: ((state: VX.Utility.State) => void) | null;
    aiHandler: ((action: VX.AI.AIAction) => void) | null;
    currentStateName: string | null;
    currentAIActionName: string | null;
    currentStateId: number;
}

/**
 * Global facial expression hook.
 * It listens for spawned characters, subscribes to their state changes,
 * and drives per-character voxel face materials.
 */
export class FacialExpression {
    private static instance: FacialExpression | null = null;
    private static readonly StateIdProp = "_StateId";
    private static readonly VariationIdProp = "_VariationId";
    private static readonly AnimFPSProp = "_AnimFPS";
    private static readonly AnimPhaseProp = "_AnimPhase";
    private static readonly MeshUVScaleOffsetProp = "_MeshUVScaleOffset";
    private static readonly FaceAtlasProp = "_FaceAtlas";

    private readonly bindTo: VX.Mod.JsComponentProxy;
    private readonly trackedCharacters = new Map<number, TrackedCharacter>();

    private settings: FacialSettings = {
        atlas: null,
        animFPS: 2
    };

    private zombieNameToUV = new Map<string, CS.UnityEngine.Vector4>([
        ["Zombie-Normal ", new CS.UnityEngine.Vector4(0.98, 0.74, 0.0, 0.12)],
        ["Zombie-Normal2", new CS.UnityEngine.Vector4(0.98, 0.7, 0.0, 0.17)],
        ["Zombie-Normal3", new CS.UnityEngine.Vector4(0.98, 0.78, 0.02, 0.11)],
        ["Zombie-Normal4", new CS.UnityEngine.Vector4(0.88, 0.64, 0.11, 0.16)],
        ["Zombie-Normal5", new CS.UnityEngine.Vector4(0.88, 0.57, 0.11, 0.23)],
        ["Zombie-Normal6", new CS.UnityEngine.Vector4(0.82, 0.74, 0.14, 0.12)],
    ]);



    private characterSpawnedHandler: ((character: VX.Entity.EntityCharacter) => void) | null = null;
    private warnedMissingAtlas = false;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;

        if (FacialExpression.instance !== null) {
            return;
        }

        FacialExpression.instance = this;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        this.readSettings();
        this.subscribeCharacterSpawned();
        this.bindExistingCharacters();
    }

    private onDestroy(): void {
        if (FacialExpression.instance !== this) {
            return;
        }

        this.unsubscribeCharacterSpawned();
        this.disposeTrackedCharacters();
        FacialExpression.instance = null;
    }

    private readSettings(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        const pairs = props.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            const key = pair.key;
            const value = pair.value as any;

            if (key === "faceAtlas" && value != null) {
                this.settings.atlas = value as CS.UnityEngine.Texture2D;
                if(this.settings.atlas != null){
                    this.settings.atlas.filterMode = CS.UnityEngine.FilterMode.Point;
                }
                continue;
            }

            if (key === "animFPS" && typeof value === "number") {
                this.settings.animFPS = value;
                continue;
            }
        }
    }

    private subscribeCharacterSpawned(): void {
        this.characterSpawnedHandler = (character: VX.Entity.EntityCharacter) => {
            const meshScaleOffset = this.resolveMeshScaleOffset(character);
            if (meshScaleOffset == null) {
                return;
            }
            this.trackCharacter(character);
        };
        ModAPI.AddCharacterSpawnedListener(this.characterSpawnedHandler);
    }

    private unsubscribeCharacterSpawned(): void {
        if (this.characterSpawnedHandler == null) {
            return;
        }

        ModAPI.RemoveCharacterSpawnedListener(this.characterSpawnedHandler);
        this.characterSpawnedHandler = null;
    }

    private bindExistingCharacters(): void {
        const characters = ModAPI.GetAllCharacters();
        for (let i = 0; i < characters.Length; i++) {
            const character = characters.get_Item(i) as VX.Entity.EntityCharacter;
            const meshScaleOffset = this.resolveMeshScaleOffset(character);
            if (meshScaleOffset == null) {
                continue;
            }
            this.trackCharacter(character);
        }
    }

    private trackCharacter(character: VX.Entity.EntityCharacter | null): void {
        if (character == null) {
            return;
        }

        const id = character.GetInstanceID();
        if (this.trackedCharacters.has(id)) {
            return;
        }

        const voxelVolume = ModAPI.GetCharacterFaceRenderTarget(character);
        if (voxelVolume == null) {
            return;
        }

        const meshScaleOffset = this.resolveMeshScaleOffset(character);
        if (meshScaleOffset == null) {
            return;
        }

        const faceMaterial = this.createFaceMaterial(character, meshScaleOffset);
        if (faceMaterial == null) {
            return;
        }

        ModAPI.SetVoxelFaceProperties(voxelVolume, faceMaterial, true, 0, 1);

        const tracked: TrackedCharacter = {
            id,
            character,
            voxelVolume,
            faceMaterial,
            meshScaleOffset,
            stateHandler: null,
            aiHandler: null,
            currentStateName: null,
            currentAIActionName: null,
            currentStateId: -1,
        };

        this.subscribeCharacterState(tracked);
        this.subscribeCharacterAI(tracked);
        this.updateFaceState(tracked);
        this.trackedCharacters.set(id, tracked);
    }

    private subscribeCharacterState(tracked: TrackedCharacter): void {
        tracked.currentStateName = this.getTypeName(ModAPI.GetCharacterCurrentState(tracked.character));

        tracked.stateHandler = (newState: VX.Utility.State) => {
            tracked.currentStateName = this.getTypeName(newState);
            this.updateFaceState(tracked);
        };
        ModAPI.AddCharacterStateChangedListener(tracked.character, tracked.stateHandler);
    }

    private subscribeCharacterAI(tracked: TrackedCharacter): void {
        tracked.aiHandler = (newAction: VX.AI.AIAction) => {
            tracked.currentAIActionName = this.getTypeName(newAction);
            this.updateFaceState(tracked);
        };
        ModAPI.AddCharacterAIActionChangedListener(tracked.character, tracked.aiHandler);
    }

    private disposeTrackedCharacters(): void {
        for (const tracked of this.trackedCharacters.values()) {
            if (tracked.stateHandler != null) {
                ModAPI.RemoveCharacterStateChangedListener(tracked.character, tracked.stateHandler);
            }

            if (tracked.aiHandler != null) {
                ModAPI.RemoveCharacterAIActionChangedListener(tracked.character, tracked.aiHandler);
            }

            CS.UnityEngine.Object.Destroy(tracked.faceMaterial);
        }

        this.trackedCharacters.clear();
    }
    private resolveMeshScaleOffset(character: VX.Entity.EntityCharacter): CS.UnityEngine.Vector4 | null {
        for (const [zombieName, uv] of this.zombieNameToUV) {
            if (character.name.indexOf(zombieName) >= 0) {
                return uv;
            }
        }

        return null;
    }

    private createFaceMaterial(
        character: VX.Entity.EntityCharacter,
        meshScaleOffset: CS.UnityEngine.Vector4
    ): CS.UnityEngine.Material | null {
        const shader = CS.UnityEngine.Shader.Find("VoxelPlayground/VoxelFace");
        if (shader == null) {
            return null;
        }

        const material = new CS.UnityEngine.Material(shader);
        material.name = "FacialExpression_" + character.GetInstanceID();
        material.SetFloat(FacialExpression.AnimFPSProp, this.settings.animFPS);
        material.SetVector(FacialExpression.MeshUVScaleOffsetProp, meshScaleOffset);

        if (this.settings.atlas != null) {
            material.SetTexture(FacialExpression.FaceAtlasProp, this.settings.atlas);
        } else if (!this.warnedMissingAtlas) {
            this.warnedMissingAtlas = true;
        } else {
        }

        return material;
    }

    private updateFaceState(tracked: TrackedCharacter): void {
        const nextStateId = this.calculateStateId(tracked.currentStateName, tracked.currentAIActionName);
        if (nextStateId === tracked.currentStateId) {
            return;
        }

        tracked.currentStateId = nextStateId;
        tracked.faceMaterial.SetFloat(FacialExpression.AnimPhaseProp, Math.random());
        tracked.faceMaterial.SetFloat(FacialExpression.VariationIdProp, 0);
        tracked.faceMaterial.SetFloat(FacialExpression.StateIdProp, nextStateId);
    }

    private calculateStateId(stateName: string | null, aiActionName: string | null): number {
        if (stateName === "DeadState") {
            return FacialState.Dead;
        }

        if (stateName === "KnockOutState") {
            return FacialState.KnockOut;
        }

        if (stateName === "HitStunState") {
            return FacialState.HitStun;
        }

        if (stateName === "IdleState" || stateName === "WalkingState" || stateName == null) {
            return this.getStateIdFromAIAction(aiActionName);
        }

        return FacialState.Move;
    }

    private getStateIdFromAIAction(aiActionName: string | null): number {
        if (aiActionName == null) {
            return FacialState.Move;
        }

        if (
            aiActionName === "AttackAction" ||
            aiActionName === "AttackAction_Zombie" ||
            aiActionName === "ProjectileAttackAction_Zombie"
        ) {
            return FacialState.Attack;
        }

        if (
            aiActionName === "ClearObstacleAction_Zombie" ||
            aiActionName === "ReloadAction"
        ) {
            return FacialState.ClearObstacle;
        }

        if (
            aiActionName === "EscapeAction" ||
            aiActionName === "DashAttackAction_Zombie"
        ) {
            return FacialState.Escape;
        }

        if (aiActionName === "MoveToItemNDPickAction") {
            return FacialState.Search;
        }

        return FacialState.Move;
    }

    private getTypeName(value: any): string | null {
        if (value == null || typeof value.GetType !== "function") {
            return null;
        }

        const type = value.GetType();
        if (type == null) {
            return null;
        }

        return type.Name as string;
    }

    private getCharacterLabel(character: VX.Entity.EntityCharacter): string {
        return character.name + " (#" + character.GetInstanceID() + ")";
    }

    private vector4ToString(value: CS.UnityEngine.Vector4): string {
        return "(" + value.x + ", " + value.y + ", " + value.z + ", " + value.w + ")";
    }

    private tryParseVector4(raw: string): CS.UnityEngine.Vector4 | null {
        const pieces = raw.split(",").map((piece) => Number(piece.trim()));
        if (pieces.length !== 4 || pieces.some((piece) => Number.isNaN(piece))) {
            return null;
        }

        return new CS.UnityEngine.Vector4(pieces[0], pieces[1], pieces[2], pieces[3]);
    }

}
