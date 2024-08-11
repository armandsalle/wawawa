import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/**/**.ts"],
  outDir: "dist/",
  format: ["esm"],
  target: "node20",
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  platform: "node",
  bundle: true,
});
