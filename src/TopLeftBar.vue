<template>
  <div class="top-left-bar">
    <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget esri-interactive"
           style="border-top:none"
           title="收起"
           @click="globeView">
        <span aria-hidden="true"
              class="esri-icon esri-icon-collapse"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget esri-interactive"
           title="2D"
           @click="toggleView">
        <span> {{ to3dView ? '3D' : '2D' }}</span>
      </div>

      <div class="esri-widget--button esri-widget esri-interactive"
           title="全图"
           @click="globeView">
        <span aria-hidden="true"
              class="esri-icon esri-icon-globe"></span>
      </div>

      <div class="esri-widget--button esri-widget esri-interactive"
           title="放大"
           @click="zoomIn">
        <span aria-hidden="true"
              class="esri-icon esri-icon-plus"></span>
      </div>

      <div class="esri-widget--button esri-widget esri-interactive"
           title="缩小"
           @click="zoomOut">
        <span aria-hidden="true"
              class="esri-icon esri-icon-minus"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget"
           title="长度测量"
           @click="startDistanceMeasure">
        <span aria-hidden="true"
              class="esri-icon esri-icon-measure"></span>
      </div>
      <div class="esri-widget--button esri-widget"
           title="面积测量"
           @click="startAreaMeasure">
        <span aria-hidden="true"
              class="esri-icon esri-icon-measure-area"></span>
      </div>
      <div class="esri-widget--button esri-widget"
           title="点标注"
           style="cursor:not-allowed"
           @click="annotatePoint">
        <span aria-hidden="true"
              class="esri-icon my-icon-mea-point"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <el-popover placement="right"
                  trigger="click"
                  popper-class="small-pop">
        <template #reference>
          <div class="esri-widget--button esri-widget "
               title="分析">
            <span aria-hidden="true"
                  class="esri-icon icon-analysis"></span>
          </div>
        </template>
        <div class="top-left-popover-toolbar">
          <div class="esri-component esri-widget"
               style="margin:0;">
            <div class="esri-widget--button esri-widget"
                 title="剖面分析"
                 style="cursor:not-allowed"
                 @click="startSlice">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-slice"></span>
            </div>
            <div class="esri-widget--button esri-widget"
                 title="日照分析"
                 @click="startSunlight">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-environment-settings"></span>
            </div>
            <div class="esri-widget--button esri-widget"
                 title="开敞度分析"
                 @click="startViewDome">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-visible"></span>
            </div>
            <div class="esri-widget--button esri-widget"
                 title="天际线分析"
                 @click="startSkyline">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-urban-model"></span>
            </div>
            <div class="esri-widget--button esri-widget "
                 title="视域分析"
                 @click="startViewshed">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-line-of-sight"></span>
            </div>
            <div class="esri-widget--button esri-widget "
                 title="限高分析"
                 @click="startHighLimit">
              <span aria-hidden="true"
                    class="esri-icon esri-icon-elevation-profile"></span>
            </div>
          </div>
        </div>
      </el-popover>
    </div>

    <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget"
           title="清理"
           @click="clearEverything">
        <span aria-hidden="true"
              class="esri-icon esri-icon-trash"></span>
      </div>
    </div>

    <WidgetInfoPanel v-show="currentTool=='ViewshedTool'"
                     title="视域分析参数"
                     ref="viewshedSettingPanel">
      <template>
        <ViewshedSetting />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel v-show="currentTool=='SunlightTool'"
                     title="阴影分析参数"
                     ref="sunlightSettingPanel">
      <template>
        <SunlightSetting ref="sunlightSetting" />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel v-show="currentTool=='HighLimitTool'"
                     title="限高分析"
                     ref="highLimitSettingPanel">
      <template>
        <HighLimitSetting @height-changed="updateHeight" />
      </template>
    </WidgetInfoPanel>
  </div>
</template>

<script>
import MeasureTool from './MeasureTool'
import ViewshedTool from './analysis/Viewshed/ViewshedTool'
import ViewshedSetting from './analysis/Viewshed/ViewshedSetting.vue'
import SunlightSetting from './analysis/Sunlight/SunlightSetting.vue'
import HighLimitSetting from './analysis/HighLimit/HighLimitSetting.vue'
import SliceTool from './analysis/Slice/SliceTool'
import SkylineTool from './analysis/Skyline/SkylineTool'
import ViewDomeTool from './analysis/ViewDome/ViewDomeTool'
import HighLimitTool from './analysis/HighLimit/HighLimitTool'
import WidgetInfoPanel from './WidgetInfoPanel'

export default {
  components: {
    WidgetInfoPanel,
    ViewshedSetting,
    SunlightSetting,
    HighLimitSetting
  },
  data () {
    return {
      to3dView: false,
      currentTool: "",
      measureTool: null,
      viewshedTool: null,
      skylineTool: null,
      shadowQueryTool: null,
      sliceTool: null,
      viewDomeTool: null,
      highLimitTool: null,
    }
  },
  props: [],
  computed: {
  },
  beforeMount () {
  },
  mounted () {
    document.body.appendChild(this.$refs.viewshedSettingPanel.$el)
    document.body.appendChild(this.$refs.sunlightSettingPanel.$el)
    document.body.appendChild(this.$refs.highLimitSettingPanel.$el)
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
      this.currentTool = "MeasureTool"
      this.measureTool.measureDistance()
    },

    startAreaMeasure () {
      if (!this.measureTool) {
        this.measureTool = new MeasureTool(window.viewer)
      }
      this.currentTool = "MeasureTool"
      this.measureTool.measureArea()
    },

    annotatePoint () { },

    startSlice () {
      if (!this.sliceTool) {
        this.sliceTool = new SliceTool(window.viewer)
      }
      this.sliceTool.start()
      this.currentTool = "SliceTool"
    },

    startViewshed () {
      if (!this.viewshedTool) {
        this.viewshedTool = new ViewshedTool(window.viewer)
        this.viewshedTool.bindUI(this.$refs.viewshedSettingPanel.$el)
      }
      this.viewshedTool.start()
      this.currentTool = "ViewshedTool"
    },

    startSunlight () {
      this.$refs.sunlightSetting.init()
      this.currentTool = "SunlightTool"
    },

    startSkyline () {
      if (!this.skylineTool) {
        this.skylineTool = new SkylineTool(window.viewer)
      }
      this.currentTool = "SkylineTool"
      this.skylineTool.start()
    },

    startViewDome () {
      if (!this.viewDomeTool) {
        this.viewDomeTool = new ViewDomeTool(window.viewer)
      }
      this.currentTool = "ViewDomeTool"
      this.viewDomeTool.start()
    },

    startHighLimit () {
      if (!this.highLimitTool) {
        this.highLimitTool = new HighLimitTool(window.viewer)
      }
      this.currentTool = "HighLimitTool"
      this.highLimitTool.setTargetLayers(["楼幢"])
      this.highLimitTool.start()
    },

    updateHeight (height) {
      if (this.highLimitTool) {
        this.highLimitTool.setHeight(height)
      }
    },

    clearEverything () {
      if (this.measureTool) {
        this.measureTool.clear()
      }

      if (this.viewshedTool) {
        this.viewshedTool.clear()
      }

      if (this.skylineTool) {
        this.skylineTool.clear()
      }

      if (this.shadowQueryTool) {
        this.shadowQueryTool.clear()
      }

      if (this.viewDomeTool) {
        this.viewDomeTool.clear()
      }

      if (this.highLimitTool) {
        this.highLimitTool.clear()
      }

      this.$refs.sunlightSetting.reset()
      this.currentTool = ""
    },
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
