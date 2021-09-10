<template>
  <div>
    <div v-if="leftbarVisible" class="left-container">
      <el-aside>
        <div
          style="float: left; width: 250px; line-height: 20px; margin-top: 5px"
        >
          <i class="el-icon-search" /> 搜索
        </div>
        <el-button
          icon="el-icon-close"
          circle
          size="mini"
          title="关闭查询"
          @click="handleHideBar('l')"
        />
      </el-aside>
      <table style="background-color: #f8f8f8">
        <tr>
          <td>
            <p class="littleTittle">关键字</p>
          </td>
          <td>
            <el-input
              v-model="inputValue"
              size="mini"
              placeholder="请输入关键字"
              clearable
              style="margin-top: 5px"
            />
          </td>
        </tr>
        <tr>
          <td />
          <td style="text-align: right">
            <el-button size="mini"> 关闭 </el-button>
            <el-button size="mini" type="primary"> 查询 </el-button>
          </td>
        </tr>
      </table>

      <div
        style="
          height: 30px;
          background-color: #f8f8f8;
          width: 298px;
          border-bottom: 1px solid rgb(169, 169, 169);
        "
      >
        <div class="result-title">搜索结果</div>
        <div class="result-total">共<span class="result-num">10</span>个</div>
      </div>

      <div class="messagebox">
        <div v-for="item in 10" :key="item" class="ul-bar">
          <ul>
            <li style="float: left; list-style-type: none">
              <div class="serial-img">
                <p class="serial-num">
                  {{ item }}
                </p>
              </div>
            </li>
            <li style="float: left; list-style-type: none">
              <el-descriptions :column="1" size="mini" :border="true">
                <el-descriptions-item
                  label="项目名称"
                  label-style="width:70px;"
                  content-style="width:160px;"
                >
                  <a
                    style="color: #0593d3; cursor: pointer"
                    @click="handleShowRightbar(item)"
                    >项目竣工测量{{ item }}</a
                  >
                </el-descriptions-item>
                <el-descriptions-item
                  label="建设单位"
                  label-style="width:70px;"
                  content-style="width:160px;"
                >
                  园区测绘
                </el-descriptions-item>
                <el-descriptions-item
                  label="项目状态"
                  label-style="width:70px;"
                  content-style="width:160px;"
                >
                  <el-tag v-if="item % 4 === 0" type="success" size="mini">
                    正常
                  </el-tag>
                  <el-tag v-if="item % 4 === 1" type="warning" size="mini">
                    预警
                  </el-tag>
                  <el-tag v-if="item % 4 === 2" type="danger" size="mini">
                    超标
                  </el-tag>
                  <el-tag v-if="item % 4 === 3" type="info" size="mini">
                    归档
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </li>
          </ul>
        </div>
      </div>

      <el-pagination
        layout="prev, pager, next"
        :pager-count="7"
        :total="150"
        small
      />
    </div>

    <div v-show="rightbarVisible" class="right-container">
      <el-aside>
        <div
          style="float: left; width: 210px; line-height: 20px; margin-top: 5px"
        >
          <i class="el-icon-finished" /> 全链条
        </div>
        <el-button icon="el-icon-folder" circle size="mini" title="查看附件" />
        <el-button
          icon="el-icon-close"
          circle
          size="mini"
          title="关闭全链条"
          @click="handleHideBar('r')"
        />
      </el-aside>
      <p style="line-height: 30px; font-weight: bold; margin-left: 10px">
        项目名称：{{ currentProject }}
      </p>
      <div
        class="chainBox"
        style="
          width: 300px;
          padding-left: 10px;
          height: calc(100% - 70px);
          display: block;
          overflow: scroll;
          overflow-x: hidden;
        "
      >
        <el-collapse v-model="activeNames" size="mini" @change="handleChange" style="border:none;">
          <el-timeline>
            <el-timeline-item
              placement="top"
              type="primary"
              :hide-timestamp="true"
            >
              <el-collapse-item title="预审与选址" name="1">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      环境整治和景观提升工程项目
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      南侧、大道西地块
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地面积"
                      label-style="width:70px;"
                    >
                      318300 ㎡
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="建设规模"
                      label-style="width:70px;"
                    >
                      318300 ㎡
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="success"
              :hide-timestamp="true"
            >
              <el-collapse-item title="批次城镇建设用地" name="2">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏州市吴中区2021年度第1批次村镇建设用地（预审查）
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      吴中区人民政府
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="省批文号"
                      label-style="width:70px;"
                    >
                      苏政地[2020]80号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="市批文号"
                      label-style="width:70px;"
                    >
                      苏土管[2019]288号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="info"
              :hide-timestamp="true"
            >
              <el-collapse-item title="单独选址" name="3">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏州市轨道交通4号线工程
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州市轨道交通集团有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="省批文号"
                      label-style="width:70px;"
                    >
                      苏政地[2020]81号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="市批文号"
                      label-style="width:70px;"
                    >
                      苏土管[2021]151号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="warning"
              :hide-timestamp="true"
            >
              <el-collapse-item title="经营性上市地块" name="4">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="地块名称"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块编号"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-22号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地位置"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块面积"
                      label-style="width:70px;"
                    >
                      169961.9 ㎡
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="danger"
              :hide-timestamp="true"
            >
              <el-collapse-item title="经营合同与用地规划许可" name="5">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏州地产发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="宗地编号"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-36号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州地产发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地座落"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地面积"
                      label-style="width:70px;"
                    >
                      16.99619 亩
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="primary"
              :hide-timestamp="true"
            >
              <el-collapse-item title="工业用地上市地块" name="6">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="地块名称"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-22号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块编号"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-22号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地位置"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块面积"
                      label-style="width:70px;"
                    >
                      23883 ㎡
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="success"
              :hide-timestamp="true"
            >
              <el-collapse-item title="工业合同与用地规划许可" name="7">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-22号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="宗地编号"
                      label-style="width:70px;"
                    >
                      苏地2021-WG-22号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州佳祺仕信息科技有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地座落"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地面积"
                      label-style="width:70px;"
                    >
                      2.3883 亩
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="info"
              :hide-timestamp="true"
            >
              <el-collapse-item title="划拨与用地规划许可" name="8">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      幸福家园四期
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="宗地编号"
                      label-style="width:70px;"
                    >
                      路南、北街东
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州永昌置业有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地座落"
                      label-style="width:70px;"
                    >
                      路东南、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地面积"
                      label-style="width:70px;"
                    >
                      0.5384 亩
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="批准文号"
                      label-style="width:70px;"
                    >
                      苏地拨复 [2021]36号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="warning"
              :hide-timestamp="true"
            >
              <el-collapse-item title="临时用地" name="9">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏州峻熙置地有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州峻熙置地有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="联系人"
                      label-style="width:70px;"
                    >
                      张伟
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      浒光运河南、虎疁路西
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="批准文号"
                      label-style="width:70px;"
                    >
                      苏资规吴临【2021】78号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="danger"
              :hide-timestamp="true"
            >
              <el-collapse-item title="临时用地延期" name="10">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏州峻熙置地有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州峻熙置地有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="联系人"
                      label-style="width:70px;"
                    >
                      张伟
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      浒光运河南、虎疁路西
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="延期批准文号"
                      label-style="width:70px;"
                    >
                      苏资规吴临【2021】78号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="primary"
              :hide-timestamp="true"
            >
              <el-collapse-item title="方案审查" name="11">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="建设项目名称"
                      label-style="width:70px;"
                    >
                      环保危废仓库新建项目-水池
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="建设单位名称"
                      label-style="width:70px;"
                    >
                      林德气体(苏州)有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      苏街9号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="证书编号"
                      label-style="width:70px;"
                    >
                      F2021-088
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="success"
              :hide-timestamp="true"
            >
              <el-collapse-item title="方案变更" name="12">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="建设项目名称"
                      label-style="width:70px;"
                    >
                      影像检测类医疗器械等研发及生产用房项目变更
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="建设单位名称"
                      label-style="width:70px;"
                    >
                      苏州建设发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      苏州塔园路187号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="证书编号"
                      label-style="width:70px;"
                    >
                      B2021-143
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="info"
              :hide-timestamp="true"
            >
              <el-collapse-item title="工程许可" name="13">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="建设项目名称"
                      label-style="width:70px;"
                    >
                      公共卫生间
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="建设单位名称"
                      label-style="width:70px;"
                    >
                      苏州地产发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      路北、路西
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="许可证编号"
                      label-style="width:70px;"
                    >
                      320506202100148
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="warning"
              :hide-timestamp="true"
            >
              <el-collapse-item title="核实验收" name="14">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="建设项目名称"
                      label-style="width:70px;"
                    >
                      苏州吴中幼儿园
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="建设单位名称"
                      label-style="width:70px;"
                    >
                      苏州吴中社会事业服务中心
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      路东、路南
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="通知单编号"
                      label-style="width:70px;"
                    >
                      2021-078
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="danger"
              :hide-timestamp="true"
            >
              <el-collapse-item title="延期开竣工审批" name="15">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏地2016-WG-82号
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州地产发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      路北、路东
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块编号"
                      label-style="width:70px;"
                    >
                      苏地2016-WG-44号
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="primary"
              :hide-timestamp="true"
            >
              <el-collapse-item title="出让地块调整" name="16">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      苏地2011-B-44
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="地块编号"
                      label-style="width:70px;"
                    >
                      苏地2011-B-44
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      苏州地产发展有限公司
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      路东、地南
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
            <el-timeline-item
              placement="top"
              type="success"
              :hide-timestamp="true"
            >
              <el-collapse-item title="土地使用权收回" name="17">
                <div>
                  <el-descriptions :column="1" size="mini" :border="true">
                    <el-descriptions-item
                      label="项目名称"
                      label-style="width:70px;"
                    >
                      中国农业银行股份有限公司苏州吴中支行
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="用地单位"
                      label-style="width:70px;"
                    >
                      中国农业银行股份有限公司苏州吴中支行
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="土地坐落"
                      label-style="width:70px;"
                    >
                      苏州塔园路
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="收回后 用途"
                      label-style="width:70px;"
                    >
                      经营性用地
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-timeline-item>
          </el-timeline>
        </el-collapse>
      </div>
    </div>

    <map-container
      :class="
        leftbarVisible
          ? rightbarVisible
            ? 'map-rightBlank'
            : 'map-leftBlank'
          : 'map-noBlank'
      "
    />
  </div>
