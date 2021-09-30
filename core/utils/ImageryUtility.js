export const createImageryProvider = function(options) {
  switch (options.type) {
    case 'bing':
      return new Cesium.BingMapsImageryProvider(options.params)
    case 'tianditu':
      return new Cesium.TiandituImageryProvider(options.params)
    case 'custom':
      return new Cesium.TileMapServiceImageryProvider(options.params)
    case 'arcgis':
      return new Cesium.ArcGisMapServerImageryProvider(options.params)
    case 'arcgisex':
      return new Cesium.CGCS2000MapServerImageryProvider(options.params)
    case 'gaode':
      return new Cesium.UrlTemplateImageryProvider(options.params)
    case 'supermap':
      return new Cesium.SuperMapImageryProvider(options.params)
    default:
      throw `暂不支持类型为${options.type}的栅格图层`
  }
}

export const isImageryLayer = function(type) {
  switch (type) {
    case 'ARCGISIMG':
    case 'ARCGISEXIMG':
    case 'SMIMG':
      return true
    default:
      return false
  }
}
