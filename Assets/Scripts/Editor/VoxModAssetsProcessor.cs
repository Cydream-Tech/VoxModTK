#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;
using VoxelPlayground.Utility;
using VoxelPlayground.Gaming;
using VoxelPlayground.ModRuntime;
using VoxelPlayground.Mod;
public class VoxModAssetsProcessor : EditorWindow
{
    private List<string> selectedPaths = new List<string>();
    private GUIStyle fileNameStyle;
    private Vector2 scrollPosition;
    private ConvertType selectedConvertType = ConvertType.Scene;

    [MenuItem("Vox Mod Tools/Assets Processor")]
    public static void ShowWindow()
    {
        GetWindow<VoxModAssetsProcessor>("Vox Assets Processor");
    }

    private void OnGUI()
    {
        // 初始化样式
        if (fileNameStyle == null)
        {
            fileNameStyle = new GUIStyle(EditorStyles.boldLabel);
            fileNameStyle.normal.textColor = new Color(0.4f, 0.8f, 1f);
        }

        GUILayout.Label("Vox Assets Processor", EditorStyles.boldLabel);
        GUILayout.Space(10);

        // Drag and drop area
        Rect dropArea = GUILayoutUtility.GetRect(0.0f, 50.0f, GUILayout.ExpandWidth(true));
        GUI.Box(dropArea, "Drag and drop .vox files here");
        
        Event evt = Event.current;
        switch (evt.type)
        {
            case EventType.DragUpdated:
            case EventType.DragPerform:
                if (!dropArea.Contains(evt.mousePosition))
                    break;

                DragAndDrop.visualMode = DragAndDropVisualMode.Copy;

                if (evt.type == EventType.DragPerform)
                {
                    DragAndDrop.AcceptDrag();
                    foreach (string path in DragAndDrop.paths)
                    {
                        if (path.EndsWith(".vox", System.StringComparison.OrdinalIgnoreCase) && !selectedPaths.Contains(path))
                        {
                            selectedPaths.Add(path);
                        }
                    }
                }
                Event.current.Use();
                break;
        }

        GUILayout.Space(10);

        // Add file button
        if (GUILayout.Button("Add Files", GUILayout.Height(30)))
        {
            string[] paths = EditorUtility.OpenFilePanel("Select files", "", "").Split('\n');
            foreach (string path in paths)
            {
                if (!string.IsNullOrEmpty(path) && !selectedPaths.Contains(path))
                {
                    selectedPaths.Add(path);
                }
            }
        }

        GUILayout.Space(10);
        
        // 文件列表标题
        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("Selected Files:", EditorStyles.boldLabel);
        if (GUILayout.Button("Clear All", GUILayout.Width(100)))
        {
            selectedPaths.Clear();
        }
        EditorGUILayout.EndHorizontal();

        GUILayout.Space(5);

        // 文件列表滚动视图
        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition, GUILayout.Height(200));
        
        List<string> pathsToRemove = new List<string>();
        
        for (int i = 0; i < selectedPaths.Count; i++)
        {
            EditorGUILayout.BeginHorizontal("box");
            
            // 文件名
            string fileName = Path.GetFileName(selectedPaths[i]);
            EditorGUILayout.LabelField(fileName, fileNameStyle);
            
            // 删除按钮
            if (GUILayout.Button("×", GUILayout.Width(20)))
            {
                pathsToRemove.Add(selectedPaths[i]);
            }
            
            EditorGUILayout.EndHorizontal();
        }

        // 删除标记的文件
        foreach (string pathToRemove in pathsToRemove)
        {
            selectedPaths.Remove(pathToRemove);
        }

        EditorGUILayout.EndScrollView();

        if (selectedPaths.Count == 0)
        {
            EditorGUILayout.HelpBox("No files selected", MessageType.Info);
        }

        GUILayout.Space(20);


        // Convert buttons
        // Convert type selection
        selectedConvertType = (ConvertType)EditorGUILayout.EnumPopup(new GUIContent("Convert Type"), selectedConvertType);
        GUILayout.Space(5);

        GUI.enabled = selectedPaths.Count > 0;
        
        if (GUILayout.Button(new GUIContent("Convert", EditorGUIUtility.IconContent("Prefab Icon").image), GUILayout.Height(30)))
        {
            ConvertToPrefab(selectedConvertType);
        }

        GUILayout.Space(10);

        GUI.enabled = true;
    }

  
    private string GetBuildPath(string buildType)
    {
        // Application.dataPath 返回 "项目路径/Assets"
        string buildingPath = Path.Combine(Application.dataPath, "Build", buildType);
        
        // 确保目录存在
        if (!Directory.Exists(buildingPath))
        {
            Directory.CreateDirectory(buildingPath);
        }
        
        return buildingPath;
    }

    private void ConvertToPrefab(VoxelPlayground.ModRuntime.ConvertType convertType)
    {
        foreach (string path in selectedPaths)
        {
            Debug.Log($"Converting {path} to scene...");
            var assetDirectory = Path.GetDirectoryName(path);
            var prefabPath = Path.Combine(assetDirectory, "Prefab");
            var dataPath = Path.Combine(assetDirectory, "Data");
            ConverterSceneVoxToPrefab.ConvertInModTK(convertType, path, dataPath, prefabPath);
        }
    }

    public void MoveDebugData()
    {
        string resourcesDataPath = Path.Combine(Application.dataPath, "Resources", "Data");
        string buildDataPath = Path.Combine(Application.dataPath, "Build", "Data");

        Debug.Log($"Source path (Resources/Data): {resourcesDataPath}");
        Debug.Log($"Target path (Build/Data): {buildDataPath}");

        // 确保目标目录存在
        if (!Directory.Exists(buildDataPath))
        {
            Directory.CreateDirectory(buildDataPath);
        }

        // 如果源目录不存在，直接返回
        if (!Directory.Exists(resourcesDataPath))
        {
            Debug.LogWarning("Source directory (Resources/Data) does not exist!");
            return;
        }

        try
        {
            // 获取所有文件
            string[] files = Directory.GetFiles(resourcesDataPath, "*.*", SearchOption.AllDirectories);
            
            foreach (string file in files)
            {
                // 获取相对路径，用于在目标目录创建相同的目录结构
                string relativePath = file.Substring(resourcesDataPath.Length + 1);
                string targetPath = Path.Combine(buildDataPath, relativePath);
                
                // 确保目标文件的目录存在
                string targetDirectory = Path.GetDirectoryName(targetPath);
                if (!Directory.Exists(targetDirectory))
                {
                    Directory.CreateDirectory(targetDirectory);
                }
                
                // 复制文件，如果存在则覆盖
                File.Copy(file, targetPath, true);
                Debug.Log($"Copied: {relativePath}");
            }
            
            // 刷新Asset数据库以显示新文件
            AssetDatabase.Refresh();
            Debug.Log("All files copied successfully!");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Error copying files: {e.Message}");
        }
    }
}
#endif