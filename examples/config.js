import { layers } from './layers'

console.log(URL_CONFIG)

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  useEllipsoid: true,
  dem: URL_CONFIG.SiChuan_TERRAIN,
  undergroundMode: false,
  minimumZoomDistance: -1000,
  drillPick: {
    enable: false,
    depth: 20,
  },
  // dem:
  //   'http://192.168.175.70:8090/iserver/services/3D-local3DCache-SZDEM4490dx/rest/realspace/datas/SZDEM_4490@dx',
  layers: layers,
  defaultCamera: {
    destination: {
      x: -2780779.3515402046,
      y: 4701313.255898198,
      z: 3282896.1677609854,
    },
    orientation: {
      heading: 0.027588725000345704,
      pitch: -0.5169348809396417,
      roll: 6.28318530698979,
    },
    duration: 2,
  },
  baseMaps: {
    none: {
      enable: false,
      default: false,
    },
    earth: {
      default: true,
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
      maps: [
        //  {
        //    type: 'mapbox',
        //    params: {
        //      url:
        //        'http://36.153.213.20/GeoCMS/v1/cf/rest/services/MapService/VM/2db4282f-4b0e-4c47-b1c4-61ffa92651be?token=k9rELZ%2BePwRhalPbO%2FJyZWglMmTQ2x6upsVUTLlZA6KK7glHdYwd5PBbyHXLB1fMvlHXQ7yWycDBRTfq2FqaHZPdNX868fGMUsBHgINxW6fqLd4eWoGztA%3D%3D',
        //      styleId: 'aaaaaaaaaaaffffffff',
        //    },
        //  },
        {
          type: 'gaode',
          mode: 'night',
          params: {
            url:
              'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
          },
        },
        {
          type: 'supermap',
          mode: 'day',
          params: {
            url: URL_CONFIG.SUPERMAP_IMG_MEC,
          },
        },
      ],
    },
  },
}
