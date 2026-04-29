#if UNITY_EDITOR
using UnityEditor;

public sealed class ModTextureImporter : AssetPostprocessor
{
    private void OnPreprocessTexture()
    {
        if (assetImporter is not TextureImporter textureImporter)
        {
            return;
        }

        textureImporter.textureCompression = TextureImporterCompression.Uncompressed;
        textureImporter.isReadable = true;
    }
}
#endif
