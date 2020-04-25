<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入仓库名称/编号" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="WarehouseLists">查询</el-button>
        <el-checkbox v-model="checked" size="mini" @change="WarehouseLists">显示停用</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="4"></el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="opendialog('showAddWarehouse','')"
            v-has="1102"
          >新增</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button
            size="mini"
            icon="el-icon-download"
            v-has="383"
            @click="WarehouseLists('xlsx')"
          >导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">
              组织机构
              <div class="treeTools"></div>
            </div>
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
              id="table-data"
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              size="mini"
              height="600"
              header-cell-class-name="thbgc"
            >
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="opendialog('showAddWarehouse',scope.row)"
                    type="text"
                    size="mini"
                    v-has="1102"
                  >修改</el-button>
                  <!-- <el-button type="text" size="mini" @click="deRowClick(scope.row)">删除</el-button> -->
                  <el-button
                    type="text"
                    size="mini"
                    @click="stRowClick(scope.row)"
                    v-has="1102"
                  >{{Number(scope.row.whStatus) == 0 ? '启用' : '停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable
                prop="whCode"
                label="仓库编号"
                width="178"
                align="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="whName"
                label="仓库名称"
                width="200"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="whContact"
                label="联系人"
                width="200"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="whMobile"
                label="联系电话"
                width="200"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="whName"
                label="所属公司"
                width="200"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable prop="whAddr" label="地址" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column sortable
                align="center"
                prop="whAddr"
                label="备注"
                :show-overflow-tooltip="true"
              ></el-table-column>-->
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
      :visible.sync="showAddWarehouse"
      width="20%"
    >
      <addWarehouse
        v-if="showAddWarehouse"
        @emitWareAdd="WareAddhouse"
        :updateWarehose="updateWarehose"
        @close="showAddWarehouse = false"
      ></addWarehouse>
    </el-dialog>
  </div>
</template>
<script>
// import updateWarehose from "@/components/dialog/UpdateWarehose";
import getDate from "../../../utils/getDate";
import addWarehouse from "@/components/dialog/AddWarehouse";
export default {
  name: "warehouseControl",
  inject: ["reload"],
  components: {
    addWarehouse
  },
  data() {
    return {
      oid: "",
      param: [],
      TreeData: [],
      addWarehouse: [],
      updateWarehose: {},
      showAddWarehouse: false,
      hackReset: false,
      defaultProps: {
        children: "childs",
        label: "title"
      },
      checked: false,
      title: "",
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
    this.WarehouseLists();
  },
  methods: {
    // 树形菜单
    gitTree() {
      let parms = {
        typeCode: "ZZJG",
        value1: "1"
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.oid = data.id;
      this.WarehouseLists();
    },
    exportTable() {
      let box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      let out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `仓库列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 仓库列表
    WarehouseLists(val) {
      let param = {};
      if (this.form.searchText != "") {
        param["name"] = this.form.searchText;
      }
      if (this.checked != true) {
        param["status"] = 1;
      } else {
        param["status"] = 0;
      }
      if (this.oid != "" && this.oid != "1") {
        param["oid"] = this.oid;
      }
      param["currentPage"] = this.currentPage;
      param["size"] = this.pageSize;
      if (val == "xlsx") {
        param.size = this.total;
        param.currentPage = 1;
      }
      param.auth = 1;
      this.$api.Warehouse.get(param).then(res => {
        if (res.data) {
          this.TableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    //显示弹窗
    opendialog(n, m) {
      if (m.whId) {
        this.title = "仓库编辑";
        m.whOid += "";
        this.updateWarehose = m;
      } else {
        this.title = "仓库增加";
        this.updateWarehose = {};
      }
      this[n] = true;
    },
    //添加/修改
    WareAddhouse(val) {
      let param = {
        whAddr: val.whAddr,
        whCode: val.whCode,
        whName: val.whName,
        whMobile: val.whMobile,
        whContact: val.whContact,
        whOid: val.whOid
      };
      if (!val.whId) {
        this.$api.Warehouse.save(param).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.WarehouseLists();
        });
      } else {
        param["whId"] = val.whId;
        this.$api.Warehouse.update(param).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        });
      }
      this.Refresh();
      this.showAddWarehouse = false;
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
            whId: e.whId
          };
          if (e.whStatus != 1) {
            parms["whStatus"] = 1;
            e.whStatus = 1;
          } else {
            parms["whStatus"] = 0;
            e.whStatus = 0;
          }
          this.$api.Warehouse.update(parms).then(res => {
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
      this.WarehouseLists();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.WarehouseLists();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
</style>