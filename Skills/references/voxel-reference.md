# Voxel Reference

Material IDs, voxel data layout, VoxelDestructor API, collision mechanics, and heightmap terrain.

## 1. Material ID Table

Modders cannot create new Material IDs. Limited to modifying properties of existing IDs 0-31.

| ID | Name | Hardness | Metallic | Reflectivity | Flammability | Poisonable |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | Air | 0 | Non-Metal | Medium | Flammable | Yes |
| 1 | Wood | 4 | Non-Metal | Low | Flammable | Yes |
| 2 | Grass | 1 | Non-Metal | Medium | Flammable | Yes |
| 3 | Plastic | 1 | Non-Metal | High | Flammable | Yes |
| 4 | Bone | 10 | Non-Metal | Low | Fireproof | Yes |
| 5 | Skin | 5 | Non-Metal | Low | Flammable | Yes |
| 6 | Dirt | 6 | Non-Metal | Low | Resistant | No |
| 7 | Stone | 6 | Non-Metal | Low | Resistant | No |
| 8 | Brick | 5 | Non-Metal | Medium | Resistant | Yes |
| 9 | Concrete | 5 | Non-Metal | High | Resistant | No |
| 10 | Asphalt | 4 | Non-Metal | High | Resistant | Yes |
| 11 | Crust | 7 | Metal | Low | Fireproof | Yes |
| 12 | Metal | 8 | Metal | Low | Resistant | Yes |
| 13 | Glow | 5 | Non-Metal | Medium | Fireproof | Yes |
| 14 | Glass | 1 | Non-Metal | Medium | Fireproof | Yes |
| 15 | HarderSkin | 9 | Non-Metal | Medium | Resistant | No |
| 16 | HardSkin | 8 | Non-Metal | Low | Resistant | No |
| 17 | FistSkin | 6 | Non-Metal | Medium | Resistant | Yes |
| 18 | Armor | 11 | Metal | Low | Fireproof | No |
| 19 | Water | 1 | Non-Metal | Medium | Fireproof | Yes |
| 20 | EnergyShield | 12 | Non-Metal | Medium | Fireproof | Yes |
| 21 | PierceBullet | 14 | Metal | Low | Resistant | Yes |
| 22 | CarbonSteel | 12 | Metal | Low | Fireproof | Yes |

## 2. Palette-to-Material Mapping

When authoring in MagicaVoxel, palette color indices map to material IDs in groups of eight.

Formula: `Material ID = Ceil(Palette Index / 8)`

| Palette Range | Material ID | Name |
| :--- | :--- | :--- |
| 1 - 8 | 1 | Wood |
| 9 - 16 | 2 | Grass |
| 17 - 24 | 3 | Plastic |
| 25 - 32 | 4 | Bone |
| 33 - 40 | 5 | Skin |
| 41 - 48 | 6 | Dirt |
| 49 - 56 | 7 | Stone |
| 57 - 64 | 8 | Brick |
| 65 - 72 | 9 | Concrete |
| 73 - 80 | 10 | Asphalt |
| 81 - 88 | 11 | Crust |
| 89 - 96 | 12 | Metal |
| 97 - 104 | 13 | Glow |
| 105 - 112 | 14 | Glass |
| 113 - 120 | 15 | HarderSkin |
| 121 - 128 | 16 | HardSkin |
| 129 - 136 | 17 | FistSkin |
| 137 - 144 | 18 | Armor |
| 145 - 152 | 19 | Water |
| 153 - 160 | 20 | EnergyShield |
| 161 - 168 | 21 | PierceBullet |
| 169 - 176 | 22 | CarbonSteel |

Max Material ID is 31. Higher palette indices clamp to 31.

## 3. PointData Fields

Each voxel carries the following data:

- **Material ID** — Defines what the voxel is made of. Links to a Block Info definition (see Material ID Table). Determines physical properties.
- **Color** — Independent RGB color. A red stone and a blue stone share the same physical properties but look different.
- **Temperature** — How hot the voxel is. High temperature can trigger burning or melting depending on the Material ID.
- **Burning Duration** — Tracks how long the voxel has been on fire.
- **Water / Wetness** — Whether the voxel is wet. Douses fires, can conduct electricity.
- **Poison Level** — Tracks biological interactions for poisonable materials.
- **Damage / Integrity** — Progressive destruction state via the `Value` field.

## 4. VoxelObjectProxyType

When using `VoxelObjectProxy`, the type determines how the underlying components are configured. You usually do not need to touch these manually.

