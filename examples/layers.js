// Terrain    地形图
// MapImagery 影像图层
// S3M        三维图层
// MVT        矢量瓦片图层

import {} from './popupTemplate'

export const layers = [
  {
    id: '1000',
    name: '东沙湖-单元线',
    layer: {
      type: 'MVT',
      visible: false,
      url: `http://localhost:8090/iserver/services/map-mvt-DengJiDanYuanXianDSH4490/restjsr/v1/vectortile/maps/登记单元线%40DSH4490`,
    },
  },
  {
    id: '23',
    name: '倾斜',
    layer: {
      type: 'S3M',
      visible: false,
      url: `http://localhost:8090/iserver/services/3D-local3DCache-szgx4490/rest/realspace/datas/Config_3/config`,
    },
  },
  {
    id: '2a7',
    name: '东沙湖',
    layer: {
      type: 'S3M',
      visible: false,
      url: `http://localhost:8090/iserver/services/3D-DSH/rest/realspace/datas/DSHPZ/config`,
    },
  },
  {
    id: '2a72',
    name: '东沙湖-DEM',
    layer: {
      type: 'DEM',
      visible: false,
      url: `http://localhost:8090/iserver/services/3D-CaiJianHouFanWei0713_1_1ZZ-DEM/rest/realspace/datas/%E8%A3%81%E5%89%AA%E5%90%8E%E8%8C%83%E5%9B%B40713_1_1%40DEM_Terrain`,
    },
  },
  {
    id: '2asda72',
    name: '东沙湖-倾斜',
    layer: {
      type: 'S3M',
      visible: false,
      url: `http://localhost:8090/iserver/services/3D-ShuiMian_3D-shuimian/rest/realspace/datas/%E6%B0%B4%E9%9D%A2_3D@shuimian/config`,
    },
  },
]
