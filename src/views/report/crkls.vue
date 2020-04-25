<template>
  <div>
    <!-- <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input placeholder="商品" v-model="gname" size="mini" readonly>
          <template slot="prepend">商品</template>
          <i slot="suffix" class="el-input__icon el-icon-search" @click="showselectGoods=true"></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="仓库" v-model="whidv" size="mini" readonly>
          <template slot="prepend">仓库</template>
          <i slot="suffix" class="el-input__icon el-icon-search" @click="showSelectWarehouse=true"></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select v-model="whoid" placeholder="归属公司" size="mini" class="selectSlot4" filterable>
          <template slot="prefix">
            <span class="prefixSlot">归属公司</span>
          </template>
          <el-option
            v-for="item in GSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select v-model="gcolor" placeholder="颜色" size="mini" class="selectSlot4" filterable>
          <template slot="prefix">
            <span class="prefixSlot">颜色</span>
          </template>
          <el-option
            v-for="item in YSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-col>
      <el-col :sm="4" :xs="24" align="right">
        <a href="javascript:" @click="toExcel('tab',$event)" class="export" v-has="373">
          <i class="el-icon-download"></i> 导出
        </a>
        <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
      </el-col>
    </el-row>-->
    <el-row :gutter="20">
      <!-- <el-col :xs="24" :sm="3">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">分类</div>
            <div class="treeBox">
              <el-tree
                :data="TreeData"
                node-key="id"
                accordion
                :expand-on-click-node="true"
                :props="defaultProps"
                :default-expanded-keys="['']"
                @node-click="treeNodeClick"
                highlight-current
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column sortable align="center" prop="rdate" label="日期"></el-table-column>
              <el-table-column sortable align="center" prop="gitemnum" label="货号"></el-table-column>
              <el-table-column sortable align="center" prop="gname" label="商品名称"></el-table-column>
              <el-table-column sortable align="center" prop="gclassv" label="商品分类"></el-table-column>
              <el-table-column sortable align="center" prop="rwhidv" label="仓库"></el-table-column>
              <el-table-column sortable align="center" prop="iotypev" label="出入库"></el-table-column>
              <el-table-column sortable align="center" label="出库数量">
                <template slot-scope="scope">
                  {{scope.row.iotypev=='出'?scope.row.rdquantity:0}}
                </template>
              </el-table-column>
              <el-table-column sortable align="center" label="入库数量">
                <template slot-scope="scope">
                  {{scope.row.iotypev=='入'?scope.row.rdquantity:0}}
                </template>
              </el-table-column>
              <el-table-column sortable align="center" prop="gunitv" label="商品单位"></el-table-column>
              <el-table-column sortable align="center" prop="rdunitprice" label="成本单价"></el-table-column>
              <el-table-column sortable align="center" prop="rdtotalunitprice" v-if="vhas" label="成本金额"></el-table-column>
              <el-table-column sortable align="center" prop="rtypev" label="单据类型"></el-table-column>
              <el-table-column sortable align="center" prop="ritemnum" label="单据编号"></el-table-column>
              <el-table-column sortable align="center" prop="ritemnumparent" label="父单据编号"></el-table-column>
              <el-table-column sortable align="center" prop="rhandmanv" label="经手人"></el-table-column>
              <el-table-column sortable align="center" prop="rcuidv" label="客户名称"></el-table-column>
              <el-table-column sortable align="center" prop="rremark" label="单据备注"></el-table-column>
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
      showselectGoods: false,
      showSelectWarehouse: false,
      data: [],
      TreeData: [],
      tableData: [],
      YSoptions: [],
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
      ok: true
    };
  },
  created() {
    this.getList();
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getList() {
      let d = {};
      d.size = this.pageSize;
      d.currentPage = this.currentPage;
      this.$api.Stat.kcls(d).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.records;
      });
    },
    gitTree() {
      let parms = {
        typeCode: "SPFL"
      };
      this.TreeData[0] = { id: "", title: "全部", childs: [] };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData[0].childs = item;
      });
    },
    setimg(url) {
      this.img = url;
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
          sums[index] ="合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property == "I_QUANTITY") ||
          column.property == "I_QUANTITYCANOUT" ||
          column.property == "I_QUANTITYWILLIN" ||
          column.property == "I_QUANTITYWILLOUT" ||
          column.property == "cb" ||
          column.property == "xs"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          if (column.property == "cb" || column.property == "xs") {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
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
