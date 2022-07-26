<template>
  <div class="sketck-tool-panel">
    <div @click="drawPolyline">
      <i class="esri-icon-polyline"></i>
    </div>
    <div @click="drawPolygon">
      <i class="esri-icon-polygon"></i>
    </div>
    <div @click="drawPolyline">
      <i class="esri-icon-cursor-marquee"></i>
    </div>
    <div @click="drawRectangle">
      <i class="esri-icon-sketch-rectangle"></i>
    </div>
    <div @click="drawRectangle">
      <i class="esri-icon-trash"></i>
    </div>
  </div>
</template>

<script>
import SketchTool from '../../tools/Sketch/SketchTool';
export default {
  name: 'sketch-tool-panel',
  data () {

  },
  props: {
    polylineVertextLimitCount: {
      type: Number
    },
    polygonVertextLimitCount: {
      type: Number
    }
  },
  mounted () {
    this.sketchTool = new SketchTool(this.$viewer);
    if (this.vertextLimitCount && this.vertextLimitCount > 1) {
      this.sketchTool.setVertexLimitCount(this.vertextLimitCount);
    }
  },
  methods: {
    drawPolyline () {
      this.sketchTool.clear();
      this.sketchTool.setVertexLimitCount(polylineVertextLimitCount);
      this.sketchTool.start('polyline');
    },
    drawPolygon () {
      this.sketchTool.clear();
      this.sketchTool.setVertexLimitCount(polygonVertextLimitCount);
      this.sketchTool.start('polygon');
    },
    drawRectangle () {
    },
    clear () {
      this.sketchTool.clear();
    }
  }
};
</script>