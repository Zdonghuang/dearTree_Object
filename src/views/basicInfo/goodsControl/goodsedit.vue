<template>
  <div class="box" v-if="load">
    <el-row :gutter="10" class="titleBox">
      <el-col :xs="24" :sm="24" align="center">
        <p class="title">{{this.title}}</p>
      </el-col>
    </el-row>
    <el-form :model="addGoodsForm" :rules="rules" ref="ruleForm" label-width="90px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="5">
          <el-form-item label="商品名称" prop="gName">
            <el-input placeholder="请输入商品名称" v-model="addGoodsForm.gName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="归属公司">
            <el-select
              :disabled="this.gId===''?false:true"
              v-model="addGoodsForm.gOid"
              placeholder="请选择归属公司"
              size="mini"
              @change="selectchange"
            >
              <el-option
                v-for="(item,i) in GSoptions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="商品主类">
            <el-select
              :disabled="this.gId===''?false:true"
              v-model="addGoodsForm.gClasss"
              placeholder="请选择品类"
              size="mini"
              @change="getSPFL"
            >
              <el-option
                v-for="(item,i) in SPFLoptions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="商品子类">
            <el-select
              v-model="addGoodsForm.gClass"
              placeholder="请选择品类"
              size="mini"
              @change="selectgoods"
            >
              <el-option
                v-for="(item,i) in SPFL1options"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="5">
          <el-form-item label="品牌分类" prop="gBrandp">
            <el-select v-model="addGoodsForm.gBrandp" @change="getPP1" size="mini">
              <el-option
                v-for="(item,i) in PPoptions"
                :key="i"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="品牌名称" prop="gBrand">
            <el-select
              v-model="addGoodsForm.gBrand"
              filterable
              placeholder="请选择品牌名称"
              size="mini"
              @change="getPP2"
            >
              <el-option
                v-for="(item,i) in PP1options"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5" v-if="this.PP2options.length>0">
          <el-form-item label="品牌系列">
            <el-select
              v-model="addGoodsForm.gBrandseries"
              placeholder="请选择品牌系列"
              size="mini"
              @change="selectgoods"
            >
              <el-option
                v-for="(item,i) in PP2options"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="供货商">
            <el-input placeholder="请选择供货商" v-model="addGoodsForm.gSupplier" size="mini" readonly>
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="opendialog('showSelectGoodsSupplier')"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="5">
          <el-form-item label="商品货号" v-if="gId">
            <el-input placeholder="系统生成唯一货号" v-model="addGoodsForm.gItemnum" size="mini" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="销售价">
            <el-input placeholder="请输入销售价" v-model="addGoodsForm.gSellingprice" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="销售最低价">
            <el-input placeholder="请输入销售最低价" v-model="addGoodsForm.gReserveprice" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="5">
          <el-form-item label="租赁价">
            <el-input placeholder="请输入租赁价" v-model="addGoodsForm.gRentprice" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="5" v-has="375">
          <el-form-item label="成本价">
            <el-input placeholder="请输入成本价" v-model="addGoodsForm.gUnitprice" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="尺寸*厘米">
            <el-col :xs="24" :sm="8">
              <el-input placeholder="长度" v-model="addGoodsForm.chang" @input="updata" size="mini"></el-input>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-input placeholder="宽度" v-model="addGoodsForm.kuan" @input="updata" size="mini"></el-input>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-input placeholder="高度" v-model="addGoodsForm.gao" @input="updata" size="mini"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="this.PZYSoptions.length>0">
        <el-col :xs="24" :sm="24">
          <el-form-item label="配置/样式">
            <el-checkbox-group v-model="addGoodsForms.PZYS">
              <el-checkbox
                v-for="(item,i) in PZYSoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="商品等级">
            <el-radio-group v-model="addGoodsForms.DJ">
              <el-radio
                v-for="(item,i) in DJoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="6">
          <el-form-item label="商品来源" prop="gPurorrecover">
            <el-radio-group v-model="addGoodsForm.gPurorrecover">
              <el-radio label="2">回收商品</el-radio>
              <el-radio label="1">采购商品</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-form-item label="是否安装">
            <el-radio-group v-model="addGoodsForm.gNeedinstall">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="颜色" class="gColor">
            <el-radio-group v-model="addGoodsForm.gColor">
              <el-radio
                v-for="(item,i) in YSoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="材质" class="CZ">
            <el-radio-group v-model="addGoodsForms.CZ">
              <el-radio
                v-for="(item,i) in CZoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="成色" class="CS">
            <el-radio-group v-model="addGoodsForms.CS">
              <el-radio
                v-for="(item,i) in CSoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="拆装难度" class="CZND">
            <el-radio-group v-model="addGoodsForms.CZND">
              <el-radio
                v-for="(item,i) in CZNDoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="畅销度" class="CXD">
            <el-radio-group v-model="addGoodsForms.CXD">
              <el-radio
                v-for="(item,i) in CXDoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="使用时长">
            <el-radio-group v-model="addGoodsForm.gNewold">
              <el-radio
                v-for="(item,i) in NXoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="在售状态" class="gStatus">
            <el-radio-group v-model="addGoodsForm.gStatus">
              <el-radio
                v-for="(item,i) in ZSZToptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :xs="24" :sm="24">
          <el-form-item label="计量单位" prop="gUnit">
            <el-radio-group v-model="addGoodsForm.gUnit">
              <el-radio
                v-for="(item,i) in DWoptions"
                :key="i"
                :value="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="备注">
            <el-input placeholder="请输入备注" v-model="addGoodsForm.gRemark" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <div class="img" @click="delImg(0)" v-if="addGoodsForms.TP.length>0">
          <img height="200" width="200" :src="`${baseUrl}api${addGoodsForms.TP[0].split(',')[1]}`" />
        </div>
        <div class="img" @click="delImg(1)" v-if="addGoodsForms.TP.length>1">
          <img height="200" width="200" :src="`${baseUrl}api${addGoodsForms.TP[1].split(',')[1]}`" />
        </div>
        <div class="img" @click="delImg(2)" v-if="addGoodsForms.TP.length>2">
          <img height="200" width="200" :src="`${baseUrl}api${addGoodsForms.TP[2].split(',')[1]}`" />
        </div>
        <div class="img" @click="delImg(3)" v-if="addGoodsForms.TP.length>3">
          <img height="200" width="200" :src="`${baseUrl}api${addGoodsForms.TP[3].split(',')[1]}`" />
        </div>
        <div class="img" @click="delImg(4)" v-if="addGoodsForms.TP.length>4">
          <img height="200" width="200" :src="`${baseUrl}api${addGoodsForms.TP[4].split(',')[1]}`" />
        </div>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="7">
          <el-form-item>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
              list-type="picture"
              :auto-upload="false"
              :limit="5"
              multiple
              :on-exceed="handleExceed"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              accept="image/png, image/jpeg, image/gif"
              :http-request="uploadImg"
            >
              <el-button size="mini" type="primary" v-if="addGoodsForms.TP.length+num<5">上传商品图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且总大小不超过10MB / 图片规格(720*720)</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <br />
      <br />
      <br />
      <el-dialog
        title="供货商"
        v-dialogDrag
        :visible.sync="showSelectGoodsSupplier"
        width="60%"
        append-to-body
      >
        <selectGoodsSupplier @emitGoodsSupplierData="getGoodsSupplierData" status="12"></selectGoodsSupplier>
      </el-dialog>
    </el-form>
    <el-row v-if="showsave">
      <el-col align="center" class="button">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          size="mini"
          align="center"
          v-has="702"
        >保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import selectGoodsSupplier from "@/components/dialog/SelectGoodsSupplier";
