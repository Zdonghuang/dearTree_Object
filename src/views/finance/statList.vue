Financialsettle
<template>
  <div>
      <br>
      <br>
    <!-- <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12">
        <ul class="timeWrapper" @click="setdate($event)">
          <li data-type="getYesterday">昨日</li>
          <li data-type="getToday" class="active">今日</li>
          <li data-type="getCurrWeekDays">本周</li>
          <li data-type="getLastWeekDays">上周</li>
          <li data-type="getCurrMonthDays">本月</li>
          <li data-type="getLastMonthDays">上月</li>
          <li data-type="getThreeMonthDays">近三月</li>
          <li data-type="getThisSeason">本季</li>
          <li data-type="getThisYearDays">本年</li>
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
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.sDate"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.eDate"
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
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>-->
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
      <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
      <el-table-column sortable align="center" property="rdatec" label="日期"></el-table-column>
      <el-table-column sortable align="center" property="bankname" label="账户"></el-table-column>
      <el-table-column sortable align="center" property="income" label="收款"></el-table-column>
      <el-table-column sortable align="center" property="outcome" label="付款"></el-table-column>
      <el-table-column sortable align="center" property="cuname" label="客户"></el-table-column>
      <el-table-column sortable align="center" property="rhandmanv" label="经手人"></el-table-column>
      <el-table-column sortable align="center" property="ritemnum" label="关联单据"></el-table-column>
      <el-table-column sortable align="center" property="subjectname" label="科目"></el-table-column>
      <el-table-column sortable align="center" property="unamec" label="记账人"></el-table-column>
      <el-table-column sortable align="center" property="rremark" label="备注"></el-table-column>
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
  </div>
</template>
<script>
export default {
  name: "statList",
  inject: ["reload"],
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
        sDate: "",
        eDate: ""
      },
      GSoptions: [],
      rHandmanOptions: [],
      bankAccountList: []
    };
  },
  created() {
    this.getList();
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
    getList() {
      let params = JSON.parse(JSON.stringify(this.form));
      delete params.cuseridv;
      delete params.oidv;
      if (!params.oid) delete params.oid;
      if (!params.cuserid) delete params.cuserid;
      if (!params.bankaccount) delete params.bankaccount;
      if (!params.status) delete params.status;
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      if (params.sDate) {
        params.sDate = params.sDate.replace(/\-/g, "");
      } else {
        delete params.sDate;
      }
      if (params.eDate) {
        params.eDate = params.eDate.replace(/\-/g, "");
      } else {
        delete params.eDate;
      }
      this.$api.Financialsettle.getlist(params).then(res => {
        let item = res.data.records;
        this.tableData = item;
        this.currentPage = res.data.current;
        this.total = res.data.total;
      });
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
          (!values.every(value => isNaN(value)) &&
            column.property == "income") ||
          column.property == "outcome"
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