</template>

<script>
import MapContainer from "supermap3d-framework/src/Map.vue";

export default {
  name: "MapBar",
  components: {
    MapContainer,
  },
  data() {
    return {
      inputValue: "园区测绘",
      activeNames: ["1"],
      rightbarVisible: false,
      currentProject: "项目竣工测量1",
    };
  },
  computed: {
    leftbarVisible() {
      return this.$store.state.custom.leftbarVisible;
    },
  },
  mounted() {
    window.s3d.scene.undergroundMode = true;
    window.s3d.scene.screenSpaceCameraController.minimumZoomDistance = -500;
    window.s3d.scene.terrainProvider.isCreateSkirt = false;
  },
  methods: {
    handleChange(val) {
      // console.log(val);
    },
    handleShowRightbar(p) {
      this.rightbarVisible = true;
      this.currentProject = "项目竣工测量" + p;
      this.openPopup();
    },
    handleHideBar(key) {
      switch (key) {
        case "l":
          this.$store.commit("custom/setLeftbarVisible", false);
          break;
      }
      this.rightbarVisible = false;
    },
    openPopup() {
      window.s3d.openPopup({
        object: {
          layerName: "红线",
        },
        position: {
          longitude: 120.6038,
          latitude: 31.1827,
          height: 11,
        },
      });
    },
  },
};
</script>

