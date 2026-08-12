#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Entity;
using VoxelPlayground.Level;
using VoxelPlayground.Mod;
using VoxelPlayground.ModRuntime;
using Object = UnityEngine.Object;

[assembly: InternalsVisibleTo("VoxModTK.Editor.Tests")]

public class TeardownSceneModImporterWindow : EditorWindow
{
    private const float DefaultElementScale = 0.1f;
    private const float DefaultBrushVoxBoxVoxelSize = 0.25f;
    private const float DefaultAttachmentPointScale = 0.5f;
    private const string DefaultJointDataPath = "Assets/ScriptableObjects/Joint/BuildingJoint5.asset";
    private const string DefaultDependencyFolderName = "TeardownSources";
    private const string DerivedVoxBoxFolderName = "VoxBox";
    private const string DerivedProceduralFolderName = "Procedural";
    private const string DerivedHeightmapFolderName = "Heightmap";
    private const string BuiltInGroundVoxScriptPath = "BUILT-IN/voxscript/ground.lua";
    private const string BuiltInWallsVoxScriptPath = "BUILT-IN/voxscript/walls.lua";
    private const string BuiltInAssetFolderName = "built-in";
    private const string VoxBoxBakeVersion = "zmirror2";
    private const string SampleXmlPath = "Assets/Mod/com.random.minecraft-village/source/Minecraft Village/MinecraftVillageSandbox.xml";
    private const int VoxelDataV2PointStride = 8;
    private const int VoxelDataV2IdByteOffset = 4;
    private const uint VoxelDataV2IdMask = 0x1Fu;
    private const uint VoxelDataV2PropertyMask = 0x7u;
    private const int VoxelDataV2TemperatureBitShift = 5;
    private const int VoxelDataV2ValueBitShift = 29;
    private const uint VoxelDataV2NormalTemperature = 3u;
    private const uint VoxelDataV2FullValue = 7u;
    private const float DenseVoxBoxBrushFillThreshold = 0.85f;
    private const int DefaultHeightmapMaxSamples = 512;
    private const int DefaultHeightmapTileSize = 128;
    private const int DefaultHeightmapChunkSize = 16;
    private const int DefaultBuiltInGroundHeightScale = 255;
    private const int VoxelProxyTypeSceneStatic = 0;
    private const int VoxelProxyTypeSceneDynamic = 1;
    private const int VoxelProxyTypeSceneStrongConnected = 2;
    private const int VoxelProxyTypeSceneWeakConnected = 3;
    private const int AttachmentDirectionCount = 12;
    private const float GeneratedRuntimeMass = 1f;
    private const string UnyieldingAreaName = "UnyieldingArea";
    private const float UnyieldingAreaHorizontalPadding = 2f;
    private const float UnyieldingAreaHeight = 2f;
    private const byte MaterialIdWood = 1;
    private const byte MaterialIdGrass = 2;
    private const byte MaterialIdPlastic = 3;
    private const byte MaterialIdDirt = 6;
    private const byte MaterialIdStone = 7;
    private const byte MaterialIdConcrete = 9;
    private const byte MaterialIdWeakMetal = 11;
    private const byte MaterialIdGlass = 14;
    private const string RuntimeVoxelSaveDataV2TypeName = "VoxelPlayground.Engine.VoxelVolumeSaveDataV2, VoxEngineCore";
    private const string RuntimeInt3TypeName = "Unity.Mathematics.int3, Unity.Mathematics";
    private static readonly Dictionary<string, Type> RuntimeMonoBehaviourTypeByName = new Dictionary<string, Type>(StringComparer.Ordinal);
    private static readonly HashSet<string> MissingRuntimeMonoBehaviourWarnings = new HashSet<string>(StringComparer.Ordinal);

    [SerializeField] private TextAsset xmlAsset;
    [SerializeField] private string outputPrefabPath = "";
    [SerializeField] private string teardownModRootPath = "";
    [SerializeField] private string dependencyDataFolderPath = "";
    [SerializeField] private string dependencyPrefabFolderPath = "";
    [SerializeField] private bool updateManifest = true;
    [SerializeField] private bool convertVoxDependencies = true;
    [SerializeField] private bool remapTeardownMaterialIds = true;
    [SerializeField] private bool generateHeightmapVoxscripts = true;
    [SerializeField] private bool overwriteExistingPrefab = true;
    [SerializeField] private bool overwriteExistingDependencies = true;
    [SerializeField] private bool setRuntimeLayers = true;
    [SerializeField] private bool rebasePrefabRoots = true;
    [SerializeField] private float elementScale = DefaultElementScale;
    [SerializeField] private float brushVoxBoxVoxelSize = DefaultBrushVoxBoxVoxelSize;
    [SerializeField] private int heightmapMaxSamples = DefaultHeightmapMaxSamples;

    private Vector2 scrollPosition;
    private ImportReport lastReport;

    [MenuItem("Vox Mod Tools/Teardown Scene Mod Importer", priority = 105)]
    public static void ShowWindow()
    {
        var window = GetWindow<TeardownSceneModImporterWindow>("Teardown Scene Importer");
        window.minSize = new Vector2(520, 380);
        window.TryUseSelection();
    }

    [MenuItem("Assets/Create/VoxelPlayground/Import Teardown Scene Mod", true)]
    private static bool ValidateImportSelectedXml()
    {
        return Selection.objects
            .Select(AssetDatabase.GetAssetPath)
            .Any(IsXmlAssetPath);
    }

    [MenuItem("Assets/Create/VoxelPlayground/Import Teardown Scene Mod")]
    private static void ImportSelectedXml()
    {
        foreach (var path in Selection.objects.Select(AssetDatabase.GetAssetPath).Where(IsXmlAssetPath))
            ImportXmlScene(path, CreateDefaultOptions(path));
    }

    // [MenuItem("Vox Mod Tools/Teardown Scene Mod Importer/Import Minecraft Village Sandbox")]
    // public static void ImportMinecraftVillageSandboxSample()
    // {
    //     var options = CreateDefaultOptions(SampleXmlPath);
    //     options.OverwriteExistingDependencies = true;
    //     ImportXmlScene(SampleXmlPath, options);
    // }

    private void OnEnable()
    {
        if (xmlAsset == null)
            TryUseSelection();
        else
            RefreshDefaultPaths(AssetDatabase.GetAssetPath(xmlAsset), false);
    }

    private void OnSelectionChange()
    {
        if (TryUseSelection())
            Repaint();
    }

    private void OnGUI()
    {
        EditorGUILayout.LabelField("Teardown Scene Mod Importer", EditorStyles.boldLabel);
        EditorGUILayout.Space();

        EditorGUI.BeginChangeCheck();
        xmlAsset = (TextAsset)EditorGUILayout.ObjectField("Scene XML", xmlAsset, typeof(TextAsset), false);
        if (EditorGUI.EndChangeCheck())
        {
            var path = xmlAsset == null ? "" : AssetDatabase.GetAssetPath(xmlAsset);
            RefreshDefaultPaths(path, true);
        }

        using (new EditorGUI.DisabledScope(xmlAsset == null))
        {
            EditorGUILayout.BeginHorizontal();
            outputPrefabPath = EditorGUILayout.TextField("Output Prefab", outputPrefabPath);
            if (GUILayout.Button("Default", GUILayout.Width(72)))
                outputPrefabPath = GetDefaultOutputPrefabPath(AssetDatabase.GetAssetPath(xmlAsset));
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.BeginHorizontal();
            teardownModRootPath = EditorGUILayout.TextField("Teardown MOD Root", teardownModRootPath);
            if (GUILayout.Button("Default", GUILayout.Width(72)))
                teardownModRootPath = InferTeardownModRoot(AssetDatabase.GetAssetPath(xmlAsset), FindModRoot(AssetDatabase.GetAssetPath(xmlAsset)));
            EditorGUILayout.EndHorizontal();

            dependencyDataFolderPath = EditorGUILayout.TextField("Dependency Data Folder", dependencyDataFolderPath);
            dependencyPrefabFolderPath = EditorGUILayout.TextField("Dependency Prefab Folder", dependencyPrefabFolderPath);
        }

        updateManifest = EditorGUILayout.Toggle("Update Manifest Scenes", updateManifest);
        convertVoxDependencies = EditorGUILayout.Toggle("Convert Vox Dependencies", convertVoxDependencies);
        using (new EditorGUI.DisabledScope(!convertVoxDependencies))
            remapTeardownMaterialIds = EditorGUILayout.Toggle("Remap Teardown Materials", remapTeardownMaterialIds);
        generateHeightmapVoxscripts = EditorGUILayout.Toggle("Generate Heightmap Voxscripts", generateHeightmapVoxscripts);
        using (new EditorGUI.DisabledScope(!generateHeightmapVoxscripts))
            heightmapMaxSamples = EditorGUILayout.IntField("Heightmap Max Samples", Mathf.Max(1, heightmapMaxSamples));
        overwriteExistingPrefab = EditorGUILayout.Toggle("Overwrite Scene Prefab", overwriteExistingPrefab);
        overwriteExistingDependencies = EditorGUILayout.Toggle("Rebuild Vox/VoxBox Dependencies", overwriteExistingDependencies);
        setRuntimeLayers = EditorGUILayout.Toggle("Set Runtime Layers", setRuntimeLayers);
        rebasePrefabRoots = EditorGUILayout.Toggle("Rebase Prefab Roots", rebasePrefabRoots);
        elementScale = EditorGUILayout.FloatField("Element Scale", elementScale);
        brushVoxBoxVoxelSize = EditorGUILayout.FloatField("Brush VoxBox Voxel Size", brushVoxBoxVoxelSize);

        EditorGUILayout.Space();

        var xmlPath = xmlAsset == null ? "" : AssetDatabase.GetAssetPath(xmlAsset);
        var canImport = IsXmlAssetPath(xmlPath) && !string.IsNullOrWhiteSpace(outputPrefabPath);
        using (new EditorGUI.DisabledScope(!canImport))
        {
            if (GUILayout.Button("Import Teardown Scene", GUILayout.Height(32)))
            {
                lastReport = ImportXmlScene(xmlPath, new ImportOptions
                {
                    OutputPrefabPath = outputPrefabPath,
                    TeardownModRootPath = teardownModRootPath,
                    DependencyDataFolderPath = dependencyDataFolderPath,
                    DependencyPrefabFolderPath = dependencyPrefabFolderPath,
                    UpdateManifest = updateManifest,
                    ConvertVoxDependencies = convertVoxDependencies,
                    RemapTeardownMaterialIds = remapTeardownMaterialIds,
                    GenerateHeightmapVoxscripts = generateHeightmapVoxscripts,
                    OverwriteExistingPrefab = overwriteExistingPrefab,
                    OverwriteExistingDependencies = overwriteExistingDependencies,
                    SetRuntimeLayers = setRuntimeLayers,
                    RebasePrefabRoots = rebasePrefabRoots,
                    ElementScale = Mathf.Max(0.001f, elementScale),
                    BrushVoxBoxVoxelSize = Mathf.Max(0.001f, brushVoxBoxVoxelSize),
                    HeightmapMaxSamples = Mathf.Max(1, heightmapMaxSamples)
                });
            }
        }

        if (!canImport)
            EditorGUILayout.HelpBox("Select a Teardown scene XML asset under Assets and choose an output prefab path.", MessageType.Info);

        DrawReport();
    }

    public static ImportReport ImportXmlScene(string xmlAssetPath, ImportOptions options)
    {
        xmlAssetPath = NormalizeAssetPath(xmlAssetPath);
        if (!IsXmlAssetPath(xmlAssetPath))
            throw new ArgumentException("Expected a Unity XML asset path.", nameof(xmlAssetPath));

        options = PrepareOptions(xmlAssetPath, options);
        ValidateOptions(options);

        var modRoot = FindModRoot(xmlAssetPath);
        if (string.IsNullOrWhiteSpace(modRoot))
            throw new InvalidOperationException("Could not find a mod root for " + xmlAssetPath);

        if (!options.OverwriteExistingPrefab)
            options.OutputPrefabPath = AssetDatabase.GenerateUniqueAssetPath(options.OutputPrefabPath);

        EnsureAssetFolder(Path.GetDirectoryName(options.OutputPrefabPath));
        EnsureAssetFolder(options.DependencyDataFolderPath);
        EnsureAssetFolder(options.DependencyPrefabFolderPath);

        var report = new ImportReport
        {
            XmlPath = xmlAssetPath,
            OutputPrefabPath = options.OutputPrefabPath,
            ModRootPath = modRoot,
            TeardownModRootPath = options.TeardownModRootPath
        };

        var graph = DiscoverDependencies(xmlAssetPath, options.TeardownModRootPath, report);
        report.XmlDependencyCount = graph.XmlFiles.Count;
        report.VoxDependencyCount = graph.VoxFiles.Count;

        var context = new ImportContext(xmlAssetPath, modRoot, options, graph, report);
        ConvertVoxDependencies(context);

        AssetDatabase.Refresh();

        var document = LoadXmlDocument(xmlAssetPath);
        var rootElement = document.Root;
        if (!IsSupportedSceneImportRoot(rootElement))
            throw new InvalidOperationException("XML root must be <scene> or <prefab> for scene import: " + xmlAssetPath);

        var sceneName = string.IsNullOrWhiteSpace(options.SceneName)
            ? Path.GetFileNameWithoutExtension(xmlAssetPath)
            : options.SceneName.Trim();

        GameObject root = null;
        try
        {
            root = new GameObject(sceneName);
            if (options.SetRuntimeLayers)
                root.layer = GetLayer("Building", root.layer);

            var voxelScene = root.AddComponent<VoxelScene>();
            var importedRoot = new GameObject("RootTransform");
            importedRoot.transform.SetParent(root.transform, false);
            if (options.SetRuntimeLayers)
                importedRoot.layer = GetLayer("Building", importedRoot.layer);

            context.PushXml(xmlAssetPath);
            try
            {
                foreach (var child in GetSceneImportRootChildren(rootElement, options.RebasePrefabRoots))
                    BuildElement(child, importedRoot.transform, context, xmlAssetPath);
            }
            finally
            {
                context.PopXml(xmlAssetPath);
            }

            ConfigureVoxelScene(voxelScene, importedRoot.transform, context.SpawnPoint);

            var prefab = PrefabUtility.SaveAsPrefabAsset(root, options.OutputPrefabPath);
            if (prefab == null)
                throw new InvalidOperationException("Unity did not return a prefab after saving " + options.OutputPrefabPath);

            report.OutputPrefabPath = options.OutputPrefabPath;

            if (options.UpdateManifest)
            {
                UpsertManifestScene(modRoot, sceneName, prefab);
                report.ManifestUpdated = true;
            }

            EditorUtility.SetDirty(prefab);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            EditorGUIUtility.PingObject(prefab);
        }
        finally
        {
            if (root != null)
                DestroyImmediate(root);
            EditorUtility.ClearProgressBar();
        }

        Debug.Log(report.ToLogString());
        foreach (var warning in report.Warnings)
            Debug.LogWarning(warning);
        foreach (var missing in report.MissingFiles)
            Debug.LogWarning("Missing Teardown import file: " + missing);
        foreach (var missing in report.MissingObjects)
            Debug.LogWarning("Missing converted vox object: " + missing);

        return report;
    }

