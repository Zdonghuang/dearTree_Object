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
        <p class="title">销售换货单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>-->
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has='1039'>打印</el-button>
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>换货入库</span>
      </div>
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
        <el-table-column type="index" width="55" align="center" property="index" >
          <template slot="header">
            <i class="fa fa-cog setting" @click="showtable=true"></i>
          </template>
        </el-table-column>
        <el-table-column property="tools" label="操作" align="center"  width="80">
          <template slot-scope="scope">
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
        <el-table-column sortable
          align="center"
          property="gName"
          width="150"
          v-if="tableStatus.gName"
          label="商品名称"
        ></el-table-column>
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
          label="换货数量"
          v-if="tableStatus.rdQuantity"
        >
          <template slot-scope="scope" v-if="scope.row.gItemnum">
            <input
              type="text"
              v-model="scope.row.rdQuantity"
              :class="defStyle"
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
        <el-table-column sortable width="100" align="center" property="defNum" label="可换数量"></el-table-column>
        <el-table-column sortable
          width="150"
          align="center"
          property="iSellingprice"
          label="换货价"
          v-if="tableStatus.iSellingprice"
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
        ></el-table-column>
        <el-table-column sortable
          min-width="150"
          align="center"
          property="gRemark"
          label="备注"
          v-if="tableStatus.gRemark"
        ></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>换货出库</span>
      </div>
      <el-table
        :data="OUTtableData"
        border
        style="width: 100%"
        size="mini"
        height="300px"
        show-summary
        :summary-method="getSummariesOUT"
        sum-text="合计:"
        header-cell-class-name="thbgc"
      >
        <el-table-column type="index" width="55" align="center" property="index" >
          <template slot="header">
            <i class="fa fa-cog setting" @click="showtable=true"></i>
          </template>
        </el-table-column>
        <el-table-column property="tools" label="操作" align="center"  width="80">
          <template slot-scope="scope">
            <i class="el-icon-circle-plus add" @click="adddate()"></i>
            <i class="el-icon-circle-close del" @click="deldate(scope.$index,'out')"></i>
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
            />
            <i class="fa fa-search searchname" @click="searchbox($event,scope.$index)"></i>
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
          label="换出数量"
          v-if="tableStatus.rdQuantity"
        >
          <template slot-scope="scope" v-if="scope.row.gItemnum">
            <input
              type="text"
              v-model="scope.row.rdQuantity"
              :class="defStyle"
              @blur="QuantityBlur(scope.row)"
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
          property="iSellingprice"
          label="换出价"
          v-if="tableStatus.iSellingprice"
        >
          <template slot-scope="scope" v-if="scope.row.gItemnum">
            <input
              type="text"
              v-model="scope.row.iSellingprice"
              :class="defStyle"
              @blur="PriceBlur(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
          <template v-if="OUTsumTotalPrice">{{ $PublicJS.money(OUTsumTotalPrice, 2) }}</template>
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
          min-width="150"
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
      <!-- <el-col :xs="24" :sm="24">
        <span style="font-size:14px">是否自提:</span>
        <el-switch
          v-model="form.rIsconstruct"
          active-text="是"
          :active-value="0"
          :inactive-value="1"
          inactive-text="否"
          :disabled="disabled"
        ></el-switch>&nbsp;
        &nbsp;
        &nbsp;
        <span style="font-size:14px">直接优惠:</span>
        <el-input-number
          v-model="form.rDiscountamount"
          :precision="2"
          :step="1"
          :min="0"
          :max="form.rTotalprice"
          size="mini"
          :disabled="disabled"
        ></el-input-number>
      </el-col>-->
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>

    <div class="content" v-has='1039'>
      <div class="footer">
        <el-row>
          <el-col :xs="24" :sm="4">
            <div class="left">
              <div>
                <span>制单人</span>
                <i class="el-icon-question"></i>
                <span>{{ userName }}</span>
                <p>制单时间 &nbsp;&nbsp;&nbsp; {{ form.rDate }}</p>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="14" align="right">
            <div class="center">
              <div class="jine">
                <span>本单金额</span>
                <span>￥</span>
                <span>
                  <b v-if="OUTrTotalprice<INrTotalprice">-</b>
                  {{ $PublicJS.money(Math.abs(OUTrTotalprice-INrTotalprice), 2) }}
                </span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div class="toolright" v-if="tableData.length">
              <div
                class="jizhang"
                @click="btnSubmit"
                v-if="form.rStatus==19 && form.rItemnumparent"
              >
                <p>确认提交</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

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
      ></selectGoods>
    </el-dialog>

    <el-dialog
      title="选择审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="60%"
    >
      <examine
        :rtype="18"
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
import selectUser from "../../components/dialog/SelectUser";
import selectGoods from "../../components/dialog/SelectGoods";
import settTable from "../../components/settTable/settTable";
import getDate from "../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    selectUser,
    selectGoods,
    settTable
  },
  data() {
    return {
      defStyle: "tc ipt bgc",
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      OUTtableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      disabled: true,
      idList: [],
      showSelectUser: false,
      showSelectGoods: false,
      showexamine: false,
      showtable: false,
      orderBH: "",
      orderID: "",
      userName: this.$storage.userName,
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rTotalprice: 0,
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
        rCuidv: ""
      },
      INrTotalprice: 0,
      OUTrTotalprice: 0,
      Totalprice: 0,
      img: ""
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
    },
    OUTsumTotalPrice: function() {
      this.OUTtableData.map(item => {
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
          if (items.rStatus == 1) {
            this.defStyle = "tc ipt";
          }
          this.$api.Sale.queryDtsNum({ itemNum: items.rItemnum }).then(res1 => {
            if (res1.code == 200) {
              let params = {
                rid: items.rId,
                whid: items.rWhid
              };
              // 商品回显
              this.$api.Receiptdts.getReceiptDtsGoods(params).then(res2 => {
                res2.data.map(item => {
                  item.iSellingprice = item.rdSellingprice;
                  item.gRemark = item.rdRemark;
                  if (item.gImage) {
                    if (item.gImage) {
                      item.gImage = item.gImage.split(",");
                    }
                  }
                  if (items.rStatus == 19) {
                    res1.data.map(item1 => {
                      if (item1.rdGid == item.rdGid) {
                        item.defNum = item1.rdQuantity;
                      }
                    });

                    item.rdQuantity = item.defNum;
                    // item.khNum = res1.data;
                    // item.rdQuantity = item.defNum;
                    
                    if (item.rdIotype == 1 && item.defNum) {
                      this.tableData.push(item);
                    } else if (item.rdIotype == 2 && item.defNum) {
                      this.OUTtableData.push(item);
                    }
                  } else {
                    if (item.rdIotype == 2) {
                      this.tableData.push(item);
                    } else if (item.rdIotype == 1) {
                      this.OUTtableData.push(item);
                    }
                  }
                });
                this.form = items;
                this.getReceiver({ cuid: items.rCuid,size:99 });
                if (this.OUTtableData.length == 0) {
                  for (let i = 0; i < 5; i++) {
                    this.OUTtableData.push({
                      rdQuantity: null,
                      iQuantity: null,
                      iQuantitycanout: null,
                      iSellingprice: null,
                      sumPrice: null
                    });
                  }
                }
              });
            }
          });
        }
      });
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
    // 提交
    btnSubmit() {
      if (!this.OUTtableData[this.rowindex]) {
        this.$message({ message: "请选择换货商品", type: "warning" });
        return false;
      } else {
        this.$confirm("是否发起换货?", "提示", {
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
    dialogSubmit() {
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
          item.rdIotype = 2;
          item.rdDiscount = 100;
          tableData.push(item);
        }
      });
      let OUTtableData = [];
      this.OUTtableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iSellingprice;
          item.rdUnitprice = item.iUnitprice;
          item.rdIotype = 1;
          item.rdDiscount = 100;
          OUTtableData.push(item);
        }
      });
      this.form.rType = 18;
      this.form.rDate = getDate.getToday().starttime.replace(/\-/g, "");
      this.form.rTotalprice = this.OUTrTotalprice - this.INrTotalprice;
      this.form.rItemnumparent = this.form.rItemnum;
      delete this.form.rId;
      delete this.form.rFile;
      delete this.form.rStatus;
      delete this.form.rstatusv;

      let params = {
        approve: true, //是否发起审批
        approvers: [], //钉钉审批人ID
        receiptDtsList: tableData.concat(OUTtableData), //商品
        receiptInfoVO: this.form //单据信息
      };
      // 保存报价单
      this.$api.Exchange.save(params).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/sales/saleReplaceOrderList");
        } else {
          this.$message.error(res.err);
        }
      });
    },
    QuantityBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if ( Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        } else if (Number(val.rdQuantity) > Number(val.iQuantitycanout)) {
          val.rdQuantity = 1;
          this.$message("数量不得超过可用库存");
        }
      } else {
        val.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    PriceBlur(val) {
      if (!isNaN(val.iSellingprice)) {
        if (!val.iSellingprice) {
          this.$message.warning("请输入换出价");
          val.iSellingprice = 1;
        } else if (Number(val.iSellingprice) < Number(val.iReserveprice)) {
          this.$message.warning("当前换出价小于最低销售价");
        }
      } else {
        val.iSellingprice = 1;
        this.$message.warning("请输入数字");
      }
    },
    iptBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if ( Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        } else if (Number(val.rdQuantity) > Number(val.defNum)) {
          val.rdQuantity = val.defNum;
          this.$message("数量不得超过可换数量");
        }
      } else {
        val.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },

    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/sales/printingReplaceOrder?data=${data}`, "_blank");
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
            this.INrTotalprice = parseFloat((sums[index]).toPrecision(12));
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
    getSummariesOUT(param) {
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
    change() {
      if (this.form.rIsconstruct == 0) {
        this.hideConstr = false;
      } else {
        this.hideConstr = true;
      }
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
      this.OUTtableData.push({});
    },
    // 删除当前选中这行
    deldate(index, val) {
      if (val == "out") {
        if (this.OUTtableData.length > 1) {
          this.OUTtableData.splice(index, 1);
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
      if (this.OUTtableData[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.OUTtableData[this.rowindex + i] &&
              this.OUTtableData[this.rowindex + i].gId
            ) {
              this.OUTtableData.push(data);
            } else {
              this.OUTtableData.splice(this.rowindex + i, 1, data);
            }
          } else {
            this.OUTtableData.splice(this.rowindex + i, 1, data);
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        const data = JSON.parse(JSON.stringify(val));
        this.OUTtableData.splice(this.rowindex, 1, data);
      }
      this.showSelectGoods = false;
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
    openuser(val) {
      this.dataType = val;
      this.showSelectUser = true;
    },
    settTable() {
      this.reload();
      this.showtable = false;
      this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
    },
    setimg(u) {
      this.img = u;
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
