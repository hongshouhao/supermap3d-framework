import { createImageryProvider } from '../utils/ImageryUtility';

export default class BasemapUtility {
  constructor(viewer, config, eventBus) {
    this.viewer = viewer;
    this.eventBus = eventBus;
    this.mapsConfig = config.baseMaps;
    this._initMapConfig();

    // 白天还是夜晚
    // this.mode = 'night'
  }

  _initMapConfig() {
    let i = 0;
    for (let mapKey in this.mapsConfig) {
      if (mapKey === 'none') {
        continue;
      }
      let mapConf = this.mapsConfig[mapKey];
      for (let mapParams of mapConf.maps) {
        mapParams.name = `${mapParams.type}_${i}`;
        i++;
      }
    }
  }

  createBasemaps() {
    for (let mapKey in this.mapsConfig) {
      let mapConf = this.mapsConfig[mapKey];
      if (mapConf.default) {
        this.toggleMap(mapKey);
      }
    }
  }

  toggleMap(type) {
    if (this.currentMaps) {
      for (let map of this.currentMaps) {
        this.viewer.imageryLayers.remove(map, true);
      }
    }

    if (type === 'none') {
      this.viewer.scene.globe.globeAlpha = 0;
      // this.viewer.scene.globe.show = false;
      this.viewer.scene.skyBox.show = false;
      this.viewer.scene.skyAtmosphere.show = false;

      this.currentMaps = null;
      this.eventBus.dispatch('basemap-changed', null, {
        type: type,
        currentMaps: null,
      });
    } else {
      this.viewer.scene.globe.globeAlpha = 1;
      // this.viewer.scene.globe.show = true;
      this.viewer.scene.skyBox.show = true;
      this.viewer.scene.skyAtmosphere.show = true;
      let alpha = this.getCurrentMapAlpha(type);
      let mapsToCreate = this.getMapsToCreate(type);
      this.currentMaps = mapsToCreate.map((mapParams) => {
        let map = this.createMap(mapParams);
        map.alpha = alpha;
        return map;
      });

      this.eventBus.dispatch('basemap-changed', null, {
        type: type,
        currentMaps: this.currentMaps,
      });
    }
  }

  getCurrentMapAlpha() {
    if (this.currentMaps && this.currentMaps.length > 0) {
      return this.currentMaps[0].alpha;
    } else {
      return 1;
    }
  }

  getMapsToCreate(type) {
    if (type === 'none') {
      return [];
    } else {
      let mapParams = [];
      for (let mapKey in this.mapsConfig) {
        let mapconf = this.mapsConfig[mapKey];
        if (mapKey === type) {
          for (let map of mapconf.maps) {
            if (map.mode) {
              if (this.mode === map.mode) {
                mapParams.push(map);
              }
            } else {
              mapParams.push(map);
            }
          }
        }
      }

      return mapParams;
    }
  }

  createMap(mapParams) {
    let lys = this.viewer.imageryLayers._layers.filter(
      (x) => x.isBaseMap == true
    );

    let mapProvider = createImageryProvider(mapParams);
    let map = this.viewer.imageryLayers.addImageryProvider(
      mapProvider,
      lys.length
    );
    map.isBaseMap = true;
    map.type = mapParams.type;
    map.mode = mapParams.mode;
    map.name = mapParams.name;
    return map;
  }
}
