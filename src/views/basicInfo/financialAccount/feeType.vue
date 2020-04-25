<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="24" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button type="warning" size="mini" icon="el-icon-plus">新增费用</el-button> -->
          <!-- <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="opendialog('showAddGoods','')"
          >新增</el-button> -->
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button
            size="mini"
            icon="el-icon-download"
            v-has="383"
            @click="exportTable"
          >导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="bankAccountTableData"
              border
              highlight-current-row
              size="mini"
              @row-dblclick="rowDBLclick"
              @row-click="rowclick"
              @header-click="headerclick"
              height="600"
              id="table-data"
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
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="stRowClick(scope.row)"
                    :disabled="scope.row.cValue1==0?false:true"
                    v-has='1502'
                  >{{Number(scope.row.cStatus) == 0 ? '启用' : '停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable
                prop="cAttrcode"
                label="科目编号"
                width="200"
                align="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cAttrvalue"
                label="科目名称"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cAttrvalue"
                label="账户"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cAttrvalue"
                label="账号"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cAttrvalue"
                label="所属公司"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="bankAccountTableData.length"
                :page-sizes="[bankAccountTableData.length]"
                layout="total, sizes, prev, pager, next, jumper"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      thisRowData: "",
      TreeData: [],
      oid: "",
      defaultProps: {
        children: "childs",
        label: "title"
      },
      form: {
        number: ""
      },
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
      this.bankAccount();
    },
    headerclick(column, event) {},
    backUP(val) {
      if (this.pcode.length > 0) {
        let parmas = {
          attrCodeParent: this.pcode.pop()
        };
        this.bankAccount(parmas);
      }
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
          `财务科目列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    bankAccount(val) {
      this.bankAccountTableData = [];
      let parmas = {};
      if (val) {
        parmas = val;
      } else {
        parmas["attrCodeParent"] = 0;
      }
      if (this.oid != "" && this.oid != "1") {
        parmas["oid"] = this.oid;
      }
      parmas["typeCode"] = "CWKM";
      this.$api.Common.get(parmas).then(res => {
        this.bankAccountTableData = res.data;
      });
    },
    rowclick(row, column, event) {
      this.thisRowData = row;
    },
    rowDBLclick(row, column, event) {
      if (row.cValue1 != 0) {
        this.pcode.push(row.cAttrcodeparent);
        let parmas = {
          attrCodeParent: row.cAttrcode
        };
        this.bankAccount(parmas);
      }
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
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
            cId: e.cId
          };
          if (e.cStatus != 1) {
            parms["cStatus"] = 1;
            e.cStatus = 1;
          } else {
            parms["cStatus"] = 0;
            e.cStatus = 0;
          }
          this.$api.Common.update(parms).then(res => {
            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "操作成功"
              });
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
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
</style>