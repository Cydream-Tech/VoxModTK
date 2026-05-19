#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Mod;
using VoxelPlayground.Mod.Serialization;

/// <summary>
/// VoxMod Exporter Window V3 - Uses puerts (TypeScript) instead of HybridCLR
/// Exports mods with JSON prefab serialization instead of Addressables
/// </summary>
public class VoxModExporterWindowV3 : EditorWindow
{
    private class CompileWatchProcessInfo
    {
        public string ModFolder;
        public string ModId;
        public FileSystemWatcher Watcher;
        public string ScriptsRoot;
        public string OutputDir;
        public string DebounceTimerId;
        public EditorApplication.CallbackFunction DebounceAction;
    }

    private static readonly List<string> ModRootPaths = new List<string>
    {
        "Assets/Mod",
        "Assets/Samples",
    };
    private const string ExportRootFolderName = "Export/";
    private const string SelectionStatePath = "Assets/modmanifest_v3_selection_state.json";
    private static readonly Dictionary<string, CompileWatchProcessInfo> ActiveCompileWatchProcesses = new Dictionary<string, CompileWatchProcessInfo>();
    private static bool lifecycleHooksRegistered;

    [System.Serializable]
    public class ManifestSelectionData
    {
        public string modFolder;
        public bool isSelected;
        public bool isCompileWatchEnabled;

        public ManifestSelectionData(string modFolder, bool isSelected, bool isCompileWatchEnabled)
        {
            this.modFolder = modFolder;
            this.isSelected = isSelected;
            this.isCompileWatchEnabled = isCompileWatchEnabled;
        }
    }

    [System.Serializable]
    public class SelectionState
    {
        public List<ManifestSelectionData> selections = new List<ManifestSelectionData>();
    }

    private List<string> modDirectories = new List<string>();
    private Dictionary<string, bool> manifestSelections = new Dictionary<string, bool>();
    private Dictionary<string, bool> compileWatchSelections = new Dictionary<string, bool>();
    private Vector2 scrollPosition;

    private string statusMessage;
    private bool statusIsError;
    private GUIStyle statusStyle;

    private void SetStatus(string message, bool isError)
    {
        statusMessage = $"{message} - {DateTime.Now:yyyy-MM-dd HH:mm:ss}";
        statusIsError = isError;
        Repaint();
    }

    [MenuItem("Vox Mod Tools/Mod Exporter")]
    public static void ShowWindow()
    {
        var window = GetWindow<VoxModExporterWindowV3>("Vox Mod Exporter V3");
        window.minSize = new Vector2(450, 500);
        window.Show();
    }

    private void OnEnable()
    {
        RegisterLifecycleHooks();
        LoadSelectionState();
        RefreshModList();
        RestoreCompileWatchProcesses();
    }

    private void OnDisable()
    {
        SaveSelectionState();
    }

    /// <summary>It is compatible with the old version that only saves the selection status of subfolder names and unifies it to the complete Asset path.</summary>
    private static string ResolveSavedModFolderKey(string saved)
    {
        if (string.IsNullOrEmpty(saved))
            return saved;
        saved = saved.Replace("\\", "/");
        if (AssetDatabase.IsValidFolder(saved))
            return saved;
        foreach (var root in ModRootPaths)
        {
            var candidate = Path.Combine(root, saved).Replace("\\", "/");
            if (AssetDatabase.IsValidFolder(candidate))
                return candidate;
        }

        return saved;
    }

    private void RefreshModList()
    {
        modDirectories.Clear();

        foreach (var root in ModRootPaths)
        {
            if (!AssetDatabase.IsValidFolder(root))
                continue;

            var modFolders = AssetDatabase.GetSubFolders(root);
            foreach (var folder in modFolders)
            {
                if (TryLoadManifest(folder, out _))
                {
                    modDirectories.Add(folder);
                    if (!manifestSelections.ContainsKey(folder))
                    {
                        manifestSelections[folder] = true;
                    }

                    if (!compileWatchSelections.ContainsKey(folder))
                    {
                        compileWatchSelections[folder] = false;
                    }
                }
            }
        }

        modDirectories = modDirectories.OrderBy(p => p, StringComparer.OrdinalIgnoreCase).ToList();
    }

    private void SaveSelectionState()
    {
        try
        {
            SelectionState state = new SelectionState();
            foreach (var kvp in manifestSelections)
            {
                state.selections.Add(new ManifestSelectionData(
                    kvp.Key,
                    kvp.Value,
                    compileWatchSelections.TryGetValue(kvp.Key, out var isCompileWatchEnabled) && isCompileWatchEnabled));
            }

            string json = JsonUtility.ToJson(state, true);
            File.WriteAllText(SelectionStatePath, json);
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogError("Failed to save selection state: " + e.Message);
        }
    }

    private void LoadSelectionState()
    {
        try
        {
            if (File.Exists(SelectionStatePath))
            {
                string json = File.ReadAllText(SelectionStatePath);
                SelectionState state = JsonUtility.FromJson<SelectionState>(json);

                manifestSelections.Clear();
                foreach (var selection in state.selections)
                {
                    var key = ResolveSavedModFolderKey(selection.modFolder);
                    manifestSelections[key] = selection.isSelected;
                    compileWatchSelections[key] = selection.isCompileWatchEnabled;
                }
            }
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogError("Failed to load selection state: " + e.Message);
        }
    }

