<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      
      <el-col :xs="24" :sm="24" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="small"
            icon="el-icon-plus"
            @click="opendialog('showAddLogistics','')"
          >新增</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入物流公司名称/编号/备注 " v-model="form.searchText" size="small"></el-input>
      </el-col>
      <el-col :xs="24" :sm="14">
        <el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
        <el-checkbox v-model="checked" style="padding-left:10px" size="mini">显示停用</el-checkbox>
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
              size="small"
              height="600"
            >
              <el-table-column  type="index" width="50" align="center">
                <template slot="header">
                  <i class="fa fa-cog setting"></i>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="88" align="center"></el-table-column>
              <el-table-column  label="操作" width="300" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="opendialog('showAddLogistics',scope.row)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="upRowClick(0,scope.row)"
                  >{{Number(scope.row.cuStatus) ? '停用' : '启用' }}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable
                
                prop="fsSubjectname"
                label="内部单号"
                width="210"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="fsSubjectname"
                label="标题"
                width="150"
                align="center"
                
              ></el-table-column>
              <el-table-column sortable
                prop="fsSubjectname"
                label="费用科目"
                width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="fsAmount"
                label="金额"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="fsSubjectname"
                label="状态"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="fsSubjectname"
                label="关联单据"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="fsCtime"
                label="时间"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip></el-table-column>
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
    <el-dialog title="新增编辑物流公司" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showAddLogistics" width="60%">
      <addLogistics @emitLogisticsAdd="getLogisticsAdd" :UpdateLogisticsForm="UpdateLogisticsForm"></addLogistics>
    </el-dialog>
  </div>
</template>
<script>
import addLogistics from "@/components/dialog/AddLogistics";
export default {
  inject: ["reload"],
  components: {
    addLogistics
  },
  data() {
    return {
      UpdateLogisticsForm: [],
      checked: false,
      showAddLogistics: false,
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      idList:[],
      form: {
        options: []
      }
    };
  },
  created() {
    this.CustomerLists();
  },
  methods: {
    //显示弹窗
    opendialog(n, m) {
      if (m != "") {
        this.UpdateLogisticsForm = m;
      } else {
        this.UpdateLogisticsForm = {};
      }
      this[n] = true;
    },
    //添加修改物流公司
    getLogisticsAdd(val) {
      let params = {
        cuAddr: val.cuAddr,
        cuName: val.cuName,
        cuRemark: val.cuRemark,
        cuStatus: "1",
        cuDiv: "001"
      };
      if (val.id) {
        params["cuId"] = val.id;
        this.$api.Customer.update(params).then(res => {
          if (res.code == "200") {
            this.CustomerLists();
          }
        });
      } else {
        this.$api.Customer.save(params).then(res => {
          if (res.code == "200") {
            this.CustomerLists();
          }
        });
      }

      this.showAddLogistics = false;
    },
    //费用列表
    CustomerLists() {
      let param = {
        div: "1"
      };
      if (this.form.searchText != "") {
        param["name"] = this.form.searchText;
      }
      // param["currentPage"] = this.currentPage;
      // param["size"] = this.pageSize;
      this.$api.Financialsettle.get(param).then(res => {
        if (res.data) {
          console.log(res);
          this.TableData = res.data;
          // this.currentPage = res.data.current;
          // this.pageSize = res.data.size;
          // this.total = res.data.total;
        }
      });
    },
    //停用启用
    upRowClick(m, e) {
      this.$confirm("此操作将启用/停用，是否继续？", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let parms = {
            cuId: e.id
          };
          if (e.cuStatus === 1) {
            parms["cuStatus"] = 0;
            e.cuStatus = 0;
          } else {
            parms["cuStatus"] = 1;
            e.cuStatus = 1;
          }
          this.$api.Customer.update(parms).then(res => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
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
      this.CustomerLists();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.CustomerLists();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
</style>