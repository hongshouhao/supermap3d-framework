<template>
  <div ref="panel"
       class="widget-info-panel">
    <div class="widget-info-title">{{ title }}</div>
    <div class="widget-content">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['title'],
  data () {
    return {}
  },
  mounted () { },
  directives: {
    drag (el) {
      el.onmousedown = function (e) {
        //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
        var divx =
          e.clientX - this.refs.panel.offsetLeft
        var divy =
          e.clientY - this.refs.panel.offsetTop
        //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
        document.onmousemove = function (e) {
          //获取移动后div的位置：鼠标位置-divx/divy
          var l = e.clientX - divx
          var t = e.clientY - divy
          this.refs.panel.style.left = l + 'px'
          this.refs.panel.style.top = t + 'px'
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.widget-info-title {
  background-color: #4279e4;
  color: #fff;
  line-height: 35px;
  text-indent: 15px;
}
.widget-info-panel {
  // width: 600px;
  // height: 600px;
  position: absolute;
  bottom: 15px;
  right: 12px;
  border: 1px solid #ccc;
  border-radius: 1px;
  background: #f3f3f3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.widget-content {
  color: black;
}
</style>
