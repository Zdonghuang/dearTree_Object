<template>
  <div>
    <el-form :model="AddBankAccountForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="所属公司" prop="cValue1">
            <el-select
              v-model="AddBankAccountForm.cValue1"
              placeholder="请选择所属公司"
              size="mini"
              @change="selectchange()"
            >
              <el-option
                v-for="item in GSoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户类型" prop="cAttrcodeparent">
            <el-select
              v-model="AddBankAccountForm.cAttrcodeparent"
              placeholder="请选择账户类型"
              size="small"
              @change="change"
              :disabled="$props.cid?true:false"
            >
              <el-option label="现金" value="1001"></el-option>
              <el-option label="微信" value="1005"></el-option>
              <el-option label="易宝" value="1006"></el-option>
              <el-option label="银行卡" value="1003"></el-option>
              <el-option label="支付宝" value="1004"></el-option>
              <el-option label="银行存款" value="1002"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户编号">
            <el-input
              placeholder="账户编号"
              v-model="AddBankAccountForm.cAttrcode"
              size="small"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="期初" prop="cValue4">
            <el-input
              placeholder="期初"
              @change="setnum()"
              v-model="AddBankAccountForm.cValue4"
              size="small"
              :disabled="disable"
            ></el-input>
          </el-form-item>
          <el-form-item label="账户名称" prop="cAttrvalue">
            <el-input placeholder="账户名称" v-model="AddBankAccountForm.cAttrvalue" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="开户行账号" prop="cValue3">
            <el-input placeholder="开户行账号" v-model="AddBankAccountForm.cValue3" size="small"></el-input>
          </el-form-item>

          <el-form-item label="开户行名称" prop="cValue6">
            <el-input placeholder="开户行名称" v-model="AddBankAccountForm.cValue6" size="small"></el-input>
          </el-form-item>
          <el-form-item label="是否收款" prop="cValue2">
            <el-radio-group v-model="AddBankAccountForm.cValue2">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="cRemark">
            <el-input placeholder="备注" v-model="AddBankAccountForm.cRemark" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <br />
    <el-row>
      <el-col align="center">
        <el-button type="primary" size="mini" @click="submint('ruleForm')">{{$props.cid?'修改':'保存'}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    cid: {
      default: 0
    }
  },
  data() {
    return {
      GSoptions: [],
      AddBankAccountForm: {
        cStatus: 1,
        cSort: 1,
        cTypecode: "YHZH",
        cTypename: "财务科目",
        cAttrcode: 0,
        cRemark: "",
        cAttrcodeparent: "1002",
        cValue1: this.$storage.companyId,
        cValue2: "否",
        cValue7: ""
      },
      rules: {
        cValue2: [{ required: true, message: " ", trigger: "blur" }],
        cValue3: [{ required: true, message: " ", trigger: "blur" }],
        cValue6: [{ required: true, message: " ", trigger: "blur" }],
        cValue4: [{ required: true, message: " ", trigger: "blur" }],
        cAttrvalue: [{ required: true, message: " ", trigger: "blur" }]
      },
      disable: false
    };
  },
  created() {
    if (!this.$props.cid) {
      this.getcode();
    } else {
      this.getbank();
    }
    this.getGoodsGS();
  },
  methods: {
    getGoodsGS() {
      let parms = {
        typeCode: "ZZJG",
        value1: 1
      };
      this.$api.Common.get(parms).then(res => {
        this.GSoptions = res.data.map(item => {
          if (item.cAttrcode == this.AddBankAccountForm.cValue1) {
            this.AddBankAccountForm.cValue7 = item.cAttrvalue;
          }
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    getbank() {
      let parmas = {};
      parmas.attrCode = this.$props.cid;
      parmas.typeCode = "YHZH";
      this.$api.Common.get(parmas).then(res => {
        this.AddBankAccountForm = res.data[0];
        if (this.AddBankAccountForm.cValue4) {
        }
      });
    },
    selectchange() {
      this.GSoptions.map(item => {
        if (item.value == this.AddBankAccountForm.cValue1) {
          this.AddBankAccountForm.cValue7 = item.label;
        }
      });
      this.$forceUpdate();
    },
    change() {
      this.getcode();
    },
    setnum() {
      if (isNaN(this.AddBankAccountForm.cValue4)) {
        this.AddBankAccountForm.cValue4 = "";
        return this.$message.error("请输入数字");
      }
    },
    getcode() {
      let params = {
        typecode: "YHZH",
        attrcodeparent: this.AddBankAccountForm.cAttrcodeparent
      };
      this.$api.Financialsettle.getcode(params).then(res => {
        if (res.data) {
          this.AddBankAccountForm.cAttrcode = res.data;
        }
      });
    },
    submint(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          this.$emit("addBank", this.AddBankAccountForm);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.uploadtxt {
  width: 180px;
  text-align: center;
  padding-top: 5px;
}
</style>