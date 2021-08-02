import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';

import path from 'path';

const pkg = require('./package.json');

const getRollupOutputFile = (fileName) => `dist/${fileName}`;

const libraryName = 'tiny-events';
const libraryFileName = 'index';
export default [
    {
        input: `src/${libraryFileName}.ts`,
        output: [
            {
                file: getRollupOutputFile(pkg.main),
                name: camelCase(libraryName),
                format: 'umd',
                sourcemap: true,
            },
            {
                file: getRollupOutputFile(pkg.module),
                format: 'es',
                sourcemap: true,
            },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: [],
        watch: {
            include: 'src/**',
        },
        plugins: [
            // Allow json resolution
            json(),
            // Compile TypeScript files
            typescript({ useTsconfigDeclarationDir: true }),
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),

            // terser(),
            license({
                banner: {
                    commentStyle: 'regular',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),
        ],
    },
    {
        input: `src/${libraryFileName}.ts`,
        output: [
            {
                file: getRollupOutputFile(pkg.min),
                name: camelCase(libraryName),
                format: 'umd',
                sourcemap: true,
            },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: [],
        plugins: [
            // Allow json resolution
            json(),
            // Compile TypeScript files
            typescript({ useTsconfigDeclarationDir: true }),
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),
            terser({ format: { comments: false } }),

            // terser(),
            license({
                banner: {
                    commentStyle: 'regular',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),
        ],
    },
];
