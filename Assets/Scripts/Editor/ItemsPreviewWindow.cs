
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Mod;
using VoxelPlayground.ModRuntime;

public class ItemsPreviewWindow : EditorWindow
{
    // JSON data structure
    [System.Serializable]
    public class ItemData
    {
        public string key;
        public string icon;
        public BuiltinEntityType type;
    }

    [System.Serializable]
    public class ItemList
    {
        public List<ItemData> items;
    }

    // Window properties
    private List<ItemData> itemsList = new List<ItemData>();
    private Vector2 scrollPosition;
    private string searchFilter = "";
    private Dictionary<string, Texture2D> iconCache = new Dictionary<string, Texture2D>();
    private GUIStyle buttonStyle;
    private float buttonSize = 100f;
    private float padding = 10f;

    // Categories for grouping
    private Dictionary<string, List<ItemData>> categorizedItems = new Dictionary<string, List<ItemData>>();
    private Dictionary<string, bool> categoryFoldouts = new Dictionary<string, bool>();

    [MenuItem("Vox Mod Tools/Builtin Entities Preview")]
    public static void ShowWindow()
    {
        ItemsPreviewWindow window = GetWindow<ItemsPreviewWindow>("Builtin Entities Preview");
        window.minSize = new Vector2(400, 300);
        window.LoadItems();
    }

    private void OnEnable()
    {
        LoadItems();
    }

    private void LoadItems()
    {
        var builtinKeys = BuiltinEntityInfo.KeyByType;
        itemsList.Clear();
        foreach (var kv in builtinKeys)
        {
            var type = kv.Key;
            var key = kv.Value;
            string icon = null;
            BuiltinEntityInfo.IconPathByType.TryGetValue(type, out icon);
            itemsList.Add(new ItemData { key = key, icon = icon, type = type });
        }
        itemsList.Sort((a, b) => string.Compare(a.key, b.key, System.StringComparison.Ordinal));
        CategorizeItems();
    }

    private void CategorizeItems()
    {
        categorizedItems.Clear();
        categoryFoldouts.Clear();

        foreach (var item in itemsList)
        {
            string category = "Uncategorized";
            string[] parts = item.key.Split('/');
            
            if (parts.Length > 1)
            {
                category = parts[0];
                if (parts.Length > 2)
                {
                    category += "/" + parts[1];
                }
            }

            if (!categorizedItems.ContainsKey(category))
            {
                categorizedItems[category] = new List<ItemData>();
                categoryFoldouts[category] = true; // Default to expanded
            }

            categorizedItems[category].Add(item);
        }
    }

