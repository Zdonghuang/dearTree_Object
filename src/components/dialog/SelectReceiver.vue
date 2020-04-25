<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系人" v-model="form.user" size="small"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系电话" v-model="form.userphone" size="small">
          <template slot="prepend">收货人</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="receiverTableData"
      border
      highlight-current-row
      style="width: 100%"
      size="mini"
      height="300px"
      @row-click="rowclick"
      @row-dblclick="dbrowclick"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="50" align="center">
        <template slot="header">
          <i class="fa fa-cog setting" ></i>
        </template>
      </el-table-column>
      <el-table-column sortable property="contact" label="联系人"></el-table-column>
      <el-table-column sortable property="tel" label="联系电话"></el-table-column>
      <el-table-column sortable property="address" label="收货地址" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :currentPages="1" :totals="receiverTableData.length"></pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogBtn('1')">取 消</el-button>
      <el-button type="primary" @click="dialogBtn('2')">确 定</el-button>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      form: {
        userphone: "",
        user: ""
      },
      thisRowData: "",
      receiverTableData: [
        {
          contact: "张一",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        },
        {
          contact: "张二",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        },
        {
          contact: "张三",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        },
        {
          contact: "张四",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        },
        {
          contact: "张五",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        },
        {
          contact: "张六",
          tel: "13122223333",
          address: "北京朝阳区安立路甲56号3层306"
        }
      ]
    };
  },
  created() {
  },
  methods: {
    rowclick(row, column, event) {
      this.thisRowData = row;
    },
    dbrowclick(row, column, event) {
      this.thisRowData = row;
      this.dialogBtn('2')
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitReceiverData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitReceiverData", this.thisRowData);
        } else {
          this.$message({
            message: "请选择一行数据",
            type: "warning"
          });
        }
      }
    }
  }
};
</script>
<style scoped>
</style>