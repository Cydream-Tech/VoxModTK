const { execSync } = require('child_process');
const path = require('path');
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

        // 读取 tsconfig.json 获取 outDir
        let outDir = path.join(modDir, 'out'); // 默认 out 目录
        try {
            const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
            if (tsconfig.compilerOptions && tsconfig.compilerOptions.outDir) {
                outDir = path.resolve(modDir, tsconfig.compilerOptions.outDir);
            }
        } catch (e) {
            console.warn(`  警告: 无法读取 ${name}/tsconfig.json，使用默认 out 目录`);
        }

        return {
            name,
            tsconfigPath,
            outputDir: outDir
        };
    });
}

const modConfigs = discoverMods();

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

console.log('=== 开始编译 Mods ===\n');

modConfigs.forEach(config => {
    console.log(`正在编译 ${config.name}...`);

    try {
        // 使用 tsc 编译
        execSync(`npx tsc -p "${config.tsconfigPath}"`, {
            stdio: 'inherit',
            cwd: __dirname + '/..'
        });

        // 修复 import 扩展名并重命名文件
        const fileCount = fixImportExtensions(config.outputDir);

        console.log(`  ✓ ${config.name} 编译完成 (${fileCount} 个文件)\n`);
    } catch (error) {
        console.error(`  ✗ ${config.name} 编译失败\n`);
    }
});

console.log('=== Mods 编译完成 ===');
