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
        <p class="title">拆装单</p>
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
        <el-select
          v-model="form.rWhidv"
          filterable
          placeholder="请选择仓库"
          size="small"
          :disabled="disabled"
          @change="selectChange('rWhid',form.rWhidv)"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>仓库
            </span>
          </template>
          <el-option
            v-for="(item,index) in rWhidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.whCode }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rHandmanv"
          filterable
          placeholder="请选择经手人"
          size="small"
          :disabled="disabled"
          @change="selectChange('rHandman',form.rHandmanv)"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>经手人
            </span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拆装出库</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        height="150px"
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
        <!-- <el-table-column sortable
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
        </el-table-column>-->
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
        <el-table-column sortable
          align="center"
          property="gName"
          width="150"
          v-if="tableStatus.gName"
          label="商品名称"
        >
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
            <i class="fa fa-search searchname" @click="searchbox($event,scope.$index,'out')"></i>
          </template>
        </el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gBrandv"
          v-if="tableStatus.gBrandv"
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
        <el-table-column sortable
          width="80"
          align="center"
          property="gColorv"
          v-if="tableStatus.gColorv"
          label="颜色"
        ></el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="rdQuantity"
          label="数量"
          v-if="tableStatus.rdQuantity"
        >
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
        <el-table-column sortable
          width="80"
          align="center"
          property="gUnitv"
          v-if="tableStatus.gUnitv"
          label="单位"
        ></el-table-column>
        <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="iUnitprice"
          label="成本价"
          v-if="tableStatus.iUnitprice"
        ></el-table-column>
        <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
          <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
        </el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="gNewoldv"
          v-if="tableStatus.gNewoldv"
          label="新旧程度"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          property="gCtime"
          v-if="tableStatus.gCtime"
          label="最近销售日期"
        >
          <template slot-scope="scope" v-if="scope.row.gCtime">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.gCtime.split('T')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="gRemark"
          label="备注"
          v-if="tableStatus.gRemark"
        >
          <template slot-scope="scope" v-if="scope.row.gId">
            <input type="text" v-model="scope.row.gRemark" :class="defStyle" :disabled="disabled" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拆装入库</span>
      </div>
      <el-table
        :data="INtableData"
        border
        style="width: 100%"
        size="mini"
        height="300px"
        show-summary
        :summary-method="getSummariesIN"
        sum-text="合计:"
        header-cell-class-name="thbgc"
      >
        <el-table-column type="index" width="55" align="center" property="index">
          <template slot="header">
            <i class="fa fa-cog setting" @click="showtable=true"></i>
          </template>
        </el-table-column>
        <el-table-column property="tools" label="操作" align="center" width="80" v-if="!disabled">
          <template slot-scope="scope">
            <i class="el-icon-circle-plus add" @click="adddate()"></i>
            <i class="el-icon-circle-close del" @click="deldate(scope.$index,'in')"></i>
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
        <el-table-column sortable
          align="center"
          property="gName"
          width="150"
          v-if="tableStatus.gName"
          label="商品名称"
        >
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
            <i class="fa fa-search searchname" @click="searchbox($event,scope.$index,'in')"></i>
          </template>
        </el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          show-overflow-tooltip
          property="gBrandv"
          v-if="tableStatus.gBrandv"
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
        <el-table-column sortable
          width="80"
          align="center"
          property="gColorv"
          v-if="tableStatus.gColorv"
          label="颜色"
        ></el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="rdQuantity"
          label="数量"
          v-if="tableStatus.rdQuantity"
        >
          <template slot-scope="scope" v-if="scope.row.gItemnum">
            <input
              type="text"
              v-model="scope.row.rdQuantity"
              :class="defStyle"
              :disabled="disabled"
              @blur="iptBlurIN(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column sortable
          width="80"
          align="center"
          property="gUnitv"
          v-if="tableStatus.gUnitv"
          label="单位"
        ></el-table-column>
        <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="iUnitprice"
          label="成本价"
          v-if="tableStatus.iUnitprice"
        >
          <template slot-scope="scope" v-if="scope.row.gName">
            <input
              type="text"
              v-model="scope.row.iUnitprice"
              :class="defStyle"
              :disabled="disabled"
              @blur="iptBlur(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
          <template v-if="INsumTotalPrice">{{ $PublicJS.money(INsumTotalPrice, 2) }}</template>
        </el-table-column>
        <el-table-column sortable
          width="100"
          align="center"
          property="gNewoldv"
          v-if="tableStatus.gNewoldv"
          label="新旧程度"
        ></el-table-column>
        <el-table-column sortable
          width="120"
          align="center"
          property="gCtime"
          v-if="tableStatus.gCtime"
          label="最近销售日期"
        >
          <template slot-scope="scope" v-if="scope.row.gCtime">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.gCtime.split('T')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="gRemark"
          label="备注"
          v-if="tableStatus.gRemark"
        >
          <template slot-scope="scope" v-if="scope.row.gId">
            <input type="text" v-model="scope.row.gRemark" :class="defStyle" :disabled="disabled" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-row :gutter="20" class="mtop15 mbottom">
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small" :disabled="disabled">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has="369">
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
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div class="toolright">
              <div class="jizhang" @click="btnSubmit('TJ')" v-if="hideAllBtn">
                <p>确认提交</p>
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
      title="出库商品选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectGoodsOUT"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsDataOUT"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :have="1"
      ></selectGoods>
    </el-dialog>
    <el-dialog
      title="入库商品选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectGoodsIN"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsDataIN"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :have="0"
        :havecanout='0'
      ></selectGoods>
    </el-dialog>
    <el-dialog
      title="仓库选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getWarehouseData"></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="经手人选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      title="选择审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="60%"
    >
      <examine
        :rtype="49"
        @close="dialogSubmit"
        @openuser="openuser"
        :ID="dingding"
        :ID1="dingding1"
      ></examine>
      <el-dialog
        title="选择审核人"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showSelectUser"
        width="60%"
        append-to-body
      >
        <selectUser @emitUserData="getUserData"></selectUser>
      </el-dialog>
    </el-dialog>
    <el-dialog
      title="设置表格"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showtable"
      width="30%"
    >
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
  </div>
