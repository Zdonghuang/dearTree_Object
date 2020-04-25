<template>
  <div>
    <el-table
      :data="TableData"
      border
      style="width: 100%"
      size="mini"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="70" align="center" label="序号"></el-table-column>
      <el-table-column sortable property="pdCtime" label="时间"></el-table-column>
      <el-table-column sortable property="pdAccountv" label="账户名称"></el-table-column>
      <el-table-column sortable property="pdSubjectnum" label="账户号码"></el-table-column>
      <el-table-column sortable property="pdAmount" label="金额"></el-table-column>
      <el-table-column sortable property="pdCuidv" label="客户"></el-table-column>
      <el-table-column sortable property="pdHandmanv" label="经手人"></el-table-column>
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
  props: ["cuid", "div"],
  data() {
    return {
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      showSelectUser: false,
      pcuid: 0,
      divb: 1
    };
  },
  watch: {
    cuid: {
      handler: function(a, b) {
        this.pcuid = a;
        console.log(a)
        this.getFinancedts();
      },
      immediate: true
    }
  },
  methods: {
    //预收款详细列表
    getFinancedts() {
      let param = {};
      if (this.pcuid) {
        param["pid"] = this.pcuid;
        param["currentPage"] = this.currentPage;
        param["size"] = this.pageSize;
        this.$api.Premoneydts.get(param).then(res => {
          let item = res.data.records;
          item.map(item => {
            item.pdCtime = item.pdCtime.split("T")[0];
          });
          this.TableData = item;
          this.total = res.data.total;
        });
      } else {
        this.TableData = [];
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
          column.property == "pdAmount"
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
      this.getFinancedts();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getFinancedts();
    }
  }
};
</script>

<style scoped>
</style>