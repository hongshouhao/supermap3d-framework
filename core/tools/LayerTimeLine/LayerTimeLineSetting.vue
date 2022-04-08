<template>
  <div class="layer-timeline-setting">
    <el-slider v-model="timelines"
               :show-tooltip='false'
               :min="min"
               :max="max"
               :step="1"
               :marks="marks"
               @input="setCurrentLayer">
    </el-slider>
  </div>
</template>
<script>
import { isPromise } from '../../utils/IfUtility';
import LayerTimeLineTool from './LayerTimeLineTool';
export default {
  data () {
    return {
      timelines: [],
      min: 0,
      max: 1,
      marks: {},
      opacityLevels: 100,
      minOpacity: 0.4,
      layersLoaded: false
    };
  },
  props: ['layers'],
  mounted () {
    if (!this.layers) {
      this.layers = [];
    }

    this.tool = new LayerTimeLineTool(this.$viewer);
    this.tool.setLayers(this.layers);
    this.max = (this.layers.length - 1) * this.opacityLevels;

    let newMark = {};
    for (let i = 0; i < this.max + 1; i++) {
      let idx = parseInt(i / this.opacityLevels);
      let remainder = i % this.opacityLevels;
      if (remainder == 0) {
        newMark[i] = this.layers[idx].name;
      }
      this.timelines.push(i);
    }
    this.marks = newMark;
  },
  methods: {
    init () {
      let result = this.tool.loadLayers();

      if (isPromise(result)) {
        result.then(() => {
          this.layersLoaded = true;
          this.setCurrentLayer(0);
        });
      }
      else {
        this.layersLoaded = true;
        this.setCurrentLayer(0);
      }
    },
    setCurrentLayer (val) {
      let opacPer = (1 - this.minOpacity) / this.opacityLevels;
      if (this.layersLoaded && val >= this.min && val <= this.max) {
        let idx = parseInt(val / this.opacityLevels);
        let remainder = val % this.opacityLevels;
        this.tool.setCurrentLayer(this.layers[idx].name, 1 - remainder * opacPer);
      }
    },
    reset () {
      this.tool.clear();
    }
  }
};
</script>
 <style lang="scss">
.layer-timeline-setting {
  width: 450px;
  padding: 10px 20px;
}
</style>