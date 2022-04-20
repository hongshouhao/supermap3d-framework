// Terrain    地形图
// MapImagery 影像图层
// S3M        三维图层
// MVT        矢量瓦片图层

export const layers = [
  {
    id: '2fasd',
    label: '北京',
    expand: true,
    virtual: false,
    icon: 'esri-icon-layers',
    children: [
      {
        id: '树',
        name: '树',
        layer: {
          type: 'S3M',
          visible: false,
          url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/Tree/config',
        },
      },
      {
        id: '地面',
        name: '地面',
        layer: {
          type: 'S3M',
          visible: false,
          url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/Ground/config',
        },
      },
      {
        id: '水面',
        name: '水面',
        layer: {
          type: 'S3M',
          visible: false,
          url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/Waters/config',
        },
      },
      {
        id: '建筑',
        name: '建筑',
        layer: {
          type: 'S3M',
          visible: false,
          url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/Building/config',
          iQuery: {
            symbol: {
              stroke: Cesium.Color.BLUE,
              strokeWidth: 2,
              fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
            },
            getData: function (p) {
              console.log(p);
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
                              [447335.887, 4429343.381, 0],
                              [447480.9854, 4429344.4174, 0],
                              [447475.3796, 4429748.2981, 0],
                              [447324.0721, 4429744.0309, 0],
                              [447335.887, 4429343.381, 0],
                            ],
                          ],
                        },
                      },
                    ],
                  },
                  attributes: {
                    a: 1,
                    b: 2,
                  },
                },
              };
            },
          },
        },
      },
      {
        id: '底图',
        name: '底图',
        layer: {
          type: 'SMIMG',
          visible: false,
          url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace/datas/beijingimg',
          iQuery: {
            symbol: {
              stroke: Cesium.Color.BLUE,
              strokeWidth: 2,
              fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
            },
            getData: function (p) {
              console.log(p);
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
                              [447335.887, 4429343.381, 1],
                              [447480.9854, 4429344.4174, 1],
                              [447475.3796, 4429748.2981, 1],
                              [447324.0721, 4429744.0309, 1],
                              [447335.887, 4429343.381, 1],
                            ],
                          ],
                        },
                      },
                    ],
                  },
                  attributes: {
                    a: 1,
                    b: 2,
                  },
                },
              };
            },
          },
        },
      },
    ],
  },
];
