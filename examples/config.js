import { layers } from './layers'

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  dem: URL_CONFIG.SiChuan_TERRAIN,
  undergroundMode: true,
  minimumZoomDistance: -1000,
  drillPick: {
    enable: true,
    depth: 20,
  },
  // dem:
  //   'http://106.14.242.98:8090/iserver/services/3D-DEM/rest/realspace/datas/DEM缓存',
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
      maps: [
        {
          type: 'bing',
          params: {
            url: 'https://dev.virtualearth.net',
            mapStyle: 'Aerial',
            key:
              'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
          },
        },
        // {
        //   type: 'arcgisex',
        //   params: {
        //     url:
        //       'http://36.153.213.20/GeoCMS/v1/cf/rest/services/MapService/ESRI/0f3f5490-5616-44d2-a1e4-5c664ad907fa?token=k9rELZ%2BePwRhalPbO%2FJyZWglMmTQ2x6upsVUTLlZA6KK7glHdYwd5PBbyHXLB1fMvlHXQ7yWycDBRTfq2FqaHZPdNX868fGMUsBHgINxW6fqLd4eWoGztA%3D%3D',
        //   },
        // },
        // {
        //   type: 'arcgisex',
        //   params: {
        //     url:
        //       'http://36.153.213.20/GeoCMS/v1/cf/rest/services/MapService/ESRI/3a7dc564-6c51-6f7d-1785-39fa4673b672?token=k9rELZ%2BePwRhalPbO%2FJyZWglMmTQ2x6upsVUTLlZA6KK7glHdYwd5PBbyHXLB1fMvlHXQ7yWycDBRTfq2FqaHZPdNX868fGMUsBHgINxW6fqLd4eWoGztA%3D%3D',
        //   },
        // },
      ],
    },
    normal: {
      default: true,
      maps: [
        //  {
        //    type: 'mapbox',
        //    params: {
        //      url:
        //        'http://36.153.213.20/GeoCMS/v1/cf/rest/services/MapService/VM/2db4282f-4b0e-4c47-b1c4-61ffa92651be?token=k9rELZ%2BePwRhalPbO%2FJyZWglMmTQ2x6upsVUTLlZA6KK7glHdYwd5PBbyHXLB1fMvlHXQ7yWycDBRTfq2FqaHZPdNX868fGMUsBHgINxW6fqLd4eWoGztA%3D%3D',
        //      styleId: 'aaaaaaaaaaaffffffff',
        //    },
        //  },
        // {
        //   type: 'gaode',
        //   params: {
        //     url:
        //       'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        //   },
        // },
        {
          type: 'tianditu',
          params: {
            mapStyle: Cesium.TiandituMapsStyle['VEC_W'],
            token: URL_CONFIG.TOKEN_TIANDITU,
          },
        },
      ],
    },
  },
}
