<template>
  <div class="top-right-bar">
    <BasemapToggle />
    <el-popover placement="bottom"
                trigger="click"
                :width="200"
                popper-class="layer-popup">
      <Layers ref="layerTree" />

      <el-button slot="reference"
                 class="btn-layers"
                 style="margin-left:10px;">
        <span style="display:flex"><i class="my-icon-layers"
             style="margin-right:5px"></i><span>图层</span><i class="el-icon-arrow-down el-icon--right"></i></span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import Layers from "./Layers.vue";
import BasemapToggle from './BasemapToggle.vue'
export default {
  components: {
    Layers,
    BasemapToggle
  },
  data () {
    return {
    }
  },

  mounted () {
    this.$refs.layerTree.init()
  },
  methods: {

  },
}
</script>
<style lang="scss">
.top-right-bar {
  padding: 0;
  margin: 0;
  /* opacity: 0; */
  border: 0ch;
  overflow: hidden;
  display: flex;
  justify-content: center;
  .btn-layers {
    height: 35px;
    border-radius: 1px;
    font-size: 14px;
    border: 1px solid #ccc;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.layer-popup {
  padding: 0px !important;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0) !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
