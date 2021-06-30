<template>
  <div id="app">
    <sm-viewer scene-url="http://106.14.242.98:8090/iserver/services/3D-QYQBM/rest/realspace">
      <!-- <sm3d-clip-box></sm3d-clip-box>
      <sm3d-clip-plane></sm3d-clip-plane>
      <sm3d-clip-cross></sm3d-clip-cross>
      <sm3d-clip-polygon></sm3d-clip-polygon> -->
      <!-- <sm3d-measure></sm3d-measure>
      <sm3d-terrain-flood></sm3d-terrain-flood> -->
    </sm-viewer>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  mounted () {
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.BingMapsImageryProvider({
    //     url: "https://dev.virtualearth.net",
    //     mapStyle: Cesium.BingMapsStyle.AERIAL,
    //     key: URL_CONFIG.BING_MAP_KEY
    //   })
    // );
    // //加载地形
    // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: URL_CONFIG.SiChuan_TERRAIN,
    //   isSct: true//地形服务源自SuperMap iServer发布时需设置isSct为true
    // });
    // // 相机位置
    // viewer.scene.camera.setView({
    //   destination: new Cesium.Cartesian3(-1206939.1925299785, 5337998.241228442, 3286279.2424502545),
    //   orientation: {
    //     heading: 1.4059101895600987,
    //     pitch: -0.20917672793046682,
    //     roll: 2.708944180085382e-13
    //   }
    // });

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
