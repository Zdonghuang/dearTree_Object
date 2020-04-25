<template>
  <div class="dialogtBox">
    <el-form :model="addClientForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="22">
          <el-form-item label="归属公司">
            <el-select
              v-model="addClientForm.cuOid"
              placeholder="请选择归属公司"
              size="mini"
              @change="selectchange"
            >
              <el-option
                v-for="item in GSoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="cuName">
            <el-input placeholder="请输入名称" v-model="addClientForm.cuName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="cuContact">
            <el-input placeholder="请输入联系人" v-model="addClientForm.cuContact" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="cuMobile">
            <el-input placeholder="请输入联系电话" v-model="addClientForm.cuMobile" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-row>
              <el-col :xs="24" :sm="8" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuProvince"
                  placeholder="请选择省"
                  size="mini"
                  filterable
                  @change="cuProvince"
                >
                  <el-option
                    v-for="item in Poptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="8" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuCity"
                  placeholder="请选择市"
                  size="mini"
                  @change="cuCity"
                >
                  <el-option
                    v-for="item in Coptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="8" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuDistrict"
                  placeholder="请选择区"
                  size="mini"
                  @change="selectchange"
                >
                  <el-option
                    v-for="item in Doptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="开票名称及户名" prop="cuRemark">
            <el-input placeholder="开票名称及户名" v-model="addClientForm.cuRemark" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="地址及电话" prop="cuBankcardnum">
            <el-input placeholder="地址及电话" v-model="addClientForm.cuBankcardnum" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="cuTaxnum">
            <el-input placeholder="纳税人识别号" v-model="addClientForm.cuTaxnum" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号" prop="cuBankname">
            <el-input placeholder="开户行及账号" v-model="addClientForm.cuBankname" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="经手人" prop="cuHandmanvalue">
            <el-input
              placeholder="请选择经手人"
              v-model="addClientForm.cuHandmanvalue"
              size="mini"
              readonly
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="opendialog('showSelectUser')"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini" align="center">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="经手人选择" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectUser" width="60%" append-to-body>
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
  </div>
