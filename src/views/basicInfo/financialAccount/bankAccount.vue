<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入科目名称" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="bankAccount">查询</el-button>
        <el-checkbox v-model="checked" size="mini" @change="bankAccount">显示停用</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="16" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('showAddGoods')"
          >新增</el-button> -->
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="mini" icon="el-icon-printer">打印</el-button>
          <el-button size="mini" icon="el-icon-download">导出</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col>
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="bankAccountTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              border
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              size="mini"
              height="600"
              header-cell-class-name="thbgc"
            >
              <el-table-column label="序号" type="index" width="55" align="center" ></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="stRowClick(scope.row)"
                    v-had='1502'
                  >{{Number(scope.row.cStatus)==0?'启用':'停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable
                prop="cAttrcode"
                label="科目编号"
                width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cAttrvalue"
                label="科目名称"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cTypename"
                label="账户类型"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cTypename"
                label="开户行"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cTypename"
                label="账号"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cTypename"
                label="联系人"
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
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="bankAccountTableData.length"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  data() {
    return {
      form: {
        number: ""
      },
      checked: false,
      bankAccountTableData: [],
      currentPage: 1, //初始页
      pageSize: 20 //每页的数据
    };
  },
  created() {
    this.bankAccount();
  },
  methods: {
    bankAccount() {
      this.bankAccountTableData = [];
      let parmas = {};
      if (this.checked === false) {
        parmas["cStatus"] = 1;
      } else {
        parmas["cStatus"] = 0;
      }
      if (this.form.searchText != "") {
        parmas["attrValue"] = this.form.searchText;
      }
      parmas["typeCode"] = "YHZH";
      this.$api.Common.get(parmas).then(res => {
        this.bankAccountTableData = res.data;
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
              this.bankAccount();
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
     // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
</style>