    private static void ConvertVoxDependencies(ImportContext context)
    {
        if (!context.Options.ConvertVoxDependencies)
            return;

        var voxFiles = context.Graph.VoxFiles
            .Where(path => File.Exists(ToAbsolutePath(path)))
            .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
            .ToList();

        for (var i = 0; i < voxFiles.Count; i++)
        {
            var voxAssetPath = voxFiles[i];
            var prefabPath = context.GetConvertedPrefabPath(voxAssetPath);
            if (!context.Options.OverwriteExistingDependencies &&
                AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath) != null)
            {
                context.Report.ReusedVoxelDependencyCount++;
                continue;
            }

            var relativePath = context.GetTeardownRelativePath(voxAssetPath);
            var relativeFolder = NormalizeAssetPath(Path.GetDirectoryName(relativePath) ?? "");
            var dataFolder = string.IsNullOrWhiteSpace(relativeFolder)
                ? context.Options.DependencyDataFolderPath
                : CombineAssetPath(context.Options.DependencyDataFolderPath, relativeFolder);
            var prefabFolder = string.IsNullOrWhiteSpace(relativeFolder)
                ? context.Options.DependencyPrefabFolderPath
                : CombineAssetPath(context.Options.DependencyPrefabFolderPath, relativeFolder);

            EnsureAssetFolder(dataFolder);
            EnsureAssetFolder(prefabFolder);

            EditorUtility.DisplayProgressBar(
                "Importing Teardown Scene",
                "Converting " + voxAssetPath,
                voxFiles.Count == 0 ? 1f : (float)i / voxFiles.Count);

            try
            {
                var conversionStartedUtc = DateTime.UtcNow.AddSeconds(-1);
                ConverterSceneVoxToPrefab.ConvertInModTK(ConvertType.Scene, voxAssetPath, dataFolder, prefabFolder);
                context.Report.ConvertedVoxelDependencyCount++;
                if (context.Options.RemapTeardownMaterialIds)
                    RemapConvertedVoxDependencyMaterials(context, prefabPath, dataFolder, conversionStartedUtc);
            }
            catch (Exception e)
            {
                context.Report.AddWarning("Failed to convert vox dependency '" + voxAssetPath + "': " + e.Message);
            }
        }
    }

    private static void RemapConvertedVoxDependencyMaterials(
        ImportContext context,
        string prefabPath,
        string dataFolder,
        DateTime conversionStartedUtc)
    {
        AssetDatabase.Refresh();

        var voxelDataPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var convertedPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
        if (convertedPrefab != null)
        {
            foreach (var proxy in convertedPrefab.GetComponentsInChildren<VoxelObjectProxy>(true))
            {
                if (proxy == null || proxy.voxelFile == null)
                    continue;

                var path = AssetDatabase.GetAssetPath(proxy.voxelFile);
                if (!string.IsNullOrWhiteSpace(path))
                    voxelDataPaths.Add(NormalizeAssetPath(path));
            }
        }

        if (voxelDataPaths.Count == 0)
        {
            var absoluteDataFolder = ToAbsolutePath(dataFolder);
            if (Directory.Exists(absoluteDataFolder))
            {
                foreach (var file in Directory.GetFiles(absoluteDataFolder, "*.txt", SearchOption.AllDirectories))
                {
                    if (File.GetLastWriteTimeUtc(file) >= conversionStartedUtc)
                        voxelDataPaths.Add(NormalizeAssetPath(file));
                }
            }
        }

        foreach (var voxelDataPath in voxelDataPaths.OrderBy(path => path, StringComparer.OrdinalIgnoreCase))
        {
            try
            {
                if (!RemapVoxelDataAssetMaterialIds(voxelDataPath, out var changedPointCount, out var occupiedPointCount))
                    continue;

                context.Report.RemappedVoxelDataFileCount++;
                context.Report.RemappedVoxelPointCount += changedPointCount;
                if (occupiedPointCount == 0)
                    context.Report.AddWarning("Remapped voxel data had no occupied points: " + voxelDataPath);
            }
            catch (Exception e)
            {
                context.Report.AddWarning("Failed to remap Teardown material IDs in '" + voxelDataPath + "': " + e.Message);
            }
        }
    }

    private static bool RemapVoxelDataAssetMaterialIds(
        string voxelDataPath,
        out int changedPointCount,
        out int occupiedPointCount)
    {
        changedPointCount = 0;
        occupiedPointCount = 0;

        voxelDataPath = NormalizeAssetPath(voxelDataPath);
        var voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(voxelDataPath);
        if (voxelFile == null)
        {
            AssetDatabase.ImportAsset(voxelDataPath, ImportAssetOptions.ForceUpdate);
            voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(voxelDataPath);
        }

        if (voxelFile == null)
            throw new InvalidOperationException("Could not load voxel data asset.");

        var saveData = DeserializeVoxelSaveData(voxelFile.bytes);
        if (!(saveData is VoxelVolumeSaveDataV2Surrogate saveDataV2))
            throw new InvalidOperationException("Only V2 voxel data can be remapped.");

        if (!TryRemapVoxelSaveDataMaterialIds(saveDataV2, out changedPointCount, out occupiedPointCount) ||
            changedPointCount <= 0)
            return false;

        File.WriteAllBytes(ToAbsolutePath(voxelDataPath), SerializeRuntimeVoxelSaveDataV2(saveDataV2));
        AssetDatabase.ImportAsset(voxelDataPath, ImportAssetOptions.ForceUpdate);
        return true;
    }

    internal static bool TryRemapVoxelSaveDataMaterialIds(
        VoxelVolumeSaveDataV2Surrogate saveData,
        out int changedPointCount,
        out int occupiedPointCount)
    {
        changedPointCount = 0;
        occupiedPointCount = 0;

        if (saveData == null || saveData.cubeByteData == null)
            return false;

        var volumeSize = GetVolumeSize(saveData);
        if (!CanReadRawPointData(saveData.cubeByteData, volumeSize, VoxelDataV2PointStride))
            return false;

        var pointCount = (long)volumeSize.x * volumeSize.y * volumeSize.z;
        for (var index = 0L; index < pointCount; index++)
        {
            var byteOffset = (int)(index * VoxelDataV2PointStride) + VoxelDataV2IdByteOffset;
            var materialId = ReadPackedMaterialId(saveData.cubeByteData, byteOffset, VoxelDataV2IdMask);
            if (materialId == 0)
                continue;

            occupiedPointCount++;
            var remappedMaterialId = RemapConvertedTeardownMaterialId(materialId);
            if (remappedMaterialId == materialId)
                continue;

            WritePackedMaterialId(saveData.cubeByteData, byteOffset, remappedMaterialId, VoxelDataV2IdMask);
            changedPointCount++;
        }

        return true;
    }

    internal static byte RemapConvertedTeardownMaterialId(byte convertedMaterialId)
    {
        switch (convertedMaterialId)
        {
            case 1:
                return MaterialIdGlass;
            case 2:
            case 3:
                return MaterialIdGrass;
            case 4:
            case 5:
                return MaterialIdDirt;
            case 8:
            case 9:
                return MaterialIdWood;
            case 10:
            case 11:
                return MaterialIdConcrete;
            case 12:
            case 13:
            case 14:
            case 15:
                return MaterialIdStone;
            case 16:
            case 17:
                return MaterialIdWeakMetal;
            case 20:
            case 21:
                return MaterialIdPlastic;
            default:
                return convertedMaterialId;
        }
    }

    internal static byte ReadPackedMaterialId(byte[] data, int byteOffset, uint idMask = VoxelDataV2IdMask)
    {
        if (data == null || byteOffset < 0 || byteOffset + sizeof(uint) > data.Length)
            return 0;

        return (byte)(BitConverter.ToUInt32(data, byteOffset) & idMask);
    }

    private static void WritePackedMaterialId(byte[] data, int byteOffset, byte materialId, uint idMask = VoxelDataV2IdMask)
    {
        if (data == null || byteOffset < 0 || byteOffset + sizeof(uint) > data.Length)
            throw new InvalidOperationException("Voxel point material byte offset is out of range.");

        var packed = BitConverter.ToUInt32(data, byteOffset);
        packed = (packed & ~idMask) | ((uint)materialId & idMask);
        var bytes = BitConverter.GetBytes(packed);
        Buffer.BlockCopy(bytes, 0, data, byteOffset, bytes.Length);
    }

    private static void BuildElement(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        bool isNestedXmlChild = false)
    {
        switch (element.Name.LocalName)
        {
            case "group":
                BuildContainer(element, parent, context, currentXmlPath, "Group", false, isNestedXmlChild);
                break;
            case "body":
                BuildContainer(element, parent, context, currentXmlPath, "Body", true, isNestedXmlChild);
                break;
            case "compound":
                BuildContainer(element, parent, context, currentXmlPath, "Compound", false, isNestedXmlChild);
                break;
            case "vox":
                BuildVox(element, parent, context, currentXmlPath, isNestedXmlChild);
                break;
            case "voxbox":
                BuildVoxBox(element, parent, context, currentXmlPath, isNestedXmlChild);
                break;
            case "voxagon":
                BuildVoxagon(element, parent, context, currentXmlPath);
                break;
            case "voxscript":
                BuildVoxScript(element, parent, context, currentXmlPath);
                break;
            case "instance":
                BuildInstance(element, parent, context, currentXmlPath);
                break;
            case "light":
                BuildLight(element, parent, context);
                break;
            case "spawnpoint":
                BuildSpawnPoint(element, parent, context);
                break;
            case "location":
                BuildLocation(element, parent, context);
                break;
            case "joint":
                BuildJointPlaceholder(element, parent, context, Quaternion.identity, Vector3.zero, Vector3.one, context.Report.JointCount);
                break;
            case "boundary":
            case "environment":
            case "vertex":
            case "water":
                context.Report.AddSkipped(element.Name.LocalName);
                break;
            case "script":
                BuildScriptContainer(element, parent, context, currentXmlPath, isNestedXmlChild);
                break;
            default:
                context.Report.AddSkipped(element.Name.LocalName);
                context.Report.AddWarning("Skipped unsupported XML element: " + element.Name.LocalName);
                break;
        }
    }

    private static void BuildContainer(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        string fallbackName,
        bool isBody,
        bool isNestedXmlChild)
    {
        var name = GetAttribute(element, "name", fallbackName);
        var container = new GameObject(SanitizeObjectName(name));
        container.transform.SetParent(parent, false);
        ApplyXmlTransform(container.transform, element);

        if (context.Options.SetRuntimeLayers)
            container.layer = GetLayer(isBody ? "Item" : "Building", parent.gameObject.layer);

        if (isBody)
            context.Report.BodyCount++;
        else
            context.Report.GroupCount++;

        foreach (var child in element.Elements())
            BuildElement(child, container.transform, context, currentXmlPath, isNestedXmlChild);
    }

    private static void BuildScriptContainer(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        bool isNestedXmlChild)
    {
        if (!IsScriptSceneContainer(element))
        {
            context.Report.AddSkipped(element.Name.LocalName);
            return;
        }

        var container = new GameObject(SanitizeObjectName(GetScriptContainerName(element)));
        container.transform.SetParent(parent, false);
        ApplyXmlTransform(container.transform, element);

        if (context.Options.SetRuntimeLayers)
            container.layer = GetLayer("Building", parent.gameObject.layer);

        foreach (var child in element.Elements())
            BuildElement(child, container.transform, context, currentXmlPath, isNestedXmlChild);
    }

    internal static bool IsScriptSceneContainer(XElement element)
    {
        return element != null && element.Elements().Any(IsSceneChildElement);
    }

    internal static string GetScriptContainerName(XElement element)
    {
        if (element == null)
            return "Script";

        var name = GetAttribute(element, "name", "");
        if (!string.IsNullOrWhiteSpace(name))
            return name;

        var file = NormalizeAssetPath(GetAttribute(element, "file", ""));
        if (!string.IsNullOrWhiteSpace(file))
        {
            var fileName = Path.GetFileNameWithoutExtension(file);
            if (!string.IsNullOrWhiteSpace(fileName))
                return fileName;
        }

        return "Script";
    }

    private static bool IsSceneChildElement(XElement element)
    {
        if (element == null)
            return false;

        switch (element.Name.LocalName)
        {
            case "group":
            case "body":
            case "compound":
            case "vox":
            case "voxbox":
            case "voxagon":
            case "voxscript":
            case "instance":
            case "light":
            case "spawnpoint":
            case "location":
            case "joint":
                return true;
            case "script":
                return IsScriptSceneContainer(element);
            default:
                return false;
        }
    }

    private static void BuildInstance(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath)
    {
        var fileRef = GetAttribute(element, "file", "");
        var xmlPath = context.ResolveXmlPath(fileRef, currentXmlPath);
        var instanceName = GetAttribute(element, "name", Path.GetFileNameWithoutExtension(fileRef));
        if (string.IsNullOrWhiteSpace(instanceName))
            instanceName = "Instance";

        var instance = new GameObject(SanitizeObjectName(instanceName));
        instance.transform.SetParent(parent, false);
        ApplyXmlTransform(instance.transform, element);
        if (context.Options.SetRuntimeLayers)
            instance.layer = GetLayer("Building", parent.gameObject.layer);

        context.Report.InstanceCount++;

        if (string.IsNullOrWhiteSpace(xmlPath) || !File.Exists(ToAbsolutePath(xmlPath)))
        {
            context.Report.AddMissingFile(string.IsNullOrWhiteSpace(xmlPath) ? fileRef : xmlPath);
            return;
        }

        if (context.IsXmlActive(xmlPath))
        {
            context.Report.AddWarning("Skipped recursive Teardown instance: " + xmlPath);
            return;
        }

        context.PushXml(xmlPath);
        try
        {
            var document = LoadXmlDocument(xmlPath);
            var root = document.Root;
            if (root == null)
                return;

            if (root.Name.LocalName != "scene" && root.Name.LocalName != "prefab")
            {
                context.Report.AddWarning("Skipped instance with unsupported XML root '" + root.Name.LocalName + "': " + xmlPath);
                return;
            }

            var children = root.Elements().ToList();
            if (root.Name.LocalName == "prefab" &&
                context.Options.RebasePrefabRoots &&
                TryGetSinglePrefabWrapper(children, out var wrapper))
            {
                foreach (var child in wrapper.Elements())
                    BuildElement(child, instance.transform, context, xmlPath);
                return;
            }

            foreach (var child in children)
                BuildElement(child, instance.transform, context, xmlPath);
        }
        finally
        {
            context.PopXml(xmlPath);
        }
    }

    private static void BuildVox(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        bool isNestedXmlChild)
    {
        var objectName = GetAttribute(element, "object", GetAttribute(element, "name", "Vox"));
        var sourceFile = GetAttribute(element, "file", "");
        var sourceObject = context.ResolveSourceObject(sourceFile, currentXmlPath, objectName);

        var instance = CreateSourceInstance(sourceObject, objectName, sourceFile, context);
        var voxelBounds = GetVoxelBounds(sourceObject, context);
        var sourceRotation = instance.transform.localRotation;
        var sourceScale = ResolveSourceScale(instance.transform.localScale, context.Options.ElementScaleOrDefault());
        var runtimeKind = InferTeardownVoxelRuntimeKind(element);

        instance.transform.SetParent(parent, false);
        var pivotOffset = ApplyVoxXmlTransform(instance.transform, element, sourceRotation, sourceScale, voxelBounds, isNestedXmlChild);
        var elementLocalScale = instance.transform.localScale;

        if (context.Options.SetRuntimeLayers)
            instance.layer = GetLayer("Item", instance.layer);
        if (sourceObject != null)
            ConfigureGeneratedVoxelRuntime(instance, runtimeKind, context, null);

        context.Report.VoxCount++;
        BuildVoxChildren(element, instance.transform, context, currentXmlPath, sourceRotation, pivotOffset, elementLocalScale, runtimeKind, sourceObject != null);
    }

    private static void BuildVoxBox(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        bool isNestedXmlChild)
    {
        var explicitObjectName = GetAttribute(element, "object", "");
        var displayObjectName = GetAttribute(element, "name", "");
        var objectName = string.IsNullOrWhiteSpace(explicitObjectName) ? "VoxBox" : explicitObjectName;
        if (string.IsNullOrWhiteSpace(displayObjectName))
            displayObjectName = objectName;
        var sourceFile = GetAttribute(element, "brush", "");
        var requestedSize = MaxVector3Int(Vector3Int.one, ParseVector3Int(GetAttribute(element, "size", "1 1 1"), Vector3Int.one));
        var brushOffset = ParseVector3Int(GetAttribute(element, "offset", "0"), Vector3Int.zero);
        var brushOverride = CreateVoxBoxBrushOverride(element, sourceFile);
        var isHoleBrush = IsTeardownHoleBrushReference(sourceFile);
        var sourceObject = isHoleBrush
            ? null
            : string.IsNullOrWhiteSpace(sourceFile)
            ? context.ResolveProceduralVoxelObject(CreateSolidBoxDefinition(element, displayObjectName, requestedSize))
            : context.ResolveVoxBoxSourceObject(sourceFile, currentXmlPath, objectName, requestedSize, brushOffset, brushOverride);

        var instance = CreateSourceInstance(sourceObject, displayObjectName, sourceFile, context, !isHoleBrush);
        var voxelBounds = GetVoxelBounds(sourceObject, context);
        var sourceRotation = instance.transform.localRotation;
        var sourceScale = ResolveSourceScale(instance.transform.localScale, context.Options.ElementScaleOrDefault());
        var requestedSizeVoxels = new Vector3(requestedSize.x, requestedSize.y, requestedSize.z);
        var runtimeKind = InferTeardownVoxelRuntimeKind(element);

        instance.transform.SetParent(parent, false);
        var pivotOffset = ApplyVoxBoxXmlTransform(
            instance.transform,
            element,
            sourceRotation,
            sourceScale,
            voxelBounds,
            requestedSizeVoxels,
            context.Options.ElementScaleOrDefault(),
            isNestedXmlChild);
        var elementLocalScale = instance.transform.localScale;

        if (context.Options.SetRuntimeLayers)
            instance.layer = GetLayer("Item", instance.layer);
        if (sourceObject != null)
            ConfigureGeneratedVoxelRuntime(instance, runtimeKind, context, null);

        context.Report.VoxBoxCount++;
        BuildVoxChildren(element, instance.transform, context, currentXmlPath, sourceRotation, pivotOffset, elementLocalScale, runtimeKind, sourceObject != null);
    }

    private static void BuildVoxScript(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath)
    {
        if (context.Options.GenerateHeightmapVoxscripts &&
            TryGetHeightmapVoxScriptDefinition(element, context, currentXmlPath, out var definition))
        {
            BuildHeightmapVoxScript(element, parent, context, currentXmlPath, definition);
            return;
        }

        if (TryGetProceduralVoxScriptDefinition(element, currentXmlPath, context, out var proceduralDefinition))
        {
            BuildProceduralVoxScript(element, parent, context, currentXmlPath, proceduralDefinition);
            return;
        }

        BuildUnsupportedVoxScriptContainer(element, parent, context, currentXmlPath);
    }

    private static void BuildHeightmapVoxScript(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        HeightmapVoxScriptDefinition definition)
    {
        var tileAssets = context.ResolveHeightmapTileAssets(definition);
        if (tileAssets.Count == 0)
        {
            context.Report.AddSkipped(element.Name.LocalName);
            context.Report.AddWarning("Skipped heightmap voxscript because no tiles were generated: " + definition.ImagePath);
            return;
        }

        var container = new GameObject(SanitizeObjectName(definition.Name));
        container.transform.SetParent(parent, false);
        ApplyXmlTransform(container.transform, element);
        if (context.Options.SetRuntimeLayers)
            container.layer = GetLayer("Building", parent.gameObject.layer);

        var elementScale = context.Options.ElementScaleOrDefault();
        foreach (var tileAsset in tileAssets)
        {
            var instance = Object.Instantiate(tileAsset.Prefab);
            instance.name = tileAsset.Name;
            instance.transform.SetParent(container.transform, false);
            var voxelScale = elementScale * Mathf.Max(0.001f, tileAsset.VoxelScale);
            instance.transform.localPosition = GetHeightmapTileLocalPosition(tileAsset.TileOrigin, tileAsset.TileSize, voxelScale);
            instance.transform.localRotation = Quaternion.identity;
            instance.transform.localScale = Vector3.one * voxelScale;

            if (context.Options.SetRuntimeLayers)
                instance.layer = GetLayer("Building", instance.layer);
            ConfigureGeneratedVoxelRuntime(instance, GeneratedVoxelRuntimeKind.HeightmapTerrain, context, null);
        }

        context.Report.HeightmapVoxScriptCount++;
        context.Report.HeightmapTileInstanceCount += tileAssets.Count;

        BuildVoxScriptChildren(element, container.transform, context, currentXmlPath);
    }

    private static void BuildProceduralVoxScript(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath,
        ProceduralVoxelDefinition definition)
    {
        var sourceObject = context.ResolveProceduralVoxelObject(definition);
        var instance = CreateSourceInstance(sourceObject, definition.Name, GetAttribute(element, "file", ""), context);
        var voxelBounds = GetVoxelBounds(sourceObject, context);
        var sourceRotation = instance.transform.localRotation;
        var sourceScale = ResolveSourceScale(instance.transform.localScale, context.Options.ElementScaleOrDefault());
        var runtimeKind = InferTeardownVoxelRuntimeKind(element);

        instance.transform.SetParent(parent, false);
        var pivotOffset = ApplyVoxBoxXmlTransform(
            instance.transform,
            element,
            sourceRotation,
            sourceScale,
            voxelBounds,
            definition.Size,
            context.Options.ElementScaleOrDefault(),
            false);
        var elementLocalScale = instance.transform.localScale;

        if (context.Options.SetRuntimeLayers)
            instance.layer = GetLayer("Item", instance.layer);
        if (sourceObject != null)
            ConfigureGeneratedVoxelRuntime(instance, runtimeKind, context, null);

        context.Report.VoxCount++;
        BuildVoxChildren(element, instance.transform, context, currentXmlPath, sourceRotation, pivotOffset, elementLocalScale, runtimeKind, sourceObject != null);
    }

    private static void BuildVoxagon(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath)
    {
        if (!TryCreateVoxagonDefinition(element, context, out var definition, out var localOffsetMeters))
        {
            context.Report.AddSkipped(element.Name.LocalName);
            BuildUnsupportedVoxScriptContainer(element, parent, context, currentXmlPath);
            return;
        }

        var containerName = GetAttribute(element, "name", definition.Name);
        var container = new GameObject(SanitizeObjectName(containerName));
        container.transform.SetParent(parent, false);
        ApplyXmlTransform(container.transform, element);
        if (context.Options.SetRuntimeLayers)
            container.layer = GetLayer("Building", parent.gameObject.layer);

        var sourceObject = context.ResolveProceduralVoxelObject(definition);
        var instance = CreateSourceInstance(sourceObject, definition.Name, GetAttribute(element, "brush", ""), context);
        instance.transform.SetParent(container.transform, false);
        instance.transform.localPosition = TeardownToUnityDirection(localOffsetMeters);
        instance.transform.localRotation = Quaternion.identity;
        instance.transform.localScale = Vector3.one * context.Options.ElementScaleOrDefault();
        if (context.Options.SetRuntimeLayers)
            instance.layer = GetLayer("Item", instance.layer);
        var runtimeKind = InferTeardownVoxelRuntimeKind(element);
        if (sourceObject != null)
            ConfigureGeneratedVoxelRuntime(instance, runtimeKind, context, null);
        BuildDirectJointAttachments(element, instance.transform, context, Quaternion.identity, Vector3.zero, instance.transform.localScale, runtimeKind, sourceObject != null);

        context.Report.VoxagonCount++;

        foreach (var child in element.Elements())
        {
            if (child.Name.LocalName == "vertex" ||
                child.Name.LocalName == "joint" ||
                child.Name.LocalName == "parameters")
                continue;

            BuildElement(child, container.transform, context, currentXmlPath);
        }
    }

    private static void BuildUnsupportedVoxScriptContainer(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath)
    {
        context.Report.AddSkipped(element.Name.LocalName);

        var scriptRef = GetAttribute(element, "file", "voxscript");
        var container = new GameObject(SanitizeObjectName(Path.GetFileNameWithoutExtension(scriptRef)));
        container.transform.SetParent(parent, false);
        ApplyXmlTransform(container.transform, element);
        if (context.Options.SetRuntimeLayers)
            container.layer = GetLayer("Building", parent.gameObject.layer);

        BuildVoxScriptChildren(element, container.transform, context, currentXmlPath);
    }

    private static void BuildVoxScriptChildren(
        XElement element,
        Transform parent,
        ImportContext context,
        string currentXmlPath)
    {
        foreach (var child in element.Elements())
        {
            if (child.Name.LocalName == "parameters")
                continue;

            BuildElement(child, parent, context, currentXmlPath);
        }
    }

    private static void BuildVoxChildren(
        XElement element,
        Transform instanceTransform,
        ImportContext context,
        string currentXmlPath,
        Quaternion sourceRotation,
        PivotOffsetInfo pivotOffset,
        Vector3 elementLocalScale,
        GeneratedVoxelRuntimeKind runtimeKind,
        bool hasVoxelRuntime)
    {
        BuildDirectJointAttachments(
            element,
            instanceTransform,
            context,
            sourceRotation,
            pivotOffset.ElementLocalVoxelUnits,
            elementLocalScale,
            runtimeKind,
            hasVoxelRuntime);

        Transform nestedXmlParent = null;
        foreach (var child in element.Elements())
        {
            if (child.Name.LocalName == "joint" || child.Name.LocalName == "parameters")
                continue;

            if (nestedXmlParent == null)
                nestedXmlParent = CreateNestedXmlParent(
                    instanceTransform,
                    context,
                    sourceRotation,
                    pivotOffset.ElementLocalVoxelUnits,
                    elementLocalScale);

            BuildElement(child, nestedXmlParent, context, currentXmlPath, true);
        }
    }

    private static void BuildDirectJointAttachments(
        XElement element,
        Transform instanceTransform,
        ImportContext context,
        Quaternion sourceRotation,
        Vector3 elementLocalPivotOffsetVoxelUnits,
        Vector3 elementLocalScale,
        GeneratedVoxelRuntimeKind runtimeKind,
        bool hasVoxelRuntime)
    {
        var attachmentPoints = new List<Component>();
        var jointIndex = 0;
        foreach (var joint in EnumerateDirectJointDefinitions(element))
        {
            if (runtimeKind == GeneratedVoxelRuntimeKind.SceneWeakConnected && hasVoxelRuntime)
            {
                var attachmentPoint = CreateAttachmentPoint(
                    joint,
                    instanceTransform,
                    context,
                    sourceRotation,
                    elementLocalPivotOffsetVoxelUnits,
                    elementLocalScale,
                    jointIndex);
                if (attachmentPoint != null)
                    attachmentPoints.Add(attachmentPoint);
            }
            else
            {
                BuildJointPlaceholder(
                    joint,
                    instanceTransform,
                    context,
                    sourceRotation,
                    elementLocalPivotOffsetVoxelUnits,
                    elementLocalScale,
                    jointIndex);
            }

            jointIndex++;
        }

        if (attachmentPoints.Count > 0)
            ConfigureWeakConnectedAttachmentPoints(
                instanceTransform.gameObject,
                attachmentPoints,
                LoadDefaultJointData(),
                context.Report);
    }

    private static GameObject CreateSourceInstance(
        GameObject sourceObject,
        string objectName,
        string sourceFile,
        ImportContext context,
        bool reportMissing = true)
    {
        GameObject instance;
        if (sourceObject == null)
        {
            instance = new GameObject("MISSING_" + SanitizeObjectName(objectName));
            if (reportMissing)
                context.Report.AddMissingObject(string.IsNullOrEmpty(sourceFile) ? objectName : sourceFile + "::" + objectName);
        }
        else
        {
            instance = Object.Instantiate(sourceObject);
            instance.name = SanitizeObjectName(GetDisplayObjectName(sourceObject, objectName));
        }

        return instance;
    }

    private static string GetDisplayObjectName(GameObject sourceObject, string objectName)
    {
        if (!string.IsNullOrWhiteSpace(objectName) && objectName != "Vox" && objectName != "VoxBox")
            return objectName;

        return sourceObject == null ? objectName : sourceObject.name;
    }

    internal static GeneratedVoxelRuntimeKind InferTeardownVoxelRuntimeKind(XElement element)
    {
        if (element == null)
            return GeneratedVoxelRuntimeKind.SceneStrongConnected;

        if (HasTeardownTagInSelfOrAncestors(element, "unbreakable"))
            return GeneratedVoxelRuntimeKind.SceneStatic;

        if (HasDirectJointDefinition(element))
            return GeneratedVoxelRuntimeKind.SceneWeakConnected;

        if (GetBoolAttribute(element, "prop") == true || IsInsideDynamicTeardownBody(element))
            return GeneratedVoxelRuntimeKind.SceneDynamic;

        return GeneratedVoxelRuntimeKind.SceneStrongConnected;
    }

    private static void ConfigureGeneratedVoxelRuntime(
        GameObject target,
        GeneratedVoxelRuntimeKind kind,
        ImportContext context,
        VoxelVolumeSaveDataV2Surrogate saveData)
    {
        ConfigureGeneratedVoxelRuntime(
            target,
            kind,
            context.Options.SetRuntimeLayers,
            context.Report,
            saveData);
    }

    internal static void ConfigureGeneratedVoxelRuntime(
        GameObject target,
        GeneratedVoxelRuntimeKind kind,
        bool setRuntimeLayers,
        ImportReport report,
        VoxelVolumeSaveDataV2Surrogate saveData)
    {
        if (target == null)
            return;

        report = report ?? new ImportReport();

        if (setRuntimeLayers)
            target.layer = GetLayer(IsStaticVoxelRuntimeKind(kind) ? "Building" : "Item", target.layer);

        var proxy = target.GetComponent<VoxelObjectProxy>();
        if (proxy != null)
        {
            SetVoxelProxyType(
                proxy,
                GetVoxelProxyTypeForRuntimeKind(kind));
            EditorUtility.SetDirty(proxy);
        }

        ConfigureRigidbodyProxy(
            target,
            GeneratedRuntimeMass,
            true,
            IsStaticVoxelRuntimeKind(kind),
            report);

        if (IsStaticVoxelRuntimeKind(kind))
        {
            RemoveRuntimeComponent(target, "EntityBuildingElement", report);
            RemoveRuntimeComponent(target, "EntityDestructibleItem", report);
            RemoveUnyieldingArea(target);
            EnsureRuntimeComponent(target, "EntityBuilding", report);
        }
        else if (kind == GeneratedVoxelRuntimeKind.SceneDynamic)
        {
            RemoveRuntimeComponent(target, "EntityBuildingElement", report);
            RemoveRuntimeComponent(target, "EntityDestructibleItem", report);
            RemoveUnyieldingArea(target);
            EnsureRuntimeComponent(target, "EntityBuilding", report);
        }
        else if (kind == GeneratedVoxelRuntimeKind.SceneStrongConnected ||
                 kind == GeneratedVoxelRuntimeKind.SceneWeakConnected)
        {
            RemoveRuntimeComponent(target, "EntityBuilding", report);
            RemoveRuntimeComponent(target, "EntityBuildingElement", report);
            EnsureRuntimeComponent(target, "EntityDestructibleItem", report);
            if (UsesUnyieldingArea(kind))
                AddOrUpdateUnyieldingArea(target, saveData, report);
            else
                RemoveUnyieldingArea(target);
        }
        else
        {
            RemoveRuntimeComponent(target, "EntityBuilding", report);
            RemoveRuntimeComponent(target, "EntityDestructibleItem", report);
            EnsureRuntimeComponent(target, "EntityBuildingElement", report);
            if (UsesUnyieldingArea(kind))
                AddOrUpdateUnyieldingArea(target, saveData, report);
            else
                RemoveUnyieldingArea(target);
        }

        EditorUtility.SetDirty(target);
    }

    private static bool IsStaticVoxelRuntimeKind(GeneratedVoxelRuntimeKind kind)
    {
        return kind == GeneratedVoxelRuntimeKind.HeightmapTerrain ||
               kind == GeneratedVoxelRuntimeKind.SceneStatic;
    }

    private static bool UsesUnyieldingArea(GeneratedVoxelRuntimeKind kind)
    {
        return kind == GeneratedVoxelRuntimeKind.ProceduralBuildingElement ||
               kind == GeneratedVoxelRuntimeKind.SceneStrongConnected;
    }

    private static int GetVoxelProxyTypeForRuntimeKind(GeneratedVoxelRuntimeKind kind)
    {
        switch (kind)
        {
            case GeneratedVoxelRuntimeKind.HeightmapTerrain:
            case GeneratedVoxelRuntimeKind.SceneStatic:
                return VoxelProxyTypeSceneStatic;
            case GeneratedVoxelRuntimeKind.SceneDynamic:
                return VoxelProxyTypeSceneDynamic;
            case GeneratedVoxelRuntimeKind.ProceduralBuildingElement:
            case GeneratedVoxelRuntimeKind.SceneStrongConnected:
                return VoxelProxyTypeSceneStrongConnected;
            case GeneratedVoxelRuntimeKind.SceneWeakConnected:
                return VoxelProxyTypeSceneWeakConnected;
            default:
                return VoxelProxyTypeSceneStrongConnected;
        }
    }

    private static void ConfigureRigidbodyProxy(
        GameObject target,
        float mass,
        bool useGravity,
        bool isKinematic,
        ImportReport report)
    {
        var component = EnsureRuntimeComponent(target, "RigidbodyProxy", report);
        if (component == null)
            return;

        var so = new SerializedObject(component);
        SetSerializedFloat(so, "mass", Mathf.Max(0.001f, mass));
        SetSerializedBool(so, "useGravity", useGravity);
        SetSerializedBool(so, "isKinematic", isKinematic);
        so.ApplyModifiedPropertiesWithoutUndo();
        EditorUtility.SetDirty(component);
    }

    private static Component EnsureRuntimeComponent(GameObject target, string typeName, ImportReport report)
    {
        if (target == null || string.IsNullOrWhiteSpace(typeName))
            return null;

        var type = FindRuntimeMonoBehaviourType(typeName, report);
        if (type == null)
            return null;

        var existing = target.GetComponents<Component>()
            .FirstOrDefault(component => component != null && type.IsAssignableFrom(component.GetType()));
        if (existing != null)
            return existing;

        try
        {
            var component = target.AddComponent(type);
            EditorUtility.SetDirty(component);
            return component;
        }
        catch (Exception e)
        {
            report.AddWarning("Failed to add runtime component '" + typeName + "' to '" + target.name + "': " + e.Message);
            return null;
        }
    }

    private static Component FindRuntimeComponent(GameObject target, string typeName, ImportReport report)
    {
        if (target == null || string.IsNullOrWhiteSpace(typeName))
            return null;

        var type = FindRuntimeMonoBehaviourType(typeName, report);
        if (type == null)
            return null;

        return target.GetComponents<Component>()
            .FirstOrDefault(component => component != null && type.IsAssignableFrom(component.GetType()));
    }

    private static void RemoveRuntimeComponent(GameObject target, string typeName, ImportReport report)
    {
        if (target == null || string.IsNullOrWhiteSpace(typeName))
            return;

        var type = FindRuntimeMonoBehaviourType(typeName, report);
        if (type == null)
            return;

        foreach (var component in target.GetComponents<Component>()
                     .Where(component => component != null && type.IsAssignableFrom(component.GetType()))
                     .ToArray())
        {
            Object.DestroyImmediate(component);
        }
    }

    private static Type FindRuntimeMonoBehaviourType(string typeName, ImportReport report)
    {
        if (RuntimeMonoBehaviourTypeByName.TryGetValue(typeName, out var cachedType))
            return cachedType;

        var type = TypeCache.GetTypesDerivedFrom<MonoBehaviour>()
            .FirstOrDefault(candidate =>
                !candidate.IsAbstract &&
                !candidate.IsGenericTypeDefinition &&
                string.Equals(candidate.Name, typeName, StringComparison.Ordinal));
        RuntimeMonoBehaviourTypeByName[typeName] = type;

        if (type == null && MissingRuntimeMonoBehaviourWarnings.Add(typeName))
            report.AddWarning("Could not find loaded runtime component type '" + typeName + "'.");

        return type;
    }

    private static void SetVoxelProxyType(VoxelObjectProxy proxy, int proxyType)
    {
        var so = new SerializedObject(proxy);
        var prop = so.FindProperty("proxyType");
        if (prop != null)
        {
            if (prop.propertyType == SerializedPropertyType.Enum)
                prop.enumValueIndex = proxyType;
            else
                prop.intValue = proxyType;
        }
        so.ApplyModifiedPropertiesWithoutUndo();
    }

    private static void AddOrUpdateUnyieldingArea(
        GameObject target,
        VoxelVolumeSaveDataV2Surrogate saveData,
        ImportReport report)
    {
        if (!TryResolveUnyieldingAreaPose(target, saveData, out var localPosition, out var colliderSize))
            colliderSize = new Vector3(10f, UnyieldingAreaHeight, 10f);

        var areaTransform = target.transform.Find(UnyieldingAreaName);
        GameObject areaObject;
        if (areaTransform == null)
        {
            areaObject = new GameObject(UnyieldingAreaName);
            areaObject.transform.SetParent(target.transform, false);
        }
        else
        {
            areaObject = areaTransform.gameObject;
        }

        areaObject.layer = 0;
        areaObject.tag = "Untagged";
        areaObject.transform.localPosition = localPosition;
        areaObject.transform.localRotation = Quaternion.identity;
        areaObject.transform.localScale = Vector3.one;

        EnsureRuntimeComponent(areaObject, UnyieldingAreaName, report);

        var collider = areaObject.GetComponent<BoxCollider>();
        if (collider == null)
            collider = areaObject.AddComponent<BoxCollider>();
        collider.isTrigger = false;
        collider.center = Vector3.zero;
        collider.size = colliderSize;

        EditorUtility.SetDirty(collider);
        EditorUtility.SetDirty(areaObject.transform);
        EditorUtility.SetDirty(areaObject);
    }

    private static void RemoveUnyieldingArea(GameObject target)
    {
        var areaTransform = target == null ? null : target.transform.Find(UnyieldingAreaName);
        if (areaTransform != null)
            Object.DestroyImmediate(areaTransform.gameObject);
    }

    private static bool TryResolveUnyieldingAreaPose(
        GameObject target,
        VoxelVolumeSaveDataV2Surrogate saveData,
        out Vector3 localPosition,
        out Vector3 colliderSize)
    {
        if (TryGetBottomLayerFootprint(target, saveData, out var footprint))
        {
            localPosition = new Vector3(footprint.CenterX, footprint.BottomY, footprint.CenterZ);
            colliderSize = new Vector3(
                Mathf.Max(1f, footprint.SizeX + UnyieldingAreaHorizontalPadding),
                UnyieldingAreaHeight,
                Mathf.Max(1f, footprint.SizeZ + UnyieldingAreaHorizontalPadding));
            return true;
        }

        localPosition = Vector3.zero;
        colliderSize = Vector3.zero;
        return false;
    }

    private static bool TryGetBottomLayerFootprint(
        GameObject target,
        VoxelVolumeSaveDataV2Surrogate saveData,
        out BottomLayerFootprint footprint)
    {
        if (TryGetBottomLayerFootprintFromSaveData(saveData, out footprint))
            return true;

        var proxy = target == null ? null : target.GetComponent<VoxelObjectProxy>();
        if (proxy == null || proxy.voxelFile == null)
            return false;

        try
        {
            return TryGetBottomLayerFootprintFromSaveData(DeserializeVoxelSaveData(proxy.voxelFile.bytes), out footprint);
        }
        catch
        {
            footprint = BottomLayerFootprint.Empty;
            return false;
        }
    }

    private static bool TryGetBottomLayerFootprintFromSaveData(object saveData, out BottomLayerFootprint footprint)
    {
        if (saveData is VoxelVolumeSaveDataV2Surrogate saveDataV2)
        {
            var volumeSize = GetVolumeSize(saveDataV2);
            if (TryGetBottomLayerFootprintFromPointData(
                    saveDataV2.cubeByteData,
                    volumeSize,
                    VoxelDataV2PointStride,
                    VoxelDataV2IdByteOffset,
                    VoxelDataV2IdMask,
                    out footprint))
                return true;

            return TryGetFootprintFromVolumeSize(volumeSize, out footprint);
        }

        if (saveData is VoxelVolumeSaveDataSurrogate saveDataV1)
        {
            var volumeSize = new Vector3Int(
                saveDataV1.chunkCountX * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountY * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountZ * saveDataV1.cubeCountPerAxisInAChunk);

            if (TryGetBottomLayerFootprintFromPointData(
                    saveDataV1.cubeByteData,
                    volumeSize,
                    16,
                    4,
                    0xFFu,
                    out footprint))
                return true;

            return TryGetFootprintFromVolumeSize(volumeSize, out footprint);
        }

        footprint = BottomLayerFootprint.Empty;
        return false;
    }

    private static bool TryGetBottomLayerFootprintFromPointData(
        byte[] data,
        Vector3Int volumeSize,
        int pointStride,
        int idByteOffset,
        uint idMask,
        out BottomLayerFootprint footprint)
    {
        footprint = BottomLayerFootprint.Empty;
        if (!CanReadRawPointData(data, volumeSize, pointStride))
            return false;

        var minY = int.MaxValue;
        var minX = int.MaxValue;
        var maxX = int.MinValue;
        var minZ = int.MaxValue;
        var maxZ = int.MinValue;
        var xyStride = volumeSize.x * volumeSize.y;
        var pointCount = (long)volumeSize.x * volumeSize.y * volumeSize.z;

        for (var index = 0L; index < pointCount; index++)
        {
            var byteOffset = (int)(index * pointStride) + idByteOffset;
            if (byteOffset + sizeof(uint) > data.Length)
                return false;

            if ((BitConverter.ToUInt32(data, byteOffset) & idMask) == 0u)
                continue;

            var z = (int)(index / xyStride);
            var rem = (int)(index % xyStride);
            var y = rem / volumeSize.x;
            var x = rem % volumeSize.x;

            if (y < minY)
            {
                minY = y;
                minX = maxX = x;
                minZ = maxZ = z;
            }
            else if (y == minY)
            {
                minX = Mathf.Min(minX, x);
                maxX = Mathf.Max(maxX, x);
                minZ = Mathf.Min(minZ, z);
                maxZ = Mathf.Max(maxZ, z);
            }
        }

        if (minY == int.MaxValue)
            return false;

        footprint = new BottomLayerFootprint(minX, maxX, minY, minZ, maxZ);
        return true;
    }

    private static bool TryGetFootprintFromVolumeSize(Vector3Int volumeSize, out BottomLayerFootprint footprint)
    {
        if (!HasPositiveSize(volumeSize))
        {
            footprint = BottomLayerFootprint.Empty;
            return false;
        }

        footprint = new BottomLayerFootprint(0, volumeSize.x - 1, 0, 0, volumeSize.z - 1);
        return true;
    }

    private static void BuildLight(XElement element, Transform parent, ImportContext context)
    {
        var lightObject = new GameObject(SanitizeObjectName(GetAttribute(element, "name", "Light")));
        lightObject.transform.SetParent(parent, false);
        ApplyXmlTransform(lightObject.transform, element);

        var light = lightObject.AddComponent<Light>();
        light.type = LightType.Point;
        light.color = ParseColor(GetAttribute(element, "color", "1 1 1"));

        var size = ParseScale(GetAttribute(element, "size", GetAttribute(element, "scale", "5")));
        light.range = Mathf.Max(0.1f, Mathf.Max(size.x, Mathf.Max(size.y, size.z)) * 5f);
        light.intensity = Mathf.Max(1f, Mathf.Max(light.color.r, Mathf.Max(light.color.g, light.color.b)));

        context.Report.LightCount++;
    }

    private static void BuildSpawnPoint(XElement element, Transform parent, ImportContext context)
    {
        var spawnObject = new GameObject("ArrowSpawnPoint");
        spawnObject.transform.SetParent(parent, false);
        ApplyXmlTransform(spawnObject.transform, element);

        if (context.Options.SetRuntimeLayers)
            spawnObject.layer = parent.gameObject.layer;

        if (context.SpawnPoint == null)
            context.SpawnPoint = spawnObject.transform;

        context.Report.SpawnPointCount++;
    }

    private static void BuildLocation(XElement element, Transform parent, ImportContext context)
    {
        var name = GetAttribute(element, "name", "Location");
        var locationObject = new GameObject(SanitizeObjectName(name));
        locationObject.transform.SetParent(parent, false);
        ApplyXmlTransform(locationObject.transform, element);

        if (context.Options.SetRuntimeLayers)
            locationObject.layer = parent.gameObject.layer;

        var tags = GetAttribute(element, "tags", "");
        if (context.SpawnPoint == null &&
            (name.IndexOf("spawn", StringComparison.OrdinalIgnoreCase) >= 0 ||
             tags.IndexOf("spawn", StringComparison.OrdinalIgnoreCase) >= 0))
        {
            context.SpawnPoint = locationObject.transform;
            context.Report.SpawnPointCount++;
        }
    }

    private static AttachmentPoint CreateAttachmentPoint(
        XElement jointElement,
        Transform parent,
        ImportContext context,
        Quaternion parentSourceRotation,
        Vector3 parentPivotOffsetVoxelUnits,
        Vector3 parentLocalScale,
        int index)
    {
        var attachmentObject = new GameObject(GetAttachmentPointName(jointElement, parent, index));
        attachmentObject.transform.SetParent(parent, false);

        var sourceFrameRotation = Quaternion.Inverse(parentSourceRotation);
        attachmentObject.transform.localPosition =
            Vector3.Scale(sourceFrameRotation * ParseTeardownPosition(jointElement, "pos", Vector3.zero), InverseScale(parentLocalScale)) +
            parentPivotOffsetVoxelUnits;
        attachmentObject.transform.localRotation = sourceFrameRotation * ParseTeardownRotation(jointElement, "rot");
        attachmentObject.transform.localScale = Vector3.one * DefaultAttachmentPointScale;

        if (context.Options.SetRuntimeLayers)
            attachmentObject.layer = GetLayer("Attachable", 18);

        var attachmentPoint = attachmentObject.AddComponent<AttachmentPoint>();
        var boxCollider = attachmentObject.AddComponent<BoxCollider>();
        boxCollider.isTrigger = true;
        boxCollider.size = Vector3.one;
        boxCollider.center = Vector3.zero;

        var so = new SerializedObject(attachmentPoint);
        SetSerializedBool(so, "activeSearch", true);
        SetSerializedBool(so, "showGiz", true);
        var dirs = so.FindProperty("enabledDirs");
        if (dirs != null && dirs.isArray)
        {
            dirs.arraySize = AttachmentDirectionCount;
            for (var i = 0; i < dirs.arraySize; i++)
                dirs.GetArrayElementAtIndex(i).boolValue = true;
        }

        so.ApplyModifiedPropertiesWithoutUndo();
        EditorUtility.SetDirty(boxCollider);
        EditorUtility.SetDirty(attachmentObject.transform);
        EditorUtility.SetDirty(attachmentObject);

        context.Report.JointCount++;
        return attachmentPoint;
    }

    private static string GetAttachmentPointName(XElement jointElement, Transform parent, int index)
    {
        var name = GetAttribute(jointElement, "name", "");
        if (string.IsNullOrWhiteSpace(name))
            name = GetAttribute(jointElement, "tags", "");
        if (string.IsNullOrWhiteSpace(name))
            name = parent == null ? "Joint" : parent.name;

        return "AttachmentPoint " + SanitizeObjectName(name) + " " + index;
    }

    private static void BuildJointPlaceholder(
        XElement jointElement,
        Transform parent,
        ImportContext context,
        Quaternion parentSourceRotation,
        Vector3 parentPivotOffsetVoxelUnits,
        Vector3 parentLocalScale,
        int index)
    {
        var jointObject = new GameObject("Joint " + index);
        jointObject.transform.SetParent(parent, false);

        var sourceFrameRotation = Quaternion.Inverse(parentSourceRotation);
        jointObject.transform.localPosition =
            Vector3.Scale(sourceFrameRotation * ParseTeardownPosition(jointElement, "pos", Vector3.zero), InverseScale(parentLocalScale)) +
            parentPivotOffsetVoxelUnits;
        jointObject.transform.localRotation = sourceFrameRotation * ParseTeardownRotation(jointElement, "rot");
        jointObject.transform.localScale = Vector3.one * context.Options.ElementScaleOrDefault();

        context.Report.JointCount++;
    }

    internal static void ConfigureWeakConnectedAttachmentPoints(
        GameObject target,
        IReadOnlyList<Component> attachmentPoints,
        Object jointData,
        ImportReport report)
    {
        if (target == null)
            return;

        report = report ?? new ImportReport();
        var entity = FindRuntimeComponent(target, "EntityDestructibleItem", report);
        if (entity == null)
        {
            report.AddWarning("Cannot configure Teardown joint attachments on '" + target.name + "' because it has no EntityDestructibleItem.");
            return;
        }

        ConfigureEntityAttachmentPoints(entity, attachmentPoints, jointData);
    }

    private static void ConfigureEntityAttachmentPoints(
        Component entity,
        IReadOnlyList<Component> attachmentPoints,
        Object jointData)
    {
        if (entity == null)
            return;

        var validAttachmentPoints = attachmentPoints == null
            ? new List<Component>()
            : attachmentPoints.Where(point => point != null).ToList();

        var so = new SerializedObject(entity);
        var attachPoints = so.FindProperty("attachObj.attachPoints");
        if (attachPoints != null && attachPoints.isArray)
        {
            attachPoints.arraySize = validAttachmentPoints.Count;
            for (var i = 0; i < validAttachmentPoints.Count; i++)
                attachPoints.GetArrayElementAtIndex(i).objectReferenceValue = validAttachmentPoints[i];
        }

        SetSerializedObject(so, "attachObj.attachmentHelper.jointData", jointData);
        SetSerializedObject(so, "jointData", jointData);
        SetSerializedObject(so, "JointData", jointData);
        SetSerializedBool(so, "showAttachmentPointGizmos", validAttachmentPoints.Count > 0);
        so.ApplyModifiedPropertiesWithoutUndo();
        EditorUtility.SetDirty(entity);

        foreach (var attachmentPoint in validAttachmentPoints)
        {
            var pointSo = new SerializedObject(attachmentPoint);
            SetSerializedObject(pointSo, "entityAttachmentItem", entity);
            SetSerializedBool(pointSo, "activeSearch", true);
            SetSerializedBool(pointSo, "showGiz", true);
            pointSo.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(attachmentPoint);
        }
    }

    private static Transform CreateNestedXmlParent(
        Transform parent,
        ImportContext context,
        Quaternion parentSourceRotation,
        Vector3 parentPivotOffsetVoxelUnits,
        Vector3 parentLocalScale)
    {
        var nestedParent = new GameObject("XmlChildren");
        var targetParent = parent.parent == null ? parent : parent.parent;
        nestedParent.transform.SetParent(targetParent, false);

        var parentLocalRotation = parent.localRotation;
        nestedParent.transform.localPosition =
            parent.localPosition +
            parentLocalRotation * Vector3.Scale(parentPivotOffsetVoxelUnits, parentLocalScale);
        nestedParent.transform.localRotation = parentLocalRotation * Quaternion.Inverse(parentSourceRotation);
        nestedParent.transform.localScale = Vector3.one;

        if (context.Options.SetRuntimeLayers)
            nestedParent.layer = GetLayer("Building", parent.gameObject.layer);

        return nestedParent.transform;
    }

    private static bool TryGetSinglePrefabWrapper(List<XElement> children, out XElement wrapper)
    {
        wrapper = null;
        if (children == null || children.Count != 1)
            return false;

        var candidate = children[0];
        if (candidate.Name.LocalName != "group" && candidate.Name.LocalName != "body")
            return false;

        wrapper = candidate;
        return true;
    }

    internal static bool IsSupportedSceneImportRoot(XElement rootElement)
    {
        if (rootElement == null)
            return false;

        var rootName = rootElement.Name.LocalName;
        return rootName == "scene" || rootName == "prefab";
    }

    internal static List<XElement> GetSceneImportRootChildren(XElement rootElement, bool rebasePrefabRoots)
    {
        if (rootElement == null)
            return new List<XElement>();

        var children = rootElement.Elements().ToList();
        if (rootElement.Name.LocalName == "prefab" &&
            rebasePrefabRoots &&
            TryGetSinglePrefabWrapper(children, out var wrapper))
        {
            return wrapper.Elements().ToList();
        }

        return children;
    }

    private static DependencyGraph DiscoverDependencies(string xmlAssetPath, string teardownModRootPath, ImportReport report)
    {
        var graph = new DependencyGraph(teardownModRootPath);
        var pending = new Queue<string>();
        pending.Enqueue(xmlAssetPath);

        while (pending.Count > 0)
        {
            var currentXmlPath = NormalizeAssetPath(pending.Dequeue());
            if (!graph.XmlFiles.Add(currentXmlPath))
                continue;

            if (!File.Exists(ToAbsolutePath(currentXmlPath)))
            {
                report.AddMissingFile(currentXmlPath);
                continue;
            }

            XDocument document;
            try
            {
                document = LoadXmlDocument(currentXmlPath);
            }
            catch (Exception e)
            {
                report.AddWarning("Failed to parse XML dependency '" + currentXmlPath + "': " + e.Message);
                continue;
            }

            var root = document.Root;
            if (root == null)
                continue;

            foreach (var element in root.Descendants())
            {
                if (element.Name.LocalName == "instance")
                {
                    var fileRef = GetAttribute(element, "file", "");
                    var xmlPath = ResolveAssetReference(fileRef, currentXmlPath, teardownModRootPath, ".xml");
                    if (string.IsNullOrWhiteSpace(xmlPath))
                        continue;

                    if (File.Exists(ToAbsolutePath(xmlPath)))
                        pending.Enqueue(xmlPath);
                    else
                        report.AddMissingFile(xmlPath);
                }
                else if (element.Name.LocalName == "vox")
                {
                    var fileRef = GetAttribute(element, "file", "");
                    var voxPath = ResolveAssetReference(fileRef, currentXmlPath, teardownModRootPath, ".vox");
                    if (!string.IsNullOrWhiteSpace(voxPath))
                        graph.VoxFiles.Add(voxPath);
                    if (!string.IsNullOrWhiteSpace(voxPath) && !File.Exists(ToAbsolutePath(voxPath)))
                        report.AddMissingFile(voxPath);
                }
                else if (element.Name.LocalName == "voxbox")
                {
                    var fileRef = GetAttribute(element, "brush", "");
                    if (IsTeardownHoleBrushReference(fileRef))
                        continue;

                    var voxPath = ResolveAssetReference(fileRef, currentXmlPath, teardownModRootPath, ".vox");
                    if (!string.IsNullOrWhiteSpace(voxPath))
                        graph.VoxFiles.Add(voxPath);
                    if (!string.IsNullOrWhiteSpace(voxPath) && !File.Exists(ToAbsolutePath(voxPath)))
                        report.AddMissingFile(voxPath);
                }
                else if (element.Name.LocalName == "voxscript")
                {
                    AddVoxScriptParameterDependencies(element, currentXmlPath, teardownModRootPath, graph, report);
                }
            }
        }

        return graph;
    }

    private static void AddVoxScriptParameterDependencies(
        XElement element,
        string currentXmlPath,
        string teardownModRootPath,
        DependencyGraph graph,
        ImportReport report)
    {
        var parameters = element.Elements().FirstOrDefault(child => child.Name.LocalName == "parameters");
        if (parameters == null)
            return;

        AddVoxParameterDependency(parameters, "type", currentXmlPath, teardownModRootPath, graph, report);
        AddVoxParameterDependency(parameters, "corner", currentXmlPath, teardownModRootPath, graph, report);
        AddVoxParameterDependency(parameters, "outside", currentXmlPath, teardownModRootPath, graph, report);
        AddVoxParameterDependency(parameters, "inside", currentXmlPath, teardownModRootPath, graph, report);
        AddVoxParameterDependency(parameters, "glass", currentXmlPath, teardownModRootPath, graph, report);
        AddVoxParameterDependency(parameters, "hole", currentXmlPath, teardownModRootPath, graph, report);
    }

    private static void AddVoxParameterDependency(
        XElement parameters,
        string attributeName,
        string currentXmlPath,
        string teardownModRootPath,
        DependencyGraph graph,
        ImportReport report)
    {
        var fileRef = GetAttribute(parameters, attributeName, "");
        if (string.IsNullOrWhiteSpace(fileRef))
            return;

        var voxPath = ResolveAssetReference(fileRef, currentXmlPath, teardownModRootPath, ".vox");
        if (!string.IsNullOrWhiteSpace(voxPath))
            graph.VoxFiles.Add(voxPath);
        if (!string.IsNullOrWhiteSpace(voxPath) && !File.Exists(ToAbsolutePath(voxPath)))
            report.AddMissingFile(voxPath);
    }

    private static VoxelBoundsInfo GetVoxelBounds(GameObject sourceObject, ImportContext context)
    {
        if (sourceObject == null)
            return VoxelBoundsInfo.Empty;

        var voxelProxy = sourceObject.GetComponent<VoxelObjectProxy>();
        if (voxelProxy == null || voxelProxy.voxelFile == null)
            return VoxelBoundsInfo.Empty;

        return context.TryGetVoxelBounds(voxelProxy.voxelFile, out var voxelBounds)
            ? voxelBounds
            : VoxelBoundsInfo.Empty;
    }

    private static GameObject CreateOrLoadDerivedVoxBoxSourceObject(
        GameObject sourceObject,
        string voxAssetPath,
        string objectName,
        Vector3Int requestedSize,
        Vector3Int brushOffset,
        VoxelBrushOverride brushOverride,
        ImportContext context)
    {
        if (sourceObject == null)
            return null;

        var sourceProxy = sourceObject.GetComponent<VoxelObjectProxy>();
        if (sourceProxy == null || sourceProxy.voxelFile == null)
        {
            context.Report.AddWarning("Cannot bake voxbox '" + objectName + "' because the converted source object has no VoxelObjectProxy voxel file.");
            return sourceObject;
        }

        if (!context.TryGetVoxelBounds(sourceProxy.voxelFile, out var sourceBounds) || !sourceBounds.HasVolumeSize)
        {
            context.Report.AddWarning("Cannot bake voxbox '" + objectName + "' because the converted source voxel bounds could not be read.");
            return sourceObject;
        }

        var bakeResolution = GetBrushVoxBoxBakeResolution(
            requestedSize,
            context.Options.ElementScaleOrDefault(),
            context.Options.BrushVoxBoxVoxelSizeOrDefault());
        var prefabPath = context.GetDerivedVoxBoxPrefabPath(voxAssetPath, objectName, bakeResolution, brushOffset, brushOverride);
        if (!context.Options.OverwriteExistingDependencies)
        {
            var existingPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (existingPrefab != null)
            {
                context.Report.ReusedVoxBoxDependencyCount++;
                return existingPrefab;
            }
        }

        object deserialized;
        try
        {
            deserialized = DeserializeVoxelSaveData(sourceProxy.voxelFile.bytes);
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Cannot bake voxbox '" + objectName + "' because the source voxel data failed to deserialize: " + e.Message);
            return sourceObject;
        }

        if (!(deserialized is VoxelVolumeSaveDataV2Surrogate sourceSaveData))
        {
            context.Report.AddWarning("Cannot bake voxbox '" + objectName + "' because only V2 voxel data is supported for voxbox baking.");
            return sourceObject;
        }

        VoxelVolumeSaveDataV2Surrogate bakedSaveData;
        try
        {
            bakedSaveData = CreateVoxBoxSaveData(
                sourceSaveData,
                sourceBounds,
                requestedSize,
                bakeResolution.BakedSize,
                brushOffset,
                sourceObject.transform.localRotation,
                brushOverride);
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Cannot bake voxbox '" + objectName + "' to " + FormatVector3Int(requestedSize) + ": " + e.Message);
            return sourceObject;
        }

        var dataPath = context.GetDerivedVoxBoxDataPath(voxAssetPath, objectName, bakeResolution, brushOffset, brushOverride);
        EnsureAssetFolder(Path.GetDirectoryName(dataPath));
        EnsureAssetFolder(Path.GetDirectoryName(prefabPath));

        try
        {
            File.WriteAllBytes(ToAbsolutePath(dataPath), SerializeRuntimeVoxelSaveDataV2(bakedSaveData));
            AssetDatabase.ImportAsset(dataPath, ImportAssetOptions.ForceUpdate);
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Failed to write baked voxbox voxel data '" + dataPath + "': " + e.Message);
            return sourceObject;
        }

        var bakedVoxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        if (bakedVoxelFile == null)
        {
            AssetDatabase.Refresh();
            bakedVoxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        }

        if (bakedVoxelFile == null)
        {
            context.Report.AddWarning("Failed to load baked voxbox voxel data '" + dataPath + "' after import.");
            return sourceObject;
        }

        GameObject prefabRoot = null;
        try
        {
            prefabRoot = Object.Instantiate(sourceObject);
            prefabRoot.name = SanitizeObjectName(GetDisplayObjectName(sourceObject, objectName));
            // Voxbox placement is authored by XML; source brush transforms are only atlas metadata.
            prefabRoot.transform.localPosition = Vector3.zero;
            prefabRoot.transform.localRotation = Quaternion.identity;
            prefabRoot.transform.localScale = Vector3.one * bakeResolution.VoxelSize;

            var bakedProxy = prefabRoot.GetComponent<VoxelObjectProxy>();
            if (bakedProxy == null)
                bakedProxy = prefabRoot.AddComponent<VoxelObjectProxy>();
            bakedProxy.voxelFile = bakedVoxelFile;
            bakedProxy.originalSolidBlockCount = bakedSaveData.solidBlockCount;
            EditorUtility.SetDirty(bakedProxy);
            ConfigureGeneratedVoxelRuntime(prefabRoot, GeneratedVoxelRuntimeKind.ProceduralBuildingElement, context, bakedSaveData);

            var savedPrefab = PrefabUtility.SaveAsPrefabAsset(prefabRoot, prefabPath);
            if (savedPrefab == null)
                throw new InvalidOperationException("Unity did not return a prefab after saving " + prefabPath);

            context.Report.GeneratedVoxBoxDependencyCount++;
            return savedPrefab;
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Failed to save baked voxbox prefab '" + prefabPath + "': " + e.Message);
            return sourceObject;
        }
        finally
        {
            if (prefabRoot != null)
                Object.DestroyImmediate(prefabRoot);
        }
    }

    private static ProceduralVoxelDefinition CreateSolidBoxDefinition(
        XElement element,
        string objectName,
        Vector3Int requestedSize)
    {
        var materialId = ResolveTeardownMaterialIdFromElement(element, MaterialIdConcrete);
        var color = ParseColor32(
            GetAttribute(element, "color", ""),
            GetDefaultVoxelColor(materialId));

        return ProceduralVoxelDefinition.CreateSolidBox(
            string.IsNullOrWhiteSpace(objectName) ? "VoxBox" : objectName,
            requestedSize,
            materialId,
            color);
    }

    private static VoxelBrushOverride CreateVoxBoxBrushOverride(XElement element, string sourceFile)
    {
        var hasExplicitColor = !string.IsNullOrWhiteSpace(GetAttribute(element, "color", ""));
        var hasExplicitMaterial = !string.IsNullOrWhiteSpace(GetAttribute(element, "material", ""));
        var sourceLooksLikeBrush = IsTeardownBrushReference(sourceFile);

        var materialId = ResolveTeardownMaterialIdFromElement(element, MaterialIdConcrete);
        var color = hasExplicitColor
            ? ParseColor32(GetAttribute(element, "color", ""), GetDefaultVoxelColor(materialId))
            : GetDefaultVoxelColor(materialId);

        return new VoxelBrushOverride
        {
            HasMaterial = hasExplicitMaterial || sourceLooksLikeBrush,
            MaterialId = materialId,
            HasColor = hasExplicitColor || sourceLooksLikeBrush || hasExplicitMaterial,
            Color = color
        };
    }

    private static bool IsTeardownBrushReference(string sourceFile)
    {
        var normalized = NormalizeAssetPath(sourceFile).ToLowerInvariant();
        return normalized.StartsWith("built-in/brush/", StringComparison.OrdinalIgnoreCase) ||
               normalized.Contains("/brush/") ||
               normalized.StartsWith("mod/assets/brush/", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsTeardownHoleBrushReference(string sourceFile)
    {
        return string.Equals(NormalizeAssetPath(sourceFile), "hole", StringComparison.OrdinalIgnoreCase);
    }

    private static bool TryGetProceduralVoxScriptDefinition(
        XElement element,
        string currentXmlPath,
        ImportContext context,
        out ProceduralVoxelDefinition definition)
    {
        definition = null;

        var scriptRef = GetAttribute(element, "file", "");
        if (string.IsNullOrWhiteSpace(scriptRef))
            return false;

        var scriptPath = ResolveAssetReference(scriptRef, currentXmlPath, context.Options.TeardownModRootPath, ".lua");
        var normalizedScriptPath = NormalizeAssetPath(string.IsNullOrWhiteSpace(scriptPath) ? scriptRef : scriptPath);
        var scriptName = Path.GetFileNameWithoutExtension(normalizedScriptPath);
        var parameters = element.Elements().FirstOrDefault(child => child.Name.LocalName == "parameters");

        if (IsBuiltInWallsVoxScriptReference(scriptRef) ||
            normalizedScriptPath.EndsWith("/walls.lua", StringComparison.OrdinalIgnoreCase))
        {
            var size = ParseProceduralScriptSize(parameters, new Vector3Int(100, 30, 100));
            var wallType = GetAttribute(parameters, "type", "BUILT-IN/brush/outerwall/brick.vox");
            var wallThickness = ResolveWallBrushThickness(wallType, currentXmlPath, context, 1);
            var materialId = ResolveTeardownMaterialIdFromText(
                string.Join(" ", wallType, GetAttribute(parameters, "material", ""), scriptRef),
                MaterialIdConcrete);
            var color = ParseColor32(GetAttribute(parameters, "color", ""), GetDefaultVoxelColor(materialId));

            definition = ProceduralVoxelDefinition.CreateWalls(
                string.IsNullOrWhiteSpace(scriptName) ? "walls" : scriptName,
                size,
                wallThickness,
                materialId,
                color,
                wallType);
            return true;
        }

        if (normalizedScriptPath.EndsWith("/window.lua", StringComparison.OrdinalIgnoreCase))
        {
            var size = ParseProceduralScriptSize(parameters, new Vector3Int(15, 17, 7));
            var frameThickness = Mathf.Max(1, ParseInt(GetAttribute(parameters, "frameThickness", ""), 1));
            var verticalDividers = Mathf.Max(0, ParseInt(GetAttribute(parameters, "verticalDividers", ""), 0));
            var dividerThickness = Mathf.Max(1, ParseInt(GetAttribute(parameters, "dividerThickness", ""), 1));
            var frameMaterial = ResolveTeardownMaterialId(GetAttribute(parameters, "frameMaterial", "metal"), MaterialIdWeakMetal);
            var frameColor = ParseColor32(GetAttribute(parameters, "frameColor", ""), GetDefaultVoxelColor(frameMaterial));
            var glassMaterial = ResolveTeardownMaterialId("glass", MaterialIdGlass);
            var glassColor = GetDefaultVoxelColor(glassMaterial);

            definition = ProceduralVoxelDefinition.CreateWindowFrame(
                string.IsNullOrWhiteSpace(scriptName) ? "window" : scriptName,
                size,
                frameThickness,
                verticalDividers,
                dividerThickness,
                frameMaterial,
                frameColor,
                glassMaterial,
                glassColor);
            return true;
        }

        if (normalizedScriptPath.EndsWith("/doorframe.lua", StringComparison.OrdinalIgnoreCase))
        {
            var size = ParseProceduralScriptSize(parameters, new Vector3Int(36, 47, 7));
            var frameThickness = Mathf.Max(1, ParseInt(GetAttribute(parameters, "frameThickness", ""), 1));
            var frameMaterial = ResolveTeardownMaterialId(GetAttribute(parameters, "frameMaterial", "metal"), MaterialIdWeakMetal);
            var frameColor = ParseColor32(GetAttribute(parameters, "frameColor", ""), GetDefaultVoxelColor(frameMaterial));

            definition = ProceduralVoxelDefinition.CreateDoorFrame(
                string.IsNullOrWhiteSpace(scriptName) ? "doorframe" : scriptName,
                size,
                frameThickness,
                frameMaterial,
                frameColor);
            return true;
        }

        return false;
    }

    internal static bool IsBuiltInWallsVoxScriptReference(string reference)
    {
        var normalized = NormalizeAssetPath(reference).TrimStart('/');
        if (string.IsNullOrWhiteSpace(normalized))
            return false;

        if (string.IsNullOrWhiteSpace(Path.GetExtension(normalized)))
            normalized += ".lua";

        return string.Equals(normalized, BuiltInWallsVoxScriptPath, StringComparison.OrdinalIgnoreCase);
    }

    private static int ResolveWallBrushThickness(
        string brushRef,
        string currentXmlPath,
        ImportContext context,
        int fallback)
    {
        fallback = Mathf.Max(1, fallback);
        if (string.IsNullOrWhiteSpace(brushRef))
            return fallback;

        var sourceObject = context.ResolveAnySourceObject(brushRef, currentXmlPath);
        var voxelBounds = GetVoxelBounds(sourceObject, context);
        if (!voxelBounds.HasVolumeSize)
            return fallback;

        return Mathf.Clamp(voxelBounds.PlacementSize.z, 1, 32);
    }

    private static bool TryCreateVoxagonDefinition(
        XElement element,
        ImportContext context,
        out ProceduralVoxelDefinition definition,
        out Vector3 localOffsetMeters)
    {
        definition = null;
        localOffsetMeters = Vector3.zero;

        var axis = GetAttribute(element, "axis", "y").Trim().ToLowerInvariant();
        if (axis.Length == 0)
            axis = "y";
        if (axis != "y")
        {
            context.Report.AddWarning("Skipped voxagon with unsupported axis '" + axis + "'. Only Y extrusion is supported.");
            return false;
        }

        var sourceVertices = new List<Vector2>();
        foreach (var vertex in element.Elements().Where(child => child.Name.LocalName == "vertex"))
        {
            if (TryParseVector2(GetAttribute(vertex, "pos", ""), out var position))
                sourceVertices.Add(position);
        }

        var extrude = ParseInt(GetAttribute(element, "extrude", "1"), 1);
        if (!TryBuildVoxagonGeometry(
                sourceVertices,
                context.Options.ElementScaleOrDefault(),
                extrude,
                out var size,
                out localOffsetMeters,
                out var localVertices))
        {
            context.Report.AddWarning("Skipped voxagon because it has fewer than three valid vertices.");
            return false;
        }

        var materialId = ResolveTeardownMaterialIdFromElement(element, MaterialIdConcrete);
        var color = ParseColor32(
            GetAttribute(element, "color", ""),
            GetDefaultVoxelColor(materialId));
        var brushRef = GetAttribute(element, "brush", "");
        var name = GetAttribute(element, "name", "");
        if (string.IsNullOrWhiteSpace(name))
            name = !string.IsNullOrWhiteSpace(brushRef)
                ? Path.GetFileNameWithoutExtension(NormalizeAssetPath(brushRef))
                : "voxagon";

        definition = ProceduralVoxelDefinition.CreatePolygonPrism(
            name,
            size,
            localVertices,
            materialId,
            color,
            extrude);
        return true;
    }

    internal static bool TryBuildVoxagonGeometry(
        IList<Vector2> sourceVertices,
        float elementScale,
        int extrude,
        out Vector3Int size,
        out Vector3 localOffsetMeters,
        out Vector2[] localVertices)
    {
        size = Vector3Int.zero;
        localOffsetMeters = Vector3.zero;
        localVertices = null;

        if (sourceVertices == null || sourceVertices.Count < 3)
            return false;

        elementScale = Mathf.Max(0.0001f, elementScale);
        var voxelsPerMeter = 1f / elementScale;
        var scaledVertices = sourceVertices
            .Select(vertex => vertex * voxelsPerMeter)
            .ToArray();

        var minX = Mathf.FloorToInt(scaledVertices.Min(vertex => vertex.x));
        var minZ = Mathf.FloorToInt(scaledVertices.Min(vertex => vertex.y));
        var maxX = Mathf.CeilToInt(scaledVertices.Max(vertex => vertex.x));
        var maxZ = Mathf.CeilToInt(scaledVertices.Max(vertex => vertex.y));
        var depth = Mathf.Max(1, Mathf.Abs(extrude));
        var minY = Mathf.Min(0, extrude);

        size = new Vector3Int(
            Mathf.Max(1, maxX - minX),
            depth,
            Mathf.Max(1, maxZ - minZ));
        localOffsetMeters = new Vector3(minX * elementScale, minY * elementScale, maxZ * elementScale);
        localVertices = scaledVertices
            .Select(vertex => new Vector2(vertex.x - minX, maxZ - vertex.y))
            .ToArray();
        return true;
    }

    private static Vector3Int ParseProceduralScriptSize(XElement parameters, Vector3Int fallback)
    {
        return MaxVector3Int(
            Vector3Int.one,
            ParseVector3Int(GetAttribute(parameters, "size", ""), fallback));
    }

    private static GameObject CreateOrLoadProceduralVoxelSourceObject(
        ProceduralVoxelDefinition definition,
        ImportContext context)
    {
        if (definition == null)
            return null;

        var prefabPath = context.GetProceduralVoxelPrefabPath(definition);
        if (!context.Options.OverwriteExistingDependencies)
        {
            var existingPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (existingPrefab != null)
            {
                context.Report.ReusedVoxBoxDependencyCount++;
                return existingPrefab;
            }
        }

        VoxelVolumeSaveDataV2Surrogate saveData;
        try
        {
            saveData = CreateProceduralVoxelSaveData(definition, DefaultHeightmapChunkSize);
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Failed to generate procedural voxels for '" + definition.Name + "': " + e.Message);
            return null;
        }

        if (saveData.solidBlockCount <= 0)
        {
            context.Report.AddWarning("Skipped empty procedural voxel object: " + definition.Name);
            return null;
        }

        var dataPath = context.GetProceduralVoxelDataPath(definition);
        EnsureAssetFolder(Path.GetDirectoryName(dataPath));
        EnsureAssetFolder(Path.GetDirectoryName(prefabPath));

        try
        {
            File.WriteAllBytes(ToAbsolutePath(dataPath), SerializeRuntimeVoxelSaveDataV2(saveData));
            AssetDatabase.ImportAsset(dataPath, ImportAssetOptions.ForceUpdate);
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Failed to write procedural voxel data '" + dataPath + "': " + e.Message);
            return null;
        }

        var voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        if (voxelFile == null)
        {
            AssetDatabase.Refresh();
            voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        }

        if (voxelFile == null)
        {
            context.Report.AddWarning("Failed to load procedural voxel data '" + dataPath + "' after import.");
            return null;
        }

        GameObject prefabRoot = null;
        try
        {
            prefabRoot = new GameObject(definition.Name);
            if (context.Options.SetRuntimeLayers)
                prefabRoot.layer = GetLayer("Building", prefabRoot.layer);

            var proxy = prefabRoot.AddComponent<VoxelObjectProxy>();
            proxy.voxelFile = voxelFile;
            proxy.originalSolidBlockCount = saveData.solidBlockCount;
            EditorUtility.SetDirty(proxy);
            ConfigureGeneratedVoxelRuntime(prefabRoot, GeneratedVoxelRuntimeKind.ProceduralBuildingElement, context, saveData);

            var savedPrefab = PrefabUtility.SaveAsPrefabAsset(prefabRoot, prefabPath);
            if (savedPrefab == null)
                throw new InvalidOperationException("Unity did not return a prefab after saving " + prefabPath);

            context.Report.GeneratedVoxBoxDependencyCount++;
            return savedPrefab;
        }
        catch (Exception e)
        {
            context.Report.AddWarning("Failed to save procedural voxel prefab '" + prefabPath + "': " + e.Message);
            return null;
        }
        finally
        {
            if (prefabRoot != null)
                Object.DestroyImmediate(prefabRoot);
        }
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateSolidBoxSaveData(
        Vector3Int requestedSize,
        Color32 color,
        byte materialId,
        int chunkSize)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        return CreateVoxelSaveData(
            requestedSize,
            chunkSize,
            position => ProceduralVoxelPoint.Occupied(color, materialId));
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateWindowFrameSaveData(
        Vector3Int requestedSize,
        int frameThickness,
        int verticalDividers,
        int dividerThickness,
        Color32 frameColor,
        byte frameMaterialId,
        Color32 glassColor,
        byte glassMaterialId,
        int chunkSize)
    {
        return CreateFramedOpeningSaveData(
            requestedSize,
            frameThickness,
            verticalDividers,
            dividerThickness,
            true,
            frameColor,
            frameMaterialId,
            glassColor,
            glassMaterialId,
            chunkSize);
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateDoorFrameSaveData(
        Vector3Int requestedSize,
        int frameThickness,
        Color32 frameColor,
        byte frameMaterialId,
        int chunkSize)
    {
        return CreateFramedOpeningSaveData(
            requestedSize,
            frameThickness,
            0,
            1,
            false,
            frameColor,
            frameMaterialId,
            default(Color32),
            0,
            chunkSize);
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateWallsSaveData(
        Vector3Int requestedSize,
        int wallThickness,
        Color32 color,
        byte materialId,
        int chunkSize)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        wallThickness = Mathf.Clamp(
            wallThickness,
            1,
            Mathf.Max(1, Mathf.Min(requestedSize.x, requestedSize.z) / 2));

        return CreateVoxelSaveData(
            requestedSize,
            chunkSize,
            position =>
                position.x < wallThickness ||
                position.x >= requestedSize.x - wallThickness ||
                position.z < wallThickness ||
                position.z >= requestedSize.z - wallThickness
                    ? ProceduralVoxelPoint.Occupied(color, materialId)
                    : ProceduralVoxelPoint.Empty);
    }

    private static VoxelVolumeSaveDataV2Surrogate CreateProceduralVoxelSaveData(
        ProceduralVoxelDefinition definition,
        int chunkSize)
    {
        switch (definition.Kind)
        {
            case ProceduralVoxelKind.SolidBox:
                return CreateSolidBoxSaveData(
                    definition.Size,
                    definition.PrimaryColor,
                    definition.PrimaryMaterialId,
                    chunkSize);
            case ProceduralVoxelKind.WindowFrame:
                return CreateWindowFrameSaveData(
                    definition.Size,
                    definition.FrameThickness,
                    definition.VerticalDividers,
                    definition.DividerThickness,
                    definition.PrimaryColor,
                    definition.PrimaryMaterialId,
                    definition.SecondaryColor,
                    definition.SecondaryMaterialId,
                    chunkSize);
            case ProceduralVoxelKind.DoorFrame:
                return CreateDoorFrameSaveData(
                    definition.Size,
                    definition.FrameThickness,
                    definition.PrimaryColor,
                    definition.PrimaryMaterialId,
                    chunkSize);
            case ProceduralVoxelKind.Walls:
                return CreateWallsSaveData(
                    definition.Size,
                    definition.WallThickness,
                    definition.PrimaryColor,
                    definition.PrimaryMaterialId,
                    chunkSize);
            case ProceduralVoxelKind.PolygonPrism:
                return CreatePolygonPrismSaveData(
                    definition.Size,
                    definition.PolygonVertices,
                    definition.PrimaryColor,
                    definition.PrimaryMaterialId,
                    chunkSize);
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreatePolygonPrismSaveData(
        Vector3Int requestedSize,
        Vector2[] polygonVertices,
        Color32 color,
        byte materialId,
        int chunkSize)
    {
        if (polygonVertices == null || polygonVertices.Length < 3)
            throw new ArgumentException("A polygon prism requires at least three vertices.", nameof(polygonVertices));

        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        return CreateVoxelSaveData(
            requestedSize,
            chunkSize,
            position =>
            {
                var sample = new Vector2(position.x + 0.5f, position.z + 0.5f);
                return IsPointInsidePolygon(sample, polygonVertices)
                    ? ProceduralVoxelPoint.Occupied(color, materialId)
                    : ProceduralVoxelPoint.Empty;
            });
    }

    private static bool IsPointInsidePolygon(Vector2 point, Vector2[] polygon)
    {
        var inside = false;
        for (int i = 0, j = polygon.Length - 1; i < polygon.Length; j = i++)
        {
            var a = polygon[i];
            var b = polygon[j];
            if (IsPointOnSegment(point, a, b))
                return true;

            var intersects = ((a.y > point.y) != (b.y > point.y)) &&
                             point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x;
            if (intersects)
                inside = !inside;
        }

        return inside;
    }

    private static bool IsPointOnSegment(Vector2 point, Vector2 a, Vector2 b)
    {
        var cross = (point.y - a.y) * (b.x - a.x) - (point.x - a.x) * (b.y - a.y);
        if (Mathf.Abs(cross) > 0.0001f)
            return false;

        var dot = (point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y);
        if (dot < -0.0001f)
            return false;

        var lengthSquared = (b - a).sqrMagnitude;
        return dot <= lengthSquared + 0.0001f;
    }

    private static VoxelVolumeSaveDataV2Surrogate CreateFramedOpeningSaveData(
        Vector3Int requestedSize,
        int frameThickness,
        int verticalDividers,
        int dividerThickness,
        bool includeGlass,
        Color32 frameColor,
        byte frameMaterialId,
        Color32 glassColor,
        byte glassMaterialId,
        int chunkSize)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        frameThickness = Mathf.Clamp(frameThickness, 1, Mathf.Max(1, Mathf.Min(requestedSize.x, requestedSize.y) / 2));
        verticalDividers = Mathf.Max(0, verticalDividers);
        dividerThickness = Mathf.Max(1, dividerThickness);

        var depthStart = 1;
        var depthEnd = 2;
        if (requestedSize.z == 2)
        {
            depthStart = 0;
            depthEnd = 2;
        }
        else if (requestedSize.z == 1)
        {
            depthStart = 0;
            depthEnd = 1;
        }

        return CreateVoxelSaveData(
            requestedSize,
            chunkSize,
            position =>
            {
                if (IsFrameVoxel(position, requestedSize, frameThickness) ||
                    IsVerticalDividerVoxel(position, requestedSize, verticalDividers, dividerThickness, depthStart, depthEnd))
                    return ProceduralVoxelPoint.Occupied(frameColor, frameMaterialId);

                if (includeGlass &&
                    position.x >= frameThickness && position.x < requestedSize.x - frameThickness &&
                    position.y >= frameThickness && position.y < requestedSize.y - frameThickness &&
                    position.z >= depthStart && position.z < Mathf.Min(requestedSize.z, depthStart + 1))
                    return ProceduralVoxelPoint.Occupied(glassColor, glassMaterialId);

                return ProceduralVoxelPoint.Empty;
            });
    }

    private static bool IsFrameVoxel(Vector3Int position, Vector3Int size, int thickness)
    {
        return position.x < thickness ||
               position.x >= size.x - thickness ||
               position.y < thickness ||
               position.y >= size.y - thickness;
    }

    private static bool IsVerticalDividerVoxel(
        Vector3Int position,
        Vector3Int size,
        int verticalDividers,
        int dividerThickness,
        int depthStart,
        int depthEnd)
    {
        if (verticalDividers <= 0 ||
            position.z < depthStart ||
            position.z >= Mathf.Min(size.z, depthStart + depthEnd))
            return false;

        var glassCount = verticalDividers + 1;
        var dividerStep = verticalDividers % 2 == 0
            ? Mathf.FloorToInt(size.x / (float)glassCount + 1f)
            : Mathf.FloorToInt(size.x / (float)glassCount);
        dividerStep = Mathf.Max(1, dividerStep);

        for (var i = 1; i <= verticalDividers; i++)
        {
            var center = dividerStep * i;
            var minX = Mathf.Clamp(center - dividerThickness / 2, 0, size.x - 1);
            var maxX = Mathf.Clamp(minX + dividerThickness, minX + 1, size.x);
            if (position.x >= minX && position.x < maxX)
                return true;
        }

        return false;
    }

    private static VoxelVolumeSaveDataV2Surrogate CreateVoxelSaveData(
        Vector3Int requestedSize,
        int chunkSize,
        Func<Vector3Int, ProceduralVoxelPoint> samplePoint)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        chunkSize = Mathf.Max(1, chunkSize);

        var chunkVoxelSize = Vector3Int.one * chunkSize;
        var chunkCount = new Vector3Int(
            CeilDivide(requestedSize.x, chunkSize),
            CeilDivide(requestedSize.y, chunkSize),
            CeilDivide(requestedSize.z, chunkSize));
        var volumeSize = Vector3Int.Scale(chunkCount, chunkVoxelSize);
        var pointByteCount = GetPointDataByteCount(volumeSize, VoxelDataV2PointStride);
        if (pointByteCount > int.MaxValue)
            throw new InvalidOperationException("Generated procedural voxel data is too large: " + pointByteCount + " bytes.");

        var chunkTotal = GetChunkTotal(chunkCount);
        var chunkMins = new Int3Surrogate[chunkTotal];
        var chunkMaxs = new Int3Surrogate[chunkTotal];
        for (var i = 0; i < chunkTotal; i++)
        {
            chunkMins[i] = ToInt3Surrogate(chunkVoxelSize);
            chunkMaxs[i] = ToInt3Surrogate(new Vector3Int(-1, -1, -1));
        }

        var targetData = new byte[(int)pointByteCount];
        var solidBlockCount = 0;
        for (var z = 0; z < requestedSize.z; z++)
        {
            for (var y = 0; y < requestedSize.y; y++)
            {
                for (var x = 0; x < requestedSize.x; x++)
                {
                    var position = new Vector3Int(x, y, z);
                    var point = samplePoint(position);
                    if (!point.IsOccupied)
                        continue;

                    WriteVoxelDataV2Point(targetData, volumeSize, position, point.Color, point.MaterialId);
                    UpdateChunkBounds(chunkMins, chunkMaxs, chunkCount, chunkVoxelSize, position);
                    solidBlockCount++;
                }
            }
        }

        return new VoxelVolumeSaveDataV2Surrogate
        {
            chunkCount = ToInt3Surrogate(chunkCount),
            cubeCountPerAxisInAChunk = ToInt3Surrogate(chunkVoxelSize),
            solidBlockCount = solidBlockCount,
            chunkMins = chunkMins,
            chunkMaxs = chunkMaxs,
            cubeByteData = targetData
        };
    }

    private static bool TryGetHeightmapVoxScriptDefinition(
        XElement element,
        ImportContext context,
        string currentXmlPath,
        out HeightmapVoxScriptDefinition definition)
    {
        definition = null;

        var scriptRef = GetAttribute(element, "file", "");
        var isBuiltInGroundScript = IsBuiltInGroundVoxScriptReference(scriptRef);
        var scriptPath = isBuiltInGroundScript
            ? NormalizeBuiltInGroundVoxScriptPath(scriptRef)
            : ResolveAssetReference(scriptRef, currentXmlPath, context.Options.TeardownModRootPath, ".lua");

        var scriptText = "";
        if (!isBuiltInGroundScript)
        {
            if (string.IsNullOrWhiteSpace(scriptPath) || !File.Exists(ToAbsolutePath(scriptPath)))
            {
                context.Report.AddMissingFile(string.IsNullOrWhiteSpace(scriptPath) ? scriptRef : scriptPath);
                return false;
            }

            try
            {
                scriptText = File.ReadAllText(ToAbsolutePath(scriptPath));
            }
            catch (Exception e)
            {
                context.Report.AddWarning("Failed to read voxscript '" + scriptPath + "': " + e.Message);
                return false;
            }

            if (!Regex.IsMatch(scriptText, @"\bLoadImage\s*\(", RegexOptions.IgnoreCase) ||
                !Regex.IsMatch(scriptText, @"\bHeightmap\s*\(", RegexOptions.IgnoreCase))
                return false;
        }

        var parameters = element.Elements().FirstOrDefault(child => child.Name.LocalName == "parameters");
        var imageRef = parameters == null ? "" : GetAttribute(parameters, "file", "");
        if (string.IsNullOrWhiteSpace(imageRef) && !isBuiltInGroundScript)
            imageRef = TryReadStringDefaultFromScript(scriptText, "file", "testground.png");

        if (string.IsNullOrWhiteSpace(imageRef))
        {
            context.Report.AddWarning("Skipped heightmap voxscript because it has no heightmap texture parameter: " + scriptRef);
            return false;
        }

        var imagePath = ResolveTextureAssetReference(imageRef, currentXmlPath, context.Options.TeardownModRootPath);
        if (string.IsNullOrWhiteSpace(imagePath) || !File.Exists(ToAbsolutePath(imagePath)))
        {
            context.Report.AddMissingFile(string.IsNullOrWhiteSpace(imagePath) ? imageRef : imagePath);
            return false;
        }

        var grassImagePath = "";
        var grassRef = parameters == null ? "" : GetAttribute(parameters, "grass", "");
        if (!string.IsNullOrWhiteSpace(grassRef))
        {
            grassImagePath = ResolveTextureAssetReference(grassRef, currentXmlPath, context.Options.TeardownModRootPath);
            if (string.IsNullOrWhiteSpace(grassImagePath) || !File.Exists(ToAbsolutePath(grassImagePath)))
            {
                context.Report.AddMissingFile(string.IsNullOrWhiteSpace(grassImagePath) ? grassRef : grassImagePath);
                grassImagePath = "";
            }
        }

        var defaultHeightScale = isBuiltInGroundScript
            ? DefaultBuiltInGroundHeightScale
            : TryReadIntDefaultFromScript(scriptText, "scale", 64);
        var defaultTileSize = isBuiltInGroundScript
            ? DefaultHeightmapTileSize
            : TryReadIntDefaultFromScript(scriptText, "tilesize", DefaultHeightmapTileSize);
        var heightScale = parameters == null
            ? defaultHeightScale
            : ParseInt(GetAttribute(parameters, "scale", ""), defaultHeightScale);
        var tileSize = parameters == null
            ? defaultTileSize
            : ParseInt(GetAttribute(parameters, "tilesize", ""), defaultTileSize);

        var name = GetAttribute(element, "name", "");
        if (string.IsNullOrWhiteSpace(name))
            name = Path.GetFileNameWithoutExtension(imagePath) + "_Heightmap";

        definition = new HeightmapVoxScriptDefinition
        {
            Name = name,
            ScriptPath = scriptPath,
            ImagePath = imagePath,
            GrassImagePath = grassImagePath,
            HeightScale = Mathf.Clamp(heightScale, 1, 256),
            TileSize = Mathf.Clamp(tileSize, 1, DefaultHeightmapTileSize),
            MaxSamples = Mathf.Max(1, context.Options.HeightmapMaxSamples)
        };
        return true;
    }

    internal static bool IsBuiltInGroundVoxScriptReference(string reference)
    {
        var normalized = NormalizeAssetPath(reference).TrimStart('/');
        if (string.IsNullOrWhiteSpace(normalized))
            return false;

        if (string.IsNullOrWhiteSpace(Path.GetExtension(normalized)))
            normalized += ".lua";

        return string.Equals(normalized, BuiltInGroundVoxScriptPath, StringComparison.OrdinalIgnoreCase);
    }

    private static string NormalizeBuiltInGroundVoxScriptPath(string reference)
    {
        return IsBuiltInGroundVoxScriptReference(reference)
            ? BuiltInGroundVoxScriptPath
            : NormalizeAssetPath(reference);
    }

    private static List<HeightmapTileAsset> CreateOrLoadHeightmapTileAssets(
        HeightmapVoxScriptDefinition definition,
        ImportContext context)
    {
        var textureData = LoadHeightmapTextureData(definition, context.Report);
        if (textureData.Pixels == null || textureData.Pixels.Length == 0)
            return new List<HeightmapTileAsset>();

        if (textureData.OutputSize.x != textureData.SourceSize.x ||
            textureData.OutputSize.y != textureData.SourceSize.y)
        {
            context.Report.AddWarning(string.Format(
                CultureInfo.InvariantCulture,
                "Heightmap '{0}' was downsampled from {1}x{2} to {3}x{4}. Increase Heightmap Max Samples for a denser voxel terrain.",
                definition.ImagePath,
                textureData.SourceSize.x,
                textureData.SourceSize.y,
                textureData.OutputSize.x,
                textureData.OutputSize.y));
        }

        var tileAssets = new List<HeightmapTileAsset>();
        for (var tileZ = 0; tileZ < textureData.OutputSize.y; tileZ += definition.TileSize)
        {
            for (var tileX = 0; tileX < textureData.OutputSize.x; tileX += definition.TileSize)
            {
                var tileSpec = new HeightmapTileSpec
                {
                    Origin = new Vector2Int(tileX, tileZ),
                    Size = new Vector2Int(
                        Mathf.Min(definition.TileSize, textureData.OutputSize.x - tileX),
                        Mathf.Min(definition.TileSize, textureData.OutputSize.y - tileZ))
                };

                var dataPath = GetDerivedHeightmapTileAssetPath(
                    context.Options.DependencyDataFolderPath,
                    context,
                    definition,
                    textureData,
                    tileSpec,
                    ".txt");
                var prefabPath = GetDerivedHeightmapTileAssetPath(
                    context.Options.DependencyPrefabFolderPath,
                    context,
                    definition,
                    textureData,
                    tileSpec,
                    ".prefab");

                if (!context.Options.OverwriteExistingDependencies)
                {
                    var existingPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
                    if (existingPrefab != null)
                    {
                        context.Report.ReusedHeightmapDependencyCount++;
                        tileAssets.Add(new HeightmapTileAsset
                        {
                            Name = Path.GetFileNameWithoutExtension(prefabPath),
                            Prefab = existingPrefab,
                            TileOrigin = tileSpec.Origin,
                            TileSize = tileSpec.Size,
                            VoxelScale = textureData.VoxelScale
                        });
                        continue;
                    }
                }

                try
                {
                    var tileAsset = CreateHeightmapTileAsset(
                        definition,
                        textureData,
                        tileSpec,
                        dataPath,
                        prefabPath,
                        context);
                    if (tileAsset.Prefab != null)
                        tileAssets.Add(tileAsset);
                }
                catch (Exception e)
                {
                    context.Report.AddWarning("Failed to generate heightmap tile '" + prefabPath + "': " + e.Message);
                }
            }
        }

        return tileAssets;
    }

    private static HeightmapTextureData LoadHeightmapTextureData(HeightmapVoxScriptDefinition definition, ImportReport report)
    {
        if (!TryLoadTexturePixels(definition.ImagePath, report, "heightmap", out var pixels, out var sourceSize))
            return new HeightmapTextureData();

        Color32[] grassPixels = null;
        var grassSize = Vector2Int.zero;
        if (!string.IsNullOrWhiteSpace(definition.GrassImagePath) &&
            TryLoadTexturePixels(definition.GrassImagePath, report, "heightmap grass map", out var loadedGrassPixels, out var loadedGrassSize))
        {
            grassPixels = loadedGrassPixels;
            grassSize = loadedGrassSize;
            if (grassSize != sourceSize)
            {
                report.AddWarning(string.Format(
                    CultureInfo.InvariantCulture,
                    "Heightmap grass map '{0}' size {1}x{2} does not match heightmap size {3}x{4}; it will be resampled.",
                    definition.GrassImagePath,
                    grassSize.x,
                    grassSize.y,
                    sourceSize.x,
                    sourceSize.y));
            }
        }

        var outputSize = CalculateHeightmapOutputSize(sourceSize, definition.MaxSamples);
        var voxelScale = CalculateHeightmapVoxelScale(sourceSize, outputSize);
        return new HeightmapTextureData
        {
            Pixels = pixels,
            SourceSize = sourceSize,
            GrassPixels = grassPixels,
            GrassSize = grassSize,
            OutputSize = outputSize,
            VoxelScale = voxelScale,
            EffectiveHeightScale = CalculateHeightmapEffectiveHeightScale(definition.HeightScale, voxelScale)
        };
    }

    private static bool TryLoadTexturePixels(
        string imagePath,
        ImportReport report,
        string label,
        out Color32[] pixels,
        out Vector2Int size)
    {
        pixels = null;
        size = Vector2Int.zero;
        Texture2D texture = null;
        try
        {
            var bytes = File.ReadAllBytes(ToAbsolutePath(imagePath));
            texture = new Texture2D(2, 2, TextureFormat.RGBA32, false, true);
            if (!ImageConversion.LoadImage(texture, bytes, false))
                throw new InvalidOperationException("Unity could not decode the texture.");

            pixels = texture.GetPixels32();
            size = new Vector2Int(texture.width, texture.height);
            return true;
        }
        catch (Exception e)
        {
            report.AddWarning("Failed to load " + label + " texture '" + imagePath + "': " + e.Message);
            return false;
        }
        finally
        {
            if (texture != null)
                Object.DestroyImmediate(texture);
        }
    }

    internal static Vector2Int CalculateHeightmapOutputSize(Vector2Int sourceSize, int maxSamples)
    {
        if (sourceSize.x <= 0 || sourceSize.y <= 0)
            return Vector2Int.zero;

        maxSamples = Mathf.Max(1, maxSamples);
        var longestAxis = Mathf.Max(sourceSize.x, sourceSize.y);
        if (longestAxis <= maxSamples)
            return sourceSize;

        var scale = maxSamples / (float)longestAxis;
        return new Vector2Int(
            Mathf.Max(1, Mathf.RoundToInt(sourceSize.x * scale)),
            Mathf.Max(1, Mathf.RoundToInt(sourceSize.y * scale)));
    }

    internal static float CalculateHeightmapVoxelScale(Vector2Int sourceSize, Vector2Int outputSize)
    {
        if (sourceSize.x <= 0 || sourceSize.y <= 0 || outputSize.x <= 0 || outputSize.y <= 0)
            return 1f;

        var xScale = sourceSize.x / (float)outputSize.x;
        var yScale = sourceSize.y / (float)outputSize.y;
        return Mathf.Max(1f, xScale, yScale);
    }

    internal static int CalculateHeightmapEffectiveHeightScale(int heightScale, float voxelScale)
    {
        heightScale = Mathf.Max(1, heightScale);
        voxelScale = Mathf.Max(1f, voxelScale);
        return Mathf.Max(1, Mathf.CeilToInt(heightScale / voxelScale));
    }

    private static HeightmapTileAsset CreateHeightmapTileAsset(
        HeightmapVoxScriptDefinition definition,
        HeightmapTextureData textureData,
        HeightmapTileSpec tileSpec,
        string dataPath,
        string prefabPath,
        ImportContext context)
    {
        var saveData = CreateHeightmapSaveDataFromPixels(
            textureData.Pixels,
            textureData.SourceSize,
            textureData.GrassPixels,
            textureData.GrassSize,
            textureData.OutputSize,
            tileSpec.Origin,
            tileSpec.Size,
            textureData.EffectiveHeightScale,
            DefaultHeightmapChunkSize);

        EnsureAssetFolder(Path.GetDirectoryName(dataPath));
        EnsureAssetFolder(Path.GetDirectoryName(prefabPath));

        File.WriteAllBytes(ToAbsolutePath(dataPath), SerializeRuntimeVoxelSaveDataV2(saveData));
        AssetDatabase.ImportAsset(dataPath, ImportAssetOptions.ForceUpdate);

        var voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        if (voxelFile == null)
        {
            AssetDatabase.Refresh();
            voxelFile = AssetDatabase.LoadAssetAtPath<TextAsset>(dataPath);
        }

        if (voxelFile == null)
            throw new InvalidOperationException("Generated voxel data did not import: " + dataPath);

        GameObject prefabRoot = null;
        try
        {
            prefabRoot = new GameObject(Path.GetFileNameWithoutExtension(prefabPath));
            if (context.Options.SetRuntimeLayers)
                prefabRoot.layer = GetLayer("Building", prefabRoot.layer);

            var proxy = prefabRoot.AddComponent<VoxelObjectProxy>();
            proxy.voxelFile = voxelFile;
            proxy.originalSolidBlockCount = saveData.solidBlockCount;
            EditorUtility.SetDirty(proxy);
            ConfigureGeneratedVoxelRuntime(prefabRoot, GeneratedVoxelRuntimeKind.HeightmapTerrain, context, saveData);

            var savedPrefab = PrefabUtility.SaveAsPrefabAsset(prefabRoot, prefabPath);
            if (savedPrefab == null)
                throw new InvalidOperationException("Unity did not return a prefab after saving " + prefabPath);

            context.Report.GeneratedHeightmapDependencyCount++;
            return new HeightmapTileAsset
            {
                Name = prefabRoot.name,
                Prefab = savedPrefab,
                TileOrigin = tileSpec.Origin,
                TileSize = tileSpec.Size,
                VoxelScale = textureData.VoxelScale
            };
        }
        finally
        {
            if (prefabRoot != null)
                Object.DestroyImmediate(prefabRoot);
        }
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateHeightmapSaveDataFromPixels(
        Color32[] sourcePixels,
        Vector2Int sourceSize,
        Vector2Int outputSize,
        Vector2Int tileOrigin,
        Vector2Int tileSize,
        int heightScale,
        int chunkSize)
    {
        return CreateHeightmapSaveDataFromPixels(
            sourcePixels,
            sourceSize,
            null,
            Vector2Int.zero,
            outputSize,
            tileOrigin,
            tileSize,
            heightScale,
            chunkSize);
    }

    internal static VoxelVolumeSaveDataV2Surrogate CreateHeightmapSaveDataFromPixels(
        Color32[] sourcePixels,
        Vector2Int sourceSize,
        Color32[] grassPixels,
        Vector2Int grassSize,
        Vector2Int outputSize,
        Vector2Int tileOrigin,
        Vector2Int tileSize,
        int heightScale,
        int chunkSize)
    {
        if (sourcePixels == null)
            throw new ArgumentNullException(nameof(sourcePixels));
        if (sourceSize.x <= 0 || sourceSize.y <= 0 || sourcePixels.Length < sourceSize.x * sourceSize.y)
            throw new ArgumentException("Source pixels do not match source dimensions.", nameof(sourcePixels));
        if (grassPixels != null && grassPixels.Length > 0 &&
            (grassSize.x <= 0 || grassSize.y <= 0 || grassPixels.Length < grassSize.x * grassSize.y))
            throw new ArgumentException("Grass pixels do not match grass dimensions.", nameof(grassPixels));
        if (outputSize.x <= 0 || outputSize.y <= 0 || tileSize.x <= 0 || tileSize.y <= 0)
            throw new ArgumentException("Heightmap output and tile sizes must be positive.");

        heightScale = Mathf.Max(1, heightScale);
        chunkSize = Mathf.Max(1, chunkSize);
        var hasGrassMap = grassPixels != null && grassPixels.Length > 0 && grassSize.x > 0 && grassSize.y > 0;

        var requestedSize = new Vector3Int(tileSize.x, heightScale, tileSize.y);
        var chunkCount = new Vector3Int(
            CeilDivide(requestedSize.x, chunkSize),
            CeilDivide(requestedSize.y, chunkSize),
            CeilDivide(requestedSize.z, chunkSize));
        var chunkVoxelSize = Vector3Int.one * chunkSize;
        var volumeSize = Vector3Int.Scale(chunkCount, chunkVoxelSize);
        var pointByteCount = GetPointDataByteCount(volumeSize, VoxelDataV2PointStride);
        if (pointByteCount > int.MaxValue)
            throw new InvalidOperationException("Generated heightmap voxel data is too large: " + pointByteCount + " bytes.");

        var chunkTotal = GetChunkTotal(chunkCount);
        var chunkMins = new Int3Surrogate[chunkTotal];
        var chunkMaxs = new Int3Surrogate[chunkTotal];
        for (var i = 0; i < chunkTotal; i++)
        {
            chunkMins[i] = ToInt3Surrogate(chunkVoxelSize);
            chunkMaxs[i] = ToInt3Surrogate(new Vector3Int(-1, -1, -1));
        }

        var targetData = new byte[(int)pointByteCount];
        var solidBlockCount = 0;
        for (var z = 0; z < tileSize.y; z++)
        {
            var outputZ = tileOrigin.y + tileSize.y - 1 - z;
            var sourceZ = MapHeightmapOutputToSourceRow(outputZ, outputSize.y, sourceSize.y);
            for (var x = 0; x < tileSize.x; x++)
            {
                var outputX = tileOrigin.x + x;
                var sourceX = MapHeightmapOutputToSourceCoordinate(outputX, outputSize.x, sourceSize.x);
                var pixel = sourcePixels[sourceZ * sourceSize.x + sourceX];
                var grassAmount = hasGrassMap
                    ? GetGrassAmount(SampleHeightmapPixel(grassPixels, grassSize, outputX, outputZ, outputSize), true)
                    : GetGrassAmount(pixel, false);
                var columnHeight = Mathf.Clamp(Mathf.CeilToInt(pixel.r / 255f * heightScale), 0, heightScale);
                if (columnHeight <= 0)
                    continue;

                for (var y = 0; y < columnHeight; y++)
                {
                    var position = new Vector3Int(x, y, z);
                    WriteVoxelDataV2Point(
                        targetData,
                        volumeSize,
                        position,
                        ChooseHeightmapVoxelColor(pixel, grassAmount, y, columnHeight),
                        ChooseHeightmapMaterialId(pixel, grassAmount, y, columnHeight));
                    UpdateChunkBounds(chunkMins, chunkMaxs, chunkCount, chunkVoxelSize, position);
                    solidBlockCount++;
                }
            }
        }

        return new VoxelVolumeSaveDataV2Surrogate
        {
            chunkCount = ToInt3Surrogate(chunkCount),
            cubeCountPerAxisInAChunk = ToInt3Surrogate(chunkVoxelSize),
            solidBlockCount = solidBlockCount,
            chunkMins = chunkMins,
            chunkMaxs = chunkMaxs,
            cubeByteData = targetData
        };
    }

    internal static Vector3 GetHeightmapTileLocalPosition(Vector2Int tileOrigin, Vector2Int tileSize, float voxelScale)
    {
        tileSize = new Vector2Int(Mathf.Max(1, tileSize.x), Mathf.Max(1, tileSize.y));
        voxelScale = Mathf.Max(0.001f, voxelScale);
        return new Vector3(
            tileOrigin.x * voxelScale,
            0f,
            -(tileOrigin.y + tileSize.y - 1) * voxelScale);
    }

    private static int MapHeightmapOutputToSourceCoordinate(int outputCoordinate, int outputSize, int sourceSize)
    {
        if (outputSize <= 1 || sourceSize <= 1)
            return 0;

        var normalized = (outputCoordinate + 0.5f) / outputSize;
        return Mathf.Clamp(Mathf.FloorToInt(normalized * sourceSize), 0, sourceSize - 1);
    }

    private static int MapHeightmapOutputToSourceRow(int outputCoordinate, int outputSize, int sourceSize)
    {
        return sourceSize - 1 - MapHeightmapOutputToSourceCoordinate(outputCoordinate, outputSize, sourceSize);
    }

    private static Color32 SampleHeightmapPixel(Color32[] pixels, Vector2Int sourceSize, int outputX, int outputZ, Vector2Int outputSize)
    {
        var sourceX = MapHeightmapOutputToSourceCoordinate(outputX, outputSize.x, sourceSize.x);
        var sourceZ = MapHeightmapOutputToSourceRow(outputZ, outputSize.y, sourceSize.y);
        return pixels[sourceZ * sourceSize.x + sourceX];
    }

    private static byte GetGrassAmount(Color32 pixel, bool isGrassMap)
    {
        return isGrassMap
            ? (byte)Mathf.Max(pixel.r, pixel.g, pixel.b)
            : pixel.g;
    }

    private static byte ChooseHeightmapMaterialId(Color32 pixel, byte grassAmount, int y, int columnHeight)
    {
        if (y >= columnHeight - 1)
        {
            if (IsEncodedRoadPixel(pixel))
                return MaterialIdConcrete;

            return grassAmount >= 32 ? MaterialIdGrass : MaterialIdDirt;
        }

        return y < columnHeight - 3 ? MaterialIdStone : MaterialIdDirt;
    }

    private static Color32 ChooseHeightmapVoxelColor(Color32 pixel, byte grassAmount, int y, int columnHeight)
    {
        if (y >= columnHeight - 1)
        {
            if (IsEncodedRoadPixel(pixel))
                return new Color32(105, 105, 100, 255);

            var height01 = pixel.r / 255f;
            if (grassAmount >= 32)
            {
                var grass01 = grassAmount / 255f;
                return new Color32(
                    (byte)Mathf.RoundToInt(Mathf.Lerp(62f, 96f, height01)),
                    (byte)Mathf.RoundToInt(Mathf.Lerp(92f, 146f, grass01)),
                    (byte)Mathf.RoundToInt(Mathf.Lerp(42f, 64f, height01)),
                    255);
            }

            return new Color32(
                (byte)Mathf.RoundToInt(Mathf.Lerp(84f, 132f, height01)),
                (byte)Mathf.RoundToInt(Mathf.Lerp(62f, 94f, height01)),
                (byte)Mathf.RoundToInt(Mathf.Lerp(42f, 54f, height01)),
                255);
        }

        var shade = y < columnHeight - 3 ? 0.55f : 0.75f;
        var baseColor = y < columnHeight - 3
            ? GetDefaultVoxelColor(MaterialIdStone)
            : GetDefaultVoxelColor(MaterialIdDirt);
        return new Color32(
            (byte)Mathf.Clamp(Mathf.RoundToInt(baseColor.r * shade), 1, 255),
            (byte)Mathf.Clamp(Mathf.RoundToInt(baseColor.g * shade), 1, 255),
            (byte)Mathf.Clamp(Mathf.RoundToInt(baseColor.b * shade), 1, 255),
            255);
    }

    private static bool IsEncodedRoadPixel(Color32 pixel)
    {
        return pixel.b >= 120 && pixel.g <= 90 && pixel.r >= 40;
    }

    internal static void WriteVoxelDataV2Point(
        byte[] targetData,
        Vector3Int volumeSize,
        Vector3Int position,
        Color32 color,
        byte materialId)
    {
        var pointOffset = GetPointByteOffset(position, volumeSize, VoxelDataV2PointStride);
        if (pointOffset + VoxelDataV2PointStride > targetData.Length)
            throw new InvalidOperationException("Voxel point write is out of range.");

        WriteVoxelDataV2Color(targetData, pointOffset, color);

        // PointDataV2 layout is: ushort color, ushort originalColor, uint properties.
        // Project converters leave originalColor empty unless restoration is explicitly needed.
        targetData[pointOffset + 2] = 0;
        targetData[pointOffset + 3] = 0;

        var packedProperties =
            ((uint)materialId & VoxelDataV2IdMask) |
            ((VoxelDataV2NormalTemperature & VoxelDataV2PropertyMask) << VoxelDataV2TemperatureBitShift) |
            (VoxelDataV2FullValue << VoxelDataV2ValueBitShift);
        Buffer.BlockCopy(BitConverter.GetBytes(packedProperties), 0, targetData, pointOffset + VoxelDataV2IdByteOffset, sizeof(uint));
    }

    private static void WriteVoxelDataV2Color(byte[] targetData, int pointOffset, Color32 color)
    {
        var packedColor = PackVoxelDataV2Color(color);
        Buffer.BlockCopy(BitConverter.GetBytes(packedColor), 0, targetData, pointOffset, sizeof(ushort));
    }

    internal static ushort PackVoxelDataV2Color(Color32 color)
    {
        var red = (uint)Mathf.RoundToInt(color.r / 255f * 31f);
        var green = (uint)Mathf.RoundToInt(color.g / 255f * 63f);
        var blue = (uint)Mathf.RoundToInt(color.b / 255f * 31f);
        return (ushort)((red << 11) | (green << 5) | blue);
    }

    private static string GetDerivedHeightmapTileAssetPath(
        string rootFolder,
        ImportContext context,
        HeightmapVoxScriptDefinition definition,
        HeightmapTextureData textureData,
        HeightmapTileSpec tileSpec,
        string extension)
    {
        var relativeImagePath = NormalizeAssetPath(Path.ChangeExtension(context.GetTeardownRelativePath(definition.ImagePath), null));
        if (string.IsNullOrWhiteSpace(relativeImagePath))
            relativeImagePath = SanitizeAssetFileName(Path.GetFileNameWithoutExtension(definition.ImagePath));

        var relativeImageFolder = NormalizeAssetPath(Path.GetDirectoryName(relativeImagePath) ?? "");
        var imageName = SanitizeAssetFileName(Path.GetFileName(relativeImagePath));
        var variantFolder = imageName +
                            "_h" + definition.HeightScale.ToString(CultureInfo.InvariantCulture) +
                            "_" + textureData.OutputSize.x.ToString(CultureInfo.InvariantCulture) +
                            "x" + textureData.OutputSize.y.ToString(CultureInfo.InvariantCulture);
        if (textureData.VoxelScale > 1.0001f)
        {
            variantFolder +=
                "_vs" + FormatFloatForAssetPath(textureData.VoxelScale) +
                "_vh" + textureData.EffectiveHeightScale.ToString(CultureInfo.InvariantCulture);
        }
        if (!string.IsNullOrWhiteSpace(definition.GrassImagePath))
            variantFolder += "_g" + SanitizeAssetFileName(Path.GetFileNameWithoutExtension(definition.GrassImagePath));
        var parentFolder = CombineAssetPath(
            CombineAssetPath(CombineAssetPath(rootFolder, DerivedHeightmapFolderName), relativeImageFolder),
            variantFolder);
        var fileName = "tile_" +
                       tileSpec.Origin.x.ToString(CultureInfo.InvariantCulture) +
                       "_" +
                       tileSpec.Origin.y.ToString(CultureInfo.InvariantCulture) +
                       "_" +
                       tileSpec.Size.x.ToString(CultureInfo.InvariantCulture) +
                       "x" +
                       tileSpec.Size.y.ToString(CultureInfo.InvariantCulture) +
                       extension;
        return CombineAssetPath(parentFolder, fileName);
    }

    private static string ResolveTextureAssetReference(string imageRef, string currentXmlPath, string teardownModRootPath)
    {
        var imagePath = ResolveAssetReference(imageRef, currentXmlPath, teardownModRootPath, "");
        if (!string.IsNullOrWhiteSpace(imagePath) && File.Exists(ToAbsolutePath(imagePath)))
            return imagePath;

        if (!string.IsNullOrWhiteSpace(imageRef) && string.IsNullOrWhiteSpace(Path.GetExtension(imageRef)))
        {
            imagePath = ResolveAssetReference(imageRef, currentXmlPath, teardownModRootPath, ".png");
            if (!string.IsNullOrWhiteSpace(imagePath) && File.Exists(ToAbsolutePath(imagePath)))
                return imagePath;
        }

        return imagePath;
    }

    private static string TryReadStringDefaultFromScript(string scriptText, string parameterName, string fallback)
    {
        var match = Regex.Match(
            scriptText ?? "",
            @"GetString\s*\(\s*""" + Regex.Escape(parameterName) + @"""\s*,\s*""([^""]+)""",
            RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value : fallback;
    }

    private static int TryReadIntDefaultFromScript(string scriptText, string parameterName, int fallback)
    {
        var match = Regex.Match(
            scriptText ?? "",
            @"GetInt\s*\(\s*""" + Regex.Escape(parameterName) + @"""\s*,\s*([-+]?\d+)",
            RegexOptions.IgnoreCase);
        return match.Success && int.TryParse(match.Groups[1].Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)
            ? value
            : fallback;
    }

    private static int ParseInt(string value, int fallback)
    {
        if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var intResult))
            return intResult;

        return float.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var floatResult)
            ? Mathf.RoundToInt(floatResult)
            : fallback;
    }

    private static VoxelVolumeSaveDataV2Surrogate CreateVoxBoxSaveData(
        VoxelVolumeSaveDataV2Surrogate sourceSaveData,
        VoxelBoundsInfo sourceBounds,
        Vector3Int requestedSize,
        Vector3Int bakedSize,
        Vector3Int brushOffset,
        Quaternion sourceRotation,
        VoxelBrushOverride brushOverride)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        bakedSize = MaxVector3Int(Vector3Int.one, bakedSize);
        var sourceVolumeSize = GetVolumeSize(sourceSaveData);
        if (!HasPositiveSize(sourceVolumeSize) || sourceSaveData.cubeByteData == null)
            throw new InvalidOperationException("Source voxel data has no readable volume.");

        if (!CanReadRawPointData(sourceSaveData.cubeByteData, sourceVolumeSize, VoxelDataV2PointStride))
            throw new InvalidOperationException("Source voxel point data is smaller than expected.");

        var sourceMin = sourceBounds.HasOccupiedBounds ? sourceBounds.OccupiedMin : Vector3Int.zero;
        var sourceSize = MaxVector3Int(Vector3Int.one, sourceBounds.PlacementSize);
        var sourceSampleSize = GetRotatedVoxelSize(sourceSize, sourceRotation);
        var occupiedSourceLocalPositions = CollectOccupiedSourceLocalPositions(
            sourceSaveData.cubeByteData,
            sourceVolumeSize,
            sourceMin,
            sourceSize);
        var fillDenseBrushGaps = IsDenseVoxBoxBrush(occupiedSourceLocalPositions.Count, sourceSize);
        var denseBrushFallbackSourcePositionByLocalPosition = fillDenseBrushGaps
            ? new Dictionary<Vector3Int, Vector3Int>()
            : null;
        var chunkSize = GetVoxBoxTargetChunkSize(
            ToVector3Int(sourceSaveData.cubeCountPerAxisInAChunk),
            bakedSize);
        var chunkCount = new Vector3Int(
            CeilDivide(bakedSize.x, chunkSize.x),
            CeilDivide(bakedSize.y, chunkSize.y),
            CeilDivide(bakedSize.z, chunkSize.z));
        var volumeSize = Vector3Int.Scale(chunkCount, chunkSize);
        var pointByteCount = GetPointDataByteCount(volumeSize, VoxelDataV2PointStride);
        if (pointByteCount > int.MaxValue)
            throw new InvalidOperationException("Baked voxbox data is too large: " + pointByteCount + " bytes.");

        var chunkTotal = GetChunkTotal(chunkCount);
        var chunkMins = new Int3Surrogate[chunkTotal];
        var chunkMaxs = new Int3Surrogate[chunkTotal];
        for (var i = 0; i < chunkTotal; i++)
        {
            chunkMins[i] = ToInt3Surrogate(chunkSize);
            chunkMaxs[i] = ToInt3Surrogate(new Vector3Int(-1, -1, -1));
        }

        var targetData = new byte[(int)pointByteCount];
        var solidBlockCount = 0;
        for (var z = 0; z < bakedSize.z; z++)
        {
            var requestedZ = MapBakedVoxBoxCoordinateToRequested(z, requestedSize.z, bakedSize.z);
            for (var y = 0; y < bakedSize.y; y++)
            {
                var requestedY = MapBakedVoxBoxCoordinateToRequested(y, requestedSize.y, bakedSize.y);
                for (var x = 0; x < bakedSize.x; x++)
                {
                    var requestedX = MapBakedVoxBoxCoordinateToRequested(x, requestedSize.x, bakedSize.x);
                    var sourceLocalPosition = MapRotatedVoxBoxSampleToSource(
                        new Vector3Int(
                            PositiveModulo(requestedX + brushOffset.x, sourceSampleSize.x),
                            PositiveModulo(requestedY + brushOffset.y, sourceSampleSize.y),
                            PositiveModulo(requestedSize.z - 1 - requestedZ + brushOffset.z, sourceSampleSize.z)),
                        sourceSize,
                        sourceSampleSize,
                        sourceRotation);
                    var sourcePosition = sourceMin + sourceLocalPosition;

                    if (!IsPointOccupied(
                            sourceSaveData.cubeByteData,
                            sourceVolumeSize,
                            sourcePosition,
                            VoxelDataV2PointStride,
                            VoxelDataV2IdByteOffset,
                            VoxelDataV2IdMask))
                    {
                        if (!fillDenseBrushGaps ||
                            !TryResolveDenseBrushFallbackSourcePosition(
                                sourceLocalPosition,
                                sourceMin,
                                occupiedSourceLocalPositions,
                                denseBrushFallbackSourcePositionByLocalPosition,
                                out sourcePosition))
                            continue;
                    }

                    var targetPosition = new Vector3Int(x, y, z);
                    CopyPointData(
                        sourceSaveData.cubeByteData,
                        sourceVolumeSize,
                        sourcePosition,
                        targetData,
                        volumeSize,
                        targetPosition,
                        VoxelDataV2PointStride);
                    ApplyVoxelBrushOverride(targetData, volumeSize, targetPosition, brushOverride);
                    UpdateChunkBounds(chunkMins, chunkMaxs, chunkCount, chunkSize, targetPosition);
                    solidBlockCount++;
                }
            }
        }

        return new VoxelVolumeSaveDataV2Surrogate
        {
            chunkCount = ToInt3Surrogate(chunkCount),
            cubeCountPerAxisInAChunk = ToInt3Surrogate(chunkSize),
            solidBlockCount = solidBlockCount,
            chunkMins = chunkMins,
            chunkMaxs = chunkMaxs,
            cubeByteData = targetData
        };
    }

    private static void ApplyVoxelBrushOverride(
        byte[] targetData,
        Vector3Int volumeSize,
        Vector3Int position,
        VoxelBrushOverride brushOverride)
    {
        if (!brushOverride.HasAny)
            return;

        var pointOffset = GetPointByteOffset(position, volumeSize, VoxelDataV2PointStride);
        if (brushOverride.HasColor)
            WriteVoxelDataV2Color(targetData, pointOffset, brushOverride.Color);
        if (brushOverride.HasMaterial)
            WritePackedMaterialId(targetData, pointOffset + VoxelDataV2IdByteOffset, brushOverride.MaterialId, VoxelDataV2IdMask);
    }

    private static List<Vector3Int> CollectOccupiedSourceLocalPositions(
        byte[] sourceData,
        Vector3Int sourceVolumeSize,
        Vector3Int sourceMin,
        Vector3Int sourceSize)
    {
        var occupiedSourceLocalPositions = new List<Vector3Int>();
        for (var z = 0; z < sourceSize.z; z++)
        {
            for (var y = 0; y < sourceSize.y; y++)
            {
                for (var x = 0; x < sourceSize.x; x++)
                {
                    var localPosition = new Vector3Int(x, y, z);
                    var sourcePosition = sourceMin + localPosition;
                    if (IsPointOccupied(
                            sourceData,
                            sourceVolumeSize,
                            sourcePosition,
                            VoxelDataV2PointStride,
                            VoxelDataV2IdByteOffset,
                            VoxelDataV2IdMask))
                        occupiedSourceLocalPositions.Add(localPosition);
                }
            }
        }

        return occupiedSourceLocalPositions;
    }

    private static bool IsDenseVoxBoxBrush(int occupiedVoxelCount, Vector3Int sourceSize)
    {
        var sourceVolume = (long)sourceSize.x * sourceSize.y * sourceSize.z;
        return sourceVolume > 0 &&
               occupiedVoxelCount / (float)sourceVolume >= DenseVoxBoxBrushFillThreshold;
    }

    private static bool TryResolveDenseBrushFallbackSourcePosition(
        Vector3Int sourceLocalPosition,
        Vector3Int sourceMin,
        List<Vector3Int> occupiedSourceLocalPositions,
        Dictionary<Vector3Int, Vector3Int> fallbackSourceLocalPositionByLocalPosition,
        out Vector3Int sourcePosition)
    {
        if (fallbackSourceLocalPositionByLocalPosition != null &&
            fallbackSourceLocalPositionByLocalPosition.TryGetValue(sourceLocalPosition, out var cachedSourceLocalPosition))
        {
            sourcePosition = sourceMin + cachedSourceLocalPosition;
            return true;
        }

        if (!TryFindNearestOccupiedSourceLocalPosition(
                sourceLocalPosition,
                occupiedSourceLocalPositions,
                out var fallbackSourceLocalPosition))
        {
            sourcePosition = sourceMin;
            return false;
        }

        if (fallbackSourceLocalPositionByLocalPosition != null)
            fallbackSourceLocalPositionByLocalPosition[sourceLocalPosition] = fallbackSourceLocalPosition;

        sourcePosition = sourceMin + fallbackSourceLocalPosition;
        return true;
    }

    private static bool TryFindNearestOccupiedSourceLocalPosition(
        Vector3Int sourceLocalPosition,
        List<Vector3Int> occupiedSourceLocalPositions,
        out Vector3Int nearestSourceLocalPosition)
    {
        nearestSourceLocalPosition = Vector3Int.zero;
        if (occupiedSourceLocalPositions == null || occupiedSourceLocalPositions.Count == 0)
            return false;

        var bestDistance = long.MaxValue;
        foreach (var occupiedSourceLocalPosition in occupiedSourceLocalPositions)
        {
            var distance = GetSquaredDistance(sourceLocalPosition, occupiedSourceLocalPosition);
            if (distance >= bestDistance)
                continue;

            bestDistance = distance;
            nearestSourceLocalPosition = occupiedSourceLocalPosition;
            if (bestDistance == 1)
                break;
        }

        return true;
    }

    private static long GetSquaredDistance(Vector3Int a, Vector3Int b)
    {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dz = a.z - b.z;
        return (long)dx * dx + (long)dy * dy + (long)dz * dz;
    }

    internal static VoxBoxBakeResolution GetBrushVoxBoxBakeResolution(
        Vector3Int requestedSize,
        float elementScale,
        float targetVoxelSize)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        elementScale = Mathf.Max(0.001f, elementScale);
        targetVoxelSize = Mathf.Max(elementScale, targetVoxelSize);

        return new VoxBoxBakeResolution(
            requestedSize,
            new Vector3Int(
                CalculateBrushVoxBoxBakedAxisSize(requestedSize.x, elementScale, targetVoxelSize),
                CalculateBrushVoxBoxBakedAxisSize(requestedSize.y, elementScale, targetVoxelSize),
                CalculateBrushVoxBoxBakedAxisSize(requestedSize.z, elementScale, targetVoxelSize)),
            targetVoxelSize);
    }

    private static int CalculateBrushVoxBoxBakedAxisSize(int requestedAxisSize, float elementScale, float targetVoxelSize)
    {
        requestedAxisSize = Mathf.Max(1, requestedAxisSize);
        var worldSize = requestedAxisSize * elementScale;
        return Mathf.Max(1, Mathf.CeilToInt(worldSize / targetVoxelSize));
    }

    internal static int MapBakedVoxBoxCoordinateToRequested(int bakedCoordinate, int requestedAxisSize, int bakedAxisSize)
    {
        requestedAxisSize = Mathf.Max(1, requestedAxisSize);
        bakedAxisSize = Mathf.Max(1, bakedAxisSize);
        bakedCoordinate = Mathf.Clamp(bakedCoordinate, 0, bakedAxisSize - 1);
        return Mathf.Clamp(
            Mathf.FloorToInt((bakedCoordinate + 0.5f) * requestedAxisSize / bakedAxisSize),
            0,
            requestedAxisSize - 1);
    }

    private static byte[] SerializeRuntimeVoxelSaveDataV2(VoxelVolumeSaveDataV2Surrogate saveData)
    {
        var saveDataType = Type.GetType(RuntimeVoxelSaveDataV2TypeName, true);
        var int3Type = Type.GetType(RuntimeInt3TypeName, true);
        var int3X = int3Type.GetField("x");
        var int3Y = int3Type.GetField("y");
        var int3Z = int3Type.GetField("z");
        var runtimeSaveData = Activator.CreateInstance(saveDataType);

        saveDataType.GetField("chunkCount").SetValue(runtimeSaveData, CreateRuntimeInt3(int3Type, int3X, int3Y, int3Z, saveData.chunkCount));
        saveDataType.GetField("cubeCountPerAxisInAChunk").SetValue(runtimeSaveData, CreateRuntimeInt3(int3Type, int3X, int3Y, int3Z, saveData.cubeCountPerAxisInAChunk));
        saveDataType.GetField("solidBlockCount").SetValue(runtimeSaveData, saveData.solidBlockCount);
        saveDataType.GetField("chunkMins").SetValue(runtimeSaveData, CreateRuntimeInt3Array(int3Type, int3X, int3Y, int3Z, saveData.chunkMins));
        saveDataType.GetField("chunkMaxs").SetValue(runtimeSaveData, CreateRuntimeInt3Array(int3Type, int3X, int3Y, int3Z, saveData.chunkMaxs));
        saveDataType.GetField("cubeByteData").SetValue(runtimeSaveData, saveData.cubeByteData);

        var formatter = new BinaryFormatter();
        using (var stream = new MemoryStream())
        {
            formatter.Serialize(stream, runtimeSaveData);
            return stream.ToArray();
        }
    }

    private static object CreateRuntimeInt3(
        Type int3Type,
        System.Reflection.FieldInfo xField,
        System.Reflection.FieldInfo yField,
        System.Reflection.FieldInfo zField,
        Int3Surrogate value)
    {
        var int3 = Activator.CreateInstance(int3Type);
        xField.SetValue(int3, value.x);
        yField.SetValue(int3, value.y);
        zField.SetValue(int3, value.z);
        return int3;
    }

    private static Array CreateRuntimeInt3Array(
        Type int3Type,
        System.Reflection.FieldInfo xField,
        System.Reflection.FieldInfo yField,
        System.Reflection.FieldInfo zField,
        Int3Surrogate[] values)
    {
        values = values ?? new Int3Surrogate[0];
        var array = Array.CreateInstance(int3Type, values.Length);
        for (var i = 0; i < values.Length; i++)
            array.SetValue(CreateRuntimeInt3(int3Type, xField, yField, zField, values[i]), i);
        return array;
    }

    private static void CopyPointData(
        byte[] sourceData,
        Vector3Int sourceVolumeSize,
        Vector3Int sourcePosition,
        byte[] targetData,
        Vector3Int targetVolumeSize,
        Vector3Int targetPosition,
        int pointStride)
    {
        var sourceOffset = GetPointByteOffset(sourcePosition, sourceVolumeSize, pointStride);
        var targetOffset = GetPointByteOffset(targetPosition, targetVolumeSize, pointStride);
        Buffer.BlockCopy(sourceData, sourceOffset, targetData, targetOffset, pointStride);
    }

    private static int GetPointByteOffset(Vector3Int position, Vector3Int volumeSize, int pointStride)
    {
        var dataSizeX = volumeSize.x;
        var dataSizeY = volumeSize.y;
        var index = ((long)position.z * dataSizeX * dataSizeY) + ((long)position.y * dataSizeX) + position.x;
        var byteOffset = index * pointStride;
        if (byteOffset < 0 || byteOffset > int.MaxValue)
            throw new InvalidOperationException("Voxel point byte offset is out of range.");
        return (int)byteOffset;
    }

    private static long GetPointDataByteCount(Vector3Int volumeSize, int pointStride)
    {
        // Existing converter output reserves a point-grid-sized buffer, while occupied voxel IDs are addressed by cube stride.
        return (long)(volumeSize.x + 1) * (volumeSize.y + 1) * (volumeSize.z + 1) * pointStride;
    }

    private static Vector3Int GetVolumeSize(VoxelVolumeSaveDataV2Surrogate saveData)
    {
        var chunkCount = ToVector3Int(saveData.chunkCount);
        var chunkSize = ToVector3Int(saveData.cubeCountPerAxisInAChunk);
        return Vector3Int.Scale(chunkCount, chunkSize);
    }

    private static int CeilDivide(int value, int divisor)
    {
        return Mathf.Max(1, (value + Mathf.Max(1, divisor) - 1) / Mathf.Max(1, divisor));
    }

    private static int GetChunkTotal(Vector3Int chunkCount)
    {
        var total = (long)chunkCount.x * chunkCount.y * chunkCount.z;
        if (total <= 0 || total > int.MaxValue)
            throw new InvalidOperationException("Voxel chunk count is out of range.");
        return (int)total;
    }

    private static int PositiveModulo(int value, int divisor)
    {
        divisor = Mathf.Max(1, divisor);
        var result = value % divisor;
        return result < 0 ? result + divisor : result;
    }

    private static void UpdateChunkBounds(
        Int3Surrogate[] chunkMins,
        Int3Surrogate[] chunkMaxs,
        Vector3Int chunkCount,
        Vector3Int chunkSize,
        Vector3Int position)
    {
        var chunkCoordinate = new Vector3Int(
            position.x / chunkSize.x,
            position.y / chunkSize.y,
            position.z / chunkSize.z);
        var chunkIndex = chunkCoordinate.z * chunkCount.x * chunkCount.y + chunkCoordinate.y * chunkCount.x + chunkCoordinate.x;
        var localPosition = new Vector3Int(
            position.x - chunkCoordinate.x * chunkSize.x,
            position.y - chunkCoordinate.y * chunkSize.y,
            position.z - chunkCoordinate.z * chunkSize.z);

        var localMin = ToVector3Int(chunkMins[chunkIndex]);
        var localMax = ToVector3Int(chunkMaxs[chunkIndex]);
        if (localMax.x < 0 || localMax.y < 0 || localMax.z < 0)
        {
            localMin = localPosition;
            localMax = localPosition;
        }
        else
        {
            localMin = Vector3Int.Min(localMin, localPosition);
            localMax = Vector3Int.Max(localMax, localPosition);
        }

        chunkMins[chunkIndex] = ToInt3Surrogate(localMin);
        chunkMaxs[chunkIndex] = ToInt3Surrogate(localMax);
    }

    private static Vector3Int GetRotatedVoxelSize(Vector3Int sourceSize, Quaternion rotation)
    {
        if (IsIdentityRotation(rotation))
            return MaxVector3Int(Vector3Int.one, sourceSize);

        var xAxis = AbsRoundedAxis(rotation * Vector3.right);
        var yAxis = AbsRoundedAxis(rotation * Vector3.up);
        var zAxis = AbsRoundedAxis(rotation * Vector3.forward);
        return MaxVector3Int(
            Vector3Int.one,
            new Vector3Int(
                Mathf.RoundToInt(xAxis.x * sourceSize.x + yAxis.x * sourceSize.y + zAxis.x * sourceSize.z),
                Mathf.RoundToInt(xAxis.y * sourceSize.x + yAxis.y * sourceSize.y + zAxis.y * sourceSize.z),
                Mathf.RoundToInt(xAxis.z * sourceSize.x + yAxis.z * sourceSize.y + zAxis.z * sourceSize.z)));
    }

    private static Vector3Int MapRotatedVoxBoxSampleToSource(
        Vector3Int samplePosition,
        Vector3Int sourceSize,
        Vector3Int sampleSize,
        Quaternion sourceRotation)
    {
        if (IsIdentityRotation(sourceRotation) && sourceSize == sampleSize)
            return samplePosition;

        var sampleCentered = new Vector3(
            samplePosition.x + 0.5f - sampleSize.x * 0.5f,
            samplePosition.y + 0.5f - sampleSize.y * 0.5f,
            samplePosition.z + 0.5f - sampleSize.z * 0.5f);
        var sourceCentered = Quaternion.Inverse(sourceRotation) * sampleCentered;

        return new Vector3Int(
            ClampVoxelIndex(Mathf.FloorToInt(sourceCentered.x + sourceSize.x * 0.5f + 0.0001f), sourceSize.x),
            ClampVoxelIndex(Mathf.FloorToInt(sourceCentered.y + sourceSize.y * 0.5f + 0.0001f), sourceSize.y),
            ClampVoxelIndex(Mathf.FloorToInt(sourceCentered.z + sourceSize.z * 0.5f + 0.0001f), sourceSize.z));
    }

    private static Vector3 AbsRoundedAxis(Vector3 value)
    {
        return new Vector3(
            Mathf.Abs(Mathf.Round(value.x)),
            Mathf.Abs(Mathf.Round(value.y)),
            Mathf.Abs(Mathf.Round(value.z)));
    }

    private static int ClampVoxelIndex(int value, int size)
    {
        return Mathf.Clamp(value, 0, Mathf.Max(1, size) - 1);
    }

    private static PivotOffsetInfo GetTeardownToVoxelOriginOffset(
        VoxelBoundsInfo voxelBounds,
        Quaternion xmlRotation,
        Quaternion sourceRotation,
        Vector3 scale,
        bool isNestedXmlChild,
        bool allowCenterBias = true)
    {
        var localRotation = xmlRotation * sourceRotation;
        var isFinalRotationIdentity = IsIdentityRotation(localRotation);
        var worldOffsetVoxelUnits = isFinalRotationIdentity
            ? GetRotatedTeardownToVoxelOriginOffsetVoxelUnits(voxelBounds, Quaternion.identity)
            : xmlRotation * GetRotatedTeardownToVoxelOriginOffsetVoxelUnits(voxelBounds, sourceRotation);

        if (allowCenterBias && ShouldApplyTeardownCenterBias(isFinalRotationIdentity, xmlRotation, isNestedXmlChild))
            worldOffsetVoxelUnits = ApplyTeardownHandednessCenterBias(worldOffsetVoxelUnits, xmlRotation, localRotation);

        var localOffsetVoxelUnits = Quaternion.Inverse(localRotation) * worldOffsetVoxelUnits;
        return new PivotOffsetInfo(
            localRotation * Vector3.Scale(localOffsetVoxelUnits, scale),
            localOffsetVoxelUnits);
    }

    private static bool ShouldApplyTeardownCenterBias(
        bool isFinalRotationIdentity,
        Quaternion xmlRotation,
        bool isNestedXmlChild)
    {
        if (!isFinalRotationIdentity)
            return true;

        return !isNestedXmlChild && IsIdentityRotation(xmlRotation);
    }

    private static Vector3 ApplyTeardownHandednessCenterBias(
        Vector3 worldOffsetVoxelUnits,
        Quaternion xmlRotation,
        Quaternion localRotation)
    {
        if (worldOffsetVoxelUnits.x > 0.0001f)
            worldOffsetVoxelUnits.x -= 1f;
        else if (IsIdentityRotation(xmlRotation) && (localRotation * Vector3.forward).x < -0.5f)
            worldOffsetVoxelUnits.x += 1f;

        if (worldOffsetVoxelUnits.z < -0.0001f)
            worldOffsetVoxelUnits.z += 1f;
        return worldOffsetVoxelUnits;
    }

    private static bool IsIdentityRotation(Quaternion rotation)
    {
        return Mathf.Abs(Quaternion.Dot(rotation, Quaternion.identity)) > 0.9999f;
    }

    private static Vector3 GetRotatedTeardownToVoxelOriginOffsetVoxelUnits(VoxelBoundsInfo voxelBounds, Quaternion rotation)
    {
        if (!voxelBounds.HasVolumeSize)
            return Vector3.zero;

        if (voxelBounds.HasOccupiedBounds)
        {
            var occupiedSize = voxelBounds.OccupiedMax - voxelBounds.OccupiedMin + new Vector3Int(1, 1, 1);
            var horizontalMin = new Vector3(voxelBounds.OccupiedMin.x, 0f, voxelBounds.OccupiedMin.z);
            var horizontalSize = new Vector3(occupiedSize.x, 0f, occupiedSize.z);
            return rotation * horizontalMin +
                   FloorVector(rotation * (horizontalSize * 0.5f)) +
                   rotation * new Vector3(0f, voxelBounds.OccupiedMin.y - 0.5f, 0f);
        }

        var voxelSize = voxelBounds.VolumeSize;
        return FloorVector(rotation * (new Vector3(voxelSize.x, 0f, voxelSize.z) * 0.5f)) +
               rotation * new Vector3(0f, -0.5f, 0f);
    }

    private static Vector3 FloorVector(Vector3 value)
    {
        return new Vector3(
            FloorWithTolerance(value.x),
            FloorWithTolerance(value.y),
            FloorWithTolerance(value.z));
    }

    private static float FloorWithTolerance(float value)
    {
        var rounded = Mathf.Round(value);
        return Mathf.Abs(value - rounded) < 0.0001f
            ? rounded
            : Mathf.Floor(value);
    }

    private static Vector3 ResolveSourceScale(Vector3 sourceScale, float fallbackScale)
    {
        if (sourceScale.x > 0.0001f && sourceScale.y > 0.0001f && sourceScale.z > 0.0001f &&
            !Approximately(sourceScale, Vector3.one))
            return sourceScale;

        return Vector3.one * fallbackScale;
    }

    private static Vector3 GetSourcePlacementSize(VoxelBoundsInfo voxelBounds)
    {
        if (!voxelBounds.HasVolumeSize)
            return Vector3.one;

        var placement = voxelBounds.PlacementSize;
        return new Vector3(
            Mathf.Max(1, placement.x),
            Mathf.Max(1, placement.y),
            Mathf.Max(1, placement.z));
    }

    private static void ConfigureVoxelScene(VoxelScene voxelScene, Transform associatedVoxelDataTrans, Transform spawnPoint)
    {
        var so = new SerializedObject(voxelScene);
        SetSerializedObject(so, "associatedVoxelDataTrans", associatedVoxelDataTrans);
        if (spawnPoint != null)
            SetSerializedObject(so, "spawnPoint", spawnPoint.gameObject);
        so.ApplyModifiedPropertiesWithoutUndo();
    }

    private static void UpsertManifestScene(string modRoot, string sceneName, GameObject prefab)
    {
        var manifest = LoadManifest(modRoot);
        if (manifest == null)
            throw new InvalidOperationException("Mod manifest not found under " + modRoot);

        var so = new SerializedObject(manifest);
        var scenes = so.FindProperty("Scenes");
        if (scenes == null || !scenes.isArray)
            throw new InvalidOperationException("Manifest Scenes array not found in " + AssetDatabase.GetAssetPath(manifest));

        var index = -1;
        for (var i = 0; i < scenes.arraySize; i++)
        {
            if (scenes.GetArrayElementAtIndex(i).FindPropertyRelative("name")?.stringValue == sceneName)
                index = i;
        }

        var created = index < 0;
        if (created)
        {
            scenes.InsertArrayElementAtIndex(scenes.arraySize);
            index = scenes.arraySize - 1;
        }

        var scene = scenes.GetArrayElementAtIndex(index);
        scene.FindPropertyRelative("name").stringValue = sceneName;
        scene.FindPropertyRelative("prefab").objectReferenceValue = prefab;

        var icon = scene.FindPropertyRelative("icon");
        if (icon != null && created)
            icon.objectReferenceValue = null;

        so.ApplyModifiedPropertiesWithoutUndo();
        EditorUtility.SetDirty(manifest);
    }

    private static ModManifestV2 LoadManifest(string modRoot)
    {
        var direct = AssetDatabase.LoadAssetAtPath<ModManifestV2>(CombineAssetPath(modRoot, "manifest.asset"));
        if (direct != null)
            return direct;

        var guid = AssetDatabase.FindAssets("t:ModManifestV2", new[] { modRoot }).FirstOrDefault();
        return string.IsNullOrWhiteSpace(guid)
            ? null
            : AssetDatabase.LoadAssetAtPath<ModManifestV2>(AssetDatabase.GUIDToAssetPath(guid));
    }

    private static void ApplyXmlTransform(
        Transform transform,
        XElement element,
        float scaleMultiplier = 1f,
        float positionMultiplier = 1f)
    {
        transform.localPosition = ParseTeardownPosition(element, "pos", Vector3.zero) * positionMultiplier;
        transform.localRotation = ParseTeardownRotation(element, "rot");
        transform.localScale = ParseScale(GetAttribute(element, "scale", "1")) * scaleMultiplier;
    }

    private static PivotOffsetInfo ApplyVoxXmlTransform(
        Transform transform,
        XElement element,
        Quaternion sourceRotation,
        Vector3 sourceScale,
        VoxelBoundsInfo voxelBounds,
        bool isNestedXmlChild)
    {
        var xmlPosition = ParseTeardownPosition(element, "pos", Vector3.zero);
        var xmlRotation = ParseTeardownRotation(element, "rot");
        var localRotation = xmlRotation * sourceRotation;
        var localScale = Vector3.Scale(ParseScale(GetAttribute(element, "scale", "1")), sourceScale);

        var pivotOffset = GetTeardownToVoxelOriginOffset(voxelBounds, xmlRotation, sourceRotation, localScale, isNestedXmlChild);
        transform.localPosition = xmlPosition - pivotOffset.WorldUnits;
        transform.localRotation = localRotation;
        transform.localScale = localScale;
        return pivotOffset;
    }

    private static PivotOffsetInfo ApplyVoxBoxXmlTransform(
        Transform transform,
        XElement element,
        Quaternion sourceRotation,
        Vector3 sourceScale,
        VoxelBoundsInfo voxelBounds,
        Vector3 requestedSizeVoxels,
        float elementScale,
        bool isNestedXmlChild)
    {
        var xmlPosition = ParseTeardownPosition(element, "pos", Vector3.zero);
        var xmlRotation = ParseTeardownRotation(element, "rot");
        var localRotation = xmlRotation * sourceRotation;
        var localScale = Vector3.Scale(ParseScale(GetAttribute(element, "scale", "1")), sourceScale);
        var centerOffset = xmlRotation * TeardownToUnityDirection(new Vector3(
            requestedSizeVoxels.x * elementScale * 0.5f,
            0f,
            requestedSizeVoxels.z * elementScale * 0.5f));

        var pivotOffset = GetTeardownToVoxelOriginOffset(voxelBounds, xmlRotation, sourceRotation, localScale, isNestedXmlChild);
        var xmlOriginPivotOffset = GetTeardownToVoxelOriginOffset(voxelBounds, xmlRotation, sourceRotation, localScale, isNestedXmlChild, false);
        // Keep nested XML children anchored to the voxbox XML origin, not the centered mesh pivot.
        var centerOffsetVoxelUnits = Vector3.Scale(Quaternion.Inverse(localRotation) * centerOffset, InverseScale(localScale));
        var xmlOriginOffset = new PivotOffsetInfo(
            xmlOriginPivotOffset.WorldUnits - centerOffset,
            xmlOriginPivotOffset.ElementLocalVoxelUnits - centerOffsetVoxelUnits);

        transform.localPosition = xmlPosition - xmlOriginOffset.WorldUnits;
        transform.localRotation = localRotation;
        transform.localScale = localScale;
        return xmlOriginOffset;
    }

    private static Vector3 ParseTeardownPosition(XElement element, string attributeName, Vector3 fallback)
    {
        return TeardownToUnityPosition(ParseVector3(GetAttribute(element, attributeName, ""), fallback));
    }

    private static Quaternion ParseTeardownRotation(XElement element, string attributeName)
    {
        var teardownEuler = ParseVector3(GetAttribute(element, attributeName, "0 0 0"), Vector3.zero);
        return TeardownToUnityRotation(Quaternion.Euler(teardownEuler));
    }

    private static Vector3 TeardownToUnityPosition(Vector3 value)
    {
        return new Vector3(value.x, value.y, -value.z);
    }

    private static Vector3 TeardownToUnityDirection(Vector3 value)
    {
        return new Vector3(value.x, value.y, -value.z);
    }

    private static Quaternion TeardownToUnityRotation(Quaternion value)
    {
        return new Quaternion(-value.x, -value.y, value.z, value.w);
    }

    private static Vector3 InverseScale(Vector3 scale)
    {
        return new Vector3(
            SafeInverse(scale.x),
            SafeInverse(scale.y),
            SafeInverse(scale.z));
    }

    private static float SafeInverse(float value)
    {
        return Mathf.Abs(value) > 0.0001f ? 1f / value : 1f;
    }

    private static float SafeDivide(float numerator, float denominator)
    {
        return Mathf.Abs(denominator) > 0.0001f ? numerator / denominator : numerator;
    }

    private static bool Approximately(Vector3 left, Vector3 right)
    {
        return Mathf.Approximately(left.x, right.x) &&
               Mathf.Approximately(left.y, right.y) &&
               Mathf.Approximately(left.z, right.z);
    }

    private static Vector3 ParseScale(string value)
    {
        var parts = SplitNumbers(value);
        if (parts.Length == 1 && TryParseFloat(parts[0], out var uniform))
            return Vector3.one * uniform;
        return ParseVector3(value, Vector3.one);
    }

    private static Vector3 ParseVector3(string value, Vector3 fallback)
    {
        var parts = SplitNumbers(value);
        if (parts.Length == 1 && TryParseFloat(parts[0], out var uniform))
            return Vector3.one * uniform;
        if (parts.Length < 3)
            return fallback;

        return TryParseFloat(parts[0], out var x) &&
               TryParseFloat(parts[1], out var y) &&
               TryParseFloat(parts[2], out var z)
            ? new Vector3(x, y, z)
            : fallback;
    }

    private static Vector3Int ParseVector3Int(string value, Vector3Int fallback)
    {
        var parts = SplitNumbers(value);
        if (parts.Length == 1 && TryParseFloat(parts[0], out var uniform))
            return Vector3Int.RoundToInt(Vector3.one * uniform);

        if (parts.Length < 3)
            return fallback;

        return TryParseFloat(parts[0], out var x) &&
               TryParseFloat(parts[1], out var y) &&
               TryParseFloat(parts[2], out var z)
            ? Vector3Int.RoundToInt(new Vector3(x, y, z))
            : fallback;
    }

    private static bool TryParseVector2(string value, out Vector2 result)
    {
        result = Vector2.zero;
        var parts = SplitNumbers(value);
        if (parts.Length < 2 ||
            !TryParseFloat(parts[0], out var x) ||
            !TryParseFloat(parts[1], out var y))
            return false;

        result = new Vector2(x, y);
        return true;
    }

    private static Vector3Int MaxVector3Int(Vector3Int left, Vector3Int right)
    {
        return new Vector3Int(
            Mathf.Max(left.x, right.x),
            Mathf.Max(left.y, right.y),
            Mathf.Max(left.z, right.z));
    }

    internal static Vector3Int GetVoxBoxTargetChunkSize(Vector3Int sourceChunkSize, Vector3Int requestedSize)
    {
        sourceChunkSize = MaxVector3Int(Vector3Int.one, sourceChunkSize);
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        return new Vector3Int(
            Mathf.Min(sourceChunkSize.x, requestedSize.x),
            Mathf.Min(sourceChunkSize.y, requestedSize.y),
            Mathf.Min(sourceChunkSize.z, requestedSize.z));
    }

    internal static Vector3Int GetVoxBoxVolumeSize(Vector3Int requestedSize, Vector3Int chunkSize)
    {
        requestedSize = MaxVector3Int(Vector3Int.one, requestedSize);
        chunkSize = MaxVector3Int(Vector3Int.one, chunkSize);
        var chunkCount = new Vector3Int(
            CeilDivide(requestedSize.x, chunkSize.x),
            CeilDivide(requestedSize.y, chunkSize.y),
            CeilDivide(requestedSize.z, chunkSize.z));
        return Vector3Int.Scale(chunkCount, chunkSize);
    }

    private static Color ParseColor(string value)
    {
        var parts = SplitNumbers(value);
        if (parts.Length < 3)
            return Color.white;

        return TryParseFloat(parts[0], out var r) &&
               TryParseFloat(parts[1], out var g) &&
               TryParseFloat(parts[2], out var b)
            ? new Color(r, g, b, 1f)
            : Color.white;
    }

    private static Color32 ParseColor32(string value, Color32 fallback)
    {
        var parts = SplitNumbers(value);
        if (parts.Length < 3)
            return fallback;

        return TryParseFloat(parts[0], out var r) &&
               TryParseFloat(parts[1], out var g) &&
               TryParseFloat(parts[2], out var b)
            ? new Color32(ToColorByte(r), ToColorByte(g), ToColorByte(b), 255)
            : fallback;
    }

    private static byte ToColorByte(float value)
    {
        return (byte)Mathf.Clamp(
            Mathf.RoundToInt(value <= 1f ? value * 255f : value),
            0,
            255);
    }

    private static byte ResolveTeardownMaterialId(string materialName, byte fallback)
    {
        materialName = (materialName ?? "").Trim().ToLowerInvariant();
        switch (materialName)
        {
            case "wood":
                return MaterialIdWood;
            case "grass":
            case "foliage":
                return MaterialIdGrass;
            case "plastic":
                return MaterialIdPlastic;
            case "dirt":
                return MaterialIdDirt;
            case "rock":
            case "stone":
            case "masonry":
            case "mansonry":
            case "brick":
                return MaterialIdStone;
            case "concrete":
            case "plaster":
                return MaterialIdConcrete;
            case "metal":
            case "weakmetal":
            case "weak metal":
                return MaterialIdWeakMetal;
            case "glass":
                return MaterialIdGlass;
            default:
                return fallback;
        }
    }

    private static byte ResolveTeardownMaterialIdFromElement(XElement element, byte fallback)
    {
        var explicitMaterial = GetAttribute(element, "material", "");
        if (!string.IsNullOrWhiteSpace(explicitMaterial))
            return ResolveTeardownMaterialId(explicitMaterial, fallback);

        var sourceText = string.Join(
                " ",
                GetAttribute(element, "template", ""),
                GetAttribute(element, "brush", ""),
                GetAttribute(element, "file", ""),
                GetAttribute(element, "object", ""),
                GetAttribute(element, "name", ""))
            .ToLowerInvariant();

        if (ContainsAny(sourceText, "glass", "window"))
            return MaterialIdGlass;
        if (ContainsAny(sourceText, "grass", "foliage", "bush", "plant", "vine", "leaf", "hedge"))
            return MaterialIdGrass;
        if (ContainsAny(sourceText, "wood", "hardwood", "plank", "log"))
            return MaterialIdWood;
        if (ContainsAny(sourceText, "dirt", "soil", "sand", "mud"))
            return MaterialIdDirt;
        if (ContainsAny(sourceText, "brick", "stone", "rock", "masonry", "mansonry"))
            return MaterialIdStone;
        if (ContainsAny(sourceText, "metal", "steel", "iron", "drainage"))
            return MaterialIdWeakMetal;
        if (ContainsAny(sourceText, "plastic", "rubber"))
            return MaterialIdPlastic;
        if (ContainsAny(sourceText, "concrete", "cement", "plaster", "tile"))
            return MaterialIdConcrete;

        return fallback;
    }

    private static byte ResolveTeardownMaterialIdFromText(string sourceText, byte fallback)
    {
        sourceText = (sourceText ?? "").ToLowerInvariant();

        if (ContainsAny(sourceText, "glass", "window"))
            return MaterialIdGlass;
        if (ContainsAny(sourceText, "grass", "foliage", "bush", "plant", "vine", "leaf", "hedge"))
            return MaterialIdGrass;
        if (ContainsAny(sourceText, "wood", "hardwood", "plank", "log"))
            return MaterialIdWood;
        if (ContainsAny(sourceText, "dirt", "soil", "sand", "mud"))
            return MaterialIdDirt;
        if (ContainsAny(sourceText, "brick", "stone", "rock", "masonry", "mansonry"))
            return MaterialIdStone;
        if (ContainsAny(sourceText, "metal", "steel", "iron", "drainage"))
            return MaterialIdWeakMetal;
        if (ContainsAny(sourceText, "plastic", "rubber"))
            return MaterialIdPlastic;
        if (ContainsAny(sourceText, "concrete", "cement", "plaster", "tile"))
            return MaterialIdConcrete;

        return fallback;
    }

    private static bool ContainsAny(string value, params string[] tokens)
    {
        if (string.IsNullOrEmpty(value))
            return false;

        return tokens.Any(token => value.IndexOf(token, StringComparison.OrdinalIgnoreCase) >= 0);
    }

    private static Color32 GetDefaultVoxelColor(byte materialId)
    {
        switch (materialId)
        {
            case MaterialIdWood:
                return new Color32(112, 73, 42, 255);
            case MaterialIdGrass:
                return new Color32(80, 118, 48, 255);
            case MaterialIdPlastic:
                return new Color32(210, 210, 210, 255);
            case MaterialIdDirt:
                return new Color32(96, 72, 48, 255);
            case MaterialIdStone:
                return new Color32(118, 116, 108, 255);
            case MaterialIdConcrete:
                return new Color32(150, 150, 144, 255);
            case MaterialIdWeakMetal:
                return new Color32(42, 42, 42, 255);
            case MaterialIdGlass:
                return new Color32(180, 215, 235, 150);
            default:
                return new Color32(160, 160, 160, 255);
        }
    }

    private static string FormatColorForAssetPath(Color32 color)
    {
        return color.r.ToString("X2", CultureInfo.InvariantCulture) +
               color.g.ToString("X2", CultureInfo.InvariantCulture) +
               color.b.ToString("X2", CultureInfo.InvariantCulture) +
               color.a.ToString("X2", CultureInfo.InvariantCulture);
    }

    private static string StableHexHash(string value)
    {
        unchecked
        {
            const ulong offset = 14695981039346656037UL;
            const ulong prime = 1099511628211UL;
            var hash = offset;
            foreach (var character in value ?? "")
            {
                hash ^= character;
                hash *= prime;
            }

            return hash.ToString("X16", CultureInfo.InvariantCulture);
        }
    }

    private static bool TryParseFloat(string value, out float result)
    {
        return float.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out result);
    }

    private static string[] SplitNumbers(string value)
    {
        return (value ?? "")
            .Split(new[] { ' ', '\t', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
    }

    private static string GetAttribute(XElement element, string attributeName, string fallback)
    {
        return element?.Attribute(attributeName)?.Value ?? fallback;
    }

    private static bool? GetBoolAttribute(XElement element, string attributeName)
    {
        var value = element?.Attribute(attributeName)?.Value;
        if (string.IsNullOrWhiteSpace(value))
            return null;

        value = value.Trim();
        if (string.Equals(value, "true", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(value, "1", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(value, "yes", StringComparison.OrdinalIgnoreCase))
            return true;

        if (string.Equals(value, "false", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(value, "0", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(value, "no", StringComparison.OrdinalIgnoreCase))
            return false;

        return null;
    }

    private static bool HasTeardownTagInSelfOrAncestors(XElement element, string tagName)
    {
        for (var current = element; current != null; current = current.Parent)
        {
            if (HasTeardownTag(current, tagName))
                return true;
        }

        return false;
    }

    private static bool HasTeardownTag(XElement element, string tagName)
    {
        if (element == null || string.IsNullOrWhiteSpace(tagName))
            return false;

        var tags = GetAttribute(element, "tags", "");
        if (string.IsNullOrWhiteSpace(tags))
            return false;

        foreach (var token in tags.Split(new[] { ' ', '\t', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries))
        {
            var key = token;
            var equalsIndex = key.IndexOf('=');
            if (equalsIndex >= 0)
                key = key.Substring(0, equalsIndex);

            if (string.Equals(key, tagName, StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
    }

    private static bool HasDirectJointDefinition(XElement element)
    {
        if (element == null)
            return false;

        foreach (var child in element.Elements())
        {
            if (child.Name.LocalName == "joint")
                return true;

            if (child.Name.LocalName == "parameters" &&
                child.Elements().Any(grandchild => grandchild.Name.LocalName == "joint"))
                return true;
        }

        return false;
    }

    private static IEnumerable<XElement> EnumerateDirectJointDefinitions(XElement element)
    {
        if (element == null)
            yield break;

        foreach (var child in element.Elements())
        {
            if (child.Name.LocalName == "joint")
            {
                yield return child;
                continue;
            }

            if (child.Name.LocalName != "parameters")
                continue;

            foreach (var joint in child.Elements().Where(grandchild => grandchild.Name.LocalName == "joint"))
                yield return joint;
        }
    }

    private static bool IsInsideDynamicTeardownBody(XElement element)
    {
        return element != null &&
               element.Ancestors()
                   .Any(ancestor => ancestor.Name.LocalName == "body" &&
                                    GetBoolAttribute(ancestor, "dynamic") == true);
    }

    private static XDocument LoadXmlDocument(string xmlAssetPath)
    {
        return XDocument.Load(ToAbsolutePath(xmlAssetPath));
    }

    private static object DeserializeVoxelSaveData(byte[] data)
    {
        var formatter = new BinaryFormatter { Binder = new VoxelSaveDataBinder() };
        using (var stream = new MemoryStream(data))
            return formatter.Deserialize(stream);
    }

    private static bool TryGetVoxelBoundsFromSaveData(object saveData, out VoxelBoundsInfo voxelBounds)
    {
        if (saveData is VoxelVolumeSaveDataV2Surrogate saveDataV2)
        {
            var volumeSize = new Vector3Int(
                saveDataV2.chunkCount.x * saveDataV2.cubeCountPerAxisInAChunk.x,
                saveDataV2.chunkCount.y * saveDataV2.cubeCountPerAxisInAChunk.y,
                saveDataV2.chunkCount.z * saveDataV2.cubeCountPerAxisInAChunk.z);
            if (!HasPositiveSize(volumeSize))
            {
                voxelBounds = VoxelBoundsInfo.Empty;
                return false;
            }

            if (TryGetOccupiedBoundsFromChunkBounds(saveDataV2, volumeSize, saveDataV2.cubeByteData, out var occupiedMin, out var occupiedMax) ||
                TryGetOccupiedBoundsFromPointData(
                    saveDataV2.cubeByteData,
                    volumeSize,
                    8,
                    4,
                    0x1Fu,
                    out occupiedMin,
                    out occupiedMax))
            {
                voxelBounds = new VoxelBoundsInfo(volumeSize, occupiedMin, occupiedMax, true);
                return true;
            }

            voxelBounds = new VoxelBoundsInfo(volumeSize, Vector3Int.zero, Vector3Int.zero, false);
            return true;
        }

        if (saveData is VoxelVolumeSaveDataSurrogate saveDataV1)
        {
            var volumeSize = new Vector3Int(
                saveDataV1.chunkCountX * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountY * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountZ * saveDataV1.cubeCountPerAxisInAChunk);
            if (!HasPositiveSize(volumeSize))
            {
                voxelBounds = VoxelBoundsInfo.Empty;
                return false;
            }

            if (TryGetOccupiedBoundsFromPointData(
                    saveDataV1.cubeByteData,
                    volumeSize,
                    16,
                    4,
                    0xFFu,
                    out var occupiedMin,
                    out var occupiedMax))
            {
                voxelBounds = new VoxelBoundsInfo(volumeSize, occupiedMin, occupiedMax, true);
                return true;
            }

            voxelBounds = new VoxelBoundsInfo(volumeSize, Vector3Int.zero, Vector3Int.zero, false);
            return true;
        }

        voxelBounds = VoxelBoundsInfo.Empty;
        return false;
    }

    private static bool TryGetOccupiedBoundsFromPointData(
        byte[] data,
        Vector3Int volumeSize,
        int pointStride,
        int idByteOffset,
        uint idMask,
        out Vector3Int occupiedMin,
        out Vector3Int occupiedMax)
    {
        occupiedMin = new Vector3Int(int.MaxValue, int.MaxValue, int.MaxValue);
        occupiedMax = new Vector3Int(int.MinValue, int.MinValue, int.MinValue);

        if (data == null || data.Length == 0 || !HasPositiveSize(volumeSize))
            return false;

        var dataSizeX = volumeSize.x;
        var dataSizeY = volumeSize.y;
        var dataSizeZ = volumeSize.z;
        var pointCount = (long)dataSizeX * dataSizeY * dataSizeZ;
        var expectedByteCount = pointCount * pointStride;
        if (pointCount <= 0 || pointCount > int.MaxValue || expectedByteCount > data.Length)
            return false;

        var xyStride = dataSizeX * dataSizeY;
        var found = false;
        for (var index = 0; index < pointCount; index++)
        {
            var byteOffset = (int)index * pointStride + idByteOffset;
            if (byteOffset + sizeof(uint) > data.Length)
                return false;

            if ((BitConverter.ToUInt32(data, byteOffset) & idMask) == 0u)
                continue;

            var z = (int)(index / xyStride);
            var rem = (int)(index % xyStride);
            var y = rem / dataSizeX;
            var x = rem % dataSizeX;

            if (x >= volumeSize.x || y >= volumeSize.y || z >= volumeSize.z)
                continue;

            var position = new Vector3Int(x, y, z);
            occupiedMin = Vector3Int.Min(occupiedMin, position);
            occupiedMax = Vector3Int.Max(occupiedMax, position);
            found = true;
        }

        return found;
    }

    private static bool TryGetOccupiedBoundsFromChunkBounds(
        VoxelVolumeSaveDataV2Surrogate saveData,
        Vector3Int volumeSize,
        byte[] pointData,
        out Vector3Int occupiedMin,
        out Vector3Int occupiedMax)
    {
        occupiedMin = new Vector3Int(int.MaxValue, int.MaxValue, int.MaxValue);
        occupiedMax = new Vector3Int(int.MinValue, int.MinValue, int.MinValue);

        if (saveData.chunkMins == null || saveData.chunkMaxs == null || !HasPositiveSize(volumeSize))
            return false;

        var chunkCount = ToVector3Int(saveData.chunkCount);
        var chunkSize = ToVector3Int(saveData.cubeCountPerAxisInAChunk);
        if (!HasPositiveSize(chunkCount) || !HasPositiveSize(chunkSize))
            return false;

        var chunkTotal = chunkCount.x * chunkCount.y * chunkCount.z;
        if (saveData.chunkMins.Length < chunkTotal || saveData.chunkMaxs.Length < chunkTotal)
            return false;

        var canValidateSinglePointChunks = CanReadRawPointData(pointData, volumeSize, 8);
        var found = false;
        for (var z = 0; z < chunkCount.z; z++)
        {
            for (var y = 0; y < chunkCount.y; y++)
            {
                for (var x = 0; x < chunkCount.x; x++)
                {
                    var chunkIndex = z * chunkCount.x * chunkCount.y + y * chunkCount.x + x;
                    var localMin = ToVector3Int(saveData.chunkMins[chunkIndex]);
                    var localMax = ToVector3Int(saveData.chunkMaxs[chunkIndex]);
                    if (!HasValidChunkBounds(localMin, localMax, chunkSize))
                        continue;

                    var chunkOrigin = Vector3Int.Scale(new Vector3Int(x, y, z), chunkSize);
                    var globalMin = ClampVoxelIndex(chunkOrigin + localMin, volumeSize);
                    var globalMax = ClampVoxelIndex(chunkOrigin + localMax, volumeSize);
                    if (canValidateSinglePointChunks &&
                        localMin == localMax &&
                        !IsPointOccupied(pointData, volumeSize, globalMin, 8, 4, 0x1Fu))
                        continue;

                    occupiedMin = Vector3Int.Min(occupiedMin, globalMin);
                    occupiedMax = Vector3Int.Max(occupiedMax, globalMax);
                    found = true;
                }
            }
        }

        return found;
    }

    private static bool CanReadRawPointData(byte[] data, Vector3Int volumeSize, int pointStride)
    {
        if (data == null || data.Length == 0 || !HasPositiveSize(volumeSize))
            return false;

        var pointCount = (long)volumeSize.x * volumeSize.y * volumeSize.z;
        var expectedByteCount = pointCount * pointStride;
        return pointCount > 0 && pointCount <= int.MaxValue && expectedByteCount <= data.Length;
    }

    private static bool IsPointOccupied(
        byte[] data,
        Vector3Int volumeSize,
        Vector3Int position,
        int pointStride,
        int idByteOffset,
        uint idMask)
    {
        if (position.x < 0 || position.y < 0 || position.z < 0 ||
            position.x >= volumeSize.x || position.y >= volumeSize.y || position.z >= volumeSize.z)
            return false;

        var dataSizeX = volumeSize.x;
        var dataSizeY = volumeSize.y;
        var index = ((long)position.z * dataSizeX * dataSizeY) + ((long)position.y * dataSizeX) + position.x;
        var byteOffset = index * pointStride + idByteOffset;
        if (byteOffset < 0 || byteOffset + sizeof(uint) > data.Length)
            return false;

        return (BitConverter.ToUInt32(data, (int)byteOffset) & idMask) != 0u;
    }

    private static bool HasValidChunkBounds(Vector3Int min, Vector3Int max, Vector3Int chunkSize)
    {
        return min.x <= max.x && min.y <= max.y && min.z <= max.z &&
               min.x >= 0 && min.y >= 0 && min.z >= 0 &&
               max.x >= 0 && max.y >= 0 && max.z >= 0 &&
               min.x < chunkSize.x && min.y < chunkSize.y && min.z < chunkSize.z &&
               max.x < chunkSize.x && max.y < chunkSize.y && max.z < chunkSize.z;
    }

    private static Vector3Int ClampVoxelIndex(Vector3Int value, Vector3Int volumeSize)
    {
        return new Vector3Int(
            Mathf.Clamp(value.x, 0, volumeSize.x - 1),
            Mathf.Clamp(value.y, 0, volumeSize.y - 1),
            Mathf.Clamp(value.z, 0, volumeSize.z - 1));
    }

    private static bool HasPositiveSize(Vector3Int size)
    {
        return size.x > 0 && size.y > 0 && size.z > 0;
    }

    private static Vector3Int ToVector3Int(Int3Surrogate value)
    {
        return new Vector3Int(value.x, value.y, value.z);
    }

    private static Int3Surrogate ToInt3Surrogate(Vector3Int value)
    {
        return new Int3Surrogate
        {
            x = value.x,
            y = value.y,
            z = value.z
        };
    }

    private static string FormatVector3Int(Vector3Int value)
    {
        return value.x + "x" + value.y + "x" + value.z;
    }

    private bool TryUseSelection()
    {
        var selectedPath = Selection.objects
            .Select(AssetDatabase.GetAssetPath)
            .FirstOrDefault(IsXmlAssetPath);

        if (string.IsNullOrWhiteSpace(selectedPath))
            return false;

        var selectedXml = AssetDatabase.LoadAssetAtPath<TextAsset>(selectedPath);
        if (selectedXml == null)
            return false;

        xmlAsset = selectedXml;
        RefreshDefaultPaths(selectedPath, true);
        return true;
    }

    private void RefreshDefaultPaths(string xmlPath, bool overwriteFields)
    {
        if (!IsXmlAssetPath(xmlPath))
            return;

        if (overwriteFields || string.IsNullOrWhiteSpace(outputPrefabPath))
            outputPrefabPath = GetDefaultOutputPrefabPath(xmlPath);

        var modRoot = FindModRoot(xmlPath);
        if (overwriteFields || string.IsNullOrWhiteSpace(teardownModRootPath))
            teardownModRootPath = InferTeardownModRoot(xmlPath, modRoot);
        if (overwriteFields || string.IsNullOrWhiteSpace(dependencyDataFolderPath))
            dependencyDataFolderPath = GetDefaultDependencyDataFolderPath(xmlPath);
        if (overwriteFields || string.IsNullOrWhiteSpace(dependencyPrefabFolderPath))
            dependencyPrefabFolderPath = GetDefaultDependencyPrefabFolderPath(xmlPath);
    }

    private void DrawReport()
    {
        if (lastReport == null)
            return;

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("Last Import", EditorStyles.boldLabel);
        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition, GUILayout.MinHeight(100));
        EditorGUILayout.SelectableLabel(lastReport.ToLogString(), EditorStyles.wordWrappedLabel);
        foreach (var warning in lastReport.Warnings)
            EditorGUILayout.HelpBox(warning, MessageType.Warning);
        foreach (var missing in lastReport.MissingFiles)
            EditorGUILayout.HelpBox("Missing file: " + missing, MessageType.Warning);
        foreach (var missing in lastReport.MissingObjects)
            EditorGUILayout.HelpBox("Missing source object: " + missing, MessageType.Warning);
        EditorGUILayout.EndScrollView();
    }

    private static ImportOptions PrepareOptions(string xmlAssetPath, ImportOptions options)
    {
        options = options ?? new ImportOptions();
        options.OutputPrefabPath = string.IsNullOrWhiteSpace(options.OutputPrefabPath)
            ? GetDefaultOutputPrefabPath(xmlAssetPath)
            : NormalizeAssetPath(options.OutputPrefabPath);
        options.TeardownModRootPath = string.IsNullOrWhiteSpace(options.TeardownModRootPath)
            ? InferTeardownModRoot(xmlAssetPath, FindModRoot(xmlAssetPath))
            : NormalizeAssetPath(options.TeardownModRootPath);
        options.DependencyDataFolderPath = string.IsNullOrWhiteSpace(options.DependencyDataFolderPath)
            ? GetDefaultDependencyDataFolderPath(xmlAssetPath)
            : NormalizeAssetPath(options.DependencyDataFolderPath);
        options.DependencyPrefabFolderPath = string.IsNullOrWhiteSpace(options.DependencyPrefabFolderPath)
            ? GetDefaultDependencyPrefabFolderPath(xmlAssetPath)
            : NormalizeAssetPath(options.DependencyPrefabFolderPath);
        options.ElementScale = options.ElementScaleOrDefault();
        options.BrushVoxBoxVoxelSize = options.BrushVoxBoxVoxelSizeOrDefault();
        options.HeightmapMaxSamples = Mathf.Max(1, options.HeightmapMaxSamples);
        return options;
    }

    private static ImportOptions CreateDefaultOptions(string xmlAssetPath)
    {
        return PrepareOptions(xmlAssetPath, new ImportOptions());
    }

    private static void ValidateOptions(ImportOptions options)
    {
        if (!options.OutputPrefabPath.StartsWith("Assets/", StringComparison.Ordinal) ||
            !options.OutputPrefabPath.EndsWith(".prefab", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Output path must be a prefab path under Assets.");

        if (!options.DependencyDataFolderPath.StartsWith("Assets/", StringComparison.Ordinal) ||
            !options.DependencyPrefabFolderPath.StartsWith("Assets/", StringComparison.Ordinal))
            throw new InvalidOperationException("Dependency folders must be under Assets.");

        if (!options.TeardownModRootPath.StartsWith("Assets/", StringComparison.Ordinal))
            throw new InvalidOperationException("Teardown MOD root must be under Assets.");
    }

    private static bool IsXmlAssetPath(string path)
    {
        return !string.IsNullOrWhiteSpace(path) &&
               NormalizeAssetPath(path).StartsWith("Assets/", StringComparison.Ordinal) &&
               path.EndsWith(".xml", StringComparison.OrdinalIgnoreCase);
    }

    private static string GetDefaultOutputPrefabPath(string xmlAssetPath)
    {
        xmlAssetPath = NormalizeAssetPath(xmlAssetPath);
        var modRoot = FindModRoot(xmlAssetPath);
        var prefabFolder = string.IsNullOrWhiteSpace(modRoot)
            ? Path.GetDirectoryName(xmlAssetPath)
            : CombineAssetPath(modRoot, "Prefab");

        return CombineAssetPath(prefabFolder, Path.GetFileNameWithoutExtension(xmlAssetPath) + ".prefab");
    }

    private static string GetDefaultDependencyDataFolderPath(string xmlAssetPath)
    {
        var modRoot = FindModRoot(xmlAssetPath);
        return CombineAssetPath(CombineAssetPath(modRoot, "Data"), DefaultDependencyFolderName);
    }

    private static string GetDefaultDependencyPrefabFolderPath(string xmlAssetPath)
    {
        var modRoot = FindModRoot(xmlAssetPath);
        return CombineAssetPath(CombineAssetPath(modRoot, "Prefab"), DefaultDependencyFolderName);
    }

    private static string InferTeardownModRoot(string xmlAssetPath, string modRoot)
    {
        xmlAssetPath = NormalizeAssetPath(xmlAssetPath);
        modRoot = NormalizeAssetPath(modRoot);

        var sourcePrefix = CombineAssetPath(modRoot, "source") + "/";
        if (xmlAssetPath.StartsWith(sourcePrefix, StringComparison.OrdinalIgnoreCase))
        {
            var relative = xmlAssetPath.Substring(sourcePrefix.Length);
            var parts = relative.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length > 1)
                return CombineAssetPath(sourcePrefix.TrimEnd('/'), parts[0]);
        }

        return NormalizeAssetPath(Path.GetDirectoryName(xmlAssetPath));
    }

    private static string FindModRoot(string assetPath)
    {
        var parts = NormalizeAssetPath(assetPath).Split('/');
        for (var i = 0; i < parts.Length - 1; i++)
        {
            if ((parts[i] == "Mod" || parts[i] == "Samples") && i + 1 < parts.Length)
                return string.Join("/", parts.Take(i + 2));
        }

        return "";
    }

    private static string ResolveAssetReference(string reference, string currentXmlPath, string teardownModRootPath, string expectedExtension)
    {
        reference = NormalizeAssetPath(reference);
        if (string.IsNullOrWhiteSpace(reference))
            return "";

        if (!string.IsNullOrWhiteSpace(expectedExtension) &&
            string.IsNullOrWhiteSpace(Path.GetExtension(reference)))
            reference += expectedExtension;

        if (reference.StartsWith("BUILT-IN/", StringComparison.OrdinalIgnoreCase))
            return ResolveBuiltInAssetReference(reference, teardownModRootPath);

        if (reference.StartsWith("MOD/", StringComparison.OrdinalIgnoreCase))
            return CombineAssetPath(teardownModRootPath, reference.Substring(4));

        if (reference.StartsWith("Assets/", StringComparison.Ordinal))
            return reference;

        if (Path.IsPathRooted(reference))
            return NormalizeAssetPath(reference);

        var currentFolder = NormalizeAssetPath(Path.GetDirectoryName(currentXmlPath));
        return CombineAssetPath(currentFolder, reference);
    }

    private static string ResolveBuiltInAssetReference(string reference, string teardownModRootPath)
    {
        var relativeBuiltInPath = NormalizeAssetPath(reference)
            .Substring("BUILT-IN/".Length)
            .TrimStart('/');
        var localAssetPath = CombineAssetPath(
            CombineAssetPath(teardownModRootPath, BuiltInAssetFolderName),
            relativeBuiltInPath);

        if (File.Exists(ToAbsolutePath(localAssetPath)))
            return localAssetPath;

        var absoluteBuiltInPath = TryResolveTeardownBuiltInAbsolutePath(relativeBuiltInPath);
        if (string.IsNullOrWhiteSpace(absoluteBuiltInPath))
            return localAssetPath;

        EnsureAssetFolder(Path.GetDirectoryName(localAssetPath));
        File.Copy(absoluteBuiltInPath, ToAbsolutePath(localAssetPath), true);
        AssetDatabase.ImportAsset(localAssetPath, ImportAssetOptions.ForceUpdate);
        return localAssetPath;
    }

    internal static string TryResolveTeardownBuiltInAbsolutePath(string relativeBuiltInPath)
    {
        relativeBuiltInPath = NormalizeAssetPath(relativeBuiltInPath).TrimStart('/');
        if (string.IsNullOrWhiteSpace(relativeBuiltInPath))
            return "";

        foreach (var root in GetTeardownBuiltInRoots())
        {
            var candidate = Path.Combine(root, relativeBuiltInPath).Replace('\\', '/');
            if (File.Exists(candidate))
                return candidate;
        }

        return "";
    }

    private static IEnumerable<string> GetTeardownBuiltInRoots()
    {
        yield return "C:/Program Files (x86)/Steam/steamapps/common/Teardown/data/built-in";
        yield return "C:/Program Files/Steam/steamapps/common/Teardown/data/built-in";

        var steamPath = Environment.GetEnvironmentVariable("STEAM");
        if (!string.IsNullOrWhiteSpace(steamPath))
            yield return NormalizeAssetPath(Path.Combine(steamPath, "steamapps/common/Teardown/data/built-in"));

        var steamLibrary = Environment.GetEnvironmentVariable("STEAMLIBRARY");
        if (!string.IsNullOrWhiteSpace(steamLibrary))
            yield return NormalizeAssetPath(Path.Combine(steamLibrary, "steamapps/common/Teardown/data/built-in"));
    }

    private static string NormalizeAssetPath(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return "";

        path = path.Replace('\\', '/').Trim();
        if (Path.IsPathRooted(path))
        {
            var dataPath = Application.dataPath.Replace('\\', '/');
            if (path.StartsWith(dataPath, StringComparison.OrdinalIgnoreCase))
                return "Assets" + path.Substring(dataPath.Length);

            var projectRoot = Directory.GetParent(Application.dataPath).FullName.Replace('\\', '/');
            if (path.StartsWith(projectRoot, StringComparison.OrdinalIgnoreCase))
                return path.Substring(projectRoot.Length).TrimStart('/');
        }

        return path;
    }

    private static string ToAbsolutePath(string assetPath)
    {
        assetPath = NormalizeAssetPath(assetPath);
        if (!assetPath.StartsWith("Assets/", StringComparison.Ordinal))
            return assetPath;

        return Path.Combine(Application.dataPath, assetPath.Substring("Assets/".Length)).Replace('\\', '/');
    }

    private static string CombineAssetPath(string left, string right)
    {
        return NormalizeAssetPath(Path.Combine(left ?? "", right ?? ""));
    }

    private static void EnsureAssetFolder(string assetFolder)
    {
        assetFolder = NormalizeAssetPath(assetFolder);
        if (string.IsNullOrWhiteSpace(assetFolder) || AssetDatabase.IsValidFolder(assetFolder))
            return;

        var parent = NormalizeAssetPath(Path.GetDirectoryName(assetFolder));
        if (!AssetDatabase.IsValidFolder(parent))
            EnsureAssetFolder(parent);

        AssetDatabase.CreateFolder(parent, Path.GetFileName(assetFolder));
    }

    private static int GetLayer(string layerName, int fallback)
    {
        var layer = LayerMask.NameToLayer(layerName);
        return layer >= 0 ? layer : fallback;
    }

    private static string SanitizeObjectName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "Unnamed";

        return name.Replace("/", "_").Replace("\\", "_").Trim();
    }

    private static string SanitizeAssetFileName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "Unnamed";

        var invalid = new HashSet<char>(Path.GetInvalidFileNameChars());
        var chars = name
            .Trim()
            .Select(c => invalid.Contains(c) || char.IsWhiteSpace(c) ? '_' : c)
            .ToArray();
        var result = new string(chars).Trim('_');
        return string.IsNullOrWhiteSpace(result) ? "Unnamed" : result;
    }

    internal static IReadOnlyList<string> GetSourceObjectLookupNameCandidates(string objectName)
    {
        var candidates = new List<string>();
        AddLookupNameCandidate(candidates, objectName);
        AddLookupNameCandidate(candidates, SanitizeAssetFileName(objectName));
        AddLookupNameCandidate(candidates, NormalizeTeardownObjectNameForConvertedPrefab(objectName));
        return candidates;
    }

    private static string NormalizeTeardownObjectNameForConvertedPrefab(string objectName)
    {
        if (string.IsNullOrWhiteSpace(objectName))
            return "";

        var invalid = new HashSet<char>(Path.GetInvalidFileNameChars());
        invalid.Add(':');
        invalid.Add('/');
        invalid.Add('\\');

        var chars = objectName
            .Trim()
            .Select(c => invalid.Contains(c) || char.IsWhiteSpace(c) ? '_' : c)
            .ToArray();
        var result = new string(chars).Trim('_');
        return string.IsNullOrWhiteSpace(result) ? "" : result;
    }

    private static void AddLookupNameCandidate(List<string> candidates, string candidate)
    {
        if (string.IsNullOrWhiteSpace(candidate))
            return;

        candidate = candidate.Trim();
        if (!candidates.Contains(candidate, StringComparer.OrdinalIgnoreCase))
            candidates.Add(candidate);
    }

    private static string FormatFloatForAssetPath(float value)
    {
        return value.ToString("0.###", CultureInfo.InvariantCulture).Replace('.', 'p');
    }

    private static JointInfoData LoadDefaultJointData()
    {
        return AssetDatabase.LoadAssetAtPath<JointInfoData>(DefaultJointDataPath);
    }

    private static void SetSerializedObject(SerializedObject so, string propertyPath, Object value)
    {
        var prop = so.FindProperty(propertyPath);
        if (prop != null)
            prop.objectReferenceValue = value;
    }

    private static void SetSerializedBool(SerializedObject so, string propertyPath, bool value)
    {
        var prop = so.FindProperty(propertyPath);
        if (prop != null)
            prop.boolValue = value;
    }

    private static void SetSerializedFloat(SerializedObject so, string propertyPath, float value)
    {
        var prop = so.FindProperty(propertyPath);
        if (prop != null)
            prop.floatValue = value;
    }

    [Serializable]
    public class ImportOptions
    {
        public string OutputPrefabPath;
        public string TeardownModRootPath;
        public string DependencyDataFolderPath;
        public string DependencyPrefabFolderPath;
        public string SceneName;
        public bool UpdateManifest = true;
        public bool ConvertVoxDependencies = true;
        public bool RemapTeardownMaterialIds = true;
        public bool GenerateHeightmapVoxscripts = true;
        public bool OverwriteExistingPrefab = true;
        public bool OverwriteExistingDependencies = true;
        public bool SetRuntimeLayers = true;
        public bool RebasePrefabRoots = true;
        public float ElementScale = DefaultElementScale;
        public float BrushVoxBoxVoxelSize = DefaultBrushVoxBoxVoxelSize;
        public int HeightmapMaxSamples = DefaultHeightmapMaxSamples;

        public float ElementScaleOrDefault()
        {
            return ElementScale <= 0f ? DefaultElementScale : ElementScale;
        }

        public float BrushVoxBoxVoxelSizeOrDefault()
        {
            return Mathf.Max(
                ElementScaleOrDefault(),
                BrushVoxBoxVoxelSize <= 0f ? DefaultBrushVoxBoxVoxelSize : BrushVoxBoxVoxelSize);
        }
    }

    [Serializable]
    public class ImportReport
    {
        public string XmlPath = "";
        public string OutputPrefabPath = "";
        public string ModRootPath = "";
        public string TeardownModRootPath = "";
        public int XmlDependencyCount;
        public int VoxDependencyCount;
        public int ConvertedVoxelDependencyCount;
        public int ReusedVoxelDependencyCount;
        public int RemappedVoxelDataFileCount;
        public int RemappedVoxelPointCount;
        public int GeneratedVoxBoxDependencyCount;
        public int ReusedVoxBoxDependencyCount;
        public int GeneratedHeightmapDependencyCount;
        public int ReusedHeightmapDependencyCount;
        public int HeightmapVoxScriptCount;
        public int HeightmapTileInstanceCount;
        public int GroupCount;
        public int BodyCount;
        public int InstanceCount;
        public int VoxCount;
        public int VoxBoxCount;
        public int VoxagonCount;
        public int LightCount;
        public int SpawnPointCount;
        public int JointCount;
        public bool ManifestUpdated;
        public readonly List<string> MissingFiles = new List<string>();
        public readonly List<string> MissingObjects = new List<string>();
        public readonly List<string> Warnings = new List<string>();
        public readonly Dictionary<string, int> SkippedElements = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        public void AddMissingFile(string value)
        {
            if (!string.IsNullOrWhiteSpace(value) && !MissingFiles.Contains(value))
                MissingFiles.Add(value);
        }

        public void AddMissingObject(string value)
        {
            if (!string.IsNullOrWhiteSpace(value) && !MissingObjects.Contains(value))
                MissingObjects.Add(value);
        }

        public void AddWarning(string value)
        {
            if (!string.IsNullOrWhiteSpace(value) && !Warnings.Contains(value))
                Warnings.Add(value);
        }

        public void AddSkipped(string elementName)
        {
            if (string.IsNullOrWhiteSpace(elementName))
                return;

            SkippedElements.TryGetValue(elementName, out var count);
            SkippedElements[elementName] = count + 1;
        }

        public string ToLogString()
        {
            var skipped = SkippedElements.Count == 0
                ? "none"
                : string.Join(", ", SkippedElements.OrderBy(kvp => kvp.Key).Select(kvp => kvp.Key + "=" + kvp.Value));

            return string.Format(
                CultureInfo.InvariantCulture,
                "Imported {0} -> {1}\nXML dependencies: {2}, vox dependencies: {3}, converted vox: {4}, reused vox: {5}, remapped voxel data: {6} files/{7} points, baked voxbox: {8}, reused baked voxbox: {9}, generated heightmap: {10}, reused heightmap: {11}\nGroups: {12}, bodies: {13}, instances: {14}, vox: {15}, voxbox: {16}, voxagon: {17}, heightmap voxscripts: {18}, heightmap tiles: {19}, lights: {20}, spawnpoints: {21}, joints: {22}\nManifest updated: {23}, missing files: {24}, missing objects: {25}, skipped: {26}",
                XmlPath,
                OutputPrefabPath,
                XmlDependencyCount,
                VoxDependencyCount,
                ConvertedVoxelDependencyCount,
                ReusedVoxelDependencyCount,
                RemappedVoxelDataFileCount,
                RemappedVoxelPointCount,
                GeneratedVoxBoxDependencyCount,
                ReusedVoxBoxDependencyCount,
                GeneratedHeightmapDependencyCount,
                ReusedHeightmapDependencyCount,
                GroupCount,
                BodyCount,
                InstanceCount,
                VoxCount,
                VoxBoxCount,
                VoxagonCount,
                HeightmapVoxScriptCount,
                HeightmapTileInstanceCount,
                LightCount,
                SpawnPointCount,
                JointCount,
                ManifestUpdated,
                MissingFiles.Count,
                MissingObjects.Count,
                skipped);
        }
    }

    private sealed class DependencyGraph
    {
        public readonly string TeardownModRootPath;
        public readonly HashSet<string> XmlFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        public readonly HashSet<string> VoxFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        public DependencyGraph(string teardownModRootPath)
        {
            TeardownModRootPath = NormalizeAssetPath(teardownModRootPath);
        }
    }

    private struct VoxelBoundsInfo
    {
        public static readonly VoxelBoundsInfo Empty = new VoxelBoundsInfo(Vector3Int.zero, Vector3Int.zero, Vector3Int.zero, false);

        public readonly Vector3Int VolumeSize;
        public readonly Vector3Int OccupiedMin;
        public readonly Vector3Int OccupiedMax;
        public readonly bool HasOccupiedBounds;

        public VoxelBoundsInfo(Vector3Int volumeSize, Vector3Int occupiedMin, Vector3Int occupiedMax, bool hasOccupiedBounds)
        {
            VolumeSize = volumeSize;
            OccupiedMin = occupiedMin;
            OccupiedMax = occupiedMax;
            HasOccupiedBounds = hasOccupiedBounds;
        }

        public bool HasVolumeSize
        {
            get { return VolumeSize.x > 0 && VolumeSize.y > 0 && VolumeSize.z > 0; }
        }

        public Vector3Int PlacementSize
        {
            get
            {
                return HasOccupiedBounds
                    ? OccupiedMax - OccupiedMin + new Vector3Int(1, 1, 1)
                    : VolumeSize;
            }
        }
    }

    internal struct VoxBoxBakeResolution
    {
        public readonly Vector3Int RequestedSize;
        public readonly Vector3Int BakedSize;
        public readonly float VoxelSize;

        public VoxBoxBakeResolution(Vector3Int requestedSize, Vector3Int bakedSize, float voxelSize)
        {
            RequestedSize = requestedSize;
            BakedSize = bakedSize;
            VoxelSize = voxelSize;
        }
    }

    private struct PivotOffsetInfo
    {
        public readonly Vector3 WorldUnits;
        public readonly Vector3 ElementLocalVoxelUnits;

        public PivotOffsetInfo(Vector3 worldUnits, Vector3 elementLocalVoxelUnits)
        {
            WorldUnits = worldUnits;
            ElementLocalVoxelUnits = elementLocalVoxelUnits;
        }
    }

    private sealed class HeightmapVoxScriptDefinition
    {
        public string Name;
        public string ScriptPath;
        public string ImagePath;
        public string GrassImagePath;
        public int HeightScale;
        public int TileSize;
        public int MaxSamples;

        public string CacheKey
        {
            get
            {
                return NormalizeAssetPath(ScriptPath) + "::" +
                       NormalizeAssetPath(ImagePath) + "::" +
                       NormalizeAssetPath(GrassImagePath) + "::" +
                       HeightScale.ToString(CultureInfo.InvariantCulture) + "::" +
                       TileSize.ToString(CultureInfo.InvariantCulture) + "::" +
                       MaxSamples.ToString(CultureInfo.InvariantCulture);
            }
        }
    }

    private struct HeightmapTextureData
    {
        public Color32[] Pixels;
        public Vector2Int SourceSize;
        public Color32[] GrassPixels;
        public Vector2Int GrassSize;
        public Vector2Int OutputSize;
        public float VoxelScale;
        public int EffectiveHeightScale;
    }

    private struct HeightmapTileSpec
    {
        public Vector2Int Origin;
        public Vector2Int Size;
    }

    internal enum GeneratedVoxelRuntimeKind
    {
        HeightmapTerrain,
        ProceduralBuildingElement,
        SceneStatic,
        SceneDynamic,
        SceneStrongConnected,
        SceneWeakConnected
    }

    private struct BottomLayerFootprint
    {
        public static readonly BottomLayerFootprint Empty = new BottomLayerFootprint(0, -1, 0, 0, -1);

        public readonly int MinX;
        public readonly int MaxX;
        public readonly int BottomY;
        public readonly int MinZ;
        public readonly int MaxZ;

        public BottomLayerFootprint(int minX, int maxX, int bottomY, int minZ, int maxZ)
        {
            MinX = minX;
            MaxX = maxX;
            BottomY = bottomY;
            MinZ = minZ;
            MaxZ = maxZ;
        }

        public float CenterX => MinX + SizeX * 0.5f;
        public float CenterZ => MinZ + SizeZ * 0.5f;
        public float SizeX => MaxX - MinX + 1f;
        public float SizeZ => MaxZ - MinZ + 1f;
    }

    private sealed class HeightmapTileAsset
    {
        public string Name;
        public GameObject Prefab;
        public Vector2Int TileOrigin;
        public Vector2Int TileSize;
        public float VoxelScale;
    }

    private enum ProceduralVoxelKind
    {
        SolidBox,
        WindowFrame,
        DoorFrame,
        Walls,
        PolygonPrism
    }

    private sealed class ProceduralVoxelDefinition
    {
        public ProceduralVoxelKind Kind;
        public string Name;
        public string Category;
        public string AssetName;
        public string CacheKey;
        public Vector3Int Size;
        public int FrameThickness;
        public int VerticalDividers;
        public int DividerThickness;
        public int WallThickness;
        public byte PrimaryMaterialId;
        public Color32 PrimaryColor;
        public byte SecondaryMaterialId;
        public Color32 SecondaryColor;
        public Vector2[] PolygonVertices;

        public static ProceduralVoxelDefinition CreateSolidBox(
            string name,
            Vector3Int size,
            byte materialId,
            Color32 color)
        {
            var assetName = "box_" + FormatVector3Int(size) +
                            "_m" + materialId.ToString(CultureInfo.InvariantCulture) +
                            "_c" + FormatColorForAssetPath(color);
            return CreateBase(
                ProceduralVoxelKind.SolidBox,
                name,
                "SolidBox",
                assetName,
                size,
                0,
                0,
                0,
                materialId,
                color,
                0,
                default(Color32));
        }

        public static ProceduralVoxelDefinition CreateWindowFrame(
            string name,
            Vector3Int size,
            int frameThickness,
            int verticalDividers,
            int dividerThickness,
            byte frameMaterialId,
            Color32 frameColor,
            byte glassMaterialId,
            Color32 glassColor)
        {
            var assetName = "window_" + FormatVector3Int(size) +
                            "_ft" + frameThickness.ToString(CultureInfo.InvariantCulture) +
                            "_vd" + verticalDividers.ToString(CultureInfo.InvariantCulture) +
                            "_dt" + dividerThickness.ToString(CultureInfo.InvariantCulture) +
                            "_fm" + frameMaterialId.ToString(CultureInfo.InvariantCulture) +
                            "_fc" + FormatColorForAssetPath(frameColor) +
                            "_gm" + glassMaterialId.ToString(CultureInfo.InvariantCulture) +
                            "_gc" + FormatColorForAssetPath(glassColor);
            return CreateBase(
                ProceduralVoxelKind.WindowFrame,
                name,
                "VoxScriptWindow",
                assetName,
                size,
                frameThickness,
                verticalDividers,
                dividerThickness,
                frameMaterialId,
                frameColor,
                glassMaterialId,
                glassColor);
        }

        public static ProceduralVoxelDefinition CreateDoorFrame(
            string name,
            Vector3Int size,
            int frameThickness,
            byte frameMaterialId,
            Color32 frameColor)
        {
            var assetName = "doorframe_" + FormatVector3Int(size) +
                            "_ft" + frameThickness.ToString(CultureInfo.InvariantCulture) +
                            "_fm" + frameMaterialId.ToString(CultureInfo.InvariantCulture) +
                            "_fc" + FormatColorForAssetPath(frameColor);
            return CreateBase(
                ProceduralVoxelKind.DoorFrame,
                name,
                "VoxScriptDoorFrame",
                assetName,
                size,
                frameThickness,
                0,
                0,
                frameMaterialId,
                frameColor,
                0,
                default(Color32));
        }

        public static ProceduralVoxelDefinition CreateWalls(
            string name,
            Vector3Int size,
            int wallThickness,
            byte materialId,
            Color32 color,
            string sourceReference)
        {
            var sourceKey = StableHexHash(NormalizeAssetPath(sourceReference));
            var assetName = "walls_" + FormatVector3Int(size) +
                            "_t" + wallThickness.ToString(CultureInfo.InvariantCulture) +
                            "_m" + materialId.ToString(CultureInfo.InvariantCulture) +
                            "_c" + FormatColorForAssetPath(color) +
                            "_" + sourceKey;
            var definition = CreateBase(
                ProceduralVoxelKind.Walls,
                name,
                "VoxScriptWalls",
                assetName,
                size,
                0,
                0,
                0,
                materialId,
                color,
                0,
                default(Color32));
            definition.WallThickness = Mathf.Max(1, wallThickness);
            definition.CacheKey += "::" + NormalizeAssetPath(sourceReference);
            return definition;
        }

        public static ProceduralVoxelDefinition CreatePolygonPrism(
            string name,
            Vector3Int size,
            Vector2[] polygonVertices,
            byte materialId,
            Color32 color,
            int extrude)
        {
            var shapeKey = string.Join(
                ";",
                (polygonVertices ?? Array.Empty<Vector2>())
                .Select(vertex =>
                    vertex.x.ToString("0.###", CultureInfo.InvariantCulture) + "," +
                    vertex.y.ToString("0.###", CultureInfo.InvariantCulture)));
            var hash = StableHexHash(
                FormatVector3Int(size) + "|" +
                extrude.ToString(CultureInfo.InvariantCulture) + "|" +
                materialId.ToString(CultureInfo.InvariantCulture) + "|" +
                FormatColorForAssetPath(color) + "|" +
                shapeKey);
            var assetName = "voxagon_" + FormatVector3Int(size) +
                            "_e" + extrude.ToString(CultureInfo.InvariantCulture) +
                            "_m" + materialId.ToString(CultureInfo.InvariantCulture) +
                            "_c" + FormatColorForAssetPath(color) +
                            "_" + hash;
            var definition = CreateBase(
                ProceduralVoxelKind.PolygonPrism,
                name,
                "Voxagon",
                assetName,
                size,
                0,
                0,
                0,
                materialId,
                color,
                0,
                default(Color32));
            definition.PolygonVertices = polygonVertices ?? Array.Empty<Vector2>();
            definition.CacheKey += "::" + shapeKey;
            return definition;
        }

        private static ProceduralVoxelDefinition CreateBase(
            ProceduralVoxelKind kind,
            string name,
            string category,
            string assetName,
            Vector3Int size,
            int frameThickness,
            int verticalDividers,
            int dividerThickness,
            byte primaryMaterialId,
            Color32 primaryColor,
            byte secondaryMaterialId,
            Color32 secondaryColor)
        {
            var sanitizedAssetName = SanitizeAssetFileName(assetName);
            return new ProceduralVoxelDefinition
            {
                Kind = kind,
                Name = SanitizeObjectName(string.IsNullOrWhiteSpace(name) ? kind.ToString() : name),
                Category = SanitizeAssetFileName(category),
                AssetName = sanitizedAssetName,
                CacheKey = category + "::" + sanitizedAssetName,
                Size = MaxVector3Int(Vector3Int.one, size),
                FrameThickness = frameThickness,
                VerticalDividers = verticalDividers,
                DividerThickness = dividerThickness,
                PrimaryMaterialId = primaryMaterialId,
                PrimaryColor = primaryColor,
                SecondaryMaterialId = secondaryMaterialId,
                SecondaryColor = secondaryColor
            };
        }
    }

    private struct ProceduralVoxelPoint
    {
        public static readonly ProceduralVoxelPoint Empty = new ProceduralVoxelPoint();

        public bool IsOccupied;
        public Color32 Color;
        public byte MaterialId;

        public static ProceduralVoxelPoint Occupied(Color32 color, byte materialId)
        {
            return new ProceduralVoxelPoint
            {
                IsOccupied = true,
                Color = color,
                MaterialId = materialId
            };
        }
    }

    private struct VoxelBrushOverride
    {
        public bool HasMaterial;
        public byte MaterialId;
        public bool HasColor;
        public Color32 Color;

        public bool HasAny => HasMaterial || HasColor;

        public string ToCacheKey()
        {
            if (!HasAny)
                return "";

            return (HasMaterial ? "m" + MaterialId.ToString(CultureInfo.InvariantCulture) : "m") +
                   "_" +
                   (HasColor ? "c" + FormatColorForAssetPath(Color) : "c");
        }
    }

    private sealed class ImportContext
    {
        private readonly HashSet<string> activeXmlFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, GameObject> sourcePrefabByVoxPath = new Dictionary<string, GameObject>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, GameObject> sourceObjectByKey = new Dictionary<string, GameObject>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, GameObject> derivedVoxBoxObjectByKey = new Dictionary<string, GameObject>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, GameObject> proceduralVoxelObjectByKey = new Dictionary<string, GameObject>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, List<HeightmapTileAsset>> heightmapTileAssetsByKey = new Dictionary<string, List<HeightmapTileAsset>>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<TextAsset, VoxelBoundsInfo> voxelBoundsByAsset = new Dictionary<TextAsset, VoxelBoundsInfo>();

        public ImportContext(string xmlPath, string modRootPath, ImportOptions options, DependencyGraph graph, ImportReport report)
        {
            XmlPath = xmlPath;
            ModRootPath = modRootPath;
            Options = options;
            Graph = graph;
            Report = report;
        }

        public string XmlPath { get; }
        public string ModRootPath { get; }
        public ImportOptions Options { get; }
        public DependencyGraph Graph { get; }
        public ImportReport Report { get; }
        public Transform SpawnPoint { get; set; }

        public void PushXml(string xmlPath)
        {
            activeXmlFiles.Add(NormalizeAssetPath(xmlPath));
        }

        public void PopXml(string xmlPath)
        {
            activeXmlFiles.Remove(NormalizeAssetPath(xmlPath));
        }

        public bool IsXmlActive(string xmlPath)
        {
            return activeXmlFiles.Contains(NormalizeAssetPath(xmlPath));
        }

        public List<HeightmapTileAsset> ResolveHeightmapTileAssets(HeightmapVoxScriptDefinition definition)
        {
            var key = definition.CacheKey;
            if (heightmapTileAssetsByKey.TryGetValue(key, out var cached))
                return cached;

            var generated = CreateOrLoadHeightmapTileAssets(definition, this);
            heightmapTileAssetsByKey[key] = generated;
            return generated;
        }

        public GameObject ResolveProceduralVoxelObject(ProceduralVoxelDefinition definition)
        {
            if (definition == null)
                return null;

            var key = definition.CacheKey;
            if (proceduralVoxelObjectByKey.TryGetValue(key, out var cached))
                return cached;

            var generated = CreateOrLoadProceduralVoxelSourceObject(definition, this);
            proceduralVoxelObjectByKey[key] = generated;
            return generated;
        }

        public string ResolveXmlPath(string fileRef, string currentXmlPath)
        {
            return ResolveAssetReference(fileRef, currentXmlPath, Options.TeardownModRootPath, ".xml");
        }

        public string ResolveVoxPath(string fileRef, string currentXmlPath)
        {
            return ResolveAssetReference(fileRef, currentXmlPath, Options.TeardownModRootPath, ".vox");
        }

        public GameObject ResolveAnySourceObject(string fileRef, string currentXmlPath)
        {
            var voxPath = ResolveVoxPath(fileRef, currentXmlPath);
            if (string.IsNullOrWhiteSpace(voxPath))
                return null;

            var sourcePrefab = ResolveSourcePrefab(voxPath);
            if (sourcePrefab == null)
                return null;

            var fileBase = Path.GetFileNameWithoutExtension(voxPath);
            var named = sourcePrefab.GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(t => t != sourcePrefab.transform &&
                                     string.Equals(t.name, fileBase, StringComparison.OrdinalIgnoreCase));
            if (named != null)
                return named.gameObject;

            var proxy = sourcePrefab.GetComponentsInChildren<VoxelObjectProxy>(true).FirstOrDefault();
            return proxy != null ? proxy.gameObject : sourcePrefab;
        }

        public string GetTeardownRelativePath(string assetPath)
        {
            assetPath = NormalizeAssetPath(assetPath);
            var root = NormalizeAssetPath(Options.TeardownModRootPath).TrimEnd('/') + "/";
            if (assetPath.StartsWith(root, StringComparison.OrdinalIgnoreCase))
                return assetPath.Substring(root.Length);

            return Path.GetFileName(assetPath);
        }

        public string GetConvertedPrefabPath(string voxAssetPath)
        {
            var relativePath = Path.ChangeExtension(GetTeardownRelativePath(voxAssetPath), ".prefab");
            return CombineAssetPath(Options.DependencyPrefabFolderPath, relativePath);
        }

        public GameObject ResolveSourceObject(string fileRef, string currentXmlPath, string objectName)
        {
            var voxPath = ResolveVoxPath(fileRef, currentXmlPath);
            if (string.IsNullOrWhiteSpace(voxPath) || string.IsNullOrWhiteSpace(objectName))
                return null;

            var key = voxPath + "::" + objectName;
            if (sourceObjectByKey.TryGetValue(key, out var cached))
                return cached;

            var sourcePrefab = ResolveSourcePrefab(voxPath);
            if (sourcePrefab == null)
                return null;

            var nameCandidates = GetSourceObjectLookupNameCandidates(objectName);
            var sourceObject = FindChildObjectByName(sourcePrefab, nameCandidates);

            if (sourceObject == null && nameCandidates.Any(name => string.Equals(sourcePrefab.name, name, StringComparison.OrdinalIgnoreCase)))
                sourceObject = sourcePrefab;

            if (sourceObject == null && IsGenericTeardownObjectName(objectName))
                sourceObject = ResolveDefaultSourceObject(sourcePrefab, voxPath);

            if (sourceObject == null)
                Report.AddMissingObject(voxPath + "::" + objectName);

            sourceObjectByKey[key] = sourceObject;
            return sourceObject;
        }

        private static GameObject FindChildObjectByName(GameObject sourcePrefab, IReadOnlyList<string> nameCandidates)
        {
            if (sourcePrefab == null || nameCandidates == null || nameCandidates.Count == 0)
                return null;

            var transforms = sourcePrefab.GetComponentsInChildren<Transform>(true);
            foreach (var name in nameCandidates)
            {
                var match = transforms.FirstOrDefault(t => t != sourcePrefab.transform &&
                                                           string.Equals(t.name, name, StringComparison.OrdinalIgnoreCase));
                if (match != null)
                    return match.gameObject;
            }

            return null;
        }

        public GameObject ResolveVoxBoxSourceObject(
            string fileRef,
            string currentXmlPath,
            string objectName,
            Vector3Int requestedSize,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride)
        {
            var voxPath = ResolveVoxPath(fileRef, currentXmlPath);
            if (string.IsNullOrWhiteSpace(voxPath) || string.IsNullOrWhiteSpace(objectName))
                return null;

            var sourceObject = ResolveSourceObject(fileRef, currentXmlPath, objectName);
            if (sourceObject == null)
                return null;

            var bakeResolution = GetBrushVoxBoxBakeResolution(
                requestedSize,
                Options.ElementScaleOrDefault(),
                Options.BrushVoxBoxVoxelSizeOrDefault());
            var key = GetDerivedVoxBoxKey(voxPath, objectName, bakeResolution, brushOffset, brushOverride);
            if (derivedVoxBoxObjectByKey.TryGetValue(key, out var cached))
                return cached;

            var derived = CreateOrLoadDerivedVoxBoxSourceObject(
                sourceObject,
                voxPath,
                objectName,
                requestedSize,
                brushOffset,
                brushOverride,
                this);
            derivedVoxBoxObjectByKey[key] = derived;
            return derived;
        }

        public string GetDerivedVoxBoxPrefabPath(
            string voxAssetPath,
            string objectName,
            VoxBoxBakeResolution bakeResolution,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride)
        {
            return GetDerivedVoxBoxAssetPath(
                Options.DependencyPrefabFolderPath,
                voxAssetPath,
                objectName,
                bakeResolution,
                brushOffset,
                brushOverride,
                ".prefab");
        }

        public string GetDerivedVoxBoxDataPath(
            string voxAssetPath,
            string objectName,
            VoxBoxBakeResolution bakeResolution,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride)
        {
            return GetDerivedVoxBoxAssetPath(
                Options.DependencyDataFolderPath,
                voxAssetPath,
                objectName,
                bakeResolution,
                brushOffset,
                brushOverride,
                ".txt");
        }

        public string GetProceduralVoxelPrefabPath(ProceduralVoxelDefinition definition)
        {
            return GetProceduralVoxelAssetPath(Options.DependencyPrefabFolderPath, definition, ".prefab");
        }

        public string GetProceduralVoxelDataPath(ProceduralVoxelDefinition definition)
        {
            return GetProceduralVoxelAssetPath(Options.DependencyDataFolderPath, definition, ".txt");
        }

        private static string GetProceduralVoxelAssetPath(
            string rootFolder,
            ProceduralVoxelDefinition definition,
            string extension)
        {
            var parentFolder = CombineAssetPath(
                CombineAssetPath(CombineAssetPath(rootFolder, DerivedVoxBoxFolderName), DerivedProceduralFolderName),
                definition.Category);
            return CombineAssetPath(parentFolder, definition.AssetName + extension);
        }

        private string GetDerivedVoxBoxAssetPath(
            string rootFolder,
            string voxAssetPath,
            string objectName,
            VoxBoxBakeResolution bakeResolution,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride,
            string extension)
        {
            var relativeSourcePath = NormalizeAssetPath(Path.ChangeExtension(GetTeardownRelativePath(voxAssetPath), null));
            if (string.IsNullOrWhiteSpace(relativeSourcePath))
                relativeSourcePath = SanitizeAssetFileName(Path.GetFileNameWithoutExtension(voxAssetPath));

            var objectFolder = SanitizeAssetFileName(objectName);
            var fileName = GetDerivedVoxBoxVariantName(objectName, bakeResolution, brushOffset, brushOverride) + extension;
            var sourceFolder = CombineAssetPath(CombineAssetPath(rootFolder, DerivedVoxBoxFolderName), relativeSourcePath);
            return CombineAssetPath(CombineAssetPath(sourceFolder, objectFolder), fileName);
        }

        private static string GetDerivedVoxBoxKey(
            string voxAssetPath,
            string objectName,
            VoxBoxBakeResolution bakeResolution,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride)
        {
            return NormalizeAssetPath(voxAssetPath) + "::" +
                   objectName + "::" +
                   FormatVector3Int(bakeResolution.RequestedSize) + "::" +
                   FormatVector3Int(bakeResolution.BakedSize) + "::" +
                   FormatFloatForAssetPath(bakeResolution.VoxelSize) + "::" +
                   FormatVector3Int(brushOffset) + "::" +
                   VoxBoxBakeVersion + "::" +
                   brushOverride.ToCacheKey();
        }

        private static string GetDerivedVoxBoxVariantName(
            string objectName,
            VoxBoxBakeResolution bakeResolution,
            Vector3Int brushOffset,
            VoxelBrushOverride brushOverride)
        {
            var variantName = SanitizeAssetFileName(objectName) +
                              "_" + FormatVector3Int(bakeResolution.RequestedSize) +
                              "_baked_" + FormatVector3Int(bakeResolution.BakedSize) +
                              "_voxelsize_" + FormatFloatForAssetPath(bakeResolution.VoxelSize) +
                              "_offset_" + FormatVector3Int(brushOffset) +
                              "_" + VoxBoxBakeVersion;
            var overrideKey = brushOverride.ToCacheKey();
            return string.IsNullOrWhiteSpace(overrideKey)
                ? variantName
                : variantName + "_" + overrideKey;
        }

        public bool TryGetVoxelBounds(TextAsset voxelFile, out VoxelBoundsInfo voxelBounds)
        {
            if (voxelFile == null)
            {
                voxelBounds = VoxelBoundsInfo.Empty;
                return false;
            }

            if (voxelBoundsByAsset.TryGetValue(voxelFile, out voxelBounds))
                return voxelBounds.HasVolumeSize;

            try
            {
                var saveData = DeserializeVoxelSaveData(voxelFile.bytes);
                if (TryGetVoxelBoundsFromSaveData(saveData, out voxelBounds))
                {
                    voxelBoundsByAsset[voxelFile] = voxelBounds;
                    return true;
                }
            }
            catch (Exception e)
            {
                var path = AssetDatabase.GetAssetPath(voxelFile);
                Report.AddWarning("Could not read voxel size from '" + path + "': " + e.Message);
            }

            voxelBounds = VoxelBoundsInfo.Empty;
            voxelBoundsByAsset[voxelFile] = voxelBounds;
            return false;
        }

        private GameObject ResolveSourcePrefab(string voxPath)
        {
            voxPath = NormalizeAssetPath(voxPath);
            if (sourcePrefabByVoxPath.TryGetValue(voxPath, out var cached))
                return cached;

            var prefabPath = GetConvertedPrefabPath(voxPath);
            var sourcePrefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (sourcePrefab == null)
            {
                var fileBase = Path.GetFileNameWithoutExtension(voxPath);
                var guids = AssetDatabase.FindAssets(fileBase + " t:prefab", new[] { Options.DependencyPrefabFolderPath, ModRootPath });
                foreach (var guid in guids)
                {
                    var path = AssetDatabase.GUIDToAssetPath(guid);
                    if (!Path.GetFileNameWithoutExtension(path).Equals(fileBase, StringComparison.OrdinalIgnoreCase))
                        continue;

                    sourcePrefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                    if (sourcePrefab != null)
                        break;
                }
            }

            if (sourcePrefab == null)
                Report.AddWarning("No converted prefab found for Teardown vox dependency '" + voxPath + "'. Expected " + prefabPath);

            sourcePrefabByVoxPath[voxPath] = sourcePrefab;
            return sourcePrefab;
        }

        private static bool IsGenericTeardownObjectName(string objectName)
        {
            return string.Equals(objectName, "Vox", StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(objectName, "VoxBox", StringComparison.OrdinalIgnoreCase);
        }

        private static GameObject ResolveDefaultSourceObject(GameObject sourcePrefab, string voxPath)
        {
            if (sourcePrefab == null)
                return null;

            var fileBase = Path.GetFileNameWithoutExtension(voxPath);
            var named = sourcePrefab.GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(t => t != sourcePrefab.transform &&
                                     string.Equals(t.name, fileBase, StringComparison.OrdinalIgnoreCase));
            if (named != null)
                return named.gameObject;

            var firstProxy = sourcePrefab.GetComponentsInChildren<VoxelObjectProxy>(true).FirstOrDefault();
            return firstProxy != null ? firstProxy.gameObject : sourcePrefab;
        }
    }

    private sealed class VoxelSaveDataBinder : SerializationBinder
    {
        public override Type BindToType(string assemblyName, string typeName)
        {
            if (typeName.EndsWith("VoxelVolumeSaveDataV2", StringComparison.Ordinal) ||
                typeName.Contains("ChunkBasedMarchingCubeSaveDataV2"))
                return typeof(VoxelVolumeSaveDataV2Surrogate);

            if (typeName == "Unity.Mathematics.int3" ||
                typeName.EndsWith(".int3", StringComparison.Ordinal))
                return typeof(Int3Surrogate);

            if (typeName.EndsWith("VoxelVolumeSaveData", StringComparison.Ordinal) ||
                typeName.Contains("ChunkBasedMarchingCubeSaveData"))
                return typeof(VoxelVolumeSaveDataSurrogate);

            return Type.GetType(typeName + ", " + assemblyName);
        }
    }

#pragma warning disable 0649
    [Serializable]
    internal sealed class VoxelVolumeSaveDataSurrogate
    {
        public int chunkCountX;
        public int chunkCountY;
        public int chunkCountZ;
        public int cubeCountPerAxisInAChunk;
        public byte[] cubeByteData;
    }

    [Serializable]
    internal sealed class VoxelVolumeSaveDataV2Surrogate
    {
        public Int3Surrogate chunkCount;
        public Int3Surrogate cubeCountPerAxisInAChunk;
        public int solidBlockCount;
        public Int3Surrogate[] chunkMins;
        public Int3Surrogate[] chunkMaxs;
        public byte[] cubeByteData;
    }

    [Serializable]
    internal struct Int3Surrogate
    {
        public int x;
        public int y;
        public int z;
    }
#pragma warning restore 0649
}
#endif
