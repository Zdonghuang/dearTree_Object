<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请输入职员名称" v-model="form.searchText" size="mini"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select v-model="form.options" placeholder="请选择" size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-checkbox v-model="checked" style="padding-top:10px" size="mini">显示停用</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button type="warning" size="mini" icon="el-icon-plus">新增权限</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="mini" icon="el-icon-printer">打印</el-button>
          <el-button size="mini" icon="el-icon-download">导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">
              所属部门
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
                highlight-current
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
              height="600"
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              size="mini"
              :show-summary="true"
              :summary-method="getSummaries"
              sum-text="合计:"
              header-cell-class-name="thbgc"
            >
              <el-table-column type="index" width="50" align="center">
                <template slot="header">
                  <i class="fa fa-cog setting"></i>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                  <el-button
                    @click="seeRowClick(scope.row)"
                    icon="el-icon-view"
                    type="text"
                    size="mini"
                  >修改</el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit-outline">删除</el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit-outline">停用</el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit-outline">解锁</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable prop="gName" label="职员" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column sortable
                prop="statusValue"
                label="岗位"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="gItemnum"
                label="部门"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="brandValue"
                label="仓库权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="gBarcode"
                label="调拨权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="specValue"
                label="部门权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="supplierValue"
                label="往来单位权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="unitValue"
                label="商品权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable
                prop="gClass"
                label="现金银行权限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
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
  inject: ["reload"],
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
      options: [
        {
          value: "1",
          label: "普通操作员"
        },
        {
          value: "2",
          label: "拣货员"
        },
        {
          value: "3",
          label: "全部"
        }
      ],
      form: {
        options: []
      }
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
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
</style>