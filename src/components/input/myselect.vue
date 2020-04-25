<template>
  <div class="content" @click="showselect">
    <span class="name">{{selectname}}</span>
    <span class="select">{{value1}}</span>
    <i class="fa fa-caret-down"></i>
    <div :style="none">
      <p
        v-for="(item,i) in options"
        :key="i"
        @click="setvalue($event)"
        @mouseenter="setbgc($event)"
        @mouseout="resetbgc($event)"
      >{{item.label}}</p>
    </div>
  </div>
</template>
<script>
import { truncate, write } from "fs";
export default {
  props: {
    selectname: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: [
        {
          value: "",
          label: ""
        }
      ]
    }
  },
  data() {
    return {
      value4: "",
      key: true,
      none: "display:none",
      value1: "请选择"
    };
  },
  created() {
    window.addEventListener("click", e => {
      let arr = ["fa fa-caret-down", "content", "name", "select"];
      if (arr.indexOf(e.target.className) < 0 && this.none === "display:block") {
        this.key = true;
        this.none = "display:none";
      }
    });
  },
  methods: {
    showselect() {
      if (this.key) {
        this.key = false;
        this.none = "display:block";
      } else {
        this.key = true;
        this.none = "display:none";
      }
    },
    setvalue(e) {
      this.value1 = e.target.innerHTML;
    },
    setbgc(e) {
      e.target.style.background = "#76b2ee";
    },
    resetbgc(e) {
      e.target.style.background = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  border: 1px solid #eee;
  border-radius: 4px;
  line-height: 32px;
  position: relative;
  display: inline-block;
  padding: 0 4px;
  cursor: pointer;
  width: 200px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .name {
  }
  .select {
    display: inline-block;
    color: rgb(134, 129, 129);
    width: 140px;
    padding-left: 10px;
  }
  i {
    position: absolute;
    right: 8px;
    top: 7px;
  }
  > div {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    border-radius: 6px;
    z-index: 1000000;
    p {
      padding: 0;
      margin: 0;
      padding-left: 8px;
      background-color: rgb(243, 235, 235);
      color: rgb(8, 8, 8);
    }
    p:hover {
      color: #fff;
    }
  }
  > div:scrollvar {
    width: 4px;
  }
}
.content:hover {
  color: #2793ff;
  border: 1px solid #2793ff;
}
</style>
