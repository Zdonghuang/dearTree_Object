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
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
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
          <el-option value="2" label="单据完结"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="small" @click="getPremoneyList">查询</el-button>
      </el-col>
      <el-col :sm="2" :xs="24" class="s_box">
        <el-checkbox
          v-model="form.includehongchong"
          label="显示红冲"
          border
          size="mini"
          true-label="1"
          false-label
          @change="getPremoneyList()"
        ></el-checkbox>
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
      <el-table-column sortable align="center" property="PD_CTIME" label="单据日期"></el-table-column>
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
      <el-table-column sortable align="center" property="PD_BANKNAMEGH" label="账户"></el-table-column>
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
  name: "payLists",
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
        cuseridv: "",
        cuserid: "",
        bankaccount: "",
        status: "",
        rdates: "",
        includehongchong: "",
        rdatee: ""
      },
      GSoptions: [],
      rHandmanOptions: [],
      bankAccountList: []
    };
  },
  created() {
    this.getPremoneyList();
    // 经手人
    this.$api.User.get({ size: 9999, auth: 1, status: 1 }).then(res => {
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
      this.$router.push("/collect");
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          !values.every(value => isNaN(value)) &&
          column.property == "PD_AMOUNTTOTAL"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
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
        path: "/collect",
        query: { data: window.btoa(v.PD_PID) }
      });
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
          `其他收入列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取列表
    getPremoneyList(val) {
      let params = JSON.parse(JSON.stringify(this.form));
      delete params.cuseridv;
      delete params.oidv;
      if (!params.oid) delete params.oid;
      if (!params.cuserid) delete params.cuserid;
      if (!params.bankaccount) delete params.bankaccount;
      if (!params.status) delete params.status;
      if (!params.includehongchong) delete params.includehongchong;
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
      params.div = 85;
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
    clearInput(val) {
      this.form[val] = "";
    },
    selectChange(m, val) {
      this.form[m] = val;
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
