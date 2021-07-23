export default class MultiViewportTool {
  constructor(viewer) {
    this.viewer = viewer
    this.viewer.scene.multiViewportMode = Cesium.MultiViewportMode.HORIZONTAL
  }
}
