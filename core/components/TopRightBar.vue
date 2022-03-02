<template>
  <div class="top-right-bar">
    <BasemapToggle />
    <el-popover placement="bottom"
                trigger="click"
                popper-class="layer-popup">
      <Layers ref="layersTree" />

      <el-button slot="reference"
                 class="btn-layers">
        <span style="display:flex"><i class="esri-icon-layers"
             style="margin-right:5px"></i><span>图层</span><i class="el-icon-arrow-down el-icon--right"></i></span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import Layers from './Layers.vue'
import BasemapToggle from './BasemapToggle.vue'
export default {
  name: 'top-right-bar',
  components: {
    Layers,
    BasemapToggle,
  },
  data () {
    return {}
  },
  mounted () {
    window.s3d.layersTree = this.$refs.layersTree
  },
  methods: {},
}
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

.layer-popup {
  padding: 0px !important;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0) !important;
  border: none !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}
</style>
