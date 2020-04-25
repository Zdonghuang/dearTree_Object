<template>
  <div>
    <div class="titlebarMenu">
      <div class="fl">
        <el-button size="small" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
        <el-dialog title="新增费用审批" :close-on-click-modal="false"  v-dialogDrag :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="申请标题" :label-width="formLabelWidth">
              <el-input v-model="form.name6" autocomplete="off" placeholder="请输入支付对象名称"></el-input>
            </el-form-item>
            <el-form-item label="费用科目" :label-width="formLabelWidth">
              <el-input placeholder="请选择费用科目" size="small">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="预算额度" :label-width="formLabelWidth">总额：30000 余额：19837 占比：56%</el-form-item>
            <el-form-item label="付款方式" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择付款方式" size="small">
                <el-option label="支票" value="1"></el-option>
                <el-option label="电汇" value="2"></el-option>
                <el-option label="现金" value="3"></el-option>
                <el-option label="银行卡" value="4"></el-option>
                <el-option label="贷记" value="5"></el-option>
                <el-option label="其它" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="金额" :label-width="formLabelWidth">
              <el-input v-model="form.name1" autocomplete="off" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="说明" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                placeholder="请输入内容"
                v-model="form.name2"
              ></el-input>
            </el-form-item>
            <el-form-item label="支付对象" :label-width="formLabelWidth">
              <el-input v-model="form.name3" autocomplete="off" placeholder="请输入支付对象名称"></el-input>
            </el-form-item>
            <el-form-item label="开户行" :label-width="formLabelWidth">
              <el-input v-model="form.name4" autocomplete="off" placeholder="请输入银行帐号或商户ID"></el-input>
            </el-form-item>
            <el-form-item label="帐号" :label-width="formLabelWidth">
              <el-input v-model="form.name5" autocomplete="off" placeholder="请输入银行帐号或商户ID"></el-input>
            </el-form-item>
            <el-form-item label="关联单据" :label-width="formLabelWidth">HSDD-20190801-0001</el-form-item>
            <el-form-item label="附件" :label-width="formLabelWidth">图片 / 文档</el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">提交钉钉审批</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="fr toolsbox">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
        </el-button-group>
      </div>
    </div>
    <br />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6">
        <el-date-picker
          v-model="value2"
          type="daterange"
          align="right"
          size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请选择分公司" size="small">
          <template slot="prepend">分公司</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="请选择费用科目" size="small">
          <template slot="prepend">费用科目</template>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-input placeholder="支付对象/银行帐号/备注" size="small">
          <template slot="prepend">关键字</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button size="small" icon="el-icon-search">查询</el-button>
        <el-button size="small" icon="el-icon-refresh">重置</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" border show-summary style="width: 100%" height="500">
      <el-table-column prop="btn" label="操作" width="150"></el-table-column>
      <el-table-column sortable prop="no" label="内部单号" width="150"></el-table-column>
      <el-table-column sortable prop="company" label="标题" min-width="200"></el-table-column>
      <el-table-column sortable prop="date" label="费用科目" width="250"></el-table-column>
      <el-table-column sortable prop="name" label="金额" width="100"></el-table-column>
      <el-table-column sortable prop="province" label="状态" width="100"></el-table-column>
      <el-table-column sortable prop="city1" label="关联单据" width="200"></el-table-column>
      <el-table-column sortable prop="city" label="时间" width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  methods: {
    gotoNewOrder() {
      this.$router.push("/recover/recoverPriceOrderDtl");
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        name1: "",
        name2: "",
        name3: "",
        name4: "",
        name5: "",
        name6: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "银行帐户"
        },
        {
          value: "2",
          label: "现金帐户"
        }
      ],
      value: "",
      tableData: [
        {
          btn: "详情 - 打印 - 记帐",
          no: "PAY-20190801-0001",
          company: "某某项目施工费用",
          date: "施工人工费",
          name: 800,
          province: "审批中",
          city: "2019-08-01 13:29:10",
          city1: "HSDD-20190801-0001"
        },
        {
          btn: "详情 - 打印 - 记帐",
          no: "PAY-20190801-0001",
          company: "某某项目施工费用",
          date: "施工车辆费",
          name: 1800,
          province: "审批中",
          city: "2019-08-01 13:29:10",
          city1: "HSDD-20190801-0001"
        },
        {
          btn: "详情 - 打印 - 记帐",
          no: "PAY-20190801-0001",
          company: "某某项目施工费用",
          date: "施工人工费",
          name: 300,
          province: "审批通过",
          city: "2019-08-01 13:29:10",
          city1: "HSDD-20190801-0001"
        },
        {
          btn: "详情 - 打印 - 记帐",
          no: "PAY-20190801-0001",
          company: "某某项目施工费用",
          date: "施工人工费",
          name: 800,
          province: "审批中",
          city: "2019-08-01 13:29:10",
          city1: "HSDD-20190801-0001"
        }
      ]
    };
  }
};
</script>

<style>
.el-col {
  margin-bottom: 1rem;
}
</style>
