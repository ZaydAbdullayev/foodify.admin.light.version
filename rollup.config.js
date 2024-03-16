import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    globals: {
      process: "process",
    },
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    builtins(),
    globals(),
    terser({
      mangle: {
        properties: true,
      },
    }),
    postcss({
      plugins: [
        require("cssnano")({
          preset: "default",
        }),
      ],
      // Extract CSS to the same location as JS file
      extract: true,
      // Minify CSS output
      minimize: true,
    }),
  ],
};
