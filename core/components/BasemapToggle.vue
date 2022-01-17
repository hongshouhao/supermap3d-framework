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
// import { createImageryProvider } from '../utils/ImageryUtility'

export default {
  name: 'basemap-toogle',
  data () {
    return {
      basemapType: '',
    }
  },
  computed: {
    enableNone () {
      return window.s3d.config.baseMaps.none?.enable
    },
  },
  mounted () {
    let _this = this
    window.s3d.eventBus.addEventListener('baseMap-changed', (caller, args) => {
      _this.basemapType = args.type
    })

    window.s3d.basemapUtility.createBasemaps()
  },
  methods: {
    toggleBasemap (type) {
      window.s3d.basemapUtility.toggleMap(type)
    }
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
