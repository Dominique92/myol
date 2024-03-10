import {
  readFileSync
} from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS module into ES module
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace'; // To include the version in the distribution
import css from 'rollup-plugin-import-css'; // Collect css
import terser from '@rollup/plugin-terser'; // Rollup plugin to minify generated es bundle

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')),
  geocoderPkg = JSON.parse(readFileSync('./node_modules/@myol/geocoder/package.json', 'utf-8')),
  timeBuild = new Date().toLocaleString(),
  banner = readFileSync('./build/banner.js', 'utf-8')
  .replace('{name}', pkg.name)
  .replace('{description}', pkg.description)
  .replace('{homepage}', pkg.homepage)
  .replace('{version}', pkg.version)
  .replace('{time}', timeBuild)
  .replace('*/', '*/\n');

export default [{
    // Full debug library
    input: 'build/index.js',
    output: [{
      file: 'dist/myol-debug.js',
      name: 'myol',
      banner,
      format: 'umd',
    }],
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      replace({
        preventAssignment: true,
        __myolBuildDate__: timeBuild,
        __myolBuildVersion__: pkg.version,
        __geocoderBuildVersion__: geocoderPkg.version,
      }),
      css({
        output: 'myol.css',
      }),
    ],
  },
  {
    // Compressed library
    input: 'build/index.js',
    output: [{
      file: 'dist/myol.js',
      name: 'myol',
      banner,
      format: 'umd',
      sourcemap: true,
    }],
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      replace({
        preventAssignment: true,
        __myolBuildDate__: timeBuild,
        __myolBuildVersion__: pkg.version,
        __geocoderBuildVersion__: geocoderPkg.version,
      }),
      css({
        output: 'myol-min.css',
        minify: true,
      }),
      terser(),
    ],
  },
];