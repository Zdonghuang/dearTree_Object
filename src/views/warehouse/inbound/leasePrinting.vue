<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <h3 class="title">第 二 树 循 环 家 具 租 赁 入 库 单</h3>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>-->
          <!-- <el-button size="small" icon="el-icon-printer" @click="print">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <ul class="ul">
      <li>客户：{{form.rCuidv}}</li>
      <li>联系人：{{showName}}</li>
      <li>电话：{{form.rCmobile}}</li>
      <li>编号：{{orderBH}}</li>
      <li>仓库：{{form.rWhidv}}</li>
      <li>经手人：{{form.rHandmanv}}</li>
      <li>获客人：{{form.rGetguestv}}</li>
      <li>单据日期：{{form.rDate}}</li>
      <li>联系地址：{{form.rCaddr}}</li>
      <li>单据备注：{{form.rRemark}}</li>
    </ul>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
          <td>品牌</td>
          <th>单位</th>
          <th>颜色</th>
          <th>数量</th>
          <th>单价</th>
          <th>金额</th>
          <th>副台方向</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.gItemnum}}</td>
          <td>{{item.gName}}</td>
          <td>{{item.gBrandv}}</td>
          <td>{{item.gUnitv}}</td>
          <td>{{item.gColorv}}</td>
          <td>{{item.rdQuantity}}</td>
          <td>{{item.rdSellingprice}}</td>
          <td>{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td>{{item.gPzysv&&item.gPzysv.indexOf('副台')>-1?item.gPzysv:''}}</td>
          <td>{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <div>备货部门：{{form.rPreparegoods==1?'仓库组':form.rDisassembly==2?"送货组":'其他'}} &nbsp;&nbsp;送货部门：{{form.rDeliver==1?'仓库组':form.rDisassembly==2?"送货组":'其他'}} &nbsp;&nbsp;拆装部门：{{form.rDisassembly==1?'仓库组':form.rDisassembly==2?"送货组":'其他'}}</div>
    <br />
    <div>租赁时间：{{form.startDate}}-{{form.endDate}} &nbsp;&nbsp;租赁月数：{{form.months}}</div>
    <br />
    <div>制单人：{{form.rCuseridv}}</div>
    <br />
    <div>本单数量：{{num}}</div>
    <br />
    <div>本单金额：{{form.rTotalprice.toFixed(2)}}</div>
    <div></div>
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
        rLogistics: "",
        rRemark: "",
        rCuidv: "",
        rStatus: 1,
        rPreparegoods: 0,
        rDisassembly: 0,
        time: []
      },
      loading: "",
      showName: "",
      num: 0
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
          if (items.rStatus != 17) {
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
              this.num += item.rdQuantity;
              this.tableData.push(item);
            });
            this.form = items;
            this.getReceiver({ cuid: items.rCuid, size: 99 });
            this.form.rEstdelivery = this.$PublicJS.nowDate();
            this.form.time = [
              items.startDate.split("T")[0],
              items.endDate.split("T")[0]
            ];
          });
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/warehouse/inbound/leasePrinting?data=${data}`, "_blank");
    },
    getReceiver(val) {
      this.contact = [];
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) return (this.form.rCid = "");
        Items.map((item, index) => {
          if (item.cId == this.form.rCid) this.showName = item.cName;
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
            this.form.rTotalprice = parseFloat(sums[index].toPrecision(12));
            // this.TotalPrice = parseFloat((sums[index]).toPrecision(12));
          }
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
        this.$message({ message: "请选择拆装部门", type: "warning" });
        return false;
      }
      if (
        this.form.rPreparegoods &&
        this.form.rDeliver &&
        this.form.rDisassembly
      ) {
        this.$confirm("此操作将修改单据状态, 是否继续?", "提示", {
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
          item.rdIotype = 2;
          tableData.push(item);
        }
      });

      delete this.form.rFile;
      this.form.rDate = this.$PublicJS.nowDate();
      let params = {
        approve: false,
        approvers: [],
        receiptDtsList: tableData,
        receiptInfoVO: this.form
      };
      this.$api.Rent.inbound(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.$router.push("/warehouse/inbound/ZLinboundList");
        } else {
          this.$message({
            type: "error",
            message: res.err
          });
        }
      });
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
<style scoped lang="scss">
@page {
  size: auto A4 landscape;
  margin: 3mm;
}
ul,
.el-col,
table,
div,
span {
  font-size: 14px;
  font-weight: 700;
  color: black;
  font-family: "宋体" !important;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    height: 28px;
    width: 32.5%;
  }
}
.ul1 {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: inline-block;
    width: 32%;
  }
}
.ul2 {
  list-style: none;
  padding: 0;
  padding-left: 14px;
  margin: 0;
  li {
    display: inline-block;
    width: 34%;
  }
  li.lim {
    width: 30%;
  }
}
.table {
  line-height: 20px;
  text-align: center;
  tr th,
  tr td {
    padding: 2px;
  }
}
.www {
  display: inline-block;
  width: 130px;
}
.rrr {
  text-align: right;
}
.ttt {
  font-weight: 900;
}
</style>
