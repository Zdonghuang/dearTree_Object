<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12" />
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-download" @click="exportTable()">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          size="small"
          placeholder="起始日期"
          value-format="yyyyMMdd"
        />
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          size="small"
          placeholder="结束日期"
          value-format="yyyyMMdd"
        />
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.customerId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
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
            <span style="float: left width:40px">{{ index+1 }}</span>
            <span style="float: left width:300px">{{ item.label }}</span>
            <!-- <span style="float: left">{{ item.cuadd }}</span> -->
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.companyId"
          placeholder="所属公司"
          size="small"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">所属公司</span>
          </template>
          <el-option
            v-for="item in GSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.customerUserId"
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
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="small" @click="getList()">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      id="table-data"
      ref="singleTable"
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      height="600px"
      :show-summary="true"
      :summary-method="getSummaries"
      header-cell-class-name="thbgc"
    >
      <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
      <el-table-column align="center" width="200" prop="orgName" label="所属公司"></el-table-column>
      <el-table-column align="center" width="180" prop="customerId" label="客户ID"></el-table-column>
      <el-table-column
        align="center"
        prop="customerName"
        label="客户名称"
        min-width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span class="undeline" @click="todetail(scope.row)">{{scope.row.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="customerUserName" label="获客人"></el-table-column>
      <el-table-column align="center" label="应收">
        <el-table-column align="right" width="150" prop="getAstagrt" label="期初应收"></el-table-column>
        <el-table-column align="right" width="150" prop="getAup" label="应收增加额"></el-table-column>
        <el-table-column align="right" width="150" prop="getAdown" label="应收减少额"></el-table-column>
        <el-table-column align="right" width="150" prop="getAsum" label="期末应收款"></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="预收">
        <el-table-column align="right" width="150" prop="getBstart" label="期初预收"></el-table-column>
        <el-table-column align="right" width="150" prop="getBup" label="预收增加额"></el-table-column>
        <el-table-column align="right" width="150" prop="getBdown" label="预收减少额"></el-table-column>
        <el-table-column align="right" width="150" prop="getBsum" label="期末预收款"></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="应付">
        <el-table-column align="right" width="150" prop="setAstart" label="期初应付"></el-table-column>
        <el-table-column align="right" width="150" prop="setAup" label="应付增加额"></el-table-column>
        <el-table-column align="right" width="150" prop="setAdown" label="应付减少额"></el-table-column>
        <el-table-column align="right" width="150" prop="setAsum" label="期末应付款"></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="预付">
        <el-table-column align="right" width="150" prop="setBstart" label="期初预付"></el-table-column>
        <el-table-column align="right" width="150" prop="setBup" label="预付增加额"></el-table-column>
        <el-table-column align="right" width="150" prop="setBdown" label="预付减少额"></el-table-column>
        <el-table-column align="right" width="150" prop="setBsum" label="期末预付款"></el-table-column>
      </el-table-column>
      <el-table-column align="center" prop="customerUserNm" label="获客人"></el-table-column>
      <el-table-column width="200" align="center" prop="orderRmk" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paginationBox">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
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
  data() {
    return {
      loading: false,
      rCuidOptions: [],
      GSoptions: [],
      rHandmanOptions: [],
      currentPage: 1,
      total: 0,
      size: 20,
      form: {
        startDate: getDate.getToday().starttime,
        endDate: getDate.getToday().endtime,
        customerId: "",
        companyId: "",
        customerUserId: ""
      },
      tableData: []
    };
  },
  created() {
    let parms = {
      typeCode: "ZZJG",
      value1: 1
    };
    this.$api.Common.get(parms).then(res => {
      this.GSoptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
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
  },
  methods: {
    getList() {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const obj = this.form;
      obj.currentPage = this.currentPage;
      obj.size = this.size;
      obj.startDate = obj.startDate.replace(/-/g, "");
      obj.endDate = obj.endDate.replace(/-/g, "");
      this.$api.ReportCustomer.getall(obj).then(res => {
        loading.close();
        this.tableData = res.data.records;
        this.total = res.data.total;
        if (!this.tableData.length) {
          this.$message.error("此客户无数据");
        }
      });
    },
    todetail(val) {
      this.$router.push({
        path: "CustomerBusiness",
        query: {
          id: window.btoa(val.customerId),
          name: val.customerName,
          startDate: window.btoa(this.form.startDate),
          endDate: window.btoa(this.form.endDate)
        }
      });
    },
    exportTable() {
      const box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      const out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `客户往来汇总${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 每页下拉显示条数
    handleSizeChange: function(size) {
      this.size = size;
      this.getList();
    },
    // 页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
.undeline {
  text-decoration: underline;
  color: rgb(56, 141, 221);
  cursor: pointer;
}
</style>
