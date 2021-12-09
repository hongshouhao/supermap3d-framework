<template>
  <div class="settings-pannel">
    <!-- <el-divider content-position="left"></el-divider> -->
    <div class="setting-item-container">
      <span class="slider-demonstration">底图透明度</span>
      <el-slider
        class="basemap-alpha-settings"
        v-model="baseMapAlpha"
        @input="changeBaseMapAlpha"
      ></el-slider>
    </div>

    <div class="setting-item-container">
      <span class="demonstration">雨景</span>
      <el-switch
        v-model="rainEnable"
        active-text="开"
        inactive-text="关"
        @change="toggleRain"
      >
      </el-switch>
    </div>

    <div class="setting-item-container">
      <span class="demonstration">雪景</span>
      <el-switch
        v-model="snowEnable"
        active-text="开"
        inactive-text="关"
        @change="toggleSnow"
      >
      </el-switch>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseMapAlpha: 100,
      rainEnable: false,
      snowEnable: false,
    }
  },
  computed: {
    baseMaps() {
      return window.s3d.baseMaps
    },
  },
  mounted() {
    let _this = this
    window.s3d.eventBus.addEventListener('baseMap-changed', () => {
      if (this.baseMaps.current) {
        _this.baseMapAlpha = parseInt(this.baseMaps.current[0].alpha * 100)
      }
    })
  },
  methods: {
    changeBaseMapAlpha(alpha) {
      if (this.baseMaps && this.baseMaps.current)
        for (let map of this.baseMaps.current) {
          map.alpha = alpha / 100
        }
    },
    toggleRain(enable) {
      if (enable) {
        this.$viewer.scene.postProcessStages.rain.enabled = true
        this.$viewer.scene.postProcessStages.rain.uniforms.angle = 170
        this.$viewer.scene.postProcessStages.rain.uniforms.speed = 6
      } else {
        this.$viewer.scene.postProcessStages.rain.enabled = false
      }
    },
    toggleSnow(enable) {
      if (enable) {
        this.$viewer.scene.postProcessStages.snow.enabled = true
        this.$viewer.scene.postProcessStages.snow.uniforms.density = 15
        this.$viewer.scene.postProcessStages.snow.uniforms.angle = 0
        this.$viewer.scene.postProcessStages.snow.uniforms.speed = 6
      } else {
        this.$viewer.scene.postProcessStages.snow.enabled = false
      }
    },
  },
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
