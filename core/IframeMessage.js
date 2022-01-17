import { isPromise } from './utils/IfUtility'

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
  let result = window.s3d.layerFactory.createLayer(pramas)
  if (isPromise(result)) {
    result.then((ly) => {
      window.s3d.flyToLayer(ly, pramas.options)
    })
  } else {
    window.s3d.flyToLayer(result, pramas.options)
  }
}
