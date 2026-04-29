using UnityEditor;
using UnityEditor.TerrainTools;
using UnityEngine;
using VoxelPlayground.Engine;
using VoxelPlayground.Level;
using VoxelPlayground.Mod;
using VoxelPlayground.ModRuntime;

[CustomEditor(typeof(VoxelScene))]
public class VoxelSceneEditor : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        if (GUILayout.Button("Preview Voxel Objects"))
        {
            foreach (var obj in (target as VoxelScene).GetComponentsInChildren<VoxelObjectProxy>())
            {
                SimpleMeshCreator.CreateEditorMesh(obj.transform, obj.voxelFile);
            }
        }
    }
}