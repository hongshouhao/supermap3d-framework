export function JsStringify(obj) {
  return JSON.stringify(obj, function (key, val) {
    if (typeof val === 'function') {
      return val + '';
    }
    return val;
  });
}
