<template>
  <div>
    <el-form :model="AddUserForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="7">
          <el-form-item label="职员姓名" prop="uName">
            <el-input placeholder="职员姓名" v-model="AddUserForm.uName" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="职员编号" prop="userID">
            <el-input placeholder="职员编号" v-model="AddUserForm.userID" size="small"></el-input>
          </el-form-item>-->
          <el-form-item label="所属地区" prop="uDistrict">
            <el-cascader
              v-model="value"
              :options="options"
              @change="dataget"
              @active-item-change="getchilds"
              :props="{ expandTrigger: 'hover', label:'cAttrvalue', value:'cAttrcode'}"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="地址" prop="uAddr">
            <el-input placeholder="地址" v-model="AddUserForm.uAddr" size="small"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="uPosition">
            <el-input placeholder="职位" v-model="AddUserForm.uPosition" size="small" readonly>
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="opendialog('showgetZWMenu')"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="uIdentity" class="uIdentity">
            <el-input placeholder="身份证号码" v-model="AddUserForm.uIdentity" size="small"></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="uNation">
            <el-input placeholder="民族" v-model="AddUserForm.uNation" size="small" readonly>
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="opendialog('showgetMZMenu')"
              ></i>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="直属上级" prop="userSuperior">
            <el-input placeholder="直属上级" v-model="AddUserForm.userSuperior" size="small">
              <i slot="suffix" class="el-input__icon el-icon-plus"></i>
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>-->
        </el-col>
        <el-col :xs="24" :sm="7">
          <el-form-item label="性别" prop="uGender">
            <el-select
              v-model="AddUserForm.uGender"
              placeholder="请选择性别"
              size="small"
              @change="selectchange"
            >
              <el-option
                v-for="item in XBoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="uOid">
            <el-input
              placeholder="所属部门"
              v-model="AddUserForm.uOid"
              size="small"
              class="icon1"
              readonly
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="opendialog('showgetDicForTreeMenu')"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item label="生日" prop="uBirth">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="AddUserForm.uBirth"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="钉钉" prop="uDingding">
            <el-input placeholder="钉钉" v-model="AddUserForm.uDingding" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="uEmail">
            <el-input placeholder="邮箱" v-model="AddUserForm.uEmail" size="small"></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="uWeixin">
            <el-input placeholder="微信" v-model="AddUserForm.uWeixin" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="助记码" prop="code">
            <el-input placeholder="助记码" v-model="AddUserForm.code" size="small"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="提成系数" prop="commission">
            <el-input placeholder="提成系数" v-model="AddUserForm.commission" size="small"></el-input>
          </el-form-item>-->
        </el-col>
        <el-col :xs="24" :sm="10">
          <el-form-item label="入职日期" prop="uHiredate">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="AddUserForm.uHiredate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="工作日期" prop="uRecruitdate">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="AddUserForm.uRecruitdate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号码" prop="uMobile">
            <el-input placeholder="手机号码" v-model="AddUserForm.uMobile" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="uTel">
            <el-input placeholder="联系电话" v-model="AddUserForm.uTel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="uRemark">
            <el-input placeholder="备注" v-model="AddUserForm.uRemark" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item align="right">
        <el-button @click="buttonFrom">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-dialog title="所属机构" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showgetDicForTreeMenu" width="20%" append-to-body>
        <getDicForTreeMenu @emitparentdata="getparentdata"></getDicForTreeMenu>
      </el-dialog>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-dialog title="职位" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showgetZWMenu" width="20%" append-to-body>
        <getZWMenu @emitparentzw="getparentzw"></getZWMenu>
      </el-dialog>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-dialog title="民族" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showgetMZMenu" width="20%" append-to-body>
        <getMZMenu @emitparentmz="getparentmz"></getMZMenu>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import getDicForTreeMenu from "../dialog/GetDicForTreeMenu";
import getZWMenu from "../dialog/GetZWMenu";
import getMZMenu from "../dialog/GetMZMenu";
export default {
  props: ["updateUser"],
  components: {
    getDicForTreeMenu,
    getZWMenu,
    getMZMenu
  },
  data() {
    return {
      value: [],
      options: [],
      XBoptions: [],
      AddUserForm: {},
      showgetDicForTreeMenu: false,
      showgetZWMenu: false,
      showgetMZMenu: false,
      rules: {
        uName: [{ required: true, message: " ", trigger: "blur" }],
        uAddr: [{ required: true, message: " ", trigger: "blur" }],
        uIdentity: [
          { required: true, message: " ", trigger: "blur" }
        ],
        uDingding: [{ required: true, message: " ", trigger: "blur" }],
        uEmail: [{ required: true, message: " ", trigger: "blur" }],
        uWeixin: [{ required: true, message: " ", trigger: "blur" }],
        uMobile: [{ required: true, message: " ", trigger: "blur" }]
      }
    };
  },
  created() {
    this.gitAddr();
    this.gitXB();
  },
  watch: {
    updateUser: {
      handler: function(a, b) {
        this.AddUserForm = JSON.parse(JSON.stringify(a));
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //显示弹窗
    opendialog(n) {
      this[n] = true;
    },
    //获取部门返显
    getparentdata(e) {
      this.AddUserForm.uOid = e.title;
      this.AddUserForm.uOidid = e.id;
      this.showgetDicForTreeMenu = false;
    },
    //获取职位返显
    getparentzw(e) {
      this.AddUserForm.uPosition = e.title;
      this.AddUserForm.uPositionid = e.id;
      this.showgetZWMenu = false;
    },
    //获取民族返显
    getparentmz(e) {
      this.AddUserForm.uNation = e.title;
      this.AddUserForm.uNationid = e.id;
      this.showgetMZMenu = false;
    },
    //获取性别
    gitXB() {
      let parms = {
        typeCode: "XB"
      };
      this.$api.Common.getAll().then(res=>{
        this.XBoptions = res.data.XB.map(item => {
          return { label: item.cAttrvalue, value: item.cAttrcode };
        });
      })
      
    },
    dataget(val) {
      this.AddUserForm.uDistrict = val[val.length - 1].split(",")[0];
    },
    gitAddr() {
      let parms = {
        typeCode: "XZQH",
        value1: 1
      };
      this.$api.Common.get(parms).then(res => {
        res.data.map((item, i) => {
          item.children = [];
          item.cAttrcode = `${item.cAttrcode},${i}`;
        });
        this.options = res.data;
      });
    },
    getchilds(val) {
      if (val.length === 1) {
        let parms = {
          typeCode: "XZQH",
          attrCodeParent: val[0].split(",")[0]
        };
        this.$api.Common.get(parms).then(res => {
          res.data.map((item, i) => {
            item.children = [];
            item.cAttrcode = `${item.cAttrcode},${i}`;
          });
          this.options[val[0].split(",")[1]].children = res.data;
        });
      }
      if (val.length === 2) {
        let parms = {
          typeCode: "XZQH",
          attrCodeParent: val[1].split(",")[0]
        };
        this.$api.Common.get(parms).then(res => {
          res.data.map((item, i) => {
            item.cAttrcode = `${item.cAttrcode},${i}`;
          });
          this.options[val[0].split(",")[1]].children[
            val[1].split(",")[1]
          ].children = res.data;
        });
      }
    },
    //确定提交
    submitForm(formName) {
      //console.log(this.AddUserForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("emitUserAdd", this.AddUserForm);
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "提交失败"
          });
          return false;
        }
      });
    },
    selectchange() {
      this.$forceUpdate();
    }
    // buttonFrom() {
    //   this.$parent.showAddUser = false;
    //   this.AddUserForm = {
    //   };
    // }
  }
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