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
      @check-change="onCheckLayer"
    >
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
    let ids = this.$parent.$refs.tree.getCheckedKeys();
    this.$refs.tree.setCheckedKeys(ids);

    this.$nextTick(() => {
      let hideDoms = document.querySelectorAll('.hide-tree-node');
      hideDoms.forEach((item) => {
        item.parentNode.parentNode.style.display = 'none';
      });

      let virtualDoms = document.querySelectorAll('.virtual-dir-node');
      virtualDoms.forEach((item) => {
        let vDom = item.parentNode.querySelector('.el-tree-node__expand-icon');
        // vDom.classList.add('is-leaf');
        vDom.style.visibility = 'hidden';
      });
    });
  },
  methods: {
    onCheckLayer(data, checked) {
      this.setLayerVisible(data, checked, 1);
    },
  },
};
</script>
