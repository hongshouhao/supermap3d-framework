var shapefile = require('shapefile');
import {
  cartesianToLonlat,
  convertGeoJsonFromProj2LL,
  convertGeoJsonFromLL2Proj,
} from './CesiumMath';
export default class DataUtility {
  constructor(viewer) {
    this.viewer = viewer;
  }

  /*
  geojson: 即geojson
  options：见 GeoJsonDataSource.load(geojson, options)
  dsName: 用来管理datasource
   */
  loadGeoJson(geojson, options, dsName) {
    if (this.viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
      this.convertGeoJsonFromProj2LL(geojson);
    }

    let opt =
      options == null
        ? {
          stroke: Cesium.Color.RED,
          fill: Cesium.Color.BLUE.withAlpha(0.3),
          strokeWidth: 1,
          clampToGround: true,
        }
        : options;
    if (dsName) {
      if (!dsName.startsWith('temp_')) {
        dsName = `temp_${dsName}`;
      }
    } else {
      dsName = 'temp_ds';
    }

    // let outlineStyle = {}
    // outlineStyle.width = opt.strokeWidth
    // outlineStyle.material = opt.stroke

    // opt.stroke = opt.fill
    // opt.strokeWidth = 0
    return Cesium.GeoJsonDataSource.load(geojson, opt).then((res) => {
      res.name = dsName;
      // if (outlineStyle.width > 0) {
      //   for (let ent of res.entities.values) {
      //     if (ent.polygon) {
      //       let hierarchy = ent.polygon.hierarchy.getValue()
      //       let outLineEnt = {
      //         polyline: {
      //           positions: hierarchy.positions.map((x) => x.clone()),
      //           material: outlineStyle.material,
      //           width: outlineStyle.width,
      //         },
      //       }
      //       res.entities.add(outLineEnt)
      //     }
      //   }
      // }

      this.viewer.dataSources.add(res);
      return res;
    });
  }

  // 平面坐标系转经纬度, 用于显示
  convertGeoJsonFromProj2LL(geojson) {
    convertGeoJsonFromProj2LL(this.viewer.scene, geojson);
  }

  convertGeoJsonFromLL2Proj(geojson) {
    if (this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
      return;
    }
    let _this = this;
    let setCoord = function (feature) {
      for (let gitem of feature.geometry.coordinates) {
        for (let citem of gitem) {
          let cartesianP = Cesium.Cartesian3.fromDegrees(
            citem[0],
            citem[1],
            citem[2]
          );
          let projP = _this.convertCartesianToProj(cartesianP);
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
  convertProjToCartesian(cartesian) {
    if (this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
      throw '此函数只适用平面坐标系';
    }
    var convertPos = Cesium.SceneTransforms.convert2DToCartesian(
      this.viewer.scene,
      cartesian
    );
    return convertPos;
  }

  // 与convertProjToCartesian过程相反
  convertCartesianToProj(cartesian) {
    if (this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
      throw '此函数只适用平面坐标系';
    }
    let screenPosition = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
      this.viewer.scene,
      cartesian
    );
    let projPosition = this.viewer.scene.pickPosition2D(screenPosition);
    return projPosition;
  }

  clearTempData(prefix) {
    if (!prefix) {
      prefix = 'temp_';
    }
    for (let i = 0; i < this.viewer.dataSources.length; i++) {
      let ds = this.viewer.dataSources.get(i);
      if (ds.name.startsWith(prefix)) {
        this.viewer.dataSources.remove(ds, true);
      }
    }
  }

  loadShapefile(url, options, dsName) {
    let coll = { type: 'FeatureCollection', features: [] };
    let _this = this;
    return shapefile
      .open(url)
      .then((source) =>
        source.read().then(function read(result) {
          if (result.done) {
            return _this.loadGeoJson(coll, options, dsName);
          } else {
            coll.features.push(result.value);
            return source.read().then(read);
          }
        })
      )
      .catch((error) => console.error(error.stack));
  }

  loadTrailLineFromGeoJson(geojson, options, dsName) {
    return this.loadGeoJson(geojson, null, dsName).then((ds) => {
      return this._createTrailLine(ds, options);
    });
  }
  loadTrailLineFromShapefile(url, options, dsName) {
    return this.loadShapefile(url, null, dsName).then((ds) => {
      return this._createTrailLine(ds, options);
    });
  }

  /*
  pt:
  {
    position:{lon,lat,height},
    name:"",
  }

  options: {
    billboard:{image,width,height,autoIndex},
    label:{}
  }
  */
  labelPoints(ptObjs, options) {
    if (!options) {
      throw 'options不能为空';
    }

    if (!(ptObjs && ptObjs.length > 0)) return;

    let dataSource = new Cesium.CustomDataSource('temp_points_label');
    let getFileName = function (o) {
      var slashPos = o.lastIndexOf('/');
      var dotPos = o.lastIndexOf('.');
      return o.substring(slashPos + 1, dotPos);
    };

    if (options.label) {
      if (!options.label.fillColor) {
        options.label.fillColor = Cesium.Color.BLACK;
      }

      if (!options.label.font) {
        options.label.font = '15px sans-serif bold';
      }

      if (!options.label.verticalOrigin) {
        options.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      }

      if (options.billboard && !options.label.eyeOffset) {
        options.label.eyeOffset = new Cesium.Cartesian3(0, 0, -10);
      }
    }

    for (let i = 0; i < ptObjs.length; i++) {
      let ptItem = ptObjs[i];

      var optCopy = JSON.parse(JSON.stringify(options));
      if (optCopy.billboard && optCopy.billboard.autoIndex) {
        let imgName = getFileName(optCopy.billboard.image);
        optCopy.billboard.image = optCopy.billboard.image.replace(
          `${imgName}.`,
          `${imgName}${i + 1}.`
        );
      }

      if (optCopy.label) {
        if (optCopy.label.autoIndex) {
          optCopy.label.text = `${i + 1}`;
        } else {
          if (!optCopy.label.text) {
            optCopy.label.text = ptItem.name;
          }
        }
      }

      let ent = {};
      Object.assign(ent, ptItem);
      Object.assign(ent, optCopy);
      ent.position = Cesium.Cartesian3.fromDegrees(
        ptItem.position.x,
        ptItem.position.y,
        ptItem.position.z
      );
      dataSource.entities.add(ent);
    }
    this.viewer.dataSources.add(dataSource);
  }

  // 尾迹线
  // materialOptions: 见PolylineTrailMaterialProperty, 此外多个width属性
  _createTrailLine(ds, materialOptions) {
    let dataSource = new Cesium.CustomDataSource(ds.name);

    for (let ent of ds.entities.values) {
      if (ent.polyline) {
        dataSource.entities.add({
          polyline: {
            positions: ent.polyline.positions._value,
            width: materialOptions.width == null ? 4 : materialOptions.width,
            material: new Cesium.PolylineTrailMaterialProperty(materialOptions),
          },
        });
      }
    }

    this.viewer.dataSources.remove(ds, true);
    this.viewer.dataSources.add(dataSource);

    return dataSource;
  }
}
