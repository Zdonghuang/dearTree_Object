<template>
  <div v-if="form.rOid == $storage.companyId">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ orderBH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">分公司调拨出库单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="发货仓库" v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">发货仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="经手人" v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      height="300px"
      show-summary
      :summary-method="getSummaries"
      sum-text="合计:"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="55" align="center" property="index" >
        <template slot="header">
          <i class="fa fa-cog setting" @click="showtable=true"></i>
        </template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gItemnum"
        label="货号"
      ></el-table-column>
      <el-table-column sortable width="100" align="center" property="gItemnum" label="货号"></el-table-column>
      <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
        <template slot-scope="scope" v-if="scope.row.gImage">
          <el-popover
            placement="right"
            trigger="hover"
            v-for="(url,i) in scope.row.gImage"
            :key="i"
          >
            <img :src="img" width="240" />
            <img
              slot="reference"
              :src="`${baseUrl}api${url}`"
              @mouseover="setimg(`${baseUrl}api${url}`)"
              v-if="i<3"
              class="tableimg"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="gName" width="150" label="商品名称"></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gPzysv"
        label="配置"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" show-overflow-tooltip property="gSpec" label="规格"></el-table-column>
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="数量"></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gColorv"
        v-if="tableStatus.gColorv"
        label="颜色"
      ></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        v-if="tableStatus.gNewoldv"
        label="新旧程度"
      ></el-table-column>

      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
      ></el-table-column>

      <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gCtime"
        v-if="tableStatus.gCtime"
        label="最近销售日期"
      >
        <template slot-scope="scope" v-if="scope.row.gCtime">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.gCtime.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable
        min-min-width="150"
        align="center"
        property="gRemark"
        label="备注"
        v-if="tableStatus.gRemark"
      ></el-table-column>
    </el-table>
    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>备货部门：
        </span>
        <el-radio-group v-model="form.rPreparegoods" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>送货部门：
        </span>
        <el-radio-group v-model="form.rDeliver" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>安装部门：
        </span>
        <el-radio-group v-model="form.rDisassembly" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mbottom">
      <el-col :xs="24" :sm="6">
        <el-input v-model="form.rLogistics" size="small" readonly :disabled="hasdis">
          <template slot="prepend">物流</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectLogistics')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input
          placeholder="请输入运单号"
          v-model="form.rShipmentnumber"
          size="small"
          :disabled="hasdis"
        >
          <template slot="prepend">运单号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-date-picker
          v-model="form.rEstdelivery"
          type="date"
          size="small"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          :disabled="hasdis"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <my-footer
      @opendialog="opendialog"
      :hideBtn1="false"
      :centertext="false"
      title="本单数量"
      :Totalamount="TotalGood"
      BtnText="确认出库"
      :hideBtn2="form.rStatus==7"
       v-has='361'
    ></my-footer>
    <el-dialog
      title="物流"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectLogistics"
      width="60%"
    >
      <selectLogistics @emitLogisticsData="getLogisticsData"></selectLogistics>
    </el-dialog>
    <el-dialog
      title="设置表格"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showtable"
      width="30%"
    >
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
import settTable from "../../../components/settTable/settTable";
import selectLogistics from "@/components/dialog/SelectLogistics";
export default {
  inject: ["reload"],
  components: {
    selectLogistics,
    settTable
  },
  data() {
    return {
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      hasdis: false,
      disabled: true,
      showtable: false,
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      showSelectLogistics: false,
      orderBH: null,
      orderID: null,
      img: "",
      // 单据信息
      form: {
        rId: null,
        rItemnum: null,
        rIsconstruct: 1,
        rTotalprice: 0,
        rDiscountamount: 0,
        rWhid: 0,
        rHandman: 0,
        rCtime: "",
        rDate: "",
        rEstdelivery: "",
        rLogistics: "",
        rRemark: ""
      },
      TotalGood: 0,
      loading:'',
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  created() {
    if (this.$route.query.data) {
      let vals = window.atob(this.$route.query.data);
      if (!isNaN(vals)) {
        this.orderID = vals;
      } else {
        this.orderBH = vals;
      }
      this.loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getOrder();
    }
  },
  methods: {
    // 单据回显
    getOrder() {
      let rId = { rId: this.orderID };
      if (!this.orderID) {
        rId = { rItemnum: this.orderBH };
      }
      // 单据信息回显
      this.$api.Receipt.get(rId).then(res => {
        if (res.data) {
          let items = res.data.records[0];
          if (!items.rEstdelivery) {
            items.rEstdelivery = this.$PublicJS.nowDate();
          }
          this.orderBH = items.rItemnum;
          if (items.rStatus != 7) {
            this.hasdis = true;
          }
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods({
            rid: res.data.records[0].rId,
            whid: res.data.records[0].rWhid
          }).then(res => {
            this.loading.close();
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
          });
          this.form = items;
          this.orderBH = this.form.rItemnum;
        }
      });
    },
    // 提交
    opendialog(val) {
      if (!this.form.rPreparegoods) {
        this.$message({ message: "请选择备货部门", type: "warning" });
        return false;
      }
      if (!this.form.rDeliver) {
        this.$message({ message: "请选择送货部门", type: "warning" });
        return false;
      }
      if (!this.form.rDisassembly) {
        this.$message({ message: "请选择安装部门", type: "warning" });
        return false;
      }
      if (
        this.form.rPreparegoods &&
        this.form.rDisassembly &&
        this.form.rDeliver
      ) {
        this.$confirm("此操作将直接出库, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.dialogSubmit();
        });
      }
    },
    // 审核提交
    dialogSubmit() {
      const loading = this.$loading({
        lock: true,
        text: "出库中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      delete this.form.rFile;
      this.form.rDate =this.$PublicJS.nowDate()
      this.$api.Receipt.ckAll(this.form).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "出库成功!"
          });
          this.$router.push("/warehouse/outbound/XStransferoutbound");
        }
      });
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
          column.property === "rdQuantity"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "rdQuantity") {
            this.TotalGood = parseFloat((sums[index]).toPrecision(12));
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    showDialog(val) {
      this[val] = true;
    },
    setimg(u) {
      this.img = u;
    },
   // 物流
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cuName;
      }
      this.showSelectLogistics = false;
    },
    settTable() {
      this.reload();
      this.showtable = false;
      this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
    }
  }
};
</script>
<style scoped>
</style>
