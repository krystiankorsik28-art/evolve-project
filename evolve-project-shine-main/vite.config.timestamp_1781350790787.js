// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
var vite_config_default = defineConfig({
  plugins: [
    ...tanstackStart(),
    react(),
    tailwindcss(),
    tsConfigPaths(),
    nitro({ preset: "vercel" })
  ]
});
export {
  vite_config_default as default
};
