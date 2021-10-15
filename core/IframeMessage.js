import LayerFactory from './utils/LayerFactory'
import { isImageryLayer } from './utils/ImageryUtility'

export function addMessageListener(transform) {
  window.addEventListener(
    'message',
    function(event) {
      if (event.origin === location.origin) {
        return
      }

      let options = JSON.parse(event.data)
      if (options.api === 'add-layer') {
        if (transform) {
          options = transform(event.data)
        }
        addLayer(options)
      }
    },
    false
  )
}

function addLayer(options) {
  if (options.clearTemp) {
    let tempLys = []
    for (let ly of window.s3d.scene.layers.layerQueue) {
      if (ly.name.startsWith('temp_')) {
        tempLys.push(ly)
      }
    }
    for (let ly of tempLys) {
      window.s3d.scene.layers.remove(ly.name, true)
    }
  }
  options.name = 'temp_' + options.name
  let factory = new LayerFactory(window.s3d.viewer)
  if (isImageryLayer(options.type)) {
    let ly = factory.createImageLayer(options)
    window.s3d.flyToLayer(ly)
  } else if (options.type === 'S3M') {
    factory.createS3MLayer(options).then((ly) => {
      window.s3d.flyToLayer(ly)
    })
  } else if (options.type === 'MVT') {
    let ly = factory.createMVTLayer(options)
    window.s3d.flyToLayer(ly)
  }
  // else if (options.type === 'DEM') {
  //   factory.createDEMLayer(options)
  // }
  else {
    throw '图层类型配置错误'
  }
}
