//SMIMG 影像图层
//S3M        三维图层
//MVT        矢量瓦片图层
//DEM
import {
  popupTemplateWithDefaultUI,
  popupTemplateWithCustomUI,
} from './popupTemplate'

let baseUrl = process.env.VUE_APP_ISERVER_BASE_URL

export const layers = [
  {
    id: '1',
    name: 'DEM',
    layer: {
      type: 'DEM',
      visible: false,
      url: `${baseUrl}iserver/services/3D-DEM/rest/realspace/datas/DEM缓存`,
    },
  },
  {
    id: '2',
    label: '分层分户',
    expand: true,
    children: [
      {
        id: '21',
        name: '分层',
        layer: {
          type: 'S3M',
          visible: true,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-XCFCFH/rest/realspace/datas/FC/config`,
          popupTemplate: popupTemplateWithDefaultUI,
          outFields: ['*'],
        },
      },
      {
        id: '22',
        name: '分户',
        layer: {
          type: 'S3M',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-XCFCFH/rest/realspace/datas/FH/config`,
          popupTemplate: popupTemplateWithCustomUI,
          outFields: ['*'],
        },
      },
    ],
  },
  {
    id: '3',
    name: '地下管线',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-XCGX/rest/realspace/datas/GX/config`,
    },
  },
  {
    id: '4',
    name: '楼幢',
    layer: {
      type: 'S3M',
      visible: true,
      url: `${baseUrl}iserver/services/3D-XCJZDT/rest/realspace/datas/Config/config`,
    },
  },
  {
    id: '5',
    name: '红线',
    layer: {
      type: 'SMIMG',
      visible: false,
      url: `${baseUrl}iserver/services/map-PiCiZhiTu/rest/maps/批次`,
    },
  },
  {
    id: '6',
    name: 'TESTMVT',
    layer: {
      type: 'MVT',
      visible: false,
      url: `${baseUrl}iserver/services/map-mvt-FanWei2/restjsr/v1/vectortile/maps/范围_2`,
    },
  },
  {
    id: '8',
    name: '供电',
    layer: {
      type: 'S3M',
      visible: true,
      url: `${baseUrl}iserver/services/3D-GongDian/rest/realspace/datas/供电_1@供电/config`,
      datasetName: '供电:供电_1',
      outFields: ['*'],
    },
  },
  {
    id: '9',
    name: '污水',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-WuShui/rest/realspace/datas/污水_1@污水/config`,
      datasetName: '污水:污水_1',
      outFields: ['*'],
      renderer: {
        type: 'S3MLAYER',
        layer: {
          url: `${baseUrl}iserver/services/3D-test/rest/realspace/datas/WS_LINE_4_1@污水1/config`,
          textureUVSpeed: new Cesium.Cartesian2(-0.5, 0),
        },
      },
    },
  },
  {
    id: '11',
    name: '有线电视',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-YouXianDianShi/rest/realspace/datas/有线电视_1@有线电视/config`,
      datasetName: '有线电视:有线电视_1',
      outFields: ['*'],
    },
  },
  {
    id: '12',
    name: '交通信号',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-JiaoTongXinHao/rest/realspace/datas/交通信号_1@交通信号/config`,
      datasetName: '交通信号投影面:交通信号投影面',
      outFields: ['*'],
    },
  },
  {
    id: '13',
    name: '电通',
    layer: {
      type: 'S3M',
      visible: false,
      url: `${baseUrl}iserver/services/3D-DianTong/rest/realspace/datas/电通_1@电通/config`,
      datasetName: '电通:电通_1',
      outFields: ['*'],
    },
  },
  {
    id: '10',
    name: '标志标线',
    layer: {
      type: 'SMIMG',
      visible: false,
      url: `${baseUrl}iserver/services/3D-BiaoXian/rest/realspace/datas/标志标线缓存`,
      outFields: ['*'],
    },
  },
  {
    id: '14',
    name: '地图服务',
    layer: {
      type: 'SMIMG',
      visible: false,
      url: `${baseUrl}iserver/services/map-ugcv5-FanWei1DiTuFuWu/rest/maps/范围_1%40地图服务`,
    },
  },
]
