<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入姓名" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="gitUserTable">查询</el-button>
        <el-checkbox v-model="checked" size="mini" @change="gitUserTable">显示离职</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="4"></el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="mini" icon="el-icon-printer">打印</el-button> -->
          <el-button size="mini" icon="el-icon-download" v-has="383">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">组织架构</div>
            <div class="treeBox">
              <!-- 左侧树形菜单 -->
              <el-tree
                :data="TreeData"
                node-key="index"
                accordion
                :expand-on-click-node="true"
                :props="defaultProps"
                @node-click="treeNodeClick"
                highlight-current
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="20">
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
              height="680"
              :row-class-name="tableRowClassName"
              header-cell-class-name="thbgc"
            >
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="opendialog('showSelectRole',scope.row)"
                    type="text"
                    size="mini"
                    v-has="1202"
                  >角色设置</el-button>
                  <el-button
                    @click="opendialog('restPWD',scope.row)"
                    type="text"
                    size="mini"
                    v-has="1202"
                  >重置密码</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable prop="uName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable label="性别" align="center" prop="uGender" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{
                  scope.row.uGender==1?'男' : '女'
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable label="是否离职" align="center" prop="uStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{
                  scope.row.uStatus==1?'否' : '是'
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable prop="oidValue" label="部门" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column sortable prop="gBarcode" label="直属上级" width="120" align="center" ></el-table-column> -->
              <el-table-column sortable prop="uMobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="uEmail" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="uridv" label="角色" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
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
    <el-dialog
      title="角色设置"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectRole"
      width="20%"
    >
      <el-form :model="SelectRoleFrom" ref="ruleForm" label-width="40px" v-if="hackReset">
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="姓名" prop="uName">{{uName}}</el-form-item>
            <el-form-item label="角色" prop="rId">
              <el-select
                v-model="SelectrRId"
                placeholder="请选择角色"
                size="mini"
                multiple
                @change="selectchange"
              >
                <el-option
                  v-for="item in Roleoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col></el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col align="center">
          <el-button type="primary" size="mini" align="center" @click="submitForm('ruleForm')">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "organization",
  inject: ["reload"],
  data() {
    return {
      Roleoptions: [],
      SelectRoleFrom: {},
      SelectrRId: [],
      showSelectRole: false,
      hackReset: false,
      rCuserid: "",
      rRoleid: "",
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      uName: "",
      checked: false,
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      idList: [],
      form: {}
    };
  },
  created() {
    this.gitTree();
    this.gitUserTable();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.uStatus === 0) {
        return "success-row";
      }
      return "";
    },
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
    //树形菜单节点点击
    treeNodeClick(data) {
      this.oid = data.id;
      this.gitUserTable();
    },
    //显示弹窗
    opendialog(n, m) {
      if (n == "restPWD") {
        this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.restPWD(m);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      } else {
        this.uName = m.uName;
        this.SelectRoleFrom.rCuserid = m.uId;
        this.gitRoleTable();
        if (m.uRid) {
          this.rRoleid = m.uRid;
          this.rCuserid = m.uId;
          this.getRole(m.uId);
        } else {
          this.SelectrRId = [];
        }
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this[n] = true;
      }
    },
    // 重置密码
    restPWD(m) {
      let params = {
        uGender: m.uGender,
        uId: m.uId,
        uPasswd: "dT123123."
      };
      this.$api.User.update(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "重置成功!"
          });
        }
      });
    },
    //编辑用户角色
    getRole(val) {
      let param = {
        uid: val
      };
      this.$api.User.get(param).then(res => {
        if (res.code == 200) {
          let items = res.data.records[0];
          this.SelectrRId = JSON.parse(items.uRid);
          this.rRoleid = JSON.parse(items.uRid);
          // this.SelectRoleFrom = res.data.role;
          // this.SelectRoleFrom.rCuserid = this.rCuserid;
        }
      });
    },
    // 用户列表
    gitUserTable() {
      let param = {};
      if (this.form.searchText != "") {
        param["name"] = this.form.searchText;
      }
      if (this.oid != "" && this.oid != "1") {
        param["oid"] = this.oid;
      }
      if (this.checked != true) {
        param["status"] = "1";
      } else {
        param["status"] = "2";
      }
      param["currentPage"] = this.currentPage;
      param["size"] = this.pageSize;
      this.$api.User.get(param).then(res => {
        if (res.data) {
          this.TableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      });
    },
    //角色
    gitRoleTable() {
      let param = {};
      param["currentPage"] = "1";
      param["size"] = 99999;
      this.$api.Permission.page(param).then(res => {
        this.Roleoptions = res.data.records.map(item => {
          return { label: item.rName, value: item.rId };
        });
      });
    },
    // 停用启用
    stRowClick(e) {
      this.$confirm("此操作将启用/停用，是否继续？", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let parms = {
            uId: e.uId
          };
          if (e.uStatus != 1) {
            parms["uStatus"] = 1;
            e.uStatus = 1;
          } else {
            parms["uStatus"] = 0;
            e.uStatus = 0;
          }
          this.$api.User.update(parms).then(res => {
            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.WarehouseLists();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.gitUserTable();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.gitUserTable();
    },

    //确定提交
    submitForm(formName) {
      // if (!this.SelectrRId.length) {
      //   this.$message({ message: "请选择角色", type: "warning" });
      //   return false;
      // }
      if (JSON.stringify(this.SelectrRId) == JSON.stringify(this.rRoleid)) {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.showSelectRole = false;
        return false;
      }
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      let parms = {
        uId: this.SelectRoleFrom.rCuserid,
        uRid: JSON.stringify(this.SelectrRId)
      };
      this.$api.User.update(parms).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.reload();
          // this.gitUserTable();
          // this.SelectRoleFrom = [];
          this.showSelectRole = false;
        } else {
          this.$message({
            message: "提交失败"
          });
        }
      });
      //   } else {
      //     this.$message({
      //       message: "提交失败"
      //     });
      //   }
      // });
    },
    selectchange() {
      this.$forceUpdate();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
.el-table__row .success-row {
  background: #d61b40;
}
</style>