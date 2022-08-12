<template>
  <WidgetInfoPanel :title="title" :visible.sync="visible">
    <template>
      <SketchToolPanel
        :buttons="sketchButtons"
        :multiable="true"
        :expectedSrid="4528"
        @finish-drawing="finishDrawing"
      ></SketchToolPanel>
    </template>
  </WidgetInfoPanel>
</template>
<script>
import WidgetInfoPanel from '../core/components/common/WidgetInfoPanel';
import SketchToolPanel from '../core/components/sketch/ToolPanel';
export default {
  components: {
    WidgetInfoPanel,
    SketchToolPanel,
  },
  data() {
    return {
      // sketchButtons: ['polyline', 'polygon', 'freeline', 'rectangle', 'circle'],
      sketchButtons: [],
      visible: true,
      title: '测试',
    };
  },
  mounted() {},
  methods: {
    finishDrawing(geoms) {
      console.log(geoms);
    },
  },
};
</script>
