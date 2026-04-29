/**
 * Ironman component implementation using JsComponentProxy.
 * This is a minimal example that demonstrates the basic pattern.
 */
export class Ironman {
    private bindTo: VX.Mod.JsComponentProxy;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Ironman constructor");
        this.bindTo = bindTo;

        // Bind update callback
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        CS.UnityEngine.Debug.Log("Ironman initialized");
    }

    private onUpdate(deltaTime: number): void {
        // Add your update logic here
    }
}
