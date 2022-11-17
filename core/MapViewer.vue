<template>
  <div class="cesium-container" ref="cesiumContainer">
    <Popup ref="popup" v-show="false" />
  </div>
</template>

<script>
import Popup from './components/popup/Popup.vue';
import { enableCursorStyle } from './utils/CursorUtility';

export default {
  name: 'map-viewer',
  components: {
    Popup,
  },
  data() {
    return {};
  },
  beforeMount() {
    if (!window.s3d || !window.s3d.config) {
      throw '配置未初始化: window.s3d.config';
    }

    let config = window.s3d.config;
    let vOpts = {
      infoBox: false,
      shadows: true,
      navigation: false,
      baseLayerPicker: false,
      shouldAnimate: true,
      contextOptions: {
        msaaLevel: 8, // 越大效果越好，会消耗性能
        requestWebgl2: true,
      },
      // orderIndependentTranslucency: false,
    };

    let demVisible = true;
    if (config.dem) {
      let demURL = null;
      if (typeof config.dem == 'string') {
        demURL = config.dem;
      } else if (typeof config.dem == 'object') {
        demURL = config.dem.url;
        if (typeof config.dem.visible == 'boolean') {
          demVisible = config.dem.visible;
        }
      }
      vOpts.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: demURL,
        invisibility: true,
      });
    }

    if (vOpts.terrainProvider) {
      vOpts.terrainProvider.isCreateSkirt = false;
    }

    Object.assign(vOpts, config.vOpts);
    this.sceneContainer = document.createElement('div');
    let viewer = new Cesium.Viewer(this.sceneContainer, vOpts);
    this.__proto__.__proto__.$viewer = viewer;

    let ehelper = new Cesium.EventHelper();
    ehelper.add(viewer.scene.globe.tileLoadProgressEvent, function (e) {
      if (e == 0) {
        ehelper.removeAll();
        viewer.terrainProvider.visible = demVisible;
        window.s3d.eventBus.dispatch('mapviewer-initialized');
      }
    });

    window.s3d.setViewer(viewer);
  },
  mounted() {
    this.$refs.cesiumContainer.appendChild(this.sceneContainer.children[0]);
    this.$viewer.cesiumWidget.container.appendChild(this.$refs.popup.$el);

    enableCursorStyle(this.$viewer);
    window.s3d.popup = this.$refs.popup;

    window.s3d.eventBus.dispatch('framework-initialized');
    this.$emit('viewer-created');
  },
};
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
</style>
