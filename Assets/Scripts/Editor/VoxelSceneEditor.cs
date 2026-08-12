using UnityEditor;
using UnityEditor.TerrainTools;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using UnityEngine;
using VoxelPlayground.Engine;
using VoxelPlayground.Level;
using VoxelPlayground.Mod;
using VoxelPlayground.ModRuntime;

[CustomEditor(typeof(VoxelScene))]
public class VoxelSceneEditor : Editor
{
    private const long RecommendedTriangleCount = 800_000;
    private const long RecommendedVoxelPointCount = 8_000_000;
    private const int RecommendedVoxelObjectProxyCount = 500;

    private static readonly Dictionary<TextAsset, VoxelPointCountCacheEntry> VoxelPointCountCache = new();

    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        var scene = target as VoxelScene;
        if (GUILayout.Button("Preview Voxel Objects"))
        {
            var result = RegeneratePreview(scene);
            Debug.Log("Voxel preview regenerated. " + result, scene);
        }

        DrawPreviewStats(scene);
    }

    public static PreviewResult RegeneratePreview(VoxelScene scene)
    {
        if (scene == null)
            return default;

        VoxelPointCountCache.Clear();
        var removed = EditorVoxelPreviewMaterialUtility.DestroyPreviewMeshes(scene.transform);
        var created = 0;
        var failed = 0;

        foreach (var obj in scene.GetComponentsInChildren<VoxelObjectProxy>(true))
        {
            if (obj == null || obj.voxelFile == null)
            {
                failed++;
                continue;
            }

            try
            {
                SimpleMeshCreator.CreateEditorMesh(obj.transform, obj.voxelFile);
                created++;
            }
            catch (System.Exception exception)
            {
                failed++;
                Debug.LogWarning("Failed to create voxel preview for " + obj.name + ": " + exception.Message, obj);
            }
        }

        var repaired = EditorVoxelPreviewMaterialUtility.Apply(scene.transform);
        return new PreviewResult
        {
            Removed = removed,
            Created = created,
            MaterialRepaired = repaired,
            Failed = failed
        };
    }

    private static void DrawPreviewStats(VoxelScene scene)
    {
        if (scene == null)
            return;

        var stats = CollectPreviewStats(scene);

        EditorGUILayout.Space(6);
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        EditorGUILayout.LabelField("Voxel Preview Stats", EditorStyles.boldLabel);
        DrawBudgetStat("Current Tris", stats.TriangleCount, RecommendedTriangleCount);
        DrawBudgetStat("Current Voxel Count", stats.VoxelPointCount, RecommendedVoxelPointCount);
        DrawBudgetStat("VoxelObjectProxy Count", stats.VoxelObjectProxyCount, RecommendedVoxelObjectProxyCount);

        if (stats.MissingVoxelFileCount > 0 || stats.UnreadableVoxelFileCount > 0)
        {
            EditorGUILayout.HelpBox(
                "Voxel stats skipped " + stats.MissingVoxelFileCount + " proxy/proxies with no voxel file and " +
                stats.UnreadableVoxelFileCount + " unreadable voxel file(s).",
                MessageType.Warning);
        }

        EditorGUILayout.EndVertical();
    }

    private static void DrawBudgetStat(string label, long current, long recommended)
    {
        bool exceeded = current > recommended;
        string status = exceeded
            ? "Exceeded by " + FormatCount(current - recommended) + ". Reduce."
            : "Within budget.";
        MessageType messageType = exceeded ? MessageType.Warning : MessageType.Info;
        EditorGUILayout.HelpBox(
            label + ": " + FormatCount(current) + " / " + FormatCount(recommended) + " recommended. " + status,
            messageType);
    }

    private static string FormatCount(long value)
    {
        return value.ToString("N0");
    }

    private static PreviewStats CollectPreviewStats(VoxelScene scene)
    {
        var stats = new PreviewStats();
        if (scene == null)
            return stats;

        stats.TriangleCount = CountPreviewTriangles(scene.transform);

        foreach (var proxy in scene.GetComponentsInChildren<VoxelObjectProxy>(true))
        {
            if (proxy == null)
                continue;

            stats.VoxelObjectProxyCount++;
            if (proxy.voxelFile == null)
            {
                stats.MissingVoxelFileCount++;
                continue;
            }

            if (TryGetVoxelPointCount(proxy.voxelFile, out long pointCount))
                stats.VoxelPointCount += pointCount;
            else
                stats.UnreadableVoxelFileCount++;
        }

        return stats;
    }

    private static long CountPreviewTriangles(Transform root)
    {
        if (root == null)
            return 0;

        long triangleCount = 0;
        foreach (var meshFilter in root.GetComponentsInChildren<MeshFilter>(true))
        {
            if (meshFilter == null || !IsPreviewTransformOrChild(meshFilter.transform))
                continue;

            Mesh mesh = meshFilter.sharedMesh;
            if (mesh == null)
                continue;

            for (int subMesh = 0; subMesh < mesh.subMeshCount; subMesh++)
            {
                if (mesh.GetTopology(subMesh) == MeshTopology.Triangles)
                    triangleCount += (long)mesh.GetIndexCount(subMesh) / 3;
            }
        }

        return triangleCount;
    }

    private static bool IsPreviewTransformOrChild(Transform transform)
    {
        while (transform != null)
        {
            if (transform.name == EditorVoxelPreviewMaterialUtility.PreviewRootName)
                return true;

            transform = transform.parent;
        }

        return false;
    }

    private static bool TryGetVoxelPointCount(TextAsset voxelFile, out long pointCount)
    {
        pointCount = 0;
        if (voxelFile == null)
            return false;

        byte[] bytes = voxelFile.bytes;
        if (bytes == null || bytes.Length == 0)
            return false;

        if (VoxelPointCountCache.TryGetValue(voxelFile, out var cached) && cached.ByteLength == bytes.Length)
        {
            pointCount = cached.PointCount;
            return cached.Readable;
        }

        bool readable = TryGetVoxelPointCount(bytes, out pointCount);
        VoxelPointCountCache[voxelFile] = new VoxelPointCountCacheEntry
        {
            ByteLength = bytes.Length,
            PointCount = pointCount,
            Readable = readable
        };
        return readable;
    }

    private static bool TryGetVoxelPointCount(byte[] bytes, out long pointCount)
    {
        pointCount = 0;
        try
        {
            object saveData = DeserializeVoxelSaveData(bytes);
            return TryGetVoxelPointCountFromSaveData(saveData, out pointCount);
        }
        catch
        {
            pointCount = 0;
            return false;
        }
    }

    private static object DeserializeVoxelSaveData(byte[] data)
    {
        var formatter = new BinaryFormatter { Binder = new VoxelSaveDataBinder() };
        using (var stream = new MemoryStream(data))
            return formatter.Deserialize(stream);
    }

    private static bool TryGetVoxelPointCountFromSaveData(object saveData, out long pointCount)
    {
        pointCount = 0;
        if (saveData is VoxelVolumeSaveDataV2Surrogate saveDataV2)
        {
            return TryGetVoxelPointCount(
                saveDataV2.chunkCount.x * saveDataV2.cubeCountPerAxisInAChunk.x,
                saveDataV2.chunkCount.y * saveDataV2.cubeCountPerAxisInAChunk.y,
                saveDataV2.chunkCount.z * saveDataV2.cubeCountPerAxisInAChunk.z,
                out pointCount);
        }

        if (saveData is VoxelVolumeSaveDataSurrogate saveDataV1)
        {
            return TryGetVoxelPointCount(
                saveDataV1.chunkCountX * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountY * saveDataV1.cubeCountPerAxisInAChunk,
                saveDataV1.chunkCountZ * saveDataV1.cubeCountPerAxisInAChunk,
                out pointCount);
        }

        return false;
    }

    private static bool TryGetVoxelPointCount(int numPointsX, int numPointsY, int numPointsZ, out long pointCount)
    {
        pointCount = 0;
        if (numPointsX <= 0 || numPointsY <= 0 || numPointsZ <= 0)
            return false;

        pointCount = (long)numPointsX * numPointsY * numPointsZ;
        return true;
    }

    public struct PreviewResult
    {
        public int Removed;
        public int Created;
        public int MaterialRepaired;
        public int Failed;

        public override string ToString()
        {
            return "Removed: " + Removed + ", created: " + Created + ", material repaired: " + MaterialRepaired + ", failed: " + Failed;
        }
    }

    private struct PreviewStats
    {
        public long TriangleCount;
        public long VoxelPointCount;
        public int VoxelObjectProxyCount;
        public int MissingVoxelFileCount;
        public int UnreadableVoxelFileCount;
    }

    private struct VoxelPointCountCacheEntry
    {
        public int ByteLength;
        public long PointCount;
        public bool Readable;
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
    private sealed class VoxelVolumeSaveDataSurrogate
    {
        public int chunkCountX;
        public int chunkCountY;
        public int chunkCountZ;
        public int cubeCountPerAxisInAChunk;
    }

    [Serializable]
    private sealed class VoxelVolumeSaveDataV2Surrogate
    {
        public Int3Surrogate chunkCount;
        public Int3Surrogate cubeCountPerAxisInAChunk;
    }

    [Serializable]
    private struct Int3Surrogate
    {
        public int x;
        public int y;
        public int z;
    }
#pragma warning restore 0649
}
