<template>
  <div ref="quotationsheet" v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">采购退货申请</p>
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
        <el-input v-model="form.rCuidv" size="small" readonly disabled>
          <template slot="prepend">供应商</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">出库仓库</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select v-model="form.rCid" placeholder="请选择联系人" size="small" disabled>
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
      height="520px"
      :show-summary="true"
      :summary-method="getSummaries"
      sum-text="合计"
      header-cell-class-name="thbgc"
    >
      <el-table-column sortable align="center" type="index" width="55" label="序号"></el-table-column>
      <el-table-column sortable
        align="center"
        show-overflow-tooltip
        property="tools"
        label="操作"
        width="80"
        v-if="!showbank"
      >
        <template slot-scope="scope">
          <i class="el-icon-circle-close del" @click="deldate(scope.$index)" v-if="!showbank"></i>
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
      <el-table-column sortable align="center" property="gName" label="商品名称"></el-table-column>
      <el-table-column sortable align="center" property="iQuantity" label="已购数量" v-if="form.rType==8"></el-table-column>
      <el-table-column sortable align="center" property="gUnitv" label="单位"></el-table-column>
      <el-table-column sortable align="center" property="rdQuantity" label="退货数量">
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>退货数量</span>
        </template>
        <template slot-scope="scope">
          <input
            type="text"
            v-model="scope.row.rdQuantity"
            @blur="setnum(scope.row)"
            class="ipt tc"
            :readonly="showbank"
          />
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="iSellingprice" label="单价"></el-table-column>
      <el-table-column sortable align="center" label="金额" property="money">
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
      <el-table-column sortable align="center" property="gRemark" label="备注">
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>备注</span>
        </template>
        <template slot-scope="scope">
          <input type="text" v-model="scope.row.gRemark" class="ipt" />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20">
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="mini">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="bigbox" v-if="form.rType == 10 && (form.rStatus==19||form.rType==30)">
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
    <br />
    <br />
    <br />
    <br />
    <br />
    <my-footer
      :number="number"
      :Totalamount="$PublicJS.money(TotalPrice, 2)"
      @opendialog="openDD({ ss: false })"
      @ctrls="openDD({ ss: true })"
      :hideBtn1="false"
      :hideBtn2="!showbank"
      v-has="4021"
    ></my-footer>
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
      <examine :rtype="10" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
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
        rType: 10,
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
        rShipmentnumber: ""
        // rCuserid: this.$storage.userName
      },
      receiptFinancial: [
        {
          fsRid: null,
          fsSubjectname: "",
          fsSubjectnum: "",
          fsAmount: ""
        }
      ],
      fsAmount: 0,
      img: "",
      activeName: "wuliu",
      showSelectLogistics: false,
      showbank: false,
      showSum: true,
      currentRow: null,
      showSelectUser: false,
      icon: "",
      showSelectClient: false,
      showselectWarehouse: false,
      showselectGoods: false,
      showselectBankAccount1: false,
      showselectBankAccount2: false,
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
      param: {},
      nowdata: "",
      client: {},
      daifu: 0,
      status: true,
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
    }
  },
  watch: {
    showbank: {
      handler: function(newv, oldv) {
        this.showbank = newv;
      }
    }
  },
  created() {
    this.loading = this.$loading({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.nowdata = this.$PublicJS.nowDate();
    this.form.rDate = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.receiptFinancial[0].fsRid = this.form.rRootid;
      this.getPurchase();
    } else {
      this.$router.push("/quotationsheetList");
    }
  },
  mounted() {},
  methods: {
    getPurchase() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.BH = res.data.records[0].rItemnum;
        this.form = res.data.records[0];
        this.$api.Customer.get({ id: this.form.rCuid }).then(res => {
          this.getClientData(res.data.records[0]);
        });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.loading.close();
          this.load = true;
          this.tableData = [];
          res.data.map((item, index) => {
            if (!item.rdQuantity) return false;
            item.iQuantity = item.rdQuantity;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            item.gRemark = item.rdRemark;
            item.gConstructcostweight = item.rdConstructcostweight;
            this.tableData.splice(index, 1, JSON.parse(JSON.stringify(item)));
          });
          if (this.form.rType == 8) {
            let params = `rootid=${this.form.rRootid}&rtype=10`;
            this.$api.Receipt.getReturnNum(params).then(r => {
              if (r.length) {
                this.tableData.map(items => {
                  r.map(item => {
                    if (items.gId == item.gid) {
                      items.iQuantity -= item.quantity;
                      items.rdQuantity -= item.quantity;
                    }
                  });
                });
              }
            });
          }
        });
        if (
          res.data.records[0].rType == 10 &&
          (res.data.records[0].rApprovalstatus == 2 ||
            res.data.records[0].rStatus == 19 ||
            res.data.records[0].rStatus == 31)
        ) {
          this.showbank = true;
        }
        if (res.data.records[0].rType == 30) {
          this.showbank = true;
        }
        if (res.data.records[0].rType == 7) this.form.rStatus = 2;
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    getBank(val) {
      if (val) {
        this.receiptFinancial[0].fsSubjectname = val.cAttrvalue;
        this.receiptFinancial[0].fsSubjectnum = val.cAttrcode;
      }
      this.showselectBankAccount1 = false;
    },
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cAttrvalue;
      }
      this.showSelectLogistics = false;
    },
    setimg(url) {
      this.img = url;
    },
    setnum(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入退货数量");
          e.rdQuantity = e.iQuantity;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = e.iQuantity;
          this.$message("退货数量不得小于1");
        } else if (e.rdQuantity > e.iQuantity) {
          e.rdQuantity = e.iQuantity;
          this.$message("退货数量不得大于采购数量");
        }
      } else {
        e.rdQuantity = e.iQuantity;
        this.$message("请输入数字");
      }
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
    getClientData(val) {
      if (val) {
        this.form.rCuid = val.cuId;
        this.form.rCuidv = val.cuName;
        this.client = val;
        this.getrCid({ cuid: val.cuId });
      }
    },
    getrCid(val) {
      this.contact = [];
      let cAddr =
        (this.client.cuProvincevalue ? this.client.cuProvincevalue : "") +
        (this.client.cuCityvalue ? this.client.cuCityvalue : "") +
        (this.client.cuDistrictvalue ? this.client.cuDistrictvalue : "");
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) return (this.form.rCid = "");
        Items.map((item, index) => {
          if (!index) {
            if (!this.form.rCaddr) {
              this.form.rCaddr = cAddr + item.cAddr;
            }
            this.form.rCmobile = item.cMobile;
            this.form.rCid = item.cId;
          }
          this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: cAddr + item.cAddr
          });
        });
      });
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
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    // 打开审核框
    openDD(val) {
      if (val.ss) {
        this.form.rStatus = 30;
        this.form.rBillingstatus = 0;
        this.close("false");
      } else {
        this.showDD = true;
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.form.rTotalprice = this.TotalPrice;
      if (this.form.rType != 10) {
        delete this.form.rId;
        delete this.form.rItemnumparent;
      }
      if (this.form.rType == 8) this.form.rItemnumparent = this.form.rItemnum;
      delete this.form.rFile;
      this.form.rType = 10;
      this.form.rDate = this.$PublicJS.nowDate();
      let params = {
        approve: data !== "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form
      };
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (params.approve) this.form.rStatus = 2;
      params.receiptInfoVO.rDate = this.nowdata;
      this.tableData.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdRemark = item.gRemark;
          obj.rdIotype = 1;
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
          this.$router.push("/returngoodsList");
        } else {
          this.$message.error("提交失败");
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
