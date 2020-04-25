<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12"></el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-download" @click="exportTable()">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      ref="singleTable"
      id="table-data"
      height="600px"
      :show-summary="true"
      :summary-method="getSummaries"
      header-cell-class-name="thbgc"
    >
      <el-table-column sortable align="center" prop="companyNm" label="分公司">
        <template slot-scope="scope">
          <div v-if="!scope.row.userNm">{{scope.row.companyNm}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="userNm" label="获客人"></el-table-column>
      <!-- <el-table-column sortable align="right" prop="rankNum" label="rankNum"></el-table-column> -->
      <el-table-column sortable align="right" prop="todayCount" label="昨日订单"></el-table-column>
      <el-table-column sortable align="right" prop="todayAmount" label="昨日总额"></el-table-column>
      <el-table-column sortable align="right" prop="monthCount" label="本月订单"></el-table-column>
      <el-table-column sortable align="right" prop="monthAmount" label="本月总额"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$api.ReportCapital.salesDailyDetails({ size: 999 }).then(res => {
        //   console.log(res);
        this.tableData = res.data.records;
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
          `销售日报${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
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
            column.property == "todayCount") ||
          column.property == "todayAmount" ||
          column.property == "monthCount" ||
          column.property == "monthAmount"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (
            column.property == "monthAmount" ||
            column.property == "todayAmount"
          ) {
            sums[index] = this.$PublicJS.money(sums[index] / 2, 2);
            sums[index] += " 元";
          } else {
            sums[index] = sums[index] / 2;
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