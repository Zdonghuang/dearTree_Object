<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" align="left">
        <el-input placeholder="名称" v-model="form.name" size="mini">
          <template slot="prepend">名称</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" align="left">
        <el-input v-model="form.rWhidv" size="mini" :disabled="form.rWhidv?true:false">
          <template slot="prepend">仓库</template>
          <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" align="left">
        <el-input v-model="form.gitemnum" size="mini">
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6" align="left">
        <el-input v-model="form.spec" size="mini">
          <template slot="prepend">规格</template>
        </el-input>
      </el-col>
      <el-col :sm="6" :xs="24">
        <el-select
          v-model="form.color"
          placeholder="商品颜色"
          size="mini"
          class="selectSlot4"
          clearable
        >
          <template slot="prefix">
            <span class="prefixSlot">商品颜色</span>
          </template>
          <el-option
            v-for="item in YSoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- <el-col :xs="24" :sm="5" align="left">
        <el-input v-model="form.gbrand" size="mini">
          <template slot="prepend">品牌</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>-->
      <el-col :xs="24" :sm="4" align="left">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        <!-- <el-button type="warning" size="mini" icon="el-icon-plus" @click="openadd">新增</el-button> -->
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="5">
        <div class="treebor">
          <div class="treeTitle">分类</div>
          <div class="treeBox">
            <!-- 左侧树形菜单 -->
            <el-tree
              :data="TreeData"
              node-key="id"
              accordion
              :expand-on-click-node="true"
              :highlight-current="true"
              :default-expanded-keys="['']"
              :props="defaultProps"
              @node-click="treeNodeClick"
            ></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="18" :offset="1">
        <div class>
          <!-- 表格 -->
          <el-table
            :data="goodsTableData"
            border
            highlight-current-row
            style="width: 100%"
            size="mini"
            height="300px"
            @row-click="rowclick"
            @row-dblclick="dbrowclick"
            header-cell-class-name="thbgc"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" v-if="hashave"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column sortable
              prop="iQuantitycanout"
              label="数量"
              width="120"
              align="center"
              v-if="show"
            ></el-table-column>
            <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
              <template slot-scope="scope" v-if="scope.row.gImage">
                <el-popover
                  placement="right"
                  trigger="hover"
                  v-for="(url,i) in scope.row.gImage"
                  :key="i"
                >
                  <img :src="img" width="240" />
                  <img
                    slot="reference"
                    :src="`${baseUrl}api${url}`"
                    @mouseover="setimg(`${baseUrl}api${url}`)"
                    v-if="i<3"
                    class="tableimg"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column sortable
              prop="gName"
              label="商品名称"
              width="150"
              align="left"
              show-overflow-tooltip
            ></el-table-column>
          <el-table-column sortable align="center" property="gPzysv" show-overflow-tooltip label="配置"></el-table-column>
            <el-table-column sortable prop="gColorv" label="颜色" width="100" align="center"></el-table-column>
            <el-table-column sortable prop="gItemnum" label="商品货号" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gBrandv" label="品牌" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gSpec" label="规格" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gSupplierv" label="供应商" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gUnitv" label="单位" width="80" align="center"></el-table-column>
            <el-table-column sortable prop="gClassv" label="类型" width="100" align="center"></el-table-column>
            <el-table-column sortable prop="gNewoldv" label="新旧程度" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gStatusv" label="商品状态" width="120" align="center"></el-table-column>
            <el-table-column sortable prop="gCtime" label="时间" width="120" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.gCtime.split('T')[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable prop="gRemark" label="备注" width="120" align="center"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <div class="paginationBox">
      <el-col :xs="24" :sm="20">
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
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button size="mini" @click="dialogBtn('1')">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogBtn('2')">确 定</el-button>
      </el-col>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
export default {
  props: {
    salesRES: {
      default: ""
    },
    rWhidv: {
      default: ""
    },
    rWhid: {
      default: ""
    },
    show: {
      default: true
    },
    have: {
      default: 0
    },
    purorrecover: {
      default: ""
    },
    havecanout: {
      default: 1
    },
    havemeterial: {
      default: 1
    },
    distinctwhid:{
      default: 0
    },
    idList: {
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      TreeData: [],
      defaultProps: {
        children: "childs",
        label: "title"
      },
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0, //总条数
      form: {
        name: "",
        whid: "",
        rWhidv: "",
        gclass: "",
        gstatus: "",
        gbrand: "",
        purorrecover: "",
        gitemnum: "",
        color: "",
        spec: ""
      },
      img: "",
      oid: "",
      goodsTableData: [],
      dataList: [],
      hashave: true,
      YSoptions: []
    };
  },
  created() {
    this.form.rWhidv = this.$props.rWhidv;
    this.form.whid = this.$props.rWhid;
    this.form.purorrecover = this.$props.purorrecover;
    this.gitTree();
    // this.getGoods();
  },
  watch: {
    rWhidv: {
      handler: function(news, old) {
        this.form.rWhidv = news;
      },
      deep: true,
      immediate: true
    },
    rWhid: {
      handler: function(news, old) {
        this.form.whid = news;
        this.getGoods();
      },
      deep: true,
      immediate: true
    },
    have: {
      handler: function(news, old) {
        if (news == 1) {
          this.hashave = false;
        } else {
          this.hashave = true;
        }
      },
      deep: true,
      immediate: true
    },
    idList: {
      handler: function(n, o) {
        if (n) {
          this.form.rWhidv = this.$props.rWhidv;
          this.form.whid = this.$props.rWhid;
          this.form.purorrecover = this.$props.purorrecover;
          this.dataList = n;
          // this.getGoods();
          this.getGoodsYS();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
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
    // 树形菜单
    gitTree() {
      let parms = {
        typeCode: "SPFL",
        whid: this.form.whid
      };
      this.TreeData[0] = { id: "", title: "全部", childs: [] };
      this.$api.Common.getDIC(parms).then(res => {
        this.TreeData[0].childs = res.data;

        if (this.$props.salesRES) {
          // 传salesRES  删除原材料类/非商品类 默认为空
          this.TreeData[0].childs.splice(7, 2);
        }
      });
    },
    // 树形菜单节点点击
    treeNodeClick(data) {
      this.form.gclass = data.id;
      this.getGoods();
    },
    // 查询
    search() {
      this.getGoods();
    },
    // 商品列表
    getGoods() {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = JSON.parse(JSON.stringify(this.form));
      if (!params.name) delete params.name;
      if (!params.whid) delete params.whid;
      if (!params.gclass) delete params.gclass;
      if (!params.gbrand) delete params.gbrand;
      if (!params.gitemnum) delete params.gitemnum;
      if (!params.color) delete params.color;
      if (!params.spec) delete params.spec;
      if (!params.purorrecover) delete params.purorrecover;
      if(this.$props.distinctwhid){
        params.distinctwhid = 1;
      }
      delete params.rWhidv;
      params.gstatus = 1;
      params.havecanout = this.$props.havecanout;
      params.havemeterial=this.$props.havemeterial
      if (params.purorrecover) {
        delete params.havecanout;
      }
      params.currentPage = this.currentPage;
      params.size = this.pageSize;
      this.$api.Goods.query(params).then(res => {
        loading.close();
        this.goodsTableData = [];
        res.data.records.map((item, i) => {
          if (item.gImage && item.gImage.length) {
            item.gImage = item.gImage.split(",");
          } else if (!item.gImage) {
            this.gImage = [];
          }
          if (this.dataList.includes(item.gId)) {
            return this.goodsTableData.splice(i, 1);
          }
          this.goodsTableData.push(item);
        });
        this.currentPage = res.data.current;
        this.pageSize = res.data.size;
        this.total = res.data.total;
      });
    },
    setimg(url) {
      this.img = url;
    },
    rowclick(row) {
      this.thisRowData = row;
    },
    openadd() {
      this.$emit("openadd");
    },
    dbrowclick(row) {
      this.thisRowData = row;
      this.dialogBtn("2");
    },
    handleSelectionChange(val) {
      if (val.length == 1) {
        this.thisRowData = val[0];
      } else {
        this.thisRowData = val;
      }
    },
    dialogBtn(val) {
      if (val === "1") {
        this.$emit("emitGoodsData", false);
      }
      if (val === "2") {
        if (this.thisRowData) {
          this.$emit("emitGoodsData", this.thisRowData);
        } else {
          this.$message({
            message: "请选择一行数据",
            type: "warning"
          });
        }
      }
    },
    //每页下拉显示条数
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getGoods();
    },
    //页码切换
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getGoods();
    }
  }
};
</script>
<style scoped>
</style>