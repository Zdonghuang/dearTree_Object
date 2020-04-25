<template>
  <div ref="quotationsheet">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber" v-if="BH">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <span class="title">调拨入库结算</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>-->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rWhidtransferv" size="small" readonly disabled>
          <template slot="prepend">入库仓库</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rDate" size="small" disabled>
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
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计:"
      height="300px"
      header-cell-class-name="thbgc"
    >
      <el-table-column sortable
        show-overflow-tooltip
        type="index"
        width="55"
        align="center"
        property="index"
        label="序号"
      ></el-table-column>
      <el-table-column sortable
        show-overflow-tooltip
        property="tools"
        label="操作"
        align="center"
        width="80"
        v-if="!disabled"
      >
        <template slot-scope="scope">
          <i class="el-icon-circle-plus add" @click="adddate()"></i>
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
      <el-table-column sortable align="center" property="gName" width="150" label="商品名称"></el-table-column>
      <el-table-column sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
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
      <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="调拨数量"></el-table-column>
      <el-table-column sortable width="80" align="center" property="gUnitv" label="单位"></el-table-column>
      <el-table-column sortable width="100" align="center" property="iUnitprice" label="成本价"></el-table-column>
      <el-table-column sortable width="100" align="center" property="iUnitpriceSUM" label="成本金额">
        <template
          slot-scope="scope"
          v-if="scope.row.rdQuantity"
        >{{ scope.row.iUnitprice * scope.row.rdQuantity}}</template>
      </el-table-column>
      <el-table-column sortable width="150" align="center" property="iSellingprice" label="调拨价"></el-table-column>
      <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
      <el-table-column sortable width="100" align="center" property="gNewoldv" label="新旧程度"></el-table-column>
      <el-table-column sortable width="120" align="center" property="gCtime" label="最近销售日期">
        <template slot-scope="scope" v-if="scope.row.gCtime">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.gCtime.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable min-min-width="150" align="center" property="gRemark" label="备注"></el-table-column>
    </el-table>
    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="6" v-if="form.rApprovalstatus==3 && form.rStatus!=19">
        <el-input
          v-model="receiptFinancial[0].fsBankname"
          size="small"
          readonly
          :disabled="disAmount"
        >
          <template slot="prepend">付款账户</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="!disAmount && showDialog('showSelectBankAccount')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" v-if="form.rStatus!=19">
        <el-input placeholder="0" v-model="form.rTotalprice" size="small" disabled>
          <template slot="prepend">付款金额</template>
          <!-- <span slot="suffix" class="icon-quan" @click="setAll" v-if="form.rStatus!=19">全</span>
          <span slot="suffix" class="icon-qing" @click="setClear" v-if="form.rStatus!=19">清</span>-->
        </el-input>
      </el-col>
      <!-- <el-col :xs="24" :sm="6">
        <el-input
          placeholder="0"
          v-model="receiptFinancial[0].PendingMoney"
          size="small"
          :disabled="true"
        >
          <template slot="prepend">待付金额</template>
        </el-input>
      </el-col>-->
      <!-- <el-col :xs="24" :sm="6">
        <el-input placeholder="0" v-model="receiptFinancial[0].cqys" size="small" :disabled="true">
          <template slot="prepend">此前预付</template>
        </el-input>
      </el-col>-->
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>

    <img v-if="form.rStatus==19" src="../../../../public/images/finish.png" alt class="finish" />

    <my-footer
      :Totalamount="$PublicJS.money(Math.abs(form.rTotalprice), 2)"
      :number="number"
      :BtnText="form.rApprovalstatus==3?'付款记账':'提交审核'"
      @opendialog="openDD(form.rApprovalstatus!=3?1:2)"
      :hideBtn2="form.rApprovalstatus!=2"
      :hideBtn1="false"
      v-if="form.rApprovalstatus!=3"
    ></my-footer>
     <my-footer
      :Totalamount="$PublicJS.money(Math.abs(form.rTotalprice), 2)"
      :number="number"
      :BtnText="form.rApprovalstatus==3?'付款记账':'提交审核'"
      @opendialog="openDD(form.rApprovalstatus!=3?1:2)"
      :hideBtn2="form.rStatus!=19"
      :hideBtn1="false"
      v-if="form.rApprovalstatus==3"
      v-has="512"
    ></my-footer>
    <el-dialog
      title="付款账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData" code="YHZH"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showDD"
      width="50%"
    >
      <el-dialog
        width="60%"
        title="审核人"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showexamine"
        append-to-body
      >
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine :rtype="48" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
  </div>
</template>

