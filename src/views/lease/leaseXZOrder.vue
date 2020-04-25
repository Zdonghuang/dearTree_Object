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
        <p class="title">租赁单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has='1571'>打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rCuidv"
          filterable
          placeholder="请选择客户"
          size="small"
          :disabled="disabled"
          @change="selectChange('rCuid',form.rCuidv)"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>客户
            </span>
          </template>
          <el-option
            v-for="(item,index) in rCuidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:300px">{{ item.label }}</span>
            <!-- <span style="float: left;">{{ item.cuadd }}</span> -->
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rCidv"
          placeholder="请选择收货人"
          size="small"
          filterable
          @change="selectChange('rCid',form.rCidv)"
          class="selectSlot3"
          :disabled="disabled"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>收货人
            </span>
          </template>
          <el-option
            v-for="(item,index) in contact"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.cMobile }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rWhidv"
          filterable
          placeholder="请选择仓库"
          size="small"
          :disabled="disabled"
          @change="selectChange('rWhid',form.rWhidv)"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>仓库
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
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rHandmanv"
          filterable
          placeholder="请选择签单人"
          size="small"
          :disabled="disabled"
          @change="selectChange('rHandman',form.rHandmanv)"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>签单人
            </span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rOidv"
          filterable
          placeholder="请选择归属公司"
          size="small"
          :disabled="disabled"
          @change="selectChange('rOid',form.rOidv)"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>归属公司
            </span>
          </template>
          <el-option
            v-for="(item,index) in rOidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="获客人" v-model="form.rGetguestv" size="small" disabled>
          <template slot="prepend">获客人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系电话" v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-input placeholder="收货地址" v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">收货地址</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4" v-if="form.rCuidv && form.rStatus!=19">
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-plus"
          @click="showDialog('showAddClient')"
          v-if="form.rStatus!=1"
        >添加收货人</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="mini"
          height='300px'
          show-summary
          :summary-method="getSummaries"
          sum-text="合计:"
          header-cell-class-name="thbgc"
        >
          <el-table-column type="index" width="55" align="center" property="index" >
            <template slot="header">
              <i class="fa fa-cog setting" @click="showtable=true"></i>
            </template>
          </el-table-column>
          <el-table-column sortable
            property="tools"
            label="操作"
            align="center"
            
            width="80"
            v-if="!disabled"
          >
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(1)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,1)"></i>
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
          <el-table-column sortable
            align="center"
            property="gName"
            width="150"
            v-if="tableStatus.gName"
            label="商品名称"
          >
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
            width="120"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            v-if="tableStatus.gBrandv"
            label="品牌"
          ></el-table-column>
          <el-table-column sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gSpec"
            label="规格"
          ></el-table-column>
          <el-table-column sortable
            width="100"
            align="center"
            property="gPzysv"
            show-overflow-tooltip
            label="配置"
          ></el-table-column>
          <el-table-column sortable
            width="80"
            align="center"
            property="gColorv"
            v-if="tableStatus.gColorv"
            label="颜色"
          ></el-table-column>
          <el-table-column sortable
            width="100"
            align="center"
            property="rdQuantity"
            label="租赁数量"
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
            width="80"
            align="center"
            property="gUnitv"
            v-if="tableStatus.gUnitv"
            label="单位"
          ></el-table-column>
          <el-table-column sortable width="150" align="center" property="gRentprice" label="月租金">
            <template slot-scope="scope" v-if="scope.row.gId">
              <input
                type="text"
                v-model="scope.row.gRentprice"
                :class="defStyle"
                :disabled="disabled"
                @blur="iptBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column sortable width="150" align="center" property="sumPrice" label="租赁总金额">
            <template v-if="sumTotalPrice">{{ $PublicJS.money(sumTotalPrice, 2) }}</template>
          </el-table-column>
          <el-table-column sortable width="100" align="center" property="iQuantitycanout" label="可用库存"></el-table-column>
          <el-table-column sortable width="150" align="center" property="iSellingprice" label="销售价"></el-table-column>
          <el-table-column sortable width="150" align="center" property="sumsellPrice" label="销售总金额">
            <template slot-scope="scope" v-if="scope.row.iSellingprice * scope.row.rdQuantity">{{ scope.row.iSellingprice * scope.row.rdQuantity}}</template>
          </el-table-column>
          <el-table-column sortable
            width="100"
            align="center"
            property="gNewoldv"
            v-if="tableStatus.gNewoldv"
            label="新旧程度"
          ></el-table-column>
          <el-table-column sortable
            width="120"
            align="center"
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
            width="150"
            align="center"
            property="gRemark"
            label="备注"
            v-if="tableStatus.gRemark"
          >
            <template slot-scope="scope" v-if="scope.row.gId">
              <input type="text" v-model="scope.row.gRemark" :class="defStyle" :disabled="disabled" />
            </template>
          </el-table-column>
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
          :disabled="disabled"
        ></el-date-picker>
      </el-col>

      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="租赁月数"
          v-model="form.months"
          size="small"
          :disabled="disabled"
          style="margin-left:15px"
        >
          <template slot="prepend">
            <b class="red asterisk">*</b>租赁月数
          </template>
        </el-input>
      </el-col>
      <!-- <el-col :xs="24" :sm="4">
        <el-input
          placeholder="本单押金"
          v-model="form.rReceivableyj"
          size="small"
          style="margin-left:15px"
        >
          <template slot="prepend">本单押金</template>
        </el-input>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="4">
        <el-button size="mini" type="warning" >修改押金</el-button>
      </el-col> -->

      <el-col :xs="24" :sm="24">
        <el-input placeholder="单据备注" v-model="form.rRemark" size="small" :disabled="disabled">
          <template slot="prepend">单据备注</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="content" v-has='1571'>
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
                <span>{{$PublicJS.money(form.months*form.rTotalprice, 2)}}</span>
              </div>
            </div>
          </el-col>
          <!-- <el-col :xs="24" :sm="6" align="right" v-if="hideAllBtn">
            <div class="toolright">
              <div class="baocun" @click="btnSubmit('CG')" v-if="hideCG">
                <p>保存草稿</p>
              </div>
              <div class="jizhang" @click="btnSubmit('SK')">
                <p>锁定库存</p>
              </div>
            </div>
          </el-col> -->
        </el-row>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <el-dialog
      title="商品选择"
      :close-on-click-modal="false"
       v-dialogDrag :visible.sync="showSelectGoods"
      width="60%"
    >
      <selectGoods
        @emitGoodsData="getGoodsData"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :idList="idList"
      ></selectGoods>
    </el-dialog>
    <el-dialog
      title="添加收货人"
      :close-on-click-modal="false"
       v-dialogDrag :visible.sync="showAddClient"
      width="60%"
    >
      <addClient :upid="form.rCuid" @emitUserAdd="getUserAdd"></addClient>
    </el-dialog>
    <el-dialog title="设置表格" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showtable" width="30%">
      <settTable @settTable="settTable"></settTable>
    </el-dialog>
  </div>
