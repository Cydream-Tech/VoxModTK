#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEngine;

/// <summary>
/// TypeScript compiler using esbuild. Ships the esbuild binary in the repo
/// so no Node.js/npm installation is required.
/// </summary>
internal static class TypeScriptCompiler
{
    private const string EsbuildDirectoryName = "Puer-Project/esbuild";
    private static readonly Regex RelativeImportNoExt = new Regex(
        @"from\s+(['""])(\./[^'"".]+)\1",
        RegexOptions.Compiled);
    private static readonly Regex RelativeImportJsExt = new Regex(
        @"from\s+(['""])(\./[^'""]+)\.js\1",
        RegexOptions.Compiled);
    private static readonly Regex BarePackageImport = new Regex(
        @"from\s+(['""])(com\.[^'""/]+(?:\.[^'""/]+)*)(?!/index\.mjs)(?!/[^'""]+)\1",
        RegexOptions.Compiled);

    /// <summary>
    /// Resolve the path to the esbuild binary for the current platform.
    /// </summary>
    public static string GetEsbuildPath()
    {
        var projectRoot = GetProjectRoot();
        var esbuildDir = Path.Combine(projectRoot, EsbuildDirectoryName);

        if (Application.platform == RuntimePlatform.WindowsEditor)
        {
            return Path.Combine(esbuildDir, "esbuild.exe");
        }

        if (Application.platform == RuntimePlatform.OSXEditor)
        {
            // Try ARM64 first (Apple Silicon), fall back to x64
            var arm64 = Path.Combine(esbuildDir, "esbuild-darwin-arm64");
            if (File.Exists(arm64)) return arm64;

            return Path.Combine(esbuildDir, "esbuild-darwin-x64");
        }

        // Linux / other — not currently supported but could be added
        return Path.Combine(esbuildDir, "esbuild");
    }

    /// <summary>
    /// Compile all .ts files in scriptsRoot to outputDir using esbuild.
    /// </summary>
    public static bool Compile(string scriptsRoot, string outputDir, out string errorMessage)
    {
        errorMessage = string.Empty;
        var esbuildPath = GetEsbuildPath();

        if (!File.Exists(esbuildPath))
        {
            errorMessage = $"esbuild not found at {esbuildPath}. Ensure the esbuild binary is present in {EsbuildDirectoryName}/.";
            return false;
        }

        if (!Directory.Exists(scriptsRoot))
        {
            errorMessage = $"Scripts directory not found: {scriptsRoot}";
            return false;
        }

        var tsFiles = Directory.GetFiles(scriptsRoot, "*.ts", SearchOption.AllDirectories);
        if (tsFiles.Length == 0)
        {
            errorMessage = $"No .ts files found in {scriptsRoot}";
            return false;
        }

        Directory.CreateDirectory(outputDir);

        // Build argument list: entry points + options
        var args = new StringBuilder();
        foreach (var tsFile in tsFiles)
        {
            args.Append($" \"{tsFile}\"");
        }

        args.Append(" --format=esm --target=es2016");
        args.Append($" --outdir=\"{outputDir}\"");
        args.Append(" --out-extension:.js=.mjs");

        var startInfo = new ProcessStartInfo
        {
            FileName = esbuildPath,
            Arguments = args.ToString(),
            WorkingDirectory = GetProjectRoot(),
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        try
        {
            using var process = Process.Start(startInfo);
            if (process == null)
            {
                errorMessage = "Failed to start esbuild process.";
                return false;
            }

            var stdOut = process.StandardOutput.ReadToEnd();
            var stdErr = process.StandardError.ReadToEnd();
            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                errorMessage = $"esbuild failed (exit {process.ExitCode}).\n{stdOut}\n{stdErr}".Trim();
                return false;
            }

            // Fix bare package imports and ensure .mjs extensions
            FixBareImportExtensions(outputDir);

            var mjsFiles = Directory.GetFiles(outputDir, "*.mjs", SearchOption.AllDirectories);
            if (mjsFiles.Length == 0)
            {
                errorMessage = $"esbuild produced no .mjs output in {outputDir}";
                return false;
            }

            return true;
        }
        catch (Exception e)
        {
            errorMessage = $"esbuild failed: {e.Message}";
            return false;
        }
    }

    /// <summary>
    /// Fix bare package imports (e.g. "com.cydream.utilities" → "com.cydream.utilities/index.mjs")
    /// and ensure relative imports have .mjs extensions.
    /// </summary>
    public static void FixBareImportExtensions(string outputDir)
    {
        var mjsFiles = Directory.GetFiles(outputDir, "*.mjs", SearchOption.AllDirectories);

        foreach (var file in mjsFiles)
        {
            var content = File.ReadAllText(file, Encoding.UTF8);
            var modified = false;
            var newContent = content;

            // Bare package imports: "com.xxx.yyy" → "com.xxx.yyy/index.mjs"
            var afterBare = BarePackageImport.Replace(newContent, match =>
            {
                modified = true;
                return $"from {match.Groups[1].Value}{match.Groups[2].Value}/index.mjs{match.Groups[1].Value}";
            });

            // Relative imports without extension: './foo' → './foo.mjs'
            var afterRelativeNoExt = RelativeImportNoExt.Replace(afterBare, match =>
            {
                modified = true;
                return $"from {match.Groups[1].Value}{match.Groups[2].Value}.mjs{match.Groups[1].Value}";
            });

            // Relative imports with .js extension: './foo.js' → './foo.mjs'
            var afterRelativeJs = RelativeImportJsExt.Replace(afterRelativeNoExt, match =>
            {
                modified = true;
                return $"from {match.Groups[1].Value}{match.Groups[2].Value}.mjs{match.Groups[1].Value}";
            });

            if (modified)
            {
                File.WriteAllText(file, afterRelativeJs, Encoding.UTF8);
            }
        }
    }

    /// <summary>
    /// Remove all files in a directory (not the directory itself).
    /// </summary>
    public static void CleanDirectory(string dir)
    {
        if (!Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
            return;
        }

        foreach (var entry in Directory.GetFileSystemEntries(dir))
        {
            if (File.Exists(entry))
                File.Delete(entry);
            else if (Directory.Exists(entry))
                Directory.Delete(entry, true);
        }
    }

    private static string GetProjectRoot()
    {
        return Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
    }
}
#endif
