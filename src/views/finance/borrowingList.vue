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
          <el-button size="small" type="warning" icon="el-icon-plus" @click="tofinanceAdd">新增</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button
            size="small"
            icon="el-icon-download"
            v-has="383"
            @click="getPremoneyList('xlsx')"
          >导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rdates"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rdatee"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select
          v-model="form.handman"
          filterable
          clearable
          placeholder="借款人"
          size="small"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">借款人</span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select
          v-model="form.cuserid"
          filterable
          clearable
          placeholder="记账人"
          size="small"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">记账人</span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select v-model="form.oid" placeholder="所属公司" size="small" class="selectSlot4" clearable>
          <template slot="prefix">
            <span class="prefixSlot">所属公司</span>
          </template>
          <el-option
            v-for="item in GSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select
          v-model="form.bankaccount"
          placeholder="银行账户"
          size="small"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">银行账户</span>
          </template>
          <el-option
            v-for="item in bankAccountList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select
          v-model="form.approvalstatus"
          size="small"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">审核状态</span>
          </template>
          <el-option label="未审批" value="0"></el-option>
          <el-option label="审批中" value="1"></el-option>
          <el-option label="审批通过" value="2"></el-option>
          <el-option label="审批拒绝" value="3"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-select
          v-model="form.status"
          clearable
          placeholder="单据状态"
          size="small"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">单据状态</span>
          </template>
          <el-option value="0" label="全部"></el-option>
          <el-option value="1" label="待记账"></el-option>
          <el-option value="2" label="借款完成"></el-option>
          <el-option value="3" label="核销完成"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="2" :xs="24">
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
      id="table-data"
      header-cell-class-name="thbgc"
    >
      <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.PD_STATUS!=2"
            @click="creatreceipt(scope.row)"
          >核销</el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.PD_STATUS!=2"
            @click="creatreceipt1(scope.row)"
          >收款</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_PID" label="单据编号" width="150"  show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="undeline" @click="todetail(scope.row)">{{scope.row.PD_PID}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_TITLE" label="单据标题" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_CTIME" label="单据日期" show-overflow-tooltip ></el-table-column>
      <el-table-column sortable align="center" property="PD_STATUSV" label="借款状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.PD_STATUS | orderType"
            size="mini"
            v-if="scope.row.PD_STATUS<2"
          >{{ scope.row.PD_STATUS | PD_STATUS }}</el-tag>
          <el-tag effect="dark" size="mini" type="success" v-if="scope.row.PD_STATUS>1">借款完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_STATUSV" label="核销状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag effect="dark" size="mini" type="success" v-if="scope.row.PD_STATUS==3">核销完成</el-tag>
          <el-tag effect="dark" size="mini" v-if="scope.row.PD_STATUS!=3">未核销</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_APPROVALSTATUSV" label="审核状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.PD_APPROVALSTATUS | orderType1"
            size="mini"
          >{{ scope.row.PD_APPROVALSTATUS | PD_APPROVALSTATUSV }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_DIVV" label="单据类型" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_AMOUNTTOTAL" label="借款金额" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="red tr">{{$PublicJS.money(scope.row.PD_AMOUNTTOTAL, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PD_PAYMENTDATE" label="支付日期" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_BANKNAME" label="银行名称" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_BANKACCOUNT" label="银行账户" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_PAYMENTMETHOD" label="付款方式" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_BANKNAMEGH" label="付款账户" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_HANDMANV" label="借款人" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_CUSERIDV" label="记账人" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="PD_OIDV" label="分公司" show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" property="P_RAMARK" label="备注" show-overflow-tooltip></el-table-column>
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
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient @emitClientData="getClientData"></selectClient>
    </el-dialog>
    <el-dialog
      title="预付款详细"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectFinance"
      width="60%"
    >
      <selectFinance :cuid="cuid" :div="2"></selectFinance>
    </el-dialog>
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import selectClient from "../../components/dialog/SelectClient";
import selectFinance from "../../components/dialog/SelectFinance";
export default {
  name: "borrowingList",
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
        oidv: "",
        oid: "",
        handman: "",
        cuseridv: "",
        cuserid: "",
        bankaccount: "",
        status: "",
        rdates: "",
        rdatee: ""
      },
      GSoptions: [],
      rHandmanOptions: [],
      bankAccountList: []
    };
  },
  created() {
    this.getPremoneyList();
    this.$api.User.get({ size: 9999, auth: 1, status:1 }).then(res => {
      if (res.code == 200) {
        this.rHandmanOptions = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uId,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
      }
    });
    let parms = {
      typeCode: "ZZJG",
      value1: 1
    };
    this.$api.Common.get(parms).then(res => {
      this.GSoptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    this.$api.Common.get({ typeCode: "YHZH", cStatus: 1 }).then(res => {
      this.bankAccountList = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    }); 
  },
  methods: {
    tofinanceAdd() {
      this.$router.push("/borrowingOrder");
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
    exportTable() {
      let box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      let out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `借款列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取列表
    getPremoneyList(val) {
      let params = JSON.parse(JSON.stringify(this.form));
      if (this.$route.query.status) {
        params.status = this.$route.query.status;
      }
      if (this.form.status) {
        params.status = this.form.status;
      }
      delete params.cuseridv;
      delete params.oidv;
      if (!params.oid) delete params.oid;
      if (!params.cuserid) delete params.cuserid;
      if (!params.bankaccount) delete params.bankaccount;
      if (!params.status) delete params.status;
      if (!params.handman) delete params.handman;
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      if (params.rdates) {
        params.rdates = params.rdates.replace(/\-/g, "");
      } else {
        delete params.rdates;
      }
      if (params.rdatee) {
        params.rdatee = params.rdatee.replace(/\-/g, "");
      } else {
        delete params.rdatee;
      }
      params.div = 82;
      if (val == "xlsx") {
        params.size = this.total;
        params.currentPage = 1;
      }
      this.$api.Premoney.getPremoneyAndDtsItemList(params).then(res => {
        if (res.records) {
          let item = res.records;
          this.tableData = item;
          this.currentPage = res.current;
          this.total = res.total;
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    todetail(v) {
      this.$router.push({
        path: "/borrowingOrder",
        query: { data: window.btoa(v.PD_PID) }
      });
    },
    creatreceipt(v) {
      this.$router.push({
        path: "/writeOff",
        query: { data: window.btoa(v.PD_PID) }
      });
    },
    creatreceipt1(v) {
      this.$router.push({
        path: "/collect",
        query: { datas: window.btoa(v.PD_PID) }
      });
    },
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.rdates = getDate[fn]().starttime;
        this.form.rdatee = getDate[fn]().endtime;
        let params = {
          rdates: this.form.rdates.replace(new RegExp("-", "g"), ""),
          rdatee: this.form.rdatee.replace(new RegExp("-", "g"), "")
        };
        this.getPremoneyList();
      }
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getPremoneyList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getPremoneyList();
    },
    showDialog(n, m) {
      if (m.pCuid) {
        this.cuid = m.pCuid;
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
