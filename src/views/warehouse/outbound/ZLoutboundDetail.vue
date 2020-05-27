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
        <p class="title">租赁送货单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button> -->
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has="1021">打印</el-button>
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
    <el-row :gutter="20">
      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="mini"
          :height="orderID?null:'300px'"
          show-summary
          :summary-method="getSummaries"
          sum-text="合计:"
          header-cell-class-name="thbgc"
        >
          <el-table-column type="index" width="55" align="center" property="index">
            <template slot="header">
              <i class="fa fa-cog setting" @click="showtable=true"></i>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gItemnum"
            label="货号"
          ></el-table-column>
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
          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gPzysv"
            label="配置"
          ></el-table-column>
          <el-table-column
            sortable
            width="150"
            align="center"
            show-overflow-tooltip
            property="gSpec"
            label="规格"
          ></el-table-column>
          <el-table-column sortable width="100" align="center" property="rdQuantity" label="数量"></el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gUnitv"
            v-if="tableStatus.gUnitv"
            label="单位"
          ></el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gColorv"
            v-if="tableStatus.gColorv"
            label="颜色"
          ></el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gNewoldv"
            v-if="tableStatus.gNewoldv"
            label="新旧程度"
          ></el-table-column>

          <el-table-column
            sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            v-if="tableStatus.gBrandv"
            label="品牌"
          ></el-table-column>

          <el-table-column
            sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gCtime"
            v-if="tableStatus.gCtime"
            label="最近销售日期"
          >
            <template slot-scope="scope" v-if="scope.row.gCtime">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gCtime.split('T')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            min-min-width="150"
            align="center"
            property="gRemark"
            label="备注"
            v-if="tableStatus.gRemark"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
          :height="orderID?null:'300px'"
          show-summary
          :summary-method="getSummaries3"
          sum-text="合计"
          header-cell-class-name="thbgc"
        >
          <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
          <el-table-column sortable label="服务类型" width="150" align="center">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.gId" placeholder="请选择" :disabled="disabled">
                <el-option
                  v-for="item in SPFL"
                  :key="item.gId"
                  :label="item.cAttrvalue"
                  :value="item.gId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column sortable property="rdQuantity" label="数量">
            <template slot-scope="scope">
              <input
                v-if="scope.row.gId"
                type="text"
                minlength="1"
                v-model="scope.row.rdQuantity"
                class="ipt"
                :readonly="disabled"
              />
            </template>
          </el-table-column>
          <el-table-column sortable property="iSellingprice" label="单价">
            <template slot-scope="scope">
              <input
                v-if="scope.row.gId"
                minlength="1"
                type="text"
                v-model="scope.row.iSellingprice"
                class="ipt"
                :readonly="disabled"
              />
            </template>
          </el-table-column>
          <el-table-column sortable label="金额" property="money" align="center">
            <template v-if="money3">{{money3}}</template>
          </el-table-column>
          <el-table-column sortable property="gRemark" label="备注" align="center">
            <template slot-scope="scope">
              <input
                v-if="scope.row.gId"
                :readonly="disabled"
                type="text"
                v-model="scope.row.gRemark"
                class="ipt"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card" v-if="form.rIsconstruct">
      <div slot="header" class="clearfix">
        <span>送货安装</span>
      </div>
      <div class="text item" style="padding:10px">
        <el-form label-width="110px" :model="Envform">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工保护: ">
                <el-switch
                  v-model="Envform.rcSgbh"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="disabled"
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
                  :disabled="disabled"
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
                  :disabled="disabled"
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
                  :disabled="disabled"
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
                  :disabled="disabled"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="卸车位置: ">
                <el-switch
                  v-model="Envform.rcZcwz"
                  active-text="地面"
                  :active-value="2"
                  :inactive-value="1"
                  inactive-text="地库"
                  :disabled="disabled"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="工地距离(公里): ">
                <el-input-number size="mini" v-model="Envform.rcGdjl" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="搬运距离(米): ">
                <el-input-number size="mini" v-model="Envform.rcByjl" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="地库限高(米): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcDkxg"
                  :precision="1"
                  :disabled="disabled"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯长(cm): ">
                <el-input-number size="mini" v-model="Envform.rcHtccL" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯宽(cm): ">
                <el-input-number size="mini" v-model="Envform.rcHtccW" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯高(cm): ">
                <el-input-number size="mini" v-model="Envform.rcHtccH" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="4">
              <el-form-item label="停车费(元): ">
                <el-input-number size="mini" v-model="Envform.rcTcf" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="专梯费用(元): ">
                <el-input-number size="mini" v-model="Envform.rcZtfy" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工楼层(层): ">
                <el-input-number size="mini" v-model="Envform.rcSglc" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯数量(部): ">
                <el-input-number size="mini" v-model="Envform.rcHtsl" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯用时(分): ">
                <el-input-number size="mini" v-model="Envform.rcHtsj" :disabled="disabled"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="6">
              <el-form-item label="预计发货日期: " prop="rcSgrq">
                <el-date-picker
                  v-model="Envform.rcSgrq"
                  type="date"
                  size="mini"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :disabled="disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="备注: ">
                <el-input size="mini" v-model="Envform.rcRemark" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>备货部门：
        </span>
        <el-radio-group v-model="form.rPreparegoods" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>送货部门：
        </span>
        <el-radio-group v-model="form.rDeliver" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>安装部门：
        </span>
        <el-radio-group v-model="form.rDisassembly" :disabled="hasdis">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :sm="5" :xs="24">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture"
          :auto-upload="false"
          :limit="5"
          multiple
          :file-list="fileList"
          :on-change="handleChange"
          :http-request="uploadImg"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          accept="image/png, image/jpeg"
        >
          <el-button size="mini" type="primary">上传单据附件</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mbottom">
      <el-col :xs="24" :sm="4">
        <el-input v-model="form.rLogistics" size="small" readonly :disabled="hasdis">
          <template slot="prepend">物流</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectLogistics')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="请输入运单号"
          v-model="form.rShipmentnumber"
          size="small"
          :disabled="hasdis"
        >
          <template slot="prepend">运单号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-date-picker
          v-model="form.rEstdelivery"
          type="date"
          size="small"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          :disabled="hasdis"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has="361">
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
                <span>本单金额</span>
                <span>￥</span>
                <span>{{ $PublicJS.money(form.rTotalprice, 2) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div class="toolright">
              <div class="jizhang" @click="opendialog" v-if="!hasdis">
                <p style="padding:0 30px">送货完成</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <el-dialog
      title="设置表格"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showtable"
      width="30%"
    >
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
    <el-dialog
      title="物流公司选择"
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
import settTable from "../../../components/settTable/settTable";
import selectLogistics from "../../../components/dialog/SelectLogistics";
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    settTable,
    selectLogistics
  },
  data() {
    return {
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      disabled: true,
      hasdis: false,
      tableData3: [{}, {}, {}, {}, {}],
      img: "",
      showtable: false,
      showSelectLogistics: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
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
        rEstdelivery: this.$PublicJS.nowDate(),
        rLogistics: "",
        rRemark: "",
        rShipmentnumber: "",
        rCuidv: "",
        rStatus: 1,
        rPreparegoods: 0,
        rDisassembly: 0,
        time: [],
        rFile: []
      },
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
        rcHtsj: "",
        rcHtccW: "",
        rcHtccL: "",
        rcHtccH: "",
        rcGdjl: "",
        rcDkxg: "",
        rcCmt: 0,
        rcByjl: "",
        rcCip: ""
      },
      i: 0,
      fileList: [],
      formData: {},
      TotalPrice1: 0,
      TotalPrice2: 0,
      loading: "",
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
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
      // 物流
      this.$api.Common.getAll().then(res => {
        if (res.code == 200) {
          this.rOidOptions = res.data.WL.map(item => {
            return {
              label: item.title,
              value: item.id
            };
          });
        }
      });
    }
    this.getService();
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
    money3: function() {
      this.tableData3.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
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
          if (items.rStatus != 7) {
            this.hasdis = true;
          }
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
            this.getReceiver({ cuid: items.rCuid, size: 99 });
            if (this.form.rFile) {
              this.form.rFile = JSON.parse(this.form.rFile);
              this.form.rFile.map(item => {
                this.fileList.push({
                  name: "单据附件",
                  url: `${this.baseUrl}api${item}`
                });
              });
            } else {
              this.form.rFile = [];
            }
            this.form.rEstdelivery = this.$PublicJS.nowDate();
            this.form.time = [
              items.startDate.split("T")[0],
              items.endDate.split("T")[0]
            ];
          });
          this.$api.Receiptdts.getReceiptDtsGoods({ rid: items.rId }).then(
            res => {
              this.tableData3 = [];
              res.data.map((item, index) => {
                item.iQuantity = item.rdQuantity;
                item.iSellingprice = item.rdSellingprice;
                item.gRemark = item.rdRemark;
                if (item.rdIotype == 4) {
                  item.gId = `${item.rdGid}`;
                  item.iSellingprice = item.rdSellingprice;
                  this.tableData3.push(item);
                }
              });
            }
          );
          // 施工环境回显
          this.$api.Receipt.gettconstruct({ rid: items.rId }).then(res => {
            if (res.data) {
              this.Envform = res.data;
            }
          });
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/warehouse/outbound/XSDeliveryPrinting?data=${data}`,
        "_blank"
      );
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
          !values.every(value => isNaN(value)) &&
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

          if (column.property === "rdQuantity") {
            this.form.TotalGood = parseFloat(sums[index].toPrecision(12));
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
    getSummaries3(param) {
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
            column.property == "money") ||
          column.property == "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice2 = parseFloat(sums[index].toPrecision(12));
          }
          if (column.property !== "rdQuantity") {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.form.rFile = this.fileList.map(item => {
        return item.url.split("api")[1];
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
      window.open(file.url);
    },
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
    },
    // 提交
    opendialog(val) {
      if (!this.form.rPreparegoods) {
        this.$message({ message: "请选择备货部门", type: "warning" });
        return false;
      }
      if (!this.form.rDeliver) {
        this.$message({ message: "请选择送货部门", type: "warning" });
        return false;
      }
      if (!this.form.rDisassembly) {
        this.$message({ message: "请选择安装部门", type: "warning" });
        return false;
      }

      if (
        this.form.rPreparegoods &&
        this.form.rDisassembly &&
        this.form.rDeliver
      ) {
        this.$confirm("此操作将直接出库, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogSubmit();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    // 审核提交
    dialogSubmit(val) {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.formData = new FormData();
      this.$refs.upload.submit();
      this.$ajax.post("/system/upload", this.formData).then(res => {
        if (res.data.code == 200) {
          if (Object.values(res.data.data).length) {
            Object.values(res.data.data).map(item => {
              this.form.rFile.push(`/file/${item}`);
            });
          }
          this.form.rFile = JSON.stringify(this.form.rFile);
          if (!this.form.rFile.length) delete this.form.rFile;
          let tableData = [];
          let goodsName = "";
          let flag = 0;
          this.tableData.forEach(item => {
            if (item.gName) {
              if (item.rdQuantity > item.iQuantity) {
                goodsName += item.gName + ",";
                flag++;
              }
              item.rdGid = item.gId;
              item.rdSellingprice = item.iSellingprice;
              item.rdUnitprice = item.iUnitprice;
              item.rdIotype = 1;
              tableData.push(item);
            }
          });
          if (flag)
            return this.$message.error(`${goodsName.slice(0, -1)}库存不足`);
          let params = {
            approve: false,
            approvers: [],
            receiptDtsList: tableData,
            receiptInfoVO: this.form
          };
          params.receiptInfoVO.rDate = this.form.rDate.replace(
            new RegExp("-", "g"),
            ""
          );

          this.$api.Rent.outbound(params).then(res => {
            loading.close();
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              this.$router.push("/warehouse/outbound/ZLoutboundList");
            } else {
              this.$message({
                type: "error",
                message: res.err
              });
            }
          });
        }
      });
    },
    showDialog(val) {
      this[val] = true;
    },
    setimg(u) {
      this.img = u;
    },
    searchbox(e, val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (e.target === this.icon) {
          this.icon = "";
          this.showSelectGoods = true;
        }
      }
    },
    // 物流
    getLogisticsData(val) {
      if (val) {
        this.form.rLogistics = val.cuName;
      }
      this.showSelectLogistics = false;
    },
    settTable() {
      this.reload();
      this.showtable = false;
      this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
    }
  }
};
</script>
<style scoped>
</style>
