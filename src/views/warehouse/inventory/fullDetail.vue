<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="orderBH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ orderBH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">盘点单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>-->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rWhidv"
          filterable
          placeholder="请选择盘点仓库"
          size="small"
          :disabled="disabled"
          @change="selectChange('rWhid',form.rWhidv)"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>盘点仓库
            </span>
          </template>
          <el-option
            v-for="(item,index) in rWhidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.whCode }}</span>
          </el-option>
        </el-select>
      </el-col>
      <!-- <el-col :xs="24" :sm="4">
        <el-input
          placeholder="盘点仓库"
          v-model="form.rWhidv"
          size="small"
          readonly
          :disabled="!form.warehouseNum && disabled"
        >
          <template slot="prepend">
            <b class="red asterisk">*</b>盘点仓库
          </template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            v-if="form.warehouseNum && !disabled"
            @click="showDialog('showSelectWarehouse')"
          ></i>
        </el-input>
      </el-col>-->
      <el-col :xs="24" :sm="4">
        <el-input placeholder="经手人" v-model="form.rHandmanv" size="small" disabled>
          <template slot="prepend">经手人</template>
        </el-input>
      </el-col>

      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      :height="orderID?null:'600px'"
      show-summary
      :summary-method="getSummaries"
      sum-text="合计:"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="55" align="center" property="index" label="序号"></el-table-column>
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
      <el-table-column sortable width="100" align="center" property="rdQuantity" label="盘点数量">
        <template slot-scope="scope" v-if="scope.row.gItemnum">
          <input
            type="text"
            v-model="scope.row.rdQuantity"
            :class="defStyle"
            @blur="iptBlur(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gSpec"
        label="规格"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="gPzysv"
        show-overflow-tooltip
        label="配置"
      ></el-table-column>

      <el-table-column sortable align="center" property="gName" width="150" label="商品名称">
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
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gBrandv"
        label="品牌"
      ></el-table-column>

      <el-table-column
        sortable
        width="80"
        align="center"
        show-overflow-tooltip
        property="gUnitv"
        label="单位"
      ></el-table-column>
      <el-table-column sortable width="100" align="center" property="rdCYQuantity" label="差异数">
        <template v-if="rdCYQuantity">
          <div>{{ rdCYQuantity }}</div>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        property="rdQuantityhistory"
        label="账面数量"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="iQuantitywillout"
        label="待发货数量"
      ></el-table-column>
      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="iQuantitywillin"
        label="待收货数量"
      ></el-table-column>
      <el-table-column sortable width="100" align="center" property="iUnitprice" label="成本单价"></el-table-column>
      <el-table-column
        sortable
        width="150"
        align="center"
        property="rdCYPrice"
        label="差异金额"
        show-overflow-tooltip
      >
        <template v-if="rdCYPrice">{{ $PublicJS.money(rdCYPrice, 2) }}</template>
      </el-table-column>

      <el-table-column
        sortable
        width="100"
        align="center"
        show-overflow-tooltip
        property="gNewoldv"
        label="新旧程度"
      ></el-table-column>
      <el-table-column
        sortable
        width="120"
        align="center"
        show-overflow-tooltip
        property="gCtime"
        label="最近销售日期"
      >
        <template slot-scope="scope" v-if="scope.row.gCtime">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.gCtime.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable min-width="150" align="center" property="gRemark" label="备注">
        <template slot-scope="scope">
          <input type="text" v-model="scope.row.gRemark" :class="defStyle" />
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20" :class="footstyle">
      <p class="red" style="padding-left:10px">说明:盘点数量包括 待出库数量+可出库存</p>
      <el-col :xs="24" :sm="24">
        <el-input placeholder v-model="form.rRemark" size="small">
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has="365">
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
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6" align="right" v-if="hideAllBtn">
            <div v-if="!$router.history.current.query.from">
              <div class="toolright">
                <div class="baocun" @click="btnSubmit('CG')" v-if="hideCG">
                  <p>保存草稿</p>
                </div>
                <div class="jizhang" @click="btnSubmit('SK')">
                  <p>提交审核</p>
                </div>
              </div>
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
      title="仓库选择"
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
        :havecanout="0"
      ></selectGoods>
    </el-dialog>

    <el-dialog
      title="选择审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showexamine"
      width="60%"
    >
      <examine
        :rtype="54"
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
import selectWarehouse from "../../../components/dialog/SelectWarehouse";
import selectUser from "../../../components/dialog/SelectUser";
import selectGoods from "../../../components/dialog/SelectGoods";
import settTable from "../../../components/settTable/settTable";
import getDate from "../../../utils/getDate";
export default {
  name: "fullDetail",
  inject: ["reload"],
  components: {
    selectWarehouse,
    selectUser,
    selectGoods,
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
      img: "",
      contact: [],
      rowindex: "",
      icon: "",
      disabled: false,
      hideCG: true,
      hideAllBtn: true,
      showSelectWarehouse: false,
      showSelectUser: false,
      showSelectGoods: false,
      showSHR: false,
      showexamine: false,
      showtable: false,
      orderBH: "",
      orderID: "",
      hideCG: true,
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rHandmanv: this.$storage.userName,
        rHandman: this.$storage.userId,
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "",
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        rType: 94,
        TotalGood: 0,
        rDate: "",
        rRemark: "",
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
      },
      rWhidOptions: [],
      idList: [],
      loading: "",
      CYPrice: 0
    };
  },
  // 路由缓存
  beforeRouteEnter(to, from, next) {
    let keepAlive = sessionStorage.getItem("keepAlive") || "";
    if (to.query.data) {
      to.meta.keepAlive = false;
    } else {
      to.meta.keepAlive = true;
      if (keepAlive == "keepAlive") {
        next(vm => {
          vm.reload();
        });
        sessionStorage.removeItem("keepAlive");
      } else {
        to.meta.keepAlive = true;
      }
    }
    next();
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
      for (let i = 0; i < 10; i++) {
        this.tableData.push({
          rdQuantity: null,
          iQuantity: null,
          iQuantitycanout: null,
          iQuantitywillout: null
        });
      }
      this.form.rDate = this.$PublicJS.nowDate();
      // 仓库
      this.$api.Warehouse.get({ size: 9999 }).then(res => {
        if (res.code == 200) {
          this.rWhidOptions = res.data.records.map(item => {
            return {
              label: item.whName,
              value: item.whId,
              whCode: item.whCode
            };
          });
        }
      });
    }
  },
  computed: {
    // 差异数
    rdCYQuantity: function() {
      this.tableData.map(item => {
        if (item.gItemnum) {
          return (item.rdCYQuantity = item.rdQuantity - item.rdQuantityhistory);
        }
      });
    },
    // 差异金额
    rdCYPrice: function() {
      this.tableData.map(item => {
        if (item.gItemnum) {
          return (item.rdCYPrice = (
            item.rdCYQuantity * item.iUnitprice
          ).toFixed(2));
        }
      });
    }
  },

  methods: {
    // 单据回显
    getOrder() {
      this.tableData = [];
      this.tableData3 = [];
      let rId = { rId: this.orderID };
      if (!this.orderID) {
        rId = { rItemnum: this.orderBH };
      }
      // 单据信息回显
      this.$api.Receipt.get(rId).then(res => {
        if (res.data) {
          let items = res.data.records[0];
          this.orderBH = items.rItemnum;
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
              // item.rdQuantityhistory = item.iQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
            this.form = items;
          });
        }
      });
    },
    // 提交
    btnSubmit(val) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      }
      let arr = [];
      this.tableData.map(item => {
        if (item.gId) {
          arr.push(item.gId);
        }
      });
      if (!arr.length) {
        this.$message({ message: "请选择商品", type: "warning" });
        return false;
      }
      // if (this.form.rWhidv && arr.length) {
      //   // this.dialogSubmit();
      //   this.showexamine = true;
      // }
      if (val === "CG") {
        this.$confirm("此操作为保存草稿, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogSubmit(val);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      } else {
        this.showexamine = true;
      }
    },
    // 审核提交
    dialogSubmit(val, val1) {
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
            item.rdIotype = 0;
            item.rdRemark = item.gRemark;
            // item.rdQuantityhistory=item.rdQuantity;
            tableData.push(item);
          }
        });
        delete this.form.rFile;
        this.form.rDate = this.$PublicJS.nowDate();
        let params = {
          approve: val == "CG" ? false : true, //是否发起审批
          approvers: val == "CG" ? [] : val, //钉钉审批人ID
          receiptDtsList: tableData, //商品
          receiptInfoVO: this.form //单据信息
        };
        params.receiptInfoVO.rTotalprice = this.CYPrice;
        if (val1 && val1.length) {
          params.cc = val1;
        }
        if (val == "CG") {
          params.receiptInfoVO.rStatus = 30;
        } else {
          params.receiptInfoVO.rStatus = 1;
        }
        this.$api.Receipt.saveall(params).then(res => {
          loading.close();
          if (res.code === 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$router.push("/warehouse/inventory/fullList");
          } else {
            this.$message({ message: res.err, type: "error" });
          }
        });
      }
      this.showexamine = false;
    },
    iptBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入盘点数量");
          val.rdQuantity = 1;
        }
        if (Number(val.rdQuantity) < Number(val.iQuantitywillout)) {
          this.$message.error("盘点数量小于待出库数量");
          return (val.rdQuantity = val.iQuantitywillout);
        }
      } else {
        val.rdQuantity = 1;
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
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property === "rdQuantity") ||
          column.property === "rdCYQuantity" ||
          column.property === "rdQuantityhistory" ||
          column.property === "rdCYPrice"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            // debugger
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);

          if (column.property === "rdCYPrice") {
            // sums[index] = this.$PublicJS.money(sums[index], 2);
            this.CYPrice = sums[index];
          } else {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            // sums[index] += " 元";
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
    selectChange(m, val) {
      if (val) {
        let obj = {};
        obj = this[m + "Options"].find(item => {
          return item.value === val; //筛选出匹配数据
        });
        this.form[m + "v"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
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
    // 商品
    getGoodsData(val) {
      if (this.tableData[this.rowindex].gId && Array.isArray(val)) {
        val = val[0];
      }
      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = item.iQuantity;
          item.rdQuantityhistory = item.iQuantity;
          item.rdCYQuantity = 0;
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
        val.rdQuantity = val.iQuantity;
        val.rdQuantityhistory = val.rdQuantity;
        val.rdCYQuantity = 0;
        const data = JSON.parse(JSON.stringify(val));
        this.tableData.splice(this.rowindex, 1, data);
      }
      this.showSelectGoods = false;
    },

    setimg(u) {
      this.img = u;
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
