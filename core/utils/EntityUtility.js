import { reproject } from './Reproject';
import { kml } from '@tmcw/togeojson';

Cesium.Entity.prototype.toGeoJson = function (destSR) {
  let coll = new Cesium.EntityCollection(this.entityCollection.owner);
  coll.add(this);
  return coll.toGeoJson(destSR).then((result) => {
    return result.features[0];
  });
};

Cesium.EntityCollection.prototype.toGeoJson = function (destSR) {
  let ents = this;
  return new Promise(function (resolve) {
    Cesium.exportKml({
      entities: ents,
    }).then(function (result) {
      let dom = new DOMParser().parseFromString(result.kml, 'application/xml');
      let coll = kml(dom);

      // 先简单处理，不考虑复杂图形
      for (let f of coll.features) {
        if (f.geometry.type === 'Polygon') {
          let polyCoords = f.geometry.coordinates[0];
          let start = polyCoords[0];
          let end = polyCoords[polyCoords.length - 1];
          if (
            start[0] !== end[0] ||
            start[1] !== end[1] ||
            start[2] !== end[2]
          ) {
            polyCoords.push(Array.from(start));
          }
        }
      }

      if (destSR) {
        if (destSR instanceof Number || typeof destSR === 'number') {
          if (destSR != 4490 && destSR != 4326) {
            let collProjed = reproject(
              coll,
              'EPSG_4490',
              'EPSG_' + destSR
            );
            resolve(collProjed);
          } else {
            resolve(coll);
          }
        } else {
          let collProjed = reproject(coll, 'EPSG_4490', destSR);
          resolve(collProjed);
        }
      } else {
        resolve(coll);
      }
    });
  });
};
