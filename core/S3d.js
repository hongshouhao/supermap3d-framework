import 'element-ui/lib/theme-chalk/index.css';
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css';
import './css/arcgis/themes/light/main.css';
import './css/index.scss';

import Toolbar from './tools/Toolbar';

import EventBus from 'eventbusjs';
import ViewUtility from './utils/ViewUtility';
import PickingUtility from './utils/PickingUtility';
import CameraUtility from './utils/CameraUtility';
import DebugUtility from './utils/DebugUtility';
import DataUtility from './utils/DataUtility';
import BasemapUtility from './utils/BasemapUtility';

import SelectedChangedEvent from '../core/data/SelectedChangedEvent';
import DataAccessWrapper from '../core/data/DataAccessWrapper';
import DataAccess from './data/DataAccess';
import LayerManager from './data/LayerManager';
import LayerFactory from './utils/LayerFactory';
import { lonLatToCartesian, cartesianToLonlat } from './utils/CesiumMath';
import { isS3mFeature } from './utils/IfUtility';
import { setCursorStyle, resetCursorStyle } from './utils/CursorUtility';

import SketchTool from './tools/Sketch/SketchTool';
// import './materials'

export default class S3d {
  constructor(config) {
    if (!config.iServerBaseURL) throw '参数不能为空: iServerBaseURL';
    if (!config.layers) throw '参数不能为空: layers';
    if (!config.defaultCamera) throw '参数不能为空: defaultCamera';

    this.config = config;
    this.toolbar = new Toolbar();
    this.eventBus = EventBus;
    this.viewer = null;
    this.scene = null;
    this.tempEntities = [];

    this._setLabel();
    if (config.useEllipsoid) {
      // 默认球体为圆球，修改为真实椭球体
      Cesium.Ellipsoid.WGS84 = new Cesium.Ellipsoid(
        6378137.0,
        6378137.0,
        6356752.3142451793
      );
    }
    // this._loadCustomMaterials()
  }

  setViewer(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
 
    this.selectedChangedEvent = new SelectedChangedEvent(viewer);
    this.dataAccess = new DataAccess(viewer);
    this.popupData = new DataAccessWrapper(viewer);
    this.viewUtility = new ViewUtility(viewer);
    this.cameraUtility = new CameraUtility(viewer);
    this.debugUtility = new DebugUtility(viewer);
    this.pickingUtility = new PickingUtility(viewer.scene);
    this.dataUtility = new DataUtility(viewer);
    this.sketchTool = new SketchTool(viewer);
    this.basemapUtility = new BasemapUtility(
      viewer,
      this.config,
      this.eventBus
    );
    this.layerFactory = new LayerFactory(viewer);
    this.layerManager = new LayerManager(viewer, this.config, this.eventBus);

    if (this.config.usePlaneCoordinateSystem) {
      this.viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers._layers[0]);
    }

    if (this.config.emptyMap) {
      this.config.emptyMap.name = 'empty';
      this.config.emptyMap.type = 'STIMG';
      this.config.emptyMap.visible = true;
      this.layerFactory.createLayer(this.config.emptyMap);
    }

    if (this.config.globalNightMap) {
      this.config.globalNightMap.type = 'SMIMG';
      this.config.globalNightMap.visible = true;
      this.layerFactory.createLayer(this.config.globalNightMap);
    }

    for (let imgLy of this.viewer.imageryLayers._layers) {
      imgLy.isBaseMap = true;
    }

    // this.viewer.scene.colorCorrection.show = true;
    this.viewer.scene.globe.enableLighting = true;
    // this.viewer.scene.hdrEnabled = true;

    // viewer.scene.fxaa = false
    // viewer.scene.postProcessStages.fxaa.enabled = false
    this.viewer.scene.debugShowFramesPerSecond =
      this.config.enableDebugShowFramesPerSecond || false;
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.scene.logarithmicDepthBuffer = false;

    this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.PINCH,
      {
        eventType: Cesium.CameraEventType.LEFT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
      {
        eventType: Cesium.CameraEventType.RIGHT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
    ];

    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];

