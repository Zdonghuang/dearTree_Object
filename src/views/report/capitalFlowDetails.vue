<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12"></el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="mini" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
          <el-button size="mini" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          size="mini"
          placeholder="起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          size="mini"
          placeholder="结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.orderItemNum" size="mini" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.bankAccountId"
          placeholder="账户名称"
          size="mini"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">账户名称</span>
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
          v-model="form.handmanId"
          filterable
          clearable
          placeholder="请选择经手人"
          size="mini"
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
        <el-select
          v-model="form.financeUserId"
          filterable
          clearable
          placeholder="请选择记账人"
          size="mini"
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
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.customerId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="mini"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">客户</span>
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
          v-model="form.companyId"
          filterable
          clearable
          placeholder="请选择归属公司"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">归属公司</span>
          </template>
          <el-option
            v-for="(item,index) in rOidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.moneyType"
          placeholder="资金出入类型"
          size="mini"
          class="selectSlot4"
          clearable
        >
          <el-option label="收入" :value="1"></el-option>
          <el-option label="支出" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.subjectName" size="mini">
          <template slot="prepend">科目</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showSelectBankAccount=true"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-col>
      <el-col :sm="2" :xs="6">
        <el-checkbox
          v-model="form.showRush"
          label="显示红冲"
          border
          size="mini"
          true-label="1"
          false-label
          @change="getList"
        ></el-checkbox>
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
              id="table-data"
              size="mini"
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column sortable align="center" prop="orderId" label="单据编号"></el-table-column>
              <el-table-column sortable align="center" prop="financeDateTime" label="单据时间"></el-table-column>
              <el-table-column sortable align="center" prop="orderType" label="单据类型"></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="subjectName"
                label="科目名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="customerId"
                label="客户ID"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="customerName"
                label="客户名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="bankName"
                label="账户名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="handmanName"
                label="经手人"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="financeName"
                label="记账人"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="incomeMoney"
                label="收入"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="outcomeMoney"
                label="支出"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="orgName"
                label="分公司名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="orderRemark"
                label="单据备注"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                prop="financeRemark"
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
    <el-dialog
      title="科目"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData" parentCode="40"></selectBankAccount>
    </el-dialog>
  </div>
</template>

