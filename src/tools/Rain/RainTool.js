export default class RainTool {
  constructor(viewer) {
    let rainParticleSize = viewer.scene.drawingBufferWidth / 80.0
    let rainRadius = 4000.0
    let rainImageSize = new Cesium.Cartesian2(
      rainParticleSize,
      rainParticleSize * 3.0
    )

    let rainGravityScratch = new Cesium.Cartesian3()
    let rainUpdate = function(particle) {
      rainGravityScratch = Cesium.Cartesian3.normalize(
        particle.position,
        rainGravityScratch
      )
      rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
        rainGravityScratch,
        -40,
        rainGravityScratch
      )

      particle.position = Cesium.Cartesian3.add(
        particle.position,
        rainGravityScratch,
        particle.position
      )

      let distance = Cesium.Cartesian3.distance(
        viewer.scene.camera.position,
        particle.position
      )
      if (distance > rainRadius) {
        particle.endColor.alpha = 0.0
      } else {
        particle.endColor.alpha =
          rainSystem.endColor.alpha / (distance / rainRadius + 0.1)
      }
    }

    let rainSystem = new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(
        viewer.scene.camera.position
      ),
      speed: -1.0,
      lifetime: 10.0,
      emitter: new Cesium.SphereEmitter(rainRadius),
      startScale: 1.0,
      endScale: 1.0,
      image: 'images/rain.png',
      emissionRate: 3000.0,
      startColor: new Cesium.Color(1, 1, 1, 0.8),
      endColor: new Cesium.Color(1, 1, 1, 0.8),
      imageSize: rainImageSize,
      updateCallback: rainUpdate,
      performance: false,
    })
    // rainSystem.loadRangeScale=100000;

    viewer.scene.primitives.add(rainSystem)

    rainSystem.lodRangeScale = 10000
  }

  start() {}
}
