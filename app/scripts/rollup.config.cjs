const fs = require('fs');
const path = require('path');
// const { minify } = require('terser');
const { transpileModule } = require('typescript');
const tsconfig = require('./tsconfig.json');
const pkg = require('./package.json');

const resolve = {
  name: 'resolve',
  resolveId(file, importer) {
    let tmp,
      { ext } = path.parse(file);
    if (ext) return file;

    let next = path.resolve(path.dirname(importer), file);
    if (fs.existsSync(next)) return next;

    if (fs.existsSync((tmp = next + '.ts'))) return tmp;
    if (fs.existsSync((tmp = next + '.js'))) return tmp;

    return null;
  },
};

// const terser = {
//   name: 'terser',
//   renderChunk(code, _chunk, opts) {
//     return minify(code, {
//       toplevel: true,
//       sourceMap: !!opts.sourcemap,
//       compress: true,
//     });
//   },
// };

const typescript = {
  name: 'typescript',
  transform(code, file) {
    if (!/\.ts$/.test(file)) return code;
    // @ts-ignore
    let output = transpileModule(code, { ...tsconfig, fileName: file });
    return {
      code: output.outputText.replace('$$VERSION$$', pkg.version),
      map: output.sourceMapText || null,
    };
  },
};

module.exports = {
  input: 'src/bin.ts',
  output: {
    format: 'esm',
    file: 'wrangle.js',
    banner: '#!/usr/bin/env node',
    esModule: false,
    interop: 'auto',
    strict: false,
    freeze: false,
  },
  external: [...require('module').builtinModules, ...Object.keys(pkg.dependencies)],
  plugins: [resolve, typescript],
};
