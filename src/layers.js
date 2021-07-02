//Terrain    地形图
//MapImagery 影像图层
//S3M        三维图层
//MVT        矢量瓦片图层
export const layers = [
  {
    id: '0',
    label: '分层分户',
    display: false,
    expand: true,
    layer: {
      type: 'S3M',
      visible: false,
      enableFillAndWireFrame: true,
      url:
        'http://106.14.242.98:8090/iserver/services/3D-XCFCFH/rest/realspace',
    },
  },
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
          layerName: 'FC',
        },
      },
      {
        id: '22',
        label: '分户',
        layer: {
          type: 'S3M',
          visible: false,
          layerName: 'FH',
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
      url: 'http://106.14.242.98:8090/iserver/services/3D-XCGX/rest/realspace',
    },
  },
  {
    id: '4',
    label: '楼幢',
    layer: {
      type: 'S3M',
      visible: true,
      url:
        'http://106.14.242.98:8090/iserver/services/3D-XCJZDT/rest/realspace',
    },
  },

  // {
  //   id: '1',
  //   label: '太湖新城',
  //   children: [
  //     {
  //       id: '11',
  //       label: '白色塑膜',
  //       layer: {
  //         type: 'S3M',
  //         visible: true,
  //         url:
  //           'http://106.14.242.98:8090/iserver/services/3D-XCBM/rest/realspace',
  //       },
  //     },
  //   ],
  // },
  // {
  //   id: '2',
  //   label: '地下管线',
  //   layer: {
  //     type: 'S3M',
  //     visible: false,
  //     url: 'http://106.14.242.98:8090/iserver/services/3D-DXGX/rest/realspace',
  //   },
  // },
]
