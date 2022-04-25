export function pointToLineDistance(point, startPointOfLine, endPointOfLine) {
  let ptOnline = pointProjectionOnLine(point, startPointOfLine, endPointOfLine);
  return Cesium.Cartesian3.distance(point, ptOnline);
}

export function pointToPointDistance(point1, point2) {
  return Cesium.Cartesian3.distance(point1, point2);
}

export function pointProjectionOnLine(point, startPointOfLine, endPointOfLine) {
  let p1 = startPointOfLine;
  let p2 = endPointOfLine;
  let p3 = point;

  let c1 = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3());
  let c2 = Cesium.Cartesian3.subtract(p3, p1, new Cesium.Cartesian3());
  let angle = Cesium.Cartesian3.angleBetween(c1, c2);
  let dis = Cesium.Cartesian3.distance(p1, p3);
  dis = dis * Math.cos(angle);
  let nor = Cesium.Cartesian3.normalize(c1, new Cesium.Cartesian3());
  let newC = Cesium.Cartesian3.multiplyByScalar(
    nor,
    dis,
    new Cesium.Cartesian3()
  );

  let ptOnline = Cesium.Cartesian3.add(newC, p1, new Cesium.Cartesian3());
  return ptOnline;
}

export function pointOnDirection(point, direction, distance) {
  let nor = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
  let newV = Cesium.Cartesian3.multiplyByScalar(
    nor,
    distance,
    new Cesium.Cartesian3()
  );
  let newEndPoint = Cesium.Cartesian3.add(newV, point, new Cesium.Cartesian3());
  return newEndPoint;
}

export function extendLine(startPoint, endPoint, distance) {
  let v = Cesium.Cartesian3.subtract(
    endPoint,
    startPoint,
    new Cesium.Cartesian3()
  );
  return pointOnDirection(startPoint, v, distance);
}

// /即使offsetZ=0时，此函数返回的点的高度会大于原始点的高度，位移越大，偏差越大，
// /因为局部坐标系是平面的，而高度是按照球面计算的，若要返回点的高度同原始点在一个高度，需要反算一次（目前只知道这个方法）
export function movePoint(origin, offsetX, offsetY, offsetZ) {
  let trans = Cesium.Transforms.eastNorthUpToFixedFrame(origin); // 东-北-上参考系构造出4*4的矩阵
  let m = new Cesium.Matrix4();
  Cesium.Matrix4.setTranslation(
    Cesium.Matrix4.IDENTITY,
    new Cesium.Cartesian3(offsetX, offsetY, offsetZ),
    m
  ); // 构造平移矩阵
  let matrix = Cesium.Matrix4.multiply(trans, m, trans); // 将当前位置矩阵乘以平移矩阵得到平移之后的位置矩阵
  let point = new Cesium.Cartesian3(0, 0, 0);
  Cesium.Matrix4.getTranslation(matrix, point); // 从位置矩阵中取出坐标信息

  return point;
}

export function getRectangleCoordinates(
  center,
  width,
  height,
  returnAllPoints
) {
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  let maxP = movePoint(center, halfWidth, halfHeight, 0);
  let minP = movePoint(center, halfWidth * -1, halfHeight * -1, 0);

  if (returnAllPoints) {
    let minMaxP = movePoint(center, halfWidth, halfHeight * -1, 0);
    let maxMinP = movePoint(center, halfWidth * -1, halfHeight, 0);
    return [minP, minMaxP, maxP, maxMinP, minP];
  } else {
    return [minP, maxP];
  }
}

export function getPointOnPlane2(pointOnRay, directionOfRay, pointsOnPlane) {
  if (pointsOnPlane instanceof Array && pointsOnPlane.length >= 3) {
    let v1 = Cesium.Cartesian3.subtract(
      pointsOnPlane[0],
      pointsOnPlane[1],
      new Cesium.Cartesian3()
    );

    let v2 = Cesium.Cartesian3.subtract(
      pointsOnPlane[1],
      pointsOnPlane[2],
      new Cesium.Cartesian3()
    );

    // let normalOfPlane = Cesium.Cartesian3.cross(v1, v2) //有问题貌似

    let normalOfPlane = new Cesium.Cartesian3(
      v1.y * v2.z - v2.y * v1.z,
      -1 * (v1.x * v2.z - v2.x * v1.z),
      v1.x * v2.y - v2.x * v1.y
    );

    return getPointOnPlane1(
      pointOnRay,
      directionOfRay,
      pointsOnPlane[0],
      normalOfPlane
    );
  } else {
    throw '面上的点的个数必须大于等于3';
  }
}

export function getPointOnPlane1(
  pointOnRay,
  directionOfRay,
  pointOnPlane,
  normalOfPlane
) {
  let dotRes = Cesium.Cartesian3.dot(directionOfRay, normalOfPlane);
  if (dotRes == 0) {
    // 方向向量与平面平行，没有交点
    return null;
  }

  let v = Cesium.Cartesian3.subtract(
    pointOnPlane,
    pointOnRay,
    new Cesium.Cartesian3()
  );
  let m = Cesium.Cartesian3.dot(v, normalOfPlane) / dotRes;

  let newVRay = Cesium.Cartesian3.multiplyByScalar(
    directionOfRay,
    m,
    new Cesium.Cartesian3()
  );

  return Cesium.Cartesian3.add(pointOnRay, newVRay, new Cesium.Cartesian3());
}

