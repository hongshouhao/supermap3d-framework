<template>
  <div class="top-left-bar">
    <!-- <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget esri-interactive"
           style="border-top:none"
           title="收起">
        <span aria-hidden="true"
              class="esri-icon esri-icon-collapse"></span>
      </div>
    </div> -->

    <div class="esri-component esri-widget">
      <div
        class="esri-widget--button esri-widget esri-interactive"
        title="2D"
        @click="toggleView"
      >
        <span> {{ viewMode === '2D' ? '3D' : '2D' }}</span>
      </div>
      <div
        class="esri-widget--button esri-widget esri-interactive"
        title="全图"
        @click="globeView"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-globe"></span>
      </div>

      <div
        class="esri-widget--button esri-widget esri-interactive"
        title="放大"
        @click="zoomIn"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-plus"></span>
      </div>

      <div
        class="esri-widget--button esri-widget esri-interactive"
        title="缩小"
        @click="zoomOut"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-minus"></span>
      </div>
    </div>

    <div v-if="hasDEM" class="esri-component esri-widget">
      <div
        class="esri-widget--button esri-widget"
        title="DEM"
        :class="{ 'active-tool': demVisible }"
        @click="toggleDEM"
      >
        <span aria-hidden="true" class="esri-icon icon-tin"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div
        class="esri-widget--button esri-widget"
        title="点标注"
        :class="{ 'active-tool': activeTool == 'measure-coordinate' }"
        @click="annotatePoint"
      >
        <span aria-hidden="true" class="esri-icon icon-mea-point"></span>
      </div>
      <div
        class="esri-widget--button esri-widget"
        title="长度测量"
        :class="{ 'active-tool': activeTool == 'measure-distance' }"
        @click="startDistanceMeasure"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-measure"></span>
      </div>
      <div
        class="esri-widget--button esri-widget"
        title="面积测量"
        :class="{ 'active-tool': activeTool == 'measure-area' }"
        @click="startAreaMeasure"
      >
        <span
          aria-hidden="true"
          class="esri-icon esri-icon-measure-area"
        ></span>
      </div>
      <div
        class="esri-widget--button esri-widget"
        title="角度测量"
        :class="{ 'active-tool': activeTool == 'measure-angle' }"
        @click="startAngleMeasure"
      >
        <span aria-hidden="true" class="esri-icon icon-mea-angle"></span>
      </div>
      <div
        class="esri-widget--button esri-widget"
        title="模型观察"
        @click="startModelObservation"
      >
        <span aria-hidden="true" class="esri-icon icon-model-rotate"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <el-popover placement="right" trigger="click" popper-class="small-pop">
        <div
          slot="reference"
          class="esri-widget--button esri-widget"
          style="border-top: none"
          title="分析"
        >
          <span aria-hidden="true" class="esri-icon icon-analysis"></span>
        </div>

        <div class="top-left-popover-toolbar">
          <div class="esri-component esri-widget" style="margin: 0">
            <div
              class="esri-widget--button esri-widget"
              title="剖面分析"
              @click="startSlice"
            >
              <span aria-hidden="true" class="esri-icon esri-icon-slice"></span>
            </div>
            <div
              v-if="!usePlaneCoordinateSystem"
              class="esri-widget--button esri-widget"
              title="日照分析"
              @click="startSunlight"
            >
              <span
                aria-hidden="true"
                class="esri-icon esri-icon-environment-settings"
              ></span>
            </div>
            <div
              class="esri-widget--button esri-widget"
              title="开敞度分析"
              @click="startViewDome"
            >
              <span aria-hidden="true" class="esri-icon icon-kaichangdu"
                ><span class="path1"></span><span class="path2"></span
                ><span class="path3"></span><span class="path4"></span
                ><span class="path5"></span><span class="path6"></span
              ></span>
            </div>
            <div
              class="esri-widget--button esri-widget"
              title="天际线分析"
              @click="startSkyline"
            >
              <span aria-hidden="true" class="esri-icon icon-skyline"></span>
            </div>
            <div
              class="esri-widget--button esri-widget"
              title="视域分析"
              @click="startViewshed"
            >
              <span
                aria-hidden="true"
                class="esri-icon esri-icon-line-of-sight"
              ></span>
            </div>
            <div
              v-if="!usePlaneCoordinateSystem"
              class="esri-widget--button esri-widget"
              title="限高分析"
              @click="startHighLimit"
            >
              <span
                aria-hidden="true"
                class="esri-icon esri-icon-elevation-profile"
              ></span>
            </div>
            <div
              v-if="!usePlaneCoordinateSystem"
              class="esri-widget--button esri-widget"
              title="淹没分析"
              @click="startSubmerged"
            >
              <span aria-hidden="true" class="esri-icon icon-submerged"></span>
            </div>

            <div
              class="esri-widget--button esri-widget"
              title="开挖分析"
              @click="startExcavation"
            >
              <span aria-hidden="true" class="esri-icon icon-excavation"></span>
            </div>
          </div>
        </div>
      </el-popover>
      <div
        class="esri-widget--button esri-widget"
        title="分屏"
        :class="{ 'active-tool': activeTool == 'split-screen' }"
        @click="multiViewport"
      >
        <span aria-hidden="true" class="esri-icon icon-split-screen"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div
        class="esri-widget--button esri-widget"
        title="i查询"
        :class="{ 'active-tool': activeTool == 'iquery' }"
        @click="startIQuery"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-description"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div
        class="esri-widget--button esri-widget"
        title="清理"
        @click="clearEverything"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-trash"></span>
      </div>
      <div
        class="esri-widget--button esri-widget"
        title="设置"
        @click="settings"
      >
        <span aria-hidden="true" class="esri-icon esri-icon-settings"></span>
      </div>
    </div>

    <div class="esri-component esri-widget">
      <div class="esri-widget--button esri-widget" title="测试" @click="test()">
        <span
          aria-hidden="true"
          class="esri-icon esri-icon-experimental"
        ></span>
      </div>
    </div>

    <div
      ref="compass"
      title="罗盘仪"
      class="esri-component esri-widget esri-widget--button esri-compass"
    >
      <span
        aria-hidden="true"
        class="esri-compass__icon esri-icon-compass"
        @click="setViewNorthUp"
      >
      </span>
      <span class="esri-icon-font-fallback-text">重置罗盘仪方向</span>
    </div>

    <WidgetInfoPanel
      :visible="currentTool == 'ViewshedTool' && !usePlaneCoordinateSystem"
      title="视域分析参数"
      ref="viewshedSettingPanel"
      @closed="stopViewshedTool()"
    >
      <template>
        <ViewshedSetting />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel
      :visible="currentTool == 'SunlightTool'"
      title="阴影分析参数"
      ref="sunlightSettingPanel"
      @closed="stopSunlight()"
    >
      <template>
        <SunlightSetting ref="sunlightSetting" />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel
      :visible="currentTool == 'HighLimitTool'"
      title="限高分析"
      ref="highLimitSettingPanel"
      @closed="stopHighLimitTool()"
    >
      <template>
        <HighLimitSetting @height-changed="updateHeight" />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel
      :visible="currentTool == 'ModelObservationTool'"
      title="模型"
      ref="modelObservationPanel"
      @closed="stopModelObservation()"
    >
      <template>
        <ModelObservationSetting ref="modelObservationSetting" />
      </template>
    </WidgetInfoPanel>

    <WidgetInfoPanel
      :visible="currentTool == 'CommonSettings'"
      title="设置"
      ref="commonSettingsPanel"
      @closed="stopSetting()"
    >
      <template>
        <Settings />
      </template>
    </WidgetInfoPanel>
  </div>
