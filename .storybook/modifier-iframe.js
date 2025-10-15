import fsSync from "fs";
import path from "path";
import fs from "fs/promises";

// 配置参数
const settings = {
    targetDir: path.resolve("./storybook-static"),
    pathReplacements: [
        { pattern: /\/?static\/js\//g, replacement: "./static/js/" },
        // { pattern: /static\/js\//g, replacement: "./static/js/" },
        { pattern: /\/?static\/css\//g, replacement: "./static/css/" },
        // { pattern: /static\/css\//g, replacement: "./static/css/" },
    ],
    textFileExtensions: new Set([".html", ".htm", ".js", ".css", ".json", ".md", ".mdx", ".ts", ".tsx", ".jsx", ".map"]),
};

/**
 * 检查文件是否为文本文件
 * @param {string} filePath - 文件路径
 * @returns {boolean} 是否为文本文件
 */
function isTextFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return settings.textFileExtensions.has(ext);
}

/**
 * 处理单个文件的路径替换
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 是否修改了文件
 */
async function processFile(filePath) {
    try {
        if (!isTextFile(filePath)) {
            console.log(`[SKIP] 二进制文件: ${path.relative(settings.targetDir, filePath)}`);
            return false;
        }

        // 读取文件内容
        const content = await fs.readFile(filePath, "utf8");
        let modifiedContent = content;
        let hasChanges = false;

        // 执行所有替换规则
        settings.pathReplacements.forEach(({ pattern, replacement }) => {
            if (pattern.test(modifiedContent)) {
                modifiedContent = modifiedContent.replace(pattern, replacement);
                hasChanges = true;
            }
        });

        // 写入修改后的内容
        if (hasChanges) {
            await fs.writeFile(filePath, modifiedContent, "utf8");
            console.log(`[UPDATED] ${path.relative(settings.targetDir, filePath)}`);
            return true;
        }

        console.log(`[UNCHANGED] ${path.relative(settings.targetDir, filePath)}`);
        return false;
    } catch (error) {
        console.error(`[ERROR] 处理文件失败 ${filePath}: ${error.message}`);
        return false;
    }
}

/**
 * 递归处理目录中的所有文件
 * @param {string} dirPath - 目录路径
 * @returns {Promise<{processed: number, updated: number}>} 处理统计
 */
async function processDirectory(dirPath) {
    const stats = { processed: 0, updated: 0 };

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                const subDirStats = await processDirectory(fullPath);
                stats.processed += subDirStats.processed;
                stats.updated += subDirStats.updated;
            } else if (entry.isFile()) {
                stats.processed++;
                const updated = await processFile(fullPath);
                if (updated) stats.updated++;
            }
        }
    } catch (error) {
        console.error(`[ERROR] 处理目录失败 ${dirPath}: ${error.message}`);
    }

    return stats;
}

/**
 * 主函数
 */
async function main() {
    console.log("=== Storybook 路径修正工具 ===");
    console.log(`目标目录: ${settings.targetDir}\n`);

    // 检查目标目录是否存在
    if (!fsSync.existsSync(settings.targetDir)) {
        console.error("错误: 未找到 storybook-static 目录，请先构建 Storybook");
        process.exit(1);
    }

    // 开始处理
    const startTime = Date.now();
    const stats = await processDirectory(settings.targetDir);
    const duration = Date.now() - startTime;

    // 输出结果
    console.log("\n=== 处理完成 ===");
    console.log(`总文件数: ${stats.processed}`);
    console.log(`修改文件数: ${stats.updated}`);
    console.log(`耗时: ${duration}ms`);
    process.exit(0);
}

// 启动程序
main();
