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
        <p class="title">分公司调拨单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input
          placeholder="出库仓库"
          v-model="form.rWhidv"
          size="small"
          :disabled="disabled"
          readonly
        >
          <template slot="prepend">
            <b class="red asterisk">*</b>出库仓库
          </template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectOUTWarehouse')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input
          placeholder="入库仓库"
          v-model="form.rWhidtransferv"
          size="small"
          :disabled="disabled"
          readonly
        >
          <template slot="prepend">
            <b class="red asterisk">*</b>入库仓库
          </template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectINWarehouse')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input
          placeholder="经手人"
          v-model="form.rHandmanv"
          size="small"
          :disabled="disabled"
          readonly
        >
          <template slot="prepend">经手人</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectUser')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" :disabled="true">
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
      <el-table-column
        sortable
        show-overflow-tooltip
        type="index"
        width="55"
        align="center"
        property="index"
        label="序号"
      ></el-table-column>
      <el-table-column
        sortable
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
      <el-table-column sortable align="center" property="gName" width="150" label="商品名称">
        <template slot-scope="scope">
          <input
            type="text"
            @blur="showicon($event)"
            @focus="hiddenicon($event)"
            v-model="scope.row.gName"
            class="ipt"
            readonly
            :disabled="disabled"
          />
          <i class="fa fa-search searchname" @click="searchbox($event,scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
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
        label="副台"
      ></el-table-column>
      <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="调拨数量">
        <template slot-scope="scope" v-if="scope.row.gItemnum">
          <input
            type="text"
            v-model="scope.row.rdQuantity"
            :class="defStyle"
            :disabled="disabled"
            @blur="iptBlur(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
      <el-table-column sortable width="80" align="center" property="gUnitv" label="单位"></el-table-column>
      <!-- <el-table-column sortable width="100" align="center" property="iUnitprice" label="成本价" v-if="falas"></el-table-column>
      <el-table-column sortable width="100" align="center" property="iUnitpriceSUM" label="成本金额" v-if="falas">
        <template
          slot-scope="scope"
          v-if="scope.row.rdQuantity"
        >{{ (scope.row.iUnitprice * scope.row.rdQuantity).toFixed(2)}}</template>
      </el-table-column>-->
      <el-table-column sortable width="150" align="center" property="iSellingprice" label="调拨价">
        <template slot-scope="scope" v-if="scope.row.gName">
          <input
            type="text"
            v-model="scope.row.iSellingprice"
            class="ipt tc bgc"
            @blur="iptBlur(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="gNewoldv" label="新旧程度"></el-table-column>
      <el-table-column sortable width="120" align="center" property="gCtime" label="最近销售日期">
        <template slot-scope="scope" v-if="scope.row.gCtime">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.gCtime.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable min-width="150" align="center" property="gRemark" label="备注">
        <template slot-scope="scope" v-if="scope.row.gId">
          <input type="text" v-model="scope.row.gRemark" :class="defStyle" :disabled="disabled" />
        </template>
      </el-table-column>
    </el-table>
    <div class="mt10">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
            <template slot="prepend">单据备注</template>
          </el-input>
        </el-col>
        <br />
      </el-row>
    </div>
    <br />
    <br />
    <div class="bigbox" v-if="form.rStatus==19||form.rType==60">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <br />
    <my-footer
      :Totalamount="$PublicJS.money(form.rTotalprice, 2)"
      title="本单金额:"
      :BtnText="'提交审核'"
      :centertext="false"
      @opendialog="opendialog({ss:false})"
      @ctrls="opendialog({ss:true})"
      :hideBtn1="!form.rApprovalstatus || form.rApprovalstatus==4"
      :hideBtn2="!form.rApprovalstatus || form.rApprovalstatus==4"
      v-has="363"
    ></my-footer>
    <el-dialog
      title="出库仓库选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectOUTWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getOUTWarehouseData" :oid="$storage.companyId"></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="入库仓库选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectINWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getINWarehouseData" :hasdef="$storage.companyId"></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="职员选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>

    <el-dialog
      title="商品选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectGoods"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsData"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :idList="idList"
      ></selectGoods>
    </el-dialog>
    <el-dialog
      title="审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="50%"
    >
      <el-dialog
        title
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showDD"
        width="60%"
        append-to-body
      >
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine
        :rtype="45"
        @close="dialogSubmit"
        @openuser="openuser"
        :ID="dingding"
        :ID1="dingding1"
      ></examine>
    </el-dialog>
  </div>
