import uuid from '@/utils/uuid';
import { parse, stringify } from 'wellknown';

export default class TempEntity {
  constructor(option, viewer) {
    this.option = option;
    this.viewer = window.s3d.viewer || viewer;
    this.uuid = uuid(8, 16);

    this.addToMap();
  }

  addToMap() {
    if (this.option.data) {
      if (typeof this.option.data == 'string') {
        this.option.data = parse(this.option.data);
      }
      let DataSource = Cesium.GeoJsonDataSource.load(this.option.data, {
        stroke: Cesium.Color.RED, // 相当于polygon的outlineColor
        strokeWidth: 5, // 相当于polygon的outlineWidth
        clampToGround: true, // 是否贴地
        fill: Cesium.Color.RED.withAlpha(0.3),
      });

      this.viewer.dataSources.add(DataSource).then((dataSource) => {
        this.dataSource = dataSource;
        let entities = dataSource.entities.values;
        // 修改entity样式
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          entity.polygon.fill = true;
          entity.polyline = {
            positions: entity.polygon.hierarchy._value.positions,
            width: 2,
            material: Cesium.Color.fromCssColorString('#ff0000'),
          };
          entity.label = {
            text: '测试',
          };
        }

        this.viewer.zoomTo(this.dataSource);
      });
    }
  }

  remove() {
    this.viewer.dataSources.remove(this.dataSource, true);
  }
}
