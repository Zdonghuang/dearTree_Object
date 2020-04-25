<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="24" :xs="24">
        <el-input size="small" v-model="dic" :disabled="true">
          <template slot="prepend">组织机构</template>
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
      <el-button @click="dialogBtn('cencel')">取 消</el-button>
      <el-button type="primary" @click="dialogBtn('define')">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dic: "",
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      data: []
    };
  },
  created() {
    this.gitTree();
  },
  methods: {
    // 组织部门
    gitTree() {
      let parms = {
        typeCode: "ZZJG",
        value1: "1"
      };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData = item;
      });
    },
    treeNodeClick(data) {
      if (data.id != 1) {
        this.dic = data.title;
        this.data = data;
      } else {
        this.dic = '';
        this.data = '';
      }
    },
    dialogBtn(val) {
      if (val === "cancel") {
        this.$emit("emitparentdata", '');
      }
      if (val === "define" && this.data != '') {
        this.$emit("emitparentdata", this.data);
      }else{
        this.$emit("emitparentdata", '');
      }
    }
  }
};
</script>
      