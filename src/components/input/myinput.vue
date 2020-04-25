<template>
  <div class="myinput" :class="isdisabled?'disable':''" :style="border">
    <span>
      <span>{{inputname}}</span>
      <span class="redcolor" v-show="showstar">*</span>
      <i class="el-icon-question help" v-show="showicon"></i>
    </span>
    <input
      :disabled="isdisabled"
      type="text"
      class="inlineinput"
      @focus="setcolor($event.target)"
      @blur="recolor($event.target)"
      :placeholder="msg"
      v-model="inputvalue"
      @change="changeEvent"
    />
    <i
      class="fa fa-search pointer searchperson"
      v-show="searchicon2"
      @click="opendialogbox('select')"
    ></i>
    <i class="fa fa-plus pointer searchperson" v-show="searchicon1" @click="opendialogbox('add')"></i>
    <i class="el-icon-date pointer date" v-show="showdate"></i>
    <span class="quan" v-show="showtexticon">全</span>
    <span class="qing" v-show="showtexticon">清</span>
  </div>
</template>
<script>
import { type } from "os";
import { truncate } from "fs";
export default {
  props: {
    //inputname 输入框标题
    inputname: {
      type: String,
      default: ""
    },
    // inputvalue: {
    //   type: String,
    //   default: ""
    // },
    //showicon 是否显示问好图标
    showicon: {
      type: Boolean,
      default: true
    },
    //searchicon 是否显示输入框尾部图标
    searchicon1: {
      type: Boolean,
      default: true
    },
    searchicon2: {
      type: Boolean,
      default: true
    },
    //showdate是否显示日期图标
    showdate: {
      type: Boolean,
      default: false
    },
    //msg是input的提示语
    msg: {
      type: String,
      default: ""
    },
    //  isdisabled是否禁用输入框
    isdisabled: {
      type: Boolean,
      default: false
    },
    // showstar 是否显示红色星号
    showstar: {
      type: Boolean,
      default: true
    },
    //showtexticon是否显示文字图标
    showtexticon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputvalue:'',
      border: ""
    };
  },
  created() {},
  methods: {
    changeEvent() {
      this.$emit("changeEvent", this.inputvalue);
    },
    setcolor(e) {
      this.border = "border:1px solid #4f90d4;color:#4f90d4";
    },

    recolor(e) {
      this.border = "";
      this.$emit("getinputvalue", e.value);
    },

    opendialogbox(val) {
      if (val === "add") {
        this.$emit("openAdddialog", true);
      }
      if (val === "select") {
        this.$emit("openSelectdialog", true);
      }
    }
  }
};
</script>

<style>
.myinput {
  width: 200px;
  position: relative;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 6px;
  box-sizing: border-box;
  font-size: 14px;
}

.myinput {
  margin-right: 10px;
}
.searchperson {
  color: #999;
  cursor: pointer;
}
.searchperson:hover {
  color: #2793ff;
}
.myinput .redcolor,
.disable .redcolor {
  color: red;
}

.myinput .help {
  font-size: 12px;
  border-radius: 50%;
  color: #4f90d4;
}

.myinput .inlineinput {
  width: 90px;
  height: 22px;
  padding: 2px;
  border: none;
}
.myinput .inlineinput:focus {
  outline: none;
}
.disable .date {
  cursor: not-allowed;
}

.pointer {
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 10px;
}
.myinput .fa-search {
  right: 10px;
}
.myinput .fa-plus {
  right: 30px;
}
.myinput:hover {
  color: #4f90d4;
  border: 1px solid #4f90d4;
}

.disable,
.disable input {
  background-color: rgb(235, 235, 228);
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 6px;
  box-sizing: border-box;
  margin-right: 10px;
  cursor: not-allowed !important;
}
.disable:hover {
  border: 1px solid #eee;
  color: #000;
}
.disables {
  background-color: #fff;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 6px;
  box-sizing: border-box;
  margin-left: 10px;
}
.myinput .quan,
.myinput .qing {
  border-radius: 3px;
  background-color: #5993d1;
  color: #fff;
  padding: 0 2px;
  cursor: pointer;
  height: 20px;
  line-height: 20px;
  width: 20px;
  top: 5px;
  right: 10px;
  position: absolute;
}
.myinput .qing {
  background-color: rgb(172, 165, 165);
  right: 10px;
}
.myinput .quan {
  right: 35px;
}
.date {
  border: none;
}
.mytext {
  display: inline-block;
  margin-left: 10px;
  width: 210px;
}
.allwidth {
  width: 100%;
}
.allwidth .inlineinput {
  width: 88%;
}
</style>

