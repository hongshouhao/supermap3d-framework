<template>
  <div class="high-limit-setting">
    <el-slider v-model="height"
               height="250px"
               :step="10"
               vertical
               :min="min"
               :max="max"
               :marks="marks"
               @input="heightChanged">
    </el-slider>
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: 100,
      min: 30,
      max: 120,
      marks: {}
    }
  },
  beforeMount () {
    this.initMarkers()
  },
  methods: {
    heightChanged (v) {
      this.$emit("height-changed", v)
    },
    initMarkers () {
      for (let i = this.min; i <= this.max; i = i + 10) {
        let mrk = {
          style: {
            color: '#1989FA'
          },
          label: `${i}`
        }
        this.marks[i] = mrk
      }
    }
  }
}
</script>
<style lang='scss'>
.high-limit-setting {
  width: 70px;
  padding: 5px 0;
  .el-slider {
    .el-slider__runway {
      margin-left: 10px;
    }
  }
}
</style>