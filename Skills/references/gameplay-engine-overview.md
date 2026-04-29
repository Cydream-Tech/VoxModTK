# Gameplay And Engine Overview

This is a working summary of the game's design, written for mod authors. It condenses the upstream manual into the systems you usually need to understand before changing or creating content.

## Core Mental Model

Voxel Playground is built around four connected layers:

- entity gameplay classes
- a custom Px5-based physics stack
- a destructible voxel world
- Unity-based authoring and presentation

Most mods succeed when they attach content to the right layer instead of fighting the engine.

## Entity Layer

The `Entity` hierarchy is the backbone of interactive content. In C#, all interactive items, weapons, characters, and destructible objects inherit from the `Entity` base class. In TypeScript modding, you cannot derive from these C# classes — instead you select the appropriate entity component in the Unity inspector on your prefab, then hook into its events from TypeScript via `JsComponentProxy`.

The hierarchy splits into two main sides:

- **Item side** — `Entity` -> `EntityItem` -> `EntityAttachmentItem` -> `EntityFirableWeapon` / `EntityGunItem`. This is where handheld tools, weapons, and equippable objects live.
- **Character side** — `EntityCharacter`. This is where AI actors and enemies live, configured through `CharacterPresetProxy`.

For the full component tree and class-specific fields, see [entity-reference.md](entity-reference.md).

## Input And Interaction

Weapons and tools use a standard callback set for input. The primary hooks are `OnTriggerPressed`, `OnTriggerReleased`, `OnAbilityLongPressed`, and `OnAbilityReleased`. Runtime state switching uses `Activate()` / `Deactivate()`.

For custom axis input via `ModAPI.Input`, see [entity-reference.md](entity-reference.md).

## Physics Layer

The game does not rely on default Unity physics for its core gameplay feel. It uses the custom Px5 physics stack.

Implications for modding:

- Do not assume Unity Rigidbody behavior alone defines gameplay behavior.
- Collision, weapons, voxel interaction, and destruction often pass through Px5-specific components or helpers.
- When copying gameplay patterns, prefer project-native entity and voxel components over generic Unity-only solutions.

## Voxel Layer

The world and many objects are voxel-backed.

Key ideas:

- Voxel data can be destroyed and modified at runtime.
- Material behavior comes from `Material ID` — each voxel's physical properties (hardness, flammability, etc.) are determined by its material.
- MagicaVoxel palette indices map into material IDs in groups of eight.
- `HeightmapVoxels` are the preferred way to build large terrain or ground efficiently.

This has direct design consequences:

- Content should be authored with destruction in mind.
- Material palette choices are gameplay choices, not just color choices.
- Large landscapes should use the dedicated terrain flow, not giant hand-built voxel floors.

For the full material ID table, palette mapping formula, voxel data fields, and VoxelDestructor API, see [voxel-reference.md](voxel-reference.md).

## Scene Authoring Model

Scene authoring combines imported voxel objects, runtime anchoring rules, rendering settings, and optional terrain.

When creating a multi-object scene in MagicaVoxel, use name prefixes to control how each object is imported. The importer reads these prefixes to assign physics layers, collision behavior, and special components.

### Prefix Rules

| Prefix | Type | Layer | Physics | Destructible | Special |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`A_`** | Static environment | Building | Kinematic (immovable) | No | Tagged "Floor" for navigation |
| **`B_`** | Dynamic prop | Item | Dynamic (gravity) | Yes | Free-moving crates, barrels, debris |
| **`C_`** | Strong connected | Item | Dynamic | Yes | Adds `UnyieldingArea` — stays anchored until ground support is destroyed |
| **`D_`** | Weak connected | Item | Dynamic | Yes | Adds `AttachmentPoint` (facing down) + joint — for hanging or jointed objects |
| *(no prefix)* | Static prop | Item | Kinematic | No | Default fallback for unnamed objects |

**`C_`** is the standard pattern for destructible buildings that should stand until their base is destroyed. Ensure the `UnyieldingArea` box overlaps the ground voxels.

**`A_`** should be used for all ground and structural elements to ensure correct navigation and physics tagging.

For large ground surfaces, prefer `HeightmapVoxels` over giant hand-built voxel floors. See [voxel-reference.md](voxel-reference.md) for heightmap parameters.

## Character Model

Characters are prefab assemblies configured through `CharacterPresetProxy`.

The proxy controls:

- size preset
- height scale
- enemy stats via `EnemyInfo`
- AI behavior
- body-part mapping to voxel proxies

Good character work is mostly correct rigging and slot assignment, not just importing a body mesh.

## Rendering And Atmosphere

Scenes can carry a `SceneRenderingSettings` asset.

That asset controls:

- fog
- skybox and ambient light
- time-of-day driven gradients
- color adjustment
- tonemapping
- bloom
- LUT-based grading
- shadow distance/cascades

Use it when the scene's mood matters. Leave it out when the default game look is already correct.

## Building / Connection Concepts

The docs for connect-building are still thin, but the sample content shows the intended model:

- modular building pieces
- repeated `AttachmentPoint ...` child transforms
- stable pivots for snapping/placement

When authoring constructible or connected content, follow the existing `BuildingScene` sample rather than inventing a new hierarchy.

## Script Usage In This Toolkit

For toolkit work, TypeScript is the preferred gameplay-script path when the target behavior fits `JsComponentProxy`.

Use TypeScript when:

- the behavior attaches cleanly to prefab lifecycle callbacks
- the C# API you need is exposed in generated typings
- the mod benefits from self-contained script logic in `Scripts/`

Do not assume every C# API is exposed through Puerts typings. If a needed API is missing, the mod may require engine-side support.
