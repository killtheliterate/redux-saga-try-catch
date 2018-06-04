// import atImport from 'postcss-import'
// import autoprefixer from 'autoprefixer'
// import postcss from 'rollup-plugin-postcss'
// import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
// import url from 'postcss-url'
// import commonjs from 'rollup-plugin-commonjs'
// import path from 'path'

const baseConfig = {
  plugins: [
    // resolve(),
    // commonjs(),

    // alias({
    //   semantic: 'semantic/dist'
    // }),

    // Make sure this is last
    typescript()
  ],

  // input: './test.js',
  input: 'src/index.ts',

  external: [
    'debug'
  ]
}

const esConfig = Object.assign(
  {},
  baseConfig,
  {
    output: {
      exports: 'named',
      file: 'dist/es/index.js',
      format: 'es'
    }
  }
)

const cjsConfig = Object.assign(
  {},
  baseConfig,
  {
    output: {
      exports: 'named',
      file: 'dist/cjs/index.js',
      format: 'cjs'
    }
  }
)

export default [
  esConfig,
  cjsConfig
]
