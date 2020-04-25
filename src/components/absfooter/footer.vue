<template>
  <div class="content">
    <div class="footer">
      <el-row>
        <el-col :xs="24" :sm="4">
          <div class="left">
            <div>
              <span></span>
              <i class></i>
              <span></span>
              <p></p>
            </div>
            <!-- <span>打印次数</span> -->
          </div>
        </el-col>
        <el-col :xs="24" :sm="14" align="center">
          <div class="center">
            <div class="jine" v-if="centertext">
              <span>{{title}}</span>
              <span>￥</span>
              <span>{{Totalamount}}</span>
            </div>
            <div class="jine" v-if="!centertext">
              <span>{{title}}</span>
              <span></span>
              <span>{{Totalamount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6" align="right">
          <div v-if="!$router.history.current.query.from">
            <div class="toolright">
              <div class="ruku" @click="opendialog4" v-if="hideBtn4">
                <p>{{BtnText4}}</p>
              </div>
              <div class="baocun" @click="ctrls" v-if="hideBtn1">
                <p>{{BtnText1}}</p>
              </div>
              <div class="box" v-if="HSRK">
                <el-checkbox @change="setcheck" v-model="check" style="color:red;font-weight:900;">
                  <span style="font-size:18px;">是否平摊施工费用</span>
                </el-checkbox>
              </div>
              <div class="box" v-if="jiesuan">
                <el-checkbox @change="setcheck1" v-model="check1">是否结算费用</el-checkbox>
              </div>
              <div class="jizhang" @click="opendialog" v-if="hideBtn2">
                <p>{{BtnText}}</p>
              </div>
              <div class="jizhang" @click="opendialogs" v-if="hideBtn3">
                <p>{{BtnText3}}</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    number: {
      default: 0
    },
    Totalamount: {
      default: 0
    },
    BtnText: {
      default: "提交审核"
    },
    BtnText1: {
      default: "保存草稿"
    },
    BtnText3: {
      default: "财务红冲"
    },
    BtnText4: {
      default: ""
    },
    hideBtn1: {
      default: true
    },
    hideBtn2: {
      default: true
    },
    hideBtn3: {
      default: false
    },
    hideBtn4: {
      default: false
    },
    title: {
      default: "本单金额"
    },
    centertext: {
      default: true
    },
    HSRK: {
      default: false
    },
    jiesuan: {
      default: false
    }
  },
  data() {
    return {
      orderDate: "",
      check: false,
      check1: false,
      userName: this.$storage.userName
    };
  },
  created() {
    this.orderDate = this.$PublicJS.nowDate();
  },
  methods: {
    opendialog() {
      this.$emit("opendialog", true);
    },
    opendialogs() {
      this.$emit("opendialogs", true);
    },
    opendialog4() {
      this.$emit("opendialog4", true);
    },
    ctrls() {
      this.$emit("ctrls");
    },
    apply() {
      this.$emit("apply");
    },
    setcheck() {
      this.$emit("setcheck", this.check);
    },
    setcheck1() {
      this.$emit("setcheck1", this.check1);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

