<template>
  <div class="layer-tree">
    <div class="layer-tabs"
         v-show="!multiViewport">
      <div class="tab-item"
           :class="{ active: curTab == 'layer' }"
           @click="curTab = 'layer'">
        图层
      </div>
      <div class="tab-item"
           :class="{ active: curTab == 'recent' }"
           @click="curTab = 'recent'">
        最近
      </div>
      <div class="tab-item"
           :class="{ active: curTab == 'favour' }"
           @click="curTab = 'favour'">
        收藏
      </div>
    </div>

    <div class="layer-filter">
      <el-input class="layer-filter"
                size="mini"
                clearable
                placeholder="输入图层名"
                v-model="filterText">
      </el-input>
    </div>
    <div class="layer-tree-container">
      <el-scrollbar style="height: 100%"
                    class="tree-wrapper main"
                    v-show="curTab == 'layer'">
        <el-tree show-checkbox
                 node-key="id"
                 ref="tree"
                 :expand-on-click-node="false"
                 :filter-node-method="filterNode"
                 :render-after-expand="false"
                 :data="layersData"
                 :props="{ disabled: disableNode }"
                 :default-expanded-keys="defaultExpandedKeys"
                 :default-checked-keys="defaultCheckedKeys"
                 :render-content="renderExtButton"
                 @check-change="onCheckLayer">
        </el-tree>
      </el-scrollbar>
      <compare-tree ref="compareTree"
                    v-if="multiViewport"
                    :filter-text="filterText"></compare-tree>
      <fav-tree v-if="curTab == 'favour'"
                :layerData="layersData"
                :filter-text="filterText"
                ref="favourite"></fav-tree>
      <recent-tree ref="recent"
                   :layerData="layersData"
                   :filter-text="filterText"
                   v-if="curTab == 'recent'"></recent-tree>
    </div>
  </div>
</template>

<script>
import RecentTree from './recent.vue';
import FavTree from './favourite.vue';
import CompareTree from './compare.vue';
import LayerMixin from './mixins/layer-tree';

export default {
  name: 'layers-tree',
  components: {
    RecentTree,
    FavTree,
    CompareTree,
  },
  mixins: [LayerMixin],
  data () {
    return {
      layersData: [],
      multiViewport: false,
      filterText: '',
      curTab: 'layer',
    };
  },
  created () { },
  props: [],
  mounted () {
    window.s3d.layerTree = this;

    let _this = this;

    window.s3d.eventBus.addEventListener('framework-initialized', () => {
      _this._checkLayersConfig();

      _this.favourLayerStore.get().then((ids) => {
        _this.favourLayerIds = ids;
        _this.init();
      });
    });

    window.s3d.eventBus.addEventListener(
      'layer-visible-changed',
      (caller, visible) => {
        _this.setLayerNodeChecked(caller.target, visible);
      }
    );
  },
  methods: {
    toggleViewportMode () {
      if (this.multiViewport) {
        this.$viewer.scene.multiViewportMode = Cesium.MultiViewportMode.NONE;
        this.multiViewport = false;
        this.updatePopper();
        this.resetLayerVisible(this.layersData);
        this.resetLayerData();
        window.s3d.eventBus.dispatch('tool-stopped', 'split-screen');
      } else {
        this.$viewer.scene.multiViewportMode = Cesium.MultiViewportMode.HORIZONTAL;
        this.multiViewport = true;
        this.updatePopper();
        window.s3d.eventBus.dispatch('tool-started', 'split-screen');
      }
    },
    init () {
      if (this.$viewer) {
        this.addLayers(window.s3d.config.layers);
        this.layersData = window.s3d.config.layers;

        this.$nextTick(() => {
          let hideDoms = document.querySelectorAll('.hide-tree-node');
          hideDoms.forEach((item) => {
            item.parentNode.parentNode.style.display = 'none';
          });

          let virtualDoms = document.querySelectorAll('.virtual-dir-node');
          virtualDoms.forEach((item) => {
            let vDom = item.parentNode.querySelector(
              '.el-tree-node__expand-icon'
            );
            // vDom.classList.add('is-leaf');
            vDom.style.visibility = 'hidden';
          });
        });

        // this.$viewer._element.appendChild(this.$refs.viewportSpliter);
      }
    },

    addLayers (layersData) {
      let _this = this;
      for (let lyElModel of layersData) {
        let lyOptions = lyElModel.layer;
        if (lyOptions) {
          if (!lyOptions.opacity) {
            lyOptions.opacity = 1;
          }

          this.$set(
            lyElModel,
            'isFavourite',
            this.favourLayerIds.indexOf(lyElModel.id) > -1
          );

          // this.$set(lyElModel, 'cesiumLayerLoaded', false);

          lyElModel.cesiumLayerLoaded = false;

          if (lyOptions.visible) {
            _this.defaultCheckedKeys.push(lyElModel.id);
            _this._createLayer(lyElModel);
          }
        } else if (lyElModel.children) {
          if (lyElModel.virtual) {
            lyElModel.children.forEach((item) => (item.display = false));
          }

          if (lyElModel.expand) {
            _this.defaultExpandedKeys.push(lyElModel.id);
          }
          this.addLayers(lyElModel.children);
        }
      }
    },

    onCheckLayer (data, checked) {
      // if (this.$refs.recent) {
      //   this.$refs.recent.$refs.tree.setChecked(data.id, checked);
      // }

      // if (this.$refs.favourite) {
      //   this.$refs.favourite.$refs.tree.setChecked(data.id, checked);
      // }

      this.setLayerVisible(data, checked);
    },
    updatePopper () {
      window.s3d.layersTreePopover.destroyPopper();
      window.s3d.layersTreePopover.createPopper();
    },
    resetLayerVisible (layersData) {
      for (let lyElModel of layersData) {
        if (lyElModel.children) {
          this.resetLayerVisible(lyElModel.children);
        } else {
          if (lyElModel.cesiumLayerLoaded) {
            this.setVisibleInViewport(lyElModel.cesiumLayer, 0, true);
            this.setVisibleInViewport(lyElModel.cesiumLayer, 1, true);
          }
        }
      }
    },
    resetLayerData () {
      let ids = this.$refs.tree.getCheckedKeys();
      let cids = this.$refs.compareTree.$refs.tree.getCheckedKeys();
      this.$refs.tree.setCheckedKeys([])

      let layers = window.s3d.layerManager.getAllLayers(f=>true);
      layers.forEach(f=>{
        f.setVisibleInViewport(0,false);
        f.setVisibleInViewport(1,false);
      })

      // for (let ly of cids) {
      //   if (ids.indexOf(ly) < 0) {
      //     ids.push(ly);
      //   }
      // }
      setTimeout(() => {
             this.$refs.tree.setCheckedKeys(ids);
      }, 100);
    },
  },
};
</script>

