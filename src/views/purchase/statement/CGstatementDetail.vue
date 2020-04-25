<template>
  <div ref="quotationsheet" v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber" v-if="BH">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <span class="title">采购结算</span>
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
          <template slot="prepend">入库仓库</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rHandmanv" size="small" readonly disabled>
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
      height="520px"
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
      <el-table-column sortable property="rdQuantity" label="数量"></el-table-column>
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
      <el-table-column sortable property="gRemark" label="备注"></el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20" v-if="form.rBillingstatus!=1&&form.rApprovalstatus==3">
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.pFamount" size="mini" disabled>
          <template slot="prepend">预付余额</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24" v-if="form.pFamount!=TotalPrice&&!form.rBillingstatus!=1">
        <el-button size="mini" type="primary" @click="toamount('/financePay')">预付</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="mini">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="5" :xs="24">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture"
          :auto-upload="false"
          :limit="5"
          multiple
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :http-request="uploadImg"
        >
          <el-button size="mini" type="primary" v-if="form.rBillingstatus!=1">上传单据附件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <div class="flies" v-for="(url,i) in fileList" :key="i">
      <img
        width="140"
        @click="openlink(`${baseUrl}api${url}`)"
        v-if="url.indexOf('jpg')>=1||url.indexOf('png')>=1||url.indexOf('gif')>=1"
        :src="`${baseUrl}api${url}`"
        class="pointer"
      />
      <a v-else href="javascript:void(0);" @click="openlink(`${baseUrl}api${url}`)" title="文档连接">
        <i style="font-size:104px" class="fa fa-file-text-o"></i>
      </a>
    </div>
    <br />
    <img v-if="form.rStatus==19" src="../../../../public/images/finish.png" alt class="finish" />
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
    <my-footer
      :number="number"
      :Totalamount="$PublicJS.money(TotalPrice, 2)"
      @opendialog="openDD(form.rApprovalstatus==3?1:0)"
      :BtnText="form.rApprovalstatus==3?'单据完结':'单据审核'"
      :hideBtn1="false"
      :hideBtn2="form.rBillingstatus!=1&&form.rApprovalstatus!=2&&form.rStatus!=31"
      v-has="4041"
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
      <examine @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
    <el-dialog
      title="账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectBankAccount1"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBank"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="物流"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectLogistics"
      width="60%"
    >
      <selectLogistics @emitLogisticsData="getLogisticsData"></selectLogistics>
    </el-dialog>
  </div>
</template>

<script>
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import examine from "@/components/dialog/examine";
import selectLogistics from "@/components/dialog/SelectLogistics";
import selectUser from "@/components/dialog/SelectUser";
import { truncate } from "fs";
export default {
  inject: ["reload"],
  components: {
    examine,
    selectBankAccount,
    selectLogistics,
    selectUser
  },
  data() {
    return {
      tableData: [],
      i: 0,
      formData: null,
      fileList: [],
      form: {
        pFamount: 0,
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
        rCid: "",
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rFile: [],
        rStatus: 2,
        rEstdelivery: this.$PublicJS.nowDate(),
        rTotalprice: 0,
        rBillingstatus: "0",
        rLogistics: "",
        pFamount: 0,
        rShipmentnumber: "",
        billingAmount: 0,
        billingDiv: 1
        // rCuserid: this.$storage.userName
      },
      activeName: "wuliu",
      fsAmount: 0,
      showSum: true,
      currentRow: null,
      icon: "",
      showselectBankAccount1: false,
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
      img: "",
      load: false,
      loading: {}
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
    this.loading = this.$loading({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.getPurchase();
    } else {
      this.$router.push("/quotationsheetList");
    }
  },
  methods: {
    getPurchase() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.BH = res.data.records[0].rItemnum;
        this.form = res.data.records[0];
        if (this.form.rApprovalstatus == 0) this.form.rApprovalstatus = 3;
        if (this.form.rFile) {
          this.form.rFile = JSON.parse(this.form.rFile);
          this.fileList = this.form.rFile;
        } else {
          this.form.rFile = [];
        }
        this.$api.Premoney.get({ cuid: this.form.rCuid }).then(res => {
          if (res.data.length) {
            this.form.pFamount = res.data[0].pFamount;
          } else {
            this.form.pFamount = 0;
          }
        });
        this.getrCid({ cuid: this.form.rCuid });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.loading.close();
          this.load = true;
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
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    setimg(url) {
      this.img = url;
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
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cAttrvalue;
      }
      this.showSelectLogistics = false;
    },
    getBank(val) {
      this.showselectBankAccount1 = false;
    },
    toamount(url) {
      this.$router.push({
        path: url,
        query: { ID: this.form.rCuid, rid: this.rId }
      });
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
    openlink(url) {
      window.open(url, "_blank");
    },
    handleExceed() {},
    handleChange() {},
    handleRemove() {},
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
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
    openDD(val) {
      if (val) {
        if (this.form.pFamount < this.TotalPrice) {
          this.$confirm("预付款和应付款有差异, 是否继续?", "提示", {
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
        this.showDD = true;
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.form.rDate = this.nowdata;
      this.formData = new FormData();
      this.$refs.upload.submit();
      let params = {
        approve: data == "false" ? false : true,
        approvers: data == "false" ? null : data,
        receiptDtsList: [],
        receiptInfoVO: this.form
      };
      if (this.form.rApprovalstatus == 3) {
        this.form.rBillingstatus = 1;
        this.form.rStatus = 19;
        params.billingDiv = 2;
        if (this.form.pFamount <= 0) {
          params.billingAmount = 0;
        }else{
          params.billingAmount = this.form.pFamount>this.TotalPrice?this.TotalPrice:this.form.pFamount;
        }
      }
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        let obj = item;
        item.rdGid = item.gId;
        item.rdSellingprice = item.iSellingprice;
        item.rdRemark = item.gRemark;
        params.receiptDtsList.push(item);
      });
      this.showDD = false;
      let filedata = [];
      this.$ajax.post("/system/upload", this.formData).then(res => {
        if (res.data.code === 200) {
          if (Object.values(res.data.data).length) {
            Object.values(res.data.data).map(item => {
              filedata.push(`/file/${item}`);
              params.receiptInfoVO.rFile.push(`/file/${item}`);
            });
          }
          params.receiptInfoVO.rFile = JSON.stringify(
            params.receiptInfoVO.rFile
          );
          this.$api.Receipt.saveall(params).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push("/CGstatementList");
            } else {
              this.$message("提交失败");
            }
          });
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