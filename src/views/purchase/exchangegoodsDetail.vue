// 报价单
<template>
  <div ref="quotationsheet" v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">采购换货申请</p>
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
          <template slot="prepend">出入库仓库</template>
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>出库商品</span>
      </div>
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
        header-cell-class-name="thbgc"
      >
        <el-table-column sortable align="center" type="index" width="55" label="序号" fiexd></el-table-column>
        <el-table-column sortable
          align="center"
          show-overflow-tooltip
          property="tools"
          label="操作"
          width="80"
          v-if="!showbank"
          fiexd
        >
          <template slot-scope="scope">
            <i class="el-icon-circle-close del" @click="deldate(scope.$index)" v-show="!showbank"></i>
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
        <el-table-column sortable align="center" property="iQuantity" label="已购数量" v-if="!showbank">
          <template slot-scope="scope">
            <input type="text" :value="scope.row.iQuantity" class="ipt tc" readonly />
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="rdQuantity">
          <template slot="header">
            <i class="el-icon-question bluecolor"></i>
            <span>退货数量</span>
          </template>
          <template slot-scope="scope">
            <input
              type="text"
              minlength="1"
              v-model="scope.row.rdQuantity"
              @blur="setnum(scope.row)"
              class="ipt tc"
              :readonly="showbank"
            />
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="gUnitv" label="单位"></el-table-column>
        <el-table-column sortable align="center" property="iSellingprice" label="单价">
          <template slot-scope="scope">
            <input
              v-if="scope.row.iSellingprice"
              minlength="1"
              type="text"
              v-model="scope.row.iSellingprice"
              @blur="setdanjia(scope.row)"
              class="ipt"
              :readonly="showbank"
            />
          </template>
        </el-table-column>
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
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>入库商品</span>
      </div>
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
        header-cell-class-name="thbgc"
      >
        <el-table-column fiexd align="center" type="index" width="55" label="序号"></el-table-column>
        <el-table-column sortable
          align="center"
          show-overflow-tooltip
          label="操作"
          width="80"
          v-if="!showbank"
          fiexd
        >
          <template slot-scope="scope">
            <i class="el-icon-circle-plus add" @click="adddate()" v-if="!showbank"></i>
            <i class="el-icon-circle-close del" @click="deldate1(scope.$index)" v-if="!showbank"></i>
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
        <el-table-column sortable align="center" property="gName">
          <template slot="header">
            <i class="el-icon-question bluecolor"></i>
            <span>商品名称</span>
          </template>
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.gName"
              @blur="showicon($event)"
              @focus="hiddenicon($event)"
              class="ipt"
              readonly
            />
            <i
              class="fa fa-search searchname"
              v-if="!showbank"
              @click="searchbox($event,scope.$index)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="rdQuantity">
          <template slot="header">
            <i class="el-icon-question bluecolor"></i>
            <span>换货数量</span>
          </template>
          <template slot-scope="scope">
            <input
              v-if="scope.row.gId"
              type="text"
              minlength="1"
              v-model="scope.row.rdQuantity"
              @blur="setnum1(scope.row)"
              class="ipt"
              :readonly="showbank"
            />
          </template>
        </el-table-column>
        <el-table-column sortable align="center" property="gUnitv" label="单位"></el-table-column>
        <el-table-column sortable align="center" property="iSellingprice">
          <template slot="header">
            <i class="el-icon-question bluecolor"></i>
            <span>单价</span>
          </template>
          <template slot-scope="scope">
            <input
              v-if="scope.row.iSellingprice"
              minlength="1"
              type="text"
              v-model="scope.row.iSellingprice"
              @blur="setdanjia1(scope.row)"
              class="ipt"
              :readonly="showbank"
            />
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="金额" property="money">
          <template v-if="money1">{{money1}}</template>
        </el-table-column>
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
    </el-card>
    <br />
    <el-row :gutter="20">
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="mini">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="bigbox" v-if="form.rType==11&&(form.rStatus==19||form.rType==32)">
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
      :Totalamount="$PublicJS.money(Math.abs(TotalPrice3), 2)"
      @opendialog="openDD({ ss: false })"
      @ctrls="openDD({ ss: true })"
      :hideBtn1="false"
      :hideBtn2="!showbank"
      v-has="4031"
    ></my-footer>
    <el-dialog
      title="商品信息选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <el-dialog
        width="60%"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="addgoods"
        append-to-body
      >
        <goodsedit @closeAddGoods="closeAddGoods" :parent="1"></goodsedit>
      </el-dialog>
      <selectGoods
        @emitGoodsData="getGoodsData"
        @openadd="addgoods=true"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :idList="idList"
        :purorrecover="1"
        v-if="!addgoods"
      ></selectGoods>
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
// import goodsedit from "@/views/setting/goodsControl/goodsedit";
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
    // goodsedit
  },
  data() {
    return {
      tableData: [],
      tableData1: [{}, {}, {}, {}, {}],
      tableData3: [],
      addgoods: false,
      idList: [],
      img: "",
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
      activeName: "wuliu",
      fsAmount: 0,
      showbank: false,
      showSum: true,
      showSum1: true,
      currentRow: null,
      client: {},
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
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
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
        this.form = JSON.parse(JSON.stringify(res.data.records[0]));
        this.$api.Customer.get({ id: this.form.rCuid }).then(res => {
          this.getClientData(res.data.records[0]);
        });
        this.BH = res.data.records[0].rItemnum;
        if (this.form.rType != 11) {
          this.tableData = [];
        } else {
          this.tableData = [];
          this.tableData1 = [];
        }
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.loading.close();
          this.load = true;
          res.data.map((item, index) => {
            if (!item.rdQuantity) return false;
            item.iQuantity = item.rdQuantity;
            item.gConstructcostweight = item.rdConstructcostweight;
            item.gRemark = item.rdRemark;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (this.form.rType != 11) {
              if (item.rdIotype == 2) {
                this.tableData.push(item);
              }
            } else {
              if (item.rdIotype == 1) {
                this.tableData.push(item);
              } else if (item.rdIotype == 2) {
                this.tableData1.push(item);
              }
            }
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
          this.tableData = this.deepCopy(this.tableData);
          this.tableData1 = this.deepCopy(this.tableData1);
        });
        if (
          res.data.records[0].rType == 11 &&
          (res.data.records[0].rApprovalstatus == 2 ||
            res.data.records[0].rStatus == 19 ||
            res.data.records[0].rStatus == 31)
        ) {
          this.showbank = true;
        }
        if (res.data.records[0].rType == 32) {
          this.showbank = true;
        }
        if (res.data.records[0].rType == 7) this.form.rStatus = 2;
        this.getrCid({ cuid: this.form.rCuid });
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    closeAddGoods() {
      this.addgoods = false;
      this.$message.success("添加成功");
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
      if (val) {
        this.receiptFinancial[0].fsSubjectname = val.cAttrvalue;
        this.receiptFinancial[0].fsSubjectnum = val.cAttrcode;
      }
      this.showselectBankAccount1 = false;
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
    setdanjia(e) {
      if (!isNaN(e.iSellingprice)) {
        if (!e.iSellingprice) {
          this.$message("请输入商品单价");
          e.iSellingprice = 1;
        } else if (e.iSellingprice < 1) {
          e.iSellingprice = 1;
          this.$message("商品单价不得小于1");
        }
      } else {
        e.iSellingprice = 1;
        this.$message("请输入数字");
      }
    },
    setdanjia1(e) {
      if (!isNaN(e.iSellingprice)) {
        if (!e.iSellingprice) {
          this.$message("请输入商品单价");
          e.iSellingprice = 1;
        } else if (e.iSellingprice < 1) {
          e.iSellingprice = 1;
          this.$message("商品单价不得小于1");
        }
      } else {
        e.iSellingprice = 1;
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
    setnum(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入商品数量");
          e.rdQuantity = e.iQuantity;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = e.iQuantity;
          this.$message("商品数量不得小于1");
        } else if (e.rdQuantity > e.iQuantity) {
          e.rdQuantity = e.iQuantity;
          this.$message("商品数量不得大于采购数量");
        }
      } else {
        e.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    setnum1(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入商品数量");
          e.rdQuantity = 1;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = 1;
          this.$message("商品数量不得小于1");
        }
      } else {
        e.rdQuantity = 1;
        this.$message("请输入数字");
      }
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

    searchbox(e, val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (this.tableData1[val].gId) {
          this.have = true;
        } else {
          this.have = false;
        }
        if (e.target === this.icon) {
          this.idList = [];
          this.tableData.map(item => {
            if (item.gId && !this.idList.includes(item.gId)) {
              this.idList.push(item.gId);
            }
          });
          this.icon = "";
          this.showselectGoods = true;
        }
      }
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
    adddate() {
      this.tableData1.push({});
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
    getGoodsData(val) {
      if (this.tableData1[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.tableData1[this.rowindex + i] &&
              this.tableData1[this.rowindex + i].gId
            ) {
              this.tableData1.push(data);
            } else {
              this.tableData1.splice(this.rowindex + i, 1, data);
            }
          } else {
            this.tableData1.splice(this.rowindex + i, 1, data);
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        const data = JSON.parse(JSON.stringify(val));
        this.tableData1.splice(this.rowindex, 1, data);
      }
      this.showselectGoods = false;
    },
    openDD(val) {
      let n = 0;
      this.tableData1.map(item => {
        if (item.rdQuantity) n++;
      });
      if (!n) return this.$message.error("请选择换货商品");
      if (val.ss) {
        this.form.rStatus = 30;
        this.form.rBillingstatus = 0;
        this.close("false");
      } else {
        this.form.rStatus = 2;
        this.form.rBillingstatus = 0;
        this.showDD = true;
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.form.rTotalprice = Math.abs(this.TotalPrice3);
      if (this.form.rType != 11) delete this.form.rId;
      if (this.form.rType == 8) this.form.rItemnumparent = this.form.rItemnum;
      delete this.form.rItemnumparent;
      delete this.form.rFile;
      this.form.rType = 11;
      this.form.rDate = this.$PublicJS.nowDate();
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form
      };
      if (val1 && val1.length) params.cc = val1;
      params.receiptInfoVO.rDate = this.nowdata;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        if (item.rdQuantity) {
          let obj = {};
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          item.rdConstructcostweight = item.gConstructcostweight;
          obj.rdRemark = item.gRemark;
          obj.rdIotype = 1;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData1.forEach((item, index) => {
        if (item.rdQuantity) {
          let obj = {};
          item.rdConstructcostweight = item.gConstructcostweight;
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
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
          this.$router.push("/exchangegoodsList");
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