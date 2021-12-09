<template>
  <div class="property-grid">
    <el-table
      :data="propArray"
      stripe
      border
      style="width: 100%"
      row-class-name="property-row"
      cell-class-name="property-cell"
      :show-header="false"
    >
      <el-table-column prop="key" label="属性名"> </el-table-column>
      <el-table-column prop="value" label="属性值" width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      table: [],
    }
  },
  props: ['propArray'],
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.property-grid {
  .el-table__body-wrapper {
    overflow: hidden;
  }
}
.property-cell {
  padding: 0 !important;
}
.property-row {
  background-color: rgba(76, 76, 76, 0.1) !important;
  height: 24px;
}
</style>
