import axios from 'axios'
import { isPromise } from '../utils/IfUtility'

export default class PopupDataAccess {
  constructor() {}

  getDataForPrimitive(object) {
    let lyName = object.primitive.name
    let oid = object.id

    // let idx = lyName.indexOf('-s3mrender')
    // if (idx > -1) {
    //   lyName = lyName.substr(0, idx)
    // }

    let ly = window.s3d.getLayer(lyName)
    if (ly.config.datasetName) {
      return window.s3d
        .query({ layer: lyName, ids: [oid] })
        .then((response) => {
          if (response.data.features.length > 0) {
            let feature = response.data.features[0]
            let data = this.convertS3mFeatureToDataObject(lyName, feature)
            return data
          }
        })
    } else {
      let data = {
        object: {
          id: oid,
          layer: lyName,
        },
      }

      return new Promise(function(resolve) {
        if (!ly.config.outFields) {
          ly.config.outFields = ['*']
        }
        if (
          ly.config.outFields instanceof Array &&
          ly.config.outFields.length > 0
        ) {
          ly.getAttributesById(oid).then((atts) => {
            if (ly.config.outFields[0] === '*') {
              data.object.attributes = atts
            } else {
              for (let f of ly.config.outFields) {
                data.object.attributes[f] = atts[f]
              }
            }
            resolve(data)
          })
        }
      })
    }
  }

  convertS3mFeatureToDataObject(layerName, feature) {
    let data = {
      object: {
        id: feature.ID,
        layer: layerName,
      },
    }
    data.position = {
      longitude: feature.geometry.position.x,
      latitude: feature.geometry.position.y,
      height: feature.geometry.position.z,
    }

    data.object.attributes = {}

    let lconfig = window.s3d.getLayerConfig(data.object.layer)
    if (
      lconfig.outFields &&
      lconfig.outFields instanceof Array &&
      lconfig.outFields.length > 0
    ) {
      if (lconfig.outFields[0] === '*') {
        for (let i = 0; i < feature.fieldNames.length; i++) {
          let field = feature.fieldNames[i]
          let value = feature.fieldValues[i]
          data.object.attributes[field] = value
        }
      } else {
        for (let field of lconfig.outFields) {
          let idx = feature.fieldNames.indexOf(field)
          if (idx > 0) {
            let field = feature.fieldNames[idx]
            let value = feature.fieldValues[idx]
            data.object.attributes[field] = value
          }
        }
      }
    }
    return data
  }

  getDataForMVT(lyName, feature) {
    let oid = feature.id
    let ly = window.s3d.getLayer(lyName)
    if (ly.config.datasetName) {
      return window.s3d
        .query({ layer: lyName, ids: [oid] })
        .then((response) => {
          if (response.data.features.length > 0) {
            let feature = response.data.features[0]
            let data = this.convertS3mFeatureToDataObject(lyName, feature)
            return data
          }
        })
    } else {
      let lconfig = ly.config
      let attrs = {}
      if (
        lconfig.outFields &&
        lconfig.outFields instanceof Array &&
        lconfig.outFields.length > 0
      ) {
        if (lconfig.outFields[0] === '*') {
          attrs = feature.properties
        } else {
          for (let field of lconfig.outFields) {
            if (field in feature.properties) {
              attrs[field] = feature.properties[field]
            }
          }
        }
      }

      let data = {
        object: {
          id: oid,
          layer: lyName,
          attributes: attrs,
        },
        position: {},
      }
      return data
    }
  }

  queryOverUnselectableLayer(layerName, position) {
    let lconfig = window.s3d.getLayerConfig(layerName)
    if (!lconfig.iQuery) {
      throw `配置错误: 图层[${layerName}]无法i查询`
    }
    if (typeof lconfig.iQuery.getData === 'function') {
      let res = lconfig.iQuery.getData(position)
      if (isPromise(res)) {
        return res
      } else {
        return Promise.resolve(res)
      }
    } else if (lconfig.iQuery.dataUrl) {
      return axios
        .get(lconfig.iQuery.dataUrl, {
          params: {
            lon: position.longitude,
            lat: position.latitude,
            height: position.height,
          },
        })
        .then((response) => {
          if (typeof lconfig.iQuery.transform === 'function') {
            return lconfig.iQuery.transform(response.data)
          } else {
            return response.data
          }
        })
    }
  }
}
