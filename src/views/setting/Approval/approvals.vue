<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.attrCodeParent"
          placeholder="所属公司"
          size="small"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">所属公司</span>
          </template>
          <el-option
            v-for="item in GSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.attrCode"
          placeholder="单据类型"
          size="small"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">单据类型</span>
          </template>
          <el-option
            v-for="(item,i) in SPoptions1"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="2">
        <el-button type="warning" size="small" @click="gitRoleTable">查询</el-button>
      </el-col>
      <el-col :xs="24" :sm="14" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('showAddRole','')"
            v-has="1302"
          >新增审批</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="mini" icon="el-icon-printer">打印</el-button> -->
          <!-- <el-button size="mini" icon="el-icon-download" v-has="383">导出</el-button> -->
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
                  <el-button @click="showDialog('showAddRole',scope.row)" type="text" size="mini">修改</el-button>
                  <!-- <el-button type="text" size="mini" icon="el-icon-edit-outline">删除</el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit-outline">设置权限</el-button>-->
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="cRemark"
                label="名称"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="cAttrvalue"
                label="公司"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="cValue2"
                label="审核人"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="cValue3"
                label="抄送人"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
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
      width="40%"
    >
      <el-row :gutter="20" class="titleBox" v-if="!updateRole.cId">
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="company"
            placeholder="所属公司"
            size="small"
            @change="setname"
            class="selectSlot4"
            clearable
          >
            <el-option
              v-for="item in GSoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="rtype"
            placeholder="单据类型"
            size="small"
            @change="setname"
            class="selectSlot4"
            clearable
          >
            <el-option
              v-for="item in SPoptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="users1"
            filterable
            multiple
            size="small"
            label="审批人"
            clearable
            placeholder="请选择审批人"
          >
            <el-option v-for="(item,i) in options" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="users2"
            filterable
            multiple
            size="small"
            clearable
            placeholder="请选择抄送人"
          >
            <el-option v-for="(item,i) in options" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-input size="small" placeholder="审批名称" v-if="company&&rtype" v-model="name"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" align="right">
          <el-button type="warning" size="small" @click="savedata">添加</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="titleBox" v-else>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="company"
            placeholder="所属公司"
            size="small"
            disabled
            class="selectSlot4"
            clearable
          >
            <el-option
              v-for="item in GSoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="rtype"
            disabled
            placeholder="单据类型"
            size="small"
            class="selectSlot4"
            clearable
          >
            <el-option
              v-for="(item,i) in SPoptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="users1"
            filterable
            multiple
            size="small"
            label="审批人"
            clearable
            placeholder="请选择审批人"
          >
            <el-option v-for="(item,i) in options" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-select
            v-model="users2"
            filterable
            multiple
            size="small"
            clearable
            placeholder="请选择抄送人"
          >
            <el-option v-for="(item,i) in options" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-input size="small" placeholder="审批名称" v-if="company&&rtype" v-model="name"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" align="right">
          <el-button type="warning" size="small" @click="savedata">修改</el-button>
        </el-col>
      </el-row>
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
      rtype: "",
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      idList: [],
      form: {},
      title: "",
      GSoptions: [],
      SPoptions: [],
      SPoptions1: [],
      options: [],
      showAddRole: false,
      users: "",
      users1: "",
      users2: "",
      company: "",
      name: ""
    };
  },
  created() {
    this.gitRoleTable();
    let parms = {
      typeCode: "ZZJG",
      value1: 1
    };
    this.$api.Common.get(parms).then(res => {
      this.GSoptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    this.$api.Common.getApproval().then(res => {
      this.SPoptions = res.data.map((item, i) => {
        return {
          label: item.cValue5,
          value: item.cAttrcode,
          value1: item.cAttrvalue
        };
      });
      this.SPoptions1 = res.data.map(item => {
        return {
          label: item.cValue5,
          value: item.cAttrcode
        };
      });
    });
    // 经手人
    this.$api.User.get({ size: 9999, status:1}).then(res => {
      if (res.code == 200) {
        this.options = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uDingding,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
      }
    });
  },
  methods: {
    // 角色列表
    gitRoleTable() {
      let param = {};
      if (this.form.attrCodeParent) {
        param["attrCodeParent"] = this.form.attrCodeParent;
      }
      if (this.form.attrCode) {
        param["attrCode"] = this.form.attrCode;
      }
      param["currentPage"] = this.currentPage;
      param["size"] = this.pageSize;
      this.$api.Common.getApprovalList(param).then(res => {
        let item = res.data;
        this.TableData = item.records;
        this.currentPage = item.current;
        this.total = item.total;
      });
    },
    setname() {
      let c = "";
      let t = "";
      this.GSoptions.map(item => {
        if (this.company == item.value) c = item.label;
      });
      this.SPoptions.map(item => {
        if (this.rtype == item.value) t = item.label;
      });
      this.name = c.replace(/公司/g, "") + t+'审批';
    },
    savedata() {
      if (!this.company) return this.$message.error("请选择公司");
      if (!this.rtype) return this.$message.error("请选择单据类型");
      if (!this.users1.length) return this.$message.error("请选择审批人");
      if (!this.name) return this.$message.error("请填写审批名称");
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let tName = "";
      this.SPoptions.map(item => {
        if (item.value == this.rtype) {
          tName = item.value;
          this.rtype = item.value1;
        }
      });
      let obj = {
        cAttrcode: tName,
        cAttrcodeparent: this.company,
        cAttrvalue: this.rtype,
        cRemark: this.name,
        cValue2: this.users1.join()
      };
      if (this.users2.length) {
        obj.cValue3 = this.users2.join();
      }
      this.$api.Common.saveApproval(obj).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.error("操作失败");
        }
        this.showAddRole = false;
        this.gitRoleTable();
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
      if (m.cId) {
        this.users1 = [];
        this.users2 = [];
        this.title = "编辑审批";
        this.updateRole = m;
        this.company = m.cAttrcodeparent;
        this.name = m.cRemark;
        this.rtype = m.cAttrcode;
        this.$api.Common.getApprovals({
          type: m.cAttrcode,
          oid: m.cAttrcodeparent
        }).then(res => {
          if (res.code == 200) {
            res.data.map(item => {
              if (item.div == 1) {
                this.users1.push(item.udingding);
              }
              if (item.div == 2) {
                this.users2.push(item.udingding);
              }
            });
          }
        });
      } else {
        this.title = "添加审批";
        this.company = "";
        this.rtype = "";
        this.users1 = [];
        this.users2 = [];
        this.name = "";
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