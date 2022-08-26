import { isImageryLayer } from './ImageryUtility';
import { proxy } from '../utils/LocalProxy';
import lodash from 'lodash';
export default class LayerFactory {
  constructor(viewer) {
    this.viewer = viewer;
  }

  createLayer(options) {
    if (typeof options.visible !== 'boolean') {
      options.visible = true;
    }

    if (isImageryLayer(options.type)) {
      return this.createImageLayer(options);
    } else if (options.type === 'S3M') {
      return this.createS3MLayer(options);
    } else if (options.type === 'MVT') {
      return this.createMVTLayer(options);
    } else if (options.type === 'DEM') {
      return this.createDEMLayer(options);
    } else if (options.type === '3DTILES') {
      return this.create3DTilesLayer(options);
    } else {
      throw `图层类型配置错误: ${options.type}`;
    }

    // return this.preprocessLayerOptions(options).then((optCopy) => {
    //   if (isImageryLayer(optCopy.type)) {
    //     return this.createImageLayer(optCopy);
    //   } else if (optCopy.type === 'S3M') {
    //     return this.createS3MLayer(optCopy).then((layer) => {
    //       return layer;
    //     });
    //   } else if (optCopy.type === 'MVT') {
    //     return this.createMVTLayer(optCopy);
    //   } else if (optCopy.type === 'DEM') {
    //     return this.createDEMLayer(optCopy);
    //   } else if (optCopy.type === '3DTILES') {
    //     return this.create3DTilesLayer(optCopy);
    //   } else {
    //     throw `图层类型配置错误: ${optCopy.type}`;
    //   }
    // }).then(ly=>{
    //   ly.config = options;
    //   ly.type = options.type;
    //   ly.name = options.name;
    //   return ly;
    // });
  }

  preprocessLayerOptions(options) {
    if (options.proxy) {
      let opt = lodash.cloneDeep(options);
      return proxy(opt.url, function (config) {
        Object.assign(config, opt.proxy);
      }).then((url) => {
        opt.url = url;
        return opt;
      });
    } else {
      return Promise.resolve(options);
    }
  }

  createS3MLayer(options) {
    if (options.url) {
      let promise = this.viewer.scene.addS3MTilesLayerByScp(options.url, {
        name: options.name,
      });
      return promise.then((cly) => {
        cly.config = options;
        cly.type = options.type;

        if (options.selectColorType) {
          cly.selectColorType = options.selectColorType;
        }

        if (typeof options.clearMemoryImmediately === 'boolean') {
          cly.clearMemoryImmediately = options.clearMemoryImmediately;
        }
        if (options.minVisibleAltitude) {
          cly.minVisibleAltitude = options.minVisibleAltitude;
        }
        if (options.maxVisibleAltitude) {
          cly.maxVisibleAltitude = options.maxVisibleAltitude;
        }

        if (options.opacity) {
          cly.style3D.fillForeColor = new Cesium.Color(
            1.0,
            1.0,
            1.0,
            options.opacity
          );
        }
        if (options.enableFillAndWireFrame) {
          // cly.selectedColor = Cesium.Color.RED
          // cly.selectedLineColor = Cesium.Color.BLUE
          // cly.silhouetteColor = Cesium.Color.RED
          // cly.silhouetteSize = 10

          cly.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
          cly.style3D.lineColor = Cesium.Color.BLACK;
          cly.style3D.lineWidth = 1;
          cly.wireFrameMode = Cesium.WireFrameType.EffectOutline;
          // cly.wireFrameMode = Cesium.WireFrameType.Triangle
        }

        if (options.themeStyle) {
          cly.themeStyle = new Cesium.Cesium3DTileStyle(options.themeStyle);
        }

        if (options.colorCorrection) {
          Object.assign(cly, options.colorCorrection);
        }

        if (options.flattenRegions && options.flattenRegions.length > 0) {
          let i = 0;
          options.flattenRegions.forEach((element) => {
            cly.addFlattenRegion({
              position: element,
              name: 'flatten' + i,
            });
          });
        }
        return cly;
      });
    } else {
      throw 'S3M图层配置错误:URL';
    }
  }
  createMVTLayer(options) {
    let cly = this.viewer.scene.addVectorTilesMap({
      url: options.url,
      name: options.name,
      viewer: this.viewer,
    });
    cly.type = options.type;
    cly.name = options.name;
    cly.config = options;
    cly.show = options.visible;

    if (options.opacity) {
      cly.alpha = options.opacity;
    }
    return cly;
  }
  createDEMLayer(options) {
    let res = {};
    res.dem = new Cesium.CesiumTerrainProvider({
      url: options.url,
    });
    if (options.url0) {
      res.dem0 = new Cesium.CesiumTerrainProvider({
        url: options.url0,
      });
    } else {
      res.dem0 = new Cesium.EllipsoidTerrainProvider();
    }

    res.dem.isCreateSkirt = false;
    res.dem0.isCreateSkirt = false;
    if (options.visible) {
      this.viewer.terrainProvider = res.dem;
    } else {
      this.viewer.terrainProvider = res.dem0;
    }

    return res;
  }
  createImageLayer(options) {
    let imgp = this._createImageryProvider(options);
    let ly = this.viewer.imageryLayers.addImageryProvider(imgp, options.index);

    ly.type = options.type;
    ly.config = options;
    ly.name = options.name;

    ly.show = options.visible;
    if (options.opacity) {
      ly.alpha = options.opacity;
    }
    return ly;
  }
  create3DTilesLayer(options) {
    var tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset(options)
    );

    tileset.type = options.type;
    tileset.config = options;
    tileset.name = options.name;

    tileset.show = options.visible;

    if (options.zOffset) {
      tileset.readyPromise.then((set) => {
        let cartographic = Cesium.Cartographic.fromCartesian(
          set.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0.0
        );
        let offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          lyOptions.zOffset
        );
        let translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        set.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      });
    }
    return tileset;
  }
  _createImageryProvider(options) {
    switch (options.type) {
    case 'ARCGISEXIMG':
      return new Cesium.CGCS2000MapServerImageryProvider(options);
    case 'ARCGISIMG':
      return new Cesium.ArcGisMapServerImageryProvider(options);
    case 'SMIMG':
      return new Cesium.SuperMapImageryProvider(options);
    case 'STIMG':
      return new Cesium.SingleTileImageryProvider(options);
    default:
      throw `暂不支持类型为${options.type}的栅格图层`;
    }
  }

  removeLayer(layer) {
    if ('visible' in layer) {
      layer.visible = false;
    } else if ('show' in layer) {
      layer.show = false;
    }

    if (isImageryLayer(layer.type)) {
      this.viewer.imageryLayers.remove(layer, true);
    } else if (layer.type === 'S3M') {
      this.viewer.scene.layers.remove(layer.name, true);
    } else if (layer.type === 'MVT') {
      this.viewer.scene.removeVectorTilesMap(layer.name);
    } else if (layer.type === '3DTILES') {
      this.viewer.scene.primitives.remove(layer);
    }
  }
}
