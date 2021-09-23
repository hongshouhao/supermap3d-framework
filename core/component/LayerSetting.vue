<template>
  <div class="layer-settings">
    <span class="layer-settings-item-label">透明度</span>
    <el-slider :min="10"
               :max="100"
               v-model="conf.layer.opacity"
               @input="setOpacity">
    </el-slider>
    <div v-if="showRenderer">
      <span class="layer-settings-item-label">管线流向</span>
      <br />
      <el-switch v-model="enableRenderer"
                 active-text="开"
                 inactive-text="关"
                 @change="toogleRenderer">
      </el-switch>
    </div>
  </div>
</template>

<script> 
import LayersRenderer from './LayersRenderer'
export default {
  data () {
    return {
      enableRenderer: false,
      layersRenderer: new LayersRenderer(window.s3d.viewer),
    }
  },
  computed: {
    showRenderer () {
      return this.conf.layer.renderer && this.conf.layer.renderer.type === "S3MLAYER"
    }
  },
  props: ["conf"],
  mounted () {
  },
  methods: {
    setOpacity (opacity) {
      window.s3d.setLayerOpacity(this.conf.cesiumLayer, opacity)
    },
    toogleRenderer (enable) {
      if (enable) {
        this.layersRenderer.startRender(this.conf.cesiumLayer.name)
      }
      else {
        this.layersRenderer.stopRender(this.conf.cesiumLayer.name)
      }
    }
  }

}
</script>
<style lang="scss">
.layer-settings-item-label {
  font-size: 5px;
  margin-bottom: 0px;
}

.layer-settings {
  .el-slider__runway {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
