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
    window.s3d.baseMap = {}
    this.toggleBasemap(true)
  },
  methods: {
    toggleBasemap (useSatellite) {
      this.toSatellite = useSatellite
      if (useSatellite) {
        if (!this.layerSatellite) {

          if (window.s3d.config.baseMapEarth.type === "bing") {
            this.layerSatellite = window.s3d.viewer.imageryLayers.addImageryProvider(
              new Cesium.BingMapsImageryProvider(window.s3d.config.baseMapEarth.params)
            );
            window.s3d.baseMap.earth = this.layerSatellite
          }
          else {
            throw "暂未实现"
          }

          this.layerSatellite.visible = true
        }

        this.layerSatellite.alpha = 1;

        if (this.layerNormal) {
          this.layerNormal.alpha = 0;
        }
      }
      else {
        if (!this.layerNormal) {

          if (window.s3d.config.baseMapNormal.type === "tianditu") {
            this.layerNormal = window.s3d.viewer.imageryLayers.addImageryProvider(
              new Cesium.TiandituImageryProvider(window.s3d.config.baseMapNormal.params)
            );
            window.s3d.baseMap.normal = this.layerNormal
          }
          else {
            throw "暂未实现"
          }

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
