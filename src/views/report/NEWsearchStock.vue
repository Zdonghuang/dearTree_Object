<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="6" :xs="24" align="right"></el-col>
      <el-col :sm="6" :xs="24" align="right"></el-col>
      <el-col :sm="6" :xs="24" align="right"></el-col>
      <el-col :sm="6" :xs="24" align="right">
        <a href="javascript:" @click="toExcel('tab',$event)" class="export" v-has="373">
          <i class="el-icon-download"></i> 打印
        </a>
        <a href="javascript:" @click="getGoodsStock('xlsx')" class="export" v-has="373">
          <i class="el-icon-download"></i> 导出
        </a>
        <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input placeholder="名称" v-model="form.goodsName" size="small" class="cuName"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="货号" v-model="form.goodsItemNum" size="small" class="cuName"></el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="规格" v-model="form.goodsSpec" size="small"></el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
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
      <el-col :sm="4" :xs="24">
          <el-select
            v-model="form.goodsBrand"
            placeholder="品牌"
            size="small"
            @change="getPP2"
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
      <el-col :sm="4" :xs="24">
          <el-select
            v-model="form.goodsBrandSeries"
            placeholder="系列"
            size="small"
            class="selectSlot2"
            clearable
          >
            <template slot="prefix">
              <span class="prefixSlot">系列</span>
            </template>
            <el-option
              v-for="item in PP2options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      <el-col :sm="4" :xs="24">
        <el-button type="primary" size="small" @click="getGoodsStock">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="3">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container d-shadow mh">
            <div class="treeTitle">分类</div>
            <div class="treeBox">
              <!-- 左侧树形菜单 -->
              <el-tree
                :data="TreeData"
                node-key="id"
                accordion
                :expand-on-click-node="true"
                :props="defaultProps"
                :default-expanded-keys="['']"
                @node-click="treeNodeClick"
                highlight-current
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="21">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="TableData"
              border
              style="width: 100%"
              size="mini"
              id="table-data"
              ref="singleTable"
              height="600px"
              header-cell-class-name="thbgc"
              :show-summary="true"
              :summary-method="getSummaries"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column width="55" align="center" property="goodsId" label="ID" sortable :sort-method="(a,b) => sortMethod(a ,b , 'goodsId')"></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="goodsItemNum"
                 :sort-method="(a,b) => sortMethod(a ,b , 'goodsItemNum')"
                width="150"
                label="货号"
              ></el-table-column>
              <el-table-column
                sortable
                align="center"
                property="goodsName"
                show-overflow-tooltip
                width="200"
                label="名称"
              >
                <template slot-scope="scope">
                  <span
                    class="bluecolor"
                    @click="goGoods(scope.row.goodsId)"
                  >{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="G_IMAGE" label="图片" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.goodsImagesUrl">
                  <el-popover
                    placement="right"
                    trigger="hover"
                    v-for="(url,i) in scope.row.goodsImagesUrl"
                    :key="i"
                  >
                    <img :src="img" class="imgs" />
                    <img
                      slot="reference"
                      :src="`${baseUrl}api${url}`"
                      @mouseover="setimg(`${baseUrl}api${url}`)"
                      @click="open(img)"
                      v-if="i<3"
                      class="tableimg"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'goodsQty')" header-align="center" align="right" property="goodsQty" label="数量"></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'goodsSalesQty')" header-align="center" align="right" property="goodsSalesQty" label="可用数量"></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'goodsInQty')" header-align="center" align="right" property="goodsInQty" label="待入数量"></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'goodsOutQty')" header-align="center" align="right" property="goodsOutQty" label="待出数量"></el-table-column>
              <el-table-column sortable align="center" property="goodsColorName" label="颜色"></el-table-column>
              <el-table-column sortable align="center" property="goodsSpec" label="规格"></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'salesPrice')" align="center" property="salesPrice" label="销售价"></el-table-column>
              <el-table-column sortable align="center" property="goodsBrandClass" label="品牌分类"></el-table-column>
              <el-table-column sortable align="center" property="goodsBrandName" label="品牌名称"></el-table-column>
              <el-table-column sortable align="center" property="goodsBrandSeries" label="品牌系列"></el-table-column>
              <el-table-column sortable align="center" property="goodsFromName" label="来源"></el-table-column>
              <el-table-column sortable prop="goodsClassA" label="一级分类" width="150" align="center"></el-table-column>
              <el-table-column sortable prop="goodsClassB" label="二级分类" width="150" align="center"></el-table-column>
              <el-table-column sortable prop="goodsStatusValue" label="在售状态" width="150" align="center"></el-table-column>
              <el-table-column sortable align="center" property="goodsNewOld" label="新旧程度"></el-table-column>
              <el-table-column sortable align="center" property="goodsMaterial" label="材质"></el-table-column>
              <el-table-column sortable align="center" property="goodsGrade" label="等级"></el-table-column>
              <el-table-column sortable align="center" property="goodsHot" label="畅销度" show-overflow-tooltip></el-table-column>
              <el-table-column
                sortable
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsCostPrice')"
                align="right"
                header-align="center"
                property="goodsCostPrice"
                v-if="vhas"
                label="成本价"
              ></el-table-column>
              <el-table-column
                sortable
                :sort-method="(a,b) => sortMethod(a ,b , 'goodsCostAmount')"
                align="right"
                header-align="center"
                property="goodsCostAmount"
                v-if="vhas"
                label="成本总价"
                width="150"
              ></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'minSalesPrice')" header-align="center" align="right" property="minSalesPrice" label="销售底价"></el-table-column>
              <el-table-column
                sortable
                :sort-method="(a,b) => sortMethod(a ,b , 'salesAmount')"
                align="right"
                header-align="center"
                width="150"
                property="salesAmount"
                label="销售总金额"
              ></el-table-column>
              <el-table-column sortable :sort-method="(a,b) => sortMethod(a ,b , 'leasePrice')" header-align="center" align="right" property="leasePrice" label="月租金"></el-table-column>
              <el-table-column sortable align="center" property="orgName" label="归属公司"></el-table-column>
              <el-table-column sortable align="center" property="wareHouseName" label="仓库名称"></el-table-column>
              <el-table-column sortable align="center" property="regDateTime" label="创建时间"></el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, total]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
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
        
        <!-- <el-col :sm="12" :xs="24">
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
        </el-col>-->
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
        <el-col :sm="24" :xs="24" align="right">
          <el-button type="primary" size="mini" @click="getGoodsStock('showBox')">查询</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <table class="table" border="1" cellspacing="0" width="100%" id="tab">
      <thead>
        <tr>
          <th>序号</th>
          <th>ID</th>
          <th>货号</th>
          <th>名称</th>
          <th>图片</th>
          <th>颜色</th>
          <th>规格</th>
          <th>数量</th>
          <th>可用数量</th>
          <th>待出库数量</th>
          <th>待入库数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,i) in TableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.goodsId}}</td>
          <td>{{item.goodsItemNum}}</td>
          <td>{{item.goodsName}}</td>
          <td>
            <img
              v-for="(url,i) in item.goodsImagesUrl"
              :key="i"
              :src="`${baseUrl}api${url}`"
              width="40"
              alt
            />
            <td>{{item.goodsColor}}</td>
            <td>{{item.goodsSpec}}</td>
            <td>{{item.goodsQty}}</td>
            <td>{{item.goodsSalesQty}}</td>
            <td>{{item.goodsOutQty}}</td>
            <td>{{item.goodsInQty}}</td>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import getDate from "../../utils/getDate";
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
      defaultProps: {
        children: "childs",
        label: "title"
      },
      showBox: false,
      GSoptions: [],
      YSoptions: [],
      TreeData: [],
      rCuidOptions: [],
      PPoptions: [],
      PP1options: [],
      PP2options: [],
      DJoptions: [],
      CXDoptions: [],
      CZoptions: [],
      CKoptions: [],
      SPFLoptions: [],
      SPFL1options: [],
      next: true,
      img: "",
      form: {
        customerId: "", // 供应商
        endPrice: "", // 成本结束价
        endSalesPrice: "", // 销售结束价
        goodsBrand: "", // 品牌
        goodsBrandSeries: '', // 系列
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
    this.gitTree();
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
      if (!obj.goodsBrandSeries) delete obj.goodsBrandSeries;
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
      // console.log(this.total);
      if (val == "xlsx") {
        obj.size = this.total;
        obj.currentPage = 1;
      }
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
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    exportTable() {
        console.log(1)
      let box = this.$xlsx.utils.table_to_book(
        document.querySelector("#table-data")
      );
      let out = this.$xlsx.write(box, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$fileSaver.saveAs(
          new Blob([out], {
            type: "application/octet-stream"
          }),
          `查库存列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    toExcel(table, e) {
      let content = document.getElementById(table).outerHTML;
      let html =
        '<html><head><meta charset="utf-8" /></head><body>' +
        content +
        "</body></html>";
      // console.log(html);
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      const blob = new Blob([html], { type: "text/excel" });
      // 利用URL.createObjectURL()方法为a元素生成blob URL
      e.target.href = URL.createObjectURL(blob);
      e.target.download = "库存.html";
    },
    gitTree() {
      let parms = {
        typeCode: "SPFL"
      };
      this.TreeData[0] = { id: "", title: "全部", childs: [] };
      this.$api.Common.getDIC(parms).then(res => {
        let item = res.data;
        this.TreeData[0].childs = item;
      });
    },
    treeNodeClick(data) {
      this.form.goodsClass = data.id;
      this.getGoodsStock();
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
    getPP2() {
      this.PP2options = []
      this.form.goodsBrandSeries = ''
      let param = {
        typeCode: "PP",
        attrCodeParent: this.form.goodsBrand,
        currentPage: 1,
        size: 999
      };
      this.$api.Common.get(param).then(res => {
        this.PP2options = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
      });
    },
    setimg(url) {
      this.img = url;
    },
    sortMethod(obj1,obj2,attr){
      if(attr=='goodsItemNum'){
        const val1 = obj1[attr]?obj1[attr].replace(/[^0-9]/ig,""):0; 
        const val2 = obj2[attr]?obj2[attr].replace(/[^0-9]/ig,""):0;
        return val1 - val2
      }
      const val1 = obj1[attr] ? obj1[attr]  : 0
      const val2 = obj2[attr] ? obj2[attr]  : 0
      return val1 - val2
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property == "goodsQty") ||
          column.property == "goodsSalesQty" ||
          column.property == "goodsCostAmount" ||
          column.property == "salesAmount"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (
            column.property == "goodsCostAmount" ||
            column.property == "salesAmount"
          ) {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
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
    goGoods(e) {
      this.$router.push({
        path: "/basicInfo/goodsedit",
        query: { gId: e }
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
.table {
  display: none;
  line-height: 20px;
  text-align: center;
  tr th,
  tr td {
    padding: 2px;
  }
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
.export {
  display: inline-block;
  width: 73px;
  height: 28px;
  line-height: 22px;
  font-size: 13px;
  color: #666;
  padding: 4px 13px;
  box-sizing: border-box;
  border: 1px solid rgb(228, 227, 227);
  border-radius: 3px;
  vertical-align: middle;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
.u_xinx span {
  position: relative;
  text-shadow: 0 1px 1px #333;
  top: -8px;
  color: #fff;
  font-size: 0.6rem;
}
</style>
