import typescript from 'rollup-plugin-typescript2'

const baseConfig = {
  plugins: [
    typescript({
      tsconfigOverride: {
        exclude: [
          '**/*.test.ts',
          'node_modules'
        ]
      }
    })
  ],

  input: 'src/index.ts',

  external: [
    'redux',
    'redux-saga',
    'redux-saga/effects'
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
  cjsConfig,
  esConfig
]
