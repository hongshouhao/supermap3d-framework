export default class PickingUtility {
  constructor(scene) {
    this.scene = scene;
    Cesium.Scene.prototype.drillPickByDepth = (mousePosition, depth) =>
      this.drillPickByDepth(mousePosition, depth);
  }

  drillPickByDepth(mousePosition, depth) {
    var pickRay = this.scene.camera.getPickRay(mousePosition);
    let pickedObjects = this.scene.drillPickFromRay(pickRay);
    pickedObjects = pickedObjects.filter((x) => x.object);
    if (!pickedObjects || pickedObjects.length === 0) {
      return [];
    }

    let result = [pickedObjects[0].object];
    let start = pickedObjects[0].position;
    for (let i = 1; i < pickedObjects.length; i++) {
      let dis = Cesium.Cartesian3.distance(start, pickedObjects[i].position);
      if (dis < depth) {
        let pobj = pickedObjects[i].object;
        if (pobj && pobj.primitive && typeof pobj.id === 'string') {
          result.push(pobj);
        }
      } else {
        break;
      }
    }
    return result;
  }
}
