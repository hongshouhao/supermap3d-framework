module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('url-loader')
      .test(/\.(png|jpg|gif|svg|cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  },
}
