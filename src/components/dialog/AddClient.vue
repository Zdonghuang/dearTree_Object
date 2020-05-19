<template>
  <div class="dialogtBox">
    <el-form :model="addClientForm" :rules="rules" ref="ruleForm" label-width="120px">
      <h4>基本信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="名称" prop="cuName">
            <el-input placeholder="请输入名称" v-model="addClientForm.cuName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="cuDistrict">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuProvince"
                  placeholder="请选择省"
                  filterable
                  size="mini"
                  @change="cuProvince($event)"
                >
                  <el-option
                    v-for="item in Poptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuCity"
                  placeholder="请选择市"
                  size="mini"
                  @change="cuCity($event)"
                >
                  <el-option
                    v-for="item in Coptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="addClientForm.cuDistrict"
                  placeholder="请选择区"
                  size="mini"
                  @change="selectchange($event)"
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
          <el-form-item label="详细地址" prop="cuAddr">
            <el-input placeholder="请输入详细地址" v-model="addClientForm.cuAddr" size="mini"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分类" prop="cuDiv">
            <el-select v-model="addClientForm.cuDiv" size="mini" @change="selectchange">
              <el-option value="16" label="客户"></el-option>
              <el-option value="60" label="客户及采购供货商"></el-option>
              <el-option value="92" label="客户及回收供货商"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="cuIsperson" label="客户类型">
            <el-select v-model="addClientForm.cuIsperson" size="mini" @change="selectchange">
              <el-option value="0" label="企业"></el-option>
              <el-option value="1" label="个人"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="行业" prop="cuIndustry">
            <el-select
              v-model="addClientForm.cuIndustry"
              placeholder="请选择客户行业"
              size="mini"
              @change="selectchange"
            >
              <el-option
                v-for="item in KHHYoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户来源" prop="cuOrigin">
            <el-select
              v-model="addClientForm.cuOrigin"
              placeholder="请选择客户来源"
              size="mini"
              @change="selectchange"
            >
              <el-option
                v-for="item in KHLYoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获客人" prop="cuHandmanvalue">
            <el-input
              placeholder="请选择获客人"
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
          <el-form-item prop="cuGrade" label="客户等级">
            <el-select v-model="addClientForm.cuGrade" size="mini" @change="selectchange">
              <el-option value="1" label="特大客户"></el-option>
              <el-option value="2" label="优质客户"></el-option>
              <el-option value="3" label="一般客户"></el-option>
              <el-option value="4" label="其他客户"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>联系人信息 ( 至少填写一条,姓名,手机,地址必填 )</h4>
      <el-row :gutter="20">
        <el-col>
          <el-table
            :data="ContactTableData"
            border
            highlight-current-row
            style="width:99%"
            size="mini"
            header-cell-class-name="thbgc"
          >
            <el-table-column property="date" label="操作" align="center" width="80">
              <template slot-scope="scope">
                <i class="el-icon-circle-plus add" @click="adddate()"></i>
                <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column sortable property="cName" align="center">
              <template slot="header">
                <span class="red">*</span>姓名
              </template>
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cName" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cName" align="center" label="身份证号">
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cIdentity" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cMobile" align="center">
              <template slot="header">
                <span class="red">*</span>手机
              </template>
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cMobile" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cTel" align="center" label="电话">
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cTel" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cWeixin" align="center" label="微信">
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cWeixin" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cAddr" align="center">
              <template slot="header">
                <span class="red">*</span>地址
              </template>
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cAddr" />
              </template>
            </el-table-column>
            <el-table-column sortable property="cRemark" align="center" label="备注">
              <template slot-scope="scope">
                <input type="text" class="ipt" v-model="scope.row.cRemark" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <h4>开票信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="开票名称及户名" prop="cuRemark">
            <el-input placeholder="开票名称及户名" v-model="addClientForm.cuRemark" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="地址及电话" prop="cuBankcardnum">
            <el-input placeholder="地址及电话" v-model="addClientForm.cuBankcardnum" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="11">
          <el-form-item label="纳税人识别号" prop="cuTaxnum">
            <el-input placeholder="纳税人识别号" v-model="addClientForm.cuTaxnum" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号" prop="cuBankname">
            <el-input placeholder="开户行及账号" v-model="addClientForm.cuBankname" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini" align="center">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="获客人选择"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
      append-to-body
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
  </div>
