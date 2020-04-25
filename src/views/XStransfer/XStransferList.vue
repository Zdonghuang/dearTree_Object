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
            size="small"
            type="warning"
            icon="el-icon-plus"
            @click="toOrderPage(0)"
            v-has="363"
          >新增</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383" @click="getList('xlsx')">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rStime"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-date-picker
          v-model="form.rEtime"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rWhidv"
          filterable
          clearable
          placeholder="请选择仓库"
          size="small"
          @change="selectChange('rWhid',form.rWhidv)"
          @clear="clearInput('rWhid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">仓库</span>
          </template>
          <el-option
            v-for="(item,index) in rWhidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.whCode }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rHandmanv"
          filterable
          clearable
          placeholder="请选择经手人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanv)"
          @clear="clearInput('rHandman')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">经手人</span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rStatusv"
          filterable
          clearable
          placeholder="请选择单据状态"
          size="small"
          @change="selectChange('rStatus',form.rStatusv)"
          @clear="clearInput('rStatus')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">单据状态</span>
          </template>
          <el-option
            v-for="item in rStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rApprovalstatusv"
          filterable
          clearable
          placeholder="请选择审核状态"
          size="small"
          @change="selectChange('rApprovalstatus',form.rApprovalstatusv)"
          @clear="clearInput('rApprovalstatus')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">审核状态</span>
          </template>
          <el-option
            v-for="item in rApprovalstatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="备注" v-model="form.rRemark" size="small" clearable>
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
      <el-col :sm="2" :xs="24">
        <el-button type="warning" size="small" @click="formSearch">查询</el-button>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-checkbox
          v-model="form.includecaogao"
          label="显示草稿单据"
          border
          size="mini"
          true-label="1"
          false-label="0"
          @change="changeCheckbox('0')"
        ></el-checkbox>
        <!-- <el-checkbox
            v-model="form.includezuofei"
            label="显示作废单据"
            border
            size="mini"
            true-label="1"
            false-label="0"
            @change="changeCheckbox('1')"
        ></el-checkbox>-->
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      id="table-data"
      height="600px"
      header-cell-class-name="thbgc"
    >
      <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
      <el-table-column
        sortable
        width="110"
        align="center"
        show-overflow-tooltip
        property="rDate"
        label="单据日期"
      ></el-table-column>
      <el-table-column
        sortable
        width="180"
        align="center"
        show-overflow-tooltip
        property="rItemnum"
        label="单据编号"
      >
        <template slot-scope="scope">
          <span class="orderlink" @click="toOrderPage(scope.row)">{{ scope.row.rItemnum }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable width="100" align="center" property="rStatus" label="单据状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rStatus | orderClass"
            size="mini"
          >{{ scope.row.rStatus | orderStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="rApprovalstatus" label="审核状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rApprovalstatus | ApprovalClass"
            size="mini"
          >{{ scope.row.rApprovalstatus | ApprovalStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable property="rWhidv" width="200" align="center" label="调出仓库"></el-table-column>
      <el-table-column sortable property="rWhidtransferv" width="200" align="center" label="调入仓库"></el-table-column>
      <el-table-column sortable property="rSumstr" label="总数量" align="center">
        <template slot-scope="scope">{{ scope.row.rSumstr.split(':')[1] }}</template>
      </el-table-column>
      <el-table-column sortable property="rTotalprice" align="center" label="调拨金额"></el-table-column>
      <el-table-column sortable property="rHandmanv" align="center" label="经手人"></el-table-column>
      <el-table-column sortable property="rRemark" align="center" label="单据备注"></el-table-column>
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
        :page-sizes="[2, 20, 30, 40,50,60,70,80,90,100,total]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
export default {
  name: "XStransferList",
  inject: ["reload"],
  data() {
    return {
      rWhidOptions: [],
      rHandmanOptions: [],
      rStatusOptions: [
        { label: "初始单据", value: "1" },
        { label: "已结算", value: "16" },
        { label: "单据完结", value: "19" }
      ],
      rApprovalstatusOptions: [
        { label: "无审批", value: "0" },
        { label: "审核中", value: "2" },
        { label: "审核通过", value: "3" },
        { label: "审核拒绝", value: "4" }
      ],
      // url: this.$route.path.split("/")[3] == "transferList" ? true : false,
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      form: {
        rHandmanv: "",
        rHandman: "",
        rWhidv: "",
        rWhid: "",
        rStime: "",
        rEtime: "",
        rRemark: "",
        rItemnum: "",
        rType: 0
      }
    };
  },
  created() {
    this.form.rStime = getDate.getToday().starttime;
    this.form.rEtime = getDate.getToday().endtime;
    if (this.$route.query.status) {
      this.form.rStime = "";
      this.form.rEtime = "";
    }
    this.form.rType = this.url ? 59 : 45;
    this.getList();
    // 仓库
    this.$api.Warehouse.get({ auth: 1, size: 9999 }).then(res => {
      if (res.code == 200) {
        this.rWhidOptions = res.data.records.map(item => {
          return {
            label: item.whName,
            value: item.whId,
            whCode: item.whCode
          };
        });
      }
    });
    // 经手人
    this.$api.User.get({ size: 9999, auth: 1, status:1 }).then(res => {
      if (res.code == 200) {
        this.rHandmanOptions = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uId,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
      }
    });
  },
  methods: {
    toOrderPage(val) {
      let path = "";
      path = "/XStransfer/XStransferApplication";
      if (val) {
        this.$router.push({
          path: path,
          query: { data: window.btoa(val.rId) }
        });
      } else {
        this.$router.push(path);
      }
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.rStime = getDate[fn]().starttime;
        this.form.rEtime = getDate[fn]().endtime;
        let params = {
          rStime: this.form.rStime.replace(new RegExp("-", "g"), ""),
          rEtime: this.form.rEtime.replace(new RegExp("-", "g"), "")
        };
        this.getList(params);
      }
    },
    clearInput(val) {
      this.form[val] = "";
    },
    selectChange(m, val) {
      if (val) {
        let obj = {};
        obj = this[m + "Options"].find(item => {
          return item.value === val; //筛选出匹配数据
        });
        this.form[m + "v"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    // 查询
    formSearch() {
      let params = {};
      if (this.form.rItemnum) {
        params.rItemnum = this.form.rItemnum;
      }
      if (this.form.rCuid) {
        params.rCuid = this.form.rCuid;
      }
      if (this.form.rHandman) {
        params.rHandman = this.form.rHandman;
      }
      if (this.form.rWhid) {
        params.rWhid = this.form.rWhid;
      }
      if (this.form.rdGid) {
        params.rdGid = this.form.rdGid;
      }
      if (this.form.rStime) {
        params.rStime = this.form.rStime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rEtime) {
        params.rEtime = this.form.rEtime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rRemark) {
        params.rRemark = this.form.rRemark;
      }
      this.getList(params);
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          !values.every(value => isNaN(value)) &&
          column.property == "rTotalprice"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    changeCheckbox(val) {
      let params = {};
      if (val) {
        params.includecaogao = this.form.includecaogao;
      } else {
        params.includezuofei = this.form.includezuofei;
      }
      this.getList(params);
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
          `分公司调拨列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取销售订单列表
    getList(val) {
      let params = {};
      if (val && val != "xlsx") {
        params = val;
      }
      if (this.form.rItemnum) {
        params.rItemnum = this.form.rItemnum;
      }
      if (this.form.rCuid) {
        params.rCuid = this.form.rCuid;
      }
      if (this.form.rHandman) {
        params.rHandman = this.form.rHandman;
      }
      if (this.form.rWhid) {
        params.rWhid = this.form.rWhid;
      }
      if (this.form.rOid) {
        params.rOid = this.form.rOid;
      }
      if (this.form.rStatus) {
        params.rStatus = this.form.rStatus;
      }
      if (this.form.rApprovalstatus) {
        params.rApprovalstatus = this.form.rApprovalstatus;
      }
      if (this.form.rStime) {
        params.rStime = this.form.rStime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rEtime) {
        params.rEtime = this.form.rEtime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rRemark) {
        params.rRemark = this.form.rRemark;
      }
      params["rType"] = this.form.rType;
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      if (val == "xlsx") {
        params.size = this.total;
        params.currentPage = 1;
      }
      this.$api.Receipt.get(params).then(res => {
        // if (res.data) {
        //   let item = res.data.records;
        //   this.tableData = item;
        //   this.currentPage = res.data.current;
        //   this.total = res.data.total;
        // }
        if (res.data) {
          this.tableData = [];
          this.currentPage = res.data.current;
          // 成本金额权限设置
          let vhas = this.$storage.permissions;
          if (vhas.indexOf("384") != -1) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          } else {
            res.data.records.map(item => {
              if (item.rOid == this.$storage.companyId) {
                this.tableData.push(item);
              }
            });
            if (res.data.pages == 1) {
              this.total = this.tableData.length;
            } else {
              this.total = res.data.total - (res.data.size - this.tableData.length);
            }
          }

          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },

    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
