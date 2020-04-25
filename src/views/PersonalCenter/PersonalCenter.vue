<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div style="padding:20px 30px">
        <el-form label-width="100px">
          <el-form-item label="姓名：">{{ $storage.userName }}</el-form-item>
          <el-form-item label="所属公司：">{{ $storage.companyName }}</el-form-item>
          <el-form-item label="所属部门：">{{ $storage.dept }}</el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账户设置</span>
      </div>
      <div style="padding:20px 30px">
        <el-form label-width="100px">
          <el-form-item label="手机号：">{{ Tel }}</el-form-item>
          <el-form-item label="密码：">
            <div style="width:200px;float:left">******</div>
            <el-button size="mini" @click="showDialog('form1')">修改</el-button>
          </el-form-item>
          <el-form-item label="开户行名称：">
            <div style="width:200px;float:left">{{ Bankname }}</div>
            <el-button size="mini" @click="showDialog('form2')">修改</el-button>
          </el-form-item>
          <el-form-item label="开户行账号：">{{ Bankaccount }}</el-form-item>
          <el-form-item label="性别：">
            <div style="width:200px;float:left">{{ Gender==1?'男':'女' }}</div>
            <el-button size="mini" @click="showDialog('form3')">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="修改银行账号"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="form2"
      width="30%"
    >
      <el-form ref="form2" :model="form" :rules="rules" label-width="120px" class="updateform">
        <el-form-item label="开户行名称：" prop="uBankname">
          <el-input
            v-model="form.uBankname"
            size="mini"
            type="text"
            autocomplete="off"
            style="width:80%"
            placeholder="请输入开户行名称"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行账号：" prop="uBankaccount">
          <el-input
            v-model="form.uBankaccount"
            size="mini"
            type="text"
            style="width:80%"
            placeholder="请输入开户行账号"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center;display:block;padding:20px;margin-left:-120px">
            <el-button type="primary" @click="onSubmit('form2')" size="mini">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改性别"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="form3"
      width="30%"
    >
      <el-form ref="form3" :model="form" :rules="rules" label-width="120px" class="updateform">
        <el-form-item label="性别：" prop="Gender">
          <el-radio-group v-model="form.uGender">
            <el-radio :label="1" border size="mini">男</el-radio>
            <el-radio :label="2" border size="mini">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center;display:block;padding:20px;margin-left:-120px">
            <el-button type="primary" @click="onSubmit('form3')" size="mini">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="form1"
      width="30%"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="120px" class="updateform">
        <!-- <el-form-item label="当前密码：" prop="Pwd">
          <el-input
            v-model="form.Pwd"
            size="mini"
            type="password"
            style="width:80%"
            placeholder="请输入当前密码（长度在 6到 18 个字符）"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="新密码：" prop="pass">
          <el-input
            v-model="form.pass"
            size="mini"
            type="password"
            autocomplete="off"
            style="width:80%"
            placeholder="请输入新密码（长度在 6到 18 个字符）"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input
            v-model="form.checkPass"
            size="mini"
            type="password"
            autocomplete="off"
            style="width:80%"
            placeholder="请确认密码（长度在 6到 18 个字符）"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <div style="text-align:center;display:block;padding:20px;margin-left:-120px">
            <el-button type="primary" @click="onSubmit('form1')" size="mini">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { removeToken } from "@/utils/auth";
export default {
  inject: ["reload"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度在 6到 18 个字符"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form1.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度在 6到 18 个字符"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form3: false,
      form1: false,
      form2: false,
      form: {
        Tel: "",
        Pwd: "",
        pass: "",
        checkPass: "",
        uGender: 1,
        uBankname: "",
        uBankaccount: ""
      },
      Tel: "",
      Bankname: "",
      Bankaccount: "",
      Gender: "",
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        uBankname: [
          { required: true, message: "请输入银行名称", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ],
        uBankaccount: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          { min: 16, max: 19, message: "长度 16-19 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.$api.User.get({ uid: this.$storage.userId }).then(res => {
      if (res.code == 200) {
        let item = res.data.records[0];
        this.Tel = item.uMobile;
        this.uGender = item.uGender;
        this.Gender = item.uGender;
        this.Bankname = item.uBankname;
        this.Bankaccount = item.uBankaccount;
      }
    });
  },
  methods: {
    showDialog(val) {
      this[val] = true;
      if (val == "form3") {
        this.form.uGender = this.Gender;
      }
      if (val == "form2") {
        this.form.uBankname = this.Bankname;
        this.form.uBankaccount = this.Bankaccount;
      }
    },
    onSubmit(val) {
      this.$refs[val].validate(valid => {
        if (valid) {
          let parma = {
            uId: this.$storage.userId,
            uGender: this.Gender
          };
          if (val == "form1") {
            parma.uPasswd = this.form.pass;
          }
          if (val == "form2") {
            if (
              this.form.uBankname == this.Bankname &&
              this.form.uBankaccount == this.Bankaccount
            ) {
               this.$message({
                type: "error",
                message: "当前银行名称和账号没有任何修改!"
              });
              return false;
            }
            parma.uBankname = this.form.uBankname;
            parma.uBankaccount = this.form.uBankaccount;
          }
          if (val == "form3") {
            if (this.form.uGender == this.Gender) {
              this.$message({
                type: "error",
                message: "请选择修改的性别!"
              });
              return false;
            }
            parma.uGender = this.form.uGender;
          }
          this.$api.User.update(parma).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              if (val == "form1") {
                this.$confirm("请重新登录", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  sessionStorage.removeItem("state");
                  removeToken();
                  this.$router.push("/login");
                  window.location.reload();
                });
              }
              this[val] = false;
              this.reload();
            } else {
              this.$message({
                type: "error",
                message: res.err
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped >
.updateform .el-form-item {
  margin-bottom: 12px;
}
</stylescoped>