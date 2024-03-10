import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS module into ES module
import css from 'rollup-plugin-import-css'; // Collect css
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'; // To include the version in the distribution
import terser from '@rollup/plugin-terser'; // Rollup plugin to minify generated es bundle
import {
  readFileSync
} from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')),
  date = new Date().toLocaleString(),
  banner = readFileSync('./build/banner.js', 'utf-8')
  .replace('{name}', pkg.name)
  .replace('{description}', pkg.description)
  .replace('{homepage}', pkg.homepage)
  .replace('{version}', pkg.version)
  .replace('{time}', date)
  .replace('*/', '*/\n');

export default [{
    // Full debug library
    input: 'build/index.js',
    plugins: [
      nodeResolve(),
      commonjs(),
      css({
        output: 'myol.css',
      }),
      json(),
      replace({
        preventAssignment: true,
        __buildDate__: date,
        __buildVersion__: pkg.version,
      }),
    ],
    output: [{
      name: 'myol',
      banner,
      file: 'dist/myol-debug.js',
      format: 'umd',
    }],
  },
  {
    // Compressed library
    input: 'build/index.js',
    plugins: [
      nodeResolve(),
      commonjs(),
      css({
        minify: true,
        output: 'myol-min.css',
      }),
      json(),
      terser(),
      replace({
        preventAssignment: true,
        __buildDate__: date,
        __buildVersion__: pkg.version,
      }),
    ],
    output: [{
      name: 'myol',
      banner,
      file: 'dist/myol.js',
      format: 'umd',
      sourcemap: true,
    }],
  }
];