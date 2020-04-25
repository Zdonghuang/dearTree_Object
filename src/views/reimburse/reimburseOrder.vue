<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left"></el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">报销单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button> -->
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer">打印</el-button>-->
        </el-button-group>
      </el-col>
    </el-row>
    <div class="formcontent">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="6">
          <el-input placeholder="标题" v-model="form.title" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 标题
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-input placeholder="账号" v-model="form.bankaccount" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 账号
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-input placeholder="开户行" v-model="form.bankname" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 开户行
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-select
            v-model="form.paymentmethod"
            clearable
            placeholder="支付方式"
            size="small"
            class="selectSlot4"
            :disabled="disable"
          >
            <template slot="prefix">
              <span class="prefixSlot">支付方式</span>
            </template>
            <el-option label="现金" value="现金"></el-option>
            <el-option label="转账" value="转账"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-input
            placeholder="支付方式"
            v-model="form.handmanv"
            size="small"
            readonly
            :disabled="disable"
          >
            <template slot="prepend">
              <span class="red">*</span> 报销人
            </template>
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="showDialog('showSelectUser')"
              v-if="!disable"
            ></i>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="6" v-if="form.PD_APPROVALSTATUS==2">
          <el-select
            v-model="form.banknamegh"
            placeholder="银行账户"
            size="small"
            class="selectSlot4"
            clearable
            :disabled="disables"
          >
            <template slot="prefix">
              <span class="prefixSlot">
                <span class="red">*</span>付款账户
              </span>
            </template>
            <el-option
              v-for="item in bankAccountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-date-picker
            v-model="form.paymentdate"
            size="small"
            :picker-options="pickerOptions"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            placeholder="支付日期"
            :disabled="disable"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <div slot="header">
          <span>费用明细</span>
        </div>
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            height="300px"
            show-summary
            :summary-method="getSummaries"
            sum-text="合计:"
            header-cell-class-name="thbgc"
          >
            <el-table-column sortable
              show-overflow-tooltip
              type="index"
              width="55"
              align="center"
              prop="index"
              label="序号"
            ></el-table-column>
            <el-table-column sortable
              show-overflow-tooltip
              prop="tools"
              label="操作"
              align="center"
              width="80"
              v-if="!disables"
            >
              <template slot-scope="scope">
                <i class="el-icon-circle-plus add" @click="adddate()"></i>
                <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column sortable align="center" prop="gName">
              <template slot="header">
                <i class="el-icon-question bluecolor"></i>
                <span>科目</span>
              </template>
              <template slot-scope="scope">
                <input
                  type="text"
                  @blur="showicon($event)"
                  @focus="hiddenicon($event)"
                  v-model="scope.row.pdSubjectname"
                  class="ipt"
                  readonly
                  :disabled="disables"
                />
                <i
                  class="fa fa-search searchname"
                  v-if="!disables"
                  @click="searchbox($event,scope.$index)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column sortable align="center" property="pdAmount" label="金额">
              <template slot-scope="scope">
                <input
                  type="text"
                  class="ipt tc"
                  v-if="scope.row.pdSubjectname"
                  v-model="scope.row.pdAmount"
                  :readonly="disables"
                  @blur="setmoney(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column sortable align="center" label="备注">
              <template slot-scope="scope">
                <input
                  type="text"
                  v-model="scope.row.pdRemark"
                  class="ipt tc"
                  v-if="scope.row.pdSubjectname"
                  :readonly="disable"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <br />
      <el-row>
        <el-col :xs="24" :sm="16">
          <el-input placeholder="单据备注" v-model="form.remark" size="small" :disabled="disable">
            <template slot="prepend">单据备注</template>
          </el-input>
        </el-col>
      </el-row>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :file-list="fileList"
        :auto-upload="false"
        accept="image/png, image/jpeg"
      >
        <el-button slot="trigger" size="small" type="primary">上传附件</el-button>
      </el-upload>
      <br />
    </div>
    <br />
    <br />
    <br />
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      @ctrls="opendialog('false')"
      :hideBtn1="form.PD_APPROVALSTATUS==2&&form.PD_STATUS!=2"
      :hideBtn2="showbtn"
      BtnText1="修改科目"
      v-has="512"
      v-if="form.PD_APPROVALSTATUS==2&&!$router.history.current.query.from"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      @ctrls="opendialog('false')"
      :hideBtn1="form.PD_APPROVALSTATUS==2&&form.PD_STATUS!=2"
      :hideBtn2="showbtn"
      BtnText1="修改科目"
      v-if="form.PD_APPROVALSTATUS!=2&&!$router.history.current.query.from"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
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
    this.getUserBank()
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
    getUserBank() {
      this.$api.User.get({ uid: this.$storage.userId }).then(res => {
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
          if (this.pid) item.pdPid = this.pid;
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
        param.TPremoneydtsList = this.arr
        if (this.pid) param.pdPid = this.pid
        delete param.PD_APPROVALSTATUS
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
              this.$router.push("/reimburse/reimburseList");
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
              this.$router.push("/reimburse/reimburseList");
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
              this.$router.push("/reimburse/reimburseList");
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
            let obj = {};
            obj.pdAmount = item.PD_AMOUNT;
            obj.pdRemark = item.PD_REMARK;
            obj.pdSubjectname = item.PD_SUBJECTNAME;
            obj.pdSubjectnum = item.PD_SUBJECTNUM;
            obj.pdId = item.PD_ID;
            this.tableData.push(obj);
          });
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
          sums[index] ="合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          !values.every(value => isNaN(value)) &&
          column.property == "pdAmount"
        ) {
          sums[index] =values.reduce((prev, curr)=> {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12))
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
          this.Totalprice = parseFloat((sums[index]).toPrecision(12));
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
<style scoped>
</style>
