export function boxCornersFromFeature(feature) {
  let pts = []
  pts.push(
    Cesium.Cartesian3.fromDegrees(
      feature.geometry.boundingBox.lower.x,
      feature.geometry.boundingBox.lower.y,
      feature.geometry.boundingBox.lower.z + feature.geometry.position.z
    )
  )
  pts.push(
    Cesium.Cartesian3.fromDegrees(
      feature.geometry.boundingBox.upper.x,
      feature.geometry.boundingBox.upper.y,
      feature.geometry.boundingBox.upper.z + feature.geometry.position.z
    )
  )
  return pts
}

export function boundingSphereFromFeature(feature) {
  let pts = boxCornersFromFeature(feature)
  return Cesium.BoundingSphere.fromPoints(pts)
}
