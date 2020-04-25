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
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.sDate"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.eDate"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCuidvc"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="selectChange('rCuid',form.rCuidvc)"
          @clear="clearInput('rCuid')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">往来单位</span>
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
          v-model="form.rHandmanvc"
          filterable
          clearable
          placeholder="请选择经手人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanvc)"
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
          v-model="form.rWhidvc"
          filterable
          clearable
          placeholder="仓库"
          size="small"
          @change="selectChange('rWhid',form.rWhidvc)"
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
          v-model="form.rTypevc"
          placeholder="请选择单据类型"
          @change="selectChange('rType',form.rTypevc)"
          @clear="clearInput('rType')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">单据类型</span>
          </template>
          <el-option
            v-for="item in rTypeOptions"
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
        <el-input v-model="form.gName" size="small" clearable>
          <template slot="prepend">商品名称</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.gItemnum" size="small" clearable>
          <template slot="prepend">商品货号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList('s')" style="float:left">查询</el-button>
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
                property="rdate"
                label="单据日期"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="ritemnum"
                label="单据编号"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rtypev"
                label="单据类型"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rwhidv"
                label="仓库"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rcuid"
                label="往来单位ID"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rcuidv"
                label="往来单位名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="gid"
                label="商品ID"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="gitemnum"
                label="商品货号"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="gname"
                label="商品名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rdquantityin"
                label="待入库数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rdquantityout"
                label="待出库数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                show-overflow-tooltip
                property="rhandmanv"
                label="经手人"
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
  name: "outingIningDetail",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rCuidOptions: [],
      rWhidOptions: [],
      rHandmanOptions: [],
      rTypeOptions: [
        { label: "销售订单", value: "13" },
        { label: "销售换货出库单", value: "28" },
        { label: "报废出库单", value: "57" },
        { label: "采购退货出库单", value: "30" },
        { label: "采购换货出库单", value: "32" },
        { label: "内部调拨出库单", value: "60" },
        { label: "分公司调拨出库单", value: "46" },
        { label: "组装出库单", value: "50" },
        { label: "拆装出库单", value: "91" },
        { label: "租赁出库单", value: "73" },
        { label: "采购申请单", value: "12" },
        { label: "采购换货入库单", value: "33" },
        { label: "销售退货入库单", value: "29" },
        { label: "销售换货入库单", value: "42" },
        { label: "内部调拨入库单", value: "44" },
        { label: "分公司调拨入库单", value: "47" },
        { label: "组装入库单", value: "51" },
        { label: "拆装入库单", value: "92" },
        { label: "租赁入库单", value: "75" }
      ],
      form: {
        rCuidvc: "",
        rCuid: "",
        rHandman: "",
        rHandmanvc: "",
        sDate: "",
        eDate: "",
        rItemnum: "",
        rType: "",
        rWhid: "",
        gItemnum: "",
        gName: ""
      },
      loading: false,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.sDate = getDate.getToday().starttime;
    this.form.eDate = getDate.getToday().endtime;
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
      if (!this.form.rCuidvc) delete params.rCuidvc;
      if (!this.form.rHandman) delete params.rHandman;
      if (!this.form.rHandmanvc) delete params.rHandmanvc;
      if (!this.form.rWhid) delete params.rWhid;
      if (!this.form.rWhidvc) delete params.rWhidvc;
      if (!this.form.rType) delete params.rType;
      if (!this.form.rTypevc) delete params.rTypevc;
      if (!this.form.rItemnum) delete params.rItemnum;
      if (!this.form.gItemnum) delete params.gItemnum;
      if (!this.form.gName) delete params.gName;

      params.size = this.pageSize;
      params.currentPage = this.currentPage;
      if (val == "s") {
        params.currentPage = 1;
      }
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      if (this.form.sDate) {
        params.sDate = moment(this.form.sDate).format("YYYY-MM-DD");
      } else {
        delete params.sDate;
      }
      if (this.form.eDate) {
        params.eDate = moment(this.form.eDate).format("YYYY-MM-DD");
      } else {
        delete params.eDate;
      }
      this.$api.Stat.statdcdrmx(params)
        .then(res => {
          loading.close();
          this.tableData=[]
          if (res.code == 200) {
            res.data.records.map(item => {
            if (item.rdate) {
              item.rdate = item.rdate.split("T")[0];
            }
          });
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.currentPage = res.data.current;

            if (val == "xlsx") {
              setTimeout(() => {
                this.exportTable();
              }, 1500);
            }
          } else {
            this.$message({ message: res.err, type: "error" });
          }
        })
        .catch(error => {
          loading.close();
        });
    },
    changeCheckbox() {
      this.getList({ gNeedinstall: this.form.gNeedinstall });
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
          `待出待入明细${getDate.getToday().starttime}.xlsx`
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
        this.form.sDate = getDate[fn]().starttime;
        this.form.eDate = getDate[fn]().endtime;
        this.getList("s");
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
.el-checkbox__label {
  line-height: 22px !important;
}
</style>