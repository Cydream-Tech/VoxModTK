/**
 * Katana weapon implementation using JsFirableWeaponProxy.
 * Implements slice/cut mechanics with tip tracking and line renderer visualization.
 * All weapon logic is implemented in TypeScript.
 */

const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);
const ModAPI = VX.Mod.ModAPI;

type HitPair = {
    chunk: VX.Engine.VoxelChunk;
    screenA: CS.UnityEngine.Vector2;
    screenB: CS.UnityEngine.Vector2;
};

export class Katana {
    private bindTo: VX.Mod.JsComponentProxy;
    private weapon: VX.Entity.EntityFirableWeapon;
    private readonly triggerPressedHandler: () => void;
    private readonly triggerReleasedHandler: () => void;
    private lineRenderer: CS.UnityEngine.LineRenderer;
    private tip: CS.UnityEngine.Transform;
    private tipPoints: CS.UnityEngine.Vector3[];
    private hitPairs: Map<string, HitPair>;
    private capturing: boolean = false;
    private lineDirty: boolean = false;
    private sliceCount: number = 0;
    private swingSoundEvent: CS.Sonity.SoundEvent | null = null;
    private destroySoundEvent: CS.Sonity.SoundEvent | null = null;

    private minPointDistanceSq: number = 0.09; // 0.3^2
    private sliceThickness: number = 0.25;
    private sweepDistance: number = 500;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.weapon = bindTo.GetComponent(puerts.$typeof(VX.Entity.EntityFirableWeapon)) as VX.Entity.EntityFirableWeapon;
        this.triggerPressedHandler = () => this.onTriggerPressed();
        this.triggerReleasedHandler = () => this.onTriggerReleased();
        this.lineRenderer = bindTo.GetComponentInChildren(puerts.$typeof(CS.UnityEngine.LineRenderer), true) as CS.UnityEngine.LineRenderer;
        this.tipPoints = [];
        const tipTransform = bindTo.transform.Find("Tip");
        this.tip = tipTransform ? tipTransform : bindTo.transform;
        this.hitPairs = new Map();
        this.readProperties();

        ModAPI.AddWeaponTriggerPressedListener(this.weapon, this.triggerPressedHandler);
        ModAPI.AddWeaponTriggerReleasedListener(this.weapon, this.triggerReleasedHandler);
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onDestroy(): void {
        if (this.weapon) {
            ModAPI.RemoveWeaponTriggerPressedListener(this.weapon, this.triggerPressedHandler);
            ModAPI.RemoveWeaponTriggerReleasedListener(this.weapon, this.triggerReleasedHandler);
        }
    }

    onTriggerPressed(): void {
        this.activate();
    }

    onTriggerReleased(): void {
        this.deactivate();
    }

    private activate(): void {
        this.capturing = true;
        this.tipPoints.length = 0;
        this.lineDirty = true;

        if (this.lineRenderer) {
            this.lineRenderer.enabled = true;
            this.lineRenderer.positionCount = 0;
        }
        this.playSwingSound(this.tip.position);
    }

    private deactivate(): void {
        this.capturing = false;
        this.hideLine();

        if (this.tipPoints.length >= 2) {
            this.performCuts(this.tipPoints);
        }
        this.tipPoints.length = 0;
        this.lineDirty = true;
    }

    private onUpdate(deltaTime: number): void {
        if (!this.capturing || !this.tip) return;

        const pts = this.tipPoints;
        const p = this.tip.position;
        const len = pts.length;

        if (len === 0) {
            pts.push(p);
            this.lineDirty = true;
        } else {
            const last = pts[len - 1];
            const dx = p.x - last.x;
            const dy = p.y - last.y;
            const dz = p.z - last.z;
            if (dx * dx + dy * dy + dz * dz >= this.minPointDistanceSq) {
                pts.push(p);
                this.lineDirty = true;
            }
        }

        this.updateLineRenderer();
    }

    private updateLineRenderer(): void {
        const lr = this.lineRenderer;
        if (!lr || !this.lineDirty) return;

        lr.enabled = true;
        const count = this.tipPoints.length;
        lr.positionCount = count;
        for (let i = 0; i < count; i++) {
            lr.SetPosition(i, this.tipPoints[i]);
        }
        this.lineDirty = false;
    }

