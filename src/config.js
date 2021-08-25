import { layers } from './layers'

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  DEM: 'http://106.14.242.98:8090/iserver/services/3D-DEM/rest/realspace',
  // 'http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/DatasetDEM',
  layers: layers,
  defaultCamera: {
    destination: Cesium.Cartesian3.fromDegrees(120.603, 31.175, 400.0),
    orientation: {
      heading: 0.027587479922354774,
      pitch: -0.5169824822585825,
      roll: 6.283185307179586,
    },
    duration: 2,
  },
  baseMaps: {
    none: {
      enable: true,
      default: false,
    },
    earth: {
      type: 'bing',
      default: true,
      params: {
        url: 'https://dev.virtualearth.net',
        mapStyle: Cesium.BingMapsStyle.AERIAL,
        key: URL_CONFIG.BING_MAP_KEY,
      },
    },
    normal: {
      type: 'gaode',
      params: {
        url:
          'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      },
      //   type: 'tianditu',
      //   params: {
      //     mapStyle: Cesium.TiandituMapsStyle['VEC_W'],
      //     token: URL_CONFIG.TOKEN_TIANDITU,
      //   },
      // type: 'arcgis',
      // params: {
      //   url:
      //     'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
      // },
    },
  },
}
