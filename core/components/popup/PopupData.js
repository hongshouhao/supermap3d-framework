import DataAccess from '../../data/DataAccess';
export default class PopupData {
  constructor() {
    this.dataAccess = new DataAccess();
  }

  dataFromPrimitive(primitive) {
    let oid = primitive.id;
    let layerName = primitive.primitive.name;
    let lconf = window.s3d.layerManager.getLayerConfig(layerName);
    if (lconf.datasetName) {
      return this.dataFromDataset({
        layer: layerName,
        ids: [oid],
      }).then((result) => {
        if (result.length > 0) {
          return result[0];
        } else {
          return null;
        }
      });
    } else {
      let _this = this;
      return new Promise(function(resolve) {
        let result = _this.dataAccess.dataFromPrimitive(primitive);
        resolve(result);
      });
    }
  }

  dataFromMVTFeature(layerName, feature) {
    let lconf = window.s3d.layerManager.getLayerConfig(layerName);
    if (lconf.datasetName) {
      return this.dataFromDataset({
        layer: layerName,
        ids: [feature.id],
      });
    } else {
      let _this = this;
      return new Promise(function(resolve) {
        let result = _this.dataAccess.dataFromMVTFeature(
          feature,
          lconf.outFields
        );
        result.object.layer = layerName;
        resolve(result);
      });
    }
  }

  dataFromEntity(entity) {
    let result = this.dataAccess.dataFromEntity(entity);
    return Promise.resolve(result);
  }

  dataFromSMFeature(layerName, feature) {
    let lconf = window.s3d.layerManager.getLayerConfig(data.object.layer);
    let result = this.dataAccess.dataFromSMFeature(feature, lconf.outFields);
    result.object.layer = layerName;
    return result;
  }

  dataFromiQuery(layerName, position) {
    let lconf = window.s3d.layerManager.getLayerConfig(layerName);
    if (!lconf.iQuery) {
      throw `配置错误: 图层[${layerName}]无法i查询`;
    }
    return this.dataAccess
      .dataFromiQuery(lconf.iQuery, position)
      .then((data) => {
        if (data) {
          data.object.layer = layerName;
          if (!data.position) {
            data.position = position;
          }
        }
        return data;
      });
  }

  /*
  params: {
    layer: ""
    sql: "",   (二选一)
    ids:[] (二选一)
  }
  */
  dataFromDataset(params) {
    let layerName = params.layer;
    let lconf = window.s3d.layerManager.getLayerConfig(layerName);
    if (!lconf.datasetName) {
      throw `图层(${layerName})配置错误: "datasetName"为空`;
    }

    let dataUrl = '';
    if (lconf.dataUrl) {
      dataUrl = lconf.dataUrl;
    } else {
      let layer = window.s3d.layerManager.getLayer(layerName);
      dataUrl = this._getDefaultDataUrl(layer);
    }

    return this.dataAccess
      .dataFromDataset(
        {
          dataUrl: dataUrl,
          datasetName: lconf.datasetName,
          sql: params.sql,
          ids: params.ids,
        },
        lconf.outFields
      )
      .then((list) => {
        list.forEach((data) => {
          data.object.layer = layerName;
        });

        return list;
      });
  }

  _getDefaultDataUrl(layer) {
    let url = `${layer._baseUri.scheme}://${layer._baseUri.authority}${layer._baseUri.path}`;
    let parts = url.split('/rest/realspace/');
    url = parts[0] + '/rest/data/featureResults.json?returnContent=true';
    return url.replace('/iserver/services/3D-', '/iserver/services/data-');
  }
}
