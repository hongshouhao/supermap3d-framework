<template>
  <div
    v-show="popupVisible"
    ref="popup"
    class="my-popup esri-component esri-popup esri-popup--aligned-top-center esri-popup--shadow"
    :class="{ dockered: dockered }"
  >
    <div
      class="esri-popup__main-container esri-widget esri-popup--is-collapsible"
    >
      <header class="esri-popup__header">
        <div class="multi-header">
          <el-select
            v-show="multiable"
            v-model="objIndex"
            @change="_reRenderPopup"
            placeholder="请选择"
          >
            <el-option
              v-for="(title, idx) in objTitles"
              :key="idx"
              :label="title"
              :value="idx"
            >
            </el-option>
          </el-select>
        </div>
        <h2
          v-show="!multiable"
          class="esri-widget__heading esri-popup__header-title"
        >
          {{ title }}
        </h2>
        <div class="esri-popup__header-buttons">
          <div
            title="停靠"
            class="esri-popup__button esri-popup__button--dock"
            @click="dock"
          >
            <span
              ref="dockIcon"
              class="esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"
            ></span>
          </div>
          <div title="关闭" class="esri-popup__button" @click="hidePopup">
            <span class="esri-popup__icon esri-icon-close"></span>
          </div>
        </div>
      </header>
      <article class="esri-popup__content">
        <PropertyGrid v-show="showPropGrid" :propArray="propArray" />
        <div v-show="!showPropGrid" ref="content"></div>
      </article>
      <div class="esri-popup__footer" ref="footer"></div>
    </div>
    <div ref="popupPointer" class="esri-popup__pointer">
      <div class="esri-popup__pointer-direction esri-popup--shadow"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Enumerable from 'linq';
import PropertyGrid from '../popup/PropertyGrid.vue';
import { isImageryLayer } from '../../utils/ImageryUtility';

