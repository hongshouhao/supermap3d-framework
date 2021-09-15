module.exports = {
  publicPath: './',
  chainWebpack: (config) => {
    config.module
      .rule('url-loader')
      .test(/\.(cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
  },
}
