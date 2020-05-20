
import Layout from '@/layout'

const warehouseRouter = {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/inventory',
  name: 'warehouse',
  meta: {
    title: '仓库',
    icon: 'fa fa-home', roles: ['310', '311', '301', '302', '304', '305', '306', '307', '308', '309', '331', '332', '312', '313', '314', '315', '316', '318', '319', '320', '323', '321', '317', '324', '325', '329', '303']
  },
  children: [
    {
      path: 'distribution',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'distribution',
      meta: { title: '备货单', roles: ['310', '311'] },
      children: [
        {
          path: 'saleDistributionList',
          component: () => import('@/views/warehouse/distribution/saleDistributionList'),
          name: 'saleDistributionList',
          meta: { title: '销售备货单列表', roles: ['310'],keepAlive: true }
        },
        {
          path: 'distributionDetail',
          component: () => import('@/views/warehouse/distribution/distributionDetail'),
          name: 'distributionDetail',
          meta: { title: '销售备货单', roles: ['310'] },
          hidden: true
        },
        {
          path: 'leaseDistributionList',
          component: () => import('@/views/warehouse/distribution/leaseDistributionList'),
          name: 'leaseDistributionList',
          meta: { title: '租赁备货单列表', roles: ['311'] }
        },
        {
          path: 'leaseDistributionDetail',
          component: () => import('@/views/warehouse/distribution/leaseDistributionDetail'),
          name: 'leaseDistributionDetail',
          meta: { title: '租赁备货单', roles: ['311'] },
          hidden: true
        }
      ]
    },
    {
      path: 'outbound',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'outbound',
      meta: { title: '出库单', roles: ['301', '302', '304', '305', '306', '307', '308', '309', '331', '332'] },
      children: [
        {
          path: 'saleOutboundList',
          component: () => import('@/views/warehouse/outbound/saleOutboundList'),
          name: 'saleOutboundList',
          meta: { title: '销售送货单列表', roles: ['301'], keepAlive: true }
        },
        {
          path: 'XSoutboundDetail',
          component: () => import('@/views/warehouse/outbound/XSoutboundDetail'),
          name: 'XSoutboundDetail',
          meta: { title: '销售送货单', roles: ['301'] },
          hidden: true
        },
        {
          path: 'XSDeliveryPrinting',
          component: () => import('@/views/warehouse/outbound/XSDeliveryPrinting'),
          name: 'XSDeliveryPrinting',
          meta: { title: '销售送货单' },
          hidden: true
        },
        {
          path: 'saleExchangeOutboundList',
          component: () => import('@/views/warehouse/outbound/saleExchangeOutboundList'),
          name: 'saleExchangeOutboundList',
          meta: { title: '销售换货出库单列表', roles: ['302'] }
        },
        {
          path: 'XSHHoutboundDetail',
          component: () => import('@/views/warehouse/outbound/XSHHoutboundDetail'),
          name: 'XSHHoutboundDetail',
          meta: { title: '销售换货出库单', roles: ['302'] },
          hidden: true
        },
        {
          path: 'BFoutboundList',
          component: () => import('@/views/warehouse/outbound/BFoutboundList'),
          name: 'BFoutboundList',
          meta: { title: '报废出库单列表', roles: ['304'] }
        },
        {
          path: 'BFoutboundDetail',
          component: () => import('@/views/warehouse/outbound/BFoutboundDetail'),
          name: 'BFoutboundDetail',
          meta: { title: '报废出库单', roles: ['304'] },
          hidden: true
        },
        {
          path: 'purchaseReturnOutboundList',
          component: () => import('@/views/warehouse/outbound/purchaseReturnOutboundList'),
          name: 'purchaseReturnOutboundList',
          meta: { title: '采购退货出库单列表', roles: ['305'] }
        },
        {
          path: 'CGTHoutboundDetail',
          component: () => import('@/views/warehouse/outbound/CGTHoutboundDetail'),
          name: 'CGTHoutboundDetail',
          meta: { title: '采购退货出库单', roles: ['305'] },
          hidden: true
        },
        {
          path: 'purchaseExchangeOutboundList',
          component: () => import('@/views/warehouse/outbound/purchaseExchangeOutboundList'),
          name: 'purchaseExchangeOutboundList',
          meta: { title: '采购换货出库单列表', roles: ['306'] }
        },
        {
          path: 'CGHHoutboundDetail',
          component: () => import('@/views/warehouse/outbound/CGHHoutboundDetail'),
          name: 'CGHHoutboundDetail',
          meta: { title: '采购换货出库单', roles: ['306'] },
          hidden: true
        },
        {
          path: 'transferoutbound',
          component: () => import('@/views/warehouse/outbound/transferoutbound'),
          name: 'transferoutbound',
          meta: { title: '内部调拨出库单列表', roles: ['307'] }
        },
        {
          path: 'transferoutboundDetail',
          component: () => import('@/views/warehouse/outbound/transferoutboundDetail'),
          name: 'transferoutboundDetail',
          meta: { title: '内部调拨出库单', roles: ['307'] },
          hidden: true
        },
        {
          path: 'XStransferoutbound',
          component: () => import('@/views/warehouse/outbound/XStransferoutbound'),
          name: 'XStransferoutbound',
          meta: { title: '分公司调拨出库单列表', roles: ['308'] }
        },
        {
          path: 'XStransferoutboundDetail',
          component: () => import('@/views/warehouse/outbound/XStransferoutboundDetail'),
          name: 'XStransferoutboundDetail',
          meta: { title: '分公司调拨出库单', roles: ['308'] },
          hidden: true
        },
        {
          path: 'ZZoutboundList',
          component: () => import('@/views/warehouse/outbound/ZZoutboundList'),
          name: 'ZZoutboundList',
          meta: { title: '组装出库单列表', roles: ['309'] }
        },
        {
          path: 'ZZoutboundDetail',
          component: () => import('@/views/warehouse/outbound/ZZoutboundDetail'),
          name: 'ZZoutboundDetail',
          meta: { title: '组装出库单', roles: ['309'] },
          hidden: true
        },
        {
          path: 'CZoutboundList',
          component: () => import('@/views/warehouse/outbound/CZoutboundList'),
          name: 'CZoutboundList',
          meta: { title: '拆装出库单列表', roles: ['331'] }
        },
        {
          path: 'CZoutboundDetail',
          component: () => import('@/views/warehouse/outbound/CZoutboundDetail'),
          name: 'CZoutboundDetail',
          meta: { title: '拆装出库单', roles: ['331'] },
          hidden: true
        },
        {
          path: 'ZLoutboundList',
          component: () => import('@/views/warehouse/outbound/ZLoutboundList'),
          name: 'ZLoutboundList',
          meta: { title: ' 租赁出库单列表', roles: ['332'] }
        },
        {
          path: 'ZLoutboundDetail',
          component: () => import('@/views/warehouse/outbound/ZLoutboundDetail'),
          name: 'ZLoutboundDetail',
          meta: { title: '租赁出库单', roles: ['332'] },
          hidden: true
        }
      ]
    },
    {
      path: 'inbound',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'inbound',
      meta: { title: '入库单', roles: ['312', '313', '314', '315', '316', '318', '319', '320', '323', '321'] },
      children: [
        {
          path: 'purchaseInboundList',
          component: () => import('@/views/warehouse/inbound/purchaseInboundList'),
          name: 'purchaseInboundList',
          meta: { title: '采购入库单列表', roles: ['312'] }
        }, {
          path: 'CGinboundDetail',
          component: () => import('@/views/warehouse/inbound/CGinboundDetail'),
          name: 'CGinboundDetail',
          meta: { title: '采购入库单', roles: ['312'] },
          hidden: true
        },
        {
          path: 'printingInbound',
          component: () => import('@/views/warehouse/inbound/printingInbound'),
          name: 'printingInbound',
          meta: { title: '采购入库单', roles: ['312'] },
          hidden: true
        },
        {
          path: 'purchaseExchangeInboundList',
          component: () => import('@/views/warehouse/inbound/purchaseExchangeInboundList'),
          name: 'purchaseExchangeInboundList',
          meta: { title: '采购换货入库单列表', roles: ['313'] }
        }, {
          path: 'CGHHinboundDetail',
          component: () => import('@/views/warehouse/inbound/CGHHinboundDetail'),
          name: 'CGHHinboundDetail',
          meta: { title: '采购换货入库单', roles: ['313'] },
          hidden: true
        },
        {
          path: 'recoverInboundLista',
          component: () => import('@/views/warehouse/inbound/recoverInboundLista'),
          name: 'recoverInboundLista',
          meta: { title: '回收入库单列表', roles: ['314'] }
        }, {
          path: 'HSBFinboundDetail',
          component: () => import('@/views/warehouse/inbound/HSBFinboundDetail'),
          name: 'HSBFinboundDetail',
          meta: { title: '回收入库单', roles: ['314'], keepAlive: true },
          hidden: true
        },
        {
          path: 'saleReturnInboundList',
          component: () => import('@/views/warehouse/inbound/saleReturnInboundList'),
          name: 'saleReturnInboundList',
          meta: { title: '销售退货入库单列表', roles: ['315'] }
        }, {
          path: 'XSTHinboundDetail',
          component: () => import('@/views/warehouse/inbound/XSTHinboundDetail'),
          name: 'XSTHinboundDetail',
          meta: { title: '销售退货入库单', roles: ['315'] },
          hidden: true
        },
        {
          path: 'saleExchangeInboundList',
          component: () => import('@/views/warehouse/inbound/saleExchangeInboundList'),
          name: 'saleExchangeInboundList',
          meta: { title: '销售换货入库单列表', roles: ['316'] }
        }, {
          path: 'XSHHinboundDetail',
          component: () => import('@/views/warehouse/inbound/XSHHinboundDetail'),
          name: 'XSHHinboundDetail',
          meta: { title: '销售换货入库单', roles: ['316'] },
          hidden: true
        },
        {
          path: 'transferInboundList',
          component: () => import('@/views/warehouse/inbound/transferInboundList'),
          name: 'transferInboundList',
          meta: { title: '内部调拨入库单列表', roles: ['318'] }
        },
        {
          path: 'transferInboundDetail',
          component: () => import('@/views/warehouse/inbound/transferInboundDetail'),
          name: 'transferInboundDetail',
          meta: { title: '内部调拨入库单', roles: ['318'] },
          hidden: true
        },
        {
          path: 'XStransferInboundList',
          component: () => import('@/views/warehouse/inbound/XStransferInboundList'),
          name: 'XStransferInboundList',
          meta: { title: '分公司调拨入库单列表', roles: ['319'] }
        },
        {
          path: 'XStransferInboundDetail',
          component: () => import('@/views/warehouse/inbound/XStransferInboundDetail'),
          name: 'XStransferInboundDetail',
          meta: { title: '分公司调拨入库单', roles: ['319'] },
          hidden: true
        },
        {
          path: 'ZZinboundList',
          component: () => import('@/views/warehouse/inbound/ZZinboundList'),
          name: 'ZZinboundList',
          meta: { title: '组装入库单列表', roles: ['320'] }
        },
        {
          path: 'ZZinboundDetail',
          component: () => import('@/views/warehouse/inbound/ZZinboundDetail'),
          name: 'ZZinboundDetail',
          meta: { title: '组装入库单', roles: ['320'] },
          hidden: true
        },
        {
          path: 'CZinboundList',
          component: () => import('@/views/warehouse/inbound/CZinboundList'),
          name: 'CZinboundList',
          meta: { title: '拆装入库单列表', roles: ['323'] }
        },
        {
          path: 'CZinboundDetail',
          component: () => import('@/views/warehouse/inbound/CZinboundDetail'),
          name: 'CZinboundDetail',
          meta: { title: '拆装入库单', roles: ['323'] },
          hidden: true
        },
        {
          path: 'ZLinboundList',
          component: () => import('@/views/warehouse/inbound/ZLinboundList'),
          name: 'ZLinboundList',
          meta: { title: '租赁入库单列表', roles: ['321'] }
        },
        {
          path: 'ZLinboundDetail',
          component: () => import('@/views/warehouse/inbound/ZLinboundDetail'),
          name: 'ZLinboundDetail',
          meta: { title: '租赁入库单', roles: ['321'] },
          hidden: true
        },
        {
          path: 'leasePrinting',
          component: () => import('@/views/warehouse/inbound/leasePrinting'),
          name: 'leasePrinting',
          meta: { title: '租赁出库单', roles: ['321'] },
          hidden: true
        }
      ]
    },
    {
      path: 'inventory',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'inventory',
      meta: { title: '盘点', roles: ['317', '324', '325'] },
      children: [
        {
          path: 'fullList',
          component: () => import('@/views/warehouse/inventory/fullList'),
          name: 'fullList',
          meta: { title: '盘点单列表', roles: ['317'] }
        },
        {
          path: 'fullDetail',
          component: () => import('@/views/warehouse/inventory/fullDetail'),
          name: 'fullDetail',
          meta: { title: '盘点单', roles: ['317'] , keepAlive: true},
          hidden: true
        },
        {
          path: 'scrappedList',
          component: () => import('@/views/warehouse/inventory/scrappedList'),
          name: 'scrappedList',
          meta: { title: '报废单列表', roles: ['324'] }
        }, {
          path: 'scrappedDetail',
          component: () => import('@/views/warehouse/inventory/scrappedDetail'),
          name: 'scrappedDetail',
          meta: { title: '报废单', roles: ['324'] , keepAlive: true},
          hidden: true
        },
        {
          path: 'scrappedSettleList',
          component: () => import('@/views/warehouse/inventory/scrappedSettleList'),
          name: 'scrappedSettleList',
          meta: { title: '报废结算单列表', roles: ['325'] }
        },
        {
          path: 'inventoryPrinting',
          component: () => import('@/views/warehouse/inventory/inventoryPrinting'),
          name: 'inventoryPrinting',
          meta: { title: '报废结算打印', roles: ['324'] },
          hidden: true
        },
        {
          path: 'scrappedSettleDetail',
          component: () => import('@/views/warehouse/inventory/scrappedSettleDetail'),
          name: 'scrappedSettleDetail',
          meta: { title: '报废结算单', roles: ['325'] },
          hidden: true
        }
      ]
    },

    {
      path: 'assembly',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'assembly',
      meta: { title: '组装', roles: ['329'] },
      children: [
        {
          path: 'assemblyOrder',
          component: () => import('@/views/warehouse/assembly/assemblyOrder'),
          name: 'assemblyOrder',
          meta: { title: '组装单', roles: ['329'] },
          hidden: true
        },
        {
          path: 'assemblyList',
          component: () => import('@/views/warehouse/assembly/assemblyList'),
          name: 'assemblyList',
          meta: { title: '组装单列表', roles: ['329'] }
        }
      ]
    },
    {
      path: 'disassembly',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      name: 'disassembly',
      meta: { title: '拆装', roles: ['303'] },
      children: [
        {
          path: 'disassemblyOrder',
          component: () => import('@/views/warehouse/disassembly/disassemblyOrder'),
          name: 'disassemblyOrder',
          meta: { title: '拆装单', roles: ['303'] },
          hidden: true
        },
        {
          path: 'disassemblyList',
          component: () => import('@/views/warehouse/disassembly/disassemblyList'),
          name: 'disassemblyList',
          meta: { title: '拆装单列表', roles: ['303'] }
        }
      ]
    },
    {
      path: 'transfer',
      component: () => import('@/views/warehouse/index'), // Parent router-view
      meta: { title: '内部调拨', roles: ['322'] },
      children: [
        {
          path: 'transferList',
          component: () => import('@/views/warehouse/transfer/transferList'),
          name: 'transferList',
          meta: { title: '内部调拨单列表', roles: ['322'] }
        }, {
          path: 'transferApplication',
          component: () => import('@/views/warehouse/transfer/transferApplication'),
          name: 'transferApplication',
          meta: { title: '内部调拨申请', roles: ['322'] },
          hidden: true
        },
        {
          path: 'printingTransfer',
          component: () => import('@/views/warehouse/transfer/printingTransfer'),
          name: 'printingTransfer',
          meta: { title: '内部调拨申请', roles: ['322'] },
          hidden: true
        }]
    },
    
  ]
}

export default warehouseRouter
