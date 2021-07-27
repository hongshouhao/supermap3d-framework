import $ from 'jquery'

export function setCursor(viewer, className) {
  viewer.enableCursorStyle = false
  $('.cesium-viewer')
    .removeClass(className)
    .addClass(className)
}

export function resetCursor(viewer, className) {
  viewer.enableCursorStyle = true
  $('.cesium-viewer').removeClass(className)
}
