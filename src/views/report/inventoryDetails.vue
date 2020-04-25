<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12" />
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-download" @click="exportTable()">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          size="small"
          placeholder="起始日期"
          value-format="yyyyMMdd"
        />
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          size="small"
          placeholder="结束日期"
          value-format="yyyyMMdd"
        />
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.warehouseId"
          filterable
          clearable
          placeholder="仓库"
          size="small"
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
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.goodsNum" size="small" clearable>
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.goodsName" size="small" clearable>
          <template slot="prepend">商品名称</template>
        </el-input>
      </el-col>
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="small" @click="getList()">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      id="table-data"
      ref="singleTable"
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      height="600px"
      :show-summary="true"
      :summary-method="getSummaries"
      header-cell-class-name="thbgc"
    >
      <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
      <el-table-column align="center" width="200" prop="orderNum" label="单据编号"></el-table-column>
      <el-table-column align="center" width="180" prop="orderRegTime" label="单据日期"></el-table-column>
      <el-table-column align="center" width="180" prop="orderName" label="单据类型"></el-table-column>
      <el-table-column align="center" prop="goodsId" label="商品ID"></el-table-column>
      <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="goodsNum" label="商品货号"></el-table-column>
      <el-table-column align="center" prop="orderParentNum" label="来源订单"></el-table-column>
      <el-table-column align="center" prop="customerName" label="往来单位"></el-table-column>
      <el-table-column align="center" prop="warehouseName" label="仓库"></el-table-column>
      <el-table-column align="center" prop="goodsUnitValue" label="单位"></el-table-column>
      <el-table-column align="center" label="入库">
        <el-table-column align="right" width="150" prop="inCount" label="数量"></el-table-column>
        <el-table-column align="right" width="150" v-if="vhas" prop="inPrice" label="成本单价"></el-table-column>
        <el-table-column align="right" width="150" v-if="vhas" prop="inTotal" label="成本金额"></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="出库">
        <el-table-column align="right" width="150" prop="outCount" label="数量"></el-table-column>
        <el-table-column align="right" width="150" v-if="vhas" prop="outPrice" label="成本单价"></el-table-column>
        <el-table-column align="right" width="150" v-if="vhas" prop="outTotal" label="成本金额"></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="结余">
        <el-table-column align="right" width="150" prop="sumCount" label="数量"></el-table-column>
        <el-table-column align="right" width="150" v-if="vhas" prop="sumTotal" label="成本金额"></el-table-column>
      </el-table-column>
      <el-table-column width="200" align="center" prop="orderRmk" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paginationBox">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100,total]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
export default {
  data() {
    return {
      loading: false,
      rWhidOptions: [],
      currentPage: 1,
      total: 0,
      size: 20,
      form: {
        startDate: getDate.getToday().starttime,
        endDate: getDate.getToday().endtime,
        goodsNum: "",
        goodsName: "",
        warehouseId: ""
      },
      tableData: [],
      vhas: true
    };
  },
  created() {
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
    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getList() {
      if (!this.form.warehouseId) return this.$message.error("请选择仓库");
      //   if (!this.form.goodsNum && !this.form.goodsName)
      //     return this.$message.error("请输入商品名称或货号");
      if (!this.form.goodsNum) delete this.form.goodsNum;
      if (!this.form.goodsName) delete this.form.goodsName;
      const obj = this.form;
      obj.currentPage = this.currentPage;
      obj.size = this.size;
      obj.startDate = obj.startDate.replace(/-/g, "");
      obj.endDate = obj.endDate.replace(/-/g, "");
      this.$api.ReportInventory.get(obj).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    exportTable() {
      const box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      const out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `进销存明细${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 每页下拉显示条数
    handleSizeChange: function(size) {
      this.size = size;
      this.getList();
    },
    // 页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property == "inCount") ||
          column.property == "inPrice" ||
          column.property == "inTotal" ||
          column.property == "outCount" ||
          column.property == "outTotal" ||
          column.property == "outPrice" ||
          column.property == "sumTotal" ||
          column.property == "sumCount"
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
          if (
            column.property != "inCount" &&
            column.property != "outCount" &&
            column.property != "sumCount"
          ) {
            sums[index] += "元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    }
  }
};
</script>
