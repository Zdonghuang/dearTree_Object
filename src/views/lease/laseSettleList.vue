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
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383" @click="getList('xlsx')">导出</el-button>
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
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="selectChange('rCuid',form.rCuidv)"
          @clear="clearInput('rCuid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">客户</span>
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
          placeholder="请选择签单人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanv)"
          @clear="clearInput('rHandman')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">签单人</span>
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
          v-model="form.rOidv"
          filterable
          clearable
          placeholder="请选择归属公司"
          size="small"
          @change="selectChange('rOid',form.rOidv)"
          @clear="clearInput('rOid')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">归属公司</span>
          </template>
          <el-option
            v-for="(item,index) in rOidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
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
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rItemnumparent" size="small" clearable>
          <template slot="prepend">来源订单</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="备注" v-model="form.rRemark" size="small" clearable>
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="warning" size="small" @click="formSearch">查询</el-button>
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
      height="600px"
      id="table-data"
      header-cell-class-name="thbgc"
    >
      <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
      <el-table-column  width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.rStatus!=20"
            @click="toOrderPage(scope.row)"
            v-has="372"
          >结算</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="110"
        align="center"
        show-overflow-tooltip


        property="rDate"
        label="单据日期"
      ></el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip


        property="rItemnum"
        label="单据编号"
      >
        <template slot-scope="scope">
          <span class="orderlink" @click="toOrderPage(scope.row)">{{ scope.row.rItemnum }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip


        property="rItemnum"
        label="来源订单"
      >
        <template slot-scope="scope">
          <span
            class="orderlink"
            @click="toOrderPage(scope.row,'YD')"
          >{{ scope.row.rItemnumparent }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable width="120" align="center" property="rStatus" label="单据状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rStatus | orderClass"
            size="mini"
          >{{ scope.row.rStatus | orderStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip


        property="rBillingstatus"
        label="结算状态"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.rBillingstatus | settleClass"
            size="mini"
          >{{ scope.row.rBillingstatus | settleStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" label="单据类型">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            size="mini"
            type="warning"
            v-if="scope.row.rItemnumparent.indexOf('ZLXZD')!=-1"
          >续租单</el-tag>
          <el-tag effect="dark" size="mini" v-if="scope.row.rItemnumparent.indexOf('ZLCK')!=-1">租赁单</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        
        property="rTotalprice"
        label="租金"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.rTotalprice, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="months" label="租赁月份"></el-table-column>
       <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip


        property="totalPremoney"
        label="预收款余额"
      >
        <template slot-scope="scope">
          <div
            class="tr"
            v-if="scope.row.totalPremoney"
          >{{ $PublicJS.money(scope.row.totalPremoney , 2) }}</div>
          <div class="tr" v-if="!scope.row.totalPremoney">0.0</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rGetguestv" label="获客人"></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rHandmanv" label="经手人"></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rCuidv" label="客户/加盟商"></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rWhidv" label="仓库"></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rRemark" label="备注">
        <template slot-scope="scope">
          <div class="tl">{{ scope.row.rRemark }}</div>
        </template>
      </el-table-column>
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
</template>

<script>
import getDate from "../../utils/getDate";
export default {
  name: "laseSettleList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      rOidOptions: [],
      rdGidOptions: [],
      rCuidOptions: [],
      rWhidOptions: [],
      rHandmanOptions: [],
      rStatusOptions:[
        {label:'已结算',value:'16'},
        {label:'待结算',value:'20'},
      ],
      form: {
        rCuidv: "",
        rCuid: "",
        rHandmanv: "",
        rHandman: "",
        rWhidv: "",
        rWhid: "",
        rOid: "",
        rOidv: "",
        gName: "",
        rdGid: "",
        rdGidv: "",
        rStime: "",
        rEtime: "",
        rRemark: "",
        rItemnum: "",
        rStatus: this.$route.query.status ? this.$route.query.status : "",
        rType: 74 //租赁结算单
      },
      loading: false
    };
  },
  created() {
    this.form.rStime = getDate.getToday().starttime;
    this.form.rEtime = getDate.getToday().endtime;
    if (this.$route.query.status) {
      this.form.rStime = "";
      this.form.rEtime = "";
    }
    this.getList();
    // // 客户
    // this.$api.Customer.get({ div: 16, size: 9999, auth: 1 }).then(res => {
    //   if (res.code == 200) {
    //     this.rCuidOptions = res.data.records.map(item => {
    //       return {
    //         label: item.cuName,
    //         value: item.cuId,
    //         cuadd:
    //           item.cuProvincevalue + item.cuCityvalue + item.cuDistrictvalue
    //       };
    //     });
    //   }
    // });
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
    // 签单人
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
    // 归属公司
    this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1 }).then(res => {
      if (res.code == 200) {
        this.rOidOptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      }
    });
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          div: 16,
          size: 9999,
          auth: 1,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = res.data.records.map(item => {
              return {
                label: item.cuName,
                value: item.cuId,
                cuHandman: item.cuHandman,
                cuHandmanvalue: item.cuHandmanvalue,
                cuadd:
                  item.cuProvincevalue +
                  item.cuCityvalue +
                  item.cuDistrictvalue,
                cuAddr: item.cuAddr
              };
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    // 页面跳转
    toOrderPage(val, e) {
      if (e) {
        if (e == "YD") {
          this.$router.push({
            path: "/warehouse/outbound/ZLoutboundDetail",
            query: { data: window.btoa(val.rIdparent) }
          });
        }
      } else {
        this.$router.push({
          path: "/lease/laseSettleOrder",
          query: { data: window.btoa(val.rId) }
        });
      }
    },
    // 操作
    operating(val, id) {
      let msg = "重置";
      let apiOps = "reset";

      if (val === "invalid") {
        msg = "作废";
        apiOps = "cancel";
      }

      this.$confirm("此操作将会修改单据为" + msg + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.Sale[apiOps]({ receiptId: id }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: msg + "成功!"
              });
              this.Refresh();
            } else {
              this.$message({
                type: "error",
                message: res.err
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
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
          rStime: this.form.rStime,
          rEtime: this.form.rEtime
        };
        this.getList(params);
      }
    },
    clearInput(val) {
      this.form[val] = "";
    },
    // 查询
    formSearch() {
      this.getList();
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] ="合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          !values.every(value => isNaN(value)) &&
          column.property == "rTotalprice"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
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
          `租赁结算列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 获取列表
    getList(val) {
      let params = {};
      if (val && val != "xlsx") {
        params = val;
      }
      if (this.form.rItemnum) {
        params.rItemnum = this.form.rItemnum;
      }
      if (this.form.rItemnumparent) {
        params.rItemnumparent = this.form.rItemnumparent;
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
      if (this.form.rStime) {
        params.rStime = this.form.rStime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rEtime) {
        params.rEtime = this.form.rEtime.replace(new RegExp("-", "g"), "");
      }
      if (this.form.rRemark) {
        params.rRemark = this.form.rRemark;
      }
      if (this.form.rStatus) {
        params.rStatus = this.form.rStatus;
      }
      params["rType"] = this.form.rType;
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      this.$api.Receipt.get(params).then(res => {
        if (res.data) {
          let item = res.data.records;
          this.tableData = item;
          this.currentPage = res.data.current;
          this.total = res.data.total;
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
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
    // 刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
