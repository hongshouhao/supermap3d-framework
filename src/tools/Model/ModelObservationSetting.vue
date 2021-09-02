<template>
  <div class="model-ob-setting">
    <div class='compass-container'>
    </div>
    <div ref='buttonContainer'
         class="button-sight-container">
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
export default {
  components: {
  },
  data () {
    return {
      tool: null,
      slideValueChangedByUser: false,
      slideValueChangedByCode: false,
    }
  },
  mounted () {
    let _this = this
    let dom = $(".compass-container")
    dom.roundSlider({
      radius: 50,
      width: 8,
      startAngle: 270,
      endAngle: "+360",
      // circleShape: "full",
      handleSize: "+10",
      handleShape: "dot",
      sliderType: "min-range",
      showTooltip: false,
      max: 360,
      min: 0,
      // value: 270,
      update: function (e) {
        if (!_this.tool) {
          return
        }

        _this.slideValueChangedByUser = true
        let rotation = e.value
        _this.lookAt(Cesium.Math.toRadians(rotation))
        _this.$refs.buttonContainer.style = `transform: rotateZ(${rotation}deg);`
      },
      change: function () {
        _this.slideValueChangedByUser = false
      }
    });

    window.s3d.viewer.camera.changed.addEventListener(function () {
      if (_this.slideValueChangedByUser) {
        return
      }
      _this.slideValueChangedByCode = true
      let val = Cesium.Math.toDegrees(window.s3d.viewer.camera.heading)
      console.log(val)
      _this.$refs.buttonContainer.style = `transform: rotateZ(${val}deg);`
      dom.data("roundSlider").option("value", val);
    })
  },
  methods: {
    setTool (tool) {
      this.tool = tool
      console.log(this.tool)
    },
    lookAt (angle) {
      this.tool.lookAt(angle)
    },
    lookAtFront () {
      this.tool.lookAtFront()
    },
    lookAtBehind () {
      this.tool.lookAtBehind()
    },
    lookAtLeft () {
      this.tool.lookAtLeft()
    },
    lookAtRight () {
      this.tool.lookAtRight()
    },
    lookAtTop () {
      this.tool.lookAtTop()
    },
  }
}
</script>
<style lang="scss">
.model-ob-setting {
  position: relative;

  .compass-container {
    transform: perspective(0px) translateZ(1px);
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
    transform: perspective(0px) translateZ(0px);

    .button-sight {
      transform: perspective(0px) translateZ(2px);
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
