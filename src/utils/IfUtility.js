export function isS3mFeature(obj) {
  return obj.ID && obj.geometry && obj.fieldNames && obj.fieldValues
}

export function isCartesian3(obj) {
  return obj.x && obj.y && obj.z
}
