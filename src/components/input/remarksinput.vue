<template>
  <div class="remarksinput" :class="isdisabled?'disable':''">
    <span>{{inputname}}</span>
    <input type="text" @focus="setstyle" @blur="resetstyle" :disabled="isdisabled" :value="inputvalue" />
  </div>
</template>
<script>
import { type } from "os";
import { truncate } from "fs";
export default {
  props: {
    isdisabled: {
      type: Boolean,
      default: false
    },
    inputname: {
      type: String,
      default: ''
    },
    inputvalue: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      style: ""
    };
  },
  created() {},
  methods: {
    setstyle() {
      this.style = "border:1px solid #4f90d4;color:#4f90d4";
    },
    resetstyle() {
      this.style = "";
    }
  }
};
</script>

<style scoped>
.remarksinput {
  width: 100%;
  /* min-width: 600px; */
  position: relative;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  padding: 0 6px;
  border: 1px solid #eee;
  box-sizing: border-box;
  color: black;
  font-size: 14px;
  background-color: #fff;
  margin-bottom: 10px;
}
.remarksinput:hover {
  border: 1px solid #4f90d4;
  color: #4f90d4;
}
.remarksinput input {
  width: 65%;
  height: 22px;
  padding: 4px;
  border: none;
}
.remarksinput input:focus {
  outline: none;
}
.disable:hover {
  border: 1px solid #eee;
  color: #000;
}
</style>