</template>

<script>
import MeasureTool from '../../tools/Measurement/MeasureTool';
import PointMeasurement from '../../tools/Measurement/PointMeasurement';
import AngleMeasurement from '../../tools/Measurement/AngleMeasurement';
import SceneModeToogleTool from '../../tools/Scene/SceneModeToogleTool';

import ViewshedTool from '../../analysis/Viewshed/ViewshedTool';
import SliceTool from '../../analysis/Slice/SliceTool';
import SkylineTool from '../../analysis/Skyline/SkylineTool';
import ViewDomeTool from '../../analysis/ViewDome/ViewDomeTool';
import HighLimitTool from '../../analysis/HighLimit/HighLimitTool';
import SubmergedTool from '../../analysis/Submerged/SubmergedTool';
import ExcavationTool from '../../analysis/Excavation/ExcavationTool';

import ViewshedSetting from '../../analysis/Viewshed/ViewshedSetting.vue';
import SunlightSetting from '../../analysis/Sunlight/SunlightSetting.vue';
import HighLimitSetting from '../../analysis/HighLimit/HighLimitSetting.vue';
import ModelObservationSetting from '../../tools/Model/ModelObservationSetting.vue';
import Settings from './Settings.vue';

import WidgetInfoPanel from './WidgetInfoPanel';
import Test from '../../Test';
import {
  reCalculateCartesian,
  headingPitchRollToVector,
  rayEarthIntersection,
} from '../../utils/CesiumMath';