</template>

<script>
import selectUser from "../../../components/dialog/SelectUser";
import selectGoods from "../../../components/dialog/SelectGoods";
import selectWarehouse from "../../../components/dialog/SelectWarehouse";
import settTable from "../../../components/settTable/settTable";
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    selectUser,
    selectWarehouse,
    selectGoods,
    settTable
  },
  data() {
    return {
      defStyle: "tc ipt bgc",
      hideAllBtn: true,
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      INtableData: [],
      contact: [],
      rowindex: "",
      rowindexIN: "",
      icon: "",
      disabled: false,

      showSelectUser: false,
      showSelectWarehouse: false,
      showSelectGoodsOUT: false,
      showSelectGoodsIN: false,
      showexamine: false,
      showtable: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rTotalprice: 0,
        rHandmanv: this.$storage.userName,
        rHandman: this.$storage.userId,
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "",
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        warehouseNum:
          this.$storage.warehouseNum > 1 || this.$storage.warehouseNum != null
            ? true
            : false,
        rCtime: "",
        rDate: "",
        rRemark: "",
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
      },
      OUTrTotalprice: 0,
      INrTotalprice: 0,
      Totalprice: 0,
      INrdQuantity: 0,
      img: "",
      rWhidOptions: [],
      rHandmanOptions: [],
      loading:'',
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
    } else {
      for (let i = 0; i < 1; i++) {
        this.tableData.push({
          rdQuantity: null,
          iQuantity: null,
          iQuantitycanout: null,
          iSellingprice: null,
          sumPrice: null
        });
      }
      for (let i = 0; i < 5; i++) {
        this.INtableData.push({
          rdQuantity: null,
          iQuantity: null,
          iQuantitycanout: null,
          iSellingprice: null,
          sumPrice: null,
          iUnitprice: null
        });
      }
      this.form.rDate = this.$PublicJS.nowDate();
      // 仓库
      this.$api.Warehouse.get({ size: 9999 }).then(res => {
        if (res.code == 200) {
          this.rWhidOptions = res.data.records.map(item => {
            return {
              label: item.whName,
              value: item.whId,
              whCode: item.whCode
            };
          });
        }
      });
      // 签单人
      this.$api.User.get({ size: 9999, auth: 1, status:1 }).then(res => {
        if (res.code == 200) {
          this.rHandmanOptions = res.data.records.map(item => {
            return {
              label: item.uName,
              value: item.uId,
              oidValue: item.oidValue,
              uMobile: item.uMobile
            };
          });
        }
      });
    }
  },
  computed: {
    // 总金额
    sumTotalPrice: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (item.rdQuantity * item.iUnitprice).toFixed(
            2
          ));
        }
      });
    },
    INsumTotalPrice: function() {
      this.INtableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (item.rdQuantity * item.iUnitprice).toFixed(
            2
          ));
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
          if (items.rStatus == 19) {
            this.disabled = true;
            this.hideAllBtn = false;
            this.defStyle = "tc ipt";
          }

          let rid = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(rid).then(res => {
            this.loading.close();
            res.data.map(item => {
              item.gRemark = item.rdRemark;
              item.defNum = item.rdQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              if (item.rdIotype == 1) {
                this.tableData.push(item);
              } else if (item.rdIotype == 2) {
                item.iUnitprice = item.rdSellingprice;
                this.INtableData.push(item);
              } else {
                this.tableData.push(item);
              }
            });
            this.form = items;
          });
        }
      });
    },
    // 提交
    btnSubmit(val) {
      let arr = [];
      this.tableData.map(item => {
        if (item.gId) {
          arr.push(item.gId);
        }
      });
      if (!arr.length) {
        this.$message({ message: "请选择拆装出库商品", type: "warning" });
        return false;
      }
      let arr2 = [];
      this.INtableData.map(item => {
        if (item.gId) {
          arr2.push(item.gId);
        }
      });
      if (!arr2.length) {
        this.$message({ message: "请选择拆装入库商品", type: "warning" });
        return false;
      }
      if (this.INrTotalprice != this.OUTrTotalprice) {
        this.$message({ message: "出入库总金额不一致", type: "warning" });
        return false;
      }
      if (
        arr.length &&
        arr2.length &&
        this.INrTotalprice == this.OUTrTotalprice
      ) {
        this.$confirm("此操作将直接提交, 是否继续?", "提示", {
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
      let INtableData = [];
      this.INtableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iUnitprice;
          // item.rdUnitprice = item.iUnitprice;
          item.rdIotype = 2;
          INtableData.push(item);
        }
      });
      this.form.rType = 90;
      this.form.rDate = getDate.getToday().starttime.replace(/\-/g, "");
      this.form.rTotalprice = this.OUTrTotalprice;
      delete this.form.rId;
      delete this.form.rFile;
      this.form.rDate = this.$PublicJS.nowDate();
      delete this.form.rStatus;
      delete this.form.rstatusv;

      let params = {
        approve: true, //是否发起审批
        approvers: [], //钉钉审批人ID
        receiptDtsList: tableData.concat(INtableData), //商品
        receiptInfoVO: this.form //单据信息
      };

      // 保存
      this.$api.Receipt.saveall(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/warehouse/disassembly/disassemblyList");
        } else {
          this.$message.error(res.err);
        }
      });
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
    iptBlurIN(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if (Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        } 
      } else {
        val.rdQuantity = 1;
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
            this.OUTrTotalprice = parseFloat((sums[index]).toPrecision(12));
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
    getSummariesIN(param) {
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
            this.INrTotalprice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.INrdQuantity = parseFloat((sums[index]).toPrecision(12));
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
    searchbox(e, val, m) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        if (m == "out") {
          this.rowindex = val;
          if (e.target === this.icon) {
            this.icon = "";
            this.showSelectGoodsOUT = true;
          }
        }
        if (m == "in") {
          this.rowindexIN = val;
          if (e.target === this.icon) {
            this.icon = "";
            this.showSelectGoodsIN = true;
          }
        }
      }
    },
    change() {
      if (this.form.rIsconstruct == 0) {
        this.hideConstr = false;
      } else {
        this.hideConstr = true;
      }
    },
    setimg(u) {
      this.img = u;
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
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    // 新增一行
    adddate(val) {
      this.INtableData.push({});
    },
    // 删除当前选中这行
    deldate(index, val) {
      if (val == "in") {
        if (this.INtableData.length > 1) {
          this.INtableData.splice(index, 1);
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
    getGoodsDataOUT(val) {
      if (this.tableData[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
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
        const data = JSON.parse(JSON.stringify(val));
        this.tableData.splice(this.rowindex, 1, data);
      }
      this.showSelectGoodsOUT = false;
    },
    getGoodsDataIN(val) {
      if (this.INtableData[this.rowindexIN].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.INtableData[this.rowindexIN + i] &&
              this.INtableData[this.rowindexIN + i].gId
            ) {
              this.INtableData.push(data);
            } else {
              this.INtableData.splice(this.rowindexIN + i, 1, data);
            }
          } else {
            this.INtableData.splice(this.rowindexIN + i, 1, data);
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        const data = JSON.parse(JSON.stringify(val));
        this.INtableData.splice(this.rowindexIN, 1, data);
      }
      this.showSelectGoodsIN = false;
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
    // 仓库
    getWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    openuser(val) {
      this.dataType = val;
      this.showSelectUser = true;
    },
    settTable() {
      this.reload();
      this.showtable = false;
      this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
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
