<template>
  <div class="Delivery">
    <!--startprint1-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4" align="left">
        <div v-if="BH"></div>
      </el-col>
      <el-col :xs="24" :sm="16" align="center" style="height:10px">
        <h3 class="title">第 二 树 循 环 家 具 {{form.rOidv}} 回 收 {{form.rType==2?' 报 价':' 结 算'}} 单</h3>
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
      <li>报价日期：{{form.rDate}}</li>
      <li>甲方联系人电话：{{form.rCmobile}}</li>
      <li>甲方项目名称：{{form.rCuidv}}</li>
      <li style="margin-bottom:15px;">甲方项目地址：{{form.rCaddr}}</li>
      <li>乙方项目负责人：{{form.rHandmanv}}</li>
      <li>乙方负责人电话：{{rMobile}}</li>
      <li>预计回收时间：{{Envform.rcSgrq}}</li>
    </ul>
    <br />
    <h4>回收商品清单</h4>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>货号</th>
          <th>图片</th>
          <th>分类</th>
          <th>尺寸</th>
          <th>数量</th>
          <th>单位</th>
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
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1">{{TotalPrice}}</td>
          <td v-if="i==tableData.length-1" class="bz"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1" style="width:160px">{{item.gItemnum}}</td>
          <td v-if="i!=tableData.length-1">
            <span v-for="img in item.gImage" :key="img">
              <img :src="`${baseUrl}api${img}`" width="30" />
            </span>
          </td>
          <td v-if="i!=tableData.length-1">{{item.gClassv}}</td>
          <td v-if="i!=tableData.length-1">{{item.gSpec}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td v-if="i!=tableData.length-1" class="bz">{{item.rRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <h4>清理商品清单</h4>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>图片</th>
          <th>分类</th>
          <th>尺寸</th>
          <th>数量</th>
          <th>单位</th>
          <th>单价</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData2" :key="i">
          <td v-if="i==tableData2.length-1">合计</td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1"></td>
          <td v-if="i==tableData2.length-1">{{TotalPrice2.toFixed(2)}}</td>
          <td v-if="i==tableData2.length-1" class="bz"></td>
          <td v-if="i!=tableData2.length-1">{{i+1}}</td>
          <td v-if="i!=tableData2.length-1">
            <span v-for="img in item.gImage" :key="img">
              <img :src="`${baseUrl}api${img}`" width="30" />
            </span>
          </td>
          <td v-if="i!=tableData2.length-1">{{item.gClassv}}</td>
          <td v-if="i!=tableData2.length-1">{{item.gSpec}}</td>
          <td v-if="i!=tableData2.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData2.length-1">{{item.gUnitv}}</td>
          <td v-if="i!=tableData2.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData2.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td v-if="i!=tableData2.length-1" class="bz">{{item.rRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <h4>其他服务清单</h4>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>类型</th>
          <th>数量</th>
          <th>单价</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item , i) in tableData3" :key="i">
          <td v-if="i==tableData3.length-1">合计</td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1"></td>
          <td v-if="i==tableData3.length-1">{{TotalPrice3.toFixed(2)}}</td>
          <td v-if="i==tableData3.length-1" class="bz"></td>
          <td v-if="i!=tableData3.length-1">{{i+1}}</td>
          <td v-if="i!=tableData3.length-1">
            <select v-model="item.gId" disabled>
              <option v-for="item in SPFL" :key="item.gId" :value="item.gId">{{item.cAttrvalue}}</option>
            </select>
          </td>
          <td v-if="i!=tableData3.length-1">{{item.rdQuantity}}</td>
          <td v-if="i!=tableData3.length-1">{{item.rdSellingprice}}</td>
          <td v-if="i!=tableData3.length-1">{{(item.rdSellingprice*item.rdQuantity).toFixed(2)}}</td>
          <td v-if="i!=tableData3.length-1" class="bz">{{item.rRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <div>总金额：{{TotalPrice4}}</div>
    <div>备注：{{form.rRemark}}</div>
    <div
      class="pl10"
    >1.报价单中包含高价值及低价值家具，本报价为整体回收报价，若实际品种或数量减少了5%以上，则报价调低，调低幅度20－50%。如实际回收数量与报价数量误差在5%以内,单价不变,协议总金额作相应调整；</div>
    <div class="pl10">2.报价单中的家具功能齐全，无明显破损。如报价单中的家具有破损或基本使用功能不全，结算时不计算数量；</div>
    <div class="pl10">3.施工过程中，乙方因拆卸固定在墙面或地面的家具而造成墙面或装修破损，乙方不需承担责任；</div>
    <div class="pl10">4.本报价单的价格为一次性回收的价格，分批次回收另行报价。</div>
    <div class="pl10">5.甲方出售的办公家具中遗留的物品(包括文件或电器等)视为废弃物品，甲方如有重要物品存放在出售的办公家具中造成遗失，乙方不承担任何责任；</div>
    <div class="pl10">6.报价单以外的家具或办公设备，乙方有权确定是否另行报价回收。甲方需要报废清理的家具，甲乙双方另行协商清理费用；</div>
    <div class="pl10">7.乙方按双方约定时间已到达回收施工现场后，如甲方临时取消回收项目，甲方需承担乙方已到施工现场的所有工人费用及车辆费用；</div>
    <div
      class="pl10"
    >8.甲方如需保留原家具中附属的各类线路，无论弱电或强电，该项拆卸工作应由甲方自行完成，如乙方抵达甲方施工场地，发现甲方未完成的此项工作的，则乙方有权停止施工并且可以向甲方追偿相应损失（包括但不仅限于人工费用，车辆费用等）。</div>
    <div class="pl10">9.报价有效期为一个月，逾期后乙方重新报价。</div>
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
export default {
  name: "recoverOrder",
  inject: ["reload"],
  components: {},
  data() {
    return {
      tableData: [{}, {}, {}, {}, {}],
      tableData2: [{}, {}, {}, {}, {}],
      tableData3: [{}, {}, {}, {}, {}],
      addgoods: false,
      form: {
        rCuidv: "", //客户
        rCuid: "",
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "", //仓库
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        warehouseNum:
          this.$storage.warehouseNum > 1 || this.$storage.warehouseNum != null
            ? true
            : false,
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId,
        rRemark: "", //备注
        rType: 2,
        rCid: "",
        rFile: [],
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rStatus: 30,
        rEstdelivery: this.$PublicJS.nowDate(),
        rTotalprice: 0,
        rBillingstatus: "0",
        rLogistics: "",
        rShipmentnumber: ""
        // rCuserid: this.$storage.userName
      },
      rMobile: "",
      client: {},
      formData: null,
      activeName: "Subjectname",
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      fileList: [],
      fsAmount: 0,
      showbank: false,
      showSG: false,
      showSum: true,
      currentRow: null,
      showSelectUser: false,
      icon: "",
      showSelectClient: false,
      showSelectWarehouse: false,
      showselectGoods: false,
      showselectBankAccount1: false,
      showselectBankAccount2: false,
      showSelectLogistics: false,
      showexamine: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      rowindex: 0,
      TotalPrice: 0,
      TotalPrice2: 0,
      TotalPrice3: 0,
      number: 0,
      BH: null,
      dom: null,
      rId: null,
      showDD: false,
      contact: [],
      param: {},
      nowdata: "",
      daifu: 0,
      settable: 1,
      idList: [],
      i: 0,
      img: "",
      // 施工环境
      Envform: {
        rcZtfy: "",
        rcZcwz: 2,
        rcTcf: "",
        rcSqzt: 0,
        rcSgrq: "",
        rcSglc: "",
        rcSgbh: 0,
        rcRemark: "",
        rcRid: "",
        rcQrdcl: 0,
        rcJcsg: 0,
        rcHtsl: "",
        rcHtsj: 0,
        rcHtccW: "",
        rcHtccL: "",
        rcHtccH: "",
        rcGdjl: "",
        rcDkxg: "",
        rcCmt: 1,
        rcByjl: "",
        rcCip: ""
      },
      SPFL: [],
      load: true,
      loading: {},
      domb: null,
      domc: null,
      t1: 0,
      t2: 0,
      t3: 0
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    money2: function() {
      this.tableData2.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    money3: function() {
      this.tableData3.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    TotalPrice4: function() {
      return this.TotalPrice - this.TotalPrice2 - this.TotalPrice3;
    }
  },
  created() {
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.getrecoverOrder();
    }
    this.getService();
    window.addEventListener("keydown", this.printOut);
  },
  methods: {
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]); //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    getrecoverOrder() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.$api.User.get({ uid: res.data.records[0].rHandman }).then(res => {
          if (res.code == 200) {
            this.rMobile = res.data.records[0].uMobile;
          }
        });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.tableData = [];
          this.tableData2 = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            item.gConstructcostweight = item.rdConstructcostweight;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 2) {
              this.tableData.push(item);
            } else if (item.rdIotype == 3) {
              this.tableData2.push(item);
            }
          });
          if (this.tableData.length) {
            this.tableData.push({});
          }
          if (this.tableData2.length) {
            this.tableData2.push({});
          }
          this.tableData = this.deepCopy(this.tableData);
          this.tableData2 = this.deepCopy(this.tableData2);
          this.tableData.map(item => {
            if (item.rdQuantity) {
              this.TotalPrice += item.rdQuantity * item.rdSellingprice;
            }
          });
          this.tableData2.map(item => {
            if (item.rdQuantity) {
              this.TotalPrice2 += item.rdQuantity * item.rdSellingprice;
            }
          });
        });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId
        }).then(res => {
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
          if (this.tableData3.length) {
            this.tableData3.push({});
          }
          this.tableData3 = this.deepCopy(this.tableData3);
          this.tableData3.map(item => {
            if (item.rdQuantity) {
              this.TotalPrice3 += item.rdQuantity * item.rdSellingprice;
            }
          });
        });
        this.BH = res.data.records[0].rItemnum;
        if (
          res.data.records[0].rApprovalstatus == 2 ||
          res.data.records[0].rApprovalstatus == 3 ||
          res.data.records[0].rStatus == 19 ||
          res.data.records[0].rStatus == 32 ||
          res.data.records[0].rStatus == 31
        ) {
          this.showbank = true;
        }
        this.form = res.data.records[0];
        if (this.form.rFile) {
          this.form.rFile = JSON.parse(this.form.rFile);
          this.fileList = this.form.rFile;
        }
        this.getrCid({ cuid: this.form.rCuid });
        this.$api.Receipt.gettconstruct({ rid: this.rId }).then(res => {
          if (res.data) {
            this.Envform = res.data;
          }
        });
      });
    },
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
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
    checkTable(a, b, c, d) {
      this.domb = b;
      this.domc = c;
    },
    checkTableNext(e) {
      // if (!this.dom) return;
      // let mm = 0;
      // if (e.keyCode == 38) {
      //   //上键
      //   if (
      //     this.domc.children[0].children[0] &&
      //     this.domc.children[0].children[0].localName == "input"
      //   ) {
      //     let e = document.getElementsByClassName(this.domb.id);
      //     for (let i = 0; i < e.length; i++) {
      //       if (
      //         e[i] == this.domc &&
      //         e[i - 1].className == this.domb.id + "  " &&
      //         !mm &&
      //         e[i - 1].children[0].children[0]
      //       ) {
      //         mm++;
      //         e[i - 1].click();
      //         e[i - 1].children[0].children[0].focus();
      //       }
      //     }
      //   }
      //   e.preventDefault();
      // }
      // if (e.keyCode == 40) {
      //   //下键
      //   if (
      //     this.domc.children[0].children[0] &&
      //     this.domc.children[0].children[0].localName == "input"
      //   ) {
      //     let e = document.getElementsByClassName(this.domb.id);
      //     for (let i = 0; i < e.length; i++) {
      //       if (
      //         e[i] == this.domc &&
      //         e[i + 1].className == this.domb.id + "  " &&
      //         !mm &&
      //         e[i + 1].children[0].children[0]
      //       ) {
      //         mm++;
      //         e[i + 1].children[0].children[0].focus();
      //         e[i + 1].click();
      //       }
      //     }
      //   }
      //   e.preventDefault();
      // }
    },
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
    },
    closeAddGoods() {
      this.addgoods = false;
      this.$message.success("添加成功");
    },
    hiddenicon(e) {
      if (e.target.nextElementSibling) {
        this.dom = e.target;
        this.icon = e.target.nextElementSibling;
        e.target.nextElementSibling.style.opacity = "1";
      }
    },
    showicon(e) {
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.opacity = "0";
      }
    },
    getUserData(val) {
      if (val) {
        this.form.rHandman = val.uId;
        this.form.rHandmanv = val.uName;
      }

      this.showSelectUser = false;
    },
    getrCid(val) {
      this.contact = [];
      let cAddr =
        (this.client.cuProvincevalue ? this.client.cuProvincevalue : "") +
        (this.client.cuCityvalue ? this.client.cuCityvalue : "") +
        (this.client.cuDistrictvalue ? this.client.cuDistrictvalue : "");
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) return (this.form.rCid = "");
        Items.map((item, index) => {
          if (!index) {
            this.form.rCmobile = item.cMobile;
            if (!this.form.rCaddr) {
              this.form.rCaddr = cAddr + item.cAddr;
            }
            this.form.rCid = item.cId;
          }
          this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: cAddr + item.cAddr
          });
        });
      });
    },
    setimg(url) {
      this.img = url;
    },
    handleExceed() {},
    handleChange() {},
    handleRemove() {},
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
    },
    searchbox(e, val, n) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (e.target === this.icon) {
          this.icon = "";
          this.showselectGoods = true;
          this.settable = n;
          if (n == 1) {
            this.idList = [];
            this.tableData.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
          if (n == 2) {
            this.idList = [];
            this.tableData2.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
          if (n == 3) {
            this.idList = [];
            this.tableData3.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
        }
      }
    },
    setdanjia(e) {
      if (!isNaN(e.iSellingprice)) {
        if (!e.iSellingprice) {
          this.$message("请输入商品单价");
          e.iSellingprice = 1;
        } else if (e.iSellingprice < 1) {
          e.iSellingprice = 1;
          this.$message("商品单价不得小于1");
        }
      } else {
        e.iSellingprice = 1;
        this.$message("请输入数字");
      }
    },
    setnum(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入数量");
          e.rdQuantity = 1;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = 1;
          this.$message("数量不得小于1");
        }
      } else {
        e.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    opendialog(n) {
      this[n] = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    adddate(n) {
      if (n == 1) {
        this.tableData.push({});
      }
      if (n == 2) {
        this.tableData2.push({});
      }
      if (n == 3) {
        this.tableData3.push({});
      }
    },
    deldate(index, n) {
      if (this.tableData.length > 1) {
        if (n == 1) {
          this.tableData.splice(index, 1);
        }
      }
      if (this.tableData2.length > 1) {
        if (n == 2) {
          this.tableData2.splice(index, 1);
        }
      }
      if (this.tableData3.length > 1) {
        if (n == 3) {
          this.tableData3.splice(index, 1);
        }
      }
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/recover/printingRecover?data=${data}`, "_blank");
    },
    getClientData(val) {
      if (val) {
        this.form.rCuid = val.cuId;
        this.form.rCuidv = val.cuName;
        this.client = val;
        this.getrCid({ cuid: val.cuId });
      }

      this.showSelectClient = false;
    },
    getWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    openlink(url) {
      window.open(url, "_blank");
    },
    getGoodsData(val) {
      if (
        (this.tableData[this.rowindex].gId ||
          this.tableData2[this.rowindex].gId ||
          this.tableData3[this.rowindex].gId) &&
        Array.isArray(val)
      ) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.tableData[this.rowindex + i] &&
              this.tableData[this.rowindex + i].gId &&
              this.settable == 1
            ) {
              this.tableData.push(data);
            } else {
              this.tableData.splice(this.rowindex + i, 1, data);
            }
            if (
              this.tableData2[this.rowindex + i] &&
              this.tableData2[this.rowindex + i].gId &&
              this.settable == 2
            ) {
              this.tableData2.push(data);
            } else {
              this.tableData2.splice(this.rowindex + i, 1, data);
            }
            if (
              this.tableData3[this.rowindex + i] &&
              this.tableData3[this.rowindex + i].gId &&
              this.settable == 3
            ) {
              this.tableData3.push(data);
            } else {
              this.tableData3.splice(this.rowindex + i, 1, data);
            }
          } else {
            if (this.settable == 1) {
              this.tableData.push(data);
            }
            if (this.settable == 2) {
              this.tableData2.push(data);
            }
            if (this.settable == 3) {
              this.tableData3.push(data);
            }
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        const data = JSON.parse(JSON.stringify(val));
        if (this.settable == 1) {
          this.tableData.splice([this.rowindex], 1, data);
        }
        if (this.settable == 2) {
          this.tableData2.splice([this.rowindex], 1, data);
        }
        if (this.settable == 3) {
          this.tableData3.splice([this.rowindex], 1, data);
        }
      }
      this.showselectGoods = false;
    },
    openDD(val) {
      let n = 0;
      this.tableData.map(item => {
        if (item.money) {
          n += 1;
        }
      });
      if (!this.form.rCuidv) return this.$message("请选客户");
      if (!this.form.rWhidv) return this.$message("请选择仓库");
      if (!this.form.rHandmanv) return this.$message("请选择经手人");
      if (!this.form.rCid) return this.$message("请选择联系人");
      if (!n) return this.$message("请选择商品");
      if (!this.Envform.rcSgrq) return this.$message("请选择施工日期");
      this.form.rTotalprice = this.TotalPrice4;
      if (val.ss && this.form.rStatus == 30) {
        this.close("false");
      } else {
        this.showDD = true;
      }
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
        PDF.save("回收报价单.pdf"); // 这里是导出的文件名
        window.location.reload();
      });
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.Envform.rcRid = this.form.rId;
      this.form.rDate = this.nowdata;
      this.Envform.rcSgrq = this.Envform.rcSgrq.replace(/\-/g, "");
      this.formData = new FormData();
      this.$refs.upload.submit();
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form,
        tReceiptconstruct: this.Envform
      };
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 2;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData2.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 3;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData3.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdIotype = 4;
          params.receiptDtsList.push(obj);
        }
      });
      if (params.approve) this.form.rStatus = 2;
      this.showDD = false;
      let filedata = [];
      this.$ajax.post("/system/upload", this.formData).then(res => {
        if (res.data.code === 200) {
          if (Object.values(res.data.data).length) {
            Object.values(res.data.data).map(item => {
              filedata.push(`/file/${item}`);
              params.receiptInfoVO.rFile.push(`/file/${item}`);
            });
          }
          if (params.receiptInfoVO.rFile && params.receiptInfoVO.rFile.length) {
            params.receiptInfoVO.rFile = JSON.stringify(
              params.receiptInfoVO.rFile
            );
          } else {
            delete params.receiptInfoVO.rFile;
          }
          this.$api.Receipt.saveall(params).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push("/recover/recoverOrderList");
            } else {
              if (params.receiptInfoVO.rFile) {
                params.receiptInfoVO.rFile = JSON.parse(
                  params.receiptInfoVO.rFile
                );
                filedata.map(item => {
                  if (params.receiptInfoVO.rFile.indexOf(item) > -1) {
                    params.receiptInfoVO.rFile.splice(
                      params.receiptInfoVO.rFile.indexOf(item),
                      1
                    );
                  }
                });
              }
              this.$message.error("提交失败");
              this.form.rStatus = 30;
            }
          });
        } else {
          this.$message.error("提交失败");
          this.form.rStatus = 30;
        }
      });
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
  color: black;
  font-weight: 700;
  font-size: 14px;
  font-family: "宋体" !important;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    height: 20px;
    width: 90%;
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
table td.bz {
  max-width: 88px;
  overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
  text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
  white-space: nowrap;
}
.rrr {
  text-align: right;
}
.ttt {
  font-weight: 900;
}
h4 {
  margin: 0;
}
</style>
