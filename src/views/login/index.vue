<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="off"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">第二树 COS系统</h3>
      </div>

      <el-form-item prop="phone" style="margin-bottom:20px;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          tabindex="1"
          maxlength="11"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item prop="password" style="margin-bottom:20px;">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          :type="passType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="new-password"
          @keyup.enter.native="handleLogin"
          @input="passType='password'"
        />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>-->
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login</el-button>
    </el-form>
    <a
      href="http://39.105.134.145:9081/api/file/911f11b8-0707-4bf9-a310-344bf67978c3.exe"
      class="download"
    >本系统使用谷歌浏览，点击下载</a>
  </div>
</template>

<script>
import { validPhone } from "@/utils/validate";
import { MessageBox } from "element-ui";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度至少6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        phone: "",
        password: ""
      },
      passType: "text",
      loginRules: {
        phone: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs.phone.focus();
    this.$refs.password.value = "";
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(res => {
              let tableStatus = {
                img: true,
                gName: true,
                gId: true,
                rdQuantity: true,
                iQuantity: true,
                iQuantitywillin: true,
                iQuantitywillout: true,
                iUnitprice: true,
                iReserveprice: true,
                iSellingprice: true,
                sumPrice: true,
                rdDiscount: true,
                Discprice: true,
                sumdisc: true,
                gColorv: true,
                gNewoldv: true,
                gSupplierv: true,
                gBrandv: true,
                gSpec: true,
                gCuseridv: true,
                gUnitv: true,
                gCtime: true,
                gRemark: true,
                name: true,
                itemnum: true,
                color: true,
                size: true,
                unit: true,
                num: true,
                price: true,
                money: true,
                remark: true
              };
              sessionStorage.setItem(
                "tableStatus",
                JSON.stringify(tableStatus)
              );
              if (res == "firstLogin") {
                this.$router.push({ path: "/PersonalCenter" });
                setTimeout(function() {
                  MessageBox.alert("为了您的安全,请修改密码", {
                    confirmButtonText: "确定",
                    type: "warning"
                  });
                }, 1000);
              } else {
                this.$router.push({ path: this.redirect || "/" });
              }
              this.loading = false;
              // 获取字典数据
              // this.$store.dispatch('dic/getDicts')
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.download {
  text-decoration: underline;
  color: #409eff;
  font-size: 18px;
  position: absolute;
  bottom: 20px;
  right: 40px;
}
</style>
