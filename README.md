# Voxel Playground Mod Toolkit

This project is the mod creation toolkit for [**Voxel Playground**](https://voxelplayground.com/), a VR micro-voxel physics sandbox where voxel objects can be built, broken, moved, burned, shot, and scripted as part of gameplay.

Use this repository to create Voxel Playground mods in Unity, import `.vox` assets, configure playable prefabs, add TypeScript behavior, export mod packages, and test them in the game.

## Links

Docs: [Official Manual](https://voxelplayground.com/doc/documents/manual.html)

- [Official Manual](https://voxelplayground.com/doc/documents/manual.html)
- [Mod.io](https://mod.io/g/voxel-playground)
- [Voxel Playground on Meta Quest](https://www.meta.com/experiences/voxel-playground/9926748747373800/)
- [Voxel Playground on Steam](https://store.steampowered.com/app/4350620/Voxel_Playground/)

## What You Can Make

Docs: [Modding Overview](https://voxelplayground.com/doc/documents/modding.html), [Scene Tutorial](https://voxelplayground.com/doc/documents/modding-scene-tutorial-nyc.html)

Voxel Playground mods usually fall into one of these content types:

| Type | Use it for |
| :--- | :--- |
| Scene | Maps, arenas, encounter spaces, playable environments |
| Prop | Weapons, tools, destructible objects, spawned items |
| Character | AI-driven enemies, NPCs, bosses, creatures |
| Avatar | Player-selectable humanoid bodies or character skins |
| Global | Session-wide systems, hooks, utilities, or scripted services |

When in doubt, choose the type by asking what owns the prefab at runtime: a loaded map is a scene, a held or spawned object is a prop, an AI body is a character, a playable body is an avatar, and a system-level behavior is global.

## Requirements

- Voxel Playground installed for testing.
- Unity project opened from this toolkit repository.
- MagicaVoxel or another compatible `.vox` authoring workflow.
- Node.js and npm if your mod includes TypeScript scripts.
- Mod.io account for publishing shared mods.

## IDE Skill Setup

This repository includes an AI-assistant skill under `Skills/`. It tells supported IDE agents how Voxel Playground mods are structured, when to use TypeScript, which local references to read, and how to avoid unsupported Unity or runtime assumptions.

Run the installer from the repository root to link the shared skill into supported tools:

```sh
bash Skills/install.sh --all
```

You can install for one tool at a time:

```sh
bash Skills/install.sh --claude
bash Skills/install.sh --codex
bash Skills/install.sh --cursor
```

The installer links:

| Tool | Target |
| :--- | :--- |
| Claude Code | `.claude/commands/voxmodtk.md` |
| Codex CLI | `.codex/skills/voxmodtk/SKILL.md` and `.codex/agents/openai.yaml` |
| Cursor | `.cursor/rules/voxmodtk.mdc` |

If your IDE or assistant supports file mentions, reference the skill directly before asking for mod work:

```text
@Skills/SKILL.md
@Skills/references/content-types.md
@Skills/references/mod-constitution.md
@Skills/references/prefab-conventions.md
@Skills/references/scripting-best-practices.md
@Skills/references/testing-and-debugging.md
```

For narrower tasks, include only the relevant references. For example, use `@Skills/references/voxel-reference.md` for material IDs and voxel data, or `@Skills/references/entity-reference.md` for character and weapon entity setup.

## Quick Start

Docs: [Quick Start](https://voxelplayground.com/doc/documents/quick-start.html), [Modding Overview](https://voxelplayground.com/doc/documents/modding.html), [Create Mod](https://voxelplayground.com/doc/documents/quick-start-create-mod.html), [Testing your Mod](https://voxelplayground.com/doc/documents/quick-start-test-mod.html)


1. Open this project in Unity.
2. Create a new mod with `Vox Mod Tools/New Mod Wizard`, or inspect an existing sample under `Assets/Samples`.
3. Author voxel source assets as `.vox` files.
4. Import `.vox` assets through the Vox Asset Processor.
5. Convert imported assets into Unity prefabs.
6. Configure the prefab for the content type you are building.
7. Add TypeScript scripts if the mod needs custom behavior.
8. Register exported scenes or items in the mod's `manifest.asset`.
9. Export the mod with `Vox Mod Tools/Mod Exporter`.
10. Install the exported mod and test it in Voxel Playground.

## Project Structure

A typical mod lives under `Assets/Mod/<mod-id>`. Samples live under `Assets/Samples/<mod-id>` and are the best place to copy patterns from.

Common mod folders and files:

| Path | Purpose |
| :--- | :--- |
| `manifest.asset` | Export contract for mod identity, scenes, items, dependencies, and version data |
| `Prefab/` | Playable prefabs loaded by the game |
| `Scripts/` | TypeScript gameplay scripts |
| `Data/` | Imported voxel data and mod-local support assets |
| `Audio/`, `Misc/` | Optional supporting assets used by some mods |
| `tsconfig.json` | Mod-local TypeScript configuration |
| `.vox` files | Source voxel models authored outside Unity |

The most important rule is that playable content must be referenced by `manifest.asset`. If a scene or item prefab is not listed there, it will not be exported as playable mod content.

## Voxel Asset Authoring

Docs: [MagicaVoxel](https://voxelplayground.com/doc/documents/tools-voxel-authoring-magica-voxel.html), [Material ID and Visual](https://voxelplayground.com/doc/documents/gameplay-voxel-material-id-visual.html), [Voxel Data Editor](https://voxelplayground.com/doc/documents/tools-voxel-authoring-voxel-data-editor.html)

MagicaVoxel is the primary tool used by the official documentation for creating `.vox` models. Save your models as `.vox`, import them into Unity, and use the asset processor to generate voxel data and prefabs.

Voxel material behavior is controlled by material IDs. In the MagicaVoxel workflow, palette indices are grouped into material IDs, so the colors you choose can affect gameplay properties such as hardness, flammability, metallic behavior, glass, armor, water, and other special material behavior.

For complex scene `.vox` files, object-name prefixes control import behavior:

| Prefix | Meaning |
| :--- | :--- |
| `A_` | Static environment such as floors, walls, terrain, and major structures |
| `B_` | Dynamic props affected by gravity and physics |
| `C_` | Strong connected objects that should stay anchored more firmly |
| `D_` | Weak connected or hanging objects such as lamps and signs |

Use `A_` for floors and structural geometry. Use `B_` for objects the player should move, break, or interact with physically.

## Prefabs and Manifests

The prefab is what Voxel Playground loads at runtime. The manifest is what the exporter uses to decide which prefabs become part of the mod.

For each playable prefab:

- Keep it inside the mod's `Prefab/` folder.
- Configure the built-in components required by its content type.
- Add required helper transforms, colliders, physics components, and script proxies.
- Register it in `manifest.asset` under `Scenes[]` or `Items[]`.
- Set item type correctly for props, characters, avatars, and global mods.

Avoid inventing a new structure when a sample already covers the same kind of mod. Match the closest sample first, then customize only what your mod actually needs.

## TypeScript Scripting

Gameplay scripting is usually written in TypeScript through Puerts and `JsComponentProxy`.

The usual script contract is:

1. Add a `JsComponentProxy` to the prefab.
2. Set the script class name on the proxy.
3. Export the same class from `Scripts/index.ts`.
4. Pass prefab references through `JsProperties` when the script needs Unity objects, other proxies, transforms, audio, effects, or configuration values.
5. Use `VX.Mod.ModAPI` for supported game-facing behavior.

Example shape:

```ts
export class ExampleModBehavior {
    private bindTo: VX.Mod.JsComponentProxy;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
    }

    private onStart(): void {
        // Read components, JsProperties, or ModAPI state here.
    }

    private onUpdate(deltaTime: number): void {
        // Runtime behavior here.
    }
}
```

Generated TypeScript typings live at:

```text
Assets/Plugins/Core/Gen/Typing/csharp/index.d.ts
```

If an engine API is not exposed through the generated typings, treat that as a toolkit/API support gap rather than assuming arbitrary C# internals are available to scripts.

## Testing and Debugging

Docs: [Testing your Mod](https://voxelplayground.com/doc/documents/quick-start-test-mod.html)

Validate script mods before treating a problem as a runtime bug:

```cmd
cd Puer-Project
npm install
npm run lint:mod -- com.yourname.yourmod
```

After export, Voxel Playground loads local mods from:

```text
%userprofile%\AppData\LocalLow\Cydream\Voxel Playground\Mods\
```

For fast iteration, use flatscreen mode when available:

```cmd
Voxel Playground.exe --flatscreen
```

Useful debugging checks:

- The prefab is listed in `manifest.asset`.
- `Scripts/index.ts` exports the class expected by `JsComponentProxy`.
- The proxy class name exactly matches the exported TypeScript class.
- Required `JsProperties` entries are assigned.
- Required built-in components and helper transforms exist on the prefab.
- TypeScript lint passes.
- Runtime logs show the script being instantiated.

In VR, use `Settings > Dev > Console` to inspect runtime output. In flatscreen testing, check:

```text
%userprofile%\AppData\LocalLow\Cydream\Voxel Playground\Player.log
```

## Exporting

Docs: [Create Mod](https://voxelplayground.com/doc/documents/quick-start-create-mod.html), [Testing your Mod](https://voxelplayground.com/doc/documents/quick-start-test-mod.html)

Use `Vox Mod Tools/Mod Exporter` in Unity to build and install or copy the mod package.

Before exporting, confirm:

- `manifest.asset` has the correct mod ID, name, author, version, and minimum game version.
- Every playable scene or item prefab is registered in the manifest.
- Icons, banners, and support assets are included where required.
- TypeScript scripts are exported from `Scripts/index.ts`.
- The mod works when installed into the local Voxel Playground mods folder.

## Publishing

Docs: [Publishing your Mod](https://voxelplayground.com/doc/documents/quick-start-publish-mod.html)

Once the mod is tested locally, prepare the exported package for the supported publishing or sharing workflow. Include clear metadata, representative images, and a version number that changes when you update the mod.

Keep published mods self-contained. Other creators and players should be able to understand the mod from its manifest metadata, exported package, and any short description you provide on the target platform.

## Learn From Samples

Docs: [Modding Overview](https://voxelplayground.com/doc/documents/modding.html), [Scene Tutorial](https://voxelplayground.com/doc/documents/modding-scene-tutorial-nyc.html)

The fastest way to build a reliable mod is to start from the closest sample under `Assets/Samples`:

- Use scene samples for maps and environments.
- Use weapon or prop samples for held items and destructible objects.
- Use character samples for NPCs or enemies.
- Use avatar samples for player bodies.
- Use global samples for session-wide script behavior.

Match the sample's folder structure, prefab setup, manifest entries, and script wiring before adding custom behavior.
