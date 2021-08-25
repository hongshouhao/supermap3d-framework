export function doTest() {
  // window.s3d
  //   .query({ layer: '供电', sql: 'SMID=6216' })
  //   .then((response) => console.log(response))
  // window.s3d.openPopup({ object: { layer: '供电', sql: 'SMID =  5534 ' } })
  window.s3d.flyToS3mFeatures({ layer: '供电', sql: 'SMID =  5534 ' })
  // window.s3d.flyTo([130, 31, 1000])
  // window.s3d.flyTo(Cesium.Cartesian3.fromDegreesArray([130, 31])[0])
  // window.s3d.flyTo(Cesium.Cartesian3.fromDegrees(130, 31))

  console.log(window.s3d.getAllLayers((x) => x.type === 'S3M' && x.visible))

  console.log(window.s3d.getLayer('供电'))
  console.log(window.s3d.getLayer((x) => x.label === '供电'))
}
