import extent from '@turf/bbox';
import inside from '@turf/boolean-point-in-polygon';
import { randomPoint } from '@turf/random';

export function randomSamplingPointsOnPolygon(polygon, number) {
  if (number < 1) {
    throw 'Number must be >= 1';
  }

  if (
    polygon.geometry.type !== 'Polygon' &&
    polygon.geometry.type !== 'MutliPolygon'
  ) {
    throw 'Polygon parameter must be a Feature<(Polygon|MultiPolygon)>';
  }

  let points = [];
  let bbox = extent(polygon);
  let count = Math.round(parseFloat(number));

  for (let i = 0; i <= count; i++) {
    if (i === count) {
      return points;
    }

    let point = randomPoint(1, { bbox: bbox });

    if (inside(point.features[0], polygon) === false) {
      i = --i;
    }

    if (inside(point.features[0], polygon) === true) {
      points.push(point.features[0].geometry);
    }
  }
}

export function gridSamplingPointsOnPolygon(polygon, resolution) {
  if (resolution < 0) {
    throw 'resolution must be > 0';
  }

  if (
    polygon.geometry.type !== 'Polygon' &&
    polygon.geometry.type !== 'MutliPolygon'
  ) {
    throw 'Polygon parameter must be a Feature<(Polygon|MultiPolygon)>';
  }

  let points = [];
  let bbox = extent(polygon);
  let minx = bbox[0];
  let miny = bbox[1];

  let maxx = bbox[2];
  let maxy = bbox[3];
  for (let x = minx; x < maxx; x = x + resolution) {
    for (let y = miny; y < maxy; y = y + resolution) {
      let point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [x, y],
        },
        properties: {},
      };
      if (inside(point, polygon) === true) {
        points.push({
          type: 'Point',
          coordinates: [x, y],
        });
      }
    }
  }

  return points;
}
