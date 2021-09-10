<template>
  <div class="login-view">
    <div class="leftContainer">
      <div class="bg">
        <div class="title" />
      </div>
    </div>
    <div class="rightContainer">
      <div class="loginMain">
        <p class="head">欢迎登录</p>
        <div class="login-container">
          <el-form ref="loginForm"
                   :model="loginForm"
                   :rules="loginRules"
                   class="login-form"
                   auto-complete="on"
                   label-position="left">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input ref="username"
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        name="username"
                        type="text"
                        tabindex="1"
                        auto-complete="on" />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="请输入密码"
                        name="password"
                        tabindex="2"
                        auto-complete="on"
                        @keyup.enter.native="handleLogin" />
              <span class="show-pwd"
                    @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-button :loading="loading"
                       type="primary"
                       style="width: 100%; margin-bottom: 30px"
                       @click.native.prevent="handleLogin">登 录</el-button>
          </el-form>
        </div>
        <p class="tips">为保证系统稳定，建议用<span>谷歌浏览器</span></p>
      </div>
      <div class="footer">技术支持：苏州工业园区测绘地理信息有限公司</div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        console.log(this.loginForm)
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || '/home' })
              this.$router.push('/home')
              this.loading = false
            })
            .catch((err) => {
              console.error(err)
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-view {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: absolute;

  .leftContainer {
    flex-grow: 1;
    background: url("~@/assets/img/login/loginBg.jpg") center 0 no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .bg {
      width: 100%;
      height: 350px;
      background: rgba(0, 0, 0, 0.15);
      .title {
        height: 100%;
        background: url("~@/assets/img/login/title.png") center center no-repeat;
        background-size: 100% auto;
        max-width: 1000px;
        margin: 0 auto;
      }
    }
  }
  .rightContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 400px;
    color: #999999;
    background: #2d3a4b;

    .loginMain {
      width: 400px;
      margin-top: 100px;
      p.head {
        font-size: 33px;
        height: 100px;
        text-align: center;
        color: #fff;
      }
      p.tips {
        text-align: center;
        float: left;
        width: 100%;
        margin-top: 40px;
        font-size: 14px;
        span {
          padding-left: 6px;
          color: #308ff0;
          cursor: pointer;
        }
      }
    }
    .footer {
      height: 100px;
      font-size: 14px;
    }
  }
}
</style>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  // min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
