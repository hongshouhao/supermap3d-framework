import { gridSamplingPointsInPolygon } from '../../utils/CesiumUtility';
import { toSimplePolygon } from '../../utils/GeoJsonUtility';

export default class SubmergedTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.maxHeight = 20;
    this.minHeight = 0;
    this.speed = 3;
    this.layerNames = [];
    this.sampleResolution = 0.0002;
  }

  setTargetLayers(layerNames) {
    this.layerNames = layerNames;
    return this;
  }

  includingGlobe() {
    this._includingGlobe = true;
    return this;
  }

  // positions: [lon1,lat1,height1,lon2,lat2,height2....]
  setCoverageArea(positions) {
    this.positions = positions;
    return this;
  }

  excludingGlobe() {
    this._includingGlobe = false;
    return this;
  }

  getSubmergedArea() {
    if (this._includingGlobe) {
      let polygon = toSimplePolygon(this.positions, true);
      let result = gridSamplingPointsInPolygon(
        polygon,
        this.sampleResolution,
        this.viewer.terrainProvider
      );
      let _this = this;
      return result.then((samplePts) => {
        return samplePts.filter((x) => x.height < _this.maxHeight);
      });
    } else {
      return Promise.resolve([]);
    }
  }

  start() {
    this.layers = [];
    for (let lname of this.layerNames) {
      let ly = window.s3d.layerManager.getLayer(lname);
      if (!ly) {
        throw `没有找到对应图层(${lname})，请确定图层是否已经加载或者图层名是否正确`;
      }
      this.layers.push(ly);
    }

    if (!this.defaultGlobeHypsometricSetting) {
      this.defaultGlobeHypsometricSetting = this.viewer.scene.globe.HypsometricSetting;
    }

    let currentHeight = 0;
    let _this = this;
    this._interval_Id = setInterval(() => {
      if (currentHeight > _this.maxHeight) {
        clearInterval(_this._interval_Id);
        _this._interval_Id = null;
        return;
      }

      let hyp = new Cesium.HypsometricSetting();
      hyp.MaxVisibleValue = currentHeight;
      hyp.MinVisibleValue = _this.minHeight;
      hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
      hyp.Opacity = 0.5;
      hyp.CoverageArea = _this.positions;
      // 等高线间隔
      hyp.LineInterval = 0.3;

      let colorTable = new Cesium.ColorTable();
      colorTable.insert(71, new Cesium.Color(210 / 255, 15 / 255, 15 / 255));
      colorTable.insert(54, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
      colorTable.insert(36, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
      colorTable.insert(18, new Cesium.Color(0, 161 / 255, 1));
      colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 212 / 255));
      hyp.ColorTable = colorTable;

      for (let ly of _this.layers) {
        try {
          ly.hypsometricSetting = {
            hypsometricSetting: hyp,
            analysisMode:
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
          };
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
      }

      if (_this._includingGlobe) {
        _this.viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
      }

      currentHeight += _this.speed / 10;
    }, 100);
  }

  clear() {
    if (this._interval_Id) {
      clearInterval(this._interval_Id);
      this._interval_Id = null;
    }

    if (this.layers) {
      for (let ly of this.layers) {
        try {
          ly.hypsometricSetting = {
            hypsometricSetting: undefined,
            analysisMode: 0,
          };
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
      }
    }

    if (this._includingGlobe) {
      this.viewer.scene.globe.HypsometricSetting = this.defaultGlobeHypsometricSetting;
    }
  }
}
