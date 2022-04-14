/*
 * @Author: zhangbo
 * @Date: 2022-04-09 13:00:30
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-13 15:18:35
 * @FilePath: \supermap3d-framework\core\tools\Sketch\RectangleDrawingTool.js
 * @Description: 画矩形
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import Vue from "vue";
import BaseDrawingTool from "./BaseDrawingTool";

export default class RectangleDrawingTool extends BaseDrawingTool {
  constructor(viewer, options) {
    super(viewer, options);

    this.options = Object.assign(
      {},
      {
        fillColor: "#ff0000",
        fillOpacity: 0.5,
        lineColor: "#ff0000",
        lineOpacity: 1,
        clampToGround: true,
      },
      options
    );

    this.drawHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.positions = [];
    this.entities = [];

    this.drawingEntity = null;
  }

  start() {
    const that = this;

    return new Promise((resolve, reject) => {
      that.isDrawing = false;

      window.s3d.setCursor("cursor-crosshair");
      that.stop();

      this.drawHandler.setInputAction(function (e) {
        if (!that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.position);
          that.positions.push(cartesianPosition);
          that.isDrawing = true;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.drawHandler.setInputAction(function (e) {
        if (that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.endPosition);

          if (!that.drawingEntity) {
            that.positions.push(cartesianPosition);

            that.drawingEntity = new Cesium.Entity({
              rectangle: {
                coordinates: new Cesium.CallbackProperty(function () {
                  return Cesium.Rectangle.fromCartesianArray(that.positions);
                }, false),
                material: Cesium.Color.fromAlpha(
                  Cesium.Color.fromCssColorString(that.options.fillColor),
                  that.options.fillOpacity
                ),
              },
              // polyline: {
              //   positions: new Cesium.CallbackProperty(function () {
              //     return Cesium.Rectangle.fromCartesianArray(that.positions);
              //   }, false),
              //   material: Cesium.Color.fromAlpha(
              //     Cesium.Color.fromCssColorString(that.options.lineColor),
              //     that.options.lineOpacity
              //   ),
              //   width: 3.0,
              //   clampToGround: true,
              // },
            });

            that.entities.push(that.drawingEntity);
            that.viewer.entities.add(that.drawingEntity);
          } else {
            that.positions.pop();
            that.positions.push(cartesianPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.drawHandler.setInputAction(function (e) {
        that.isDrawing = false;
        that.stop();

        that.getGeometries().then((geojson) => {
          resolve(geojson);
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
  }

  stop() {
    window.s3d.resetCursor();
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.drawingEntity = null;
  }

  clear() {
    this.entities.forEach((f) => {
      this.viewer.entities.remove(f);
    });
    this.entities = [];
  }
}
