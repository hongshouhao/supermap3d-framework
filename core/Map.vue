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
// import { createImageryProvider } from './utils/ImageryUtility'
import { enableCursorStyle } from './utils/CursorUtility'

export default {
  name: 'smmap',
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

    let gConfig = window.s3d.config
    // let baseMapProvider = null
    // for (let mapKey in gConfig.baseMaps) {
    //   let map = gConfig.baseMaps[mapKey]
    //   if (map.default) {
    //     if (mapKey !== "none") {
    //       baseMapProvider = createImageryProvider(map)
    //     }
    //     break
    //   }
    // }

    let viewerOptions = {
      infoBox: false,
      shadows: true,
      navigation: false,
      baseLayerPicker: false,
      shouldAnimate: true,
      // imageryProvider: baseMapProvider,
      // imageryProvider: new Cesium.TileMapServiceImageryProvider({
      //   url: 'http://cesium.agi.com/blackmarble',
      //   maximumLevel: 8,
      //   credit: 'Black Marble imagery courtesy NASA Earth Observatory',
      // })
    }

    if (gConfig.dem) {
      viewerOptions.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: gConfig.dem,
      })
      viewerOptions.terrainProvider.isCreateSkirt = false;
    }

    Object.assign(viewerOptions, gConfig.viewerOptions)

    this.sceneContainer = document.createElement("div")
    let viewer = new Cesium.Viewer(this.sceneContainer, viewerOptions)

    viewer.scene.fxaa = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.scene.hdrEnabled = true;
    viewer.scene.debugShowFramesPerSecond = false;
    viewer.scene.globe.depthTestAgainstTerrain = true
    // viewer.scene.logarithmicDepthBuffer = false;

    if (gConfig.undergroundMode) {
      viewer.scene.undergroundMode = gConfig.undergroundMode;
    }
    if (gConfig.minimumZoomDistance) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = gConfig.minimumZoomDistance;
    }

    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.PINCH,
      { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
      { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    ];

    viewer.scene.screenSpaceCameraController.zoomEventTypes =
      [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH
      ];

    let currentTime = new Date()
    currentTime.setHours(12)
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
    viewer.clock.multiplier = 1
    viewer.clock.shouldAnimate = true

    window.s3d.setViewer(viewer)
    console.log("s3d", window.s3d)
  },
  mounted () {
    this.$refs.cesiumContainer.appendChild(this.sceneContainer.children[0])
    window.s3d.viewer.cesiumWidget.container.appendChild(this.$refs.popup.$el)
    window.s3d.popup = this.$refs.popup
    enableCursorStyle(window.s3d.viewer)
    window.s3d.eventBus.dispatch("framework-initialized");
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
