<template>
  <div v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div>
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ BH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <span class="title">施工预算</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has='383'>导出</el-button>
          <el-button size="small" icon="el-icon-printer" v-has='2021'>打印</el-button>
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
      <el-col :xs="24" :sm="4">
        <el-input placeholder="入库仓库" v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">入库仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="经手人" v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>

      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
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
        <span>回收商品列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          size="mini"
          :height="rId?null:'300px'"
        >
          <el-table-column type="index" width="55" label="序号" ></el-table-column>
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
          <el-table-column sortable property="gUnitv" label="单位"></el-table-column>
          <el-table-column sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            label="品牌"
          ></el-table-column>
          <el-table-column sortable property="gSpec" label="规格"></el-table-column>
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
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>清理商品列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData2"
          border
          highlight-current-row
          style="width: 100%"
          size="mini"
          :height="rId?null:'300px'"
        >
          <el-table-column type="index" width="55" label="序号" ></el-table-column>
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
          <el-table-column sortable property="gUnitv" label="单位"></el-table-column>
          <el-table-column sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            label="品牌"
          ></el-table-column>
          <el-table-column sortable property="gSpec" label="规格"></el-table-column>
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
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>其它服务列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData3"
          border
          highlight-current-row
          style="width: 100%"
          size="mini"
          sum-text="合计"
        >
          <el-table-column type="index" width="55" label="序号" align="center" ></el-table-column>
          <!-- <el-table-column property="tools" label="操作" align="center" width="80" v-if="!showbank">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(3)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,3)"></i>
            </template>
          </el-table-column>-->
          <el-table-column sortable label="服务类型" width="150" align="center">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.gId" placeholder="请选择" disabled>
                <el-option
                  v-for="item in SPFL"
                  :key="item.gId"
                  :label="item.cAttrvalue"
                  :value="item.gId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column sortable property="rdQuantity" label="数量"></el-table-column>
          <el-table-column sortable property="gRemark" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>施工环境信息</span>
      </div>
      <div class="text item">
        <el-form label-width="110px" :model="Envform">
          <el-row :gutter="20" class="mbottom">
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工保护: ">
                <el-switch
                  v-model="Envform.rcSgbh"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="强弱电处理: ">
                <el-switch
                  v-model="Envform.rcQrdcl"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="交叉施工: ">
                <el-switch
                  v-model="Envform.rcJcsg"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="专梯: ">
                <el-switch
                  v-model="Envform.rcSqzt"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="出门条: ">
                <el-switch
                  v-model="Envform.rcCmt"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="装车位置: ">
                <el-switch
                  v-model="Envform.rcZcwz"
                  active-text="地面"
                  :active-value="2"
                  :inactive-value="1"
                  inactive-text="地库"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="工地距离(公里): ">
                <el-input-number
                  :disabled="showbank"
                  size="mini"
                  v-model="Envform.rcGdjl"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="搬运距离(米): ">
                <el-input-number
                  size="mini"
                  :disabled="showbank"
                  v-model="Envform.rcByjl"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="地库限高(米): ">
                <el-input-number
                  size="mini"
                  :disabled="showbank"
                  v-model="Envform.rcDkxg"
                  :precision="1"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯长(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccL"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯宽(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccW"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯高(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccH"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="停车费(元): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcTcf"
                  :disabled="showbank"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="专梯费用(元): ">
                <el-input-number
                  size="mini"
                  :disabled="showbank"
                  v-model="Envform.rcZtfy"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工楼层(层): ">
                <el-input-number size="mini" :disabled="showbank" v-model="Envform.rcSglc"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯数量(部): ">
                <el-input-number
                  size="mini"
                  :disabled="showbank"
                  v-model="Envform.rcHtsl"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯用时(分): ">
                <el-input-number :disabled="showbank" size="mini" v-model="Envform.rcHtsj"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工日期: ">
                <el-date-picker
                  v-model="Envform.rcSgrq"
                  type="date"
                  size="mini"
                  style="width:160px"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :disabled="showbank"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="施工环境备注: ">
                <el-input size="mini" v-model="Envform.rcRemark" :disabled="showbank"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <br />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>施工费用</span>
      </div>
      <div class="text item">
        <el-table
          :data="ConstructionData"
          border
          style="width:98%"
          size="mini"
          :height="rId?null:'300px'"
          :show-summary="true"
          :summary-method="getSummaries4"
          @selection-change="tableSelectionChange"
        >
          <el-table-column type="index" label="序号" align="center" width="80" ></el-table-column>
          <el-table-column label="操作" align="center" width="80" v-if="!showbank">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate('con')"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,'con')"></i>
            </template>
          </el-table-column>
          <el-table-column sortable prop="reTypecode" label="费用类型" align="left">
            <template slot-scope="scope">
              <el-select
                placeholder="请选择"
                size="mini"
                v-model="scope.row.reTypecode"
                :disabled="showbank"
              >
                <el-option
                  v-for="item in Conoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column sortable prop="reUnitprice" label="费用单价" align="center">
            <template slot-scope="scope">
              <div class="numbeript">
                <el-input-number
                  v-model="scope.row.reUnitprice"
                  :min="1"
                  :max="999999999"
                  size="mini"
                  v-if="scope.row.reTypecode"
                  :controls="false"
                  :disabled="showbank"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable prop="reQuantity" label="费用数量" align="center">
            <template slot-scope="scope">
              <div class="numbeript">
                <el-input-number
                  v-model="scope.row.reQuantity"
                  :min="1"
                  :max="999999999"
                  size="mini"
                  :precision="0"
                  v-if="scope.row.reTypecode"
                  :controls="false"
                  :disabled="showbank"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable prop="reTolprice" label="总金额" align="center">
            <template v-if="reTolprice">{{reTolprice}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-row>
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="small" :disabled="showbank">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <br />
    <br />
    <div class="bigbox" v-if="form.rStatus==19">
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
      :number="number"
      :Totalamount="SGFY"
      @opendialog="openDD({ ss: false })"
      @ctrls="openDD({ ss: true })"
      :hideBtn1="false"
      :hideBtn2="!showbank"
      BtnText="提交预算"
      v-has='2021'
    ></my-footer>
    <el-dialog
      :close-on-click-modal="false"
       v-dialogDrag :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient @emitClientData="getClientData" :status="1"></selectClient>
    </el-dialog>
    <el-dialog title="审核人" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showDD" width="50%">
      <el-dialog title="" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showexamine" width="60%" append-to-body>
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine :rtype="4" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
  </div>
</template>

<script>
import { truncate } from "fs";
import { constants } from "crypto";
import examine from "@/components/dialog/examine";
import selectUser from "@/components/dialog/SelectUser";
import selectClient from "@/components/dialog/SelectClient";
export default {
  inject: ["reload"],
  components: {
    examine,
    selectUser,
    selectClient
  },
  data() {
    return {
      tableData: [{}, {}, {}, {}, {}],
      tableData2: [{}, {}, {}, {}, {}],
      tableData3: [{}, {}, {}, {}, {}],
      ConstructionData: [{ reTypecode: "" }],
      showSelectClient: false,
      Conoptions: [],
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
        rType: 4,
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
      img: "",
      showbank: false,
      showSum: true,
      currentRow: null,
      showSelectUser: false,
      icon: "",
      showexamine: false,
      rowindex: 0,
      TotalPrice: 0,
      TotalPrice2: 0,
      TotalPrice3: 0,
      number: 0,
      BH: null,
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rId: null,
      showDD: false,
      tableSelection: [],
      contact: [],
      dataType: 0,
      dingding: {},
      dingding1: {},
      loading: false,
      param: {},
      nowdata: "",
      daifu: 0,
      settable: 1,
      // 施工环境
      Envform: {
        rcZtfy: "",
        rcZcwz: 2,
        rcTcf: "",
        rcSqzt: 0,
        rcSgrq: "",
        rcSglc: "",
        rcSgbh: 0,
        rcRemark: "",
        rcRid: "",
        rcQrdcl: 0,
        rcJcsg: 0,
        rcHtsl: "",
        rcHtsj: 0,
        rcHtccW: "",
        rcHtccL: "",
        rcHtccH: "",
        rcGdjl: "",
        rcDkxg: "",
        rcCmt: 0,
        rcByjl: "",
        rcCip: ""
      },
      SGFY: 0,
      SPFL: [],
      load: false,
      loading: {}
    };
  },
  computed: {
    reTolprice: function() {
      this.ConstructionData.map(item => {
        if (item.reUnitprice && item.reQuantity) {
          return (item.reTolprice = item.reUnitprice * item.reQuantity);
        }
      });
    }
  },
  created() {
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.getrecoverOrder();
    } else {
      this.$router.push("/index");
    }
    this.getSGHJ();
    this.getService();
    this.loading = this.$loading({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
  },
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
    getSGHJ() {
      this.$api.Common.get({ typeCode: "SGHJ" }).then(res => {
        this.ConstructionData = this.deepCopy(
          new Array(5).fill({ reTypecode: "" })
        );
        this.Conoptions = [
          {
            label: "请选择",
            value: ""
          }
        ];
        res.data.map(item => {
          if (item.cStatus == 1) {
            this.Conoptions.push({
              label: item.cAttrvalue,
              value: item.cAttrcode
            });
          }
        });
      });
    },
    // 图标显示隐藏
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
    },
    showicon(e) {
      e.target.nextElementSibling.style.opacity = "0";
    },
    tableSelectionChange(val) {
      this.tableSelection = val.map(item => {
        return item.reId;
      });
    },
    getrecoverOrder() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.BH = res.data.records[0].rItemnum;
        this.$api.Receiptexpense.get({
          rid: this.rId
        }).then(res => {
          if (res.data.records.length) {
            res.data.records.map(item => {
              const obj = item.partner?JSON.parse(item.partner):null;
              if (!obj) return
              item.partner = obj.partner;
              item.fsSubjectname = obj.fsSubjectname;
              item.fsSubjectnum = obj.fsSubjectnum;
              item.rCmobile = obj.rCmobile;
              item.partnerId = obj.partnerId;
            });
            this.ConstructionData = res.data.records;
          }
        });
        if (
          res.data.records[0].rApprovalstatus == 2 ||
          res.data.records[0].rStatus == 19 ||
          res.data.records[0].rStatus == 31
        ) {
          this.showbank = true;
        }
        this.form = res.data.records[0];
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: this.form.rWhid
        }).then(res => {
          this.tableData = [];
          this.tableData2 = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 2) {
              this.tableData.push(item);
            } else if (item.rdIotype == 3) {
              this.tableData2.push(item);
            }
          });
          this.tableData = this.deepCopy(this.tableData);
          this.tableData2 = this.deepCopy(this.tableData2);
        });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId
        }).then(res => {
          this.loading.close();
          this.load = true;
          this.tableData3 = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 4) {
              item.gId = `${item.rdGid}`;
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              this.tableData3.push(item);
            }
          });
          this.tableData3 = this.deepCopy(this.tableData3);
        });
        this.getrCid({ cuid: this.form.rCuid });
        this.$api.Receipt.gettconstruct({ rid: this.rId }).then(res => {
          if (res.data) {
            this.Envform = res.data;
          }
        });
      });
    },
    getService() {
      this.SPFL = [];
      this.$api.Common.get({ attrCodeParent: "09", typeCode: "SPFL" }).then(
        res => {
          if (res.code == 200) {
            res.data.map(item => {
              this.SPFL.push({
                cAttrvalue: item.cAttrvalue,
                gId: item.cAttrcode
              });
            });
          }
        }
      );
    },
    // 合作伙伴
    getClientData(val) {
      if (val) {
        this.ConstructionData[this.rowindex].partner = val.cuName;
        this.ConstructionData[this.rowindex].rCmobile = val.cuCuseridmobile;
        this.ConstructionData[this.rowindex].fsSubjectname = val.cuBankname;
        this.ConstructionData[this.rowindex].fsSubjectnum = val.cuBankcardnum;
        this.ConstructionData[this.rowindex].partnerId = val.cuId;
      }
      this.showSelectClient = false;
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
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    searchbox(e, val) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.icon = "";
        this.showSelectClient = true;
      }
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
    getSummaries4(param) {
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
            column.property == "reQuantity") ||
          column.property == "reTolprice"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "reTolprice") {
            this.SGFY = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property !== "reQuantity") {
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
    adddate(n) {
      if (n == "con") {
        this.ConstructionData.push({});
      }
    },
    deldate(index, n) {
      if (this.ConstructionData.length > 1) {
        if (n == "con") {
          this.ConstructionData.splice(index, 1);
        }
      }
    },
    openDD(val) {
      if (!this.Envform.rcSgrq) return this.$message.error("请选择施工日期");
      this.showDD = true;
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.Envform.rcRid = this.form.rId;
      this.Envform.rcSgrq = this.Envform.rcSgrq.replace(/\-/g, "");
      this.form.rDate = this.nowdata;
      this.form.rTotalprice = this.SGFY;
      let ConstructionData = [];
      let ConstructionDatas = JSON.parse(JSON.stringify(this.ConstructionData));
      ConstructionDatas.map((item, i) => {
        if (item.reTypecode && item.reTolprice) {
          delete item.fsSubjectname;
          delete item.fsSubjectnum;
          delete item.rCmobile;
          delete item.partnerId;
          ConstructionData.push(item);
        }
      });
      delete this.form.rFile;
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form,
        receiptExpenseList: ConstructionData,
        tReceiptconstruct: this.Envform
      };
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 2;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData2.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 3;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData3.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdIotype = 4;
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
          this.$router.push("/recover/constructionbudgetList");
        } else {
          this.$message("提交失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mbottom {
  padding: 0 20px;
}
</style>