import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import eslint from "@rollup/plugin-eslint";
import filesize from "rollup-plugin-filesize";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";

const exportName = "canonicalUrl";
const input = "src/index.js";
const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} | ${pkg.homepage} */`;

export default [
  {
    // universal (browser and node)
    input,
    output: [
      {
        name: exportName,
        file: pkg.exports.browser.replace(".min.js", ".js"), // unminified (.js)
        format: "umd",
        exports: "default",
        esModule: false,
        banner,
      },
      {
        name: exportName,
        file: pkg.exports.browser, // minified (.min.js)
        format: "umd",
        exports: "default",
        esModule: false,
        plugins: [
          terser({
            format: {
              preamble: banner,
            },
          }),
        ],
      },
    ],
    plugins: [
      del({ targets: "dist/*" }),
      eslint(),
      resolve(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-env"]],
        exclude: ["node_modules/**"],
      }),
      copy({
        // clearly this isn't really typescript, so we need to manually copy the type definition file
        targets: [
          {
            src: input.replace(".js", ".d.ts"),
            dest: "dist",
            rename: pkg.types.replace("./dist/", ""),
          },
        ],
      }),
      filesize(),
    ],
  },
  {
    // modules
    input,
    output: [
      {
        // ES6 module (import)
        file: pkg.exports.import,
        format: "esm",
        exports: "named",
        banner: banner,
      },
      {
        // commonjs (require)
        file: pkg.exports.require,
        format: "cjs",
        exports: "named",
        banner: banner,
      },
    ],
    external: ["normalize-url"],
    plugins: [
      babel({
        babelHelpers: "bundled",
        exclude: ["node_modules/**"],
      }),
      filesize(),
    ],
  },
];
