<template>
  <div>
    <h3 style="text-align:center">{{form.PD_DIV==81?'预付款单':form.PD_DIV==86?"其他支出单":''}}</h3>
    <ul class="ul">
      <li>客户名称：{{form.rCuidv}}</li>
      <li>开户行及账号：{{form.cuBankname}}</li>
      <li>纳税人识别号：{{form.cuTaxnum}}</li>
      <li>地址及电话：{{form.cuBankcardnum}}</li>
      <li>经手人：{{form.rHandmanv}}</li>
      <li>付款账户：{{form.banknamegh}}</li>
      <li>单据日期：{{form.rDate}}</li>
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
          <td v-if="i==tableData.length-1">{{prive.toFixed(2)}}</td>
          <td v-if="i==tableData.length-1"></td>
          <td v-if="i!=tableData.length-1">{{i+1}}</td>
          <td v-if="i!=tableData.length-1">{{item.cAttrvalue}}</td>
          <td v-if="i!=tableData.length-1">{{item.PAmount.toFixed(2)}}</td>
          <td v-if="i!=tableData.length-1">{{item.pdRemark}}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <div>备注：{{form.rRemark}}</div>
    <br />
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient @emitClientData="getClientData"></selectClient>
    </el-dialog>
    <el-dialog
      title="职员"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
    <el-dialog
      title="账户"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount"
      width="50%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData" code="YHZH"></selectBankAccount>
    </el-dialog>
    <el-dialog
      title="科目"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectBankAccount1"
      width="50%"
    >
      <selectBankAccount @emitBankAccountData="getBankAccountData1"></selectBankAccount>
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
      <examine :rtype="81" @close="submit" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
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
      fileList: [],
      formData: null,
      i: 0,
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
      prive: 0,
      form: {
        pCuid: "",
        rCuidv: "", //客户
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId, //经手人
        rRemark: "", //备注
        banknamegh: "",
        bankaccountgh: "",
        rDate: "",
        cuBankcardnum: "",
        cuBankname: "",
        pdfilestr: [],
        cuTaxnum: "",
        PD_STATUS: ""
      },
      cuid: this.$route.query.ID
    };
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({ index: i });
    }
    if (this.$route.query.data) {
      this.pid = window.atob(this.$route.query.data);
      this.getdata();
    }
    if (this.cuid) {
      this.tableData = [
        {
          cAttrvalue: "预付账款",
          cAttrcode: 1006
        }
      ];
      this.getC();
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
    getC() {
            let obj = { id: this.cuid };
      if (this.$route.query.from) {
        obj.auth = 2;
      }
      this.$api.Customer.get(obj).then(res => {
        if (res.data.records.length) {
          this.form.rCuidv = res.data.records[0].cuName;
          this.form.cuBankcardnum = res.data.records[0].cuBankcardnum;
          this.form.cuBankname = res.data.records[0].cuBankname;
          this.form.cuTaxnum = res.data.records[0].cuTaxnum;
          this.form.cuRemark = res.data.records[0].cuRemark;
          this.form.pCuid = this.cuid;
          this.form = JSON.parse(JSON.stringify(this.form));
        }
      });
    },
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
    getdata() {
      this.tableData = [];
      const params = { pid: this.pid };
      if (this.$route.query.from) {
        params.from = this.$route.query.from;
params.auth=3
      } else {
        delete params.from;
      }
      this.$api.Premoney.getPremoneyAndDtsItemList(params).then(res => {
        if (res.records) {
          let items = res.records;
          items.map((item, i) => {
            if (i == 0) {
              this.form = item;
              this.form.pCuid = item.PD_CUID;
              this.cuid = item.PD_CUID;
              this.getC();
              this.form.rCuidv = item.PD_CUIDV;
              this.form.rRemark = item.P_RAMARK;
              this.form.rHandman = item.PD_HANDMAN;
              this.form.rHandmanv = item.PD_HANDMANV;
              this.form.banknamegh = item.PD_BANKNAMEGH;
              this.form.rDate = item.PD_CTIME;
              this.form.bankaccountgh = item.PD_BANKACCOUNTGH;
              this.form.PD_STATUS = item.PD_STATUS;
              if (item.PD_FILESTR) {
                this.form.pdfilestr = Array.isArray(JSON.parse(item.PD_FILESTR))
                    ? JSON.parse(item.PD_FILESTR)
                    : JSON.parse(JSON.parse(item.PD_FILESTR));
                this.fileList = this.form.pdfilestr;
              }
              if (item.PD_APPROVALSTATUS == 1 || item.PD_APPROVALSTATUS == 2) {
                this.disabled = true;
              }
              if (item.PD_STATUS == 1) {
                this.disabled = false;
              }
            }
            this.form = JSON.parse(JSON.stringify(this.form));
            let obj = {};
            obj.PAmount = item.PD_AMOUNT;
            this.prive += item.PD_AMOUNT;
            obj.pdRemark = item.PD_REMARK;
            obj.cAttrvalue = item.PD_SUBJECTNAME;
            obj.cAttrcode = item.PD_SUBJECTNUM;
            obj.pdPid = item.PD_PID;
            obj.pdId = item.PD_ID;
            this.tableData.push(obj);
          });
          this.tableData.push({});
        }
      });
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/printingFinancePay?data=${data}`, "_blank");
    },
    hiddenicon(e) {
      this.icon = e.target.nextElementSibling;
      e.target.nextElementSibling.style.opacity = "1";
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
      if (!this.form.banknamegh && val) {
        this.$message({ message: "请选择账户", type: "warning" });
        return false;
      }
      let n = 0;
      this.tableData.map(item => {
        if (item.cAttrvalue && item.PAmount > 0) n++;
      });
      if (!n) return this.$message.error("请选择科目或填写金额");
      if (val) return this.submit(1);
      this.showDD = true;
    },
    submit(val, val1) {
      if (val) {
        let param = {
          pCuid: this.form.pCuid,
          remark: this.form.rRemark,
          handman: this.form.rHandman,
          banknamegh: this.form.banknamegh,
          bankaccountgh: this.form.bankaccountgh,
          div: 81,
          pdfilestr: this.form.pdfilestr,
          TPremoneydtsList: []
        };
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
        this.tableData.forEach((item, index) => {
          if (item.cAttrcode && item.PAmount) {
            let obj = {};
            obj.pdSubjectnum = item.cAttrcode;
            obj.pdSubjectname = item.cAttrvalue;
            obj.pdAmount = item.PAmount;
            obj.pdPid = item.pdPid;
            obj.pdHandman = this.form.rHandmanv;
            obj.pdRemark = item.pdRemark;
            obj.pdCuserid = this.$storage.userId;
            obj.pdCuid = this.form.pCuid;
            obj.pdId = item.pdId;
            if (this.$route.query.rid) {
              obj.pdRid = this.$route.query.rid;
            }
            param.TPremoneydtsList.push(obj);
          }
        });
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
              this.$api.Premoney.save(param).then(res => {
                loading.close();
                if (res.code === 200) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$router.push("/financialAdvancesList");
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
                  this.$router.push("/financialAdvancesList");
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
    setmoney(v) {
      if (isNaN(v.PAmount)) return (v.PAmount = 0);
    },
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
    // 收款账户
    getBankAccountData1(val) {
      if (val) {
        val["index"] = this.rowindex;
        val["PAmount"] = "0";
        if (this.tableData[this.rowindex].pdPid)
          val["pdPid"] = this.tableData[this.rowindex].pdPid;
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
    getBankAccountData(val) {
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
      this.form.cuBankname = val.cuBankname;
this.form.cuTaxnum = val.cuTaxnum;
      this.form.cuBankcardnum = val.cuBankcardnum;
      this.form.cuRemark = val.cuRemark;
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
  font-family: '宋体' !important;
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