    let currentTime = new Date();
    currentTime.setHours(12);
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime);
    this.viewer.clock.multiplier = 1;
    this.viewer.clock.shouldAnimate = true;

    if (this.config.colorCorrection) {
      Object.assign(
        this.viewer.scene.colorCorrection,
        this.config.colorCorrection
      );
    }

    if (this.config.undergroundMode) {
      this.viewer.scene.undergroundMode = this.config.undergroundMode;
    }
    if (this.config.minimumZoomDistance) {
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance =
        this.config.minimumZoomDistance;
    }

    this._setLayerVisibleByAltitude();
    this._setSkyBox();

    if (this.config.usePlaneCoordinateSystem) {
      this.config.defaultCamera.convert = false;
      this.viewer.camera.setView(this.config.defaultCamera);
      this.eventBus.dispatch('default-camera-settled');
    } else {
      this.config.defaultCamera.complete = () => {
        this.eventBus.dispatch('default-camera-settled');
      };

      this.viewer.camera.flyTo(this.config.defaultCamera);
    }

    this.viewer.camera.flyTo(this.config.defaultCamera);
    return this;
  }
  setCursor(className) {
    this.viewer.enableCursorStyle = false;
    setCursorStyle(className);
    return this;
  }
  resetCursor() {
    this.viewer.enableCursorStyle = true;
    resetCursorStyle();
    return this;
  }

  _setLayerVisibleByAltitude() {
    let _this = this;
    let setLayerVisible = function () {
      let altitude = _this.cameraUtility.getCameraHeight();
      for (let i = 0; i < _this.scene.imageryLayers.length; i++) {
        let imgLy = _this.scene.imageryLayers.get(i);
        let minVisibleAltitude = imgLy.config?.minVisibleAltitude;
        let maxVisibleAltitude = imgLy.config?.maxVisibleAltitude;
        if (minVisibleAltitude) {
          if (altitude < minVisibleAltitude) {
            imgLy.show = false;
          } else {
            imgLy.show = true;
          }
        } else if (maxVisibleAltitude) {
          if (altitude > maxVisibleAltitude) {
            imgLy.show = false;
          } else {
            imgLy.show = true;
          }
        }
      }
    };
    this.viewer.camera.changed.addEventListener(setLayerVisible);
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
        translucent: function (material) {
          return true;
        },
      }
    );
  }
  _setLabel() {
    let setLabel = function (layers, nameList) {
      for (let ln of layers) {
        if (ln.layer) {
          if (!ln.name) {
            throw `图层配置错误: "name"属性缺失\n错误节点: ${JSON.stringify(
              ln
            )}`;
          } else {
            if (nameList[ln.name]) {
              nameList[ln.name] = nameList[ln.name] + 1;
            } else {
              nameList[ln.name] = 1;
            }
            if (!ln.label) {
              ln.label = ln.name;
            }
          }
        } else if (ln.children) {
          setLabel(ln.children, nameList);
        }
      }
    };
    let nameList = {};
    setLabel(this.config.layers, nameList);

    for (let key in nameList) {
      if (nameList[key] > 1) {
        throw `图层配置错误: 图层名(${key})重复`;
      }
    }
  }
  // _getLayerNode(params) {
  //   let getLayerNode = function(layers, predicate) {
  //     for (let lyConfig of layers) {
  //       if (lyConfig.layer) {
  //         if (predicate(lyConfig)) {
  //           return lyConfig
  //         }
  //       } else if (lyConfig.children) {
  //         let result = getLayerNode(lyConfig.children, predicate)
  //         if (result) {
  //           return result
  //         }
  //       }
  //     }
  //   }
  //   if (typeof params === 'function') {
  //     return getLayerNode(this.config.layers, params)
  //   } else if (typeof params === 'string') {
  //     return getLayerNode(this.config.layers, (x) => x.name === params)
  //   } else {
  //     throw `不支持的参数类型 ${typeof params}`
  //   }
  // }
  // _setLayerVisible(layer, visible) {
  //   this.eventBus.dispatch('layer-visible-changed', layer, visible)
  //   if (!visible) {
  //     if (layer.config?.renderer) {
  //       this.layersRenderer.stopRender(layer.name)
  //     }
  //   }
  // }
  _setSkyBox() {
    let scene = this.viewer.scene;
    let blueSkyBox = new Cesium.SkyBox({
      sources: {
        positiveX: './skyBox/bluesky/Right.jpg',
        negativeX: './skyBox/bluesky/Left.jpg',
        positiveY: './skyBox/bluesky/Front.jpg',
        negativeY: './skyBox/bluesky/Back.jpg',
        positiveZ: './skyBox/bluesky/Up.jpg',
        negativeZ: './skyBox/bluesky/Down.jpg',
      },
    });
    scene.skyBox = blueSkyBox;

    if (!this.config.usePlaneCoordinateSystem) {
      let initialSkyBox = function () {
        if (scene.frameState.passes.render) {
          blueSkyBox.update(scene.frameState, true);
          scene.postRender.removeEventListener(initialSkyBox);
        }
      };
      scene.postRender.addEventListener(initialSkyBox);

      blueSkyBox.WSpeed = 0.5;
      blueSkyBox.show = true;
      this._gradualChange(blueSkyBox);
    }
  }
  _gradualChange(skybox) {
    let scene = this.viewer.scene;
    let skyListener = function () {
      let cameraHeight = scene.camera.positionCartographic.height;

      let skyAtmosphereH1 = 22e4; // 大气开始渐变的最大高度
      let skyBoxH1 = 15e4; // 天空开始渐变的最大高度
      let skyBoxH2 = 12e4; // 天空开始渐变的最小高度
      let bufferHeight = 1e4;
      if (cameraHeight < skyAtmosphereH1) {
        let skyAtmosphereT =
          (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
        if (skyAtmosphereT > 1.0) {
          skyAtmosphereT = 1.0;
        } else if (skyAtmosphereT < 0.0) {
          skyAtmosphereT = 0.0;
        }
        let skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
        if (skyBoxT > 1.0) {
          skyBoxT = 1.0;
        } else if (skyBoxT < 0.0) {
          skyBoxT = 0.0;
        }
        skybox.alpha = 1.0 - skyBoxT;
        if (cameraHeight > skyBoxH2) {
          scene.skyAtmosphere.show = true;
          scene.skyAtmosphere.alpha = skyAtmosphereT;
          scene.skyBox = skybox;
        } else {
          scene.skyAtmosphere.show = false;
        }
      }

      if (
        cameraHeight > skyBoxH2 - 2 * bufferHeight &&
        cameraHeight < skyBoxH1 + 3 * bufferHeight
      ) {
        scene.screenSpaceCameraController.zoomFactor = 0.4;
      } else {
        scene.screenSpaceCameraController.zoomFactor = 5.0;
      }
    };
    scene.postRender.addEventListener(skyListener);
  }

  getCoordinate(mousePosition) {
    if (this.config.usePlaneCoordinateSystem) {
      return this.viewer.scene.pickPosition2D(mousePosition);
    } else {
      let cartesian = this.viewer.scene.pickPosition(mousePosition);
      let lonlat = cartesianToLonlat(cartesian);
      return {
        x: lonlat.longitude,
        y: lonlat.latitude,
        z: lonlat.height,
      };
    }
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
  async openPopup(data) {
    let layerName = data.object.layer;
    let cartesian = null;
    if (data.position) {
      cartesian = lonLatToCartesian(
        data.position.longitude,
        data.position.latitude,
        data.position.height
      );
    }

    if (cartesian && data.object.attributes) {
      this.popup.renderPopup(cartesian, data);
      return;
    }

    let dataFromiQuery = null;
    let _this = this;
    if (this.layerManager.getLayerConfig(layerName).iQuery) {
      dataFromiQuery = function (lonlat) {
        return _this.popupData.dataFromiQuery(layerName, lonlat);
      };
    }

    if (data.position && dataFromiQuery) {
      let result = await dataFromiQuery(data.position);
      this.popup.renderPopup(cartesian, result);
    } else if (data.object.id || data.object.sql) {
      let list = await this.popupData.dataFromDataset({
        layer: layerName,
        sql: data.object.sql,
        ids: [data.object.id],
      });
      if (list.length > 0) {
        let objFromFeature = list[0];
        if (!cartesian) {
          cartesian = lonLatToCartesian(
            objFromFeature.position.longitude,
            objFromFeature.position.latitude,
            objFromFeature.position.height
          );
        }

        let feature = objFromFeature.source;
        let resultObj = objFromFeature;
        if (dataFromiQuery) {
          resultObj = await dataFromiQuery(objFromFeature.position);
        }

        this.layerManager.setLayerVisible(layerName, true);
        let layer = this.layerManager.getLayer(layerName);
        layer.setSelection([feature.ID]);
        this.cameraUtility.flyToS3mFeatures([feature]).then(() => {
          this.popup.renderPopup(cartesian, resultObj);
        });
      }
    }
  }
  closePopup() {
    this.popup.hidePopup();
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
  flyTo(params, options) {
    if (params instanceof Array && params.length > 0) {
      let sample = params[0];
      if (typeof sample === 'number') {
        let pts = null;
        if (params.length % 2 === 0) {
          pts = Cesium.Cartesian3.fromDegreesArray(params);
        } else if (params.length % 3 === 0) {
          pts = Cesium.Cartesian3.fromDegreesArrayHeights(params);
        } else {
          throw '参数错误';
        }
        return this.cameraUtility.flyToPoints(pts, options);
      } else if (sample instanceof Cesium.Cartesian3) {
        return this.cameraUtility.flyToPoints(params, options);
      } else if (isS3mFeature(sample)) {
        return this.cameraUtility.flyToS3mFeatures(params, options);
      }
    } else if (sample instanceof Cesium.Cartesian3) {
      return this.cameraUtility.flyToPoints([params], options);
    } else if (isS3mFeature(params)) {
      return this.cameraUtility.flyToS3mFeatures([params], options);
    }
  }
  flyToLayer(layer, options) {
    if (layer) {
      if (layer.type === 'MVT') {
        let duration = options?.duration == null ? 2 : options?.duration;
        let height = options?.height == null ? 10000 : options?.duration;
        let orientation = null;
        if (options?.orientation) {
          orientation = options.orientation;
        } else {
          orientation = {
            heading: 0,
            roll: 0,
            pitch: -1 * Cesium.Math.PI_OVER_TWO,
          };
        }

        let bounds = layer.rectangle;
        // this._flyTo(layer.rectangle, options)
        this.viewer.camera.flyTo({
          destination: new Cesium.Cartesian3.fromRadians(
            (bounds.east + bounds.west) * 0.5,
            (bounds.north + bounds.south) * 0.5,
            height
          ),
          orientation: orientation,
          duration: duration,
        });
      } else if (layer.type === 'S3M') {
        this._flyToBounds(layer.layerBounds, options);
        // this.viewer.flyTo(layer, options)
      } else {
        this.viewer.flyTo(layer, options);
      }
    } else {
      throw '无法定位图层, 图层可能加载失败';
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
  flyToS3mFeatures(params, options) {
    let _this = this;
    let fly = function (features) {
      let ids = features.map((x) => x.ID);
      _this.layerManager.getLayer(params.layer).setSelection(ids);
      return _this.cameraUtility.flyToS3mFeatures(features, options);
    };
    if (params.layer && params.features) {
      return fly(params.features);
    } else if (params.layer && (params.ids || params.sql)) {
      return this.popupData.dataFromDataset(params).then((response) => {
        let features = response.map((x) => x.source);
        return fly(features);
      });
    }
  }

  pickObject(mousePosition) {
    let pickedObjects = [];
    if (this.config.drillPick?.enable) {
      pickedObjects = this.pickingUtility.drillPickByDepth(
        mousePosition,
        this.config.drillPick.depth == null ? 0.5 : this.config.drillPick.depth
      );
    } else {
      let pobj = this.scene.pick(mousePosition, 3);
      if (
        pobj &&
        pobj.primitive
        // &&
        // (typeof pobj.id === 'string' || pobj.id instanceof Cesium.Entity)
      ) {
        pickedObjects.push(pobj);
      }
    }

    return pickedObjects;
  }

  enableBloom() {
    this.viewer.scene.bloomEffect.show = true;
    this.viewer.scene.bloomEffect.threshold = 0.5;
    this.viewer.scene.bloomEffect.bloomIntensity = 3;
    return this;
  }
  disableBloom() {
    this.viewer.scene.bloomEffect.show = false;
    return this;
  }

  // , distance, orientation, duration
  _flyToBounds(bounds, options) {
    let rectangle = Cesium.Rectangle.fromRadians(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north
    );

    const northwest = Cesium.Rectangle.northwest(rectangle); // 西北角弧度坐标（左上）
    const southwest = Cesium.Rectangle.southwest(rectangle); // 西南角弧度坐标（左下）
    const northeast = Cesium.Rectangle.northeast(rectangle); // 东北角弧度坐标（右上）
    const southeast = Cesium.Rectangle.southeast(rectangle); // 东南角弧度坐标（右下）

    let pts = Cesium.Cartesian3.fromDegreesArray([
      Cesium.Math.toDegrees(northwest.longitude),
      Cesium.Math.toDegrees(northwest.latitude),
      Cesium.Math.toDegrees(southwest.longitude),
      Cesium.Math.toDegrees(southwest.latitude),
      Cesium.Math.toDegrees(northeast.longitude),
      Cesium.Math.toDegrees(northeast.latitude),
      Cesium.Math.toDegrees(southeast.longitude),
      Cesium.Math.toDegrees(southeast.latitude),
    ]);
    this.flyTo(pts, options);
  }

  labelPoints(ptObjs, entOptions, enableIQuery, fitView, flyOptions) {
    this.dataUtility.labelPoints(ptObjs, entOptions);
    if (enableIQuery) {
      this.popup.enable();
    }
    if (fitView) {
      let pts = ptObjs.map((x) => x.position);
      this.cameraUtility.flyToPointsLL(pts, flyOptions);
    }
  }
}
