      			
<template>
  <div class="Delivery" id="lastcontent">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center" style="height:10px">
        <h3 class="title">第 二 树 循 环 家 具 采 购 合 同</h3>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <div>合同编号：DT{{form.rDate.split('-')[0]}}{{form.rDate.split('-')[1]}}{{form.rDate.split('-')[2]}}{{orderBH.slice(-2)}}</div>
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>-->
          <!-- <el-button size="small" icon="el-icon-printer" @click="print">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <ul class="ul">
      <li>甲方（买方）：山东第二树循环家具有限公司</li>
      <li>纳税人识别号：91370400MA3MQPXJ85</li>
      <li>电话地址：山东省枣庄市薛城区珠江路SOHU珠江，D2座1802室 T:15974252876</li>
      <li>开户行及账号：中国农业银行股份有限公司枣庄薛城支行 15270101040012741</li>
      <li>乙方（卖方）：{{form.rCuidv}}</li>
      <li>纳税人识别号：{{tnum}}</li>
      <li>电话地址：{{addr}}</li>
      <li>开户行及账号：{{cuBankname}}</li>
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
          <th>单价</th>
          <th>金额</th>
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
          <td v-if="i==tableData.length-1">{{form.rTotalprice.toFixed(2)}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.gItemnum}}</td>
          <td v-if="i!=tableData.length-1">{{item.gName}}</td>
          <td v-if="i!=tableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gColorv}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td v-if="i!=tableData.length-1">{{item.gRemark}}</td>
        </tr>
      </tbody>
    </table>
    <p>备注：{{form.rRemark}}</p>
    <div>1、付款方式：</div>
    <div>2、交货方式：合同生效后 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天内发货，并告知买方物流单号方便及时跟踪进程。</div>
    <div>3、违约责任：卖方所交的产品品种、型号、规格不符合合同规定的，买方有权拒收产品，卖方赔付货款总值百分之五的违约金。卖方不能交付产品的，向买方赔付货款总值百分之五的违约金。卖方逾期交付产品，向买方赔付逾期交货部分货款总额的百分之五。逾期交付超过十天，买方有权终止合同。</div>
    <div>4、本合同一式两份，买卖双方各1份，自双方签字盖章之日起生效</div>
    <br />
    <ul class="ul1">
      <li>甲方（签字）：山东第二树循环家具有限公司</li>
      <li>乙方（盖章）：</li>
    </ul>

    <div style="float:right">日期：{{form.rDate}}</div>
    <br />
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
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
      addr: "",
      tnum: "",
      mobilestr: "",
      cuBankname: "",
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
            this.tableData.push({});
            this.form = items;
            this.$api.Customer.get({ id: this.form.rCuid }).then(res => {
              if (res.data) {
                let item = res.data.records;
                this.addr = item[0].cuBankcardnum;
                this.tnum = item[0].cuTaxnum;
                this.mobilestr = item[0].mobilestr;
                this.cuBankname = item[0].cuBankname;
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
        PDF.save("采购报价单.pdf"); // 这里是导出的文件名
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
col,
table,
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
    height: 28px;
    width: 100%;
  }
  :nth-child(4) {
    margin-bottom: 10px;
  }
}
.ul1 {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    width: 58%;
  }
  :last-child {
    width: 40%;
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