    private hideLine(): void {
        if (this.lineRenderer) {
            this.lineRenderer.enabled = false;
        }
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        const pairs = props.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            const value = pair.value as any;

            if (pair.key === "swingSoundEvent" && value != null) {
                this.swingSoundEvent = value as CS.Sonity.SoundEvent;
                continue;
            }

            if (pair.key === "destroySoundEvent" && value != null) {
                this.destroySoundEvent = value as CS.Sonity.SoundEvent;
            }
        }
    }

    // === Sound API - implemented in TypeScript ===

    private playSwingSound(position: CS.UnityEngine.Vector3): void {
        const soundEvent = this.swingSoundEvent;
        if (soundEvent == null || this.tip == null) {
            return;
        }

        ModAPI.PlaySoundAtPosition(
            soundEvent,
            this.tip,
            position
        );
    }

    private playDestroySound(position: CS.UnityEngine.Vector3): void {
        const soundEvent = this.destroySoundEvent;
        if (soundEvent == null || this.tip == null) {
            return;
        }

        ModAPI.PlaySoundAtPosition(
            soundEvent,
            this.tip,
            position
        );
    }

    // === Camera API ===

    private getCutCamera(): CS.UnityEngine.Camera {
        return CS.UnityEngine.Camera.main;
    }

    // === Physics API ===

    private overlapBox(center: CS.UnityEngine.Vector3, halfExtents: CS.UnityEngine.Vector3, rotation: CS.UnityEngine.Quaternion): number {
        return CS.Px5.Unity.PxPhysics.OverlapBoxNonAlloc(
            center,
            halfExtents,
            VX.Engine.Utils.CollidersPool,
            rotation,
            VX.Engine.LayerMasksHelper.bulletHitLayerMask.value,
            CS.UnityEngine.QueryTriggerInteraction.Ignore
        );
    }

    private getOverlapCollider(index: number): CS.Px5.Unity.PxCollider {
        return VX.Engine.Utils.CollidersPool.get_Item(index);
    }

    private getVoxelChunk(collider: CS.Px5.Unity.PxCollider): VX.Engine.VoxelChunk {
        return collider.GetComponent(puerts.$typeof(VX.Engine.VoxelChunk)) as VX.Engine.VoxelChunk;
    }

    private getVoxelDestructor(chunk: VX.Engine.VoxelChunk): VX.Destruction.VoxelDestructor {
        if (!chunk) return null as unknown as VX.Destruction.VoxelDestructor;
        return chunk.GetComponentInParent(puerts.$typeof(VX.Destruction.VoxelDestructor)) as VX.Destruction.VoxelDestructor;
    }

    private screenSpaceLineClear(
        destructor: VX.Destruction.VoxelDestructor,
        screenA: CS.UnityEngine.Vector2,
        screenB: CS.UnityEngine.Vector2,
        worldToScreen: CS.UnityEngine.Matrix4x4,
        chunk: VX.Engine.VoxelChunk
    ): void {
        if (destructor && ModAPI.IsVoxelDestructible(destructor)) {
            ModAPI.ClearVoxelScreenLine(destructor, screenA, screenB, worldToScreen, chunk);
        }
    }

    // === Cut Logic ===

    private performCuts(pts: CS.UnityEngine.Vector3[]): void {
        const camera = this.getCutCamera();
        if (!camera || pts.length < 2) return;

        this.hitPairs.clear();
        const count = pts.length;

        for (let i = 0; i < count - 1; i++) {
            this.cutSegment(pts[i], pts[i + 1], camera);
        }

        // Build world-to-screen matrix
        const sw = camera.pixelWidth as number;
        const sh = camera.pixelHeight as number;
        const vp = CS.UnityEngine.Matrix4x4.identity;
        vp.m00 = sw * 0.5; vp.m03 = sw * 0.5;
        vp.m11 = sh * 0.5; vp.m13 = sh * 0.5;
        vp.m22 = 1; vp.m33 = 1;

        const worldToScreen = CS.UnityEngine.Matrix4x4.op_Multiply(
            CS.UnityEngine.Matrix4x4.op_Multiply(vp, camera.projectionMatrix),
            camera.worldToCameraMatrix
        );

        this.hitPairs.forEach((pair) => {
            const destructor = this.getVoxelDestructor(pair.chunk);
            this.screenSpaceLineClear(destructor, pair.screenA, pair.screenB, worldToScreen, pair.chunk);
        });

        if (this.hitPairs.size > 0) {
            this.playDestroySound(this.tip.position);
        }

        this.sliceCount++;
    }

    private cutSegment(a: CS.UnityEngine.Vector3, b: CS.UnityEngine.Vector3, camera: CS.UnityEngine.Camera): void {
        const screenA = camera.WorldToScreenPoint(a);
        const screenB = camera.WorldToScreenPoint(b);
        const nearClip = camera.nearClipPlane;
        const v3 = CS.UnityEngine.Vector3;

        const worldNearA = camera.ScreenToWorldPoint(new v3(screenA.x, screenA.y, nearClip));
        const worldNearB = camera.ScreenToWorldPoint(new v3(screenB.x, screenB.y, nearClip));

        const diffNear = v3.op_Subtraction(worldNearB, worldNearA);
        if (diffNear.sqrMagnitude < 0.00000001) return;

        const worldNearMid = v3.op_Multiply(v3.op_Addition(worldNearA, worldNearB), 0.5);
        const worldRight = diffNear.normalized;
        const forward = v3.op_Subtraction(camera.transform.position, worldNearMid).normalized;
        const worldUp = v3.Cross(forward, worldRight).normalized;

        const rot = CS.UnityEngine.Quaternion.LookRotation(forward, worldUp);

        const samples = 10;
        const zStart = nearClip;
        const zStep = this.sweepDistance / (samples - 1);

        for (let si = 1; si < samples; si++) {
            const worldZStart = zStart + zStep * (si - 1);
            const worldZEnd = zStart + zStep * si;

            const worldStartA = camera.ScreenToWorldPoint(new v3(screenA.x, screenA.y, worldZStart));
            const worldStartB = camera.ScreenToWorldPoint(new v3(screenB.x, screenB.y, worldZStart));
            const worldEndA = camera.ScreenToWorldPoint(new v3(screenA.x, screenA.y, worldZEnd));
            const worldEndB = camera.ScreenToWorldPoint(new v3(screenB.x, screenB.y, worldZEnd));

            const worldStartMiddle = v3.op_Multiply(v3.op_Addition(worldStartA, worldStartB), 0.5);
            const worldEndMiddle = v3.op_Multiply(v3.op_Addition(worldEndA, worldEndB), 0.5);

            const worldMiddle = v3.op_Multiply(v3.op_Addition(worldStartMiddle, worldEndMiddle), 0.5);
            const worldWidth = v3.op_Subtraction(worldEndA, worldEndB).magnitude;
            const worldLength = v3.op_Subtraction(worldStartMiddle, worldEndMiddle).magnitude;

            const halfExtents = new v3(worldWidth * 0.5, this.sliceThickness, worldLength * 0.5);

            const overlapCount = this.overlapBox(worldMiddle, halfExtents, rot);

            for (let j = 0; j < overlapCount; j++) {
                const col = this.getOverlapCollider(j);
                if (!ModAPI.IsVoxelCollider(col)) continue;

                const chunk = this.getVoxelChunk(col);
                if (chunk) {
                    const key = this.getChunkLineKey(chunk, screenA, screenB);
                    if (!this.hitPairs.has(key)) {
                        this.hitPairs.set(key, {
                            chunk,
                            screenA: new CS.UnityEngine.Vector2(screenA.x, screenA.y),
                            screenB: new CS.UnityEngine.Vector2(screenB.x, screenB.y)
                        });
                    }
                }
            }
        }
    }

    private getChunkLineKey(chunk: VX.Engine.VoxelChunk, screenA: CS.UnityEngine.Vector3, screenB: CS.UnityEngine.Vector3): string {
        const id = (chunk as any).GetInstanceID() ?? 0;
        return id + '_' + (screenA.x * 100 | 0) + '_' + (screenA.y * 100 | 0) + '_' + (screenB.x * 100 | 0) + '_' + (screenB.y * 100 | 0);
    }
}
