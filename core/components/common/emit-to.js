/*
 * @Author: zhangbo
 * @Date: 2022-04-06 15:30:20
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-06 15:31:27
 * @FilePath: \supermap3d-framework\core\components\js\deep-emitter.js
 * @Description: 抛出事件到指定父元素
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
export default {
  methods: {
    $emitTo(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
  },
};
