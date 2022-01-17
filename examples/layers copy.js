//SMIMG 影像图层
//S3M        三维图层
//MVT        矢量瓦片图层
//DEM
import // popupTemplateWithDefaultUI,
// popupTemplateWithCustomUI,
'./popupTemplate'

// let baseUrl = process.env.VUE_APP_ISERVER_BASE_URL

export const layers = [
  // {
  //   id: '1',
  //   name: 'DEM',
  //   display: true,
  //   layer: {
  //     type: 'DEM',
  //     visible: false,
  //     url: `http://192.168.175.70:8090/iserver/services/3D-CaiJianHouFanWei0713_1_1ZZ-DEM/rest/realspace/datas/裁剪后范围0713_1_1@DEM_Terrain`,
  //     // url0: `${baseUrl}iserver/services/3D-DEM0/rest/realspace/datas/DEM0`,
  //   },
  // },

  // {
  //   id: 'test-3dTiles',
  //   name: '3dTiles',
  //   layer: {
  //     type: '3DTILES',
  //     visible: true,
  //     url: `http://127.0.0.1:5501/tileset.json`,
  //     zOffset: -19.206,
  //     iQuery: {
  //       // symbol: {
  //       //   stroke: Cesium.Color.fromCssColorString('#FF0000'),
  //       //   fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
  //       //   strokeWidth: 2,
  //       // },
  //       getData: function(p) {
  //         console.log(p)
  //         return {
  //           object: {
  //             id: 1,
  //             shape: {
  //               type: 'FeatureCollection',
  //               features: [
  //                 {
  //                   type: 'Feature',
  //                   properties: {},
  //                   geometry: {
  //                     type: 'Polygon',
  //                     coordinates: [
  //                       [
  //                         [115.98874574945314, 29.714681663499647, 8],
  //                         [115.98844966578308, 29.714167413496305, 8],
  //                         [115.98901889056192, 29.713904099687618, 8],
  //                         [115.98925663585524, 29.714367876988298, 8],
  //                         [115.98874574945314, 29.714681663499647, 8],
  //                       ],
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //             attributes: {
  //               a: 1,
  //               b: 2,
  //             },
  //           },
  //         }
  //       },
  //     },
  //   },
  // },
  // {
  //   id: '111',
  //   name: '市局水下',
  //   disable: true,
  //   layer: {
  //     type: 'SMIMG',
  //     visible: true,
  //     url: `${baseUrl}iserver/services/3D-local3DCache-dem1tiftest/rest/realspace/datas/dem_1@tif_test`,
  //   },
  // },
  {
    id: '太湖新城精模',
    name: '太湖新城精模',
    disable: false,
    layer: {
      type: 'S3M',
      visible: false,
      url:
        'http://192.168.175.70:8090/iserver/services/3D-local3DCache-THXCRYW1THXCRYW/rest/realspace/datas/THXCRYW_1@THXCRYW/config',

      flattenRegions: [
        [
          120.60176437339629,
          31.184432532743152,
          0,
          120.60203936867242,
          31.181754094638176,
          0,
          120.60324403847666,
          31.181772259112677,
          0,
          120.60323994862907,
          31.184236800529675,
          0,
          120.60176437339629,
          31.184432532743152,
          0,
        ],
      ],
    },
  },
  {
    id: '太湖新城倾斜摄影',
    name: '太湖新城倾斜摄影',
    disable: false,
    layer: {
      type: 'S3M',
      visible: false,
      url: `http://192.168.175.70:8090/iserver/services/3D-local3DCache-szgx44902/rest/realspace/datas/Config_3/config`,
    },
  },
  {
    id: '市局精模',
    name: '市局精模',
    layer: {
      type: 'S3M',
      visible: false,
      url: `http://192.168.175.70:8090/iserver/services/3D-local3DCache-gusuGuSuQu/rest/realspace/datas/gusu@姑苏区/config`,
    },
  },
  {
    id: '2',
    label: '吴中',
    expand: true,
    icon: 'esri-icon-layers',
    children: [
      {
        id: '27',
        name: '地下管线',
        layer: {
          type: 'S3M',
          visible: false,
          url: `http://106.14.242.98:8090/iserver/services/3D-XCGX/rest/realspace/datas/GX/config`,
        },
      },
      // {
      //   id: '28',
      //   name: '楼幢',
      //   layer: {
      //     type: 'S3M',
      //     visible: true,
      //     url: `${baseUrl}iserver/services/3D-XCJZDT/rest/realspace/datas/Config/config`,
      //   },
      // },
      {
        id: '29',
        name: 'TESTMVT',
        layer: {
          type: 'MVT',
          visible: false,
          url: `http://192.168.175.70:8090/iserver/services/map-mvt-DLTB2016/restjsr/v1/vectortile/maps/DLTB2016`,
          outFields: ['*'],
        },
      },
    ],
  },
  {
    id: '3',
    label: '常熟',
    expand: true,
    children: [
      // {
      //   id: '31',
      //   name: '供电',
      //   layer: {
      //     type: 'S3M',
      //     visible: true,
      //     enableFillAndWireFrame: true,
      //     url: `${baseUrl}iserver/services/3D-GongDian/rest/realspace/datas/供电_1@供电/config`,
      //     datasetName: '供电:供电_1',
      //     outFields: ['*'],
      //   },
      // },
      // {
      //   id: '311',
      //   name: '电信',
      //   layer: {
      //     type: 'S3M',
      //     visible: true,
      //     enableFillAndWireFrame: true,
      //     url: `${baseUrl}iserver/services/3D-DianXin/rest/realspace/datas/电信_1@电信/config`,
      //     datasetName: '电信:电信_1',
      //     outFields: ['*'],
      //   },
      // },
      // {
      //   id: '32',
      //   name: '污水',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     enableFillAndWireFrame: true,
      //     url: `http://106.14.242.98:8090/iserver/services/3D-WuShui_3d_n/rest/realspace/datas/污水_4490@污水/config`,
      //     datasetName: '污水:污水_1',
      //     outFields: ['*'],
      //     renderer: {
      //       type: 'S3MLAYER',
      //       layer: {
      //         url: `http://106.14.242.98:8090/iserver/services/3D-WuShui_FLOW_n/rest/realspace/datas/WS_LINE_4490_3D@污水flow/config`,
      //         textureUVSpeed: new Cesium.Cartesian2(-0.5, 0),
      //       },
      //     },
      //   },
      // },
      // {
      //   id: '33',
      //   name: '有线电视',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     url: `${baseUrl}iserver/services/3D-YouXianDianShi/rest/realspace/datas/有线电视_1@有线电视/config`,
      //     datasetName: '有线电视:有线电视_1',
      //     outFields: ['*'],
      //   },
      // },
      // {
      //   id: '34',
      //   name: '交通信号',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     url: `${baseUrl}iserver/services/3D-JiaoTongXinHao/rest/realspace/datas/交通信号_1@交通信号/config`,
      //     datasetName: '交通信号投影面:交通信号投影面',
      //     outFields: ['*'],
      //   },
      // },
      // {
      //   id: '35',
      //   name: '电通',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     url: `${baseUrl}iserver/services/3D-DianTong/rest/realspace/datas/电通_1@电通/config`,
      //     datasetName: '电通:电通_1',
      //     outFields: ['*'],
      //   },
      // },
      {
        id: '36',
        name: '标志标线',
        layer: {
          type: 'SMIMG',
          visible: false,
          url:
            'http://192.168.175.70:8090/iserver/services/3D-CaiJianHouFanWei0713_1_1ZZ-DEM/rest/realspace/datas/裁剪后范围0713_1_1@DEM',
          // iQuery: {
          //   // symbol: {
          //   //   stroke: Cesium.Color.fromCssColorString('#FF0000'),
          //   //   fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
          //   //   strokeWidth: 2,
          //   // },
          //   // dataUrl: 'http://localhost:9864/cad-connect-test',
          //   // transform: function(data) {
          //   //   return {
          //   //     object: {
          //   //       id: 1,
          //   //       shape: {
          //   //         type: 'FeatureCollection',
          //   //         features: [
          //   //           {
          //   //             type: 'Feature',
          //   //             properties: {},
          //   //             geometry: {
          //   //               type: 'Polygon',
          //   //               coordinates: [
          //   //                 [
          //   //                   [120.60305656736594, 31.18123133876843, 1],
          //   //                   [120.60652506219583, 31.18079974839298, 1],
          //   //                   [120.60470257215461, 31.182567293375214, 1],
          //   //                   [120.60305656736594, 31.18123133876843, 1],
          //   //                 ],
          //   //               ],
          //   //             },
          //   //           },
          //   //         ],
          //   //       },
          //   //       attributes: {
          //   //         a: data,
          //   //         b: 2,
          //   //       },
          //   //     },
          //   //   }
          //   // },
          //   getData: function(p) {
          //     console.log(p)
          //     return {
          //       object: {
          //         id: 1,
          //         shape: {
          //           type: 'FeatureCollection',
          //           features: [
          //             {
          //               type: 'Feature',
          //               properties: {},
          //               geometry: {
          //                 type: 'Polygon',
          //                 coordinates: [
          //                   [
          //                     [120.60305656736594, 31.18123133876843, 1],
          //                     [120.60652506219583, 31.18079974839298, 1],
          //                     [120.60470257215461, 31.182567293375214, 1],
          //                     [120.60305656736594, 31.18123133876843, 1],
          //                   ],
          //                 ],
          //               },
          //             },
          //           ],
          //         },
          //         attributes: {
          //           a: 1,
          //           b: 2,
          //         },
          //       },
          //     }
          //   },
          // },
        },
      },
    ],
  },
]
