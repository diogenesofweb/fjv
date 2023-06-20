/** @type {import('vite').UserConfig} */
const config = {
  build: {
    lib: {
      entry: "src/content.ts",
      name: "json_viewer",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        chunkFileNames: `[name].js`,
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
};

export default config;
