var shapefile = require('shapefile')
export default class DataUtility {
  constructor(viewer) {
    this.viewer = viewer
  }

  /*
  geojson: 即geojson
  options：见 GeoJsonDataSource.load(geojson, options)
  dsName: 用来管理datasource
   */
  loadGeoJson(geojson, options, dsName) {
    let opt = options ?? {
      stroke: Cesium.Color.RED,
      fill: Cesium.Color.BLUE.withAlpha(0.3),
      strokeWidth: 1,
      clampToGround: true,
    }
    return Cesium.GeoJsonDataSource.load(geojson, opt).then((res) => {
      res.name = dsName ? `temp_${dsName}` : 'temp_ds'
      this.viewer.dataSources.add(res)
      return res
    })
  }

  clearGeoJson() {
    for (let i = 0; i < this.viewer.dataSources.length; i++) {
      let ds = this.viewer.dataSources.get(i)
      if (ds.name.startsWith('temp_')) {
        this.viewer.dataSources.remove(ds, true)
      }
    }
  }

  loadShapefile(url, options, dsName) {
    let coll = { type: 'FeatureCollection', features: [] }
    let _this = this
    return shapefile
      .open(url)
      .then((source) =>
        source.read().then(function read(result) {
          if (result.done) {
            return _this.loadGeoJson(coll, options, dsName)
          } else {
            coll.features.push(result.value)
            return source.read().then(read)
          }
        })
      )
      .catch((error) => console.error(error.stack))
  }

  loadTrailLineFromGeoJson(geojson, options, dsName) {
    return this.loadGeoJson(geojson, null, dsName).then((ds) => {
      return this._createTrailLine(ds, options)
    })
  }
  loadTrailLineFromShapefile(url, options, dsName) {
    return this.loadShapefile(url, null, dsName).then((ds) => {
      return this._createTrailLine(ds, options)
    })
  }

  //尾迹线
  //materialOptions: 见PolylineTrailMaterialProperty, 此外多个width属性
  _createTrailLine(ds, materialOptions) {
    let dataSource = new Cesium.CustomDataSource(ds.name)

    for (let ent of ds.entities.values) {
      if (ent.polyline) {
        dataSource.entities.add({
          polyline: {
            positions: ent.polyline.positions._value,
            width: materialOptions.width ?? 4,
            material: new Cesium.PolylineTrailMaterialProperty(materialOptions),
          },
        })
      }
    }

    this.viewer.dataSources.remove(ds, true)
    this.viewer.dataSources.add(dataSource)

    return dataSource
  }
}
