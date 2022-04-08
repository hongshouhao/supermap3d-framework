<!--
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:14
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 14:32:08
 * @FilePath: \supermap3d-framework\core\Map.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->

<template>
  <div class="cesium-core-container">
    <slot name="tool-bar">
      <div class="top-left-bar-container">
        <TopLeftBar />
      </div>
    </slot>
    <slot name="layer-bar">
      <div class="top-right-bar-container">
        <TopRightBar />
      </div>
    </slot>
    <slot></slot>
    <MapViewer @viewer-created="onViewerCreated" />
  </div>
</template>
<script>
import MapViewer from './MapViewer.vue';
import TopLeftBar from './components/common/TopLeftBar.vue';
import TopRightBar from './components/common/TopRightBar.vue';

export default {
  name: 'smmap',
  components: {
    MapViewer,
    TopLeftBar,
    TopRightBar,
  },
  data() {
    return {
      viewer: null,
    };
  },
  beforeMount() {},
  mounted() {},
  methods: {
    onViewerCreated(viewer) {
      this.viewer = viewer;
    },
  },
};
</script>

<style lang="scss">
.cesium-core-container {
  position: absolute;

  height: 100%;
  width: 100%;
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
