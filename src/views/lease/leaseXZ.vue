<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <!-- <div v-if="orderBH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ orderBH }}</span>
        </div>-->
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">续租单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>-->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="客户" v-model="form.rCuidv" size="small" readonly disabled>
          <template slot="prepend">客户</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="收货人" v-model="form.rCidv" size="small" readonly disabled>
          <template slot="prepend">收货人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="仓库" v-model="form.rWhidv" size="small" readonly disabled>
          <template slot="prepend">仓库</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="签单人" v-model="form.rHandmanv" size="small" readonly disabled>
          <template slot="prepend">签单人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="归属公司" v-model="form.rOidv" size="small" readonly disabled>
          <template slot="prepend">归属公司</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="获客人" v-model="form.rGetguestv" size="small" readonly disabled>
          <template slot="prepend">获客人</template>
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

    <el-row :gutter="20">
      <el-col>
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
          <el-table-column property="tools" label="操作" align="center" width="80" v-if="!disabled">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate()"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
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
          <el-table-column sortable align="center" property="gName" width="150" v-if="tableStatus.gName">
            <template slot="header">
              <span>商品名称</span>
            </template>
            <template slot-scope="scope">
              <input
                type="text"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                v-model="scope.row.gName"
                class="ipt"
                readonly
                :disabled="disabled"
              />
              <i class="fa fa-search searchname" @click="searchbox($event,scope.$index)"></i>
            </template>
          </el-table-column>
          <el-table-column sortable
            width="100"
            align="center"
            property="rdQuantity"
            label="数量"
            v-if="tableStatus.rdQuantity"
          >
            <template slot-scope="scope" v-if="scope.row.gItemnum">
              <input
                type="text"
                v-model="scope.row.rdQuantity"
                :class="defStyle"
                :disabled="disabled"
                @blur="iptBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column sortable
            width="150"
            align="center"
            property="iSellingprice"
            label="单价"
            v-if="tableStatus.iSellingprice"
          >
            <template slot-scope="scope" v-if="scope.row.gItemnum">
              <input
                type="text"
                v-model="scope.row.iSellingprice"
                class="ipt tc bgc"
                @blur="iptBlur(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column sortable width="150" align="center" property="sumPrice" label="总金额">
            <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
          </el-table-column>
          <el-table-column sortable
            width="150"
            align="center"
            show-overflow-tooltip
            property="iQuantitycanout"
            label="可用库存"
          ></el-table-column>
          <el-table-column sortable
            width="150"
            align="center"
            show-overflow-tooltip
            property="iQuantitywillin"
            label="待入库库存"
            v-if="tableStatus.iQuantitywillin"
          ></el-table-column>

          <el-table-column sortable
            width="80"
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
            property="gSupplierv"
            v-if="tableStatus.gSupplierv"
            label="供应商"
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
            width="150"
            align="center"
            show-overflow-tooltip
            property="gSpec"
            label="规格"
          ></el-table-column>
          <el-table-column sortable
            width="100"
            align="center"
            show-overflow-tooltip
            property="gCuseridv"
            v-if="tableStatus.gCuseridv"
            label="获客人"
          ></el-table-column>
          <el-table-column sortable
            width="80"
            align="center"
            show-overflow-tooltip
            property="gUnitv"
            v-if="tableStatus.gUnitv"
            label="单位"
          ></el-table-column>
          <el-table-column sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gCtime"
            v-if="tableStatus.gCtime"
            label="最近租赁日期"
          >
            <template slot-scope="scope" v-if="scope.row.gCtime">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gCtime.split('T')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable
            min-width="150"
            align="center"
            property="gRemark"
            label="备注"
            v-if="tableStatus.gRemark"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="20" :class="footstyle">
      <el-col :xs="24" :sm="7">
        <b class="red asterisk">*</b>
        <el-date-picker
          v-model="form.time"
          type="daterange"
          align="right"
          size="small"
          style="margin-left:15px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="租赁开始日期"
          end-placeholder="租赁结束日期"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="租赁月数" v-model="form.months" size="small" style="margin-left:15px">
          <template slot="prepend">
            <b class="red asterisk">*</b>租赁月数
          </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content">
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
                <span>{{$PublicJS.money(Totalprice, 2)}}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right">
            <div class="toolright">
              <div class="jizhang" @click="xzopening">
                <p style="padding:0 30px">续租</p>
              </div>
              <!-- <div class="jizhang" @click="btnSubmit('TJ')">
                <p>提交审批</p>
              </div>-->
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
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient @emitClientData="getClientData" :status="16"></selectClient>
    </el-dialog>
    <el-dialog
      title="发货仓库选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getWarehouseData"></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="经手人选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      title="获客人选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectGuest"
      width="60%"
    >
      <selectUser @emitUserData="getGuestData"></selectUser>
    </el-dialog>
    <el-dialog
      title="商品选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectGoods"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsData"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :idList="idList"
      ></selectGoods>
    </el-dialog>

    <!-- <el-dialog title="添加联系人" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showAddClient" width="60%">
      <addClient @emitUserAdd="getaddClientData"></addClient>
    </el-dialog>-->
    <el-dialog
      title="选择审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="60%"
    >
      <examine
        :rtype="82"
        @close="dialogSubmit"
        @openuser="openuser"
        :ID="dingding"
        :ID1="dingding1"
      ></examine>
      <el-dialog
        title="选择审核人"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showSHR"
        width="60%"
        append-to-body
      >
        <selectUser @emitUserData="getSHR"></selectUser>
      </el-dialog>
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
import selectClient from "../../components/dialog/SelectClient";
import selectWarehouse from "../../components/dialog/SelectWarehouse";
import selectUser from "../../components/dialog/SelectUser";
import selectGoods from "../../components/dialog/SelectGoods";
import settTable from "../../components/settTable/settTable";
import getDate from "../../utils/getDate";
export default {
  name: "saleOrder",
  inject: ["reload"],
  components: {
    selectClient,
    selectWarehouse,
    selectUser,
    selectGoods,
    // addClient,
    settTable
  },
  data() {
    return {
      dataType: 0,
      dingding: {},
      dingding1: {},
      defStyle: "ipt tc bgc",
      footstyle: "mtop15",
      tableData: [],
      contact: [],
      rowindex: "",
      icon: "",
      disabled: false,
      hideCG: true,
      hideAllBtn: true,
      idList: [],
      showSelectClient: false,
      showSelectWarehouse: false,
      showSelectUser: false,
      showSelectGoods: false,
      showSelectReceiver: false,
      showSelectGuest: false,
      showSHR: false,
      showexamine: false,
      showtable: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      client: {},
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rType: 71,
        rIsconstruct: 1,
        rTotalprice: 0,
        TotalGood: 0,
        rDiscountamount: 0,
        rHandmanv: "",
        rHandman: "",
        rWhidv: "",
        rWhid: "",
        rCuid: 0,
        rCuserid: 0,
        rGetguest: 0,
        rCid: "",
        rCaddr: "",
        rCmobile: "",
        rCtime: "",
        rDate: "",
        rRemark: "",
        rCuidv: "",
        months: 1
      },
      img: "",
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
    } else {
      for (let i = 0; i < 5; i++) {
        this.tableData.push({
          rdQuantity: null,
          iQuantitycanout: null,
          iQuantitycanout: null,
          iSellingprice: null,
          rdDiscount: null
        });
      }
      this.form.rDate = this.$PublicJS.nowDate();
    }
  },
  computed: {
    //本单金额
    Totalprice: function() {
      return this.form.rTotalprice * this.form.months;
    },
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
          if (items.rStatus != 30) {
            this.disabled = true;
            this.hideAllBtn = false;
            this.defStyle = "tc ipt";
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

            this.getReceiver({ cuid: items.rCuid,size:99 });
            this.form.rTotalprice = "";
            // this.form.time = [
            //   items.startDate.split("T")[0],
            //   items.endDate.split("T")[0]
            // ];
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
    setimg(u) {
      this.img = u;
    },
    xzopening() {
      if (!this.form.time) {
        this.$message({ message: "请选择租赁时间", type: "warning" });
        return false;
      }
      if (!this.form.months) {
        this.$message({ message: "请输入租赁月份", type: "warning" });
        return false;
      }
      this.$confirm("是否要续租?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogSubmit("SK");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 审核提交
    dialogSubmit(val) {
      if (val) {
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
            tableData.push(item);
          }
        });

        this.form.startDate = this.form.time[0];
        this.form.endDate = this.form.time[1];
        this.form.rTotalprice = this.Totalprice;
        this.form.renewal = 1;
        this.form.oldrid = 1;
        this.form.rItemnumparent = this.form.rItemnum;
        this.form.rDate = this.$PublicJS.nowDate();
        delete this.form.rItemnum
        delete this.form.rFile;
        delete this.form.rId;
        let params = {
          approve: true, //是否发起审批
          approvers: [], //钉钉审批人ID
          receiptDtsList: tableData, //商品
          receiptInfoVO: this.form //单据信息
        };

        this.$api.Rent.renewal(params).then(res => {
          loading.close();
          if (res.code === 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$router.push("/lease/leaseXZList");
          } else {
            this.$message({ message: res.err, type: "error" });
          }
        });
      }
      // this.showexamine = false;
    },
    iptBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if (Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        }
      } else {
        val.rdQuantity = 1;
        this.$message("请输入数字");
      }
      if (!isNaN(val.iSellingprice)) {
        if (!val.iSellingprice) {
          this.$message("请输入单价");
          val.iSellingprice = 1;
        }
      } else {
        val.iSellingprice = 1;
        this.$message("请输入数字");
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
          !values.every(value => isNaN(value)) &&
          (column.property === "sumPrice" || column.property === "rdQuantity")
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "sumPrice") {
            this.form.rTotalprice = parseFloat((sums[index]).toPrecision(12));
          }
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

    searchbox(e, val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (e.target === this.icon) {
          this.tableData.map(item => {
            if (item.gId && !this.idList.includes(item.gId)) {
              this.idList.push(item.gId);
            }
          });
          this.icon = "";
          this.showSelectGoods = true;
        }
      }
    },
    change() {
      if (this.form.rIsconstruct == 0) {
        this.hideConstr = false;
        this.footstyle = "mtop15 mbottom";
      } else {
        this.hideConstr = true;
        this.footstyle = "mtop15";
      }
    },
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
      if (this.form.rCid == 0) {
        this.showAddClient = true;
      }
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    // 新增一行
    adddate(val) {
      this.tableData.push({});
    },
    // 删除当前选中这行
    deldate(index, val) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    // 图标显示隐藏
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
    },
    showicon(e) {
      e.target.nextElementSibling.style.opacity = "0";
    },
    // 客户
    getClientData(val) {
      if (val) {
        this.form.rCuid = val.cuId;
        this.form.rCuidv = val.cuName;
        this.client = val;
        this.getReceiver({ cuid: val.cuId });
      }
      this.showSelectClient = false;
    },
    // 商品
    getGoodsData(val) {
      if (this.tableData[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.tableData[this.rowindex + i] &&
              this.tableData[this.rowindex + i].gId
            ) {
              this.tableData.push(data);
            } else {
              this.tableData.splice(this.rowindex + i, 1, data);
            }
          } else {
            this.tableData.splice(this.rowindex + i, 1, data);
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        const data = JSON.parse(JSON.stringify(val));
        this.tableData.splice(this.rowindex, 1, data);
      }
      this.showSelectGoods = false;
    },

    // 经手人
    getUserData(val) {
      this.form.rHandman = val.uId;
      this.form.rHandmanv = val.uName;
      this.showSelectUser = false;
    },
    //  审核人
    getSHR(val) {
      if (val && this.dataType == 1) {
        this.dingding = val;
      } else if (val) {
        this.dingding1 = val;
      }
      this.showSHR = false;
    },
    openuser(val) {
      this.dataType = val;
      this.showSHR = true;
    },
    // 仓库
    getWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    // 获客人
    getGuestData(val) {
      if (val) {
        this.form.rGetguest = val.uId;
        this.form.rGetguestv = val.uName;
      }
      this.showSelectGuest = false;
    },
    // 收货人
    // getaddClientData(val) {
    //   // if (val) {
    //   //   this.form.rCid = val.contact;
    //   // }
    //   this.showAddClient = false;
    // },
    settTable() {
      this.reload();
      this.showtable = false;
      this.tableStatus = JSON.parse(sessionStorage.getItem("tableStatus"));
    },
    // 刷新
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
</style>
