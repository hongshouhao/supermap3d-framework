<template>
  <div v-show="popupVisible"
       ref="popup"
       class="my-popup esri-component esri-popup esri-popup--aligned-top-center esri-popup--shadow">
    <div class="esri-popup__main-container esri-widget esri-popup--is-collapsible">
      <header class="esri-popup__header">
        <div class="multi-header">
          <el-select v-show="multiable"
                     v-model="objIndex"
                     @change="_reRenderPopup"
                     placeholder="请选择">
            <el-option v-for="(title, idx) in objTitles"
                       :key="idx"
                       :label="title"
                       :value="idx">
            </el-option>
          </el-select>
        </div>
        <h2 v-show="!multiable"
            class="esri-widget__heading esri-popup__header-title">
          {{ title }}
        </h2>
        <div class="esri-popup__header-buttons">
          <div title="停靠"
               class="esri-popup__button esri-popup__button--dock"
               @click="dock">
            <span ref="dockIcon"
                  class="esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"></span>
          </div>
          <div title="关闭"
               class="esri-popup__button"
               @click="hidePopup">
            <span class="esri-popup__icon esri-icon-close"></span>
          </div>
        </div>
      </header>
      <article class="esri-popup__content">
        <PropertyGrid v-show="showPropGrid"
                      :propArray="propArray" />
        <div v-show="!showPropGrid"
             ref="content"></div>
      </article>
    </div>
    <div ref="popupPointer"
         class="esri-popup__pointer">
      <div class="esri-popup__pointer-direction esri-popup--shadow"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Enumerable from 'linq'
import { cartesianToLonlat } from '../utils/CesiumMath'
import PropertyGrid from './PropertyGrid.vue'
import PopupUtility from './PopupUtility.js'
import { isImageryLayer } from '../utils/ImageryUtility'