import { savedts } from "@/api/user";
export default {
  props: {
    parent: 0,
  },
  components: {
    selectGoodsSupplier,
  },
  data() {
    return {
      showsave: this.$route.query.look ? false : true,
      val3: "",
      gclass: "",
      getpp1: "",
      getpp2: "",
      code: [],
      GSoptions: [],
      PZoptions: [],
      //DWoptions: [],
      YSoptions: [],
      CSoptions: [],
      ZSZToptions: [],
      NXoptions: [],
      CXDoptions: [],
      DJoptions: [],
      CZNDoptions: [],
      CZoptions: [],
      PZYSoptions: [],
      SPFLoptions: [],
      SPFL1options: [],
      PPoptions: [],
      PP1options: [],
      PP2options: [],
      fileList: [],
      formData: null,
      i: 0,
      num: 0,
      showSelectGoodsSupplier: false,
      gId: this.$route.query.gId ? this.$route.query.gId : "",
      imageUrl: "",
      removerImg: [],
      addGoodsForm: {
        gOid: this.$storage.companyId,
        gStatus: "1",
        chang: "",
        kuan: "",
        gao: "",
        gItemnum: "",
        gPurorrecover: "",
        gNeedinstall: "0",
        gStatus: "",
        gNewold: "41",
        gBrandseries: "",
        gColor: "1",
        gClass: "",
        gBrand: "",
        DJ: "",
      },
      addGoodsForms: {
        PZYS: [],
        TP: [],
        CZ: "",
        CS: "",
        CZND: "",
        CXD: "",
        PZYS: "",
        DJ: "",
      },
      loading: {},
      load: false,
      title: "",
      rules: {
        gName: [{ required: true, message: " ", trigger: "blur" }],
        gClasss: [{ required: true, message: " ", trigger: "change" }],
        gClass: [{ required: true, message: " ", trigger: "change" }],
        gBrandp: [{ required: true, message: " ", trigger: "change" }],
        gBrand: [{ required: true, message: " ", trigger: "change" }],
        gPurorrecover: [{ required: true, message: " ", trigger: "change" }],
      },
    };
  },
  watch: {
    parent: {
      handler: function (newv, oldv) {
        this.$props.parent = newv;
      },
    },
  },
  created() {
    if (this.$props.parent) {
      this.addGoodsForm.gPurorrecover = `${this.$props.parent}`;
    }
    this.getGoodsSPFL();
    //this.getGoodsDW();
    this.getGoodsCS();
    this.getGoodsZSZT();
    this.getGoodsNX();
    this.getGoodsYS();
    this.getGoodsCXD();
    this.getGoodsDJ();
    this.getGoodsCZND();
    this.getGoodsCZ();
    this.getGoodsGS();
    this.getGoodsPP();
    if (this.gId) {
      this.title = "商品编辑";
      this.loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.gitGoodsList();
    } else {
      this.load = true;
      this.title = "商品增加";
    }
  },
  methods: {
    updata() {
      this.$forceUpdate();
    },
    //显示弹窗
    opendialog(n) {
      this[n] = true;
    },
    //分类
    getGoodsSPFL() {
      let parms = {
        typeCode: "SPFL",
        attrCodeParent: 0,
      };
      this.$api.Common.get(parms).then((res) => {
        this.SPFLoptions = res.data.map((item) => {
          return {
            label: item.cAttrcode + item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    getSPFL() {
      let parms = {
        typeCode: "SPFL",
        attrCodeParent: this.addGoodsForm.gClasss,
      };
      this.addGoodsForm.gClass = "";
      if (this.gclass) {
        this.addGoodsForm.gClass = `${this.gclass}`;
        this.gclass = "";
      }
      this.getGoodsPZYS();
      this.$api.Common.get(parms).then((res) => {
        this.addGoodsForm.gUnit = res.data[0].cValue2;
        this.SPFL1options = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    selectgoods() {
      this.$forceUpdate();
    },
    //配置/样式
    getGoodsPZYS() {
      let parms = {
        typeCode: "PZYS",
        attrCodeParent: this.addGoodsForm.gClasss,
      };
      this.addGoodsForms.PZYS = [];
      this.$api.Common.get(parms).then((res) => {
        this.PZYSoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //品牌
    getGoodsPP() {
      let parms = {
        typeCode: "PP",
        attrCodeParent: 0,
      };
      this.$api.Common.get(parms).then((res) => {
        this.PPoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
      this.$forceUpdate();
    },
    getPP1() {
      let parms = {
        typeCode: "PP",
        attrCodeParent: this.addGoodsForm.gBrandp,
      };
      this.addGoodsForm.gBrand = "";
      this.addGoodsForm.gBrandseries = "";
      if (this.getpp1) {
        this.addGoodsForm.gBrand = `${this.getpp1}`;
        this.getpp1 = "";
        this.getPP2();
      }
      this.$api.Common.get(parms).then((res) => {
        this.PP1options = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
      this.$forceUpdate();
    },
    getPP2() {
      let parms = {
        typeCode: "PP",
        attrCodeParent: this.addGoodsForm.gBrand,
      };
      this.addGoodsForm.gBrandseries = "";
      if (this.getpp2) {
        this.addGoodsForm.gBrandseries = `${this.getpp2}`;
        this.getpp2 = "";
      }
      this.$api.Common.get(parms).then((res) => {
        this.PP2options = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
      this.$forceUpdate();
    },
    //颜色
    getGoodsYS() {
      let parms = {
        typeCode: "YS",
      };
      this.$api.Common.get(parms).then((res) => {
        this.YSoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    //畅销度
    getGoodsCXD() {
      let parms = {
        typeCode: "CXD",
      };
      this.$api.Common.get(parms).then((res) => {
        this.CXDoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //等级
    getGoodsDJ() {
      let parms = {
        typeCode: "DJ",
      };
      this.$api.Common.get(parms).then((res) => {
        this.DJoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //拆装难度
    getGoodsCZND() {
      let parms = {
        typeCode: "CZND",
      };
      this.$api.Common.get(parms).then((res) => {
        this.CZNDoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //材质
    getGoodsCZ() {
      let parms = {
        typeCode: "CZ",
      };
      this.$api.Common.get(parms).then((res) => {
        this.CZoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //年限
    getGoodsNX() {
      let parms = {
        typeCode: "NX",
      };
      this.$api.Common.get(parms).then((res) => {
        this.NXoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    //成色
    getGoodsCS() {
      let parms = {
        typeCode: "CS",
      };
      this.$api.Common.get(parms).then((res) => {
        this.CSoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode + "," + item.cAttrvalue,
          };
        });
      });
    },
    //在售状态
    getGoodsZSZT() {
      let parms = {
        typeCode: "ZSZT",
      };
      this.$api.Common.get(parms).then((res) => {
        this.ZSZToptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    //所属公司
    getGoodsGS() {
      let parms = {
        typeCode: "ZZJG",
        value1: 1,
      };
      this.$api.Common.get(parms).then((res) => {
        this.GSoptions = res.data.map((item) => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode,
          };
        });
      });
    },
    //供货商
    getGoodsSupplierData(val) {
      if (val) {
        this.addGoodsForm.gSupplierId = val.cuId;
        this.addGoodsForm.gSupplier = val.cuName;
      }
      this.showSelectGoodsSupplier = false;
    },
    selectchange() {
      this.$forceUpdate();
    },
    //商品列表
    gitGoodsList() {
      let param = {
        gid: this.gId,
        distinctwhid: 1,
      };
      this.$api.Goods.get(param).then((res) => {
        if (res.data) {
          res.data.records[0].gUnitprice = res.data.records[0].iUnitprice;
          this.addGoodsForm = res.data.records[0];
          if (!this.addGoodsForm.gPurorrecover)
            this.addGoodsForm.gPurorrecover = "1";
          if (!this.addGoodsForm.gNeedinstall)
            this.addGoodsForm.gNeedinstall = "0";
          if (!this.addGoodsForm.gColor) this.addGoodsForm.gColor = "1";
          if (!this.addGoodsForm.gNewold) this.addGoodsForm.gNewold = "41";
          this.addGoodsForm.gSupplierId = this.addGoodsForm.gSupplier;
          this.addGoodsForm.gSupplier = this.addGoodsForm.gSupplierv;
          this.addGoodsForm.gColor += "";
          this.addGoodsForm.gNewold += "";
          this.addGoodsForm.gStatus += "";
          this.addGoodsForm.gOid += "";
          this.addGoodsForms.PZYS = this.addGoodsForm.gPzysv + "";
          this.addGoodsForm.gNeedinstall += "";
          if (this.addGoodsForm.gBrand) {
            this.getgBrandName(this.addGoodsForm.gBrand);
            this.getpp1 = this.addGoodsForm.gBrand;
            this.getpp2 = this.addGoodsForm.gBrandseries;
            delete this.addGoodsForm.gBrand;
            delete this.addGoodsForm.gBrandseries;
          }
          if (this.addGoodsForm.gClass) {
            this.getgClassName(this.addGoodsForm.gClass);
            this.gclass = this.addGoodsForm.gClass;
            delete this.addGoodsForm.gClass;
          }
          this.addGoodsForm.gSellingprice = this.addGoodsForm.iSellingprice;
          this.addGoodsForm.gReserveprice = this.addGoodsForm.iReserveprice;
          let data;
          if (this.addGoodsForm.gSpec) {
            data = this.addGoodsForm.gSpec.split("*");
            this.addGoodsForm.chang = isNaN(data[0]) ? 0 : data[0];
            this.addGoodsForm.kuan = isNaN(data[1]) ? 0 : data[1];
            this.addGoodsForm.gao = isNaN(data[2]) ? 0 : data[2];
          }
          setTimeout(() => {
            this.gitGoodsListdts();
          }, 400);
        }
      });
    },
    getgClassName(val) {
      let parms = {
        typeCode: "SPFL",
        attrCode: val,
      };
      this.$api.Common.get(parms).then((res) => {
        if (res.data.length) {
          this.addGoodsForm.gClasss = res.data[0].cAttrcodeparent;
        }
        this.getSPFL();
        this.getGoodsPZYS();
      });
    },
    //商品分类反显
    getgBrandName(val) {
      let parms = {
        typeCode: "PP",
        attrCode: val,
      };
      this.$api.Common.get(parms).then((res) => {
        if (res.data.length) {
          this.addGoodsForm.gBrandp = res.data[0].cAttrcodeparent;
        }
        this.getPP1();
      });
    },
    //商品详细
    gitGoodsListdts() {
      let param = {
        gid: this.gId,
      };
      this.$api.Goodsdts.get(param).then((res) => {
        if (res.data) {
          this.addGoodsForms.PZYS = [];
          res.data.forEach((item, index) => {
            if (item.gdCtypecode === "PZYS") {
              this.addGoodsForms.PZYS.push(
                item.gdCattrcode + "," + item.gdCvalue
              );
            }
            if (item.gdCtypecode === "CS") {
              this.addGoodsForms.CS = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "DJ") {
              this.addGoodsForms.DJ = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "CZND") {
              this.addGoodsForms.CZND = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "CZ") {
              this.addGoodsForms.CZ = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "PZ") {
              this.addGoodsForms.PZ = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "CXD") {
              this.addGoodsForms.CXD = item.gdCattrcode + "," + item.gdCvalue;
            }
            if (item.gdCtypecode === "TP" && item.gdCvalue) {
              this.addGoodsForms.TP.push(
                item.gdCattrcode + "," + item.gdCvalue
              );
              this.fileList.push({
                name: "商品照片",
                url: `${this.baseUrl}api${item.gdCvalue}`,
              });
            }
          });
          this.loading.close();
          this.load = true;
        }
      });
    },
    delImg(val) {
      this.$confirm("此操作将删除此图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.addGoodsForms.TP.splice(val, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handlePreview(file) {
      window.open(file.url);
    },
    handleRemove(file, fileList) {
      this.addGoodsForms.TP.map((item, i) => {
        if (file.url.split("file")[1] == item.split("file")[1]) {
          this.removerImg.push(item);
          this.addGoodsForms.TP.splice(i, 1);
        }
      });
      this.num--;
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      this.num++;
    },
    //上传图片
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
    },
    //确定提交
    submitForm(formName) {
      if (!this.addGoodsForm.gClasss)
        return this.$message.error("请选择商品主类");
      if (!this.addGoodsForm.gClass)
        return this.$message.error("请选择商品子类");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData = new FormData();
          this.$refs.upload.submit();
          if (this.addGoodsForms.PZYS.length) {
            this.addGoodsForms.PZYS.map((item) => {
              this.code.push({
                gdCtypecode: "PZYS",
                gdCattrcode: item.split(",")[0],
                gdCvalue: item.split(",")[1],
              });
            });
          }
          if (this.addGoodsForms.TP.length) {
            this.addGoodsForms.TP.map((item) => {
              if (!this.removerImg.includes(item)) {
                this.code.push({
                  gdCtypecode: "TP",
                  gdCattrcode: item.split(",")[0],
                  gdCvalue: item.split(",")[1],
                });
              }
            });
          }
          let loading = this.$loading({
            lock: true,
            text: "保存中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          const arr = [];
          if (this.addGoodsForms.CXD) {
            arr.push("CXD");
          }
          if (this.addGoodsForms.CS) {
            arr.push("CS");
          }
          if (this.addGoodsForms.CZ) {
            arr.push("CZ");
          }
          if (this.addGoodsForms.CZND) {
            arr.push("CZND");
          }
          if (this.addGoodsForms.DJ) {
            arr.push("DJ");
          }
          if (this.addGoodsForms.PZ) {
            arr.push("PZ");
          }
          arr.map((item) => {
            this.code.push({
              gdCtypecode: item,
              gdCattrcode: this.addGoodsForms[item].split(",")[0],
              gdCvalue: this.addGoodsForms[item].split(",")[1],
            });
          });
          if (!this.addGoodsForm.chang) {
            this.addGoodsForm.chang = 0;
          }
          if (!this.addGoodsForm.kuan) {
            this.addGoodsForm.kuan = 0;
          }
          if (!this.addGoodsForm.gao) {
            this.addGoodsForm.gao = 0;
          }
          let formData = {
            gName: this.addGoodsForm.gName,
            gClass: this.addGoodsForm.gClass,
            gSellingprice: this.addGoodsForm.gSellingprice,
            gReserveprice: this.addGoodsForm.gReserveprice,
            gRentprice: this.addGoodsForm.gRentprice,
            gBrand: this.addGoodsForm.gBrand,
            gBrandseries: this.addGoodsForm.gBrandseries,
            gColor: this.addGoodsForm.gColor,
            gNewold: this.addGoodsForm.gNewold,
            gOid: this.addGoodsForm.gOid,
            gPurorrecover: this.addGoodsForm.gPurorrecover,
            gRemark: this.addGoodsForm.gRemark,
            gItemnum: this.addGoodsForm.gItemnum,
            gSpec:
              this.addGoodsForm.chang +
              "*" +
              this.addGoodsForm.kuan +
              "*" +
              this.addGoodsForm.gao,
            gStatus: this.addGoodsForm.gStatus,
            gSupplier: this.addGoodsForm.gSupplierId,
            gUnit: this.addGoodsForm.gUnit,
            gUnitprice: this.addGoodsForm.gUnitprice,
            gNeedinstall: this.addGoodsForm.gNeedinstall,
            tGoodsdtsList: this.code,
          };
          if (!formData.formData) delete formData.formData;
          if (this.gId) {
            formData.gId = this.gId;
          }
          let files = [];
          if (this.$route.query.copy) {
            delete formData.gId;
          }
          //获取公司简称
          let parms = {
            typeCode: "ZZJG",
            attrCode: this.addGoodsForm.gOid,
          };
          this.$api.Common.get(parms).then((res) => {
            this.addGoodsForm.cValue3 = res.data[0].cValue3;
            let param = {
              gclass: this.addGoodsForm.gClasss,
              oidv: this.addGoodsForm.cValue3,
            };
            if (this.$route.query.copy || !formData.gId) {
              this.$api.Goods.code(param).then((res) => {
                if (res) {
                  this.addGoodsForm.gItemnum = res;
                  formData.gItemnum = res;
                  this.$ajax
                    .post("/system/upload", this.formData)
                    .then((res) => {
                      if (res.data.code === 200) {
                        if (Object.values(res.data.data).length) {
                          Object.values(res.data.data).map((item) => {
                            files.push({
                              gdCtypecode: "TP",
                              gdCattrcode: 154,
                              gdCvalue: `/file/${item}`,
                            });
                          });
                        }
                      }
                      files.map((item) => {
                        formData.tGoodsdtsList.push(item);
                      });
                      this.$api.Goods.savedts(formData).then((res) => {
                        loading.close();
                        if (res.code === 200) {
                          if (this.$props.parent)
                            return this.$emit("closeAddGoods");
                          this.$message({
                            message: "商品数据保存成功",
                            type: "success",
                          });
                          this.$router.push({
                            path: `goods?oid=${
                              this.$route.query.oid ? this.$route.query.oid : ""
                            }`,
                          });
                        } else {
                          this.i = 0;
                          this.num = 0;
                          files.map((item, i) => {
                            if (formData.tGoodsdtsList.indexOf(item) > -1) {
                              formData.tGoodsdtsList.splice(
                                formData.tGoodsdtsList.indexOf(item),
                                1
                              );
                            }
                          });
                          this.$message.error("失败");
                        }
                      });
                    });
                }
              });
            } else {
              this.$ajax.post("/system/upload", this.formData).then((res) => {
                if (res.data.code === 200) {
                  if (Object.values(res.data.data).length) {
                    Object.values(res.data.data).map((item) => {
                      files.push({
                        gdCtypecode: "TP",
                        gdCattrcode: 154,
                        gdCvalue: `/file/${item}`,
                      });
                    });
                  }
                }
                files.map((item) => {
                  formData.tGoodsdtsList.push(item);
                });
                this.$api.Goods.savedts(formData).then((res) => {
                  loading.close();
                  if (res.code === 200) {
                    if (this.$props.parent) return this.$emit("closeAddGoods");
                    this.$message({
                      message: "商品数据保存成功",
                      type: "success",
                    });
                    this.$router.push({
                      path: `goods?oid=${
                        this.$route.query.oid ? this.$route.query.oid : ""
                      }`,
                    });
                  } else {
                    this.i = 0;
                    this.num = 0;
                    files.map((item, i) => {
                      if (formData.tGoodsdtsList.indexOf(item) > -1) {
                        formData.tGoodsdtsList.splice(
                          formData.tGoodsdtsList.indexOf(item),
                          1
                        );
                      }
                    });
                    this.$message.error("失败");
                  }
                });
              });
            }
          });
        } else {
          this.$message.error("*为必填或必填项");
        }
      });
    },
  },
};
</script>

<style scoped>
.el-upload-list--picture .is-success {
  display: inline-block !important;
}
.uploadBox {
  margin-left: 50px;
  margin-top: 20px;
}
.img {
  position: relative;
  display: inline-block;
  margin-right: 6px;
}
.img img {
  opacity: 0.9;
}
.img::after {
  content: "×";
  color: red;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 4px;
}
.button {
  position: fixed;
  bottom: 0px;
}
.el-radio {
  margin: 8px 4px;
}
.el-checkbox {
  margin: 0px 4px;
}
.checkbox-group {
  height: 30px;
}
.el-col {
  margin-bottom: 0;
}
</style>