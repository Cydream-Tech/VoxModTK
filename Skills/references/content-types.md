# Content Types

This project supports a few distinct kinds of mod content. The important split is not just "what the asset looks like", but how it is exported through `manifest.asset` and which gameplay systems own the prefab at runtime.

## Type Map

| Type | Manifest slot | Typical sample | What it is for |
| :--- | :--- | :--- | :--- |
| `scene` | `Scenes[]` | `Assets/Samples/com.cydream.nyc`, `Assets/Samples/com.cydream.homelander` | Full playable environment, map, or encounter space |
| `prop` | `Items[]` with `itemType: 0` | `Assets/Samples/com.cydream.katana`, `Assets/Samples/com.cydream.asteroid` | Handheld weapons, tools, destructible items, spawned gameplay props |
| `character` | `Items[]` with `itemType: 1` | `Assets/Samples/com.cydream.samplecharacters` | AI-driven NPC or enemy character |
| `avatar` | `Items[]` with `itemType: 2` | `Assets/Samples/com.cydream.spiderman` | Player-selectable humanoid body/avatar |
| `global` | `Items[]` with `itemType: 3` | `Assets/Samples/com.cydream.facialexpression` | System or hook prefab that installs behavior globally rather than acting as a normal pickup or map |

## Scene

Use a scene mod when the prefab is the main environment the player loads into.

Good fits:
- City map
- Arena
- Showcase environment
- Encounter scene with scripted set pieces

## Prop

Use a prop mod for objects the player can hold, fire, slice with, throw, or spawn as a regular item.

Good fits:
- Katana
- Wand
- Gun
- Throwable destructible object

## Character

Use a character mod when the prefab represents a game-controlled creature or NPC.

Good fits:
- Zombie variant
- Boss enemy
- Friendly NPC if it still uses the character runtime

## Avatar

Use an avatar mod when the prefab is primarily a playable body / cosmetic character selection for the player.

Good fits:
- Playable superhero skin
- Custom humanoid player model
- Alternate body rig with matching proportions

## Global

Use a global mod when the prefab exists to attach scripts or systems that affect the whole game session.

Good fits:
- Global event listener
- Runtime utility service
- HUD/system extender
- Character visual hook

## Choosing The Type

Pick the type by asking which runtime owns the prefab:

- If the player loads into it as a map, make a `scene`.
- If the player grabs or uses it like an object, make a `prop`.
- If AI drives it as an NPC, make a `character`.
- If the player wears/embodies it, make an `avatar`.
- If it exists to install behavior across the session, make it `global`.

When in doubt, inspect the closest sample under `Assets/Samples` and match its `manifest.asset` entry first.

## Next Steps

Once you know the type:
- For folder structure and workflow, see [mod-constitution.md](mod-constitution.md).
- For prefab hierarchy and transforms, see [prefab-conventions.md](prefab-conventions.md).