</template>
<script>
import selectUser from "@/components/dialog/SelectUser";
export default {
  props: ["updateClient", "upid"],
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
        cuDiv: "16",
        cuOidvalue: "",
        cuOid: `${this.$storage.companyId}`,
        cuIsperson: "0",
        cuGrade: "1",
        cuProvincev: "",
        cuCityv: "",
        cuDistrictv: ""
      },
      rules: {
        cuName: [{ required: true, message: " ", trigger: "blur" }],
        cuDistrict: [{ required: true, message: " ", trigger: "blur" }],
        cuAddr: [{ required: true, message: " ", trigger: "blur" }],
        cuProvince: [{ required: true, message: " ", trigger: "change" }],
        cuCity: [{ required: true, message: "", trigger: "change" }],
        cuHandmanvalue: [{ required: true, message: " ", trigger: "blur" }],
        cuIndustry: [{ required: true, message: " ", trigger: "blur" }],
        cuOrigin: [{ required: true, message: " ", trigger: "blur" }],
        cuIsperson: [{ required: true, message: " ", trigger: "blur" }],
        cuDiv: [{ required: true, message: " ", trigger: "blur" }]
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
        if ((a && a.cuId) || (a && a.rCuid)) {
          this.cuProvince1 = a.cuProvince;
          this.cuCity1 = a.cuCity;
          this.cuDistrict1 = a.cuDistrict;
          this.addClientForm = JSON.parse(JSON.stringify(a));
          if (this.addClientForm.cuOid) this.addClientForm.cuOid += "";
          if (this.addClientForm.cuIsperson)
            this.addClientForm.cuIsperson += "";
          if (
            this.addClientForm.cuIndustry &&
            this.addClientForm.cuIndustry != 0
          ) {
            this.addClientForm.cuIndustry += "";
          } else {
            this.addClientForm.cuIndustry = "";
          }
          if (this.addClientForm.cuOrigin && this.addClientForm.cuOrigin != 0) {
            this.addClientForm.cuOrigin += "";
          } else {
            this.addClientForm.cuOrigin = "";
          }
          if (this.cuProvince1 && this.cuProvince1 != "0") {
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
    },
    upid: {
      handler: function(a, b) {
        if (a) {
          // // 客户
          this.$api.Customer.get({ id: a }).then(res => {
            if (res.code == 200) {
              this.addClientForm = res.data.records[0];
              this.cuProvince1 = this.addClientForm.cuProvince;
              this.cuCity1 = this.addClientForm.cuCity;
              this.cuDistrict1 = this.addClientForm.cuDistrict;
              if (this.cuProvince1 && this.cuProvince1 != "0") {
                this.addClientForm.cuProvince = `${this.cuProvince1}`;
                this.cuProvince();
              } else {
                this.addClientForm.cuProvince = "";
                this.cuProvince();
              }
              if (this.addClientForm.cuOid) this.addClientForm.cuOid += "";
              if (this.addClientForm.cuIsperson)
                this.addClientForm.cuIsperson += "";
              if (
                this.addClientForm.cuIndustry &&
                this.addClientForm.cuIndustry != 0
              ) {
                this.addClientForm.cuIndustry += "";
              } else {
                this.addClientForm.cuIndustry = "";
              }
              if (
                this.addClientForm.cuOrigin &&
                this.addClientForm.cuOrigin != 0
              ) {
                this.addClientForm.cuOrigin += "";
              } else {
                this.addClientForm.cuOrigin = "";
              }
            }
          });
          this.Contact(a);
        }
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
        if (res.data.length) {
          this.gongsi = res.data[0].cAttrvalue;
        }
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
    cuProvince(e) {
      this.Poptions.map(item => {
        if (item.value == e) {
          this.addClientForm.cuProvincev = item.label;
        }
      });
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
    cuCity(e) {
      this.Coptions.map(item => {
        if (item.value == e) {
          this.addClientForm.cuCityv = item.label;
        }
      });
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
    selectchange(e) {
      if (e) {
        this.Doptions.map(item => {
          if (item.value == e) {
            this.addClientForm.cuDistrictv = item.label;
          }
        });
      }
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
    //获客人
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
          cuid: cuid,
          size: 100
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
    submitForm(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          this.addClientForm.tContactList = [];
          let n = false;
          this.ContactTableData.forEach((item, index) => {
            if (item.cName && item.cMobile && item.cAddr) {
              n = true;
              let obj = {};
              obj.CAddr = item.cAddr;
              obj.CName = item.cName;
              obj.CIdentity = item.cIdentity;
              obj.CMobile = item.cMobile;
              obj.CTel = item.cTel;
              obj.CWeixin = item.cWeixin;
              obj.CRemark = item.cRemark;
              this.addClientForm.tContactList.push(obj);
            }
          });
          if (!n)
            return this.$message.error("联系人至少填写一条,姓名,手机,地址必填");
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