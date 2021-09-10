# supermap3d-framework

## 开发说明
此项目为框架部分，业务系统依赖此项目进行开发，因为处于开发阶段，建议使用本地npm包模式，建议更新npm至最新版本
### 安装依赖项
```
npm install
```
### 引入依赖
1. 复制node_modules\supermap3d-framework\public\Cesium到当前项目public\Cesium
2. 修改index.html
```
<link href="Cesium/Widgets/widgets.css" rel="stylesheet" />
<script src="Cesium/Cesium.js"></script>
```
3. 配置参数
```
   见 config.js
```
4. 入口初始化(main.js)
```
import { setup, init } from 'supermap3d-framework/src/s3d'
setup(Vue)
import { config } from './config'
init(config)
```
5. vue配置(vue.config.js)
```
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('url-loader')
      .test(/\.(png|jpg|gif|cur)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  },
}
```
### Cesium常用接口
1. Cesium的笛卡尔三维坐标 new Cesium.Cartesian3(x,y,z)
2. 经纬度坐标 new Cesium.Cartographic(longitude,latitude,height)
   经纬度除了特殊说明，一般都是弧度radians单位，也就是π。
   弧度与角度的转换方法：
   Cesium.Cartographic.toDegrees()
   Cesium.Cartogrhpic.fromDegrees()
   Cesium.Math.toDegrees(radians)/toRadians(degree)

3. 经纬度与Cartesian3坐标之间
   Cesium.Cartographic.fromCartesian(cartesian3,ellipsoid,resullt) 
   不同球体是不一样的，这就是球体与投影
   Cesium.Cartographic.fromDegrees(longitude,latitude,height,result) 
   这里是不需要球体的
   Cesium.Cartographic.toCartesian(cartographic, ellipsoid, result)
4. 矩阵
   martix4，4*4的矩阵 矩阵转换，将模型的X转至真实空间的x
   最常用的方法Cesium.Transfrom.eastNorthUpToFixedFrame() 以一个Cartesian3点为中心，建成一个martix4矩阵，转换。
   其实质就是下面这个线性几何公式
   Cesium.TranslationRotationScale（translation,rotation,scale）

5. 向量计算
   Cesium.Cartesian3.abs(cartesian, result) → Cartesian3
   Cesium.Cartesian3.add(left, right, result) → Cartesian3
   Cesium.Cartesian3.angleBetween(left, right) 返回两个笛卡尔坐标之间的角度，left/right 均为一个cartesin3坐标，除非特殊说明单位都是弧度
   Cesium.Cartesian3.cross(left, right, result) → Cartesian3 返回两个向量的矢量积
   Cesium.Cartesian3.distance(left, right) → Number 返回两个坐标的距离
   Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result) → Cartesian3
   Cesium.Cartesian3.multiplyByScalar(cartesian, scalar, result) → Cartesian3   乘以向量后的结果
   Cesium.Cartesian3.negate(cartesian, result) → Cartesian3 方向取反
   Cesium.Cartesian3.normalize(cartesian, result) —单位向量化
   Cesium.Cartesian3.projectVector(a, b, result) → Cartesian3 投影