const { defineConfig } = require("@vue/cli-service");
// vue.config.js
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",

  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://127.0.0.1:3000/",
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": "",
  //       },
  //     },
  //   },
  // },
  lintOnSave: false,

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname,"./src/assets/styles/common.scss"),
        path.resolve(__dirname,"./src/assets/styles/base.scss")
      ]
    },
  },
});
