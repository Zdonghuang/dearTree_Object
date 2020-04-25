<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left"></el-col>
      <el-col :xs="24" :sm="16" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="mini" icon="el-icon-refresh">刷新</el-button>
          <el-button size="mini" icon="el-icon-printer">打印</el-button>
          <el-button size="mini" icon="el-icon-download">导出</el-button>
          <el-button size="mini" icon="el-icon-edit">批量修改</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="商品名称/货号/条码/规格/型号 " v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="品牌" v-model="form.warehouse" size="mini">
          <template slot="prepend">品牌</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">
              商品分类
              <div class="treeTools">
                <i class="el-icon-circle-plus-outline"></i>
                <i class="el-icon-edit-outline"></i>
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="treeBox">
              <!-- 左侧树形菜单 -->
              <el-tree
                :data="TreeData"
                show-checkbox
                node-key="index"
                accordion
                :expand-on-click-node="true"
                :props="defaultProps"
                @node-click="treeNodeClick"
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="20">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="TableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              border
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              size="mini"
              :show-summary="true"
              :summary-method="getSummaries"
              sum-text="合计:"
            >
              <el-table-column  type="index" width="50" align="center">
                <template slot="header">
                  <i class="fa fa-cog setting"></i>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column sortable prop="gItemnum" label="商品编码" width="120" align="center" ></el-table-column>
              <el-table-column sortable
                
                prop="gName"
                label="商品名称"
                width="150"
                align="left"
                
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable prop="unitValue" label="单位" width="80" align="center"></el-table-column>
              <el-table-column sortable prop="gBarcode" label="条形码" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="gItemnum" label="单位比例" width="120" align="center" ></el-table-column>
              <el-table-column sortable prop="colorValue" label="颜色" width="100" align="center"></el-table-column>
              <el-table-column sortable prop="supplierValue" label="成本价格" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="gClass" label="最近进价" width="100" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="预设进价" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="批发价" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="最低折扣(%)" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="最低售价" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="零售价" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="nwValue" label="规格" width="120" align="center"></el-table-column>
              <el-table-column sortable prop="unitValue" label="单位" width="80" align="center"></el-table-column>
              <el-table-column sortable prop="unitValue" label="品牌" width="80" align="center"></el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="TableData.length"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      TableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //    每页的数据
      form: {}
    };
  },
  created() {
    this.gitTree();
    this.gitGoodsTable();
  },
  methods: {
    // 树形菜单
    gitTree() {
      let parms = {
        typeCode: "SPFL"
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      // console.log(data);
    },
    // 商品列表
    gitGoodsTable() {
      this.$api.Goods.get().then(res => {
        let item = res.data;
        this.TableData = item.records;
        this.currentPage = item.current;
        this.pageSize = item.size;
      });
    },
    // 查看点击
    seeRowClick(row) {
      // console.log(row);
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
        if (column.property === "gClass") {
          values = data.map(item => Number(item.gClass));
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>

<style scoped>
</style>