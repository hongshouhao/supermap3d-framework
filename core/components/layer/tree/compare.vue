<!--
 * @Author: zhangbo
 * @Date: 2022-04-07 08:51:33
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 14:14:38
 * @FilePath: \supermap3d-framework\core\components\layer\tree\compare.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <el-scrollbar style="height: 100%" class="tree-wrapper">
    <el-tree
      show-checkbox
      node-key="id"
      ref="tree"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :render-after-expand="false"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :data="layerData"
      :render-content="renderExtButton"
      @check-change="
        (data, checked) => {
          setLayerVisible(data, checked, 1);
        }
      "
    >
    </el-tree>
  </el-scrollbar>
</template>

<script>
import LayerMixin from './mixins/layer-tree';

export default {
  props: {
    filterText: {
      type: String,
    },
  },
  data() {
    return {
      multiViewport: true,
    };
  },
  mixins: [LayerMixin],
  methods: {},
  computed: {
    layerData() {
      return window.s3d.config.layers;
    },
  },
  mounted() {
    let ids = that.$parent.$refs.tree.getCheckedKeys();
    this.$refs.tree.setCheckedKeys(ids);
  },
};
</script>