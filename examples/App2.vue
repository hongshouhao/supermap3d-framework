<template>
  <div class="map-content-container">
    <div class="top-left-bar-container">
      <top-left-bar />
    </div>
    <div class="top-right-bar-container">
      <div class="top-right-bar">
        <basemap-toogle />
        <layers-tree />
      </div>
    </div>
    <map-viewer></map-viewer>
  </div>
</template>
<script>
import { addMessageListener } from '../core/IframeMessage'
export default {
  data () {
    return {}
  },
  mounted () {
    addMessageListener()
    window.s3d.topLeftBar.highLimitTool.setTargetLayers(['楼幢'])
  },
}
</script>
<style scoped>
.map-content-container {
  width: 100%;
  height: 100%;
}
</style>
