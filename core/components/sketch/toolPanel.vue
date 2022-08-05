<template>
  <div class="sketck-tool-panel">
    <div @click="drawPolyline" class="toolbox">
      <i class="esri-icon-polyline"></i>
    </div>
    <div @click="drawPolylinefree" class="toolbox">
      <i class="esri-icon-cursor-marquee"></i>
    </div>
    <div @click="drawPolygon" class="toolbox">
      <i class="esri-icon-polygon"></i>
    </div>
    <div @click="drawCircle" class="toolbox">
      <i class="esri-icon-radio-unchecked"></i>
    </div>
    <div @click="drawRectangle" class="toolbox">
      <i class="esri-icon-sketch-rectangle"></i>
    </div>
    <div @click="clear" class="toolbox">
      <i class="esri-icon-trash"></i>
    </div>
  </div>
</template>

<script>
import SketchTool from '../../tools/Sketch/SketchTool';
export default {
  name: 'sketch-tool-panel',
  data() {
    return {};
  },
  props: {
    toolPanelName: {
      type: String,
    },
    polylineVertextLimitCount: {
      type: Number,
    },
    polygonVertextLimitCount: {
      type: Number,
    },
  },
  mounted() {
    this.sketchTool = new SketchTool(this.$viewer);
    // if (this.vertextLimitCount && this.vertextLimitCount > 1) {
    //   this.sketchTool.setVertexLimitCount(this.vertextLimitCount);
    // }
  },
  methods: {
    drawPolyline() {
      // debugger;
      this.sketchTool.setVertexLimitCount(this.polylineVertextLimitCount);
      this.sketchTool.start('polyline');
    },
    drawPolygon() {
      this.sketchTool.setVertexLimitCount(this.polygonVertextLimitCount);
      this.sketchTool.start('polygon');
    },
    drawPolylinefree() {
      this.sketchTool.enableFreeLine();
      this.sketchTool.start('polyline');
    },
    drawCircle() {
      this.sketchTool.start('circle');
    },
    drawRectangle() {
      this.sketchTool.start('rectangle');
    },
    clear() {
      this.sketchTool.clear();
    },
  },
};
</script>

<style scoped>
.sketck-tool-panel {
  display: flex;
  /* padding: 10px; */
}
.toolbox {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  color: #333;
  width: 38px;
  height: 38px;
}
</style>
