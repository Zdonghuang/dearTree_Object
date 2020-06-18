<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left"></el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">借款单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button> -->
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button> -->
          <el-button size="small" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="formcontent">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="借款人" v-model="form.handmanv" size="small" disabled>
            <template slot="prepend">
              <span class="red">*</span> 借款人
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="借款标题" v-model="form.title" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 借款标题
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="借款事由" v-model="form.cause" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 借款事由
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input
            placeholder="借款金额"
            v-model="form.TPremoneydtsList[0].pdAmount"
            size="small"
            @blur="setmoney"
            :disabled="disable"
          >
            <template slot="prepend">
              <span class="red">*</span> 借款金额
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="开户行名称" v-model="form.bankname" size="small" :disabled="disable">
            <template slot="prepend">
              <span class="red">*</span> 开户行名称
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input
            placeholder="开户行账号"
            v-model="form.bankaccount"
            size="small"
            @blur="setnum"
            :disabled="disable"
          >
            <template slot="prepend">
              <span class="red">*</span> 开户行账号
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
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
      </el-row>
      <el-row :gutter="24" v-if="form.PD_APPROVALSTATUS==2">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="付款账户" v-model="form.banknamegh" size="small" :disabled="disables">
            <template slot="prepend">
              <span class="red">*</span> 付款账户
            </template>
            <i
              v-if="!disables"
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="showDialog('showSelectBankAccount')"
            ></i>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="form.PD_APPROVALSTATUS==2">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input
            placeholder="科目"
            v-model="form.TPremoneydtsList[0].pdSubjectname"
            size="small"
            disabled
          >
            <template slot="prepend">
              <span class="red">*</span> 科目
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-date-picker
            v-model="form.paymentdate"
            size="small"
            type="date"
            placeholder="支付日期"
            value-format="yyyy-MM-dd"
            :editable="false"
            :disabled="disable"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8">
          <el-input placeholder="备注" v-model="form.remark" size="small">
            <template slot="prepend">备注</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="8"></el-col>
        <el-col :xs="24" :sm="8" style="padding-left:8px">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :auto-upload="false"
            :limit="5"
            multiple
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :http-request="uploadImg"
          >
            <el-button size="mini" type="primary" v-if="form.PD_APPROVALSTATUS!=3">上传单据附件</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div class="flies" v-for="(url,i) in fileList" :key="i">
        <img
          width="140"
          v-if="url.indexOf('jpg')>=1||url.indexOf('png')>=1||url.indexOf('gif')>=1"
          :src="`${baseUrl}api${url}`"
          @click="openlink(`${baseUrl}api${url}`)"
          class="pointer"
        />
        <i v-else href="javascript:void(0);" @click="openlink(`${baseUrl}api${url}`)" title="文档连接">
          <i style="font-size:104px" class="fa fa-file-text-o"></i>
        </i>
      </div>
    </div>
    <br />
    <br />
    <br />
    <br />
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      :hideBtn1="false"
      :hideBtn2="showbtn"
      v-if="form.PD_APPROVALSTATUS==2&&!$router.history.current.query.from"
      v-has="512"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      :hideBtn1="false"
      :hideBtn2="showbtn"
      v-if="form.PD_APPROVALSTATUS!=2&&!$router.history.current.query.from"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
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
    openlink(url) {
      window.open(url, "_blank");
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
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/printingJKs?data=${data}`, "_blank");
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
            if (!param.pdfilestr) {
              param.pdfilestr = [];
            }
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
                  this.$router.push("/borrowingLists");
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
                  this.$router.push("/borrowingLists");
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
            this.form.remark = item.P_RAMARK;
            this.form.paymentmethod = item.PD_PAYMENTMETHOD;
            this.form.bankname = item.PD_BANKNAME;
            this.form.bankaccount = item.PD_BANKACCOUNT;
            this.form.bankaccountgh = item.PD_BANKACCOUNTGH;
            this.form.banknamegh = item.PD_BANKNAMEGH;
            this.form.PD_APPROVALSTATUS = item.PD_APPROVALSTATUS;
            this.form.TPremoneydtsList[0].pdAmount = item.PD_AMOUNT;
            this.form.TPremoneydtsList[0].pdId = item.PD_ID;
            this.form.TPremoneydtsList[0].pdSubjectname = item.PD_SUBJECTNAME;
            this.form.TPremoneydtsList[0].pdSubjectnum = item.PD_SUBJECTNUM;
            this.getUserBank(item.PD_HANDMAN);
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
      this.getUserBank(val.uId);
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
<style scoped>
</style>
