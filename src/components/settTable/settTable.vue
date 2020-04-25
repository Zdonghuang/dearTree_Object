<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.img">图片</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gName">商品名称</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gId">货号</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.rdQuantity" disabled>数量</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iQuantity">库存</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iQuantitywillin">待入库库存</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iQuantitywillout">待出库库存</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iUnitprice">成本价</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iReserveprice">最低售价</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.iSellingprice" disabled>销售价</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.sumPrice" disabled>总金额</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.rdDiscount" disabled>折扣</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.Discprice">折后单价</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.sumdisc" disabled>折后总金额</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gColorv">颜色</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gNewoldv">新旧程度</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gSupplierv">供应商</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gBrandv">品牌</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gSpec">规格</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gCuseridv">获客人</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gUnitv">单位</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gCtime">最近销售日期</el-checkbox>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-checkbox v-model="tableStatus.gRemark">备注</el-checkbox>
      </el-col>
    </el-row>
    <el-row align="center" class="dialog-footer">
      <el-col :xs="4">
        <el-button size="mini" type="primary" @click="settTable">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableStatus: JSON.parse(sessionStorage.getItem("tableStatus"))
    };
  },
  methods: {
    settTable() {
      sessionStorage.setItem('tableStatus',JSON.stringify(this.tableStatus));
      this.$emit("settTable");
    }
  }
};
</script>