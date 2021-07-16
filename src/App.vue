<template>
  <div id="app">
    <div class="top-left-bar-container">
      <TopLeftBar />
    </div>
    <div class="top-right-bar-container">
      <TopRightBar />
    </div>

    <div class="cesium-container"
         ref="cesiumContainer"></div>

    <div ref="test">test</div>
    <!-- <sm-viewer>
      <sm3d-clip-box></sm3d-clip-box>
      <sm3d-clip-plane></sm3d-clip-plane>
      <sm3d-clip-cross></sm3d-clip-cross>
      <sm3d-clip-polygon></sm3d-clip-polygon>
      <sm3d-measure></sm3d-measure>
      <sm3d-terrain-flood></sm3d-terrain-flood>
    </sm-viewer> -->
  </div>
</template>

<script>
import TopLeftBar from './TopLeftBar.vue'
import TopRightBar from './TopRightBar.vue'

export default {
  name: 'App',
  components: {
    TopLeftBar,
    TopRightBar,
  },
  data () {
    return {
      sceneContainer: null
    }
  },
  beforeMount () {
    this.sceneContainer = document.createElement("div")
    var viewer = new Cesium.Viewer(this.sceneContainer, {
      infoBox: false,
      shadows: true,
      navigation: false,
      baseLayerPicker: false,
      shouldAnimate: true,
    })

    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.PINCH,
      { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
      { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    ];

    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];

    let currentTime = new Date()
    currentTime.setHours(12)
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
    viewer.clock.multiplier = 1
    viewer.clock.shouldAnimate = true

    console.log("URL_CONFIG", URL_CONFIG)
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: URL_CONFIG.SiChuan_TERRAIN,
      isSct: true
    });

    viewer.scene.debugShowFramesPerSecond = false;
    window.viewer = viewer
    window.scene = viewer.scene

    console.log("viewer", viewer)
    console.log("scene", viewer.scene)

    // viewer.customInfobox = this.$refs.test.$el;
  },
  mounted () {
    this.$refs.cesiumContainer.appendChild(this.sceneContainer)
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}

.cesium-container {
  height: 100%;
  width: 100%;
  div:first-child {
    height: 100%;
    width: 100%;
  }
}

.top-right-bar-container {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10000;
}

.top-left-bar-container {
  position: absolute;
  left: 15px;
  top: 15px;
  z-index: 10000;
}
</style>
