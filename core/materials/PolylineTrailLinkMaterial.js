function PolylineTrailLinkMaterial(color, duration, d) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = color;
  this.duration = duration || 3000;
  this._time = new Date().getTime();
  this._d = d;
  this.isTranslucent = function() {
    return true;
  };
}
Object.defineProperties(PolylineTrailLinkMaterial.prototype, {
  isConstant: {
    get: function() {
      return false;
    },
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
});
// eslint-disable-next-line no-unused-vars
PolylineTrailLinkMaterial.prototype.getType = function(time) {
  return 'PolylineTrailLink';
};
PolylineTrailLinkMaterial.prototype.getValue = function(time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  );
  result.image = Cesium.Material.PolylineTrailLinkImage;
  result.time =
    (((new Date().getTime() - this._time) % this.duration) / this.duration) *
    this._d;
  return result;
};
PolylineTrailLinkMaterial.prototype.equals = function(other) {
  return (
    this === other ||
    (other instanceof PolylineTrailLinkMaterial &&
      Property.equals(this._color, other._color))
  );
};

Cesium.PolylineTrailLinkMaterial = PolylineTrailLinkMaterial;
Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
// Cesium.Material.PolylineTrailLinkImage = './img/arrow.png'
Cesium.Material.PolylineTrailLinkImage =
  'https://upload-images.jianshu.io/upload_images/6957972-c5f879cd86b79dfd.png?imageMogr2/auto-orient/strip|imageView2/2/w/512';

Cesium.Material.PolylineTrailLinkSource =
  ' czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                        {\n\
                                                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                            vec2 st = materialInput.st;\n\
                                                            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                            material.alpha = colorImage.a * color.a;\n\
                                                            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                            return material;\n\
                                                        }';
