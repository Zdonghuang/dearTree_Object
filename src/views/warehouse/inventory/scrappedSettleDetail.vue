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
        <p class="title">报废结算单</p>
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
      <el-table-column type="index" width="55" align="center" property="index" label="序号"></el-table-column>
      <el-table-column property="tools" label="操作" align="center" width="80" v-if="!disabled">
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
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="报废数量"></el-table-column>
      <el-table-column sortable width="80" align="center" show-overflow-tooltip property="gUnitv" label="单位"></el-table-column>
      <el-table-column sortable width="80" align="center" property="iSellingprice" label="报废结算价">
        <template slot-scope="scope" v-if="scope.row.gItemnum">
          <input
            type="text"
            v-model="scope.row.iSellingprice"
            :class="defStyle"
            :disabled="form.rApprovalstatus==3"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
      <!-- <el-table-column sortable width="150" align="center" property="iSellingprice" label="报废预报价"></el-table-column> -->
      <el-table-column sortable width="150" align="center" property="sumPrice" label="报废金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="gNewoldv" label="新旧程度"></el-table-column>
      <el-table-column sortable width="120" align="center" property="gCtime" label="最近报废日期"></el-table-column>
      <el-table-column sortable min-width="150" align="center" property="gRemark" label="备注"></el-table-column>
    </el-table>
    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="6" v-if="form.rApprovalstatus==3 && form.rStatus!=19">
        <el-input
          v-model="receiptFinancial[0].fsBankname"
          size="small"
          readonly
          :disabled="disAmount"
        >
          <template slot="prepend">收款账户</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="!disAmount && showDialog('showSelectBankAccount')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="0" v-model="Totalprice" size="small" disabled>
          <template slot="prepend">收款金额</template>
          <!-- <span slot="suffix" class="icon-quan" @click="setAll">全</span>
          <span slot="suffix" class="icon-qing" @click="setClear">清</span>-->
        </el-input>
      </el-col>
      <!-- <el-col :xs="24" :sm="6">
        <el-input
          placeholder="0"
          v-model="receiptFinancial[0].PendingMoney"
          size="small"
          :disabled="true"
        >
          <template slot="prepend">待收金额</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="0" v-model="receiptFinancial[0].cqys" size="small" :disabled="true">
          <template slot="prepend">此前预收</template>
        </el-input>
      </el-col>-->
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has="367">
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
                <span>原始金额</span>
                <span>￥</span>
                <span>{{ $PublicJS.money(form.rTotalprice, 2) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div v-if="!$router.history.current.query.from">
            <div class="toolright" v-if="hideAllBtn">
              <div class="jizhang" @click="btnSubmit('SP')" v-if="form.rApprovalstatus!=3 ">
                <p style="padding:0 30px">提交审批</p>
              </div>
              <div
                class="jizhang"
                @click="btnSubmit('Settle')"
                v-if="form.rApprovalstatus==3"
                v-has="512"
              >
                <p style="padding:0 30px">记账</p>
              </div>
            </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <img
      v-if="form.rBillingstatus==1"
      src="../../../../public/images/finish.png"
      alt
      class="finish"
    />
    <el-dialog
      title="收款账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData" code="YHZH"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="选择审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="60%"
    >
      <el-dialog
        title="经手人选择"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showSelectUser"
        width="60%"
        append-to-body
      >
        <selectUser @emitUserData="getUserData"></selectUser>
      </el-dialog>
      <examine
        :rtype="58"
        @close="dialogSubmit"
        @openuser="openuser"
        :ID="dingding"
        :ID1="dingding1"
      ></examine>
    </el-dialog>
    <!-- <el-dialog title="设置表格" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showtable" width="30%">
      <settTable @settTable="settTable"></settTable>
    </el-dialog>-->
  </div>
</template>
<script>
import selectUser from "../../../components/dialog/SelectUser";
// import settTable from "../../../components/settTable/settTable";
import selectBankAccount from "../../../components/dialog/SelectBankAccount";
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    selectUser,
    // settTable,
    selectBankAccount
  },
  data() {
    return {
      defStyle: "ipt tc bgc",
      hideAllBtn: true,
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      ConstructionData: [],
      Conoptions: [],
      contact: [],
      rowindex: "",
      icon: "",
      disAmount: false,
      disabled: true,
      showSelectUser: false,
      img: "",
      showexamine: false,
      showtable: false,
      showSelectBankAccount: false,
      orderBH: "",
      orderID: "",
      Totalprice: 0,
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 结算信息
      receiptFinancial: [
        {
          fsAmount: 0, //收款金额
          fsRid: "", //单据编号
          fsBankname: "",
          fsBankaccount: "",
          cqys: 0,
          ysye: 0,
          fsUsepremoney: 0,
          PendingMoney: 0
        }
      ],
      loading:'',
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
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
        rCuidv: "",
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
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
          if (items.rBillingstatus == 1 || items.rApprovalstatus == 2) {
            this.disabled = true;
            this.hideAllBtn = false;
            this.disAmount = true;
          }
          this.receiptFinancial[0].PendingMoney = items.rTotalprice;
          // 结算回显
          this.$api.Financialsettle.get({ rid: items.rRootid }).then(res => {
            if (res.data.length) {
              res.data.map(item => {
                this.receiptFinancial[0].cqys += item.fsAmount;
              });
              // this.receiptFinancial[0].PendingMoney =
              //   items.rTotalprice - this.receiptFinancial[0].cqys;

              // if (items.rTotalprice == this.receiptFinancial[0].cqys) {
              //   this.disAmount = true;
              // }
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
              this.tableData.push(item);
            });
            this.form = items;
          });
        }
      });
    },
    openuser(val) {
      this.dataType = val;
      this.showSelectUser = true;
    },
    // 提交
    btnSubmit(val) {
      if (val == "SP") {
        this.showexamine = true;
      } else {
        if (!this.receiptFinancial[0].fsBankname) {
          this.$message("请选择收款账户");
          return false;
        }
        this.$confirm("是否记账?", "提示", {
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
      }
    },
    // 提交
    dialogSubmit(val, val1) {
      if (val) {
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
            item.rdIotype = 1;
            tableData.push(item);
          }
        });
        this.form.rDate = getDate.getToday().starttime.replace(/\-/g, "");
        delete this.form.rStatus;
        delete this.form.rstatusv;
        delete this.form.rFile;
        delete this.form.rCuid;
        let params = {
          approve: val == "Settle" ? false : true, //是否发起审批
          approvers: val == "Settle" ? [] : val, //钉钉审批人ID
          receiptDtsList: tableData, //商品
          receiptInfoVO: this.form //单据信息
        };
        if (val1 && val1.length) params.cc = val1;
        if (val == "Settle") {
          params.billingAmount = this.Totalprice;
          // params.billingDiv = 1;
          this.receiptFinancial[0].fsRid = this.form.rRootid;
          this.receiptFinancial[0].fsAmount = this.Totalprice;
          params.receiptFinancial = this.receiptFinancial;
          params.receiptInfoVO.rTotalprice = this.Totalprice;
          params.receiptInfoVO.rBillingstatus = 1;
          params.receiptInfoVO.rStatus = 19;
        } else {
          params.receiptInfoVO.rBillingstatus = 0;
          params.receiptInfoVO.rStatus = 32;
        }
        // 保存报价单
        this.$api.Receipt.saveall(params).then(res => {
          loading.close();
          if (res.code === 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$router.push("/warehouse/inventory/scrappedSettleList");
          } else {
            this.$message(res.err);
          }
        });
      }
      this.showexamine = false;
    },
    setAll() {
      this.receiptFinancial[0].fsAmount =
        Number(this.form.rTotalprice) - Number(this.receiptFinancial[0].cqys);
      this.disAmount = true;
    },
    setClear() {
      if (this.receiptFinancial[0].cqys != this.form.rTotalprice) {
        this.disAmount = false;
      }
      this.receiptFinancial[0].fsAmount = 0;
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
          column.property === "sumdisc" ||
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
            this.Totalprice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.form.TotalGood = parseFloat((sums[index]).toPrecision(12));
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
    searchbox(e, val) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.icon = "";
        this.showSelectClient = true;
      }
    },

    // 弹窗
    showDialog(val) {
      this[val] = true;
    },

    setimg(u) {
      this.img = u;
    },
    // 经手人
    getUserData(val) {
      if (val && this.dataType == 1) {
        this.dingding = val;
      } else if (val) {
        this.dingding1 = val;
      }
      this.showSelectUser = false;
    },
    // 银行账户
    getBankAccountData(val) {
      if (val) {
        this.receiptFinancial[0].fsBankname = val.cAttrvalue;
        this.receiptFinancial[0].fsBankaccount = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    // settTable() {
    //   this.reload();
    //   this.showtable = false;
    //   this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
    // },
    // 刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
</style>
