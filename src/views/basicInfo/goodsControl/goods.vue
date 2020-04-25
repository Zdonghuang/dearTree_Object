<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :sm="24" :xs="24" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            @click="opendialog('showAddGoods','')"
            v-has="702"
          >新增</el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="opendialogs('showSetPrice')"
            v-has="709"
          >批量改价格</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button
            size="mini"
            icon="el-icon-download"
            v-has="704"
            @click="gitGoodsTable('xlsx')"
          >导出</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="4" :xs="24">
        <el-input placeholder="名称" v-model="form.name" size="mini" clearable>
          <template slot="prepend">名称</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="货号" v-model="form.gitemnum" size="mini" clearable>
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input
          placeholder="供应商"
          v-model="form.supplieridv"
          size="mini"
          :clearable="true"
          @clear="clear(2)"
        >
          <template slot="prepend">供应商</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialogs('showSelectClient','')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input
          placeholder="品牌"
          v-model="form.gbrandname"
          size="mini"
          clearable
          @clear="clear('gbrand')"
        >
          <template slot="prepend">品牌</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialogs('showSelectBrand','')"
          ></i>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="规格" v-model="form.spec" size="mini" clearable>
          <template slot="prepend">规格</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="成本起始价" v-model="form.unitprices" size="mini" clearable>
          <template slot="prepend">起始价</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input placeholder="成本结束价" v-model="form.unitpricee" size="mini" clearable>
          <template slot="prepend">结束价</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select v-model="form.color" placeholder="颜色" size="mini" class="selectSlot4" clearable>
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
        <el-select v-model="form.dj" placeholder="等级" size="mini" class="selectSlot4" clearable>
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
      <el-col :sm="4" :xs="24">
        <el-select v-model="form.cs" placeholder="成色" size="mini" class="selectSlot4" clearable>
          <template slot="prefix">
            <span class="prefixSlot">成色</span>
          </template>
          <el-option
            v-for="item in CSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select v-model="form.cz" placeholder="材质" size="mini" class="selectSlot4" clearable>
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
      <el-col :sm="4" :xs="24">
        <el-select v-model="form.cxd" placeholder="畅销度" size="mini" class="selectSlot4" clearable>
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

      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.brandclass"
          placeholder="品牌"
          size="mini"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">品牌</span>
          </template>
          <el-option
            v-for="item in PPoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.companyId"
          placeholder="所属公司"
          size="mini"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">所属公司</span>
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
          v-model="form.purorrecover"
          placeholder="来源"
          size="mini"
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
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.gstatus"
          placeholder="在售状态"
          size="mini"
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
      <el-col :sm="2" :xs="24">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="gitGoodsTable">查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
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
                :default-expanded-keys="[this.oid]"
                @node-click="treeNodeClick"
                highlight-current
              ></el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="20">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <!-- 表格 -->
            <el-table
              :data="TableData"
              border
              style="width: 100%"
              empty-text="暂无数据"
              ref="singleTable"
              highlight-current-row
              id="table-data"
              size="mini"
              height="600"
              header-cell-class-name="thbgc"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="40" align="center"></el-table-column>
              <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
              <el-table-column sortable label="商品ID" width="55" align="center" prop="gId"></el-table-column>
              <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="copy('showAddGoods',scope.row)"
                    v-has="702"
                  >复制</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="opendialog('showAddGoods',scope.row)"
                    v-has="702"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.gStatus == 1"
                    type="text"
                    size="mini"
                    @click="stGoods(scope.row)"
                    v-has="702"
                  >
                    <span class="red">停售</span>
                  </el-button>
                  <el-button v-else type="text" size="mini" @click="stGoods(scope.row)">在售</el-button>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gPurorrecover"
                label="商品来源"
                align="center"
                width="100"
              >
                <template slot-scope="scope">{{scope.row.gPurorrecover==1?'采购':'回收' }}</template>
              </el-table-column>
              <el-table-column prop="gItemnum" label="货号" align="center" width="100">
                <template slot="header" slot-scope="scope">
                  <span>货号</span>
                  <span>
                    <i
                      v-if="orderclass==2"
                      class="fa fa-sort-asc bluecolor"
                      @click="setclass(scope.row)"
                    ></i>
                    <i v-else class="fa fa-sort-desc bluecolor" @click="setclass(scope.row)"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.gImage">
                  <el-popover
                    placement="right"
                    trigger="hover"
                    v-for="(url,i) in scope.row.gImage"
                    :key="i"
                  >
                    <img :src="img" class="imgs" />
                    <img
                      slot="reference"
                      :src="`${baseUrl}api${url}`"
                      @mouseover="setimg(`${baseUrl}api${url}`)"
                      v-if="i<3"
                      @click="open(img)"
                      class="tableimg"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gId"
                label="名称"
                width="150"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="bluecolor"
                    @click="look('showAddGoods',scope.row)"
                  >{{scope.row.gName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gSpec"
                label="规格"
                width="120"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gColorv"
                label="颜色"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gPzysv"
                label="配置样式"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gBrandv"
                label="品牌名称"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gBrandseriesv"
                label="品牌系列"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column sortable prop="gCz" label="材质" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="gCs" label="成色" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="gDj" label="等级" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column
                sortable
                prop="gOidv"
                label="所属公司"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{scope.row.gOidv}}</span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="gStatusv" label="状态" width="80" align="center">
                <template slot-scope="scope">
                  <el-tag
                    effect="dark"
                    :type=" scope.row.gStatus | gStatusClass"
                    size="mini"
                  >{{ scope.row.gStatus | gStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gClassv"
                label="一级分类"
                align="center"
                show-overflow-tooltip
              >
                <template
                  slot-scope="scope"
                >{{scope.row.gClassv?scope.row.gClassv.split('->')[0]:''}}</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gClassv"
                label="二级分类"
                align="center"
                show-overflow-tooltip
              >
                <template
                  slot-scope="scope"
                >{{scope.row.gClassv?scope.row.gClassv.split('->')[1]:''}}</template>
              </el-table-column>

              <el-table-column
                sortable
                prop="gNeedinstall"
                label="是否安装"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.gNeedinstall?'是':'否'}}</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gBrandclass"
                label="品牌分类"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gCxd"
                label="畅销度"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                sortable
                prop="gSupplierv"
                label="供应商"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gUnitv"
                label="单位"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="gNewoldv"
                label="年限"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                sortable
                prop="iReserveprice"
                label="销售最低价"
                width="120"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable prop="iSellingprice" label="销售价" width="120" align="center"></el-table-column>
              <el-table-column sortable label="成本价" align="center" prop="iUnitprice" v-if="vhas"></el-table-column>
              <el-table-column sortable label="租赁价" align="center" prop="iRentprice"></el-table-column>
              <el-table-column
                sortable
                prop="gCtime"
                label="时间"
                width="120"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{ scope.row.gCtime.split('T')[0] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="gRemark"
                label="备注"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100,total]"
                layout="total, sizes, prev, pager, next, jumper"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="批量修改价格"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSetPrice"
      width="60%"
    >
      <div style="padding:20px;margin:0 auto;text-align: center;">
        <el-table
          :data="TableData2"
          border
          style="width: 100%"
          empty-text="暂无数据"
          ref="singleTable"
          highlight-current-row
          id="table-data"
          size="mini"
          header-cell-class-name="thbgc"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column sortable label="商品ID" width="80" align="center" prop="gId"></el-table-column>
          <el-table-column prop="gItemnum" label="货号" align="center" width="100"></el-table-column>
          <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
            <template slot-scope="scope" v-if="scope.row.gImage">
              <el-popover
                placement="right"
                trigger="hover"
                v-for="(url,i) in scope.row.gImage"
                :key="i"
              >
                <img :src="img" class="imgs" />
                <img
                  slot="reference"
                  :src="`${baseUrl}api${url}`"
                  @mouseover="setimg(`${baseUrl}api${url}`)"
                  v-if="i<3"
                  @click="open(img)"
                  class="tableimg"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column sortable label="商品名称" width="200" align="center" prop="gName"></el-table-column>
          <el-table-column sortable label="销售价" align="center" prop="iSellingprice">
            <template slot-scope="scope">
              <div>
                <input
                  type="text"
                  v-model="scope.row.iSellingprice"
                  class="ipt tr pr30"
                  @blur="iptBlur(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable label="最低价" align="center" prop="iReserveprice">
            <template slot-scope="scope">
              <div>
                <input
                  type="text"
                  v-model="scope.row.iReserveprice"
                  class="ipt tr pr30"
                  @blur="iptBlur(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column sortable label="成本价" align="center" prop="iUnitprice">
            <template slot-scope="scope">
              <div>
                <input
                  type="text"
                  v-model="scope.row.iUnitprice"
                  class="ipt tr pr30"
                  @blur="iptBlur(scope.row)"
                />
              </div>
            </template>
          </el-table-column>-->
          <el-table-column sortable label="租赁价" align="center" prop="iRentprice">
            <template slot-scope="scope">
              <div>
                <input
                  type="text"
                  v-model="scope.row.iRentprice"
                  class="ipt tr pr30"
                  @blur="iptBlur(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <br />
        <el-button type="primary" @click="setPrice()" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="品牌"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBrand"
      width="40%"
    >
      <selectBrand @emitBrandData="emitBrandData"></selectBrand>
    </el-dialog>

    <el-dialog
      title="供应商"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectGoodsSupplier @emitGoodsSupplierData="emitClientData" status="12"></selectGoodsSupplier>
    </el-dialog>
  </div>
</template>
<script>
import getDate from "../../../utils/getDate";
import selectBrand from "@/components/dialog/SelectBrand";
import SelectGoodsSupplier from "@/components/dialog/SelectGoodsSupplier";
import { constants } from "crypto";
export default {
  name: "goods",
  inject: ["reload"],
  components: {
    selectBrand,
    SelectGoodsSupplier
  },
  data() {
    return {
      oid: "",
      TreeData: [],
      TableData2: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      TableData: [],
      showSelectBrand: false,
      showSelectClient: false,
      showSetPrice: false,
      updateGoodsFrom: {},
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      gstatus: [],
      GSoptions: [],
      img: "",
      orderclass: 1,
      ok: true,
      YSoptions: [],
      DJoptions: [],
      CSoptions: [],
      CZoptions: [],
      CXDoptions: [],
      PPoptions: [],
      multipleSelection: "",
      SetPriceval: {},
      form: {
        gstatus: "",
        gbrand: "",
        gbrandname: "",
        gclass: "",
        color: "",
        gnewold: "",
        purorrecover: "",
        companyId: "",
        supplieridv: "",
        supplierid: "",
        order: "",
        unitprices: "",
        unitpricee: "",
        spec: "",
        dj: "",
        cs: "",
        cz: "",
        cxd: "",
        brandclass: "",
        showInput: true
      },
      vhas: true
    };
  },
  created() {
    this.showInput =
      JSON.parse(sessionStorage.getItem("state")).permissions.indexOf("375") >
      -1
        ? false
        : true;
    this.oid = this.$route.query.oid ? this.$route.query.oid : "";
    this.form.companyId = this.$storage.companyId;
    this.gitTree();
    this.gitStatus();
    this.gitGoodsTable();
    this.getGoodsGS();
    this.getGoodsYS();
    this.getGoodsCS();
    this.getGoodsCXD();
    this.getGoodsDJ();
    this.getGoodsCZ();
    this.getGoodsPP();
    // 成本金额权限设置
    let vhas = this.$storage.permissions;
    if (vhas.indexOf("375") == -1) {
      this.vhas = false;
    }
  },
  methods: {
    iptBlur(val) {
      if (
        isNaN(val.iSellingprice) ||
        isNaN(val.iReserveprice) ||
        isNaN(val.iUnitprice) ||
        isNaN(val.iRentprice)
      ) {
        this.$message({
          type: "error",
          message: "请输入数字"
        });
      }
    },
    // 批量修改价格
    setPrice() {
      this.$confirm("此操作将批量修改价格，是否继续？", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "批量修改中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.TableData2.forEach(item => {
            let param = {
              gId: item.gId,
              gName: item.gName,
              gSellingprice: item.iSellingprice, //销售价
              gReserveprice: item.iReserveprice, //最低价
              gUnitprice: item.iUnitprice, //成本价
              gRentprice: item.iRentprice //租赁价
            };

            this.$api.Goods.update(param).then(res => {});
          });
          loading.close();
          this.showSetPrice = false;
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.$nextTick(() => {
            this.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getJsonLength(jsonData) {
      var jsonLength = 0;
      for (var item in jsonData) {
        jsonLength++;
      }
      return jsonLength;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //成色
    getGoodsCS() {
      let parms = {
        typeCode: "CS"
      };
      this.$api.Common.get(parms).then(res => {
        this.CSoptions = res.data.map(item => {
          return {
            label: item.cAttrvalue,
            value: item.cAttrcode
          };
        });
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
    },
    //畅销度
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
    exportTable() {
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
          `商品列表${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        console.log(e);
        // 错误处理方式
      }
      return out;
    },
    gitGoodsTable(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let param = {};
      param.distinctwhid = "1";
      param.currentPage = this.currentPage;
      param.size = this.pageSize;
      //所属公司
      if (this.oid) param.gclass = this.oid;
      if (this.form.companyId) param.oid = this.form.companyId;
      if (this.form.name) param.name = this.form.name;
      if (this.form.color) param.color = this.form.color;
      //货号
      if (this.form.gitemnum) param.gitemnum = this.form.gitemnum;
      //品牌
      if (this.form.gbrand) param.gbrand = this.form.gbrand;
      //状态
      if (this.form.gstatus) param.gstatus = this.form.gstatus;
      //颜色
      if (this.form.supplierid) param.supplierid = this.form.supplierid;
      if (this.form.spec) param.spec = this.form.spec;
      // 来源
      if (this.form.purorrecover) param.purorrecover = this.form.purorrecover;
      if (this.form.unitprices) param.unitprices = this.form.unitprices;
      if (this.form.dj) param.dj = this.form.dj;
      if (this.form.cs) param.cs = this.form.cs;
      if (this.form.cz) param.cz = this.form.cz;
      if (this.form.cxd) param.cxd = this.form.cxd;
      if (this.form.brandclass) param.brandclass = this.form.brandclass;
      param.oid = this.form.companyId;
      if (this.form.order) {
        param.orderby = "uuu.g_itemnum";
        param.order = this.form.order;
      }
      if (val == "xlsx") {
        param.size = this.total;
        param.currentPage = 1;
      }
      this.$api.Goods.queryForAdmin(param).then(res => {
        loading.close();
        this.TableData = [];
        this.ok = true;
        if (res.data) {
          res.data.records.map((item, i) => {
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
          });
          this.TableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        }
      });
    },
    //根据状态区分颜色
    tableRowClassName({ row }) {
      if (row.gStatus === 2) {
        return "tingshou-row";
      }
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
    setclass(row) {
      const $singleTable = this.$refs.singleTable;
      $singleTable.toggleRowExpansion(row);
      $singleTable.toggleRowSelection(row);
      if (this.orderclass == 1) {
        this.form.order = "asc";
        this.orderclass = 2;
      } else {
        this.form.order = "desc";
        this.orderclass = 1;
      }
      if (this.ok) {
        this.ok = false;
        this.gitGoodsTable();
      }
    },
    //状态
    gitStatus() {
      let parms = {
        typeCode: "ZSZT"
      };
      this.$api.Common.getMenu(parms).then(res => {
        let item = res.data;
        this.gstatus = item;
      });
    },
    //添加/编辑
    opendialog(n, m) {
      if (m.gId) {
        this.updateGoodsFrom = m;
      } else {
        this.updateGoodsFrom = {};
      }
      this.$router.push({
        path: "goodsedit",
        query: {
          gId: this.updateGoodsFrom.gId,
          oid: this.$route.query.oid ? this.$route.query.oid : ""
        }
      });
    },
    copy(n, m) {
      if (m.gId) {
        this.updateGoodsFrom = m;
      } else {
        this.updateGoodsFrom = {};
      }
      this.$router.push({
        path: "goodsedit",
        query: { gId: this.updateGoodsFrom.gId, copy: 1 }
      });
    },
    open(v) {
      window.open(v, "_blank");
    },
    clear(v) {
      if (v == 1) {
        this.form.gbrand = "";
        this.form.gbrandname = "";
      } else {
        this.form.gbrand = "";
        this.form.gbrandname = "";
      }
    },
    look(n, m) {
      if (m.gId) {
        this.updateGoodsFrom = m;
      } else {
        this.updateGoodsFrom = {};
      }
      this.$router.push({
        path: "goodsedit",
        query: { gId: this.updateGoodsFrom.gId, look: 1 }
      });
    },
    //显示弹窗
    opendialogs(n) {
      if (!this.multipleSelection && n == "showSetPrice") {
        this.$message({
          type: "error",
          message: "请勾选商品"
        });
        return false;
      }
      if (n == "showSetPrice") {
        this.TableData2 = this.multipleSelection;
        console.log(this.TableData2);
      }

      this[n] = true;
    },
    // 树形菜单
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
    emitClientData(v) {
      if (v) {
        this.form.supplieridv = v.cuName;
        this.form.supplierid = v.cuId;
      }
      this.showSelectClient = false;
    },
    setprice(data) {},
    // 商品列表
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.$router.push(`/basicInfo/goods?oid=${data.id}`);
      this.oid = data.id;
      this.gitGoodsTable();
    },
    emitBrandData(val) {
      if (val) {
        this.form.gbrand = val.cAttrcode;
        this.form.gbrandname = val.cAttrvalue;
      }
      this.showSelectBrand = false;
    },
    //停用
    stGoods(e) {
      this.$confirm("此操作将启用/停用，是否继续？", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let parms = {
            gId: e.gId
          };
          if (e.gStatus != 1) {
            parms["gStatus"] = 1;
            e.gStatus = 1;
          } else {
            parms["gStatus"] = 2;
            e.gStatus = 2;
          }
          this.$api.Goods.update(parms).then(res => {
            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.gitGoodsTable();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.gitGoodsTable();
    },
    setimg(u) {
      this.img = u;
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.gitGoodsTable();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>

<style scoped>
.imgs {
  width: 600px;
}
.bluecolor {
  color: rgb(0, 183, 255);
  text-decoration: underline;
  cursor: pointer;
}
.selectSlot4 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot2 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.selectSlot3 .prefixSlot {
  line-height: 30px;
  color: rgb(128, 127, 127);
}
.pr30 {
  padding-right: 20px;
}
</style>