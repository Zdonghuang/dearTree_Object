<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left"></el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">押金单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="客户名称"
          v-model="form.rCuidv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">客户名称</template>
          <i
            v-if="!disabled"
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectClient')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="账户"
          v-model="form.banknamegh"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">账户</template>
          <i
            v-if="!disabled"
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectBankAccount')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="经手人"
          v-model="form.rHandmanv"
          size="small"
          readonly
          :disabled="disabled"
        >
          <template slot="prepend">经手人</template>
          <i
            v-if="!disabled"
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectUser')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" :disabled="true">
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="mini"
      height="500px"
      show-summary
      :summary-method="getSummaries"
      sum-text="合计:"
      header-cell-class-name="thbgc"
    >
      <el-table-column type="index" width="55" align="center" prop="index"  label="序号"></el-table-column>
      <el-table-column v-if="!disabled" prop="tools" label="操作" align="center"  width="80">
        <template slot-scope="scope">
          <i class="el-icon-circle-plus add" @click="adddate()"></i>
          <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="gName" >
        <template slot="header">
          <i class="el-icon-question bluecolor"></i>
          <span>科目</span>
        </template>
        <template slot-scope="scope">
          <input
            type="text"
            @blur="showicon($event)"
            @focus="hiddenicon($event)"
            v-model="scope.row.cAttrvalue"
            class="ipt"
            readonly
            :disabled="disabled"
          />
          <i
            class="fa fa-search searchname"
            @click="searchbox($event,scope.$index)"
            v-if="!disabled"
          ></i>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" property="PAmount" label="金额">
        <template slot-scope="scope" v-if="scope.row.cAttrvalue">
          <input
            type="text"
            v-model="scope.row.PAmount"
            @change="setmoney(scope.row)"
            class="ipt tc"
            :disabled="disabled"
          />
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="备注">
        <template slot-scope="scope" v-if="scope.row.cAttrvalue">
          <input type="text" v-model="scope.row.pdRemark" class="ipt tc" :disabled="disabled" />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20" class="mbottom">
      <el-col :xs="24" :sm="20">
        <div class="mt10">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24">
              <el-input placeholder="备注" v-model="form.rRemark" size="small" :disabled="disabled">
                <template slot="prepend">备注</template>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <br />
    <br />
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog"
      :hideBtn1="false"
      :hideBtn2="!disabled"
      BtnText="确认提交"
    ></my-footer>
    <el-dialog :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectClient" width="60%">
      <selectClient @emitClientData="getClientData" status="16"></selectClient>
    </el-dialog>
    <el-dialog title="职员" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectUser" width="60%">
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog title="账户" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectBankAccount" width="50%">
      <selectBankAccount @emitBankAccountData="getBankAccountData1" code="YHZH"></selectBankAccount>
    </el-dialog>
    <el-dialog title="科目" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showSelectBankAccount1" width="50%">
      <selectBankAccount @emitBankAccountData="getBankAccountData"></selectBankAccount>
    </el-dialog>
    <el-dialog title="审核人" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showDD" width="50%">
      <el-dialog width="60%" title="审核人" :close-on-click-modal="false"  v-dialogDrag :visible.sync="showexamine" append-to-body>
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine :rtype="80" @close="submit" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
  </div>
</template>

