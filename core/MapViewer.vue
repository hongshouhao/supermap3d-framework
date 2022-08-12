<template>
  <div class="cesium-container"
       ref="cesiumContainer">
    <Popup ref="popup"
           v-show="false" />
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
  data () {
    return {};
  },
  beforeMount () {
    if (!window.s3d || !window.s3d.config) {
      throw '配置未初始化: window.s3d.config';
    }

    let config = window.s3d.config;
    let viewerOptions = {
      infoBox: false,
      shadows: true,
      navigation: false,
      baseLayerPicker: false,
      shouldAnimate: true,
    };

    if (config.dem) {
      viewerOptions.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: config.dem,
      });
    }

    if (viewerOptions.terrainProvider) {
      viewerOptions.terrainProvider.isCreateSkirt = false;
    }

    Object.assign(viewerOptions, config.viewerOptions);
    this.sceneContainer = document.createElement('div');
    let viewer = new Cesium.Viewer(this.sceneContainer, viewerOptions);
    this.__proto__.__proto__.$viewer = viewer;
    window.s3d.setViewer(viewer);
  },
  mounted () {
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
