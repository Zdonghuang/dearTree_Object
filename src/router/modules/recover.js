/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const recoverRouter = {
  path: '/recover',
  component: Layout,
  meta: {
    title: '回收',
    icon: 'fa fa-recycle',
    roles: ['201', '202', '203', '204', '205']
  },
  children: [
    {
      path: 'recoverOrderList',
      name: 'recoverOrderList',
      component: () => import('@/views/recover/recoverOrderList'),
      meta: { title: '回收报价单列表', roles: ['201'] }
    },
    {
      path: 'recoverOrder',
      name: 'recoverOrder',
      component: () => import('@/views/recover/recoverOrder'),
      meta: { title: '回收报价单', roles: ['201'] },
      hidden: true
    },
    {
      path: 'printingRecover',
      name: 'printingRecover',
      component: () => import('@/views/recover/printingRecover'),
      meta: { title: '回收报价单', roles: ['201'] },
      hidden: true
    },
    {
      path: 'printingRecoverCon',
      name: 'printingRecoverCon',
      component: () => import('@/views/recover/printingRecoverCon'),
      meta: { title: '回收施工单', roles: ['203'] },
      hidden: true
    },
    {
      path: 'constructionbudgetList',
      name: 'constructionbudgetList',
      component: () => import('@/views/recover/constructionbudgetList'),
      meta: { title: '施工预算列表', roles: ['202'] }
    },
    {
      path: 'constructionbudget',
      name: 'constructionbudget',
      component: () => import('@/views/recover/constructionbudget'),
      meta: { title: '施工预算', roles: ['202'] },
      hidden: true
    },
    {
      path: 'constructionList',
      name: 'constructionList',
      component: () => import('@/views/recover/constructionList'),
      meta: { title: '施工项目列表', roles: ['203'] }
    },
    {
      path: 'construction',
      name: 'construction',
      component: () => import('@/views/recover/construction'),
      meta: { title: '施工项目', roles: ['203'] },
      hidden: true
    },
    {
      path: 'statement',
      component: () => import('@/views/recover/statement/index'),
      meta: { title: '回收项目结算', roles: ['205', '204'] },
      children: [{
        path: 'settlementList',
        name: 'settlementList',
        component: () => import('@/views/recover/statement/settlementList'),
        meta: { title: '回收商品结算列表', roles: ['205'] }
      },
      {
        path: 'settlement',
        name: 'settlement',
        component: () => import('@/views/recover/statement/settlement'),
        meta: { title: '回收商品结算', roles: ['205'] },
        hidden: true
      },
      {
        path: 'SGstatementList',
        name: 'SGstatementList',
        component: () => import('@/views/recover/statement/SGstatementList'),
        meta: { title: '施工结算列表', roles: ['204'] }
      },
      {
        path: 'SGstatement',
        name: 'SGstatement',
        component: () => import('@/views/recover/statement/SGstatement'),
        meta: { title: '施工结算', roles: ['204'] },
        hidden: true
      }
      ]
    },
  ]
}
export default recoverRouter
