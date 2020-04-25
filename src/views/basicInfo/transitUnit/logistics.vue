<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12">
        <ul class="timeWrapper" @click="setdate($event)">
          <li data-type="getYesterday">昨日</li>
          <li data-type="getToday" class="active">今日</li>
          <li data-type="getCurrWeekDays">本周</li>
          <li data-type="getLastWeekDays">上周</li>
          <li data-type="getCurrMonthDays">本月</li>
          <li data-type="getLastMonthDays">上月</li>
          <li data-type="getThreeMonthDays">近三月</li>
          <li data-type="getThisSeason">本季</li>
          <li data-type="getThisYearDays">本年</li>
        </ul>
      </el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="opendialog('showAddClient','')"
            v-has="1002"
          >新增</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button
            size="mini"
            icon="el-icon-download"
            v-has="383"
            @click="CustomerLists('xlsx')"
          >导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入名称 " v-model="form.cuName" size="mini" class="cuName"></el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.dates"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="起始日期"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.datee"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="结束日期"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="CustomerLists">查询</el-button>
        <el-checkbox v-model="checked" size="mini" @change="CustomerLists">显示停用</el-checkbox>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="3">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
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
                highlight-current
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="21">
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
              id="table-data"
              header-cell-class-name="thbgc"
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column sortable label="ID" width="70" align="center" prop="cuId"></el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="opendialog('showAddClient',scope.row)"
                    v-has="1002"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.cuStatus==1"
                    type="text"
                    size="mini"
                    @click="upRowClick(0,scope.row)"
                    v-has="1002"
                  >
                    <span class="red">停用</span>
                  </el-button>
                  <el-button
                    v-if="scope.row.cuStatus==0"
                    type="text"
                    size="mini"
                    @click="upRowClick(0,scope.row)"
                    v-has="1002"
                  >启用</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable prop="cuName" label="名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cuOidvalue" label="所属公司" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column sortable
                prop="cuBankname"
                label="开户行"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
               <el-table-column sortable
                prop="cuBankcardnum"
                label="卡号"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="cuTaxnum"
                label="税号"
                align="center"
                show-overflow-tooltip
              ></el-table-column>-->
              <el-table-column sortable prop="cuContact" label="联系人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cuMobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cuAddr" label="联系地址" align="center" show-overflow-tooltip>
                <template
                  slot-scope="scope"
                >{{`${scope.row.cuProvincevalue?scope.row.cuProvincevalue:''} ${scope.row.cuCityvalue?scope.row.cuCityvalue:''} ${scope.row.cuDistrictvalue?scope.row.cuDistrictvalue:''} ${scope.row.cuAddr?scope.row.cuAddr:''}`}}</template>
              </el-table-column>
              <el-table-column sortable prop="cuCtime" label="录入时间" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="cuRemark" label="备注" align="center" show-overflow-tooltip></el-table-column>
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
      :visible.sync="showAddClient"
      width="35%"
      style="height:660px"
    >
      <addClient @emitUserAdd="getUserAdd" :updateClient="updateClient" v-if="showAddClient"></addClient>
    </el-dialog>
    <!-- <el-dialog title="客户详情" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSeeClient" width="60%">
      <seeClient :user="user"></seeClient>
    </el-dialog>-->
    <el-dialog
      title="经手人选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
      append-to-body
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      title="来源选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectCuorigin"
      width="40%"
      append-to-body
    >
      <selectCuorigin @emitCuoriginData="getCuoriginData"></selectCuorigin>
    </el-dialog>
  </div>
