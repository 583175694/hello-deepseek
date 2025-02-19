import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3030",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ""); },
            },
        },
    },
});
