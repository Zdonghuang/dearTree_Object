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
          v-model="form.rStime"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.rEtime"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCuidv"
         filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="selectChange('rCuid',form.rCuidv)"
          @clear="clearInput('rCuid')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">供应商</span>
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
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rWhidv"
          filterable
          clearable
          placeholder="请选择仓库"
          size="small"
          @change="selectChange('rWhid',form.rWhidv)"
          @clear="clearInput('rWhid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">仓库</span>
          </template>
          <el-option
            v-for="(item,index) in rWhidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.whCode }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rHandmanv"
          filterable
          clearable
          placeholder="请选择经手人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanv)"
          @clear="clearInput('rHandman')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">经手人</span>
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
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="备注" v-model="form.rRemark" size="small" clearable>
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="warning" size="small" @click="formSearch">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      id="table-data"
      style="width: 100%"
      size="mini"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      height="600px"
      header-cell-class-name="thbgc"
    >
       <el-table-column width="55" align="center" type="index"></el-table-column>
      <el-table-column sortable
        width="110"
        align="center"
        show-overflow-tooltip
        property="rDate"
        label="单据日期"
      ></el-table-column>
      <el-table-column sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="rItemnum"
        label="单据编号"
      >
        <template slot-scope="scope">
          <span
            class="orderlink"
            @click="toOrderPage(scope.row,'/recover/statement/SGstatement')"
          >{{ scope.row.rItemnum }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable property="rItemnumparent" width="200" label="来源订单">
        <template slot-scope="scope">
          <span
            class="orderlink"
            @click="toOrderPage(scope.row,'/recover/construction')"
          >{{scope.row.rItemnumparent}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="rStatus" label="单据状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rStatus | orderClass"
            size="mini"
          >{{ scope.row.rStatus | orderStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="rBillingstatus"
        label="结算状态"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.rBillingstatus | settleClass"
            size="mini"
          >{{ scope.row.rBillingstatus | settleStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="rApprovalstatus"
        label="审核状态"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.rApprovalstatus | ApprovalClass"
            size="mini"
          >{{ scope.row.rApprovalstatus | ApprovalStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="rTotalprice"
        label="本单总金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ scope.row.rTotalprice }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="rHandmanv"
        label="经手人"
      ></el-table-column>
      <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="rCuidv"
        label="回收供应商"
      ></el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="rWhidv"
        label="仓库"
      ></el-table-column>
      <el-table-column sortable
        min-width="150"
        align="center"
        show-overflow-tooltip
        property="rRemark"
        label="备注"
      >
        <template slot-scope="scope">
          <div class="tl">{{ scope.row.rRemark }}</div>
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
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  name: "SGstatementList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      rCuidOptions: [],
      rWhidOptions: [],
      rHandmanOptions: [],
      form: {
        rCuidv: "",
        rCuid: "",
        rHandmanv: "",
        rHandman: "",
        rWhidv: "",
        rWhid: "",
        rStime: "",
        rStatus: this.$route.query.status ? this.$route.query.status : "",
        rEtime: "",
        rRemark: "",
        rItemnum: ""
      },
      loading:false
    };
  },
  created() {
    this.form.rStime = getDate.getToday().starttime;
    this.form.rEtime = getDate.getToday().endtime;
    if (this.$route.query.status) {
      this.form.rStime = "";
      this.form.rEtime = "";
    }
    this.setType("回收施工结算单");
    // 客户
    // this.$api.Customer.get({ div: 24, size: 9999 }).then(res => {
    //   if (res.code == 200) {
    //     this.rCuidOptions = res.data.records.map(item => {
    //       return {
    //         label: item.cuName,
    //         value: item.cuId,
    //         cuadd:
    //           item.cuProvincevalue + item.cuCityvalue + item.cuDistrictvalue
    //       };
    //     });
    //   }
    // });
    // 仓库
    this.$api.Warehouse.get({ auth: 1, size: 9999 }).then(res => {
      if (res.code == 200) {
        this.rWhidOptions = res.data.records.map(item => {
          return {
            label: item.whName,
            value: item.whId,
            whCode: item.whCode
          };
        });
      }
    });
    // 经手人
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
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          div: 64,
          size: 9999,
          auth: 1,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = res.data.records.map(item => {
              return {
                label: item.cuName,
                value: item.cuId,
                cuHandman: item.cuHandman,
                cuHandmanvalue: item.cuHandmanvalue,
                cuadd:
                  item.cuProvincevalue +
                  item.cuCityvalue +
                  item.cuDistrictvalue,
                cuAddr: item.cuAddr
              };
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    toOrderPage(b, url, n) {
      if (b) {
        if (n) {
          this.$router.push({
            path: url,
            query: { data: window.btoa(b.rIdparent) }
          });
        } else {
          this.$router.push({
            path: url,
            query: { data: window.btoa(b.rId) }
          });
        }
      } else {
        return b;
      }
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
          `施工结算列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取列表
    getList(val) {
      let params = {};
      if (val && val != "xlsx") {
        params = val;
      }
      if (!this.form.rStatus) delete params.rStatus;
      if (this.form.rStatus) params.rStatus = this.form.rStatus;
      params["rName"] = this.form.rName;
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      params["rStime"] = this.form.rStime.replace(new RegExp("-", "g"), "");
      params["rEtime"] = this.form.rEtime.replace(new RegExp("-", "g"), "");
      if (val == "xlsx") {
        params["currentPage"] = 1;
        params["size"] = this.total;
      }
      this.$api.Receipt.get(params).then(res => {
        if (res.data) {
          this.tableData = res.data.records;
          this.currentPage = res.data.current;
          this.total = res.data.total;
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    // 查询
    formSearch() {
      let params;
      params = JSON.parse(JSON.stringify(this.form));
      Object.keys(params).filter(item => {
        if (!params[item]) {
          delete params[item];
        }
      });
      if (params.rStime) {
        params.rStime = params.rStime.replace(new RegExp("-", "g"), "");
      }
      if (params.rEtime) {
        params.rEtime = params.rEtime.replace(new RegExp("-", "g"), "");
      }
      this.getList(params);
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
        this.getList(params);
      }
    },
    setType(e) {
      this.form.rName = e;
      this.getList();
    },
    setStatus(e) {
      return false;
      let params = {
        rId: e.rId,
        rCmobile: e.rCmobile,
        rCuid: e.rCuid,
        rGetguest: e.rGetguest ? e.rGetguest : 4
      };
      this.$api.Receipt.update(params).then(res => {
        this.getList();
      });
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
        this.form[m + "v"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
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
          column.property == "rTotalprice"
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
      this.getSaleList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getSaleList();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style>
.el-col {
  margin-bottom: 1rem;
}
</style>
