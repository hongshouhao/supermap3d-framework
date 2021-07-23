module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/supermap3d' : '/',
  chainWebpack: (config) => {
    config.module
      .rule('url-loader')
      .test(/\.(png|jpg|gif|cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  },
}
