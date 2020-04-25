// 报价单
<template>
  <div ref="quotationsheet" v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">采购换货结算</p>
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
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rCuidv" size="small" disabled>
          <template slot="prepend">供应商</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rWhidv" size="small" disabled>
          <template slot="prepend">出入库仓库</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rHandmanv" size="small" disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCid"
          placeholder="请选择联系人"
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
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-input v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">联系地址</template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      ref="singleTable"
      :data="tableData"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
      size="mini"
      :height="rId?null:'300px'"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计"
    >
      <el-table-column type="index" width="55" label="序号"></el-table-column>
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
      <el-table-column sortable property="gName" label="商品名称"></el-table-column>
      <el-table-column sortable property="rdQuantity" label="退货数量"></el-table-column>
      <el-table-column sortable align="center" property="gUnitv" label="单位"></el-table-column>
      <el-table-column sortable property="iSellingprice" label="单价"></el-table-column>
      <el-table-column sortable label="金额" property="money">
        <template v-if="money">{{money}}</template>
      </el-table-column>
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
      <el-table-column sortable property="gRemark" label="备注">
        <template slot-scope="scope">
          <input
            v-if="scope.row.gRemark"
            type="text"
            v-model="scope.row.gRemark"
            class="ipt"
            readonly
          />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-table
      ref="singleTable"
      :data="tableData1"
      border
      highlight-current-row
      @current-change="handleCurrentChange1"
      style="width: 100%"
      size="mini"
      :height="rId?null:'300px'"
      :show-summary="true"
      :summary-method="getSummaries1"
      sum-text="合计"
    >
      <el-table-column type="index" width="55" label="序号"></el-table-column>
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
      <el-table-column sortable property="gName" label="商品名称"></el-table-column>
      <el-table-column sortable property="rdQuantity" label="购买数量"></el-table-column>
      <el-table-column sortable align="center" property="gUnitv" label="单位"></el-table-column>
      <el-table-column sortable property="iSellingprice" label="单价"></el-table-column>
      <el-table-column sortable label="金额" property="money">
        <template v-if="money1">{{money1}}</template>
      </el-table-column>
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
      <el-table-column sortable property="gRemark" label="备注">
        <template slot-scope="scope">
          <input
            v-if="scope.row.gRemark"
            type="text"
            v-model="scope.row.gRemark"
            class="ipt"
            readonly
          />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20" v-if="form.rBillingstatus!=1">
      <el-col :sm="4" :xs="24" v-if="TotalPrice3<0">
        <el-input v-model="form.pFamount" size="mini" disabled>
          <template slot="prepend">预付余额</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24" v-else>
        <el-input v-model="form.pSamount" size="mini" disabled>
          <template slot="prepend">预收余额</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24" v-if="form.rBillingstatus!=1">
        <el-button
          v-if="TotalPrice3>0&&form.pSamount<Math.abs(TotalPrice3)"
          size="mini"
          type="primary"
          @click="toamount('/financeAdd')"
        >预收</el-button>
        <el-button
          v-if="TotalPrice3<0&&form.pFamount<Math.abs(TotalPrice3)"
          size="mini"
          type="primary"
          @click="toamount(`/financePay`)"
        >预付</el-button>
      </el-col>
    </el-row>
    <el-col :gutter="20">
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="mini" :disabled="form.rStatus!=17">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-col>
    <br />
    <img v-if="form.rStatus==19" src="../../../../public/images/finish.png" alt class="finish" />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <my-footer
      :Totalamount="$PublicJS.money(Math.abs(TotalPrice3), 2)"
      :number="number"
      :BtnText="form.rApprovalstatus==3?'确认结算':'提交审核'"
      @opendialog="openDD(form.rApprovalstatus!=3?1:2)"
      :hideBtn2="form.rBillingstatus!=1&&form.rApprovalstatus!=2&&form.rStatus!=31"
      :hideBtn1="false"
      v-has="4061"
    ></my-footer>
    <el-dialog
      title="商品信息选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <selectGoods @emitGoodsData="getGoodsData" :show="false"></selectGoods>
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
      <examine :rtype="11" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
    <el-dialog
      title="账户选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectBankAccount1"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBank"></selectBankAccount>
    </el-dialog>
  </div>
</template>

