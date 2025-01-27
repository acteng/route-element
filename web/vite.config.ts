import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  base: "/route-element/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        element: resolve(__dirname, "elements.html"),
        forms: resolve(__dirname, "forms.html"),
      },
    },
  },
  plugins: [svelte(), wasmPack(["../backend"], ["route-snapper"])]
})