<script>
import selectClient from "@/components/dialog/SelectClient";
import selectUser from "@/components/dialog/SelectUser";
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import getDate from "@/utils/getDate";
import examine from "@/components/dialog/examine";
export default {
  components: {
    selectClient,
    selectUser,
    selectBankAccount,
    examine
  },
  data() {
    return {
      footernum: 0,
      footertext: this.$route.query.BH ? "修改" : "提交",
      rowindex: "",
      tableData: [],
      dingding: 0,
      dingding1: 0,
      table: [],
      showDD: false,
      showexamine: false,
      currentRow: null,
      dataType: 0,
      icon: "",
      dialogFormVisible: false,
      showSelectClient: false,
      showSelectUser: false,
      disabled: false,
      showSelectBankAccount: false,
      showSelectBankAccount1: false,

      rTotalprice: 0.0,
      pid: 0,
      form: {
        pCuid: "",
        rCuidv: "", //客户
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId, //经手人
        rRemark: "", //备注
        banknamegh: "",
        bankaccountgh: ""
      },
      contact: [],
      postArr: {},
      cuid: this.$route.query.ID,
      rid: this.$route.query.rID
    };
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({ index: i });
    }
    if (!this.$route.query.data && !this.cuid) {
      this.$router.push("/depositList");
    }
    if (this.$route.query.data) {
      this.pid = window.atob(this.$route.query.data);
      this.getdata();
    }
    if (this.cuid) {
      this.$api.Customer.get({ id: this.cuid }).then(res => {
        this.form.rCuidv = res.data.records[0].cuName;
        this.form.pCuid = this.cuid;
      });
    }
    this.form.rDate = this.$PublicJS.nowDate();
  },
  computed: {
    //本单金额
    Totalprice: function() {
      return this.rTotalprice;
    }
  },
  methods: {
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] ="合计";
          return;
        }
        if (column.property === "PAmount") {
          values = data.map(item => Number(item.PAmount));
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          this.rTotalprice = this.$PublicJS.money(parseFloat((sums[index]).toPrecision(12)), 2);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    setmoney(v) {
      if (isNaN(v.PAmount)) return (v.PAmount = 0);
    },
    getdata() {
      this.tableData = [];
      const params = { pid: this.pid };
      this.$api.Premoney.getPremoneyAndDtsItemList(params).then(res => {
        if (res.records) {
          this.disabled = true;
          let item = res.records;
          item.map((item, i) => {
            if (i == 0) {
              this.form.pCuid = item.PD_CUID;
              this.form.rCuidv = item.PD_CUIDV;
              this.form.rRemark = item.P_RAMARK;
              this.form.rHandman = item.PD_HANDMAN;
              this.form.rHandmanv = item.PD_HANDMANV;
              this.form.banknamegh = item.PD_BANKNAMEGH;
              this.form.bankaccountgh = item.PD_BANKACCOUNTGH;
              this.form.pdpid = item.PD_PID;
            }
            let obj = {};
            obj.PAmount = item.PD_AMOUNT;
            obj.pdRemark = item.PD_REMARK;
            obj.cAttrvalue = item.PD_SUBJECTNAME;
            obj.cAttrcode = item.PD_SUBJECTNUM;
            obj.pdPid = item.PD_PID;
            this.tableData.push(obj);
          });
        }
      });
    },
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
    },
    showicon(e) {
      e.target.nextElementSibling.style.opacity = "0";
    },
    // 用户审核弹框
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    // 选择客户
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
    // 提交
    opendialog(val) {
      if (!this.form.rCuidv) {
        this.$message({ message: "请选择客户", type: "warning" });
        return false;
      }
      if (!this.form.rHandmanv) {
        this.$message({ message: "请选择经手人", type: "warning" });
        return false;
      }
      if (!this.form.banknamegh) {
        this.$message({ message: "请选择账户", type: "warning" });
        return false;
      }
      let n = 0;
      this.tableData.map(item => {
        if (item.cAttrvalue && item.PAmount > 0) n++;
      });
      if (!n) return this.$message.error("请选择科目或金额");
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let param = {
        pCuid: this.form.pCuid,
        remark: this.form.rRemark,
        handman: this.form.rHandman,
        banknamegh: this.form.banknamegh,
        bankaccountgh: this.form.bankaccountgh,
        div: 84,
        TPremoneydtsList: [],
        approvers: val
      };
      this.tableData.forEach((item, index) => {
        if (item.cAttrcode && item.PAmount) {
          let obj = {};
          obj.pdSubjectnum = item.cAttrcode;
          obj.pdSubjectname = item.cAttrvalue;
          obj.pdAmount = item.PAmount;
          obj.pdPid = item.pdPid;
          obj.pdRid = this.rid;
          obj.pdHandman = this.form.rHandmanv;
          obj.pdRemark = item.pdRemark;
          obj.pdCuserid = this.$storage.userId;
          obj.pdCuid = this.form.pCuid;
          param.TPremoneydtsList.push(obj);
        }
      });
      this.$api.Premoney.save(param).then(res => {
        loading.close();
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          if (this.cuid) {
            this.$router.push("/lease/leaseList");
          } else {
            this.$router.push("/depositList");
          }
        } else {
          this.$message("提交失败");
        }
      });
    },
    submit(val) {},
    searchbox(e, val) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.icon = "";
        this.showSelectBankAccount1 = true;
      }
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    // 新增一行
    adddate() {
      this.tableData.push({});
    },
    // 删除当前选中这行
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    // 科目
    getBankAccountData(val) {
      if (val) {
        val["index"] = this.rowindex;
        val["PAmount"] = "0";
        val["pdPid"] = this.form.pdpid;
        if (this.tableData[this.rowindex].pdId)
          val["pdId"] = this.tableData[this.rowindex].pdId;
        this.tableData.splice(
          this.rowindex,
          1,
          JSON.parse(JSON.stringify(val))
        );
      }
      this.showSelectBankAccount1 = false;
    },
    // 账户选择
    getBankAccountData1(val) {
      if (val) {
        this.form.banknamegh = val.cAttrvalue;
        this.form.bankaccountgh = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    // 客户
    getClientData(val) {
      this.form.pCuid = val.cuId;
      this.form.rCuidv = val.cuName;
      this.showSelectClient = false;
    },
    // 经手人
    getUserData(val) {
      this.form.rHandman = val.uId;
      this.form.rHandmanv = val.uName;
      this.showSelectUser = false;
    }
  }
};
</script>
<style scoped>
</style>
