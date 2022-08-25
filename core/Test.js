import SketchTool from './tools/Sketch/SketchTool';
import HighLimitTool from './analysis/HighLimit/HighLimitTool';
import SubmergedTool from './analysis/Submerged/SubmergedTool';
import SceneRouteTool from './tools/Scene/SceneRouteTool';
import { gridSamplingPointsInPolygon } from './utils/CesiumUtility';
import { reproject } from './utils/Reproject';
import centerOfMass from '@turf/center-of-mass';
import TestPanel from './Test.vue';
import Vue from 'vue';
import $ from 'jquery';
import { proxy } from './utils/LocalProxy';
export default class Test {
  constructor() {
    this.createSketchTool();
  }
  createSketchTool() {
    this.count = 1;
    this.sketchTool = new SketchTool(window.s3d.viewer);
    this.sketchTool.setMultiable(true);
    this.sketchTestStep = 0;
  }
  createView() {
    let div = document.createElement('div');
    let vue = new Vue({
      el: div,
      render: (h) => h(TestPanel),
    });

    $('.cesium-viewer-cesiumWidgetContainer')[0].appendChild(vue.$el);
  }
  doTest() {
    proxy(
      'http://192.168.122.55/iserver55/services/3D-local3DCache-DM1th0812/rest/realspace/datas/DM_1@th/config',
      function (config) {
        config.position.z = 100;
        console.log(config);
      }
    ).then((x) => {
      console.log(x);
    });
    // this.testReproject();
    // this.createView();
    // window.s3d.selectedChangedEvent.startListening();
    // window.s3d.eventBus.addEventListener('selected-features-changed', (caller, args) => {
    //   console.log(caller);
    //   console.log(args);
    // });
    // this.testMatrix();
    // window.s3d.topLeftBar.toggleViewTo('2D');
    // this.labelPolygonsTest()
    // this.flyToPointsTest()
    // this.labelPointsTest()
    // this.setLayerVisibleTest();
    // this.addLayerTest()
    // this.submergedTest()
    // this.highLimitTest()
    // this.randomPoints()
    // this.sceneRoute()
    // this.loadShapefile()
    // this.loadGeoJSON()
    // this.insertToolButton()
    // this.entityToGeoJson()
    // this.sketchTest();
    // window.s3d.viewUtility.rotateZ(1)
    // window.s3d
    //   .query({ layer: '交通信号', sql: 'SMID =1' })
    //   .then((response) => console.log(response))
    // window.s3d.openPopup({
    //   object: { layer: '有线电视', sql: '元素id = 66736' },
    // })
    // if (this.count === 1) {
    //   debugger
    // window.s3d.openPopup({
    //   object: { layer: '供电', sql: 'SMID = 4480' },
    // })
    //   this.count++
    // } else if (this.count === 2) {
    //   window.s3d.closePopup()
    //   debugger
    //   window.s3d.openPopup({
    //     object: { layer: '污水', sql: 'SMID = 1464' },
    //   })
    //   this.count++
    // } else if (this.count === 3) {
    //   window.s3d.closePopup()
    //   debugger
    //   window.s3d.openPopup({
    //     object: { layer: '供电', sql: 'SMID = 4265' },
    //   })
    //   this.count++
    // }
    // window.s3d.flyToS3mFeatures(
    //   { layer: '供电', sql: 'SMID =  5534 ' },
    //   { scale: 1.5 }
    // )
    // window.s3d.flyTo([130, 31, 1000])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegreesArray([130, 31])[0])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegrees(130, 31))
    // console.log(window.s3d.layerManager.getAllLayers((x) => x.type === 'S3M' && x.visible))
    // console.log(window.s3d.layerManager.getLayer('供电'))
    // console.log(window.s3d.layerManager.getLayer((x) => x.name === '供电'))
  }
  testReproject() {
    let pt = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          40557647.206291355, 3451505.3023955463, 1.3869319521331655,
        ],
      },
    };

    console.log(reproject(pt, 'EPSG_4528', 'EPSG_4490'));
  }
  flyToPointsTest() {
    window.s3d.cameraUtility.flyToPointsLL(
      [
        { x: 120.6704, y: 31.3152, z: 10 },
        { x: 120.671, y: 31.311, z: 2 },
      ],
      {
        scale: 3,
      }
    );
  }
  labelPointsTest() {
    window.s3d.labelPoints(
      [
        {
          position: { x: 120.6704, y: 31.3152, z: 3 },
          name: 'test',
          attributes: { a: 1 },
        },
      ],
      {
        billboard: {
          image: '/img/location.png',
          autoIndex: false,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          autoIndex: false,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      },
      true,
      true,
      { scale: 1000 }
    );
  }
  labelPolygonsTest() {
    let geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.6051439576166, 31.182623348967315],
            [120.60454406195154, 31.18123669097755],
            [120.60557820129517, 31.180994015265277],
            [120.60619062354726, 31.18215582423319],
            [120.60618967226178, 31.182160091113577],
            [120.61562716969533, 31.187796980711134],
            [120.60675290392506, 31.18458419309506],
            [120.60677488993603, 31.184584192869124],
            [120.6051439576166, 31.182623348967315],
          ],
        ],
      },
      properties: {
        name: 'sketch_polygon_fill',
        styleUrl: '#style-1',
        styleHash: '-640c9941',
        'fill-opacity': 0.5019607843137255,
        fill: '#12d035',
        visibility: '1',
      },
    };
    window.s3d.dataUtility.loadGeoJson(geojson);
    let geoJsonToPt = function (polygon) {
      let center = centerOfMass(polygon);
      let x = center.geometry.coordinates[0];
      let y = center.geometry.coordinates[1];
      let z = center.geometry.coordinates[2];
      let name = polygon.properties.name;
      return {
        position: { x: x, y: y, z: z },
        name: name,
        attributes: polygon.properties,
      };
    };

    let pts = [];
    if (geojson.type == 'Feature') {
      pts.push(geoJsonToPt(geojson));
    } else if (geojson.type == 'FeatureCollection') {
      for (let feature of geojson) {
        pts.push(geoJsonToPt(feature));
      }
    }
    window.s3d.labelPoints(
      pts,
      {
        billboard: {
          image: '/img/location.png',
          autoIndex: false,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          autoIndex: false,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      },
      true,
      true,
      { scale: 1000 }
    );
  }
  setLayerVisibleTest() {
    if (typeof this.layerVisible === 'undefined') {
      this.layerVisible = false;

      window.s3d.eventBus.addEventListener(
        'layer-visible-changed',
        (caller, args) => {
          console.log('layer-visible-changed');
          console.log(caller);
          console.log(args);
        }
      );

      window.s3d.eventBus.addEventListener('layer-added', (caller, args) => {
        console.log('layer-added');
        console.log(caller);
        console.log(args);
      });

      window.s3d.eventBus.addEventListener('layer-removed', (caller, args) => {
        console.log('layer-removed');
        console.log(caller);
        console.log(args);
      });

      window.s3d.eventBus.addEventListener(
        'layer-invisible-internal',
        (caller, args) => {
          console.log('layer-invisible-internal');
          console.log(caller);
          console.log(args);
        }
      );
    }
    this.layerVisible = !this.layerVisible;
    window.s3d.layerManager.setLayerVisible('东沙湖-倾斜', this.layerVisible);
  }
  addLayerTest() {
    window.s3d.layerManager.addLayer(
      {
        name: '倾斜',
        type: 'S3M',
        visible: false,
        url: 'http://localhost:8090/iserver/services/3D-local3DCache-szgx4490/rest/realspace/datas/Config_3/config',
      },
      {
        duration: 2,
        offset: {
          heading: 6.087014263548862,
          pitch: -0.5091484573438768,
          range: 100,
        },
      }
    );
  }
  highLimitTest() {
    let highLimitTool = new HighLimitTool(window.s3d.viewer);
    highLimitTool
      .setTargetLayers(['楼幢'])
      .setHeight(60)
      .setRectangle([
        120.6014997708723, 31.180936477517143, 120.60515662761527,
        31.180896259318505, 120.60575593261512, 31.186082838897974,
        120.60050207082269, 31.186380190938625,
      ]);

    highLimitTool.start();
  }
  submergedTest() {
    let submergedTool = new SubmergedTool(window.s3d.viewer);
    submergedTool
      .setTargetLayers(['园区-盒子'])
      .includingGlobe()
      // 园区
      .setCoverageArea([
        120.655, 31.3219, 3, 120.6657, 31.3131, 3, 120.6794, 31.3081, 3,
        120.6794, 31.3251, 3, 120.655, 31.3219, 3,
      ]);
    // .setCoverageArea([
    //   120.7658,
    //   31.3345,
    //   3,
    //   120.7644,
    //   31.3397,
    //   3,
    //   120.769,
    //   31.3403,
    //   3,
    //   120.7701,
    //   31.3352,
    //   3,
    //   120.7658,
    //   31.3345,
    //   3,
    // ])
    submergedTool.start();
    submergedTool.getSubmergedArea().then((samplePts) => {
      samplePts.forEach((p) => {
        window.s3d.debugUtility.labelPointLL(p, false);
      });
    });
  }
  randomPoints() {
    let geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.7658, 31.3345],
            [120.7644, 31.3397],
            [120.769, 31.3403],
            [120.7701, 31.3352],
            [120.7658, 31.3345],
          ],
        ],
      },
      properties: {},
    };

    window.s3d.dataUtility.loadGeoJson(geojson);
    let resutl = gridSamplingPointsInPolygon(
      geojson,
      0.0003,
      window.s3d.viewer.terrainProvider
    );
    resutl.then((positions) => {
      positions.forEach((p) => {
        window.s3d.debugUtility.labelPointLL(p, false);
      });
    });
  }
  sceneRoute() {
    let tool = new SceneRouteTool(window.s3d.viewer);
    tool.setRoute('/test.fpf').then(() => tool.start());
  }
  insertToolButton() {
    window.s3d.toolbar.insertButton([2, 0], {
      title: '测试',
      icon: 'icon-mea-point',
      click: function () {
        alert('click');
      },
    });
  }
  load3dTiles() {
    var tileset = window.s3d.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: './3dtiles/tileset.json',
      })
    );

    tileset.readyPromise.then(function (tileset) {
      // window.s3d.viewer.zoomTo(
      //   tileset,
      //   new Cesium.HeadingPitchRange(
      //     0.5,
      //     -0.2,
      //     tileset.boundingSphere.radius * 1.0
      //   )
      // )
      window.s3d.viewer.camera.viewBoundingSphere(
        tileset.boundingSphere
        // new Cesium.HeadingPitchRange(0, -0.5, 0)
      );
    });
  }
  loadShapefile() {
    // window.s3d.dataUtility.loadShapefile('/test.shp')
    window.s3d.dataUtility.loadTrailLineFromShapefile('/test.shp', {
      width: 4,
      color: new Cesium.Color(0.9765, 0.7647, 0.4667, 1.0),
      trailLength: 0.5,
      period: 2,
    });
  }
  loadGeoJSON() {
    let geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.6051439576166, 31.182623348967315],
            [120.60454406195154, 31.18123669097755],
            [120.60557820129517, 31.180994015265277],
            [120.60619062354726, 31.18215582423319],
            [120.60618967226178, 31.182160091113577],
            [120.61562716969533, 31.187796980711134],
            [120.60675290392506, 31.18458419309506],
            [120.60677488993603, 31.184584192869124],
            [120.6051439576166, 31.182623348967315],
          ],
        ],
      },
      properties: {
        name: 'sketch_polygon_fill',
        styleUrl: '#style-1',
        styleHash: '-640c9941',
        'fill-opacity': 0.5019607843137255,
        fill: '#12d035',
        visibility: '1',
      },
    };
    return window.s3d.dataUtility.loadGeoJson(geojson);
  }

  debug() {
    window.s3d.debugUtility.labelPoint(
      Cesium.Cartesian3.fromDegrees(120.7769, 31.6024, 11.573)
    );
  }

  sketchTest() {
    if (this.sketchTestStep === 0) {
      this.sketchTestStep++;
      this.sketchTool.start('rectangle').then((x) => {
        console.log(x);
      });
    } else if (this.sketchTestStep === 1) {
      this.sketchTestStep++;
      // this.sketchTool.setVertexLimitCount(3);
      this.sketchTool.start('polygon').then((x) => {
        console.log(x);
      });
    } else if (this.sketchTestStep === 2) {
      this.sketchTestStep++;
      // this.sketchTool.setVertexLimitCount(3);
      this.sketchTool.start('polyline').then((x) => {
        console.log(x);
      });
    } else if (this.sketchTestStep === 3) {
      this.sketchTestStep++;
      this.sketchTool.enableFreeLine();
      this.sketchTool.start('polyline').then((x) => {
        console.log(x);
      });
    } else if (this.sketchTestStep === 4) {
      this.sketchTestStep++;
      this.sketchTool.start('circle').then((x) => {
        console.log(x);
      });
    } else {
      this.sketchTool.getGeometries().then((result) => {
        console.log(result);
      });
    }
  }
  entityToGeoJson() {
    window.s3d.debugUtility.drawCameraDirection();
    window.s3d.viewer.entities
      .toGeoJson()
      .then((geojson) => console.log(geojson));
    window.s3d.viewer.entities.values[0]
      .toGeoJson()
      .then((geojson) => console.log(geojson));
  }
  testMatrix() {
    let origin = new Cesium.Cartesian3(
      -2421826.48258621,
      4681211.1981396,
      3591942.9886652
    );

    let start = new Cesium.Cartesian3(
      -2421818.80776567,
      4681216.37928572,
      3591941.6780122
    );
    let end = new Cesium.Cartesian3(
      -2421834.15740112,
      4681206.01698374,
      3591944.29931035
    );

    // let up = s3d.viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(origin);
    // console.log('up ' + up);

    let trans1 = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
    console.log('trans1', trans1);
    let start1 = Cesium.Matrix4.multiplyByPoint(
      trans1,
      start,
      new Cesium.Cartesian3()
    );
    let end1 = Cesium.Matrix4.multiplyByPoint(
      trans1,
      end,
      new Cesium.Cartesian3()
    );
    console.log('end1', end1);

    let trans2 = Cesium.Matrix4.inverse(trans1, new Cesium.Matrix4());
    console.log('trans2', trans2);
    let start2 = Cesium.Matrix4.multiplyByPoint(
      trans2,
      start,
      new Cesium.Cartesian3()
    );
    console.log('start2', start2);
    let end2 = Cesium.Matrix4.multiplyByPoint(
      trans2,
      end,
      new Cesium.Cartesian3()
    );
    console.log('end2', end2);

    console.log('distance', Cesium.Cartesian3.distance(start, end));
    console.log('distance1', Cesium.Cartesian3.distance(start1, end1));
    console.log('distance2', Cesium.Cartesian3.distance(start2, end2));
  }
}
