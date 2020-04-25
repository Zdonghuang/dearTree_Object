import Layout from '@/layout'
const reportRouter = {
  path: '/report',
  component: Layout,
  meta: {
    title: '报表',
    icon: 'fa fa-bar-chart',
    roles: ['330', '501', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533']
  },
  children: [{
      path: '/statList',
      name: '/statList',
      component: () => import('@/views/report/statList'),
      meta: {
        title: '财务流水',
        roles: ['501']
      }
    },
    // {
    //   path: 'stock',
    //   name: 'stock',
    //   component: () => import('@/views/report/stock'),
    //   meta: {
    //     title: '查库存',
    //     roles: ['330'],keepAlive: true
    //   }
    // },

    {
      path: 'searchStock',
      name: 'searchStock',
      component: () => import('@/views/report/searchStock'),
      meta: {
        title: '查库存-Mobile',
        roles: ['330'],
        keepAlive: true
      }
    },

    {
      path: 'NEWsearchStock',
      name: 'NEWsearchStock',
      component: () => import('@/views/report/NEWsearchStock'),
      meta: {
        title: 'NEW-查库存',
        roles: ['330'],
        keepAlive: true
      }
    },
    {
      path: 'crkls',
      name: 'crkls',
      component: () => import('@/views/report/crkls'),
      meta: {
        title: '出入库明细',
        roles: ['520']
      }
    },
    {
      path: 'logDetail',
      name: 'logDetail',
      component: () => import('@/views/report/logDetail'),
      meta: {
        title: '成本价更改历史',
        roles: ['521']
      }
    },
    // {
    //   path: 'FundFlowDetail',
    //   name: 'FundFlowDetail',
    //   component: () => import('@/views/report/FundFlowDetail'),
    //   meta: {
    //     title: '资金流水明细',
    //     roles: ['522']
    //   }
    // },
    {
      path: '/printingFundFlowDetail',
      name: 'printingFundFlowDetail',
      component: () => import('@/views/report/printingFundFlowDetail'),
      meta: {
        title: '资金流水明细',
        roles: ['522'],
      },
      hidden: true
    },
    // {
    //   path: 'FundStatementDetail',
    //   name: 'FundStatementDetail',
    //   component: () => import('@/views/report/FundStatementDetail'),
    //   meta: {
    //     title: '资金对账明细',
    //     roles: ['523']
    //   }
    // },
    // {
    //   path: 'FundBalanceReport',
    //   name: 'FundBalanceReport',
    //   component: () => import('@/views/report/FundBalanceReport'),
    //   meta: {
    //     title: '资金余额报表',
    //     roles: ['524']
    //   }
    // },
    // {
    //   path: 'salesAccountingDetail',
    //   name: 'salesAccountingDetail',
    //   component: () => import('@/views/report/salesAccountingDetail'),
    //   meta: {
    //     title: '商品销售明细',
    //     roles: ['525']
    //   }
    // },
    // {
    //   path: 'salesBusinessDetail',
    //   name: 'salesBusinessDetail',
    //   component: () => import('@/views/report/salesBusinessDetail'),
    //   meta: {
    //     title: '销售订单明细',
    //     roles: ['526']
    //   }
    // },
    {
      path: 'costDetailReport',
      name: 'costDetailReport',
      component: () => import('@/views/report/costDetailReport'),
      meta: {
        title: '费用明细报表',
        roles: ['527']
      }
    },
    {
      path: 'salesDailyDetails',
      name: 'salesDailyDetails',
      component: () => import('@/views/report/salesDailyDetails'),
      meta: {
        title: '销售日报',
        roles: ['330', '501', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533']
      }
    },
    {
      path: 'CustomerBusiness',
      name: 'CustomerBusiness',
      component: () => import('@/views/report/CustomerBusiness'),
      meta: {
        title: '客户往来明细',
        roles: ['330', '501', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533']
      },
      hidden: true
    },
    {
      path: 'CustomerBusinessSum',
      name: 'CustomerBusinessSum',
      component: () => import('@/views/report/CustomerBusinessSum'),
      meta: {
        title: '客户往来汇总',
        roles: ['330', '501', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533']
      }
    },
    {
      path: 'inventoryDetails',
      name: 'inventoryDetails',
      component: () => import('@/views/report/inventoryDetails'),
      meta: {
        title: '进销存明细',
        roles: ['330', '501', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533']
      }
    },
    {
      path: 'purchaseRecoverDetail',
      name: 'purchaseRecoverDetail',
      component: () => import('@/views/report/purchaseRecoverDetail'),
      meta: {
        title: '采购回收核算明细',
        roles: ['528']
      }
    },
    // {
    //   path: 'salesJSDetail',
    //   name: 'salesJSDetail',
    //   component: () => import('@/views/report/salesJSDetail'),
    //   meta: {
    //     title: '销售类结算单明细',
    //     roles: ['529']
    //   }
    // },
    // {
    //   path: 'InvoicingReport',
    //   name: 'InvoicingReport',
    //   component: () => import('@/views/report/InvoicingReport'),
    //   meta: {
    //     title: '进销存报表',
    //     roles: ['530']
    //   }
    // },
    // {
    //   path: 'InvoicingDetail',
    //   name: 'InvoicingDetail',
    //   component: () => import('@/views/report/InvoicingDetail'),
    //   meta: {
    //     title: '进销存明细',
    //     roles: ['531']
    //   }
    // },
    {
      path: 'yfTOysDetail',
      name: 'yfTOysDetail',
      component: () => import('@/views/report/yfTOysDetail'),
      meta: {
        title: '预付转预收明细表',
        roles: ['532']
      }
    },
    {
      path: 'outingIningDetail',
      name: 'outingIningDetail',
      component: () => import('@/views/report/outingIningDetail'),
      meta: {
        title: '待出待入明细',
        roles: ['533']
      }
    },
    {
      path: 'capitalBalanceDetails',
      name: 'capitalBalanceDetails',
      component: () => import('@/views/report/capitalBalanceDetails'),
      meta: {
        title: 'NEW-资金余额汇总',
        roles: ['524']
      }
    },
    {
      path: 'capitalCheckDetails',
      name: 'capitalCheckDetails',
      component: () => import('@/views/report/capitalCheckDetails'),
      meta: {
        title: 'NEW-资金对账明细',
        roles: ['523']
      }
    },
    {
      path: 'capitalFlowDetails',
      name: 'capitalFlowDetails',
      component: () => import('@/views/report/capitalFlowDetails'),
      meta: {
        title: 'NEW-资金流水明细',
        roles: ['522']
      }
    },
    {
      path: 'salesCheckDetails',
      name: 'salesCheckDetails',
      component: () => import('@/views/report/salesCheckDetails'),
      meta: {
        title: 'NEW-销售核算明细',
        roles: ['529']
      }
    },
    {
      path: 'salesGoodsDetails',
      name: 'salesGoodsDetails',
      component: () => import('@/views/report/salesGoodsDetails'),
      meta: {
        title: 'NEW-销售商品明细',
        roles: ['525']
      }
    }, {
      path: 'salesOrderDetails',
      name: 'salesOrderDetails',
      component: () => import('@/views/report/salesOrderDetails'),
      meta: {
        title: 'NEW-销售订单明细',
        roles: ['526']
      }
    }
  ]
}
export default reportRouter
