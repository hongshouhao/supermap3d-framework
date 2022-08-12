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
    <MapViewer />
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
  data () {
    return {
    };
  },
  beforeMount () { },
  mounted () { },
  methods: {
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
