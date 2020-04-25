import Vue from 'vue'

// 结算状态
Vue.filter('settleStatus', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = '未结算'
  }
  if (num === 1) {
    val = '已结算'
  }
  if (num === 2) {
    val = '部分结算'
  }
  return val
})
Vue.filter('settleClass', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = 'danger'
  }
  if (num === 1) {
    val = 'success'
  }
  if (num === 2) {
    val = 'warning'
  }
  return val
})

// 审核状态
Vue.filter('ApprovalStatus', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = '无审批'
  }
  if (num === 2) {
    val = '审核中'
  }
  if (num === 3) {
    val = '审核通过'
  }
  if (num === 4) {
    val = '审核拒绝'
  }
  return val
})
Vue.filter('PD_STATUS', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = '初始单据'
  }
  if (num === 1) {
    val = '待记账'
  }
  if (num === 2) {
    val = '单据完结'
  }
  if (num === 3) {
    val = '核销完成'
  }
  if (num === 4) {
    val = '红冲'
  }
  if (num === 5) {
    val = '已红冲'
  }
  return val
})
Vue.filter('PD_APPROVALSTATUSV', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = '无审批'
  }
  if (num === 1) {
    val = '审核中'
  }
  if (num === 2) {
    val = '审核通过'
  }
  if (num === 3) {
    val = '审核拒绝'
  }
  return val
})
Vue.filter('orderType1', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = ''
  }
  if (num === 1) {
    val = 'warning'
  }
  if (num === 2) {
    val = 'success'
  }
  if (num === 3) {
    val = 'danger'
  }
  return val
})
Vue.filter('orderType', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = ''
  }
  if (num === 1) {
    val = 'warning'
  }
  if (num === 2) {
    val = 'success'
  }
  if (num === 3) {
    val = 'success'
  }
  if (num === 4) {
    val = 'danger'
  }
  if (num === 5) {
    val = 'danger'
  }
  return val
})
Vue.filter('ApprovalClass', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = ''
  }
  if (num === 2) {
    val = 'warning'
  }
  if (num === 3) {
    val = 'success'
  }
  if (num === 4) {
    val = 'danger'
  }
  return val
})
Vue.filter('rInoutclass', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = 'warning'
  }
  if (num === 1) {
    val = 'success'
  }
  return val
})
Vue.filter('rInoutstatus', (val) => {
  const num = Number(val)
  if (num === 0) {
    val = '待入库'
  }
  if (num === 1) {
    val = '已入库'
  }
  return val
})
// 单据状态
Vue.filter('orderStatus', (val) => {
  const num = Number(val)
  if (num === 1) {
    val = '初始单据'
  }
  if (num === 2) {
    val = '审核中'
  }
  if (num === 3) {
    val = '审核通过'
  }
  if (num === 4) {
    val = '审核拒绝'
  }
  if (num === 5) {
    val = '单据中止'
  }
  if (num === 6) {
    val = '合同上传中'
  }
  if (num === 7) {
    val = '待出库'
  }
  if (num === 8) {
    val = '已出库'
  }
  if (num === 9) {
    val = '备货中'
  }
  if (num === 10) {
    val = '待发货'
  }
  if (num === 11) {
    val = '已发货'
  }
  if (num === 12) {
    val = '待施工'
  }
  if (num === 13) {
    val = '施工审核中'
  }
  if (num === 14) {
    val = '施工中'
  }
  if (num === 15) {
    val = '已施工'
  }
  if (num === 16) {
    val = '已结算'
  }
  if (num === 17) {
    val = '待入库'
  }
  if (num === 18) {
    val = '已入库'
  }
  if (num === 19) {
    val = '单据完结'
  }
  if (num === 20) {
    val = '待结算'
  }
  if (num === 30) {
    val = '草稿'
  }
  if (num === 31) {
    val = '作废'
  }
  if (num === 32) {
    val = '进行中'
  }
  if (num === 33) {
    val = '待报价'
  }
  return val
})
Vue.filter('orderClass', (val) => {
  const num = Number(val)
  if (num === 1 || num === 30) {
    val = ''
  } else if (num === 19 || num === 18 || num === 16 || num === 15 || num === 11 || num === 8 || num === 3) {
    val = 'success'
  } else if (num === 17 || num === 12 || num === 10 || num === 5 || num === 4 || num === 31) {
    val = 'danger'
  } else {
    val = 'warning'
  }
  return val
})

// 商品状态
Vue.filter('gStatus', (val) => {
  const num = Number(val)
  if (num === 1) {
    val = '在售'
  }
  if (num === 2) {
    val = '停售'
  }
  if (num === 3) {
    val = '禁用'
  }
  return val
})
Vue.filter('gStatusClass', (val) => {
  const num = Number(val)
  if (num === 1) {
    val = 'success'
  }
  if (num === 2) {
    val = 'danger'
  }
  return val
})
