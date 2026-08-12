#if UNITY_EDITOR
using System.Linq;
using UnityEditor;
using UnityEngine;

public static class EditorVoxelPreviewMaterialUtility
{
    public const string PreviewRootName = "EDITOR_DEMO_CHUNKSTRANSFORM";
    private static Material previewMaterial;

    public static int Apply(Transform root)
    {
        if (root == null)
            return 0;

        var repaired = 0;
        foreach (var renderer in root.GetComponentsInChildren<MeshRenderer>(true))
        {
            if (IsPreviewTransformOrChild(renderer.transform))
            {
                renderer.sharedMaterial = GetPreviewMaterial();
                repaired++;
            }
        }

        return repaired;
    }

    public static int ApplyAllLoadedPreviews()
    {
        var repaired = 0;
        foreach (var renderer in Resources.FindObjectsOfTypeAll<MeshRenderer>())
        {
            if (renderer == null || !renderer.gameObject.scene.IsValid())
                continue;

            if (IsPreviewTransformOrChild(renderer.transform))
            {
                renderer.sharedMaterial = GetPreviewMaterial();
                repaired++;
            }
        }

        return repaired;
    }

    public static int DestroyPreviewMeshes(Transform root)
    {
        if (root == null)
            return 0;

        var previews = root.GetComponentsInChildren<Transform>(true)
            .Where(transform => transform != root && transform.name == PreviewRootName)
            .Select(transform => transform.gameObject)
            .ToArray();

        foreach (var preview in previews)
            Object.DestroyImmediate(preview);

        return previews.Length;
    }

    public static int DestroyAllLoadedPreviewMeshes()
    {
        var previews = Resources.FindObjectsOfTypeAll<GameObject>()
            .Where(go => go != null && go.scene.IsValid() && go.name == PreviewRootName)
            .ToArray();

        foreach (var preview in previews)
            Object.DestroyImmediate(preview);

        return previews.Length;
    }

    public static Material GetPreviewMaterial()
    {
        if (previewMaterial != null)
            return previewMaterial;

        var shader = Shader.Find("Universal Render Pipeline/Particles/Unlit");
        if (shader == null)
            shader = Shader.Find("Universal Render Pipeline/Unlit");
        if (shader == null)
            shader = Shader.Find("Standard");

        previewMaterial = new Material(shader)
        {
            name = "Editor Voxel Preview Vertex Color",
            hideFlags = HideFlags.DontSave
        };
        if (previewMaterial.HasColor("_Color"))
            previewMaterial.SetColor("_Color", Color.white);
        if (previewMaterial.HasColor("_BaseColor"))
            previewMaterial.SetColor("_BaseColor", Color.white);

        return previewMaterial;
    }

    private static bool IsPreviewTransformOrChild(Transform transform)
    {
        while (transform != null)
        {
            if (transform.name == PreviewRootName)
                return true;
            transform = transform.parent;
        }

        return false;
    }
}
#endif
