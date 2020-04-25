<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ orderBH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">内部调拨入库单</p>
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
        <el-input placeholder="收货仓库" v-model="form.rWhidtransferv" size="small" readonly disabled>
          <template slot="prepend">收货仓库</template>
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
      <el-table-column sortable
        align="center"
        property="gName"
        width="150"
        v-if="tableStatus.gName"
        label="商品名称"
      ></el-table-column>
      <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
      ></el-table-column>
      <el-table-column sortable width="120" align="center" show-overflow-tooltip property="gSpec" label="规格"></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        property="gPzysv"
        show-overflow-tooltip
        label="配置"
      ></el-table-column>
      <el-table-column sortable
        width="80"
        align="center"
        property="gColorv"
        v-if="tableStatus.gColorv"
        label="颜色"
      ></el-table-column>

      <el-table-column sortable
        width="100"
        align="center"
        property="rdQuantity"
        label="数量"
        v-if="tableStatus.rdQuantity"
      ></el-table-column>
      <el-table-column sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        property="iSellingprice"
        label="调拨价"
        v-if="tableStatus.iSellingprice"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        v-if="tableStatus.gNewoldv"
        label="新旧程度"
      ></el-table-column>
      <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gCtime"
        v-if="tableStatus.gCtime"
        label="最近销售日期"
      ></el-table-column>
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
          <b class="red">*</b>拆装部门：
        </span>
        <el-radio-group v-model="form.rDisassembly" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
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
      BtnText="确认入库"
      :hideBtn2="form.rStatus==17"
       v-has='362'
    ></my-footer>
    <el-dialog title="设置表格" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showtable" width="30%">
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
import settTable from "../../../components/settTable/settTable";
export default {
  inject: ["reload"],
  components: {
    settTable
  },
  data() {
    return {
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      showtable: false,
      hasdis: false,
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
        rCuid: 0,
        rCuserid: 0,
        rWhid: 0,
        rGetguest: 0,
        rHandman: 0,
        rCid: "",
        rCaddr: "",
        rCmobile: "",
        rCtime: "",
        rDate: "",
        rLogistics: "",
        rRemark: "",
        rShipmentnumber: "",
        rCuidv: ""
      },
      TotalGood: 0,
      loading:'',
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
  computed: {
    // 总金额
    sumTotalPrice: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (
            item.rdQuantity * item.iSellingprice
          ).toFixed(2));
        }
      });
    }
  },
  methods: {
    // 用户回显
    getuser() {
      let param = {
        id: this.userid
      };
      this.$api.Customer.get(param).then(res => {
        this.rCuidv = res.data.records["cuName"];
      });
    },
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
          this.orderBH = items.rItemnum;
          if (items.rStatus == 19) {
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
              item.num = item.rdQuantity;
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
        this.$message({ message: "请选择拆装部门", type: "warning" });
        return false;
      }

      if (
        this.form.rPreparegoods &&
        this.form.rDisassembly &&
        this.form.rDeliver
      ) {
        this.$confirm("此操作将直接入库, 是否继续?", "提示", {
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
        text: "入库中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      delete this.form.rFile;
      this.form.rDate =this.$PublicJS.nowDate()
      this.$api.Receipt.rkAll(this.form).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "入库成功!"
          });
          this.$router.push("/warehouse/inbound/transferInboundList");
        } else {
          this.$message.error(res.err);
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
    setimg(u) {
      this.img = u;
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
