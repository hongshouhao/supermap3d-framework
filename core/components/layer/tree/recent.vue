<!--
 * @Author: zhangbo
 * @Date: 2022-04-07 08:51:33
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 13:59:07
 * @FilePath: \supermap3d-framework\core\components\layer\tree\recent.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <el-scrollbar style="height: 100%" class="tree-wrapper recent">
    <el-tree
      show-checkbox
      node-key="id"
      ref="tree"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :render-after-expand="false"
      :data="recentLayerData"
      :render-content="renderExtButton"
      @check-change="onCheckLayer"
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
    layerData: {
      type: Array,
    },
  },
  data() {
    return {
      recentLayerData: [],
    };
  },
  mixins: [LayerMixin],
  created() {},
  methods: {
    onCheckLayer(data, checked) {
      if (this.$parent && this.$parent.$refs && this.$parent.$refs.tree) {
        this.$parent.$refs.tree.setChecked(data.id, checked);
      }
    },
    updateLayer() {
      this.recentLayerData.splice(0, this.recentLayerData.length);

      const findNode = function (arr, id) {
        let node;
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element.name == id) {
            return element;
          } else if (element.children) {
            let find = findNode(element.children, id);
            if (find) {
              return find;
            }
          }
        }
        return node;
      };

      return this.recentLayerStore.get().then((ids) => {
        ids.forEach((id) => {
          let find = findNode(this.layerData, id);
          if (find) {
            this.recentLayerData.push(find);
          }
        });
      });
    },
  },
  mounted() {
    const that = this;
    this.updateLayer().then(() => {
      that.$nextTick(function () {
        let ids = that.$parent.$refs.tree.getCheckedKeys();
        that.$refs.tree.setCheckedKeys(ids);
      });
    });
  },
};
</script>