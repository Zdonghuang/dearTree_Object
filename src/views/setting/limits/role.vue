<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="角色名称" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="gitRoleTable">查询</el-button>
      </el-col>
      <el-col :xs="24" :sm="16" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('showAddRole','')"
            v-has="1302"
          >新增角色</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="mini" icon="el-icon-printer">打印</el-button> -->
          <el-button size="mini" icon="el-icon-download" v-has="383">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="TableData"
              border
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              size="mini"
              height="600"
              header-cell-class-name="thbgc"
            >
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="showDialog('showAddRole',scope.row)"
                    type="text"
                    size="mini"
                    v-has="1302"
                  >修改</el-button>
                  <!-- <el-button type="text" size="mini" icon="el-icon-edit-outline">删除</el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit-outline">设置权限</el-button>-->
                </template>
              </el-table-column>
              <el-table-column sortable prop="rName" label="名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="rCtime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="creator" label="创建人" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column sortable align="center" show-overflow-tooltip></el-table-column> -->
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
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showAddRole"
      width="60%"
    >
      <addRole @emitAddRoleData="getAddRoleData" :updateRole="updateRole"></addRole>
    </el-dialog>
  </div>
</template>
<script>
import addRole from "@/components/dialog/AddRole";
export default {
  name: "role",
  inject: ["reload"],
  components: {
    addRole
  },
  data() {
    return {
      updateRole: {},
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      idList: [],
      form: {},
      title: "",
      showAddRole: false
    };
  },
  created() {
    this.gitRoleTable();
  },
  methods: {
    // 角色列表
    gitRoleTable() {
      let param = {};
      if (this.form.searchText) {
        param["roleName"] = this.form.searchText;
      }
      param["currentPage"] = this.currentPage;
      param["size"] = this.pageSize;
      this.$api.Permission.page(param).then(res => {
        let item = res.data;
        this.TableData = item.records;
        this.currentPage = item.current;
        this.total = item.total;
      });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.gitRoleTable();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.gitRoleTable();
    },
    //添加修改角色
    getAddRoleData() {
      this.Refresh();
      this.showAddRole = false;
    },
    //加载弹框
    showDialog(n, m) {
      if (m.rId) {
        this.title = "角色编辑";
        this.updateRole = m;
      } else {
        this.title = "角色添加";
        this.updateRole = {};
      }
      this[n] = true;
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
.el-dialog {
  overflow-y: scroll;
}
</style>