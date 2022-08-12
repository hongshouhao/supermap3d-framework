<!--
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:14
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-07 15:44:39
 * @FilePath: \supermap3d-framework\core\components\common\TopRightBar.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <div class="top-right-bar">
    <Basemap />
    <el-popover
      ref="layersTreePopover"
      placement="bottom"
      trigger="manual"
      v-model="visible"
      popper-class="layer-popup"
    >
      <LayersTree ref="layersTree" />

      <el-button
        slot="reference"
        class="btn-layers"
        @click="visible = !visible"
      >
        <span style="display: flex"
          ><i class="esri-icon-layers" style="margin-right: 5px"></i
          ><span>图层</span><i class="el-icon-arrow-down el-icon--right"></i
        ></span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import LayersTree from '../layerstree/index.vue';
import Basemap from '../basemap/index.vue';
export default {
  name: 'top-right-bar',
  components: {
    LayersTree,
    Basemap,
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    window.s3d.layersTree = this.$refs.layersTree;
    window.s3d.layersTreePopover = this.$refs.layersTreePopover;
  },
  methods: {},
};
</script>
<style lang="scss">
.top-right-bar {
  padding: 0;
  margin: 0;
  /* opacity: 0; */
  border: 0ch;
  display: flex;
  justify-content: center;
  .btn-layers {
    margin-left: 10px;
    padding: 6px 10px;
    height: 33px;
    border-radius: 0px;
    font-size: 14px;
    border: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.el-popover.layer-popup {
  min-width: 270px;
  padding: 0px !important;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0) !important;
  border: none !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}
</style>
