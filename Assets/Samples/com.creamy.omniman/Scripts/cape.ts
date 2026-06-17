/**
 * Cape weapon implementation using JsComponentProxy.
 * Debug stub: logs on fire.
 */
const ModAPI = VX.Mod.ModAPI;

export class Cape {
    private bindTo: VX.Mod.JsComponentProxy;
    private weapon: VX.Entity.EntityHoldWeapon;
    private readonly fireHandler: () => void;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Cape constructor");
        this.bindTo = bindTo;
        this.weapon = bindTo.GetComponent(puerts.$typeof(VX.Entity.EntityHoldWeapon)) as VX.Entity.EntityHoldWeapon;
        this.fireHandler = () => this.fireOnce();

        ModAPI.AddWeaponFiredListener(this.weapon, this.fireHandler);
        this.bindTo.onDestroy = () => this.onDestroy();

        CS.UnityEngine.Debug.Log("Cape initialized");
    }

    private onDestroy(): void {
        if (this.weapon) {
            ModAPI.RemoveWeaponFiredListener(this.weapon, this.fireHandler);
        }
    }

    private fireOnce(): void {
        CS.UnityEngine.Debug.Log("Cape fire pressed");
    }
}
 