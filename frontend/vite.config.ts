import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { minify, Options } from "html-minifier-terser";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', 
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    // proxy: {
    //   "/": "http://localhost:7000",
    // },  
  },
  preview: {
    port:7000,
    strictPort: true,
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    {
      name: "html-transform",
      enforce: "pre",
      transformIndexHtml(html: string): Promise<string> {
        const options: Options = {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        };
 
        return minify(html, options); 
      },
    },
  ],
  build: {
    rollupOptions: {
      input: { 
        index: resolve(__dirname, "index.html"), 
        // add more for MPA
        // app: resolve(__dirname, "app.html"), 
      },
    },
    manifest: true,
    sourcemap:false
  },
})
