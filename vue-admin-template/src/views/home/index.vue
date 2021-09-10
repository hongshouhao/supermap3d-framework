<template>
  <div class="home-view">
    <!-- 导航 -->
    <nav>
      <div class="box">
        <div class="left">管理员账号，您好</div>
        <div class="right">
          <span>帮助中心</span>|<span class="loginOut"
                @click.native="logout">退出账号</span>
        </div>
      </div>
    </nav>
    <!-- 头信息 -->
    <header>
      <div class="logo box">
        <img src="../../assets/img/home/logo.png">
        <div class="right">
          <p>智慧吴中</p>
          <span>吴中自然资源一体化云平台</span>
        </div>
      </div>
    </header>
    <!-- 主体信息 -->
    <section>
      <News />
      <Work />
      <System />
      <App />
      <Info />
    </section>
    <!-- 底部信息 -->
    <footer>
      <div class="box">
        <div class="left">
          <p>联系我们 | 网站地图 | 不良内容举报</p>
          <p>主办单位: 苏州市自然资源和规划局吴中分局</p>
          <p>技术支持: 苏州工业园区测绘地理信息有限公司</p>
        </div>
        <div class="right">
          <img src="../../assets/img/home/zfwz.png">
          <img src="../../assets/img/home/dzjg.png">
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
// import { defineComponent } from 'vue'
import News from './components/news.vue'
import Work from './components/work.vue'
import Info from './components/info.vue'
import System from './components/system.vue'
import App from './components/app.vue'
export default {
  components: {
    News,
    Work,
    Info,
    System,
    App
  },
  methods: {
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss">
.home-view {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  .box {
    margin: 0 auto;
    width: 1200px;
  }
  nav {
    font-size: 14px;
    color: white;
    width: 100%;
    background: #2f6698;
    .box {
      display: flex;
      line-height: 28px;
      justify-content: space-between;
    }
    .right {
      span {
        padding: 0 10px;
        cursor: pointer;
      }
    }
  }
  header {
    width: 100%;
    height: 319px;
    background: url("~@/assets/img/home/wz.png") no-repeat center center;
    .logo {
      overflow: hidden;
      padding-top: 100px;
      img {
        width: 73px;
        height: 45px;
        float: left;
        margin: 20px 30px 0px 0px;
      }
      .right {
        float: left;
        p {
          width: 144px;
          font-size: 35px;
          font-weight: bold;
          font-style: italic;
          color: #171717;
        }
        span {
          width: 240px;
          font-size: 20px;
          font-weight: 400;
          color: #484848;
        }
      }
    }
  }
  section {
    .btnMore {
      width: 146px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #000000;
      color: #000000;
      font-size: 16px;
      text-align: center;
      position: absolute;
      right: 0px;
      top: 60px;
      cursor: pointer;
      &::after {
        content: "";
        width: 16px;
        height: 11px;
        margin-left: 20px;
        display: inline-block;
        background: url("~@/assets/img/home/btnMore.png") no-repeat center
          center;
      }
    }
    .comTitle {
      line-height: 100px;
      font-size: 28px;
      font-weight: bold;
      color: #0d1c28;
    }
    .comContent {
      display: flex;
      flex-direction: row;
      cursor: pointer;
    }
  }
  footer {
    padding-bottom: 4px;
    font-size: 14px;
    color: white;
    width: 100%;
    height: 110px;
    background: #2f6698;
    .box {
      display: flex;
      height: 100%;
      justify-content: space-between;
      align-items: flex-end;
      p {
        line-height: 28px;
        margin: 0;
        padding: 0;
      }
      .right {
        img {
          margin-left: 20px;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
