#if UNITY_EDITOR && USE_PIE_AGENT
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Mod;

[InitializeOnLoad]
public static class VoxModPieRpcExtensions
{
    private const string Owner = "VoxModTK";
    private const string Namespace = "voxmod";
    private const string RecipeCatalogPath = "Assets/Scripts/Editor/PieRpcExtensions/VoxModRecipes.json";

    private static readonly List<string> RegisteredTools = new List<string>();
    private static double nextRegisterCheckAt;

    [Serializable]
    private sealed class ModPayload
    {
        public string author = "";
        public string modName = "";
        public string modId = "";
        public string description = "";
    }

    [Serializable]
    private sealed class PathPayload
    {
        public string path = "";
        public string modId = "";
        public bool building;
    }

    [Serializable]
    private sealed class ManifestEntryPayload
    {
        public string modId = "";
        public string name = "";
        public string prefabPath = "";
        public string iconPath = "";
        public string itemType = "0";
    }

    [Serializable]
    private sealed class BindPayload
    {
        public string prefabPath = "";
        public string modId = "";
        public string className = "";
    }

    [Serializable]
    private sealed class JsPropertyPayload
    {
        public string prefabPath = "";
        public string key = "";
        public string kind = "";
        public string value = "";
        public string objectPath = "";
        public string componentType = "";
        public string[] objectPaths = new string[0];
    }

    [Serializable]
    private sealed class VoxRpcResult
    {
        public bool ok = true;
        public string tool = "";
        public string phase = "";
        public string summary = "";
        public string modId = "";
        public string modRoot = "";
        public string[] assetPaths = new string[0];
        public string[] warnings = new string[0];
        public string[] recoverableErrors = new string[0];
        public ModSummary[] mods = new ModSummary[0];
    }

    [Serializable]
    private sealed class ModSummary
    {
        public string modId = "";
        public string modName = "";
        public string author = "";
        public string modRoot = "";
        public string manifestPath = "";
        public int scenes;
        public int items;
    }

    private sealed class ToolSpec
    {
        public string Name;
        public string Description;
        public bool ReadOnly;
        public Func<string, string> Handler;
        public ParamSpec[] Parameters;
        public string WriteScope;
        public string Returns;
        public string RecommendedWorkflow;
        public string[] Examples;
        public string[] ErrorCodes;
        public bool CanTriggerDomainReload;
    }

    private sealed class ParamSpec
    {
        public string Name;
        public string Type;
        public bool Required;

        public ParamSpec(string name, string type, bool required)
        {
            Name = name;
            Type = type;
            Required = required;
        }
    }

    static VoxModPieRpcExtensions()
    {
        EditorApplication.delayCall += Register;
        EditorApplication.update += EnsureRegistered;
    }

    private static void EnsureRegistered()
    {
        if (EditorApplication.timeSinceStartup < nextRegisterCheckAt) return;
        nextRegisterCheckAt = EditorApplication.timeSinceStartup + 2.0;
        if (IsRegistered("voxmod_list_mods")) return;
        RegisteredTools.Clear();
        Register();
    }

