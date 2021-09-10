<template>
  <div class="home-news">
    <div class="item box">
      <span class="img" />
      <span style="color:#000;">【公告】
        吴中区自然资源规划局关于征集2021年度规划科研课题重点研究领域和研究方向的函</span>
      <span class="more">更多</span>
    </div>
  </div>
</template>

<script>
// import { defineComponent } from 'vue'
export default {}
</script>

<style  lang="scss" scoped>
.home-news {
  font-size: 16px;
  background: #f1f2f3;
  .item {
    line-height: 60px;
    .img {
      width: 25px;
      height: 21px;
      display: inline-block;
      background: url("~@/assets/img/home/gg.png");
      top: 5px;
      position: relative;
      margin-right: 10px;
    }
    .more {
      cursor: pointer;
      margin-left: 50px;
      color: #006eff;
      &:after {
        content: ">>";
        // padding-left: 10px;
      }
    }
  }
}
</style>
