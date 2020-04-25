<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" align="left">
        <el-input placeholder="请输入仓库名称" v-model="form.name" size="mini">
          <template slot="prepend">仓库名称</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" align="left">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        <!-- <el-button type="warning" size="mini" icon="el-icon-plus" @click="openwh">新增</el-button> -->
      </el-col>
    </el-row>
    <el-table
      :data="warehouseTableData"
      border
      highlight-current-row
      style="width: 100%"
      size="mini"
      height="300px"
      @row-click="rowclick"
      @row-dblclick="dbrowclick"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column sortable property="whCode" label="仓库编码"></el-table-column>
      <el-table-column sortable property="whName" label="仓库全名"></el-table-column>
      <el-table-column sortable property="whAddr" label="仓库全地址"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paginationBox">
      <el-col :xs="24" :sm="20">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100,total]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button size="mini" @click="dialogBtn('1')">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogBtn('2')">确 定</el-button>
      </el-col>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
export default {
  props: ["oid", "hasdef", "wid"],
  data() {
    return {
      thisRowData: "",
      form: {
        name: "",
        oid: "",
        wid: ""
      },
      warehouseTableData: [],
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.getWareHouse();
  },
  watch: {
    oid: {
      handler: function(news, old) {
        this.form.oid = news;
        this.getWareHouse();
      },
      deep: true,
      immediate: true
    },
    wid: {
      handler: function(news, old) {
        this.form.wid = news;
        this.getWareHouse();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 查询
    search() {
      let params = {};
      if (this.form.name) {
        params.name = this.form.name;
      }
      this.getWareHouse(params);
    },
    getWareHouse(val) {
      let params = {};
      if (val) {
        params = val;
      }
      if (this.form.oid) {
        params.oid = this.form.oid;
      }
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      this.$api.Warehouse.get(params).then(res => {
        if (res.data) {
          let items = res.data.records;
          if (this.$props.hasdef) {
            let arr = items.filter(item => {
              return item.whOid != this.$props.hasdef;
            });
            this.warehouseTableData = arr;
            this.total = this.warehouseTableData.length;
          } else if (this.form.wid) {
            let arr = items.filter(item => {
              return item.whId != this.form.wid;
            });
            this.warehouseTableData = arr;
            this.total = this.warehouseTableData.length;
          } else {
            this.warehouseTableData = items;
            this.total = res.data.total;
          }
          this.currentPage = res.data.current;
        }
      });
    },
    openwh() {
      this.$emit("openwh");
    },
    rowclick(row, column, event) {
      this.thisRowData = row;
    },
    dbrowclick(row, column, event) {
      this.thisRowData = row;
      this.dialogBtn("2");
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitWarehouseData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitWarehouseData", this.thisRowData);
        } else {
          this.$message({
            message: "请选择一行数据",
            type: "warning"
          });
        }
      }
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getWareHouse();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getWareHouse();
    }
  }
};
</script>
<style scoped>
</style>