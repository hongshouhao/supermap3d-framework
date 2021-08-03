<template>
  <div class="settings-pannel">
    <el-divider content-position="left">底图透明度</el-divider>
    <div class="slider-label-container">
      <span class="demonstration">普通底图</span>
      <el-slider class="basemap-alpha-settings"
                 v-model="baseMapNormalAlpha"
                 @input="changeBaseMapNormalAlpha"></el-slider>
    </div>
    <div class="slider-label-container">
      <span class="demonstration">影像底图</span>
      <el-slider class="basemap-alpha-settings"
                 v-model="baseMapEarthAlpha"
                 @input="changeBaseMapEarthAlpha"></el-slider>
    </div>

    <div></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      baseMapNormalAlpha: 100,
      baseMapEarthAlpha: 100,
    }
  },
  methods: {
    changeBaseMapNormalAlpha (alpha) {
      if (window.s3d.baseMap && window.s3d.baseMap.normal)
        window.s3d.baseMap.normal.alpha = alpha / 100;
    },
    changeBaseMapEarthAlpha (alpha) {
      if (window.s3d.baseMap && window.s3d.baseMap.earth)
        window.s3d.baseMap.earth.alpha = alpha / 100;
    },
  }
}
</script>

<style lang="scss">
.settings-pannel {
  width: 220px;

  .el-divider {
    margin-top: 4px;
    margin-bottom: 6px;
  }
  .demonstration {
    font-size: 13px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .slider-label-container {
    display: flex;
    .basemap-alpha-settings {
      width: 145px;
      .el-slider__runway {
        margin: 13px 0px;
      }
    }
  }
}
</style>
