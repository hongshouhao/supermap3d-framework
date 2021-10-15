
超图文档地址: http://support.supermap.com.cn:8090/webgl/docs/Documentation/index.html

serialize-javascript



```javascript
/* eslint-disable no-unused-vars */

export default {
  iServerBaseURL: 'http://localhost/',
  //DEM地址，可空
  dem: 'http://localhost/realspace/services/3D-dem/rest/realspace/datas/DEM',
  //开启地下模式
  undergroundMode: true,
  //相机位置允许的最小距离，负数表示允许相机在地下，绝对值越大说明相机位置允许距离地表越远
  minimumZoomDistance: -1000,
  //穿透拾取，开启后可以拾取被遮挡要素，并返回所有符合要求的要素
  //计算拾取射线与所有模型的交点，计算最靠近相机的点与其他交点的距离，筛选出小于穿透深度的要素
  drillPick: {
    //是否启用
    enable: true,
    //穿透深度
    depth: 20,
  },
  //图层配置，在ElementUI树控件数据结构上扩展自定义数据
  layers: [
    {
      id: '1',
      //图层名，不可空
      name: 'DEM',
      //显示名，可空，默认与name属性相同
      label: 'DEM',
      //图层参数
      layer: {
        //DEM图层
        type: 'DEM',
        //默认是否开启图层
        visible: false,
        url:
          'http://localhost/iserver/services/3D-DEM/rest/realspace/datas/DEM',
        //默认DEM有裙边，地下模式事影响效果，所以使用DEM为0的数据替换默认DEM数据，可空
        url0:
          'http://localhost/iserver/services/3D-DEM0/rest/realspace/datas/DEM0',
      },
    },
    {
      id: '2',
      //父节点label不可为空
      label: '分类测试',
      //默认是否展开
      expand: true,
      //节点图标
      icon: 'esri-icon-layers',
      children: [
        {
          id: '21',
          name: '测试S3M图层',
          layer: {
            //三维模型图层
            type: 'S3M',
            visible: true,
            //模型是否描边，绘制出轮廓线
            enableFillAndWireFrame: true,
            //模型选中颜色，可空
            selectColorType: Cesium.SelectColorType.REPLACE,
            url:
              'http://localhost/iserver/services/3D-S3M/rest/realspace/datas/test/config',
            //数据查询时需要此参数
            datasetName: '模型1:BackUp_TarDataset_1',
            //当数据服务，可空，非默认地址时需要使用此配置
            dataUrl:
              'http://localhost/iserver/services/dataSM/rest/data/featureResults.json?returnContent=true',
            popupTemplate: {
              //返回标题
              getHeader: function(data) {
                return data.object.layer + 'test'
              },
              //返回页面内容
              //使用自定义UI：返回DOM即可
              //使用默认UI：返回[{key,value}]
              getContent: function(data) {
                let div = document.createElement('div')
                div.innerHTML = data.object.layer
                return div
              },
            },
            //字段筛选，当使用默认UI时，可使用此配置过滤不想展示的数据
            outFields: ['*'],
          },
        },
        {
          id: '29',
          name: '测试MVT图层',
          layer: {
            //二维矢量瓦片图层
            type: 'MVT',
            visible: false,
            url:
              'http://localhost/iserver/services/map-mvt-矢量/restjsr/v1/vectortile/maps/矢量',
          },
        },
      ],
    },
    {
      id: '32',
      name: '测试管线图层',
      layer: {
        type: 'S3M',
        visible: false,
        enableFillAndWireFrame: true,
        url:
          'http://localhost/iserver/services/3D-管线/rest/realspace/datas/管线/config',
        datasetName: '污水:污水_1',
        outFields: ['*'],
        //渲染方式，目前只有管线流向
        renderer: {
          //渲染类型，使用S3M图层作为另一个图层的渲染
          type: 'S3MLAYER',
          //S3M图层参数
          layer: {
            url:
              'http://localhost/iserver/services/3D-test/rest/realspace/datas/WS_LINE_4_1@污水1/config',
            //流向、流速配置
            textureUVSpeed: new Cesium.Cartesian2(-0.5, 0),
          },
        },
      },
    },
    {
      id: '36',
      name: '测试栅格图层',
      layer: {
        //栅格图层类型，另外还有"ARCGISEXIMG"和"ARCGISIMG"
        //ARCGISEXIMG：坐标系为4490或3857的arcgis图层
        //ARCGISIMG：其他坐标系的arcgis图层
        //SMIMG：超图图层
        type: 'SMIMG',
        visible: false,
        //图层地址
        url:
          'http://localhost/iserver/services/3D-测试/rest/realspace/datas/测试',
        //i查询配置
        iQuery: {
          //图形渲染样式
          symbol: {
            //轮廓线颜色
            stroke: Cesium.Color.fromCssColorString('#FF0000'),
            //填充色
            fill: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.3),
            //轮廓线宽度
            strokeWidth: 1,
          },
          //数据查询服务，服务必须使用GET，且最终lon、lat、height会作为url参数传递给服务端
          //默认需要返回固定结构，见文档下面
          dataUrl: 'http://localhost:9864/cad-connect-test',
          //如果上述dataUrl数据服务返回数据结构与SDK不符，可使用transform函数处理，最终返回目标结构数据,
          //入参 data：dataUrl返回数据
          transform: function(data) {
            return {
              object: {
                //要素id，此处id不作强制要求，SDK内部不使用此处id
                id: 1,
                //只支持GeoJson
                shape: data.shape,
                //其他属性
                attributes: {
                  a: data.a,
                  b: data.b,
                },
              },
            }
          },
          //使用position查询自定义服务，返回符合目标结构的数据
          //入参position：{longitude, latitude, height}
          //注：如果配置getData函数，则优先使用getData函数，否则使用dataUrl请求数据，
          //    如果配置了transform函数，则会调用transform函数处理dataUrl返回的数据
          getData: function(position) {
            return {
              object: {
                id: 1,
                shape: {},
                attributes: {
                  a: 1,
                  b: 2,
                },
              },
            }
          },
        },
      },
    },
  ],
  //默认相机配置
  defaultCamera: {
    //相机位置
    destination: {
      x: -2778295.607780161,
      y: 4697279.964957479,
      z: 3301873.5146833723,
    },
    //相机姿势
    orientation: {
      heading: 0.027587479922354774,
      pitch: -0.5169824822585825,
      roll: 6.283185307179586,
    },
    duration: 2,
  },
  //底图
  baseMaps: {
    //全黑模式，类似CAD模式
    none: {
      //是否启用
      enable: true,
      //是否作为默认底图
      default: false,
    },
    //影响底图
    earth: {
      maps:[
        {
          //可选类型：bing, tianditu, gaode, arcgis, arcgisex, supermap, custom
          //具体参数参考超图文档：
          //bing: BingMapsImageryProvider
          //tianditu: TiandituImageryProvider
          //gaode: UrlTemplateImageryProvider
          //arcgis: ArcGisMapServerImageryProvider
          //arcgisex: CGCS2000MapServerImageryProvider
          //supermap: SuperMapImageryProvider
          //custom: TileMapServiceImageryProvider
          type: 'bing',
          params: {
            url: 'https://dev.virtualearth.net',
            mapStyle: 'Aerial',
            key: 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh',
          },
        }
      ]
    },
    //普通电子底图
    normal: {
      default: true,
      maps: [
        {
          //高德
          type: 'gaode',
          params: {
            url:
              'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
          },
        },
        //{
          //   type: 'tianditu',
          //   params: {
          //     mapStyle: Cesium.TiandituMapsStyle['VEC_W'],
          //     token: URL_CONFIG.TOKEN_TIANDITU,
          //   },
        //}
      ]
    },
  },
}
```
