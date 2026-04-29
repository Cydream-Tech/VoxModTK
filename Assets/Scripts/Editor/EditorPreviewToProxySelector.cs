#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Engine;
using VoxelPlayground.Entity;

[InitializeOnLoad]
public static class EditorPreviewToProxySelector
{
    private const string DemoChunksTransformName = "EDITOR_DEMO_CHUNKSTRANSFORM";

    static EditorPreviewToProxySelector()
    {
        Selection.selectionChanged -= OnSelectionChanged;
        Selection.selectionChanged += OnSelectionChanged;
    }

    private static void OnSelectionChanged()
    {
        var selected = Selection.gameObjects;
        if (selected == null || selected.Length == 0) return;

        var targets = new System.Collections.Generic.HashSet<GameObject>();
        bool selectionModified = false;

        foreach (var go in selected)
        {
            if (go == null) continue;

            var candidate = go;
            if (candidate.name == DemoChunksTransformName && candidate.transform.parent != null)
            {
                candidate = candidate.transform.parent.gameObject;
                selectionModified = true;
            }

            targets.Add(candidate);
        }

        if (!selectionModified) return;

        var result = new GameObject[targets.Count];
        targets.CopyTo(result);

        EditorApplication.delayCall += () =>
        {
            Selection.objects = result;
        };
    }
}
#endif