    private void OnGUI()
    {
        // Initialize button style if needed
        if (buttonStyle == null)
        {
            buttonStyle = new GUIStyle(GUI.skin.button);
            buttonStyle.alignment = TextAnchor.LowerCenter;
            buttonStyle.imagePosition = ImagePosition.ImageAbove;
            buttonStyle.wordWrap = true;
        }

        // Search bar
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Search:", GUILayout.Width(50));
        string newSearch = EditorGUILayout.TextField(searchFilter);
        if (newSearch != searchFilter)
        {
            searchFilter = newSearch;
            Repaint();
        }
        
        if (GUILayout.Button("Refresh", GUILayout.Width(80)))
        {
            LoadItems();
            iconCache.Clear();
        }
        EditorGUILayout.EndHorizontal();

        // Button size slider
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Button Size:", GUILayout.Width(80));
        buttonSize = EditorGUILayout.Slider(buttonSize, 60f, 150f);
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.Space();

        // Begin scrollable area
        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

        // Display items by category
        foreach (var category in categorizedItems.Keys)
        {
            // Skip empty categories after filtering
            var itemsInCategory = categorizedItems[category];
            var filteredItems = itemsInCategory.FindAll(item => 
                string.IsNullOrEmpty(searchFilter) || 
                item.key.ToLower().Contains(searchFilter.ToLower()));
            
            if (filteredItems.Count == 0)
                continue;

            // Category foldout
            categoryFoldouts[category] = EditorGUILayout.Foldout(categoryFoldouts[category], category, true);
            
            if (categoryFoldouts[category])
            {
                // Calculate grid layout based on window width
                float windowWidth = position.width - 20; // Account for scroll bar
                int columns = Mathf.Max(1, Mathf.FloorToInt(windowWidth / (buttonSize + padding)));
                
                // Start grid
                int itemCount = 0;
                
                // Display items in this category
                foreach (var item in filteredItems)
                {
                    // Start a new row if needed
                    if (itemCount % columns == 0)
                    {
                        if (itemCount > 0)
                            EditorGUILayout.EndHorizontal();
                        EditorGUILayout.BeginHorizontal();
                    }

                    // Get icon
                    Texture2D icon = GetIconForItem(item);
                    
                    // Display button with icon and name
                    string displayName = GetDisplayName(item.key);
                    
                    if (GUILayout.Button(new GUIContent(displayName, icon), buttonStyle, 
                        GUILayout.Width(buttonSize), GUILayout.Height(buttonSize)))
                    {
                        SpawnItemInScene(item);
                    }
                    
                    itemCount++;
                }

                // Fill remaining columns with empty space to keep layout consistent
                int remainingColumns = columns - (itemCount % columns);
                if (remainingColumns < columns)
                {
                    for (int i = 0; i < remainingColumns; i++)
                    {
                        GUILayout.Space(buttonSize + padding);
                    }
                }

                // End the last horizontal group
                if (itemCount > 0)
                    EditorGUILayout.EndHorizontal();
                
                EditorGUILayout.Space(10);
            }
        }

        EditorGUILayout.EndScrollView();
    }

    private Texture2D GetIconForItem(ItemData item)
    {
        if (string.IsNullOrEmpty(item.icon))
            return null;
            
        // Check cache first
        if (iconCache.ContainsKey(item.icon))
            return iconCache[item.icon];
            
        // Try to find the icon in the project
        string[] guids = AssetDatabase.FindAssets(item.icon + " t:texture");
        if (guids.Length > 0)
        {
            string path = AssetDatabase.GUIDToAssetPath(guids[0]);
            Texture2D texture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
            if (texture != null)
            {
                iconCache[item.icon] = texture;
                return texture;
            }
        }
        
        // Try to find the icon in Resources folder
        Texture2D resourceTexture = Resources.Load<Texture2D>(item.icon);
        if (resourceTexture != null)
        {
            iconCache[item.icon] = resourceTexture;
            return resourceTexture;
        }
        
        return null;
    }


    private string GetDisplayName(string key)
    {
        // Extract the last part of the key as the display name
        string[] parts = key.Split('/');
        return parts[parts.Length - 1];
    }

    private void SpawnItemInScene(ItemData item)
    {
        // Create a new GameObject with the item's key as name
        GameObject newObject = new GameObject(item.type.ToString());

        BuiltinEntityProxy proxy = newObject.AddComponent<BuiltinEntityProxy>();
        proxy.type = item.type;

        SimpleMeshCreator.CreateEditorMesh(proxy);
        
        // Position it at the scene view camera position or at origin
        SceneView sceneView = SceneView.lastActiveSceneView;
        if (sceneView != null)
        {
            newObject.transform.position = sceneView.camera.transform.position + 
                                          sceneView.camera.transform.forward * 2f;
        }
        else
        {
            newObject.transform.position = Vector3.zero;
        }
        
        // Select the newly created object
        Selection.activeGameObject = newObject;
        
        // Focus on it in the scene view
        if (sceneView != null)
            sceneView.FrameSelected();
            
        Undo.RegisterCreatedObjectUndo(newObject, "Spawn Item");
        
        Debug.Log($"Spawned item: {item.key}");
    }
}
