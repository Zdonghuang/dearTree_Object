<template>
  <div>
    <el-form :model="AddLogisticsForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="名称" prop="cuName " class="logisticsLabe">
            <el-input placeholder="请输入物流公司名称" v-model="AddLogisticsForm.cuName " size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="cuContact " class="logisticsLabe">
            <el-input placeholder="请输入联系人" v-model="AddLogisticsForm.cuContact " size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="cuMobile " class="logisticsLabe">
            <el-input placeholder="请输入联系电话" v-model="AddLogisticsForm.cuMobile " size="mini"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="cuRegion" class="logisticsLabe">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="AddLogisticsForm.cuProvince"
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
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="AddLogisticsForm.cuCity"
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
              <el-col :xs="24" :sm="7" style="margin-bottom:0">
                <el-select
                  v-model="AddLogisticsForm.cuDistrict"
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
          <el-form-item label="详细地址" prop="cuAddr">
            <el-input placeholder="请输入详细地址" v-model="AddLogisticsForm.cuAddr" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="cuRemark">
            <el-input placeholder="备注" v-model="AddLogisticsForm.cuRemark" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini" align="center">保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { constants } from "crypto";
import { delimiter } from "path";
export default {
  props: ["UpdateLogisticsForm"],
  data() {
    return {
      Poptions: [],
      Doptions: [],
      Coptions: [],
      cuProvince1: 0,
      cuCity1: 0,
      cuDistrict1: 0,
      AddLogisticsForm: {},
      rules: {
        cuName: [
          { required: true, message: " ", trigger: "blur" }
        ],
        cuAddr: [
          { required: true, message: " ", trigger: "blur" }
        ],
        cuContact: [
          { required: true, message: " ", trigger: "blur" }
        ],
        cuMobile: [
          { required: true, message: " ", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.Region();
  },
  watch: {
    UpdateLogisticsForm: {
      handler: function(a, b) {
        this.cuProvince1 = a.cuProvince;
        this.cuCity1 = a.cuCity;
        this.cuDistrict1 = a.cuDistrict;
        this.AddLogisticsForm = JSON.parse(JSON.stringify(a));
        if (a.id) {
          if (this.cuProvince1) {
            this.AddLogisticsForm.cuProvince = `${this.cuProvince1}`;
            this.cuProvince();
          }
        } else {
          this.Coptions = [];
          this.Doptions = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //确定提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("emitLogisticsAdd", this.AddLogisticsForm);
        } else {
          return false;
        }
      });
    },
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
    cuProvince() {
      let parms = {
        typeCode: "XZQH",
        attrCodeParent: this.AddLogisticsForm.cuProvince
      };
      this.AddLogisticsForm.cuCity = "";
      this.AddLogisticsForm.cuDistrict = "";
      if (this.cuCity1) {
        this.AddLogisticsForm.cuCity = `${this.cuCity1}`;
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
        attrCodeParent: this.AddLogisticsForm.cuCity
      };
      this.AddLogisticsForm.cuDistrict = "";
      if (this.cuDistrict1) {
        this.AddLogisticsForm.cuDistrict = `${this.cuDistrict1}`;
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
</style>