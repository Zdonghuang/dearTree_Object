<template>
  <div v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ orderBH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">回收入库单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383" @click="exportTable()">导出</el-button>
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has="362">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly :disabled="disabled">
          <template slot="prepend">客户</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
          placeholder="收货仓库"
          v-model="form.rWhidv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">收货仓库</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
    <el-table
      :data="tableData"
      border
      id="table-data"
      style="width: 100%"
      size="mini"
      height="600px"
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
      <el-table-column
        sortable
        property="tools"
        label="操作"
        align="center"
        width="80"
        v-if="form.rStatus!=19"
      >
        <template slot-scope="scope">
          <i class="el-icon-circle-plus add" @click="adddate()" v-if="!check"></i>
          <i
            class="el-icon-circle-close del"
            v-if="tableData.length>1&&!check"
            @click="deldate(scope.$index)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="200"
        align="center"
        property="img"
        label="图片"
        v-if="tableStatus.img"
      >
        <template slot-scope="scope">
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
              @mouseover="img=`${baseUrl}api${url}`"
              class="tableimg"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="gItemnum" width="150" label="货号"></el-table-column>
      <el-table-column
        sortable
        align="center"
        property="gName"
        width="150"
        v-if="tableStatus.gName"
      >
        <template slot="header">
          <span>商品名称</span>
        </template>
        <template slot-scope="scope">
          <input
            type="text"
            :value="scope.row.gName"
            @blur="showicon($event)"
            @focus="hiddenicon($event)"
            class="ipt"
            readonly
          />
          <i
            class="fa fa-search searchname"
            v-show="form.rStatus==17"
            @click="searchbox($event,scope.$index)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="rdIotype"
        label="商品类型"
        v-if="form.rStatus!=19"
      >
        <template
          slot-scope="scope"
        >{{scope.row.rdIotype==2?'回收商品':scope.row.rdIotype==3?'清理商品':''}}</template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="iSellingprice" label="回收单价">
        <template slot-scope="scope">
          <input
            type="text"
            v-if="scope.row.gName"
            v-model="scope.row.iSellingprice"
            @blur="setmoney(scope.row)"
            class="ipt tc"
            :disabled="form.rStatus==19"
          />
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="rdQuantity"
        label="入库数量"
        v-if="tableStatus.gName"
      >
        <template slot-scope="scope" v-if="scope.row.gName">
          <input
            type="text"
            v-model="scope.row.rdQuantity"
            @blur="setnum(scope.row)"
            class="ipt tc"
            :disabled="form.rStatus==19"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="100" align="center" property="defNum" label="回收数量"></el-table-column>
      <el-table-column sortable width="150" align="center" property="money" label="回收总价">
        <template v-if="money">{{money}}</template>
      </el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        property="gConstructcostweight"
        label="权重"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        property="rdConstructcostproportion"
        label="价格分摊"
      ></el-table-column>
      <el-table-column sortable width="150" align="center" property="dj" label="成本单价"></el-table-column>
      <el-table-column sortable width="150" align="center" property="cbzj" label="成本总价"></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="iQuantity"
        label="库存"
        v-if="tableStatus.iQuantity"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="iQuantitywillin"
        label="待入库库存"
        v-if="tableStatus.iQuantitywillin"
      ></el-table-column>-->
      <el-table-column
        sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gColorv"
        v-if="tableStatus.gColorv"
        label="颜色"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        v-if="tableStatus.gNewoldv"
        label="新旧程度"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gSupplierv"
        v-if="tableStatus.gSupplierv"
        label="供应商"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        v-if="tableStatus.gBrandv"
        label="品牌"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        show-overflow-tooltip
        property="gSpec"
        label="规格"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gCuseridv"
        v-if="tableStatus.gCuseridv"
        label="获客人"
      ></el-table-column>
      <el-table-column
        sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        v-if="tableStatus.gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column
        sortable
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
      <el-table-column
        sortable
        min-width="150"
        align="center"
        property="gRemark"
        label="备注"
        v-if="tableStatus.gRemark"
      ></el-table-column>
    </el-table>
    <br />
    <br />
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <br />
    <my-footer
      @opendialog="dialogSubmit"
      @ctrls="saveCG"
      :hideBtn1="form.rStatus!=19"
      BtnText="确认入库"
      BtnText1="更新数据"
      :Totalamount="form.rTotalprice"
      :HSRK="form.rIsconstructexpenseconfirm&&form.rStatus!=19&&form.rIsshareconstructcost!=1"
      @setcheck="setcheck"
      :hideBtn2="form.rStatus!=19"
      v-has="362"
    ></my-footer>
    <el-dialog
      title="商品"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsData"
        :show="false"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :purorrecover="2"
        :idList="idList"
      ></selectGoods>
    </el-dialog>
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
import selectGoods from "@/components/dialog/SelectGoods";
import getDate from "../../../utils/getDate";
export default {
  inject: ["reload"],
  components: {
    settTable,
    selectGoods
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

      showtable: false,
      showSelectBankAccount: false,
      orderBH: null,
      orderID: null,
      img: "",
      check: false,
      idList: [],
      totalprice: 0,
      showselectGoods: false,
      userName: this.$storage.userName,
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      // 单据信息
      form: {
        rTotalprice: 0,
        rDiscountamount: 0,
        rIsshareconstructcost: 0,
        rIsconstructexpenseconfirm: 0,
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
        rCuidv: "",
        rStatus: 1
      },
      nowdata: "",
      TotalGood: 0,
      door: true,
      load: false,
      loading: {},
      o: false,
      m: 0
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        if (item.rdQuantity && item.iSellingprice) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    }
  },
  created() {
    let date = new Date();
    let arr = date.toLocaleDateString().split("/");
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
        this.orderID = window.atob(this.$route.query.data);
        this.form.rId = window.atob(this.$route.query.data);
      } else {
        this.orderBH = window.atob(this.$route.query.data);
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
  // 路由缓存
  beforeRouteEnter(to, from, next) {
    let keepAlive = sessionStorage.getItem("keepAlive") || "";
    to.meta.keepAlive = true;
    if (!keepAlive) {
      sessionStorage.setItem("keepAlive", to.query.data);
      next(vm => {
        vm.reload();
      });
    }
    if (keepAlive != to.query.data) {
      sessionStorage.setItem("keepAlive", to.query.data);
      next(vm => {
        vm.reload();
      });
    }
    next();
  },
  methods: {
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
          this.getReceiver({ cuid: items.rCuid, size: 99 });
          let params = {
            rid: items.rId,
            whid: items.rWhid
          };
          // 商品回显
          this.$api.Receiptdts.getReceiptDtsGoods(params).then(res => {
            this.loading.close();
            this.load = true;
            res.data.map(item => {
              item.iSellingprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              item.defNum = item.rdQuantity;
              if (item.rdQuantity) {
                item.dj =
                  item.rdSellingprice +
                  item.rdConstructcostproportion / item.rdQuantity;
                item.cbzj = item.dj * item.rdQuantity;
              }
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
          });
          this.form = items;
        }
      });
    },
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
    // 删除当前选中这行
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    setmoney(v) {
      if (isNaN(v.iSellingprice)) {
        v.iSellingprice = 1;
        return this.$message.error("请输入数字");
      }
      if (v.iSellingprice < 0) {
        v.iSellingprice = 0;
        return this.$message.error("单价不能小于0");
      }
    },
    setnum(v) {
      if (isNaN(v.rdQuantity)) {
        v.rdQuantity = 1;
        return this.$message.error("请输入数字");
      }
      if (v.rdQuantity <= 0) {
        v.rdQuantity = 1;
        return this.$message.error("数量不能小于1");
      }
    },
    exportTable() {
      let box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      let out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `回收商品入库单${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    setcheck(v) {
      this.check = v;

      if (v) {
        let m = 0;
        this.tableData.map(item => {
          if (item.rdQuantity && item.rdConstructcostweight) {
            m += item.rdQuantity * item.rdConstructcostweight;
          }
        });
        this.tableData.map(item => {
          if (item.rdQuantity && item.rdConstructcostweight) {
            item.rdConstructcostproportion = (
              this.m *
              ((item.rdQuantity * item.rdConstructcostweight) / m)
            ).toFixed(2);
          }

          if (item.money) {
            if (item.rdQuantity && item.rdConstructcostproportion > 0) {
              item.dj = (
                (Number(item.money) + Number(item.rdConstructcostproportion)) /
                item.rdQuantity
              ).toFixed(2);
              item.cbzj = (item.dj * item.rdQuantity).toFixed(2);
            }
          } else {
            if (item.rdQuantity && item.rdConstructcostproportion > 0) {
              item.dj = (
                item.rdConstructcostproportion / item.rdQuantity
              ).toFixed(2);
              item.cbzj = (item.dj * item.rdQuantity).toFixed(2);
            }
          }
        });
      } else {
        this.tableData.map(item => {
          item.rdConstructcostproportion = 0;
          if (item.rdQuantity) {
            item.dj =
              item.rdSellingprice +
              item.rdConstructcostproportion / item.rdQuantity;
            item.cbzj = item.dj * item.rdQuantity;
          }
        });
      }
    },
    adddate() {
      this.tableData.push({});
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/warehouse/inbound/printingInbound?data=${data}`,
        "_blank"
      );
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
            column.property === "money") ||
          column.property === "rdQuantity" ||
          column.property === "defNum" ||
          column.property === "rdConstructcostproportion" ||
          column.property === "cbzj"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.totalprice = sums[index];
          }
          if (
            column.property === "rdQuantity" ||
            column.property === "defNum"
          ) {
            this.TotalGood = sums[index];
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
    openuser(val) {
      this.dataType = val;
      this.showSelectUser = true;
    },
    hiddenicon(e) {
      if (e.target.nextElementSibling) {
        this.icon = e.target.nextElementSibling;
        e.target.nextElementSibling.style.opacity = "1";
      }
    },
    showicon(e) {
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.opacity = "0";
      }
    },
    getGoodsData(val) {
      val.rdQuantity = 1;
      val.iSellingprice = val.iUnitprice;
      if (!val.iUnitprice) {
        val.iSellingprice = 1;
      }
      val.rdConstructcostweight = val.gConstructcostweight;
      const data = JSON.parse(JSON.stringify(val));
      this.tableData.splice(this.rowindex, 1, data);
      this.showselectGoods = false;
    },
    saveCG() {
      this.$confirm("是否保存草稿?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.rDate = this.nowdata.replace(/\-/g, "");
          delete this.form.rFile;
          const loading = this.$loading({
            lock: true,
            text: "保存草稿中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let tableData = [];
          this.tableData.forEach(item => {
            if (item.gName) {
              item.rdGid = item.gId;
              item.rdSellingprice = item.iSellingprice;
              item.rdUnitprice = item.iUnitprice;
              item.rdConstructcostweight = item.gConstructcostweight;
              item.rdRemark = item.gRemark;
              item.rdIotype = 2;
              tableData.push(item);
            }
          });
          let params = {
            approve: false, //是否发起审批
            approvers: [], //钉钉审批人ID
            cc: [],
            receiptDtsList: tableData, //商品+服务
            receiptInfoVO: this.form //单据信息
          };
          this.$api.Receipt.saveall(params).then(res => {
            loading.close();
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "保存草稿成功!"
              });
            } else {
              this.$message.error(res.err);
            }
          });
        })
        .catch(() => {
          this.$message("取消操作");
        });
    },
    // 入库
    dialogSubmit() {
      if (this.totalprice != this.form.rTotalprice)
        return this.$message.error("商品总价与单据总价不符");
      this.$confirm("此操作将直接入库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.rDate = this.nowdata.replace(/\-/g, "");
          if (this.check) {
            this.form.rIsshareconstructcost = 1;
          }
          delete this.form.rFile;
          this.form.rDate = this.$PublicJS.nowDate();
          let params = {
            approve: false,
            receiptInfoVO: this.form,
            receiptDtsList: []
          };
          let num = 0;
          this.tableData.forEach((item, index) => {
            if (!this.check) {
              item.rdConstructcostproportion = 0;
            }
            num += item.rdQuantity * item.rdConstructcostweight;
            if (item.rdQuantity) {
              let obj = item;
              obj.rdGid = item.gId;
              obj.rdConstructcostweight = item.gConstructcostweight;
              obj.rdQuantity = item.rdQuantity;
              obj.rdSellingprice = item.iSellingprice;
              obj.rRemark = item.rRemark;
              obj.rdIotype = 2;
              params.receiptDtsList.push(obj);
            }
          });
          if (this.tableData.length != 1 && num == 0) {
            return this.$message.error("提交失败");
          }
          let loading = this.$loading({
            lock: true,
            text: "入库中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$api.Receipt.allRK(params).then(res => {
            loading.close();
            if (res.code == 200) {
              sessionStorage.removeItem("keepAlive");
              this.$message({
                type: "success",
                message: "入库成功!"
              });
              this.$router.push("/warehouse/inbound/recoverInboundLista");
            } else {
              this.$message.error(res.err);
            }
          });
        })
        .catch(() => {
          this.$message("取消操作");
        });
    },
    searchbox(e, val) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.idList = [];
        this.tableData.map(item => {
          if (item.gId && !this.idList.includes(item.gId)) {
            this.idList.push(item.gId);
          }
        });
        this.icon = "";
        this.showselectGoods = true;
      }
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