export default {
  data() {
    return {
      enabled: false,
      propArray: [],
      title: '',
      multiable: false,
      objIndex: null,
      objTitles: [],
      dataObjs: [],
      autoDockered: false,
      manualDockered: false,
      popupVisible: false,
      showPropGrid: true,
      dockered: false,
    };
  },
  components: {
    PropertyGrid,
  },
  props: [],
  mounted() {
    this.dataAccess = window.s3d.dataAccess;
    this.initIQuery();
    this.initIQueryForMVT();
  },
  methods: {
    enable() {
      this.enabled = true;
      window.s3d.eventBus.dispatch('tool-started', 'iquery');
    },
    disable() {
      this.enabled = false;
      this._clearTempDataSources();
      this.hidePopup();
      window.s3d.eventBus.dispatch('tool-stopped', 'iquery');
    },
    initIQuery() {
      let _this = this;
      this.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(
        _this.$viewer.scene.canvas
      );
      this.mouseEventHandler.setInputAction(function (e) {
        if (_this.enabled) {
          let position = _this.$viewer.scene.pickPosition(e.position);
          let coordinate = window.s3d.getCoordinate(e.position);
          if (_this.mvtData) {
            let layerName = _this.mvtData.object.layer;
            let lconf = window.s3d.layerManager.getLayerConfig(layerName);
            if (lconf.iQuery) {
              _this.dataAccess
                .dataFromiQuery(layerName, coordinate)
                .then((data) => {
                  _this.renderPopup(position, data);
                });
            } else {
              _this.renderPopup(position, _this.mvtData);
            }
          } else {
            let pikObjs = window.s3d.pickObject(e.position);
            if (pikObjs.length === 0) {
              let unslctableLayers = window.s3d.layerManager.getAllLayers(
                (x) => {
                  return (
                    (isImageryLayer(x.type) ||
                      // || (x.type === "3DTILES" && x.config.selectable === false)
                      // || (x.type === "S3M" && x.config.selectable === false))
                      x.type === '3DTILES' ||
                      x.type === 'S3M') &&
                    (x.show || x.visible) &&
                    x.config?.iQuery
                  );
                }
              );
              unslctableLayers.sort((l1, l2) => {
                if (!l1.config.iQuery.priority) {
                  l1.config.iQuery.priority = -9999;
                }
                if (!l2.config.iQuery.priority) {
                  l2.config.iQuery.priority = -9999;
                }
                return l2.config.iQuery.priority - l1.config.iQuery.priority;
              });
              if (unslctableLayers.length > 0) {
                let calls = unslctableLayers.map((l) => {
                  return _this.dataAccess.dataFromiQuery(l.name, coordinate);
                });

                Promise.all(calls).then((result) => {
                  let notNull = result.filter((x) => x);
                  if (notNull.length > 0) {
                    _this.renderPopupMulti(position, notNull);
                  } else {
                    _this._clearTempDataSources();
                    _this.hidePopup();
                  }
                });
              } else {
                _this._clearTempDataSources();
                _this.hidePopup();
              }
            } else {
              let calls = pikObjs.map((x) => {
                if (x.id instanceof Cesium.Entity && x.id.iQueryable) {
                  return _this.dataAccess.dataFromEntity(x.id);
                } else if (x.primitive.config?.iQuery) {
                  let lname = x.primitive.config.name;
                  return _this.dataAccess.dataFromiQuery(lname, coordinate);
                } else {
                  return _this.dataAccess.dataFromPrimitive(x);
                }
              });
              Promise.all(calls)
                .then((result) => {
                  if (result.length > 0) {
                    for (let item of result) {
                      if (!item.position) {
                        item.position = coordinate;
                      }
                    }
                    _this.renderPopupMulti(position, result);
                  } else {
                    _this._clearTempDataSources();
                    _this.hidePopup();
                  }
                })
                .catch((err) => {
                  _this.hidePopup();
                  console.error(err);
                });
            }
          }
        } else {
          _this.hidePopup();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    initIQueryForMVT() {
      let _this = this;
      _this.$viewer.selectedEntityChanged.addEventListener(function (entity) {
        if (!_this.enabled) {
          _this.mvtData = null;
          return;
        }

        if (entity && entity.pickResult) {
          let layerName = entity.pickResult.mapName;
          let features = entity.pickResult[entity.pickResult['layerID']];
          let fItem = features.find(
            (x) => x.feature.id === entity.pickResult.featureID
          );
          _this.dataAccess
            .dataFromMVTFeature(layerName, fItem.feature)
            .then((data) => {
              _this.mvtData = data;
            });
        } else {
          _this.mvtData = null;
        }
      });
    },
    hidePopup() {
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler();
        this.removePostRenderHandler = null;
      }
      this.popupVisible = false;
    },
    renderPopupMulti(cartesian, data) {
      this.multiable = data.length > 1;
      this.dataObjs = data;
      this.objTitles = data.map((x) => this._getPopupHeader(x));
      this.objIndex = 0;
      this._reRenderPopup();
      this._showPopup(cartesian);
    },
    renderPopup(cartesian, data) {
      this.multiable = false;
      this._setHeader(this._getPopupHeader(data));
      this._setContent(this._getPopupContent(data));
      this._setFooter(this._getPopupFooter(data));
      this._showPopup(cartesian);
    },
    _showPopup(cartesian) {
      this.popupPosition = cartesian;
      this.popupVisible = true;
      this._enableStickRender();
    },
    _reRenderPopup() {
      let obj = this.dataObjs[this.objIndex];
      let header = this._getPopupHeader(obj);
      this._setHeader(header);
      this._setContent(this._getPopupContent(obj));
      this._setFooter(this._getPopupFooter(obj));
      this._highlight(obj);
      $('.my-popup .multi-header input').css('width', this._textWidth(header));
    },
    _highlight(obj) {
      if (obj.sourceType == 'ENTITY') {
        return;
      }

      let grps = Enumerable.from(this.dataObjs)
        .groupBy((x) => x.object.layer)
        .toArray();
      for (let g of grps) {
        let ly = window.s3d.layerManager.getLayer(g.key());
        if (ly && ly.type === 'S3M') {
          // ly.setSelection([]);
        }
      }

      this._clearTempDataSources();

      let ly = window.s3d.layerManager.getLayer(obj.object.layer);
      if (
        ly.type === 'S3M' &&
        (typeof ly.config.selectable === 'undefined' ||
          ly.config.selectable === true)
      ) {
        // ly.setSelection([obj.object.id]);
      } else if (
        isImageryLayer(ly.type) ||
        (ly.type === '3DTILES' && ly.config.selectable === false) ||
        (ly.type === 'S3M' && ly.config.selectable === false)
      ) {
        if (obj.object.shape) {
          if (obj.object.shape.type.toLowerCase() == 'featurecollection') {
            for (let fitem of obj.object.shape.features) {
              fitem.properties = obj.object.attributes;
            }
          } else if (obj.object.shape.type.toLowerCase() == 'feature') {
            obj.object.shape.properties = obj.object.attributes;
          }

          // 方案1
          if (window.s3d.config.iQuery) {
            if (
              window.s3d.config.iQuery.shapeRending &&
              typeof window.s3d.config.iQuery.shapeRending === 'function'
            ) {
              window.s3d.config.iQuery.shapeRending(obj.object.shape, ly);
            } else {
              let opts = ly.config.iQuery.symbol;
              window.s3d.dataUtility
                .loadGeoJson(
                  obj.object.shape,
                  opts,
                  `temp_iquery_geometries_${ly.name}`
                )
                .then((ds) => {
                  for (let ent of ds.entities.values) {
                    ent.name = ly.name;
                  }
                });
            }
          }
          // //方案2
          // Cesium.GeoJsonDataSource.load(obj.object.shape).then((ds) => {
          //   let dataSource = new Cesium.CustomDataSource(`temp_iquery_geometries_${ly.name}`)
          //   for (let ent of ds.entities.values) {
          //     let newEnt = null;
          //     if (ent.polyline) {
          //       newEnt = {
          //         polyline: {
          //           positions: ent.polyline.positions._value,
          //         },
          //       }

          //       let symbol = ly.config.iQuery.symbol ?? {
          //         material: Cesium.Color.RED,
          //         width: 2.0
          //       }
          //       Object.assign(newEnt.polyline, symbol)
          //     }
          //     else if (ent.polygon) {
          //       let hierarchy = ent.polygon.hierarchy.getValue()
          //       newEnt = {
          //         polygon: {
          //           hierarchy: {
          //             positions: hierarchy.positions,
          //             holes: hierarchy.holes
          //           },
          //           height: 10,
          //           outline: true,
          //           outlineColor: Cesium.Color.RED,
          //           outlineWidth: 2.0,
          //           material: Cesium.Color.BLUE.withAlpha(0.5),
          //           classificationType: Cesium.ClassificationType.BOTH
          //         }
          //       }

          //       let symbol = ly.config.iQuery.symbol ?? {
          //         material: Cesium.Color.RED.withAlpha(0.3),
          //         outline: true,
          //         outlineColor: Cesium.Color.BLUE,
          //         outlineWidth: 2.0
          //       }
          //       Object.assign(newEnt.polygon, symbol)
          //     }
          //     dataSource.entities.add(newEnt)
          //   }
          //   ds.entities.removeAll()
          //   _this.$viewer.dataSources.add(dataSource)
          // })
        }
      }
    },
    _clearTempDataSources() {
      window.s3d.dataUtility.clearTempData('temp_iquery_geometries_');
    },
    _enableStickRender() {
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler();
        this.removePostRenderHandler = null;
      }
      let _this = this;
      this.removePostRenderHandler =
        this.$viewer.scene.postRender.addEventListener(function () {
          let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            _this.$viewer.scene,
            _this.popupPosition
          );
          let popupDom = _this.$refs.popup;
          let left = screenPosition.x - popupDom.offsetWidth / 2;
          let top = screenPosition.y - popupDom.offsetHeight - 30;
          if (
            left < 0 ||
            top > _this.$viewer.scene.canvas.height - popupDom.offsetHeight ||
            left > _this.$viewer.scene.canvas.width - popupDom.offsetWidth
          ) {
            _this.enableDock();
          } else if (top < 0) {
            top = screenPosition.y + 10;

            if (top - 30 < 0) {
              _this.enableDock();
            } else {
              if (_this.manualDockered === false) {
                _this.disableDock();
                _this.$refs.popupPointer.style.top = '0';
                popupDom.style.left = left + 'px';
                popupDom.style.top = top + 'px';
              }
            }
          } else {
            if (_this.manualDockered === false) {
              _this.disableDock();
              popupDom.style.left = left + 'px';
              popupDom.style.top = top + 'px';
              _this.$refs.popupPointer.style.top = '100%';
            }
          }
        });
    },
    _setPopupStyle(enableDockStyle) {
      if (enableDockStyle) {
        this.$refs.popup.style.top = '60px';
        this.$refs.popup.style.right = '15px';
        this.$refs.popup.style.left = 'unset';
        this.$refs.popupPointer.style.display = 'none';
        this.$refs.dockIcon.className = 'esri-icon-minimize esri-popup__icon';
      } else {
        this.$refs.popup.style.right = 'unset';
        this.$refs.popupPointer.style.display = 'unset';
        this.$refs.dockIcon.className =
          'esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon';
      }
    },
    _getPopupContent(data) {
      let lconfig = window.s3d.layerManager.getLayerConfig(data.object.layer);
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getContent) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数[popupTemplate.getContent]丢失`;
        }
        return lconfig.popupTemplate.getContent(data);
      } else {
        let arr = [];
        arr.push({
          key: '对象',
          value: data.object.layer,
        });
        arr.push({
          key: '标识',
          value: data.object.id,
        });
        arr.push({
          key: 'X',
          value: data.position?.x,
        });
        arr.push({
          key: 'Y',
          value: data.position?.y,
        });
        arr.push({
          key: 'Z',
          value: data.position?.z,
        });

        for (let p in data.object.attributes) {
          arr.push({
            key: p,
            value: data.object.attributes[p],
          });
        }
        return arr;
      }
    },
    _getPopupHeader(data) {
      let lconfig = window.s3d.layerManager.getLayerConfig(data.object.layer);
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getHeader) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getHeader丢失`;
        }
        return lconfig.popupTemplate.getHeader(data);
      } else {
        return data.object.layer + ' - ' + data.object.id;
      }
    },
    _getPopupFooter(data) {
      let lconfig = window.s3d.layerManager.getLayerConfig(data.object.layer);
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getHeader) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getHeader丢失`;
        }
        if (lconfig.popupTemplate.getFooter) {
          return lconfig.popupTemplate.getFooter(data);
        }
      }

      return '';
    },
    _setHeader(title) {
      this.title = title;
    },
    _setContent(object) {
      if (object instanceof HTMLElement) {
        this.showPropGrid = false;
        this.$refs.content.innerHTML = '';
        this.$refs.content.appendChild(object);
      } else if (object instanceof Array) {
        this.showPropGrid = true;
        this.propArray = object;
      }
    },
    _setFooter(object) {
      if (object instanceof HTMLElement) {
        this.$refs.footer.innerHTML = '';
        this.$refs.footer.appendChild(object);
      }
    },
    _textWidth(value) {
      if (!value) {
        return '100%';
      } else {
        return value.length + 'rem';
      }
    },
    enableDock() {
      if (!this.autoDockered) {
        this._setPopupStyle(true);
        this.autoDockered = true;
      }
      this.dockered = true;
    },
    disableDock() {
      if (this.autoDockered) {
        this._setPopupStyle(false);
        this.autoDockered = false;
      }
      this.dockered = false;
    },
    dock() {
      if (this.manualDockered) {
        this.disableDock();
        this.manualDockered = false;
      } else {
        this.enableDock();
        this.manualDockered = true;
      }
    },
  },
};
</script>

<style lang="scss">
.my-popup {
  position: absolute;
  max-width: 500px;
  cursor: auto;
  z-index: 3000;
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
