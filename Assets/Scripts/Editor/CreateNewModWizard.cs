#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Mod;

public class CreateNewModWizard : EditorWindow
{
    private string author = "";
    private string modName = "";
    
    [MenuItem("Vox Mod Tools/New Mod Wizard", priority = 0)]
    public static void ShowWindow()
    {
        GetWindow<CreateNewModWizard>("New Mod Wizard");
    }

    private void OnGUI()
    {
        EditorGUILayout.LabelField("Create New Mod", EditorStyles.boldLabel);
        EditorGUILayout.Space(10);

        // Creator Name Input
        EditorGUILayout.LabelField("Creator Name:");
        author = EditorGUILayout.TextField(author);
        
        EditorGUILayout.Space(5);
        
        // Mod Name Input
        EditorGUILayout.LabelField("Mod Name:");
        modName = EditorGUILayout.TextField(modName);
        
        EditorGUILayout.Space(20);

        // Validation and Create Button
        bool canCreate = !string.IsNullOrEmpty(author) && !string.IsNullOrEmpty(modName);
        
        GUI.enabled = canCreate;
        if (GUILayout.Button("Create Mod", GUILayout.Height(30)))
        {
            CreateNewMod();
        }
        GUI.enabled = true;
        
        if (!canCreate)
        {
            EditorGUILayout.HelpBox("Please enter both Creator Name and Mod Name to continue.", MessageType.Info);
        }
    }

    private string GetModId(string author, string modName)
    {
        return $"com.{author}.{modName}".ToLower();
    }

    private void CreateNewMod()
    {
        string modIdentifier = GetModId(author, modName);
        string modRootPath = $"Assets/Mod/{modIdentifier}";

        try
        {
            // Create main mod directory
            if (!Directory.Exists(modRootPath))
            {
                Directory.CreateDirectory(modRootPath);
                Debug.Log($"Created mod directory: {modRootPath}");
            }
            else
            {
                EditorUtility.DisplayDialog("Mod Already Exists", $"A mod with the name '{modIdentifier}' already exists.", "OK");
                return;
            }

            // Create subdirectories
            string scriptsPath = Path.Combine(modRootPath, "Scripts");
            string prefabsPath = Path.Combine(modRootPath, "Prefab");
            string dataPath = Path.Combine(modRootPath, "Data");

            Directory.CreateDirectory(scriptsPath);
            Directory.CreateDirectory(prefabsPath);
            Directory.CreateDirectory(dataPath);

            Debug.Log($"Created subdirectories: Scripts, Prefab, Data");

            // Create tsconfig.json
            CreateTsConfig(modRootPath);

            // Create sample TypeScript files
            CreateSampleTypeScriptFiles(scriptsPath, modName);

            // Create ModManifest ScriptableObject
            CreateModManifest(modRootPath, author, modName);

            // Refresh AssetDatabase
            AssetDatabase.Refresh();

            EditorUtility.DisplayDialog("Mod Created Successfully", $"Mod '{modIdentifier}' has been created successfully!\n\nLocation: {modRootPath}", "OK");
            
            // Close the window
            Close();
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to create mod: {e.Message}");
            EditorUtility.DisplayDialog("Creation Failed", $"Failed to create mod: {e.Message}", "OK");
        }
    }

    private void CreateModManifest(string modRootPath, string author, string modName)
    {
        string manifestPath = Path.Combine(modRootPath, $"manifest.asset");
        
        // Create the ModManifest ScriptableObject
        ModManifestV2 manifest = ScriptableObject.CreateInstance<ModManifestV2>();
        
        // Set basic properties
        manifest.author = author;
        manifest.modName = modName;
        manifest.id = GetModId(author, modName);
        manifest.modVersion = new SemanticVersion{major = 1, minor = 0, patch = 0};
        manifest.minimalMainGameVersion = new SemanticVersion{major = 0, minor = 4, patch = 0};

        // Create the asset file
        AssetDatabase.CreateAsset(manifest, manifestPath);
        AssetDatabase.SaveAssets();
        
        Debug.Log($"Created ModManifest: {manifestPath}");
    }

    private void CreateTsConfig(string modRootPath)
    {
        string tsConfigPath = Path.Combine(modRootPath, "tsconfig.json");
        string tsConfigContent = @"{
  ""compilerOptions"": {
    ""target"": ""ES2016"",
    ""module"": ""ES2015"",
    ""outDir"": ""./out"",
    ""rootDir"": ""./Scripts"",
    ""strict"": true,
    ""esModuleInterop"": true,
    ""skipLibCheck"": true,
    ""typeRoots"": [
      ""../../Plugins/Core/Gen/Typing""
    ]
  },
  ""include"": [""Scripts/**/*.ts""],
  ""exclude"": [""Scripts/**/*.mjs"", ""out/**/*""]
}
";
        File.WriteAllText(tsConfigPath, tsConfigContent);
        Debug.Log($"Created tsconfig.json: {tsConfigPath}");
    }

    private void CreateSampleTypeScriptFiles(string scriptsPath, string modName)
    {
        // Capitalize first letter for class name
        string className = char.ToUpper(modName[0]) + modName.Substring(1);

        // Create sample component TypeScript file
        string componentFileName = $"{modName.ToLower()}.ts";
        string componentFilePath = Path.Combine(scriptsPath, componentFileName);
        string componentContent = $@"/**
 * {className} component implementation using JsComponentProxy.
 * This is a minimal example that demonstrates the basic pattern.
 */
export class {className} {{
    private bindTo: VX.Mod.JsComponentProxy;

    constructor(bindTo: VX.Mod.JsComponentProxy) {{
        CS.UnityEngine.Debug.Log(""{className} constructor"");
        this.bindTo = bindTo;

        // Bind update callback
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        CS.UnityEngine.Debug.Log(""{className} initialized"");
    }}

    private onUpdate(deltaTime: number): void {{
        // Add your update logic here
    }}
}}
";
        File.WriteAllText(componentFilePath, componentContent);
        Debug.Log($"Created sample component: {componentFilePath}");

        // Create index.ts that exports the component
        string indexPath = Path.Combine(scriptsPath, "index.ts");
        string indexContent = $@"export {{ {className} }} from './{modName.ToLower()}';
";
        File.WriteAllText(indexPath, indexContent);
        Debug.Log($"Created index.ts: {indexPath}");
    }
}
#endif