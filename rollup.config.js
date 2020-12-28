import commonjs from '@rollup/plugin-commonjs'; // 识别 commonjs 类型的包，默认只支持导入es6
import nodeResolve from '@rollup/plugin-node-resolve'; // 支持 import 导入
import json from '@rollup/plugin-json'; // 支持加载 json 文件

import typescript from 'rollup-plugin-typescript2'; // 支持 ts 编译
import { terser } from "rollup-plugin-terser"; // 压缩
import serve from 'rollup-plugin-serve'; // 本地服务
import livereload from 'rollup-plugin-livereload'; // 热更新
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            format: 'cjs',
            file: pkg.main,
            sourcemap: true
        },
        {
            format: 'es',
            file: pkg.module,
            sourcemap: true,
        },
        {
            format: 'umd',
            name: 'video-thumbnail-sprite',
            file: pkg.browser,
            sourcemap: true,
        }
    ],
    plugins: [
        json(),
        commonjs({
            include: 'node_modules/**'
        }),
        typescript({
            exclude: 'node_modules/**',
            rollupCommonJSResolveHack: false,
            clean: true,
            typescript: require('typescript')
        }),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        terser(),
        serve({
            open: true,
            port: 8081,
            openPage: '/demo/index.html',
            contentBase: ''
        }),
        livereload()
    ],
    watch: {
        exclude: ['node_modules/**']
    }
}