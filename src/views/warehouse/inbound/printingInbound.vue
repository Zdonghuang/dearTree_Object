<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center" style="height:30px">
        <h3 class="title">第 二 树 循 环 家 具 {{form.rOidv}} {{form.rType==5?' 回 收':' 采 购'}} 入 库 单</h3>
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
      <li>编号：{{orderBH}}</li>
      <li>经手人：{{form.rHandmanv}}</li>
      <li>收货仓库：{{form.rWhidv}}</li>
      <li>供应商：{{form.rCuidv}}</li>
      <li>联系人电话：{{form.rCmobile}}</li>
      <li>单据日期：{{form.rDate}}</li>
      <li>备注：{{form.rRemark}}</li>
    </ul>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
          <th>单位</th>
          <th>数量</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.gItemnum}}</td>
          <td>{{item.gName}}</td>
          <td>{{item.gUnitv}}</td>
          <td>{{item.rdQuantity}}</td>
          <td>{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <div>本单数量：{{number}}</div>
    <div>制单人：{{form.rCuseridv}}</div>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      showSelectLogistics: false,
      orderBH: null,
      orderID: null,
      // 单据信息
      form: {
        rId: null,
        rItemnum: null,
        rIsconstruct: 1,
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
        rEstdelivery: this.$PublicJS.nowDate(),
        rLogistics: "",
        rRemark: "",
        rShipmentnumber: "",
        rCuidv: ""
      },
      TotalPrice: 0,
      number: 0,
      nowdata: "",
      p: 0,
      img: ""
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        return (item.money = item.rdQuantity * item.iSellingprice);
      });
    }
  },
  created() {
    let date = new Date();
    let arr = [];
    arr[0] = date.getFullYear();
    arr[1] = date.getMonth() + 1;
    arr[2] = date.getDate();
    if (arr[1] < 10) {
      arr[1] = `0${arr[1]}`;
    }
    if (arr[2] < 10) {
      arr[2] = `0${arr[2]}`;
    }
    this.nowdata = arr.join("");
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
  methods: {
    // 用户回显
    getuser() {
      let param = {
        id: this.userid
      };
      this.$api.Customer.get(param).then(res => {
        this.rCuidv = res.data.records["cuName"];
      });
    },
    // 单据回显
    getOrder() {
      this.tableData = [];
      let rId = { rId: this.orderID };
      if (!this.orderID) {
        rId = { rItemnum: this.orderBH };
      }
      // 单据信息回显
      this.$api.Receipt.get(rId).then(res => {
        if (res.data) {
          let items = res.data.records[0];
          if (items.rIsconstructexpenseconfirm) {
            this.$api.Receiptdts.getCmoney({ rid: items.rId }).then(res => {
              if (res.constructcost) {
                this.m = res.constructcost;
              }
            });
          }
          if (items.rTotalprice < 0) {
            items.rTotalprice = 0;
          }
          this.orderBH = items.rItemnum;
          this.getReceiver({ cuid: items.rCuid,size:99 });
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(params).then(res => {
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              this.number += item.rdQuantity;
              item.defNum = item.rdQuantity;
              item.dj = 0;
              item.gConstructcostweight = item.rdConstructcostweight;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              if (item.rdIotype == 2 || item.rdIotype == 3) {
                if (item.rdIotype == 3) {
                  item.iSellingprice = 0;
                }
                this.door = true;
                this.tableData.push(item);
              }
            });
            console.log(this.tableData);
          });
          this.form = items;
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
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/warehouse/inbound/printingInbound?data=${data}`,
        "_blank"
      );
    },
    // 提交
    opendialog(val) {
      this.$confirm("此操作将直接入库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogSubmit();
      });
    },
    // 审核提交
    dialogSubmit() {
      const loading = this.$loading({
        lock: true,
        text: "入库中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      delete this.form.rFile;
      this.form.rDate = this.nowdata;
      this.form.rTotalprice = this.TotalPrice
      let params = {
        approve: false,
        receiptDtsList: [],
        receiptInfoVO: this.form
      };
      let num = 0;
      this.tableData.forEach((item, index) => {
        item.rdGid = item.gId;
        item.rdRemark = item.gRemark;
        item.rdIotype = 2;
        item.rdSellingprice = item.iSellingprice;
        item.rdQuantitysurplus -= item.rdQuantity;
        item.rdConstructcostweight = item.gConstructcostweight;
        item.rdConstructcostweight = 9;
        params.receiptDtsList.push(item);
      });
      this.$api.Receipt.saveall(params).then(res => {
        if (res.code === 200) {
          this.$api.Receipt.rkAll(this.form).then(res => {
            loading.close();
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "入库成功!"
              });
              this.$router.push("/warehouse/inbound/purchaseInboundList");
            } else {
              this.$message.error(res.err);
            }
          });
        } else {
          loading.close();
          this.$message.error(res.err);
        }
      });
    },
    setnum(val) {
      if (isNaN(val.rdQuantity)) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("请输入数字");
      }
      if (val.rdQuantity > val.rdQuantitysurplus) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("入库数量超出待入库数量");
      }
      if (val.rdQuantity < 0) {
        val.rdQuantity = val.rdQuantitysurplus;
      }
      if (this.tableData.length == 1 && val.rdQuantity <= 0) {
        val.rdQuantity = val.rdQuantitysurplus;
      }
      let num = 0;
      this.tableData.map(item => {
        if (item.rdQuantity == 0) num++;
      });
      if (num == this.tableData.length) {
        val.rdQuantity = val.rdQuantitysurplus;
        return this.$message.error("入库数量不能全部为0");
      }
    },
    setmoney(val) {
      if (isNaN(val.iSellingprice)) {
        val.iSellingprice = 1;
        return this.$message.error("请输入数字");
      }
      if (val.iSellingprice <= 0) {
        val.iSellingprice = 1;
        return this.$message.error("请输入单价");
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
            column.property === "rdQuantity") ||
          column.property === "money"
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
            sums[index] += " 元";
            this.TotalPrice = parseFloat((sums[index]).toPrecision(12));
          }
          if (column.property === "rdQuantity") {
            this.number = parseFloat((sums[index]).toPrecision(12));
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
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
    }
  }
};
</script>
<style lang="scss" scoped>
@page {
  size: auto A4 landscape;
  margin: 3mm;
}
ul,
col,
table,
tr,
thead,
tbody,
td,
th,
div {
  color: rgb(80, 80, 80);
  font-weight: 100;
  font-family: '宋体' !important;
}
div {
  font-weight: 500;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    height: 26px;
    width: 32.5%;
  }
  :last-child{
      width: 100%;
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
