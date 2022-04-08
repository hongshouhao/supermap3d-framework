/*
 * @Author: zhangbo
 * @Date: 2022-04-07 09:57:31
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-07 09:58:57
 * @FilePath: \supermap3d-framework\core\mixins\layer.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */

export default {
  methods: {
    setVisibleInViewport(cesiumLayer, viewport, checked) {
      if (cesiumLayer['setVisibleInViewport']) {
        if (!cesiumLayer.visible) {
          cesiumLayer.visible = true;
          if (viewport === 0) {
            cesiumLayer.setVisibleInViewport(0, checked);
          } else {
            cesiumLayer.setVisibleInViewport(0, false);
          }

          if (viewport === 1) {
            cesiumLayer.setVisibleInViewport(1, checked);
          } else {
            cesiumLayer.setVisibleInViewport(1, false);
          }
        } else {
          cesiumLayer.setVisibleInViewport(viewport, checked);
        }
      }
    },
  },
};
