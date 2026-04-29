using UnityEditor;
using UnityEngine;

namespace VoxelPlayground.Mod.Editor
{
    [CustomPropertyDrawer(typeof(SemanticVersion))]
    public class SemanticVersionDrawer : PropertyDrawer
    {
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            EditorGUI.BeginProperty(position, label, property);

            var majorProp = property.FindPropertyRelative("major");
            var minorProp = property.FindPropertyRelative("minor");
            var patchProp = property.FindPropertyRelative("patch");

            string versionString = $"{majorProp.intValue}.{minorProp.intValue}.{patchProp.intValue}";

            position = EditorGUI.PrefixLabel(position, GUIUtility.GetControlID(FocusType.Passive), label);

            EditorGUI.BeginChangeCheck();
            string newVersion = EditorGUI.TextField(position, versionString);
            if (EditorGUI.EndChangeCheck())
            {
                var parsed = SemanticVersion.Parse(newVersion);
                majorProp.intValue = parsed.major;
                minorProp.intValue = parsed.minor;
                patchProp.intValue = parsed.patch;
            }

            EditorGUI.EndProperty();
        }
    }
}
