import Element from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'
import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './assets/themes/light/main.css'
import './css/index.scss'

import { lonLatToCartesian } from './utils/CesiumMath'
import Toolbar from './tools/Toolbar'
import EventBus from 'eventbusjs'
import ViewUtility from './utils/ViewUtility'
import { setVisible } from './utils/LayerUtility'
import { isS3mFeature, isCartesian3 } from './utils/IfUtility'

export function setup(vue) {
  vue.use(Element)
  vue.use(VueiClient)
}

export function init(config) {
  window.s3d = new S3d(config)
}

class S3d {
  constructor(config) {
    if (!config.iServerBaseURL) throw '参数不能为空: iServerBaseURL'
    if (!config.layers) throw '参数不能为空: layers'
    if (!config.defaultCamera) throw '参数不能为空: defaultCamera'
    if (!config.baseMaps.earth) throw '参数不能为空: baseMaps.earth'
    if (!config.baseMaps.normal) throw '参数不能为空: baseMaps.normal'

    this.config = config
    this.toolbar = new Toolbar()
    this.eventBus = EventBus
    this.viewer = null
    this.scene = null

    let setLabel = function(layers, nameList) {
      for (let ln of layers) {
        if (ln.layer) {
          if (!ln.name) {
            throw `图层配置错误: "name"属性缺失\n错误节点: ${JSON.stringify(
              ln
            )}`
          } else {
            if (nameList[ln.name]) {
              nameList[ln.name] = nameList[ln.name] + 1
            } else {
              nameList[ln.name] = 1
            }
            if (!ln.label) {
              ln.label = ln.name
            }
          }
        } else if (ln.children) {
          setLabel(ln.children, nameList)
        }
      }
    }
    let nameList = {}
    setLabel(config.layers, nameList)

    for (let key in nameList) {
      if (nameList[key] > 1) {
        throw `图层配置错误: 图层名(${key})重复`
      }
    }
  }

