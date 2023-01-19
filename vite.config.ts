import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: "src/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                prob: resolve(__dirname, "src/prob/index.html"),
                calc: resolve(__dirname, "src/calc/index.html"),
                dice: resolve(__dirname, "src/dice/index.html")
            }
        },
        outDir: resolve(__dirname, "dist")
    }
});