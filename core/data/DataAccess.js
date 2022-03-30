import axios from 'axios'
import { isPromise } from '../utils/IfUtility'

export default class DataAccess {
  constructor() {}

  dataFromEntity(entity) {
    let data = {
      sourceType: 'ENTITY',
      object: {
        layer: entity.name,
        id: entity.id,
        attributes: entity.attributes,
      },
      position: {
        longitude: entity.position._value.x,
        latitude: entity.position._value.y,
        height: entity.position._value.z,
      },
    }
    return data
  }

  dataFromPrimitive(primitive) {
    let lyName = primitive.primitive.name
    let oid = primitive.id
    debugger
    let data = {
      sourceType: 'PRIMITIVE',
      object: {
        id: oid,
        layer: lyName,
      },
    }
    return data
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
    }

    for (let i = 0; i < feature.fieldNames.length; i++) {
      let field = feature.fieldNames[i]
      let value = feature.fieldValues[i]
      data.object.attributes[field] = value
    }

    this._deleteProperty(data.object.attributes, fields)
    return data
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
    }
    this._deleteProperty(data.object.attributes, fields)
    return data
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
      )
    })
  }

  dataFromiQuery(options, position) {
    if (typeof options.getData === 'function') {
      let res = options.getData(position)
      if (isPromise(res)) {
        return res.then((result) => {
          result.sourceType = 'IQUERY'
          return result
        })
      } else {
        res.sourceType = 'IQUERY'
        return Promise.resolve(res)
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
            let result = options.transform(response.data)
            result.sourceType = 'IQUERY'
            return result
          } else {
            let result = response.data
            result.sourceType = 'IQUERY'
            return result
          }
        })
    }
  }

  queryOverDataset(dataUrl, datasetName, sql, ids) {
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

  _deleteProperty(obj, fields) {
    if (fields && fields instanceof Array && fields.length > 0) {
      for (let f of fields) {
        if (f in obj) {
          delete obj[f]
        }
      }
    }
  }
}