</template>
<script>
import selectWarehouse from "../../components/dialog/SelectWarehouse";
import selectUser from "../../components/dialog/SelectUser";
import selectGoods from "../../components/dialog/SelectGoods";
import getDate from "../../utils/getDate";
export default {
  name: "XStransferApplication",
  inject: ["reload"],
  components: {
    selectWarehouse,
    selectUser,
    selectGoods
  },
  data() {
    return {
      tableData: [],
      icon: "",
      defStyle: "ipt tc bgc",
      idList: [],
      rowindex: "",
      disabled: false,
      hasAmount: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      showSelectOUTWarehouse: false,
      showSelectINWarehouse: false,
      showSelectUser: false,
      showSelectGoods: false,
      showexamine: false,
      showDD: false,
      orderBH: null,
      orderID: null,
      img: "",
      form: {
        rDate: "",
        rWhidtransfer: "",
        rWhidtransferv: "",
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId,
        rRemark: "",
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "",
        rType: 0,
        rTotalprice: 0,
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
      },
      TotalGood: 0,
      loading: ""
    };
  },
  created() {
    this.form.rType = 45;
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
      for (let i = 0; i < 5; i++) {
        this.tableData.push({
          rdQuantity: null,
          iQuantity: null,
          iQuantitycanout: null,
          iSellingprice: null,
          rdDiscount: null
        });
      }
      this.form.rDate = this.$PublicJS.nowDate();
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
    // 回显
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
          if (items.rApprovalstatus != 0 || items.rStatus == 19) {
            this.disabled = true;
            this.hideAllBtn = false;
            this.defStyle = "tc ipt";
          }
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods({
            rid: items.rId,
            whid: items.rWhid
          }).then(res => {
            this.loading.close();
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
            });
            this.tableData = res.data;
          });
          if (
            items.rStatus == 19 ||
            items.rApprovalstatus == 2 ||
            items.rType == 60
          ) {
            this.disabled = true;
          }

          this.form = items;
        }
      });
    },
    // 提交
    opendialog(val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择出库仓库", type: "warning" });
        return false;
      }
      if (!this.form.rWhidtransferv) {
        this.$message({ message: "请选择入库仓库", type: "warning" });
        return false;
      }
      if (!this.form.rHandmanv) {
        this.$message({ message: "请选择经手人", type: "warning" });
        return false;
      }
      if (!this.TotalGood) {
        this.$message({ message: "请选择商品", type: "warning" });
        return false;
      }
      if (
        this.form.rWhidv &&
        this.form.rWhidtransferv &&
        this.form.rHandmanv &&
        this.TotalGood
      ) {
        if (!val.ss) {
          this.showexamine = true;
        } else if (!val.ss) {
          this.dialogSubmit("true");
        } else {
          this.dialogSubmit("false");
        }
      }
    },
    setimg(url) {
      this.img = url;
    },
    // 审核提交
    dialogSubmit(val, val1) {
      if (!val) return (this.showexamine = false);
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let tableData = [];
      let num = 0;
      let goodsName = "";
      this.tableData.map(item => {
        if (item.gName) {
          if (!num) {
            let obj = {
              wareHouseId: this.form.rWhid,
              goodsId: item.gId,
              goodsCount: item.rdQuantity
            };
            this.$api.Warehouse.getGoodsStockAvailable(obj).then(res => {
              if (res.data.resultStr.status == "N") num = 1;
              goodsName = res.data.resultStr.name;
            });
          }
          item.rdGid = item.gId;
          item.gCtime = item.gCtime.split("T")[0].replace(/\-/g, "");
          item.rdSellingprice = item.iSellingprice;
          item.rdIotype = 1;
          tableData.push(item);
        }
      });
      if (num) return this.$message.error(`${goodsName}可用库存不足`);
      let params = {
        approve: true, //是否发起审批
        approvers: val, //钉钉审批人ID
        receiptDtsList: tableData, //商品
        receiptInfoVO: this.form //单据信息
      };
      params.receiptInfoVO.rDate = this.$PublicJS.nowDate();
      if (val1 && val1.length) params.cc = val1;
      if (val === "false") {
        params.approvers = [];
        params.approve = false;
        params.receiptInfoVO.rStatus = 30;
      } else {
        params.receiptInfoVO.rStatus = 19;
      }
      delete params.receiptInfoVO.rCid;
      delete params.receiptInfoVO.rCaddr;
      delete params.receiptInfoVO.rCmobile;
      delete params.receiptInfoVO.rCuidv;
      delete params.receiptInfoVO.rGetguestv;
      delete params.receiptInfoVO.rcuseridv;
      delete params.receiptInfoVO.rFile;
      this.$api.Receipt.saveall(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({ message: "提交成功", type: "success" });
          this.$router.push("/XStransfer/XStransferList");
        } else {
          this.$message.error(res.err);
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/XStransfer/printingTransfer?data=${data}`, "_blank");
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
          }
          if (column.property === "rdQuantity") {
            this.TotalGood = parseFloat(sums[index].toPrecision(12));
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
    iptBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if (Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        } else if (Number(val.rdQuantity) > Number(val.iQuantitycanout)) {
          val.rdQuantity = val.iQuantitycanout;
          this.$message("数量不得大于可用库存");
        }
      } else {
        val.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    searchbox(e, val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (e.target === this.icon) {
          this.tableData.map(item => {
            if (item.gId && !this.idList.includes(item.gId)) {
              this.idList.push(item.gId);
            }
          });
          this.icon = "";
          this.showSelectGoods = true;
        }
      }
    },
    // 新增一行
    adddate(val) {
      if (val) {
        this.ConstructionData.push({});
      } else {
        this.tableData.push({});
      }
    },
    // 删除当前选中这行
    deldate(index, val) {
      if (val) {
        if (this.ConstructionData.length > 1) {
          this.ConstructionData.splice(index, 1);
        }
      } else {
        if (this.tableData.length > 1) {
          this.tableData.splice(index, 1);
        }
      }
    },
    // 图标显示隐藏
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
    },
    showicon(e) {
      e.target.nextElementSibling.style.opacity = "0";
    },
    // 商品
    getGoodsData(val) {
      if (this.tableData[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          item.iSellingprice = item.iUnitprice;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.tableData[this.rowindex + i] &&
              this.tableData[this.rowindex + i].gId
            ) {
              this.tableData.push(data);
            } else {
              this.tableData.splice(this.rowindex + i, 1, data);
            }
          } else {
            this.tableData.splice(this.rowindex + i, 1, data);
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        val.iSellingprice = val.iUnitprice;
        const data = JSON.parse(JSON.stringify(val));
        this.tableData.splice(this.rowindex, 1, data);
      }
      this.showSelectGoods = false;
    },
    // 经手人
    getUserData(val) {
      if (val) {
        this.form.rHandman = val.uId;
        this.form.rHandmanv = val.uName;
      }

      this.showSelectUser = false;
    },
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showDD = false;
    },
    openuser(val) {
      this.dataType = val;
      this.showDD = true;
    },
    // 物流
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cuName;
      }
      this.showSelectLogistics = false;
    },
    // 银行账户
    getBankAccountData(val) {
      if (val) {
        this.receiptFinancial[0].fsSubjectname = val.cAttrvalue;
        this.receiptFinancial[0].fsSubjectnum = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    // 仓库
    getINWarehouseData(val) {
      if (val) {
        this.form.rWhidtransfer = val.whId;
        this.form.rWhidtransferv = val.whName;
      }
      this.showSelectINWarehouse = false;
    },
    getOUTWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showSelectOUTWarehouse = false;
    }
  }
};
</script>
<style scoped>
</style>

