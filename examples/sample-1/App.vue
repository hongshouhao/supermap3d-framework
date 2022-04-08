<!--
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:15
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 08:40:17
 * @FilePath: \supermap3d-framework\examples\sample-1\App.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <smmap @viewer-created="onViewerCreated">
    <template slot="tool-bar">
      <n-tool-bar light horizonal v-if="viewerCreated" :position="[330,15]" :position-type="['right','top']">
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
      <div v-else></div>
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
  },
  methods: {
    onViewerCreated() {
      this.viewerCreated = true;
    },
  },
};
</script>
