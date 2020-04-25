<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="24" :xs="24">
        <el-input size="small" v-model="dic" :disabled="true">
          <template slot="prepend">所属机构</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <!-- 左侧树形菜单 -->
        <el-tree
          :data="TreeData"
          node-key="index"
          accordion
          :expand-on-click-node="true"
          :props="defaultProps"
          @node-click="treeNodeClick"
        ></el-tree>
      </el-col>
    </el-row>
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
      dic: "",
      data:[],
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      }
    };
  },
  created() {
    this.gitTree();
    console.log(132)
  },
  methods: {
    // 所属行业
    gitTree() {
      let parms = {
        typeCode: "ZZJG",
        value1:'1'
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    treeNodeClick(data) {
      this.dic = data.title;
      this.data = data;
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitGuestData", false);
      }
      if (val === "2") {
        if(this.dic != ''){
          this.$emit("emitGuestData", this.data);
        }
        
      }
    }
  }
};
</script>
      