import DataAccessWrapper from './DataAccessWrapper';

export default class SelectedChangedEvent {
  constructor(viewer) {
    this.viewer = viewer;
    this.listened = false;
    this.autoGetPropData = true;

    this.dataAccess = new DataAccessWrapper(viewer);

    this.includingMVT = true;
    this.selectedMvtFeature = null;
    this.selectedFeatures = null;
  }

  startListening() {
    debugger;
    if (this.listened) {
      return;
    }

    this._addListenerForMVT();

    let _this = this;
    this.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(
      _this.viewer.scene.canvas
    );
    this.mouseEventHandler.setInputAction(function (e) {
      let position = _this.viewer.scene.pickPosition(e.position);
      let coordinate = window.s3d.getCoordinate(e.position);
      if (_this.includingMVT && _this.selectedMvtFeature) {
        if (_this.autoGetPropData) {
          let layerName = _this.selectedMvtFeature.object.layer;
          let lconf = window.s3d.layerManager.getLayerConfig(layerName);
          if (lconf.iQuery) {
            _this.dataAccess
              .dataFromiQuery(layerName, coordinate)
              .then((data) => {
                _this.selectedFeatures = [data];
                _this._dispatch(_this.selectedFeatures);
              });
          } else {
            _this.selectedFeatures = [_this.selectedMvtFeature];
            _this._dispatch(_this.selectedFeatures);
          }
        }
      } else {
        let pikObjs = window.s3d.pickObject(e.position);
        if (pikObjs.length > 0) {
          if (_this.autoGetPropData) {
            let calls = pikObjs.map((x) => {
              if (x.id instanceof Cesium.Entity && !x.id.ignorePopup) {
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
                  _this.selectedFeatures = result;
                  _this._dispatch(_this.selectedFeatures);
                } else {
                  _this.selectedFeatures = [];
                  _this._dispatch(_this.selectedFeatures);
                }
              })
              .catch((err) => {
                _this.selectedFeatures = [];
                console.error(err);
              });
          } else {
            _this.selectedFeatures = pikObjs;
            _this._dispatch(_this.selectedFeatures);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.listened = true;
  }

  stopListening() {
    if (this.mouseEventHandler) {
      this.mouseEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
    }

    if (this.mvtEventListener) {
      this.mvtEventListener();
    }
  }

  _addListenerForMVT() {
    let _this = this;
    _this.mvtEventListener =
      _this.viewer.selectedEntityChanged.addEventListener(function (entity) {
        if (entity && entity.pickResult) {
          let layerName = entity.pickResult.mapName;
          let features = entity.pickResult[entity.pickResult['layerID']];
          let fItem = features.find(
            (x) => x.feature.id === entity.pickResult.featureID
          );

          if (fItem) {
            if (_this.autoGetPropData) {
              _this.dataAccess
                .dataFromMVTFeature(layerName, fItem.feature)
                .then((data) => {
                  _this.selectedMvtFeature = data;
                });
            } else {
              _this.selectedMvtFeature = fItem.feature;
            }
          } else {
            _this.selectedMvtFeature = null;
          }
        }
      });
  }

  _dispatch(features) {
    window.s3d.eventBus.dispatch('selected-features-changed', null, features);
  }
}