export function lonLatToCartesian(lng, lat, height) {
  return Cesium.Cartesian3.fromDegrees(lng, lat, height);
  // let cartographic = Cesium.Cartographic.fromDegrees(lng, lat, height)
  // return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic)
}

export function cartesianToLonlat(cartesian) {
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  // let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian)

  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lng = Cesium.Math.toDegrees(cartographic.longitude);
  let alt = cartographic.height;

  return {
    longitude: lng,
    latitude: lat,
    height: alt,
  };
}

export function reCalculateCartesian(cartesian, height) {
  let lonlat = cartesianToLonlat(cartesian);
  return Cesium.Cartesian3.fromDegrees(
    lonlat.longitude,
    lonlat.latitude,
    height
  );
}

export function rotateVector(vector, normal, angle) {
  let q = Cesium.Quaternion.fromAxisAngle(normal, angle);
  let m3 = Cesium.Matrix3.fromQuaternion(q);
  let m4 = Cesium.Matrix4.fromRotationTranslation(m3);
  let vectorNew = Cesium.Matrix4.multiplyByPoint(
    m4,
    vector,
    new Cesium.Cartesian3()
  );
  return vectorNew;
}

export function pointRotateAroundPoint(center, point, normal, angle) {
  let vector = Cesium.Cartesian3.subtract(
    point,
    center,
    new Cesium.Cartesian3()
  );
  let vNew = rotateVector(vector, normal, angle);
  let p = Cesium.Cartesian3.add(vNew, center, new Cesium.Cartesian3());
  return p;
}

export function rayEarthIntersection(position, direction) {
  let ray = new Cesium.Ray(position, direction);
  let intersection = Cesium.IntersectionTests.rayEllipsoid(
    ray,
    Cesium.Ellipsoid.WGS84
  );
  let point = Cesium.Ray.getPoint(ray, intersection.start);
  return point;
}

export function vectorToQuaternion(origin, target) {
  let direction = Cesium.Cartesian3.subtract(
    target,
    origin,
    new Cesium.Cartesian3()
  );
  Cesium.Cartesian3.normalize(direction, direction);
  let rotationMatrix = Cesium.Transforms.rotationMatrixFromPositionVelocity(
    origin,
    direction
  );
  // let rot90 = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90))
  // Cesium.Matrix3.multiply(rotationMatrix, rot90, rotationMatrix)
  let quaternion = Cesium.Quaternion.fromRotationMatrix(rotationMatrix);
  return quaternion;
}

export function vectorToHeadingPitchRoll(origin, target) {
  return Cesium.HeadingPitchRoll.fromQuaternion(
    vectorToQuaternion(origin, target)
  );
}

// 平面坐标系转经纬度, 用于显示
export function convertGeoJsonFromProj2LL(scene, geojson) {
  if (scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
    return;
  }
  let setCoord = function (feature) {
    for (let gitem of feature.geometry.coordinates) {
      for (let citem of gitem) {
        var projP = new Cesium.Cartesian3(citem[0], citem[1], citem[2]);
        let cartesianP = convertProjToCartesian(scene, projP);
        let llP = cartesianToLonlat(cartesianP);
        citem[0] = llP.longitude;
        citem[1] = llP.latitude;
        citem[2] = llP.height;
      }
    }
  };
  if (geojson.type.toLowerCase() == 'featurecollection') {
    for (let fitem of geojson.features) {
      setCoord(fitem);
    }
  } else if (geojson.type.toLowerCase() == 'feature') {
    setCoord(feature);
  }
}

export function convertGeoJsonFromLL2Proj(scene, geojson) {
  if (scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
    return;
  }
  let setCoord = function (feature) {
    for (let gitem of feature.geometry.coordinates) {
      for (let citem of gitem) {
        let cartesianP = Cesium.Cartesian3.fromDegrees(
          citem[0],
          citem[1],
          citem[2]
        );
        let projP = convertCartesianToProj(scene, cartesianP);
        citem[0] = projP.x;
        citem[1] = projP.y;
        citem[2] = projP.z;
      }
    }
  };
  if (geojson.type.toLowerCase() == 'featurecollection') {
    for (let fitem of geojson.features) {
      setCoord(fitem);
    }
  } else if (geojson.type.toLowerCase() == 'feature') {
    setCoord(geojson);
  }
}

// 原始平面坐标转场景笛卡尔坐标
export function convertProjToCartesian(scene, cartesian) {
  if (scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
    throw '此函数只适用平面坐标系';
  }
  var convertPos = Cesium.SceneTransforms.convert2DToCartesian(
    scene,
    cartesian
  );
  return convertPos;
}

// 与convertProjToCartesian过程相反
export function convertCartesianToProj(scene, cartesian) {
  if (scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
    throw '此函数只适用平面坐标系';
  }
  let screenPosition = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
    scene,
    cartesian
  );
  let projPosition = scene.pickPosition2D(screenPosition);
  return projPosition;
}
