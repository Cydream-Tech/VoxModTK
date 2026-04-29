/**
 * Wand weapon implementation using JsComponentProxy.
 * Fires asteroids from above the player's view direction.
 */
const ModAPI = VX.Mod.ModAPI;

export class Wand {
    private bindTo: VX.Mod.JsComponentProxy;
    private weapon: VX.Entity.EntityHoldWeapon;
    private mainCamTransform: CS.UnityEngine.Transform;
    private readonly fireHandler: () => void;

    // Configurable spawn settings
    private asteroidPrefab : CS.UnityEngine.GameObject | null;
    private spawnDistance: number = 50.0;
    private spawnHeight: number = 100.0;
    private spawnVelocity: number = 100.0;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("Wand constructor");
        this.bindTo = bindTo;
        this.weapon = bindTo.GetComponent(puerts.$typeof(VX.Entity.EntityHoldWeapon)) as VX.Entity.EntityHoldWeapon;
        this.fireHandler = () => this.fireOnce();

        let propsComponent = bindTo.GetComponent(puerts.$typeof(VX.Mod.JsProperties)) as VX.Mod.JsProperties;
        this.asteroidPrefab = null;
        for (let i = 0; i < propsComponent.Pairs.Length; i++) {
            const p = propsComponent.Pairs.get_Item(i);
            if(p.key == "asteroid"){
                this.asteroidPrefab = (p.value as CS.UnityEngine.Transform).gameObject;
            }
        }

        // Bind weapon events
        ModAPI.AddWeaponFiredListener(this.weapon, this.fireHandler);

        this.findTransform("asteroid");

        const mainCam = CS.UnityEngine.Camera.main;
        this.mainCamTransform = mainCam.transform;
        this.bindTo.onDestroy = () => this.onDestroy();

        CS.UnityEngine.Debug.Log("Wand initialized");
    }

    private onDestroy(): void {
        if (this.weapon) {
            ModAPI.RemoveWeaponFiredListener(this.weapon, this.fireHandler);
        }
    }

    private fireOnce(): void {
        if (this.mainCamTransform == null) return;

        // Instantiate asteroid prefab
        if (this.asteroidPrefab == null) {
            CS.UnityEngine.Debug.Log("Wand: failed to find asteroid prefab");
            return;
        }
        const asteroid = CS.UnityEngine.GameObject.Instantiate(this.asteroidPrefab.gameObject) as CS.UnityEngine.GameObject;
        if (asteroid == null) {
            CS.UnityEngine.Debug.Log("Wand: failed to instantiate asteroid prefab");
            return;
        }

        // Position asteroid in front of camera at height
        const forward = this.mainCamTransform.forward;
        const right = this.mainCamTransform.right;
        const spawnPos = CS.UnityEngine.Vector3.op_Addition(
            CS.UnityEngine.Vector3.op_Addition(
                this.bindTo.transform.position,
                CS.UnityEngine.Vector3.op_Multiply(forward, this.spawnDistance)
            ),
            CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, this.spawnHeight)
        );
        asteroid.transform.position = spawnPos;
        asteroid.transform.SetParent(null as never as CS.UnityEngine.Transform);
        asteroid.SetActive(true);

        // Set velocity toward target
        const rigidbody = asteroid.GetComponent(puerts.$typeof(CS.Px5.Unity.PxRigidBody)) as CS.Px5.Unity.PxRigidBody;
        if (rigidbody) {
            const direction = CS.UnityEngine.Vector3.op_Addition(
                CS.UnityEngine.Vector3.op_Subtraction(
                    CS.UnityEngine.Vector3.op_Multiply(forward, this.spawnVelocity * 0.1),
                    CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.op_Multiply(right, -1), this.spawnVelocity * 0.1)
                ),
                CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.down, this.spawnVelocity)
            );
            rigidbody.velocity = direction;
        }

        CS.UnityEngine.Object.Destroy(asteroid, 10.0);
    }

    private findTransform(name: string): CS.UnityEngine.Transform | null {
        // First try direct child
        let t = this.bindTo.transform.Find(name);
        if (t) return t;

        // Try recursive find
        return this.findTransformRecursive(this.bindTo.transform, name);
    }

    private findTransformRecursive(parent: CS.UnityEngine.Transform, name: string): CS.UnityEngine.Transform | null {
        for (let i = 0; i < parent.childCount; i++) {
            const child = parent.GetChild(i);
            if (child.name === name) {
                return child;
            }
            const found = this.findTransformRecursive(child, name);
            if (found) return found;
        }
        return null;
    }
}
