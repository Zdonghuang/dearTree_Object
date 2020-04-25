<template>
  <div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <h3 style="text-align:center">{{form.PD_DIV==83?'报销单':'核销单'}}</h3>
    <ul class="ul">
      <li>标题：{{form.title}}</li>
      <li>账号：{{form.bankaccount}}</li>
      <li>开户行：{{form.bankname}}</li>
      <li v-if="form.PD_DIV==83">支付方式：{{form.paymentmethod}}</li>
      <li>{{form.PD_DIV==83?'报':"核"}}销人：{{form.handmanv}}</li>
      <li v-if="form.PD_DIV==83">
        收付款账户：
        <span
          v-for="item in bankAccountList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >{{form.banknamegh==item.value?item.label:''}}</span>
      </li>
      <li v-if="form.PD_DIV==83">支付日期：{{form.paymentdate}}</li>
    </ul>
    <table class="table" border="1" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>科目</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,i) in tableData" :key="i">
          <td v-if="i==tableData.length-1">合计</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i==tableData.length-1">{{num.toFixed(2)}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.pdSubjectname}}</td>
          <td v-if="i!=tableData.length-1">{{item.pdAmount.toFixed(2)}}</td>
          <td v-if="i!=tableData.length-1" style="width:70%">{{item.pdRemark}}</td>
        </tr>
      </tbody>
    </table>
    <div class="formcontent">
      <br />
      <div>备注：{{form.remark}}</div>
      <br />
    </div>
    <br />
    <el-dialog
      title="审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showDD"
      width="50%"
    >
      <el-dialog
        width="60%"
        title="审核人"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showexamine"
        append-to-body
      >
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine :rtype="83" @close="submit" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
    <el-dialog
      title="报销人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      title="科目"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData" parentCode="4009"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount1"
      width="60%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData1" code="YHZH"></selectBankAccount>
    </el-dialog>
  </div>
</template>

