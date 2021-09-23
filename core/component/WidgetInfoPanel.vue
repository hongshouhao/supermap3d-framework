<template>
  <div ref="panel"
       v-show="visible"
       class="widget-info-panel">
    <div class="widget-info-title">{{ title }}
      <i class="esri-icon-close widget-info-panel-close"
         @click="closeInfoPanel"></i>
    </div>
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
    return {
      visible: false
    }
  },
  mounted () { },
  methods: {
    drag (el) {
      el.onmousedown = function (e) {
        var divx =
          e.clientX - this.refs.panel.offsetLeft
        var divy =
          e.clientY - this.refs.panel.offsetTop
        document.onmousemove = function (e) {
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

    closeInfoPanel () {
      this.$emit("closed")
    }
  },
}
</script>
<style lang="scss" scoped>
.widget-info-title {
  background-color: #4279e4;
  color: #fff;
  line-height: 33px;
  text-indent: 15px;

  .widget-info-panel-close {
    position: absolute;
    right: 8px;
    top: 8px;

    &:hover {
      transform: scale(1.1);
    }
  }
}
.widget-info-panel {
  // width: 600px;
  // height: 600px;
  position: absolute;
  bottom: 15px;
  right: 12px;
  // border: 1px solid #ccc;
  border-radius: 1px;
  background: #f3f3f3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.widget-content {
  color: black;
  padding: 10px;
}
</style>