</template>
<script>
import selectUser from "@/components/dialog/SelectUser";
import addClient from "@/components/dialog/AddClienta";
import getDate from "../../../utils/getDate";
import selectCuorigin from "@/components/dialog/SelectCuorigin";
export default {
  name: "logistics",
  inject: ["reload"],
  components: {
    addClient,
    selectUser,
    selectCuorigin
  },
  data() {
    return {
      pType: 1,
      checked: false,
      hackReset: false,
      oid: "",
      updateClient: {},
      user: {},
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      TableData: [],
      showSelectUser: false,
      showAddClient: false,
      showSelectCuorigin: false,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      title: "",
      form: {
        cuName: "",
        dates: "",
        datee: ""
      }
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
    //来源
    getCuoriginData(val) {
      if (val) {
        this.form.cuOrigin = val.id;
        this.form.cuOriginvalue = val.title;
      }
      this.showSelectCuorigin = false;
    },
    //经手人
    getUserData(val) {
      if (val) {
        this.form.cuHandman = val.uId;
        this.form.cuHandmanvalue = val.uName;
      }
      this.showSelectUser = false;
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.oid = data.id;
      this.CustomerLists();
    },
    //显示弹窗
    opendialog(n, m) {
      if (m.cuId) {
        this.title = "编辑";
        this.updateClient = m;
      } else {
        this.title = "新增";
        this.updateClient = {};
      }
      this.$nextTick(() => {
        this.hackReset = true;
      });
      this[n] = true;
    },
    //添加修改客户
    getUserAdd(val) {
      let params = {
        cuAddr: val.cuAddr,
        cuName: val.cuName,
        cuBankcardnum: val.cuBankcardnum,
        cuBankname: val.cuBankname,
        cuProvince: val.cuProvince,
        cuCity: val.cuCity,
        cuDistrict: val.cuDistrict,
        cuHandman: val.cuHandman,
        cuRemark: val.cuRemark,
        cuContact: val.cuContact,
        cuMobile: val.cuMobile,
        cuOid: val.cuOid,
        cuStatus: "1",
        cuDiv: val.cuDiv
      };
      if (val.cuId) {
        params["cuId"] = val.cuId;
      }
      this.$api.Customer.saveCustomerAndContact(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.CustomerLists();
        } else {
          this.$message("保存失败");
        }
      });
      this.showAddClient = false;
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
          `物流公司列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 客户列表
    CustomerLists(val) {
      let param = {
        div: 2
      };
      //是否停用
      if (this.checked === true) {
        param["status"] = "0";
      } else {
        param["status"] = "1";
      }
      //客户姓名
      if (this.form.cuName != "") {
        param["name"] = this.form.cuName;
      }
      if (this.oid != "" && this.oid != "1") {
        param["oid"] = this.oid;
      }
      if (this.form.dates) {
        param.dates = this.form.dates;
      }
      if (this.form.datee) {
        param.datee = this.form.datee;
      }
      param["currentPage"] = this.currentPage;
      param["size"] = this.pageSize;
      if (val == "xlsx") {
        param.size = this.total;
        param.currentPage = 1;
      }
      this.$api.Customer.get(param).then(res => {
        if (res.data) {
          res.data.records.map(item => {
            item.cuCtime = item.cuCtime.split(" ")[0];
          });
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
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.dates = getDate[fn]().starttime;
        this.form.datee = getDate[fn]().endtime;
        let params = {
          dates: this.form.dates.replace(new RegExp("-", "g"), ""),
          datee: this.form.datee.replace(new RegExp("-", "g"), "")
        };
        this.CustomerLists();
      }
    },
    //停用启用 客户供货商
    upRowClick(m, e) {
      this.$confirm("此操作将启用/停用，是否继续？", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let parms = {
            cuId: e.cuId
          };
          if (e.cuStatus === 1) {
            parms["cuStatus"] = 0;
            e.cuStatus = 0;
          } else {
            parms["cuStatus"] = 1;
            e.cuStatus = 1;
          }
          this.$api.Customer.update(parms).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.CustomerLists();
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
      this.CustomerLists();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.CustomerLists();
    },
    //根据状态区分颜色
    tableRowClassName({ row }) {
      if (row.cuStatus === 0) {
        return "tingshou-row";
      }
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>