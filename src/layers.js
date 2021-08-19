//Terrain    地形图
//MapImagery 影像图层
//S3M        三维图层
//MVT        矢量瓦片图层

import {
  popupTemplateWithDefaultUI,
  popupTemplateWithCustomUI,
} from './popupTemplate'

let baseUrl = process.env.VUE_APP_ISERVER_BASE_URL

export const layers = [
  {
    id: '2',
    label: '分层分户',
    expand: true,
    children: [
      {
        id: '21',
        label: '分层',
        layer: {
          type: 'S3M',
          visible: true,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-XCFCFH/rest/realspace/datas/FC/config`,
          popupTemplate: popupTemplateWithDefaultUI,
        },
      },
      {
        id: '22',
        label: '分户',
        layer: {
          type: 'S3M',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-XCFCFH/rest/realspace/datas/FH/config`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
    ],
  },
  {
    id: '3',
    label: '地下管线',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-XCGX/rest/realspace/datas/GX/config`,
    },
  },
  {
    id: '4',
    label: '楼幢',
    layer: {
      type: 'S3M',
      visible: true,
      url: `${baseUrl}iserver/services/3D-XCJZDT/rest/realspace/datas/Config/config`,
    },
  },
  {
    id: '5',
    label: '红线',
    layer: {
      type: 'SuperMapImagery',
      visible: false,
      url: `${baseUrl}iserver/services/map-PiCiZhiTu/rest/maps/批次`,
    },
  },
  {
    id: '6',
    label: 'TEST',
    layer: {
      type: 'S3M',
      visible: true,
      url: `${baseUrl}iserver/services/3D-DianXin/rest/realspace/datas/%E7%94%B5%E4%BF%A1_1@%E7%94%B5%E4%BF%A1/config`,
      outFields: ['*'],
    },
  },
  {
    id: '7',
    label: 'MVT',
    layer: {
      type: 'MVT',
      visible: false,
      url: `http://106.14.242.98:8090/iserver/services/map-DianTong/rest/maps/DT_POINT@%E7%94%B5%E9%80%9A/layers/DT_POINT@%E7%94%B5%E9%80%9A`,
    },
  },
]
