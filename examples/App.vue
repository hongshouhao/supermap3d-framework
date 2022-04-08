<!--
 * @Author: zhangbo
 * @Date: 2022-04-06 15:40:05
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-06 15:40:05
 * @FilePath: \supermap3d-framework\examples\App.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<!--
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:15
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-06 15:39:02
 * @FilePath: \supermap3d-framework\examples\App.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <smmap @viewer-created="onViewerCreated">
    <template slot="tool-bar">
      <n-tool-bar :position="[60, 30]" light horizonal v-if="viewerCreated">
        <n-tool-item code="measure-angle" icon="icon-mea-angle">
          <n-tool-bar light horizonal static>
            <n-tool-item
              code="measure-point"
              icon="icon-mea-point"
            ></n-tool-item>
            <n-tool-item
              code="measure-angle"
              icon="icon-mea-angle"
            ></n-tool-item>
          </n-tool-bar>
        </n-tool-item>
        <n-tool-item code="draw-polygon" icon="icon-rectangle"></n-tool-item>
        <n-tool-item code="draw-polyline" icon="icon-pencil"></n-tool-item>
        <n-tool-item code="split-screen" icon="icon-split-screen"></n-tool-item>
        <n-tool-item code="iquery" icon="esri-icon-description"></n-tool-item>
        <n-tool-item code="setting" icon="esri-icon-settings"></n-tool-item>
      </n-tool-bar>
    </template>
  </smmap>
</template>
<script>
import { addMessageListener } from "../../core/IframeMessage";

export default {
  data() {
    return {
      viewerCreated: false,
    };
  },
  components: {},
  mounted() {
    addMessageListener();
    // window.s3d.enableBloom()
    window.s3d.topLeftBar.highLimitTool.setTargetLayers(["楼幢"]);
    window.s3d.topLeftBar.submergedTool
      .setTargetLayers(["园区-盒子"])
      .includingGlobe()
      //园区
      .setCoverageArea([
        120.655, 31.3219, 3, 120.6581, 31.3069, 3, 120.6794, 31.3081, 3,
        120.6794, 31.3251, 3, 120.655, 31.3219, 3,
      ]);
    //东沙湖
    // .setCoverageArea([
    //   120.7658,
    //   31.3345,
    //   3,
    //   120.7644,
    //   31.3397,
    //   3,
    //   120.769,
    //   31.3403,
    //   3,
    //   120.7701,
    //   31.3352,
    //   3,
    //   120.7658,
    //   31.3345,
    //   3,
    // ])
  },
  methods: {
    onViewerCreated(viewer) {
      this.viewerCreated = true;
      this.viewer = viewer;
    },
  },
};
</script>
