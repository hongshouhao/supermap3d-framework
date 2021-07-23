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

    <Popup ref="popup"
           v-show="false" />
  </div>
</template>

<script>
import TopLeftBar from './component/TopLeftBar.vue'
import TopRightBar from './component/TopRightBar.vue'
import Popup from './component/Popup.vue'

export default {
  components: {
    TopLeftBar,
    TopRightBar,
    Popup
  },
  data () {
    return {
      sceneContainer: null
    }
  },
  beforeMount () {
    this.sceneContainer = document.createElement("div")
    let viewer = new Cesium.Viewer(this.sceneContainer, {
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

    viewer.scene.screenSpaceCameraController.zoomEventTypes =
      [Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH];

    let currentTime = new Date()
    currentTime.setHours(12)
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
    viewer.clock.multiplier = 1
    viewer.clock.shouldAnimate = true

    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: URL_CONFIG.SiChuan_TERRAIN,
      isSct: true
    });

    viewer.scene.debugShowFramesPerSecond = false;

    window.viewer = viewer
    window.scene = viewer.scene

    console.log("viewer", viewer)
  },
  mounted () {
    this.$refs.cesiumContainer.appendChild(this.sceneContainer.children[0])
    window.viewer.cesiumWidget.container.appendChild(this.$refs.popup.$el)
    window.popup = this.$refs.popup
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
  .cesium-viewer {
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
