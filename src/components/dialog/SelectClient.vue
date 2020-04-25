<template>
  <!-- 查询客户 -->
  <div>
    <el-form :model="clientForm">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="6" align="left">
          <el-input placeholder="请输入名称" v-model="form.name" size="mini">
            <template slot="prepend">名称</template>
          </el-input>
        </el-col>
        <!-- <el-col :xs="24" :sm="6" align="left">
          <el-input placeholder="请输入名称/编号" v-model="form.consignee" size="small">
            <template slot="prepend">联系人</template>
          </el-input>
        </el-col>-->
        <el-col :xs="24" :sm="12" align="left">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="openClient"
            v-if="show"
          >新增</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="clientTableData"
        border
        highlight-current-row
        style="width: 100%"
        size="small"
        height="300px"
        @row-click="rowclick"
        @row-dblclick="dbrowclick"
        header-cell-class-name="thbgc"
      >
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <!-- <el-table-column sortable property="cuCuserid" label="编号" :show-overflow-tooltip="true"></el-table-column> -->
        <el-table-column sortable property="cuName" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable property="cuDivvalue" label="类型"></el-table-column>
        <!-- <el-table-column sortable property="cuMobile" label="联系电话" >
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cuMobile" class="ipt tc" />
          </template>
        </el-table-column>-->
        <el-table-column sortable property="cuBankname" label="开户行及账号">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cuBankname" class="ipt tc" />
          </template>
        </el-table-column>
        <el-table-column sortable property="cuTaxnum" label="纳税人识别号">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cuTaxnum" class="ipt tc" />
          </template>
        </el-table-column>
        <el-table-column sortable property="cuRemark" label="开票名称及户名">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cuRemark" class="ipt tc" />
          </template>
        </el-table-column>
        <el-table-column sortable property="cuBankcardnum" label="地址及电话">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cuBankcardnum" class="ipt tc" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="update(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginationBox">
        <el-col :xs="24" :sm="20">
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
        </el-col>
        <el-col :xs="24" :sm="4">
          <el-button size="mini" @click="dialogBtn('cancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="dialogBtn('define')">确 定</el-button>
        </el-col>
      </div>
    </el-form>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
export default {
  props: ["status", "show"],
  data() {
    return {
      clientForm: {},
      form: {
        name: "",
        div: ""
      },
      thisRowData: "",
      clientTableData: [],
      supplierTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.getCustomerList();
  },
  methods: {
    // 查询
    search() {
      let params = {};
      if (this.form.name) {
        params.name = this.form.name;
      }
      this.getCustomerList(params);
    },
    // 客户列表
    getCustomerList(val) {
      let params = {};
      if (val) {
        params = val;
      }
      params.currentPage = this.currentPage;
      // 区分：16-客户，12-供应商，24-客户回收供应商，20-客户采购供应商，8-回收供应商，4-采购供应商，2-物流公司，1-合作伙伴
      params.div = this.$props.status;
      params.size = this.pageSize;
      params.auth = 1;
      this.$api.Customer.get(params).then(res => {
        if (res.data) {
          let item = res.data.records;
          this.clientTableData = item;
          this.currentPage = res.data.current;
          this.total = res.data.total;
        }
      });
    },
    update(v) {
      v.cuPrincipal = v.cuHandman;
      this.$api.Customer.update(v).then(res => {
        if (res.code == "200") {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.CustomerLists();
        } else {
          this.$message("保存失败");
        }
      });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getCustomerList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getCustomerList();
    },
    openClient() {
      this.$emit("openClient");
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
        this.$emit("emitClientData", false);
      }
      if (val === "define") {
        if (this.thisRowData) {
          this.$emit("emitClientData", this.thisRowData);
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