const { exec } = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
const glob = require('glob');
const fs = require('fs');

// 自动扫描 Assets/Mod/*/tsconfig.json
function discoverMods() {
    const assetsModDir = path.resolve(__dirname, '../../Assets/Mod');
    const tsconfigPattern = path.join(assetsModDir, '*/tsconfig.json').replace(/\\/g, '/');
    const tsconfigFiles = glob.sync(tsconfigPattern);

    return tsconfigFiles.map(tsconfigPath => {
        const modDir = path.dirname(tsconfigPath);
        const name = path.basename(modDir);

        // 读取 tsconfig.json 获取 outDir 和 rootDir
        let outDir = path.join(modDir, 'out');
        let srcDir = path.join(modDir, 'Scripts');
        try {
            const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
            if (tsconfig.compilerOptions) {
                if (tsconfig.compilerOptions.outDir) {
                    outDir = path.resolve(modDir, tsconfig.compilerOptions.outDir);
                }
                if (tsconfig.compilerOptions.rootDir) {
                    srcDir = path.resolve(modDir, tsconfig.compilerOptions.rootDir);
                }
            }
        } catch (e) {
            console.warn(`  警告: 无法读取 ${name}/tsconfig.json，使用默认配置`);
        }

        return {
            name,
            tsconfigPath,
            srcDir,
            outputDir: outDir
        };
    });
}

const modConfigs = discoverMods();

let compileTimeout = null;

// 修复 import 语句中的扩展名: 添加 .mjs 或 .js -> .mjs
function fixImportExtensions(dir) {
    const jsFiles = glob.sync(dir + '/*.js');

    jsFiles.forEach(filename => {
        let content = fs.readFileSync(filename, 'utf-8');

        // 替换 import 语句:
        // 1. from './xxx.js' -> from './xxx.mjs'
        // 2. from './xxx' (无扩展名) -> from './xxx.mjs'
        content = content.replace(/from\s+(['"])(\.\/[^'".]+)\1/g, "from $1$2.mjs$1");
        content = content.replace(/from\s+(['"])(\.\/[^'"]+)\.js\1/g, 'from $1$2.mjs$1');
        content = content.replace(
            /from\s+(['"])(com\.[^'"/]+(?:\.[^'"/]+)*)(?!\/index\.mjs)(?!\/[^'"]+)\1/g,
            "from $1$2/index.mjs$1"
        );

        // 重命名文件
        const mjsPath = filename.replace('.js', '.mjs');
        fs.writeFileSync(mjsPath, content, 'utf-8');
        fs.unlinkSync(filename);
    });

    return jsFiles.length;
}

function compileMod(config) {
    return new Promise((resolve) => {
        exec(`npx tsc -p "${config.tsconfigPath}"`, {
            cwd: __dirname + '/..'
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`  ✗ ${config.name} 编译失败`);
                if (stderr) console.error(stderr);
                resolve(false);
                return;
            }

            // 修复 import 扩展名并重命名文件
            const fileCount = fixImportExtensions(config.outputDir);

            console.log(`  ✓ ${config.name} 已更新 (${fileCount} 个文件)`);
            resolve(true);
        });
    });
}

async function compileAllMods() {
    console.log('\n--- 重新编译所有 Mods ---');
    for (const config of modConfigs) {
        await compileMod(config);
    }
    console.log('--- 编译完成 ---\n');
}

console.log('=== 开始监听 Mods 变化 ===\n');
console.log('监听的目录:');
modConfigs.forEach(config => {
    console.log(`  - ${config.name}: ${config.srcDir}`);
});
console.log('\n按 Ctrl+C 停止监听\n');

// 监听所有 mod 的 TypeScript 文件
const watchPaths = modConfigs.map(config => path.join(config.srcDir, '**/*.ts'));

const watcher = chokidar.watch(watchPaths, {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
});

watcher.on('add', (filePath) => {
    console.log(`文件添加: ${path.basename(filePath)}`);
    debouncedCompile();
});

watcher.on('change', (filePath) => {
    console.log(`文件修改: ${path.basename(filePath)}`);
    debouncedCompile();
});

watcher.on('unlink', (filePath) => {
    console.log(`文件删除: ${path.basename(filePath)}`);
    debouncedCompile();
});

// 防抖编译，避免短时间内多次触发
function debouncedCompile() {
    if (compileTimeout) {
        clearTimeout(compileTimeout);
    }
    compileTimeout = setTimeout(() => {
        compileAllMods();
        compileTimeout = null;
    }, 300);
}

// 初始编译一次
compileAllMods();
