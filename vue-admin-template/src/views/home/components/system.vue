<template>
  <div class="home-sys">
    <div class="box">
      <div class="comTitle">基础平台</div>
      <div class="comContent">
        <div class="item sys1"
             @click="handleOnemap()">自然资源一张图</div>
        <div class="item sys2"
             @click="handleGo()">二三维一体化</div>
        <div class="item sys3"
             @click="handleMore()">更多</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleGo () {
      this.$router.push('/onemap/main')
    },
    handleOnemap () {
      window.open('http://192.168.0.230/onemap_wzq/autoindex.html', '_blank')
    },
    handleMore () {
      window.open('http://192.168.0.230/onemap_wzq ', '_blank')
    }
  }
}
</script>

<style  lang="scss" scoped>
.home-sys {
  padding-top: 20px;
  padding-bottom: 40px;
  color: #5c6166;
  background: url("~@/assets/img/home/sys_bg.png");
  background-position-x: -20px;
  background-size: 110%;
  .item {
    width: 280px;
    height: 70px;
    line-height: 70px;
    margin-right: 50px;
    font-size: 20px;
    background: white;
    &::before {
      content: "";
      width: 32px;
      height: 32px;
      display: inline-block;
      margin: -8px 26px;
    }
  }
  .sys1 {
    &::before {
      background: url("~@/assets/img/home/sys_icon1.png");
    }
  }
  .sys2 {
    &::before {
      background: url("~@/assets/img/home/sys_icon2.png");
    }
  }
  .sys3 {
    &::before {
      background: url("~@/assets/img/home/sys_icon3.png");
    }
  }
}
</style>
