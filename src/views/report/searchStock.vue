<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="3">
        <el-input placeholder="请输入商品名称" v-model="form.goodsName" size="mini" class="cuName"></el-input>
      </el-col>
      <el-col :xs="24" :sm="3">
        <el-input placeholder="请输入商品货号" v-model="form.goodsItemNum" size="mini" class="cuName"></el-input>
      </el-col>
      <el-col :sm="2" :xs="6">
        <el-checkbox
          v-model="form.showMaterial"
          label="原料"
          border
          size="mini"
          true-label="1"
          false-label
          @change="getGoodsStock"
        ></el-checkbox>
      </el-col>
      <el-col :sm="2" :xs="6">
        <el-button type="danger" size="mini" @click="showBox=true">高级搜索</el-button>
      </el-col>
      <el-col :sm="2" :xs="6">
        <el-button type="primary" size="mini" @click="getGoodsStock">查询</el-button>
      </el-col>
      <el-col :sm="12" :xs="6" align="right">
        <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
      </el-col>
    </el-row>
    <div id="vm" class="pubu" v-cloak>
      <ul id="show" class="yg yg_l" style="padding:0" v-if="TableData.length">
        <li v-for="(item,index) in TableData">
          <div class="item_div">
            <img
              :src="`${baseUrl}api${item.goodsImagesUrl[0]}`"
              alt
              @click="openlink(`${baseUrl}api${item.goodsImagesUrl[0]}`)"
            />
          </div>
          <div style="padding-left:10px">
            <div style="font-size:16px;">{{item.goodsName}}</div>
            <div style="font-size:14px;">货号：{{item.goodsItemNum}}</div>
            <!-- <div style="font-size:14px;">数量：{{item.goodsQty}}</div> -->
            <div style="font-size:14px;">可售数量：{{item.goodsSalesQty}}</div>
            <div style="font-size:14px;" v-if="vhas">成本单价：{{item.goodsCostPrice}}</div>
            <!-- <div style="font-size:14px;" v-if="vhas">成本总价：{{item.goodsCostAmount}}</div> -->
            <div style="font-size:14px;">销售单价：{{item.salesPrice}}</div>
            <!-- <div style="font-size:14px;">销售总价：{{item.salesAmount}}</div> -->
            <div style="font-size:14px;">销售底价：{{item.minSalesPrice}}</div>
            <!-- <div style="font-size:14px;">销售底价总价：{{item.minSalesAmount}}</div> -->
            <div style="font-size:14px;">租赁单价：{{item.leasePrice}}</div>
            <!-- <div style="font-size:14px;">租赁总价：{{item.leaseAmount}}</div> -->
            <div style="font-size:14px;">颜色：{{item.goodsColorName}}</div>
            <div style="font-size:14px;">规格：{{item.goodsSpec}}</div>
            <div style="font-size:14px;">总类：{{item.goodsClassA}}</div>
            <div style="font-size:14px;">子类：{{item.goodsClassB}}</div>
            <div style="font-size:14px;">材质：{{item.goodsMaterial}}</div>
            <div style="font-size:14px;">品牌：{{item.goodsBrandName}}</div>
            <div style="font-size:14px;">等级：{{item.goodsGrade}}</div>
            <div style="font-size:14px;">新旧程度：{{item.goodsNewOld}}</div>
            <div style="font-size:14px;">畅销度：{{item.goodsHot}}</div>
            <!-- <div style="font-size:14px;">归属公司：{{item.orgName}}</div> -->
            <div style="font-size:14px;">归属仓库：{{item.wareHouseName}}</div>
            <!-- <div style="font-size:14px;">来源：{{item.goodsFromName}}</div> -->
          </div>
        </li>
        <li v-if="!next" style="color:red;font-size:20px;line-height:50px;text-align:center">没有商品啦。。</li>
      </ul>
      <ul style="padding:0" v-else>
        <li>
          <div style="padding-left:10px">
            <div style="font-size:20px; text-align:center; line-height:100px;">暂无商品</div>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="高级搜索"
      v-dialogDrag
      :visible.sync="showBox"
      width="60%"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-select
            v-model="form.customerId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loadings"
            size="small"
            class="selectSlot3"
          >
            <template slot="prefix">
              <span class="prefixSlot">供应商</span>
            </template>
            <el-option
              v-for="(item,index) in rCuidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.orgId"
            placeholder="归属公司"
            size="small"
            class="selectSlot4"
            filterable
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">归属公司</span>
            </template>
            <el-option
              v-for="item in GSoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsColor"
            placeholder="颜色"
            size="small"
            class="selectSlot4"
            filterable
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">颜色</span>
            </template>
            <el-option
              v-for="item in YSoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.purorrecover"
            placeholder="来源"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">来源</span>
            </template>
            <el-option label="回收" value="2"></el-option>
            <el-option label="采购" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsStatus"
            placeholder="在售状态"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">在售状态</span>
            </template>
            <el-option label="停售" value="2"></el-option>
            <el-option label="在售" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsBrand"
            placeholder="品牌"
            size="small"
            class="selectSlot2"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">品牌</span>
            </template>
            <el-option
              v-for="item in PP1options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsCate"
            placeholder="一级分类"
            size="small"
            class="selectSlot4"
            clearable
            @change="getSPFL"
          >
            <template slot="prefix">
              <span class="prefixSlot">一级分类</span>
            </template>
            <el-option
              v-for="item in SPFLoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24" v-if="form.goodsCate">
          <el-select
            v-model="form.goodsClass"
            placeholder="一级分类"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">二级分类</span>
            </template>
            <el-option
              v-for="item in SPFL1options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsGrade"
            placeholder="等级"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">等级</span>
            </template>
            <el-option
              v-for="item in DJoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsHot"
            placeholder="畅销度"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">畅销度</span>
            </template>
            <el-option
              v-for="item in CXDoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.goodsMaterial"
            placeholder="材质"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">材质</span>
            </template>
            <el-option
              v-for="item in CZoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-select
            v-model="form.wareHouseId"
            placeholder="仓库"
            size="small"
            class="selectSlot4"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">仓库</span>
            </template>
            <el-option
              v-for="item in CKoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-input placeholder="成本开始价" v-model="form.statPrice" size="small"></el-input>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-input placeholder="成本结束价" v-model="form.endPrice" size="small"></el-input>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-input placeholder="销售开始价" v-model="form.statSalesPrice" size="small"></el-input>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-input placeholder="销售结束价" v-model="form.endSalesPrice" size="small"></el-input>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-input placeholder="规格" v-model="form.goodsSpec" size="small"></el-input>
        </el-col>
        <el-col :sm="24" :xs="24" align="right">
          <el-button type="primary" size="mini" @click="getGoodsStock('showBox')">查询</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "searchStock",
  inject: ["reload"],
  data() {
    return {
      currentPage: 1,
      size: 20,
      TableData: [],
      total: 0,
      loading: null,
      loadings: null,
      vhas: true,
      showBox: false,
      GSoptions: [],
      YSoptions: [],
      rCuidOptions: [],
      PPoptions: [],
      PP1options: [],
      DJoptions: [],
      CXDoptions: [],
      CZoptions: [],
      CKoptions: [],
      SPFLoptions: [],
      SPFL1options: [],
      next: true,
      form: {
        customerId: "", // 供应商
        endPrice: "", // 成本结束价
        endSalesPrice: "", // 销售结束价
        goodsBrand: "", // 品牌
        goodsCate: "", // 品牌分类
        goodsClass: "", // 类别
        goodsColor: "", // 颜色
        goodsFrom: "", // 来源
        goodsGrade: "", // 等级
        goodsHot: "", // 畅销度
        goodsItemNum: "", // 货号
        goodsMaterial: "", // 材质
        goodsName: "", // 名称
        goodsSpec: "", // 规格
        goodsStatus: "1", // 状态
        orgId: this.$storage.companyId, // 归属公司
        showMaterial: "1", // 是否包含原材料（默认包含）
        statPrice: "", // 成本开始价格
        statSalesPrice: "", // 销售开始价格
        wareHouseId: "" // 仓库
      }
    };
  },
  created() {
    window.addEventListener("scroll", e => {
      if (this.$route.name != "searchStock" || !this.next) return;
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + clientHeight == scrollHeight) {
        this.size += 20;
        this.getGoodsStock();
      }
    });
    this.getGoodsGS();
    this.getGoodsYS();
    this.getGoodsPP();
    this.getGoodsDJ();
    this.getGoodsCXD();
    this.getGoodsCZ();
    this.getGoodsCK();
    this.getBrandList();
    this.getGoodsSPFL();
    this.getGoodsStock();
    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    getGoodsStock(val) {
      this.loading = this.$loading({
        lock: true,
        text: "获取数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let obj = JSON.parse(JSON.stringify(this.form));
      if (!obj.customerId) delete obj.customerId;
      if (!obj.endPrice) delete obj.endPrice;
      if (!obj.endSalesPrice) delete obj.endSalesPrice;
      if (!obj.goodsBrand) delete obj.goodsBrand;
      if (!obj.goodsCate) delete obj.goodsCate;
      if (!obj.goodsClass) delete obj.goodsClass;
      if (!obj.goodsColor) delete obj.goodsColor;
      if (!obj.goodsFrom) delete obj.goodsFrom;
      if (!obj.goodsGrade) delete obj.goodsGrade;
      if (!obj.goodsHot) delete obj.goodsHot;
      if (!obj.goodsItemNum) delete obj.goodsItemNum;
      if (!obj.goodsMaterial) delete obj.goodsMaterial;
      if (!obj.goodsName) delete obj.goodsName;
      if (!obj.goodsSpec) delete obj.goodsSpec;
      if (!obj.goodsStatus) delete obj.goodsStatus;
      if (!obj.orgId) delete obj.orgId;
      if (!obj.showMaterial) delete obj.showMaterial;
      if (!obj.statPrice) delete obj.statPrice;
      if (!obj.statSalesPrice) delete obj.statSalesPrice;
      if (!obj.wareHouseId) delete obj.wareHouseId;
      obj.currentPage = this.currentPage;
      obj.size = this.size;
      this.$api.Goods.getGoodsStock(obj).then(res => {
        if (res.code == 200) {
          res.data.records.map((item, i) => {
            if (item.goodsImagesUrl) {
              item.goodsImagesUrl = item.goodsImagesUrl.split(",");
            } else {
              item.goodsImagesUrl = [];
            }
          });
          if (res.data.records.length == this.TableData.length)
            this.next = false;
          this.TableData = res.data.records;
          this.currentPage = res.data.current;
          this.size = res.data.size;
          this.total = res.data.total;
          this.loading.close();
          if (val == "showBox") {
            this.showBox = false;
          }
        }
      });
    },
    // 商品分类主类
    getGoodsSPFL() {
      let parms = {
        typeCode: "SPFL",
        attrCodeParent: 0
      };
      this.$api.Common.get(parms).then(res => {
        this.SPFLoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    // 商品分类子类
    getSPFL() {
      this.form.goodsClass = "";
      let parms = {
        typeCode: "SPFL",
        attrCodeParent: this.form.goodsCate
      };
      this.$api.Common.get(parms).then(res => {
        this.SPFL1options = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    // 品牌列表
    getBrandList() {
      let param = {
        typeCode: "PP",
        value1: 2,
        currentPage: 1,
        size: 999
      };
      this.$api.Common.get(param).then(res => {
        this.PP1options = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    // 商品颜色
    getGoodsYS() {
      let parms = {
        typeCode: "YS"
      };
      this.$api.Common.get(parms).then(res => {
        this.YSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    getGoodsCK() {
      this.$api.Warehouse.get({ currentPage: 1, size: 9999 }).then(res => {
        if (res.data) {
          this.CKoptions = res.data.records.map(item => {
            return {
              label: item.whName,
              value: item.whId
            };
          });
        }
      });
    },
    //材质
    getGoodsCZ() {
      let parms = {
        typeCode: "CZ"
      };
      this.$api.Common.get(parms).then(res => {
        this.CZoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    }, //畅销度
    getGoodsCXD() {
      let parms = {
        typeCode: "CXD"
      };
      this.$api.Common.get(parms).then(res => {
        this.CXDoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    //品牌分类
    getGoodsPP() {
      let parms = {
        typeCode: "PP",
        attrCodeParent: 0
      };
      this.$api.Common.get(parms).then(res => {
        this.PPoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    //商品等级
    getGoodsDJ() {
      let parms = {
        typeCode: "DJ"
      };
      this.$api.Common.get(parms).then(res => {
        this.DJoptions = res.data.map(item => {
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
      this.$api.Common.getDIC(parms).then(res => {
        this.GSoptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      });
    },
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loadings = true;
        this.$api.Customer.query({
          div: 12,
          size: 9999,
          auth: 1,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loadings = false;
            this.rCuidOptions = res.data.records.map(item => {
              return {
                label: item.cuName,
                value: item.cuId,
                cuHandman: item.cuHandman,
                cuHandmanvalue: item.cuHandmanvalue
              };
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    openlink(url) {
      window.open(url, "_blank");
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.size = size;
      this.getGoodsStock();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getGoodsStock();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none !important;
}
li {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.pubu {
  width: calc(100% - 16px);
}
.yg img {
  width: 100%;
  border-radius: 8px 8px 0 0;
}
.yg p {
  margin-top: 10px;
  padding: 0 8px;
  width: calc(100% - 16px);
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #999;
}
.yg {
  column-count: 2;
}
.yg li {
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  padding-bottom: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.yg li .item_div {
  position: relative;
}
.u_xinx {
  position: absolute;
  bottom: 4px;
}
.u_xinx img {
  margin-left: 5px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-block;
}
.u_xinx span {
  position: relative;
  text-shadow: 0 1px 1px #333;
  top: -8px;
  color: #fff;
  font-size: 0.6rem;
}
</style>
