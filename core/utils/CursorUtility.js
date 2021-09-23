import $ from 'jquery'

export function setCursorStyle(className) {
  let clist = _getClassList()
  if (clist) {
    for (let cls of _getCursorList(clist)) {
      clist.remove(cls)
    }
  }
  clist.add(className)
}

export function resetCursorStyle() {
  let clist = _getClassList()
  if (clist) {
    for (let cls of _getCursorList(clist)) {
      clist.remove(cls)
    }
  }
  setCursorStyle('cursor-default')
}

export function enableCursorStyle(viewer) {
  viewer.enableCursorStyle = true
  setCursorStyle('cursor-default')
  let md = false
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function() {
    md = true
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  handler.setInputAction(function() {
    md = false
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
  handler.setInputAction(function() {
    if (viewer.enableCursorStyle) {
      if (md) {
        setCursorStyle('cursor-grabbing')
      } else {
        setCursorStyle('cursor-default')
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

function _getClassList() {
  return $('.cesium-viewer')[0].classList
}
function _getCursorList(clist) {
  if (!clist) {
    return []
  }
  let rlist = []
  for (let i = 0; i < clist.length; i++) {
    let cls = clist.item(i)
    if (cls.startsWith('cursor-')) {
      rlist.push(cls)
    }
  }

  return rlist
}
