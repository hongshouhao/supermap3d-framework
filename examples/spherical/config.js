import { layers } from './layers';

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  useEllipsoid: true,
  usePlaneCoordinateSystem: false,
  // dem: URL_CONFIG.SiChuan_TERRAIN,
  // dem: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/beijingdem',
  // globalNightMap: {
  //   minVisibleAltitude: 756826.234041,
  //   url:
  //     'http://localhost:8090/iserver/services/3D-globalmap/rest/realspace/datas/BlackMarble_2012_750m_geo%40globalmap',
  // },
  emptyMap: {
    url: '/empty.jpg',
    maxVisibleAltitude: 756827,
  },
  undergroundMode: false,
  minimumZoomDistance: -1000,
  colorCorrection: {
    brightness: 1,
    hue: 0.05,
    saturation: 1.1,
    contrast: 1.05,
  },
  drillPick: {
    enable: false,
    depth: 20,
  },
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
      enable: true,
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
            key: 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
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
        {
          type: 'tianditu',
          params: {
            highResolution: true,
            mapStyle: 'vec_w',
            token: '6e6c4794820bd4fd1b196af3f328d82d',
          },
        },
        {
          type: 'tianditu',
          params: {
            highResolution: true,
            mapStyle: 'cva_c',
            token: '6e6c4794820bd4fd1b196af3f328d82d',
          },
        },

        // {
        //   type: 'bing',
        //   params: {
        //     url: 'https://dev.virtualearth.net',
        //     mapStyle: 'Aerial',
        //     key: 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
        //   },
        // },
        // {
        //   type: 'arcgisex',
        //   mode: 'night',
        //   params: {
        //     url:
        //       'http://58.210.9.133/geoserver/rest/services/ZK_DLTB2020/MapServer',
        //   },
        // },
        // {
        //   type: 'supermap',
        //   // mode: 'day',
        //   params: {
        //     url: URL_CONFIG.SUPERMAP_IMG_MEC,
        //   },
        // },
      ],
    },
  },
};
