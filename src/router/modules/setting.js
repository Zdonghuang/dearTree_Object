/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const settingRouter = {
  path: '/setting',
  component: Layout,
  redirect: '/setting/limits/role',
  name: 'Setting',
  meta: {
    title: '设置',
    icon: 'fa fa-gears',
    roles: ['1301', '1201', '1601','999']
  },
  children: [
    {
      path: 'role',
      component: () => import('@/views/setting/limits/role'),
      name: 'role',
      meta: { title: '角色管理', roles: ['1301'] }
    },
    {
      path: 'organization',
      component: () => import('@/views/setting/organizationControl/organization'),
      name: 'organization',
      meta: { title: '用户管理', roles: ['1201'] }
    },
    {
      path: 'operationLog',
      component: () => import('@/views/setting/operationLog/log'), // Parent router-view
      name: 'operationLog',
      meta: { title: '登录日志', roles: ['1601'] }
    },
    {
      path: 'approval',
      component: () => import('@/views/setting/Approval/approvals'), // Parent router-view
      name: 'approval',
      meta: { title: '审批流程', roles: ['999'] }
    }
  ]
}

export default settingRouter
