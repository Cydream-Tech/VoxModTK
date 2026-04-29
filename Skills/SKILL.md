---
name: voxmodtk
description: guidance for writing game mod work in this Unity project, write mod scripts in TypeScript with specific conventions
---

# Voxel Playground ModTK

This skill is primarily for code-authoring work in this toolkit: TypeScript gameplay scripts, text-backed config assets, and prefab-side scripting contracts the user must wire in Unity. Prefer patterns already present under `Assets/Samples` and only introduce new conventions when the current project cannot support the requested behavior.

## Workflow

### Create or change a mod

- If the mod already exists, identify its root first. Use `Assets/Mod/<mod-id>` as the primary root.
- Keep the mod self-contained inside its mod folder where possible.
- Treat wizard-driven setup, inspector wiring, and exporter clicks as user/editor actions unless the task is explicitly about changing editor code.
- When the request depends on Unity-side wiring, document the required prefab or asset contract clearly instead of pretending the agent can perform the editor manipulation.

### Write gameplay scripts

- Use TypeScript when the behavior maps cleanly to `JsComponentProxy` lifecycle hooks, `VX.Mod.ModAPI`, and the generated typings.
- Read [scripting-best-practices.md](Skills/references/scripting-best-practices.md) before writing gameplay code. It covers Puerts usage and project-specific conventions.
- Read [content-types.md](Skills/references/content-types.md) before deciding whether the request is a scene, prop, character, avatar, or global mod.
- Read [prefab-conventions.md](Skills/references/prefab-conventions.md) before changing prefab structure or adding helper transforms/components.
- Read [mod-constitution.md](Skills/references/mod-constitution.md) before creating or reorganizing mod folders, manifests, prefabs, scripts, or support assets.
- Read [gameplay-engine-overview.md](Skills/references/gameplay-engine-overview.md) before making gameplay assumptions about entities, physics, voxels, rendering, or character setup.
- Read [entity-reference.md](Skills/references/entity-reference.md) before choosing an entity base class or configuring weapon-specific fields.
- Read [voxel-reference.md](Skills/references/voxel-reference.md) before working with material IDs, voxel data, or voxel destruction APIs.
- Read [testing-and-debugging.md](Skills/references/testing-and-debugging.md) before telling the user how to validate runtime behavior or diagnose script failures.
- Generated typings live at `Assets\Plugins\Core\Gen\Typing\csharp\index.d.ts`.
- Prefer the supported scripting surface under `VX.Mod.ModAPI`. Do not assume direct use of arbitrary engine internals is the intended script path.
- Do not assume Puerts exposes every C# API. If a required API is missing from the typings, tell the user they need support from the developer side.

### Prefab and asset contracts

- When a script depends on prefab setup, state the contract explicitly: required engine component, required `JsComponentProxy`, exported class name, expected `JsProperties`, required helper transforms, and manifest inclusion.
- For manifest or other ScriptableObject-like text-backed asset edits, preserve the existing schema and only add fields or entries the current samples and docs already support.
- Prefer built-in engine components plus TypeScript extension over inventing custom replacement gameplay stacks.

### Test and verify scripts

- Verify TypeScript changes from `Puer-Project` with `npm run lint:mod -- {modId}`.
- Use the dedicated testing reference for install paths, log paths, flatscreen iteration, and prefab-wiring diagnosis.

## Export

- Treat export and installation as user/editor actions unless the request is to change exporter code.
- If exportability matters, verify the relevant prefab is present in `manifest.asset` and call that requirement out explicitly.
