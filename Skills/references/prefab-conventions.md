# Prefab Conventions

These conventions are the stable prefab-side contracts visible in the toolkit samples and the upstream manual. Use this file for hierarchy, components, helper transforms, and script wiring requirements only. Do not use it for folder layout, export workflow, or runtime debugging steps.

## Shared Conventions

- Keep generated gameplay prefabs under the mod's `Prefab/` folder.
- Prefer matching names between the `.vox` source, prefab file, manifest entry, and script names.
- Most authored prefabs keep a `RootTransform` child as the stable visual/root offset anchor.
- For scripted content, the prefab contract is:
- Add `JsComponentProxy` to the object that owns the behavior.
- Export the class from `Scripts/index.ts`.
- Set the proxy class name to the exported class name.
- Use `JsProperties` for prefab-assigned references instead of hierarchy-wide search where possible.

## Scene Prefabs

Scene prefabs are assemblies, not single weapons or characters.

- Scene prefabs usually include spawn helpers or environmental markers such as `ArrowSpawnPoint`, lighting objects, terrain roots, and grouped set dressing.
- For how scene import naming prefixes (`A_`, `B_`, `C_`, `D_`) affect physics and destructibility, see [gameplay-engine-overview.md](gameplay-engine-overview.md).
- For scene atmosphere configuration such as fog, skybox, bloom, and time-of-day, see [gameplay-engine-overview.md](gameplay-engine-overview.md).

## Prop Prefabs

Prop is the practical bucket for normal items and weapons.

- Put the gameplay entity component on the root object.
- Add child transforms with stable names when the entity class expects them:
- `GripPoint`: hand attachment point
- `FirePoint`: muzzle or projectile spawn point
- `InfoPose`: optional UI or info anchor
- `Tip`: common for blades or trace-based weapons when the script needs one
- Keep the transform orientation intentional. `FirePoint` forward is the firing direction. `GripPoint` rotation controls how the item sits in hand.
- For sword-like props, `BladeTrigger` or `EntityFirableWeapon` is the common engine-side extension point.

Observed samples:
- `com.cydream.katana/Prefab/katana.prefab`
- `com.cydream.asteroid/Prefab/wand.prefab`

## Character Prefabs

Character prefabs are assembled around `CharacterPresetProxy`.

- Assign `EnemyInfo`, size preset, height scale, and AI behavior on the character preset.
- Map voxel parts into the humanoid slots expected by the preset:
- `Head`, `Chest`, `Pelvis`
- upper and lower arms, hands
- upper and lower legs, feet
- Align voxel limbs manually so the skeleton and animation rig line up correctly.
- Keep body-part naming predictable so later edits and scripts can find the intended parts.

Observed samples:
- `com.cydream.samplecharacters`
- `com.cydream.gipsy/Prefab/GipsyDanger.prefab`

## Avatar Prefabs

Avatar prefabs follow a humanoid segmented-body layout similar to characters, but the goal is player embodiment.

- Keep a clean body-part hierarchy with names that read like rig pieces: `head`, `chest`, `pelvis`, `hand_l`, `hand_r`, `foot_l`, `foot_r`, and limb segments.
- Keep a `RootTransform` child for consistent offsetting and retargeting.
- Avoid mixing scene-only helpers or weapon-only helpers into an avatar root unless the sample pattern clearly requires it.

Observed samples:
- `com.cydream.spiderman/Prefab/SpiderMan.prefab`
- `com.cydream.spiderman/Prefab/IronMan.prefab`

## Global Prefabs

Global prefabs are bootstrap containers for systems and hooks.

- Keep the root simple. The important parts are usually `JsComponentProxy`, `JsProperties`, and any referenced assets the script consumes.
- Use `JsProperties` for inspector-driven settings the TypeScript reads on startup.
- These prefabs do not need the same hand or socket transforms as item prefabs unless they also double as an interactable object.

Observed sample:
- `com.cydream.facialexpression/Prefab/FacialHook.prefab`

## Building And Connection Prefabs

Building content sits between prop and scene conventions.

- If you are authoring constructible parts, prefer attachment-friendly naming and stable local pivots.
- The legacy `BuildingScene` sample shows repeated `AttachmentPoint ...` children throughout the prefab. Treat those as the authoritative pattern for snap and connect authoring in this toolkit.
- Keep each building piece modular and avoid baking too much unrelated geometry into one part if it is meant to participate in the building system.

Observed sample:
- `Assets/Samples/BuildingScene/Prefab/BigBen.prefab`

## What To Verify

Before treating a scripted prefab as ready, verify:

- Required helper transforms are present and oriented correctly.
- Required gameplay components are on the expected root.
- Scene-only assets use scene registration, not item registration.
- Scripted prefabs have their TypeScript entry wired through `JsComponentProxy` and the mod's script index.
