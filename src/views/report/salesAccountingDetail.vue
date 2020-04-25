<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="12">
        <ul class="timeWrapper" @click="setdate($event)">
          <li data-type="getYesterday">昨日</li>
          <li data-type="getToday" class="active">今日</li>
          <li data-type="getCurrWeekDays">本周</li>
          <li data-type="getLastWeekDays">上周</li>
          <li data-type="getCurrMonthDays">本月</li>
          <li data-type="getLastMonthDays">上月</li>
          <li data-type="getThreeMonthDays">近三月</li>
          <li data-type="getThisSeason">本季</li>
          <li data-type="getThisYearDays">本年</li>
        </ul>
      </el-col>
      <el-col :xs="24" :sm="12" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <el-button size="small" icon="el-icon-download" @click="getList('xlsx')">导出</el-button>
          <!-- <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 时间选择器 -->
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.sDate"
          type="date"
          size="small"
          placeholder="单据起始日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-date-picker
          v-model="form.eDate"
          type="date"
          size="small"
          placeholder="单据结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCuidvc"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="selectChange('rCuid',form.rCuidvc)"
          @clear="clearInput('rCuid')"
          class="selectSlot2"
        >
          <template slot="prefix">
            <span class="prefixSlot">客户</span>
          </template>
          <el-option
            v-for="(item,index) in rCuidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:300px">{{ item.label }}</span>
            <!-- <span style="float: left;">{{ item.cuadd }}</span> -->
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rCuseridvc"
          filterable
          clearable
          placeholder="请选择获客人"
          size="small"
          @change="selectChange('rCuserid',form.rCuseridvc)"
          @clear="clearInput('rCuserid')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">获客人</span>
          </template>
          <el-option
            v-for="(item,index) in rCuseridOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rHandmanvc"
          filterable
          clearable
          placeholder="请选择回收经手人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanvc)"
          @clear="clearInput('rHandman')"
          class="selectSlot5"
        >
          <template slot="prefix">
            <span class="prefixSlot">回收经手人</span>
          </template>
          <el-option
            v-for="(item,index) in rHandmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
            <span style="float: left; width:120px">{{ item.uMobile }}</span>
            <span style="float: left;">{{ item.oidValue }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.rBillingstatus"
          placeholder="请选择结算状态"
          @change="selectChange('rBillingstatus',form.rBillingstatus)"
          @clear="clearInput('rBillingstatus')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">结算状态</span>
          </template>
          <el-option
            v-for="item in rBillingstatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.rBeihuo"
          placeholder="请选择备货部门"
          @change="selectChange('rBeihuo',form.rBeihuo)"
          @clear="clearInput('rBeihuo')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">备货部门</span>
          </template>
          <el-option
            v-for="item in rBeihuoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.rSonghuo"
          placeholder="请选择送货部门"
          @change="selectChange('rSonghuo',form.rSonghuo)"
          @clear="clearInput('rSonghuo')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">送货部门</span>
          </template>
          <el-option
            v-for="item in rSonghuoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.rAnzhuang"
          placeholder="请选择安装部门"
          @change="selectChange('rAnzhuang',form.rAnzhuang)"
          @clear="clearInput('rAnzhuang')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">安装部门</span>
          </template>
          <el-option
            v-for="item in rAnzhuangOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.gpurorrecover"
          placeholder="请选择商品来源"
          @change="selectChange('gpurorrecover',form.gpurorrecover)"
          @clear="clearInput('gpurorrecover')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">商品来源</span>
          </template>
          <el-option
            v-for="item in gpurorrecoverOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">单据编号</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.gName" size="small" clearable>
          <template slot="prepend">商品名称</template>
        </el-input>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-input v-model="form.gItemnum" size="small" clearable>
          <template slot="prepend">货号</template>
        </el-input>
      </el-col>
      <!-- <el-col :sm="4" :xs="24">
        <el-input v-model="form.rItemnum" size="small" clearable>
          <template slot="prepend">商品ID</template>
        </el-input>
      </el-col> -->
      <el-col :sm="8" :xs="24">
        <el-button type="primary" size="mini" @click="getList('s')" style="float:left">查询</el-button>
        <div style="padding-left:30px;float:left;padding-top:0px">
          <el-checkbox
            v-model="form.gNeedinstall"
            label="是否安装"
            border
            size="mini"
            true-label="1"
            false-label="0"
            @change="changeCheckbox('0')"
          ></el-checkbox>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <div class="grid-content bg-purple-light">
          <div class="tableBox d-shadow">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              id="table-data"
              height="600px"
              header-cell-class-name="thbgc"
            >
              <el-table-column width="55" align="center" type="index" label="序号"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdate" label="单据日期" width="90"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="ritemnum" label="单据编号" width="150"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rtypev" label="单据类型" width="100"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rwhidv" label="仓库"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rcuid" label="客户ID" width="60"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rcuidv" label="客户"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gid" label="商品ID" width="60"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gitemnum" label="货号"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gname" label="商品名称"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gunitv" label="单位" width="50"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdquantity" label="销售数量"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdsellingprice" label="单价">
                 <template slot-scope="scope">
                  <div class="tr">
                    <span v-if="scope.row.rdsellingprice<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.rdsellingprice), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdtotalsellingprice" label="金额">
                 <template slot-scope="scope">
                  <div class="tr" v-if="scope.row.rdtotalsellingprice">
                    <span v-if="scope.row.rdtotalsellingprice<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.rdtotalsellingprice), 2) }}
                  </div>
                  <div class="tr" v-else>
                    0.00
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rbeihuov" label="备货部门"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rsonghuov" label="送货部门"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="ranzhuangv" label="安装部门"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdunitprice" label="成本价">
                 <template slot-scope="scope">
                  <div class="tr" v-has='375'>
                    <span v-if="scope.row.rdunitprice<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.rdunitprice), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rdtotalunitprice" label="成本金额">
                 <template slot-scope="scope">
                  <div class="tr" v-has='375'>
                    <span v-if="scope.row.rdtotalunitprice<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.rdtotalunitprice), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gpurorrrecoverv" label="商品来源/采购回收商品"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="gneedinstallv" label="是否安装"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rhandmanv" label="获客人"></el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rmaoli" label="毛利额">
                 <template slot-scope="scope">
                  <div class="tr" v-has='375'>
                    <span v-if="scope.row.rmaoli<0">-</span>
                    {{ $PublicJS.money(Math.abs(scope.row.rmaoli), 2) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" show-overflow-tooltip property="rmaolilv" label="毛利率">
                 <template slot-scope="scope">
                  <div class="tr" v-has='375'>
                    {{ scope.row.rmaolilv }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, total]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <br />
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import moment from "moment";
export default {
  name: "salesAccountingDetail",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rCuidOptions: [],
      rCuseridOptions: [],
      rHandmanOptions: [],
      rBillingstatusOptions: [
        { label: "已结算", value: "1" },
        { label: "未结算", value: "2" }
      ],
      rBeihuoOptions: [
        { label: "仓库组", value: "1" },
        { label: "送货组", value: "2" },
        { label: "其他", value: "3" }
      ],
      rSonghuoOptions: [
        { label: "仓库组", value: "1" },
        { label: "送货组", value: "2" },
        { label: "其他", value: "3" }
      ],
      rAnzhuangOptions: [
        { label: "仓库组", value: "1" },
        { label: "送货组", value: "2" },
        { label: "其他", value: "3" }
      ],
      gpurorrecoverOptions: [
        { label: "采购", value: "1" },
        { label: "回收", value: "2" },
        { label: "其他", value: "3" }
      ],
      form: {
        rCuidvc: "",
        rCuid: "",
        rCuseridvc: "",
        rCuserid: "",
        rHandman: "",
        rHandmanvc: "",
        sDate: "",
        eDate: "",
        rItemnum: "",
        gItemnum:'',
        rBeihuo: "",
        rSonghuo: "",
        rAnzhuang: "",
        gNeedinstall: "",
        rBillingstatus:'',
        gpurorrecover:'',
        gName:''
      },
      loading: false,
      sumincome: 0,
      sumoutcome: 0,
      sumbeginning: 0,
      sumending: 0,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.sDate = getDate.getToday().starttime;
    this.form.eDate = getDate.getToday().endtime;
    // 获客人
    this.$api.User.get({ size: 9999, auth: 2 }).then(res => {
      if (res.code == 200) {
        this.rCuseridOptions = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uId,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
        this.rHandmanOptions = res.data.records.map(item => {
          return {
            label: item.uName,
            value: item.uId,
            oidValue: item.oidValue,
            uMobile: item.uMobile
          };
        });
      }
    });
    this.getList();
  },
  methods: {
    remoteMethod(query) {
      if (query < 10) {
        return false;
      }
      if (query) {
        this.loading = true;
        this.$api.Customer.query({
          size: 9999,
          auth: 2,
          name: query
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.rCuidOptions = [];
            res.data.records.map(item => {
              if (item.cuDiv != 2) {
                //过滤物流公司
                this.rCuidOptions.push({
                  label: item.cuName,
                  value: item.cuId
                });
              }
            });
          }
        });
      } else {
        this.rCuidOptions = [];
      }
    },
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "查询中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = this.form;
      if (!this.form.rCuid) delete params.rCuid;
      if (!this.form.rCuidvc) delete params.rCuidvc;
      if (!this.form.rCuserid) delete params.rCuserid;
      if (!this.form.rCuseridvc) delete params.rCuseridvc;
      if (!this.form.rHandman) delete params.rHandman;
      if (!this.form.rHandmanvc) delete params.rHandmanvc;
      if (!this.form.rItemnum) delete params.rItemnum;
      if (!this.form.rBeihuo) delete params.rBeihuo;
      if (!this.form.rSonghuo) delete params.rSonghuo;
      if (!this.form.rAnzhuang) delete params.rAnzhuang;
      if (!this.form.gNeedinstall) delete params.gNeedinstall;
      if (!this.form.rBillingstatus) delete params.rBillingstatus;
      if (!this.form.gpurorrecover) delete params.gpurorrecover;
      if (!this.form.gItemnum) delete params.gItemnum;
      if (!this.form.gName) delete params.gName;
      
      params.size = this.pageSize;
      params.currentPage = this.currentPage;
      if (val == "s") {
        params.currentPage = 1;
      }
      if (val == "xlsx") {
        params.currentPage = 1;
        params.size = this.total;
      }
      params.sDate = moment(this.form.sDate).format("YYYY-MM-DD");
      params.eDate = moment(this.form.eDate).format("YYYY-MM-DD");
      this.$api.Stat.statxshsmxNew(params).then(res => {
        loading.close();
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.currentPage = res.data.current;
          if (res.data.records.length) {
            this.sumoutcome = res.data.records[0].sumoutcome;
            this.sumincome = res.data.records[0].sumincome;
            this.sumbeginning = res.data.records[0].sumbeginning;
            this.sumending = res.data.records[0].sumending;
          }
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        } else {
          this.$message({ message: res.err, type: "error" });
        }
      })
      .catch(error => {
        loading.close();
      });
    },
    changeCheckbox() {
      this.getList({ gNeedinstall: this.form.gNeedinstall });
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
          `商品销售明细${getDate.getToday().starttime}.xlsx`
        );
      } catch (e) {
        // 错误处理方式
      }
      return out;
    },
    // 日期查询
    setdate(e) {
      if (e.target.nodeName === "LI") {
        document.querySelectorAll("ul.timeWrapper .active")[0].className = "";
        e.target.className = "active";
        let fn = e.target.dataset.type;
        this.form.sDate = getDate[fn]().starttime;
        this.form.eDate = getDate[fn]().endtime;
        this.getList("s");
      }
    },
    clearInput(val) {
      this.form[val] = "";
    },
    selectChange(m, val) {
      if (val) {
        let obj = {};
        obj = this[m + "Options"].find(item => {
          return item.value === val; //筛选出匹配数据
        });
        this.form[m + "vc"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style>
.has-gutter td div {
  text-align: right;
}
.el-checkbox__label{
  line-height:22px !important
}
</style>