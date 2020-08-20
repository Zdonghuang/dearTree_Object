<template>
  <div>
    <el-form :model="AddRoleForm" ref="ruleForm">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="22">
          <el-input placeholder="角色名称" v-model="AddRoleForm.rName" size="mini">
            <template slot="prepend">角色名称</template>
          </el-input>
          <!-- <el-input placeholder="商品分类权限" v-model="AddRoleForm.rName" readonly size="mini" @click="dilog('showSelectGoods')"></el-input>
          <el-input placeholder="仓库权限" v-model="AddRoleForm.rName" readonly size="mini" @click="dilog('showSelectWares')"></el-input>
          <el-input placeholder="客户权限" v-model="AddRoleForm.rName" readonly size="mini" @click="dilog('showSelectClient')"></el-input>-->
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="6">
          <div class="treeTitle">选择角色权限</div>
          <div style="height:500px;overflow-y: scroll;overflow-x: hidden">
            <!-- 左侧树形菜单 -->
            <el-tree
              ref="tree"
              :data="TreeData"
              node-key="pPermission"
              show-checkbox
              accordion
              default-expand-all
              :default-checked-keys="PermissionDef"
              :expand-on-click-node="true"
              :props="defaultProps"
              @check-change="treeNodeRole('JS')"
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="5">
          <div class="treeTitle">选择仓库和库存权限</div>
          <div>
            <!-- 左侧树形菜单 -->
            <el-tree
              ref="CKtree"
              :data="CKTreeData"
              node-key="id"
              show-checkbox
              accordion
              default-expand-all
              :default-checked-keys="CKPermissionDef"
              :expand-on-click-node="true"
              :props="DICdefaultProps"
              lazy
              :load="CKloadNode"
              @check-change="treeNodeRole('CK')"
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="4">
          <div class="treeTitle">选择商品权限</div>
          <div>
            <!-- 左侧树形菜单 -->
            <el-tree
              ref="SPtree"
              :data="SPTreeData"
              node-key="id"
              show-checkbox
              accordion
              default-expand-all
              :default-checked-keys="SPPermissionDef"
              :expand-on-click-node="true"
              :props="DICdefaultProps"
              @check-change="treeNodeRole('SP')"
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="4">
          <div class="treeTitle">选择客户权限</div>
          <div>
            <!-- 左侧树形菜单 -->
            <el-tree
              ref="KHtree"
              :data="KHTreeData"
              node-key="id"
              show-checkbox
              accordion
              default-expand-all
              :default-checked-keys="KHPermissionDef"
              :expand-on-click-node="true"
              :props="DICdefaultProps"
              @check-change="treeNodeRole('KH')"
            ></el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :sm="4">
          <div class="treeTitle">选择单据权限</div>
          <div>
            <el-tree
              ref="DJtree"
              :data="DJTreeData"
              node-key="id"
              show-checkbox
              accordion
              default-expand-all
              :default-checked-keys="DJPermissionDef"
              :expand-on-click-node="true"
              :props="DICdefaultProps"
              @check-change="treeNodeRole('DJ')"
            ></el-tree>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <el-button type="primary" @click="AddRole" size="mini" align="center">保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ["updateRole"],
  data() {
    return {
      TreeData: [],
      CKTreeData: [],
      DJTreeData: [],
      SPTreeData: [],
      KHTreeData: [],
      PermissionDef: [],
      CKPermissionDef: [],
      DJPermissionDef: [],
      SPPermissionDef: [],
      KHPermissionDef: [],
      defaultProps: {
        id: "pPermission",
        label: "pName",
        children: "children"
      },
      DICdefaultProps: {
        children: "childs",
        label: "title",
        id: "id"
      },
      arr: "",
      CKarr: "",
      SParr: "",
      DJarr: "",
      AddRoleForm: {}
    };
  },
  created() {
    if (this.AddRoleForm.rId) {
      this.getPermission();
    }
  },
  watch: {
    updateRole: {
      handler: function(news, old) {
        this.PermissionList();
        this.PermissionDef = [];
        this.CKPermissionDef = [];
        this.SPPermissionDef = [];
        this.KHPermissionDef = [];
        this.DJPermissionDef = [];
        this.AddRoleForm = JSON.parse(JSON.stringify(news));
        if (this.AddRoleForm.rId) {
          this.getPermission();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //添加/修改角色
    AddRole() {
      if (!this.AddRoleForm.rName) {
        this.$message({ message: "请填写角色名称", type: "warning" });
        return false;
      }
      if (this.arr == "[]") {
        this.$message({ message: "请选择角色权限", type: "warning" });
        return false;
      }
      // if (this.CKarr == "[]") {
      //   this.$message({ message: "请选择仓库和库存权限", type: "warning" });
      //   return false;
      // }
      // if (this.DJarr=='') {
      //   this.$message({ message: "请选择单据权限", type: "warning" });
      //   return false;
      // }
      // if (this.SParr == "[]") {
      //   this.$message({ message: "请选择商品和客户权限", type: "warning" });
      //   return false;
      // }
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let param = {
        role: { rName: this.AddRoleForm.rName },
        permissions: this.arr
      };
      if (this.CKarr == "[]" || !this.CKarr || this.CKarr=='null') {
        param.warehouse = "[]";
      } else {
        param.warehouse = this.CKarr;
      }
      if (this.SParr == "[]" || !this.SParr || this.SParr=='null') {
        param.goodsCompanyIds = "[]";
      } else {
        param.goodsCompanyIds = this.SParr;
      }
      if (this.KHarr == "[]"  || !this.KHarr || this.KHarr=='null') {
        param.customerCompanyIds = "[]";
      } else {
        param.customerCompanyIds = this.KHarr;
      }
      if (this.DJarr == "[]"  || !this.DJarr || this.DJarr=='null') {
        param.receiptCompanyIds = "[]";
      } else {
        param.receiptCompanyIds = this.DJarr;
      }

      if (this.AddRoleForm.rId) {
        param["role"]["rId"] = this.AddRoleForm.rId;
      }
      this.$api.Permission.save(param).then(res => {
        loading.close();
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.$emit("emitAddRoleData");
        } else {
          this.$message({
            message: "操作失败"
          });
        }
      });
    },

    //角色权限
    getPermission() {
      if (this.AddRoleForm.rId) {
        let params = {
          roleId: this.AddRoleForm.rId
        };
        this.$api.Permission.get(params).then(res => {
          // console.log(res)
          this.PermissionDef = res.data.permissionList;
          this.SPPermissionDef = res.data.goodsCompanyIdList;
          this.KHPermissionDef = res.data.customerCompanyIdList;
          this.CKPermissionDef = res.data.warehouseList;
          this.DJPermissionDef = res.data.receiptCompanyIdList;
          let newarr = [];
          this.PermissionDef.forEach(item => {
            if (Number(item) > 99) {
              newarr.push(Number(item));
            }
          });
          this.arr = JSON.stringify(newarr);
          this.CKarr = JSON.stringify(this.CKPermissionDef);
          this.SParr = JSON.stringify(this.SPPermissionDef);
          this.KHarr = JSON.stringify(this.KHPermissionDef);
          this.DJarr = JSON.stringify(this.DJPermissionDef);
        });
      } else {
        return false;
      }
    },
    //  updateKeyChildren(key,data){
    //   console.log(key,data)
    // },
    //权限
    PermissionList() {
      // 角色
      this.$api.Permission.list().then(res => {
        let items = res.data;
        // console.log(items);
        this.TreeData = items.map((item, index) => {
          // item.children.map(e => {
          //   if (e.pName.indexOf("编辑") != -1) {
          //     // console.log(e.pId);
          //     // this.updateKeyChildren(e.pId)
          //   }
          // });
            console.log(item)
          if (item.pPermission == "") {
            item.pPermission = index;
            return item;
          }
        });
      });
      //  商品和库存 单据
      this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1, auth: 2 }).then(
        res => {
          let item = res.data;
          this.SPTreeData = item;
          this.KHTreeData = item;
          this.DJTreeData = item;
        }
      );
    },
    //角色节点点击
    treeNodeRole(val) {
      if (val == "JS") {
        let res = this.$refs.tree.getCheckedNodes();
        let arr = [];
        res.forEach(item => {
          let obj = null;
          if (Number(item.pPermission) > 99) {
            obj = Number(item.pPermission);
            arr.push(obj);
          }
        });
        this.arr = JSON.stringify(arr);
      }
      if (val == "CK") {
        let res = this.$refs.CKtree.getCheckedNodes();
        let arr = [];
        res.forEach(item => {
          let obj = null;
          if (Number(item.id) < 1000) {
            obj = Number(item.id);
            arr.push(obj);
          }
        });
        this.CKarr = JSON.stringify(arr);
      }
      if (val == "DJ") {
        let res = this.$refs.DJtree.getCheckedNodes();
        let arr = [];
        res.forEach(item => {
          let obj = null;
          if (Number(item.id)) {
            obj = Number(item.id);
            arr.push(obj);
          }
        });
        this.DJarr = JSON.stringify(arr);
      }
      if (val == "SP") {
        let res = this.$refs.SPtree.getCheckedNodes();
        let arr = [];
        res.forEach(item => {
          let obj = null;
          if (Number(item.id)) {
            obj = Number(item.id);
            arr.push(obj);
          }
        });
        this.SParr = JSON.stringify(arr);
        // console.log(this.SParr);
      }
      if (val == "KH") {
        let res = this.$refs.KHtree.getCheckedNodes();
        let arr = [];
        res.forEach(item => {
          let obj = null;
          if (Number(item.id)) {
            obj = Number(item.id);
            arr.push(obj);
          }
        });
        this.KHarr = JSON.stringify(arr);
        // console.log(this.SParr);
      }
    },
    // 异步树叶子节点懒加载逻辑
    CKloadNode(node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
        this.requestTree(resolve);
      }
      // 其余节点处理
      if (node.level >= 1) {
        this.getCKnodes(node, resolve);
      }
    },
    // 异步加载叶子节点数据函数
    getCKnodes(node, resolve) {
      this.$api.Warehouse.get({ oid: node.data.id, auth: 2 }).then(res => {
        if (res.code == 200) {
          let items = res.data.records;
          let arr = items.map(item => {
            return { id: item.whId, title: item.whName };
          });
          resolve(arr);
        }
      });
    },
    // 首次加载一级节点数据函数
    requestTree(resolve) {
      this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1, auth: 2 }).then(
        res => {
          if (res.code == 200) {
            let items = res.data;
            resolve(items);
          }
        }
      );
    }
  }
};
</script>