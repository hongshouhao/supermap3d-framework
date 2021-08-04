<template>
  <div class="cesium-core-container">
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
    if (!window.s3d || !window.s3d.config) {
      throw '配置未初始化: window.s3d.config';
    }

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
    // viewer.scene.globe.baseColor = Cesium.Color.BLACK;
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
    viewer.scene.globe.depthTestAgainstTerrain = !0;


    window.s3d.viewer = viewer
    window.s3d.scene = viewer.scene

    console.log("viewer", viewer)
  },
  mounted () {
    this.$refs.cesiumContainer.appendChild(this.sceneContainer.children[0])
    window.s3d.viewer.cesiumWidget.container.appendChild(this.$refs.popup.$el)
    window.s3d.popup = this.$refs.popup
  }
}
</script>

<style lang="scss">
.cesium-core-container {
  position: absolute;

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
  z-index: 1;
}

.top-left-bar-container {
  position: absolute;
  left: 15px;
  top: 15px;
  z-index: 1;
}
</style>
