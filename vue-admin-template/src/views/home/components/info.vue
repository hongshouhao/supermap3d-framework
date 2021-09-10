<template>
  <div class="home-info box">
    <div class="comTitle">政策新闻</div>
    <div class="btnMore">查看更多</div>
    <div class="comContent">
      <div class="item">
        <span class="info">关于市政务服务中心提供周六延时服务的温馨提示务的温馨提示</span>
        <span class="date">2021-04-22</span>
      </div>
      <div class="item">
        <span class="info">吴中资源规划分局组织开展“学党史 强信念 跟党走”参观学习活动</span>
        <span class="date">2021-04-19</span>
      </div>
      <div class="item">
        <span class="info">江苏省自然资源厅关于规范做好国土空间全域综合整治项目涉及永久基本农田调整有关工作的通知</span>
        <span class="date">2021-04-19</span>
      </div>
      <div class="item">
        <span class="info">省政府关于公布江苏省征地区片综合地价最低标准的通知</span>
        <span class="date">2021-04-18</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { defineComponent } from 'vue'
export default {}
</script>

<style  lang="scss" scoped>
.home-info {
  padding-top: 20px;
  padding-bottom: 40px;
  color: white;
  position: relative;
  .comTitle {
    border-bottom: 1px solid #09294d;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 120px;
      height: 4px;
      background: #0d1c28;
      bottom: 0px;
    }
  }
  .comContent {
    flex-direction: column;
    padding: 30px 0px;
  }
  .item {
    line-height: 40px;
    color: #33393f;
    .info {
      font-size: 20px;
      &::before {
        content: "";
        width: 26px;
        height: 26px;
        display: inline-block;
        background: url("~@/assets/img/home/info_icon.png");
        background-size: 26px 26px;
        margin-bottom: -6px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .date {
      float: right;
      font-size: 18px;
    }
  }
}
</style>
