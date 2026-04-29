/**
 * Homelander control component using JsComponentProxy.
 * Monitors voxel damage and triggers explosion when damage exceeds threshold.
 */
export class Homelander {
    private bindTo: VX.Mod.JsComponentProxy;
    private voxelData: VX.Engine.VoxelVolume | null = null;
    private initialSolidCount: number = 0;
    private readonly modAPI = VX.Mod.ModAPI;
    private voxelModifiedHandler: (() => void) | null = null;

    private explodeRatio: number = 0.95;
    private explodeSFX: string = "Explosion";
    private explodeVFX: string = "NuclearBomb_Explode";
    private debugCurrDamageRatio: number = 0;
    private explodeRemaining: number = 10;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Homelander constructor");
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        this.voxelData = this.bindTo.GetComponent(puerts.$typeof(VX.Engine.VoxelVolume)) as VX.Engine.VoxelVolume;
        
        CS.UnityEngine.Debug.Log("Homelander::Start() n solidBlockCount: " + (this.voxelData ? this.modAPI.GetVoxelSolidCount(this.voxelData) : "null"));

        if (this.initialSolidCount === 0 && this.voxelData) {
            this.initialSolidCount = this.modAPI.GetVoxelOriginalSolidCount(this.voxelData);
            if (this.initialSolidCount <= 0) {
                this.initialSolidCount = this.modAPI.GetVoxelSolidCount(this.voxelData);
            }
        }

        if (this.initialSolidCount > 0 && this.voxelData) {
            CS.UnityEngine.Debug.Log("Homelander Init OnVoxelsModified: solidBlockCount: " + this.initialSolidCount);

            this.voxelModifiedHandler = () => {
                if (!this.voxelData || this.initialSolidCount <= 0) {
                    return;
                }

                const perc = this.modAPI.GetVoxelSolidCount(this.voxelData) / this.initialSolidCount;
                this.debugCurrDamageRatio = perc;

                if (perc < this.explodeRatio) {
                    this.explode();
                }
            };

            this.modAPI.AddVoxelModifiedListener(this.voxelData, this.voxelModifiedHandler);
        }
    }

    private onDestroy(): void {
        if (this.voxelData && this.voxelModifiedHandler) {
            this.modAPI.RemoveVoxelModifiedListener(this.voxelData, this.voxelModifiedHandler);
        }
        this.voxelModifiedHandler = null;
    }

    private explode(): void {
        if (this.explodeRemaining <= 0)
            return;
        this.explodeRemaining--;

        if (this.explodeSFX !== "")
            this.modAPI.PlaySoundAt(this.explodeSFX, this.bindTo.transform.position);

        this.modAPI.PlayVFX(this.explodeVFX, this.bindTo.transform.position, 2.0);

        const parent = this.bindTo.transform.parent;
        if (parent) {
            // Make all rigidbodies dynamic
            const rbs = parent.GetComponentsInChildren(puerts.$typeof(CS.Px5.Unity.PxRigidBody), true);
            for (let i = 0; i < rbs.Length; i++) {
                (rbs.get_Item(i) as CS.Px5.Unity.PxRigidBody).isKinematic = false;
            }

            // Disable unyielding on all VoxelDestructors
            const vds = parent.GetComponentsInChildren(puerts.$typeof(VX.Destruction.VoxelDestructor), true);
            for (let i = 0; i < vds.Length; i++) {
                this.modAPI.SetVoxelUnyielding(vds.get_Item(i) as VX.Destruction.VoxelDestructor, false);
            }
        }

        // Find and destroy all laser aimer guns
        // TODO: FindObjectsByType for LaserAimerMod not available in JS typing
        // The laser gun cleanup may need to be handled from C# side or via entity events
        CS.UnityEngine.Debug.Log("Homelander exploded!");
    }
}
