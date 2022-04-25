/*
 * @Author: zhangbo
 * @Date: 2022-04-09 13:02:06
 * @LastEditors: ZhangBo
 * @LastEditTime: 2022-04-10 21:41:39
 * @FilePath: \supermap3d-framework\core\tools\Sketch\BaseDrawingTool.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
export default class BaseDrawingTool {
  constructor(viewer, options) {
    this.viewer = viewer || window.s3d.viewer;
    this.options = options;
  }
  getGeometries() {
    let coll = new Cesium.EntityCollection(this.viewer.entities.owner);
    for (let ent of this.entities) {
      coll.add(ent);
    }
    return coll.toGeoJson();
  }
}