    private void OnGUI()
    {
        EditorGUILayout.LabelField("Vox Mod Exporter", EditorStyles.boldLabel);

        EditorGUILayout.Space(10);

        // Manifest list header
        EditorGUILayout.LabelField("Available Mods:", EditorStyles.boldLabel);

        // Selection buttons
        GUILayout.BeginHorizontal();
        if (GUILayout.Button("Select All", GUILayout.Width(100)))
        {
            foreach (var folder in modDirectories)
            {
                manifestSelections[folder] = true;
            }
            SaveSelectionState();
        }
        if (GUILayout.Button("Deselect All", GUILayout.Width(100)))
        {
            foreach (var folder in modDirectories)
            {
                manifestSelections[folder] = false;
            }
            SaveSelectionState();
        }
        if (GUILayout.Button("Invert", GUILayout.Width(80)))
        {
            foreach (var folder in modDirectories)
            {
                manifestSelections[folder] = !manifestSelections[folder];
            }
            SaveSelectionState();
        }
        GUILayout.EndHorizontal();

        EditorGUILayout.Space(5);

        // Scrollable manifest list
        scrollPosition = GUILayout.BeginScrollView(
            scrollPosition,
            GUILayout.MinHeight(100),
            GUILayout.ExpandHeight(true),
            GUILayout.MaxHeight(500));

        if (modDirectories.Count == 0)
        {
            EditorGUILayout.HelpBox(
                $"No mods with ModManifestV2 found under: {string.Join(", ", ModRootPaths)}",
                MessageType.Warning);
        }
        else
        {
            foreach (var modFolder in modDirectories)
            {
                if (!TryLoadManifest(modFolder, out var manifest))
                    continue;

                EditorGUILayout.BeginHorizontal();

                // Selection checkbox
                bool isSelected = manifestSelections.ContainsKey(modFolder) ? manifestSelections[modFolder] : true;
                bool newValue = EditorGUILayout.Toggle(isSelected, GUILayout.Width(20));
                if (newValue != isSelected)
                {
                    manifestSelections[modFolder] = newValue;
                    SaveSelectionState();
                }

                // Manifest info
                EditorGUILayout.BeginVertical();
                EditorGUILayout.LabelField($"{manifest.modName} by {manifest.author}", EditorStyles.boldLabel);
                EditorGUILayout.LabelField($"ID: {manifest.id}", EditorStyles.miniLabel);
                EditorGUILayout.LabelField($"Path: {modFolder}", EditorStyles.miniLabel);
                EditorGUILayout.LabelField($"Scenes: {manifest.Scenes?.Count ?? 0} | Items: {manifest.Items?.Count ?? 0}",
                    EditorStyles.miniLabel);
                EditorGUILayout.LabelField(GetCompileWatchStatusLabel(modFolder, manifest), EditorStyles.miniLabel);
                EditorGUILayout.EndVertical();

                var watchEnabled = IsCompileWatchEnabled(modFolder);
                var watchLabel = watchEnabled ? "Stop Watch" : "Start Watch";
                if (GUILayout.Button(watchLabel, GUILayout.Width(95), GUILayout.Height(38)))
                {
                    ToggleCompileWatch(modFolder, manifest);
                }

                EditorGUILayout.EndHorizontal();
                EditorGUILayout.Space(5);
            }
        }

        GUILayout.EndScrollView();

        EditorGUILayout.Space(10);

        // Status banner (shown above Export header). Only the most recent message is kept.
        if (!string.IsNullOrEmpty(statusMessage))
        {
            if (statusStyle == null)
            {
                statusStyle = new GUIStyle(EditorStyles.boldLabel) { wordWrap = true };
            }
            statusStyle.normal.textColor = statusIsError
                ? new Color(0.85f, 0.20f, 0.20f)
                : new Color(0.10f, 0.65f, 0.20f);
            EditorGUILayout.LabelField(statusMessage, statusStyle);
            EditorGUILayout.Space(4);
        }

        // Export buttons
        EditorGUILayout.LabelField("Export", EditorStyles.boldLabel);

        if (GUILayout.Button("Export Selected Mods", GUILayout.Height(30)))
        {
            ExportSelectedMods();
        }

        EditorGUILayout.Space(5);

        // Install buttons
        EditorGUILayout.LabelField("Install", EditorStyles.boldLabel);

        GUILayout.BeginHorizontal();
        if (GUILayout.Button("Install Mods on Windows", GUILayout.Height(25)))
        {
            InstallModsOnWindows();
        }
        if (GUILayout.Button("Install Mods on Android", GUILayout.Height(25)))
        {
            InstallModsOnAndroid();
        }
        GUILayout.EndHorizontal();

        EditorGUILayout.Space(5);

        // Utility buttons
        EditorGUILayout.LabelField("Utilities", EditorStyles.boldLabel);

        if (GUILayout.Button("Refresh Mod List"))
        {
            RefreshModList();
            RestoreCompileWatchProcesses();
        }
        if (GUILayout.Button("Open Export Directory"))
        {
            OpenExportDirectory();
        }

        if (GUILayout.Button("Open Mods Directory"))
        {
            OpenModsDirectory();
        }
        if (GUILayout.Button("Clean All Exports"))
        {
            CleanAllExports();
        }
    }

    private List<string> GetSelectedModFolders()
    {
        var selected = new List<string>();
        foreach (var folderName in modDirectories)
        {
            if (manifestSelections.ContainsKey(folderName) && manifestSelections[folderName])
            {
                selected.Add(folderName);
            }
        }
        return selected;
    }

    private bool IsCompileWatchEnabled(string modFolder)
    {
        return compileWatchSelections.TryGetValue(modFolder, out var enabled) && enabled;
    }

    private string GetCompileWatchStatusLabel(string modFolder, ModManifestV2 manifest)
    {
        if (!IsCompileWatchEnabled(modFolder))
        {
            return "Compile Watch: Off";
        }

        if (manifest == null)
        {
            return "Compile Watch: On";
        }

        return IsCompileWatchRunning(manifest.id)
            ? "Compile Watch: On (running)"
            : "Compile Watch: On (stopped)";
    }

    private void ToggleCompileWatch(string modFolder, ModManifestV2 manifest)
    {
        var enable = !IsCompileWatchEnabled(modFolder);
        compileWatchSelections[modFolder] = enable;
        SaveSelectionState();

        if (!enable)
        {
            StopCompileWatchByModId(manifest.id);
            return;
        }

        if (!TryStartCompileWatch(modFolder, manifest, out var errorMessage))
        {
            compileWatchSelections[modFolder] = false;
            SaveSelectionState();
            SetStatus($"Compile Watch failed: {errorMessage}", true);
        }
    }

