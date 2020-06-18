<template>
  <div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <h4 style="text-align:center">借款单</h4>
    <ul class="ul">
      <li>
        <span>借款人：{{form.handmanv}}</span>
      </li>
      <li>
        <span>借款标题：{{form.title}}</span>
      </li>
      <li>
        <span>借款事由：{{form.cause}}</span>
      </li>
      <li>
        <span>借款金额：{{form.TPremoneydtsList[0].pdAmount.toFixed(2)}}</span>
      </li>
      <li>
        <span>开户行名称：{{form.bankname}}</span>
      </li>
      <li>
        <span>开户行账号：{{form.bankaccount}}</span>
      </li>
      <li>
        <span>支付方式：{{form.paymentmethod}}</span>
      </li>
      <li>
        <span>付款账户：{{form.banknamegh}}</span>
      </li>
      <li>
        <span>科目：{{form.TPremoneydtsList[0].pdSubjectname}}</span>
      </li>
      <li>
        <span>支付日期：{{form.paymentdate}}</span>
      </li>
      <li>
        <span>备注：{{form.TPremoneydtsList[0].pdRemark}}</span>
      </li>
    </ul>
    <br />
    <br />
    <el-dialog
      title="账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="50%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData1" code="YHZH"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="职员"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectuser"
      width="60%"
    >
      <selectUser @emitUserData="getUser1"></selectUser>
    </el-dialog>
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
      <examine :rtype="82" @close="submit" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
  </div>
</template>

