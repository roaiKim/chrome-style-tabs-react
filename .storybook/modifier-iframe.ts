// test-modifier.js
import { promises } from "fs";
import path from "path";

async function modify() {
    console.log("修改完开始");
    const outputDir = "storybook-static";
    const filePath = path.join(outputDir, "iframe.html");

    const content = await promises.readFile(filePath, "utf8");
    const newContent = content.replace(/\/static\/js|css\//g, "./static/js/");

    await promises.writeFile(filePath, newContent, "utf8");
    console.log("修改完成");
}

modify().catch(console.error);
