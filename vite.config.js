/** @type {import('vite').UserConfig} */
const config = {
  build: {
    minify: "terser",
    terserOptions: { output: { ascii_only: true } },
    target: "esnext",

    lib: {
      entry: "src/content.ts",
      name: "json_viewer",
      formats: ["iife"],
    },

    rollupOptions: {
      charset: "utf8",
      output: {
        chunkFileNames: `[name].js`,
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
};

export default config;
