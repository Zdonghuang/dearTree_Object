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
          <el-button size="small" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
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
        <el-select
          v-model="form.rCuseridvc"
          filterable
          clearable
          placeholder="请选择记账人"
          size="small"
          @change="selectChange('rCuserid',form.rCuseridvc)"
          @clear="clearInput('rCuserid')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">记账人</span>
          </template>
          <el-option
            v-for="(item,index) in rCuseridOptions"
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
        <el-select
          v-model="form.rCuidvc"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="selectChange('rCuid',form.rCuidvc)"
          @clear="clearInput('rCuid')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">往来单位</span>
          </template>
          <el-option
            v-for="(item,index) in rCuidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:300px">{{ item.label }}</span>
            <!-- <span style="float: left;">{{ item.cuadd }}</span> -->
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.fsIotypevc"
          filterable
          clearable
          placeholder="请选择收入支出"
          size="small"
          @change="selectChange('fsIotype',form.fsIotypevc)"
          @clear="clearInput('fsIotype')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">收入支出</span>
          </template>
          <el-option
            v-for="item in fsIotypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="2" :xs="24">
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
               <el-table-column width="55" align="center" type="index" label="行号"></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="ritemnum"
                label="单据编号"
              ></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdate" label="单据日期"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rname" label="单据类型"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="cuname" label="往来单位"></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="rhandmanv"
                label="经手人"
              ></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="bankname" label="账户"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="incomef" label="收入">
                <template slot-scope="scope">
                  <div class="tr">
                    <span v-if="scope.row.incomef<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.incomef), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="outcomef" label="支出">
                <template slot-scope="scope">
                  <div class="tr">
                    <span v-if="scope.row.outcomef<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.outcomef), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                property="rremarkmain"
                label="备注"
              ></el-table-column>
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
  name: "FundFlowDetail",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rCuidOptions: [],
      rCuseridOptions: [],
      rAccountidOptions: [],
      fsIotypeOptions:[{label:'收入',value:'1'},{label:'支出',value:'2'},{label:'全部',value:'0'}],
      form: {
        rAccountid: "",
        rAccountidvc: "",
        rCuseridvc: "",
        rCuserid: "",
        rCuid: "",
        rCuidvc: "",
        sDate: "",
        eDate: "",
        fsIotype:0
      },
      loading: false,
      totalincome: 0,
      totaloutcome: 0,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.sDate = getDate.getToday().starttime;
    this.form.eDate = getDate.getToday().endtime;
    // 账户  cStatus传1 不显示停用账户
    this.$api.Common.get({ typeCode: "YHZH",cStatus: 1 }).then(res => {
      this.rAccountidOptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    // 记账人
    this.$api.User.get({ size: 9999, auth: 2 }).then(res => {
      if (res.code == 200) {
        this.rCuseridOptions = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uId,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
      }
    });
    // this.getList();
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          size: 9999,
          auth: 2,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = [];
            res.data.records.map(item => {
              if (item.cuDiv != 2) {
                //过滤物流公司
                this.rCuidOptions.push({
                  label: item.cuName,
                  value: item.cuId
                });
              }
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = this.form;
      if (!this.form.rCuid) delete params.rCuid;
      if (!this.form.rCuidvc) delete params.rCuidvc;
      if (!this.form.rCuserid) delete params.rCuserid;
      if (!this.form.rCuseridvc) delete params.rCuseridvc;
      if (!this.form.rAccountid) delete params.rAccountid;
      if (!this.form.rAccountidvc) delete params.rAccountidvc;
      if (!this.form.fsIotype) delete params.fsIotype;
      if (!this.form.fsIotypevc) delete params.fsIotypevc;
      
      params.size = this.pageSize;
      params.currentPage = this.currentPage;
      if (val == "s") {
        params.currentPage = 1;
      }
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      params.sDate = moment(this.form.sDate).format("YYYY-MM-DD");
      params.eDate = moment(this.form.eDate).format("YYYY-MM-DD");
      sessionStorage.setItem("getData", JSON.stringify(params));
      this.$api.Stat.statzjlsmxNew(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.currentPage = res.data.current;
          if (res.data.records.length) {
            this.totaloutcome = res.data.records[0].totaloutcome;
            this.totalincome = res.data.records[0].totalincome;
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
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/printingFundFlowDetail`, "_blank");
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
          `资金流水明细${getDate.getToday().starttime}.xlsx`
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
        this.getList("s");
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
            column.property == "incomef") ||
          column.property == "outcomef"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);

          if (column.property == "incomef") {
            sums[index] = this.$PublicJS.money(this.totalincome || 0, 2);
            if (this.totalincome < 0) {
              sums[index] =
                "-" + this.$PublicJS.money(Math.abs(this.totalincome) || 0, 2);
            }
            sums[index] += " 元";
          }
          if (column.property == "outcomef") {
            sums[index] = this.$PublicJS.money(this.totaloutcome || 0, 2);
            if (this.totaloutcome < 0) {
              sums[index] =
                "-" + this.$PublicJS.money(Math.abs(this.totaloutcome) || 0, 2);
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