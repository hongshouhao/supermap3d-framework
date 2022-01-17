<template>
  <div class="settings-pannel">
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label-more">底图透明度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="1"
                   :step="0.01"
                   v-model="baseMapAlpha"
                   @input="setBaseMapAlpha"></el-slider>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">亮度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="brightness"
                   @input="setSceneColorCorrection($event,'brightness')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">色调</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="-1"
                   :max="1"
                   :step="0.01"
                   v-model="hue"
                   @input="setSceneColorCorrection($event,'hue')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">饱和度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="saturation"
                   @input="setSceneColorCorrection($event,'saturation')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">对比度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="contrast"
                   @input="setSceneColorCorrection($event,'contrast')">
        </el-slider>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="8">
        <span class="settings-item-label">光照</span>
      </el-col>
      <el-col :span="16">
        <el-switch v-model="enableLight"
                   active-text="开"
                   inactive-text="关"
                   @change="toogleLight">
        </el-switch>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">雨景</span>
      </el-col>
      <el-col :span="16">
        <el-switch v-model="enableRain"
                   active-text="开"
                   inactive-text="关"
                   @change="toggleRain">
        </el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="settings-item-label">雪景</span>
      </el-col>
      <el-col :span="16">
        <el-switch v-model="enableSnow"
                   active-text="开"
                   inactive-text="关"
                   @change="toggleSnow">
        </el-switch>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      baseMapAlpha: 1,
      enableRain: false,
      enableSnow: false,
      enableLight: true,
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    }
  },
  mounted () {
    let _this = this
    this.enableLight = this.$viewer.scene.sun.show = true
    this.brightness = this.$viewer.scene.colorCorrection.brightness
    this.hue = this.$viewer.scene.colorCorrection.hue
    this.saturation = this.$viewer.scene.colorCorrection.saturation
    this.contrast = this.$viewer.scene.colorCorrection.contrast

    window.s3d.eventBus.addEventListener('baseMap-changed', (caller, args) => {
      if (args.currentMaps) {
        let alpha = window.s3d.basemapUtility.getCurrentMapAlpha(args.type)
        _this.baseMapAlpha = parseInt(alpha)
      }
    })
  },
  methods: {
    setBaseMapAlpha (alpha) {
      let baseMaps = window.s3d.basemapUtility.currentMaps
      if (baseMaps) {
        for (let map of baseMaps) {
          map.alpha = alpha
        }
      }
    },
    setSceneColorCorrection (value, key) {
      this.$viewer.scene.colorCorrection[key] = value
    },
    toggleRain (enable) {
      if (enable) {
        this.$viewer.scene.postProcessStages.rain.enabled = true
        this.$viewer.scene.postProcessStages.rain.uniforms.angle = 170
        this.$viewer.scene.postProcessStages.rain.uniforms.speed = 6
      } else {
        this.$viewer.scene.postProcessStages.rain.enabled = false
      }
    },
    toggleSnow (enable) {
      if (enable) {
        this.$viewer.scene.postProcessStages.snow.enabled = true
        this.$viewer.scene.postProcessStages.snow.uniforms.density = 15
        this.$viewer.scene.postProcessStages.snow.uniforms.angle = 0
        this.$viewer.scene.postProcessStages.snow.uniforms.speed = 6
      } else {
        this.$viewer.scene.postProcessStages.snow.enabled = false
      }
    },
    toogleLight (enable) {
      // this.$viewer.scene.sun.show = enable
      this.$viewer.scene.globe.enableLighting = enable
    }
  },
}
</script>

<style lang="scss">
.settings-pannel {
  width: 230px;
  padding-right: 8px;
  .el-divider {
    margin-top: 4px;
    margin-bottom: 6px;
  }

  .settings-item-label-more {
    font-size: 10px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .settings-item-label {
    font-size: 13px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .el-slider__runway {
    margin: 13px 0px;
  }
}
</style>
