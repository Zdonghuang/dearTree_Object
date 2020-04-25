import request from '@/utils/request'
// 接口定义
const apis = {
  // 字典
  Common: {
    // 获取字典列表 参数
    get(params) {
      return request.get('/dic/get', {
        params
      })
    },
    getApproval() {
      return request.get('/dic/queryProcList', )
    },
    getApprovalList(params) {
      return request.get('/dic/queryProcPage', {
        params
      })
    },
    saveApproval(data) {
      return request.post('/dic/saveProcList', data)
    },
    // 添加修改银行账户
    saveBank(params) {
      return request.post('/dic/saveandupdate', params)
    },
    // 根据组织机构id和单据类型值获取钉钉审批数据
    getApprovalInfo(params) {
      return request.post('/dic/sInfo', params)
    },
    getApprovals(params) {
      return request.post('/dic/queryApprovalPersion', params)
    },
    // 获取默认审批人和抄送人
    getPerson(params) {
      return request.post('/dic/getApprovalPersion', params)
    },
    // 获取字典列表
    getDIC(params) {
      return request.get('/dic/getDicForTreeMenu', {
        params
      })
    },
    // 获取上下级菜单数据
    getMenu(params) {
      return request.get('/dic/getMenu', {
        params
      })
    },
    // 获取所有字典列表
    getAll() {
      return request.get('/dic/queryAll')
    },
    // 删除字典
    remove(params) {
      return request.post('/dic/remove', params)
    },
    // 增加字典
    save(params) {
      return request.post('/dic/save', params)
    },
    // 测试同时执行多条语句
    testmultidelete(params) {
      return request.post('/dic/testmultidelete', params)
    },
    // 更新字典
    update(params) {
      return request.post('/dic/update', params)
    }
  },
  // 单据
  Receipt: {
    // 判断采购入库单是否可做作废和重置
    checkCGRKD(params) {
      return request.post(`/receipt/checkCGRKDWhetherCancelReset?${params}`, {})
    },
    getToBeDone(params) {
      return request.get('/receipt/getReceiptTodo', {
        params
      })
    },
    // 获取单据退换货数量
    getReturnNum(params) {
      return request.get(`/receipt/getCGTHHQuantity?${params}`, {})
    },
    // 判断回收施工单是否可做作废和重置
    checkHSSGD(params) {
      return request.post(`/receipt/checkHSSGDWhetherCancel?${params}`, {})
    },
    // 拷贝单据：rtype-新单据类型，rid-源单据id,rstatus-新单据状态
    copyReceipt(params) {
      return request.post('/receipt/copyReceipt', params)
    },
    // 更新是否分摊施工费用:0-未分摊，1-已分摊，并更新单据类型：0-更新单据为62回收部分入库单，1-更新单据为5回收入库单
    updateType(params) {
      return request.post('/receipt/updateIsShareConstructCostAndReceipttype', params)
    },
    // 更新单据状态
    Status(params) {
      return request.post('/receipt/updateReceiptStatus', params)
    },
    // 根据单据编号获取所有父子单据编号
    getAll(params) {
      return request.post('/receipt/getReceiptParentChildItemnumStringByItemnum', params)
    },
    // 查询单据列表
    get(params) {
      return request.get('/receipt/page', {
        params
      })
    },
    // 单据复制
    copy(params) {
      return request.post('/receipt/receiptduplicate', params)
    },
    // 单据重置作废
    reset(params) {
      return request.post('/receipt/receiptCancelReset', params)
    },
    // 删除单据主表
    remove(params) {
      return request.get('/receipt/remove', {
        params
      })
    },
    // 全部入库
    rkAll(params) {
      return request.post('/receipt/ininventory', params)
    },
    allRK(params) {
      return request.post('/receipt/ininventorycghs', params)
    },
    // 全部出库
    ckAll(params) {
      return request.post('/receipt/outinventory', params)
    },
    // 根据单据编号更新所有单据结算状态
    updateParentBillingStatusByItemnum(params) {
      return request.post('/receipt/updateParentBillingStatusByItemnum', params)
    },
    // 保存单据主表
    save(params) {
      return request.post('/receipt/save', params)
    },
    // 保存单据所有数据
    saveall(params) {
      return request.post('/receipt/saveall', params)
    },
    // 更新单据主表
    update(params) {
      return request.post('/receipt/update', params)
    },
    // 获取单据施工环境
    gettconstruct(params) {
      return request.post('/receiptconstruct/get', params)
    },
    // 施工环境保存
    saveorupdate(params) {
      return request.post('/receiptconstruct/saveorupdate', params)
    },
    // 直接出库
    zjck(params) {
      return request.post('/receipt/zjck', params)
    },
    // 直接入库
    zjrk(params) {
      return request.post('/receipt/zjrk', params)
    }
  },
  ReportCapital: {
    // 资金余额汇总
    capitalBalanceDetails(params) {
      return request.get('/reportCapital/capitalBalanceDetails', {
        params
      })
    },
    // 资金对帐明细
    capitalCheckDetails(params) {
      return request.get('/reportCapital/capitalCheckDetails', {
        params
      })
    },
    // 资金流水明细
    capitalFlowDetails(params) {
      return request.get('/reportCapital/capitalFlowDetails', {
        params
      })
    },
    // 销售核算明细
    salesCheckDetails(params) {
      return request.get('/reportSales/salesCheckDetails', {
        params
      })
    },
    // 销售日报
    salesDailyDetails(params) {
      return request.get('/reportSales/salesDailyDetails', {
        params
      })
    },
    // 销售商品明细
    salesGoodsDetails(params) {
      return request.get('/reportSales/salesGoodsDetails', {
        params
      })
    },
    // 销售订单明细
    salesOrderDetails(params) {
      return request.get('/reportSales/salesOrderDetails', {
        params
      })
    }
  },
  ReportCustomer: {
    // 客户往来明细
    get(params) {
      return request.get('/reportCustomer/CustomerBusiness', {
        params
      })
    },
    // 客户往来汇总
    getall(params) {
      return request.get('/reportCustomer/CustomerBusinessSum', {
        params
      })
    }
  },
  ReportInventory: {
    // 进销存明细
    get(params) {
      return request.get('/reportInventory/inventoryDetails', {
        params
      })
    }
  },
  // 单据文件
  Receiptfile: {
    // 查询单据文件
    get(params) {
      return request.get('/receiptfile/list', {
        params
      })
    },
    // 删除单据文件
    remove(params) {
      return request.get('/receiptfile/remove', {
        params
      })
    },
    // 保存单据文件
    save(params) {
      return request.post('/receiptfile/save', params)
    },
    // 更新单据详细
    update(params) {
      return request.post('/receiptfile/update', params)
    }
  },

  // 单据明细
  Receiptdts: {
    // 查询单据详细
    get(params) {
      return request.get('/receiptdts/list', {
        params
      })
    },
    getReceiptGoodsDetail(params) {
      return request.post('/receiptdts/getReceiptDetail', params)
    },
    getCmoney(params) {
      return request.get('/receiptdts/getConstructCostByHSRKDRID', {
        params
      })
    },
    // 删除单据详细
    remove(params) {
      return request.get('/receiptdts/remove', {
        params
      })
    },
    // 保存单据详细
    save(params) {
      return request.post('/receiptdts/save', params)
    },
    // 更新单据详细
    update(params) {
      return request.post('/receiptdts/update', params)
    },
    // 获取单据明细及商品详细
    getReceiptDtsGoods(params) {
      return request.post('/receiptdtsgoods/getReceiptDtsGoods', params)
    }
  },

  // 单据费用
  Receiptexpense: {
    // 查询单据费用
    get(params) {
      return request.get('/receiptexpense/page', {
        params
      })
    },
    // 删除商品列表
    remove(params) {
      return request.get('/receiptexpense/remove', {
        params
      })
    },
    // 保存商品列表
    save(params) {
      return request.post('/receiptexpense/save', params)
    },
    // 更新商品列表
    update(params) {
      return request.post('/receiptexpense/update', params)
    },
    // 更新施工费用状态并保存财务流水
    updateStatusAndInsertFinancial(params) {
      return request.post('/receiptexpense/updateStatusAndInsertFinancial', params)
    }
  },

  // 商品
  Goods: {
    // 商品库存
    getGoodsStock(params) {
      return request.get('/manageGoods/goodsStock', {
        params
      })
    },
    // 获取商品编码
    code(params) {
      return request.post('/goods/getGoodsCode', params)
    },
    // 查询商品列表
    get(params) {
      return request.get('/goods/page', {
        params
      })
    },
    query(params) {
      return request.get('/goods/query', {
        params
      })
    },
    // 基础-查询商品列表
    queryForAdmin(params) {
      return request.get('/goods/queryForAdmin', {
        params
      })
    },
    // 保存商品列表
    save(params) {
      return request.post('/goods/save', params)
    },
    // 保存商品以及明细
    savedts(params) {
      return request.post('/goods/saveGoodsandGoodsdts', params)
    },
    // 修改商品列表
    update(params) {
      return request.post('/goods/update', params)
    }
  },

  // 商品详细
  Goodsdts: {
    // 商品详细列表
    get(params) {
      return request.get('/goodsdts/list', {
        params
      })
    },
    // 删除详细列表
    remove(params) {
      return request.get('/goodsdts/remove', {
        params
      })
    },
    // 保存商品详细
    save(params) {
      return request.post('/goodsdts/save', params)
    },
    // 修改商品详细
    update(params) {
      return request.post('/goodsdts/update', params)
    }
  },

  // 客户
  Customer: {
    // 客户列表
    get(params) {
      return request.get('/customer/page', {
        params
      })
    },
    query(params) {
      return request.get('/customer/query', {
        params
      })
    },
    // 基础-查询客户列表
    queryForAdmin(params) {
      return request.get('/customer/queryForAdmin', {
        params
      })
    },
    setall(params) {
      return request.post(`/customer/allocation?${params}`, {})
    },
    // 删除客户
    remove(params) {
      return request.get('/customer/remove', {
        params
      })
    },
    // 保存客户
    save(params) {
      return request.post('/customer/save', params)
    },
    // 保存客户以及明细
    saveCustomerAndContact(params) {
      return request.post('/customer/saveCustomerAndContact', params)
    },
    // 更新客户
    update(params) {
      return request.post('/customer/update', params)
    },
    // 导出客户
    export (params) {
      return request.get('/customer/export', {
        params
      }, {
        responseType: 'blob'
      })
    },
  },

  // 财务结算
  Financialsettle: {
    getcode(params) {
      return request.get('/dic/getYHZHCode', {
        params
      })
    },
    getToBeDone(params) {
      return request.get('/premoney/getPremoneyTodo', {
        params
      })
    },
    getlist(params) {
      return request.post('/stat/cwls', params)
    },
    getDetailLog(params) {
      return request.post('/stat/unitpriceupdatelog', params)
    },
    // 获取费用列表
    get(params) {
      return request.post('/financialsettle/list', params)
    },
    // 保存费用
    save(params) {
      return request.post('/financialsettle/save', params)
    },
    // 更新费用
    update(params) {
      return request.post('/financialsettle/update', params)
    },
    // 单据费用列表
    receiptExpenses(params) {
      return request.post('/financialsettle/receiptExpenses', params)
    }
  },

  // 库存
  Stock: {
    // 查询库存
    get(params) {
      return request.get('/inventory/page', {
        params
      })
    },
    // 增加库存
    save(params) {
      return request.get('/inventory/save', {
        params
      })
    },
    // 更新库存
    update(params) {
      return request.get('/inventory/update', {
        params
      })
    },
    // 对商品库存进行操作
    updateInventory(params) {
      return request.post('/inventory/updateInventory', params)
    },

    // 获取库存数据
    getInventory(params) {
      return request.get('/inventory/getInventory', {
        params
      })
    },
    getInventoryNew(params) {
      return request.get('/inventory/getInventoryNew', {
        params
      })
    },

  },

  // 换货
  Exchange: {
    // 确认收货
    get(params) {
      return request.post('/exchange/confirm', params)
    },
    // 保存换货单
    save(params) {
      return request.post('/exchange/save', params)
    },
    // 换货结算
    settle(params) {
      return request.post('/exchange/settle', params)
    },
    // 出库
    outbound(params) {
      return request.post('/exchange/outbound', params)
    },
    // 入库
    warehousing(params) {
      return request.post('/exchange/warehousing', params)
    }
  },

  // 施工
  Construction: {
    // 提交施工单审核
    save(params) {
      return request.post('/construction/save', params)
    },
    // 提交施工结算单审核
    settle(params) {
      return request.post('/construction/settle', params)
    }
  },

  // 权限
  Permission: {
    // 保存权限
    save(params) {
      return request.post('/permission/save', params)
    }
  },

  // 用户
  User: {
    // 用户列表
    get(params) {
      return request.post('/user/page', params)
    },
    // 删除用户
    remove(params) {
      return request.get('/user/remove', {
        params
      })
    },
    // 保存用户
    save(params) {
      return request.post('/user/save', params)
    },
    // 修改用户
    update(params) {
      return request.post('/user/update', params)
    }
  },

  // 系统设置
  System: {
    // 获取部门详情
    get(params) {
      return request.get('/system/deptlist', {
        params
      })
    },
    // 获取部门用户
    getMembers(params) {
      return request.get('/system/getMembers', {
        params
      })
    },
    // 获取回调信息
    getCallback(params) {
      return request.get('/system/getCallback', {
        params
      })
    },
    // 注册回调地址
    registery(params) {
      return request.get('/system/registery', {
        params
      })
    },
    // 更新回调地址
    update(params) {
      return request.post('/system/updateUrl', params)
    }
  },

  // 统计
  Stat: {
    // 单据统计查询
    get(params) {
      return request.post('/stat/receipt', params)
    },
    kcls(params) {
      return request.post('/stat/kcls', params)
    },
    loginlog(params) {
      return request.post('/stat/loginlog', params)
    },
    // 统计-资金流水明细
    statzjlsmx(params) {
      return request.post('/stat/statzjlsmx', params)
    },
    statzjlsmxNew(params) {
      return request.post('/stat/statzjlsmxNew', params)
    },
    // 统计-资金对账明细
    statzjdzmx(params) {
      return request.post('/stat/statzjdzmx', params)
    },
    statzjdzmxNew(params) {
      return request.post('/stat/statzjdzmxNew', params)
    },
    // 统计-资金余额报表
    statzjyebb(params) {
      return request.post('/stat/statzjyebb', params)
    },
    statzjyebbNew(params) {
      return request.post('/stat/statzjyebbNew', params)
    },
    // 统计-销售明细
    statxshsmx(params) {
      return request.post('/stat/statxshsmx', params)
    },
    statxshsmxNew(params) {
      return request.post('/stat/statxshsmxNew', params)
    },
    // 统计-销售业务明细
    statxsywmx(params) {
      return request.post('/stat/statxsywmx', params)
    },
    statxsywmxNew(params) {
      return request.post('/stat/statxsywmxNew', params)
    },
    // 统计-费用明细报表
    statfymxbb(params) {
      return request.post('/stat/statfymxbb', params)
    },
    statfymxbbNew(params) {
      return request.post('/stat/statfymxbbNew', params)
    },
    // 统计-采购回收核算明细
    statcghshsmx(params) {
      return request.post('/stat/statcghshsmx', params)
    },
    statcghshsmxNew(params) {
      return request.post('/stat/statcghshsmxNew', params)
    },
    // 统计-销售类结算单明细
    statxsljsdmx(params) {
      return request.post('/stat/statxsljsdmx', params)
    },
    statxsljsdmxNew(params) {
      return request.post('/stat/statxsljsdmxNew', params)
    },
    // 统计-进销存汇总表
    statjxchzb(params) {
      return request.post('/stat/statjxchzb', params)
    },
    statjxchzbNew(params) {
      return request.post('/stat/statjxchzbNew', params)
    },
    // 统计-进销存明细
    statjxcmx(params) {
      return request.post('/stat/statjxcmx', params)
    },
    statjxcmxNew(params) {
      return request.post('/stat/statjxcmxNew', params)
    },
    // 统计-转预收预付明细
    statzysyfmx(params) {
      return request.post('/stat/statzysyfmx', params)
    },
    // 统计-待出待入明细
    statdcdrmx(params) {
      return request.post('/stat/statdcdrmx', params)
    },

  },
  // 联系人
  Contact: {
    // 查询联系人列表
    get(params) {
      return request.get('/contact/page', {
        params
      })
    },
    // 删除联系人
    remove(params) {
      return request.get('/contact/remove', {
        params
      })
    },
    // 保存联系人
    save(params) {
      return request.post('/contact/save', params)
    },
    // 修改联系人
    update(params) {
      return request.post('/contact/update', params)
    }
  },

  // 仓库
  Warehouse: {
    // 仓库编码
    code(params) {
      return request.post('/warehouse/getWarehouseCode', params)
    },
    // 查询仓库
    get(params) {
      return request.get('/warehouse/get', {
        params
      })
    },
    // 添加仓库
    save(params) {
      return request.post('/warehouse/save', params)
    },
    // 修改仓库
    update(params) {
      return request.post('/warehouse/update', params)
    }
  },
  // 退货
  Refund: {
    // 保存退货单
    save(params) {
      return request.post('/refund/save', params)
    },
    // 退货结算
    settle(params) {
      return request.post('/refund/settle', params)
    },
    // 入库
    warehousing(params) {
      return request.post('/refund/warehousing', params)
    }
  },
  // 销售
  Sale: {
    // 保存草稿
    draft(params) {
      return request.post('/sale/draft', params)
    },
    // 施工完成
    constructionFinished(params) {
      return request.post('/sale/constructionFinished', params)
    },
    // 配货完成
    distribution(params) {
      return request.post('/sale/distribution', params)
    },
    // 作废
    cancel(params) {
      return request.post('/sale/cancel', params)
    },
    // 重置
    reset(params) {
      return request.post('/sale/reset', params)
    },
    // 出库
    outbound(params) {
      return request.post('/sale/outbound', params)
    },
    // 保存报价单
    save(params) {
      return request.post('/sale/save', params)
    },
    // 商品结算
    settle(params) {
      return request.post('/sale/settle', params)
    },
    // 变更报价单结算状态
    updateBillStatus(params) {
      return request.post('/sale/updateBillStatus', params)
    },
    // 变更报价单状态
    updateStatus(params) {
      return request.post('/sale/updateStatus', params)
    },

    // 生成出库单
    createCKD(params) {
      return request.post('/sale/createCKD', params)
    },
    // 生成备货单
    createPHD(params) {
      return request.post('/sale/createPHD', params)
    },
    // 查询已出库商品数量
    queryOutboundQuantity(params) {
      return request.get('/sale/queryOutboundQuantity', {
        params
      })
    },
    // 查询最后一个销售出库单ID
    queryLastCkdId(params) {
      return request.get('/sale/queryLastCkdId', {
        params
      })
    },
    // 单据商品数量
    queryDtsNum(params) {
      return request.get('/sale/queryDtsNum', {
        params
      })
    }
  },

  // 预收预付款
  Premoney: {
    // 获取客户预存
    get(params) {
      return request.post('/premoney/list', params)
    },
    // 核销记账
    hexiao(params) {
      return request.post('/premoney/hxdFinancialAccounting', params)
    },
    // 保存及更新预存
    saveandupdate(params) {
      return request.post('/premoney/saveandupdate', params)
    },
    // 保存预收款及明细
    save(params) {
      return request.post('/premoney/savePremoneyAndPremoneydts', params)
    },
    // 使用预收预付款并根据传入的RID更新单据状态为结算完成
    usePremoney(params) {
      return request.post('/premoney/usePremoney', params)
    },
    // 财务单据记账：预付款单/借款单/报销单
    financialAccounting(params) {
      return request.post('/premoney/financialAccounting', params)
    },
    // 获取单据及单据明细
    getPremoneyAndDtsItemList(params) {
      return request.post('/premoney/getPremoneyAndDtsItemList', params)
    },
    // 保存款项主表及明细:主表pCuid/div/remark/handman，子表pdAmount/pdSubjectnum/pdSubjectname
    savePremoneyAndPremoneydts(params) {
      return request.post('/premoney/savePremoneyAndPremoneydts', params)
    }
  },

  // 预收预付明细
  Premoneydts: {
    // 获取预收预付款明细
    get(params) {
      return request.post('/premoneydts/list', params)
    },
    // 保存预收预付款明细
    save(params) {
      return request.post('/premoneydts/save', params)
    },
    // 更新
    update(params) {
      return request.post('/premoneydts/update', params)
    }
  },

  // 权限
  // eslint-disable-next-line no-dupe-keys
  Permission: {
    // 全部权限列表
    list(params) {
      return request.get('/permission/list', {
        params
      })
    },
    // 保存权限
    saveper(params) {
      return request.post('/permission/list', params)
    },
    // 查询单个角色
    get(params) {
      return request.get('/role/get', {
        params
      })
    },
    // 角色列表
    page(params) {
      return request.get('/role/page', {
        params
      })
    },
    // 保存角色
    save(params) {
      return request.post('/role/save', params)
    }
  },
  // 租赁
  Rent: {
    // 生成备货单
    createBhd(params) {
      return request.post('/rent/createBhd', params)
    },
    // 生成出库单
    createCKD(params) {
      return request.post('/rent/createCKD', params)
    },
    // 配货完成
    distribution(params) {
      return request.post('/rent/distribution', params)
    },
    // 出库
    outbound(params) {
      return request.post('/rent/outbound', params)
    },
    // 入库
    inbound(params) {
      return request.post('/rent/inbound', params)
    },
    // 续租
    renewal(params) {
      return request.post('/rent/renewal', params)
    },
    // 退租
    withdrawal(params) {
      return request.post('/rent/withdrawal', params)
    },
    // 保存
    save(params) {
      return request.post('/rent/save', params)
    },
    // 结算
    settle(params) {
      return request.post('/rent/settle', params)
    }
  },
  // 第二树
  Login: {
    // 登陆
    login(params) {
      return request.post('/login', params)
    },
    // 退出
    logout(params) {
      return request.get('/logout', {
        params
      })
    }
  }
}
export default apis
