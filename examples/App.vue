<template>
  <smmap></smmap>
</template>
<script>
import { addMessageListener } from '../core/IframeMessage'
export default {
  data () {
    return {}
  },
  mounted () {
    addMessageListener()
    window.s3d.enableBloom()
    window.s3d.topLeftBar.highLimitTool.setTargetLayers(['楼幢'])
    window.s3d.topLeftBar.submergedTool.setTargetLayer('大场景')
  },
}
</script>
