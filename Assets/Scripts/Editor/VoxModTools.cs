/*
#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using Unity.Collections;
using Unity.Collections.LowLevel.Unsafe;
using UnityEditor;
using UnityEngine;
using UnityEngine.Assertions;
using VoxReader;
using VoxReader.Interfaces;
using Color = UnityEngine.Color;
using Object = UnityEngine.Object;
using Vector3 = UnityEngine.Vector3;
using VoxelPlayground.Gaming;
using VoxelPlayground.Modding;
using VoxelPlayground.AnimatedVoxels;

// [System.Serializable]
// public class ChunkBasedMarchingCubeSaveData
// {
//     public int chunkCountX;
//     public int chunkCountY;
//     public int chunkCountZ;
//     public int cubeCountPerAxisInAChunk;
//     public byte[] cubeByteData;
// }
public class VoxModTools
{
        [MenuItem("Assets/Create/VoxelPlayground/Convert Scene .vox to .prefab")]
        private static void ConvertSceneVoxToPrefab()
        {
            Object[] selectedObjs = Selection.objects;

            foreach (var sel in selectedObjs)
            {
                Convert(AssetDatabase.GetAssetPath(sel));
            }
            
        }
        // [MenuItem("Assets/Create/VoxelPlayground/Convert Scene_Preview .vox to .prefab")]
        // private static void ConvertScenePreviewVoxToPrefab()
        // {
        //     Object[] selectedObjs = Selection.objects;

        //     foreach (var sel in selectedObjs)
        //     {
        //         Convert_Building(AssetDatabase.GetAssetPath(sel));
        //     }
        // }
        [MenuItem("Assets/Create/VoxelPlayground/Convert Building .vox to .prefab")]
        private static void ConvertBuildingVoxToPrefab()
        {
            Object[] selectedObjs = Selection.objects;

            foreach (var sel in selectedObjs)
            {
                Convert_Building(AssetDatabase.GetAssetPath(sel));
            }
        }
        public static void Convert(string voxFilepath)
        {            
            Assert.IsTrue(voxFilepath.EndsWith(".vox"));
            string sceneName = Path.GetFileNameWithoutExtension(voxFilepath);
            Debug.Log($"Converting {sceneName} ({voxFilepath})...");

            VoxReader.Interfaces.IVoxFile vox = VoxReader.VoxReader.Read(voxFilepath);

            GameObject prefab = PrefabUtility.LoadPrefabContents("Assets/Resources/VoxelSceneTemplate.prefab");
            GameObject associatedObjects = prefab.transform.Find("AssociatedObjects").gameObject;
            VoxelScene voxelScene = prefab.AddComponent<VoxelScene>();
            voxelScene.associatedVoxelDataTrans = associatedObjects.transform;

            GameObject template_Static = prefab.transform.Find("Presets/S_Static").gameObject;
            GameObject template_Destructible = prefab.transform.Find("Presets/D_Destructible").gameObject;
            GameObject template_AttachedDestructible = prefab.transform.Find("Presets/A_AttachedDestructible").gameObject;


            List<VoxObjProxy> voxelObjProxies = new();
            float largestVoxelModelVolume = 0; int floorIdx = 0;
            List<string> modelNames = new();
            int idx = 0;
            foreach (VoxReader.Interfaces.IModel voxModel in vox.Models)
            {
                
                string modelName = (voxModel.Name ?? "").Replace(" ", "_");
                string saveName = $"{sceneName}-{modelName}";  // WARNING: Don't use voxModel.ID, that won't match MagicaVoxel's export name
                
                if (modelName.Length == 0) {
                    Debug.LogError($"Model Name {modelName} is Blank");
                    continue;
                }
                modelNames.Add(modelName);

                // save .txt file
                ChunkBasedMarchingCubeSaveData saveData = LoadVoxModel(voxModel);
                string path = Save(saveData, saveName);
                Debug.Log($" - Exported {path}");

                GameObject newGameObject;
                if (modelName.StartsWith("S_"))  // Static
                    newGameObject = GameObject.Instantiate(template_Static,prefab.transform);
                else if (modelName.StartsWith("D_"))  // Destructible
                    newGameObject = GameObject.Instantiate(template_Destructible, associatedObjects.transform);
                else 
                    newGameObject = GameObject.Instantiate(template_AttachedDestructible, associatedObjects.transform);

                newGameObject.name = modelName;
                {
                    var trans = newGameObject.transform;
                    trans.rotation = Vox2Unity_Quat(voxModel.GlobalRotation);
                    
                    trans.position = Vox2Unity_Vec(voxModel.GlobalPosition) - (trans.rotation * Vox2Unity_Vec(voxModel.LocalSize)) / 2;
                    trans.position *= newGameObject.transform.lossyScale.x;
                }

                VoxObjProxy proxy = newGameObject.GetComponent<VoxObjProxy>();
                voxelObjProxies.Add(proxy);
                proxy.voxelModelName = saveName;

                var saveSystem = newGameObject.GetComponent<ChunkBasedMarchingCubeSaveSystem>();
                saveSystem.dataName = saveName;

                float modelVolume = voxModel.LocalSize.X * voxModel.LocalSize.Y * voxModel.LocalSize.Z;
                if (modelName.StartsWith("S_") && modelVolume > largestVoxelModelVolume)
                {
                    largestVoxelModelVolume = modelVolume;
                    floorIdx = idx;
                }
                    

                ++idx;
            }

            GameObject presets = prefab.transform.Find("Presets").gameObject;
            if (presets != null)
            {
                UnityEngine.Object.DestroyImmediate(presets);
            }

            // Automatticaly mark the largest model as floor
            voxelObjProxies[floorIdx].isFloor = true;

            // Recenter everything
            Vector3 a = voxelObjProxies[floorIdx].gameObject.transform.position;
            voxelObjProxies[floorIdx].gameObject.transform.localPosition = Vector3.zero;
            Vector3 b = voxelObjProxies[floorIdx].gameObject.transform.position;
            Vector3 diff = b - a;
            foreach (var proxy in voxelObjProxies)
            {
                if(proxy.isFloor) continue;
                proxy.gameObject.transform.position += diff;
            }
            voxelScene.gameObject.transform.position = Vector3.zero;

            




            string prefabPath = Path.Combine(Application.dataPath, "Build/Scenes/"+ sceneName + ".prefab");

            GameObject obj = PrefabUtility.SaveAsPrefabAssetAndConnect(prefab, 
                prefabPath,
                //$"Assets/Resources/VoxelScenes/{sceneName}.prefab", 
                InteractionMode.UserAction);
            EditorGUIUtility.PingObject(obj);

            AddToVoxelSceneDatas(voxFilepath, prefab);
        }




        public static void Convert_Building(string voxFilepath)
        {            
            Assert.IsTrue(voxFilepath.EndsWith(".vox"));
            string sceneName = Path.GetFileNameWithoutExtension(voxFilepath);
            Debug.Log($"Converting {sceneName} ({voxFilepath})...");

            VoxReader.Interfaces.IVoxFile vox = VoxReader.VoxReader.Read(voxFilepath);

            GameObject prefab = PrefabUtility.LoadPrefabContents("Assets/Resources/VoxelSceneTemplate.prefab");
            BuildingDestructionBuilder buildingDestructionBuilder = prefab.AddComponent<BuildingDestructionBuilder>();
            GameObject associatedObjects = prefab.transform.Find("AssociatedObjects").gameObject;
            if (associatedObjects != null)
            {
                UnityEngine.Object.DestroyImmediate(associatedObjects);
            }
            GameObject presets = prefab.transform.Find("Presets").gameObject;

            GameObject template_BuildingElement = prefab.transform.Find("Presets/B_BuildingElement").gameObject;


            List<VoxObjProxy> voxelObjProxies = new();

            List<string> modelNames = new();
            int idx = 0;
            foreach (VoxReader.Interfaces.IModel voxModel in vox.Models)
            {
                
                string modelName = (voxModel.Name ?? "").Replace(" ", "_");
                string saveName = $"{sceneName}-{modelName}";  // WARNING: Don't use voxModel.ID, that won't match MagicaVoxel's export name
                
                if (modelName.Length == 0) {
                    Debug.LogError($"Model Name {modelName} is Blank");
                    continue;
                }
                modelNames.Add(modelName);

                // save .txt file
                ChunkBasedMarchingCubeSaveData saveData = LoadVoxModel(voxModel);
                string path = Save(saveData, saveName);
                Debug.Log($" - Exported {path}");

                GameObject newGameObject;
                newGameObject = GameObject.Instantiate(template_BuildingElement,prefab.transform);


                newGameObject.name = modelName;
                {
                    var trans = newGameObject.transform;
                    trans.rotation = Vox2Unity_Quat(voxModel.GlobalRotation);
                    
                    trans.position = Vox2Unity_Vec(voxModel.GlobalPosition) - (trans.rotation * Vox2Unity_Vec(voxModel.LocalSize)) / 2;
                    trans.position *= newGameObject.transform.lossyScale.x;
                }

                VoxObjProxy proxy = newGameObject.GetComponent<VoxObjProxy>();
                voxelObjProxies.Add(proxy);
                proxy.voxelModelName = saveName;

                var saveSystem = newGameObject.GetComponent<ChunkBasedMarchingCubeSaveSystem>();
                saveSystem.dataName = saveName;

                // float modelVolume = voxModel.LocalSize.X * voxModel.LocalSize.Y * voxModel.LocalSize.Z;
                // if (modelName.StartsWith("S_") && modelVolume > largestVoxelModelVolume)
                // {
                //     largestVoxelModelVolume = modelVolume;
                //     floorIdx = idx;
                // }
                    

                ++idx;
            }
            if (presets != null)
            {
                UnityEngine.Object.DestroyImmediate(presets);
            }
            string prefabPath = Path.Combine(Application.dataPath, "Build/Buildings/"+ sceneName + ".prefab");

            GameObject obj = PrefabUtility.SaveAsPrefabAssetAndConnect(prefab, 
                prefabPath,
                //$"Assets/Resources/VoxelScenes/{sceneName}.prefab", 
                InteractionMode.UserAction);
            EditorGUIUtility.PingObject(obj);

            // var prefab = vox.ToPrefab();
            // AssetDatabase.CreateAsset(prefab, path.Replace(".vox", ".prefab"));
        }









































        // BE CAREFUL about Coordinate System. VoxReader use MagicaVoxel's Coordinate which is LeftHand Z-Up. while Unity is LeftHand Y-Up.
        // so Unity.XYZ = Vox.XZY
        public static Vector3Int Vox2Unity_Vec(VoxReader.Vector3 v) {
            return new(v.X, v.Z, v.Y);
        }
        public static Quaternion Vox2Unity_Quat(VoxReader.Matrix3 m) {
            // VoxReader.Vector3 row0 = new(m[0, 0], m[0, 1], m[0, 2]);
            // VoxReader.Vector3 row1 = new(m[1, 0], m[1, 1], m[1, 2]);
            // VoxReader.Vector3 row2 = new(m[2, 0], m[2, 1], m[2, 2]);
            VoxReader.Vector3 col0 = new(m[0, 0], m[1, 0], m[2, 0]);
            VoxReader.Vector3 col1 = new(m[0, 1], m[1, 1], m[2, 1]);
            VoxReader.Vector3 col2 = new(m[0, 2], m[1, 2], m[2, 2]);

            // Vector3 fw = new(col1.x, col2.y, col1.z);
            // Vector3 up = new(col2.x, col1.y, col2.z);

            var fw = Vox2Unity_Vec(col1);
            var up = Vox2Unity_Vec(col2);
            return Quaternion.LookRotation(fw, up);
        }

        public const uint DEFAULT_PROPERTIES = 
            3u |                
            (0u << 3) |         
            (0u << 6) |         
            (0u << 9) |         
            (0u << 12) |        
            (0u << 15) |        
            (1u << 18) |        
            (5u << 21) |        
            (1u << 24) |        
            (4u << 27);         


        [System.Serializable]
        public class BlockInfoListMod
        {
            public List<BlockInfoMod> blocks;
        }
        [System.Serializable]
        public class BlockInfoMod
        {
            public uint ID;
            public uint hardness;
        }
        public static BlockInfoListMod ReadBlockInfoJson()
        {
            string path = Path.Combine(Application.dataPath, "BlockInfoMods.json");
            
            if (!File.Exists(path))
            {
                Debug.LogError($"BlockInfo file not found at: {path}");
                return new BlockInfoListMod { blocks = new List<BlockInfoMod>() };
            }
            
            try
            {
                string jsonContent = File.ReadAllText(path);
                return JsonUtility.FromJson<BlockInfoListMod>(jsonContent);
            }
            catch (Exception ex)
            {
                Debug.LogError($"Error reading BlockInfo data: {ex.Message}");
                return new BlockInfoListMod { blocks = new List<BlockInfoMod>() };
            }
        }
        public static unsafe ChunkBasedMarchingCubeSaveData LoadVoxModel(IModel subModel, int chunkSize=16)
        {
            Vector3Int modelSize = Vox2Unity_Vec(subModel.LocalSize);
            int numChunksX = Mathf.CeilToInt((float)modelSize.x / chunkSize);
            int numChunksY = Mathf.CeilToInt((float)modelSize.y / chunkSize);
            int numChunksZ = Mathf.CeilToInt((float)modelSize.z / chunkSize);

            if(numChunksX == numChunksY && numChunksY == numChunksZ  && numChunksX == 1)
                chunkSize = Mathf.Max(modelSize.x,Mathf.Max(modelSize.y,modelSize.z));

            ChunkBasedMarchingCubeSaveData saveData = new ChunkBasedMarchingCubeSaveData {
                chunkCountX = numChunksX,
                chunkCountY = numChunksY,       
                chunkCountZ = numChunksZ,
                cubeCountPerAxisInAChunk = chunkSize
            };

            var numPointsX = saveData.chunkCountX * chunkSize;
            var numPointsY = saveData.chunkCountY * chunkSize;
            var numPointsZ = saveData.chunkCountZ * chunkSize;
            int allocateSize = (numPointsX +1) * (numPointsY +1) * (numPointsZ +1);
            NativeArray<PointData> nativeArray = new NativeArray<PointData>(allocateSize, Allocator.Temp);
            
            var nativeArrayPtr = (PointData*)nativeArray.GetUnsafePtr();

            BlockInfoListMod blockInfoListMod = ReadBlockInfoJson();

            foreach (Voxel v in subModel.Voxels)
            {
                // After starting from 0, the model is positioned at the bottom-left corner of all chunks. 
                // Offset it by a certain amount to place the model at the center of all chunks.

                var colorIndex = v.ColorIndex + 1;  // +1 Sync with Previous @ParseMagicaVoxelData.SetSavedata_vox()

                var localpos = Vox2Unity_Vec(v.LocalPosition);

                int index = localpos.z * saveData.chunkCountX * chunkSize * saveData.chunkCountY * chunkSize + 
                            localpos.y * saveData.chunkCountX * chunkSize +
                            localpos.x;

                var thisPointPtr = nativeArrayPtr + index;

                thisPointPtr->ID = (uint)Mathf.CeilToInt(colorIndex / 8.0f);
                thisPointPtr->Value = 1;
                thisPointPtr->Color = new Color(v.Color.R / 255.0f, v.Color.G / 255.0f, v.Color.B / 255.0f, v.Color.A / 255.0f);
                thisPointPtr->properties = DEFAULT_PROPERTIES;

                var blockInfo = blockInfoListMod.blocks.Find(b => b.ID == thisPointPtr->ID);
                if (blockInfo != null)
                {
                    thisPointPtr->SetNumber(PointData.Property.Hardness, blockInfo.hardness);
                }

            }
            
            byte[] dataArray = ToRawBytes(nativeArray);

            saveData.cubeByteData = dataArray;
            nativeArray.Dispose();

            return saveData;
        }

        public static byte[] ToRawBytes<T>(NativeArray<T> arr) where T : struct
        {
            var slice = new NativeSlice<T>(arr).SliceConvert<byte>();
            var bytes = new byte[slice.Length];
            slice.CopyTo(bytes);
            return bytes;
        }

        public static string Save(ChunkBasedMarchingCubeSaveData saveData, string name)
        {
            string modFilePath = Path.Combine(Application.dataPath, "Build/Data/"+ name + ".txt");
            string runfilePath = Path.Combine(Application.dataPath, "Resources/Data/"+ name + ".txt");

            BinaryFormatter formatter = new BinaryFormatter();
            using (FileStream fileStream = new FileStream(modFilePath, FileMode.Create))
            {
                formatter.Serialize(fileStream, saveData);
            }

            using (FileStream fileStream = new FileStream(runfilePath, FileMode.Create))
            {
                formatter.Serialize(fileStream, saveData);
            }

            AssetDatabase.Refresh();

            return modFilePath;
        }
        
        public static void AddToVoxelSceneDatas(string voxFilepath, GameObject prefab)
        {
            // Get scene name from file path
            string sceneName = Path.GetFileNameWithoutExtension(voxFilepath);
            
            // Find the VoxelSceneDatas asset
            VoxelSceneDatas sceneDataAsset = AssetDatabase.LoadAssetAtPath<VoxelSceneDatas>("Assets/Build/VoxelSceneDatas.asset");
            
            if (sceneDataAsset == null)
            {
                Debug.LogError("Could not find VoxelSceneDatas asset, please check the path");
                return;
            }
            
            // Get the prefab asset reference instead of the instance
            string prefabPath = $"Assets/Build/Scenes/{sceneName}.prefab";
            GameObject prefabAsset = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            
            if (prefabAsset == null)
            {
                Debug.LogError($"Could not find prefab asset at path: {prefabPath}");
                return;
            }
            
            // Check if a scene with the same name already exists
            VoxelSceneData existingData = sceneDataAsset.FindData(sceneName);
            if (existingData.sceneName == sceneName)
            {
                Debug.LogWarning($"Scene '{sceneName}' already exists in VoxelSceneDatas, updating existing data");
                
                // Find the index of the existing data
                int index = sceneDataAsset.sceneDatas.FindIndex(data => data.sceneName == sceneName);
                
                // Update the existing data
                VoxelSceneData updatedData = existingData;
                updatedData.prefab = prefabAsset; // Use the prefab asset reference
                updatedData.isModScene = true;
                
                // Update the data in the list
                sceneDataAsset.sceneDatas[index] = updatedData;
            }
            else
            {
                // Create new VoxelSceneData
                VoxelSceneData newSceneData = new VoxelSceneData
                {
                    sceneName = sceneName,
                    prefab = prefabAsset, // Use the prefab asset reference
                    //useShadow = true,
                    viewOffset = Vector3.zero,
                    sceneDescription = $"Mod scene: {sceneName}",
                    sceneConfigs = new string[0],
                    isModScene = true
                };
                
                // Add to the list
                sceneDataAsset.sceneDatas.Add(newSceneData);
            }
            
            // Save changes
            EditorUtility.SetDirty(sceneDataAsset);
            AssetDatabase.SaveAssets();
            
            Debug.Log($"Scene '{sceneName}' has been added/updated to VoxelSceneDatas");
        }
}
#endif
*/