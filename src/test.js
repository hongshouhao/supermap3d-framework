export function doTest() {
  // window.s3d
  //   .query({ layer: '供电', sql: 'SMID=6216' })
  //   .then((response) => console.log(response))
  window.s3d.openPopup({ object: { layer: '供电', sql: 'SMID =  5534 ' } })
  // window.s3d.flyTo({ layer: '供电', sql: 'SMID =  5534 ' })
  // window.s3d.flyTo([130, 31, 1000])
  // window.s3d.flyTo(Cesium.Cartesian3.fromDegreesArray([130, 31])[0])
  // window.s3d.flyTo(Cesium.Cartesian3.fromDegrees(130, 31))
}
