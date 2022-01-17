<template>
  <div class="sunlight-setting">
    <el-slider v-model="currentHour"
               :show-tooltip="false"
               :min="8"
               :max="18"
               :step="1"
               :marks="marks"
               show-stops
               @input="setCurrentTime">
    </el-slider>
    <div class="others">
      <div class="sun-date">
        <label style="margin-right:6px;margin-left:-10px; ">日期</label>
        <el-date-picker v-model="date"
                        :clearable="false"
                        size="small"
                        type="date"
                        placeholder="选择日期"
                        @change="timeChanged">
        </el-date-picker>
      </div>
      <el-button type="primary"
                 size="small"
                 @click="runSunlight">{{
        startText
      }}</el-button>
      <el-button type="primary"
                 size="small"
                 @click="doShadowQuery">阴影分析</el-button>
    </div>
  </div>
</template>

<script>
import ShadowQueryTool from './ShadowQueryTool'
import SunlightTool from './SunlightTool'

export default {
  data () {
    return {
      date: '',
      currentHour: 8,
      startText: '日照效果',
      started: false,
      marks: {},
      startHour: 8,
      endHour: 18,
    }
  },
  beforeMount () {
    this.date = new Date().toLocaleDateString()
    for (let i = this.startHour; i <= this.endHour; i++) {
      let mrk = {
        style: {
          color: '#1989FA',
        },
        label: `${i}:00`,
      }
      this.marks[i] = mrk
    }
  },
  mounted () { },
  methods: {
    init () {
      if (!this.sunlightTool) {
        this.sunlightTool = new SunlightTool(this.$viewer)
      }
      if (!this.shadowQueryTool) {
        this.shadowQueryTool = new ShadowQueryTool(this.$viewer)
      }
      this.timeChanged()
    },
    timeChanged () {
      this.sunlightTool.setTimeRange(this.date, this.startHour, this.endHour)
      this.shadowQueryTool.setTimeRange(this.date, this.startHour, this.endHour)
    },

    runSunlight () {
      let _this = this
      if (
        _this.sunlightTool.state === 'none' ||
        _this.sunlightTool.state === 'paused'
      ) {
        _this.sunlightTool.start(
          (h) => {
            _this.currentHour = h
          },
          () => {
            _this.startText = '日照效果'
          }
        )
        _this.startText = '暂停'
      } else if (_this.sunlightTool.state === 'running') {
        _this.sunlightTool.pause()
        _this.startText = '继续'
      }
    },

    doShadowQuery () {
      this.shadowQueryTool.start()
    },

    setCurrentTime () {
      let newDate = new Date(this.date.valueOf())
      newDate.setHours(this.currentHour)
      this.$viewer.clock.currentTime = Cesium.JulianDate.fromDate(newDate)
    },

    reset () {
      if (this.sunlightTool) this.sunlightTool.clear()
      if (this.shadowQueryTool) this.shadowQueryTool.clear()
    },
  },
}
</script>
<style lang="scss">
.sunlight-setting {
  // height: 130px;
  width: 450px;
  padding: 0px 15px;

  .others {
    display: flex;
    margin-top: 25px;
    .sun-date {
      display: flex;
      width: 300px;
      .el-date-editor {
        width: 135px;
      }
    }
  }
  .el-slider__runway {
    background-color: rgba(25, 137, 250, 0.3) !important;
  }
}
</style>
