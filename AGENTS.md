# VoxModTK Agent Guide

This is the Voxel Playground mod authoring project.

Before changing mods, read `Skills/SKILL.md`, then read the specific files it references under `Skills/references/` for the task at hand.

For pie-unity RPC, use the `pie-unity-rpc` skill from this Unity project's resolved `com.pie.agent` package. Do not use a copied global skill and do not add a project-local launcher.

Find the package-contained RPC skill from the project root in this order:

1. `Packages/com.pie.agent/Skills/pie-unity-rpc/SKILL.md`
2. `Library/PackageCache/com.pie.agent@*/Skills/pie-unity-rpc/SKILL.md`
3. `Library/PackageCache/com.pie.agent*/Skills/pie-unity-rpc/SKILL.md`

If the package copy is missing, ask the user to open the Unity project once so Unity resolves packages. After finding `SKILL.md`, run the adjacent `pie-unity-rpc.js`.

Treat every pie-unity host as a tool host. VoxModTK Editor and Voxel Playground runtime hosts both expose capabilities through `/manifest`; choose the host by the capability needed for the user's task, not by assuming behavior from editor/runtime mode.
