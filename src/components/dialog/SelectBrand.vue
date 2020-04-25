<template>
  <!-- 查询客户 -->
  <div>
    <el-form :model="brandForm">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="4" align="left">
          <el-input placeholder="请输入品牌" v-model="form.brand" size="small"></el-input>
        </el-col>
        <el-col :xs="24" :sm="12" align="left">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getBrandList">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="BrandTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        highlight-current-row
        style="width: 100%"
        size="small"
        height="300px"
        @row-click="rowclick"
        @row-dblclick="dbrowclick"
        header-cell-class-name="thbgc"
      >
        <el-table-column type="index" width="50" align="center">
        </el-table-column>
        <el-table-column sortable property="cAttrvalue" label="名称"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginationBox">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="BrandTableData.length"
        ></el-pagination>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogBtn('cancel')">取 消</el-button>
      <el-button size="mini" type="primary" @click="dialogBtn('define')">确 定</el-button>
    </div>
    <br />
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {
      brandForm: {},
      form: {},
      thisRowData: "",
      BrandTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.getBrandList();
  },
  methods: {
    // 品牌列表
    getBrandList() {
      let param = {
        typeCode: "PP",
        value1: 2
      };
      if (this.form.brand != "") {
        param.attrValue = this.form.brand;
      }
      this.$api.Common.get(param).then(res => {
        this.BrandTableData = res.data;
      });
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    rowclick(row, column, event) {
      this.thisRowData = row;
    },
    dbrowclick(row, column, event) {
      this.thisRowData = row;
      this.dialogBtn("define");
    },
    dialogBtn(val) {
      if (val === "cancel") {
        this.$emit("emitBrandData", false);
      }
      if (val === "define") {
        if (this.thisRowData) {
          this.$emit("emitBrandData", this.thisRowData);
        } else {
          this.$message({
            message: "请选择一行数据",
            type: "warning"
          });
        }
      }
    }
  }
};
</script>

<style scoped>
</style>