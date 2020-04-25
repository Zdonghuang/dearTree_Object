/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const purchaseRouter = {
  path: 'purchase',
  component: Layout,
  meta: {
    title: '采购',
    icon: 'fa fa-shopping-cart',
    roles: ['407', '401', '402', '403', '404', '405', '506']
  },
  children: [{
    path: '/quotationsheetList',
    name: 'quotationsheetList',
    component: () => import('@/views/purchase/quotationsheetList'),
    meta: {
      title: '采购申请单列表', roles: ['407']
    }
  },
  {
    path: '/quotationsheetDetail',
    name: 'quotationsheetDetail',
    component: () => import('@/views/purchase/quotationsheetDetail'),
    meta: {
      title: '采购申请', roles: ['407']
    },
    hidden: true
  },
  {
    path: '/quotationsheenexttList',
    name: 'quotationsheenexttList',
    component: () => import('@/views/purchase/quotationsheenexttList'),
    meta: {
      title: '采购报价单列表', roles: ['401']
    }
  },
  {
    path: '/quotationsheetDetailnext',
    name: 'quotationsheetDetailnext',
    component: () => import('@/views/purchase/quotationsheetDetailnext'),
    meta: {
      title: '采购报价', roles: ['401']
    },
    hidden: true
  },
  {
    path: '/CGBJprinting',
    name: 'CGBJprinting',
    component: () => import('@/views/purchase/CGBJprinting'),
    meta: {
      title: '采购报价', roles: ['401']
    },
    hidden: true
  },
  {
    path: '/returngoodsList',
    name: 'returngoodsList',
    component: () => import('@/views/purchase/returngoodsList'),
    meta: {
      title: '采购退货单列表', roles: ['402']
    }
  },
  {
    path: '/returngoodsDetail',
    name: 'returngoodsDetail',
    component: () => import('@/views/purchase/returngoodsDetail'),
    meta: {
      title: '采购退货单', roles: ['402']
    },
    hidden: true
  },
  {
    path: '/exchangegoodsList',
    name: 'exchangegoodsList',
    component: () => import('@/views/purchase/exchangegoodsList'),
    meta: {
      title: '采购换货单列表', roles: ['403']
    }
  },
  {
    path: '/exchangegoodsDetail',
    name: 'exchangegoodsDetail',
    component: () => import('@/views/purchase/exchangegoodsDetail'),
    meta: {
      title: '采购换货单', roles: ['403']
    },
    hidden: true
  },
  {
    path: '/statement',
    component: () => import('@/views/purchase/statement/index'),
    meta: {
      title: '采购结算单', roles: ['404', '405', '406']
    },
    children: [{
      path: '/CGstatementList',
      name: 'CGstatementList',
      component: () => import('@/views/purchase/statement/CGstatementList'),
      meta: {
        title: '采购结算列表', roles: ['404']
      }
    }, {
      path: '/CGstatementDetail',
      name: 'CGstatementDetail',
      component: () => import('@/views/purchase/statement/CGstatementDetail'),
      meta: {
        title: '采购结算', roles: ['404']
      },
      hidden: true
    },
    {
      path: '/THstatementList',
      name: 'THstatementList',
      component: () => import('@/views/purchase/statement/THstatementList'),
      meta: {
        title: '采购退货结算列表', roles: ['405']
      }
    }, {
      path: '/THstatementDetail',
      name: 'THstatementDetail',
      component: () => import('@/views/purchase/statement/THstatementDetail'),
      meta: {
        title: '采购退货结算', roles: ['405']
      },
      hidden: true
    },
    {
      path: '/HHstatementList',
      name: 'HHstatementList',
      component: () => import('@/views/purchase/statement/HHstatementList'),
      meta: {
        title: '采购换货结算列表', roles: ['406']
      }
    },
    {
      path: '/HHstatementDetail',
      name: 'HHstatementDetail',
      component: () => import('@/views/purchase/statement/HHstatementDetail'),
      meta: {
        title: '采购换货结算', roles: ['406']
      },
      hidden: true
    }
    ]
  }
    // {
    //   path: '/inventorycheck',
    //   name: '查库存',
    //   component: () => import('@/views/purchase/inventorycheck'),
    //   meta: {
    //     title: '查库存'
    //   }
    // }
  ]
}

export default purchaseRouter
