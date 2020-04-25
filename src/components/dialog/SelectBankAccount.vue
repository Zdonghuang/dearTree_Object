<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <el-input placeholder="请输入名称" v-model="attrValue" size="small">
          <template slot="prepend">名称</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" align="left">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-if="bankAccountTableData"
      :data="bankAccountTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      highlight-current-row
      size="mini"
      height="300px"
      @row-click="rowclick"
      @row-dblclick="dbrowclick"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="50" align="center">
        <template slot="header" slot-scope="scope">
          <i class="fa fa-level-up" @click="backUP(scope)"></i>
        </template>
      </el-table-column>
      <el-table-column sortable property="cValue1" label="级别" width="50" align="center">
        <template slot-scope="scope">
          <i class="fa fa-folder-open" v-if="scope.row.cValue1==1"></i>
          <i class="fa fa-file" v-if="scope.row.cValue1==0"></i>
        </template>
      </el-table-column>
      <el-table-column sortable property="cAttrcode" label="编号" show-overflow-tooltip width="120px"></el-table-column>
      <el-table-column sortable property="cAttrvalue" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column sortable property="cRemark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paginationBoxs">
      <el-col :xs="24" :sm="20">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="bankAccountTableData.length"
          :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100,total]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button @click="dialogBtn('1')" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogBtn('2')" size="mini">确 定</el-button>
      </el-col>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
export default {
  props: {
    code: {
      default: 0
    },
    parentCode: {
      default: 0
    }
  },
  data() {
    return {
      thisRowData: "",
      form: {
        number: ""
      },
      attrValue: "",
      checked: false,
      bankAccountTableData: [],
      pcode: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.bankAccount();
  },
  methods: {
    backUP(val) {
      if (this.pcode.length > 0) {
        this.bankAccount(this.pcode.pop());
      }
    },
    search() {
      this.bankAccount();
    },
    bankAccount(val) {
      this.bankAccountTableData = [];
      let parmas = {};
      parmas.typeCode = "CWKM";
      parmas.cStatus = 1;
      if (this.attrValue) parmas.attrValue = this.attrValue;
      if (this.$props.code) {
        delete parmas.typeCode;
        parmas.typeCode = this.$props.code;
        parmas.value1 = this.$storage.companyId;
      }
      if (this.$props.parentCode)
        parmas.attrCodeParent = this.$props.parentCode;
      if (val) parmas.attrCodeParent = val;
      this.$api.Common.get(parmas).then(res => {
        if (res.data) this.bankAccountTableData = res.data;
      });
    },
    rowclick(row, column, event) {
      if (row.cValue1 != 0 && !this.$props.code) {
        this.pcode.push(row.cAttrcodeparent);
        this.bankAccount(row.cAttrcode);
      } else {
        this.thisRowData = row;
      }
    },
    dbrowclick(row, column, event) {
      this.thisRowData = row;
      this.dialogBtn("2");
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitBankAccountData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitBankAccountData", this.thisRowData);
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
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>
<style scoped>
</style>