<template>
  <div>
    <el-row :gutter="20" class="tagstyle">
      <el-col :xs="12" :sm="12" style="text-align:right">
        <span :class="classN1" @click="showdata('classN1')">按单据</span>
      </el-col>
      <el-col :xs="12" :sm="12">
        <span :class="classN2" @click="showdata('classN2')">按明细</span>
      </el-col>
    </el-row>
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
            @click="$router.push('/recover/recoverOrder')"
            v-has="2011"
          >新增</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
          <!-- <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.rStime"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.rEtime"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCuidv"
          filterable
          clearable
          placeholder="请选择供应商"
          size="small"
          @change="selectChange('rCuid',form.rCuidv)"
          @clear="clearInput('rCuid')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">供应商</span>
          </template>
          <el-option
            v-for="(item,index) in rCuidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:300px">{{ item.label }}</span>
            <!-- <span style="float: left;">{{ item.cuadd }}</span> -->
          </el-option>
        </el-select>
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
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="备注" v-model="form.rRemark" size="small" clearable>
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-button type="warning" size="small" @click="formSearch" style="float:left">查询</el-button>
        <div class="s_box">
          <el-checkbox
            v-model="form.includecaogao"
            label="显示草稿单据"
            border
            size="mini"
            true-label="1"
            false-label="0"
            @change="changeCheckbox('0')"
          ></el-checkbox>
          <el-checkbox
            v-model="form.includezuofei"
            label="显示作废单据"
            border
            size="mini"
            true-label="1"
            false-label="0"
            @change="changeCheckbox('1')"
          ></el-checkbox>
        </div>
      </el-col>
    </el-row>
    <div v-if="show">
      <el-table
        :data="tableData"
        id="table-data"
        border
        style="width: 100%"
        size="mini"
        :show-summary="true"
        :summary-method="getSummaries"
        sum-text="合计:"
        height="600px"
        header-cell-class-name="thbgc"
      >
        <el-table-column width="55" align="center" type="index"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              :disabled="disable(scope.row)"
              @click="createshop(scope.row)"
              v-has="2011"
            >生成商品结算单</el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="disable(scope.row)"
              @click="stopject(scope.row)"
              v-has="2011"
            >项目完成</el-button>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="110"
          align="center"
          show-overflow-tooltip
          property="rDate"
          label="单据日期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.rDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="180"
          align="center"
          show-overflow-tooltip
          property="rItemnum"
          label="单据编号"
        >
          <template slot-scope="scope">
            <span
              class="orderlink"
              @click="toOrderPage(scope.row,'/recover/recoverOrder')"
            >{{ scope.row.rItemnum }}</span>
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
        <el-table-column
          sortable
          width="100"
          align="center"
          show-overflow-tooltip
          property="rApprovalstatus"
          label="审核状态"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.rApprovalstatus | ApprovalClass"
              size="mini"
            >{{ scope.row.rApprovalstatus | ApprovalStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="200"
          align="center"
          show-overflow-tooltip
          property="rCuidv"
          label="回收供应商"
        >
          <template slot-scope="scope">
            <div class="tl">{{ scope.row.rCuidv }}</div>
          </template>
        </el-table-column>
        <el-table-column sortable property="rSumstr" width="80" label="回收数量" align="center">
          <template slot-scope="scope">
            <span
              v-for="(item,i) in scope.row.rSumstr.split(',')"
              :key="i"
            >{{item.split(':')[0]==2?item.split(':')[1]:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="100"
          align="center"
          show-overflow-tooltip
          property="rTotalprice"
          label="本单总金额"
        >
          <template slot-scope="scope">
            <div class="tr">{{ scope.row.rTotalprice }}</div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="150"
          align="center"
          show-overflow-tooltip
          property="totalPremoneyf"
          label="预付款余额"
        >
          <template slot-scope="scope">
            <div
              class="tr"
              v-if="scope.row.totalPremoneyf"
            >{{ $PublicJS.money(scope.row.totalPremoneyf , 2) }}</div>
            <div class="tr" v-if="!scope.row.totalPremoneyf">0.0</div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="100"
          align="center"
          show-overflow-tooltip
          property="rHandmanv"
          label="经手人"
        ></el-table-column>
        <el-table-column
          sortable
          width="150"
          align="center"
          show-overflow-tooltip
          property="rWhidv"
          label="仓库"
        ></el-table-column>
        <el-table-column
          sortable
          min-width="150"
          align="center"
          show-overflow-tooltip
          property="rRemark"
          label="备注"
        >
          <template slot-scope="scope">
            <div class="tl">{{ scope.row.rRemark }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="!show">
      <el-table
        :data="tableData1"
        border
        style="width: 100%"
        size="mini"
        sum-text="合计:"
        height="600px"
      >
        <el-table-column width="55" align="center" type="index"></el-table-column>
        <el-table-column
          sortable
          width="110"
          align="center"
          show-overflow-tooltip
          property="R_DATE"
          label="单据日期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.R_DATE }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="180"
          align="center"
          show-overflow-tooltip
          property="R_ITEMNUM"
          label="单据编号"
        >
          <template slot-scope="scope">
            <span
              class="orderlink"
              @click="toOrderPage(scope.row,'/recover/recoverOrder')"
            >{{ scope.row.R_ITEMNUM }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable width="100" align="center" property="R_STATUS" label="单据状态">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type=" scope.row.R_STATUS | orderClass"
              size="mini"
            >{{ scope.row.R_STATUS | orderStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          width="100"
          align="center"
          show-overflow-tooltip
          property="R_APPROVALSTATUS"
          label="审核状态"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.R_APPROVALSTATUS | ApprovalClass"
              size="mini"
            >{{ scope.row.R_APPROVALSTATUS | ApprovalStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="R_WHIDV" label="入库仓库">
          <template slot-scope="scope">
            <span>{{ scope.row.R_WHIDV }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="R_CUIDV" label="客户">
          <template slot-scope="scope">
            <span>{{ scope.row.R_CUIDV }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="G_NAME" label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.G_NAME }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="G_ITEMNUM" label="货号">
          <template slot-scope="scope">
            <span>{{ scope.row.G_ITEMNUM }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="G_SPEC" label="规格">
          <template slot-scope="scope">
            <span>{{ scope.row.G_SPEC }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="RD_QUANTITY" label="数量">
          <template slot-scope="scope">
            <span>{{ scope.row.RD_QUANTITY }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="G_UNITV" label="单位">
          <template slot-scope="scope">
            <span>{{ scope.row.G_UNITV }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="RD_SELLINGPRICE" label="单价">
          <template slot-scope="scope">
            <span>{{ scope.row.RD_SELLINGPRICE }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property label="总金额">
          <template slot-scope="scope">
            <span>{{ scope.row.RD_SELLINGPRICE * scope.row.RD_QUANTITY }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="R_HANDMANV" label="经手人">
          <template slot-scope="scope">
            <span>{{ scope.row.R_HANDMANV }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="R_REMARK" label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.R_REMARK }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
import getDate from "../../utils/getDate";
export default {
  name: "recoverOrderList",
  inject: ["reload"],
  data() {
    return {
      show: true,
      classN1: "ac",
      classN2: "",
      tableData: [],
      tableData1: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      rCuidOptions: [],
      rWhidOptions: [],
      rHandmanOptions: [],
      form: {
        includecaogao: 0,
        includezuofei: 0,
        rCuidv: "",
        rCuid: "",
        rHandmanv: "",
        rHandman: "",
        rWhidv: "",
        rWhid: "",
        rStime: "",
        rEtime: "",
        rRemark: "",
        rItemnum: "",
        rType: 2
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
    this.setType();
    // 供应商
    this.$api.Customer.get({ div: 64, size: 9999 }).then(res => {
      if (res.code == 200) {
        this.rCuidOptions = res.data.records.map(item => {
          return {
            label: item.cuName,
            value: item.cuId,
            cuadd:
              item.cuProvincevalue + item.cuCityvalue + item.cuDistrictvalue
          };
        });
      }
    });
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
    this.$api.User.get({ size: 9999, auth: 1, status: 1 }).then(res => {
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
          `回收报价单列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    toOrderPage(b, url) {
      if (b) {
        this.$router.push({
          path: url,
          query: { data: window.btoa(b.rId ? b.rId : b.R_ID) }
        });
      } else {
        return b;
      }
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
    // 获取列表
    getList(val) {
      let params = {};
      if (!this.form.rItemnum) delete this.form.rItemnum;
      if (!this.form.rCuid) delete this.form.rCuid;
      if (!this.form.rHandman) delete this.form.rHandman;
      if (!this.form.rWhid) delete this.form.rWhid;
      if (!this.form.rStime) delete this.form.rStime;
      if (!this.form.rEtime) delete this.form.rEtime;
      if (!this.form.rRemark) delete this.form.rRemark;
      params = this.form;
      delete this.form.rHandmanv;
      delete this.form.rCuidv;
      delete this.form.rWhidv;
      params["size"] = this.pageSize;
      params["currentPage"] = this.currentPage;
      if (val == "xlsx") {
        params["size"] = this.total;
        params["currentPage"] = 1;
      }
      params["rStime"] = this.form.rStime.replace(/\-/g, "");
      params["rEtime"] = this.form.rEtime.replace(/\-/g, "");
      this.$api.Receipt.get(params).then(res => {
        if (res.data) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        if (val == "xlsx") {
          setTimeout(() => {
            this.exportTable();
          }, 1500);
        }
      });
    },
    showdata(n) {
      if (n == "classN1") {
        this.classN1 = "ac";
        this.classN2 = "";
        this.show = true;
      } else {
        this.classN1 = "";
        this.classN2 = "ac";
        this.getList();
        this.show = false;
      }
    },
    // 查询
    formSearch() {
      this.getList();
    },
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.rStime = getDate[fn]().starttime;
        this.form.rEtime = getDate[fn]().endtime;
        let params = {
          rStime: this.form.rStime.replace(/\-/g, ""),
          rEtime: this.form.rEtime.replace(/\-/g, "")
        };
        this.getList(params);
      }
    },
    setType(e) {
      this.getList();
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
    disable(v) {
      if (
        v.rStatus == 19 ||
        v.rStatus == 31 ||
        v.rStatus == 30 ||
        v.rStatus == 2 ||
        v.rStatus == 4
      ) {
        return true;
      }
    },
    createshop(v) {
      this.$confirm("此操作将生成一个新的回收商品结算单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "请稍等",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$api.Receipt.copyReceipt({
            rid: v.rId,
            rstatus: 20,
            rtype: 43
          }).then(res => {
            loading.close();
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.getList();
            } else {
              this.$message.error(res.err);
            }
          });
        })
        .catch(() => {});
    },
    stopject(v) {
      this.$confirm("此操作会将整个项目完结, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "请稍等",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$api.Receipt.Status({ rid: v.rId, statusid: 19 }).then(res => {
            loading.close();
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.getList();
            } else {
              this.$message.error(res.err);
            }
          });
        })
        .catch(() => {});
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
