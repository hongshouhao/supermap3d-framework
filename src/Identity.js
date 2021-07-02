export default class Identity {
  constructor(viewer, dom) {
    viewer.customInfobox = dom

    viewer.pickEvent.addEventListener(function(feature) {
      debugger
      var title = Cesium.defaultValue(feature.NAME, '')
      var description = Cesium.defaultValue(feature.DES, '')
      title.innerText = title
      des.innerText = description
      myimg.src = './images/' + title + '.jpg'
    })
  }
}