</template>
<script>
import selectUser from "@/components/dialog/SelectUser";
export default {
  props: ["updateClient"],
  components: {
    selectUser
  },
  data() {
    return {
      gongsi: "",
      showSelectUser: false,
      KHHYoptions: [],
      KHLYoptions: [],
      KHFLoptions: [],
      Poptions: [],
      Doptions: [],
      Coptions: [],
      cuProvince1: 0,
      cuCity1: 0,
      cuDistrict1: 0,
      imageUrl: "",
      GSoptions: [],
      addClientForm: {
        cuDiv: "2",
        cuOidvalue: "",
        cuOid: `${this.$storage.companyId}`
      },
      rules: {
        cuName: [{ required: true, message: " ", trigger: "blur" }],
        cuContact: [{ required: true, message: " ", trigger: "blur" }],
        cuMobile: [{ required: true, message: " ", trigger: "blur" }]
      },
      options: [],
      cascaderAddr: "",
      value: [],
      tag: "", //区
      ContactTableData: []
    };
  },
  created() {
    if (this.addClientForm.cuId) {
      this.Contact(this.addClientForm.cuId);
    }
    this.getClierKHLY();
    this.getClierKHHY();
    this.getClierKHFL();
    this.Region();
    this.getGoodsGS();
  },
  watch: {
    updateClient: {
      handler: function(a, b) {
        this.cuProvince1 = a.cuProvince;
        this.cuCity1 = a.cuCity;
        this.cuDistrict1 = a.cuDistrict;
        if (a.cuId) {
          this.addClientForm = JSON.parse(JSON.stringify(a));
          if(this.addClientForm.cuOid)this.addClientForm.cuOid += "";
          if (this.addClientForm.cuIndustry&&this.addClientForm.cuIndustry != 0) {
            this.addClientForm.cuIndustry += "";
          } else {
            this.addClientForm.cuIndustry = "";
          }
          if (this.addClientForm.cuOrigin&&this.addClientForm.cuOrigin != 0) {
            this.addClientForm.cuOrigin += "";
          } else {
            this.addClientForm.cuOrigin = "";
          }
          if (this.cuProvince1&&this.cuProvince1 != "0") {
            this.addClientForm.cuProvince = `${this.cuProvince1}`;
            this.cuProvince();
          } else {
            this.addClientForm.cuProvince = "";
            this.cuProvince();
          }
        } else {
          this.Coptions = [];
          this.Doptions = [];
          this.getUserOval();
          this.addClientForm.cuHandman = JSON.parse(
            sessionStorage.getItem("state")
          ).userId;
          this.addClientForm.cuHandmanvalue = JSON.parse(
            sessionStorage.getItem("state")
          ).userName;
        }
        this.Contact(this.addClientForm.cuId);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updata() {
      this.$forceUpdate();
    },
    //根据用户确定部门
    getUserOval() {
      let parms = {
        typeCode: "ZZJG",
        attrCode: this.$storage.companyId
      };
      this.$api.Common.get(parms).then(res => {
        this.gongsi = res.data[0].cAttrvalue;
      });
    },
    //省市区
    Region() {
      let parms = {
        typeCode: "XZQH",
        value1: 1
      };
      this.$api.Common.get(parms).then(res => {
        this.Poptions = res.data.map((item, i) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    getGoodsGS() {
      let parms = {
        typeCode: "ZZJG",
        value1: 1
      };
      this.$api.Common.get(parms).then(res => {
        this.GSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    cuProvince() {
      let parms = {
        typeCode: "XZQH",
        attrCodeParent: this.addClientForm.cuProvince
      };
      this.addClientForm.cuCity = "";
      this.addClientForm.cuDistrict = "";
      if (this.cuCity1) {
        this.addClientForm.cuCity = `${this.cuCity1}`;
        this.cuCity1 = "";
        this.cuCity();
      }
      this.$api.Common.get(parms).then(res => {
        this.Coptions = res.data.map((item, i) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
      this.$forceUpdate();
    },
    cuCity() {
      let parms = {
        typeCode: "XZQH",
        attrCodeParent: this.addClientForm.cuCity
      };
      this.addClientForm.cuDistrict = "";
      if (this.cuDistrict1) {
        this.addClientForm.cuDistrict = `${this.cuDistrict1}`;
        this.cuDistrict1 = "";
      }
      this.$api.Common.get(parms).then(res => {
        this.Doptions = res.data.map((item, i) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
      this.$forceUpdate();
    },
    selectchange() {
      this.$forceUpdate();
    },
    //客户分类
    getClierKHFL() {
      let parms = {
        typeCode: "KHFL"
      };
      this.$api.Common.get(parms).then(res => {
        this.KHFLoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    //来源
    getClierKHLY() {
      let parms = {
        typeCode: "KHLY"
      };
      this.$api.Common.get(parms).then(res => {
        this.KHLYoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    //行业
    getClierKHHY() {
      let parms = {
        typeCode: "KHHY"
      };
      this.$api.Common.get(parms).then(res => {
        this.KHHYoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    selectchange() {
      this.$forceUpdate();
    },
    //经手人
    getUserData(val) {
      if (val) {
        this.addClientForm.cuHandman = val.uId;
        this.addClientForm.cuHandmanvalue = val.uName;
        this.addClientForm.oid = val.uOid;
        this.addClientForm.cuOidvalue = `${this.gongsi}/${val.oidValue}`;
      }
      this.showSelectUser = false;
    },
    opendialog(n) {
      if (n === "showSelectPrincipal") {
        this.showSelectPrincipal = true;
      } else {
        this[n] = true;
      }
    },
    // 新增一行
    adddate() {
      this.ContactTableData.push({});
    },
    // 删除当前选中这行
    deldate(index) {
      if (this.ContactTableData.length > 1) {
        this.ContactTableData.splice(index, 1);
      }
    },
    //联系人反显
    Contact(cuid) {
      if (cuid) {
        let parms = {
          cuid: cuid
        };
        this.$api.Contact.get(parms).then(res => {
          if (res.data.records.length === 0) {
            this.ContactTableData = [];
            for (let i = 0; i < 3; i++) {
              this.ContactTableData.push({ index: i });
            }
          } else {
            this.ContactTableData = res.data.records;
          }
        });
      } else {
        this.ContactTableData = [];
        for (let i = 0; i < 3; i++) {
          this.ContactTableData.push({ index: i });
        }
      }
    },
    //确定提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("emitUserAdd", this.addClientForm);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.uploadBox {
  margin-left: 50px;
  margin-top: 20px;
}
.el-col {
  padding-left: 0 !important;
}
/* .el-form-item__content {
  line-height: 0%;
} */
</style>