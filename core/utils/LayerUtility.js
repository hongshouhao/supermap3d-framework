import { isImageryLayer } from './ImageryUtility';

export function getLayerOpacity(layer) {
  if ((layer && isImageryLayer(layer.type)) || layer.type === 'MVT') {
    return layer.alpha;
  } else if (layer && layer.type === 'S3M') {
    if (layer.style3D?.fillForeColor) {
      return layer.style3D.fillForeColor.alpha;
    } else {
      return 1;
    }
  }
}

export function setLayerOpacity(layer, opacity) {
  if ((layer && isImageryLayer(layer.type)) || layer.type === 'MVT') {
    layer.alpha = opacity;
  } else if (layer && layer.type === 'S3M') {
    layer.style3D.fillForeColor = new Cesium.Color(1.0, 1.0, 1.0, opacity);
  }
}

export function setLayerVisible(layer, visible) {
  if ('show' in layer) {
    layer.show = visible;
  } else if ('visible' in layer) {
    layer.visible = visible;
  }
}
