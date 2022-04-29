<template>
  <div class="layer-settings"
       v-if="cesiumLayerLoaded">
    <el-row>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">透明度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="1"
                   :step="0.01"
                   v-model="opacity"
                   @input="setOpacity">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">亮度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="brightness"
                   @input="setLayerProperty($event,'brightness')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">色调</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="-1"
                   :max="1"
                   :step="0.01"
                   v-model="hue"
                   @input="setLayerProperty($event,'hue')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">饱和度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="saturation"
                   @input="setLayerProperty($event,'saturation')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">对比度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="2"
                   :step="0.01"
                   v-model="contrast"
                   @input="setLayerProperty($event,'contrast')">
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">灰度</span>
      </el-col>
      <el-col :span="16">
        <el-slider :min="0"
                   :max="1"
                   :step="0.01"
                   v-model="gamma"
                   @input="setLayerProperty($event,'gamma')">
        </el-slider>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="8">
        <span class="layer-settings-item-label">光照</span>
      </el-col>
      <el-col :span="16">
        <el-switch v-model="hasLight"
                   active-text="开"
                   inactive-text="关"
                   @change="toogleLight">
        </el-switch>
      </el-col>
    </el-row> -->
    <el-row>
      <div v-if="showRenderer">
        <el-col :span="8">
          <span class="layer-settings-item-label">管线流向</span>
        </el-col>
        <el-col :span="16">
          <el-switch v-model="enableRenderer"
                     active-text="开"
                     inactive-text="关"
                     @change="toogleRenderer">
          </el-switch>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { getLayerOpacity, setLayerOpacity } from '@/utils/LayerUtility';

export default {
  data () {
    return {
      enableRenderer: false,
      cesiumLayerLoaded: false,
      opacity: 0,
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
      gamma: 0,
      hasLight: false,
    };
  },
  computed: {
    showRenderer () {
      return this.layerInfo?.renderer?.type === 'S3MLAYER';
    },
  },
  props: ['lyElModel'],
  watch: {
    'lyElModel.cesiumLayerLoaded': {
      handler (val) {
        if (val) {
          this.cesiumLayerLoaded = true;
          this.cesiumLayer = this.lyElModel.cesiumLayer;
          this.opacity = getLayerOpacity(this.cesiumLayer);
          this.brightness = this.cesiumLayer.brightness;
          this.hue = this.cesiumLayer.hue;
          this.saturation = this.cesiumLayer.saturation;
          this.contrast = this.cesiumLayer.contrast;
          this.gamma = this.cesiumLayer.gamma;
          this.hasLight = !this.cesiumLayer.hasLight;
        }
      },
      immediate: true
    }
  },
  mounted () {
    let _this = this;
    window.s3d.eventBus.addEventListener(
      'layer-invisible-internal',
      (caller, lyName) => {
        if (_this.layerInfo && lyName === _this.layerInfo.name) {
          _this.enableRenderer = false;
        }
      }
    );
  },
  methods: {
    setOpacity (opacity) {
      if (this.cesiumLayer) {
        setLayerOpacity(this.cesiumLayer, opacity);
      }
    },
    setLayerProperty (value, key) {
      if (this.cesiumLayer) {
        this.cesiumLayer[key] = value;
      }
    },
    toogleLight (val) {
      this.lyElModel.cesiumLayer.hasLight = !val;
    },
    toogleRenderer (enable) {
      if (enable) {
        window.s3d.layerManager.layerRenderer.startRender(this.lyElModel.cesiumLayer.name);
      } else {
        window.s3d.layerManager.layerRenderer.stopRender(this.lyElModel.cesiumLayer.name);
      }
    },
  },
};
</script>
<style lang="scss">
.layer-settings {
  .layer-settings-item-label {
    font-size: 5px;
    margin-bottom: 0px;
  }
  .el-slider__runway {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