  setViewer(viewer) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.viewUtility = new ViewUtility(viewer)
  }

  _getLayerNode(params) {
    let getLayerNode = function(layers, predicate) {
      for (let lyConfig of layers) {
        if (lyConfig.layer) {
          if (predicate(lyConfig)) {
            return lyConfig
          }
        } else if (lyConfig.children) {
          let result = getLayerNode(lyConfig.children, predicate)
          if (result) {
            return result
          }
        }
      }
    }

    if (typeof params === 'function') {
      return getLayerNode(this.config.layers, params)
    } else if (typeof params === 'string') {
      return getLayerNode(this.config.layers, (x) => x.name === params)
    } else {
      throw '暂不支持'
    }
  }

  getLayerConfig(params) {
    let lnode = this._getLayerNode(params)
    if (lnode) {
      return lnode.layer
    }
  }

  getLayer(params) {
    let lnode = this._getLayerNode(params)
    if (lnode) {
      return lnode.cesiumLayer
    }
  }

  getAllLayers(predicate) {
    let getLayerNode = function(layers, list) {
      for (let lyConfig of layers) {
        if (lyConfig.layer && lyConfig.cesiumLayer) {
          if (predicate(lyConfig.cesiumLayer)) {
            list.push(lyConfig.cesiumLayer)
          }
        } else if (lyConfig.children) {
          let ln = getLayerNode(lyConfig.children, list)
          if (ln) {
            list.push(ln.cesiumLayer)
          }
        }
      }
    }

    let list = []
    getLayerNode(this.config.layers, list)
    return list
  }

  setLayerVisible(layer, visible) {
    let ly = this.getLayer(layer)
    setVisible(ly, visible)
  }

  /*
  params: {
    layer: ""
    sql: "",   (二选一)
    ids:[] (二选一)
  }
  */
  query(params) {
    let lconfig = this.getLayerConfig(params.layer)
    if (!lconfig.datasetName) {
      throw `图层(${params.layer})配置错误: "datasetName"为空`
    }

    let dataURL = ''
    if (lconfig.dataURL) {
      dataURL = lconfig.dataURL
    } else {
      let layer = this.getLayer(params.layer)
      let url = `${layer._baseUri.scheme}://${layer._baseUri.authority}${layer._baseUri.path}`
      let parts = url.split('/rest/realspace/')
      url = parts[0] + '/rest/data/featureResults.json?returnContent=true'
      dataURL = url.replace('/iserver/services/3D-', '/iserver/services/data-')
    }

    let queryParameter = null
    if (params.sql && params.sql.length > 0) {
      queryParameter = {
        datasetNames: [lconfig.datasetName],
        getFeatureMode: 'SQL',
        queryParameter: {
          attributeFilter: params.sql,
        },
      }
    } else if (params.ids instanceof Array && params.ids.length > 0) {
      queryParameter = {
        datasetNames: [lconfig.datasetName],
        getFeatureMode: 'ID',
        ids: params.ids,
      }
    } else {
      throw '暂不支持此查询'
    }
    return axios.post(dataURL, queryParameter)
  }

  /* 
  data结构
  {
    object: {
      id(可空),
      sql(可空),
      layer,
    },
    position: {
      longitude,
      latitude,
      height(可空),
      },
  }
  */
  openPopup(data) {
    if (data.position) {
      let worldPosition = lonLatToCartesian(
        data.position.longitude,
        data.position.latitude,
        data.position.height
      )
      this.popup.renderPopup(worldPosition, data)
    } else if (data.object.id || data.object.sql) {
      this.query({
        layer: data.object.layer,
        sql: data.object.sql,
        ids: [data.object.id],
      }).then((response) => {
        if (response.data.features.length > 0) {
          let feature = response.data.features[0]

          let dobj = this.popup.$data.popupUtility.convertS3mFeatureToDataObject(
            data.object.layer,
            feature
          )
          let layer = this.getLayer(data.object.layer)
          setVisible(layer, true)
          layer.setSelection([feature.ID])

          this.viewUtility.flyToS3mFeatures([feature]).then(() => {
            let worldPosition = lonLatToCartesian(
              feature.geometry.position.x,
              feature.geometry.position.y,
              feature.geometry.position.z
            )
            this.popup.renderPopup(worldPosition, dobj)
          })
        }
      })
    }
  }

  closePopup() {
    this.popup.hidePopup()
  }

  /*
  params参数
  1. double数组: 经度、纬度数组或者经度、纬度、高度数组
  2. 单个Cartesian3对象或数组
  3. 单个S3mFeature或数组
  4. {
       layer,
       ids,
       sql
     }
   */
  flyTo(params) {
    if (params instanceof Array && params.length > 0) {
      let sample = params[0]
      if (typeof sample === 'number') {
        let pts = null
        if (params.length % 2 === 0) {
          pts = Cesium.Cartesian3.fromDegreesArray(params)
        } else if (params.length % 3 === 0) {
          pts = Cesium.Cartesian3.fromDegreesArrayHeights(params)
        } else {
          throw '参数错误'
        }
        return this.viewUtility.flyToPoints(pts)
      } else if (isCartesian3(sample)) {
        return this.viewUtility.flyToPoints(params)
      } else if (isS3mFeature(sample)) {
        return this.viewUtility.flyToS3mFeatures(params)
      }
    } else if (isCartesian3(params)) {
      return this.viewUtility.flyToPoints([params])
    } else if (isS3mFeature(params)) {
      return this.viewUtility.flyToS3mFeatures([params])
    }
  }

  /*
  params: {
    layer: ""
    sql: "",   (可选)
    ids:[] ,(可选)
    features:[] ,(可选)
  }
  */
  flyToS3mFeatures(params) {
    let _this = this
    let fly = function(features) {
      let ids = features.map((x) => x.ID)
      _this.getLayer(params.layer).setSelection(ids)
      return _this.viewUtility.flyToS3mFeatures(features)
    }
    if (params.layer && (params.ids || params.sql)) {
      return this.query(params).then((response) => {
        return fly(response.data.features)
      })
    } else if (params.layer && params.features) {
      return fly(params.features)
      // let ids = params.features.map((x) => x.ID)
      // this.getLayer(params.layer).setSelection(ids)
      // return this.viewUtility.flyToS3mFeatures(response.data.features)
    }
  }
}
