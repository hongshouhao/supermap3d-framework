module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/supermap3d' : '/',
  chainWebpack: (config) => {
    config.module
      .rule('url-loader')
      .test(/\.(cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  },
}
