/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const basicInfoRouter = {
    path: '/basicInfo',
    component: Layout,
    redirect: '/basicInfo/goodsControl',
    name: 'basicInfo',
    meta: {
        title: '基础',
        icon: 'fa fa-vcard-o',
        roles: ['701', '703', '801', '901', '1701', '1001', '1501', '1101','1401']
    },
    children: [
        {
            path: 'goods',
            component: () => import('@/views/basicInfo/goodsControl/goods'),
            name: 'goods',
            meta: { title: '商品管理', roles: ['701'] }
        },
        {
            path: 'goodsedit',
            name: 'goodsedit',
            component: () => import('@/views/basicInfo/goodsControl/goodsedit'),
            meta: { title: '编辑商品', roles: ['703'] },
            hidden: true
        },
        {
            path: 'clientele',
            component: () => import('@/views/basicInfo/transitUnit/clientele'),
            name: 'clientele',
            meta: { title: '客户', roles: ['801'] }
        },
        {
            path: 'supplier',
            component: () => import('@/views/basicInfo/transitUnit/supplier'),
            name: 'supplier',
            meta: { title: '供应商', roles: ['901'] }
        },
        {
            path: 'partners',
            component: () => import('@/views/basicInfo/transitUnit/partners'),
            name: 'partners',
            meta: { title: '合作伙伴', roles: ['1701'] }
        },
        {
            path: 'logistics',
            component: () => import('@/views/basicInfo/transitUnit/logistics'),
            name: 'logistics',
            meta: { title: '物流公司', roles: ['1001'] }
        },
        {
            path: 'warehouseControl',
            component: () => import('@/views/basicInfo/financialAccount/warehouseControl'),
            name: 'warehouseControl',
            meta: { title: '仓库设置', roles: ['1101'] }
        },
        {
            path: 'financialAccount',
            component: () => import('@/views/basicInfo/index'), // Parent router-view
            name: 'financialAccount',
            meta: { title: '财务设置', roles: ['1501','1401'] },
            children: [
                {
                    path: '/financeAccountList',
                    name: '/financeAccountList',
                    component: () => import('@/views/finance/financeAccountList'),
                    meta: { title: '账户管理', roles: ['1401'] }
                  },
                {
                    path: 'feeType',
                    component: () => import('@/views/basicInfo/financialAccount/feeType'),
                    name: 'feeType',
                    meta: { title: '科目管理', roles: ['1501'] }
                }
            ]
        },
    ]
}

export default basicInfoRouter
