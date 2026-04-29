const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixImportExtensions(dir) {
    const jsFiles = glob.sync(path.join(dir, '**/*.js').replace(/\\/g, '/'));

    jsFiles.forEach((filename) => {
        let content = fs.readFileSync(filename, 'utf-8');

        content = content.replace(/from\s+(['"])(\.\/[^'".]+)\1/g, "from $1$2.mjs$1");
        content = content.replace(/from\s+(['"])(\.\/[^'"]+)\.js\1/g, 'from $1$2.mjs$1');
        content = content.replace(
            /from\s+(['"])(com\.[^'"/]+(?:\.[^'"/]+)*)(?!\/index\.mjs)(?!\/[^'"]+)\1/g,
            "from $1$2/index.mjs$1"
        );

        const mjsPath = filename.replace(/\.js$/i, '.mjs');
        fs.writeFileSync(mjsPath, content, 'utf-8');
        fs.unlinkSync(filename);
    });

    return jsFiles.length;
}

const tsconfigPath = process.argv[2];
const outputDir = process.argv[3];

if (!tsconfigPath || !outputDir) {
    console.error('Usage: npm run export:mod -- <tsconfig-path> <output-dir>');
    process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const resolvedTsconfigPath = path.resolve(projectRoot, tsconfigPath);
const resolvedOutputDir = path.resolve(projectRoot, outputDir);
const tscCliPath = path.join(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc');

if (!fs.existsSync(resolvedTsconfigPath)) {
    console.error(`tsconfig not found: ${resolvedTsconfigPath}`);
    process.exit(1);
}

if (!fs.existsSync(tscCliPath)) {
    console.error(`TypeScript compiler not found at ${tscCliPath}`);
    process.exit(1);
}

fs.mkdirSync(resolvedOutputDir, { recursive: true });

const result = spawnSync(process.execPath, [tscCliPath, '-p', resolvedTsconfigPath, '--outDir', resolvedOutputDir], {
    cwd: projectRoot,
    encoding: 'utf-8'
});

if (result.stdout) {
    process.stdout.write(result.stdout);
}

if (result.stderr) {
    process.stderr.write(result.stderr);
}

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
}

const fileCount = fixImportExtensions(resolvedOutputDir);
if (fileCount === 0) {
    console.error(`No JavaScript output found in ${resolvedOutputDir}`);
    process.exit(1);
}

console.log(`Exported ${fileCount} module(s) to ${resolvedOutputDir}`);
