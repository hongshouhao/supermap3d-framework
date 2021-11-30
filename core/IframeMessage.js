import LayerFactory from './utils/LayerFactory'
import { isImageryLayer } from './utils/ImageryUtility'

export function addMessageListener(transform, callback) {
  window.addEventListener(
    'message',
    function(event) {
      if (event.origin === location.origin) {
        return
      }

      let pramas = JSON.parse(event.data)
      if (pramas.api === 'add-layer') {
        if (transform) {
          pramas = transform(event.data)
        }
        let ly = addLayer(pramas)
        if (callback) {
          callback(ly)
        }
      }
    },
    false
  )
}

function addLayer(pramas) {
  if (pramas.clearTemp) {
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
  pramas.name = 'temp_' + pramas.name
  let factory = new LayerFactory(window.s3d.viewer)
  if (isImageryLayer(pramas.type)) {
    let ly = factory.createImageLayer(pramas)
    window.s3d.flyToLayer(ly, pramas.options)
    return ly
  } else if (pramas.type === 'S3M') {
    return factory.createS3MLayer(pramas).then((ly) => {
      window.s3d.flyToLayer(ly, pramas.options)
      return ly
    })
  } else if (pramas.type === 'MVT') {
    let ly = factory.createMVTLayer(pramas)
    window.s3d.flyToLayer(ly, pramas.options)
    return ly
  }
  // else if (pramas.type === 'DEM') {
  //   factory.createDEMLayer(pramas)
  // }
  else {
    throw '图层类型配置错误'
  }
}
