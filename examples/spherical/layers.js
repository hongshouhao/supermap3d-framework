// Terrain    地形图
// MapImagery 影像图层
// S3M        三维图层
// MVT        矢量瓦片图层

export const layers = [
  {
    id: '2fasd',
    label: '东沙湖',
    expand: true,
    virtual: false,
    icon: 'esri-icon-layers',
    children: [
      // {
      //   id: '全球底图',
      //   name: '全球底图',
      //   layer: {
      //     type: 'SMIMG',
      //     visible: false,
      //     minVisibleAltitude: 756826.234041,
      //     url:
      //       'http://localhost:8090/iserver/services/3D-globalmap/rest/realspace/datas/BlackMarble_2012_750m_geo%40globalmap',
      //   },
      // },
      // {
      //   id: '2asda72',
      //   name: '东沙湖-水面',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     url: `http://localhost:8090/iserver/services/3D-ShuiMian_3D-shuimian/rest/realspace/datas/%E6%B0%B4%E9%9D%A2_3D@shuimian/config`,
      //   },
      // },
      // {
      //   id: '2a7',
      //   name: '东沙湖-倾斜',
      //   layer: {
      //     type: 'S3M',
      //     visible: false,
      //     selectable: false,
      //     url: `http://localhost:8090/iserver/services/3D-DSH/rest/realspace/datas/DSHPZ/config`,
      //     iQuery: {
      //       symbol: {
      //         stroke: Cesium.Color.BLUE,
      //         strokeWidth: 2,
      //         fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
      //       },
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
      //                         [120.59053263900012, 31.194568653000033, 3],
      //                         [120.59047571700012, 31.19460944900004, 3],
      //                         [120.58735664000005, 31.194363434000024, 3],
      //                         [120.58721493400003, 31.194216397000048, 3],
      //                         [120.58736773800001, 31.19284602600004, 3],
      //                         [120.59068445000003, 31.193111611000063, 3],
      //                         [120.59053263900012, 31.194568653000033, 3],
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
      {
        id: '2a7as燃气d',
        name: '燃气',
        layer: {
          type: 'S3M',
          visible: false,
          selectable: false,
          url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-JZHBXZ1th/rest/realspace/datas/JZHB_XZ_1@th/config',
        },
      },
      // {
      //   id: '1000',
      //   name: '东沙湖-单元线',
      //   layer: {
      //     type: 'MVT',
      //     visible: false,
      //     url: `http://localhost:8090/iserver/services/map-mvt-DengJiDanYuanXianDSH44902/restjsr/v1/vectortile/maps/登记单元线%40DSH4490`,
      //   },
      // },
      // {
      //   id: '1000',
      //   name: 'MVT-TEST',
      //   layer: {
      //     type: 'MVT',
      //     visible: false,
      //     url: `http://106.14.242.98:8090/iserver/services/map-mvt-TDLYXZDLTB1/restjsr/v1/vectortile/maps/TDLYXZ_DLTB_1`,
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
      //                         [120.59053263900012, 31.194568653000033, 3],
      //                         [120.59047571700012, 31.19460944900004, 3],
      //                         [120.58735664000005, 31.194363434000024, 3],
      //                         [120.58721493400003, 31.194216397000048, 3],
      //                         [120.58736773800001, 31.19284602600004, 3],
      //                         [120.59068445000003, 31.193111611000063, 3],
      //                         [120.59053263900012, 31.194568653000033, 3],
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
      //   id: '2a72',
      //   name: '东沙湖-DEM1',
      //   layer: {
      //     type: 'DEM',
      //     visible: false,
      //     url: `http://localhost:8090/iserver/services/3D-CaiJianHouFanWei0713_1_1ZZ-DEM/rest/realspace/datas/%E8%A3%81%E5%89%AA%E5%90%8E%E8%8C%83%E5%9B%B40713_1_1%40DEM_Terrain`,
      //   },
      // },
      // {
      //   id: 'asdaf3',
      //   name: '东沙湖-DEM2',
      //   layer: {
      //     type: 'DEM',
      //     visible: false,
      //     url:
      //       'http://localhost:8090/iserver/services/3D-GongYeYuanQuDEM_1_1-SZ/rest/realspace/datas/%E5%B7%A5%E4%B8%9A%E5%9B%AD%E5%8C%BADEM_1_1%40SZ_Terrain',
      //   },
      // },
    ],
  },
  {
    id: '影像',
    name: '影像',
    layer: {
      type: 'SMIMG',
      visible: false,
      url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-Layers/rest/maps/Layers',
    },
  },
  {
    id: '影像2',
    name: '影像2',
    layer: {
      type: 'SMIMG',
      visible: false,
      url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCKGTHXC/rest/maps/THXC_KG_THXC',
    },
  },
  {
    id: '影像3',
    name: '影像3',
    layer: {
      type: 'MVT',
      visible: false,
      url: 'http://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE',
    },
  },
];
