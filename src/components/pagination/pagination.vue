<template>
  <!-- 分页 -->
  <div class="paginationBox">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    currentPages: {
      type: Number,
      default: 1
    },
    totals: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数
    };
  },
  created() {
    this.currentPage = this.currentPages
    this.total = this.totals
  },
  methods: {
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size
      this.$emit("pSizeChange", this.pageSize);
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage 
      this.$emit("pCurrentChange", this.currentPage);
    }
  }
};
</script>
<style>
.paginationBox {
  text-align: center;
  padding: 20px 0;
}
.dialog-footer {
  text-align: right;
}
</style>