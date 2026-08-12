using UnityEditor;
using UnityEngine;
using VoxelPlayground.Engine;
using VoxelPlayground.ModRuntime;

[CustomEditor(typeof(VoxelVolume)), CanEditMultipleObjects]
public class VoxelVolumeEditor : Editor
{

    public override void OnInspectorGUI()
    {
        // Update the serialized object
        serializedObject.Update();
        if(GUILayout.Button("Generate Preview Mesh"))
        {
            foreach (var target in targets)
            {
                VoxelVolume cmbc = (VoxelVolume)target;
                EditorVoxelPreviewMaterialUtility.DestroyPreviewMeshes(cmbc.transform);
                SimpleMeshCreator.CreateEditorMesh(cmbc);
                EditorVoxelPreviewMaterialUtility.Apply(cmbc.transform);
            }
        }
    }
}
