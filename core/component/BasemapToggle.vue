<template>
  <ul class="change-basemap"
      :class="{
      'two-children': !enableNone,
      'three-children': enableNone,
    }">
    <li :class="{ active: basemapType === 'normal' }"
        @click="toggleBasemap('normal')">
      <i class="esri-icon-maps"></i>
      地图
    </li>
    <li :class="{ active: basemapType === 'earth' }"
        @click="toggleBasemap('earth')">
      <i class="esri-icon-globe"></i>
      影像
    </li>
    <li v-if="enableNone"
        :class="{ active: basemapType === 'none' }"
        @click="toggleBasemap('none')">
      <i class="esri-icon-default-action"></i>
      全黑
    </li>
  </ul>
</template>
<script>
import { createImageryProvider } from '../utils/ImageryUtility'

export default {
  name: 'basemap-toogle',
  data () {
    return {
      basemapType: '',
      layerNormal: null,
      layerSatellite: null,
      enableNoneBaseMapMode: false,
    }
  },
  computed: {
    baseMapsConfig () {
      return window.s3d.config.baseMaps
    },
    baseMaps () {
      if (!window.s3d.baseMaps) {
        window.s3d.baseMaps = {}
      }
      return window.s3d.baseMaps
    },
    enableNone () {
      return this.baseMapsConfig.none && this.baseMapsConfig.none.enable
    },
  },
  mounted () {
    this.createMaps()

    for (let mapKey in this.baseMapsConfig) {
      let map = this.baseMapsConfig[mapKey]
      if (map.default) {
        this.toggleBasemap(mapKey)
        break
      }
    }
  },
  methods: {
    createMaps () {
      for (let mapKey in this.baseMapsConfig) {
        if (mapKey === 'none') {
          continue
        }
        let mapConfig = this.baseMapsConfig[mapKey]
        let maps = []
        for (let mapOptions of mapConfig.maps) {
          let mapProvider = createImageryProvider(mapOptions)
          let map = this.$viewer.imageryLayers.addImageryProvider(mapProvider)
          if (!mapConfig.default) {
            map.alpha = 0
          }
          maps.push(map)
        }
        this.baseMaps[mapKey] = maps
      }
    },
    toggleBasemap (type) {
      this.basemapType = type
      if (this.basemapType === 'none') {
        this.$viewer.scene.globe.show = false
        this.$viewer.scene.skyBox.show = false
        this.$viewer.scene.skyAtmosphere.show = false
        this.baseMaps.current = null
        window.s3d.eventBus.dispatch('baseMap-changed')
      } else {
        this.$viewer.scene.globe.show = true
        this.$viewer.scene.skyBox.show = true
        this.$viewer.scene.skyAtmosphere.show = true

        let alpha = 1
        if (this.baseMaps.current) {
          alpha = this.baseMaps.current[0].alpha
        }

        for (let mapKey in this.baseMapsConfig) {
          if (mapKey === 'none') {
            continue
          }
          let maps = this.baseMaps[mapKey]
          for (let map of maps) {
            if (mapKey === type) {
              map.alpha = alpha
            } else {
              map.alpha = 0
            }
          }
        }

        this.baseMaps.current = this.baseMaps[type]
        window.s3d.eventBus.dispatch('baseMap-changed')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.change-basemap {
  margin: 0 10px 0 0;
  padding: 0 !important;
  cursor: pointer;
  display: inline-block;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  li {
    i {
      position: relative;
      top: 2px;
    }
    img {
      width: 16px;
      height: 16px;
      position: relative;
      top: 3px;
    }

    float: left;
    background: #fff;
    list-style: none;
    font-size: 14px;
    color: #495060;
    &.active {
      color: #4279e4;
    }
  }
}

$padding: 6px;
.two-children {
  li {
    &:first-child {
      border-right: none;
      padding: $padding $padding $padding $padding * 2;
      &::after {
        width: 1px;
        height: 16px;
        background: #dbdee2;
        content: "";
        position: absolute;
        left: 66px;
        top: 8px;
      }
    }
    &:last-child {
      border-left: none;
      padding: $padding $padding * 2 $padding $padding;
    }
  }
}
.three-children {
  li {
    &:first-child {
      border-right: none;
      padding: $padding $padding $padding $padding * 2;

      &::after {
        width: 1px;
        height: 16px;
        background: #dbdee2;
        content: "";
        position: absolute;
        left: 66px;
        top: 8px;
      }
    }
    &:nth-child(2) {
      border-left: none;
      padding: $padding $padding $padding $padding;

      &::after {
        width: 1px;
        height: 16px;
        background: #dbdee2;
        content: "";
        position: absolute;
        left: 126px;
        top: 8px;
      }
    }

    &:last-child {
      border-left: none;
      padding: $padding $padding * 2 $padding $padding;
    }
  }
}
</style>
