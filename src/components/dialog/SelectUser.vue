<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" align="left">
        <el-input placeholder="请输入姓名" v-model="form.name" size="mini">
          <template slot="prepend">姓名</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" align="left">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="5">
        <div class="treebor">
          <div class="treeTitle">所属部门</div>
          <div class="treeBox">
            <!-- 左侧树形菜单 -->
            <el-tree
              :data="TreeData"
              accordion
              :expand-on-click-node="true"
              :props="defaultProps"
              @node-click="treeNodeClick"
            ></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="18" :offset="1">
        <div class="tablebox">
          <!-- 表格 -->
          <el-table
            :data="userTableData"
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
            <el-table-column sortable property="uName" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column sortable property="uGender" label="性别">
              <template slot-scope="scope">
                <span>{{scope.row.uGender==1?'男':'女'}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable property="oidValue" label="部门" show-overflow-tooltip></el-table-column>
            <el-table-column sortable property="uMobile" label="联系电话" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
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
        <el-button size="mini" @click="dialogBtn('1')">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogBtn('2')">确 定</el-button>
      </el-col>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
import { URLSearchParams } from "url";
export default {
  data() {
    return {
      form: {
        name: ""
      },
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      thisRowData: "",
      userTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      oid: ""
    };
  },
  created() {
    this.gitTree();
    this.getUserList();
  },
  methods: {
    // 树形菜单
    gitTree() {
      let parms = {
        typeCode: "ZZJG"
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.oid = data.id;
      let params = {};
      if (this.oid != "" && this.oid != "1") {
        params.oid = this.oid;
      }
      this.getUserList(params);
    },
    // 查询
    search() {
      let params = {};
      if (this.form.name) {
        params.name = this.form.name;
      }
      this.getUserList(params);
    },
    // 用户列表
    getUserList(val) {
      let params = {};
      if (val) {
        params = val;
      }
      params.auth = 2; //授权数据：1-取权限过滤的数据(默认)，其他-取全部
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      params.status = 1;
      this.$api.User.get(params)
        .then(res => {
          if (res.data) {
            this.userTableData = res.data.records;
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
        this.$emit("emitUserData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitUserData", this.thisRowData);
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
      this.getUserList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getUserList();
    }
  }
};
</script>
<style scoped>
</style>