export default {
  data () {
    return {
      propArray: [],
      title: '',
      multiable: false,
      objIndex: null,
      objTitles: [],
      dataObjs: [],
      dockered: false,
      popupVisible: false,
      showPropGrid: true,
    }
  },
  components: {
    PropertyGrid,
  },
  props: [],
  mounted () {
    this.popupUtility = new PopupUtility()
    this.initIQuery()
    this.initIQueryForMVT()
  },
  methods: {
    initIQuery () {
      let _this = this
      this.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(
        _this.$viewer.scene.canvas
      )
      this.mouseEventHandler.setInputAction(function (e) {
        let position = _this.$viewer.scene.pickPosition(e.position)
        if (!window.s3d.toolWorking) {
          if (_this.mvtData) {
            _this.renderPopup(position, _this.mvtData)
          } else {
            let pickedObjects = window.s3d.pick(e.position)
            if (pickedObjects.length === 0) {
              let unslctableLayers = window.s3d.getAllLayers(
                (x) => {
                  return (isImageryLayer(x.type)
                    // || (x.type === "3DTILES" && x.config.selectable === false)
                    // || (x.type === "S3M" && x.config.selectable === false))
                    || (x.type === "3DTILES")
                    || (x.type === "S3M"))
                    && (x.show || x.visible)
                    && x.config?.iQuery
                }
              )
              unslctableLayers.sort((l1, l2) => {
                if (!l1.config.iQuery.priority) {
                  l1.config.iQuery.priority = -9999
                }
                if (!l2.config.iQuery.priority) {
                  l2.config.iQuery.priority = -9999
                }

                return l2.config.iQuery.priority - l1.config.iQuery.priority
              })
              if (unslctableLayers.length > 0) {
                let position = _this.$viewer.scene.pickPosition(e.position)
                let lonlat = cartesianToLonlat(position)
                let promises = unslctableLayers.map((l) => {
                  return _this.popupUtility
                    .queryOverUnselectableLayer(l.name, lonlat)
                    .then((dobj) => {
                      if (dobj) {
                        dobj.object.layer = l.name
                        if (!dobj.position) {
                          dobj.position = lonlat
                        }
                        return dobj
                      }
                      else {
                        return null
                      }
                    })
                })

                Promise.all(promises).then((data) => {
                  let notNull = data.filter(x => x)
                  if (notNull.length > 0) {
                    _this.renderPopupMulti(position, notNull)
                  }
                  else {
                    _this._clearTempDataSources()
                    _this.hidePopup()
                  }
                })
              } else {
                _this._clearTempDataSources()
                _this.hidePopup()
              }
            } else {
              let calls = pickedObjects.map((x) => {
                if (x.primitive.config?.iQuery) {
                  let lname = x.primitive.config.name
                  let lonlat = cartesianToLonlat(position)
                  return _this.popupUtility
                    .queryOverUnselectableLayer(lname, lonlat)
                    .then((dobj) => {
                      if (dobj) {
                        dobj.object.layer = lname
                        if (!dobj.position) {
                          dobj.position = lonlat
                        }
                        return dobj
                      }
                      else {
                        return null
                      }
                    })
                }
                else {
                  return _this.popupUtility.getDataForPrimitive(x)
                }
              })
              Promise.all(calls)
                .then((data) => {
                  if (data.length > 0) {
                    for (let dobj of data) {
                      if (!dobj.position) {
                        dobj.position = cartesianToLonlat(position)
                      }
                    }
                    _this.renderPopupMulti(position, data)
                  }
                  else {
                    _this._clearTempDataSources()
                    _this.hidePopup()
                  }
                })
                .catch((err) => {
                  _this.hidePopup()
                  console.error(err)
                })
            }
          }
        } else {
          _this.hidePopup()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    initIQueryForMVT () {
      let _this = this
      _this.$viewer.selectedEntityChanged.addEventListener(function (entity) {
        if (window.s3d.toolWorking) {
          _this.mvtData = null
          return
        }
        if (entity && entity.pickResult) {
          let layerName = entity.pickResult.mapName
          let features = entity.pickResult[entity.pickResult['layerID']]
          let fItem = features.find(
            (x) => x.feature.id === entity.pickResult.featureID
          )
          _this.mvtData = _this.popupUtility.getDataForMVT(
            layerName,
            fItem.feature
          )
        } else {
          _this.mvtData = null
        }
      })
    },
    hidePopup () {
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler()
        this.removePostRenderHandler = null
      }
      this.popupVisible = false
    },
    renderPopupMulti (worldPosition, data) {
      this.multiable = data.length > 1
      this.dataObjs = data
      this.objTitles = data.map((x) => this._getPopupHeader(x))
      this.objIndex = 0
      this._reRenderPopup()
      this._showPopup(worldPosition)
    },
    renderPopup (worldPosition, data) {
      this.multiable = false
      this._setHeader(this._getPopupHeader(data))
      this._setContent(this._getPopupContent(data))
      this._showPopup(worldPosition)
    },
    _showPopup (worldPosition) {
      this.popupPosition = worldPosition
      this.popupVisible = true
      if (!this.dockered) {
        this._enableStickRender()
      }
    },
    _reRenderPopup () {
      let obj = this.dataObjs[this.objIndex]
      let header = this._getPopupHeader(obj)
      this._setHeader(header)
      this._setContent(this._getPopupContent(obj))
      this._highlight(obj)
      $('.my-popup .multi-header input').css('width', this._textWidth(header))
    },
    _highlight (obj) {
      let _this = this
      let grps = Enumerable.from(this.dataObjs)
        .groupBy((x) => x.object.layer)
        .toArray()
      for (let g of grps) {
        let ly = window.s3d.getLayer(g.key())
        if (ly.type === 'S3M') {
          ly.setSelection([])
        }
      }
      this._clearTempDataSources()
      let ly = window.s3d.getLayer(obj.object.layer)
      if (ly.type === 'S3M' && (typeof ly.config.selectable === 'undefined' || ly.config.selectable === true)) {
        ly.setSelection([obj.object.id])
      } else if (isImageryLayer(ly.type)
        || (ly.type === "3DTILES" && ly.config.selectable === false)
        || (ly.type === "S3M" && ly.config.selectable === false)
      ) {
        ////方案1
        // let opt = ly.config.iQuery.symbol ?? {
        //   fill: Cesium.Color.RED.withAlpha(0.3),
        //   stroke: Cesium.Color.BLUE,
        //   strokeWidth: 3,
        //   clampToGround: true,
        // }
        // Cesium.GeoJsonDataSource.load(obj.object.shape, opt).then((ds) => {
        //   debugger
        //   ds.name = `temp_iquery_geometries_${ly.name}`
        //   _this.$viewer.dataSources.add(ds)
        // })

        //方案2
        Cesium.GeoJsonDataSource.load(obj.object.shape).then((ds) => {
          let dataSource = new Cesium.CustomDataSource(`temp_iquery_geometries_${ly.name}`)
          for (let ent of ds.entities.values) {
            let newEnt = null;
            if (ent.polyline) {
              newEnt = {
                polyline: {
                  positions: ent.polyline.positions._value,
                },
              }

              let symbol = ly.config.iQuery.symbol ?? {
                material: Cesium.Color.RED,
                width: 2.0
              }
              Object.assign(newEnt.polyline, symbol)
            }
            else if (ent.polygon) {
              let hierarchy = ent.polygon.hierarchy.getValue()
              newEnt = {
                polygon: {
                  hierarchy: {
                    positions: hierarchy.positions,
                    holes: hierarchy.holes
                  },
                  height: 10,
                  outline: true,
                  outlineColor: Cesium.Color.RED,
                  outlineWidth: 2.0,
                  material: Cesium.Color.BLUE.withAlpha(0.5),
                  classificationType: Cesium.ClassificationType.BOTH
                }
              }

              let symbol = ly.config.iQuery.symbol ?? {
                material: Cesium.Color.RED.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 2.0
              }
              Object.assign(newEnt.polygon, symbol)
            }
            dataSource.entities.add(newEnt)
          }
          ds.entities.removeAll()
          _this.$viewer.dataSources.add(dataSource)
        })
      }
    },
    _clearTempDataSources () {
      for (let i = 0; i < this.$viewer.dataSources.length; i++) {
        let ds = this.$viewer.dataSources.get(i)
        if (ds.name.startsWith('temp_iquery_geometries_')) {
          ds.entities.removeAll()
          this.$viewer.dataSources.remove(ds, true)
        }
      }
    },
    _enableStickRender () {
      if (this.removePostRenderHandler) {
        return
      }
      let _this = this
      this.removePostRenderHandler = this.$viewer.scene.postRender.addEventListener(
        function () {
          let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            _this.$viewer.scene,
            _this.popupPosition
          )
          let popupDom = _this.$refs.popup
          let left = screenPosition.x - popupDom.offsetWidth / 2
          let top = screenPosition.y - popupDom.offsetHeight - 30

          if (
            left < 0 ||
            top > _this.$viewer.scene.canvas.height - popupDom.offsetHeight ||
            left > _this.$viewer.scene.canvas.width - popupDom.offsetWidth
          ) {
            _this._setPopupStyle(true)
          } else if (top < 0) {
            top = screenPosition.y + 10

            if (top - 30 < 0) {
              _this._setPopupStyle(true)
            } else {
              _this._setPopupStyle(false)
              _this.$refs.popupPointer.style.top = '0'
              popupDom.style.left = left + 'px'
              popupDom.style.top = top + 'px'
            }
          } else {
            _this._setPopupStyle(false)
            popupDom.style.left = left + 'px'
            popupDom.style.top = top + 'px'
            _this.$refs.popupPointer.style.top = '100%'
          }
        }
      )
    },
    _setPopupStyle (enableDockStyle) {
      if (enableDockStyle) {
        this.$refs.popup.style.top = '60px'
        this.$refs.popup.style.right = '15px'
        this.$refs.popup.style.left = 'unset'
        this.$refs.popupPointer.style.display = 'none'
        this.$refs.dockIcon.className = 'esri-icon-minimize esri-popup__icon'
      } else {
        this.$refs.popup.style.right = 'unset'
        this.$refs.popupPointer.style.display = 'unset'
        this.$refs.dockIcon.className =
          'esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon'
      }
    },
    _getPopupContent (data) {
      let lconfig = window.s3d.getLayerConfig(data.object.layer)
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getContent) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getContent丢失`
        }
        return lconfig.popupTemplate.getContent(data)
      } else {
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
          value: data.position?.longitude,
        })
        arr.push({
          key: '纬度',
          value: data.position?.latitude,
        })
        arr.push({
          key: '高度',
          value: data.position?.height,
        })

        for (let p in data.object.attributes) {
          arr.push({
            key: p,
            value: data.object.attributes[p],
          })
        }
        return arr
      }
    },
    _getPopupHeader (data) {
      let lconfig = window.s3d.getLayerConfig(data.object.layer)
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getHeader) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getHeader丢失`
        }
        return lconfig.popupTemplate.getHeader(data)
      } else {
        return data.object.layer + ' - ' + data.object.id
      }
    },
    _setHeader (title) {
      this.title = title
    },
    _setContent (object) {
      if (object instanceof HTMLElement) {
        this.showPropGrid = false
        this.$refs.content.innerHTML = ''
        this.$refs.content.appendChild(object)
      } else if (object instanceof Array) {
        this.showPropGrid = true
        this.propArray = object
      }
    },
    _textWidth (value) {
      if (!value) {
        return '100%'
      } else {
        return value.length + 'rem'
      }
    },
    enableDock () {
      this._setPopupStyle(true)
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler()
        this.removePostRenderHandler = null
      }
      this.dockered = true
    },
    disableDock () {
      this._setPopupStyle(false)
      this._enableStickRender()
      this.dockered = false
    },
    dock () {
      if (this.dockered) {
        this.disableDock()
      } else {
        this.enableDock()
      }
    },
  },
}
</script>

<style lang="scss">
.my-popup {
  position: absolute;
  max-width: 500px;
  cursor: auto;
  .multi-header {
    margin-top: 4px;
    input {
      border: none;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .esri-popup__main-container {
    max-width: 700px !important;
    max-height: 700px !important;
  }

  // .esri-popup__content {
  //   margin: 0 0;
  // }

  // .esri-popup__pointer {
  //   top: unset !important;
  // }

  .esri-popup__header {
    border-bottom: solid 1px rgba(110, 110, 110, 0.3);
  }
}
</style>