export default {
  name: 'top-left-bar',
  components: {
    WidgetInfoPanel,
    ViewshedSetting,
    SunlightSetting,
    HighLimitSetting,
    ModelObservationSetting,
    Settings,
  },
  data() {
    return {
      viewMode: '',
      currentTool: '',
      activeTool: '',
      demVisible: true,
    };
  },
  props: [],
  computed: {
    developing() {
      return process.env.VUE_APP_MODE === 'dev' ? true : false;
    },
    usePlaneCoordinateSystem() {
      return window.s3d.config.usePlaneCoordinateSystem;
    },
    hasDEM() {
      return window.s3d.config.dem;
    },
  },
  beforeMount() {},
  mounted() {
    window.s3d.topLeftBar = this;

    let _viewer = this.$viewer;
    _viewer.cesiumWidget.container.appendChild(
      this.$refs.viewshedSettingPanel.$el
    );
    _viewer.cesiumWidget.container.appendChild(
      this.$refs.sunlightSettingPanel.$el
    );
    _viewer.cesiumWidget.container.appendChild(
      this.$refs.highLimitSettingPanel.$el
    );
    _viewer.cesiumWidget.container.appendChild(
      this.$refs.modelObservationPanel.$el
    );
    _viewer.cesiumWidget.container.appendChild(
      this.$refs.commonSettingsPanel.$el
    );

    let _this = this;
    _viewer.camera.changed.addEventListener(function () {
      _this.$refs.compass.style = `transform: rotateZ(-${Cesium.Math.toDegrees(
        _viewer.camera.heading
      )}deg);`;
    });

    window.s3d.eventBus.addEventListener('framework-initialized', () => {
      _this.testTool = new Test();
      _this.sceneModeToogleTool = new SceneModeToogleTool(_viewer);
      _this.measureTool = new MeasureTool(_viewer);
      _this.pointMeasurement = new PointMeasurement(_viewer);
      _this.angleMeasurement = new AngleMeasurement(_viewer);
      _this.viewshedTool = new ViewshedTool(_viewer);
      _this.skylineTool = new SkylineTool(_viewer);
      _this.sliceTool = new SliceTool(_viewer);
      _this.viewDomeTool = new ViewDomeTool(_viewer);
      _this.highLimitTool = new HighLimitTool(_viewer);
      _this.submergedTool = new SubmergedTool(_viewer);
      _this.excavationTool = new ExcavationTool(_viewer);
      _this.viewshedTool.bindUI(_this.$refs.viewshedSettingPanel.$el);
      _this.init();
    });

    window.s3d.eventBus.addEventListener('mapviewer-initialized', () => {
      this.demVisible = this.$viewer.terrainProvider.visible;
    });

    window.s3d.eventBus.addEventListener('tool-started', (caller) => {
      _this.activeTool = caller.target;
    });
    window.s3d.eventBus.addEventListener('tool-stopped', () => {
      _this.activeTool = '';
    });
  },
  methods: {
    init() {
      window.s3d.eventBus.addEventListener('default-camera-settled', () => {
        if (window.s3d.config.initViewMode == '2D') {
          this.sceneModeToogleTool.toogleTo(window.s3d.config.initViewMode);
          this.viewMode = this.sceneModeToogleTool.mode;
        }
      });
    },
    globeView() {
      if (this.sceneModeToogleTool.mode === '2D') {
        let copy = JSON.parse(JSON.stringify(window.s3d.config.defaultCamera));
        let destination = new Cesium.Cartesian3(
          copy.destination.x,
          copy.destination.y,
          copy.destination.z
        );
        let direction = headingPitchRollToVector(
          destination,
          copy.orientation.heading - Cesium.Math.PI_OVER_TWO,
          copy.orientation.pitch,
          copy.orientation.roll
        );

        let intersection = rayEarthIntersection(destination, direction);

        let distance = Cesium.Cartesian3.distance(intersection, destination);
        copy.destination = reCalculateCartesian(intersection, distance);
        copy.orientation.heading = 0;
        copy.orientation.pitch = -1 * Cesium.Math.PI_OVER_TWO;
        copy.orientation.roll = 0;
        copy.convert =
          this.$viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW;
        this.$viewer.camera.flyTo(copy);
      } else {
        window.s3d.config.defaultCamera.convert =
          this.$viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW;
        this.$viewer.camera.flyTo(window.s3d.config.defaultCamera);
      }
    },
    toggleView() {
      this.sceneModeToogleTool.toogle();
      this.viewMode = this.sceneModeToogleTool.mode;
    },
    toggleViewTo(mode) {
      this.sceneModeToogleTool.toogleTo(mode);
      this.viewMode = this.sceneModeToogleTool.mode;
    },
    setViewNorthUp() {
      window.s3d.viewUtility.rotateZ(this.$viewer.camera.heading);
    },
    zoomIn() {
      this.$viewer.camera.zoomIn(100);
    },
    zoomOut() {
      this.$viewer.camera.zoomOut(100);
    },
    toggleDEM() {
      if (this.demVisible) {
        this.$viewer.terrainProvider.visible = false;
      } else {
        this.$viewer.terrainProvider.visible = true;
      }
      this.demVisible = !this.demVisible;
    },
    startIQuery() {
      this.currentTool = 'IQueryTool';
      window.s3d.popup.enable();
    },
    startDistanceMeasure() {
      this.currentTool = 'MeasureTool';
      this.measureTool.measureDistance();
    },
    startAreaMeasure() {
      this.currentTool = 'MeasureTool';
      this.measureTool.measureArea();
    },
    annotatePoint() {
      this.currentTool = 'PointMeasurement';
      this.pointMeasurement.start();
    },
    startAngleMeasure() {
      this.currentTool = 'AngleMeasurement';
      this.angleMeasurement.start();
    },
    startSlice() {
      this.currentTool = 'SliceTool';
      this.sliceTool.start();
    },
    startViewshed() {
      this.currentTool = 'ViewshedTool';
      this.viewshedTool.start();
    },
    startSunlight() {
      this.currentTool = 'SunlightTool';
      this.$refs.sunlightSetting.init();
    },
    startSkyline() {
      this.currentTool = 'SkylineTool';
      this.skylineTool.start();
    },
    startViewDome() {
      this.currentTool = 'ViewDomeTool';
      this.viewDomeTool.start();
    },
    startHighLimit() {
      this.currentTool = 'HighLimitTool';
      this.highLimitTool.start();
    },
    startSubmerged() {
      this.currentTool = 'SubmergedTool';
      this.submergedTool.clear();
      this.submergedTool.start();
    },
    startModelObservation() {
      this.currentTool = 'ModelObservationTool';
    },
    startExcavation() {
      this.currentTool = 'ExcavationTool';
      this.excavationTool.start();
    },
    multiViewport() {
      window.s3d.layerTree.toggleViewportMode();
    },
    updateHeight(height) {
      if (this.highLimitTool) {
        this.highLimitTool.setHeight(height);
      }
    },
    settings() {
      this.currentTool = 'CommonSettings';
    },
    stopIQuery() {
      this.currentTool = '';
      window.s3d.popup.disable();
    },
    stopViewshedTool() {
      this.viewshedTool.clear();
      this.currentTool = '';
    },
    stopMeasureTool() {
      this.measureTool.clear();
      this.currentTool = '';
    },
    stopPointMeasurement() {
      this.pointMeasurement.clear();
      this.currentTool = '';
    },
    stopAngleMeasurement() {
      this.angleMeasurement.clear();
      this.currentTool = '';
    },
    stopSkylineTool() {
      this.skylineTool.clear();
      this.currentTool = '';
    },
    stopViewDomeTool() {
      this.viewDomeTool.clear();
      this.currentTool = '';
    },
    stopHighLimitTool() {
      this.highLimitTool.clear();
      this.currentTool = '';
    },
    stopSliceTool() {
      this.sliceTool.clear();
      this.currentTool = '';
    },
    stopSunlight() {
      this.$refs.sunlightSetting.reset();
      this.currentTool = '';
    },
    stopSubmerged() {
      this.submergedTool.clear();
      this.currentTool = '';
    },
    stopModelObservation() {
      this.currentTool = '';
    },
    stopExcavation() {
      this.excavationTool.clear();
      this.currentTool = '';
    },
    stopSetting() {
      this.currentTool = '';
    },
    clearEverything() {
      this.stopIQuery();
      this.stopMeasureTool();
      this.stopAngleMeasurement();
      this.stopPointMeasurement();
      this.stopViewshedTool();
      this.stopSkylineTool();
      this.stopViewDomeTool();
      this.stopHighLimitTool();
      this.stopSliceTool();
      this.stopSunlight();
      this.stopSubmerged();
      this.stopModelObservation();
      this.stopExcavation();

      for (let i = 0; i < this.$viewer.dataSources.length; i++) {
        let ds = this.$viewer.dataSources.get(i);
        if (ds.name.startsWith('temp_')) {
          this.$viewer.dataSources.remove(ds, true);
        }
      }
      this.$viewer.scene.primitives.removeAll();

      window.s3d.eventBus.dispatch('clear-clicked', null, null);
    },

    test() {
      this.testTool.doTest();
    },
  },
};
</script>

<style lang="scss">
.top-left-popover-toolbar {
  display: flex;
}

.my-widget__heading {
  display: none;
}

.active-tool {
  color: #4279e4 !important;
}
.small-pop {
  width: 38px !important;
  .el-popper {
    padding: 0 !important;
  }

  &.el-popover.el-popper {
    border: none !important;
    width: 38px !important;
    min-width: 38px !important;
    padding: 0px !important;
  }
}
</style>
