<template>
  <div ref="quotationsheet" v-if="load">
    <el-row :gutter="24" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <span class="billNuber" v-if="BH">NO.</span>
        <span class="billCode">{{BH}}</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <span class="title">采购申请</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rCuidv" size="small" :disabled="showbank">
          <template slot="prepend">供应商</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showSelectClient')"
            v-show="!showbank"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rWhidv" size="small" :disabled="showbank">
          <template slot="prepend">入库仓库</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showselectWarehouse')"
            v-if="!showbank"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rHandmanv" size="small" :disabled="showbank">
          <template slot="prepend">经手人</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showSelectUser')"
            v-show="!showbank"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCid"
          placeholder="请选择联系人"
          size="small"
          @change="selectChange"
          :disabled="showbank"
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
        <el-input v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rOid"
          filterable
          placeholder="请选择归属公司"
          size="small"
          @change="selectChanges('rOid')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>归属公司
            </span>
          </template>
          <el-option
            v-for="(item,index) in rOidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-input v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">联系地址</template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
      size="mini"
      :show-summary="true"
      :summary-method="getSummaries"
      height="520px"
      header-cell-class-name="thbgc"
    >
      <el-table-column align="center" width="55" type="index" label="序号"></el-table-column>
      <el-table-column align="center" show-overflow-tooltip label="操作" width="100" v-if="!showbank">
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
      <el-table-column sortable align="center" property="gName">
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>商品名称</span>
          <!-- <span class="bluecolor">&nbsp;&nbsp;&nbsp;扫描枪录入</span> -->
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
            v-show="!showbank"
            @click="searchbox($event,scope.$index)"
          ></i>
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
        label="配置"
      ></el-table-column>
      <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
      <el-table-column sortable align="center" property="rdQuantity">
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>数量</span>
        </template>
        <template slot-scope="scope">
          <input
            v-if="scope.row.gId"
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
      <el-table-column sortable align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
      <el-table-column sortable align="center" property="gRemark" label="备注">
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>备注</span>
        </template>
        <template slot-scope="scope">
          <input
            v-if="scope.row.gId"
            type="text"
            v-model="scope.row.gRemark"
            class="ipt"
            :readonly="showbank"
          />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20">
      <!-- <el-col :sm="4" :xs="24">
        <el-input placeholder="0" size="small" disabled>
          <template slot="prepend">预付余额</template>
        </el-input>
      </el-col>-->
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="small" :disabled="showbank">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <br />
    <div class="bigbox" v-if="form.rStatus==19||form.rType==9">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <br />
    <br />
    <my-footer
      title="本单数量"
      :centertext="false"
      :Totalamount="number"
      @opendialog="openDD({ ss: false })"
      @ctrls="openDD({ ss: true })"
      :hideBtn1="!showbank"
      :hideBtn2="!showbank"
      v-has="4071"
    ></my-footer>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient
        @emitClientData="getClientData"
        @openClient="showAddClient=true"
        status="32"
        v-if="!showAddClient"
      ></selectClient>
    </el-dialog>
    <el-dialog
      title="仓库"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectWarehouse"
      width="60%"
    >
      <selectWarehouse
        @emitWarehouseData="getWarehouseData"
        @openwh="showAddWarehouse=true"
        v-if="!showAddWarehouse"
      ></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="商品"
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
        :have="have"
        @emitGoodsData="getGoodsData"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :purorrecover="1"
        @openadd="addgoods=true"
        :idList="idList"
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
      <examine :rtype="7" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
    <el-dialog
      title
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showAddClient"
      width="60%"
      style="height:800px"
    >
      <addClient @emitUserAdd="getUserAdd" v-if="showAddClient"></addClient>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showAddWarehouse"
      width="20%"
    >
      <addWarehouse
        v-if="showAddWarehouse"
        @emitWareAdd="WareAddhouse"
        @close="showAddWarehouse = false"
      ></addWarehouse>
    </el-dialog>
  </div>
</template>

