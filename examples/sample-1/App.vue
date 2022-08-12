<template>
  <smmap @viewer-created="onViewerCreated">
  </smmap>
</template>
<script>
import { addMessageListener } from '../../core/IframeMessage';
import SMAP from '@/index.js';
export default {
  data () {
    return {
      viewerCreated: false,
    };
  },
  components: {},
  mounted () {
    addMessageListener();
  },
  methods: {
    onViewerCreated () {
      this.viewerCreated = true;
    },
    onClear () {
      window.s3d.clearTempEntity();
    },
    onCirclePick () {
      this.circleTool = new SMAP.Tools.CircleDrawingTool(window.s3d.viewer);
      this.circleTool.start().then((geojson) => {
        console.log(geojson);
      });
    },
    onRectanglePick () {
      this.tool = new SMAP.Tools.RectangleDrawingTool(window.s3d.viewer);
      this.tool.start().then((geojson) => {
        console.log(geojson);
      });
    },
    onDrawPolygon () {
      this.polygonTool = new SMAP.Tools.PolygonDrawingTool(window.s3d.viewer, {
        lineColor: '#ff0000',
      });
      this.polygonTool.start();
      this.polygonTool.entityAdded = (geojson) => {
        console.log(geojson);
      };
    },
  },
};
</script>