<script>
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import getDate from "../../utils/getDate";
export default {
  name: "stock",
  inject: ["reload"],
  components: {
    selectBankAccount
  },
  data() {
    return {
      vhas: true,
      showSelectBankAccount: false,
      loading: false,
      data: [],
      TreeData: [],
      tableData: [],
      YSoptions: [],
      form: {
        startDate: getDate.getToday().starttime,
        endDate: getDate.getToday().endtime,
        bankAccountId: "",
        handmanId: "",
        customerId: "",
        moneyType: "",
        financeUserId: "",
        companyId: "",
        orderItemNum: "",
        showRush: "",
        subjectName:''
      },
      bankAccountList: [],
      totalpage: 1,
      page: 1,
      orderclass: 1,
      orderclass1: 1,
      img: "",
      whid: "",
      whidv: "",
      whoid: "",
      whoidv: "",
      gclass: "",
      showSum: true,
      rCuidOptions: [],
      gname: "",
      gcolor: "",
      defaultProps: {
        children: "childs",
        label: "title"
      },
      order: "",
      GSoptions: [],
      rOidOptions: [],
      rHandmanOptions: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数,
      ok: true
    };
  },
  created() {
    this.getList();
    // 归属公司
    this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1 }).then(res => {
      if (res.code == 200) {
        this.rOidOptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      }
    });
    this.$api.Common.get({ typeCode: "YHZH", cStatus: 1 }).then(res => {
      this.bankAccountList = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    // 签单人
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
    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getList(val) {
      let d = this.form;
      if (!this.form.startDate) delete d.startDate;
      if (!this.form.endDate) delete d.endDate;
      if (!this.form.bankAccountId) delete d.bankAccountId;
      if (!this.form.handmanId) delete d.handmanId;
      if (!this.form.customerId) delete d.customerId;
      if (!this.form.moneyType) delete d.moneyType;
      if (!this.form.financeUserId) delete d.financeUserId;
      if (!this.form.companyId) delete d.companyId;
      if (!this.form.orderItemNum) delete d.orderItemNum;
      if (!this.form.showRush) delete d.showRush;
      if (!this.form.subjectName) delete d.subjectName;
      if (d.startDate) d.startDate = d.startDate.replace(/\-/g, "");
      if (d.endDate) d.endDate = d.endDate.replace(/\-/g, "");
      d.size = this.pageSize;
      d.currentPage = this.currentPage;
      if (val == "xlsx") {
        d.size = this.total;
        d.currentPage = 1;
      }
      sessionStorage.setItem("getDataA", JSON.stringify(d));
      this.$api.ReportCapital.capitalFlowDetails(d).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        if (val == "xlsx") {
          setTimeout(() => {
            this.exportTable();
          }, 1500);
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/printingFundFlowDetail?show=1`, "_blank");
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
          `资金流水明细列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    gitTree() {
      let parms = {
        typeCode: "SPFL"
      };
      this.TreeData[0] = { id: "", title: "全部", childs: [] };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData[0].childs = item;
      });
    },
    setimg(url) {
      this.img = url;
    },
    goGoods(e) {
      this.$router.push({
        path: "/basicInfo/goodsedit",
        query: { gId: e }
      });
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    treeNodeClick(data) {
      this.gclass = data.id;
      this.getList();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    getGoodsGS() {
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
    },
    getGoodsYS() {
      let parms = {
        typeCode: "YS"
      };
      this.$api.Common.get(parms).then(res => {
        this.YSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    getBankAccountData(val) {
      if (val) {
        this.form.subjectName = val.cAttrvalue;
      }
      this.showSelectBankAccount = false;
    },
    toExcel(table, e) {
      let content = document.getElementById(table).outerHTML;
      let html =
        '<html><head><meta charset="utf-8" /></head><body>' +
        content +
        "</body></html>";
      // console.log(html);
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      const blob = new Blob([html], { type: "text/excel" });
      // 利用URL.createObjectURL()方法为a元素生成blob URL
      e.target.href = URL.createObjectURL(blob);
      e.target.download = "库存.xls";
    },
    setclass(row) {
      const $singleTable = this.$refs.singleTable;
      $singleTable.toggleRowExpansion(row);
      $singleTable.toggleRowSelection(row);
      if (this.orderclass == 1) {
        this.order = "1";
        this.orderclass = 2;
      } else {
        this.order = "2";
        this.orderclass = 1;
      }

      if (this.ok) {
        this.ok = false;
        this.getList();
      }
    },
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
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
    setclass1(row) {
      const $singleTable = this.$refs.singleTable;
      $singleTable.toggleRowExpansion(row);
      $singleTable.toggleRowSelection(row);
      if (this.orderclass1 == 1) {
        this.order = "3";
        this.orderclass1 = 2;
      } else {
        this.order = "4";
        this.orderclass1 = 1;
      }

      if (this.ok) {
        this.ok = false;
        this.getList();
      }
    },
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
          (!values.every(value => isNaN(value)) &&
            column.property == "incomeMoney") ||
          column.property == "startMoney" ||
          column.property == "endMoney" ||
          column.property == "outcomeMoney"
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
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.startDate = getDate[fn]().starttime;
        this.form.endDate = getDate[fn]().endtime;
      }
    },
    getGoodsData(val) {
      if (val) {
        this.gname = val.gName;
      }
      this.showselectGoods = false;
    },
    getWarehouseData(val) {
      if (val) {
        this.whid = val.whId;
        this.whidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    open(v) {
      window.open(v, "_blank");
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.imgs {
  width: 600px;
}
.table {
  display: none;
  line-height: 20px;
  text-align: center;
  tr th,
  tr td {
    padding: 2px;
  }
}
.bluecolor {
  color: rgb(0, 183, 255);
  text-decoration: underline;
  cursor: pointer;
}
.export {
  display: inline-block;
  width: 73px;
  height: 28px;
  line-height: 22px;
  font-size: 13px;
  color: #666;
  padding: 4px 13px;
  box-sizing: border-box;
  border: 1px solid rgb(228, 227, 227);
  border-radius: 3px;
  vertical-align: middle;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
.selectSlot4 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot2 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot3 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
</style>
