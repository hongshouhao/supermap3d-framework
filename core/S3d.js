// import ElementUI from 'element-ui'
// import VueiClient from '@supermap/vue-iclient3d-webgl'
import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './css/arcgis/themes/light/main.css'
import './css/index.scss'

import Toolbar from './tools/Toolbar'

import EventBus from 'eventbusjs'
import ViewUtility from './utils/ViewUtility'
import PickingUtility from './utils/PickingUtility'
import CameraUtility from './utils/CameraUtility'
import DebugUtility from './utils/DebugUtility'
import { lonLatToCartesian } from './utils/CesiumMath'
import { isS3mFeature, isCartesian3 } from './utils/IfUtility'
import { setCursorStyle, resetCursorStyle } from './utils/CursorUtility'
import { isImageryLayer } from './utils/ImageryUtility'

import SketchTool from './tools/Sketch/SketchTool'
import LayersRenderer from './component/LayersRenderer'
// import './materials'

export default class S3d {
  constructor(config) {
    if (!config.iServerBaseURL) throw '参数不能为空: iServerBaseURL'
    if (!config.layers) throw '参数不能为空: layers'
    if (!config.defaultCamera) throw '参数不能为空: defaultCamera'
    // if (!config.baseMaps.earth) throw '参数不能为空: baseMaps.earth'
    // if (!config.baseMaps.normal) throw '参数不能为空: baseMaps.normal'

    this.config = config
    this.toolbar = new Toolbar()
    this.eventBus = EventBus
    this.viewer = null
    this.scene = null

    this._setLabel()
    // this._loadCustomMaterials()
  }

  setViewer(viewer) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.viewUtility = new ViewUtility(viewer)
    this.cameraUtility = new CameraUtility(viewer)
    this.debugUtility = new DebugUtility(viewer)
    this.pickingUtility = new PickingUtility(viewer.scene)
    this.sketchTool = new SketchTool(viewer)
    this.layersRenderer = new LayersRenderer(viewer)
  }

  setCursor(className) {
    this.viewer.enableCursorStyle = false
    setCursorStyle(className)
  }
  resetCursor() {
    this.viewer.enableCursorStyle = true
    resetCursorStyle()
  }

  _loadCustomMaterials() {
    Cesium.Material._materialCache.addMaterial(
      Cesium.Material.PolylineTrailLinkType,
      {
        fabric: {
          type: Cesium.Material.PolylineTrailLinkType,
          uniforms: {
            color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: -20,
          },
          source: Cesium.Material.PolylineTrailLinkSource,
        },
        // eslint-disable-next-line no-unused-vars
        translucent: function(material) {
          return true
        },
      }
    )
  }
  _setLabel() {
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
    setLabel(this.config.layers, nameList)

    for (let key in nameList) {
      if (nameList[key] > 1) {
        throw `图层配置错误: 图层名(${key})重复`
      }
    }
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
      throw '不支持的参数类型'
    }
  }
  _setLayerVisible(layer, visible) {
    if (isImageryLayer(layer.type) || layer.type === 'MVT') {
      layer.show = visible
      this.eventBus.dispatch('layer-visible-changed', this, layer)
    } else if (layer.type === 'S3M') {
      layer.visible = visible
      if (!visible) {
        if (layer.config.renderer) {
          this.layersRenderer.stopRender(layer.name)
        }
      }
      this.eventBus.dispatch('layer-visible-changed', this, layer)
    }
  }
  _getDefaultDataUrl(layer) {
    let url = `${layer._baseUri.scheme}://${layer._baseUri.authority}${layer._baseUri.path}`
    let parts = url.split('/rest/realspace/')
    url = parts[0] + '/rest/data/featureResults.json?returnContent=true'
    return url.replace('/iserver/services/3D-', '/iserver/services/data-')
  }
  _query(dataUrl, datasetName, sql, ids) {
    let queryParameter = null
    if (sql && sql.length > 0) {
      queryParameter = {
        datasetNames: [datasetName],
        getFeatureMode: 'SQL',
        queryParameter: {
          attributeFilter: sql,
        },
      }
    } else if (ids instanceof Array && ids.length > 0) {
      queryParameter = {
        datasetNames: [datasetName],
        getFeatureMode: 'ID',
        ids: ids,
      }
    } else {
      throw '暂不支持此查询'
    }
    return axios.post(dataUrl, queryParameter)
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
    this._setLayerVisible(ly, visible)
  }
  setLayerOpacity(layer, opacity) {
    if (layer && isImageryLayer(layer.type)) {
      layer.alpha = opacity / 100
    } else if (layer && layer.type === 'S3M') {
      layer.style3D.fillForeColor = new Cesium.Color(
        1.0,
        1.0,
        1.0,
        opacity / 100
      )
    }
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
    let dataUrl = ''
    if (lconfig.dataUrl) {
      dataUrl = lconfig.dataUrl
    } else {
      let layer = this.getLayer(params.layer)
      dataUrl = this._getDefaultDataUrl(layer)
    }
    return this._query(dataUrl, lconfig.datasetName, params.sql, params.ids)
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
          this._setLayerVisible(layer, true)
          layer.setSelection([feature.ID])

          this.cameraUtility.flyToS3mFeatures([feature]).then(() => {
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
        return this.cameraUtility.flyToPoints(pts)
      } else if (isCartesian3(sample)) {
        return this.cameraUtility.flyToPoints(params)
      } else if (isS3mFeature(sample)) {
        return this.cameraUtility.flyToS3mFeatures(params)
      }
    } else if (isCartesian3(params)) {
      return this.cameraUtility.flyToPoints([params])
    } else if (isS3mFeature(params)) {
      return this.cameraUtility.flyToS3mFeatures([params])
    }
  }
  flyToLayer(layer) {
    if (layer.type === 'MVT') {
      let bounds = layer.rectangle
      this.viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromRadians(
          (bounds.east + bounds.west) * 0.5,
          (bounds.north + bounds.south) * 0.5,
          10000
        ),
        orientation: {
          heading: 0,
          roll: 0,
          pitch: -1.57,
        },
        duration: 2,
      })
    } else {
      if (layer) {
        this.viewer.flyTo(layer)
      } else {
        throw '无法定位图层, 图层可能加载失败'
      }
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
      return _this.cameraUtility.flyToS3mFeatures(features)
    }
    if (params.layer && (params.ids || params.sql)) {
      return this.query(params).then((response) => {
        return fly(response.data.features)
      })
    } else if (params.layer && params.features) {
      return fly(params.features)
    }
  }

  pick(mousePosition) {
    let pickedObjects = []
    if (this.config.drillPick?.enable) {
      pickedObjects = this.pickingUtility.drillPickByDepth(
        mousePosition,
        this.config.drillPick.depth ?? 0.5
      )
    } else {
      let pobj = this.scene.pick(mousePosition, 3)
      if (pobj && pobj.primitive && typeof pobj.id === 'string') {
        pickedObjects.push(pobj)
      }
    }

    return pickedObjects
  }
}
