import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
// import { terser } from 'rollup-plugin-terser'

import { version } from './package.json'
const banner = `/* LocalTime ${version} */\n`

// const minify = () => {
//   return terser({
//     mangle: true,
//     compress: true
//   })
// }

export default [
  {
    input: 'src/index.ts',
    external: [],
    output: [
      {
        name: 'LocalTime',
        file: 'app/assets/javascripts/local-time.umd.js',
        format: 'umd',
        banner
      },
      {
        file: 'app/assets/javascripts/local-time.js',
        format: 'es',
        banner
      }
    ],
    plugins: [
      resolve(),
      filesize(),
      typescript(),
      // minify()
    ],
    watch: {
      include: 'src/**'
    }
  }
]
