<template>
  <ul class="change-basemap">
    <li :class="{ active: !toSatellite }"
        @click="toggleBasemap(false)">
      <i class="esri-icon-maps"></i>
      地图
    </li>
    <li :class="{ active: toSatellite }"
        @click="toggleBasemap(true)">
      <i class="esri-icon-globe"></i>
      影像
    </li>
  </ul>
</template>
<script>
export default {
  data () {
    return {
      toSatellite: true,
      layerNormal: null,
      layerSatellite: null,
    }
  },
  mounted () {
    this.toggleBasemap(true)
  },
  methods: {
    toggleBasemap (useSatellite) {
      this.toSatellite = useSatellite
      if (useSatellite) {
        if (!this.layerSatellite) {
          this.layerSatellite = viewer.imageryLayers.addImageryProvider(
            new Cesium.BingMapsImageryProvider({
              url: "https://dev.virtualearth.net",
              mapStyle: Cesium.BingMapsStyle.AERIAL,
              key: URL_CONFIG.BING_MAP_KEY
            })
          );

          this.layerSatellite.visible = true
        }

        this.layerSatellite.alpha = 1;

        if (this.layerNormal) {
          this.layerNormal.alpha = 0;
        }
      }
      else {
        if (!this.layerNormal) {
          this.layerNormal = viewer.imageryLayers.addImageryProvider(
            new Cesium.TiandituImageryProvider({
              mapStyle: Cesium.TiandituMapsStyle["VEC_W"],
              token: URL_CONFIG.TOKEN_TIANDITU
            })
          );

          this.layerNormal.visible = true
        }

        this.layerNormal.alpha = 1;

        if (this.layerSatellite) {
          this.layerSatellite.alpha = 0;
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.change-basemap {
  margin: 0 10px 0 0;
  padding: 0 !important;
  cursor: pointer;
  display: inline-block;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  &::after {
    width: 1px;
    height: 16px;
    background: #dbdee2;
    content: "";
    position: absolute;
    left: 68px;
    top: 8px;
  }

  li {
    &:nth-child(1) {
      border-right: none;
      padding: 6px 8px 6px 12px;
    }
    &:nth-child(2) {
      border-left: none;
      padding: 6px 12px 6px 8px;
    }
    i {
      position: relative;
      top: 2px;
    }
    img {
      width: 16px;
      height: 16px;
      position: relative;
      top: 3px;
    }

    float: left;
    background: #fff;
    list-style: none;
    font-size: 14px;
    color: #495060;
    &.active {
      color: #4279e4;
    }
  }
}
</style>
