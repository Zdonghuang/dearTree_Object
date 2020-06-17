<template>
  <div>
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left"></el-col>
      <el-col :xs="24" :sm="8" align="center">
        <p class="title">其他支出单</p>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <!-- <el-button size="small" icon="el-icon-refresh" @click="Refresh">刷新</el-button> -->
          <!-- <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button> -->
          <el-button size="small" icon="el-icon-printer" @click="Printing">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6">
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
      <el-col :xs="24" :sm="6">
        <el-input placeholder="开户行及账号" v-model="form.cuBankname" size="small" readonly>
          <template slot="prepend">开户行及账号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="纳税人识别号" v-model="form.cuTaxnum" size="small" readonly>
          <template slot="prepend">纳税人识别号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="开票名称及户名" v-model="form.cuRemark" size="small" readonly>
          <template slot="prepend">开票名称及户名</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="地址及电话" v-model="form.cuBankcardnum" size="small" readonly>
          <template slot="prepend">地址及电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
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
      <el-col :xs="24" :sm="6">
        <el-input
          placeholder="付款账户"
          v-model="form.banknamegh"
          size="small"
          readonly
          :disabled="form.PD_STATUS!=1"
        >
          <template slot="prepend">付款账户</template>
          <i
            v-if="form.PD_STATUS==1"
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="showDialog('showSelectBankAccount')"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
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
      <el-table-column type="index" width="55" align="center" prop="index" label="序号"></el-table-column>
      <el-table-column v-if="!disabled" prop="tools" label="操作" align="center" width="80">
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
            class="ipt tc"
            @change="setmoney(scope.row)"
            :disabled="disabled"
          />
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="备注">
        <template slot-scope="scope" v-if="scope.row.cAttrvalue">
          <input type="text" v-model="scope.row.pdRemark" class="ipt tc" />
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24">
        <el-input placeholder="备注" v-model="form.rRemark" size="small" :disabled="disabled">
          <template slot="prepend">备注</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="5" :xs="24">
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
    <br />
    <br />
    <br />
    <br />
    <br />
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      @opendialogs="opendialogs()"
      @ctrls="opendialog('false')"
      :hideBtn1="false"
      BtnText1="修改科目"
      :hideBtn2="!disabled"
      :hideBtn3="form.PD_STATUS==2"
      v-has="512"
      v-if="form.PD_APPROVALSTATUS==2&&!$router.history.current.query.from"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
    <my-footer
      :Totalamount="Totalprice"
      @opendialog="opendialog(form.PD_APPROVALSTATUS==2?1:0)"
      @opendialogs="opendialogs()"
      @ctrls="opendialog('false')"
      :hideBtn1="false"
      BtnText1="修改科目"
      :hideBtn2="!disabled"
      :hideBtn3="form.PD_STATUS==2"
      v-if="form.PD_APPROVALSTATUS!=2&&!$router.history.current.query.from"
      :BtnText="form.PD_APPROVALSTATUS==2?'单据记账':'提交审批'"
    ></my-footer>
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
      <selectBankAccount @emitBankAccountData="getBankAccountData1" parentCode="40"></selectBankAccount>
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
          sums[index] = "合计";
          return;
        }
        if (column.property === "PAmount") {
          values = data.map(item => Number(item.PAmount));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);

          if (this.form.PD_APPROVALSTATUS != 2) {
            this.rTotalprice = sums[index];
          }
          sums[index] = this.$PublicJS.money(sums[index], 2);
          sums[index] += " 元";
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/printingFinancePay?data=${data}`, "_blank");
    },
    getdata() {
      this.tableData = [];
      const params = { pid: this.pid };
      if (this.$route.query.from) {
        params.from = this.$route.query.from;
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
              this.rTotalprice = item.PD_AMOUNTTOTAL;
              this.form.PD_STATUS = item.PD_STATUS;
              this.form.pdpid = item.PD_PID;
              if (item.PD_FILESTR) {
                this.form.pdfilestr = Array.isArray(JSON.parse(item.PD_FILESTR))
                  ? JSON.parse(item.PD_FILESTR)
                  : JSON.parse(JSON.parse(item.PD_FILESTR));
                this.fileList = this.form.pdfilestr;
              }
              if (item.PD_APPROVALSTATUS == 0) item.PD_APPROVALSTATUS = 2;
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
            obj.pdRemark = item.PD_REMARK;
            obj.cAttrvalue = item.PD_SUBJECTNAME;
            obj.cAttrcode = item.PD_SUBJECTNUM;
            obj.pdPid = item.PD_PID;
            obj.pdId = item.PD_ID;
            obj.pdApprovalstatus = item.PD_APPROVALSTATUS;
            obj.pdStatus = item.PD_STATUS;
            this.tableData.push(obj);
          });
        }
      });
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
      let n = 0;
      let num = 0;
      this.tableData.map(item => {
        if (item.cAttrvalue && item.PAmount > 0) {
          num += Number(item.PAmount);
          n++;
        }
      });
      if (!n) return this.$message.error("请选择科目或填写金额");
      if (
        this.Totalprice != Math.round(num * 100) / 100 &&
        this.form.PD_APPROVALSTATUS == 2
      )
        return this.$message.error("费用不一致，请调整费用");
      if (val == "false") return this.submit("false");
      if (val) return this.submit(1);
      this.showDD = true;
    },
    openlink(url) {
      window.open(url, "_blank");
    },
    opendialogs(val) {
      this.$confirm("此操作将红冲此单据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
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
          div: 86,
          pdfilestr: JSON.stringify(this.form.pdfilestr),
          TPremoneydtsList: []
        };

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
            obj.pdStatus = 4;
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
            this.$router.push("/payList");
          } else {
            this.$message("提交失败");
          }
        });
      });
    },
    submit(val, val1) {
      if (val) {
        let param = {
          pCuid: this.form.pCuid,
          remark: this.form.rRemark,
          handman: this.form.rHandman,
          banknamegh: this.form.banknamegh,
          bankaccountgh: this.form.bankaccountgh,
          div: 86,
          pdfilestr: JSON.stringify(this.form.pdfilestr),
          TPremoneydtsList: []
        };
        if (val == 1 && !this.form.banknamegh)
          return this.$message.error("请选择账户");
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
            obj.pdApprovalstatus = item.pdApprovalstatus;
            obj.pdStatus = item.pdStatus;
            param.TPremoneydtsList.push(obj);
          }
        });
        this.formData = new FormData();
        this.$refs.upload.submit();
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
              this.$router.push("/payList");
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          this.$ajax.post("/system/upload", this.formData).then(res => {
            param.pdfilestr = JSON.parse(param.pdfilestr);
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
                    this.$router.push("/payList");
                  } else {
                    this.$message("提交失败");
                  }
                });
              } else {
                param.TPremoneydtsList.map(item => {
                  item.pdStatus = 2;
                  item.pdApprovalstatus = 2;
                });
                this.$api.Premoney.financialAccounting(param).then(res => {
                  loading.close();
                  if (res.code === 200) {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    });
                    this.$router.push("/payList");
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
<style scoped>
</style>