<script>
import selectClient from "../../components/dialog/SelectClient";
import selectUser from "../../components/dialog/SelectUser";
import selectBankAccount from "../../components/dialog/SelectBankAccount";
import getDate from "../../utils/getDate";
import { parse } from "path";
export default {
  components: {
    selectClient,
    selectUser,
    selectBankAccount
  },
  data() {
    return {
      dingding: {},
      dingding1: {},
      dataType: 0,
      rowindex: 0,
      showDD: false,
      showSelectUser: false,
      showbtn: true,
      tableData: [{}, {}, {}, {}, {}],
      fileList: [],
      showexamine: false,

      Totalprice: 0,
      disable: false,
      disables: false,
      showSelectBankAccount: false,
      num: 0,
      showSelectBankAccount1: false,
      form: {
        PD_APPROVALSTATUS: 1,
        handmanv: this.$storage.userName, //经手人
        handman: this.$storage.userId, //经手人
        pCuid: this.$storage.userId,
        div: 83,
        title: "", // 标题
        remark: "", // 主单据备注
        paymentmethod: "", // 支付方式
        bankname: "", // 开户行
        bankaccount: "", // 账号
        paymentdate: "", // 支付日期
        banknamegh: "",
        bankaccountgh: "",
        TPremoneydtsList: [
          {
            pdAmount: 0, // 金额
            pdRemark: "", // 借款备注
            pdSubjectnum: "", // 科目编号
            pdSubjectname: "" //科目名称
          }
        ],
        approvers: [] // 审核人
      },
      prive: 0,
      bankAccountList: [],
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      cuid: this.$route.query.ID,
      arr: [],
      GSoptions: [],
      pid: 0
    };
  },
  created() {
    this.getUserBank();
    if (this.$route.query.data) {
      this.pid = window.atob(this.$route.query.data);
      this.getdata();
    }
    if (this.cuid) {
      this.$api.Customer.get({ id: this.cuid }).then(res => {
        this.form.rCuidv = res.data.records[0].cuDivvalue;
        this.form.rCuid = this.cuid;
      });
    }
    let parms = {
      typeCode: "ZZJG",
      value1: 1
    };
    this.$api.Common.get(parms).then(res => {
      this.GSoptions = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
    this.$api.Common.get({ typeCode: "YHZH" }).then(res => {
      this.bankAccountList = res.data.map(item => {
        return {
          label: item.cAttrvalue,
          value: item.cAttrcode
        };
      });
    });
  },
  methods: {
    // 账户选择
    getBankAccountData1(val) {
      if (val) {
        this.form.banknamegh = val.cAttrvalue;
        this.form.bankaccountgh = val.cAttrcode;
      }
      this.showSelectBankAccount1 = false;
    },
    getUserBank(val) {
      let obj = { uid: val ? val : this.$storage.userId };
      this.$api.User.get(obj).then(res => {
        if (res.code == 200) {
          this.form.bankaccount = res.data.records[0].uBankaccount;
          this.form.bankname = res.data.records[0].uBankname;
        }
      });
    },
    // 提交
    opendialog(val) {
      if (!this.form.title) return this.$message.error("请填写单据标题");
      if (!this.form.bankaccount) return this.$message.error("请填写账号");
      if (!this.form.bankname) return this.$message.error("请填写开户行");
      if (!this.form.paymentmethod)
        return this.$message.error("请填写支付方式");
      if (!this.form.handman) return this.$message.error("请选择报销人");
      if (!this.form.paymentdate) return this.$message.error("请选择日期");
      this.arr = [];
      this.tableData.map(item => {
        if (item.pdSubjectname && item.pdAmount) {
          item.pdAmount = Number(item.pdAmount);
          if (this.pid) item.pdPid = this.pid
          this.arr.push(item);
        }
      });
      if (!this.arr.length) return this.$message.error("请补充费用明细");
      if (val == "false") return this.submit("false");
      if (this.form.PD_APPROVALSTATUS == 2 && !this.form.banknamegh)
        return this.$message.error("请选择付款账户");
      if (val) return this.submit(1);
      this.showDD = true;
    },
    submit(val, val1) {
      if (val) {
        let param = JSON.parse(JSON.stringify(this.form));
        if (val != 1 && val != "false") {
          if (val1 && val1.length) {
            param.cc = val1;
          } else {
            return this.$message.error("请选择抄送人");
          }
        }
        let loading = this.$loading({
          lock: true,
          text: "提交中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        param.TPremoneydtsList = this.arr;
        if (this.pid) param.pdPid = this.pid;
        delete param.PD_APPROVALSTATUS;
        if (val == "false") {
          param.TPremoneydtsList.map(item => {
            item.pdStatus = 1;
            item.pdApprovalstatus = 2;
          });
          param.isApproval = 0;
          this.$api.Premoney.save(param).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.push("/reimburseList");
            } else {
              this.$message.error("修改失败");
            }
          });
          return false;
        }
        if (val != 1) {
          param.approvers = val;
          this.$api.Premoney.save(param).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push("/reimburseList");
            } else {
              this.$message("提交失败");
            }
          });
        } else {
          this.$api.Premoney.financialAccounting(param).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push("/reimburseList");
            } else {
              this.$message("提交失败");
            }
          });
        }
      }
      this.showDD = false;
    },
    getdata() {
      this.tableData = [];
      const params = { pid: this.pid };
      if (this.$route.query.from) {
        params.from = this.$route.query.from;
        params.auth = 3;
      } else {
        delete params.from;
      }
      this.$api.Premoney.getPremoneyAndDtsItemList(params).then(res => {
        if (res.records) {
          let item = res.records;
          item.map((item, i) => {
            if (i == 0) {
              this.form.title = item.PD_TITLE;
              this.form.handmanv = item.PD_HANDMANV;
              this.form.handman = item.PD_HANDMAN;
              this.form.paymentdate = item.PD_PAYMENTDATE;
              this.form.remark = item.P_RAMARK;
              this.form.paymentmethod = item.PD_PAYMENTMETHOD;
              this.form.bankname = item.PD_BANKNAME;
              this.form.bankaccount = item.PD_BANKACCOUNT;
              this.form.bankaccountgh = item.PD_BANKACCOUNTGH;
              this.form.banknamegh = item.PD_BANKNAMEGH;
              this.form.PD_APPROVALSTATUS = item.PD_APPROVALSTATUS;
              this.form.PD_STATUS = item.PD_STATUS;
              this.form.PD_DIV = item.PD_DIV;
              this.getUserBank(this.form.handman);
              if (item.PD_APPROVALSTATUS == 1 || item.PD_APPROVALSTATUS == 2) {
                this.disable = true;
              }
              if (item.PD_APPROVALSTATUS == 1) {
                this.showbtn = false;
              }
              if (item.PD_STATUS == 2) {
                this.disables = true;
                this.showbtn = false;
              }
            }
            this.num = item.PD_AMOUNTTOTAL;
            let obj = {};
            obj.pdAmount = item.PD_AMOUNT;
            obj.pdRemark = item.PD_REMARK;
            obj.pdSubjectname = item.PD_SUBJECTNAME;
            obj.pdSubjectnum = item.PD_SUBJECTNUM;
            obj.pdId = item.PD_ID;
            this.tableData.push(obj);
          });
          this.tableData.push({});
        }
      });
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
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
    },
    showicon(e) {
      e.target.nextElementSibling.style.opacity = "0";
    },
    searchbox(e, val) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.icon = "";
        this.showSelectBankAccount = true;
      }
    },
    // 弹窗
    showDialog(val) {
      this[val] = true;
    },
    setmoney(v) {
      if (isNaN(v.pdAmount)) {
        return (v.pdAmount = 0);
      }
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
          !values.every(value => isNaN(value)) &&
          column.property == "pdAmount"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
          this.Totalprice = sums[index]
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 科目
    getBankAccountData(val) {
      let data = {};
      data.pdSubjectname = val.cAttrvalue;
      data.pdSubjectnum = val.cAttrcode;
      if (!this.tableData[this.rowindex].pdAmount) {
        data.pdAmount = 0;
      } else {
        data.pdAmount = this.tableData[this.rowindex].pdAmount;
      }
      this.tableData.splice(this.rowindex, 1, JSON.parse(JSON.stringify(data)));
      this.showSelectBankAccount = false;
    },
    // 报销人
    getUserData(val) {
      this.form.handman = val.uId;
      this.form.handmanv = val.uName;
      this.showSelectUser = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>
<style scoped lang="scss">
@page {
  size: auto A4 landscape;
  margin: 3mm;
}
ul,
col,
table,
div {
  color: rgb(80, 80, 80);
  font-weight: 100;
  font-family: "宋体" !important;
}
div {
  font-weight: 500;
}
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
  li {
    display: inline-block;
    height: 28px;
    width: 48%;
  }
}
.ul1 {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: inline-block;
    width: 32%;
  }
}
.ul2 {
  list-style: none;
  padding: 0;
  padding-left: 14px;
  margin: 0;
  li {
    display: inline-block;
    width: 34%;
  }
  li.lim {
    width: 30%;
  }
}
.table {
  line-height: 20px;
  text-align: center;
  tr th,
  tr td {
    padding: 2px;
  }
}
.www {
  display: inline-block;
  width: 130px;
}
.rrr {
  text-align: right;
}
.ttt {
  font-weight: 900;
}
</style>
