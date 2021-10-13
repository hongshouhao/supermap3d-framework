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
    id: '111',
    name: '市局水下',
    layer: {
      type: 'SMIMG',
      visible: true,
      url: `${baseUrl}iserver/services/3D-local3DCache-dem1tiftest/rest/realspace/datas/dem_1@tif_test`,
    },
  },
  {
    id: '111222',
    name: 'test122',
    layer: {
      type: 'S3M',
      visible: true,
      enableFillAndWireFrame: false,
      url: `http://106.14.242.98:8090/iserver/services/3D-dsyz/rest/realspace/datas/dsyz_1@1/config`,
      popupTemplate: popupTemplateWithDefaultUI,
      outFields: ['*'],
    },
  },
  {
    id: '111224',
    name: 'test111224',
    layer: {
      type: 'S3M',
      visible: true,
      enableFillAndWireFrame: false,
      url: `http://106.14.242.98:8090/iserver/services/3D-1/rest/realspace/datas/YHXSJZ_1@1/config`,
      popupTemplate: popupTemplateWithDefaultUI,
      outFields: ['*'],
    },
  },
  {
    id: '2',
    label: '吴中',
    expand: true,
    icon: 'esri-icon-layers',
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
          selectColorType: Cesium.SelectColorType.REPLACE,
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
          url: `${baseUrl}iserver/services/map-mvt-CXGHCZXXGHTTaiHuXinChengQiDongQu2/restjsr/v1/vectortile/maps/CXGH_CZXXGH_T太湖新城启动区_2`,
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
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-GongDian/rest/realspace/datas/供电_1@供电/config`,
          datasetName: '供电:供电_1',
          outFields: ['*'],
        },
      },
      {
        id: '311',
        name: '电信',
        layer: {
          type: 'S3M',
          visible: true,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-DianXin/rest/realspace/datas/电信_1@电信/config`,
          datasetName: '电信:电信_1',
          outFields: ['*'],
        },
      },
      {
        id: '32',
        name: '污水',
        layer: {
          type: 'S3M',
          visible: false,
          enableFillAndWireFrame: true,
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
          iQuery: {
            symbol: {
              stroke: Cesium.Color.fromCssColorString('#FF0000'),
              fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
              strokeWidth: 2,
            },
            dataUrl: 'http://localhost:9864/cad-connect-test',
            transform: function(data) {
              return {
                object: {
                  id: 1,
                  shape: {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'Polygon',
                          coordinates: [
                            [
                              [120.60305656736594, 31.18123133876843, 1],
                              [120.60652506219583, 31.18079974839298, 1],
                              [120.60470257215461, 31.182567293375214, 1],
                              [120.60305656736594, 31.18123133876843, 1],
                            ],
                          ],
                        },
                      },
                    ],
                  },
                  attributes: {
                    a: data,
                    b: 2,
                  },
                },
              }
            },
            // getData: function(p) {
            //   console.log(p)
            //   return {
            //     object: {
            //       id: 1,
            //       shape: {
            //         type: 'FeatureCollection',
            //         features: [
            //           {
            //             type: 'Feature',
            //             properties: {},
            //             geometry: {
            //               type: 'Polygon',
            //               coordinates: [
            //                 [
            //                   [120.60305656736594, 31.18123133876843, 1],
            //                   [120.60652506219583, 31.18079974839298, 1],
            //                   [120.60470257215461, 31.182567293375214, 1],
            //                   [120.60305656736594, 31.18123133876843, 1],
            //                 ],
            //               ],
            //             },
            //           },
            //         ],
            //       },
            //       attributes: {
            //         a: 1,
            //         b: 2,
            //       },
            //     },
            //   }
            // },
          },
        },
      },
    ],
  },
]
