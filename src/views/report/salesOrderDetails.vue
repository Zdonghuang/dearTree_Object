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
          <el-button size="small" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
          <!-- <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.startDateTime"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.endDateTime"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.custId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          class="selectSlot5"
        >
          <template slot="prefix">
            <span class="prefixSlot">客户/加盟商</span>
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
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.custUserId"
          filterable
          clearable
          placeholder="请选择获客人"
          size="small"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">获客人</span>
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
          v-model="form.warehouseId"
          filterable
          clearable
          placeholder="仓库"
          size="small"
          @change="selectChange('rWhid',form.warehouseId)"
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
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.goodsFromId"
          placeholder="请选择商品来源"
          @change="selectChange('gOrigin',form.goodsFromId)"
          @clear="clearInput('gOrigin')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">商品来源</span>
          </template>
          <el-option
            v-for="item in gOriginOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.orderNum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.goodsNm" size="small" clearable>
          <template slot="prepend">商品名称</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.goodsNum" size="small" clearable>
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input-number
          style="width:100%"
          size="small"
          v-model="form.salesRatio"
          :precision="0"
          :controls="false"
          clearable
          placeholder="折扣率"
        >
        </el-input-number>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList('s')">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              id="table-data"
              height="600px"
              header-cell-class-name="thbgc"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="orderDateTime"
                label="单据日期"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="orderNum"
                :sort-method="(a,b) => sortMethod(a ,b , 'orderNum')"
                label="单据编号"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="orderTypeValue"
                label="单据类型"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="warehouseValue"
                label="仓库"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="custName"
                label="客户/加盟商"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsFromValue"
                label="商品来源"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsNm"
                label="商品名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsNum"
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsNum')"
                label="货号"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsUnitValue"
                label="单位"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsCount"
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsCount')"
                label="销售数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="goodsSalesPrice"
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsSalesPrice')"
                label="销售单价"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                width="130"
                show-overflow-tooltip
                property="goodsPrice"
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsPrice')"
                label="系统销售单价"
              ></el-table-column>

              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="salesRatio"
                :sort-method="(a,b) => sortMethod(a ,b , 'salesRatio')"
                label="折扣率"
              >
              <template slot-scope="scope">{{Math.floor(scope.row.salesRatio)}}%</template>
              </el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="orderAmount"
                :sort-method="(a,b) => sortMethod(a ,b , 'orderAmount')"
                label="金额"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="custHandmanNm"
                label="获客人"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="orderGoodsRmk"
                label="备注"
              ></el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, total]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <br />
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import moment from "moment";
export default {
  name: "salesBusinessDetail",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rCuidOptions: [],
      rHandmanOptions: [],
      rWhidOptions: [],
      gOriginOptions: [
        { label: "采购", value: "1" },
        { label: "回收", value: "2" },
        { label: "其他", value: "3" }
      ],
      form: {
        custId: "",
        rCuid: "",
        custUserId: "",
        rHandman: "",
        startDateTime: "",
        endDateTime: "",
        orderNum: "",
        rWhid: "",
        warehouseId: "",
        gOrigin: "",
        goodsNm: "",
        salesRatio: ""
      },
      loading: false,
      sumincome: 0,
      sumoutcome: 0,
      sumbeginning: 0,
      sumending: 0,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.startDateTime = getDate.getToday().starttime;
    this.form.endDateTime = getDate.getToday().endtime;
    // 获客人
    this.$api.User.get({ size: 9999, auth: 2 }).then(res => {
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
    this.getList();
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          size: 9999,
          auth: 2,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = [];
            res.data.records.map(item => {
              if (item.cuDiv != 2) {
                //过滤物流公司
                this.rCuidOptions.push({
                  label: item.cuName,
                  value: item.cuId
                });
              }
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = this.form;
      if (!this.form.rCuid) delete params.rCuid;
      if (!this.form.custId) delete params.custId;
      if (!this.form.rHandman) delete params.rHandman;
      if (!this.form.custUserId) delete params.custUserId;
      if (!this.form.rWhid) delete params.rWhid;
      if (!this.form.warehouseId) delete params.warehouseId;
      if (!this.form.orderNum) delete params.orderNum;
      if (!this.form.goodsNum) delete params.goodsNum;
      if (!this.form.gOrigin) delete params.gOrigin;
      if (!this.form.goodsFromId) delete params.goodsFromId;
      if (!this.form.goodsNm) delete params.goodsNm;
      if (!this.form.salesRatio) delete params.salesRatio;
      params.size = this.pageSize;
      params.currentPage = this.currentPage;
      if (val == "s") {
        params.currentPage = 1;
      }
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      params.startDateTime = moment(this.form.startDateTime)
        .format("YYYY-MM-DD")
        .replace(/-/g, "");
      params.endDateTime = moment(this.form.endDateTime)
        .format("YYYY-MM-DD")
        .replace(/-/g, "");
      this.$api.ReportCapital.salesOrderDetails(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.currentPage = res.data.current;
          if (res.data.records.length) {
            this.sumoutcome = res.data.records[0].sumoutcome;
            this.sumincome = res.data.records[0].sumincome;
            this.sumbeginning = res.data.records[0].sumbeginning;
            this.sumending = res.data.records[0].sumending;
          }
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        } else {
          this.$message({ message: res.err, type: "error" });
        }
      });
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
          `销售订单明细${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.startDateTime = getDate[fn]().starttime;
        this.form.endDateTime = getDate[fn]().endtime;
        this.getList("s");
      }
    },
    sortMethod(obj1, obj2, attr) {
      if (attr == "orderNum" || attr == "goodsNum") {
        const val1 = obj1[attr] ? obj1[attr].replace(/[^0-9]/gi, "") : 0;
        const val2 = obj2[attr] ? obj2[attr].replace(/[^0-9]/gi, "") : 0;
        return val1 - val2;
      }
      const val1 = obj1[attr] ? obj1[attr] : 0;
      const val2 = obj2[attr] ? obj2[attr] : 0;
      return val1 - val2;
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
        this.form[m + "vc"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    //点击第几页
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
<style>
.has-gutter td div {
  text-align: right;
}
</style>