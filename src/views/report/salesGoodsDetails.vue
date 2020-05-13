<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12"></el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="mini" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          size="mini"
          placeholder="起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          size="mini"
          placeholder="结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.goodsItemNum" size="mini" clearable>
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.orderParent" size="mini" clearable>
          <template slot="prepend">来源单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.orderUserId"
          filterable
          clearable
          placeholder="请选择签单人"
          size="mini"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">签单人</span>
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
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.handmanId"
          filterable
          clearable
          placeholder="请选择获客人"
          size="mini"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">获客人</span>
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
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.orgId"
          filterable
          clearable
          placeholder="请选择归属公司"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">归属公司</span>
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
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.customerId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="mini"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">客户</span>
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
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.orderType"
          filterable
          clearable
          placeholder="请选择单据类型"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">单据类型</span>
          </template>
          <el-option
            v-for="(item,index) in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.goodsFrom"
          filterable
          clearable
          placeholder="请选择商品来源"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">商品来源</span>
          </template>
          <el-option value="1" label="采购"></el-option>
          <el-option value="2" label="回收"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.goodsId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="商品名称"
          :remote-method="remoteMethodGoods"
          :loading="loadings"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">商品名称</span>
          </template>
          <el-option
            v-for="(item,index) in GoodsOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.goodsClassA"
          filterable
          clearable
          @clear="clearClass"
          placeholder="一级分类"
          @change="setClassB"
          size="mini"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">一级分类</span>
          </template>
          <el-option
            v-for="(item,index) in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.goodsClassB"
          filterable
          clearable
          placeholder="二级分类"
          size="mini"
          class="selectSlot4"
          @change="updata"
        >
          <template slot="prefix">
            <span class="prefixSlot">二级分类</span>
          </template>
          <el-option
            v-for="(item,index) in classOptionsB"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              id="table-data"
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="updateDateTime"
                label="制单时间"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orderTypeName"
                label="单据类型"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="otherWarehouseName"
                label="调入仓库"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.orderTypeName=='销售调拨出库单'">{{scope.row.otherWarehouseName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orderNum"
                label="单据编号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orderParentNum"
                label="单据来源编号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsItemNum"
                label="货号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsName"
                label="商品名称"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsQty"
                label="数量"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsUnitName"
                label="单位"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsAmount"
                label="金额"
              ></el-table-column>
              <el-table-column
                v-if="vhas"
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsUnitPrice"
                label="成本单价"
              ></el-table-column>
              <el-table-column
                v-if="vhas"
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsUnitAmount"
                label="成本总额"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsSalesPrice"
                label="销售价"
              ></el-table-column>
              <el-table-column
                v-if="vhas"
                show-overflow-tooltip
                sortable
                align="center"
                prop="profitMoney"
                label="毛利额"
              ></el-table-column>
              <el-table-column
                v-if="vhas"
                show-overflow-tooltip
                sortable
                align="center"
                prop="profitRatio"
                label="毛利率"
              >
              <template slot-scope="scope">
                {{scope.row.profitRatio}}%
              </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsFromName"
                label="商品来源"
              ></el-table-column>
              <el-table-column show-overflow-tooltip sortable align="center" label="结算状态">
                <template slot-scope="scope">
                  <span>{{scope.row.financeStatus==0?'未结算':scope.row.financeStatus==1?'已结算':scope.row.financeStatus==2?'部分结算':'无需结算'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsClassA"
                label="一级分类"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="goodsClassB"
                label="二级分类"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="customerId"
                label="客户ID"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="customerName"
                label="客户"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orderUserName"
                label="签单人"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="regUserName"
                label="制单人"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="handmanName"
                label="获客人"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="installTeamName"
                label="拆装"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="deliverTeamName"
                label="送货"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="cleanTeamName"
                label="备货"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orgName"
                label="归属公司"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="wareHouseName"
                label="仓库"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="cleanTeamName"
                label="备货"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                align="center"
                prop="orderRemark"
                label="备注"
              ></el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, total]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-dialog
      title="商品"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <selectGoods @emitGoodsData="getGoodsData" :show="false"></selectGoods>
    </el-dialog>
    <el-dialog
      title="仓库"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getWarehouseData"></selectWarehouse>
    </el-dialog>
  </div>
</template>

<script>
import selectGoods from "@/components/dialog/SelectGoods";
import selectWarehouse from "@/components/dialog/SelectWarehouse";
import getDate from "../../utils/getDate";
export default {
  name: "stock",
  inject: ["reload"],
  components: {
    selectGoods,
    selectWarehouse
  },
  data() {
    return {
      vhas: true,
      loading: false,
      loadings: false,
      showselectGoods: false,
      showSelectWarehouse: false,
      data: [],
      TreeData: [],
      tableData: [],
      YSoptions: [],
      form: {
        startDate: getDate.getToday().starttime,
        endDate: getDate.getToday().endtime,
        goodsItemNum: "",
        orderParent: "",
        handmanId: "",
        orderUserId: "",
        orderType: "",
        goodsFrom: "",
        goodsId: "",
        goodsClassB: "",
        goodsClassA: ""
      },
      bankAccountList: [],
      totalpage: 1,
      page: 1,
      orderclass: 1,
      orderclass1: 1,
      img: "",
      whid: "",
      whidv: "",
      whoid: "",
      whoidv: "",
      gclass: "",
      showSum: true,
      gname: "",
      gcolor: "",
      defaultProps: {
        children: "childs",
        label: "title"
      },
      order: "",
      GSoptions: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数,
      ok: true,
      rHandmanOptions: [],
      rOidOptions: [],
      rCuidOptions: [],
      GoodsOptions: [],
      orderTypeOptions: [],
      classOptions: [],
      classOptionsB: [],
      childData: []
    };
  },
  created() {
    this.getList();
    this.gitTree();
    this.orderTypeOptions = [
      { value: 15, label: "销售出库单" },
      { value: 29, label: "销售退货入库单" },
      { value: 42, label: "销售换货入库单" },
      { value: 28, label: "销售换货出库单" },
      { value: 46, label: "销售调拨出库单" },
      { value: 73, label: "租赁出库单" },
      { value: 58, label: "盘点报废结算单" },
      { value: 77, label: "租赁续费单" },
    ];
    this.$api.Common.get({ typeCode: "YHZH" }).then(res => {
      this.bankAccountList = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
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
    // 签单人
    this.$api.User.get({ size: 9999, auth: 1, status: 1 }).then(res => {
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
    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getList(val) {
      let d = this.form;
      if (!this.form.startDate) delete d.startDate;
      if (!this.form.endDate) delete d.endDate;
      if (!this.form.goodsItemNum) delete d.goodsItemNum;
      if (!this.form.orderParent) delete d.orderParent;
      if (!this.form.orderUserId) delete d.orderUserId;
      if (!this.form.handmanId) delete d.handmanId;
      if (!this.form.orgId) delete d.orgId;
      if (!this.form.goodsFrom) delete d.goodsFrom;
      if (!this.form.goodsId) delete d.goodsId;
      if (!this.form.orderType) delete d.orderType;
      if (!this.form.goodsClassA) delete d.goodsClassA;
      if (!this.form.goodsClassB) delete d.goodsClassB;
      if (!this.form.goodsItemNum) delete d.goodsItemNum;
      if (d.startDate) d.startDate = d.startDate.replace(/\-/g, "");
      if (d.endDate) d.endDate = d.endDate.replace(/\-/g, "");
      d.size = this.pageSize;
      d.currentPage = this.currentPage;
      if (val == "xlsx") {
        d.size = this.total;
        d.currentPage = 1;
        this.pageSize = this.total;
      }
      this.$api.ReportCapital.salesGoodsDetails(d).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        if (val == "xlsx") {
          setTimeout(() => {
            this.exportTable();
          }, 1500);
        }
      });
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
          `销售商品明细列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 一级分类
    gitTree() {
      let parms = {
        typeCode: "SPFL"
      };
      this.$api.Common.getDIC(parms).then(res => {
        let items = res.data;
        this.childData = res.data;
        this.classOptions = items.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      });
    },
    setClassB() {
      this.form.goodsClassB = "";
      this.childData.map(item => {
        if (this.form.goodsClassA == item.id) {
          this.classOptionsB = item.childs.map(item => {
            return {
              label: item.title,
              value: item.id
            };
          });
        }
      });
    },
    clearClass() {
      this.form.goodsClassB = "";
      this.classOptionsB = [];
    },
    updata() {
      this.$forceUpdate();
    },
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
    remoteMethodGoods(query) {
      if (query) {
        this.loadings = true;
        this.$api.Goods.queryForAdmin({
          size: 9999,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loadings = false;
            this.GoodsOptions = res.data.records.map(item => {
              return {
                label: item.gName,
                value: item.gId
              };
            });
          }
        });
      } else {
        this.GoodsOptions = [];
      }
    },
    setimg(url) {
      this.img = url;
    },
    goGoods(e) {
      this.$router.push({
        path: "/basicInfo/goodsedit",
        query: { gId: e }
      });
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    treeNodeClick(data) {
      this.gclass = data.id;
      this.getList();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    getGoodsGS() {
      let parms = {
        typeCode: "ZZJG",
        value1: 1
      };
      this.$api.Common.get(parms).then(res => {
        this.GSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    getGoodsYS() {
      let parms = {
        typeCode: "YS"
      };
      this.$api.Common.get(parms).then(res => {
        this.YSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    toExcel(table, e) {
      let content = document.getElementById(table).outerHTML;
      let html =
        '<html><head><meta charset="utf-8" /></head><body>' +
        content +
        "</body></html>";
      // console.log(html);
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      const blob = new Blob([html], { type: "text/excel" });
      // 利用URL.createObjectURL()方法为a元素生成blob URL
      e.target.href = URL.createObjectURL(blob);
      e.target.download = "库存.xls";
    },
    setclass(row) {
      const $singleTable = this.$refs.singleTable;
      $singleTable.toggleRowExpansion(row);
      $singleTable.toggleRowSelection(row);
      if (this.orderclass == 1) {
        this.order = "1";
        this.orderclass = 2;
      } else {
        this.order = "2";
        this.orderclass = 1;
      }

      if (this.ok) {
        this.ok = false;
        this.getList();
      }
    },
    setclass1(row) {
      const $singleTable = this.$refs.singleTable;
      $singleTable.toggleRowExpansion(row);
      $singleTable.toggleRowSelection(row);
      if (this.orderclass1 == 1) {
        this.order = "3";
        this.orderclass1 = 2;
      } else {
        this.order = "4";
        this.orderclass1 = 1;
      }

      if (this.ok) {
        this.ok = false;
        this.getList();
      }
    },
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
          !values.every(value => isNaN(value)) &&
          column.property == "goodsAmount"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.startDate = getDate[fn]().starttime;
        this.form.endDate = getDate[fn]().endtime;
      }
    },
    getGoodsData(val) {
      if (val) {
        this.gname = val.gName;
      }
      this.showselectGoods = false;
    },
    getWarehouseData(val) {
      if (val) {
        this.whid = val.whId;
        this.whidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    open(v) {
      window.open(v, "_blank");
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.imgs {
  width: 600px;
}
.table {
  display: none;
  line-height: 20px;
  text-align: center;
  tr th,
  tr td {
    padding: 2px;
  }
}
.bluecolor {
  color: rgb(0, 183, 255);
  text-decoration: underline;
  cursor: pointer;
}
.export {
  display: inline-block;
  width: 73px;
  height: 28px;
  line-height: 22px;
  font-size: 13px;
  color: #666;
  padding: 4px 13px;
  box-sizing: border-box;
  border: 1px solid rgb(228, 227, 227);
  border-radius: 3px;
  vertical-align: middle;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
.selectSlot4 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot2 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot3 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
</style>
