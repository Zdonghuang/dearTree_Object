<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="4">
        <el-date-picker
          v-model="form.sDate"
          value-format="yyyy-MM-dd"
          type="date"
          size="small"
          placeholder="操作日期（起）"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-date-picker
          v-model="form.eDate"
          value-format="yyyy-MM-dd"
          type="date"
          size="small"
          placeholder="操作日期（止）"
        ></el-date-picker>
      </el-col>
      <el-col :sm="4" :xs="24">
        <el-select
          v-model="form.rHandmanv"
          filterable
          clearable
          placeholder="请选择操作人"
          size="small"
          @change="selectChange('rHandman',form.rHandmanv)"
          @clear="clearInput('rHandman')"
          class="selectSlot3"
        >
          <template slot="prefix">
            <span class="prefixSlot">操作人</span>
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
      <!-- <el-col :xs="24" :sm="4">
        <el-select v-model="form.options" placeholder="请选择操作类型" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <el-col :xs="24" :sm="4">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getLog">查询</el-button>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      :data="TableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      ref="singleTable"
      highlight-current-row
      size="mini"
      height="600"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="55" align="center" property="index" label="序号"></el-table-column>
      <el-table-column sortable show-overflow-tooltip property="utime" align="center" label="时间"></el-table-column>
      <el-table-column sortable show-overflow-tooltip property="uid" align="center" label="操作员ID"></el-table-column>
      <el-table-column sortable show-overflow-tooltip property="uname" align="center" label="操作员"></el-table-column>
      <el-table-column sortable show-overflow-tooltip property="uip" align="center" label="IP"></el-table-column>
    </el-table>
    <div class="paginationBox">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 30, 40, total]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      TableData: [],
      currentPage: 1, //初始页
      size: 20, //    每页的数据
      total: 0,
      rHandmanOptions: [],
      form: {
        rHandman: "",
        rHandmanv: "",
        sDate: "",
        eDate: ""
      }
    };
  },
  created() {
    // 签单人
    this.$api.User.get({ size: 9999, auth: 2 }).then(res => {
      if (res.code == 200) {
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

    this.getLog();
  },
  methods: {
    // 商品列表
    getLog() {
      let obj = {
        currentPage: this.currentPage,
        size: this.size
      };
      if (this.form.rHandmanv) {
        obj.rHandman = this.form.rHandman;
      }
      if (this.form.sDate) {
        obj.sDate = this.form.sDate;
      }
      if (this.form.eDate) {
        obj.eDate = this.form.eDate;
      }
      this.$api.Stat.loginlog(obj).then(res => {
        this.TableData = [];
        res.data.records.map(item => {
          item.utime =
            item.utime.split(" ")[0] +
            " " +
            item.utime.split(" ")[1].replace(/\-/g, ":");
        });
        this.TableData = res.data.records;
        this.total = res.data.total;
      });
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
        this.form[m + "v"] = obj.label; //获取label
        this.form[m] = obj.value; //获取value
      }
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.size = size;
      this.getLog();
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getLog();
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
</style>
