/*
 * @Author: zhangbo
 * @LastEditors: zhangbo
 * @Date: 2022-04-09 13:00:30
 * @LastEditTime: 2022-04-13 15:06:44
 * @FilePath: \supermap3d-framework\core\tools\Sketch\CircleDrawingTool.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import * as turf from "@turf/turf";
import { lonLatToCartesian, cartesianToLonlat } from "@/utils/CesiumMath";
import BaseDrawingTool from "./BaseDrawingTool";

export default class CircleDrawingTool extends BaseDrawingTool {
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

    this.positions = [];
    this.drawingData = [];
    this.drawingEntity = null;
    this.entities = [];
  }

  start() {
    const that = this;

    return new Promise((resolve, reject) => {
      window.s3d.setCursor("cursor-crosshair");
      that.stop();

      that.isDrawing = false;

      that.drawHandler.setInputAction(function (e) {
        if (!that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.position);
          that.positions.push(cartesianPosition);
          that.isDrawing = true;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      that.drawHandler.setInputAction(function (e) {
        if (that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.endPosition);

          if (!that.drawingEntity) {
            that.positions.push(cartesianPosition);
            that.data = that.getCirclePositions();
            that.drawingEntity = new Cesium.Entity({
              polygon: {
                hierarchy: new Cesium.CallbackProperty(function () {
                  return new Cesium.PolygonHierarchy(that.drawingData);
                }, false),
                clampToGround: that.options.clampToGround,
                show: true,
                fill: true,
                material: Cesium.Color.fromAlpha(
                  Cesium.Color.fromCssColorString(that.options.fillColor),
                  that.options.fillOpacity
                ),
                width: 3,
              },
              // polyline: {
              //   positions: new Cesium.CallbackProperty(function () {
              //     return that.drawingData;
              //   }, false),
              //   material: Cesium.Color.fromAlpha(
              //     Cesium.Color.fromCssColorString(that.options.lineColor),
              //     that.options.lineOpacity
              //   ),
              //   width: 3.0,
              //   clampToGround: true,
              // },
            });
            that.viewer.entities.add(that.drawingEntity);
            that.entities.push(that.drawingEntity);
          } else {
            that.positions.pop();
            that.positions.push(cartesianPosition);
            that.drawingData = that.getCirclePositions(cartesianPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      that.drawHandler.setInputAction(function (e) {
        that.isDrawing = false;

        that.getGeometries().then((geojson) => {
          resolve(geojson);
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
  }

  getCirclePositions = function () {
    let cartPoints = [];
    let end = cartesianToLonlat(this.positions[1]);
    let center = cartesianToLonlat(this.positions[0]);

    let from = turf.point([center.longitude, center.latitude]);
    let to = turf.point([end.longitude, end.latitude]);

    let distance = turf.distance(from, to, { units: "kilometers" });

    let data = turf.circle([center.longitude, center.latitude], distance, {
      steps: 60,
      units: "kilometers",
    });

    data.geometry.coordinates.forEach((g) => {
      g.forEach((f) => {
        cartPoints.push(lonLatToCartesian(f[0], f[1], 0));
      });
    });

    return cartPoints;
  };

  stop() {
    window.s3d.resetCursor();
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.drawingEntity = null;
    this.drawingData = [];
  }

  clear() {
    this.entities.forEach((f) => {
      this.viewer.entities.remove(f);
    });
    this.entities = [];
  }
}