<script>
import { truncate } from "fs";
import { constants } from "crypto";
import selectClient from "@/components/dialog/SelectClient";
import selectWarehouse from "@/components/dialog/SelectWarehouse";
import selectGoods from "@/components/dialog/SelectGoods";
import selectUser from "@/components/dialog/SelectUser";
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import examine from "@/components/dialog/examine";
import selectLogistics from "@/components/dialog/SelectLogistics";
export default {
  inject: ["reload"],
  components: {
    selectClient,
    selectWarehouse,
    selectGoods,
    examine,
    selectUser,
    selectBankAccount,
    selectLogistics
  },
  data() {
    return {
      tableData: [],
      tableData1: [{}, {}, {}, {}, {}],
      tableData3: [],
      form: {
        rCuidv: "", //客户
        rCuid: "",
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "", //仓库
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        warehouseNum:
          this.$storage.warehouseNum > 1 || this.$storage.warehouseNum != null
            ? true
            : false,
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId,
        rRemark: "", //备注
        rType: 11,
        rCid: "",
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rStatus: 2,
        rEstdelivery: this.$PublicJS.nowDate(),
        rTotalprice: 0,
        rBillingstatus: "0",
        rLogistics: "",
        pFamount: 0,
        pSamount: 0,
        billingDiv: 0,
        rShipmentnumber: ""
        // rCuserid: this.$storage.userName
      },
      img: "",
      activeName: "wuliu",
      fsAmount: 0,
      showSum: true,
      showSum1: true,
      currentRow: null,
      showSelectUser: false,
      icon: "",
      showSelectClient: false,
      showselectWarehouse: false,
      showselectGoods: false,
      showselectBankAccount1: false,
      showSelectLogistics: false,
      rowindex: 0,
      TotalPrice: 0,
      TotalPrice1: 0,
      number: 0,
      BH: null,
      rId: null,
      showDD: false,
      showexamine: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      contact: [],
      param: {},
      nowdata: "",
      daifu: 0,
      status: true,
      times: "",
      load: false,
      loading: {}
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        if (item.rdQuantity && item.iSellingprice) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    money1: function() {
      this.tableData1.map(item => {
        if (item.rdQuantity && item.iSellingprice) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    TotalPrice3: function() {
      return this.TotalPrice - this.TotalPrice1;
    }
  },
  created() {
    this.loading = this.$loading({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.times = this.$PublicJS.nowDate();
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.getPurchase();
    } else {
      this.$router.push("/quotationsheetList");
    }
  },
  mounted() {},
  methods: {
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]); //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    getPurchase() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.BH = res.data.records[0].rItemnum;
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.loading.close();
          this.load = true;
          this.tableData = [];
          this.tableData1 = [];
          res.data.map((item, index) => {
            if (!item.rdQuantity) return false;
            item.iQuantity = item.rdQuantity;
            item.gConstructcostweight = item.rdConstructcostweight;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 1) {
              this.tableData.push(item);
            } else if (item.rdIotype == 2) {
              this.tableData1.push(item);
            } else {
              this.tableData.push(item);
            }
          });
          this.tableData = this.deepCopy(this.tableData);
          this.tableData1 = this.deepCopy(this.tableData1);
        });
        this.form = JSON.parse(JSON.stringify(res.data.records[0]));
        this.$api.Premoney.get({ cuid: this.form.rCuid }).then(res => {
          if (res.data.length) {
            this.form.pSamount = res.data[0].pSamount;
            this.form.pFamount = res.data[0].pFamount;
          }
        });
        this.getrCid({ cuid: this.form.rCuid });
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
    },
    setimg(url) {
      this.img = url;
    },
    hiddenicon(e) {
      if (e.target.nextElementSibling) {
        this.icon = e.target.nextElementSibling;
        e.target.nextElementSibling.style.opacity = "1";
      }
    },
    showicon(e) {
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.opacity = "0";
      }
    },
    getUserData(val) {
      if (val) {
        this.form.rHandman = val.uId;
        this.form.rHandmanv = val.uName;
      }

      this.showSelectUser = false;
    },
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cAttrvalue;
      }
      this.showSelectLogistics = false;
    },
    getBank(val) {
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
            column.property === "money") ||
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
          if (column.property === "money") {
            this.TotalPrice = parseFloat((sums[index]).toPrecision(12));
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
    getSummaries1(param) {
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
            column.property === "money") ||
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
          if (column.property === "money") {
            this.TotalPrice1 = parseFloat((sums[index]).toPrecision(12));
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
    opendialog(n) {
      this[n] = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleCurrentChange1(val) {
      this.currentRow = val;
    },
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    deldate1(index) {
      if (this.tableData1.length > 1) {
        this.tableData1.splice(index, 1);
      }
    },
    toamount(url) {
      this.$router.push({
        path: url,
        query: { ID: this.form.rCuid, rid: this.rId }
      });
    },
    getGoodsData(val) {
      if (val) {
        val.rdQuantity = 1;
        if (!val.iSellingprice) {
          val.iSellingprice = 20;
        }
        const data = JSON.parse(JSON.stringify(val));
        this.tableData1.splice([this.rowindex], 1, data);
      }
      this.showselectGoods = false;
    },
    openDD(val) {
      if (val == 1) return (this.showDD = true);
      if (this.TotalPrice3 < 0) {
        this.form.billingDiv = 2;
        if (this.form.pFamount != this.form.billingAmount) {
          this.$confirm("预付余额与本单金额不符, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.close("false");
            })
            .catch(() => {});
        } else {
          this.$confirm("确认结算吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.close("false");
            })
            .catch(() => {});
        }
      } else {
        this.form.billingDiv = 1;
        if (this.form.pSamount < this.TotalPrice) {
          this.$confirm("预收款与本单金额不符, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.close("false");
            })
            .catch(() => {});
        } else {
          this.$confirm("确认结算吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.close("false");
            })
            .catch(() => {});
        }
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.form.rDate = this.nowdata;
      delete this.form.rFile;
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form,
        billingDiv: this.form.billingDiv,
        billingAmount: 0
      };
      if (params.billingDiv == 1) {
        params.billingAmount =
          this.form.pSamount < this.TotalPrice3
            ? this.form.pSamount
            : this.TotalPrice3;
      }
      if (params.billingDiv == 2) {
        params.billingAmount =
          this.form.pFamount < this.TotalPrice3
            ? this.form.pFamount
            : this.TotalPrice3;
      }
      if (!params.approve) {
        params.receiptInfoVO.rBillingstatus = 1;
        params.receiptInfoVO.rStatus = 19;
      } else {
        delete params.billingDiv;
        delete params.billingAmount;
      }
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        if (item.rdQuantity) {
          let obj = {};
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rRemark = item.rRemark;
          obj.rdIotype = 1;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData1.forEach((item, index) => {
        if (item.rdQuantity) {
          let obj = {};
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdSellingprice = item.iSellingprice;
          obj.rRemark = item.rRemark;
          obj.rdIotype = 2;
          params.receiptDtsList.push(obj);
        }
      });
      this.showDD = false;
      this.$api.Receipt.saveall(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/HHstatementList");
        } else {
          this.$message("提交失败");
        }
      });
    }
  }
};
</script>
<style scoped>
</style>