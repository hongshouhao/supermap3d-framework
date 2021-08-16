//Terrain    地形图
//MapImagery 影像图层
//S3M        三维图层
//MVT        矢量瓦片图层
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
          popupTemplate: {
            getHeader: function() {
              return 'test'
            },
            getContent: function() {
              let div = document.createElement('div')
              div.innerHTML = 'test'
              return div
            },
          },
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
  // {
  //   id: '5',
  //   label: 'tttt',
  //   layer: {
  //     type: 'S3M',
  //     visible: true,
  //     url: `http://106.14.242.98:8090/iserver/services/3D-local3DCache-Dataset4965020121NewDGN/rest/realspace/datas/Dataset_496_502_012_1@NewDGN/config`,
  //   },
  // },

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
