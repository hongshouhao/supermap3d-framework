// Terrain    地形图
// MapImagery 影像图层
// S3M        三维图层
// MVT        矢量瓦片图层

import {
  popupTemplateWithDefaultUI,
  popupTemplateWithCustomUI,
} from './popupTemplate'

const baseUrl = process.env.VUE_APP_ISERVER_BASE_URL

export const layers = [
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
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/3D-XCFCFH/rest/realspace/datas/FC/config`,
          popupTemplate: popupTemplateWithDefaultUI,
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
  // {
  //   id: '5',
  //   name: '红线',
  //   layer: {
  //     type: 'SMIMG',
  //     visible: false,
  //     url: `${baseUrl}iserver/services/map-PiCiZhiTu/rest/maps/批次`,
  //   },
  // },
  {
    id: '5',
    label: '二维图层',
    expand: true,
    children: [
      {
        id: '501',
        name: '范围',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-FanWei2/restjsr/v1/vectortile/maps/范围_2`,
          popupTemplate: popupTemplateWithDefaultUI,
        },
      },
      {
        id: '502',
        name: '土地利用现状_地类图斑',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYXZDLTB2/restjsr/v1/vectortile/maps/TDLYXZ_DLTB_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '503',
        name: '土地利用现状_线状地物',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYXZXZDW2/restjsr/v1/vectortile/maps/TDLYXZ_XZDW_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },

      {
        id: '504',
        name: '林地现状',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-ZTGHLDXZ2/restjsr/v1/vectortile/maps/ZTGH_LDXZ_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '505',
        name: '重要控制线_生态保护红线',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-ZYKZXSTBHHX2/restjsr/v1/vectortile/maps/ZYKZX_STBHHX_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '506',
        name: '重要控制线_城镇开发边界',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-ZYKZXCZKFBJ2/restjsr/v1/vectortile/maps/ZYKZX_CZKFBJ_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '507',
        name: '重要控制线_工业保障线',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-ZYKZXGYBZX2/restjsr/v1/vectortile/maps/ZYKZX_GYBZX_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '508',
        name: '永久基本农田保护红线属性',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-ZYKZXYJJBNTBHHX2/restjsr/v1/vectortile/maps/ZYKZX_YJJBNTBHHX_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '509',
        name: '城镇总体规划',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-CXGHCZZTGH2/restjsr/v1/vectortile/maps/CXGH_CZZTGH_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '510',
        name: '城镇详细规划_太湖新城二期',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-CXGHCZXXGHTaiHuXinChengErQi2/restjsr/v1/vectortile/maps/CXGH_CZXXGH_太湖新城二期_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '511',
        name: '城镇详细规划_太湖新城启动区',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-CXGHCZXXGHTTaiHuXinChengQiDongQu2/restjsr/v1/vectortile/maps/CXGH_CZXXGH_T太湖新城启动区_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '512',
        name: '村镇控制区',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYZTGHCZKZQ2/restjsr/v1/vectortile/maps/TDLYZTGH_CZKZQ_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '513',
        name: '土地利用总体规划_面状重点建设项目',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYZTGHMZZDJSXM2/restjsr/v1/vectortile/maps/TDLYZTGH_MZZDJSXM_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '514',
        name: '土地用途区',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYZTGHTDYTQ/restjsr/v1/vectortile/maps/TDLYZTGH_TDYTQ_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '515',
        name: '土地利用总体规划_建设用地管制区',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDLYZTGHJSYDGZQ2/restjsr/v1/vectortile/maps/TDLYZTGH_JSYDGZQ_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '516',
        name: '土地管理_征地批次',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDGLBPPCYW2/restjsr/v1/vectortile/maps/TDGL_BPPC_YW_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '517',
        name: '土地管理_供地地块',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDGLGDCRYW2/restjsr/v1/vectortile/maps/TDGL_GDCR_YW_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '518',
        name: '土地管理_土地收回',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDGLTDSHYW2/restjsr/v1/vectortile/maps/TDGL_TDSH_YW_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '519',
        name: '土地管理_临时用地',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDGLLSYDYW2/restjsr/v1/vectortile/maps/TDGL_LSYD_YW_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
      {
        id: '520',
        name: '土地管理_设施农用地',
        layer: {
          type: 'MVT',
          visible: false,
          enableFillAndWireFrame: true,
          url: `${baseUrl}iserver/services/map-mvt-TDGLSSNYD2/restjsr/v1/vectortile/maps/TDGL_SSNYD_2`,
          popupTemplate: popupTemplateWithCustomUI,
        },
      },
    ],
  },
  // {
  //   id: '6',
  //   name: 'TESTMVT',
  //   layer: {
  //     type: 'MVT',
  //     visible: false,
  //     url: `${baseUrl}iserver/services/map-mvt-FanWei2/restjsr/v1/vectortile/maps/范围_2`,
  //   },
  // },
  // {
  //   id: '6',
  //   name: '范围',
  //   layer: {
  //     type: 'MVT',
  //     visible: false,
  //     url: `${baseUrl}iserver/services/map-mvt-FanWei1/rest`
  //   }
  // }
]
