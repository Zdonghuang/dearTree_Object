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
        <p class="title">销售结算单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
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
    <el-row>
      <el-col>
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
          <el-table-column type="index" width="55" align="center" property="index" label="序号"></el-table-column>
          <el-table-column sortable width="120" align="center" property="gItemnum" label="货号"></el-table-column>
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
          <el-table-column sortable align="center" property="gName" width="200" label="商品名称"></el-table-column>
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
            width="120"
            align="center"
            property="gPzysv"
            show-overflow-tooltip
            label="配置"
          ></el-table-column>
          <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
          <el-table-column sortable width="120" align="center" property="rdQuantity" label="销售数量"></el-table-column>
          <el-table-column sortable width="80" align="center" property="gUnitv" label="单位"></el-table-column>
          <el-table-column sortable width="150" align="center" property="iSellingprice" label="销售价"></el-table-column>
          <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
            <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
          </el-table-column>
          <el-table-column sortable width="100" align="center" property="gNewoldv" label="新旧程度"></el-table-column>
          <el-table-column sortable width="150" align="center" property="gCtime" label="最近销售日期"></el-table-column>
          <el-table-column sortable min-width="150" align="center" property="gRemark" label="备注"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-card class="box-card" v-if="tableData3.length">
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
          <el-table-column property="tools" label="操作" align="center" width="80" v-if="!disabled">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(3)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,3)"></i>
            </template>
          </el-table-column>
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
          <el-table-column sortable property="iSellingprice" label="单价"></el-table-column>
          <el-table-column sortable label="金额" property="money" align="center">
            <template v-if="money3">{{money3}}</template>
          </el-table-column>
          <el-table-column sortable property="gRemark" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-row :gutter="20" class="mtop15 mbottom">
      <el-col :xs="24" :sm="6">
        <el-input placeholder="0" v-model="receiptFinancial.FMpSamount" size="small" disabled>
          <template slot="prepend">预收余额(￥)</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-plus"
          @click="$router.push({path: '/financeAdd',query: { ID: form.rCuid,rid:form.rId }})"
        >添加预收款</el-button>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <img
      v-if="form.rBillingstatus==1"
      src="../../../../public/images/finish.png"
      alt
      class="finish"
    />
    <div class="content" v-has="1069">
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
                <span>应收金额</span>
                <span>￥</span>
                <span>{{$PublicJS.money(form.rTotalprice, 2)}}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right" v-if="hashidebtn">
            <div class="toolright" v-if="form.rStatus!=19">
              <div class="jizhang" @click="btnSubmit">
                <p style="padding:0 30px">结算</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      defStyle: "ipt tc bgc",
      tableData: [],
      tableData3: [{}, {}, {}, {}, {}],
      icon: "",
      hasED: false,
      hashidebtn: false,
      disabled: true,
      showtable: false,
      orderBH: "",
      orderID: "",
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rIsconstruct: 1,
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
        rRemark: "",
        rCuidv: ""
      },
      // 结算信息
      receiptFinancial: {
        amount: 0.0,
        cuid: 0,
        div: 1,
        pSamount: 0.0,
        rDiscountamount: 0.0
      },
      img: "",
      TotalPrice1: 0,
      TotalPrice2: 0,
      loading: ""
    };
  },
  watch: {
    $route(to, from) {
      if (this.$route.query.data) {
        var newid = window.atob(this.$route.query.data); //当前页新id
        var oldid = window.atob(sessionStorage.getItem("oldworkorderid")); //旧的id
        if (oldid != newid) {
          //id有变化时
          sessionStorage.setItem("oldworkorderid", this.$route.query.data);
          this.getOrder(newid);
        }
      }
    }
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
      this.getService();
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
    getOrder(val) {
      this.tableData = [];
      this.tableData3 = [];
      this.loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      sessionStorage.setItem("oldworkorderid", this.$route.query.data);
      let rId = { rId: this.orderID };
      if (val) {
        rId.rId = val;
      }
      if (!this.orderID) {
        rId = { rItemnum: this.orderBH };
      }
      // 单据信息回显
      this.$api.Receipt.get(rId).then(res => {
        if (res.data) {
          let items = res.data.records[0];
          this.orderBH = items.rItemnum;
          if (items.rStatus == 19) {
            this.hasED = true;
            this.defStyle = "ipt tc";
          }
          // 获取客户预存
          this.$api.Premoney.get({ cuid: items.rCuid }).then(res => {
            if (res.data.length) {
              let items1 = res.data[0];
              this.receiptFinancial.pSamount = items1.pSamount;
              this.receiptFinancial.FMpSamount = this.$PublicJS.money(
                items1.pSamount,
                2
              );
            } else {
              this.receiptFinancial.pSamount = 0;
              this.receiptFinancial.FMpSamount = 0.0;
            }
            if (this.receiptFinancial.pSamount < items.rTotalprice) {
              this.hashidebtn = false;
            } else {
              this.hashidebtn = true;
            }
            this.$forceUpdate();
          });
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(params).then(res => {
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              item.defNum = item.rdQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
          });
          this.$api.Receiptdts.getReceiptDtsGoods({ rid: items.rId }).then(
            res => {
              this.loading.close();
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
          this.form = items;
          this.getReceiver({ cuid: items.rCuid, size: 99 });
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
    // 提交
    btnSubmit() {
      let msg = "是否结算？";
      // if (
      //   this.receiptFinancial.pSamount !=
      //   parseFloat((this.TotalPrice1 + this.TotalPrice2).toPrecision(12))
      // ) {
      //   msg = "结算金额与预收余额有差异，是否结算？";
      // } else {
      //   if (this.receiptFinancial.pSamount != this.form.rTotalprice) {
      //     msg = "结算金额与本单金额有差异，是否结算？";
      //   }
      // }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定结算",
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
    },
    // 结算
    dialogSubmit() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "提交中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      let tableData = [];
      this.tableData.forEach(item => {
        if (item.gName) {
          item.rdGid = item.gId;
          item.rdSellingprice = item.iSellingprice;
          item.rdUnitprice = item.iUnitprice;
          item.rdRemark = item.gRemark;
          item.rdIotype = 1;
          tableData.push(item);
        }
      });
      let tableData3 = [];
      this.tableData3.forEach(item => {
        if (item.rdQuantity) {
          item.rdGid = item.gId;
          item.rdQuantity = item.rdQuantity;
          item.rdSellingprice = item.iSellingprice;
          item.rdRemark = item.gRemark;
          item.rdIotype = 4;
          tableData3.push(item);
        }
      });
      delete this.form.rFile;
      this.form.rDate = this.$PublicJS.nowDate();
      let param = {
        approve: false,
        approvers: [],
        cc: [],
        billingAmount: this.form.rTotalprice,
        // billingAmount: parseFloat((this.TotalPrice1 + this.TotalPrice2).toPrecision(12)),
        billingDiv: 1,
        receiptInfoVO: this.form,
        receiptDtsList: tableData.concat(tableData3) //商品+服务
      };
      param.receiptInfoVO.rStatus = 19;
      param.receiptInfoVO.rBillingstatus = 1;
      this.$api.Receipt.saveall(param).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push("/sales/settle/salesSettleOrderList");
        } else {
          this.$message.error(res.err);
        }
      });
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
            // this.form.rTotalprice = parseFloat((sums[index]).toPrecision(12));
            // this.TotalPrice1 = sums[index]
          }
          if (column.property === "rdQuantity") {
            // this.form.TotalGood = sums[index]
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
            this.TotalPrice2 = sums[index];
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
    iptBlur(val) {
      if (!isNaN(val.iSellingprice)) {
        if (!val.iSellingprice) {
          this.$message.warning("请输入销售价");
          val.iSellingprice = 1;
        } else if (val.iSellingprice < 0) {
          val.iSellingprice = 0;
        }
      } else {
        val.iSellingprice = 1;
        this.$message.warning("请输入数字");
      }
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