    private void RestoreCompileWatchProcesses()
    {
        foreach (var modFolder in modDirectories)
        {
            if (!IsCompileWatchEnabled(modFolder))
            {
                continue;
            }

            if (!TryLoadManifest(modFolder, out var manifest))
            {
                continue;
            }

            if (IsCompileWatchRunning(manifest.id))
            {
                continue;
            }

            if (!TryStartCompileWatch(modFolder, manifest, out var errorMessage))
            {
                UnityEngine.Debug.LogError($"[VoxModExporterV3] Failed to restore compile watch for '{modFolder}': {errorMessage}");
            }
        }
    }

    private void ExportSelectedMods()
    {
        var selectedFolders = GetSelectedModFolders();

        if (selectedFolders.Count == 0)
        {
            SetStatus("Export failed: no mods selected", true);
            return;
        }

        int successCount = 0;
        int failCount = 0;
        List<string> errors = new List<string>();

        foreach (var modAssetPath in selectedFolders)
        {
            if (ExportMod(modAssetPath, out var exportPath, out var errorMessage))
            {
                successCount++;
                UnityEngine.Debug.Log($"[VoxModExporterV3] Exported '{modAssetPath}' to: {exportPath}");
            }
            else
            {
                failCount++;
                errors.Add($"{modAssetPath}: {errorMessage}");
                UnityEngine.Debug.LogError($"[VoxModExporterV3] Failed to export '{modAssetPath}': {errorMessage}");
            }
        }

        AssetDatabase.Refresh();

        if (failCount == 0)
        {
            SetStatus($"Export succeeded ({successCount} mod{(successCount == 1 ? "" : "s")})", false);
        }
        else
        {
            var firstError = errors.Count > 0 ? errors[0] : string.Empty;
            SetStatus($"Export failed ({failCount} of {successCount + failCount}): {firstError}", true);
        }
    }

