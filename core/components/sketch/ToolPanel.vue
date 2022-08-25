<template>
  <div class="sketck-tool-panel">
    <div @click="drawPolyline"
         class="esri-widget--button esri-widget none-top-border"
         v-if="buttonVisible('polyline')">
      <i class="esri-icon-polyline"></i>
    </div>
    <div @click="drawPolygon"
         class="esri-widget--button esri-widget none-top-border"
         v-if="buttonVisible('polygon')">
      <i class="esri-icon-polygon"></i>
    </div>
    <div @click="drawFreeLine"
         class="esri-widget--button esri-widget none-top-border"
         v-if="buttonVisible('freeline')">
      <i class="esri-icon-cursor-marquee"></i>
    </div>
    <div @click="drawRectangle"
         class="esri-widget--button esri-widget none-top-border"
         v-if="buttonVisible('rectangle')">
      <i class="esri-icon-sketch-rectangle"></i>
    </div>
    <div @click="drawCircle"
         class="esri-widget--button esri-widget none-top-border"
         v-if="buttonVisible('circle')">
      <i class="esri-icon-radio-unchecked"></i>
    </div>
    <div @click="clear"
         class="esri-widget--button esri-widget none-top-border">
      <i class="esri-icon-trash"></i>
    </div>
  </div>
</template>

<script>
import SketchTool from '../../tools/Sketch/SketchTool';
export default {
  name: 'sketch-tool-panel',
  data () {
    return {};
  },
  props: {
    polylineVertextLimitCount: {
      type: Number,
    },
    polygonVertextLimitCount: {
      type: Number,
    },
    multiable: {
      type: Boolean,
      default: () => false,
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    expectedSrid: {
      type: Number,
      default: 4490,
    },
  },
  mounted () {
    this.sketchTool = new SketchTool(this.$viewer);
    this.sketchTool.setMultiable(this.multiable);
  },
  watch: {
    multiable (val) {
      this.sketchTool.setMultiable(val);
    },
  },
  methods: {
    buttonVisible (key) {
      if (this.buttons.length > 0) {
        return this.buttons.indexOf(key) > -1;
      } else {
        return true;
      }
    },
    drawPolyline () {
      this.sketchTool.setVertexLimitCount(this.polylineVertextLimitCount);
      this.sketchTool.setExpectedSrid(this.expectedSrid);
      this.finishDrawing(this.sketchTool.start('polyline'));
    },
    drawPolygon () {
      this.sketchTool.setVertexLimitCount(this.polygonVertextLimitCount);
      this.sketchTool.setExpectedSrid(this.expectedSrid);
      this.finishDrawing(this.sketchTool.start('polygon'));
    },
    drawFreeLine () {
      this.sketchTool.enableFreeLine();
      this.sketchTool.setExpectedSrid(this.expectedSrid);
      this.finishDrawing(this.sketchTool.start('polyline'));
    },
    drawCircle () {
      this.sketchTool.setExpectedSrid(this.expectedSrid);
      this.finishDrawing(this.sketchTool.start('circle'));
    },
    drawRectangle () {
      this.sketchTool.setExpectedSrid(this.expectedSrid);
      this.finishDrawing(this.sketchTool.start('rectangle'));
    },
    clear () {
      this.sketchTool.clear();
      this.$emit('sketch-tool-cleared');
    },
    finishDrawing (promise) {
      promise.then((geoms) => {
        this.$emit('finish-drawing', geoms);
      });
    },
  },
};
</script>

<style scoped>
.sketck-tool-panel {
  display: flex;
  /* padding: 10px; */
}
.none-top-border {
  border-top: 1px #e5e5e5;
}
</style>
