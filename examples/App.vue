<template>
  <smmap></smmap>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
    window.s3d.topLeftBar.highLimitTool.setTargetLayers(['楼幢'])
  }
}
</script>