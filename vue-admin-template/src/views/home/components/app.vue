<template>
  <div class="home-app box">
    <div class="comTitle">CIM+应用</div>
    <div class="btnMore">查看更多</div>
    <div class="comContent">
      <div class="item sys1">CIM+ 农业农村管理</div>
      <div class="item sys2">CIM+ 教育</div>
      <div class="item sys3">CIM+ 地下空间</div>
      <div class="item sys4">CIM+ 古村落保护</div>
    </div>
  </div>
</template>

<script>
// import { defineComponent } from 'vue'
export default {}
</script>

<style  lang="scss" scoped>
.home-app {
  padding: 20px 0;
  color: white;
  position: relative;
  .comContent {
    display: flex;
    justify-content: space-between;
  }
  .item {
    width: 280px;
    height: 180px;
    font-size: 20px;
    padding-top: 40px;
    padding-left: 26px;
    background-size: 100% 100%;
  }
  .sys1 {
    background: url("~@/assets/img/home/app_img1.png") no-repeat;
  }
  .sys2 {
    background: url("~@/assets/img/home/app_img2.png") no-repeat;
  }
  .sys3 {
    background: url("~@/assets/img/home/app_img3.png") no-repeat;
  }
  .sys4 {
    background: url("~@/assets/img/home/app_img4.png") no-repeat;
  }
}
</style>
