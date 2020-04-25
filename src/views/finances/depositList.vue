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
      <el-col :sm="4" :xs="24">
        <el-input placeholder="客户" v-model="form.client" size="small" readonly>
          <template slot="prepend">客户</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectClient','')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="small" @click="getPremoneyList">查询</el-button>
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
      <el-table-column sortable align="center"  property="PD_CTIME" label="单据日期" ></el-table-column>
      <el-table-column sortable align="center" property="PD_PID" label="单据编号">
        <template slot-scope="scope">
          <span class="undeline" @click="todetail(scope.row)">{{scope.row.PD_PID}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_CUIDV" label="往来单位"></el-table-column>
      <el-table-column sortable align="center" property="PD_STATUSV" label="单据状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.PD_STATUS | orderType"
            size="mini"
          >{{ scope.row.PD_STATUS | PD_STATUS }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_DIVV" label="单据类型"></el-table-column>
      <el-table-column sortable align="center" property="PD_AMOUNTTOTAL" label="金额"></el-table-column>
      <el-table-column sortable align="center" property="PD_HANDMANV" label="经手人"></el-table-column>
      <el-table-column sortable align="center" property="PD_CUSERIDV" label="记账人"></el-table-column>
      <el-table-column sortable align="center" property="PD_OIDV" label="公司"></el-table-column>
      <el-table-column sortable align="center" property="P_RAMARK" label="备注"></el-table-column>
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
    <el-dialog :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectClient" width="60%">
      <selectClient @emitClientData="getClientData"></selectClient>
    </el-dialog>
    <el-dialog title="预付款详细" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectFinance" width="60%">
      <selectFinance :cuid="cuid" :div="2"></selectFinance>
    </el-dialog>
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import selectClient from "../../components/dialog/SelectClient";
import selectFinance from "../../components/dialog/SelectFinance";
export default {
  name: 'depositList',
  inject: ["reload"],
  components: {
    selectClient,
    selectFinance
  },
  data() {
    return {
      showSelectClient: false,
      showSelectFinance: false,
      SelectFinancedts: {},
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      cuid: 0,
      form: {
        cuid: "",
        client: "",
        rStime: "",
        rEtime: ""
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
    this.getPremoneyList();
  },
  methods: {
    tofinanceAdd() {
      this.$router.push("/deposit");
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
        if (
          !values.every(value => isNaN(value)) &&
          column.property == "PD_AMOUNTTOTAL"
        ) {
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
    todetail(v) {
      this.$router.push({
        path: "/deposit",
        query: { data: window.btoa(v.PD_PID) }
      });
    },
    // 获取列表
    getPremoneyList(val) {
      let params = {};
      if (this.form.cuid) {
        params.cuid = this.form.cuid;
      }
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      params["rStime"] = this.form.rStime;
      params["rEtime"] = this.form.rEtime;
      params.div = 84;
      this.$api.Premoney.getPremoneyAndDtsItemList(params).then(res => {
        if (res.records) {
          let item = res.records;
          item.map(item => {
            let da = item.PD_CTIME.split(" ");
            let da1 = da[0].split('-')
            item.PD_CTIME = `${da1[0]}-${da1[2]}-${da1[1]}  ${da[1]}`;
          });
          this.tableData = item;
          this.currentPage = res.current;
          this.total = res.total;
        }
      });
    },
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
        this.getPremoneyList();
      }
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getSaleList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getSaleList();
    },
    showDialog(n, m) {
      if (m.pCuid) {
        this.cuid = m.PD_PID;
      } else {
        this.cuid = "";
      }
      this[n] = true;
    },
    // 回显客户
    getClientData(val) {
      this.form.client = val.cuName;
      this.form.cuid = val.id;
      this.showSelectClient = false;
    },
    //刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.undeline {
  text-decoration: underline;
  color: rgb(56, 141, 221);
  cursor: pointer;
}
</style>
