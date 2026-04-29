# Scripting Best Practices

Use this reference only for TypeScript and Puerts authoring patterns. Do not use it for prefab hierarchy requirements, manifest/export rules, or runtime testing steps.

## 1. Standard JS class pattern

In the mod's `index.ts`, export the class. In the prefab, add `JsComponentProxy` and set the script name to the class name.

```ts
export class YourFancyClass {
    private bindTo: VX.Mod.JsComponentProxy;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
    }

    private onUpdate(deltaTime: number): void {
        // Update logic here.
    }

    // Other available callbacks:
    // onEnable, onDisable, onStart, onDestroy,
    // onCollisionEnter, onCollisionExit, onTriggerEnter, onTriggerExit
}
```

## 2. Lifecycle order

`init -> onEnable -> onStart -> onUpdate loop -> onDisable -> onDestroy`

## 3. Prefer `VX.Mod.ModAPI` As The Supported Surface

- For game-facing TypeScript mods, prefer `VX.Mod.ModAPI` first.
- Use built-in entity callbacks and `ModAPI` listeners instead of recreating input or weapon routing from scratch.
- Treat direct engine internals as a fallback only when the typings and samples already show that pattern.

## 4. JS class communication

- Use `JsComponentProxy.GetScript`, `GetScriptInParent`, or `GetScriptInChildren` to get another JS class instance, then call its methods.
- If you already have a direct reference through `JsProperties`, prefer `(proxyRef as JsComponentProxy).GetScript(ClassName)` over hierarchy search.
- Do these lookups in `onStart`, not `init`, because other JS objects may not be instantiated during initialization.
- Reference example: `Assets\Samples\com.cydream.gipsy\Scripts\mech-muscle.ts`.

## 5. Using `ref` values in TypeScript

Use `puerts.$ref` and `puerts.$unref` for APIs that expect C# `ref` parameters, such as raycasts.
Reference example: `Assets\Samples\com.cydream.gipsy\Scripts\mech-controller.ts`.

```ts
const worldCenter = this.bodyRb.worldCenterOfMass;
let hitRef = puerts.$ref(this.hoverHit);
const raySuccess = CS.Px5.Unity.PxPhysics.Raycast(
    worldCenter,
    CS.UnityEngine.Vector3.down,
    hitRef,
    90,
    this.groundLayer,
    CS.UnityEngine.QueryTriggerInteraction.Ignore
);
this.hoverHit = puerts.$unref(hitRef);
if (raySuccess) {
    const hit = this.hoverHit;
    const hitCollider = hit.collider;
}
```

## 6. Component references in a JS class

- Use `JsProperties` on `JsComponentProxy` as the standard way to pass prefab references and script references into TypeScript.
- Read `JsProperties.Pairs` manually with `.Length` and `get_Item(...)`, then cast each `value` to the expected Unity or proxy type.
- Use these references instead of searching the hierarchy when possible.
- Reference examples: `Assets\Samples\com.cydream.asteroid\Scripts\wand.ts`, `Assets\Samples\com.cydream.gipsy\Scripts\mech-muscle.ts`.

```ts
const propsComponent = this.bindTo.GetComponent(
    puerts.$typeof(VX.Mod.JsProperties)
) as VX.Mod.JsProperties;

this.mechController = (propsComponent.Get("mechController") as VX.Mod.JsComponentProxy)
    .GetScript(MechController.name);
```

## 7. Register And Remove Listeners Symmetrically

- If you add `ModAPI` listeners or other callbacks in the constructor or `onStart`, remove or dispose them in `onDestroy`.
- If you allocate `new VX.Mod.ModAPI.Input()`, call `Dispose()` in `onDestroy`.
- Prefer storing handler delegates on fields when the removal API requires the same function reference.

```ts
const ModAPI = VX.Mod.ModAPI;

export class CustomWeaponLogic {
    private bindTo: VX.Mod.JsComponentProxy;
    private weapon: VX.Entity.EntityFirableWeapon;
    private readonly triggerPressedHandler: () => void;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.weapon = bindTo.GetComponent(
            puerts.$typeof(VX.Entity.EntityFirableWeapon)
        ) as VX.Entity.EntityFirableWeapon;
        this.triggerPressedHandler = () => this.onTriggerPressed();
        ModAPI.AddWeaponTriggerPressedListener(this.weapon, this.triggerPressedHandler);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onTriggerPressed(): void {
    }

    private onDestroy(): void {
        ModAPI.RemoveWeaponTriggerPressedListener(this.weapon, this.triggerPressedHandler);
    }
}
```

## 8. Use `puerts.$typeof` for generic methods

- For generic Unity or C# methods such as `GetComponent<T>()`, `GetComponentInChildren<T>()`, or `GetComponentsInChildren<T>()`, pass the C# type through `puerts.$typeof(...)`.
- Use the returned type token directly in the call.
- This is the standard Puerts pattern for resolving generic C# APIs from TypeScript.

```ts
const rigidBody = transform.GetComponent(
    puerts.$typeof(CS.Px5.Unity.PxRigidBody)
) as CS.Px5.Unity.PxRigidBody;

const jointType = puerts.$typeof(CS.Px5.Unity.PxD6Joint);
const jointsList = this.bindTo.GetComponentsInChildren(jointType, true);
```

## 9. Convert Unity arrays explicitly

- Unity arrays and collection results do not automatically become TypeScript `[]`.
- Convert them explicitly with `.Length` and `get_Item(...)` before treating them as normal TS arrays.
- Reference example: `Assets\Samples\com.cydream.gipsy\Scripts\mech-controller.ts`.

```ts
const jointType = puerts.$typeof(CS.Px5.Unity.PxD6Joint);
const jointsList = this.bindTo.GetComponentsInChildren(jointType, true);
const joints: CS.Px5.Unity.PxD6Joint[] = [];

for (let i = 0; i < jointsList.Length; i++) {
    joints.push(jointsList.get_Item(i) as CS.Px5.Unity.PxD6Joint);
}
```

## 10. Use Unity operator methods for math types

- For Unity value types such as `Vector3` and `Matrix4x4`, prefer C# operator bindings like `op_Addition`, `op_Subtraction`, and `op_Multiply`.
- Do not assume normal JavaScript operators will behave correctly for Unity structs.
- Reference examples: `Assets\Samples\com.cydream.asteroid\Scripts\wand.ts`, `Assets\Samples\com.cydream.katana\Scripts\katana.ts`.

```ts
const spawnPos = CS.UnityEngine.Vector3.op_Addition(
    this.bindTo.transform.position,
    CS.UnityEngine.Vector3.op_Multiply(forward, this.spawnDistance)
);

const worldToScreen = CS.UnityEngine.Matrix4x4.op_Multiply(vpProj, view);
```

## 11. Use explicit null casts when C# signatures need them

- Some C# APIs accept `null`, but the generated TypeScript typings still require a concrete C# type.
- In those cases, cast `null` to the expected C# type explicitly.
- Reference example: `Assets\Samples\com.cydream.asteroid\Scripts\wand.ts`.

```ts
asteroid.transform.SetParent(null as never as CS.UnityEngine.Transform);
```
