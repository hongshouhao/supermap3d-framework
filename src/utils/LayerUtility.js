export function setVisible(layer, visible) {
  if (layer.type === 'SMIMG' || layer.type === 'MVT') {
    layer.show = visible
  } else if (layer.type === 'S3M') {
    layer.visible = visible
  }
}

export function flyTo(layer) {
  if (layer.type === 'MVT') {
    let bounds = layer.rectangle
    window.s3d.viewer.camera.flyTo({
      destination: new Cesium.Cartesian3.fromRadians(
        (bounds.east + bounds.west) * 0.5,
        (bounds.north + bounds.south) * 0.5,
        10000
      ),
      orientation: {
        heading: 0,
        roll: 0,
        pitch: -1.57,
      },
      duration: 2,
    })
  } else {
    if (layer) {
      window.s3d.viewer.flyTo(layer)
    } else {
      throw '无法定位图层, 图层可能加载失败'
    }
  }
}

export function setOpacity(layer, opacity) {
  if (layer && layer.type === 'SMIMG') {
    layer.alpha = opacity / 100
  } else if (layer && layer.type === 'S3M') {
    layer.style3D.fillForeColor = new Cesium.Color(1.0, 1.0, 1.0, opacity / 100)
  }
}
