const { spawnSync } = require('child_process');
const chokidar = require('chokidar');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

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

function removeDirectoryContents(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return;
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);
        fs.rmSync(entryPath, { recursive: true, force: true });
    }
}

function compileToOutput(tsconfigPath, outputDir) {
    removeDirectoryContents(outputDir);

    const result = spawnSync(process.execPath, [tscCliPath, '-p', tsconfigPath, '--outDir', outputDir], {
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
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`TypeScript compile failed with exit code ${result.status ?? 1}.`);
    }

    const fileCount = fixImportExtensions(outputDir);
    if (fileCount === 0) {
        throw new Error(`No JavaScript output found in ${outputDir}`);
    }

    console.log(`Compiled ${fileCount} module(s) to ${outputDir}`);
}

const tsconfigArg = process.argv[2];
const outputDirArg = process.argv[3];

if (!tsconfigArg || !outputDirArg) {
    console.error('Usage: npm run watch:export:mod -- <tsconfig-path> <output-dir>');
    process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const resolvedTsconfigPath = path.resolve(projectRoot, tsconfigArg);
const resolvedOutputDir = path.resolve(projectRoot, outputDirArg);
const tscCliPath = path.join(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc');

if (!fs.existsSync(resolvedTsconfigPath)) {
    console.error(`tsconfig not found: ${resolvedTsconfigPath}`);
    process.exit(1);
}

if (!fs.existsSync(tscCliPath)) {
    console.error(`TypeScript compiler not found at ${tscCliPath}`);
    process.exit(1);
}

const modRoot = path.dirname(resolvedTsconfigPath);
const scriptsRoot = path.join(modRoot, 'Scripts');
if (!fs.existsSync(scriptsRoot)) {
    console.error(`Scripts folder not found: ${scriptsRoot}`);
    process.exit(1);
}

let compileTimer = null;
let compileInFlight = false;
let recompileRequested = false;

function runCompile() {
    if (compileInFlight) {
        recompileRequested = true;
        return;
    }

    compileInFlight = true;
    try {
        compileToOutput(resolvedTsconfigPath, resolvedOutputDir);
    } catch (error) {
        console.error(error && error.message ? error.message : error);
    } finally {
        compileInFlight = false;
        if (recompileRequested) {
            recompileRequested = false;
            scheduleCompile();
        }
    }
}

function scheduleCompile() {
    if (compileTimer) {
        clearTimeout(compileTimer);
    }

    compileTimer = setTimeout(() => {
        compileTimer = null;
        runCompile();
    }, 250);
}

console.log(`Watching ${scriptsRoot}`);
console.log(`Outputting compiled modules to ${resolvedOutputDir}`);
runCompile();

const watcher = chokidar.watch(path.join(scriptsRoot, '**/*.{ts,tsx}').replace(/\\/g, '/'), {
    ignored: /node_modules/,
    ignoreInitial: true,
    persistent: true
});

watcher.on('add', (filePath) => {
    console.log(`File added: ${path.basename(filePath)}`);
    scheduleCompile();
});

watcher.on('change', (filePath) => {
    console.log(`File changed: ${path.basename(filePath)}`);
    scheduleCompile();
});

watcher.on('unlink', (filePath) => {
    console.log(`File removed: ${path.basename(filePath)}`);
    scheduleCompile();
});

watcher.on('error', (error) => {
    console.error(error && error.message ? error.message : error);
});

