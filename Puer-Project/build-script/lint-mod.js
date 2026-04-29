const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');
const puerProjectRoot = path.resolve(__dirname, '..');
const modArg = process.argv[2];

if (!modArg) {
    console.error('Usage: npm run lint:mod -- <modid-or-tsconfig-path>');
    console.error('Examples:');
    console.error('  npm run lint:mod -- com.cydream.asteroid');
    console.error('  npm run lint:mod -- ..\\Assets\\Mod\\com.example.test\\tsconfig.json');
    process.exit(1);
}

function resolveTsconfig(input) {
    const candidatePaths = [];

    if (input.endsWith('.json')) {
        candidatePaths.push(path.resolve(puerProjectRoot, input));
        candidatePaths.push(path.resolve(projectRoot, input));
    } else {
        candidatePaths.push(path.resolve(projectRoot, 'Assets/Mod', input, 'tsconfig.json'));
        candidatePaths.push(path.resolve(projectRoot, 'Assets/Samples', input, 'tsconfig.json'));
    }

    return candidatePaths.find(candidate => fs.existsSync(candidate));
}

function getTscPath() {
    const ext = process.platform === 'win32' ? '.cmd' : '';
    const tscPath = path.join(puerProjectRoot, 'node_modules', '.bin', `tsc${ext}`);
    return fs.existsSync(tscPath) ? tscPath : null;
}

const tsconfigPath = resolveTsconfig(modArg);
if (!tsconfigPath) {
    console.error(`Could not find tsconfig.json for '${modArg}'.`);
    console.error('Expected one of:');
    console.error(`  ${path.join(projectRoot, 'Assets', 'Mod', modArg, 'tsconfig.json')}`);
    console.error(`  ${path.join(projectRoot, 'Assets', 'Samples', modArg, 'tsconfig.json')}`);
    process.exit(1);
}

const tscPath = getTscPath();
if (!tscPath) {
    console.error(`TypeScript compiler not found at ${path.join(puerProjectRoot, 'node_modules', '.bin')}.`);
    console.error("Run 'npm install' in the Puer-Project folder first.");
    process.exit(1);
}

console.log(`Linting TypeScript with ${path.relative(projectRoot, tsconfigPath)}\n`);

const result = spawnSync(tscPath, ['-p', tsconfigPath, '--noEmit'], {
    cwd: puerProjectRoot,
    stdio: 'inherit'
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