    private static void Register()
    {
        if (RegisteredTools.Count > 0 && IsRegistered("voxmod_list_mods")) return;
        RegisteredTools.Clear();

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_create_mod",
            Description = "Create a VoxModTK mod skeleton under Assets/Mod with ModManifestV2, Scripts, Prefab, Data, tsconfig, and index.ts.",
            ReadOnly = false,
            Handler = CreateModJson,
            Parameters = Params(
                Required("author", "string"),
                Required("modName", "string"),
                Optional("modId", "string"),
                Optional("description", "string")),
            WriteScope = "Assets/Mod",
            Returns = "VoxRpcResult with created asset paths.",
            RecommendedWorkflow = "Use for new mods; edit generated TypeScript files through the filesystem, then call unity_refresh.",
            Examples = new[] { "{\"author\":\"cydream\",\"modName\":\"Laser Wand\",\"description\":\"A test item.\"}" },
            CanTriggerDomainReload = true
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_list_mods",
            Description = "List VoxModTK mods under Assets/Mod and Assets/Samples.",
            ReadOnly = true,
            Handler = ListModsJson,
            Parameters = Params(),
            WriteScope = "project",
            Returns = "VoxRpcResult with mods[].",
            RecommendedWorkflow = "Use before mutating a mod when the mod id is unknown.",
            Examples = new[] { "{}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_inspect_mod",
            Description = "Inspect one VoxModTK ModManifestV2 by mod id, mod folder, or manifest asset path.",
            ReadOnly = true,
            Handler = InspectModJson,
            Parameters = Params(Optional("modId", "string"), Optional("path", "string")),
            WriteScope = "project",
            Returns = "VoxRpcResult with manifest summary and asset paths.",
            RecommendedWorkflow = "Use before add_item/add_scene/bind operations.",
            Examples = new[] { "{\"modId\":\"com.cydream.asteroid\"}", "{\"path\":\"Assets/Mod/com.example.demo\"}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_add_item",
            Description = "Add or update an item entry in ModManifestV2.Items.",
            ReadOnly = false,
            Handler = AddItemJson,
            Parameters = Params(
                Required("modId", "string"),
                Required("name", "string"),
                Required("prefabPath", "string"),
                Optional("iconPath", "string"),
                Optional("itemType", "string")),
            WriteScope = "Assets/Mod or Assets/Samples manifest asset",
            Returns = "VoxRpcResult with touched manifest and prefab paths.",
            RecommendedWorkflow = "Create or prepare the prefab first; validate the mod afterwards.",
            Examples = new[] { "{\"modId\":\"com.example.demo\",\"name\":\"Laser Wand\",\"prefabPath\":\"Assets/Mod/com.example.demo/Prefab/LaserWand.prefab\"}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_add_scene",
            Description = "Add or update a scene entry in ModManifestV2.Scenes.",
            ReadOnly = false,
            Handler = AddSceneJson,
            Parameters = Params(
                Required("modId", "string"),
                Required("name", "string"),
                Required("prefabPath", "string"),
                Optional("iconPath", "string")),
            WriteScope = "Assets/Mod or Assets/Samples manifest asset",
            Returns = "VoxRpcResult with touched manifest and prefab paths.",
            RecommendedWorkflow = "Use for scene/building prefabs; validate the mod afterwards.",
            Examples = new[] { "{\"modId\":\"com.example.demo\",\"name\":\"Arena\",\"prefabPath\":\"Assets/Mod/com.example.demo/Prefab/Arena.prefab\"}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_bind_js_component",
            Description = "Add or configure JsComponentProxy on a prefab root and set modId/className.",
            ReadOnly = false,
            Handler = BindJsComponentJson,
            Parameters = Params(
                Required("prefabPath", "string"),
                Required("modId", "string"),
                Required("className", "string")),
            WriteScope = "prefab asset",
            Returns = "VoxRpcResult with touched prefab path.",
            RecommendedWorkflow = "Use after creating the TypeScript class and prefab; validate the mod afterwards.",
            Examples = new[] { "{\"prefabPath\":\"Assets/Mod/com.example.demo/Prefab/LaserWand.prefab\",\"modId\":\"com.example.demo\",\"className\":\"LaserWand\"}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_set_js_property",
            Description = "Add or update a JsProperties pair on a prefab root. Supports string, number, boolean, object, component, gameObject, and gameObjectArray.",
            ReadOnly = false,
            Handler = SetJsPropertyJson,
            Parameters = Params(
                Required("prefabPath", "string"),
                Required("key", "string"),
                Required("kind", "string"),
                Optional("value", "string"),
                Optional("objectPath", "string"),
                Optional("componentType", "string"),
                Optional("objectPaths", "string[]")),
            WriteScope = "prefab asset",
            Returns = "VoxRpcResult with touched prefab path.",
            RecommendedWorkflow = "Use for prefab wiring; prefer explicit objectPath/componentType for Unity object references.",
            Examples = new[] { "{\"prefabPath\":\"Assets/Mod/com.example.demo/Prefab/LaserWand.prefab\",\"key\":\"damage\",\"kind\":\"number\",\"value\":\"12\"}" }
        });

        if (CanResolveType("VoxModTools"))
        {
            RegisterTool(new ToolSpec
            {
                Name = "voxmod_convert_vox_to_prefab",
                Description = "Convert a .vox asset to a VoxModTK prefab using the existing VoxModTools conversion path.",
                ReadOnly = false,
                Handler = ConvertVoxJson,
                Parameters = Params(Required("path", "string"), Optional("building", "boolean")),
                WriteScope = "Assets/Mod, Assets/Samples, generated prefab/data assets",
                Returns = "VoxRpcResult with source path.",
                RecommendedWorkflow = "Use when a .vox source must become a scene/building prefab; inspect generated assets afterwards.",
                Examples = new[] { "{\"path\":\"Assets/Mod/com.example.demo/Data/Arena.vox\",\"building\":true}" },
                CanTriggerDomainReload = true
            });
        }

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_validate_mod",
            Description = "Validate manifest prefab references, JsComponentProxy wiring, and TypeScript exports for a VoxModTK mod.",
            ReadOnly = true,
            Handler = ValidateModJson,
            Parameters = Params(Optional("modId", "string"), Optional("path", "string")),
            WriteScope = "project",
            Returns = "VoxRpcResult; recoverableErrors contains validation findings.",
            RecommendedWorkflow = "Run after manifest or prefab wiring changes.",
            Examples = new[] { "{\"modId\":\"com.example.demo\"}" }
        });

        RegisterTool(new ToolSpec
        {
            Name = "voxmod_recipe_catalog",
            Description = "Return a small VoxModTK recipe catalog that maps common mod intents to authoring tools.",
            ReadOnly = true,
            Handler = RecipeCatalogJson,
            Parameters = Params(),
            WriteScope = "project",
            Returns = "JSON recipe catalog.",
            RecommendedWorkflow = "Use only as planning context; actual project state still comes from manifest and inspect tools.",
            Examples = new[] { "{}" }
        });

        if (RegisteredTools.Count == 0 || !IsRegistered("voxmod_list_mods"))
            EditorApplication.delayCall += Register;
    }

    private static string CreateModJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<ModPayload>(argsJson ?? "{}") ?? new ModPayload();
        var modName = RequireText(payload.modName, "modName");
        var author = RequireText(payload.author, "author");
        var modId = string.IsNullOrWhiteSpace(payload.modId) ? GetModId(author, modName) : SanitizeModId(payload.modId);
        var modRoot = "Assets/Mod/" + modId;

        if (AssetDatabase.IsValidFolder(modRoot) || Directory.Exists(ToAbsolute(modRoot)))
            return Result("voxmod_create_mod", "create", "Mod already exists: " + modId, modId, modRoot, warnings: new[] { "already_exists" });

        EnsureAssetFolder(modRoot);
        EnsureAssetFolder(modRoot + "/Scripts");
        EnsureAssetFolder(modRoot + "/Prefab");
        EnsureAssetFolder(modRoot + "/Data");

        var className = ToClassName(modName);
        var scriptFileName = ToAssetFileName(modName).ToLowerInvariant();
        File.WriteAllText(ToAbsolute(modRoot + "/tsconfig.json"), TsConfigText(), Encoding.UTF8);
        File.WriteAllText(ToAbsolute(modRoot + "/Scripts/" + scriptFileName + ".ts"), ComponentTemplate(className), Encoding.UTF8);
        File.WriteAllText(ToAbsolute(modRoot + "/Scripts/index.ts"), "export { " + className + " } from './" + scriptFileName + "';\n", Encoding.UTF8);

        var manifest = ScriptableObject.CreateInstance<ModManifestV2>();
        manifest.author = author;
        manifest.modName = modName;
        manifest.id = modId;
        manifest.description = payload.description ?? "";
        manifest.modVersion = new SemanticVersion { major = 1, minor = 0, patch = 0 };
        manifest.minimalMainGameVersion = new SemanticVersion { major = 0, minor = 3, patch = 0 };
        AssetDatabase.CreateAsset(manifest, modRoot + "/manifest.asset");
        AssetDatabase.ImportAsset(modRoot);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();

        return Result("voxmod_create_mod", "create", "Created " + modId + ".", modId, modRoot, new[]
        {
            modRoot,
            modRoot + "/manifest.asset",
            modRoot + "/Scripts/index.ts",
            modRoot + "/Scripts/" + scriptFileName + ".ts"
        });
    }

