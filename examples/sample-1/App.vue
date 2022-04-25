<!--
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:15
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-13 15:16:08
 * @FilePath: \supermap3d-framework\examples\sample-1\App.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <smmap @viewer-created="onViewerCreated">
    <template slot="tool-bar">
      <n-tool-bar light
                  horizonal
                  v-if="viewerCreated"
                  :position="[330, 15]"
                  :position-type="['right', 'top']">
        <n-tool-item code="measure-angle"
                     icon="icon-mea-angle">
          <n-tool-bar light
                      horizonal
                      static>
            <n-tool-item code="measure-point"
                         icon="icon-mea-point"></n-tool-item>
            <n-tool-item code="measure-angle"
                         icon="icon-mea-angle"></n-tool-item>
          </n-tool-bar>
        </n-tool-item>
        <n-tool-item code="circle"
                     @click.native="onCirclePick"
                     icon="icon-circle"></n-tool-item>
        <n-tool-item code="draw-rectangle"
                     icon="icon-rectangle"
                     @click.native="onRectanglePick"></n-tool-item>
        <n-tool-item code="polygon"
                     icon="icon-pencil"
                     @click.native="onDrawPolygon"></n-tool-item>
        <n-tool-item code="draw-polyline"
                     icon="icon-pencil"></n-tool-item>
        <n-tool-item code="split-screen"
                     icon="icon-split-screen"></n-tool-item>
        <n-tool-item code="iquery"
                     icon="esri-icon-description"></n-tool-item>
        <n-tool-item code="setting"
                     icon="esri-icon-settings"></n-tool-item>
        <n-tool-item code="custom"
                     icon="icon-bin"
                     @click.native="onClear"></n-tool-item>
      </n-tool-bar>
      <div v-else></div>
    </template>
  </smmap>
</template>
<script>
import { addMessageListener } from '../../core/IframeMessage';
import SMAP from '@/index.js';
export default {
  data () {
    return {
      viewerCreated: false,
    };
  },
  components: {},
  mounted () {
    addMessageListener();
  },
  methods: {
    onViewerCreated () {
      this.viewerCreated = true;
    },
    onClear () {
      window.s3d.clearTempEntity();
    },
    onCirclePick () {
      this.circleTool = new SMAP.Tools.CircleDrawingTool(window.s3d.viewer);
      this.circleTool.start().then((geojson) => {
        console.log(geojson);
      });
    },
    onRectanglePick () {
      this.tool = new SMAP.Tools.RectangleDrawingTool(window.s3d.viewer);
      this.tool.start().then((geojson) => {
        console.log(geojson);
      });
    },
    onDrawPolygon () {
      this.polygonTool = new SMAP.Tools.PolygonDrawingTool(window.s3d.viewer, {
        lineColor: '#ff0000',
      });
      this.polygonTool.start();
      this.polygonTool.entityAdded = (geojson) => {
        console.log(geojson);
      };
    },
  },
};
</script>
