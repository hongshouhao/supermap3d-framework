<template>
  <div class="view-shed-setting-style">
    <div>
      <label>方向(度)</label>
      <input type="range"
             min="0"
             max="360"
             step="1.0"
             title="方向"
             data-bind="value: direction, valueUpdate: 'input'">
      <input type="text"
             readonly
             size="5"
             data-bind="value: direction">
    </div>

    <div>
      <label>翻转(度)</label>
      <input type="range"
             min="-90"
             max="90"
             step="1.0"
             value="1"
             title="翻转"
             data-bind="value: pitch, valueUpdate: 'input'">
      <input type="text"
             readonly
             size="5"
             data-bind="value: pitch">
    </div>

    <div>
      <label>距离(米)</label>
      <input type="range"
             min="1"
             max="500"
             step="1.0"
             value="1"
             title="距离"
             data-bind="value: distance, valueUpdate: 'input'">
      <input type="text"
             readonly
             size="5"
             data-bind="value: distance">
    </div>

    <div>
      <label>水平视场角(度)</label>
      <input type="range"
             min="1"
             max="120"
             step="1"
             value="1"
             title="水平视场角"
             data-bind="value: horizontalFov, valueUpdate: 'input'">
      <input type="text"
             readonly
             size="5"
             data-bind="value: horizontalFov">
    </div>

    <div>
      <label>垂直视场角(度)</label>
      <input type="range"
             min="1"
             max="90"
             step="1.0"
             value="1"
             title="垂直视场角"
             data-bind="value: verticalFov, valueUpdate: 'input'">
      <input type="text"
             readonly
             size="5"
             data-bind="value: verticalFov">
    </div>
  </div>
</template>
<style scoped lang='scss'>
.view-shed-setting-style {
  > div {
    > label {
      width: 110px;
    }
    > input {
      margin: 0 5px;
    }
  }
}
</style>