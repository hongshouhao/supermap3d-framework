let baseUrl = 'http://106.14.242.98:8090/'
let popupTemplateWithCustomUI = {
  getHeader: function(data) {
    return data.object.layer + 'test'
  },
  getContent: function(data) {
    let div = document.createElement('div')
    div.innerHTML = data.object.layer
    return div
  },
}

let popupTemplateWithDefaultUI = {
  getHeader: function(data) {
    return data.object.layer + ' - ' + data.object.id
  },
  getContent: function(data) {
    let arr = []
    arr.push({
      key: '对象',
      value: data.object.layer,
    })
    arr.push({
      key: '标识',
      value: data.object.id,
    })
    arr.push({
      key: '经度',
      value: data.position.longitude,
    })
    arr.push({
      key: '纬度',
      value: data.position.latitude,
    })
    arr.push({
      key: '高度',
      value: data.position.height,
    })

    for (let p in data.object.attributes) {
      arr.push({
        key: p,
        value: data.object.attributes[p],
      })
    }
    return arr
  },
}

window.config = {
  iServerBaseURL: baseUrl,
  // dem: URL_CONFIG.SiChuan_TERRAIN,
  undergroundMode: true,
  minimumZoomDistance: -1000,
  drillPick: {
    enable: true,
    depth: 20,
  },
  // dem:
  //   'http://106.14.242.98:8090/iserver/services/3D-DEM/rest/realspace/datas/DEM缓存',
  layers: [
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
  ],
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
    // earth: {
    //   type: 'bing',
    //   params: {
    //     url: 'https://dev.virtualearth.net',
    //     mapStyle: Cesium.BingMapsStyle.AERIAL,
    //     key: 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
    //   },
    //   // type: 'arcgis',
    //   // params: {
    //   //   url:
    //   //     'http://36.153.213.20/GeoCMS/v1/cf/rest/services/MapService/ESRI/0f3f5490-5616-44d2-a1e4-5c664ad907fa?token=k9rELZ%2BePwRhalPbO%2FJyZWglMmTQ2x6upsVUTLlZA6KK7glHdYwd5PBbyHXLB1fMvlHXQ7yWycDBRTfq2FqaHZPdNX868fGMUsBHgINxW6fqLd4eWoGztA%3D%3D',
    //   // },
    // },
    // normal: {
    //   default: true,
    //   type: 'gaode',
    //   params: {
    //     url:
    //       'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    //   },
    //   //   type: 'tianditu',
    //   //   params: {
    //   //     mapStyle: Cesium.TiandituMapsStyle['VEC_W'],
    //   //     token: URL_CONFIG.TOKEN_TIANDITU,
    //   //   },
    // },
  },
}
