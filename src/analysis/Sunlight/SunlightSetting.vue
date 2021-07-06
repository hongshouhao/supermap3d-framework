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
        <label>日 期</label>
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
                 @click="runSunlight">日照效果</el-button>
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
      date: "",
      currentHour: 8,
      marks: {
      },
      startHour: 8,
      endHour: 18,
      sunlightTool: null,
      shadowQueryTool: null,
    }
  },
  beforeMount () {
    this.date = new Date().toLocaleDateString()
    for (let i = this.startHour; i <= this.endHour; i++) {
      let mrk = {
        style: {
          color: '#1989FA'
        },
        label: `${i}:00`
      }
      this.marks[i] = mrk
    }
  },
  mounted () {
  },
  methods: {
    init () {
      if (!this.sunlightTool) {
        this.sunlightTool = new SunlightTool(window.viewer)
      }
      if (!this.shadowQueryTool) {
        this.shadowQueryTool = new ShadowQueryTool(window.viewer)
      }
      this.timeChanged()
    },
    timeChanged () {
      this.sunlightTool.setTimeRange(this.date, this.startHour, this.endHour)
      this.shadowQueryTool.setTimeRange(this.date, this.startHour, this.endHour)
    },

    runSunlight () {
      let _this = this
      _this.sunlightTool.run((h) => {
        _this.currentHour = h
      })
    },

    doShadowQuery () {
      this.shadowQueryTool.start()
    },

    setCurrentTime () {
      let newDate = new Date(this.date.valueOf())
      newDate.setHours(this.currentHour)
      window.viewer.clock.currentTime = Cesium.JulianDate.fromDate(newDate)
    },

    reset () {
      this.sunlightTool.clear()
      this.shadowQueryTool.clear()
    }
  }
}
</script>
<style scoped lang="scss">
.sunlight-setting {
  height: 130px;
  width: 400px;
  padding: 10px 25px;

  .others {
    display: flex;
    margin-top: 25px;
    .sun-date {
      width: 300px;
      .el-date-editor {
        width: 130px;
      }
    }
  }
}
</style>