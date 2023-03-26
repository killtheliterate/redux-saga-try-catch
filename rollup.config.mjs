import babel from '@rollup/plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'

const baseConfig = {
  plugins: [
    peerDepsExternal(),

    resolve({ extensions: ['.ts', '.tsx'] }),

    babel({
      presets: ['@babel/typescript'],
      plugins: [
        'lodash',
        // 'macros'
      ],
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
      exclude: [
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        'node_modules',
      ],
    }),
  ],

  input: 'src/index.ts',
}

const esConfig = Object.assign({}, baseConfig, {
  output: {
    exports: 'named',
    file: 'dist/es/index.js',
    format: 'es',
  },
})

const cjsConfig = Object.assign({}, baseConfig, {
  output: {
    exports: 'named',
    file: 'dist/cjs/index.js',
    format: 'cjs',
  },
})

export default [cjsConfig, esConfig]
