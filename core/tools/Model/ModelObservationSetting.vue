<template>
  <div class="model-ob-setting">
    <div class="compass-container">
      <round-slider v-model="heading"
                    :change="headingChange"
                    :update="headingUpdate"
                    pathColor="#6699FF"
                    animation="false"
                    min="0"
                    max="360"
                    start-angle="270"
                    end-angle="+360"
                    line-cap="round"
                    radius="50"
                    handle-size="+10"
                    handle-shape="dot"
                    show-tooltip="false"
                    width="7" />
    </div>
    <div ref="buttonContainer"
         class="
                    button-sight-container">
      <div class="button-sight button-left-sight"
           @click="lookAtLeft">
        左
      </div>
      <div class="button-sight button-right-sight"
           @click="lookAtRight">
        右
      </div>
      <div class="button-sight button-front-sight"
           @click="lookAtFront">
        前
      </div>
      <div class="button-sight button-behind-sight"
           @click="lookAtBehind">
        后
      </div>
      <div class="button-sight button-top-sight"
           @click="lookAtTop">
        上
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import RoundSlider from 'vue-round-slider';
import { boundingSphereFromFeature } from '../../utils/CesiumUtility';
import ModelObservationTool from './ModelObservationTool';
export default {
  components: {
    RoundSlider,
  },
  data () {
    return {
      heading: 0,
      headingChangedBySlider: false,
      scale: 1,
    };
  },
  mounted () {
    let _this = this;
    _this.tool = new ModelObservationTool(_this.$viewer);
    _this.$viewer.camera.changed.addEventListener(function () {
      if (_this.headingChangedBySlider) {
        return;
      }
      let val = Cesium.Math.toDegrees(_this.$viewer.camera.heading);
      _this.heading = val;
      _this.$refs.buttonContainer.style = `transform: rotateZ(${val}deg);`;
    });

    $('.compass-container .rs-handle').mousedown(function () {
      _this.caculateScale();
    });
  },
  methods: {
    init () {
      this.tool.start(() => {
        this.tool.lookAtFront();
      });
    },
    reset () {
      this.tool.clear();
    },
    lookAt (angle) {
      this.tool.lookAt(angle, this.scale);
    },
    lookAtFront () {
      this.tool.lookAtFront();
    },
    lookAtBehind () {
      this.tool.lookAtBehind();
    },
    lookAtLeft () {
      this.tool.lookAtLeft();
    },
    lookAtRight () {
      this.tool.lookAtRight();
    },
    lookAtTop () {
      this.tool.lookAtTop();
    },
    headingUpdate (e) {
      if (!this.tool) {
        return;
      }

      this.headingChangedBySlider = true;
      let rotation = e.value;
      this.lookAt(Cesium.Math.toRadians(rotation));
      this.$refs.buttonContainer.style = `transform: rotateZ(${rotation}deg);`;
    },
    headingChange () {
      this.headingChangedBySlider = false;
    },
    caculateScale () {
      if (!this.tool?.feature) {
        return;
      }
      let boundingSphere = boundingSphereFromFeature(this.tool.feature);
      let dis = Cesium.Cartesian3.distance(
        boundingSphere.center,
        this.$viewer.camera.position
      );

      // 1.9807740244477263(常数) = 完整定位时相机位置与球体中心点的距离/球体的半径
      let radius = dis / 1.9807740244477263;
      this.scale = radius / boundingSphere.radius;
    },
  },
};
</script>
<style lang="scss">
.model-ob-setting {
  position: relative;

  .compass-container {
    position: relative;
    .rs-path-color {
      background-color: #53b9de;
    }
  }

  .button-sight-container {
    position: absolute;
    width: 72px;
    height: 72px;
    margin: 14px;
    top: 0px;

    .button-sight {
      position: absolute;
      &:hover {
        font-weight: bold;
      }
    }
    .button-left-sight {
      top: calc(50% - 14px);
      left: 0px;
    }
    .button-right-sight {
      top: calc(50% - 14px);
      right: 0px;
    }
    .button-front-sight {
      bottom: 0px;
      left: calc(50% - 8px);
    }
    .button-behind-sight {
      top: 0px;
      left: calc(50% - 8px);
    }
    .button-top-sight {
      top: calc(50% - 14px);
      left: calc(50% - 8px);
    }
  }
}
</style>
