<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH"></div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center" style="height:10px">
        <h3
          class="title"
          v-if="form.rType==15||form.rType==73"
        >第 二 树 循 环 家 具 {{form.rOidv}} {{form.rType==15?'':' 租 赁'}} 发 货 单</h3>
        <h3
          class="title"
          v-if="form.rType==35||form.rType==72"
        >第 二 树 循 环 家 具 {{form.rOidv}} {{form.rType==35?'销 售':' 租 赁'}} 发 货 单</h3>
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
      <li>送货日期：___月___日</li>
      <li>单据日期：{{form.rDate}}</li>
      <li>发货仓库：{{form.rWhidv}}</li>
      <li>订单编号：{{orderBH}}</li>
      <li>来源订单编号：{{form.rItemnumparent}}</li>
      <li>预计发货时间：</li>
      <li>电话预约人：</li>
      <li class="w">客户名称：{{form.rCuidv}}</li>
      <li>客户电话：{{form.rCmobile}}</li>
      <li>销售顾问：{{form.rHandmanv}}</li>
      <li>销售电话：{{mobile}}</li>
    </ul>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>商品名称</th>
          <th>规格</th>
          <th>配置</th>
          <th>颜色</th>
          <th>单位</th>
          <th>数量</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData" :key="i">
          <td v-if="i==tableData.length-1">合计</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1" class="bz"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1">{{num}}</td>
          <td v-if="i==tableData.length-1" class="bz"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.gItemnum}}</td>
          <td v-if="i!=tableData.length-1">{{item.gName}}</td>
          <td v-if="i!=tableData.length-1">{{item.gSpec}}</td>
          <td v-if="i!=tableData.length-1" class="bz">{{item.gPzysv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gColorv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdQuantity}}</td>
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
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData3" :key="i">
          <td v-if="i==tableData3.length-1">合计</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1">{{num1}}</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i!=tableData3.length-1">{{i+1}}</td>
          <td v-if="i!=tableData3.length-1">
            <select v-model="item.gId" disabled>
              <option v-for="item in SPFL" :key="item.gId" :value="item.gId">{{item.cAttrvalue}}</option>
            </select>
          </td>
          <td v-if="i!=tableData3.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData3.length-1">{{item.rdRemark}}</td>
        </tr>
      </tbody>
    </table>
    <div class="color">总金额： {{form.rTotalprice.toFixed(2)}}</div>
    <div class="color">备注：{{form.rRemark}}</div>
    <ul class="ul">
      <li style="width:50%">收货人：{{form.rCuidv}}</li>
      <li>联系电话：{{form.rCmobile}}</li>
    </ul>
    <div class="color">收货地址：{{form.rCaddr}}</div>
    <div class="color">一、送货安装要求：</div>
    <ul class="ul2">
      <li>1、施工保护:&nbsp;{{Envform.rcSgbh!=0?'是':'否'}}</li>
      <li>2、是强弱电处理:&nbsp;{{Envform.rcQrdcl!=0?'是':'否'}}</li>
      <li>3、交叉施工:&nbsp;{{Envform.rcJcsg!=0?'是':'否'}}</li>
      <li>4、专梯:&nbsp;{{Envform.rcSqzt!=0?'是':'否'}}</li>
      <li>5、出门条:&nbsp;{{Envform.rcCmt!=0?'是':'否'}}</li>
      <li>6、卸车位置:&nbsp;{{Envform.rcCmt!=0?'地面':'地库'}}</li>
      <li>7、工地距离(公里):&nbsp;{{Envform.rcGdjl>0?Envform.rcGdjl:''}}</li>
      <li>8、搬运距离(米):&nbsp;{{Envform.rcByjl>0?Envform.rcByjl:''}}</li>
      <li>9、地库限高(米):&nbsp;{{Envform.rcDkxg>0?Envform.rcDkxg:''}}</li>
      <li>10、货梯长(cm):&nbsp;{{Envform.rcHtccL>0?Envform.rcHtccL:''}}</li>
      <li>11、货梯宽(cm):&nbsp;{{Envform.rcHtccW>0?Envform.rcHtccW:''}}</li>
      <li>12、货梯高(cm):&nbsp;{{Envform.rcHtccH>0?Envform.rcHtccH:''}}</li>
      <li>13、停车费(元):&nbsp;{{Envform.rcTcf>0?Envform.rcTcf:''}}</li>
      <li>14、专梯费用(元):&nbsp;{{Envform.rcZtfy>0?Envform.rcZtfy:''}}</li>
      <li>15、施工楼层(层):&nbsp;{{Envform.rcSglc>0?Envform.rcSglc:''}}</li>
      <li>16、货梯数量(部):&nbsp;{{Envform.rcHtsl>0?Envform.rcHtsl:''}}</li>
      <li>17、货梯用时(分):&nbsp;{{Envform.rcHtsj>0?Envform.rcHtsj:''}}</li>
      <li>18、备注:&nbsp;{{Envform.rcRemark?Envform.rcRemark:''}}</li>
      <li class="www">19、预计发货日期:&nbsp;{{Envform.rcSgrq>0?Envform.rcSgrq:''}}</li>
    </ul>
    <div style="padding-left:14px;" class="color">
      20、
      <span class="www">送货达到时间：</span>
      <span class="www">送货安装时间：</span>
      <span class="www">安装联系电话：</span>
    </div>
    <div class="color">二、收款账户</div>
    <div v-for="(item,i) in Texta" :key="item.uName" class="color">
      <div
        class="color"
      >{{i+1}}.户名：{{item.uName}}&nbsp;&nbsp; 开户行：{{item.bankName}}&nbsp; 账号： {{item.bankNum}}</div>
    </div>
    <div v-for="(item,i) in Textb" :key="item.uName" class="color">
      <div
        class="color"
      >{{i+1}}.户名：{{item.uName}}&nbsp;&nbsp; 开户行：{{item.bankName}}&nbsp; 账号： {{item.bankNum}}</div>
    </div>
    <ul class="ul1">
      <li>三、客户评价：1、服务态度：</li>
      <li>2、安装质量：</li>
      <li>3、项目验收：</li>
    </ul>
    <div class="rrr">客户签名：___________</div>
    <br />
    <div class="ttt">服务态度和安装质量评价选项为“差或一般或满意或非常满意”四项，项目验收选项为“合格或不合格”两项。</div>
    <ul class="ul1">
      <li>送货部门：</li>
      <li>备货人签字：</li>
      <li>送货人员签字：</li>
    </ul>
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
      tableData: [],
      tableData3: [],
      rowindex: "",
      icon: "",
      disabled: true,
      hasdis: false,
      img: "",
      showtable: false,
      showSelectLogistics: false,
      orderBH: "",
      orderID: "",
      totalprice: 0,
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
      Envform: {},
      Texta: [],
      Textb: [],
      SPFL: [],
      i: 0,
      fileList: [],
      formData: {},
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      num: 0,
      mobile: ""
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
    // 打印
    pr($) {
      {
        var opt;

        $.fn.jqprint = function(options) {
          opt = $.extend({}, $.fn.jqprint.defaults, options);

          var $element = this instanceof jQuery ? this : $(this);

          if (opt.operaSupport && $.browser.opera) {
            var tab = window.open("", "jqPrint-preview");
            tab.document.open();

            var doc = tab.document;
          } else {
            var $iframe = $("<iframe  />");

            if (!opt.debug) {
              $iframe.css({
                position: "absolute",
                width: "0px",
                height: "0px",
                left: "-600px",
                top: "-600px"
              });
            }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
          }

          if (opt.importCSS) {
            if ($("link[media=print]").length > 0) {
              $("link[media=print]").each(function() {
                doc.write(
                  "<link type='text/css' rel='stylesheet' href='" +
                    $(this).attr("href") +
                    "' media='print' />"
                );
              });
            } else {
              $("link").each(function() {
                doc.write(
                  "<link type='text/css' rel='stylesheet' href='" +
                    $(this).attr("href") +
                    "' />"
                );
              });
            }
          }

          if (opt.printContainer) {
            doc.write($element.outer());
          } else {
            $element.each(function() {
              doc.write($(this).html());
            });
          }

          doc.close();

          (opt.operaSupport && $.browser.opera
            ? tab
            : $iframe[0].contentWindow
          ).focus();
          setTimeout(function() {
            (opt.operaSupport && $.browser.opera
              ? tab
              : $iframe[0].contentWindow
            ).print();
            if (tab) {
              tab.close();
            }
          }, 1000);
        };

        $.fn.jqprint.defaults = {
          debug: false,
          importCSS: true,
          printContainer: true,
          operaSupport: true
        };

        // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
        jQuery.fn.outer = function() {
          return $($("<div></div>").html(this.clone())).html();
        };
      }
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
            this.$api.Common.get({
              typeCode: "YHZH",
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
            this.$api.Receipt.gettconstruct({ rid: items.rRootid }).then(
              res => {
                if (res.data) {
                  this.Envform = res.data;
                }
              }
            );
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
                  this.tableData3.push(item);
                }
              });
              if (this.tableData3.length) {
                this.tableData3.push({});
              }
            }
          );
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
.color {
  font-weight: 700;
  color: black;
  font-family: "宋体" !important;
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
table td.bz {
  max-width: 88px;
  overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
  text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
  white-space: nowrap;
}
div {
  font-weight: 500;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: inline-block;
    height: 20px;
    width: 32%;
  }
  li.w {
    width: 60%;
  }
}
.ul1 {
  list-style: none;
  padding: 0;
  margin: 0;
  color: black;
  li {
    display: inline-block;
    width: 32%;
    color: black;
  }
}
.ul2 {
  list-style: none;
  padding: 0;
  padding-left: 14px;
  font-size: 14px;
  color: black;
  margin: 0;
  li {
    display: inline-block;
    width: 22%;
    line-height: 20px;
    color: black;
  }
  li.www {
    width: 100%;
  }
}
.table {
  line-height: 20px;
  text-align: center;
  color: black;
  tr th,
  tr td {
    padding: 2px;
  }
}
.www {
  display: inline-block;
  width: 230px;
  color: black;
}
.rrr {
  text-align: right;
  color: black;
}
.ttt {
  font-weight: 900;
  color: black;
}
</style>
