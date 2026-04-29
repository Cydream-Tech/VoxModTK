/**
 * Asteroid entity implementation using JsComponentProxy.
 * Handles collision with building layers to trigger explosion, VFX, and sound.
 */
export class Asteroid {
    private bindTo: VX.Mod.JsComponentProxy;
    private readonly modAPI = VX.Mod.ModAPI;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Asteroid constructor");
        this.bindTo = bindTo;

        // Bind collision and lifecycle callbacks
        this.bindTo.onCollisionEnter = (collision) => this.onCollisionEnter(collision);
    }

    private onCollisionEnter(collision: CS.Px5.UnityExtensions.Collision): void {

        const rb = collision.rigidbody;
        if (rb == null) return;

        const layerMask = VX.Engine.LayerMasksHelper.layerMask_Building.value;
        if (layerMask != rb.gameObject.layer) {
            return;
        }

        this.modAPI.PlayVFX("NuclearBomb_Explode", this.bindTo.transform.position, 3.0);

        // Play explosion sound
        this.modAPI.PlaySoundAt(
            "Explosion_Nuke",
            this.bindTo.transform.position
        );

        CS.UnityEngine.Object.Destroy(this.bindTo.gameObject, 1.0);
    }
}
