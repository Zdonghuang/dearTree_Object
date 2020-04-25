<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="16" align="center" style="height:10px">
        <h3 class="title">第 二 树 循 环 家 具 {{form.rOidv}} {{form.rType==13?' 销 售 订':' 租 赁'}} 单</h3>
      </el-col>
      <el-col :xs="24" :sm="4" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>-->
          <!-- <el-button size="small" icon="el-icon-printer" @click="print">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <ul class="ul">
      <li>销售日期：{{form.rDate}}</li>
      <li class="w">订单编号：{{orderBH}}</li>
      <li>销售顾问：{{form.rHandmanv}}</li>
      <li>销售电话：{{mobile}}</li>
      <li class="w ww">客户名称：{{form.rCuidv}}</li>
      <li>联系人：{{form.rCidv}}</li>
      <li>联系人电话：{{form.rCmobile}}</li>
      <li>收货地址：{{form.rCaddr}}</li>
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
          <th>{{form.rType!=13?'租赁':''}}单价</th>
          <th>金额</th>
          <th>副台方向</th>
          <th v-if="form.rType!=13">销售单价</th>
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
          <td v-if="i==tableData.length-1">{{num}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1">{{price1}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1&&form.rType!=13"></td>
          <td v-if="i==tableData.length-1" class="bz"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.gItemnum}}</td>
          <td v-if="i!=tableData.length-1">{{item.gName}}</td>
          <td v-if="i!=tableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gColorv}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData.length-1">{{form.rType!=13?item.gRentprice:item.rdSellingprice}}</td>
          <td
            v-if="i!=tableData.length-1"
          >{{((form.rType!=13?item.gRentprice:item.rdSellingprice)*item.rdQuantity).toFixed(2)}}</td>
          <td
            v-if="i!=tableData.length-1"
          >{{item.gPzysv&&item.gPzysv.indexOf('副台')>-1?item.gPzysv:''}}</td>
          <td v-if="i!=tableData.length-1&&form.rType!=13">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData.length-1" class="bz">{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>类型</th>
          <th>数量</th>
          <th>单价</th>
          <th>总额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData3" :key="i">
          <td v-if="i==tableData3.length-1">合计</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1">{{num1}}</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1">{{price2}}</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i!=tableData3.length-1">{{i+1}}</td>
          <td v-if="i!=tableData3.length-1">
            <select v-model="item.gId" disabled>
              <option v-for="item in SPFL" :key="item.gId" :value="item.gId">{{item.cAttrvalue}}</option>
            </select>
          </td>
          <td v-if="i!=tableData3.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData3.length-1">{{item.iSellingprice}}</td>
          <td v-if="i!=tableData3.length-1">{{item.rdQuantity * item.iSellingprice}}</td>
          <td v-if="i!=tableData3.length-1">{{item.rdRemark}}</td>
        </tr>
      </tbody>
    </table>
    <div class="red">总金额： {{form.rTotalprice.toFixed(2)}}</div>
    <div v-if="form.rType!=13">
      <ul class="ul1">
        <li>租赁期限：</li>
        <li>押金：</li>
      </ul>
    </div>
    <div class="fs18">送货时间：</div>
    <div class="fs18">备注：{{form.rRemark}}</div>
    <ul class="ul1">
      <li>确认是否需要发票？ &nbsp;&nbsp;&nbsp;是 &nbsp;&nbsp;&nbsp;否</li>
      <li>客户签字</li>
      <li>销售顾问签字</li>
    </ul>
    <br />
    <div>一、说明：</div>
    <div class="pl10">1.运费：货款达到5000元，25公里内免运费;货款不足5000元，起步运费150元，超出25公里以上部分按10元/公里收运费。</div>
    <div class="pl10">2.家具需人工搬运上楼(无电梯或电梯无法使用或复式楼等)，每个楼层加收上楼费50元/车。</div>
    <div class="pl10">3.因卸货位置不便，需人工搬运超过50米，加收远距离搬运费：每10米增加10元/车。</div>
    <div class="pl10">4.货品清单价格为税前价格，开发票需另加税金，普票税率3%。</div>
    <div>二、收款账户</div>
    <div v-for="(item,i) in Texta" :key="item.uName">
      <div>{{i+1}}.户名：{{item.uName}}&nbsp;&nbsp; 开户行：{{item.bankName}}&nbsp; 账号： {{item.bankNum}}</div>
    </div>
    <div v-for="(item,i) in Textb" :key="item.uName">
      <div>{{i+1}}.户名：{{item.uName}}&nbsp;&nbsp; 开户行：{{item.bankName}}&nbsp; 账号： {{item.bankNum}}</div>
    </div>
    <!-- <input type="button" @click="exePrint()" value="打印" /> -->
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
// import $ from 'jquery'
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
      Texta: [],
      Textb: [],
      num1: 0,
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
      mobile: "",
      SPFL: [],
      fileList: [],
      formData: {},
      tableData3: [],
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      num: 0,
      price1: 0,
      price2: 0
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
    this.getService();
    window.addEventListener("keydown", this.printOut);
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
    exePrint() {
      console.dir($);
      $(".Delivery").jqprint();
    },
    // 单据回显
    getOrder() {
      this.Texta = [];
      this.Textb = [];
      let rId = { rId: this.orderID };
      if (!this.orderID) {
        rId = { rItemnum: this.orderBH };
      }
      // 单据信息回显
      this.$api.Receipt.get(rId).then(res => {
        if (res.data) {
          let items = res.data.records[0];
          this.$api.User.get({ auth: 2, uid: items.rHandman }).then(res => {
            if (res.data) {
              this.mobile = res.data.records[0].uMobile;
            }
          });
          this.orderBH = items.rItemnum;
          if (items.rStatus == 19) {
            this.hasdis = true;
          }
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          this.$api.Receiptdts.getReceiptDtsGoods({ rid: items.rId }).then(
            res => {
              this.tableData3 = [];
              res.data.map((item, index) => {
                item.iQuantity = item.rdQuantity;
                item.iSellingprice = item.rdSellingprice;
                item.gRemark = item.rdRemark;
                if (item.rdIotype == 4) {
                  this.num1 += item.rdQuantity;
                  item.gId = `${item.rdGid}`;
                  item.iSellingprice = item.rdSellingprice;
                  this.price2 += item.iQuantity * item.iSellingprice;
                  this.tableData3.push(item);
                }
              });
              if (this.tableData3.length) {
                this.tableData3.push({});
              }
            }
          );
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
              this.price1 += item.rdQuantity * item.iSellingprice;
              this.tableData.push(item);
            });
            this.tableData.push({});
            this.form = items;
            this.$api.Common.get({
              typeCode: "printYHZH",
              value1: this.form.rOid
            }).then(res => {
              if (res.data && res.data.length) {
                res.data.map(item => {
                  if (item.cValue2 == "是") {
                    // cAttrvalue  户名
                    // cValue6  开户行名称
                    // cValue3  开户行账号
                    let obj = {
                      uName: item.cAttrvalue,
                      bankName: item.cValue6,
                      bankNum: item.cValue3
                    };
                    this.Texta.push(obj);
                  }
                });
              }
            });
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
    printOut(e) {
      if (e.keyCode != 17) return false;
      document.body.style.width = "930px";
      let shareContent = document.body, //需要截图的包裹的（原生的）DOM 对象
        width = shareContent.clientWidth, //获取dom 宽度
        height = shareContent.scrollHeight, //获取dom 高度
        canvas = document.createElement("canvas"), //创建一个canvas节点
        scale = 1; //定义任意放大倍数 支持小数
      canvas.width = width * scale; //定义canvas 宽度 * 缩放
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.style.width = shareContent.clientWidth * scale + "px";
      canvas.style.height = shareContent.clientHeight * scale + "px";
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      let opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，便于查看this.$html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      };
      this.$html2canvas(shareContent, opts).then(() => {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        var pageHeight = (contentWidth / 592.28) * 841.89;
        //未生成pdf的html页面高度
        var leftHeight = contentHeight;
        //页面偏移
        var position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28;
        var imgHeight = (592.28 / contentWidth) * contentHeight;
        var pageData = canvas.toDataURL("image/jpeg", 1.0);
        var PDF = new this.$JsPDF("", "pt", "a4");
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        let name = this.form.rType == 13 ? "销售订单" : " 租赁单";
        PDF.save(name + ".pdf"); // 这里是导出的文件名
        window.location.reload();
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
div {
  font-weight: 700;
  font-size: 14px;
  color: black;
  font-family: "宋体" !important;
}
table td.bz {
  max-width: 60px;
  overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
  text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
  white-space: nowrap;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    height: 20px;
    width: 28%;
  }
  li.w {
    display: inline-block;
    height: 20px;
    width: 40%;
  }
  li.ww{
    width: 60%;
  }
  :last-child {
    width: 100%;
  }
}
.ul1 {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
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
.fs18 {
  font-size: 14px;
  font-weight: 700;
  color: black;
}
</style>
