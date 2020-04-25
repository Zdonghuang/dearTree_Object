/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const salesRouter = {
  path: '/sales',
  component: Layout,
  meta: {
    title: '销售',
    icon: 'fa fa-scribd',
    roles: ['101', '102', '103', '104', '105', '106']
  },
  children: [
    {
      path: 'saleOrderList',
      name: 'saleOrderList',
      component: () => import('@/views/sales/saleOrderList'),
      meta: { title: '销售订单列表', roles: ['101'] ,keepAlive: true}
    },
    {
      path: 'saleOrder',
      name: 'saleOrder',
      component: () => import('@/views/sales/saleOrder'),
      meta: { title: '销售订单', roles: ['101'] ,keepAlive: true},
      hidden: true
    },
    {
      path: 'printingOrder',
      name: 'printingOrder',
      component: () => import('@/views/sales/printingOrder'),
      meta: { title: '销售订单', roles: ['101'] },
      hidden: true
    },
    {
      path: 'saleOutList',
      name: 'saleOutList',
      component: () => import('@/views/sales/saleOutList'),
      meta: { title: '销售退换货申请', roles: ['101'] }
    }, {
      path: 'saleSHorder',
      name: 'saleSHorder',
      component: () => import('@/views/sales/saleSHorder'),
      meta: { title: '销售送货单', roles: ['101'] },
      hidden: true
    },
    // {
    //   path: 'saleConstructionOrderList',
    //   name: 'saleConstructionOrderList',
    //   component: () => import('@/views/sales/saleConstructionOrderList'),
    //   meta: { title: '送货安装单' }
    // },
    // {
    //   path: 'saleConstructionOrder',
    //   name: 'saleConstructionOrder',
    //   component: () => import('@/views/sales/saleConstructionOrder'),
    //   meta: { title: '送货安装单' },
    //   hidden: true
    // },
    {
      path: 'saleReturnOrderList',
      name: 'saleReturnOrderList',
      component: () => import('@/views/sales/saleReturnOrderList'),
      meta: { title: '销售退货单列表', roles: ['102']}
    },
    {
      path: 'saleReturnOrder',
      name: 'saleReturnOrder',
      component: () => import('@/views/sales/saleReturnOrder'),
      meta: { title: '销售退货单', roles: ['102'] },
      hidden: true
    },
    {
      path: 'printingReturnOrder',
      name: 'printingReturnOrder',
      component: () => import('@/views/sales/printingReturnOrder'),
      meta: { title: '销售退货单', roles: ['102'] },
      hidden: true
    },
    {
      path: 'saleReplaceOrderList',
      name: 'saleReplaceOrderList',
      component: () => import('@/views/sales/saleReplaceOrderList'),
      meta: { title: '销售换货单列表', roles: ['103'] }
    },
    {
      path: 'saleReplaceOrder',
      name: 'saleReplaceOrder',
      component: () => import('@/views/sales/saleReplaceOrder'),
      meta: { title: '销售换货单', roles: ['103'] },
      hidden: true
    },
    {
      path: 'printingReplaceOrder',
      name: 'printingReplaceOrder',
      component: () => import('@/views/sales/printingReplaceOrder'),
      meta: { title: '销售换货单', roles: ['103'] },
      hidden: true
    },
    {
      path: 'settle',
      name: 'settle',
      component: () => import('@/views/sales/index'), // Parent router-view
      meta: { title: '销售结算单', roles: ['106', '104', '105'] },
      children: [
        // {
        //   path: 'conSettleOrderList',
        //   name: 'conSettleOrderList',
        //   component: () => import('@/views/sales/settle/conSettleOrderList'),
        //   meta: { title: '施工结算单' }
        // },
        // {
        //   path: 'conSettleOrder',
        //   name: 'conSettleOrder',
        //   component: () => import('@/views/sales/settle/conSettleOrder'),
        //   meta: { title: '施工结算单' },
        //   hidden: true
        // },
        {
          path: 'salesSettleOrderList',
          name: 'salesSettleOrderList',
          component: () => import('@/views/sales/settle/salesSettleOrderList'),
          meta: { title: '销售结算单列表', roles: ['106'],keepAlive: true }
        },
        {
          path: 'salesSettleOrder',
          name: 'salesSettleOrder',
          component: () => import('@/views/sales/settle/salesSettleOrder'),
          meta: { title: '销售结算单', roles: ['106'],keepAlive: true },
          hidden: true
        },
        {
          path: 'returnSettleOrderList',
          name: 'returnSettleOrderList',
          component: () => import('@/views/sales/settle/returnSettleOrderList'),
          meta: { title: '销售退货结算单列表', roles: ['104'] }
        },
        {
          path: 'returnSettleOrder',
          name: 'returnSettleOrder',
          component: () => import('@/views/sales/settle/returnSettleOrder'),
          meta: { title: '销售退货结算单', roles: ['104'] },
          hidden: true
        },
        {
          path: 'replaceSettleOrderList',
          name: 'replaceSettleOrderList',
          component: () => import('@/views/sales/settle/replaceSettleOrderList'),
          meta: { title: '销售换货结算单列表', roles: ['105'] }
        },
        {
          path: 'replaceSettleOrder',
          name: 'replaceSettleOrder',
          component: () => import('@/views/sales/settle/replaceSettleOrder'),
          meta: { title: '销售换货结算单', roles: ['105'] },
          hidden: true
        }

      ]
    }
  ]
}

export default salesRouter
