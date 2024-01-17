import fs from 'fs';
import {
  extname,
  resolve,
} from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { TransformEjs } from './jsoncv/src/lib/vite-plugins';
import { getRenderData } from './jsoncv/src/themes/data';

const dataFilename = process.env.DATA_FILENAME || './cv.json'

const data = require(dataFilename)
const renderData = getRenderData(data)
renderData.theme = process.env.THEME || 'reorx'
renderData.isProduction = process.env.NODE_ENV === 'production'
renderData.meta = {
  title: "Yu ZHANG",
  description: "Yu ZHANG's CV",
  url: "https://cv.pseudoyu.com"
}

const pdfFiles = fs.readdirSync('public').filter(file => extname(file) === '.pdf')
renderData.pdfURL = '/' + pdfFiles[0]


export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      // remove the "Module "fs" has been externalized" warning for ejs
      'fs': 'jsoncv/src/lib/fs-polyfill.js',
    },
  },
  plugins: [
    TransformEjs(),
    ViteEjsPlugin(
      renderData,
      {
        ejs: (viteConfig) => ({
          // ejs options goes here.
          views: [resolve(__dirname)],
        })
      }
    ),
    viteSingleFile(),
  ],
})
