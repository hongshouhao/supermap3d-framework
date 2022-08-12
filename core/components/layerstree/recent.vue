<template>
  <el-scrollbar style="height: 100%"
                class="tree-wrapper recent">
    <el-tree show-checkbox
             node-key="id"
             ref="tree"
             :expand-on-click-node="false"
             :filter-node-method="filterNode"
             :render-after-expand="false"
             :data="recentLayerData"
             :render-content="renderExtButton"
             @check-change="onCheckLayer">
    </el-tree>
  </el-scrollbar>
</template>

<script>
import LayerMixin from './layerstree';

export default {
  props: {
    filterText: {
      type: String,
    },
    layerData: {
      type: Array,
    },
  },
  data () {
    return {
      recentLayerData: [],
    };
  },
  mixins: [LayerMixin],
  created () { },
  methods: {
    onCheckLayer (data, checked) {
      if (this.$parent && this.$parent.$refs && this.$parent.$refs.tree) {
        this.$parent.$refs.tree.setChecked(data.id, checked);
      }
    },
    getRecentLayers () {
      this.recentLayerData.splice(0, this.recentLayerData.length);
      let _this = this;
      return this.recentLayerStore.get().then((ids) => {
        ids.forEach((id) => {
          let targ = window.s3d.layerManager._getLayerNode(x => x.id === id);
          if (targ) {
            _this.recentLayerData.push(targ);
          }
        });
      });
    },
  },
  mounted () {
    const that = this;
    this.getRecentLayers().then(() => {
      that.$nextTick(function () {
        let ids = that.$parent.$refs.tree.getCheckedKeys();
        that.$refs.tree.setCheckedKeys(ids);
      });
    });
  },
};
</script>