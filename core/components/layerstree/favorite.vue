<template>
  <el-scrollbar style="height: 100%"
                class="tree-wrapper favorite">
    <el-tree show-checkbox
             node-key="id"
             ref="tree"
             :expand-on-click-node="false"
             :filter-node-method="filterNode"
             :render-after-expand="false"
             :data="favoriteLayerData"
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
      favoriteLayerData: [],
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
    getFavoriteLayers () {
      if (!this.layerData) {
        return [];
      }
      this.favoriteLayerData.splice(0, this.favoriteLayerData.length);
      return this.favourLayerStore.get().then((ids) => {
        ids.forEach((id) => {
          let targ = window.s3d.layerManager._getLayerNode(x => x.id === id && x.isFavorite);
          if (targ) {
            this.favoriteLayerData.push(targ);
          }
        });
      });
    },
  },
  mounted () {
    const that = this;
    this.getFavoriteLayers().then(() => {
      that.$nextTick(function () {
        let ids = that.$parent.$refs.tree.getCheckedKeys();
        that.$refs.tree.setCheckedKeys(ids);
      });
    });

    window.s3d.eventBus.addEventListener('layer-favorite-changed', () => {
      that.getFavoriteLayers();
    });
  },
};
</script>