// eslint.config.js - ESLint 9 Flat Config 格式
import exampleConfigs from "eslint-config-way";
import { defineConfig } from "eslint/config";

export default defineConfig([
    exampleConfigs,
    {
        ignores: ["webpack/**", "src/index.html", "dist", "**/**.cjs", "**/**.d.ts"],
    },
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    args: "none",
                    caughtErrors: "none",
                },
            ],
        },
    },
]);
