import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const config = {
    input: "src/main.ts",
    output: [
        {
            file: "dist/datafluid.js",
            format: "iife",
        },
        {
            file: "dist/datafluid.min.js",
            format: "iife",
            plugins: [terser()],
        },
    ],
    plugins: [typescript()],
};

export default config;
