<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center" style="height:10px">
        <h3 class="title">第 二 树 循 环 家 具 {{form.rOidv}} 销 售 换 货 单</h3>
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
      <li>销售日期：{{form.rDate}}</li>
      <li>订单编号：{{orderBH}}</li>
      <li>销售顾问：{{form.rHandmanv}}</li>
      <li>客户名称：{{form.rCuidv}}</li>
      <li>联系人：{{form.rCidv}}</li>
      <li>联系人电话：{{form.rCmobile}}</li>
      <li>收货地址：{{form.rCaddr}}</li>
    </ul>
    <h4>入库商品</h4>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
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
          <td v-if="i==tableData.length-1">合计</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1">{{t1.toFixed(2)}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.gItemnum}}</td>
          <td v-if="i!=tableData.length-1">{{item.gName}}</td>
          <td v-if="i!=tableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gColorv}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td
            v-if="i!=tableData.length-1"
          >{{item.gPzysv&&item.gPzysv.indexOf('副台')>-1?item.gPzysv:''}}</td>
          <td v-if="i!=tableData.length-1">{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <h4>出库商品</h4>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
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
        <tr v-for="( item , i) in OUTtableData" :key="i">
          <td v-if="i==OUTtableData.length-1">合计</td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1">{{t2.toFixed(2)}}</td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i==OUTtableData.length-1"></td>
          <td v-if="i!=OUTtableData.length-1">{{i+1}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.gItemnum}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.gName}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.gColorv}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=OUTtableData.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td
            v-if="i!=OUTtableData.length-1"
          >{{item.gPzysv&&item.gPzysv.indexOf('副台')>-1?item.gPzysv:''}}</td>
          <td v-if="i!=OUTtableData.length-1">{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <h4>备注：{{form.rRemark}}</h4>
    <ul class="ul">
      <li>客户签字</li>
      <li>销售顾问签字</li>
    </ul>
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
export default {
  inject: ["reload"],
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
      img: "",
      t1: 0,
      t2: 0
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
                this.OUTtableData.push({});
                this.tableData.push({});
                this.tableData.map(item => {
                  if (item.rdQuantity) {
                    this.t1 += item.rdQuantity * item.rdSellingprice;
                  }
                });
                this.OUTtableData.map(item => {
                  if (item.rdQuantity) {
                    this.t2 += item.rdQuantity * item.rdSellingprice;
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
