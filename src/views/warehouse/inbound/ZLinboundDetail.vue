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
        <p class="title">租赁入库单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>-->
          <el-button size="small" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">客户</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select v-model="form.rCid" placeholder="请选择收货人" size="small" :disabled="disabled">
          <el-option
            v-for="item in contact"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="仓库" v-model="form.rWhidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="经手人"
          v-model="form.rHandmanv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="获客人"
          v-model="form.rGetguestv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">获客人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系电话" v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-input placeholder="收货地址" v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">收货地址</template>
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
      <el-table-column type="index" width="55" align="center" property="index">
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
      <el-table-column
        sortable
        align="center"
        property="gName"
        width="150"
        v-if="tableStatus.gName"
        label="商品名称"
      ></el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
      ></el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gSpec"
        label="规格"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="gPzysv"
        show-overflow-tooltip
        label="配置"
      ></el-table-column>
      <el-table-column
        sortable
        width="80"
        align="center"
        property="gColorv"
        v-if="tableStatus.gColorv"
        label="颜色"
      ></el-table-column>

      <el-table-column
        sortable
        width="100"
        align="center"
        property="rdQuantity"
        label="数量"
        v-if="tableStatus.rdQuantity"
      ></el-table-column>
      <el-table-column
        sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        property="iSellingprice"
        label="租赁价"
        v-if="tableStatus.iSellingprice"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        v-if="tableStatus.gNewoldv"
        label="新旧程度"
      ></el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gCtime"
        v-if="tableStatus.gCtime"
        label="最近销售日期"
      ></el-table-column>
      <el-table-column
        sortable
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
      <el-col :xs="24" :sm="7">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          align="right"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="租赁开始日期"
          end-placeholder="租赁结束日期"
          :disabled="disabled"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="租赁月数" v-model="form.months" size="small" :disabled="disabled">
          <template slot="prepend">租赁月数</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has="362">
      <div class="footer">
        <el-row>
          <el-col :xs="24" :sm="4">
            <div class="left">
              <div></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="14" align="right">
            <div class="center">
              <div class="jine">
                <span>本单金额</span>
                <span>￥</span>
                <span>{{ $PublicJS.money(form.rTotalprice * form.months, 2) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div class="toolright">
              <div class="jizhang" @click="opendialog" v-if="!hasdis">
                <p style="padding:0 30px">入库</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
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
import settTable from "../../../components/settTable/settTable";
import selectLogistics from "../../../components/dialog/SelectLogistics";
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    settTable,
    selectLogistics
  },
  data() {
    return {
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      disabled: true,
      hasdis: false,
      img: "",
      showtable: false,
      showSelectLogistics: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
        rTotalprice: 0,
        TotalGood: 0,
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
        rCuidv: "",
        rStatus: 1,
        rPreparegoods: 0,
        rDisassembly: 0,
        time: []
      },
      loading: ""
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
          if (items.rStatus != 17) {
            this.hasdis = true;
          }
          this.getReceiver({ cuid: items.rCuid, size: 99 });
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(params).then(res => {
            this.loading.close();
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              item.defNum = item.rdQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
            this.form = items;
            this.form.rEstdelivery = this.$PublicJS.nowDate();
            this.form.time = [
              items.startDate.split("T")[0],
              items.endDate.split("T")[0]
            ];
          });
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/warehouse/inbound/leasePrinting?data=${data}`,
        "_blank"
      );
    },
    getReceiver(val) {
      this.contact = [];
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) return (this.form.rCid = "");
        Items.map((item, index) => {
          if (!index) {
            this.form.rCmobile = item.cMobile;
            this.form.rCaddr = item.cAddr;
            this.form.rCid = item.cId;
          }
          return this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: item.cAddr
          });
        });
      });
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
            column.property === "sumPrice") ||
          column.property === "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "sumPrice") {
            this.form.rTotalprice = parseFloat(sums[index].toPrecision(12));
            // this.TotalPrice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.form.TotalGood = parseFloat(sums[index].toPrecision(12));
          } else {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
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
        this.form.rDeliver &&
        this.form.rDisassembly
      ) {
        this.$confirm("此操作将修改单据状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogSubmit();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    // 审核提交
    dialogSubmit(val) {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let tableData = [];
      this.tableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iSellingprice;
          item.rdUnitprice = item.iUnitprice;
          item.rdIotype = 2;
          tableData.push(item);
        }
      });

      delete this.form.rFile;
      this.form.rDate = this.$PublicJS.nowDate();
      let params = {
        approve: false,
        approvers: [],
        receiptDtsList: tableData,
        receiptInfoVO: this.form
      };
      this.$api.Rent.inbound(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.$router.push("/warehouse/inbound/ZLinboundList");
        } else {
          this.$message({
            type: "error",
            message: res.err
          });
        }
      });
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
