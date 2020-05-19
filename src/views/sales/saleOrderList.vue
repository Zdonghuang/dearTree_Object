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
            @click="toAddOrder('/sales/saleOrder')"
            v-has="1019"
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
      <!-- <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rdGidv"
          filterable
          clearable
          placeholder="请选择商品"
          size="small"
          @change="selectChange('rdGid',form.rdGidv)"
          @clear="clearInput('rdGid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">商品</span>
          </template>
          <el-option
            v-for="(item,index) in rdGidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:200px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.gItemnum }}</span>
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :sm="4" :xs="24">
        <el-select
          size="small"
          filterable
          clearable
          v-model="form.outboundStatus"
          placeholder="请选择发货状态"
          @change="selectChange('outboundStatus',form.outboundStatus)"
          @clear="clearInput('outboundStatus')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">发货状态</span>
          </template>
          <el-option
            v-for="item in outboundStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.billStatus"
          placeholder="请选择结算状态"
          @change="selectChange('billStatus',form.billStatus)"
          @clear="clearInput('billStatus')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">结算状态</span>
          </template>
          <el-option
            v-for="item in billStatusOptions"
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
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      id="table-data"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      height="600px"
      header-cell-class-name="thbgc"
    >
      <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
      <el-table-column width="180" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.rStatus!=30"
            @click="toOrderPage(scope.row)"
            v-has="1019"
          >修改</el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.rStatus!=1"
            @click="toOrderPage(scope.row,'BHD')"
            v-has="1019"
          >备货</el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.distributionStatus!=19 || scope.row.totalQuantity<=scope.row.outboundNum"
            @click="toOrderPage(scope.row,'SHD')"
            v-has="1019"
          >发货</el-button>
          <el-button size="mini" type="text" v-has="1019" @click="toOrderPage(scope.row,'YSK')">预收</el-button>
        </template>
      </el-table-column>
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
      <el-table-column sortable width="100" align="center" property="rStatus" label="单据状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type=" scope.row.rStatus | orderClass"
            size="mini"
            v-if="scope.row.rStatus!=19"
          >{{ scope.row.rStatus | orderStatus }}</el-tag>
          <el-tag effect="dark" type="success" size="mini" v-if="scope.row.rStatus==19">报价完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="rStatus" label="发货状态">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            type="success"
            size="mini"
            v-if="scope.row.outboundNum==scope.row.totalQuantity"
          >发货完成</el-tag>
          <el-tag
            effect="dark"
            size="mini"
            v-if="!scope.row.outboundNum && scope.row.distributionStatus==19"
          >待发货</el-tag>
          <el-tag
            effect="dark"
            size="mini"
            v-if="!scope.row.outboundNum && scope.row.distributionStatus!=19"
          >待备货</el-tag>
          <el-tag
            effect="dark"
            type="warning"
            size="mini"
            v-if="scope.row.outboundNum>0 && scope.row.outboundNum<scope.row.totalQuantity"
          >部分发货</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="rBillingstatus"
        label="结算状态"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            type="success"
            size="mini"
            v-if="scope.row.rTotalprice - scope.row.settleAmount<0 || scope.row.rTotalprice - scope.row.settleAmount==0"
          >已结算</el-tag>
          <el-tag
            effect="dark"
            type="danger"
            size="mini"
            v-if="scope.row.rTotalprice - scope.row.settleAmount>0"
          >未结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="rTotalprice"
        label="本单总金额"
      >
        <template slot-scope="scope">
          <div class="tr">{{ $PublicJS.money(scope.row.rTotalprice, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        sortable
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
      <!-- <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="settleAmount"
        label="待结金额"
      >
        <template slot-scope="scope">
          <div
            class="tr"
            v-if="scope.row.rTotalprice - scope.row.settleAmount<0 || scope.row.rTotalprice - scope.row.settleAmount==0"
          >0.00</div>
          <div
            class="tr"
            v-if="scope.row.rTotalprice - scope.row.settleAmount>0"
          >{{ $PublicJS.money(scope.row.totalPremoney - scope.row.settleAmount , 2) }}</div>
        </template>
      </el-table-column>-->
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="rCuidv"
        label="客户/加盟商"
      ></el-table-column>
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="custFromValue"
        label="客户来源"
      ></el-table-column>
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="custTypeValue"
        label="客户分类"
      ></el-table-column>
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="rGetguestv"
        label="获客人"
      ></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rWhidv" label="仓库"></el-table-column>
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="rHandmanv"
        label="签单人"
      ></el-table-column>
      <el-table-column
        sortable
        align="center"
        show-overflow-tooltip
        property="rHandmanv"
        label="制单人"
      ></el-table-column>
      <el-table-column sortable align="center" show-overflow-tooltip property="rOidv" label="归属公司"></el-table-column>
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
      billStatusOptions: [
        { label: "已结算", value: "1" },
        { label: "未结算", value: "2" }
      ],
      outboundStatusOptions: [
        { label: "发货完成", value: "1" },
        { label: "部分发货", value: "2" },
        { label: "待发货", value: "3" }
      ],
      checkList: [],
      form: {
        outboundStatus: "",
        billStatus: "",
        includecaogao: 0,
        includezuofei: 0,
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
        rType: 13 //销售报价单
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
    this.$api.User.get({ size: 9999, auth: 1}).then(res => {
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
    // 商品
    // this.$api.Goods.get({ size: 9999, gstatus: 1, havecanout: 1 }).then(res => {
    //   if (res.code == 200) {
    //   console.log(res.data.records)
    //     this.rdGidOptions = res.data.records.map(item => {
    //       return {
    //         label: item.gName,
    //         value: item.gId,
    //         gItemnum: item.gItemnum
    //       };
    //     });
    //   }
    // });
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
        if (e == "BHD") {
          this.$confirm("此操作将生成备货单, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$api.Sale.createPHD({ receiptId: val.rId }).then(res => {
                if (res.code === 200) {
                  this.$message({ message: "生成备货单成功", type: "success" });
                  this.reload();
                } else {
                  this.$message(res.err);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作"
              });
            });
        }
        if (e == "SHD") {
          this.$router.push({
            path: "/sales/saleSHorder",
            query: { data: window.btoa(val.rId) }
          });
        }
        if (e == "YSK") {
          this.$router.push({
            path: "/financeAdd",
            query: { ID: val.rCuid, rid: val.rId }
          });
        }
      } else {
        this.$router.push({
          path: "/sales/saleOrder",
          query: { data: window.btoa(val.rId) }
        });
      }
    },

    toAddOrder(paths) {
      sessionStorage.setItem("salesKeepAlive", "salesKeepAlive");
      this.$router.push(paths);
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
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property == "rTotalprice") ||
          column.property == "settleAmount"
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
          `销售订单列表${getDate.getToday().starttime}.xlsx`
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
      if (this.form.includecaogao) {
        params.includecaogao = this.form.includecaogao;
      }
      if (this.form.includezuofei) {
        params.includezuofei = this.form.includezuofei;
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
      if (this.form.outboundStatus) {
        params.outboundStatus = this.form.outboundStatus;
      }
      if (this.form.billStatus) {
        params.billStatus = this.form.billStatus;
      }
      params["rType"] = this.form.rType;
      params["currentPage"] = this.currentPage;
      params["size"] = this.pageSize;
      if (val == "xlsx") {
        params.size = this.total;
        params.currentPage = 1;
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
