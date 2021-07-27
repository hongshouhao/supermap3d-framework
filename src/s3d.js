import Toolbar from './tools/Toolbar'

export function setup(config) {
  window.s3d = new S3D(config)
}

class S3D {
  constructor(config) {
    if (!config.iServerBaseURL) throw '参数不能为空: iServerBaseURL'
    if (!config.layers) throw '参数不能为空: layers'
    if (!config.defaultCamera) throw '参数不能为空: defaultCamera'
    if (!config.baseMapEarth) throw '参数不能为空: baseMapEarth'
    if (!config.baseMapNormal) throw '参数不能为空: baseMapNormal'

    this.config = config
    this.toolbar = new Toolbar()
  }
}
