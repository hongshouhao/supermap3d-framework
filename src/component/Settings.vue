<template>
  <div class="settings-pannel">
    <!-- <el-divider content-position="left"></el-divider> -->
    <div class="setting-item-container">
      <span class="slider-demonstration">底图透明度</span>
      <el-slider class="basemap-alpha-settings"
                 v-model="baseMapAlpha"
                 @input="changeBaseMapAlpha"></el-slider>
    </div>

    <div class="setting-item-container">
      <span class="demonstration">雨水</span>
      <el-switch v-model="rainEnable"
                 @change="toggleRain">
      </el-switch>

    </div>
  </div>
</template>
<script>
import RainTool from '../tools/Rain/RainTool'
export default {
  data () {
    return {
      baseMapAlpha: 100,
      rainEnable: false,
    }
  },
  mounted () {
    let _this = this
    window.s3d.eventBus.addEventListener("baseMap-changed", () => {
      if (window.s3d.baseMaps.current) {
        _this.baseMapAlpha = parseInt(window.s3d.baseMaps.current.alpha * 100)
      }
    });
  },
  methods: {
    changeBaseMapAlpha (alpha) {
      if (window.s3d.baseMaps && window.s3d.baseMaps.current)
        window.s3d.baseMaps.current.alpha = alpha / 100;
    },
    toggleRain (enable) {
      if (!this.rainTool) {
        this.rainTool = new RainTool(window.s3d.viewer)
      }

      if (enable) {
        this.rainTool.start()
      }
      else {
        this.rainTool.clear()
      }
    }
  }
}
</script>

<style lang="scss">
.settings-pannel {
  width: 230px;

  .el-divider {
    margin-top: 4px;
    margin-bottom: 6px;
  }

  .setting-item-container {
    display: flex;

    .slider-demonstration {
      font-size: 13px;
      margin-right: 10px;
      margin-top: 5px;
    }

    .demonstration {
      font-size: 13px;
      margin-right: 10px;
    }

    .basemap-alpha-settings {
      width: 145px;
      .el-slider__runway {
        margin: 13px 0px;
      }
    }
  }
}
</style>
