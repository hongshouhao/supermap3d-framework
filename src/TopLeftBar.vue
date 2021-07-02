<template>
  <div class="top-left-bar">
    <div class="my-component my-widget">
      <div class="my-widget-button my-widget my-interactive"
           style="border-top:none"
           title="收起"
           @click="globeView">
        <span aria-hidden="true"
              class="esri-icon my-icon-collapse"></span>
      </div>
    </div>

    <div class="my-component my-widget">
      <div class="my-widget-button my-widget my-interactive"
           title="2D"
           @click="toggleView">
        <span> {{ to3dView ? '3D' : '2D' }}</span>
      </div>

      <div class="my-widget-button my-widget my-interactive"
           title="全图"
           @click="globeView">
        <span aria-hidden="true"
              class="my-icon my-icon-fullview"></span>
      </div>

      <div class="my-widget-button my-widget my-interactive"
           title="放大"
           @click="zoomIn">
        <span aria-hidden="true"
              class="my-icon my-icon-plus"></span>
      </div>

      <div class="my-widget-button my-widget my-interactive"
           title="缩小"
           @click="zoomOut">
        <span aria-hidden="true"
              class="my-icon my-icon-minus"></span>
      </div>
    </div>

    <div class="my-component my-widget">
      <div class="my-widget-button my-widget"
           title="长度测量"
           @click="startDistanceMeasure">
        <span aria-hidden="true"
              class="my-icon my-icon-measure"></span>
      </div>
      <div class="my-widget-button my-widget"
           title="面积测量"
           @click="startAreaMeasure">
        <span aria-hidden="true"
              class="my-icon my-icon-measure-area"></span>
      </div>
      <div class="my-widget-button my-widget"
           title="点标注"
           @click="annotatePoint">
        <span aria-hidden="true"
              class="my-icon my-icon-mea-point"></span>
      </div>
    </div>

    <div class="my-component my-widget">
      <el-popover placement="right"
                  trigger="click"
                  popper-class="small-pop">
        <template #reference>
          <div class="my-widget-button my-widget "
               title="分析">
            <span aria-hidden="true"
                  class="my-icon icon-analysis"></span>
          </div>
        </template>
        <div class="top-left-popover-toolbar">
          <div class="my-component my-widget"
               style="margin:0;">
            <div class="my-widget-button my-widget"
                 title="剖面分析"
                 @click="startSlice">
              <span aria-hidden="true"
                    class="my-icon my-icon-slice"></span>
            </div>
            <div class="my-widget-button my-widget"
                 title="高程分析">
              <span aria-hidden="true"
                    class="my-icon my-icon-elevation-profile"></span>
            </div>
            <div class="my-widget-button my-widget"
                 title="日照分析">
              <span aria-hidden="true"
                    class="my-icon my-icon-environment-settings"></span>
            </div>
            <div class="my-widget-button my-widget"
                 title="天际线分析"
                 style="cursor:not-allowed">
              <span aria-hidden="true"
                    class="my-icon my-icon-urban-model"></span>
            </div>
            <div class="my-widget-button my-widget "
                 title="视域分析"
                 @click="startViewshed">
              <span aria-hidden="true"
                    class="my-icon my-icon-line-of-sight"></span>
            </div>
          </div>
        </div>
      </el-popover>
    </div>

    <div class="my-component my-widget">
      <div class="my-widget-button my-widget"
           title="清理"
           @click="clearEverything">
        <span aria-hidden="true"
              class="my-icon my-icon-trash"></span>
      </div>
    </div>

    <WidgetInfoPanel v-show="showViewshedInfoPanel"
                     title="视域分析参数"
                     ref="viewshedInfoPanel">
      <template>
        <div>
          <label>方向(度)</label>
          <input type="range"
                 id="direction"
                 min="0"
                 max="360"
                 step="1.0"
                 title="方向"
                 data-bind="value: direction, valueUpdate: 'input'">
          <input type="text"
                 readonly
                 size="5"
                 data-bind="value: direction">
        </div>

        <div>
          <label>翻转(度)</label>
          <input type="range"
                 id="pitch"
                 min="-90"
                 max="90"
                 step="1.0"
                 value="1"
                 title="翻转"
                 data-bind="value: pitch, valueUpdate: 'input'">
          <input type="text"
                 readonly
                 size="5"
                 data-bind="value: pitch">
        </div>

        <div>
          <label>距离(米)</label>
          <input type="range"
                 id="distance"
                 min="1"
                 max="500"
                 step="1.0"
                 value="1"
                 title="距离"
                 data-bind="value: distance, valueUpdate: 'input'">
          <input type="text"
                 readonly
                 size="5"
                 data-bind="value: distance">
        </div>

        <div>
          <label>水平视场角(度)</label>
          <input type="range"
                 id="horizonalFov"
                 min="1"
                 max="120"
                 step="1"
                 value="1"
                 title="水平视场角"
                 data-bind="value: horizontalFov, valueUpdate: 'input'">
          <input type="text"
                 readonly
                 size="5"
                 data-bind="value: horizontalFov">
        </div>

        <div>
          <label>垂直视场角(度)</label>
          <input type="range"
                 id="verticalFov"
                 min="1"
                 max="90"
                 step="1.0"
                 value="1"
                 title="垂直视场角"
                 data-bind="value: verticalFov, valueUpdate: 'input'">
          <input type="text"
                 readonly
                 size="5"
                 data-bind="value: verticalFov">
        </div>
      </template>
    </WidgetInfoPanel>
  </div>
</template>

<script>
import MeasureTool from './MeasureTool'
import Viewshed3dTool from './Viewshed3dTool'
import WidgetInfoPanel from './WidgetInfoPanel'

export default {
  components: {
    WidgetInfoPanel
  },
  data () {
    return {
      measureTool: null,
      viewshed3dTool: null,
      showViewshedInfoPanel: false,
      to3dView: false
    }
  },
  props: [],
  computed: {
  },
  beforeMount () {
  },
  mounted () {
    document.body.appendChild(this.$refs.viewshedInfoPanel.$el)
  },
  methods: {
    globeView () { },
    toggleView () {
    },
    zoomIn () {
      window.viewer.camera.zoomIn(100)
    },
    zoomOut () {
      window.viewer.camera.zoomOut(100)
    },
    startDistanceMeasure () {
      if (!this.measureTool) {
        this.measureTool = new MeasureTool(window.viewer)
      }
      this.measureTool.measureDistance()
    },
    startAreaMeasure () {
      if (!this.measureTool) {
        this.measureTool = new MeasureTool(window.viewer)
      }
      this.measureTool.measureArea()
    },
    annotatePoint () { },
    startSlice () { },
    startViewshed () {
      if (!this.viewshed3dTool) {
        this.viewshed3dTool = new Viewshed3dTool(window.viewer)
        this.viewshed3dTool.bindUI(this.$refs.viewshedInfoPanel.$el)
      }
      this.viewshed3dTool.reset()
      this.showViewshedInfoPanel = true

    },
    clearEverything () {
      if (this.measureTool) {
        this.measureTool.clear()
      }

      if (this.viewshed3dTool) {
        this.viewshed3dTool.clear()
      }
      this.showViewshedInfoPanel = false

    }
  },
}
</script>

<style lang="scss">
.top-left-popover-toolbar {
  display: flex;
}

.my-widget__heading {
  display: none;
}

.small-pop {
  width: 38px !important;
  .el-popper {
    padding: 0 !important;
  }
  &.el-popover.el-popper {
    width: 38px !important;
    min-width: 38px !important;
    padding: 0px !important;
  }
}
</style>
