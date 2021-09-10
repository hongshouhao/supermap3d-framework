import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import Store from '@/store'
import Mapbar from '@/views/main/components/mapbar'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/home',
    component: () => import('@/views/home/index')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/onemap',
    component: Layout,
    redirect: '/main',
    children: [{
      path: 'main',
      name: 'Main',
      component: Mapbar,
      meta: { title: '地图', icon: 'dashboard' }
    }]
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'chain',
        name: 'Chain',
        component: Mapbar,
        beforeEnter: () => {
          Store.commit('custom/setLeftbarVisible', true)
        },
        meta: { title: '项目查询', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
