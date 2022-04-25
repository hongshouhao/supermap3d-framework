/*
 * @Author: ZhangBo
 * @Date: 2022-03-15 09:33:41
 * @LastEditors: ZhangBo
 * @LastEditTime: 2022-03-29 13:51:27
 * @FilePath: \wz_thxc\src\core\iquery\index.js
 * @Description:
 *
 * Copyright (c) 2022 by ZhangBo/SIPSD, All Rights Reserved.
 */
import {
  popupTemplateWithDefaultUI,
  popupTemplateWithCustomUI,
} from './popupTemplate.js';
import { parse } from 'wellknown';
// import App from "../const.js";

export default function (Vue, config) {
  const getIQueryConfig = function (layerId) {
    return {
      // 图形渲染样式
      symbol: {
        stroke: Cesium.Color.BLUE,
        strokeWidth: 2,
        fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
      },
      getData: function (position) {
        return Vue.prototype.$api.jonemap
          .iQuery({
            method: 'post',
            data: {
              conditions: {
                buffer: 0.0001,
                layerIds: layerId,
                topLayer: true,
                x: position.longitude,
                y: position.latitude,
              },
              leafIds: [layerId],
            },
          })
          .then(({ data }) => {
            if (data.length == 0) {
              return null;
            }
            let oriObj = data[0].attribute;
            let newObj = {};

            Object.keys(oriObj).forEach((k) => {
              let spliter = k.split('$');
              if (spliter.length > 1) {
                newObj[spliter[0]] = `${oriObj[k]} ${spliter[1]}`;
              } else {
                newObj[k] = oriObj[k];
              }
            });
            return {
              object: {
                id: data[0].name,
                shape: {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: parse(data[0].shape),
                    },
                  ],
                },
                attributes: newObj,
              },
            };
          });
      },
    };
  };

  // 递归树 设置iquery配置
  const setIQuery = function (layers) {
    for (const key in layers) {
      // name作为主键，将id赋值给name
      if (layers[key].name) {
        layers[key].label = layers[key].name;
        layers[key].name = layers[key].id;
      }
      if (layers[key].layer && layers[key].layer.url) {
        let iqueryConfig = getIQueryConfig(layers[key].id);
        layers[key].layer.label = layers[key].label;

        layers[key].layer.iQuery = iqueryConfig;
        layers[key].layer.popupTemplate = popupTemplateWithDefaultUI;
      } else if (layers[key].children && layers[key].children.length > 0) {
        setIQuery(layers[key].children);
      }
    }
  };

  setIQuery(config.layers);
}