    private static string ListModsJson(string argsJson)
    {
        var mods = FindModFolders()
            .Select(folder => TrySummarize(folder))
            .Where(summary => summary != null)
            .ToArray();

        return Result("voxmod_list_mods", "inspect", "Found " + mods.Length + " mod(s).", mods: mods);
    }

    private static string InspectModJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<PathPayload>(argsJson ?? "{}") ?? new PathPayload();
        var manifest = ResolveManifest(payload.modId, payload.path, out var modRoot);
        return Result(
            "voxmod_inspect_mod",
            "inspect",
            manifest.id + ": scenes=" + CountSerialized(manifest, "Scenes") + " items=" + CountSerialized(manifest, "Items"),
            manifest.id,
            modRoot,
            new[] { AssetDatabase.GetAssetPath(manifest) },
            mods: new[] { SummarizeManifest(manifest, modRoot) });
    }

    private static string AddItemJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<ManifestEntryPayload>(argsJson ?? "{}") ?? new ManifestEntryPayload();
        var manifest = ResolveManifest(RequireText(payload.modId, "modId"), "", out var modRoot);
        UpsertManifestEntry(manifest, "Items", RequireText(payload.name, "name"), RequireAssetPath(payload.prefabPath, "prefabPath"), payload.iconPath, payload.itemType);
        return Result("voxmod_add_item", "manifest", "Added item " + payload.name + ".", manifest.id, modRoot, new[] { AssetDatabase.GetAssetPath(manifest), NormalizeAssetPath(payload.prefabPath) });
    }

    private static string AddSceneJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<ManifestEntryPayload>(argsJson ?? "{}") ?? new ManifestEntryPayload();
        var manifest = ResolveManifest(RequireText(payload.modId, "modId"), "", out var modRoot);
        UpsertManifestEntry(manifest, "Scenes", RequireText(payload.name, "name"), RequireAssetPath(payload.prefabPath, "prefabPath"), payload.iconPath, "");
        return Result("voxmod_add_scene", "manifest", "Added scene " + payload.name + ".", manifest.id, modRoot, new[] { AssetDatabase.GetAssetPath(manifest), NormalizeAssetPath(payload.prefabPath) });
    }

    private static string BindJsComponentJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<BindPayload>(argsJson ?? "{}") ?? new BindPayload();
        var prefabPath = RequireAssetPath(payload.prefabPath, "prefabPath");
        var root = PrefabUtility.LoadPrefabContents(prefabPath);
        try
        {
            var proxyType = ResolveType("VoxelPlayground.Mod.JsComponentProxy");
            var proxy = root.GetComponent(proxyType) ?? root.AddComponent(proxyType);
            var so = new SerializedObject(proxy);
            SetSerializedScalar(so, "modId", RequireText(payload.modId, "modId"));
            SetSerializedScalar(so, "className", RequireText(payload.className, "className"));
            so.ApplyModifiedProperties();
            PrefabUtility.SaveAsPrefabAsset(root, prefabPath);
        }
        finally
        {
            PrefabUtility.UnloadPrefabContents(root);
        }

        AssetDatabase.SaveAssets();
        return Result("voxmod_bind_js_component", "prefab", "Bound " + payload.className + " on " + prefabPath + ".", payload.modId, Path.GetDirectoryName(prefabPath), new[] { prefabPath });
    }

    private static string SetJsPropertyJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<JsPropertyPayload>(argsJson ?? "{}") ?? new JsPropertyPayload();
        var prefabPath = RequireAssetPath(payload.prefabPath, "prefabPath");
        var root = PrefabUtility.LoadPrefabContents(prefabPath);
        try
        {
            var type = ResolveType("VoxelPlayground.Mod.JsProperties");
            var props = root.GetComponent(type) ?? root.AddComponent(type);
            var so = new SerializedObject(props);
            UpsertJsPair(so, payload, root);
            so.ApplyModifiedProperties();
            var invalidate = props.GetType().GetMethod("InvalidatePairsCache", BindingFlags.Public | BindingFlags.Instance);
            if (invalidate != null) invalidate.Invoke(props, null);
            PrefabUtility.SaveAsPrefabAsset(root, prefabPath);
        }
        finally
        {
            PrefabUtility.UnloadPrefabContents(root);
        }

        AssetDatabase.SaveAssets();
        return Result("voxmod_set_js_property", "prefab", "Set JsProperties." + payload.key + ".", "", Path.GetDirectoryName(prefabPath), new[] { prefabPath });
    }

    private static string ConvertVoxJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<PathPayload>(argsJson ?? "{}") ?? new PathPayload();
        var path = RequireAssetPath(payload.path, "path");
        if (!path.EndsWith(".vox", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("path must point to a .vox asset.");

        var toolsType = ResolveType("VoxModTools");
        var method = toolsType.GetMethod(payload.building ? "Convert_Building" : "Convert", BindingFlags.Public | BindingFlags.Static);
        if (method == null) throw new InvalidOperationException("VoxModTools conversion method not found.");
        method.Invoke(null, new object[] { path });
        AssetDatabase.Refresh();
        return Result("voxmod_convert_vox_to_prefab", "asset", "Converted " + path + ".", "", "", new[] { path });
    }

    private static string ValidateModJson(string argsJson)
    {
        var payload = JsonUtility.FromJson<PathPayload>(argsJson ?? "{}") ?? new PathPayload();
        var manifest = ResolveManifest(payload.modId, payload.path, out var modRoot);
        var errors = new List<string>();
        ValidateManifestList(manifest, "Items", errors);
        ValidateManifestList(manifest, "Scenes", errors);
        ValidateTsExports(manifest, modRoot, errors);
        return Result(
            "voxmod_validate_mod",
            "validate",
            errors.Count == 0 ? "Validated " + manifest.id + "." : "Validation found " + errors.Count + " issue(s).",
            manifest.id,
            modRoot,
            new[] { AssetDatabase.GetAssetPath(manifest) },
            recoverableErrors: errors.ToArray());
    }

    private static string RecipeCatalogJson(string argsJson)
    {
        if (!File.Exists(ToAbsolute(RecipeCatalogPath)))
            return Result("voxmod_recipe_catalog", "recipe", "Recipe catalog missing.", recoverableErrors: new[] { RecipeCatalogPath });
        return File.ReadAllText(ToAbsolute(RecipeCatalogPath));
    }

    private static void UpsertManifestEntry(ModManifestV2 manifest, string listName, string name, string prefabPath, string iconPath, string itemType)
    {
        var so = new SerializedObject(manifest);
        var list = so.FindProperty(listName);
        if (list == null || !list.isArray) throw new InvalidOperationException("Manifest list not found: " + listName);

        var index = -1;
        for (var i = 0; i < list.arraySize; i++)
        {
            if (list.GetArrayElementAtIndex(i).FindPropertyRelative("name")?.stringValue == name)
                index = i;
        }

        if (index < 0)
        {
            list.InsertArrayElementAtIndex(list.arraySize);
            index = list.arraySize - 1;
        }

        var item = list.GetArrayElementAtIndex(index);
        item.FindPropertyRelative("name").stringValue = name;
        item.FindPropertyRelative("prefab").objectReferenceValue = LoadAsset<GameObject>(prefabPath);

        var iconProp = item.FindPropertyRelative("icon");
        if (iconProp != null && !string.IsNullOrWhiteSpace(iconPath))
            iconProp.objectReferenceValue = LoadAsset<UnityEngine.Object>(iconPath);

        var typeProp = item.FindPropertyRelative("itemType");
        if (typeProp != null && !string.IsNullOrWhiteSpace(itemType))
            typeProp.enumValueIndex = int.TryParse(itemType, out var idx) ? idx : 0;

        so.ApplyModifiedProperties();
        EditorUtility.SetDirty(manifest);
        AssetDatabase.SaveAssets();
    }

    private static void UpsertJsPair(SerializedObject so, JsPropertyPayload payload, GameObject root)
    {
        var key = RequireText(payload.key, "key");
        var kind = RequireText(payload.kind, "kind");
        var listName = GetJsPairListName(kind);
        var list = so.FindProperty(listName);
        if (list == null || !list.isArray) throw new InvalidOperationException("JsProperties list not found: " + listName);

        var index = FindPairIndex(list, key);
        if (index < 0)
        {
            list.InsertArrayElementAtIndex(list.arraySize);
            index = list.arraySize - 1;
        }

        var item = list.GetArrayElementAtIndex(index);
        var indexProperty = item.FindPropertyRelative("index");
        if (indexProperty != null) indexProperty.intValue = index;
        item.FindPropertyRelative("key").stringValue = key;
        var value = item.FindPropertyRelative("value");
        if (value == null) throw new InvalidOperationException("JsProperties pair value field not found.");

        if (kind == "string") value.stringValue = payload.value ?? "";
        else if (kind == "number") value.doubleValue = double.Parse(RequireText(payload.value, "value"), System.Globalization.CultureInfo.InvariantCulture);
        else if (kind == "boolean") value.boolValue = string.Equals(payload.value, "true", StringComparison.OrdinalIgnoreCase);
        else if (kind == "object") value.objectReferenceValue = LoadAsset<UnityEngine.Object>(RequireText(payload.objectPath, "objectPath"));
        else if (kind == "gameObject") value.objectReferenceValue = ResolvePrefabObject(root, payload.objectPath, "");
        else if (kind == "component") value.objectReferenceValue = ResolvePrefabObject(root, payload.objectPath, RequireText(payload.componentType, "componentType"));
        else if (kind == "gameObjectArray")
        {
            value.ClearArray();
            foreach (var objectPath in payload.objectPaths ?? new string[0])
            {
                value.InsertArrayElementAtIndex(value.arraySize);
                value.GetArrayElementAtIndex(value.arraySize - 1).objectReferenceValue = ResolvePrefabObject(root, objectPath, "");
            }
        }
    }

    private static string GetJsPairListName(string kind)
    {
        if (kind == "string") return "StringPairs";
        if (kind == "number") return "NumberPairs";
        if (kind == "boolean") return "BooleanPairs";
        if (kind == "object") return "ObjectPairs";
        if (kind == "gameObject") return "ObjectPairs";
        if (kind == "component") return "ComponentPairs";
        if (kind == "gameObjectArray") return "GameObjectArrayPairs";
        throw new InvalidOperationException("Unsupported JsProperties kind: " + kind);
    }

    private static int FindPairIndex(SerializedProperty list, string key)
    {
        for (var i = 0; i < list.arraySize; i++)
        {
            if (list.GetArrayElementAtIndex(i).FindPropertyRelative("key")?.stringValue == key)
                return i;
        }
        return -1;
    }

    private static UnityEngine.Object ResolvePrefabObject(GameObject root, string childPath, string componentType)
    {
        var transform = string.IsNullOrWhiteSpace(childPath) ? root.transform : root.transform.Find(childPath);
        if (transform == null) throw new InvalidOperationException("Prefab child not found: " + childPath);
        if (string.IsNullOrWhiteSpace(componentType)) return transform.gameObject;
        var type = ResolveType(componentType);
        var component = transform.GetComponent(type);
        if (component == null) throw new InvalidOperationException("Component not found on child: " + componentType);
        return component;
    }

    private static void ValidateManifestList(ModManifestV2 manifest, string listName, List<string> errors)
    {
        var so = new SerializedObject(manifest);
        var list = so.FindProperty(listName);
        if (list == null)
        {
            errors.Add("Missing manifest list " + listName + ".");
            return;
        }

        for (var i = 0; i < list.arraySize; i++)
        {
            var item = list.GetArrayElementAtIndex(i);
            var name = item.FindPropertyRelative("name")?.stringValue ?? "#" + i;
            var prefab = item.FindPropertyRelative("prefab")?.objectReferenceValue as GameObject;
            if (prefab == null)
            {
                errors.Add(listName + "." + name + ": missing prefab.");
                continue;
            }

            var proxy = prefab.GetComponent(ResolveType("VoxelPlayground.Mod.JsComponentProxy"));
            if (proxy == null)
                errors.Add(listName + "." + name + ": missing JsComponentProxy.");
        }
    }

    private static void ValidateTsExports(ModManifestV2 manifest, string modRoot, List<string> errors)
    {
        var index = modRoot + "/Scripts/index.ts";
        if (!File.Exists(ToAbsolute(index)))
        {
            errors.Add("Missing Scripts/index.ts.");
            return;
        }

        var text = File.ReadAllText(ToAbsolute(index));
        var so = new SerializedObject(manifest);
        foreach (var listName in new[] { "Items", "Scenes" })
        {
            var list = so.FindProperty(listName);
            if (list == null) continue;
            for (var i = 0; i < list.arraySize; i++)
            {
                var prefab = list.GetArrayElementAtIndex(i).FindPropertyRelative("prefab")?.objectReferenceValue as GameObject;
                if (prefab == null) continue;
                var proxy = prefab.GetComponent(ResolveType("VoxelPlayground.Mod.JsComponentProxy"));
                if (proxy == null) continue;
                var proxySo = new SerializedObject(proxy);
                var className = proxySo.FindProperty("className")?.stringValue ?? "";
                if (!string.IsNullOrWhiteSpace(className) && !text.Contains(className))
                    errors.Add("Scripts/index.ts does not export " + className + ".");
            }
        }
    }

    private static ModManifestV2 ResolveManifest(string modId, string path, out string modRoot)
    {
        modRoot = "";
        if (!string.IsNullOrWhiteSpace(path))
        {
            var normalized = NormalizeAssetPath(path);
            modRoot = AssetDatabase.IsValidFolder(normalized) ? normalized : Path.GetDirectoryName(normalized).Replace("\\", "/");
            var direct = AssetDatabase.LoadAssetAtPath<ModManifestV2>(normalized);
            if (direct != null) return direct;
            return FindManifestInFolder(modRoot);
        }

        if (string.IsNullOrWhiteSpace(modId))
            throw new InvalidOperationException("Either modId or path is required.");

        foreach (var folder in FindModFolders())
        {
            var manifest = FindManifestInFolder(folder);
            if (manifest != null && string.Equals(manifest.id, modId, StringComparison.OrdinalIgnoreCase))
            {
                modRoot = folder;
                return manifest;
            }
        }

        throw new InvalidOperationException("Mod manifest not found: " + modId);
    }

    private static ModManifestV2 FindManifestInFolder(string folder)
    {
        var guid = AssetDatabase.FindAssets("t:ModManifestV2", new[] { folder }).FirstOrDefault();
        if (string.IsNullOrEmpty(guid)) throw new InvalidOperationException("No ModManifestV2 found in " + folder);
        return AssetDatabase.LoadAssetAtPath<ModManifestV2>(AssetDatabase.GUIDToAssetPath(guid));
    }

    private static IEnumerable<string> FindModFolders()
    {
        foreach (var root in new[] { "Assets/Mod", "Assets/Samples" })
        {
            if (!AssetDatabase.IsValidFolder(root)) continue;
            foreach (var folder in AssetDatabase.GetSubFolders(root))
            {
                if (AssetDatabase.FindAssets("t:ModManifestV2", new[] { folder }).Length > 0)
                    yield return folder;
            }
        }
    }

    private static ModSummary TrySummarize(string folder)
    {
        try
        {
            return SummarizeManifest(FindManifestInFolder(folder), folder);
        }
        catch
        {
            return null;
        }
    }

    private static ModSummary SummarizeManifest(ModManifestV2 manifest, string modRoot)
    {
        return new ModSummary
        {
            modId = manifest.id,
            modName = manifest.modName,
            author = manifest.author,
            modRoot = modRoot,
            manifestPath = AssetDatabase.GetAssetPath(manifest),
            scenes = CountSerialized(manifest, "Scenes"),
            items = CountSerialized(manifest, "Items")
        };
    }

    private static int CountSerialized(UnityEngine.Object asset, string property)
    {
        var p = new SerializedObject(asset).FindProperty(property);
        return p != null && p.isArray ? p.arraySize : 0;
    }

    private static void SetSerializedScalar(SerializedObject so, string propertyPath, string value)
    {
        var property = so.FindProperty(propertyPath);
        if (property == null) throw new InvalidOperationException("Serialized property not found: " + propertyPath);
        property.stringValue = value ?? "";
    }

    private static T LoadAsset<T>(string path) where T : UnityEngine.Object
    {
        var normalized = RequireAssetPath(path, "path");
        var asset = AssetDatabase.LoadAssetAtPath<T>(normalized);
        if (asset == null) throw new InvalidOperationException("Asset not found: " + normalized);
        return asset;
    }

    private static Type ResolveType(string typeName)
    {
        foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
        {
            Type[] types;
            try
            {
                types = assembly.GetTypes();
            }
            catch
            {
                continue;
            }

            var type = types.FirstOrDefault(t => t.FullName == typeName || t.Name == typeName);
            if (type != null) return type;
        }
        throw new InvalidOperationException("Type not found: " + typeName);
    }

    private static bool CanResolveType(string typeName)
    {
        try
        {
            ResolveType(typeName);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static void RegisterTool(ToolSpec spec)
    {
        var registry = FindType("Pie.PieUnityCapabilityRegistry");
        if (registry == null)
        {
            Debug.LogWarning("[VoxModPieRpcExtensions] PieUnityCapabilityRegistry is not loaded; " + spec.Name + " will be retried.");
            return;
        }

        var descriptorType = FindType("Pie.PieUnityParameterDescriptor");
        if (descriptorType == null)
        {
            Debug.LogWarning("[VoxModPieRpcExtensions] PieUnityParameterDescriptor is not loaded; " + spec.Name + " will be retried.");
            return;
        }

        var parameters = BuildParameterDescriptors(descriptorType, spec.Parameters ?? Params());
        var registerProjectTool = registry.GetMethods(BindingFlags.Public | BindingFlags.Static).FirstOrDefault(m => m.Name == "RegisterProjectTool");
        if (registerProjectTool != null && InvokeRegister(registerProjectTool, spec, parameters))
        {
            RegisteredTools.Add(spec.Name);
            return;
        }

        var registerTool = registry.GetMethods(BindingFlags.Public | BindingFlags.Static).FirstOrDefault(m => m.Name == "RegisterTool");
        if (registerTool != null && InvokeRegister(registerTool, spec, parameters))
            RegisteredTools.Add(spec.Name);
    }

    private static bool InvokeRegister(MethodInfo method, ToolSpec spec, Array parameters)
    {
        try
        {
            var infos = method.GetParameters();
            var args = new object[infos.Length];
            for (var i = 0; i < infos.Length; i++)
            {
                var p = infos[i];
                if (p.Name == "name") args[i] = spec.Name;
                else if (p.Name == "ns") args[i] = Namespace;
                else if (p.Name == "owner") args[i] = Owner;
                else if (p.Name == "description") args[i] = spec.Description;
                else if (p.Name == "mode") args[i] = "editor";
                else if (p.Name == "readOnly") args[i] = spec.ReadOnly;
                else if (p.Name == "deprecated") args[i] = false;
                else if (p.Name == "aliases") args[i] = null;
                else if (p.Name == "parameters") args[i] = parameters;
                else if (p.Name == "handler") args[i] = spec.Handler;
                else if (p.Name == "capabilityKind") args[i] = "project";
                else if (p.Name == "convenience") args[i] = false;
                else if (p.Name == "requiresMainThread") args[i] = true;
                else if (p.Name == "writeScope") args[i] = spec.WriteScope ?? "project";
                else if (p.Name == "returns") args[i] = spec.Returns ?? "";
                else if (p.Name == "recommendedWorkflow") args[i] = spec.RecommendedWorkflow ?? "";
                else if (p.Name == "examples") args[i] = spec.Examples;
                else if (p.Name == "errorCodes") args[i] = spec.ErrorCodes;
                else if (p.Name == "destructive") args[i] = false;
                else if (p.Name == "canTriggerDomainReload") args[i] = spec.CanTriggerDomainReload;
                else if (p.HasDefaultValue) args[i] = p.DefaultValue;
                else args[i] = p.ParameterType.IsValueType ? Activator.CreateInstance(p.ParameterType) : null;
            }

            method.Invoke(null, args);
            return true;
        }
        catch (Exception e)
        {
            Debug.LogWarning("[VoxModPieRpcExtensions] Failed to register " + spec.Name + ": " + e.Message);
            return false;
        }
    }

    private static Array BuildParameterDescriptors(Type descriptorType, ParamSpec[] specs)
    {
        var array = Array.CreateInstance(descriptorType, specs.Length);
        for (var i = 0; i < specs.Length; i++)
        {
            var descriptor = Activator.CreateInstance(descriptorType);
            descriptorType.GetField("name")?.SetValue(descriptor, specs[i].Name);
            descriptorType.GetField("type")?.SetValue(descriptor, specs[i].Type);
            descriptorType.GetField("required")?.SetValue(descriptor, specs[i].Required);
            array.SetValue(descriptor, i);
        }
        return array;
    }

    private static bool IsRegistered(string name)
    {
        var registry = FindType("Pie.PieUnityCapabilityRegistry");
        var hasTool = registry?.GetMethods(BindingFlags.Public | BindingFlags.Static).FirstOrDefault(m => m.Name == "HasTool");
        return hasTool != null && (bool)hasTool.Invoke(null, new object[] { name });
    }

    private static Type FindType(string typeName)
    {
        foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
        {
            Type type;
            try
            {
                type = assembly.GetType(typeName);
            }
            catch
            {
                continue;
            }

            if (type != null) return type;
        }

        return null;
    }

    private static string Result(
        string tool,
        string phase,
        string summary,
        string modId = "",
        string modRoot = "",
        string[] assets = null,
        string[] warnings = null,
        string[] recoverableErrors = null,
        ModSummary[] mods = null)
    {
        return JsonUtility.ToJson(new VoxRpcResult
        {
            ok = recoverableErrors == null || recoverableErrors.Length == 0,
            tool = tool,
            phase = phase,
            summary = summary,
            modId = modId ?? "",
            modRoot = modRoot ?? "",
            assetPaths = assets ?? new string[0],
            warnings = warnings ?? new string[0],
            recoverableErrors = recoverableErrors ?? new string[0],
            mods = mods ?? new ModSummary[0]
        });
    }

    private static ParamSpec[] Params(params ParamSpec[] specs) => specs ?? new ParamSpec[0];
    private static ParamSpec Required(string name, string type) => new ParamSpec(name, type, true);
    private static ParamSpec Optional(string name, string type) => new ParamSpec(name, type, false);

    private static string RequireText(string value, string field)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new InvalidOperationException(field + " is required.");
        return value.Trim();
    }

    private static string RequireAssetPath(string value, string field)
    {
        var normalized = NormalizeAssetPath(RequireText(value, field));
        if (!normalized.StartsWith("Assets/", StringComparison.Ordinal) && normalized != "Assets")
            throw new InvalidOperationException(field + " must be an asset path under Assets.");
        return normalized;
    }

    private static string ProjectRoot() => Directory.GetParent(Application.dataPath).FullName;
    private static string ToAbsolute(string assetPath) => Path.Combine(ProjectRoot(), assetPath).Replace("\\", "/");
    private static string NormalizeAssetPath(string path) => (path ?? "").Replace("\\", "/").Trim();

    private static string GetModId(string author, string modName)
    {
        return SanitizeModId("com." + SanitizeIdPart(author) + "." + SanitizeIdPart(modName));
    }

    private static string SanitizeModId(string value)
    {
        var parts = value.ToLowerInvariant().Split(new[] { '.' }, StringSplitOptions.RemoveEmptyEntries).Select(SanitizeIdPart).Where(p => p.Length > 0);
        return string.Join(".", parts.ToArray());
    }

    private static string SanitizeIdPart(string value)
    {
        var builder = new StringBuilder();
        foreach (var c in (value ?? "").ToLowerInvariant())
        {
            if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) builder.Append(c);
            else if (c == '-' || c == '_' || c == ' ') builder.Append('-');
        }
        return builder.ToString().Trim('-');
    }

    private static string ToClassName(string value)
    {
        var builder = new StringBuilder();
        var uppercaseNext = true;
        foreach (var c in value ?? "")
        {
            if (char.IsLetterOrDigit(c))
            {
                builder.Append(uppercaseNext ? char.ToUpperInvariant(c) : c);
                uppercaseNext = false;
            }
            else
            {
                uppercaseNext = true;
            }
        }

        var result = builder.Length == 0 ? "GeneratedMod" : builder.ToString();
        return char.IsDigit(result[0]) ? "Mod" + result : result;
    }

    private static string ToAssetFileName(string value)
    {
        var sanitized = SanitizeIdPart(value).Replace("-", "");
        return string.IsNullOrWhiteSpace(sanitized) ? "generatedmod" : sanitized;
    }

    private static void EnsureAssetFolder(string path)
    {
        var parts = NormalizeAssetPath(path).Split('/');
        var current = parts[0];
        if (current != "Assets") throw new InvalidOperationException("Path must start under Assets.");
        for (var i = 1; i < parts.Length; i++)
        {
            var next = current + "/" + parts[i];
            if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, parts[i]);
            current = next;
        }
    }

    private static string TsConfigText() => @"{
  ""compilerOptions"": {
    ""target"": ""ES2016"",
    ""module"": ""ES2015"",
    ""outDir"": ""./out"",
    ""rootDir"": ""./Scripts"",
    ""strict"": true,
    ""esModuleInterop"": true,
    ""skipLibCheck"": true,
    ""typeRoots"": [""../../Plugins/Core/Gen/Typing""]
  },
  ""include"": [""Scripts/**/*.ts""],
  ""exclude"": [""Scripts/**/*.mjs"", ""out/**/*""]
}
";

    private static string ComponentTemplate(string className) => @"export class " + className + @" {
    private bindTo: VX.Mod.JsComponentProxy;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onDestroy(): void {
    }
}
";
}
#endif
