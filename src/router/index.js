import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
import recoverRouter from './modules/recover'
import purchaseRouter from './modules/purchase'
import salesRouter from './modules/sales'
import leaseRouter from './modules/lease'
import transferRouter from './modules/transfer'
import WarehouseRouter from './modules/warehouse'
import financeRouter from './modules/finance'
import financesRouter from './modules/finances'
import reportRouter from './modules/report'
import basicInfoRouter from './modules/basicInfo'
import settingRouter from './modules/setting'
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

// {
//   path: '/404',
//   component: () => import('@/views/404'),
//   hidden: true
// },

{
  path: '/',
  component: Layout,
  redirect: '/index',
  meta: {
    title: '首页',
    icon: 'fa fa-dashboard',
    affix: true
  },
  children: [{
    path: 'index',
    name: 'index',
    component: () => import('@/views/index'),
    meta: {
      title: '首页',
    }
  }]
},
{
  path: 'PersonalCenter',
  component: Layout,
  meta: {
    title: '个人设置'
  },
  children: [{
    path: '/PersonalCenter',
    name: '个人设置',
    component: () => import('@/views/PersonalCenter/PersonalCenter'),
    meta: { title: '个人设置' },
    hidden: true
  }
  ]
},
  recoverRouter,//回收
  purchaseRouter,//采购
  salesRouter,//销售
  leaseRouter,//租赁
  transferRouter,//调拨
  WarehouseRouter,//仓库
  financeRouter,//财务
  reportRouter,//报表
  basicInfoRouter,//基础信息
  settingRouter, //设置
  financesRouter,
// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

// 异步挂载的路由

// 动态需要根据权限加载的路由表

export const asyncRoutes = [

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