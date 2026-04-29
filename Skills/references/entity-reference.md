# Entity Reference

Entity component hierarchy, component-specific fields, and weapon configuration patterns.

**Important**: In TypeScript modding you cannot derive from C# entity classes. Instead, you select the appropriate C# entity component in the Unity inspector on your prefab, then hook into its events from TypeScript via `JsComponentProxy`. See the katana and asteroid samples for working examples of this pattern.

## 1. Entity Component Hierarchy

```
Entity
  EntityItem (cached rigidbody, grab/ungrab callbacks)
    EntityAttachmentItem (equippable/attachable — used for most weapons and tools)
      EntityDestructibleItem (destructible carried/scene items)
      EntityBuildingElement (construction parts with attachment/snapping logic)
      EntityFirableWeapon (trigger/ability input, ammo, firePoint, reload helpers)
        EntityHoldWeapon (continuous fire while trigger held)
          EntityGunItem (projectile spawning, spread, recoil, muzzle FX, casing)
        EntityToggleWeapon (press-to-toggle active state)
    EntityCharacter (health, state machine, ragdoll — configure via CharacterPresetProxy instead)
```

Notes:
- Not every weapon prefab should use `EntityGunItem`. Specialized weapons (gravity, linker, saber) may use `EntityFirableWeapon` as their C# component instead.
- `EntityItem` lives under the `Weapons` folder in code, even though it is used as a broader pickup-item base.
- To extend entity behavior in TypeScript, add a `JsComponentProxy` to the same prefab and hook the entity's events/actions from your TS script.

## 2. Melee Weapons

For simple melee objects (bat, hammer):

- **Entity component**: `EntityAttachmentItem`
- **Prefab setup**: See [prefab-conventions.md](prefab-conventions.md) for `GripPoint` transform placement.

## 3. Bladed Weapons

For sharp weapons (swords, knives):

- **Entity component**: `EntityAttachmentItem` + `BladeTrigger` component
- `BladeTrigger` handles slicing, stabbing, and voxel destruction

BladeTrigger fields:

| Field | Description |
| :--- | :--- |
| `Sharpness` | Penetration depth |
| `CutHardnessCap` | Max hardness the blade can cut (e.g. `PointDataV2.HardnessCap_Sword`) |
| `DamageVoxel` | If true, destroys voxels on hit |
| `EnableSliceOut` | Allows blade to slide out of target |

## 4. Ranged Weapons

- **Standard projectile gun**: `EntityGunItem` component
- **Weapon with trigger semantics but not a normal gun**: `EntityFirableWeapon` component

`EntityFirableWeapon` requires a `FirePoint` child transform. See [prefab-conventions.md](prefab-conventions.md) for transform placement and orientation rules.

### EntityFirableWeapon Common Fields

| Field | Description |
| :--- | :--- |
| `MagAmmo` | Total ammo capacity |
| `ReloadTime` | Time to reload in seconds |
| `WindUpTime` | Delay before first shot (e.g. minigun spin-up) |
| `AttackRange` | Max range for AI usage |

### EntityGunItem Fields

| Field | Description |
| :--- | :--- |
| `BulletInitSpeed` | Projectile speed |
| `ShotBias` | Spread/inaccuracy angle |
| `NumBulletsPerFire` | Pellets per shot (shotgun) |
| `MuzzleFlash` | Prefab spawned at `FirePoint` |
| `ShellCasing` | Prefab ejected on fire |

## 5. Weapon Patterns

| Pattern | Class | Behavior |
| :--- | :--- | :--- |
| Hold | `EntityHoldWeapon` | Fires/updates continuously while trigger held |
| Toggle | `EntityToggleWeapon` | Trigger press toggles active state on/off |
| Standard gun | `EntityGunItem` | Per-shot projectile + FX + casing |

`Activate()` / `Deactivate()` is the runtime state switch. Trigger callbacks decide when to enter or leave that state.

## 6. Ammo & Reloading

- `CheckAmmoOtherwiseDestroy()` — Consumes ammo. For players, running out usually discards the weapon.
- `UpdateReload(float deltaTime)` — Use this if the weapon owns its own reload timing instead of relying on a base implementation.

## 7. Custom Axis Input (Advanced)

For custom axis control (movement, distance, rotation), use `ModAPI.Input`.

Pattern:
1. Create a `VX.Mod.ModAPI.Input` instance
2. Call `input.GetMoveInput()` for directional input (returns `Vector2`)
3. Call `input.GetVehicleSecondaryControl()` for additional axes if needed
4. Call `input.Dispose()` in your `onDestroy` callback

See `com.cydream.gipsy/Scripts/mech-controller.ts` for a full working example.

This is the advanced path. Prefer standard weapon hooks when possible.

## 8. Characters

Characters use `EntityCharacter` but are configured through `CharacterPresetProxy`. See gameplay-engine-overview for the conceptual model and prefab-conventions for the prefab structure.
