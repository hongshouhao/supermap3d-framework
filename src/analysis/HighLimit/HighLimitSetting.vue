<template>
  <div>
    <el-slider v-model="height"
               height="200px"
               vertical
               :min="30"
               :max="150"
               @input="heightChanged">
    </el-slider>
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: 100
    }
  },
  methods: {
    heightChanged (v) {
      this.$emit("height-changed", v)
    }
  }
}
</script>
