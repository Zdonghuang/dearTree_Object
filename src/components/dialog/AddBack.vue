<template>
  <div>
    <el-form :model="AddBackForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="7">
          <el-form-item label="科目名称" prop="cAttrvalue">
            <el-input placeholder="科目名称" v-model="AddBackForm.cAttrvalue" size="small"></el-input>
          </el-form-item>
          <el-form-item label="账户类型" prop="cTypename">
            <el-input placeholder="账户类型" v-model="AddBackForm.cTypename" size="small"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="uIdentity" class="uIdentity">
            <el-input placeholder="身份证号码" v-model="AddBackForm.uIdentity" size="small"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="uIdentity" class="uIdentity">
            <el-input placeholder="身份证号码" v-model="AddBackForm.uIdentity" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="7">
          <el-form-item label="性别" prop="uGender">
            <el-input placeholder="性别" v-model="AddBackForm.uDingding" size="small"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="uBirth">
            <el-input placeholder="生日" v-model="AddBackForm.uDingding" size="small"></el-input>
          </el-form-item>
          <el-form-item label="钉钉" prop="uDingding">
            <el-input placeholder="钉钉" v-model="AddBackForm.uDingding" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="uEmail">
            <el-input placeholder="邮箱" v-model="AddBackForm.uEmail" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary">确 定</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ["updateBack"],
  data() {
    return {
      AddBackForm: {},
      rules: {
        uName: [
          { required: true, message: " ", trigger: "blur" }
        ],
        uAddr: [
          { required: true, message: " ", trigger: "blur" }
        ],
        uIdentity: [
          { required: true, message: " ", trigger: "blur" }
        ],
        uDingding: [
          { required: true, message: " ", trigger: "blur" }
        ],
        uEmail: [
          { required: true, message: " ", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //this.gitTree();
  },
  watch: {
    updateBack: {
      handler: function(a, b) {
        this.AddBackForm = JSON.parse(JSON.stringify(a));
      },
      deep: true,
      immediate: true
    }
  },
  methods: {}
};
</script>

<style>
.IDcard label {
  width: 86px !important;
}
.IDcard .el-form-item__content {
  margin-left: 86px !important;
}
</style>