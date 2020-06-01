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
        <p class="title">采购入库单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button> -->
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has="362">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly disabled>
          <template slot="prepend">客户</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rCid"
          placeholder="请选择收货人"
          size="small"
          @change="selectChange"
          disabled
        >
          <el-option
            v-for="item in contact"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="收货仓库" v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">收货仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="经手人" v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <!-- <el-col :xs="24" :sm="4">
        <el-input placeholder="获客人" v-model="form.rGetguestv" size="small" readonly disabled>
          <template slot="prepend">获客人</template>
        </el-input>
      </el-col>-->
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系电话" v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <!-- <el-col :xs="24" :sm="12">
        <el-input placeholder="收货地址" v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">收货地址</template>
        </el-input>
      </el-col>-->
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
      <el-table-column
        sortable
        show-overflow-tooltip
        type="index"
        width="30"
        align="center"
        property="index"
        label="序号"
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
      <el-table-column sortable align="center" property="gName" width="200" label="商品名称"></el-table-column>
      <el-table-column sortable width="80" align="center" property="gUnitv" label="单位"></el-table-column>
      <el-table-column
        sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gColorv"
        label="颜色"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        label="品牌"
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
        width="150"
        align="center"
        show-overflow-tooltip
        property="gSpec"
        label="规格"
      ></el-table-column>
      <el-table-column sortable property="iSellingprice" label="单价">
        <template slot-scope="scope">
          <input
            type="text"
            @blur="setmoney(scope.row)"
            v-model="scope.row.iSellingprice"
            class="tc ipt bgc"
            :readonly="form.rStatus==19"
            :disabled="true"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="入库数量">
        <template slot-scope="scope">
          <input
            type="text"
            @blur="setnum(scope.row)"
            v-model="scope.row.rdQuantity"
            class="tc ipt bgc"
            :readonly="form.rStatus==19"
            :disabled="form.rStatus==19||scope.row.rdQuantitysurplus==0"
          />
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="rdQuantitysurplus"
        label="待入库数量"
      ></el-table-column>
      <el-table-column sortable label="金额" property="money">
        <template v-if="money">{{money}}</template>
      </el-table-column>
      <!-- <el-table-column sortable width="150" align="center" show-overflow-tooltip label="库存">
        <el-table-column sortable
          width="150"
          align="center"
          show-overflow-tooltip
          property="iQuantity"
          label="可用库存"
        ></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          show-overflow-tooltip
          property="iQuantitywillin"
          label="待入库库存"
        ></el-table-column>
      </el-table-column>-->
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gCtime"
        label="最近销售日期"
      >
        <template slot-scope="scope" v-if="scope.row.gCtime">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.gCtime.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable width="150" align="center" property="gRemark" label="备注"></el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input placeholder="0" size="small" disabled v-model="p">
          <template slot="prepend">预付款</template>
        </el-input>
      </el-col>
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="small" :disabled="form.rStatus!=17">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <br />
    <div class="bigbox" v-if="form.rStatus==19||form.rType==8">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==31">
      <div class="litbox">
        <span>已作废</span>
      </div>
    </div>
    <br />
    <br />
    <my-footer
      @opendialog="opendialog"
      :hideBtn1="false"
      :centertext="false"
      title="入库数量"
      :Totalamount="number"
      BtnText="确认入库"
      :hideBtn2="form.rStatus==17"
      v-has="362"
    ></my-footer>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",

      showSelectLogistics: false,
      orderBH: null,
      orderID: null,
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
        rEstdelivery: this.$PublicJS.nowDate(),
        rLogistics: "",
        rRemark: "",
        rShipmentnumber: "",
        rCuidv: ""
      },
      TotalPrice: 0,
      loading: "",
      number: 0,
      nowdata: "",
      p: 0,
      img: ""
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        return (item.money = item.rdQuantity * item.iSellingprice);
      });
    }
  },
  created() {
    let date = new Date();
    let arr = [];
    arr[0] = date.getFullYear();
    arr[1] = date.getMonth() + 1;
    arr[2] = date.getDate();
    if (arr[1] < 10) {
      arr[1] = `0${arr[1]}`;
    }
    if (arr[2] < 10) {
      arr[2] = `0${arr[2]}`;
    }
    this.nowdata = arr.join("");
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
          this.orderBH = res.data.records[0].rItemnum;
          let items = res.data.records[0];
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods({
            rid: res.data.records[0].rId,
            whid: res.data.records[0].rWhid
          }).then(res => {
            this.loading.close();
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              if (!item.rdQuantity) item.rdQuantity = item.rdQuantitysurplus;
              if (
                items.rItemnumparent.indexOf("CGRKD") > -1 &&
                item.rdQuantitysurplus > 0
              )
                item.rdQuantity = item.rdQuantitysurplus;
              item.gConstructcostweight = item.rdConstructcostweight;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
          });
          this.form = items;
          this.$api.Premoney.get({ cuid: this.form.rCuid }).then(res => {
            if (res.data && res.data.length) {
              this.p = res.data[0].pFamount;
            }
          });
          this.orderBH = this.form.rItemnum;
          this.getReceiver({ cuid: this.form.rCuid });
        }
      });
    },
    // 联系人回显
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
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/warehouse/inbound/printingInbound?data=${data}`,
        "_blank"
      );
    },
    // 提交
    opendialog(val) {
      this.$confirm("此操作将直接入库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogSubmit();
      });
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
      this.form.rDate = this.nowdata;
      this.form.rTotalprice = this.TotalPrice;
      let params = {
        approve: false,
        receiptDtsList: [],
        receiptInfoVO: this.form
      };
      let num = 0;
      this.tableData.forEach((item, index) => {
        item.rdGid = item.gId;
        item.rdRemark = item.gRemark;
        item.rdIotype = 2;
        item.rdSellingprice = item.iSellingprice;
        item.rdQuantitysurplus -= item.rdQuantity;
        item.rdConstructcostweight = item.gConstructcostweight;
        item.rdConstructcostweight = 9;
        params.receiptDtsList.push(item);
      });
      return console.log(params);
      this.$api.Receipt.allRK(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "入库成功!"
          });
          this.$router.push("/warehouse/inbound/purchaseInboundList");
        } else {
          this.$message.error(res.err);
        }
      });
    },
    setnum(val) {
      if (isNaN(val.rdQuantity)) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("请输入数字");
      }
      if (val.rdQuantity > val.rdQuantitysurplus) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("入库数量超出待入库数量");
      }
      if (val.rdQuantity < 0) {
        val.rdQuantity = val.rdQuantitysurplus;
      }
      if (this.tableData.length == 1 && val.rdQuantity <= 0) {
        val.rdQuantity = val.rdQuantitysurplus;
      }
      let num = 0;
      this.tableData.map(item => {
        if (item.rdQuantity == 0) num++;
      });
      if (num == this.tableData.length) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("入库数量不能全部为0");
      }
    },
    setmoney(val) {
      if (isNaN(val.iSellingprice)) {
        val.iSellingprice = 1;
        return this.$message.error("请输入数字");
      }
      if (val.iSellingprice <= 0) {
        val.iSellingprice = 1;
        return this.$message.error("请输入单价");
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
          (!values.every(value => isNaN(value)) &&
            column.property === "rdQuantity") ||
          column.property === "money"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice = sums[index];
            sums[index] += " 元";
          }
          if (column.property === "rdQuantity") {
            this.number = sums[index];
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
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
    }
  }
};
</script>
<style scoped>
</style>
