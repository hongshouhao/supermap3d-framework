<template>
  <smmap></smmap>
</template>
<script>
import { addMessageListener } from '../core/IframeMessage'

export default {
  data () {
    return {
    }
  },
  components: {
  },
  mounted () {
    addMessageListener()
    // window.s3d.enableBloom()
    window.s3d.topLeftBar.highLimitTool.setTargetLayers(['建筑'])
    window.s3d.topLeftBar.submergedTool.setTargetLayers(['建筑'])
    // .includingGlobe()
    // //园区
    // .setCoverageArea([
    //   120.6550, 31.3219, 3,
    //   120.6581, 31.3069, 3,
    //   120.6794, 31.3081, 3,
    //   120.6794, 31.3251, 3,
    //   120.6550, 31.3219, 3,
    // ])
    //东沙湖
    // .setCoverageArea([
    //   120.7658,
    //   31.3345,
    //   3,
    //   120.7644,
    //   31.3397,
    //   3,
    //   120.769,
    //   31.3403,
    //   3,
    //   120.7701,
    //   31.3352,
    //   3,
    //   120.7658,
    //   31.3345,
    //   3,
    // ])
  },
}
</script>