<script>
import selectClient from "../../components/dialog/SelectClient";
import selectUser from "../../components/dialog/SelectUser";
import selectBankAccount from "../../components/dialog/SelectBankAccount";
import getDate from "../../utils/getDate";
export default {
  components: {
    selectClient,
    selectUser,
    selectBankAccount
  },
  data() {
    return {
      showSelectBankAccount: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      showDD: false,
      showexamine: false,
      showSelectuser: false,
      Totalprice: 0,
      disable: false,
      fileList: [],
      formData: null,
      i: 0,
      disables: false,
      showbtn: true,
      form: {
        PD_APPROVALSTATUS: 1,
        handmanv: this.$storage.userName, //经手人
        handman: this.$storage.userId, //经手人
        pCuid: this.$storage.userId,
        div: 82,
        title: "", // 标题
        remark: "", // 主单据备注
        paymentmethod: "", // 支付方式
        bankname: "", // 开户行
        bankaccount: "", // 账号
        paymentdate: "", // 支付日期
        cause: "", // 事由
        bankaccountgh: "",
        banknamegh: "",
        TPremoneydtsList: [
          {
            pdSubjectname: "其他应收款",
            pdSubjectnum: 1009,
            pdAmount: 0, // 金额
            pdRemark: "" // 借款备注
          }
        ],
        approvers: [] // 审核人
      },
      cuid: this.$route.query.ID
    };
  },
  created() {
    if (this.$route.query.data) {
      this.pid = window.atob(this.$route.query.data);
      this.pid = this.pid.replace(/f/, "");
      this.getdata();
    } else {
      this.getUserBank();
    }
    if (this.cuid) {
      this.$api.Customer.get({ id: this.cuid }).then(res => {
        this.form.rCuidv = res.data.records[0].cuDivvalue;
        this.form.rCuid = this.cuid;
      });
    }
  },
  methods: {
    // 提交
    opendialog(val) {
      if (!this.form.title) return this.$message.error("请填写标题");
      if (!this.form.cause) return this.$message.error("请填写事由");
      if (!this.form.TPremoneydtsList[0].pdAmount)
        return this.$message.error("请填写金额");
      if (!this.form.bankaccount) return this.$message.error("请填写帐号");
      if (!this.form.bankname) return this.$message.error("请填写开户行");
      if (!this.form.paymentmethod)
        return this.$message.error("请填写支付方式");
      if (!this.form.paymentdate) return this.$message.error("请选择支付日期");
      if (this.form.PD_APPROVALSTATUS == 2 && !this.form.banknamegh)
        return this.$message.error("请选择付款账户");
      if (val) return this.submit(1);
      this.showDD = true;
    },
    getUserBank(val) {
      let obj = { uid: val ? val : this.$storage.userId };
      this.$api.User.get({ uid: this.$storage.userId }).then(res => {
        if (res.code == 200) {
          this.form.bankaccount = res.data.records[0].uBankaccount;
          this.form.bankname = res.data.records[0].uBankname;
        }
      });
    },
    // 账户选择
    getBankAccountData1(val) {
      if (val) {
        this.form.banknamegh = val.cAttrvalue;
        this.form.bankaccountgh = val.cAttrcode;
      }
      this.showSelectBankAccount = false;
    },
    submit(val, val1) {
      if (val) {
        let param = JSON.parse(JSON.stringify(this.form));
        if (val != 1) {
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
        this.form.TPremoneydtsList[0].pdAmount = Number(
          this.form.TPremoneydtsList[0].pdAmount
        );
        param.pdfilestr = this.form.pdfilestr;
        if (this.pid) param.TPremoneydtsList[0].pdPid = this.pid;
        delete param.PD_APPROVALSTATUS;
        this.formData = new FormData();
        this.$refs.upload.submit();
        this.$ajax.post("/system/upload", this.formData).then(res => {
          if (res.data.code === 200) {
            if (Object.values(res.data.data).length) {
              Object.values(res.data.data).map(item => {
                param.pdfilestr.push(`/file/${item}`);
              });
            }
            param.pdfilestr = JSON.stringify(param.pdfilestr);
            if (val != 1) {
              param.approvers = val;
              if (val1 && val1.length) {
                param.cc = val1;
              } else {
                return this.$message.error("请选择抄送人");
              }
              this.$api.Premoney.save(param).then(res => {
                loading.close();
                if (res.code === 200) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$router.push("/borrowingList");
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
                  this.$router.push("/borrowingList");
                } else {
                  this.$message("提交失败");
                }
              });
            }
          } else {
            loading.close();
          }
        });
      }
      this.showDD = false;
    },
    showDialog(v) {
      this[v] = true;
    },
    handleExceed() {},
    handleChange(v) {},
    handleRemove() {},
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
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
            this.form.title = item.PD_TITLE;
            this.form.handmanv = item.PD_HANDMANV;
            this.form.cause = item.PD_CAUSE;
            this.form.handman = item.PD_HANDMAN;
            this.form.paymentdate = item.PD_PAYMENTDATE;
            this.form.remark = item.P_REMARK;
            this.form.paymentmethod = item.PD_PAYMENTMETHOD;
            this.form.bankname = item.PD_BANKNAME;
            this.form.remark = item.P_RAMARK;
            this.form.bankaccount = item.PD_BANKACCOUNT;
            this.form.bankaccountgh = item.PD_BANKACCOUNTGH;
            this.form.banknamegh = item.PD_BANKNAMEGH;
            this.form.PD_APPROVALSTATUS = item.PD_APPROVALSTATUS;
            this.form.TPremoneydtsList[0].pdRemark = item.PD_REMARK;
            this.form.TPremoneydtsList[0].pdAmount = item.PD_AMOUNT;
            this.form.TPremoneydtsList[0].pdId = item.PD_ID;
            this.form.TPremoneydtsList[0].pdSubjectname = item.PD_SUBJECTNAME;
            this.form.TPremoneydtsList[0].pdSubjectnum = item.PD_SUBJECTNUM;
            this.getUserBank(this.form.handman);
            if (item.PD_FILESTR) {
              this.form.pdfilestr = Array.isArray(JSON.parse(item.PD_FILESTR))
                ? JSON.parse(item.PD_FILESTR)
                : JSON.parse(JSON.parse(item.PD_FILESTR));
              this.fileList = this.form.pdfilestr;
            }
            this.Totalprice = item.PD_AMOUNT;
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
            if (item.PD_STATUS == 3) {
              this.showbtn = false;
            }
          });
        }
      });
    },
    // 用户审核弹框
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    // 选择审核人
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
    // 选择借款人
    getUser1(val) {
      this.form.pCuid = val.uId;
      this.form.pCuidv = val.uName;
      this.form.handman = val.uId;
      this.form.handmanv = val.uName;
      this.showSelectuser = false;
    },
    setnum() {
      if (isNaN(this.form.bankaccount)) return (this.form.bankaccount = "");
    },
    setmoney() {
      if (isNaN(this.form.TPremoneydtsList[0].pdAmount))
        return (this.form.TPremoneydtsList[0].pdAmount = 0);
      if (this.form.TPremoneydtsList[0].pdAmount == 0)
        return this.$message.error("请填写金额");
      if (this.form.TPremoneydtsList[0].pdAmount < 0) {
        this.form.TPremoneydtsList[0].pdAmount = 0;
        return this.$message.error("金额必须是正数");
      }
      this.Totalprice = this.form.TPremoneydtsList[0].pdAmount;
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
    width: 99%;
    text-align: center;
    span {
      display: inline-block;
      width: 300px;
      text-align: left;
    }
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
