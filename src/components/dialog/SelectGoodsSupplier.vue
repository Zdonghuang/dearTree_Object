<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="6">
        <el-input placeholder="请输入名称" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="18">
        <el-button type="primary" @click="CustomerLists" size="mini" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="5">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow">
            <div class="treeTitle"></div>
            <div class="treeBox">
              <!-- 左侧树形菜单 -->
              <el-tree
                :data="TreeData"
                node-key="index"
                accordion
                :expand-on-click-node="true"
                :props="defaultProps"
                @node-click="treeNodeClick"
                highlight-current-row
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="19">
        <div class="tablebox">
          <!-- 表格 -->
          <el-table
            :data="TableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            size="small"
            height="300px"
            @row-click="rowclick"
            @row-dblclick="dbrowclick"
            header-cell-class-name="thbgc"
          >
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column sortable prop="cuName" label="名称" align="center"></el-table-column>
            <el-table-column sortable prop="cuCuseridvalue" label="联系人" align="center"></el-table-column>
            <el-table-column sortable prop="cuCuseridmobile" label="联系电话" align="center"></el-table-column>
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
              <el-button size="mini" @click="dialogBtn('1')">取 消</el-button>
              <el-button size="mini" type="primary" @click="dialogBtn('2')">确 定</el-button>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      oid: "",
      form: {
        searchText: ""
      },
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      thisRowData: "",
      TableData: []
    };
  },
  created() {
    this.gitTree();
    this.CustomerLists();
  },
  methods: {
    // 树形菜单
    gitTree() {
      let parms = {
        typeCode: "ZZJG",
        value1: 1
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.oid = data.id;
      this.CustomerLists();
    },
    // 供货商列表
    CustomerLists() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "查询中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      let params = {
        div: "12"
      };
      if (this.form.searchText != "") {
        params["name"] = this.form.searchText;
      }
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      this.$api.Customer.get(params).then(res => {
        // loading.close();
        if (res.data) {
          this.TableData = res.data.records;
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
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.CustomerLists();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.CustomerLists();
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitGoodsSupplierData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitGoodsSupplierData", this.thisRowData);
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