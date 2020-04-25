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
        <p class="title">销售换货结算单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>-->
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
        <el-input placeholder="收货人" v-model="form.rCidv" size="small" readonly disabled>
          <template slot="prepend">收货人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="仓库" v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="签单人" v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">签单人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="归属公司" v-model="form.rOidv" size="small" readonly disabled>
          <template slot="prepend">归属公司</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="获客人" v-model="form.rGetguestv" size="small" readonly disabled>
          <template slot="prepend">获客人</template>
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>换货入库</span>
      </div>
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
        <el-table-column type="index" width="55" align="center" property="index" label="序号">
        </el-table-column>
        <el-table-column property="tools" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
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
          label="商品名称"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gBrandv"
          label="品牌"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gSpec"
          label="规格"
        ></el-table-column>
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
          label="颜色"
        ></el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="rdQuantity"
          label="换货数量"
        ></el-table-column>
        <el-table-column sortable
          width="80"
          align="center"
          property="gUnitv"
          label="单位"
        ></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="iSellingprice"
          label="换货价"
        ></el-table-column>
        <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
          <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
        </el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="gNewoldv"
          label="新旧程度"
        ></el-table-column>
        <el-table-column sortable
          min-width="120"
          align="center"
          property="gCtime"
          label="最近销售日期"
        ></el-table-column>
        <el-table-column sortable
          min-width="150"
          align="center"
          property="gRemark"
          label="备注"
        ></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>换货出库</span>
      </div>
      <el-table
        :data="OUTtableData"
        border
        style="width: 100%"
        size="mini"
        height="300px"
        show-summary
        :summary-method="getSummariesOUT"
        sum-text="合计:"
        header-cell-class-name="thbgc"
      >
        <el-table-column type="index" width="55" align="center" property="index" label="序号"></el-table-column>
        <el-table-column property="tools" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
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
          label="商品名称"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gBrandv"
          label="品牌"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gSpec"
          label="规格"
        ></el-table-column>
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
          label="颜色"
        ></el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="rdQuantity"
          label="换出数量"
        ></el-table-column>
        <el-table-column sortable
          width="80"
          align="center"
          property="gUnitv"
          label="单位"
        ></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="iSellingprice"
          label="换出价"
        ></el-table-column>
        <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
          <template v-if="OUTsumTotalPrice">{{ $PublicJS.money(OUTsumTotalPrice, 2) }}</template>
        </el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="gNewoldv"
          label="新旧程度"
        ></el-table-column>
        <el-table-column sortable
          min-width="120"
          align="center"
          property="gCtime"
          label="最近销售日期"
        ></el-table-column>
        <el-table-column sortable
          min-width="150"
          align="center"
          property="gRemark"
          label="备注"
        ></el-table-column>
      </el-table>
    </el-card>
    <el-row :gutter="20" class="mtop15 mbottom">
      <el-col :xs="24" :sm="6" v-if="form.rTotalprice!=0">
        <el-input
          placeholder="0"
          v-model="receiptFinancial.FMpFamount"
          size="small"
          disabled
          v-if="form.rTotalprice<0 || form.rTotalprice==0"
        >
          <template slot="prepend">预付余额(￥)</template>
        </el-input>
        <el-input
          placeholder="0"
          v-model="receiptFinancial.FMpSamount"
          size="small"
          disabled
          v-if="form.rTotalprice>0 || form.rTotalprice==0"
        >
          <template slot="prepend">预收余额(￥)</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" v-if="form.rTotalprice!=0">
        <el-input
          placeholder="0"
          v-model="receiptFinancial.amount"
          size="small"
          @blur="iptBlur(receiptFinancial.amount)"
          :disabled="form.rStatus==19?true:false"
        >
          <template slot="prepend" v-if="form.rTotalprice<0">启用预付款(￥)</template>
          <template slot="prepend" v-if="form.rTotalprice>0">启用预收款(￥)</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" v-if="form.rTotalprice!=0">
        <el-input placeholder="0" v-model="sumYH" size="small" disabled v-if="form.rStatus!=19">
          <template slot="prepend">本单优惠(￥)</template>
        </el-input>
        <el-input
          placeholder="0"
          v-model="receiptFinancial.rDiscountamount"
          size="small"
          disabled
          v-if="form.rStatus==19"
        >
          <template slot="prepend">本单优惠(￥)</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" v-if="form.rTotalprice<0">
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-plus"
          @click="$router.push({path: '/financePay',query: { ID: form.rCuid,rid:form.rId }})"
        >添加预付款</el-button>
      </el-col>
      <el-col :xs="24" :sm="6" v-if="form.rTotalprice>0">
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-plus"
          @click="$router.push({path: '/financeAdd',query: { ID: form.rCuid,rid:form.rId }})"
        >添加预收款</el-button>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <img
      v-if="form.rBillingstatus==1"
      src="../../../../public/images/finish.png"
      alt
      class="finish"
    />
    <div class="content" v-has="1059">
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
                <span v-if="form.rTotalprice>0">应收金额</span>
                <span v-if="form.rTotalprice<0">应付金额</span>
                <span v-if="form.rTotalprice==0">本单金额</span>
                <span>￥</span>
                <span>{{ $PublicJS.money(Math.abs(form.rTotalprice), 2) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right" v-if="hideAllBtn">
            <div v-if="!$router.history.current.query.from">
            <div class="toolright" v-if="form.rTotalprice>0">
              <div class="baocun" @click="btnSubmit('zf')">
                <p style="padding:0 30px">转到预付</p>
              </div>
              <div class="jizhang" @click="btnSubmit">
                <p style="padding:0 30px">收款结算</p>
              </div>
            </div>
            <div class="toolright" v-if="form.rTotalprice<0">
              <div class="baocun" @click="btnSubmit('zs')">
                <p style="padding:0 30px">转到预收</p>
              </div>
              <div class="jizhang" @click="btnSubmit">
                <p style="padding:0 30px">付款结算</p>
              </div>
            </div>
            <div class="toolright" v-if="form.rTotalprice==0">
              <div class="jizhang" @click="btnJS">
                <p style="padding:0 30px">结算</p>
              </div>
            </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      defStyle: "tc ipt bgc",
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      OUTtableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      disAmount: false,
      hideAllBtn: true,
      disabled: true,
      showtable: false,
      orderBH: "",
      orderID: "",
      // 结算信息
      receiptFinancial: {
        amount: 0,
        cuid: 0,
        div: 1,
        pSamount: 0,
        pFamount: 0
      },
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rIsconstruct: 1,
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
        rRemark: "",
        rCuidv: ""
      },
      img: "",
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
    },
    OUTsumTotalPrice: function() {
      this.OUTtableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (
            item.rdQuantity * item.iSellingprice
          ).toFixed(2));
        }
      });
    },
    sumYH: function() {
      return (
        Math.abs(this.form.rTotalprice) - this.receiptFinancial.amount
      ).toFixed(2);
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
          if (items.rStatus == 19) {
            this.hideAllBtn = false;
            this.receiptFinancial.rDiscountamount = items.rDiscountamount;
            this.receiptFinancial.amount =
              Math.abs(items.rTotalprice) -
              this.receiptFinancial.rDiscountamount;
          } else {
            if (items.rTotalprice > 0 ) {
              if (
                this.receiptFinancial.pSamount > items.rTotalprice ||
                this.receiptFinancial.pSamount == items.rTotalprice
              ) {
                this.receiptFinancial.amount = items.rTotalprice;
              } else {
                this.receiptFinancial.amount = this.receiptFinancial.pSamount;
              }
            } else {
              if (
                this.receiptFinancial.pFamount > Math.abs(items.rTotalprice) ||
                this.receiptFinancial.pFamount == Math.abs(items.rTotalprice)
              ) {
                this.receiptFinancial.amount = Math.abs(items.rTotalprice);
              } else {
                this.receiptFinancial.amount = this.receiptFinancial.pFamount;
              }
            }
          }
          // 获取客户预存
          this.$api.Premoney.get({ cuid: items.rCuid }).then(res => {
            if (res.data.length) {
              let items1 = res.data[0];
              if (items.rTotalprice > 0) {
                this.receiptFinancial.pSamount = items1.pSamount;
                this.receiptFinancial.FMpSamount = this.$PublicJS.money(
                  items1.pSamount,
                  2
                );
                if (items1.pSamount < Math.abs(items.rTotalprice)) {
                  this.hideAllBtn = false;
                }
              } else {
                this.receiptFinancial.pFamount = items1.pFamount;
                this.receiptFinancial.FMpFamount = this.$PublicJS.money(
                  items1.pFamount,
                  2
                );
                if (items1.pFamount < Math.abs(items.rTotalprice)) {
                  this.receiptFinancial.amount = items1.pFamount;
                  // this.hideAllBtn = false;
                }
              }
            }
          });
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
              if (item.rdIotype == 2) {
                this.tableData.push(item);
              } else if (item.rdIotype == 1) {
                this.OUTtableData.push(item);
              } else {
                this.tableData.push(item);
              }
            });
            this.form = items;
            this.getReceiver({ cuid: items.rCuid,size:99 });
            if (this.OUTtableData.length == 0) {
              for (let i = 0; i < 5; i++) {
                this.OUTtableData.push({
                  rdQuantity: null,
                  iQuantity: null,
                  iQuantitycanout: null,
                  iSellingprice: null,
                  sumPrice: null
                });
              }
            }
          });
        }
      });
    },
    // 收货人回显
    getReceiver(val) {
      this.$api.Contact.get(val).then(res => {
        if (res.code == 200) {
          let Items = res.data.records;
          if (!Items.length) return (this.form.rCid = "");
          let obj = Items.find(item => {
            return item.cCuid == val.cuid;
          });
          this.form.rCid = obj.cId;
          this.form.rCidv = obj.cName;
          //this.form.rCmobile = obj.cMobile;
          //this.form.rCaddr = obj.cAddr;
          this.$forceUpdate();
        }
      });
    },
    // 提交
    btnSubmit(val) {
      let msg = "是否结算？";
      if (this.receiptFinancial.amount < Math.abs(this.form.rTotalprice)) {
        msg = "当前输入的金额与本单金额有差异，是否结算？";
      }
      if (val == "zs") {
        msg = "是否将金额转到客户预收中";
      }
      if (val == "zf") {
        msg = "是否将金额转到客户预付中";
      }

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogSubmit(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 结算
    dialogSubmit(val) {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let tableData = [];
      let OUTtableData = [];
      this.tableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iSellingprice;
          item.rdUnitprice = item.iUnitprice;
          item.rdRemark = item.gRemark;
          item.rdIotype = 2;
          tableData.push(item);
        }
      });
      this.OUTtableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iSellingprice;
          item.rdUnitprice = item.iUnitprice;
          item.rdRemark = item.gRemark;
          item.rdIotype = 1;
          OUTtableData.push(item);
        }
      });
      delete this.form.rFile;
      this.form.rDiscountamount = this.sumYH;
      this.form.rStatus = 19;
      this.form.rBillingstatus = 1;
      this.form.rDate = this.$PublicJS.nowDate();
      let param = {
        approve: false,
        approvers: [],
        cc: [],
        billingAmount: this.receiptFinancial.amount,
        billingDiv: this.form.rTotalprice > 0 ? 1 : 2,
        receiptInfoVO: this.form,
        receiptDtsList: tableData.concat(OUTtableData)
      };
      if (val == "zs") {
        param.billingDiv = 4;
        param.billingAmount = this.form.rTotalprice;
      }
      if (val == "zf") {
        param.billingDiv = 5;
        param.billingAmount = -this.form.rTotalprice;
      }

      this.$api.Receipt.saveall(param).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/sales/settle/replaceSettleOrderList");
        } else {
          this.$message.error(res.err);
        }
      });
    },
    // 等于0的时候直接结算
    btnJS() {
      this.$confirm("次操作将结算单据，是否继续", "提示", {
        confirmButtonText: "确定结算",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.Sale.updateBillStatus({
            receiptId: this.orderID,
            status: 1
          }).then(res => {
            if (res.code == 200) {
              this.$api.Sale.updateStatus({
                receiptId: this.orderID,
                status: 19
              }).then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push("/sales/settle/replaceSettleOrderList");
              });
            } else {
              this.$message.error(res.err);
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
    iptBlur(val) {
      if (!isNaN(val)) {
        if (this.form.rTotalprice > 0) {
          if (!val) {
            this.$message("请输入收款金额");
            this.receiptFinancial.amount = this.receiptFinancial.pSamount;
          } else if (val < 0) {
            this.receiptFinancial.amount = this.receiptFinancial.pSamount;
            this.$message("收款金额不得小于0");
          } else if (val > this.receiptFinancial.pSamount) {
            this.receiptFinancial.amount = this.receiptFinancial.pSamount;
            this.$message("收款金额不得大于预收金额");
          }
        } else {
          if (!val) {
            this.$message("请输入付金额");
            this.receiptFinancial.amount = this.receiptFinancial.pFamount;
          } else if (val < 0) {
            this.receiptFinancial.amount = this.receiptFinancial.pFamount;
            this.$message("付金额不得小于0");
          } else if (val > this.receiptFinancial.pFamount) {
            this.receiptFinancial.amount = this.receiptFinancial.pFamount;
            this.$message("收款金额不得大于预付金额");
          }
        }
      } else {
        this.receiptFinancial.amount = 0;
        this.$message("请输入数字");
      }
    },
    setimg(u) {
      this.img = u;
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
          (!values.every(value => isNaN(value)) &&
            column.property === "sumPrice") ||
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
          if (column.property === "sumPrice") {
            this.INrTotalprice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
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
    getSummariesOUT(param) {
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
          (!values.every(value => isNaN(value)) &&
            column.property === "sumPrice") ||
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
          if (column.property === "sumPrice") {
            this.OUTrTotalprice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
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

    // 刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
</style>
