<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6">
        <el-input placeholder="请输入物流公司名称" v-model="form.name" size="mini">
          <template slot="prepend">名称</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="13">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        <!-- <el-button type="warning" size="small" icon="el-icon-plus">新增</el-button> -->
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="LogisticsTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      highlight-current-row
      style="width: 100%"
      size="mini"
      height="300px"
      @row-click="rowclick"
      @row-dblclick="dbrowclick"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column sortable property="cuId" label="编号" show-overflow-tooltip></el-table-column>
      <el-table-column sortable property="cuName" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column sortable property="cuContact" label="联系人"></el-table-column>
      <el-table-column sortable property="cuMobile" label="联系电话" show-overflow-tooltip></el-table-column>
      <el-table-column sortable property="cuRemark" label="备注" show-overflow-tooltip></el-table-column>
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
    <div slot="footer" class="dialog-footer" style="padding-bottom:20px">
      <el-button @click="dialogBtn('1')" size="mini">取 消</el-button>
      <el-button type="primary" @click="dialogBtn('2')" size="mini">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      thisRowData: "",
      form: {
        number: ""
      },
      checked: [],
      LogisticsTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.getLogistcs();
  },
  methods: {
    // 查询
    search() {
      let params = {};
      if (this.form.name) {
        params.name = this.form.name;
      }
      this.getLogistcs(params);
    },
    getLogistcs(val) {
      let params = {};
      if (val) {
        params = val;
      }
      params.div = 2;
      params.status = 1;
      this.$api.Customer.get(params).then(res => {
        if (res.data) {
          this.LogisticsTableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      });
    },
    rowclick(row, column, event) {
      this.thisRowData = row;
    },
    dbrowclick(row, column, event) {
      this.thisRowData = row;
      this.dialogBtn("2");
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitLogisticsData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitLogisticsData", this.thisRowData);
        } else {
          this.$message({
            message: "请选择一行数据",
            type: "warning"
          });
        }
      }
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getLogistcs();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getLogistcs();
    }
  }
};
</script>
<style scoped>
</style>