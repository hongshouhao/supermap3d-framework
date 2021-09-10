<template>
  <div id="onemap">
    <Map />
  </div>

</template>

<script>
import Map from 'supermap3d-framework/src/Map.vue'

export default {
  name: 'OneMap',
  components: {
    Map
  },
  data() {
    return {
    }
  },
  mounted() {
    window.s3d.scene.undergroundMode = true
    window.s3d.scene.screenSpaceCameraController.minimumZoomDistance = -500
    window.s3d.scene.terrainProvider.isCreateSkirt = false
  }
}
</script>

<style>
#onemap {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
}
/* #onemap > div > div.top-left-bar-container > div > div:nth-child(4) {
  display: none;
} */
/* #onemap
  > div
  > div.top-left-bar-container
  > div
  > div:nth-child(5)
  > div:nth-child(2) {
  display: none;
} */
</style>
