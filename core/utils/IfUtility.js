export function isS3mFeature(obj) {
  return obj.ID && obj.geometry && obj.fieldNames && obj.fieldValues
}

export function isCartesian3(obj) {
  return obj.x && obj.y && obj.z
}

export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}
