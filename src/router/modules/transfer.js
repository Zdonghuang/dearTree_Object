
import Layout from '@/layout'

const transferRouter = {
    path: '/XStransfer',
    component: Layout,
    meta: {
        title: '调拨',
        icon: 'fa fa-truck', roles: ['326', '327', '328']
    },
    children: [
        {
            path: 'XStransferList',
            component: () => import('@/views/XStransfer/XStransferList'),
            name: 'XStransferList',
            meta: { title: '分公司调拨单列表', roles: ['326'] }
        },
        {
            path: 'XStransferApplication',
            component: () => import('@/views/XStransfer/XStransferApplication'),
            name: 'XStransferApplication',
            meta: { title: '分公司调拨申请', roles: ['326'] },
            hidden: true
        },
        {
            path: 'printingTransfer',
            component: () => import('@/views/XStransfer/printingTransfer'),
            name: 'XSprintingTransfer',
            meta: { title: '分公司调拨申请', roles: ['326'] },
            hidden: true
        },
        {
            path: 'statement',
            component: () => import('@/views/XStransfer/index'), // Parent router-view
            name: 'statement',
            meta: { title: '分公司调拨结算单', roles: ['327', '328'] },
            children: [{
                path: 'RKstatementList',
                component: () => import('@/views/XStransfer/statement/RKstatementList'), // Parent router-view
                name: 'RKstatementList',
                meta: { title: '调拨入库结算单列表', roles: ['327'] }
            }, {
                path: 'RKstatementDetail',
                component: () => import('@/views/XStransfer/statement/RKstatementDetail'), // Parent router-view
                name: 'RKstatementDetail',
                meta: { title: '调拨入库结算', roles: ['327'] },
                hidden: true
            },
            {
                path: 'CKstatementList',
                component: () => import('@/views/XStransfer/statement/CKstatementList'), // Parent router-view
                name: 'CKstatementList',
                meta: { title: '调拨出库结算单列表', roles: ['328'] }
            },
            {
                path: 'CKstatementDetail',
                component: () => import('@/views/XStransfer/statement/CKstatementDetail'), // Parent router-view
                name: 'CKstatementDetail',
                meta: { title: '调拨出库结算', roles: ['328'] },
                hidden: true
            }
            ]
        }
    ]
}

export default transferRouter
