# Mod Constitution

This page describes the mod folder contract only: what a mod contains, where things live, and which assets act as the source of truth for export. Do not use it for prefab hierarchy details, scripting techniques, or runtime testing workflow.

## Core Structure

A typical mod lives in one folder, usually under `Assets/Mod/<mod-id>` for real work and under `Assets/Samples/<mod-id>` for examples.

Common pieces:

- Mod root
- `manifest.asset`
- `Prefab/`
- `Scripts/`
- `Data/`
- one or more source `.vox` files
- optional icon, banner, audio, or misc assets
- optional `tsconfig.json` for TypeScript mods

## Required Pieces

### `manifest.asset`

This is the mod's export contract.

It defines:

- `id`
- `author`
- `modName`
- `modVersion`
- `minimalMainGameVersion`
- `Scenes[]`
- `Items[]`
- optional `dependencies`

The most important rule is that gameplay content is only exported when it is referenced here.

### `Prefab/`

This contains the prefabs that the game actually loads.

- Scene mods export scene prefabs through `Scenes[]`.
- Item, character, avatar, and global mods export prefabs through `Items[]`.
- Auxiliary prefabs can also live here, even if they are not directly listed in the manifest, as long as listed prefabs reference them.

### Source `.vox` Files

These are the voxel-authoring source files.

- Keep them near the mod root so the asset processor flow stays obvious.
- After import, Unity generates voxel data and prefabs from them.
- Multi-object `.vox` scene files rely on object-name prefixes such as `A_`, `B_`, `C_`, and `D_`.

## Common Optional Pieces

### `Scripts/`

Used for gameplay logic, most often in TypeScript.

Typical contents:

- `index.ts` entry exports
- one or more behavior scripts
- helper `.d.ts` files if the mod shares custom typings

### `Data/`

Used for imported voxel text data and mod-local assets consumed by prefabs or scripts.

Observed contents across samples:

- generated voxel text chunks
- textures
- materials
- PSD source art
- supporting data files

### Visual Metadata

Often stored at the mod root:

- icon PNGs for manifest item or scene entries
- banner images
- rendering settings assets for scenes

### `Audio/` and `Misc/`

These appear when a mod needs richer support assets.

- `com.cydream.katana/Audio` contains sound event and container assets.
- `com.cydream.homelander/Misc` contains support prefabs used by tooling or setup.

### `tsconfig.json`

Most TypeScript samples keep a mod-local `tsconfig.json` at the mod root. Follow that pattern when a mod owns scripts.

## How The Pieces Fit Together

The normal authoring flow at the file-structure level is:

1. Create or locate the mod root.
2. Keep source `.vox` files and support assets in that root.
3. Keep generated or authored playable prefabs in `Prefab/`.
4. Keep TypeScript in `Scripts/`.
5. Keep imported or support data in `Data/` and optional support folders.
6. Register the playable prefabs in `manifest.asset`.

## Type-To-Folder Quick Reference

| Type | Manifest slot | Typical extra folders |
| :--- | :--- | :--- |
| scene | `Scenes[]` | `Data/` for voxel text, optional `SceneRenderingSettings` |
| prop | `Items[]` `itemType: 0` | `Scripts/`, optional `Audio/` |
| character | `Items[]` `itemType: 1` | `Data/` for body-part voxel data, optional `EnemyInfo` |
| avatar | `Items[]` `itemType: 2` | `Data/` for body-part voxel data, optional textures |
| global | `Items[]` `itemType: 3` | `Scripts/` for bootstrap logic |

For detailed prefab structure per type, see [prefab-conventions.md](prefab-conventions.md).

## Authoring Rules

- Keep the mod self-contained in one folder.
- Treat `manifest.asset` as the source of truth for export.
- Keep exported prefabs under `Prefab/`.
- Keep scripts under `Scripts/`.
- Match the closest sample instead of inventing a new structure.
- Use [testing-and-debugging.md](testing-and-debugging.md) for validation, install paths, and runtime diagnosis.
