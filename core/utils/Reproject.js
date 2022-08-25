import proj4 from 'proj4';

const projDefs = {
  EPSG_3857:
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs',
  EPSG_4490: '+proj=longlat +ellps=GRS80 +no_defs +type=crs',
  EPSG_4528:
    '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
  EPSG_4549:
    '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
};

// // Checks if `list` looks like a `[x, y]`.
function isXY(list) {
  return (
    list.length >= 2 &&
    typeof list[0] === 'number' &&
    typeof list[1] === 'number'
  );
}

function traverseCoords(coordinates, callback) {
  if (isXY(coordinates)) return callback(coordinates);
  return coordinates.map(function (coord) {
    return traverseCoords(coord, callback);
  });
}

function clone(obj) {
  if (null == obj || 'object' !== typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function traverseGeoJson(geometryCb, nodeCb, geojson) {
  if (geojson == null) return geojson;

  var r = clone(geojson);
  var self = traverseGeoJson.bind(this, geometryCb, nodeCb);

  switch (geojson.type) {
  case 'Feature':
    r.geometry = self(geojson.geometry);
    break;
  case 'FeatureCollection':
    r.features = r.features.map(self);
    break;
  case 'GeometryCollection':
    r.geometries = r.geometries.map(self);
    break;
  default:
    geometryCb(r);
    break;
  }

  if (nodeCb) nodeCb(r);

  return r;
}

function detectCrs(geojson, projs) {
  var crsInfo = geojson.crs,
    crs;

  if (crsInfo === undefined) {
    throw new Error('Unable to detect CRS, GeoJSON has no "crs" property.');
  }

  if (crsInfo.type === 'name') {
    crs = projs[crsInfo.properties.name];
  } else if (crsInfo.type === 'EPSG') {
    crs = projs['EPSG:' + crsInfo.properties.code];
  }

  if (!crs) {
    throw new Error(
      'CRS defined in crs section could not be identified: ' +
        JSON.stringify(crsInfo)
    );
  }
  return crs;
}

function determineCrs(crs, projs) {
  if (typeof crs === 'string' || crs instanceof String) {
    return projs[crs] || proj4.Proj(crs);
  }

  return crs;
}

function calcBbox(geojson) {
  var min = [Number.MAX_VALUE, Number.MAX_VALUE],
    max = [-Number.MAX_VALUE, -Number.MAX_VALUE];
  traverseGeoJson(
    function (_gj) {
      traverseCoords(_gj.coordinates, function (xy) {
        min[0] = Math.min(min[0], xy[0]);
        min[1] = Math.min(min[1], xy[1]);
        max[0] = Math.max(max[0], xy[0]);
        max[1] = Math.max(max[1], xy[1]);
      });
    },
    null,
    geojson
  );
  return [min[0], min[1], max[0], max[1]];
}

export function reproject(geojson, from, to, projs) {
  projs = projs || projDefs;
  if (!from) {
    from = detectCrs(geojson, projs);
  } else {
    from = determineCrs(from, projs);
  }

  to = determineCrs(to, projs);

  var transformFunc = proj4(from, to).forward.bind(transformFunc);

  function transform(coords) {
    var transformed = transformFunc(coords);
    if (
      coords.length === 3 &&
      coords[2] !== undefined &&
      transformed[2] === undefined
    ) {
      // If the projection doesn't explicitly handle Z coordinate, retain the old one.
      transformed[2] = coords[2];
    }
    return transformed;
  }

  var transformGeometryCoords = function (gj) {
    // No easy way to put correct CRS info into the GeoJSON,
    // and definitely wrong to keep the old, so delete it.
    if (gj.crs) {
      delete gj.crs;
    }
    gj.coordinates = traverseCoords(gj.coordinates, transform);
  };

  var transformBbox = function (gj) {
    if (gj.bbox) {
      gj.bbox = calcBbox(gj);
    }
  };

  return traverseGeoJson(transformGeometryCoords, transformBbox, geojson);
}

export function toWgs84(geojson, from, projs) {
  return reproject(geojson, from, proj4.WGS84, projs);
}

export function reverse(geojson) {
  return traverseGeoJson(
    function (gj) {
      gj.coordinates = traverseCoords(gj.coordinates, function (xy) {
        return [xy[1], xy[0]];
      });
    },
    null,
    geojson
  );
}
