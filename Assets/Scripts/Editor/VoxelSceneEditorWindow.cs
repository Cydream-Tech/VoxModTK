#define VOX_MOD_TOOLKIT
#if UNITY_EDITOR
using System.Collections.Generic;
#if !VOX_MOD_TOOLKIT
using System.IO;
#endif
using System.Linq;
#if !VOX_MOD_TOOLKIT
using Unity.Collections;
using Unity.Mathematics;
#endif
using UnityEditor;
using UnityEngine;
using VoxelPlayground.Destruction;
using VoxelPlayground.Engine;
using VoxelPlayground.Engine.Collision;
using VoxelPlayground.Entity;
using VoxelPlayground.Gaming;
using VoxelPlayground.Level;
using VoxelPlayground.Mod;
#if VOX_MOD_TOOLKIT
using VoxelPlayground.ModRuntime;
#endif
using VoxelPlayground.VFX;

#if USE_PX5
using Rigidbody = Px5.Unity.PxRigidBody;
#endif

public class VoxelSceneEditorWindow : EditorWindow
{
    private const float DefaultUnyieldingAreaSizeXZ = 5.0f;
    private const float DefaultUnyieldingAreaHeight = 2.0f;
    private const float SnapToWallMaxDistance = 1.5f;
    private const float SnapToWallMinForwardDistance = 0.02f;
#if VOX_MOD_TOOLKIT
    private static readonly string[] TabLabels = { "Type Switch", "Door Generator" };
#else
    private static readonly string[] TabLabels = { "Merge", "Type Switch", "Door Generator", "Seats", "Batch Select", "Settings" };
#endif
    private static readonly string[] TypeLabels = { "A  Static", "B  Dynamic", "C  StrongPin", "D  WeakPin" };
    private static readonly VoxelSceneTypeSwitch.VoxelSceneType[] TypeValues =
    {
        VoxelSceneTypeSwitch.VoxelSceneType.A_Static,
        VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic,
        VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected,
        VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected,
    };
    private static readonly string[] Prefixes = { "A_", "B_", "C_", "D_" };
#if VOX_MOD_TOOLKIT
    private static readonly Vector3[] ModTkAttachmentFaceVectors =
    {
        new(0f, 0.5f, 0f),
        new(0f, -0.5f, 0f),
        new(0.5f, 0f, 0f),
        new(-0.5f, 0f, 0f),
        new(0f, 0f, 0.5f),
        new(0f, 0f, -0.5f)
    };
#endif

    private readonly List<GameObject> roots = new();
    private int selectedTab;
    private string outputName = "MergedVoxel";
    private bool deleteOriginalRoots = true;
    private bool regeneratePreview = true;
    private string statusMessage;
    private Vector2 scroll;
    private readonly List<GameObject> typeSwitchTargets = new();
    private Vector2 typeSwitchScroll;
    private bool typeSwitchQuickMode;
    private JointInfoData doorJointData;
    private Vector3 doorAnchorWorld;
    private GameObject doorAnchorTarget;
    private bool hasDoorAnchorWorld;
    private bool pickingDoorAnchor;
    private bool doorGeneratorQuickMode;
    private readonly List<GameObject> batchDoors = new();
    private DoorHingeSide doorHingeSide = DoorHingeSide.Right;
    private Vector2 batchDoorScroll;
    private string batchSelectSearch = "door";
    private readonly List<GameObject> batchSelectResults = new();
    private Vector2 batchSelectScroll;
    private enum AttachmentFace
    {
        Up,
        Down,
        Right,
        Left,
        Front,
        Back
    }

    private enum DoorHingeSide
    {
        AutoClosestBuilding,
        Left,
        Right
    }

    private delegate bool GameObjectAdder(GameObject go);

#if !VOX_MOD_TOOLKIT
    private struct SourceVolume
    {
        public GameObject root;
        public VoxelVolume volume;
        public VoxelVolumeSaveSystem saveSystem;
        public VoxelVolumeInfo info;
        public VoxelSceneTypeSwitch.VoxelSceneType type;
    }
#endif

    private struct SolidVoxelInfo
    {
        public bool hasVoxels;
        public Vector3Int min;
        public Vector3Int max;
        public Vector3Int bottomVoxel;
        public List<Vector3Int> solidVoxels;
    }

    private struct SnapWallCandidate
    {
        public GameObject gameObject;
        public Transform transform;
        public Bounds bounds;
        public SolidVoxelInfo solidInfo;
    }

#if VOX_MOD_TOOLKIT
    [MenuItem("Vox Mod Tools/Voxel Scene Editor", priority = 101)]
#else
    [MenuItem("Tools/Voxel Ragdoll/Voxel Scene Editor")]
#endif
    public static void Open()
    {
        GetWindow<VoxelSceneEditorWindow>("Voxel Scene Editor");
    }

    private void OnGUI()
    {
#if !VOX_MOD_TOOLKIT
        CleanupMissingRoots();
#endif
        CleanupMissingTypeSwitchTargets();
        CleanupMissingBatchDoors();

        EditorGUILayout.LabelField("Voxel Scene Editor", EditorStyles.boldLabel);
        selectedTab = GUILayout.Toolbar(selectedTab, TabLabels);
        EditorGUILayout.Space(4);

#if VOX_MOD_TOOLKIT
        if (selectedTab == 0)
            DrawTypeSwitchTab();
        else if (selectedTab == 1)
            DrawDoorGeneratorTab();
#else
        if (selectedTab == 0)
            DrawMergeTab();
        else if (selectedTab == 1)
            DrawTypeSwitchTab();
        else if (selectedTab == 2)
            DrawDoorGeneratorTab();
        else if (selectedTab == 3)
            DrawSeatPointTab();
        else if (selectedTab == 4)
            DrawBatchSelectTab();
        else if (selectedTab == 5)
            DrawSettingsTab();
#endif
    }

    private void OnEnable()
    {
        SceneView.duringSceneGui += OnSceneGUI;
    }

    private void OnDisable()
    {
        SceneView.duringSceneGui -= OnSceneGUI;
    }

    private void OnSelectionChange()
    {
#if !VOX_MOD_TOOLKIT
        if (VoxelSceneEditorAutoPreview.Enabled && VoxelSceneEditorAutoPreview.TryCreatePreviewForSelection(out string autoPreviewStatus))
            statusMessage = autoPreviewStatus;
#endif

        if (doorGeneratorQuickMode && GetDoorGeneratorSingleTarget() != doorAnchorTarget)
            ClearDoorAnchor();

        Repaint();
    }