| Proxy Type | Connectivity Check | Chemistry Effect | Layer | Destructible | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **WeaponItem** | No | Yes | Item | No (Indestructible) | Handheld weapons. Won't break apart. |
| **BuildingItem** | Yes | Yes | Item | Yes | Standard prop/item that can break. |
| **SceneStatic** | No | No | Building | No (Indestructible/Unyielding) | Static level geometry. Won't be pushed. |
| **SceneDynamic** | Yes | Yes | Item | Yes | Dynamic scene objects (crates, etc.). |
| **SceneConnected** | Yes | Yes | Item | Yes | Strong/weak connected structures. |

- **Connectivity Check**: Whether the object checks if parts are floating/disconnected (and should fall off).
- **Chemistry Effect**: Whether voxel chemistry simulation updates (fire, water, poison).

For manual control over collision settings (specific layers, mass density, destructibility), decouple the components:
1. Use `VoxelVolume` for voxel data and mesh.
2. Add `PxVoxelColliderGenerator` to handle collision generation.
3. Remove `VoxelObjectProxy`.

## 5. VoxelDestructor API

The `VoxelDestructor` component provides high-level methods for destroying or modifying voxels.

### DemolishAreaSphere

Destroys voxels within a spherical area and optionally creates physical fragments.

```
DemolishAreaSphere(center, radius, force, explodeDirection, spreadAngle, maxFragments, hardnessCap, onModified)
```

### ExplodeToPartsAndDestroySelf

Fractures the entire object into parts and destroys the original.

```
ExplodeToPartsAndDestroySelf(specialEffect, randomRemoval)
```

### BoxSweepClear

Clears voxels within a swept box area (for melee attacks or wide projectiles).

```
BoxSweepClear(end1, end2, halfBox, boxLocalToWorld, voxelChunkToClears, isByEasyKinematicPenetration, hardnessCap)
```

## 6. Voxel Collision & Penetration

Voxel Playground uses a custom physics system to simulate object penetration based on material hardness and velocity. Harder objects penetrate softer ones.

### Core Properties (PxVoxelColliderGenerator)

- **`useKinematicPenetrate`** — Enables the hardness-based penetration system. If disabled, voxels behave like standard solid rigidbodies.
- **`easyKinematicPenetration`** — Allows easier penetration at lower velocities. Often used for sharp objects or super-strength interactions.

### How It Works

1. **Hardness Check** — The system compares the Hardness of the two colliding objects (see Material ID Table). Small difference = standard physics (bounce/stop). Large difference = the harder object penetrates.
2. **Velocity Check** — Higher relative velocity enables deeper penetration. If `easyKinematicPenetration` is enabled, the minimum velocity threshold is removed.
3. **Resolution** — The harder object penetrates the softer one. The softer object resists based on the hardness difference. Indestructible objects are protected unless specific conditions are met.

### InfiniteSides

`PxVoxelColliderGenerator` has an `InfiniteSide` property: an array of 6 booleans for the 6 directions (X+, X-, Y+, Y-, Z+, Z-).

When set to `true`, that side is treated as an infinite boundary. Used for world edges or ground to prevent objects from falling out of the map.

## 7. HeightmapVoxels

Creates voxel terrain from a heightmap and colormap texture. Preferred way to build large terrain or ground efficiently.

| Parameter | Description | Default |
| :--- | :--- | :--- |
| **Heightmap** | Grayscale texture defining terrain height. White = high, black = low. | None |
| **Colormap** | RGB texture defining surface color. | None |
| **Forbid Mask** | Optional exclusion mask texture. | None |
| **Tile Size** | Chunk size for generation splitting. Smaller = less memory but more objects. | 256 |
| **Height Scale** | Vertical height multiplier. | 1 |
| **Voxel Size** | Individual voxel world size. Smaller = more detail but heavier. | 0.25 |
| **LOD Bias** | Level of detail bias for mesh generation. | 1.0 |
| **Voxel ID** | Material type of generated voxels (Stone, Dirt, Grass). Affects sound and physics. | Stone |
| **Indestructible** | If enabled, terrain cannot be destroyed. | true |

Important:
- Textures must have **Read/Write Enabled** checked in Unity import settings.
- Keep heightmap texture **under 256x256 pixels**. Larger textures produce massive geometry and cause significant lag during initialization.

## 8. Voxel Data Editor Tool

Location: **Vox Mod Tools > Voxel Data Editor**

Use this tool to inspect and modify Material IDs in voxel data (`.txt` files) without going back to MagicaVoxel.

Workflow:
1. **Load** — Assign your voxel data `.txt` file and click Load.
2. **Inspect** — View existing IDs with counts. Toggle **Draw** to visualize specific IDs with red wireframe gizmos.
3. **Edit** — Replace Specific ID, Replace All, or use **Setup ID For Character** (auto-processes: interior voxels -> Skin ID with flesh color, surface -> skin tone).
4. **Save** — Specify output name and folder, then Save As `.txt`.
