/*
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:15
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 11:03:07
 * @FilePath: \supermap3d-framework\vue.config.js
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
 */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  publicPath: "./",
  chainWebpack: (config) => {
    config.module
      .rule("js")
      .include.add(resolve("core"))
      .end()
      .use("eslint")
      .loader("eslint-loader")
      .end();

    config.module
      .rule("url-loader")
      .test(/\.(cur)$/)
      .use("url-loader")
      .loader("url-loader")
      .end();

    config.plugin("copy").use(require("copy-webpack-plugin"), [
      [
        { from: resolve("public/Cesium"), to: resolve("lib/Cesium") },
        { from: resolve("README.md"), to: resolve("lib/README.md") },
      ],
    ]);

    config.resolve.alias.set("@", resolve("core"));
  },
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
      },
    },
  },
};
