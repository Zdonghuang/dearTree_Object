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
        <p class="title">出库单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">客户</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select v-model="form.rCid" placeholder="请选择收货人" size="small" :disabled="disabled">
          <el-option
            v-for="item in contact"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="发货仓库"
          v-model="form.rWhidv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">发货仓库</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="经手人"
          v-model="form.rHandmanv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">经手人</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="获客人"
          v-model="form.rGetguestv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">获客人</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
      <el-table-column sortable align="center" property="gName" width="150" v-if="tableStatus.gName">
        <template slot="header">
          <span>商品名称</span>
        </template>
        <template slot-scope="scope">
          <input type="text" v-model="scope.row.gName" class="ipt" readonly :disabled="disabled" />
          <i class="fa fa-search searchname"></i>
        </template>
      </el-table-column>

      <el-table-column sortable
        width="100"
        align="center"
        property="rdQuantity"
        label="数量"
        v-if="tableStatus.rdQuantity"
      >
        <template slot-scope="scope" v-if="scope.row.gItemnum">
          <input type="text" v-model="scope.row.rdQuantity" class="ipt tc" />
        </template>
      </el-table-column>
      <!-- <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="iQuantity"
        label="库存"
        v-if="tableStatus.iQuantity"
      ></el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="iQuantitywillin"
        label="待入库库存"
        v-if="tableStatus.iQuantitywillin"
      ></el-table-column>-->

      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="iReserveprice"
        label="最低售价"
        v-if="tableStatus.iReserveprice"
      ></el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        property="iSellingprice"
        label="销售价"
        v-if="tableStatus.iSellingprice"
      >
        <template slot-scope="scope" v-if="scope.row.gItemnum">
          <input type="text" v-model="scope.row.iSellingprice" class="ipt tc" :disabled="disabled" />
        </template>
      </el-table-column>

      <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
        <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
      </el-table-column>
      <el-table-column sortable width="150" align="center" property="rdDiscount" label="折扣%">
        <template slot-scope="scope" v-if="scope.row.rdDiscount">
          <input type="text" v-model="scope.row.rdDiscount" class="ipt tc" :disabled="disabled" />
        </template>
      </el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        property="Discprice"
        label="折后单价"
        v-if="tableStatus.Discprice"
      >
        <template v-if="sumDiscountPrice">{{ sumDiscountPrice }}</template>
      </el-table-column>
      <el-table-column sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="sumdisc"
        label="折后总金额"
        v-if="tableStatus.sumdisc"
      >
        <template v-if="sumDiscountTotalPrice">{{ sumDiscountTotalPrice }}</template>
      </el-table-column>
      <el-table-column sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gColorv"
        v-if="tableStatus.gColorv"
        label="颜色"
      ></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        v-if="tableStatus.gNewoldv"
        label="新旧程度"
      ></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gSupplierv"
        v-if="tableStatus.gSupplierv"
        label="供应商"
      ></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" show-overflow-tooltip property="gSpec" label="规格"></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gCuseridv"
        v-if="tableStatus.gCuseridv"
        label="获客人"
      ></el-table-column>
      <el-table-column sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column sortable
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
      <el-table-column sortable
        min-width="150"
        align="center"
        property="gRemark"
        label="备注"
        v-if="tableStatus.gRemark"
      ></el-table-column>
    </el-table>
    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="24">
        <el-tabs type="border-card">
          <el-tab-pane label="物流信息">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="6">
                <el-input v-model="form.rLogistics" size="small" readonly>
                  <template slot="prepend">物流</template>
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="showDialog('showSelectLogistics')"
                  ></i>
                </el-input>
              </el-col>
              <el-col :xs="24" :sm="6">
                <el-input placeholder="0" v-model="form.rShipmentnumber" size="small">
                  <template slot="prepend">运单号</template>
                </el-input>
              </el-col>
              <el-col :xs="24" :sm="6">
                <el-date-picker
                  v-model="form.rEstdelivery"
                  type="date"
                  size="small"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mbottom">
      <el-col :xs="24" :sm="24">
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
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small" :disabled="disabled">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has='361'>
      <div class="footer">
        <el-row>
          <el-col :xs="24" :sm="4">
            <div class="left">
              <div>
                
              </div>
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
              <div class="jizhang" @click="opendialog" v-if="!Settle">
                <p style="padding:0 30px">出库</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog title="设置表格" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showtable" width="30%">
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
    <el-dialog title="物流公司选择" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectLogistics" width="60%">
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
      img: "",
      icon: "",
      disabled: true,
      showtable: false,
      showSelectLogistics: false,
      orderBH: "",
      orderID: "",
      userName: this.$storage.userName,
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
        rStatus: 1
      },
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
          this.getReceiver({ cuid: items.rCuid,size:99 });
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
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              item.defNum = item.rdQuantity;
              this.tableData.push(item);
            });
            this.form = items;
          });
        }
      });
    },

    getReceiver(val) {
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
          return this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: item.cAddr
          });
        });
      });
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
          column.property === "sumdisc" ||
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
            this.form.rTotalprice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.form.TotalGood = parseFloat((sums[index]).toPrecision(12));
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
    openuser(val) {
      this.dataType = val;
      this.showSelectUser = true;
    },
    // 提交
    opendialog(val) {
      if (!this.form.rLogistics) {
        this.$message({ message: "请选择物流", type: "warning" });
        return false;
      }
      if (!this.form.rShipmentnumber) {
        this.$message({ message: "请填写运单号", type: "warning" });
        return false;
      }
      if (!this.form.rEstdelivery) {
        this.$message({ message: "请选择发货时间", type: "warning" });
        return false;
      }

      let postorder = false;
      if (
        this.form.rLogistics &&
        this.form.rShipmentnumber &&
        this.form.rEstdelivery
      ) {
        postorder = true;
      }

      if (postorder) {
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

      delete this.form.rFile;
      this.form.rDate =this.$PublicJS.nowDate()
      this.$api.Receipt.ckAll(this.form).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "出库成功!"
          });

          this.$router.push("/warehouse/outbound/purchaseExchangeOutboundList");
        }
      });
    },
    setimg(u) {
      this.img = u;
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
          this.$message("数量不得超过单据数量");
        }
      } else {
        val.rdQuantity = 1;
        this.$message("请输入数字");
      }
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
