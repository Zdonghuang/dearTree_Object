<template>
  <div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <h3 style="text-align:center">资金确认单</h3>
    <div v-if="!$route.query.show">
      <table class="table" border="1" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>行号</th>
            <th>单据日期</th>
            <th>单据类型</th>
            <th>往来单位</th>
            <th>经手人</th>
            <th>账户</th>
            <th>收入</th>
            <th>支出</th>
            <th>备注</th>
            <th>签名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,i) in tableData" :key="i">
            <td v-if="i==tableData.length-1">合计</td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1">{{prive.toFixed(2)}}</td>
            <td v-if="i==tableData.length-1">{{prive1.toFixed(2)}}</td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>

            <td v-if="i!=tableData.length-1">{{i+1}}</td>
            <td v-if="i!=tableData.length-1">{{item.rdate}}</td>
            <td v-if="i!=tableData.length-1">{{item.rname}}</td>
            <td v-if="i!=tableData.length-1">{{item.cuname}}</td>
            <td v-if="i!=tableData.length-1">{{item.rhandmanv}}</td>
            <td v-if="i!=tableData.length-1">{{item.bankname}}</td>
            <td v-if="i!=tableData.length-1">{{item.incomeMoney.toFixed(2)}}</td>
            <td v-if="i!=tableData.length-1">{{item.outcomeMoney.toFixed(2)}}</td>
            <td v-if="i!=tableData.length-1" class="bz" style="width:20%">{{item.rremarkmain}}</td>
            <td v-if="i!=tableData.length-1" style="width:100px"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table class="table" border="1" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>行号</th>
            <th>单据日期</th>
            <th>单据类型</th>
            <th>往来单位</th>
            <th>经手人</th>
            <th>账户</th>
            <th>收入</th>
            <th>支出</th>
            <th>备注</th>
            <th>签名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,i) in tableData" :key="i">
            <td v-if="i==tableData.length-1">合计</td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1">{{prive.toFixed(2)}}</td>
            <td v-if="i==tableData.length-1">{{prive1.toFixed(2)}}</td>
            <td v-if="i==tableData.length-1"></td>
            <td v-if="i==tableData.length-1"></td>

            <td v-if="i!=tableData.length-1">{{i+1}}</td>
            <td v-if="i!=tableData.length-1">{{item.financeDateTime}}</td>
            <td v-if="i!=tableData.length-1">{{item.orderType}}</td>
            <td v-if="i!=tableData.length-1">{{item.customerName}}</td>
            <td v-if="i!=tableData.length-1">{{item.handmanName}}</td>
            <td v-if="i!=tableData.length-1">{{item.bankName}}</td>
            <td v-if="i!=tableData.length-1">{{item.incomeMoney}}</td>
            <td v-if="i!=tableData.length-1">{{item.outcomeMoney}}</td>
            <td v-if="i!=tableData.length-1" class="bz" style="width:20%">{{item.financeRemark}}</td>
            <td v-if="i!=tableData.length-1" style="width:100px"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
  </div>
</template>
<script>
import getDate from "../../utils/getDate";
import moment from "moment";
export default {
  name: "FundFlowDetail",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      rCuidOptions: [],
      rCuseridOptions: [],
      rAccountidOptions: [],
      form: {
        rAccountid: "",
        rAccountidvc: "",
        rCuseridvc: "",
        rCuserid: "",
        rCuid: "",
        rCuidvc: "",
        sDate: "",
        eDate: ""
      },
      loading: false,
      totalincome: 0,
      totaloutcome: 0,
      prive: 0,
      prive1: 0,
      totalpage: 1,
      currentPage: 1, //初始页
      pageSize: 20, //每页的数据
      total: 0 //总条数,
    };
  },
  created() {
    this.form.sDate = getDate.getToday().starttime;
    this.form.eDate = getDate.getToday().endtime;
    // 账户
    this.$api.Common.get({ typeCode: "YHZH", cStatus: 1 }).then(res => {
      this.rAccountidOptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    // 记账人
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
      }
    });
    if (this.$route.query.show) {
      this.getListA();
    } else {
      this.getList();
    }
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
    getListA() {
      const loading = this.$loading({
        lock: true,
        text: "获取数据...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = sessionStorage.getItem("getDataA")
        ? JSON.parse(sessionStorage.getItem("getDataA"))
        : {};
      this.$api.ReportCapital.capitalFlowDetails(params).then(res => {
        loading.close();
        res.data.records.map(item => {
          this.prive += Number(item.incomeMoney);
          this.prive1 += Number(item.outcomeMoney);
        });
        this.tableData = res.data.records;
        this.tableData.push({});
        this.total = res.data.total;
      });
    },
    getList(val) {
      const loading = this.$loading({
        lock: true,
        text: "获取数据...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = sessionStorage.getItem("getData")
        ? JSON.parse(sessionStorage.getItem("getData"))
        : {};
      this.$api.Stat.statzjlsmx(params).then(res => {
        loading.close();
        if (res.code == 200) {
          res.data.records.map(item => {
            if (item.rdate) {
              item.rdate = moment(item.rdate).format("YYYY-MM-DD");
            }
            this.prive += item.incomeMoney;
            this.prive1 += item.outcomeMoney;
          });
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.currentPage = res.data.current;
          if (res.data.records.length) {
            this.totaloutcome = res.data.records[0].totaloutcome;
            this.totalincome = res.data.records[0].totalincome;
          }
          if (val == "xlsx") {
            setTimeout(() => {
              this.exportTable();
            }, 1500);
          }
        } else {
          this.$message({ message: res.err, type: "error" });
        }
        this.tableData.push({});
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
          `资金流水明细${getDate.getToday().starttime}.xlsx`
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
            column.property == "incomeMoney") ||
          column.property == "outcomeMoney"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);

          if (column.property == "incomeMoney") {
            sums[index] = this.$PublicJS.money(this.totalincome || 0, 2);
            if (this.totalincome < 0) {
              sums[index] =
                "-" + this.$PublicJS.money(Math.abs(this.totalincome) || 0, 2);
            }
            sums[index] += " 元";
          }
          if (column.property == "outcomeMoney") {
            sums[index] = this.$PublicJS.money(this.totaloutcome || 0, 2);
            if (this.totaloutcome < 0) {
              sums[index] =
                "-" + this.$PublicJS.money(Math.abs(this.totaloutcome) || 0, 2);
            }
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    Refresh() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.has-gutter td div {
  text-align: right;
}
table td.bz {
  max-width: 60px;
  overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
  text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
  white-space: nowrap;
}
</style>