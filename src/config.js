import { layers } from './layers'

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  layers: layers,
  defaultCamera: {
    destination: Cesium.Cartesian3.fromDegrees(120.603, 31.175, 400.0),
    orientation: {
      heading: 0.027587479922354774,
      pitch: -0.5169824822585825,
      roll: 6.283185307179586,
    },
    duration: 1.5,
  },
  baseMapEarth: {
    type: 'bing',
    params: {
      url: 'https://dev.virtualearth.net',
      mapStyle: Cesium.BingMapsStyle.AERIAL,
      key: URL_CONFIG.BING_MAP_KEY,
    },
  },
  baseMapNormal: {
    type: 'tianditu',
    params: {
      mapStyle: Cesium.TiandituMapsStyle['VEC_W'],
      token: URL_CONFIG.TOKEN_TIANDITU,
    },
  },
}
