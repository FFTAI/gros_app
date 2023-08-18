const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "https://0.0.0.0:8001",
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": "",
  //       },
  //     },
  //   },
  // },
});
