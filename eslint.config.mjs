import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist/**",
    ".astro/**",
    ".wrangler/**",
    "node_modules/**",
    "functions/**",
  ]),
]);
