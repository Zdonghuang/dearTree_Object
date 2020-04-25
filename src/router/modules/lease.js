/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const leaseRouter = {
  path: '/lease',
  component: Layout,
  meta: {
    title: '租赁',
    icon: 'fa fa-random', roles: ['601', '602','606']
  },
  children: [
    {
      path: 'leaseList',
      name: 'leaseList',
      component: () => import('@/views/lease/leaseList'),
      meta: { title: '租赁单列表', roles: ['601'] }
    },
    {
      path: 'leaseOrder',
      name: 'leaseOrder',
      component: () => import('@/views/lease/leaseOrder'),
      meta: { title: '租赁申请单', roles: ['601'] },
      hidden: true
    },
    {
      path: 'leaseXZList',
      name: 'leaseXZList',
      component: () => import('@/views/lease/leaseXZList'),
      meta: { title: '续租单列表', roles: ['606'] }
    },
    {
      path: 'leaseXZOrder',
      name: 'leaseXZOrder',
      component: () => import('@/views/lease/leaseXZOrder'),
      meta: { title: '续租单', roles: ['606'] },
      hidden: true
    },
    {
      path: 'laseSettleList',
      name: 'laseSettleList',
      component: () => import('@/views/lease/laseSettleList'),
      meta: { title: '租赁结算单列表', roles: ['602'] }
    },
    {
      path: 'laseSettleOrder',
      name: 'laseSettleOrder',
      component: () => import('@/views/lease/laseSettleOrder'),
      meta: { title: '租赁结算单', roles: ['602'] },
      hidden: true
    },
    {
      path: 'leaseXZ',
      name: 'leaseXZ',
      component: () => import('@/views/lease/leaseXZ'),
      meta: { title: '租赁续租单', roles: ['606'] },
      hidden: true
    },
    {
      path: 'laseTYJ',
      name: 'laseTYJ',
      component: () => import('@/views/lease/laseTYJ'),
      meta: { title: '退押金', roles: ['602'] },
      hidden: true
    },
  ]
}

export default leaseRouter
