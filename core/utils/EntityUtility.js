import { kml } from '@tmcw/togeojson'

Cesium.Entity.prototype.toGeoJson = function() {
  let coll = new Cesium.EntityCollection(this.entityCollection.owner)
  coll.add(this)
  return coll.toGeoJson().then((result) => {
    return result.features[0]
  })
}

Cesium.EntityCollection.prototype.toGeoJson = function() {
  let ents = this
  return new Promise(function(resolve) {
    Cesium.exportKml({
      entities: ents,
    }).then(function(result) {
      let dom = new DOMParser().parseFromString(result.kml, 'application/xml')
      let json = kml(dom)
      resolve(json)
    })
  })
}
