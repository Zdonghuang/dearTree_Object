<template>
  <div>
    <el-form :model="AddWarehouseForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="仓库名称" prop="whName">
            <el-input placeholder="请输入仓库名称" v-model="AddWarehouseForm.whName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="whContact">
            <el-input placeholder="请输入联系人" v-model="AddWarehouseForm.whContact" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="whMobile">
            <el-input placeholder="请输入联系电话" v-model="AddWarehouseForm.whMobile" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="组织机构" prop="whOid">
            <el-select
              v-model="AddWarehouseForm.whOid"
              placeholder="请选择公司"
              size="mini"
              @change="selectchange"
            >
              <el-option
                v-for="item in TYoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库编号" prop="whCode">
            <el-input
              placeholder="根据组织机构自动生成"
              v-model="AddWarehouseForm.whCode"
              size="mini"
              readonly
            ></el-input>
          </el-form-item>

          <el-form-item label="地址" prop="whAddr">
            <el-input placeholder="地址" v-model="AddWarehouseForm.whAddr" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <el-button type="primary" @click="AddWarehouse" size="mini" align="center">保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ["updateWarehose"],
  data() {
    return {
      TYoptions: [],
      AddWarehouseForm: {
        whCode: "",
        whOid: this.$storage.companyId
      },
      rules: {
        warehouseName: [{ required: true, message: " ", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getTree();
    if(!this.AddWarehouseForm.whId){
      this.getWaresval()
      this.getWarehouseCode()
    }
  },
  watch: {
    updateWarehose: {
      handler: function(a, b) {
        if (a&&a.whOid) {
          this.AddWarehouseForm = JSON.parse(JSON.stringify(a));
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 树形菜单
    getDicForTreeMenu() {
      this.showgetDicForTreeMenu = true;
    },
    //获取分类
    getTree() {
      let parms = {
        typeCode: "ZZJG",
        value1: "1"
      };
      this.$api.Common.getDIC(parms).then(res => {
        this.TYoptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      });
    },
    //添加/修改
    AddWarehouse() {
      if(!this.AddWarehouseForm.whName) return this.$message.warning('请输入仓库名称')
      if(!this.AddWarehouseForm.whContact) return this.$message.warning('请输入联系人')
      if(!this.AddWarehouseForm.whMobile) return this.$message.warning('请输入联系电话')
      if(!this.AddWarehouseForm.whAddr) return this.$message.warning('请输入仓库地址')
      this.$emit("emitWareAdd", this.AddWarehouseForm);
    },
    selectchange() {
      this.getWaresval()
      this.$forceUpdate();
    },
    getWaresval() {
      let parms = {
        typeCode: "ZZJG",
        attrCode: this.AddWarehouseForm.whOid
      };
      this.$api.Common.get(parms).then(res => {
        this.AddWarehouseForm.cValue3 = res.data[0].cValue3;
        this.getWarehouseCode();
      });
    },

    getWarehouseCode() {
      let param = {
        oidv: this.AddWarehouseForm.cValue3
      };
      this.$api.Warehouse.code(param).then(res => {
        this.AddWarehouseForm.whCode = res;
      });
    }
  }
};
</script>