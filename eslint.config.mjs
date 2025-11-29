// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create FlatCompat instance for compatibility with legacy ESLint configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Export the ESLint configuration
const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals"],
    settings: {
      next: {
        rootDir: "packages/my-app", // Change this path if your app is in a different folder
      },
    },
  }),
];

export default eslintConfig;
