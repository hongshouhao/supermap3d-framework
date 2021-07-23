import $ from 'jquery'

export function setCursor(className) {
  viewer.enableCursorStyle = false
  $('.cesium-viewer')
    .removeClass(className)
    .addClass(className)
}

export function resetCursor(className) {
  viewer.enableCursorStyle = true
  $('.cesium-viewer').removeClass(className)
}
