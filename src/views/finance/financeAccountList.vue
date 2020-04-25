<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入账户名称" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="bankAccount">查询</el-button>
        <el-checkbox v-model="checked" size="mini" @change="bankAccount">显示停用</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="16" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('showbank',{})"
            v-has="1402"
          >新增</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="mini" icon="el-icon-download" v-has="383" @click="exportTable">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col>
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="bankAccountTableData"
              border
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              id="table-data"
              size="mini"
              height="600"
              header-cell-class-name="thbgc"
            >
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="showDialog('showbank',scope.row)"
                    v-has="1402"
                  >修改</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="stRowClick(scope.row)"
                    v-has="1402"
                  >{{Number(scope.row.cStatus)==0?'启用':'停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable prop="cAttrcode" label="账户编号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cValue7" label="所属公司" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cAttrvalue" label="账户名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cValue6" label="开户行名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cValue3" label="开户行账号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cValue2" label="是否收款" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cValue4" label="期初" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cRemark" label="备注" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[bankAccountTableData.length]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="bankAccountTableData.length"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="银行账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showbank"
      width="60%"
      v-if="showbank"
    >
      <AddBankAccount @addBank="addBank" :cid="cid"></AddBankAccount>
    </el-dialog>
  </div>
</template>
<script>
import AddBankAccount from "@/components/dialog/AddBankAccount";
import getDate from "../../utils/getDate";
export default {
  name: "financeAccountList",
  inject: ["reload"],
  components: {
    AddBankAccount
  },
  data() {
    return {
      form: {
        number: ""
      },
      checked: false,
      cid: 0,
      showbank: false,
      bankAccountTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      loading:false,
    };
  },
  created() {
    this.bankAccount();
  },
  methods: {
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
          `银行账户列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    bankAccount() {
      this.bankAccountTableData = [];
      let parmas = {};
      parmas.cStatus = 1;
      parmas.value1 = this.$storage.companyId;
      if (this.checked) {
        delete parmas.cStatus;
      }
      if (this.form.searchText != "") {
        parmas.attrValue = this.form.searchText;
      }
      parmas.typeCode = "YHZH";
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
    addBank(val) {
      delete val.cCtime;
      this.$api.Common.saveBank(val).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.bankAccount();
          this.showbank = false;
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    // 弹窗
    showDialog(val, val1) {
      if (val1.cId) {
        this.cid = val1.cAttrcode;
      } else {
        this.cid = "";
      }
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