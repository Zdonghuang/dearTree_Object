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
        <p class="title">租赁结算单</p>
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
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">客户</template>
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
          <el-table-column property="tools" label="操作" align="center" width="80" v-if="!disabled">
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
          <el-table-column sortable align="center" property="gName" width="150" v-if="tableStatus.gName">
            <template slot="header">
              <span>商品名称</span>
            </template>
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
          <el-table-column sortable
            width="100"
            align="center"
            property="rdQuantity"
            label="数量"
            v-if="tableStatus.rdQuantity"
          ></el-table-column>
          <el-table-column sortable
            width="150"
            align="center"
            property="iSellingprice"
            label="单价"
            v-if="tableStatus.iSellingprice"
          ></el-table-column>

          <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
            <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
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
          <el-table-column sortable
            width="150"
            align="center"
            show-overflow-tooltip
            property="gSpec"
            label="规格"
          ></el-table-column>
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
            label="最近租赁日期"
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
      </el-col>
    </el-row>
    <el-card class="box-card" v-if="zlhas">
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

    <el-row :gutter="20" class="mtop15">
      <el-col :xs="24" :sm="7">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          align="right"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="租赁开始日期"
          end-placeholder="租赁结束日期"
          :disabled="disabled"
        ></el-date-picker>
      </el-col>

      <el-col :xs="24" :sm="4">
        <el-input placeholder="租赁月数" v-model="form.months" size="small" :disabled="disabled">
          <template slot="prepend">租赁月数</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small" :disabled="disabled">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mbottom">
      <el-col :xs="24" :sm="24">
        <el-tabs type="border-card">
          <el-tab-pane label="收款">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="6">
                <el-input
                  placeholder="0"
                  v-model="receiptFinancial.FMpSamount"
                  size="small"
                  disabled
                >
                  <template slot="prepend">预收余额(￥)</template>
                </el-input>
              </el-col>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-plus"
                v-if="this.receiptFinancial.pSamount<this.form.rTotalprice"
                @click="$router.push({path: '/financeAdd',query: { ID: form.rCuid,rid:form.rId }})"
              >添加预收款</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <img v-if="form.rBillingstatus==1" src="../../../public/images/finish.png" alt class="finish" />
    <div class="content" v-has="372">
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
                <span>{{ $PublicJS.money(form.rTotalprice, 2) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right" v-if="hideAllBtn">
            <div class="toolright">
              <div class="jizhang" @click="btnSubmit">
                <p style="padding:0 30px">结算</p>
              </div>
            </div>
          </el-col>
        </el-row>
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
  </div>
</template>

<script>
import settTable from "../../components/settTable/settTable";
import getDate from "../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    settTable
  },
  data() {
    return {
      dataType: 0,
      dingding: {},
      dingding1: {},
      tableData: [],
      contact: [],
      icon: "",
      hideAllBtn: true,
      disabled: true,
      tableData3: [{}, {}, {}, {}, {}],
      showtable: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
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
      loading:'',
      // 结算信息
      receiptFinancial: {
        amount: 0,
        cuid: 0,
        div: 1,
        rid: this.$route.query.ID,
        pSamount: 0,
        FMpSamount: 0
      },
      img: "",
      TotalPrice1: 0,
      TotalPrice2: 0,
      zlhas: true
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
          if (items.rStatus == 16) {
            this.hideAllBtn = false;
          }
          let CUparams = {
            cuid: items.rCuid
          };
          // 获取客户预存
          this.$api.Premoney.get(CUparams).then(res => {
            if (res.data.length) {
              let items1 = res.data[0];
              this.receiptFinancial.pSamount = items1.pSamount;
              this.receiptFinancial.FMpSamount = this.$PublicJS.money(
                items1.pSamount,
                2
              );

              if (items1.pSamount < items.rTotalprice) {
                this.hideAllBtn = false;
              }
            }
          });

          this.getReceiver({ cuid: items.rCuid,size:99 });
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(params).then(res => {
            res.data.map(item => {
            this.loading.close();
              item.iQuantity = item.rdQuantity;
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
            this.form = items;
            this.form.time = [
              items.startDate.split("T")[0],
              items.endDate.split("T")[0]
            ];
            // console.log(this.form)
            if (this.form.rItemnumparent.indexOf("ZLD") != -1) {
              this.zlhas = false;
            } else {
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
            }
          });
        }
      });
    },

    // 联系人回显
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
      this.$confirm("是否结算?", "提示", {
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
    },
    // 结算
    dialogSubmit() {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.receiptFinancial.amount = this.form.rTotalprice;
      this.receiptFinancial.rid = this.form.rId;
      this.receiptFinancial.cuid = this.form.rCuid;
      this.$api.Premoney.usePremoney(this.receiptFinancial).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$api.Rent.settle({ receiptId: this.orderID }).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$router.push("/lease/laseSettleList");
          });
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
    getSummaries3(param) {
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
            column.property == "money") ||
          column.property == "rdQuantity"
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
            this.TotalPrice2 = parseFloat((sums[index]).toPrecision(12));
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
    setimg(u) {
      this.img = u;
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