<style lang="scss">
.layer-tree {
  padding: 10px 0px 10px 5px;
  background: white;
  .layer-filter {
    input {
      border-radius: 0px;
    }
    padding-right: 5px;
    margin-bottom: 5px;
  }
  .layer-tree-container {
    display: flex;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: calc(100vh - 200px);
      margin: 0 !important;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }

    .el-scrollbar__view {
      .el-tree {
        margin-right: 5px;
        width: 100%;
      }
    }
    .el-tree-node__content {
      .el-checkbox {
        margin-bottom: 0px;
      }
    }

    .divider {
      position: relative;
      width: 10px;
      // margin-left: 2px;
      .el-divider {
        height: 100%;
      }
    }

    .custom-tree-node {
      display: flex;
      align-items: center;
      margin-bottom: 0px;
      width: 100%;
      position: relative;
      // justify-content: space-between;
      &.dir-node {
        justify-content: flex-start;
      }

      .layer-node-content {
        height: 19px;
      }

      .layer-tool {
        display: flex;
        position: absolute;
        right: 10px;
        .layer-tool-item {
          display: inline-block;
          flex: 1;
          cursor: pointer;
        }
      }

      .over-ellipsis {
        display: inline-block;
        width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-line-clamp: 1;
        user-select: none;
      }

      .layer-node-icon {
        margin-right: 4px;
        margin-top: 1px;
        color: #409eff;
      }

      .layer-settings {
        width: 13px;
        display: block;
        margin-right: 5px;
      }
    }
  }
}

.layer-setting-popup {
  border-radius: 1px !important;
  border: 1px solid #dbdbdb !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  padding-top: 8px !important;
  padding-bottom: 4px !important;

  .popper__arrow {
    // border-left-color: #dbdbdb !important;
    border-bottom-color: #dbdbdb !important;
  }

  .el-popover__title {
    font-size: 5px;
    margin-bottom: 0px;
  }
}

.layer-tabs {
  width: 34px;
  position: absolute;
  top: 0px;
  background: white;
  z-index: 1;
  left: -35px;
  text-align: center;
  .tab-item {
    padding: 6px 4px;
    cursor: pointer;
    position: relative;
  }
  .tab-item.active {
    background-color: #00a0e9;
    color: white;
  }
  .tab-item:hover {
    background-color: #00a0e9;
    color: white;
  }
  .tab-item + .tab-item::before {
    height: 1px;
    width: 26px;
    background: #dbdee2;
    content: '';
    position: absolute;
    left: 4px;
    top: 0px;
  }
}
.tree-wrapper {
  width: 100%;
}
.tree-wrapper:visible + .tree-wrapper:visible {
  border-left: 1px solid #f0f0f0;
}
</style>