<script>
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import examine from "@/components/dialog/examine";
import selectUser from "@/components/dialog/SelectUser";
import { truncate } from "fs";
export default {
  components: {
    examine,
    selectBankAccount,
    selectUser
  },
  data() {
    return {
      tableData: [],
      form: {
        rCuidv: "", //客户
        rCuid: "",
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "", //仓库
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId,
        rRemark: "", //备注
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rStatus: 2,
        rTotalprice: 0,
        rBillingstatus: "0",
        rLogistics: "",
        rShipmentnumber: ""
        // rCuserid: this.$storage.userName
      },
      img: "",
      receiptFinancial: [
        {
          fsRid: null,
          fsBankname: "",
          fsBankaccount: "",
          fsAmount: "",
          fsDiv: 2
        }
      ],
      activeName: "wuliu",
      fsAmount: 0,
      disabled: false,
      hasAmount: false,
      disAmount: false,
      showSum: true,
      currentRow: null,
      icon: "",
      showSelectBankAccount: false,
      showSelectLogistics: false,
      rowindex: 0,
      TotalPrice: 0,
      number: 0,
      BH: null,
      rId: null,
      showDD: false,
      showexamine: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      contact: [],
      text: "提交",
      nowdata: "",
      daifu: 0,
      loading:'',
    };
  },
  computed: {
    // 总金额
    sumTotalPrice: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = item.rdQuantity * item.iSellingprice);
        }
      });
    }
  },
  created() {
    this.nowdata = this.$PublicJS.nowDate();
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
    } else {
      this.$router.push("/XStransfer/statement/RKstatementList");
    }
  },
  methods: {
    getOrder() {
      this.$api.Receipt.get({ rId: this.orderID }).then(res => {
        this.BH = res.data.records[0].rItemnum;
        this.form = res.data.records[0];
        if (this.form.rStatus == 19) {
          this.disAmount = true;
        }
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.orderID,
          whid: res.data.records[0].rWhid
        }).then(res => {
            this.loading.close();
          this.tableData = [];
          res.data.map((item, index) => {
            if (!item.rdQuantity) return;
            item.iQuantity = item.rdQuantity;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            this.tableData.splice(index, 1, JSON.parse(JSON.stringify(item)));
          });
        });
        if (this.form.rApprovalstatus != 0) {
          this.$api.Financialsettle.get({
            rid: this.form.rRootid,
            div: 7
          }).then(res => {
            if (res.data.length) {
              res.data.map(item => {
                this.fsAmount += item.fsAmount;
              });
            }
          });
        }
      });
    },
    setfsAmount() {
      if (this.receiptFinancial[0].fsBankname) {
        this.receiptFinancial[0].fsAmount = this.TotalPrice - this.fsAmount;
      } else {
        this.$message.error("请选择付款账户");
      }
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cAttrvalue;
      }
      this.showSelectLogistics = false;
    },
    setmoney() {
      if (this.receiptFinancial[0].fsAmount > this.TotalPrice) {
        this.$message("付款金额超出待付金额");
        this.receiptFinancial[0].fsAmount = this.TotalPrice;
      } else if (!this.receiptFinancial[0].fsAmount) {
        this.$message("请输入付款金额");
      }
    },
    getBank(val) {
      if (val) {
        this.receiptFinancial[0].fsBankname = val.cAttrvalue;
        this.receiptFinancial[0].fsBankaccount = val.cAttrcode;
      }
      this.showselectBankAccount1 = false;
    },
    getrCid(val) {
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
          this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: item.cAddr
          });
        });
      });
    },
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
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
            this.TotalPrice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.number = parseFloat((sums[index]).toPrecision(12));
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
    opendialog(n) {
      this[n] = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setimg(url) {
      this.img = url;
    },
    // openDD(val) {
    //   // if(val==1) return this.showDD = true
    //   if (this.form.rApprovalstatus == 3) {
    //     if (!this.receiptFinancial[0].fsBankname) {
    //       this.$message.error("请选择付款账户");
    //       return false;
    //     }
    //     this.close("false");
    //   } else {
    //     this.showDD = true;
    //   }

    //   // this.close('1');
    //   // this.close('false')
    // },
    openDD(val) {
      if (this.form.rApprovalstatus == 3) {
        if (!this.receiptFinancial[0].fsBankname) {
          this.$message.error("请选择付款账户");
          return false;
        }
        this.confirm()
      } else {
        this.showDD = true;
      }
    },
    confirm() {
      this.$confirm("是否记账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.close("false");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      delete this.form.rFile;
      this.form.rDate = this.nowdata;
      // delete  this.receiptFinancial
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        billingAmount: this.form.rTotalprice,
        billingDiv: 2,
        receiptDtsList: [],
        receiptInfoVO: this.form,
        receiptFinancial: this.receiptFinancial
      };
      if (val1 && val1.length) params.cc = val1;
      if (!params.approve) {
        params.receiptInfoVO.rBillingstatus = 1;
        params.receiptInfoVO.rStatus = 19;
      } else {
        //delete params.receiptFinancial
      }
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        let obj = {};
        obj.rdGid = item.gId;
        obj.rdQuantity = item.rdQuantity;
        obj.rdSellingprice = item.iSellingprice;
        obj.rRemark = item.rRemark;
        obj.rdIotype = 2;
        params.receiptDtsList.push(obj);
      });
      this.showDD = false;
      params.receiptFinancial[0].fsAmount = this.form.rTotalprice;
      this.$api.Receipt.saveall(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/XStransfer/statement/RKstatementList");
        } else {
          this.$message("提交失败");
        }
      });
    },
    iptBlur(val) {
      if (!isNaN(val)) {
        if (val > this.receiptFinancial[0].PendingMoney) {
          this.receiptFinancial[0].fsAmount = 0;
          this.$message("收款金额不能大于待收金额");
        }
      } else {
        this.receiptFinancial[0].fsAmount = 0;
        this.$message("请输入数字");
      }
    },
    setAll() {
      this.receiptFinancial[0].fsAmount = Number(this.form.rTotalprice);
      this.disAmount = true;
    },
    setClear() {
      this.disAmount = false;
      this.receiptFinancial[0].fsAmount = 0;
    },
    // 银行账户
    getBankAccountData(val) {
      if (val) {
        this.receiptFinancial[0].fsBankname = val.cAttrvalue;
        this.receiptFinancial[0].fsBankaccount = val.cAttrcode;
        // this.receiptFinancial[0].fsBankname = val.cAttrvalue;
        // this.receiptFinancial[0].fsBankaccount = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
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