/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const financesRouter = {
  path: '/finances',
  component: Layout,
  meta: {
    title: '费用',
    icon: 'fa fa-credit-card'
  },
  children: [
    {
      path: '/payLists',
      name: '/payLists',
      component: () => import('@/views/finances/payList'),
      meta: { title: '其他支出列表'}
    },
    {
      path: '/pays',
      name: '/pays',
      component: () => import('@/views/finances/pay'),
      meta: { title: '其他支出单'},
      hidden: true
    },
    {
      path: '/borrowingLists',
      name: '/borrowingLists',
      component: () => import('@/views/finances/borrowingList'),
      meta: { title: '借款单列表' }
    },
    {
      path: '/borrowingOrders',
      name: '/borrowingOrders',
      component: () => import('@/views/finances/borrowingOrder'),
      meta: { title: '借款单' },
      hidden: true
    },
    {
      path: '/printingJKs',
      name: '/printingJKs',
      component: () => import('@/views/finances/printingJK'),
      meta: { title: '借款单' },
      hidden: true
    },
    {
      path: '/reimburseLists',
      name: '/reimburseLists',
      component: () => import('@/views/finances/reimburseList'),
      meta: { title: '报销单列表'}
    },
    {
      path: '/reimburseOrders',
      name: '/reimburseOrders',
      component: () => import('@/views/finances/reimburseOrder'),
      meta: { title: '报销单'},
      hidden: true
    },
    {
      path: '/writeOffLists',
      name: '/writeOffLists',
      component: () => import('@/views/finances/writeOffList'),
      meta: { title: '核销单列表'}
    },
    {
      path: '/writeOffs',
      name: '/writeOffs',
      component: () => import('@/views/finances/writeOff'),
      meta: { title: '核销单'},
      hidden: true
    },
    {
      path: '/printingBXHXs',
      name: '/printingBXHXs',
      component: () => import('@/views/finances/printingBXHX'),
      meta: { title: '核销单'},
      hidden: true
    }
  ]
}

export default financesRouter