</template>

<script>
import selectGoods from "../../components/dialog/SelectGoods";
import settTable from "../../components/settTable/settTable";
import addClient from "../../components/dialog/AddClient";
import getDate from "../../utils/getDate";
export default {
  name: "saleOrder",
  inject: ["reload"],
  components: {
    selectGoods,
    addClient,
    settTable
  },
  data() {
    return {
      dataType: 0,
      dingding: {},
      dingding1: {},
      defStyle: "ipt tc bgc",
      footstyle: "mtop15 mbottom",
      tableData: [],
      rowindex: "",
      icon: "",
      disabled: false,
      hideCG: true,
      hideAllBtn: true,
      showSelectGoods: false,
      showAddClient: false,
      showSelectGuest: false,
      showSHR: false,
      showexamine: false,
      showtable: false,
      orderBH: "",
      orderID: "",
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus")),
      client: {},
      idList: [],
      rCuidOptions: [],
      contact: [],
      rWhidOptions: [],
      rHandmanOptions: [],
      rOidOptions: [],
      // 单据信息
      form: {
        rid: this.orderID,
        rItemnum: this.orderBH,
        rType: 71,
        rIsconstruct: 1,
        rTotalprice: 0,
        TotalGood: 0,
        rDiscountamount: 0,
        rHandmanv: this.$storage.userName,
        rHandman: this.$storage.userId,
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "",
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        rCuid: 0,
        rCuidv: "",
        rCuserid: 0,
        rGetguest: 0,
        rCidv: "",
        rCid: 0,
        rCaddr: "",
        rCmobile: "",
        rCtime: "",
        rDate: "",
        rRemark: "",
        cuadd: "",
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName,
        months: 1,
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
      },
      loading: false,
      img: "",
      loading1:'',
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
      this.loading1 = this.$loading({
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
      // // 客户
      // this.$api.Customer.get({ div: 16, size: 9999, auth: 1 }).then(res => {
      //   if (res.code == 200) {
      //     this.rCuidOptions = res.data.records.map(item => {
      //       return {
      //         label: item.cuName,
      //         value: item.cuId,
      //         cuHandman: item.cuHandman,
      //         cuHandmanvalue: item.cuHandmanvalue,
      //         cuadd:
      //           item.cuProvincevalue + item.cuCityvalue + item.cuDistrictvalue,
      //         cuAddr: item.cuAddr
      //       };
      //     });
      //   }
      // });
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
      // 签单人
      this.$api.User.get({ size: 9999, auth: 1, status:1 }).then(res => {
        if (res.code == 200) {
          this.rHandmanOptions = res.data.records.map(item => {
            return {
              label: item.uName,
              value: item.uId,
              oidValue: item.oidValue,
              uMobile: item.uMobile
            };
          });
        }
      });
      // 归属公司
      this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1 }).then(res => {
        if (res.code == 200) {
          this.rOidOptions = res.data.map(item => {
            return {
              label: item.title,
              value: item.id
            };
          });
        }
      });
      this.form.rDate = this.$PublicJS.nowDate();
    }
  },
  computed: {
    //本单金额
    // Totalprice: function() {
    //   return this.form.rTotalprice * this.form.months;
    // },
    // 总金额
    sumTotalPrice: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (item.rdQuantity * item.gRentprice).toFixed(
            2
          ));
        }
      });
    },
    sumSELLTotalPrice: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.sumPrice = (item.rdQuantity * item.gRentprice).toFixed(
            2
          ));
        }
      });
    },
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          div: 16,
          size: 9999,
          auth: 1,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = res.data.records.map(item => {
              return {
                label: item.cuName,
                value: item.cuId,
                cuHandman: item.cuHandman,
                cuHandmanvalue: item.cuHandmanvalue,
                cuadd:
                  item.cuProvincevalue +
                  item.cuCityvalue +
                  item.cuDistrictvalue,
                cuAddr: item.cuAddr
              };
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
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
            this.loading1.close();
            res.data.map(item => {
              item.gRentprice = item.rdSellingprice;
              item.gRemark = item.rdRemark;
              item.defNum = item.rdQuantity;
              if (item.gImage) {
                item.gImage = item.gImage.split(",");
              }
              this.tableData.push(item);
            });
          });
          this.form = items;
          this.getReceiver({ cuid: items.rCuid,size:99 });
          this.form.time = [
              items.startDate.split("T")[0],
              items.endDate.split("T")[0]
            ];
        }
      });
    },
    // 收货人回显
    getReceiver(val) {
      this.contact = [];
      this.$api.Contact.get(val).then(res => {
        if (res.code == 200) {
          this.contact = res.data.records.map(item => {
            return {
              label: item.cName,
              value: item.cId
            };
          });
          let obj = this.contact.find(item => {
            return item.value == this.form.rCid;
          });
          this.form.rCidv = obj.label;
          this.form.rCid = obj.value;
        }
      });
    },
    setimg(u) {
      this.img = u;
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(
        `/#/sales/printingOrder?data=${data}`,
        "_blank"
      );
    },
    // 提交
    btnSubmit(val) {
      if (!this.form.rCuidv) {
        this.$message({ message: "请选择客户", type: "warning" });
        return false;
      }
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      }
      if (!this.form.rHandmanv) {
        this.$message({ message: "请选择签单人", type: "warning" });
        return false;
      }
      if (!this.form.rOid) {
        this.$message({ message: "请选择归属公司", type: "warning" });
        return false;
      }

      // let arr = [];
      // this.tableData.map(item => {
      //   if (item.gId) {
      //     arr.push(item.gId);
      //   }
      // });
      // if (!arr.length) {
      //   this.$message({ message: "请选择商品", type: "warning" });
      //   return false;
      // }
      let arr = [];
      this.tableData.map(item => {
        if (item.gId) {
          arr.push(item.gId);
        }
      });
      let arr3 = [];
      this.tableData3.map(item => {
        if (item.gId) {
          arr3.push(item.gId);
        }
      });
      if (!arr.length && !arr3.length) {
        this.$message({ message: "请选择服务项", type: "warning" });
        return false;
      }
      if (!this.form.time) {
        this.$message({ message: "请选择租赁时间", type: "warning" });
        return false;
      }
      if (!this.form.months) {
        this.$message({ message: "请输入租赁月份", type: "warning" });
        return false;
      }

      let msg = "保存草稿";
      if (val === "CG") {
        msg = "保存草稿";
      }
      if (val === "SK") {
        msg = "锁定库存";
      }
      this.$confirm("此操作为" + msg + ", 是否继续?", "提示", {
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
            item.rdSellingprice = item.gRentprice;
            item.rdUnitprice = item.iUnitprice;
            item.rdRemark = item.gRemark;
            item.rdIotype = 1;
            tableData.push(item);
          }
        });
        if (val == "CG") {
          this.form.rStatus = 30;
        }
        if (val == "SK") {
          this.form.rStatus = 1;
        }
        delete this.form.rFile;
        this.form.startDate = this.form.time[0];
        this.form.endDate = this.form.time[1];
        this.form.rDate=this.$PublicJS.nowDate();
        let params = {
          approve: val == "CG" ? false : true, //是否发起审批
          approvers: [], //钉钉审批人ID
          receiptDtsList: tableData, //商品
          receiptInfoVO: this.form //单据信息
        };
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
        if (val1 && val1.length) params.cc = val1;
        let sum=parseFloat((this.TotalPrice1 + this.TotalPrice2).toPrecision(12))
        params.receiptInfoVO.rTotalprice = parseFloat((this.form.months * sum).toPrecision(12));
        this.$api.Rent.save(params).then(res => {
          loading.close();
          if (res.code === 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$router.push("/lease/leaseList");
          } else {
            this.$message({ message: res.err, type: "error" });
          }
        });
      }
    },
    iptBlur(val) {
      if (!isNaN(val.rdQuantity)) {
        if (!val.rdQuantity) {
          this.$message("请输入数量");
          val.rdQuantity = 1;
        } else if ( Number(val.rdQuantity) < 1) {
          val.rdQuantity = 1;
          this.$message("数量不得小于1");
        } else if (Number(val.rdQuantity) > Number(val.iQuantitycanout)) {
          val.rdQuantity = val.iQuantitycanout;
          this.$message("数量不得大于可用库存");
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
    setdanjia(e) {
      if (!isNaN(e.iSellingprice)) {
        if (!e.iSellingprice) {
          this.$message("请输入商品单价");
          e.iSellingprice = 1;
        } else if (e.iSellingprice < 0) {
          e.iSellingprice = 0;
          this.$message("商品单价不得小于0");
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
            column.property === "sumPrice") ||
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
    selectChange(m, val) {
      this.form[m] = val;
      if (m == "rCuid") {
        this.$api.Contact.get({ cuid: this.form.rCuid,size:99 }).then(res => {
          if (res.code == 200) {
            this.contact = res.data.records.map(item => {
              return {
                label: item.cName,
                value: item.cId,
                cMobile: item.cMobile,
                cAddr: item.cAddr
              };
            });
            this.form.rCidv = this.contact[0].label;
            this.form.rCid = this.contact[0].value;
            let obj = this.rCuidOptions.find(item => {
              return item.value == this.form.rCuid;
            });
            this.form.rGetguestv = obj.cuHandmanvalue;
            this.form.rGetguest = obj.cuHandman;
            this.form.rCmobile = this.contact[0].cMobile;
            this.form.cuadd = obj.cuadd;
            this.form.rCaddr = this.form.cuadd + obj.cuAddr;
          }
        });
      }
      if (m == "rCid") {
        let objs = this.contact.find(item => {
          return item.value == this.form.rCid;
        });
        this.form.rCmobile = objs.cMobile;
        this.form.rCaddr = this.form.cuadd + objs.cAddr;
      }
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    // 新增一行
    adddate(val) {
      if (val == 1) {
        this.tableData.push({});
      }
      if (val == 3) {
        this.tableData3.push({});
      }
    },
    // 删除当前选中这行
    deldate(index, val) {
      if (val == 1) {
        if (this.tableData.length > 1) {
          this.tableData.splice(index, 1);
        }
      }
      if (val == 3) {
        if (this.tableData3.length > 1) {
          this.tableData3.splice(index, 1);
        }
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
    getUserAdd(val) {
      let params = {
        cuAddr: val.cuAddr,
        cuName: val.cuName,
        cuBankcardnum: val.cuBankcardnum,
        cuBankname: val.cuBankname,
        cuProvince: val.cuProvince,
        cuCity: val.cuCity,
        cuDistrict: val.cuDistrict,
        cuHandman: val.cuHandman,
        cuIndustry: val.cuIndustry,
        cuOrigin: val.cuOrigin,
        cuRemark: val.cuRemark,
        cuTaxnum: val.cuTaxnum,
        cuOid: val.cuOid,
        cuStatus: "1",
        cuDiv: val.cuDiv,
        tContactList: val.tContactList
      };
      if (val.cuId) {
        params["cuId"] = val.cuId;
      }
      this.$api.Customer.saveCustomerAndContact(params).then(res => {
        if (res.code == "200") {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.reload();
        } else {
          this.$message("保存失败");
        }
      });
      this.showAddClient = false;
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
