<!--
 * @Author: zhangbo
 * @Date: 2022-04-06 09:40:52
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-11 11:01:02
 * @FilePath: \supermap3d-framework\core\components\toolbar\tool-item.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
-->

<template>
  <el-popover
    width="200"
    trigger="click"
    :placement="popPlacement"
    class="tool"
    popper-class="tool-item-sub-container"
    v-if="hasChildren"
  >
    <slot></slot>
    <div :class="toolCss" @click="onToolClick" slot="reference">
      <i :class="icon"></i>
    </div>
  </el-popover>

  <div class="tool" :class="toolCss" @click="onToolClick" v-else>
    <i :class="icon"></i>

    <widget-panel
      ref="tool-extra-component"
      :title="extraComponentLabel"
      class="widget-extra-component"
      v-model="showExtraSetting"
      :autoClose="true"
    >
      <component :is="extraComponent"></component>
    </widget-panel>
  </div>
</template>

<script>
export default {
  name: "n-tool-item",
  props: {
    code: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default() {
        return "icon-hammer";
      },
    },
  },
  provide() {
    return {
      toolitem: this,
    };
  },
  mounted() {
    if (this.$refs["tool-extra-component"]) {
      this.$viewer.cesiumWidget.container.appendChild(
        this.$refs["tool-extra-component"].$el
      );
    }
  },
  inject: {
    toolbar: {
      from: "toolbar",
      default() {
        return null;
      },
    },
    toolitem: {
      from: "toolitem",
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      hasSubItem: false,
      showPopover: false,
      enable: false,
      showExtraSetting: false,
      toolDescriptor: null,
      extraComponentLabel: "",
      extraComponent: "",
    };
  },
  created() {
    if (this.toolitem) {
      this.toolitem.hasSubItem = true;
    }

    this.toolManager = this.toolbar.toolManager;
  },
  methods: {
    onToolClick() {
      if (!this.$slots.default) {
        this.toolDescriptor = this.toolManager.execute(this.code, this);

        if (this.toolDescriptor && this.toolDescriptor.extraComponent) {
          this.extraComponent = this.toolDescriptor.extraComponent;
          this.extraComponentLabel = this.toolDescriptor.extraComponentLabel;
          this.showExtraSetting = true;
        } else {
          this.showExtraSetting = false;
          this.extraComponent = "";
          this.extraComponentLabel = "";
        }
      }
    },
  },
  computed: {
    toolCss() {
      if (this.instance) {
        return { active: !!this.toolDescriptor };
      }
      return {};
    },
    hasChildren() {
      if (this.$slots.default) {
        return this.$slots.default.length > 0;
      }
      return false;
    },
    popPlacement() {
      return this.toolbar.horizonal ? "bottom" : "right";
    },
  },
};
</script>
