
// Vite config with type annotation for better type checking
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

// __dirname workaround for ESM
const __dirname = path.resolve();


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
} as UserConfig);
