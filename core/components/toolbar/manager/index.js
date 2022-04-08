/*
 * @Author: zhangbo
 * @Date: 2022-04-06 09:55:57
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-06 17:05:03
 * @FilePath: \supermap3d-framework\core\components\toolbar\adapter\index.js
 * @Description: 工具管理器，统一管理工具
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import Vue from 'vue';
import AngleMeasurement from '../../../tools/Measurement/AngleMeasurement';
// import MeasureTool from "../../../tools/Measurement/MeasureTool";
import PointMeasurement from '../../../tools/Measurement/PointMeasurement';
import PolygonDrawingTool from '../../../tools/Sketch/PolygonDrawingTool';
import PolylineDrawingTool from '../../../tools/Sketch/PolygonDrawingTool';
import CommonSetting from '../../common/Settings.vue';
import WidgetPanel from '../../common/WidgetInfoPanel.vue';

export default class ToolManager {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.options = options;

    this.toolList = [
      { code: 'measure-angle', constructor: AngleMeasurement },
      { code: 'measure-point', constructor: PointMeasurement },
      { code: 'draw-polygon', constructor: PolygonDrawingTool },
      {
        code: 'draw-polygon',
        constructor: PolygonDrawingTool,
      },
      { code: 'draw-polyline', constructor: PolylineDrawingTool },
      {
        code: 'split-screen',
        handler: () => {
          window.s3d.layerTree.toggleViewportMode();
        },
      },
      {
        code: 'iquery',
        handler: () => {
          window.s3d.popup.enable();
        },
      },
      {
        code: 'setting',
        handler: () => {},
        extraComponent: 'common-setting',
        extraComponentLabel: '设置',
      },
      {
        code: 'clear',
        handler: () => {},
      },
    ];

    this.toolInstanceList = [];

    Vue.component('common-setting', CommonSetting);
    Vue.component('widget-panel', WidgetPanel);
  }

  execute(code) {
    let toolItem = this.toolList.filter((f) => f.code == code)[0];
    if (toolItem) {
      if (toolItem.handler) {
        toolItem.handler();
      } else {
        let instance = new toolItem.constructor(this.viewer);
        instance.start();
        this.toolInstanceList.push(instance);
      }
      return toolItem;
    }
    return null;
  }

  clear() {
    this.toolInstanceList.forEach((f) => {
      if (f.clear) {
        f.clear();
      }
    });
    this.toolInstanceList = [];
  }
}
