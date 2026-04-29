const ModAPI = VX.Mod.ModAPI;
const VoxelDestructorType = puerts.$typeof(VX.Destruction.VoxelDestructor);
const PointProperty = VX.Engine.PointDataV2.Property;

/**
 * Sets touched voxel destructors on fire when this trigger enters them.
 */
export class FlameSword {
    private readonly bindTo: VX.Mod.JsComponentProxy;
    private readonly fireRadius: number = 0.4;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onTriggerEnter = (collider) => this.onTriggerEnter(collider);
    }

    private onTriggerEnter(collider: CS.Px5.Unity.PxCollider): void {
        if (!collider) {
            return;
        }

        const voxelDestructor = collider.GetComponentInParent(VoxelDestructorType) as VX.Destruction.VoxelDestructor | null;
        if (!voxelDestructor || !ModAPI.IsVoxelDestructible(voxelDestructor)) {
            return;
        }

        const hitPosition = collider.bounds.center;
        ModAPI.ModifyVoxelProperty(
            voxelDestructor,
            hitPosition,
            this.fireRadius,
            PointProperty.Temperature
        );
    }
}
