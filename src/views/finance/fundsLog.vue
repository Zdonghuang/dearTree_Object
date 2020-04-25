<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12">
        <ul class="timeWrapper" @click="setdate($event)">
          <li data-type="getYesterday">昨日</li>
          <li data-type="getToday">今日</li>
          <li data-type="getCurrWeekDays">本周</li>
          <li data-type="getLastWeekDays">上周</li>
          <li data-type="getCurrMonthDays">本月</li>
          <li data-type="getLastMonthDays">上月</li>
          <li data-type="getThreeMonthDays">近三月</li>
          <li data-type="getThisSeason">本季</li>
          <li data-type="getThisYearDays" class="active">本年</li>
        </ul>
      </el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-plus"
            @click="dialogFormVisible=true"
          >新增</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="3" :xs="24">
        <el-date-picker v-model="form.rStime" type="date" size="small" placeholder="单据起始日期" value-format="yyyyMMdd"></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-date-picker v-model="form.rEtime" type="date" size="small" placeholder="单据结束日期" value-format="yyyyMMdd"></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input v-model="form.fsSubjectname" size="small" readonly>
          <template slot="prepend">账户</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectBankAccount')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="银行/帐号/备注" size="small" v-model="form.key">
          <template slot="prepend">关键字</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button size="small" type="primary" icon="el-icon-search" @click="formSearch">查询</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="formReset">重置</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      height="600px"
      header-cell-class-name="thbgc"
    >
       <el-table-column width="55" align="center"  type="index" label="序号"></el-table-column>
      <!-- <el-table-column width="100" align="center"  label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.rStatus==19 "
            @click="toOrderPage(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>-->
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="R_ITEMNUM"
        label="单据编号"
      ></el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="R_NAME"
        label="单据名称"
      ></el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="contruct_amount"
        label="施工金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.contruct_amount, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="exchange_amount"
        label="换货金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.exchange_amount, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="in_amount"
        label="销售金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.in_amount, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="out_amount"
        label="采购金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.out_amount, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="refund_amount"
        label="退货金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.refund_amount, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        minWidth="180"
        align="center"
        show-overflow-tooltip
        property="total_amount"
        label="总金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.total_amount, 2) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paginationBox">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100,total]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-dialog title="新增资金流水" :close-on-click-modal="false"  v-dialogDrag :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="资金帐户">
          <el-input placeholder="请选择资金账户" size="small">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="流向类型">
          <el-radio v-model="form.radio" label="1">借</el-radio>
          <el-radio v-model="form.radio" label="2">贷</el-radio>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="form.name3" autocomplete="off" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="流水号">
          <el-input v-model="form.name3" autocomplete="off" placeholder="请输入银行或商户流水号"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.name4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="附件">图片/文档</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="收款账户" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectBankAccount" width="60%">
      <selectBankAccount @emitBankAccountData="getBankAccountData" code="YHZH"></selectBankAccount>
    </el-dialog>
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
import selectBankAccount from "../../components/dialog/SelectBankAccount";
export default {
  inject: ["reload"],
  components: {
    selectBankAccount
  },
  data() {
    return {
      showSelectBankAccount: false,
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      idList:[],
      form: {
        rRemark: "",
        rType: 13 //销售报价单
      }
    };
  },
  created() {
    this.form.rStime = getDate.getToday().starttime;
    this.form.rEtime = getDate.getToday().endtime;
    if (this.$route.query.status) {
      this.form.rStime = '';
      this.form.rEtime = '';
    }
    this.getList();
  },
  methods: {
    // 操作
    operating(val, id) {
      let msg = "重置";
      let apiOps = "reset";

      if (val === "invalid") {
        msg = "作废";
        apiOps = "cancel";
      }

      this.$confirm("此操作将会修改单据为" + msg + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.Sale[apiOps]({ receiptId: id }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: msg + "成功!"
              });
              this.Refresh();
            } else {
              this.$message({
                type: "error",
                message: res.err
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.rStime = getDate[fn]().starttime;
        this.form.rEtime = getDate[fn]().endtime;
        let params = {
          rStime: this.form.rStime.replace(new RegExp("-", "g"), ""),
          rEtime: this.form.rEtime.replace(new RegExp("-", "g"), "")
        };
        this.getList(params);
      }
    },
    formReset() {
      this.form = {};
    },
    // 查询
    formSearch() {
      let params = {};

      if (this.form.rStime) {
        params.rStime = this.form.rStime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rEtime) {
        params.rEtime = this.form.rEtime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rRemark) {
        params.rRemark = this.form.rRemark;
      }
      this.getList(params);
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] ="合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    // 获取列表
    getList(val) {
      let params = {};
      if (val) {
        params = val;
      }
      if (this.form.rItemnum) {
        params.rItemnum = this.form.rItemnum;
      }
      if (this.form.rCuid) {
        params.rCuid = this.form.rCuid;
      }
      if (this.form.rHandman) {
        params.rHandman = this.form.rHandman;
      }
      if (this.form.rWhid) {
        params.rWhid = this.form.rWhid;
      }
      if (this.form.rOid) {
        params.rOid = this.form.rOid;
      }
      if (this.form.rStime) {
        params.rStime = this.form.rStime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rEtime) {
        params.rEtime = this.form.rEtime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rRemark) {
        params.rRemark = this.form.rRemark;
      }
      params["rType"] = this.form.rType;
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      this.$api.Financialsettle.receiptExpenses(params).then(res => {
        if (res.data) {
          let item = res.data.records;
          this.tableData = item;
          this.currentPage = res.data.current;
          this.total = res.data.total;
        }
      });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    // 银行账户
    getBankAccountData(val) {
      if (val) {
        this.form.fsSubjectname = val.cAttrvalue;
        this.form.fsSubjectnum = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    // 刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
