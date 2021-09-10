<template>
  <div class="home-work box">
    <div class="comTitle">行政办公</div>
    <div class="comContent">
      <div class="item sys1">业务审批系统</div>
      <div class="item sys2">OA系统</div>
      <div class="item sys3">更多</div>
    </div>
  </div>
</template>

<script>
// import { defineComponent } from 'vue'
export default {}
</script>

<style  lang="scss" >
.home-work {
  padding-top: 20px;
  padding-bottom: 40px;
  color: white;
  .item {
    width: 280px;
    height: 70px;
    line-height: 70px;
    margin-right: 50px;
    font-size: 20px;
    &::before {
      content: "";
      width: 32px;
      height: 32px;
      display: inline-block;
      margin: -8px 26px;
    }
  }
  .sys1 {
    background: #63bfcf;
    &::before {
      background: url("~@/assets/img/home/work_icon1.png");
    }
  }
  .sys2 {
    background: #65a9df;
    &::before {
      background: url("~@/assets/img/home/work_icon2.png");
    }
  }
  .sys3 {
    background: #e8bb5d;
    &::before {
      background: url("~@/assets/img/home/work_icon3.png");
    }
  }
}
</style>
