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
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383" @click="getList('xlsx')">导出</el-button>
          <!-- <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rStime"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rEtime"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rWhidtransferv"
          filterable
          clearable
          placeholder="请选择仓库"
          size="small"
          @change="selectChange('rWhidtransfer',form.rWhidtransferv)"
          @clear="clearInput('rWhidtransfer')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">仓库</span>
          </template>
          <el-option
            v-for="(item,index) in rWhidtransferOptions"
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
      <el-col :sm="2" :xs="24">
        <el-button type="warning" size="small" @click="getList">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="singleTable"
      :data="tableData"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
      size="mini"
      id="table-data"
      height="600"
      header-cell-class-name="thbgc"
      show-summary
      :summary-method="getSummaries"
      sum-text="合计:"
    >
      <el-table-column type="index" width="55" label="序号" align="center" ></el-table-column>
      <el-table-column sortable property="rDate" label="单据日期" align="center"></el-table-column>
      <el-table-column sortable property="rItemnum" width="200" label="单据编号" align="center">
        <template slot-scope="scope">
          <span
            class="bluecolor"
            @click="gostatement(scope.row,'RKstatementDetail',0)"
          >{{scope.row.rItemnum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="rItemnum"
        label="来源订单"
      >
        <template slot-scope="scope">
          <span
            class="orderlink"
            @click="gostatement(scope.row,'/warehouse/inbound/XStransferInboundDetail',0)"
          >{{ scope.row.rItemnumparent }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable property="rStatus" label="单据状态" align="center">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rStatus | orderClass"
            size="mini"
          >{{ scope.row.rStatus | orderStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable property="rStatus" label="结算状态" align="center">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.rBillingstatus | settleClass"
            size="mini"
          >{{ scope.row.rBillingstatus | settleStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable property="rApprovalstatus" label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="`${scope.row.rApprovalstatus}` | ApprovalClass"
            size="mini"
          >{{ scope.row.rApprovalstatus | ApprovalStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable property="rTotalprice" label="本单金额" align="center">
        <template slot-scope="scope">{{ $PublicJS.money(scope.row.rTotalprice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable property="rHandmanv" label="经手人" align="center"></el-table-column>
      <el-table-column sortable property="rRemark" label="单据备注" align="center"></el-table-column>
    </el-table>
    <br />
    <div class="paginationBox">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangePage"
        :current-page="currentPage"
        :page-sizes="[20, 30,40, totalsize]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalsize"
        small
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import getDate from "@/utils/getDate";
export default {
  name: "RKstatementList",
  inject: ["reload"],
  data() {
    return {
      rWhidtransferOptions: [],
      rHandmanOptions: [],
      tableData: [],
      currentRow: null,
      form: {
        rHandmanv: "",
        rHandman: "",
        rWhidtransferv: "",
        rWhidtransfer: "",
        rStime: "",
        rEtime: "",
        rRemark: "",
        rItemnum: "",
        rStatus: this.$route.query.status ? this.$route.query.status : "",
        rType: 48
      },
      currentPage: 1,
      totalsize: 0,
      pagesize: 20
    };
  },
  created() {
    this.form.rStime = getDate.getToday().starttime;
    this.form.rEtime = getDate.getToday().endtime;
    if (this.$route.query.status) {
      this.form.rStime = "";
      this.form.rEtime = "";
    }
    this.getList();
    // 仓库
    this.$api.Warehouse.get({ auth: 1, size: 9999 }).then(res => {
      if (res.code == 200) {
        this.rWhidtransferOptions = res.data.records.map(item => {
          return {
            label: item.whName,
            value: item.whId,
            whCode: item.whCode
          };
        });
      }
    });
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
  },
  methods: {
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
          `列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取单据列表
    getList(val) {
      this.tableData = [];
      let params = JSON.parse(JSON.stringify(this.form));
      if (!params.rWhidtransferv) delete params.rWhidtransferv;
      if (!params.rWhidtransfer) delete params.rWhidtransfer;
      if (!params.rHandmanv) delete params.rHandmanv;
      if (!params.rHandman) delete params.rHandman;
      if (!params.rItemnum) delete params.rItemnum;
      if (!params.rRemark) delete params.rRemark;
      if (!params.rStatus) delete params.rStatus;
      params.rStime = params.rStime.replace(/\-/g, "");
      params.rEtime = params.rEtime.replace(/\-/g, "");
      params.currentPage = this.currentPage;
      params.size = this.pagesize;
      if (val == "xlsx") {
        params.size = this.totalsize;
        params.currentPage = 1;
      }
      this.$api.Receipt.get(params).then(res => {
        // this.tableData = res.data.records;
        // this.totalsize = res.data.total;
        if (res.data) {
          this.tableData = [];
          this.currentPage = res.data.current;
          // 成本金额权限设置
          let vhas = this.$storage.permissions;
          if (vhas.indexOf("384") != -1) {
            this.tableData = res.data.records;
            this.totalsize = res.data.total;
          } else {
            res.data.records.map(item => {
              if (item.rOid == this.$storage.companyId) {
                this.tableData.push(item);
              }
            });
            if (res.data.pages == 1) {
              this.total = this.tableData.length;
            } else {
              this.total =
                res.data.total - (res.data.size - this.tableData.length);
            }
          }

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
      if (val) {
        let obj = {};
        obj = this[m + "Options"].find(item => {
          return item.value === val; //筛选出匹配数据
        });
        this.form[m + "v"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChangePage(val) {
      this.currentPage = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    gostatement(b, url, n) {
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
            column.property === "rTotalprice")
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
         
          if (column.property === "rdQuantity") {
          } else {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.rStime = getDate[fn]().starttime;
        this.form.rEtime = getDate[fn]().endtime;
        this.getList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  text-align: center;
  overflow-y: scroll;
}

.el-row-container {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-pagination {
  width: 476px;
  position: relative;
  left: 50%;
  margin-left: -240px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: yellowgreen;
}
.bg-purple1 {
  background: aqua;
}
.bg-purple2 {
  background: skyblue;
}
.bg-purple3 {
  background: plum;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 4px 0 4px 6px;
  div:nth-child(1) {
    margin-bottom: 8px;
    font-size: 12px;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.caozuo {
  color: #ccc;
  margin-right: 5px;
  cursor: pointer;
}
.caozuo.active {
  color: rgb(9, 180, 248);
}
.bluecolor {
  color: rgb(0, 183, 255);
  text-decoration: underline;
  cursor: pointer;
}
</style>
