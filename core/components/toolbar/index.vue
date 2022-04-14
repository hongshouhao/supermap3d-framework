<!--
 * @Author: zhangbo
 * @Date: 2022-04-06 09:40:44
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-09 12:54:58
 * @FilePath: \supermap3d-framework\core\components\toolbar\index.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->
<template>
  <div class="n-widget-bar-wrapper">
    <div class="n-widget-bar" :class="computedClass" :style="computedCss">
      <div class="tool-group">
        <slot>
          <tool-item
            v-for="(item, index) in tools"
            :key="index"
            :code="item.code"
            :icon="item.icon"
          >
          </tool-item>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import ToolItem from './tool-item.vue';
import ToolManager from './manager/index';

export default {
  name:"n-tool-bar",
  props: {
    tools: {
      type: Array,
      default() {
        return [
          {
            code: 'measure-angle',
            icon: 'icon-mea-angle',
          },
          {
            code: 'split-screen',
            icon: 'icon-split-screen',
          },
          {
            code: 'iquery',
            icon: 'esri-icon-description',
          },
          {
            code: 'setting',
            icon: 'esri-icon-settings',
          },
          {
            code: 'clear',
            icon: 'esri-icon-trash',
          },
        ];
      },
    },
    static: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String | Array,
      default() {
        return 'top-left';
      },
    },
    positionType: {
      type: Array,
      default() {
        return ['top', 'left'];
      },
    },
    horizonal: {
      type: Boolean,
    },
    light: {
      type: Boolean,
      default: false,
    },
    map: {
      type: Object,
    },
  },
  inject: {
    viewer: {
      from: 'viewer',
      default() {
        return null;
      },
    },
  },
  provide() {
    return {
      toolbar: this,
    };
  },
  components: { ToolItem },
  data() {
    return {};
  },
  created() {
    this.toolManager = new ToolManager(this.$viewer || window.s3d.viewer, {
      invoker: this,
    });
  },
  computed: {
    computedClass() {
      let css = {
        horizonal: this.horizonal,
        static: this.static,
        light: this.light,
      };
      if (typeof this.position == 'string' && !this.static) {
        css[this.position] = true;
      }
      return css;
    },
    computedCss() {
      const containPx = (value) => {
        if (typeof this.position == 'string') {
          return value.indexOf('px') > -1;
        }
        return false;
      };

      let posObj = {};

      if (Array.isArray(this.position) && this.position.length > 1) {
        posObj[this.positionType[1]] =
          this.position[1] + (containPx(this.position[1]) ? '' : 'px');
        posObj[this.positionType[0]] =
          this.position[0] + (containPx(this.position[0]) ? '' : 'px');
      }
      return posObj;
    },
  },
};
</script>
