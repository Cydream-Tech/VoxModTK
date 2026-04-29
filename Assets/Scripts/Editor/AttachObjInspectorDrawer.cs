using UnityEngine;
using UnityEditor;
using VoxelPlayground.Gaming;
using VoxelPlayground.Entity;
using System.Collections.Generic;

namespace VoxelPlayground.Mod
{
    // Custom property drawer for AttachObj struct
    [CustomPropertyDrawer(typeof(AttachObj))]
    public class AttachObjDrawer : PropertyDrawer
    {
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            EditorGUI.BeginProperty(position, label, property);


            // Draw the foldout header
            position.height = EditorGUIUtility.singleLineHeight;
            property.isExpanded = EditorGUI.Foldout(position, property.isExpanded, label, true);
            
            if (property.isExpanded)
            {
                // Indent the content
                EditorGUI.indentLevel++;

                // Calculate positions for each property
                position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;

                // Draw attachPoints array
                SerializedProperty attachPointsProp = property.FindPropertyRelative("attachPoints");
                if (attachPointsProp != null)
                {
                    EditorGUI.PropertyField(position, attachPointsProp, true);
                    position.y += EditorGUI.GetPropertyHeight(attachPointsProp, true) + EditorGUIUtility.standardVerticalSpacing;
                }
                
                // Draw attachmentHelper
                SerializedProperty attachmentHelperProp = property.FindPropertyRelative("attachmentHelper");
                if (attachmentHelperProp != null)
                {
                    EditorGUI.PropertyField(position, attachmentHelperProp);
                }
                
                EditorGUI.indentLevel--;
            }
            
            EditorGUI.EndProperty();
        }
        
        public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
        {
            float height = EditorGUIUtility.singleLineHeight;
            
            if (property.isExpanded)
            {
                // Base fields
                height += (EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing) * 3;
                
                // attachPoints array
                SerializedProperty attachPointsProp = property.FindPropertyRelative("attachPoints");
                if (attachPointsProp != null)
                {
                    height += EditorGUI.GetPropertyHeight(attachPointsProp, true) + EditorGUIUtility.standardVerticalSpacing;
                }
                
                // attachmentHelper
                SerializedProperty attachmentHelperProp = property.FindPropertyRelative("attachmentHelper");
                if (attachmentHelperProp != null)
                {
                    height += EditorGUI.GetPropertyHeight(attachmentHelperProp) + EditorGUIUtility.standardVerticalSpacing;
                }
            }
            
            return height;
        }
    }
    
    // Custom property drawer for AttachmentHelper struct
    [CustomPropertyDrawer(typeof(AttachmentHelper))]
    public class AttachmentHelperDrawer : PropertyDrawer
    {
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            EditorGUI.BeginProperty(position, label, property);
            
            // Draw the foldout header
            position.height = EditorGUIUtility.singleLineHeight;
            property.isExpanded = EditorGUI.Foldout(position, property.isExpanded, label, true);
            
            if (property.isExpanded)
            {
                // Indent the content
                EditorGUI.indentLevel++;
                
                // Only draw the jointData property
                position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                SerializedProperty jointDataProp = property.FindPropertyRelative("jointData");
                if (jointDataProp != null)
                {
                    EditorGUI.PropertyField(position, jointDataProp);
                }
                
                EditorGUI.indentLevel--;
            }
            
            EditorGUI.EndProperty();
        }
        
        public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
        {
            float height = EditorGUIUtility.singleLineHeight;
            
            if (property.isExpanded)
            {
                // Add height for jointData property
                SerializedProperty jointDataProp = property.FindPropertyRelative("jointData");
                if (jointDataProp != null)
                {
                    height += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    
                    // If jointData is expanded, add its height
                    if (jointDataProp.isExpanded)
                    {
                        height += EditorGUI.GetPropertyHeight(jointDataProp);
                    }
                }
            }
            
            return height;
        }
    }
}
