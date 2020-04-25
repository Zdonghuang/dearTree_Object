<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <h3
          class="title"
        >第 二 树 循 环 家 具 {{form.rOidv}} {{orderBH.indexOf('NBDBD')>-1?' 内 部 调 拨':' 分 公 司 调 拨'}} 单</h3>
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
      <li>出库仓库：{{form.rWhidv}}</li>
      <li>入库仓库：{{form.rWhidtransferv}}</li>
      <li>经手人：{{form.rHandmanv}}</li>
      <li>单据日期：{{form.rDate}}</li>
      <li>单据备注：{{form.rRemark}}</li>
    </ul>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
          <th>单位</th>
          <th>颜色</th>
          <th>数量</th>
          <th v-if="this.form.rType!=45">单价</th>
          <th v-if="this.form.rType!=45">金额</th>
          <th>副台方向</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.gItemnum}}</td>
          <td>{{item.gName}}</td>
          <td>{{item.gUnitv}}</td>
          <td>{{item.gColorv}}</td>
          <td>{{item.rdQuantity}}</td>
          <td v-if="this.form.rType!=45">{{item.rdSellingprice}}</td>
          <td v-if="this.form.rType!=45">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td>{{item.gPzysv&&item.gPzysv.indexOf('副台')>-1?item.gPzysv:''}}</td>
          <td>{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <div>制单人：{{form.rCuseridv}}</div>
    <br>
    <div>本单数量：{{num}}</div>
    <br>
    <div>本单金额：{{form.rTotalprice.toFixed(2)}}</div>
    <div></div>
  </div>
</template>

<script>
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
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
        rCidv: "",
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
        rPreparegoods: "1",
        rDisassembly: "1",
        rFile: []
      },
      i: 0,
      fileList: [],
      formData: {},
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
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
          if (items.rStatus == 19) {
            this.hasdis = true;
          }
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
              this.num += item.rdQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
            this.form = items;
            this.getReceiver({ cuid: items.rCuid,size:99 });
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
          });
        }
      });
    },
    // 收货人回显
    getReceiver(val) {
    //   this.$api.Contact.get(val).then(res => {
    //     if (res.code == 200) {
    //       let Items = res.data.records;
    //       if (!Items.length) return (this.form.rCid = "");
    //       let obj = Items.find(item => {
    //         return item.cCuid == val.cuid;
    //       });
    //       this.form.rCid = obj.cId;
    //       this.form.rCidv = obj.cName;
    //       this.$forceUpdate();
    //     }
    //   });
    },
    updataFUN() {
      this.$confirm("此操作将更新数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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

              this.$api.Receipt.update(this.form).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "提交成功!"
                  });
                  this.$router.push("/warehouse/outbound/saleOutboundList");
                } else {
                  this.$message({
                    type: "error",
                    message: res.err
                  });
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
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
    showDialog(val) {
      this[val] = true;
    },
    setimg(u) {
      this.img = u;
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
<style lang="scss" scoped>
@page {
  size: auto A4 landscape;
  margin: 3mm;
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
