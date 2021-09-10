<template>
  <div class="sidebar-logo-container"
       :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse"
                   key="collapse"
                   class="sidebar-logo-link"
                   to="/">
        <div v-if="hasLogo"
             class="sidebar-logo" />
        <h1 v-else
            class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else
                   key="expand"
                   class="sidebar-logo-link"
                   to="/">
        <div v-if="hasLogo"
             class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: '吴中二三维一体化',
      hasLogo: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      background: url("~@/assets/img/logo.png");
      background-size: 100% 100%;
      margin: 9px 12px;
      border: none;
      float: left;
    }

    & .sidebar-title {
      // display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      text-align: left;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
