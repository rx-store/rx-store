import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import ts from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const env = process.env.NODE_ENV;

const config = {
  input: "src/index.ts",
  external: Object.keys(pkg.peerDependencies || {}).concat("react-dom"),
  output: {
    format: "umd",
    name: "ReactRxStore",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
  plugins: [
    ts(),
    nodeResolve(),
    babel({
      exclude: "**/node_modules/**",
      runtimeHelpers: true,
      extensions: [".ts", ".tsx"],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env),
    }),
    commonjs({
      namedExports: {
        "node_modules/react-is/index.js": [
          "isValidElementType",
          "isContextConsumer",
        ],
        "node_modules/react-dom/index.js": ["unstable_batchedUpdates"],
        "node_modules/react/index.js": ["createContext", "useEffect"],
      },
    }),
  ],
};

if (env === "production") {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

export default config;