    private void OnSceneGUI(SceneView sceneView)
    {
#if VOX_MOD_TOOLKIT
        DrawModTkSelectedWeakPinDirections();
#endif

        if (!pickingDoorAnchor)
            return;

        Event evt = Event.current;
        int controlId = GUIUtility.GetControlID(FocusType.Passive);
        HandleUtility.AddDefaultControl(controlId);

        Handles.color = Color.cyan;
        if (HasDoorAnchorForCurrentTarget())
            Handles.SphereHandleCap(controlId, doorAnchorWorld, Quaternion.identity, HandleUtility.GetHandleSize(doorAnchorWorld) * 0.08f, EventType.Repaint);

        sceneView.ShowNotification(new GUIContent("Pick door hinge anchor. Left click to set, Esc/right click to cancel."));

        if ((evt.type == EventType.KeyDown && evt.keyCode == KeyCode.Escape) ||
            (evt.type == EventType.MouseDown && evt.button == 1))
        {
            pickingDoorAnchor = false;
            sceneView.RemoveNotification();
            evt.Use();
            Repaint();
            return;
        }

        if (evt.type != EventType.MouseDown || evt.button != 0)
            return;

        GameObject targetDoor = GetDoorGeneratorSingleTarget();
        if (targetDoor == null)
        {
            statusMessage = "List exactly one door before picking anchor.";
        }
        else if (doorJointData == null)
        {
            statusMessage = "Set Joint Data before picking anchor.";
        }
        else if (TryPickDoorAnchor(targetDoor, evt.mousePosition, out Vector3 hitPoint))
        {
            doorAnchorWorld = hitPoint;
            doorAnchorTarget = targetDoor;
            hasDoorAnchorWorld = true;
            ConfigureDoorAttachment();
        }
        else
        {
            statusMessage = "Door anchor pick missed the door mesh/collider.";
        }

        pickingDoorAnchor = false;
        sceneView.RemoveNotification();
        evt.Use();
        Repaint();
    }

#if VOX_MOD_TOOLKIT
    private static void DrawModTkSelectedWeakPinDirections()
    {
        Color previousColor = Handles.color;
        Handles.color = Color.yellow;

        foreach (GameObject voxelObject in GetSelectedVoxelObjects())
        {
            if (DetectType(voxelObject) != VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
                continue;

            foreach (AttachmentPoint point in voxelObject.GetComponentsInChildren<AttachmentPoint>(true))
            {
                if (point == null || !point.enabled || !point.showGiz || point.enabledDirs == null)
                    continue;

                float markerSize = HandleUtility.GetHandleSize(point.transform.position) * 0.08f;
                Handles.SphereHandleCap(0, point.transform.position, Quaternion.identity, markerSize, EventType.Repaint);
                Handles.Label(point.transform.position + Vector3.up * markerSize * 1.5f, point.name);

                int directionCount = Mathf.Min(point.enabledDirs.Length, ModTkAttachmentFaceVectors.Length);
                for (int i = 0; i < directionCount; i++)
                {
                    if (!point.enabledDirs[i])
                        continue;

                    Vector3 localDirection = ModTkAttachmentFaceVectors[i];
                    Vector3 worldPoint = point.transform.TransformPoint(localDirection);
                    Vector3 worldDirection = point.transform.TransformDirection(localDirection).normalized;
                    float arrowSize = HandleUtility.GetHandleSize(worldPoint) * 0.12f;
                    Handles.ArrowHandleCap(0, worldPoint, Quaternion.LookRotation(worldDirection), arrowSize, EventType.Repaint);
                    Handles.DrawLine(point.transform.position, worldPoint);
                }
            }
        }

        Handles.color = previousColor;
    }
#endif

#if !VOX_MOD_TOOLKIT
    private void DrawMergeTab()
    {
        EditorGUILayout.HelpBox(
            "Drag scene nodes here. The tool searches VoxelVolume children, merges their saved voxel data, creates one new VoxelVolume, then optionally deletes the original nodes.",
            MessageType.Info);

        if (!string.IsNullOrEmpty(statusMessage))
        {
            var statusStyle = new GUIStyle(EditorStyles.label)
            {
                wordWrap = true,
                fontStyle = FontStyle.Bold
            };
            statusStyle.normal.textColor = new Color(0.2f, 0.65f, 0.25f);
            EditorGUILayout.LabelField(statusMessage, statusStyle);
        }

        DrawTargetList(roots, ref scroll, "Drag scene GameObjects here", "Add Selected", AddRoot);

        outputName = EditorGUILayout.TextField("Output Data Name", outputName);
        deleteOriginalRoots = EditorGUILayout.Toggle("Delete Original Nodes", deleteOriginalRoots);
        regeneratePreview = EditorGUILayout.Toggle("Regenerate Preview", regeneratePreview);

        using (new EditorGUI.DisabledScope(roots.Count == 0))
        {
            if (GUILayout.Button("Merge", GUILayout.Height(32)))
                Merge();
        }
    }
#endif

    private void DrawTypeSwitchTab()
    {
        EditorGUILayout.HelpBox(
            "Add voxel objects to the list, then switch all listed voxels to the selected type. Quick Mode uses the current editor selection directly.",
            MessageType.Info);

        typeSwitchQuickMode = EditorGUILayout.Toggle("Quick Mode (Use Current Selection)", typeSwitchQuickMode);

        List<GameObject> activeTargets;
        if (typeSwitchQuickMode)
        {
            activeTargets = GetSelectedVoxelObjects();
            DrawReadonlyTargetList(activeTargets, ref typeSwitchScroll, "Current Selected Voxels");
        }
        else
        {
            DrawTargetList(typeSwitchTargets, ref typeSwitchScroll, "Drag VoxelVolume GameObjects here", "Add Selected Voxels", AddTypeSwitchTarget);
            activeTargets = typeSwitchTargets;
        }

        if (activeTargets.Count == 0)
        {
            EditorGUILayout.LabelField(typeSwitchQuickMode ? "Select one or more direct VoxelVolume objects in the editor." : "Add one or more direct VoxelVolume objects.");
            return;
        }

        VoxelSceneTypeSwitch.VoxelSceneType sharedType = GetSharedSelectedType(activeTargets);
        EditorGUILayout.LabelField("Voxel Count", activeTargets.Count.ToString());
        EditorGUILayout.LabelField("Current Type", GetTypeDisplayLabel(sharedType));
        EditorGUILayout.Space(4);

        EditorGUILayout.BeginHorizontal();
        for (int i = 0; i < TypeLabels.Length; i++)
        {
            bool isSharedActiveType = sharedType == TypeValues[i];
            string label = isSharedActiveType ? TypeLabels[i] + " *" : TypeLabels[i];
            if (GUILayout.Button(label, GUILayout.Height(30)))
            {
                SwitchSelectedVoxelsType(activeTargets, TypeValues[i], i);
                Repaint();
            }
        }
        EditorGUILayout.EndHorizontal();

        if (sharedType == VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected)
        {
            EditorGUILayout.Space(4);
            EditorGUILayout.HelpBox("Pin only works on the Building layer.", MessageType.Info);
            if (GUILayout.Button("Add 4 Corner Supports", GUILayout.Height(28)))
                AddCornerUnyieldingSupports(activeTargets);
        }

        if (sharedType == VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
        {
            EditorGUILayout.Space(4);
            EditorGUILayout.LabelField("Move AttachmentPoint To Solid Face Center", EditorStyles.boldLabel);
            EditorGUILayout.BeginHorizontal();
            DrawAttachmentFaceButton("Up", AttachmentFace.Up, activeTargets);
            DrawAttachmentFaceButton("Down", AttachmentFace.Down, activeTargets);
            DrawAttachmentFaceButton("Right", AttachmentFace.Right, activeTargets);
            DrawAttachmentFaceButton("Left", AttachmentFace.Left, activeTargets);
            DrawAttachmentFaceButton("Front", AttachmentFace.Front, activeTargets);
            DrawAttachmentFaceButton("Back", AttachmentFace.Back, activeTargets);
            EditorGUILayout.EndHorizontal();

            if (GUILayout.Button("Snap To Wall", GUILayout.Height(28)))
                SnapDTypeAttachmentPointsToWall(activeTargets);
        }
    }

    private void DrawAttachmentFaceButton(string label, AttachmentFace face, List<GameObject> targets)
    {
        if (GUILayout.Button(label, GUILayout.Height(26)))
            MoveDTypeAttachmentPointsToFace(targets, face);
    }

#if !VOX_MOD_TOOLKIT
    private void DrawSeatPointTab()
    {
        EditorGUILayout.HelpBox(
            "Select one or more VoxelVolume objects, then add a VoxelSitPoint child with an ApproachPoint child already linked.",
            MessageType.Info);

        List<GameObject> selectedVoxels = GetSelectedVoxelObjects();
        DrawReadonlyTargetList(selectedVoxels, ref typeSwitchScroll, "Current Selected Voxels");

        using (new EditorGUI.DisabledScope(selectedVoxels.Count == 0))
        {
            if (GUILayout.Button("Add VoxelSitPoint", GUILayout.Height(30)))
                AddSeatPointsToSelectedVoxels(selectedVoxels);
        }

        if (selectedVoxels.Count == 0)
            EditorGUILayout.LabelField("Select one or more direct VoxelVolume objects in the editor.");
    }

    private void AddSeatPointsToSelectedVoxels(List<GameObject> selectedVoxels)
    {
        int createdCount = 0;
        int reusedCount = 0;

        foreach (GameObject voxelObject in selectedVoxels)
        {
            if (voxelObject == null)
                continue;

            VoxelSitPoint sitPoint = GetOrCreateSitPoint(voxelObject, out bool createdSitPoint);
            Transform approachPoint = GetOrCreateApproachPoint(sitPoint.transform, out bool createdApproachPoint);
            BindSitPoint(sitPoint, voxelObject.GetComponent<VoxelVolume>(), approachPoint);

            if (createdSitPoint || createdApproachPoint)
                createdCount++;
            else
                reusedCount++;

            EditorUtility.SetDirty(sitPoint);
            EditorUtility.SetDirty(voxelObject);
        }

        statusMessage = $"Seat points processed. Created/updated: {createdCount}, reused existing: {reusedCount}.";
        SceneView.RepaintAll();
    }

    private static VoxelSitPoint GetOrCreateSitPoint(GameObject voxelObject, out bool created)
    {
        Transform existing = voxelObject.transform.Find("VoxelSitPoint");
        if (existing != null && existing.TryGetComponent(out VoxelSitPoint existingSitPoint))
        {
            created = false;
            return existingSitPoint;
        }

        GameObject sitPointObject = new GameObject(GameObjectUtility.GetUniqueNameForSibling(voxelObject.transform, "VoxelSitPoint"));
        Undo.RegisterCreatedObjectUndo(sitPointObject, "Create VoxelSitPoint");
        sitPointObject.transform.SetParent(voxelObject.transform, false);
        sitPointObject.transform.localPosition = Vector3.zero;
        sitPointObject.transform.localRotation = Quaternion.identity;
        sitPointObject.transform.localScale = Vector3.one;

        created = true;
        return Undo.AddComponent<VoxelSitPoint>(sitPointObject);
    }

    private static Transform GetOrCreateApproachPoint(Transform sitPointTransform, out bool created)
    {
        Transform existing = sitPointTransform.Find("ApproachPoint");
        if (existing != null)
        {
            created = false;
            return existing;
        }

        GameObject approachObject = new GameObject("ApproachPoint");
        Undo.RegisterCreatedObjectUndo(approachObject, "Create ApproachPoint");
        approachObject.transform.SetParent(sitPointTransform, false);
        approachObject.transform.localPosition = Vector3.forward * 0.5f;
        approachObject.transform.localRotation = Quaternion.identity;
        approachObject.transform.localScale = Vector3.one;

        created = true;
        return approachObject.transform;
    }

    private static void BindSitPoint(VoxelSitPoint sitPoint, VoxelVolume voxelVolume, Transform approachPoint)
    {
        Undo.RecordObject(sitPoint, "Bind VoxelSitPoint");

        SerializedObject serializedSitPoint = new SerializedObject(sitPoint);
        serializedSitPoint.FindProperty("voxelVolume").objectReferenceValue = voxelVolume;
        serializedSitPoint.FindProperty("approachPoint").objectReferenceValue = approachPoint;
        serializedSitPoint.ApplyModifiedProperties();
    }
#endif

    private static List<GameObject> GetSelectedVoxelObjects()
    {
        return Selection.gameObjects
            .Where(go => go != null && !EditorUtility.IsPersistent(go))
            .Select(GetAuthoringVoxelObject)
            .Where(go => go != null)
            .Distinct()
            .ToList();
    }

    private static GameObject GetAuthoringVoxelObject(GameObject go)
    {
#if VOX_MOD_TOOLKIT
        VoxelObjectProxy proxy = go != null ? go.GetComponentInParent<VoxelObjectProxy>(true) : null;
        return proxy != null ? proxy.gameObject : null;
#else
        return IsAuthoringVoxelObject(go) ? go : null;
#endif
    }

    private static bool IsAuthoringVoxelObject(GameObject go)
    {
#if VOX_MOD_TOOLKIT
        return go != null && go.GetComponent<VoxelObjectProxy>() != null;
#else
        return go != null && go.GetComponent<VoxelVolume>() != null;
#endif
    }

    private static VoxelSceneTypeSwitch.VoxelSceneType GetSharedSelectedType(List<GameObject> selectedVoxels)
    {
        if (selectedVoxels.Count == 0)
            return VoxelSceneTypeSwitch.VoxelSceneType.Unknown;

        VoxelSceneTypeSwitch.VoxelSceneType firstType = DetectType(selectedVoxels[0]);
        for (int i = 1; i < selectedVoxels.Count; i++)
        {
            if (DetectType(selectedVoxels[i]) != firstType)
                return VoxelSceneTypeSwitch.VoxelSceneType.Unknown;
        }

        return firstType;
    }

    private static string GetTypeDisplayLabel(VoxelSceneTypeSwitch.VoxelSceneType type)
    {
        return type == VoxelSceneTypeSwitch.VoxelSceneType.Unknown ? "Mixed / Unknown" : type.ToString();
    }

    private void SwitchSelectedVoxelsType(List<GameObject> selectedVoxels, VoxelSceneTypeSwitch.VoxelSceneType newType, int typeIndex)
    {
        int switchedCount = 0;
        foreach (GameObject selectedVoxel in selectedVoxels)
        {
            if (selectedVoxel == null)
                continue;

            Undo.RegisterFullObjectHierarchyUndo(selectedVoxel, $"Switch Voxel Type to {Prefixes[typeIndex]}");
            SwitchSelectedType(selectedVoxel, DetectType(selectedVoxel), newType, typeIndex);
            switchedCount++;
        }

        statusMessage = $"Type switched: {switchedCount} voxel object(s) to {newType}.";
    }

    private void AddCornerUnyieldingSupports(List<GameObject> targets)
    {
        int successCount = 0;
        int skippedCount = 0;

        foreach (GameObject target in targets)
        {
            if (target == null || DetectType(target) != VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected)
            {
                skippedCount++;
                continue;
            }

            if (TryCreateCornerUnyieldingSupports(target))
                successCount++;
            else
                skippedCount++;
        }

        statusMessage = $"Corner supports added: {successCount}, skipped: {skippedCount}.";
    }

    private void MoveDTypeAttachmentPointsToFace(List<GameObject> targets, AttachmentFace face)
    {
        int successCount = 0;
        int skippedCount = 0;

        foreach (GameObject target in targets)
        {
            if (target == null || DetectType(target) != VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
            {
                skippedCount++;
                continue;
            }

            Undo.RegisterFullObjectHierarchyUndo(target, "Move AttachmentPoint To Face Center");
            if (TryMoveDTypeAttachmentPointToFace(target, face))
                successCount++;
            else
                skippedCount++;
        }

        statusMessage = $"AttachmentPoint moved to {face}: {successCount}, skipped: {skippedCount}.";
    }

    private void SnapDTypeAttachmentPointsToWall(List<GameObject> targets)
    {
        var wallCandidates = CollectSnapWallCandidates();
        int successCount = 0;
        int skippedCount = 0;

        foreach (GameObject target in targets)
        {
            if (target == null || DetectType(target) != VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
            {
                skippedCount++;
                continue;
            }

            Undo.RegisterFullObjectHierarchyUndo(target, "Snap AttachmentPoint To Wall");
            if (TrySnapDTypeAttachmentPointToWall(target, wallCandidates))
                successCount++;
            else
                skippedCount++;
        }

        statusMessage = $"AttachmentPoint snapped to wall: {successCount}, skipped: {skippedCount}.";
    }

    private void DrawDoorGeneratorTab()
    {
        EditorGUILayout.HelpBox(
            "Add door voxel objects to the list. Quick Mode uses the current editor selection directly. One door can use manual Pick Anchor or auto Generate; multiple doors use auto Generate.",
            MessageType.Info);

        doorGeneratorQuickMode = EditorGUILayout.Toggle("Quick Mode (Use Current Selection)", doorGeneratorQuickMode);
        doorJointData = (JointInfoData)EditorGUILayout.ObjectField("Joint Data", doorJointData, typeof(JointInfoData), false);
        doorHingeSide = (DoorHingeSide)EditorGUILayout.EnumPopup("Hinge Side", doorHingeSide);

        List<GameObject> activeDoors;
        if (doorGeneratorQuickMode)
        {
            activeDoors = GetSelectedVoxelObjects();
            DrawReadonlyTargetList(activeDoors, ref batchDoorScroll, "Current Selected Doors", "Add Selected Doors");
        }
        else
        {
            if (DrawTargetList(batchDoors, ref batchDoorScroll, "Drag door VoxelVolume GameObjects here", "Add Selected Doors", AddBatchDoor))
                ClearDoorAnchor();
            activeDoors = batchDoors;
        }

        GameObject targetDoor = GetDoorGeneratorSingleTarget();
        EditorGUILayout.Space(4);
        EditorGUILayout.LabelField("Door Count", activeDoors.Count.ToString());
        EditorGUILayout.LabelField("Manual Pick Target", targetDoor ? targetDoor.name : (doorGeneratorQuickMode ? "Select exactly one door" : "List exactly one door"));
        AttachmentPoint existingPoint = FindDoorAttachmentPoint(targetDoor);
        EditorGUILayout.LabelField("AttachmentPoint", existingPoint ? existingPoint.name : "Will create when picking anchor");
        EditorGUILayout.LabelField("Anchor", HasDoorAnchorForCurrentTarget() ? doorAnchorWorld.ToString("F3") : "Not set");

        using (new EditorGUI.DisabledScope(targetDoor == null || doorJointData == null))
        {
            if (GUILayout.Button(pickingDoorAnchor ? "Picking..." : "Pick Anchor / AttachmentPoint In Scene"))
                pickingDoorAnchor = true;
        }

        using (new EditorGUI.DisabledScope(activeDoors.Count == 0 || doorJointData == null))
        {
            if (GUILayout.Button("Generate Door Attachments", GUILayout.Height(32)))
                GenerateDoorAttachmentsForList(activeDoors, doorJointData, doorHingeSide);
        }

        if (!string.IsNullOrEmpty(statusMessage))
            EditorGUILayout.LabelField(statusMessage, EditorStyles.wordWrappedLabel);
    }

#if !VOX_MOD_TOOLKIT
    private void DrawBatchSelectTab()
    {
        EditorGUILayout.HelpBox(
            "Fuzzy search scene VoxelVolume objects by name. Example: door selects voxel objects whose names contain door.",
            MessageType.Info);

        EditorGUILayout.BeginHorizontal();
        batchSelectSearch = EditorGUILayout.TextField("Name Contains", batchSelectSearch);
        using (new EditorGUI.DisabledScope(string.IsNullOrWhiteSpace(batchSelectSearch)))
        {
            if (GUILayout.Button("Search", GUILayout.Width(72)))
                SearchVoxelVolumesByName();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        using (new EditorGUI.DisabledScope(batchSelectResults.Count == 0))
        {
            if (GUILayout.Button("Select Results"))
                Selection.objects = batchSelectResults.Where(go => go != null).Cast<Object>().ToArray();
            if (GUILayout.Button("Add To Batch Doors"))
                AddBatchSelectResultsToBatchDoors();
        }
        if (GUILayout.Button("Clear", GUILayout.Width(72)))
            batchSelectResults.Clear();
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.LabelField("Matches", batchSelectResults.Count.ToString());
        batchSelectScroll = EditorGUILayout.BeginScrollView(batchSelectScroll);
        for (int i = 0; i < batchSelectResults.Count; i++)
        {
            EditorGUILayout.ObjectField(batchSelectResults[i], typeof(GameObject), true);
        }
        EditorGUILayout.EndScrollView();

        if (!string.IsNullOrEmpty(statusMessage))
            EditorGUILayout.LabelField(statusMessage, EditorStyles.wordWrappedLabel);
    }

    private void DrawSettingsTab()
    {
        EditorGUILayout.HelpBox(
            "Scene editor preferences. These toggles are stored in EditorPrefs and apply across editor sessions.",
            MessageType.Info);

        ChunkToEntitySelector.Enabled = EditorGUILayout.Toggle("Chunk -> Entity Select", ChunkToEntitySelector.Enabled);
        VoxelSceneEditorAutoPreview.Enabled = EditorGUILayout.Toggle("Auto Preview Selected VoxelVolume", VoxelSceneEditorAutoPreview.Enabled);

        if (!string.IsNullOrEmpty(statusMessage))
            EditorGUILayout.LabelField(statusMessage, EditorStyles.wordWrappedLabel);
    }
#endif

    private bool CanConfigureDoor()
    {
        return doorJointData != null && HasDoorAnchorForCurrentTarget();
    }

    private void ConfigureDoorAttachment()
    {
        if (!CanConfigureDoor())
        {
            statusMessage = "Door generator needs door voxel, hinge JointInfoData, and a picked anchor.";
            return;
        }

        GameObject targetDoor = GetDoorGeneratorSingleTarget();
        ConfigureDoorAttachment(targetDoor, doorJointData, doorAnchorWorld, true);
        statusMessage = $"Door attachment configured at {doorAnchorWorld:F3}.";
    }

    private GameObject GetDoorGeneratorSingleTarget()
    {
        List<GameObject> activeDoors = doorGeneratorQuickMode ? GetSelectedVoxelObjects() : batchDoors;
        return activeDoors.Count == 1 ? activeDoors[0] : null;
    }

    private void ClearDoorAnchor()
    {
        doorAnchorTarget = null;
        hasDoorAnchorWorld = false;
    }

    private bool HasDoorAnchorForCurrentTarget()
    {
        GameObject targetDoor = GetDoorGeneratorSingleTarget();
        return targetDoor != null && doorAnchorTarget == targetDoor && hasDoorAnchorWorld;
    }

    private static bool ConfigureDoorAttachment(GameObject doorObject, JointInfoData jointData, Vector3 anchorWorld, bool selectAttachmentPoint)
    {
        if (doorObject == null || !IsAuthoringVoxelObject(doorObject) || jointData == null)
            return false;

        if (jointData.jointType != JointInfoData.JointType.HingeJoint)
            Debug.LogWarning($"[VoxelSceneEditor] Door JointData '{jointData.name}' is not HingeJoint.", jointData);

        Undo.RegisterFullObjectHierarchyUndo(doorObject, "Configure Door Attachment");

        AttachmentPoint attachmentPoint = FindDoorAttachmentPoint(doorObject);
        if (attachmentPoint == null)
            attachmentPoint = CreateDoorAttachmentPoint(doorObject, anchorWorld);
        else
            MoveDoorAttachmentPoint(attachmentPoint, anchorWorld);

        SwitchSelectedType(doorObject, DetectType(doorObject), VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected, 3);

        var doorEntity = EnsureDoorEntity(doorObject, jointData);
#if VOX_MOD_TOOLKIT
        RigidbodyProxy doorRb = EnsureProxyRigidbody(doorObject, false);
        attachmentPoint.entityAttachmentItem = doorEntity;
        var attachObj = doorEntity.attachObj;
        attachObj.visualObject = doorObject;
        attachObj.attachPoints = new List<AttachmentPoint> { attachmentPoint };
        attachObj.attachmentHelper.jointData = jointData;
        doorEntity.attachObj = attachObj;
        SetModTkJointDataBridge(doorEntity, jointData);
        EditorUtility.SetDirty(doorRb);
#else
        Rigidbody doorRb = EnsureDoorRigidbody(doorObject, false);
        EnsureDoorVoxelPhysics(doorObject);
        attachmentPoint.Init(doorEntity);
        attachmentPoint.entityAttachmentItem = doorEntity;

        var attachObj = doorEntity.attachObj;
        attachObj.rb = doorRb;
        attachObj.visualObject = doorObject;
        attachObj.attachPoints = new List<AttachmentPoint> { attachmentPoint };
        attachObj.attachmentHelper.jointData = jointData;
        doorEntity.attachObj = attachObj;
#endif
        EditorUtility.SetDirty(doorEntity);
        EditorUtility.SetDirty(attachmentPoint);

        if (selectAttachmentPoint)
            Selection.activeObject = attachmentPoint.gameObject;
        return true;
    }

    private void GenerateDoorAttachmentsForList(IEnumerable<GameObject> doorObjects, JointInfoData jointData, DoorHingeSide hingeSide)
    {
        int successCount = 0;
        int skippedCount = 0;

        foreach (GameObject doorObject in doorObjects.ToArray())
        {
            if (doorObject == null || !IsAuthoringVoxelObject(doorObject))
            {
                skippedCount++;
                continue;
            }

            if (!TryComputeBatchDoorAnchor(doorObject, hingeSide, out Vector3 anchorWorld))
            {
                skippedCount++;
                Debug.LogWarning($"[VoxelSceneEditor] Cannot compute door hinge anchor for {doorObject.name}.", doorObject);
                continue;
            }

            if (ConfigureDoorAttachment(doorObject, jointData, anchorWorld, false))
                successCount++;
            else
                skippedCount++;
        }

        statusMessage = $"Batch door attachments generated: {successCount}, skipped: {skippedCount}.";
    }

#if !VOX_MOD_TOOLKIT
    private void SearchVoxelVolumesByName()
    {
        string query = batchSelectSearch.Trim();
        batchSelectResults.Clear();

        foreach (VoxelVolume volume in UnityEngine.Object.FindObjectsByType<VoxelVolume>(FindObjectsInactive.Include, FindObjectsSortMode.None))
        {
            GameObject go = volume.gameObject;
            if (go == null || EditorUtility.IsPersistent(go))
                continue;
            if (go.name.IndexOf(query, System.StringComparison.OrdinalIgnoreCase) < 0)
                continue;

            batchSelectResults.Add(go);
        }

        batchSelectResults.Sort((a, b) => string.Compare(GetHierarchyPath(a), GetHierarchyPath(b), System.StringComparison.OrdinalIgnoreCase));
        Selection.objects = batchSelectResults.Cast<Object>().ToArray();
        statusMessage = $"Voxel fuzzy search matched {batchSelectResults.Count} object(s).";
    }

    private void AddBatchSelectResultsToBatchDoors()
    {
        int beforeCount = batchDoors.Count;
        foreach (GameObject go in batchSelectResults)
            AddBatchDoor(go);

        statusMessage = $"Added {batchDoors.Count - beforeCount} object(s) to batch doors.";
    }

    private static string GetHierarchyPath(GameObject go)
    {
        if (go == null)
            return string.Empty;

        string path = go.name;
        Transform parent = go.transform.parent;
        while (parent != null)
        {
            path = parent.name + "/" + path;
            parent = parent.parent;
        }

        return path;
    }
#endif

    private static bool TryComputeBatchDoorAnchor(GameObject doorObject, DoorHingeSide hingeSide, out Vector3 anchorWorld)
    {
        anchorWorld = Vector3.zero;
        if (!TryGetSolidVoxelInfo(doorObject, out SolidVoxelInfo solidInfo))
            return false;

        Vector3 localCenter = new Vector3(
            (solidInfo.min.x + solidInfo.max.x) * 0.5f,
            (solidInfo.min.y + solidInfo.max.y) * 0.5f,
            (solidInfo.min.z + solidInfo.max.z) * 0.5f);
        Vector3Int solidSize = solidInfo.max - solidInfo.min + Vector3Int.one;
        bool widthIsX = solidSize.x >= solidSize.z;
        Vector3 negativeAnchorLocal = GetDoorAnchorLocal(solidInfo, localCenter, widthIsX, true);
        Vector3 positiveAnchorLocal = GetDoorAnchorLocal(solidInfo, localCenter, widthIsX, false);
        Vector3 anchorLocal = hingeSide switch
        {
            DoorHingeSide.Right => positiveAnchorLocal,
            DoorHingeSide.AutoClosestBuilding => ChooseAnchorClosestToBuilding(doorObject, negativeAnchorLocal, positiveAnchorLocal),
            _ => negativeAnchorLocal
        };

        anchorWorld = doorObject.transform.TransformPoint(anchorLocal);
        return true;
    }

    private static Vector3 GetDoorAnchorLocal(SolidVoxelInfo solidInfo, Vector3 localCenter, bool widthIsX, bool useNegativeSide)
    {
        Vector3 anchorLocal = localCenter;
        if (widthIsX)
            anchorLocal.x = useNegativeSide ? solidInfo.min.x : solidInfo.max.x;
        else
            anchorLocal.z = useNegativeSide ? solidInfo.min.z : solidInfo.max.z;

        anchorLocal.y = (solidInfo.min.y + solidInfo.max.y) * 0.5f;
        return anchorLocal;
    }

    private static Vector3 ChooseAnchorClosestToBuilding(GameObject doorObject, Vector3 negativeAnchorLocal, Vector3 positiveAnchorLocal)
    {
        Vector3 negativeAnchorWorld = doorObject.transform.TransformPoint(negativeAnchorLocal);
        Vector3 positiveAnchorWorld = doorObject.transform.TransformPoint(positiveAnchorLocal);
        float negativeDistance = float.PositiveInfinity;
        float positiveDistance = float.PositiveInfinity;

        foreach (GameObject candidate in FindAllAuthoringVoxelObjects())
        {
            if (candidate == doorObject || EditorUtility.IsPersistent(candidate) || !IsBuildingVoxelCandidate(candidate))
                continue;
            if (!TryGetDoorBounds(candidate, out Bounds bounds))
                continue;

            negativeDistance = Mathf.Min(negativeDistance, Vector3.SqrMagnitude(bounds.ClosestPoint(negativeAnchorWorld) - negativeAnchorWorld));
            positiveDistance = Mathf.Min(positiveDistance, Vector3.SqrMagnitude(bounds.ClosestPoint(positiveAnchorWorld) - positiveAnchorWorld));
        }

        return positiveDistance < negativeDistance ? positiveAnchorLocal : negativeAnchorLocal;
    }

    private static bool IsBuildingVoxelCandidate(GameObject candidate)
    {
        if (candidate.layer == LayerMasksHelper.layerMask_Building || candidate.GetComponent<EntityBuilding>() != null)
            return true;

        return DetectType(candidate) == VoxelSceneTypeSwitch.VoxelSceneType.A_Static;
    }

    private static IEnumerable<GameObject> FindAllAuthoringVoxelObjects()
    {
#if VOX_MOD_TOOLKIT
        return UnityEngine.Object.FindObjectsByType<VoxelObjectProxy>(FindObjectsInactive.Include, FindObjectsSortMode.None)
            .Where(proxy => proxy != null)
            .Select(proxy => proxy.gameObject);
#else
        return UnityEngine.Object.FindObjectsByType<VoxelVolume>(FindObjectsInactive.Include, FindObjectsSortMode.None)
            .Where(volume => volume != null)
            .Select(volume => volume.gameObject);
#endif
    }

    private static EntityDestructibleItem EnsureDoorEntity(GameObject target, JointInfoData jointData)
    {
        var entity = target.GetComponent<EntityDestructibleItem>();
        if (entity == null)
            entity = Undo.AddComponent<EntityDestructibleItem>(target);
        return entity;
    }

#if !VOX_MOD_TOOLKIT
    private static Rigidbody EnsureDoorRigidbody(GameObject target, bool isKinematic)
    {
        var rb = target.GetComponent<Rigidbody>();
        if (rb == null)
            rb = Undo.AddComponent<Rigidbody>(target);

        rb.isKinematic = isKinematic;
        EditorUtility.SetDirty(rb);
        return rb;
    }

    private static void EnsureDoorVoxelPhysics(GameObject target)
    {
        if (target.GetComponent<PxVoxelColliderGenerator>() == null)
            Undo.AddComponent<PxVoxelColliderGenerator>(target);
        if (target.GetComponent<VoxelDestructor>() == null)
            Undo.AddComponent<VoxelDestructor>(target);
#if USE_PX5
        if (target.GetComponent<Px5.Unity.PxConverter>() == null)
            Undo.AddComponent<Px5.Unity.PxConverter>(target);
#endif
    }
#endif

    private static AttachmentPoint CreateDoorAttachmentPoint(GameObject doorObject, Vector3 anchorWorld)
    {
        var attachGo = new GameObject("DoorHinge_AttachmentPoint");
        Undo.RegisterCreatedObjectUndo(attachGo, "Create Door AttachmentPoint");
        attachGo.transform.SetParent(doorObject.transform);
        MoveDoorAttachmentPoint(attachGo.AddComponent<AttachmentPoint>(), anchorWorld);
        return attachGo.GetComponent<AttachmentPoint>();
    }

    private static AttachmentPoint FindDoorAttachmentPoint(GameObject doorObject)
    {
        if (doorObject == null)
            return null;

        foreach (AttachmentPoint point in doorObject.GetComponentsInChildren<AttachmentPoint>(true))
        {
            if (point.name == "DoorHinge_AttachmentPoint")
                return point;
        }

        return doorObject.GetComponentInChildren<AttachmentPoint>(true);
    }

    private static void MoveDoorAttachmentPoint(AttachmentPoint attachmentPoint, Vector3 anchorWorld)
    {
        attachmentPoint.transform.position = anchorWorld;
        attachmentPoint.transform.rotation = Quaternion.identity;
        attachmentPoint.activeSearch = false;
        attachmentPoint.showGiz = true;
        attachmentPoint.enabledDirs = new bool[] { true, true, true, true, true, true };
        EditorUtility.SetDirty(attachmentPoint);
    }

    private static bool TryPickDoorAnchor(GameObject doorObject, Vector2 mousePosition, out Vector3 hitPoint)
    {
        Ray ray = HandleUtility.GUIPointToWorldRay(mousePosition);

        if (TryPickDoorWithSceneView(doorObject, mousePosition, out hitPoint))
            return true;

        if (TryRaycastDoorMesh(doorObject, ray, out hitPoint))
            return true;

#if USE_PX5
        if (TryRaycastDoorPx5(doorObject, ray, out hitPoint))
            return true;
#endif

        return TryRaycastDoorUnityPhysics(doorObject, ray, out hitPoint);
    }

#if USE_PX5
    private static bool TryRaycastDoorPx5(GameObject doorObject, Ray ray, out Vector3 hitPoint)
    {
        hitPoint = Vector3.zero;

        try
        {
            if (!Px5.Unity.PxPhysics.Raycast(ray, out Px5.UnityExtensions.RaycastHit hit, 10000f, -5, QueryTriggerInteraction.Collide))
                return false;

            Transform hitTransform = hit.transform;
            if (hitTransform == null && hit.collider != null)
                hitTransform = hit.collider.transform;

            if (!IsDoorOrChild(doorObject, hitTransform))
                return false;

            hitPoint = hit.point;
            return true;
        }
        catch
        {
            return false;
        }
    }
#endif

    private static bool TryPickDoorWithSceneView(GameObject doorObject, Vector2 mousePosition, out Vector3 hitPoint)
    {
        hitPoint = Vector3.zero;

        GameObject pickedObject = HandleUtility.PickGameObject(mousePosition, false);
        if (!IsDoorOrChild(doorObject, pickedObject != null ? pickedObject.transform : null))
            return false;

        if (!HandleUtility.PlaceObject(mousePosition, out Vector3 position, out _))
            return false;

        if (!IsPointNearDoorBounds(doorObject, position))
            return false;

        hitPoint = position;
        return true;
    }

    private static bool TryRaycastDoorUnityPhysics(GameObject doorObject, Ray ray, out Vector3 hitPoint)
    {
        hitPoint = Vector3.zero;
        if (!Physics.Raycast(ray, out RaycastHit hit, 10000f, Physics.DefaultRaycastLayers, QueryTriggerInteraction.Collide))
            return false;

        if (!IsDoorOrChild(doorObject, hit.transform))
            return false;

        hitPoint = hit.point;
        return true;
    }

    private static bool TryRaycastDoorMesh(GameObject doorObject, Ray ray, out Vector3 hitPoint)
    {
        hitPoint = Vector3.zero;
        float bestDistance = float.PositiveInfinity;
        bool found = false;

        foreach (MeshFilter meshFilter in doorObject.GetComponentsInChildren<MeshFilter>(true))
        {
            Mesh mesh = meshFilter.sharedMesh;
            if (mesh == null)
                continue;

            try
            {
                Vector3[] vertices = mesh.vertices;
                int[] triangles = mesh.triangles;
                Matrix4x4 localToWorld = meshFilter.transform.localToWorldMatrix;

                for (int i = 0; i < triangles.Length; i += 3)
                {
                    Vector3 v0 = localToWorld.MultiplyPoint3x4(vertices[triangles[i]]);
                    Vector3 v1 = localToWorld.MultiplyPoint3x4(vertices[triangles[i + 1]]);
                    Vector3 v2 = localToWorld.MultiplyPoint3x4(vertices[triangles[i + 2]]);

                    if (!RaycastTriangle(ray, v0, v1, v2, out float distance))
                        continue;

                    if (distance >= bestDistance)
                        continue;

                    bestDistance = distance;
                    hitPoint = ray.GetPoint(distance);
                    found = true;
                }
            }
            catch
            {
                // Non-readable meshes are skipped.
            }
        }

        return found;
    }

    private static bool IsDoorOrChild(GameObject doorObject, Transform target)
    {
        return doorObject != null &&
               target != null &&
               (target == doorObject.transform || target.IsChildOf(doorObject.transform));
    }

    private static bool IsPointNearDoorBounds(GameObject doorObject, Vector3 point)
    {
        if (!TryGetDoorBounds(doorObject, out Bounds bounds))
            return true;

        float padding = Mathf.Max(0.25f, bounds.size.magnitude * 0.02f);
        bounds.Expand(padding);
        return bounds.Contains(point);
    }

    private static bool TryGetDoorBounds(GameObject doorObject, out Bounds bounds)
    {
        bounds = default;
        bool hasBounds = false;

        foreach (Renderer renderer in doorObject.GetComponentsInChildren<Renderer>(true))
        {
            if (!hasBounds)
            {
                bounds = renderer.bounds;
                hasBounds = true;
            }
            else
            {
                bounds.Encapsulate(renderer.bounds);
            }
        }

        if (hasBounds)
            return true;

        foreach (Collider collider in doorObject.GetComponentsInChildren<Collider>(true))
        {
            if (!hasBounds)
            {
                bounds = collider.bounds;
                hasBounds = true;
            }
            else
            {
                bounds.Encapsulate(collider.bounds);
            }
        }

        return hasBounds;
    }

    private static bool RaycastTriangle(Ray ray, Vector3 v0, Vector3 v1, Vector3 v2, out float distance)
    {
        const float epsilon = 0.000001f;
        distance = 0f;
        Vector3 edge1 = v1 - v0;
        Vector3 edge2 = v2 - v0;
        Vector3 h = Vector3.Cross(ray.direction, edge2);
        float a = Vector3.Dot(edge1, h);
        if (a > -epsilon && a < epsilon)
            return false;

        float f = 1f / a;
        Vector3 s = ray.origin - v0;
        float u = f * Vector3.Dot(s, h);
        if (u < 0f || u > 1f)
            return false;

        Vector3 q = Vector3.Cross(s, edge1);
        float v = f * Vector3.Dot(ray.direction, q);
        if (v < 0f || u + v > 1f)
            return false;

        distance = f * Vector3.Dot(edge2, q);
        return distance > epsilon;
    }

    private static bool IsDestructibleType(VoxelSceneTypeSwitch.VoxelSceneType t) =>
        t == VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic ||
        t == VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected ||
        t == VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected;

    private static void SwitchSelectedType(
        GameObject go,
        VoxelSceneTypeSwitch.VoxelSceneType oldType,
        VoxelSceneTypeSwitch.VoxelSceneType newType,
        int typeIndex)
    {
        string baseName = StripTypePrefix(go.name);
        go.name = Prefixes[typeIndex] + baseName;

#if VOX_MOD_TOOLKIT
        ApplyModTkProxyType(go, newType);
#else
        CleanupTypeSpecific(go, oldType, newType);

        switch (newType)
        {
            case VoxelSceneTypeSwitch.VoxelSceneType.A_Static:
                ApplySwitchTypeA(go);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic:
                ApplySwitchTypeB(go);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected:
                ApplySwitchTypeC(go);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected:
                ApplySwitchTypeD(go);
                break;
        }
#endif

        EditorUtility.SetDirty(go);
    }

#if VOX_MOD_TOOLKIT
    private static void ApplyModTkProxyType(GameObject go, VoxelSceneTypeSwitch.VoxelSceneType newType)
    {
        VoxelObjectProxy voxelProxy = go.GetComponent<VoxelObjectProxy>();
        if (voxelProxy == null)
            return;

        Undo.RecordObject(voxelProxy, "Switch Voxel Proxy Type");
        RigidbodyProxy rbProxy = EnsureProxyRigidbody(go, newType == VoxelSceneTypeSwitch.VoxelSceneType.A_Static);

        if (newType == VoxelSceneTypeSwitch.VoxelSceneType.A_Static)
        {
            DestroyIfExists<EntityDestructibleItem>(go);
            if (go.GetComponent<EntityBuilding>() == null)
                Undo.AddComponent<EntityBuilding>(go);
            voxelProxy.proxyType = VoxelObjectProxyType.SceneStatic;
            go.tag = "Floor";
            go.layer = LayerMasksHelper.layerMask_Building;
        }
        else
        {
            DestroyIfExists<EntityBuilding>(go);
            EntityDestructibleItem entity = go.GetComponent<EntityDestructibleItem>();
            if (entity == null)
                entity = Undo.AddComponent<EntityDestructibleItem>(go);

            go.tag = "Untagged";
            go.layer = LayerMasksHelper.layerMask_Item;
            rbProxy.isKinematic = false;

            if (newType == VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic)
                voxelProxy.proxyType = VoxelObjectProxyType.SceneDynamic;
            else if (newType == VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected)
                voxelProxy.proxyType = VoxelObjectProxyType.SceneStrongConnected;
            else
                voxelProxy.proxyType = VoxelObjectProxyType.SceneWeakConnected;
        }

        if (newType != VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected)
        {
            foreach (UnyieldingArea area in go.GetComponentsInChildren<UnyieldingArea>(true))
                Undo.DestroyObjectImmediate(area.gameObject);
        }
        else
        {
            UnyieldingArea area = go.GetComponentInChildren<UnyieldingArea>(true);
            GameObject areaObject;
            if (area == null)
            {
                areaObject = new GameObject("UnyieldingArea");
                Undo.RegisterCreatedObjectUndo(areaObject, "Create UnyieldingArea");
                areaObject.transform.SetParent(go.transform);
                areaObject.AddComponent<UnyieldingArea>();
            }
            else
            {
                areaObject = area.gameObject;
            }

            BoxCollider box = areaObject.GetComponent<BoxCollider>();
            if (box == null)
                box = Undo.AddComponent<BoxCollider>(areaObject);
            ConfigureSwitchUnyieldingArea(go, areaObject, box);
        }

        if (newType != VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
        {
            foreach (AttachmentPoint point in go.GetComponentsInChildren<AttachmentPoint>(true))
            {
                if (point.gameObject == go)
                    Undo.DestroyObjectImmediate(point);
                else
                    Undo.DestroyObjectImmediate(point.gameObject);
            }
        }
        else
        {
            EntityDestructibleItem entity = go.GetComponent<EntityDestructibleItem>();
            AttachmentPoint point = FindOrCreateSwitchAttachmentPoint(go);
            point.activeSearch = true;
            point.showGiz = true;
            point.enabledDirs = new[] { true, true, true, true, true, true };
            point.entityAttachmentItem = entity;

            AttachObj attachObj = entity.attachObj;
            attachObj.attachPoints = new List<AttachmentPoint> { point };
            if (attachObj.attachmentHelper.jointData == null)
                attachObj.attachmentHelper.jointData = AssetDatabase.LoadAssetAtPath<JointInfoData>("Assets/ScriptableObjects/Joint/EnvironmentJoint.asset");
            entity.attachObj = attachObj;
            SetModTkJointDataBridge(entity, attachObj.attachmentHelper.jointData);
            EditorUtility.SetDirty(entity);
            EditorUtility.SetDirty(point);
        }

        EditorUtility.SetDirty(rbProxy);
        EditorUtility.SetDirty(voxelProxy);
    }

#pragma warning disable CS0618
    private static void SetModTkJointDataBridge(EntityAttachmentItem entity, JointInfoData jointData)
    {
        if (entity != null)
            entity.jointData = jointData;
    }
#pragma warning restore CS0618

    private static RigidbodyProxy EnsureProxyRigidbody(GameObject go, bool isKinematic)
    {
        RigidbodyProxy rbProxy = go.GetComponent<RigidbodyProxy>();
        if (rbProxy == null)
            rbProxy = Undo.AddComponent<RigidbodyProxy>(go);
        rbProxy.isKinematic = isKinematic;
        return rbProxy;
    }
#else
    private static void CleanupTypeSpecific(
        GameObject go,
        VoxelSceneTypeSwitch.VoxelSceneType oldType,
        VoxelSceneTypeSwitch.VoxelSceneType newType)
    {
        bool oldIsDestructible = IsDestructibleType(oldType);
        bool newIsDestructible = IsDestructibleType(newType);
        bool oldIsBuilding = oldType == VoxelSceneTypeSwitch.VoxelSceneType.A_Static;
        bool newIsBuilding = newType == VoxelSceneTypeSwitch.VoxelSceneType.A_Static;

        if (oldIsDestructible && !newIsDestructible)
            DestroyIfExists<EntityDestructibleItem>(go);
        if (oldIsBuilding && !newIsBuilding)
            DestroyIfExists<EntityBuilding>(go);

        if (newType != VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected)
        {
            var unyielding = go.GetComponentInChildren<UnyieldingArea>(true);
            if (unyielding != null)
                Undo.DestroyObjectImmediate(unyielding.gameObject);
        }

        if (newType != VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected)
        {
            foreach (var ap in go.GetComponentsInChildren<AttachmentPoint>(true))
            {
                if (ap.gameObject != go)
                    Undo.DestroyObjectImmediate(ap.gameObject);
                else
                    Undo.DestroyObjectImmediate(ap);
            }

            var attachmentItem = go.GetComponent<EntityDestructibleItem>();
            if (attachmentItem != null)
            {
                attachmentItem.attachObj = new AttachObj();
                EditorUtility.SetDirty(attachmentItem);
            }
        }
    }

    private static void ApplySwitchTypeA(GameObject go)
    {
        if (go.GetComponent<EntityBuilding>() == null)
            Undo.AddComponent<EntityBuilding>(go);

        go.tag = "Floor";
        go.layer = LayerMasksHelper.layerMask_Building;
        EnsureSwitchPhysicsComponents(go, true);
        ConfigureSwitchVoxelVolume(go, false, LayerMasksHelper.layerMask_Building);

        var voxelDestructor = go.GetComponent<VoxelDestructor>();
        if (voxelDestructor != null)
        {
            voxelDestructor.indestructiable = true;
            voxelDestructor.registerFragmentEvents = false;
            voxelDestructor.unyielding = false;
            voxelDestructor.gameObject.layer = LayerMasksHelper.layerMask_Building;
            EditorUtility.SetDirty(voxelDestructor);
        }
    }

    private static void ApplySwitchTypeB(GameObject go)
    {
        if (go.GetComponent<EntityDestructibleItem>() == null)
            Undo.AddComponent<EntityDestructibleItem>(go);

        go.tag = "Untagged";
        go.layer = LayerMasksHelper.layerMask_Item;
        EnsureSwitchPhysicsComponents(go, false);
        ConfigureSwitchVoxelVolume(go, true, LayerMasksHelper.layerMask_Item);
        ConfigureSwitchVoxelDestructor(go, false);
    }

    private static void ApplySwitchTypeC(GameObject go)
    {
        if (go.GetComponent<EntityDestructibleItem>() == null)
            Undo.AddComponent<EntityDestructibleItem>(go);

        go.tag = "Untagged";
        go.layer = LayerMasksHelper.layerMask_Item;
        EnsureSwitchPhysicsComponents(go, true);
        ConfigureSwitchVoxelVolume(go, true, LayerMasksHelper.layerMask_Item);
        ConfigureSwitchVoxelDestructor(go, true);

        var unyieldingArea = go.GetComponentInChildren<UnyieldingArea>(true);
        if (unyieldingArea == null)
        {
            var unyieldingGo = new GameObject("UnyieldingArea");
            Undo.RegisterCreatedObjectUndo(unyieldingGo, "Create UnyieldingArea");
            unyieldingGo.transform.SetParent(go.transform);
            unyieldingArea = unyieldingGo.AddComponent<UnyieldingArea>();
            var box = unyieldingGo.AddComponent<BoxCollider>();
            ConfigureSwitchUnyieldingArea(go, unyieldingGo, box);
#if USE_PX5
            unyieldingGo.AddComponent<Px5.Unity.PxConverter>();
#endif
        }
        else
        {
            var box = unyieldingArea.GetComponent<BoxCollider>();
            if (box == null)
                box = Undo.AddComponent<BoxCollider>(unyieldingArea.gameObject);
            ConfigureSwitchUnyieldingArea(go, unyieldingArea.gameObject, box);
#if USE_PX5
            if (unyieldingArea.GetComponent<Px5.Unity.PxConverter>() == null)
                Undo.AddComponent<Px5.Unity.PxConverter>(unyieldingArea.gameObject);
#endif
        }
    }

    private static void ApplySwitchTypeD(GameObject go)
    {
        var entity = go.GetComponent<EntityDestructibleItem>();
        if (entity == null)
            entity = Undo.AddComponent<EntityDestructibleItem>(go);

        go.tag = "Untagged";
        go.layer = LayerMasksHelper.layerMask_Item;
        EnsureSwitchPhysicsComponents(go, false);
        ConfigureSwitchVoxelVolume(go, true, LayerMasksHelper.layerMask_Item);
        ConfigureSwitchVoxelDestructor(go, false);

        var attachPoints = new List<AttachmentPoint>(go.GetComponentsInChildren<AttachmentPoint>(true));
        if (attachPoints.Count == 0)
        {
            var attachGo = new GameObject("AttachPoint");
            Undo.RegisterCreatedObjectUndo(attachGo, "Create AttachPoint");
            attachGo.transform.SetParent(go.transform);
            attachGo.transform.SetLocalPositionAndRotation(Vector3.zero, Quaternion.identity);
            attachPoints.Add(attachGo.AddComponent<AttachmentPoint>());
        }

        foreach (var attachPoint in attachPoints)
        {
            attachPoint.activeSearch = true;
            attachPoint.showGiz = true;
            attachPoint.enabledDirs = new bool[] { true, true, true, true, true, true };
            attachPoint.transform.up = Vector3.up;
            EditorUtility.SetDirty(attachPoint);
        }

        var buildingJoint = AssetDatabase.LoadAssetAtPath<JointInfoData>("Assets/ScriptableObjects/Joint/EnvironmentJoint.asset");
        var attachObj = new AttachObj();
        attachObj.attachPoints = attachPoints;
        attachObj.attachmentHelper.jointData = buildingJoint;
        entity.attachObj = attachObj;
        EditorUtility.SetDirty(entity);
    }

    private static void ConfigureSwitchVoxelVolume(GameObject go, bool checkConnectivity, int layerID)
    {
        var voxelVolume = go.GetComponent<VoxelVolume>();
        if (voxelVolume == null)
            return;

        voxelVolume.checkConnectivity = checkConnectivity;
        voxelVolume.ticking = true;
        voxelVolume.isFragment = false;
        voxelVolume.layerID = layerID;
        voxelVolume.gameObject.layer = go.layer;
        if (GameDataManager.Instance != null)
            GameDataManager.Instance.InjectVoxelMaterials(voxelVolume, true);
        EditorUtility.SetDirty(voxelVolume);
    }

    private static void EnsureSwitchPhysicsComponents(GameObject go, bool isKinematic)
    {
#if VOX_MOD_TOOLKIT
        Component pxRb = GetComponentByTypeName(go, "Px5.Unity.PxRigidBody, Px5");
        var unityRb = go.GetComponent<UnityEngine.Rigidbody>();
        if (pxRb == null && unityRb == null)
            pxRb = AddComponentByTypeName(go, "Px5.Unity.PxRigidBody, Px5");

        if (pxRb != null)
        {
            SetSerializedBool(pxRb, "m_kinematic", isKinematic);
            EditorUtility.SetDirty(pxRb);
        }

        if (unityRb != null)
        {
            unityRb.isKinematic = isKinematic;
            EditorUtility.SetDirty(unityRb);
        }

        if (GetComponentByTypeName(go, "Px5.Unity.PxConverter, Px5") == null)
            AddComponentByTypeName(go, "Px5.Unity.PxConverter, Px5");
#else
#if USE_PX5
        var pxRb = go.GetComponent<Px5.Unity.PxRigidBody>();
        var unityRb = go.GetComponent<UnityEngine.Rigidbody>();
        if (pxRb == null && unityRb == null)
            pxRb = Undo.AddComponent<Px5.Unity.PxRigidBody>(go);

        if (pxRb != null)
        {
            pxRb.isKinematic = isKinematic;
            EditorUtility.SetDirty(pxRb);
        }

        if (unityRb != null)
        {
            unityRb.isKinematic = isKinematic;
            EditorUtility.SetDirty(unityRb);
        }
#else
        var rb = go.GetComponent<Rigidbody>();
        if (rb == null)
            rb = Undo.AddComponent<Rigidbody>(go);
        rb.isKinematic = isKinematic;
        EditorUtility.SetDirty(rb);
#endif

#if USE_PX5
        if (go.GetComponent<Px5.Unity.PxConverter>() == null)
            Undo.AddComponent<Px5.Unity.PxConverter>(go);
#endif
#endif

        var collider = go.GetComponent<PxVoxelColliderGenerator>();
        if (collider == null)
            collider = Undo.AddComponent<PxVoxelColliderGenerator>(go);
        collider.useMassFromActor = true;
        EditorUtility.SetDirty(collider);

        if (go.GetComponent<VoxelDestructor>() == null)
            Undo.AddComponent<VoxelDestructor>(go);
    }

    private static void ConfigureSwitchVoxelDestructor(GameObject go, bool unyielding)
    {
        var voxelDestructor = go.GetComponent<VoxelDestructor>();
        if (voxelDestructor == null)
            return;

        voxelDestructor.indestructiable = false;
        voxelDestructor.registerFragmentEvents = true;
        voxelDestructor.unyielding = unyielding;
        voxelDestructor.gameObject.layer = go.layer;
        EditorUtility.SetDirty(voxelDestructor);
    }
#endif

    private static void ConfigureSwitchUnyieldingArea(GameObject voxelObject, GameObject unyieldingAreaObject, BoxCollider boxCollider)
    {
        Transform areaTransform = unyieldingAreaObject.transform;
        areaTransform.localScale = Vector3.one;

        if (TryGetSolidVoxelInfo(voxelObject, out var solidInfo))
        {
            var center = new Vector3(
                (solidInfo.min.x + solidInfo.max.x) * 0.5f,
                solidInfo.min.y + DefaultUnyieldingAreaHeight * 0.5f,
                (solidInfo.min.z + solidInfo.max.z) * 0.5f);

            if (!HasSolidVoxelInUnyieldingArea(solidInfo, center))
            {
                center = new Vector3(
                    solidInfo.bottomVoxel.x,
                    solidInfo.bottomVoxel.y + DefaultUnyieldingAreaHeight * 0.5f,
                    solidInfo.bottomVoxel.z);
            }

            areaTransform.SetLocalPositionAndRotation(center, Quaternion.identity);
        }
        else
        {
            areaTransform.SetLocalPositionAndRotation(Vector3.zero, Quaternion.identity);
        }

        boxCollider.isTrigger = true;
        boxCollider.center = Vector3.zero;
        boxCollider.size = new Vector3(DefaultUnyieldingAreaSizeXZ, DefaultUnyieldingAreaHeight, DefaultUnyieldingAreaSizeXZ);
        EditorUtility.SetDirty(unyieldingAreaObject);
        EditorUtility.SetDirty(boxCollider);
    }

    private static bool TryCreateCornerUnyieldingSupports(GameObject voxelObject)
    {
        if (!TryGetSolidVoxelInfo(voxelObject, out SolidVoxelInfo solidInfo))
            return false;

        var corners = new (string name, Vector3Int target)[]
        {
            ("UnyieldingArea_Corner_NegX_NegZ", new Vector3Int(solidInfo.min.x, solidInfo.min.y, solidInfo.min.z)),
            ("UnyieldingArea_Corner_NegX_PosZ", new Vector3Int(solidInfo.min.x, solidInfo.min.y, solidInfo.max.z)),
            ("UnyieldingArea_Corner_PosX_NegZ", new Vector3Int(solidInfo.max.x, solidInfo.min.y, solidInfo.min.z)),
            ("UnyieldingArea_Corner_PosX_PosZ", new Vector3Int(solidInfo.max.x, solidInfo.min.y, solidInfo.max.z)),
        };

        bool createdAny = false;
        foreach (var corner in corners)
        {
            if (!TryFindBottomCornerSolidVoxel(solidInfo, corner.target, out Vector3Int supportVoxel))
                continue;

            CreateOrMoveCornerUnyieldingArea(voxelObject, corner.name, supportVoxel);
            createdAny = true;
        }

        return createdAny;
    }

    private static bool TryMoveDTypeAttachmentPointToFace(GameObject voxelObject, AttachmentFace face)
    {
        if (!TryGetSolidVoxelInfo(voxelObject, out SolidVoxelInfo solidInfo))
            return false;

        return TryPlaceDTypeAttachmentPoint(voxelObject, solidInfo, face);
    }

    private static bool TrySnapDTypeAttachmentPointToWall(GameObject voxelObject, List<SnapWallCandidate> wallCandidates)
    {
        if (!TryGetSolidVoxelInfo(voxelObject, out SolidVoxelInfo solidInfo))
            return false;

        if (!TryFindClosestWallFace(voxelObject, solidInfo, wallCandidates, out AttachmentFace face))
            return false;

        return TryPlaceDTypeAttachmentPoint(voxelObject, solidInfo, face);
    }

    private static bool TryPlaceDTypeAttachmentPoint(GameObject voxelObject, SolidVoxelInfo solidInfo, AttachmentFace face)
    {
        var entity = voxelObject.GetComponent<EntityDestructibleItem>();
        if (entity == null)
            return false;

        AttachmentPoint attachPoint = FindOrCreateSwitchAttachmentPoint(voxelObject);
        if (attachPoint == null)
            return false;

        Vector3 localCenter = GetSolidBoundsFaceCenter(solidInfo, face);
        Undo.RecordObject(attachPoint.transform, "Move AttachmentPoint To Face Center");
        Undo.RecordObject(attachPoint, "Configure AttachmentPoint Face");
        attachPoint.transform.SetParent(voxelObject.transform);
        attachPoint.transform.SetLocalPositionAndRotation(localCenter, Quaternion.identity);
        attachPoint.activeSearch = true;
        attachPoint.showGiz = true;
        attachPoint.enabledDirs = GetSingleEnabledDir(face);

        var attachPoints = new List<AttachmentPoint>(voxelObject.GetComponentsInChildren<AttachmentPoint>(true));
        if (!attachPoints.Contains(attachPoint))
            attachPoints.Add(attachPoint);

        var buildingJoint = AssetDatabase.LoadAssetAtPath<JointInfoData>("Assets/ScriptableObjects/Joint/EnvironmentJoint.asset");

        var attachObj = entity.attachObj;
        attachObj.attachPoints = attachPoints;
        attachObj.attachmentHelper.jointData = buildingJoint;
        entity.attachObj = attachObj;
#if VOX_MOD_TOOLKIT
        SetModTkJointDataBridge(entity, buildingJoint);
#endif

        EditorUtility.SetDirty(attachPoint);
        EditorUtility.SetDirty(entity);
        EditorUtility.SetDirty(voxelObject);
        return true;
    }

    private static bool TryFindClosestWallFace(
        GameObject voxelObject,
        SolidVoxelInfo solidInfo,
        List<SnapWallCandidate> wallCandidates,
        out AttachmentFace bestFace)
    {
        bestFace = AttachmentFace.Down;
        if (wallCandidates == null || wallCandidates.Count == 0)
            return false;

        Transform targetTransform = voxelObject.transform;
        float bestScore = float.PositiveInfinity;
        bool found = false;

#if VOX_MOD_TOOLKIT
        for (int i = 0; i < ModTkAttachmentFaceVectors.Length; i++)
#else
        for (int i = 0; i < AttachmentPoint.FaceVec.Count; i++)
#endif
        {
            AttachmentFace face = (AttachmentFace)i;
            Vector3 faceLocal = GetSolidBoundsFaceCenter(solidInfo, face);
            Vector3 faceWorld = targetTransform.TransformPoint(faceLocal);
#if VOX_MOD_TOOLKIT
            Vector3 dirWorld = targetTransform.TransformDirection(ModTkAttachmentFaceVectors[i]).normalized;
#else
            Vector3 dirWorld = targetTransform.TransformDirection(AttachmentPoint.FaceVec[i]).normalized;
#endif
            foreach (SnapWallCandidate candidate in wallCandidates)
            {
                if (candidate.gameObject == null || candidate.gameObject == voxelObject || candidate.transform == null || candidate.transform.IsChildOf(targetTransform))
                    continue;

                if (Vector3.Distance(candidate.bounds.ClosestPoint(faceWorld), faceWorld) > SnapToWallMaxDistance)
                    continue;

                if (!TryGetDirectionalSolidVoxelSnapScore(candidate, faceWorld, dirWorld, out float score))
                    continue;

                if (score >= bestScore)
                    continue;

                bestScore = score;
                bestFace = face;
                found = true;
            }
        }

        return found;
    }

    private static bool TryGetDirectionalSolidVoxelSnapScore(SnapWallCandidate candidate, Vector3 faceWorld, Vector3 dirWorld, out float bestScore)
    {
        bestScore = float.PositiveInfinity;
        if (candidate.solidInfo.solidVoxels == null || candidate.solidInfo.solidVoxels.Count == 0)
            return false;

        Transform candidateTransform = candidate.transform;
        float maxForward = SnapToWallMaxDistance;
        float maxPerpendicularSqr = SnapToWallMaxDistance * SnapToWallMaxDistance;
        bool found = false;

        foreach (Vector3Int voxel in candidate.solidInfo.solidVoxels)
        {
            Vector3 world = candidateTransform.TransformPoint((Vector3)voxel);
            Vector3 delta = world - faceWorld;
            float forward = Vector3.Dot(delta, dirWorld);
            if (forward < SnapToWallMinForwardDistance || forward > maxForward)
                continue;

            float perpendicularSqr = Mathf.Max(0.0f, delta.sqrMagnitude - forward * forward);
            if (perpendicularSqr > maxPerpendicularSqr)
                continue;

            float score = forward * forward + perpendicularSqr;
            if (score >= bestScore)
                continue;

            bestScore = score;
            found = true;
        }

        return found;
    }

    private static List<SnapWallCandidate> CollectSnapWallCandidates()
    {
        var candidates = new List<SnapWallCandidate>();
        foreach (GameObject go in FindAllAuthoringVoxelObjects())
        {
            if (go == null || EditorUtility.IsPersistent(go) || !IsBuildingVoxelCandidate(go))
                continue;

            if (!TryGetSolidVoxelInfo(go, out SolidVoxelInfo solidInfo))
                continue;

            if (!TryGetSnapCandidateBounds(go, solidInfo, out Bounds bounds))
                continue;

            candidates.Add(new SnapWallCandidate
            {
                gameObject = go,
                transform = go.transform,
                bounds = bounds,
                solidInfo = solidInfo
            });
        }

        return candidates;
    }

    private static bool TryGetSnapCandidateBounds(GameObject voxelObject, SolidVoxelInfo solidInfo, out Bounds bounds)
    {
        if (TryGetDoorBounds(voxelObject, out bounds))
            return true;

        return TryGetSolidWorldBounds(voxelObject, solidInfo, out bounds);
    }

    private static bool TryGetSolidWorldBounds(GameObject voxelObject, SolidVoxelInfo solidInfo, out Bounds worldBounds)
    {
        worldBounds = default;
        Transform transform = voxelObject.transform;
        Vector3 min = solidInfo.min;
        Vector3 max = solidInfo.max;
        bool initialized = false;

        for (int x = 0; x <= 1; x++)
        for (int y = 0; y <= 1; y++)
        for (int z = 0; z <= 1; z++)
        {
            Vector3 local = new Vector3(
                x == 0 ? min.x : max.x,
                y == 0 ? min.y : max.y,
                z == 0 ? min.z : max.z);
            Vector3 world = transform.TransformPoint(local);
            if (!initialized)
            {
                worldBounds = new Bounds(world, Vector3.zero);
                initialized = true;
            }
            else
            {
                worldBounds.Encapsulate(world);
            }
        }

        return initialized;
    }

    private static AttachmentPoint FindOrCreateSwitchAttachmentPoint(GameObject voxelObject)
    {
        foreach (AttachmentPoint point in voxelObject.GetComponentsInChildren<AttachmentPoint>(true))
        {
            if (point.name == "AttachPoint")
                return point;
        }

        AttachmentPoint existing = voxelObject.GetComponentInChildren<AttachmentPoint>(true);
        if (existing != null)
            return existing;

        var attachGo = new GameObject("AttachPoint");
        Undo.RegisterCreatedObjectUndo(attachGo, "Create AttachPoint");
        attachGo.transform.SetParent(voxelObject.transform);
        return attachGo.AddComponent<AttachmentPoint>();
    }

    private static Vector3 GetSolidBoundsFaceCenter(SolidVoxelInfo solidInfo, AttachmentFace face)
    {
        Vector3 center = new Vector3(
            (solidInfo.min.x + solidInfo.max.x) * 0.5f,
            (solidInfo.min.y + solidInfo.max.y) * 0.5f,
            (solidInfo.min.z + solidInfo.max.z) * 0.5f);

        switch (face)
        {
            case AttachmentFace.Up:
                center.y = solidInfo.max.y;
                break;
            case AttachmentFace.Down:
                center.y = solidInfo.min.y;
                break;
            case AttachmentFace.Right:
                center.x = solidInfo.max.x;
                break;
            case AttachmentFace.Left:
                center.x = solidInfo.min.x;
                break;
            case AttachmentFace.Front:
                center.z = solidInfo.max.z;
                break;
            case AttachmentFace.Back:
                center.z = solidInfo.min.z;
                break;
        }

        return center;
    }

    private static bool[] GetSingleEnabledDir(AttachmentFace face)
    {
        var enabledDirs = new bool[6];
        enabledDirs[(int)face] = true;
        return enabledDirs;
    }

    private static bool TryFindBottomCornerSolidVoxel(SolidVoxelInfo solidInfo, Vector3Int corner, out Vector3Int supportVoxel)
    {
        supportVoxel = Vector3Int.zero;
        if (!solidInfo.hasVoxels || solidInfo.solidVoxels == null || solidInfo.solidVoxels.Count == 0)
            return false;

        int bottomBandMaxY = solidInfo.min.y + Mathf.CeilToInt(DefaultUnyieldingAreaHeight);
        bool found = false;
        float bestScore = float.PositiveInfinity;

        foreach (Vector3Int voxel in solidInfo.solidVoxels)
        {
            if (voxel.y > bottomBandMaxY)
                continue;

            float xzDistanceSq = (voxel.x - corner.x) * (voxel.x - corner.x) +
                                 (voxel.z - corner.z) * (voxel.z - corner.z);
            float yDistance = voxel.y - solidInfo.min.y;
            float score = xzDistanceSq * 100.0f + yDistance;
            if (score >= bestScore)
                continue;

            bestScore = score;
            supportVoxel = voxel;
            found = true;
        }

        if (found)
            return true;

        foreach (Vector3Int voxel in solidInfo.solidVoxels)
        {
            float xzDistanceSq = (voxel.x - corner.x) * (voxel.x - corner.x) +
                                 (voxel.z - corner.z) * (voxel.z - corner.z);
            float yDistance = voxel.y - solidInfo.min.y;
            float score = xzDistanceSq * 100.0f + yDistance;
            if (score >= bestScore)
                continue;

            bestScore = score;
            supportVoxel = voxel;
            found = true;
        }

        return found;
    }

    private static void CreateOrMoveCornerUnyieldingArea(GameObject voxelObject, string areaName, Vector3Int supportVoxel)
    {
        Transform existing = voxelObject.transform.Find(areaName);
        GameObject areaObject;
        if (existing == null)
        {
            areaObject = new GameObject(areaName);
            Undo.RegisterCreatedObjectUndo(areaObject, "Create Corner UnyieldingArea");
            areaObject.transform.SetParent(voxelObject.transform);
        }
        else
        {
            areaObject = existing.gameObject;
            Undo.RegisterFullObjectHierarchyUndo(areaObject, "Move Corner UnyieldingArea");
        }

        areaObject.transform.SetLocalPositionAndRotation(
            new Vector3(supportVoxel.x, supportVoxel.y + DefaultUnyieldingAreaHeight * 0.5f, supportVoxel.z),
            Quaternion.identity);
        areaObject.transform.localScale = Vector3.one;

        if (areaObject.GetComponent<UnyieldingArea>() == null)
            Undo.AddComponent<UnyieldingArea>(areaObject);

        var box = areaObject.GetComponent<BoxCollider>();
        if (box == null)
            box = Undo.AddComponent<BoxCollider>(areaObject);
        box.isTrigger = true;
        box.center = Vector3.zero;
        box.size = new Vector3(DefaultUnyieldingAreaSizeXZ, DefaultUnyieldingAreaHeight, DefaultUnyieldingAreaSizeXZ);
#if USE_PX5
        if (areaObject.GetComponent<Px5.Unity.PxConverter>() == null)
            Undo.AddComponent<Px5.Unity.PxConverter>(areaObject);
#endif
        EditorUtility.SetDirty(areaObject);
        EditorUtility.SetDirty(box);
    }

    private static bool TryGetSolidVoxelInfo(GameObject voxelObject, out SolidVoxelInfo solidInfo)
    {
        solidInfo = new SolidVoxelInfo
        {
            hasVoxels = false,
            min = new Vector3Int(int.MaxValue, int.MaxValue, int.MaxValue),
            max = new Vector3Int(int.MinValue, int.MinValue, int.MinValue),
            bottomVoxel = Vector3Int.zero,
            solidVoxels = new List<Vector3Int>()
        };

#if VOX_MOD_TOOLKIT
        if (voxelObject.GetComponent<VoxelObjectProxy>() == null)
            return false;

        if (!ModTkVoxelAuthoringUtility.TryGetSolidBounds(voxelObject, out var bounds))
            return false;

        solidInfo.hasVoxels = true;
        solidInfo.min = bounds.min;
        solidInfo.max = bounds.max;
        solidInfo.bottomVoxel = bounds.bottomVoxel;
        solidInfo.solidVoxels = bounds.solidVoxels != null
            ? new List<Vector3Int>(bounds.solidVoxels)
            : new List<Vector3Int>();
        return true;
#else
        var voxelVolume = voxelObject.GetComponent<VoxelVolume>();
        if (voxelVolume == null)
            return false;

        if (TryGetSolidVoxelInfoFromSaveData(voxelObject, ref solidInfo))
            return true;

        var pointData = voxelVolume.GetPointDataArray();
        if (!pointData.IsCreated || pointData.Length == 0)
            return false;

        return FillSolidVoxelInfo(
            pointData,
            new int3(voxelVolume.numPointsX, voxelVolume.numPointsY, voxelVolume.numPointsZ),
            ref solidInfo);
#endif
    }

#if !VOX_MOD_TOOLKIT
    private static bool TryGetSolidVoxelInfoFromSaveData(GameObject voxelObject, ref SolidVoxelInfo solidInfo)
    {
        var loader = voxelObject.GetComponent<VoxelVolumeSaveSystem>();
        if (loader == null || string.IsNullOrWhiteSpace(loader.dataName))
            return false;

        VoxelVolumeInfo info = null;
        try
        {
            info = VoxelVolumeLoader.Load(loader.dataName)?.Parse();
            if (info == null)
                return false;

            return FillSolidVoxelInfo(info.voxelData, info.numPoints, ref solidInfo);
        }
        catch
        {
            return false;
        }
        finally
        {
            info?.Dispose();
        }
    }

    private static bool FillSolidVoxelInfo(NativeArray<PointDataV2> pointData, int3 numPoints, ref SolidVoxelInfo solidInfo)
    {
        if (!pointData.IsCreated || pointData.Length == 0)
            return false;

        int numPointsYMX = numPoints.x * numPoints.y;
        for (int x = 0; x < numPoints.x; x++)
        for (int y = 0; y < numPoints.y; y++)
        for (int z = 0; z < numPoints.z; z++)
        {
            int index = z * numPointsYMX + y * numPoints.x + x;
            if (index < 0 || index >= pointData.Length || !pointData[index].IsSolid())
                continue;

            var pos = new Vector3Int(x, y, z);
            if (!solidInfo.hasVoxels || y < solidInfo.min.y)
                solidInfo.bottomVoxel = pos;

            solidInfo.hasVoxels = true;
            solidInfo.min = Vector3Int.Min(solidInfo.min, pos);
            solidInfo.max = Vector3Int.Max(solidInfo.max, pos);
            solidInfo.solidVoxels.Add(pos);
        }

        return solidInfo.hasVoxels;
    }
#endif

    private static bool HasSolidVoxelInUnyieldingArea(SolidVoxelInfo solidInfo, Vector3 center)
    {
        float halfX = DefaultUnyieldingAreaSizeXZ * 0.5f;
        float halfY = DefaultUnyieldingAreaHeight * 0.5f;
        float halfZ = DefaultUnyieldingAreaSizeXZ * 0.5f;

        foreach (Vector3Int voxel in solidInfo.solidVoxels)
        {
            if (voxel.x >= center.x - halfX && voxel.x <= center.x + halfX &&
                voxel.y >= center.y - halfY && voxel.y <= center.y + halfY &&
                voxel.z >= center.z - halfZ && voxel.z <= center.z + halfZ)
                return true;
        }

        return false;
    }

    private static void DestroyIfExists<T>(GameObject go) where T : Component
    {
        var component = go.GetComponent<T>();
        if (component != null)
            Undo.DestroyObjectImmediate(component);
    }

    private bool DrawTargetList(
        List<GameObject> targets,
        ref Vector2 scrollPosition,
        string dropLabel,
        string addSelectedLabel,
        GameObjectAdder addTarget)
    {
        bool changed = DrawTargetDropArea(dropLabel, addTarget);

        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        for (int i = 0; i < targets.Count; i++)
        {
            EditorGUILayout.BeginHorizontal();
            targets[i] = (GameObject)EditorGUILayout.ObjectField(targets[i], typeof(GameObject), true);
            if (GUILayout.Button("-", GUILayout.Width(24)))
            {
                targets.RemoveAt(i);
                changed = true;
                i--;
            }
            EditorGUILayout.EndHorizontal();
        }
        EditorGUILayout.EndScrollView();

        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button(addSelectedLabel))
        {
            foreach (GameObject go in Selection.gameObjects)
                changed |= addTarget(go);
        }
        if (GUILayout.Button("Clear"))
        {
            if (targets.Count > 0)
                changed = true;
            targets.Clear();
        }
        EditorGUILayout.EndHorizontal();

        return changed;
    }

    private void DrawReadonlyTargetList(List<GameObject> targets, ref Vector2 scrollPosition, string label, string addSelectedLabel = "Add Selected Voxels")
    {
        EditorGUILayout.LabelField(label, EditorStyles.boldLabel);
        using (new EditorGUI.DisabledScope(true))
        {
            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
            for (int i = 0; i < targets.Count; i++)
                EditorGUILayout.ObjectField(targets[i], typeof(GameObject), true);
            EditorGUILayout.EndScrollView();

            EditorGUILayout.BeginHorizontal();
            GUILayout.Button(addSelectedLabel);
            GUILayout.Button("Clear");
            EditorGUILayout.EndHorizontal();
        }
    }

    private bool DrawTargetDropArea(string label, GameObjectAdder addTarget)
    {
        bool changed = false;
        Rect rect = GUILayoutUtility.GetRect(0, 56, GUILayout.ExpandWidth(true));
        GUI.Box(rect, label, EditorStyles.helpBox);

        Event evt = Event.current;
        if (!rect.Contains(evt.mousePosition))
            return false;

        if (evt.type != EventType.DragUpdated && evt.type != EventType.DragPerform)
            return false;

        DragAndDrop.visualMode = DragAndDropVisualMode.Copy;
        if (evt.type == EventType.DragPerform)
        {
            DragAndDrop.AcceptDrag();
            foreach (Object obj in DragAndDrop.objectReferences)
            {
                if (obj is GameObject go)
                    changed |= addTarget(go);
            }
        }
        evt.Use();
        return changed;
    }

    private void CleanupMissingRoots()
    {
        roots.RemoveAll(go => go == null || EditorUtility.IsPersistent(go));
    }

    private void CleanupMissingTypeSwitchTargets()
    {
        typeSwitchTargets.RemoveAll(go => go == null || EditorUtility.IsPersistent(go) || !IsAuthoringVoxelObject(go));
    }

    private void CleanupMissingBatchDoors()
    {
        batchDoors.RemoveAll(go => go == null || EditorUtility.IsPersistent(go) || !IsAuthoringVoxelObject(go));
    }

    private bool AddRoot(GameObject go)
    {
        if (go == null || EditorUtility.IsPersistent(go) || roots.Contains(go))
            return false;

        statusMessage = null;
        roots.Add(go);
        if (roots.Count == 1)
            outputName = StripTypePrefix(go.name) + "_Merged";
        return true;
    }

    private bool AddTypeSwitchTarget(GameObject go)
    {
        if (go == null || EditorUtility.IsPersistent(go) || typeSwitchTargets.Contains(go))
            return false;
        if (!IsAuthoringVoxelObject(go))
            return false;

        statusMessage = null;
        typeSwitchTargets.Add(go);
        return true;
    }

    private bool AddBatchDoor(GameObject go)
    {
        if (go == null || EditorUtility.IsPersistent(go) || batchDoors.Contains(go))
            return false;
        if (!IsAuthoringVoxelObject(go))
            return false;

        statusMessage = null;
        ClearDoorAnchor();
        batchDoors.Add(go);
        return true;
    }

#if !VOX_MOD_TOOLKIT
    private void Merge()
    {
        List<GameObject> normalizedRoots = NormalizeRoots(roots);
        if (normalizedRoots.Count == 0)
        {
            EditorUtility.DisplayDialog("Merge Voxel Volumes", "No valid scene nodes selected.", "OK");
            return;
        }

        if (deleteOriginalRoots && !EditorUtility.DisplayDialog(
                "Merge Voxel Volumes",
                "This will delete the selected original nodes after creating the merged voxel volume.",
                "Merge",
                "Cancel"))
            return;

        List<SourceVolume> sources = CollectSources(normalizedRoots);
        if (sources.Count == 0)
        {
            EditorUtility.DisplayDialog("Merge Voxel Volumes", "No VoxelVolume with VoxelVolumeSaveSystem data was found.", "OK");
            return;
        }

        try
        {
            MergeSources(normalizedRoots, sources);
        }
        finally
        {
            foreach (var source in sources)
                source.info?.Dispose();
        }
    }

    private static List<GameObject> NormalizeRoots(List<GameObject> input)
    {
        var valid = input.Where(go => go != null && !EditorUtility.IsPersistent(go)).Distinct().ToList();
        return valid.Where(go => !valid.Any(other => other != go && go.transform.IsChildOf(other.transform))).ToList();
    }

    private static List<SourceVolume> CollectSources(List<GameObject> normalizedRoots)
    {
        var sources = new List<SourceVolume>();
        foreach (GameObject root in normalizedRoots)
        {
            foreach (VoxelVolume volume in root.GetComponentsInChildren<VoxelVolume>(true))
            {
                var saveSystem = volume.GetComponent<VoxelVolumeSaveSystem>();
                if (saveSystem == null || string.IsNullOrWhiteSpace(saveSystem.dataName))
                    continue;

                IVoxelVolumeSaveData raw;
                try
                {
                    raw = VoxelVolumeLoader.Load(saveSystem.dataName);
                }
                catch
                {
                    Debug.LogWarning($"[VoxelVolumeMerge] Failed to load data '{saveSystem.dataName}' on {volume.name}.");
                    continue;
                }

                VoxelVolumeInfo info;
                try
                {
                    info = raw?.Parse();
                }
                catch
                {
                    Debug.LogWarning($"[VoxelVolumeMerge] Failed to parse data '{saveSystem.dataName}' on {volume.name}.");
                    continue;
                }

                if (info == null)
                {
                    Debug.LogWarning($"[VoxelVolumeMerge] Failed to load data '{saveSystem.dataName}' on {volume.name}.");
                    continue;
                }

                sources.Add(new SourceVolume
                {
                    root = root,
                    volume = volume,
                    saveSystem = saveSystem,
                    info = info,
                    type = DetectType(volume.gameObject)
                });
            }
        }

        return sources;
    }

    private void MergeSources(List<GameObject> normalizedRoots, List<SourceVolume> sources)
    {
#if VOX_MOD_TOOLKIT
        return;
#else
        SourceVolume representative = sources[0];
        VoxelSceneTypeSwitch.VoxelSceneType dominantType = GetDominantType(sources);
        string prefix = GetPrefix(dominantType);
        string safeBaseName = MakeSafeName(StripTypePrefix(outputName));
        string dataName = prefix + safeBaseName;

        Transform parent = normalizedRoots[0].transform.parent;
        Matrix4x4 worldToMergeLocal = representative.volume.transform.worldToLocalMatrix;

        List<(Vector3Int pos, PointDataV2 data)> mergedVoxels = GatherMergedVoxels(sources, worldToMergeLocal);
        if (mergedVoxels.Count == 0)
        {
            EditorUtility.DisplayDialog("Merge Voxel Volumes", "Selected volumes contain no solid voxels.", "OK");
            return;
        }

        Vector3Int min = mergedVoxels[0].pos;
        Vector3Int max = mergedVoxels[0].pos;
        foreach (var voxel in mergedVoxels)
        {
            min = Vector3Int.Min(min, voxel.pos);
            max = Vector3Int.Max(max, voxel.pos);
        }

        int3 voxelSize = new int3(max.x - min.x + 1, max.y - min.y + 1, max.z - min.z + 1);
        VoxelVolumeLoader.GuessChunkSizeAndPerAxis(voxelSize, out int3 chunkCount, out int3 cubesPerChunk);
        int3 actualSize = chunkCount * cubesPerChunk;

        int totalPoints = (actualSize.x + 1) * (actualSize.y + 1) * (actualSize.z + 1);
        var mergedData = new NativeArray<PointDataV2>(totalPoints, Allocator.Persistent, NativeArrayOptions.ClearMemory);

        int strideX = actualSize.x;
        int strideYMX = actualSize.x * actualSize.y;
        foreach (var voxel in mergedVoxels)
        {
            Vector3Int local = voxel.pos - min;
            int index = local.z * strideYMX + local.y * strideX + local.x;
            if (index >= 0 && index < mergedData.Length)
                mergedData[index] = voxel.data;
        }

        var mergedInfo = new VoxelVolumeInfo(chunkCount, cubesPerChunk, mergedData);
        VoxelVolumeSaveDataV2 saveData = mergedInfo.BuildSaveData();
        string filePath = VoxelVolumeLoader.Save(saveData, dataName);
        mergedInfo.Dispose();

        string assetPath = ToAssetPath(filePath);
        AssetDatabase.ImportAsset(assetPath, ImportAssetOptions.ForceUpdate);
        AssetDatabase.Refresh();

        GameObject mergedObject = CreateMergedObject(
            parent,
            representative,
            dominantType,
            prefix + safeBaseName,
            dataName,
            chunkCount,
            cubesPerChunk,
            new Vector3Int(voxelSize.x, voxelSize.y, voxelSize.z),
            representative.volume.transform.TransformPoint(min));

        UpdateVoxelSceneMainVolume(normalizedRoots, sources, mergedObject.GetComponent<VoxelVolume>());

        if (deleteOriginalRoots)
        {
            foreach (GameObject root in normalizedRoots)
            {
                if (root != null && root != mergedObject)
                    Undo.DestroyObjectImmediate(root);
            }
        }

        if (regeneratePreview)
            CreateEditorPreview(mergedObject, normalizedRoots);

        Selection.activeGameObject = mergedObject;
        EditorGUIUtility.PingObject(mergedObject);
        roots.Clear();
        statusMessage = $"Merge succeeded: {sources.Count} volume(s), {mergedVoxels.Count} solid voxel(s) -> {dataName}";
        Repaint();
            // Debug.Log($"[VoxelVolumeMerge] Merged {sources.Count} volume(s), {mergedVoxels.Count} solid voxel(s), saved data to {assetPath}.");
#endif
    }

    private static void CreateEditorPreview(GameObject mergedObject, List<GameObject> normalizedRoots)
    {
        VoxelScene scene = normalizedRoots
            .Select(root => root != null ? root.GetComponentInParent<VoxelScene>() : null)
            .FirstOrDefault(s => s != null);

        if (scene != null && scene.associatedVoxelDataTrans)
            scene.associatedVoxelDataTrans.gameObject.SetActive(true);

        var volume = mergedObject.GetComponent<VoxelVolume>();
        if (volume == null)
            return;

        volume.CreateEditorMesh();
        EditorUtility.SetDirty(volume);
        EditorUtility.SetDirty(mergedObject);
    }

    private static List<(Vector3Int pos, PointDataV2 data)> GatherMergedVoxels(List<SourceVolume> sources, Matrix4x4 worldToMergeLocal)
    {
        var merged = new List<(Vector3Int pos, PointDataV2 data)>();
        var occupied = new HashSet<Vector3Int>();

        foreach (var source in sources)
        {
            VoxelVolumeInfo info = source.info;
            int npX = info.numPoints.x;
            int npY = info.numPoints.y;
            int npZ = info.numPoints.z;
            int npYMX = npX * npY;
            NativeArray<PointDataV2> data = info.voxelData;

            for (int z = 0; z < npZ; z++)
            for (int y = 0; y < npY; y++)
            for (int x = 0; x < npX; x++)
            {
                int index = z * npYMX + y * npX + x;
                PointDataV2 point = data[index];
                if (point.ID == 0)
                    continue;

                Vector3 world = source.volume.transform.TransformPoint(new Vector3(x, y, z));
                Vector3 local = worldToMergeLocal.MultiplyPoint3x4(world);
                var pos = new Vector3Int(
                    Mathf.RoundToInt(local.x),
                    Mathf.RoundToInt(local.y),
                    Mathf.RoundToInt(local.z));

                if (!occupied.Add(pos))
                {
                    for (int i = merged.Count - 1; i >= 0; i--)
                    {
                        if (merged[i].pos == pos)
                        {
                            merged[i] = (pos, point);
                            break;
                        }
                    }
                    continue;
                }

                merged.Add((pos, point));
            }
        }

        return merged;
    }

#if !VOX_MOD_TOOLKIT
    private static GameObject CreateMergedObject(
        Transform parent,
        SourceVolume representative,
        VoxelSceneTypeSwitch.VoxelSceneType type,
        string objectName,
        string dataName,
        int3 chunkCount,
        int3 cubesPerChunk,
        Vector3Int solidSize,
        Vector3 worldPosition)
    {
        GameObject go = new GameObject(objectName);
        Undo.RegisterCreatedObjectUndo(go, "Merge Voxel Volumes");
        go.transform.SetParent(parent, false);
        go.transform.SetPositionAndRotation(worldPosition, representative.volume.transform.rotation);
        go.transform.localScale = representative.volume.transform.localScale;
        go.layer = representative.volume.gameObject.layer;
        go.tag = representative.volume.gameObject.tag;

        var volume = go.AddComponent<VoxelVolume>();
        CopyVoxelVolumeSettings(representative.volume, volume);
        volume.chunkCountX = chunkCount.x;
        volume.chunkCountY = chunkCount.y;
        volume.chunkCountZ = chunkCount.z;
        volume.cubeCountsPerAxisInAChunk = cubesPerChunk;

        var saveSystem = go.AddComponent<VoxelVolumeSaveSystem>();
        saveSystem.dataName = dataName;
        saveSystem.loadOnStart = representative.saveSystem.loadOnStart;

        go.AddComponent<VoxelSpecialEffectHandler>();

        var typeSwitch = go.AddComponent<VoxelSceneTypeSwitch>();
        ApplyType(go, typeSwitch, type, representative, solidSize);

        return go;
    }
#endif

    private static void CopyVoxelVolumeSettings(VoxelVolume source, VoxelVolume target)
    {
        target.material = source.material;
        target.emissionPassMaterial = source.emissionPassMaterial;
        target.emissionOutlinePassMaterial = source.emissionOutlinePassMaterial;
        target.transparentPassMaterial = source.transparentPassMaterial;
        target.facePassMaterial = source.facePassMaterial;
        target.layerID = source.layerID;
        target.gameplayTag = source.gameplayTag;
        target.MeshLodCount = source.MeshLodCount;
        target.isoLevel = source.isoLevel;
        target.checkConnectivity = source.checkConnectivity;
        target.HideMeshSideFlag = source.HideMeshSideFlag;
        target.renderQueue = source.renderQueue;
        target.ticking = source.ticking;
    }

    private static void ApplyType(GameObject go, VoxelSceneTypeSwitch typeSwitch, VoxelSceneTypeSwitch.VoxelSceneType type, SourceVolume representative, Vector3Int solidSize)
    {
        switch (type)
        {
            case VoxelSceneTypeSwitch.VoxelSceneType.A_Static:
                go.tag = "Floor";
                go.layer = LayerMasksHelper.layerMask_Building;
                go.AddComponent<EntityBuilding>();
                EnsureVoxelColliderGenerator(go, representative);
                EnsureRigidbodyAndConverter(go, representative, true);
                ConfigureVolumeForType(go, false, LayerMasksHelper.layerMask_Building);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic:
                go.tag = "Untagged";
                go.layer = LayerMasksHelper.layerMask_Item;
                EnsureDynamicComponents(go, representative, false);
                ConfigureVolumeForType(go, true, LayerMasksHelper.layerMask_Item);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected:
                go.tag = "Untagged";
                go.layer = LayerMasksHelper.layerMask_Item;
                EnsureDynamicComponents(go, representative, true);
                ConfigureVolumeForType(go, true, LayerMasksHelper.layerMask_Item);
                CreateUnyieldingArea(go, solidSize);
                break;
            case VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected:
                go.tag = "Untagged";
                go.layer = LayerMasksHelper.layerMask_Item;
                EnsureDynamicComponents(go, representative, true);
                ConfigureVolumeForType(go, true, LayerMasksHelper.layerMask_Item);
                CreateAttachmentPoint(go);
                break;
        }

        EditorUtility.SetDirty(typeSwitch);
    }

    private static void ConfigureVolumeForType(GameObject go, bool checkConnectivity, int layer)
    {
        var volume = go.GetComponent<VoxelVolume>();
        volume.checkConnectivity = checkConnectivity;
        volume.layerID = layer;
        volume.gameObject.layer = layer;
        EditorUtility.SetDirty(volume);
    }

    private static void EnsureDynamicComponents(GameObject go, SourceVolume representative, bool unyielding)
    {
        EnsureRigidbodyAndConverter(go, representative, false);
        EnsureVoxelColliderGenerator(go, representative);

        var destructor = go.AddComponent<VoxelDestructor>();
        var sourceDestructor = representative.volume.GetComponent<VoxelDestructor>();
        if (sourceDestructor != null)
        {
            destructor.massDensity = sourceDestructor.massDensity;
            destructor.indestructiable = sourceDestructor.indestructiable;
            destructor.isFortified = sourceDestructor.isFortified;
            destructor.isPoisonImmune = sourceDestructor.isPoisonImmune;
            destructor.isFireImmune = sourceDestructor.isFireImmune;
            destructor.prefabName = sourceDestructor.prefabName;
            destructor.registerFragmentEvents = sourceDestructor.registerFragmentEvents;
            destructor.preventsImpactDestructOther = sourceDestructor.preventsImpactDestructOther;
        }
        destructor.unyielding = unyielding;

        var entity = go.AddComponent<EntityDestructibleItem>();
        var sourceEntity = representative.volume.GetComponent<EntityDestructibleItem>();
        if (sourceEntity != null)
        {
            entity.ExplodeWhenDamaged = sourceEntity.ExplodeWhenDamaged;
            entity.explodeEffect = sourceEntity.explodeEffect;
            entity.explodeSoundEffect = sourceEntity.explodeSoundEffect;
        }
    }

    private static void EnsureRigidbodyAndConverter(GameObject go, SourceVolume representative, bool defaultKinematic)
    {
#if USE_PX5
        var sourcePxRb = representative.volume.GetComponent<Px5.Unity.PxRigidBody>();
        var sourceUnityRb = representative.volume.GetComponent<UnityEngine.Rigidbody>();
        var pxRb = go.GetComponent<Px5.Unity.PxRigidBody>();
        var unityRb = go.GetComponent<UnityEngine.Rigidbody>();

        if (sourceUnityRb != null && unityRb == null)
            unityRb = go.AddComponent<UnityEngine.Rigidbody>();
        if (sourcePxRb != null && pxRb == null)
            pxRb = go.AddComponent<Px5.Unity.PxRigidBody>();
        if (sourcePxRb == null && sourceUnityRb == null && pxRb == null && unityRb == null)
            pxRb = go.AddComponent<Px5.Unity.PxRigidBody>();

        if (pxRb != null)
        {
            if (sourcePxRb != null)
            {
                pxRb.mass = sourcePxRb.mass;
                pxRb.useGravity = sourcePxRb.useGravity;
                pxRb.isKinematic = sourcePxRb.isKinematic;
                pxRb.drag = sourcePxRb.drag;
                pxRb.angularDrag = sourcePxRb.angularDrag;
            }
            else
            {
                pxRb.isKinematic = defaultKinematic;
            }
        }

        if (unityRb != null)
        {
            if (sourceUnityRb != null)
            {
                unityRb.mass = sourceUnityRb.mass;
                unityRb.useGravity = sourceUnityRb.useGravity;
                unityRb.isKinematic = sourceUnityRb.isKinematic;
                unityRb.linearDamping = sourceUnityRb.linearDamping;
                unityRb.angularDamping = sourceUnityRb.angularDamping;
            }
            else
            {
                unityRb.isKinematic = defaultKinematic;
            }
        }
#else
        var rb = go.GetComponent<Rigidbody>();
        if (rb == null)
            rb = go.AddComponent<Rigidbody>();

        var sourceRb = representative.volume.GetComponent<Rigidbody>();
        if (sourceRb != null)
        {
            rb.mass = sourceRb.mass;
            rb.useGravity = sourceRb.useGravity;
            rb.isKinematic = sourceRb.isKinematic;
            rb.drag = sourceRb.drag;
            rb.angularDrag = sourceRb.angularDrag;
        }
        else
        {
            rb.isKinematic = defaultKinematic;
        }
#endif

#if USE_PX5
        if (go.GetComponent<Px5.Unity.PxConverter>() == null)
            go.AddComponent<Px5.Unity.PxConverter>();
#endif
    }

    private static void EnsureVoxelColliderGenerator(GameObject go, SourceVolume representative)
    {
        var collider = go.GetComponent<PxVoxelColliderGenerator>();
        if (collider == null)
            collider = go.AddComponent<PxVoxelColliderGenerator>();

        var sourceCollider = representative.volume.GetComponent<PxVoxelColliderGenerator>();
        if (sourceCollider != null)
        {
            collider.massDensity = sourceCollider.massDensity;
            collider.useMassFromActor = sourceCollider.useMassFromActor;
            collider.useKinematicPenetrate = sourceCollider.useKinematicPenetrate;
            collider.minPaddingSize = sourceCollider.minPaddingSize;
            collider.physicsMaterial = sourceCollider.physicsMaterial;
            collider.includeLayers = sourceCollider.includeLayers;
            collider.excludeLayers = sourceCollider.excludeLayers;
        }
        else
        {
            collider.useMassFromActor = true;
        }
    }

    private static void CreateUnyieldingArea(GameObject go, Vector3Int solidSize)
    {
        var unyieldingGo = new GameObject("UnyieldingArea");
        Undo.RegisterCreatedObjectUndo(unyieldingGo, "Create UnyieldingArea");
        unyieldingGo.transform.SetParent(go.transform);
        var center = new Vector3(
            Mathf.Max(0, solidSize.x - 1) * 0.5f,
            DefaultUnyieldingAreaHeight * 0.5f,
            Mathf.Max(0, solidSize.z - 1) * 0.5f);
        unyieldingGo.transform.SetLocalPositionAndRotation(center, Quaternion.identity);
        unyieldingGo.AddComponent<UnyieldingArea>();
        var box = unyieldingGo.AddComponent<BoxCollider>();
        box.isTrigger = true;
        box.center = Vector3.zero;
        box.size = new Vector3(DefaultUnyieldingAreaSizeXZ, DefaultUnyieldingAreaHeight, DefaultUnyieldingAreaSizeXZ);
#if USE_PX5
        unyieldingGo.AddComponent<Px5.Unity.PxConverter>();
#endif
    }

    private static void CreateAttachmentPoint(GameObject go)
    {
        var entity = go.GetComponent<EntityDestructibleItem>();
        var attachGo = new GameObject("AttachPoint");
        Undo.RegisterCreatedObjectUndo(attachGo, "Create AttachPoint");
        attachGo.transform.SetParent(go.transform);
        attachGo.transform.SetLocalPositionAndRotation(Vector3.zero, Quaternion.identity);
        var attachPoint = attachGo.AddComponent<AttachmentPoint>();
        attachPoint.activeSearch = true;
        attachPoint.showGiz = true;
        attachPoint.enabledDirs = new bool[] { true, true, true, true, true, true };
        attachPoint.transform.up = Vector3.up;

        var buildingJoint = AssetDatabase.LoadAssetAtPath<JointInfoData>("Assets/ScriptableObjects/Joint/EnvironmentJoint.asset");
        var attachObj = new AttachObj();
        attachObj.attachPoints = new List<AttachmentPoint> { attachPoint };
        attachObj.attachmentHelper.jointData = buildingJoint;
        entity.attachObj = attachObj;
    }

#endif

    private static VoxelSceneTypeSwitch.VoxelSceneType DetectType(GameObject go)
    {
#if VOX_MOD_TOOLKIT
        VoxelObjectProxy proxy = go.GetComponent<VoxelObjectProxy>();
        if (proxy != null)
        {
            switch (proxy.proxyType)
            {
                case VoxelObjectProxyType.SceneStatic:
                    return VoxelSceneTypeSwitch.VoxelSceneType.A_Static;
                case VoxelObjectProxyType.SceneDynamic:
                    return VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic;
                case VoxelObjectProxyType.SceneStrongConnected:
                    return VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected;
                case VoxelObjectProxyType.SceneWeakConnected:
                    return VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected;
            }
        }

        return DetectTypeFromName(go.name, VoxelSceneTypeSwitch.VoxelSceneType.A_Static);
#else
        var typeSwitch = go.GetComponent<VoxelSceneTypeSwitch>();
        if (typeSwitch != null)
        {
            var type = typeSwitch.DetectType();
            if (type != VoxelSceneTypeSwitch.VoxelSceneType.Unknown)
                return type;
        }

        return DetectTypeFromName(go.name, VoxelSceneTypeSwitch.VoxelSceneType.A_Static);
#endif
    }

    private static string StripTypePrefix(string name)
    {
#if VOX_MOD_TOOLKIT
        if (!string.IsNullOrEmpty(name) && name.Length >= 2 && name[1] == '_' &&
            (name[0] == 'A' || name[0] == 'B' || name[0] == 'C' || name[0] == 'D'))
            return name.Substring(2);

        return name ?? string.Empty;
#else
        return VoxelSceneTypeSwitch.StripPrefix(name);
#endif
    }

    private static VoxelSceneTypeSwitch.VoxelSceneType DetectTypeFromName(string name, VoxelSceneTypeSwitch.VoxelSceneType fallback)
    {
        if (name.StartsWith("A_")) return VoxelSceneTypeSwitch.VoxelSceneType.A_Static;
        if (name.StartsWith("B_")) return VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic;
        if (name.StartsWith("C_")) return VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected;
        if (name.StartsWith("D_")) return VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected;
        return fallback;
    }

#if !VOX_MOD_TOOLKIT
    private static VoxelSceneTypeSwitch.VoxelSceneType GetDominantType(List<SourceVolume> sources)
    {
        var counts = new Dictionary<VoxelSceneTypeSwitch.VoxelSceneType, int>();
        VoxelSceneTypeSwitch.VoxelSceneType bestType = sources[0].type;
        int bestCount = 0;

        foreach (var source in sources)
        {
            int newCount = counts.TryGetValue(source.type, out int count) ? count + 1 : 1;
            counts[source.type] = newCount;

            if (newCount > bestCount)
            {
                bestType = source.type;
                bestCount = newCount;
            }
        }

        return bestType;
    }

    private static string GetPrefix(VoxelSceneTypeSwitch.VoxelSceneType type)
    {
        switch (type)
        {
            case VoxelSceneTypeSwitch.VoxelSceneType.B_Dynamic: return "B_";
            case VoxelSceneTypeSwitch.VoxelSceneType.C_StrongConnected: return "C_";
            case VoxelSceneTypeSwitch.VoxelSceneType.D_WeakConnected: return "D_";
            default: return "A_";
        }
    }

    private static void UpdateVoxelSceneMainVolume(List<GameObject> roots, List<SourceVolume> sources, VoxelVolume mergedVolume)
    {
        VoxelScene scene = roots.Select(root => root.GetComponentInParent<VoxelScene>()).FirstOrDefault(s => s != null);
        if (scene == null)
            return;

        if (sources.Any(source => source.volume == scene.mainVoxelData))
        {
            scene.mainVoxelData = mergedVolume;
            EditorUtility.SetDirty(scene);
        }
    }

    private static string MakeSafeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "MergedVoxel";

        foreach (char c in Path.GetInvalidFileNameChars())
            name = name.Replace(c, '_');

        return name.Replace(" ", "_").Replace(":", "_");
    }

    private static string ToAssetPath(string fullPath)
    {
        fullPath = fullPath.Replace('\\', '/');
        string dataPath = Application.dataPath.Replace('\\', '/');
        if (fullPath.StartsWith(dataPath))
            return "Assets" + fullPath.Substring(dataPath.Length);
        return fullPath;
    }
#endif
}

#if !VOX_MOD_TOOLKIT
[InitializeOnLoad]
public static class VoxelSceneEditorAutoPreview
{
    private const string PrefKey = "VoxelSceneEditor_AutoPreviewSelectedVoxelVolume";
    private const string PreviewRootName = "EDITOR_DEMO_CHUNKSTRANSFORM";

    static VoxelSceneEditorAutoPreview()
    {
        Selection.selectionChanged -= OnSelectionChanged;
        Selection.selectionChanged += OnSelectionChanged;
    }

    public static bool Enabled
    {
        get => EditorPrefs.GetBool(PrefKey, false);
        set => EditorPrefs.SetBool(PrefKey, value);
    }

    public static bool TryCreatePreviewForSelection(out string statusMessage)
    {
        statusMessage = null;

        if (!Enabled || EditorApplication.isPlayingOrWillChangePlaymode)
            return false;

        GameObject[] selected = Selection.gameObjects;
        if (selected == null || selected.Length == 0)
            return false;

        int createdCount = 0;
        foreach (GameObject selectedObject in selected)
        {
            if (selectedObject == null || EditorUtility.IsPersistent(selectedObject))
                continue;

            VoxelVolume volume = selectedObject.GetComponent<VoxelVolume>();
            if (volume == null || HasPreview(volume))
                continue;

            volume.CreateEditorMesh();
            EditorUtility.SetDirty(volume);
            createdCount++;
        }

        if (createdCount == 0)
            return false;

        statusMessage = $"Auto preview created for {createdCount} selected VoxelVolume object(s).";
        SceneView.RepaintAll();
        return true;
    }

    private static bool HasPreview(VoxelVolume volume)
    {
        return volume != null && volume.transform.Find(PreviewRootName) != null;
    }

    private static void OnSelectionChanged()
    {
        TryCreatePreviewForSelection(out _);
    }
}
#endif
#endif
