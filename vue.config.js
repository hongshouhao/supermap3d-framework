const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .include.add(resolve('core'))
      .end()
      .use('eslint')
      .loader('eslint-loader')
      .end()

    config.module
      .rule('url-loader')
      .test(/\.(cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()

    config.plugin('copy').use(require('copy-webpack-plugin'), [
      [
        { from: resolve('public/Cesium'), to: resolve('lib/Cesium') },
        { from: resolve('README.md'), to: resolve('lib/README.md') },
      ],
    ])
  },
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
  },
}
