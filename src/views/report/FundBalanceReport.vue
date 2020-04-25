<template>
  <div>
    <el-row :gutter="20" class="titleBox">
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
          <el-button size="small" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
          <!-- <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.sDate"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
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
          v-model="form.rAccountidvc"
          filterable
          clearable
          placeholder="请选择账户"
          size="small"
          @change="selectChange('rAccountid',form.rAccountidvc)"
          @clear="clearInput('rAccountid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">账户</span>
          </template>
          <el-option
            v-for="(item,index) in rAccountidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:300px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList('s')">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              id="table-data"
              :show-summary="true"
              :summary-method="getSummaries"
              sum-text="合计:"
              height="600px"
              header-cell-class-name="thbgc"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="bankaccount"
                label="账户编号"
              ></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="bankname"
                label="账户名称"
              ></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="beginning"
                label="期初金额"
              >
                <template slot-scope="scope">
                  <div class="tr">
                    <span v-if="scope.row.beginning<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.beginning), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column  align="center" label="发生额">
                <el-table-column sortable align="center" show-overflow-tooltip property="income" label="收入">
                  <template slot-scope="scope">
                    <div class="tr">
                      <span v-if="scope.row.income<0">-</span>
                      {{ $PublicJS.money(Math.abs(scope.row.income), 2) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="outcome" label="支出">
                  <template slot-scope="scope">
                    <div class="tr">
                      <span v-if="scope.row.outcome<0">-</span>
                      {{ $PublicJS.money(Math.abs(scope.row.outcome), 2) }}
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="ending" label="期末余额">
                <template slot-scope="scope">
                  <div class="tr">
                    <span v-if="scope.row.ending<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.ending), 2) }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, total]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <br />
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import moment from "moment";
export default {
  name: "FundBalanceReport",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rAccountidOptions: [],
      form: {
        rAccountid: "",
        rAccountidvc: "",
        sDate: "",
        eDate: ""
      },
      loading: false,
      sumincome: 0,
      sumoutcome: 0,
      sumbeginning: 0,
      sumending: 0,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.sDate = getDate.getToday().starttime;
    this.form.eDate = getDate.getToday().endtime;
    // 账户
    this.$api.Common.get({ typeCode: "YHZH",CStatus:1 }).then(res => {
      this.rAccountidOptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    // this.getList();
  },
  methods: {
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = this.form;
      if (!this.form.rAccountid) delete params.rAccountid;
      if (!this.form.rAccountidvc) delete params.rAccountidvc;
      params.size = this.pageSize;
      params.currentPage = this.currentPage;
       if(val=='s'){
        params.currentPage = 1;
      }
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      params.sDate = moment(this.form.sDate).format("YYYY-MM-DD");
      params.eDate = moment(this.form.eDate).format("YYYY-MM-DD");
      this.$api.Stat.statzjyebbNew(params).then(res => {
        loading.close();
        if (res.code == 200) {
          res.data.records.map(item => {
            if (item.rdate) {
              item.rdate = moment(item.rdate).format("YYYY-MM-DD");
            }
            if (item.rdatec) {
              item.rdatec =
                item.rdatec.split(" ")[0] +
                " " +
                item.rdatec.split(" ")[1].replace(/\-/g, ":");
            }
          });
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.currentPage = res.data.current;
          if (res.data.records.length) {
            this.sumoutcome = res.data.records[0].sumoutcome;
            this.sumincome = res.data.records[0].sumincome;
            this.sumbeginning = res.data.records[0].sumbeginning;
            this.sumending = res.data.records[0].sumending;
          }
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        } else {
          this.$message({ message: res.err, type: "error" });
        }
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
          `资金余额报表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.sDate = getDate[fn]().starttime;
        this.form.eDate = getDate[fn]().endtime;
        this.getList('s');
      }
    },
    clearInput(val) {
      this.form[val] = "";
    },
    selectChange(m, val) {
      if (val) {
        let obj = {};
        obj = this[m + "Options"].find(item => {
          return item.value === val; //筛选出匹配数据
        });
        this.form[m + "vc"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
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
          column.property == "outcome" ||
          column.property == "beginning" ||
          column.property == "ending"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property == "income") {
            sums[index] = this.$PublicJS.money(this.sumincome || 0, 2);
            if (this.sumincome < 0) {
              sums[index] = "-" + this.$PublicJS.money(Math.abs(this.sumincome) || 0, 2);
            }
            sums[index] += " 元";
          }
          if (column.property == "outcome") {
            sums[index] = this.$PublicJS.money(this.sumoutcome || 0, 2);
            if (this.sumoutcome < 0) {
              sums[index] = "-" + this.$PublicJS.money(Math.abs(this.sumoutcome) || 0, 2);
            }
            sums[index] += " 元";
          }
          if (column.property == "beginning") {
            sums[index] = this.$PublicJS.money(
              Math.abs(this.sumbeginning) || 0,
              2
            );
            if (this.sumbeginning < 0) {
              sums[index] =  "-" + this.$PublicJS.money(Math.abs(this.sumbeginning) || 0, 2);
            }
            sums[index] += " 元";
          }
          if (column.property == "ending") {
            sums[index] = this.$PublicJS.money(
              Math.abs(this.sumending) || 0,
              2
            );
            if (this.sumending < 0) {
              sums[index] =  "-" + this.$PublicJS.money(Math.abs(this.sumending) || 0, 2);
            }
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style>
.has-gutter td div {
  text-align: right;
}
</style>