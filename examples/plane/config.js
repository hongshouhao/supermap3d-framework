import { layers } from './layers';

export const config = {
  iServerBaseURL: process.env.VUE_APP_ISERVER_BASE_URL,
  usePlaneCoordinateSystem: true,
  // dem: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/beijingdem',

  emptyMap: {
    url: '/empty.jpg',
    maxVisibleAltitude: 756827,
  },
  undergroundMode: false,
  minimumZoomDistance: -1000,
  colorCorrection: {
    brightness: 1.5,
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
    convert: false,
    destination: {
      x: 447574.224648742,
      y: 4429766.392444081,
      z: 991.1165208122693,
    },
    orientation: {
      heading: 4.673354691663904,
      pitch: -0.8192462906974112,
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
      default: true,
      maps: [
        // {
        //   type: 'bing',
        //   params: {
        //     url: 'https://dev.virtualearth.net',
        //     mapStyle: 'Aerial',
        //     key: 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
        //   },
        // },
        {
          type: 'supermap',
          params: {
            url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/beijingimg',
          },
        },
      ],
    },
    normal: {
      maps: [],
    },
  },
};
