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
      url0: `${baseUrl}iserver/services/3D-DEM0/rest/realspace/datas/DEM0`,
    },
  },
  {
    id: '2',
    label: '吴中',
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
      {
        id: '23',
        name: '倾斜1',
        layer: {
          type: 'S3M',
          visible: false,
          url: `${baseUrl}iserver/services/3D-MoXing1_1-2/rest/realspace/datas/BackUp_TarDataset_1@模型1/config`,
          dataUrl: `${baseUrl}iserver/services/data-MoXing1_1/rest/data/featureResults.json?returnContent=true`,
          outFields: ['*'],
          datasetName: '模型1:BackUp_TarDataset_1',
        },
      },
      {
        id: '26',
        name: '红线',
        layer: {
          type: 'SMIMG',
          visible: false,
          url: `${baseUrl}iserver/services/map-PiCiZhiTu/rest/maps/批次`,
        },
      },
      {
        id: '27',
        name: '地下管线',
        layer: {
          type: 'S3M',
          visible: false,
          url: `${baseUrl}iserver/services/3D-XCGX/rest/realspace/datas/GX/config`,
        },
      },
      {
        id: '28',
        name: '楼幢',
        layer: {
          type: 'S3M',
          visible: true,
          url: `${baseUrl}iserver/services/3D-XCJZDT/rest/realspace/datas/Config/config`,
        },
      },
      {
        id: '29',
        name: 'TESTMVT',
        layer: {
          type: 'MVT',
          visible: false,
          url: `${baseUrl}iserver/services/map-mvt-FanWei2/restjsr/v1/vectortile/maps/范围_2`,
        },
      },
    ],
  },
  {
    id: '3',
    label: '常熟',
    expand: true,
    children: [
      {
        id: '31',
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
        id: '32',
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
        id: '33',
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
        id: '34',
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
        id: '35',
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
        id: '36',
        name: '标志标线',
        layer: {
          type: 'SMIMG',
          visible: false,
          url: `${baseUrl}iserver/services/3D-BiaoXian/rest/realspace/datas/标志标线缓存`,
          outFields: ['*'],
        },
      },
    ],
  },
]
