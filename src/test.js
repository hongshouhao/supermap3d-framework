export default class Test {
  constructor() {
    this.count = 1
  }
  doTest() {
    // window.s3d.viewer.scene.camera.setView({
    //   destination: new Cesium.Cartesian3(
    //     -1206939.1925299785,
    //     5337998.241228442,
    //     3286279.2424502545
    //   ),
    //   orientation: {
    //     heading: 1.4059101895600987,
    //     pitch: -0.20917672793046682,
    //     roll: 2.708944180085382e-13,
    //   },
    // })
    // window.s3d
    //   .query({ layer: '交通信号', sql: 'SMID =1' })
    //   .then((response) => console.log(response))
    // window.s3d.openPopup({
    //   object: { layer: '有线电视', sql: '元素ID=28005' },
    // })

    if (this.count === 1) {
      debugger
      window.s3d.openPopup({
        object: { layer: '供电', sql: 'SMID = 4480' },
      })
      this.count++
    } else if (this.count === 2) {
      window.s3d.closePopup()
      debugger
      window.s3d.openPopup({
        object: { layer: '污水', sql: 'SMID = 1464' },
      })
      this.count++
    } else if (this.count === 3) {
      window.s3d.closePopup()
      debugger
      window.s3d.openPopup({
        object: { layer: '供电', sql: 'SMID = 4265' },
      })
      this.count++
    }
    // window.s3d.flyToS3mFeatures({ layer: '供电', sql: 'SMID =  5534 ' })
    // window.s3d.flyTo([130, 31, 1000])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegreesArray([130, 31])[0])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegrees(130, 31))
    // console.log(window.s3d.getAllLayers((x) => x.type === 'S3M' && x.visible))
    // console.log(window.s3d.getLayer('供电'))
    // console.log(window.s3d.getLayer((x) => x.name === '供电'))
  }
}
