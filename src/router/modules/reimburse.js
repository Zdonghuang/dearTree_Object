import Layout from '@/layout'
const reimburseRouter = {
  path: '/reimburse',
  component: Layout,
  meta: {
    title: '报销',
    icon: 'fa fa-file-text-o'
  },
  children: [{
    path: 'reimburseList',
    name: 'reimburseList',
    component: () => import('@/views/reimburse/reimburseList'),
    meta: {
      title: '报销列表'
    }
  },
  {
    path: 'reimburseOrder',
    name: 'reimburseOrder',
    component: () => import('@/views/reimburse/reimburseOrder'),
    meta: {
      title: '报销单'
    }
  }]
}
export default reimburseRouter
