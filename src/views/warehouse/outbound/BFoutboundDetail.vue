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
        <p class="title">报废出库单</p>
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
      <el-col :xs="24" :sm="4">
        <el-input placeholder="仓库" v-model="form.rWhidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">仓库</template>
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
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
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
      height="300px"
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
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gPzysv"
        label="配置"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" show-overflow-tooltip property="gSpec" label="规格"></el-table-column>
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="数量"></el-table-column>
      <el-table-column sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column sortable
        width="100"
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
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
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
        min-min-width="150"
        align="center"
        property="gRemark"
        label="备注"
        v-if="tableStatus.gRemark"
      ></el-table-column>
    </el-table>
    <el-row :gutter="20" class="mbottom mtop15">
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>备货部门：
        </span>
        <el-radio-group v-model="form.rPreparegoods">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>送货部门：
        </span>
        <el-radio-group v-model="form.rDeliver">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :xs="24" :sm="24">
        <span style="font-size:14px">
          <b class="red">*</b>安装部门：
        </span>
        <el-radio-group v-model="form.rDisassembly">
          <el-radio :label="1">仓库组</el-radio>
          <el-radio :label="2">送货组</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
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
                <p style="padding:0 30px">出库</p>
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
  </div>
</template>

<script>
import settTable from "../../../components/settTable/settTable";
import getDate from "../../../utils/getDate";
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
      rowindex: "",
      icon: "",
      disabled: true,
      hasdis: false,
      img: "",
      showtable: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
        rTotalprice: 0,
        TotalGood: 0,
        rDiscountamount: 0,
        rWhid: 0,
        rHandman: 0,
        rCtime: "",
        rDate: "",
        rRemark: "",
        rStatus: 1,
        rPreparegoods: 0,
        rDisassembly: 0
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
          this.orderBH = items.rItemnum;
          if (items.rStatus != 7) {
            this.hasdis = true;
            this.defstyle = "ipt tc";
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
          });
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
          !values.every(value => isNaN(value)) &&
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
        this.$confirm("此操作将出库, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delete this.form.rFile;
            delete this.form.rCuid;
            this.form.rDate = this.$PublicJS.nowDate();
            this.$api.Receipt.ckAll(this.form).then(res => {
              if (res.code === 200) {
                this.$message({ message: "提交成功", type: "success" });
                this.$router.push("/warehouse/outbound/BFoutboundList");
              } else {
                this.$message(res.err);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    setimg(u) {
      this.img = u;
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
