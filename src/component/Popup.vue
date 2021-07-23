<template>
  <div ref="popup"
       class="my-popup esri-component esri-popup esri-popup--aligned-top-center esri-popup--shadow">
    <div class="esri-popup__main-container esri-widget esri-popup--is-collapsible">
      <header class="esri-popup__header">
        <h2 class="esri-widget__heading esri-popup__header-title">{{title}}</h2>
        <div class="esri-popup__header-buttons">
          <!-- <div title="停靠"
               class="esri-popup__button esri-popup__button--dock"
               @click="dock">
            <span class="esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"></span>
          </div> -->
          <div title="关闭"
               class="esri-popup__button"
               @click="close">

            <span class="esri-popup__icon esri-icon-close"></span>
          </div>
        </div>
      </header>
      <article class="esri-popup__content">
        <PropertyGrid v-show="showPropGrid"
                      :propArray="propArray" />
        <div v-show="!showPropGrid"
             ref="content"></div>
      </article>
    </div>
    <div class="esri-popup__pointer">
      <div class="esri-popup__pointer-direction esri-popup--shadow"></div>
    </div>
  </div>
</template>

<script>
import Popup from './Popup.js'
import PropertyGrid from './PropertyGrid.vue'
export default {
  data () {
    return {
      propArray: [],
      title: "",
      dockered: false,
      popupTool: null,
      showPropGrid: true
    }
  },
  components: {
    PropertyGrid
  },
  props: [],
  mounted () {
    this.popupTool = new Popup(window.viewer)
  },
  methods: {
    setHeader (title) {
      this.title = title
    },
    setContent (object) {
      if (object instanceof HTMLElement) {
        this.showPropGrid = false
        this.$refs.content.innerHTML = "";
        this.$refs.content.appendChild(object)
      }
      else if (object instanceof Array) {
        this.showPropGrid = true
        this.propArray = object
      }
    },
    dock () {
      if (this.dockered) {
        this.popupTool.addStickRender()
        this.dockered = false
      }
      else {
        this.popupTool.removeStickRender()
        this.$refs.popup.style.top = '60px'
        this.$refs.popup.style.right = '15px'
        this.$refs.popup.style.left = 'unset'
        this.dockered = true
      }
    },
    close () {
      this.$refs.popup.style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
.my-popup {
  position: absolute;
  max-width: 500px;

  .esri-popup__main-container {
    max-width: 500px !important;
    max-height: 800px !important;
    width: unset;
  }

  // .esri-popup__content {
  //   margin: 0 0;
  // }

  .esri-popup__pointer {
    top: unset !important;
  }

  .esri-popup__header {
    border-bottom: solid 1px rgba(110, 110, 110, 0.3);
  }
}
</style>