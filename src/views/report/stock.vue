<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="3">
        <el-input placeholder="请输入商品货号" v-model="gitemnum" size="mini" class="cuName"></el-input>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-input placeholder="商品" v-model="gname" size="mini" readonly>
          <template slot="prepend">商品</template>
          <i slot="suffix" class="el-input__icon el-icon-search" @click="showselectGoods=true"></i>
        </el-input>
      </el-col>
      <el-col :sm="3" :xs="24">
        <el-input placeholder="仓库" v-model="whidv" size="mini" readonly>
          <template slot="prepend">仓库</template>
          <i slot="suffix" class="el-input__icon el-icon-search" @click="showSelectWarehouse=true"></i>
        </el-input>
      </el-col>
      <el-col :sm="3" :xs="24">
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
      <el-col :sm="3" :xs="24">
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
          <i class="el-icon-download"></i> 打印
        </a>
        <a href="javascript:" @click="getList('xlsx')" class="export" v-has="373">
          <i class="el-icon-download"></i> 导出
        </a>
        <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="3">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">分类</div>
            <div class="treeBox">
              <!-- 左侧树形菜单 -->
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
      </el-col>
      <el-col :xs="24" :sm="21">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              id="table-data"
              style="width: 100%"
              size="mini"
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column width="55" align="center" property="G_ID" label="ID"></el-table-column>
              <el-table-column align="center" property="G_ITEMNUM" label="货号">
                <template slot="header" slot-scope="scope">
                  <span>货号</span>
                  <span>
                    <i
                      v-if="orderclass==2"
                      class="fa fa-sort-asc bluecolor"
                      @click="setclass(scope.row)"
                    ></i>
                    <i v-else class="fa fa-sort-desc bluecolor" @click="setclass(scope.row)"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" property="G_NAME" label="名称">
                <template slot-scope="scope">
                  <span class="bluecolor" @click="goGoods(scope.row.G_ID)">{{scope.row.G_NAME}}</span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="G_IMAGE" label="图片" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.G_IMAGE">
                  <el-popover
                    placement="right"
                    trigger="hover"
                    v-for="(url,i) in scope.row.G_IMAGE"
                    :key="i"
                  >
                    <img :src="img" class="imgs" />
                    <img
                      slot="reference"
                      :src="`${baseUrl}api${url}`"
                      @mouseover="setimg(`${baseUrl}api${url}`)"
                      @click="open(img)"
                      v-if="i<3"
                      class="tableimg"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column align="center" property="I_QUANTITY" label="数量">
                <template slot="header" slot-scope="scope">
                  <span>数量</span>
                  <span>
                    <i
                      v-if="orderclass1==2"
                      class="fa fa-sort-asc bluecolor"
                      @click="setclass1(scope.row)"
                    ></i>
                    <i v-else class="fa fa-sort-desc bluecolor" @click="setclass1(scope.row)"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                align="center"
                property="I_QUANTITYCANOUT"
                show-overflow-tooltip
                label="可用数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="I_QUANTITYWILLIN"
                show-overflow-tooltip
                label="待入库数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="I_QUANTITYWILLOUT"
                show-overflow-tooltip
                label="待出库数量"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="COLORVALUE"
                show-overflow-tooltip
                label="颜色"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_SPEC"
                show-overflow-tooltip
                label="规格"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_PZYSV"
                show-overflow-tooltip
                label="配置"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_PRUORRECOVERV"
                show-overflow-tooltip
                label="商品来源"
              ></el-table-column>
              <el-table-column
                sortable
                prop="G_CLASSV"
                label="一级分类"
                width="150"
                align="center"
                show-overflow-tooltip
              >
                <template
                  slot-scope="scope"
                >{{scope.row.G_CLASSV?scope.row.G_CLASSV.split('->')[0]:''}}</template>
              </el-table-column>
              <el-table-column sortable prop="G_CLASSV" label="二级分类" width="150" align="center">
                <template
                  slot-scope="scope"
                >{{scope.row.G_CLASSV?scope.row.G_CLASSV.split('->')[1]:''}}</template>
              </el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_STATUSV"
                label="在售状态"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_UNITPRICE"
                label="成本价"
                show-overflow-tooltip
                v-if="vhas"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="cb"
                label="成本总金额"
                width="150"
                show-overflow-tooltip
                v-if="vhas"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_RESERVEPRICE"
                show-overflow-tooltip
                label="销售底价"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_SELLINGPRICE"
                show-overflow-tooltip
                label="销售价"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="xs"
                label="销售总金额"
                show-overflow-tooltip
                width="150"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_RENTPRICE"
                show-overflow-tooltip
                label="月租金"
              ></el-table-column>
              <!-- <el-table-column sortable align="center" property="G_NEWOLD" label="新旧程度"></el-table-column>
      <el-table-column sortable align="center" property="G_CLASSV" label="商品品类"></el-table-column>
              <el-table-column sortable align="center" property="G_CLASSVTREE" label="品类子类"></el-table-column>-->
              <el-table-column
                sortable
                align="center"
                property="G_BRANDV"
                show-overflow-tooltip
                label="品牌"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="G_OIDV"
                show-overflow-tooltip
                label="归属公司"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="WH_NAME"
                show-overflow-tooltip
                label="仓库名称"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="I_CTIME"
                show-overflow-tooltip
                label="创建时间"
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
    <table class="table" border="1" cellspacing="0" width="100%" id="tab">
      <thead>
        <tr>
          <th>序号</th>
          <th>ID</th>
          <th>货号</th>
          <th>名称</th>
          <th>图片</th>
          <th>颜色</th>
          <th>规格</th>
          <th>数量</th>
          <th>可用数量</th>
          <th>待出库数量</th>
          <th>待入库数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,i) in tableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.G_ID}}</td>
          <td>{{item.G_ITEMNUM}}</td>
          <td>{{item.G_NAME}}</td>
          <td>
            <img
              v-for="(url,i) in item.G_IMAGE"
              :key="i"
              :src="`${baseUrl}api${url}`"
              width="40"
              alt
            />
            <td>{{item.COLORVALUE}}</td>
            <td>{{item.G_SPEC}}</td>
            <td>{{item.I_QUANTITY}}</td>
            <td>{{item.I_QUANTITYCANOUT}}</td>
            <td>{{item.I_QUANTITYWILLOUT}}</td>
            <td>{{item.I_QUANTITYWILLIN}}</td>
        </tr>
      </tbody>
    </table>
    <el-dialog
      title="商品"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <selectGoods @emitGoodsData="getGoodsData" :show="false" :distinctwhid="1"></selectGoods>
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
import selectGoods from "@/components/dialog/SelectGoodsSTOK";
import getDate from "@/utils/getDate";
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
      gitemnum: "",
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
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let d = {};
      if (this.gname) d.gname = this.gname;
      if (this.whid) d.whid = this.whid;
      if (this.whoid) d.whoid = this.whoid;
      if (this.gclass) d.gclass = this.gclass;
      if (this.gcolor) d.gcolor = this.gcolor;
      if (this.gitemnum) d.gitemnum = this.gitemnum;
      if (this.order) {
        switch (this.order) {
          case "1":
            d.order = "asc";
            d.orderby = "ccc.g_itemnum";
            break;
          case "2":
            d.order = "desc";
            d.orderby = "ccc.g_itemnum";
            break;
          case "3":
            d.order = "asc";
            d.orderby = "aaa.i_quantity";
            break;
          case "4":
            d.order = "desc";
            d.orderby = "aaa.i_quantity";
            break;
        }
      }
      d.size = this.pageSize;
      d.currentPage = this.currentPage;
      // console.log(this.total);
      if (val == "xlsx") {
        d.size = this.total;
        d.currentPage = 1;
      }
      this.$api.Stock.getInventory(d).then(res => {
        loading.close();
        this.ok = true;
        this.total = res.total;
        res.records.map(item => {
          if (item.G_IMAGE) {
            item.G_IMAGE = item.G_IMAGE.split(",");
          }
          item.cb = (item.I_QUANTITY * item.G_UNITPRICE).toFixed(2);
          item.xs = (item.I_QUANTITY * item.G_SELLINGPRICE).toFixed(2);
          item.I_CTIME = item.I_CTIME.split(".")[0].replace(/T/, " ");
        });
        this.tableData = res.records;
        if (val == "xlsx") {
          setTimeout(() => {
            this.exportTable();
          }, 1500);
        }
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
      e.target.download = "库存.html";
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
          `查库存列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
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
          (!values.every(value => isNaN(value)) &&
            column.property == "I_QUANTITY") ||
          column.property == "I_QUANTITYCANOUT" ||
          column.property == "I_QUANTITYWILLIN" ||
          column.property == "I_QUANTITYWILLOUT" ||
          column.property == "cb" ||
          column.property == "xs"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
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