    private bool ExportMod(string modAssetPath, out string exportFolderPath, out string errorMessage)
    {
        exportFolderPath = string.Empty;
        errorMessage = string.Empty;

        if (string.IsNullOrWhiteSpace(modAssetPath))
        {
            errorMessage = "Mod asset path cannot be empty.";
            return false;
        }

        var modFolder = modAssetPath.Replace("\\", "/");
        if (!TryLoadManifest(modFolder, out var manifest))
        {
            errorMessage = $"No ModManifestV2 found in {modFolder}.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(manifest.author) || string.IsNullOrWhiteSpace(manifest.modName))
        {
            errorMessage = "Manifest author and modName must both be set.";
            return false;
        }

        exportFolderPath = Path.Combine(GetProjectRootAbsolutePath(), ExportRootFolderName, manifest.id);
        var prefabsFolderPath = Path.Combine(exportFolderPath, "prefabs");
        var scriptsFolderPath = Path.Combine(exportFolderPath, "script");
        var dataFolderPath = Path.Combine(exportFolderPath, "data");
        var renderingFolderPath = Path.Combine(exportFolderPath, "rendering");

        try
        {
            // Clean and create directories
            if (Directory.Exists(exportFolderPath))
            {
                Directory.Delete(exportFolderPath, true);
            }

            Directory.CreateDirectory(exportFolderPath);
            Directory.CreateDirectory(prefabsFolderPath);
            Directory.CreateDirectory(scriptsFolderPath);
            Directory.CreateDirectory(dataFolderPath);
            Directory.CreateDirectory(renderingFolderPath);

            // Collect and serialize prefabs
            var prefabReferences = CollectPrefabReferences(manifest);
            var prefabJsonPathMap = new Dictionary<int, string>();
            var serializationContext = new SerializationContext(exportFolderPath);

            foreach (var prefab in prefabReferences)
            {
                var prefabFileName = $"{SanitizePathPart(prefab.name)}.prefab.json";
                var prefabRelativePath = $"prefabs/{prefabFileName}";
                var prefabExportPath = Path.Combine(prefabsFolderPath, prefabFileName);

                if (!SerializePrefabToJson(prefab, prefabExportPath, exportFolderPath))
                {
                    errorMessage = $"Failed to export prefab '{prefab.name}'.";
                    return false;
                }

                prefabJsonPathMap[prefab.GetInstanceID()] = prefabRelativePath;
            }

            // Export icons
            ExportIcons(manifest, exportFolderPath);

            // Build and write manifest.json
            var exportManifest = BuildExportManifest(manifest, prefabJsonPathMap, renderingFolderPath, serializationContext);
            var manifestPath = Path.Combine(exportFolderPath, "manifest.json");
            var manifestJson = JsonConvert.SerializeObject(exportManifest, Formatting.Indented);
            File.WriteAllText(manifestPath, manifestJson);

            // Compile TypeScript if available
            if (!CompileTypeScriptToExport(modFolder, scriptsFolderPath, out var compileError))
            {
                // TypeScript compilation failure is not fatal - mod may not have scripts
                UnityEngine.Debug.LogError($"[VoxModExporterV3] TypeScript compilation warning for '{modFolder}': {compileError}");
                errorMessage = "Failed to compile typeScript: " + compileError;
                return false;
            }

            // Archive exported folder to zip
            ArchiveToZip(exportFolderPath);

            return true;
        }
        catch (Exception e)
        {
            errorMessage = $"Export failed: {e.Message}";
            return false;
        }
    }

    private bool TryLoadManifest(string modFolderPath, out ModManifestV2 manifest)
    {
        manifest = null;
        if (!AssetDatabase.IsValidFolder(modFolderPath))
        {
            return false;
        }

        var manifestGuids = AssetDatabase.FindAssets("t:ModManifestV2", new[] { modFolderPath });
        foreach (var guid in manifestGuids)
        {
            var manifestAssetPath = AssetDatabase.GUIDToAssetPath(guid);
            var loaded = AssetDatabase.LoadAssetAtPath<ModManifestV2>(manifestAssetPath);
            if (loaded != null)
            {
                manifest = loaded;
                return true;
            }
        }

        return false;
    }

    private List<GameObject> CollectPrefabReferences(ModManifestV2 manifest)
    {
        var prefabs = new List<GameObject>();
        var uniquePrefabIds = new HashSet<int>();

        if (manifest.Scenes != null)
        {
            foreach (var scene in manifest.Scenes)
            {
                if (scene.prefab == null) continue;
                var id = scene.prefab.GetInstanceID();
                if (uniquePrefabIds.Add(id))
                {
                    prefabs.Add(scene.prefab);
                }
            }
        }

        if (manifest.Items != null)
        {
            foreach (var item in manifest.Items)
            {
                if (item.prefab == null) continue;
                var id = item.prefab.GetInstanceID();
                if (uniquePrefabIds.Add(id))
                {
                    prefabs.Add(item.prefab);
                }
            }
        }

        return prefabs;
    }

    private bool SerializePrefabToJson(GameObject prefab, string outputPath, string modPath)
    {
        if (prefab == null || string.IsNullOrEmpty(outputPath))
        {
            return false;
        }

        try
        {
            // Use JsonPrefabSerializer from VoxelPlayground.Mod.Serialization for full prefab serialization
            var serializationContext = new SerializationContext(modPath);
            return JsonPrefabSerializer.Serialize(prefab, outputPath, serializationContext);
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogError($"[VoxModExporterV3] Failed to serialize prefab '{prefab.name}': {e.Message}");
            return false;
        }
    }

    private void ExportIcons(ModManifestV2 manifest, string exportFolderPath)
    {
        var iconsFolderPath = Path.Combine(exportFolderPath, "icons");
        Directory.CreateDirectory(iconsFolderPath);

        // Export scene icons
        if (manifest.Scenes != null)
        {
            foreach (var scene in manifest.Scenes)
            {
                if (scene.icon != null)
                {
                    ExportSpriteIcon(scene.icon, iconsFolderPath, $"scene_{SanitizePathPart(scene.name)}");
                }
            }
        }

        // Export item icons
        if (manifest.Items != null)
        {
            foreach (var item in manifest.Items)
            {
                if (item.icon != null)
                {
                    ExportSpriteIcon(item.icon, iconsFolderPath, $"item_{SanitizePathPart(item.name)}");
                }
            }
        }
    }

    private void ExportSpriteIcon(Sprite icon, string iconsFolderPath, string fileName)
    {
        if (icon == null || icon.texture == null) return;

        try
        {
            var sourcePath = AssetDatabase.GetAssetPath(icon.texture);
            if (string.IsNullOrEmpty(sourcePath)) return;

            var destPath = Path.Combine(iconsFolderPath, $"{fileName}.png");
            File.Copy(sourcePath, destPath, true);
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogWarning($"[VoxModExporterV3] Failed to export icon '{fileName}': {e.Message}");
        }
    }

    private static bool CopyVoxelFilesToExport(List<GameObject> prefabs, string dataFolderPath, out string errorMessage)
        {
            errorMessage = string.Empty;
            var voxelFiles = new HashSet<TextAsset>();

            foreach (var prefab in prefabs)
            {
                if (prefab == null)
                {
                    continue;
                }

                var voxelProxies = prefab.GetComponentsInChildren<VoxelObjectProxy>(true);
                foreach (var voxelProxy in voxelProxies)
                {
                    if (voxelProxy.voxelFile != null)
                    {
                        voxelFiles.Add(voxelProxy.voxelFile);
                    }
                }
            }

            foreach (var voxelFile in voxelFiles)
            {
                if (voxelFile == null)
                {
                    continue;
                }

                var assetPath = AssetDatabase.GetAssetPath(voxelFile);
                if (string.IsNullOrEmpty(assetPath))
                {
                    errorMessage = $"Cannot find asset path for voxel file '{voxelFile.name}'.";
                    return false;
                }

                var sourceAbsolutePath = AssetPathToAbsolutePath(assetPath);
                if (!File.Exists(sourceAbsolutePath))
                {
                    errorMessage = $"Voxel file not found at '{sourceAbsolutePath}'.";
                    return false;
                }

                var sourceExtension = Path.GetExtension(sourceAbsolutePath);
                var destFileName = $"{voxelFile.name}{sourceExtension}";
                var destPath = Path.Combine(dataFolderPath, destFileName);

                try
                {
                    File.Copy(sourceAbsolutePath, destPath, true);
                }
                catch (Exception e)
                {
                    errorMessage = $"Failed to copy voxel file '{voxelFile.name}': {e.Message}";
                    return false;
                }
            }

            return true;
        }

    private ExportManifestData BuildExportManifest(
        ModManifestV2 manifest,
        Dictionary<int, string> prefabJsonPathMap,
        string renderingFolderPath,
        SerializationContext serializationContext)
    {
        var sceneExports = new List<ExportSceneData>();
        if (manifest.Scenes != null)
        {
            foreach (var scene in manifest.Scenes)
            {
                sceneExports.Add(new ExportSceneData
                {
                    name = scene.name,
                    prefabJson = TryGetPrefabJsonPath(scene.prefab, prefabJsonPathMap),
                    iconPath = scene.icon != null ? $"icons/scene_{SanitizePathPart(scene.name)}.png" : null,
                    renderingSettingsJson = TryExportRenderingSettings(
                        scene.renderingSettings,
                        scene.name,
                        renderingFolderPath,
                        serializationContext)
                });
            }
        }

        var itemExports = new List<ExportItemData>();
        if (manifest.Items != null)
        {
            foreach (var item in manifest.Items)
            {
                itemExports.Add(new ExportItemData
                {
                    name = item.name,
                    itemType = item.itemType.ToString(),
                    prefabJson = TryGetPrefabJsonPath(item.prefab, prefabJsonPathMap),
                    iconPath = item.icon != null ? $"icons/item_{SanitizePathPart(item.name)}.png" : null
                });
            }
        }

        return new ExportManifestData
        {
            author = manifest.author,
            modName = manifest.modName,
            id = manifest.id,
            description = manifest.description,
            modVersion = manifest.modVersion,
            minimalMainGameVersion = manifest.minimalMainGameVersion,
            Scenes = sceneExports,
            Items = itemExports
        };
    }

    private static string TryExportRenderingSettings(
        SceneRenderingSettings renderingSettings,
        string sceneName,
        string renderingFolderPath,
        SerializationContext serializationContext)
    {
        if (renderingSettings == null)
        {
            return null;
        }

        var fileName = $"{SanitizePathPart(sceneName)}.rendering.json";
        var exportPath = Path.Combine(renderingFolderPath, fileName);
        var json = JsonPrefabSerializer.SerializeObject(renderingSettings, serializationContext);
        File.WriteAllText(exportPath, json);

        return $"rendering/{fileName}";
    }

    private static string TryGetPrefabJsonPath(GameObject prefab, Dictionary<int, string> prefabJsonPathMap)
    {
        if (prefab == null) return null;
        return prefabJsonPathMap.TryGetValue(prefab.GetInstanceID(), out var path) ? path : null;
    }

    private bool CompileTypeScriptToExport(string modFolderAssetPath, string exportScriptFolderPath, out string errorMessage)
    {
        errorMessage = string.Empty;
        var modFolderAbsolutePath = AssetPathToAbsolutePath(modFolderAssetPath);
        var modScriptsFolderPath = Path.Combine(modFolderAbsolutePath, "Scripts");

        if (!HasScriptFiles(modScriptsFolderPath))
        {
            return true;
        }

        if (!RunTypeScriptExport(modScriptsFolderPath, exportScriptFolderPath, out var compilerError))
        {
            errorMessage = compilerError;
            return false;
        }

        var mjsFiles = Directory.GetFiles(exportScriptFolderPath, "*.mjs", SearchOption.AllDirectories);
        if (mjsFiles.Length == 0)
        {
            errorMessage = "TypeScript export produced no .mjs output.";
            return false;
        }

        return true;
    }

    private static bool HasScriptFiles(string scriptsFolderPath)
    {
        if (string.IsNullOrWhiteSpace(scriptsFolderPath) || !Directory.Exists(scriptsFolderPath))
        {
            return false;
        }

        return Directory.EnumerateFiles(scriptsFolderPath, "*", SearchOption.AllDirectories)
            .Any(file =>
            {
                var extension = Path.GetExtension(file);
                return string.Equals(extension, ".ts", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(extension, ".tsx", StringComparison.OrdinalIgnoreCase);
            });
    }

    private bool RunTypeScriptExport(string scriptsRoot, string outputFolderPath, out string errorMessage)
    {
        return TypeScriptCompiler.Compile(scriptsRoot, outputFolderPath, out errorMessage);
    }

    private bool TryStartCompileWatch(string modFolderAssetPath, ModManifestV2 manifest, out string errorMessage)
    {
        errorMessage = string.Empty;

        if (manifest == null)
        {
            errorMessage = "Manifest is required to start compile watch.";
            return false;
        }

        if (IsCompileWatchRunning(manifest.id))
        {
            return true;
        }

        var modFolderAbsolutePath = AssetPathToAbsolutePath(modFolderAssetPath);
        var modScriptsFolderPath = Path.Combine(modFolderAbsolutePath, "Scripts");
        if (!HasScriptFiles(modScriptsFolderPath))
        {
            errorMessage = "No TypeScript files found under the mod's Scripts folder.";
            return false;
        }

        if (!ExportAndInstallModForCompileWatch(modFolderAssetPath, manifest, out errorMessage))
        {
            return false;
        }

        var targetScriptFolder = GetInstalledModScriptDirectory(manifest.id);
        Directory.CreateDirectory(targetScriptFolder);

        try
        {
            var watcher = new FileSystemWatcher(modScriptsFolderPath, "*.ts")
            {
                IncludeSubdirectories = true,
                EnableRaisingEvents = true
            };

            var watchInfo = new CompileWatchProcessInfo
            {
                ModFolder = modFolderAssetPath,
                ModId = manifest.id,
                Watcher = watcher,
                ScriptsRoot = modScriptsFolderPath,
                OutputDir = targetScriptFolder
            };

            watcher.Changed += (_, _) => ScheduleRecompile(watchInfo);
            watcher.Created += (_, _) => ScheduleRecompile(watchInfo);
            watcher.Deleted += (_, _) => ScheduleRecompile(watchInfo);
            watcher.Renamed += (_, _) => ScheduleRecompile(watchInfo);

            ActiveCompileWatchProcesses[manifest.id] = watchInfo;

            // Do an initial compile
            RecompileWatchTarget(watchInfo);

            UnityEngine.Debug.Log($"[VoxModExporterV3] Compile watch started for '{manifest.id}'.");
            return true;
        }
        catch (Exception e)
        {
            errorMessage = $"Failed to start compile watch: {e.Message}";
            return false;
        }
    }

    private void ScheduleRecompile(CompileWatchProcessInfo watchInfo)
    {
        // Cancel any pending debounce
        if (!string.IsNullOrEmpty(watchInfo.DebounceTimerId))
        {
            EditorApplication.delayCall -= watchInfo.DebounceAction;
            watchInfo.DebounceTimerId = null;
        }

        // Debounce: wait ~250ms for filesystem to settle
        var timerId = Guid.NewGuid().ToString();
        watchInfo.DebounceTimerId = timerId;

        void callback()
        {
            if (watchInfo.DebounceTimerId == timerId)
            {
                watchInfo.DebounceTimerId = null;
                RecompileWatchTarget(watchInfo);
            }
        }

        watchInfo.DebounceAction = callback;
        EditorApplication.delayCall += callback;
    }

    private void RecompileWatchTarget(CompileWatchProcessInfo watchInfo)
    {
        TypeScriptCompiler.CleanDirectory(watchInfo.OutputDir);

        if (TypeScriptCompiler.Compile(watchInfo.ScriptsRoot, watchInfo.OutputDir, out var error))
        {
            LogInfoOnEditorThread($"[VoxModExporterV3][Watch:{watchInfo.ModId}] Recompiled successfully.");
        }
        else
        {
            LogErrorOnEditorThread($"[VoxModExporterV3][Watch:{watchInfo.ModId}] {error}");
        }
    }

    private bool ExportAndInstallModForCompileWatch(string modFolderAssetPath, ModManifestV2 manifest, out string errorMessage)
    {
        errorMessage = string.Empty;

        if (!ExportMod(modFolderAssetPath, out _, out errorMessage))
        {
            return false;
        }

        try
        {
            InstallModOnWindows(manifest);
            return true;
        }
        catch (Exception e)
        {
            errorMessage = $"Install failed: {e.Message}";
            return false;
        }
    }

    private static bool IsCompileWatchRunning(string modId)
    {
        return ActiveCompileWatchProcesses.TryGetValue(modId, out var info)
            && info?.Watcher != null
            && info.Watcher.EnableRaisingEvents;
    }

    private static void StopCompileWatchByModId(string modId)
    {
        if (string.IsNullOrWhiteSpace(modId))
        {
            return;
        }

        if (!ActiveCompileWatchProcesses.TryGetValue(modId, out var info) || info?.Watcher == null)
        {
            return;
        }

        try
        {
            info.Watcher.EnableRaisingEvents = false;
            info.Watcher.Dispose();
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogWarning($"[VoxModExporterV3] Failed to stop compile watch for '{modId}': {e.Message}");
        }
        finally
        {
            ActiveCompileWatchProcesses.Remove(modId);
        }
    }

    private static void StopAllCompileWatches()
    {
        var modIds = ActiveCompileWatchProcesses.Keys.ToList();
        foreach (var modId in modIds)
        {
            StopCompileWatchByModId(modId);
        }
    }

    private static void RegisterLifecycleHooks()
    {
        if (lifecycleHooksRegistered)
        {
            return;
        }

        AssemblyReloadEvents.beforeAssemblyReload += StopAllCompileWatches;
        EditorApplication.quitting += StopAllCompileWatches;
        lifecycleHooksRegistered = true;
    }

    private static void LogInfoOnEditorThread(string message)
    {
        EditorApplication.delayCall += () => UnityEngine.Debug.Log(message);
    }

    private static void LogWarningOnEditorThread(string message)
    {
        EditorApplication.delayCall += () => UnityEngine.Debug.LogWarning(message);
    }

    private static void LogErrorOnEditorThread(string message)
    {
        EditorApplication.delayCall += () => UnityEngine.Debug.LogError(message);
    }

    private static string GetProjectRootAbsolutePath()
    {
        return Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
    }

    private static string AssetPathToAbsolutePath(string assetPath)
    {
        var projectRoot = GetProjectRootAbsolutePath();
        return Path.GetFullPath(Path.Combine(projectRoot, assetPath));
    }

    private static string SanitizePathPart(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "mod";

        var sanitized = value;
        foreach (var invalidChar in Path.GetInvalidFileNameChars())
        {
            sanitized = sanitized.Replace(invalidChar, '_');
        }
        return sanitized;
    }

    private void OpenExportDirectory()
    {
        var exportPath = Path.Combine(GetProjectRootAbsolutePath(), ExportRootFolderName);
        if (!Directory.Exists(exportPath))
        {
            Directory.CreateDirectory(exportPath);
        }
        EditorUtility.RevealInFinder(exportPath);
    }

    private void OpenModsDirectory()
    {
        var targetPath = GetModInstallDirectory();
        if (!Directory.Exists(targetPath))
        {
            Directory.CreateDirectory(targetPath);
        }
        EditorUtility.RevealInFinder(targetPath);
    }

    private static void ArchiveToZip(string exportFolderPath)
    {
        if (!Directory.Exists(exportFolderPath))
        {
            UnityEngine.Debug.LogWarning($"[VoxModExporterV3] Archive skipped: source folder not found: {exportFolderPath}");
            return;
        }

        var folderName = Path.GetFileName(exportFolderPath);
        var zipPath = Path.Combine(Directory.GetParent(exportFolderPath).FullName, $"{folderName}.zip");

        try
        {
            if (File.Exists(zipPath))
            {
                File.Delete(zipPath);
            }

            ZipFile.CreateFromDirectory(exportFolderPath, zipPath, System.IO.Compression.CompressionLevel.Optimal, includeBaseDirectory: true);
            UnityEngine.Debug.Log($"[VoxModExporterV3] Archived mod to: {zipPath}");
        }
        catch (Exception ex)
        {
            UnityEngine.Debug.LogError($"[VoxModExporterV3] Failed to archive mod to zip. Error: {ex.Message}");
        }
    }

    private void CleanAllExports()
    {
        if (EditorUtility.DisplayDialog("Clean All Exports",
            "This will delete all exported mods in the Export folder. Continue?",
            "Yes", "No"))
        {
            var exportPath = Path.Combine(GetProjectRootAbsolutePath(), ExportRootFolderName);
            if (Directory.Exists(exportPath))
            {
                Directory.Delete(exportPath, true);
                Directory.CreateDirectory(exportPath);
                AssetDatabase.Refresh();
                UnityEngine.Debug.Log("[VoxModExporterV3] All exports cleaned.");
                SetStatus("Clean All Exports succeeded", false);
            }
        }
    }

    #region Install Methods

    private const string ModInstallPath = "CyDream/Voxel Playground";
    private const string AndroidPackageName = "com.Cydream.VoxelPlayground";
    private const string AndroidModsDirectory = "/sdcard/Android/data/" + AndroidPackageName + "/files/Mods";

    private class AndroidInstallTarget
    {
        public string ModId;
        public string SourcePath;
    }

    private void InstallModsOnWindows()
    {
        var selectedFolders = GetSelectedModFolders();

        if (selectedFolders.Count == 0)
        {
            SetStatus("Windows install failed: no mods selected", true);
            return;
        }

        int successCount = 0;
        int failCount = 0;
        List<string> errors = new List<string>();

        foreach (var modAssetPath in selectedFolders)
        {
            if (!TryLoadManifest(modAssetPath, out var manifest))
            {
                failCount++;
                errors.Add($"{modAssetPath}: No ModManifestV2 found");
                continue;
            }

            try
            {
                InstallModOnWindows(manifest);
                successCount++;
                UnityEngine.Debug.Log($"[VoxModExporterV3] Installed '{manifest.id}' on Windows");
            }
            catch (Exception e)
            {
                failCount++;
                errors.Add($"{modAssetPath}: {e.Message}");
                UnityEngine.Debug.LogError($"[VoxModExporterV3] Failed to install '{modAssetPath}' on Windows: {e.Message}");
            }
        }

        if (failCount == 0)
        {
            SetStatus($"Windows install succeeded ({successCount} mod{(successCount == 1 ? "" : "s")})", false);
        }
        else
        {
            var firstError = errors.Count > 0 ? errors[0] : string.Empty;
            SetStatus($"Windows install failed ({failCount} of {successCount + failCount}): {firstError}", true);
        }
    }

    private void InstallModOnWindows(ModManifestV2 manifest)
    {
        var modInstallDirectory = GetModInstallDirectory();
        var targetModPath = Path.Combine(modInstallDirectory, manifest.id);

        // Delete existing installation
        if (Directory.Exists(targetModPath))
        {
            Directory.Delete(targetModPath, true);
        }
        UnityEngine.Debug.Log("[VoxModExporterV3] Deleted old installation: " + targetModPath);

        // Copy from export folder
        var sourcePath = Path.Combine(GetProjectRootAbsolutePath(), ExportRootFolderName, manifest.id);

        if (!Directory.Exists(sourcePath))
        {
            throw new Exception($"Export folder not found: {sourcePath}. Please export the mod first.");
        }

        DirectoryCopy(sourcePath, targetModPath, true);
        UnityEngine.Debug.Log("[VoxModExporterV3] Copied from: " + sourcePath);
    }

    private void InstallModsOnAndroid()
    {
        var selectedFolders = GetSelectedModFolders();

        if (selectedFolders.Count == 0)
        {
            SetStatus("Android install failed: no mods selected", true);
            return;
        }

        var targets = new List<AndroidInstallTarget>();
        var errors = new List<string>();
        int preflightFailCount = 0;
        var projectRoot = GetProjectRootAbsolutePath();

        foreach (var modAssetPath in selectedFolders)
        {
            if (!TryLoadManifest(modAssetPath, out var manifest))
            {
                preflightFailCount++;
                errors.Add($"{modAssetPath}: No ModManifestV2 found");
                continue;
            }

            var exportPath = Path.Combine(projectRoot, ExportRootFolderName, manifest.id);
            if (!Directory.Exists(exportPath))
            {
                var exportMessage = $"Android install: exporting '{manifest.id}' before install";
                UnityEngine.Debug.Log($"[VoxModExporterV3] {exportMessage}");
                SetStatus(exportMessage, false);

                if (!ExportMod(modAssetPath, out exportPath, out var exportError))
                {
                    preflightFailCount++;
                    errors.Add($"{manifest.id}: export failed: {exportError}");
                    UnityEngine.Debug.LogError($"[VoxModExporterV3] Android install skipped '{manifest.id}': export failed: {exportError}");
                    continue;
                }
            }

            if (!Directory.Exists(exportPath))
            {
                preflightFailCount++;
                errors.Add($"{manifest.id}: export folder not found: {exportPath}");
                continue;
            }

            targets.Add(new AndroidInstallTarget
            {
                ModId = manifest.id,
                SourcePath = exportPath
            });
        }

        if (targets.Count == 0)
        {
            var firstError = errors.Count > 0 ? errors[0] : "no installable mods";
            SetStatus($"Android install failed ({preflightFailCount} of {selectedFolders.Count}): {firstError}", true);
            return;
        }

        var adbPath = Path.Combine(projectRoot, "ADBTools", "adb.exe");
        if (!File.Exists(adbPath))
        {
            SetStatus($"Android install failed: adb not found at {adbPath}", true);
            return;
        }

        SetStatus($"Android install started ({targets.Count} selected mod{(targets.Count == 1 ? "" : "s")})", false);

        System.Threading.ThreadPool.QueueUserWorkItem(state =>
        {
            int successCount = 0;
            int failCount = preflightFailCount;
            var installErrors = new List<string>(errors);

            foreach (var target in targets)
            {
                SetStatusOnEditorThread($"Android install: installing {target.ModId}", false);

                if (InstallModOnAndroid(adbPath, target, out var installError))
                {
                    successCount++;
                    LogInfoOnEditorThread($"[VoxModExporterV3] Installed '{target.ModId}' on Android");
                }
                else
                {
                    failCount++;
                    installErrors.Add($"{target.ModId}: {installError}");
                    LogErrorOnEditorThread($"[VoxModExporterV3] Failed to install '{target.ModId}' on Android: {installError}");
                }
            }

            if (failCount == 0)
            {
                SetStatusOnEditorThread($"Android install succeeded ({successCount} mod{(successCount == 1 ? "" : "s")})", false);
            }
            else
            {
                var firstError = installErrors.Count > 0 ? installErrors[0] : string.Empty;
                SetStatusOnEditorThread($"Android install failed ({failCount} of {successCount + failCount}): {firstError}", true);
            }
        });
    }

    private bool InstallModOnAndroid(string adbPath, AndroidInstallTarget target, out string errorMessage)
    {
        errorMessage = string.Empty;

        if (string.IsNullOrWhiteSpace(target.ModId))
        {
            errorMessage = "Mod id cannot be empty.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(target.SourcePath) || !Directory.Exists(target.SourcePath))
        {
            errorMessage = $"Export folder not found: {target.SourcePath}";
            return false;
        }

        var remoteModPath = $"{AndroidModsDirectory}/{target.ModId}";

        if (!RunAdbCommand(adbPath, target.ModId, "remove old install", $"shell rm -rf {QuoteAdbShellArgument(remoteModPath)}", out errorMessage))
        {
            return false;
        }

        if (!RunAdbCommand(adbPath, target.ModId, "create Mods directory", $"shell mkdir -p {QuoteAdbShellArgument(AndroidModsDirectory)}", out errorMessage))
        {
            return false;
        }

        if (!CreateAndroidRemoteDirectories(adbPath, target, remoteModPath, out errorMessage))
        {
            return false;
        }

        return RunAdbCommand(
            adbPath,
            target.ModId,
            "push export",
            $"push {QuoteProcessArgument(target.SourcePath)} {QuoteProcessArgument(AndroidModsDirectory + "/")}",
            out errorMessage);
    }

    private bool CreateAndroidRemoteDirectories(string adbPath, AndroidInstallTarget target, string remoteModPath, out string errorMessage)
    {
        if (!RunAdbCommand(adbPath, target.ModId, "create mod directory", $"shell mkdir -p {QuoteAdbShellArgument(remoteModPath)}", out errorMessage))
        {
            return false;
        }

        foreach (var directoryPath in Directory.GetDirectories(target.SourcePath, "*", SearchOption.AllDirectories))
        {
            var relativePath = GetRelativePath(target.SourcePath, directoryPath).Replace("\\", "/");
            if (string.IsNullOrWhiteSpace(relativePath) || relativePath == ".")
            {
                continue;
            }

            var remoteDirectoryPath = $"{remoteModPath}/{relativePath}";
            if (!RunAdbCommand(adbPath, target.ModId, $"create {relativePath}", $"shell mkdir -p {QuoteAdbShellArgument(remoteDirectoryPath)}", out errorMessage))
            {
                return false;
            }
        }

        return true;
    }

    private static string GetRelativePath(string rootPath, string childPath)
    {
        var rootFullPath = Path.GetFullPath(rootPath).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
            + Path.DirectorySeparatorChar;
        var childFullPath = Path.GetFullPath(childPath);

        if (!childFullPath.StartsWith(rootFullPath, StringComparison.OrdinalIgnoreCase))
        {
            return childFullPath;
        }

        return childFullPath.Substring(rootFullPath.Length);
    }

    private bool RunAdbCommand(string adbPath, string modId, string label, string arguments, out string errorMessage)
    {
        errorMessage = string.Empty;
        var output = new StringBuilder();
        var startInfo = new ProcessStartInfo
        {
            FileName = adbPath,
            Arguments = arguments,
            WorkingDirectory = Path.GetDirectoryName(adbPath),
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        try
        {
            using var process = new Process { StartInfo = startInfo, EnableRaisingEvents = true };
            process.OutputDataReceived += (sender, args) =>
            {
                if (string.IsNullOrWhiteSpace(args.Data))
                {
                    return;
                }

                lock (output)
                {
                    output.AppendLine(args.Data);
                }

                SetStatusOnEditorThread($"Android install {modId}: {args.Data}", false);
                LogInfoOnEditorThread($"[VoxModExporterV3][ADB:{modId}] {args.Data}");
            };
            process.ErrorDataReceived += (sender, args) =>
            {
                if (string.IsNullOrWhiteSpace(args.Data))
                {
                    return;
                }

                lock (output)
                {
                    output.AppendLine(args.Data);
                }

                SetStatusOnEditorThread($"Android install {modId}: {args.Data}", true);
                LogErrorOnEditorThread($"[VoxModExporterV3][ADB:{modId}] {args.Data}");
            };

            SetStatusOnEditorThread($"Android install {modId}: {label}", false);
            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
            process.WaitForExit();

            if (process.ExitCode == 0)
            {
                return true;
            }

            var details = output.ToString().Trim();
            errorMessage = string.IsNullOrEmpty(details)
                ? $"{label} failed with exit code {process.ExitCode}"
                : $"{label} failed with exit code {process.ExitCode}: {details}";
            return false;
        }
        catch (Exception e)
        {
            errorMessage = $"{label} failed: {e.Message}";
            return false;
        }
    }

    private void SetStatusOnEditorThread(string message, bool isError)
    {
        EditorApplication.delayCall += () => SetStatus(message, isError);
    }

    private static string QuoteProcessArgument(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return "\"\"";
        }

        return "\"" + value.Replace("\"", "\\\"") + "\"";
    }

    private static string QuoteAdbShellArgument(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return "''";
        }

        return "'" + value.Replace("'", "'\\''") + "'";
    }

    private static string GetModInstallDirectory()
    {
        var targetPath = Application.persistentDataPath;
        var splitedPath = targetPath.Split('/');
        int len = splitedPath.Length;
        targetPath = "";
        for (int i = 0; i < len - 2; ++i)
        {
            targetPath += splitedPath[i] + "/";
        }
        targetPath += ModInstallPath + "/Mods/";
        return targetPath;
    }

    private static string GetInstalledModScriptDirectory(string modId)
    {
        return Path.Combine(GetModInstallDirectory(), modId, "script");
    }

    private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
    {
        DirectoryInfo dir = new DirectoryInfo(sourceDirName);
        DirectoryInfo[] dirs = dir.GetDirectories();

        if (!dir.Exists)
        {
            throw new DirectoryNotFoundException(
                "Source directory does not exist or could not be found: " + sourceDirName);
        }

        if (!Directory.Exists(destDirName))
        {
            Directory.CreateDirectory(destDirName);
        }

        FileInfo[] files = dir.GetFiles();

        foreach (FileInfo file in files)
        {
            string temppath = Path.Combine(destDirName, file.Name);
            file.CopyTo(temppath, false);
        }

        if (copySubDirs)
        {
            foreach (DirectoryInfo subdir in dirs)
            {
                string temppath = Path.Combine(destDirName, subdir.Name);
                DirectoryCopy(subdir.FullName, temppath, copySubDirs);
            }
        }
    }

    #endregion

    #region Export Data Classes

    /// <summary>
    /// Export data for scene entries
    /// </summary>
    [Serializable]
    public class ExportSceneData
    {
        public string name;
        public string prefabJson;
        public string iconPath;
        public string renderingSettingsJson;
    }

    /// <summary>
    /// Export data for item entries
    /// </summary>
    [Serializable]
    public class ExportItemData
    {
        public string name;
        public string itemType;
        public string prefabJson;
        public string iconPath;
    }

    /// <summary>
    /// Export format manifest for JSON serialization
    /// </summary>
    [Serializable]
    public class ExportManifestData
    {
        public string id;
        public string description;
        public string author;
        public string modName;
        public SemanticVersion modVersion;
        public SemanticVersion minimalMainGameVersion;
        public List<ExportSceneData> Scenes;
        public List<ExportItemData> Items;
    }

    #endregion
}
#endif
