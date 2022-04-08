import {
  randomSamplingPointsOnPolygon,
  gridSamplingPointsOnPolygon,
} from './Sampling';

export function boxCornersFromFeature(feature) {
  let pts = [];
  pts.push(
    Cesium.Cartesian3.fromDegrees(
      feature.geometry.boundingBox.lower.x,
      feature.geometry.boundingBox.lower.y,
      feature.geometry.boundingBox.lower.z + feature.geometry.position.z
    )
  );
  pts.push(
    Cesium.Cartesian3.fromDegrees(
      feature.geometry.boundingBox.upper.x,
      feature.geometry.boundingBox.upper.y,
      feature.geometry.boundingBox.upper.z + feature.geometry.position.z
    )
  );
  return pts;
}

export function boundingSphereFromFeature(feature) {
  let pts = boxCornersFromFeature(feature);
  return Cesium.BoundingSphere.fromPoints(pts);
}

export function randomSamplingPointsInPolygon(polygon, count, terrainProvider) {
  let points = randomSamplingPointsOnPolygon(polygon, count);
  if (terrainProvider) {
    return _sampleTerrain(points, terrainProvider);
  } else {
    return points;
  }
}

export function gridSamplingPointsInPolygon(
  polygon,
  resolution,
  terrainProvider
) {
  let points = gridSamplingPointsOnPolygon(polygon, resolution);
  if (terrainProvider) {
    return _sampleTerrain(points, terrainProvider);
  } else {
    return points;
  }
}

function _sampleTerrain(points, terrainProvider) {
  let positions = points.map((pt) => {
    return Cesium.Cartographic.fromDegrees(pt.coordinates[0], pt.coordinates[1]);
  });
  var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
  return Cesium.when(promise, (updatedPositions) => {
    return updatedPositions.map((cartographic) => {
      return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      };
    });
  });
}