<style scoped>
.left-container {
  display: flex;
  z-index: 100;
  position: absolute;
  flex-direction: column;
  background-color: white;
  width: 300px;
  height: 100%;
  border: 1px solid rgb(169, 169, 169);
}

.right-container {
  z-index: 100;
  position: absolute;
  right: 0px;
  flex-direction: column;
  background-color: white;
  width: 300px;
  height: 100%;
  border: 1px solid grey;
}

.el-aside {
  color: black;
  font: bold 12px "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  text-align: left;
  line-height: 20px;
  padding: 5px 0 5px 10px;
  width: 300px;
  border-bottom: 1px solid rgb(169, 169, 169);
}
.result-title {
  position: relative;
  left: 10px;
  top: 1px;
  height: 28px;
  border: 1px solid rgb(169, 169, 169);
  width: 80px;
  color: black;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  background-color: #fff;
  border-bottom: none;
  line-height: 28px;
  float: left;
}
.result-total {
  color: black;
  width: 280px;
  text-align: right;
  font-size: 12px;
  padding-top: 6px;
}
.result-num {
  color: #0593d3;
  margin: 0 5px;
  font-size: 14px;
}

.ul-bar {
  cursor: pointer;
  display: inline-block;
  width: 300px;
  margin-top: 5px;
  margin-left: 5px;
}
.ul-bar :hover {
  /* background-color: blue; */
}
.el-pagination {
  width: 300px;
  text-align: center;
  position: absolute;
  bottom: 0;
}

#onemap {
  height: 100%;
  width: 100%;
  background-color: grey;
}

.map-noBlank {
  margin: 0;
  width: calc(100% - 0px);
}
.map-leftBlank {
  margin-left: 300px;
  width: calc(100% - 300px);
}
.map-rightBlank {
  margin-left: 300px;
  margin-right: 300px;
  width: calc(100% - 600px);
}

p {
  color: black;
  font: 14px "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  white-space: nowrap;
}

p.littleTittle {
  padding: 10px 0 10px 10px;
  font-size: 12px;
}

table {
  padding-right: 10px;
}

td {
  text-align: left;
  height: 40px;
  vertical-align: top;
}

.messagebox {
  height: calc(100% - 186px);
  display: block;
  overflow: scroll;
  overflow-x: hidden;
}

.serial-img {
  background: url("~@/assets/img/main/pointer.png") no-repeat;
  background-size: 100% 100%;
  height: 36px;
  width: 36px;
  text-align: center;
  vertical-align: middle;
}
.serial-num {
  color: white;
  position: relative;
  top: 10px;
  left: -1px;
}
.el-timeline-item {
  position: relative;
  top: 20px;
  padding-bottom: 0px;
}
::v-deep .el-timeline-item__wrapper {
  padding-left: 20px;
}
::v-deep .el-collapse-item__wrap {
  border: none;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 1px;
}
.el-collapse-item {
  position: relative;
  top: -14px;
}
</style>