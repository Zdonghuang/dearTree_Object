<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入商品名称" v-model="form.gName" size="small" class="cuName"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入商品货号" v-model="form.gItemnum" size="small" class="cuName"></el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-col>
      <el-col :sm="12" :xs="24" align="right">
        <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
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
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column sortable align="center" prop="gid" label="商品ID"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="gitemnum" label="货号"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="gname" label="商品名称"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="gunitprice" label="当前成本价"></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                prop="pconstruct"
                label="施工费用分摊"
              ></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="ppriceh" label="历史成本价"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="pquantityh" label="历史数量"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="ppricec" label="入库价格"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="pquantityc" label="入库数量"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="goidv" label="所属公司"></el-table-column>
              <el-table-column sortable
                align="center"
                show-overflow-tooltip
                prop="pupdatemethod"
                label="更改类型"
              ></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="ritemnumv" label="更改单据类型"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="ritemnum" label="更改单据编号"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="uname" label="经手人"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="umobile" label="经手人电话"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip prop="utime" label="更改时间"></el-table-column>
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
      form: {
        gItemnum: "",
        gName: ""
      },
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
    this.getGoodsGS();
    this.getGoodsYS();
    this.gitTree();

    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getList() {
      let d = this.form;
      if (!this.form.gName) delete d.gName;
      if (!this.form.gItemnum) delete d.gItemnum;
      d.size = this.pageSize;
      d.currentPage = this.currentPage;
      this.$api.Financialsettle.getDetailLog(d).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
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
