/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const financeRouter = {
  path: '/finance',
  component: Layout,
  meta: {
    title: '财务',
    icon: 'fa fa-credit-card', roles: ['505', '506', '507', '508', '509', '510', '511','379','380','3801','382']
  },
  children: [
    // {
    //   path: '/fundsLog',
    //   name: '/fundsLog',
    //   component: () => import('@/views/finance/fundsLog'),
    //   meta: { title: '资金流水' }
    // },
    // {
    //   path: '/financeList',
    //   name: '/financeList',
    //   component: () => import('@/views/finance/financeList'),
    //   meta: { title: '财务报表' }
    // },
    // {
    //   path: '/approval',
    //   name: '/approval',
    //   component: () => import('@/views/finance/approval'),
    //   meta: { title: '费用审批' }
    // },

    {
      path: '/financialAdvancesList',
      name: '/financialAdvancesList',
      component: () => import('@/views/finance/financialAdvancesList'),
      meta: { title: '预付款单列表', roles: ['505'] }
    },
    {
      path: '/financePay',
      name: '/financePay',
      component: () => import('@/views/finance/financePay'),
      meta: { title: '预付款单', roles: ['505'] },
      hidden: true
    },
    {
      path: '/printingFinancePay',
      name: '/printingFinancePay',
      component: () => import('@/views/finance/printingFinancePay'),
      meta: { title: '预付款单', roles: ['505'] },
      hidden: true
    },
    {
      path: '/financeAdvanceList',
      name: '/financeAdvanceList',
      component: () => import('@/views/finance/financeAdvanceList'),
      meta: { title: '预收款单列表', roles: ['506'] }
    },
    {
      path: '/financeAdd',
      name: '/financeAdd',
      component: () => import('@/views/finance/financeAdd'),
      meta: { title: '预收款单', roles: ['506'] },
      hidden: true
    },
    // {
    //   path: '/depositList',
    //   name: '/depositList',
    //   component: () => import('@/views/finance/depositList'),
    //   meta: { title: '押金单列表', roles: ['507'] }
    // },
    {
      path: '/deposit',
      name: '/deposit',
      component: () => import('@/views/finance/deposit'),
      meta: { title: '押金单', roles: ['507'] },
      hidden: true
    },
    {
      path: '/payList',
      name: '/payList',
      component: () => import('@/views/finance/payList'),
      meta: { title: '其他支出列表', roles: ['508'] }
    },
    {
      path: '/pay',
      name: '/pay',
      component: () => import('@/views/finance/pay'),
      meta: { title: '其他支出单', roles: ['508'] },
      hidden: true
    },
    {
      path: '/collectList',
      name: '/collectList',
      component: () => import('@/views/finance/collectList'),
      meta: { title: '其他收入列表', roles: ['509'] }
    },
    {
      path: '/collect',
      name: '/collect',
      component: () => import('@/views/finance/collect'),
      meta: { title: '其他收入单', roles: ['509'] },
      hidden: true
    },
    {
      path: '/borrowingList',
      name: '/borrowingList',
      component: () => import('@/views/finance/borrowingList'),
      meta: { title: '借款单列表', roles: ['510'] }
    },
    {
      path: '/borrowingOrder',
      name: '/borrowingOrder',
      component: () => import('@/views/finance/borrowingOrder'),
      meta: { title: '借款单', roles: ['510'] },
      hidden: true
    },
    {
      path: '/printingJK',
      name: '/printingJK',
      component: () => import('@/views/finance/printingJK'),
      meta: { title: '借款单', roles: ['510'] },
      hidden: true
    },
    {
      path: '/reimburseList',
      name: '/reimburseList',
      component: () => import('@/views/finance/reimburseList'),
      meta: { title: '报销单列表', roles: ['511'] }
    },
    {
      path: '/reimburseOrder',
      name: '/reimburseOrder',
      component: () => import('@/views/finance/reimburseOrder'),
      meta: { title: '报销单', roles: ['511'] },
      hidden: true
    },
    {
      path: '/writeOffList',
      name: '/writeOffList',
      component: () => import('@/views/finance/writeOffList'),
      meta: { title: '核销单列表', roles: ['382'] }
    },
    {
      path: '/writeOff',
      name: '/writeOff',
      component: () => import('@/views/finance/writeOff'),
      meta: { title: '核销单', roles: ['382'] },
      hidden: true
    },
    {
      path: '/printingBXHX',
      name: '/printingBXHX',
      component: () => import('@/views/finance/printingBXHX'),
      meta: { title: '核销单', roles: ['382'] },
      hidden: true
    },
    {
      path: '/zjzhdList',
      name: '/zjzhdList',
      component: () => import('@/views/finance/zjzhdList'),
      meta: { title: '资金转换单列表', roles: ['381'] }
    },
    {
      path: '/zjzhd',
      name: '/zjzhd',
      component: () => import('@/views/finance/zjzhd'),
      meta: { title: '资金转换单', roles: ['381'] },
      hidden: true
    },
    {
      path: '/ysjsdList',
      name: '/ysjsdList',
      component: () => import('@/views/finance/ysjsdList'),
      meta: { title: '预收减少单列表', roles: ['379'] }
    },
    {
      path: '/ysjsd',
      name: '/ysjsd',
      component: () => import('@/views/finance/ysjsd'),
      meta: { title: '预收减少单', roles: ['379'] },
      hidden: true
    },
    {
      path: '/yfjsdList',
      name: '/yfjsdList',
      component: () => import('@/views/finance/yfjsdList'),
      meta: { title: '预付减少单列表', roles: ['380'] }
    },
    {
      path: '/yfjsd',
      name: '/yfjsd',
      component: () => import('@/views/finance/yfjsd'),
      meta: { title: '预付减少单', roles: ['380'] },
      hidden: true
    }
  ]
}

export default financeRouter
