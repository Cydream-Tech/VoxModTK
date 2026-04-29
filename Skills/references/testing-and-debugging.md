# Testing And Debugging

Use this reference only for validation, local install paths, runtime diagnosis, and fast iteration. Do not repeat folder-structure rules from `mod-constitution.md`, prefab setup rules from `prefab-conventions.md`, or scripting patterns from `scripting-best-practices.md`.

## 1. Validate TypeScript First

Run validation from `Puer-Project` before treating a problem as a runtime bug.

```cmd
cd /Puer-Project
npm install
npm run lint:mod -- com.yourname.yourmod
```

Use this to catch missing exports, typing issues, and common script mistakes before export.

## 2. Check The Prefab-Script Link

Most TypeScript mod failures come from incorrect prefab wiring rather than syntax.

Verify:

- The prefab has `JsComponentProxy`.
- The proxy class name exactly matches the exported TypeScript class name.
- `Scripts/index.ts` exports the class the prefab expects.
- Required `JsProperties` entries are assigned.
- The playable prefab is listed in `manifest.asset`.

If the script expects helper transforms or built-in engine components, verify those next using `prefab-conventions.md` and `entity-reference.md`.

## 3. Install And Run The Built Mod

Normal workflow:

1. Build the mod through the Unity exporter.
2. Install it locally through the exporter, or copy the built mod folder manually.

Windows mods load from:

```text
%userprofile%\AppData\LocalLow\Cydream\Voxel Playground\Mods\
```

The game loads valid mod folders from that directory on startup.

## 4. Read Logs

Use logs to confirm script instantiation and to diagnose missing bindings.

### VR mode

1. Start the game.
2. Open `Settings > Dev > Console`.
3. Read the in-game console output.

### Flatscreen mode

Read:

```text
%userprofile%\AppData\LocalLow\Cydream\Voxel Playground\Player.log
```

## 5. Use Flatscreen For Fast Iteration

For script-heavy work, flatscreen is usually the fastest validation loop.

```cmd
Voxel Playground.exe --flatscreen
```

Common controls:

- Move: `W`, `A`, `S`, `D`
- Look: Mouse
- Jump: `Space`
- Hands or fire: mouse buttons and number keys depending on the held item

## 6. Failure Triage

Use this order:

1. Lint or type errors.
2. Missing export from `Scripts/index.ts`.
3. Wrong `JsComponentProxy` class name.
4. Missing `JsProperties` data.
5. Missing built-in engine component or helper transform.
6. Prefab not registered in `manifest.asset`.
7. API not actually exposed through typings.

If the code is correct but the needed API is missing from generated typings, treat it as an engine-support gap rather than a script bug.