<script>
import selectClient from "@/components/dialog/SelectClient";
import selectWarehouse from "@/components/dialog/SelectWarehouse";
import selectGoods from "@/components/dialog/SelectGoods";
import selectUser from "@/components/dialog/SelectUser";
import addClient from "@/components/dialog/AddClient";
import addWarehouse from "@/components/dialog/AddWarehouse";
import examine from "@/components/dialog/examine";
// import goodsedit from "@/views/basicInfo/goodsControl/goodsedit";
export default {
  name: "quotationsheetDetail",
  inject: ["reload"],
  components: {
    selectClient,
    selectWarehouse,
    selectGoods,
    examine,
    selectUser,
    // goodsedit,
    addClient,
    addWarehouse
  },
  data() {
    return {
      tableData: [{}, {}, {}, {}, {}],
      fileList: [],
      showAddClient: false,
      showAddWarehouse: false,
      have: false,
      idList: [],
      form: {
        rFile: [],
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
        rType: 12,
        rCid: "",
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rStatus: 30,
        rTotalprice: 0,
        rBillingstatus: "0",
        rCuseridv: this.$storage.userName,
        rCuserid: this.$storage.userId,
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
      },
      client: {},
      rOidOptions: [],
      dingding: {},
      dingding1: {},
      fsAmount: 0,
      showbank: false,
      showbankds: false,
      showSum: true,
      currentRow: null,
      showfile: false,
      showSelectUser: false,
      icon: "",
      showSelectClient: false,
      showselectWarehouse: false,
      showselectGoods: false,
      dataType: 0,
      rowindex: 0,
      TotalPrice: 0,
      number: 0,
      BH: null,
      img: "",
      rId: null,
      showDD: false,
      contact: [],
      param: {},
      nowdata: "",
      formData: null,
      i: 0,
      daifu: 0,
      addgoods: false,
      showexamine: false,
      filedata: [],
      load: true,
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
  created() {
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
    }
    if (this.rId) {
      this.getPurchase();
      this.loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.load = false;
    }
    // 归属公司
    this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1 }).then(res => {
      if (res.code == 200) {
        this.rOidOptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      }
    });
  },
  methods: {
    getPurchase() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.form = res.data.records[0];
        if (this.form.rFile) {
          this.form.rFile = JSON.parse(this.form.rFile);
          this.fileList = this.form.rFile;
        }
        this.BH = res.data.records[0].rItemnum;
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.loading.close();
          this.load = true;
          this.tableData = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            item.gConstructcostweight = item.rdConstructcostweight;
            item.gRemark = item.rdRemark;
            if (item.gImage && item.gImage.length) {
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            this.tableData.splice(index, 1, JSON.parse(JSON.stringify(item)));
          });
        });
        if (
          res.data.records[0].rApprovalstatus == 2 ||
          res.data.records[0].rStatus == 19 ||
          res.data.records[0].rStatus == 31
        ) {
          this.showbank = true;
        }
        if (res.data.records[0].rType != 12) {
          this.showbank = true;
        }
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
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
    setimg(url) {
      this.img = url;
    },
    getrCid(val) {
      this.contact = [];
      let cAddr =
        (this.client.cuProvincevalue ? this.client.cuProvincevalue : "") +
        (this.client.cuCityvalue ? this.client.cuCityvalue : "") +
        (this.client.cuDistrictvalue ? this.client.cuDistrictvalue : "");
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) {
          this.form.rCaddr = "";
          this.form.rCmobile = "";
          return (this.form.rCid = "");
        }
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
    selectChanges(m) {
      // this.form[m] = val;
      let obj = {};
      obj = this[m + "Options"].find(item => {
        return item.value == this.form.rOid; //筛选出匹配数据
      });
      this.form[m + "v"] = obj.label; //获取label
    },
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
            column.property === "money") ||
          column.property === "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice = sums[index]
          }
          if (column.property === "rdQuantity") {
            this.number = sums[index]
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
    getUserAdd(val) {
      let params = {
        cuAddr: val.cuAddr,
        cuName: val.cuName,
        cuBankcardnum: val.cuBankcardnum,
        cuBankname: val.cuBankname,
        cuProvince: val.cuProvince,
        cuCity: val.cuCity,
        cuDistrict: val.cuDistrict,
        cuHandman: val.cuHandman,
        cuIndustry: val.cuIndustry,
        cuOrigin: val.cuOrigin,
        cuRemark: val.cuRemark,
        cuTaxnum: val.cuTaxnum,
        cuOid: val.cuOid,
        cuStatus: "1",
        cuDiv: val.cuDiv,
        tContactList: val.tContactList
      };
      if (val.cuId) {
        params["cuId"] = val.cuId;
      }
      this.$api.Customer.saveCustomerAndContact(params).then(res => {
        if (res.code == "200") {
          this.$message({
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message("保存失败");
        }
      });
      this.showAddClient = false;
    },
    WareAddhouse(val) {
      let param = {
        whAddr: val.whAddr,
        whCode: val.whCode,
        whName: val.whName,
        whMobile: val.whMobile,
        whContact: val.whContact,
        whOid: val.whOid
      };
      if (!val.whId) {
        this.$api.Warehouse.save(param).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        });
      } else {
        param["whId"] = val.whId;
        this.$api.Warehouse.update(param).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        });
      }
      this.showAddWarehouse = false;
    },
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
    },
    searchbox(e, val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (this.tableData[val].gId) {
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
    handleExceed() {},
    handleChange(v) {},
    handleRemove() {},
    setnum(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入数量");
          e.rdQuantity = 1;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = 1;
          this.$message("数量不得小于1");
        }
      } else {
        e.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    setmoney(e) {
      if (!isNaN(e.iSellingprice)) {
        if (!e.iSellingprice) {
          this.$message("请输入单价");
          e.iSellingprice = 1;
        } else if (e.iSellingprice < 1) {
          e.iSellingprice = 1;
          this.$message("单价不得小于1");
        }
      } else {
        e.iSellingprice = 1;
        this.$message("请输入数字");
      }
    },
    opendialog(n) {
      this[n] = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    adddate() {
      this.tableData.push({});
    },
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    closeAddGoods() {
      this.addgoods = false;
      this.$message.success("添加成功");
    },
    getClientData(val) {
      if (val) {
        this.form.rCuid = val.cuId;
        this.form.rCuidv = val.cuName;
        this.client = val;
        this.getrCid({ cuid: val.cuId });
      }

      this.showSelectClient = false;
    },
    getWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showselectWarehouse = false;
    },
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
      this.showselectGoods = false;
    },
    openlink(url) {
      window.open(url, "_blank");
    },
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    openDD(val) {
      let n = 0;
      this.tableData.map(item => {
        if (item.rdQuantity) {
          n++;
        }
      });
      if (!this.form.rCuid) return this.$message("请选择供应商");
      if (!this.form.rWhid) return this.$message("请选择仓库");
      if (!this.form.rHandman) return this.$message("请选择经手人");
      if (!this.form.rCid) return this.$message("请选择联系人");
      if (!n) return this.$message("请选择商品");
      if (val.ss) {
        this.close("false");
      } else {
        this.showDD = true;
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.form.rDate = this.nowdata;
      this.form.rTotalprice = 0;
      // delete this.form.rFile
      delete this.form.rFile;
      let params = {
        approve: data != "false" ? true : false,
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
      this.tableData.forEach((item, index) => {
        if (item.rdQuantity) {
          let obj = item;
          obj.rdGid = item.gId;
          obj.rdIotype = 2;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdQuantitysurplus = item.rdQuantity;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdRemark = item.gRemark;
          params.receiptDtsList.push(obj);
        }
      });
      if (params.approve) this.form.rStatus = 2;
      this.showDD = false;
      this.$api.Receipt.saveall(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/quotationsheetList");
        } else {
          this.$message.error("提交失败");
        }
      });
    }
  }
};
</script>
<style scoped>
.flies {
  display: inline-block;
  width: 140px;
  vertical-align: middle;
  margin-right: 10px;
}
</style>