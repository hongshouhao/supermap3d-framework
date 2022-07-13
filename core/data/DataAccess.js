import axios from 'axios';
import { isPromise } from '../utils/IfUtility';
import { convertGeoJsonFromLL2Proj } from '../utils/CesiumMath';
import * as turf from '@turf/turf';

export default class DataAccess {
  constructor(viewer) {
    this.viewer = viewer;
  }

  dataFromEntity(entity, getPosition) {
    let _this = this;
    return entity.toGeoJson().then((geojson) => {
      convertGeoJsonFromLL2Proj(_this.viewer.scene, geojson);
      let attrs = {};
      if (entity.attributes) {
        attrs = entity.attributes;
      } else if (entity.properties != null) {
        for (let pName of entity.properties._propertyNames) {
          attrs[pName] = entity.properties[pName]._value;
        }
      }
      let center = turf.center(geojson);
      let data = {
        sourceType: 'ENTITY',
        object: {
          layer: entity.name,
          id: entity.id,
          attributes: attrs,
          shape: geojson,
        },
        position: {
          x: center.geometry.coordinates[0],
          y: center.geometry.coordinates[1],
          z: 0,
        },
      };
      return data;
    });
  }

  dataFromPrimitive(modelObj) {
    let lyName = modelObj.primitive.name;
    let oid = modelObj.id;

    let data = {
      sourceType: 'PRIMITIVE',
      object: {
        id: oid,
        layer: lyName,
      },
    };
    return data;
  }

  dataFromSMFeature(feature, fields) {
    let data = {
      sourceType: 'S3MFEATURE',
      source: feature,
      object: {
        id: feature.ID,
        attributes: {},
      },
      position: {
        longitude: feature.geometry.position.x,
        latitude: feature.geometry.position.y,
        height: feature.geometry.position.z,
      },
    };

    for (let i = 0; i < feature.fieldNames.length; i++) {
      let field = feature.fieldNames[i];
      let value = feature.fieldValues[i];
      data.object.attributes[field] = value;
    }

    this._deleteProperty(data.object.attributes, fields);
    return data;
  }

  dataFrom3DTiles(modelObj) {
    let lyName = modelObj.tileset.name;
    let attrs = {};
    let propNames = modelObj.getPropertyNames();
    for (let key of propNames) {
      attrs[key] = modelObj.getProperty(key);
    }

    let data = {
      sourceType: 'PRIMITIVE',
      object: {
        layer: lyName,
        attributes: attrs,
      },
    };
    return data;
  }

  dataFromMVTFeature(feature, fields) {
    let data = {
      sourceType: 'MVTFEATURE',
      source: feature,
      object: {
        id: feature.id,
        attributes: feature.properties,
      },
      position: {},
    };
    this._deleteProperty(data.object.attributes, fields);
    return data;
  }

  dataFromDataset(options, fields) {
    return this.queryOverDataset(
      options.dataUrl,
      options.datasetName,
      options.sql,
      options.ids
    ).then((response) => {
      return response.data.features.map((f) =>
        this.dataFromSMFeature(f, fields)
      );
    });
  }

  dataFromiQuery(options, position) {
    if (typeof options.getData === 'function') {
      let res = options.getData(position);
      if (isPromise(res)) {
        return res.then((result) => {
          result.sourceType = 'IQUERY';
          return result;
        });
      } else {
        res.sourceType = 'IQUERY';
        return Promise.resolve(res);
      }
    } else if (options.dataUrl) {
      return axios
        .get(options.dataUrl, {
          params: {
            lon: position.longitude,
            lat: position.latitude,
            height: position.height,
          },
        })
        .then((response) => {
          if (typeof options.transform === 'function') {
            let result = options.transform(response.data);
            result.sourceType = 'IQUERY';
            return result;
          } else {
            let result = response.data;
            result.sourceType = 'IQUERY';
            return result;
          }
        });
    }
  }

  queryOverDataset(dataUrl, datasetName, sql, ids) {
    let queryParameter = null;
    if (sql && sql.length > 0) {
      queryParameter = {
        datasetNames: [datasetName],
        getFeatureMode: 'SQL',
        queryParameter: {
          attributeFilter: sql,
        },
      };
    } else if (ids instanceof Array && ids.length > 0) {
      queryParameter = {
        datasetNames: [datasetName],
        getFeatureMode: 'ID',
        ids: ids,
      };
    } else {
      throw '暂不支持此查询';
    }
    return axios.post(dataUrl, queryParameter);
  }

  spatialQueryOverDataset(dataUrl, datasetName, geometry, spatialRelation) {
    let queryParameter = {
      datasetNames: [datasetName],
      getFeatureMode: 'SPATIAL',
      spatialQueryMode: spatialRelation,
      geometry: geometry,
    };
    return axios.post(dataUrl, queryParameter);
  }

  queryOver(dataUrl, parameters) {
    return axios.post(dataUrl, parameters);
  }

  _deleteProperty(obj, fields) {
    if (fields && fields instanceof Array && fields.length > 0) {
      for (let f of fields) {
        if (f in obj) {
          delete obj[f];
        }
      }
    }
  }
}
