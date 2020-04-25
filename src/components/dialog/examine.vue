//审核框
<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>审核人</span>
          </div>
          <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%"
            size="mini"
            height="300px"
            header-cell-class-name="thbgc"
          >
            <el-table-column sortable align="center" width="55" type="index"  label="序号"></el-table-column>
            <el-table-column sortable
              align="center"
              show-overflow-tooltip
              label="操作"
              width="100"
              
            >
              <template slot-scope="scope">
                <i class="el-icon-circle-plus add" @click="adddate()"></i>
                <i class="el-icon-circle-close del" @click="deldate(scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column sortable align="center" property="uName" label="姓名">
              <template slot-scope="scope">
                <input
                  type="text"
                  v-model="scope.row.name"
                  @blur="showicon($event)"
                  @focus="hiddenicon($event)"
                  class="ipt"
                  readonly
                />
                <i class="fa fa-search searchname" @click="searchbox($event,scope.$index,1)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="11" :push="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>抄送人</span>
          </div>
          <el-table
            :data="tableData1"
            border
            highlight-current-row
            style="width: 100%"
            size="mini"
            height="300px"
            header-cell-class-name="thbgc"
          >
            <el-table-column sortable align="center" width="55" type="index"  label="序号"></el-table-column>
            <el-table-column sortable
              align="center"
              show-overflow-tooltip
              label="操作"
              width="100"
              
            >
              <template slot-scope="scope">
                <i class="el-icon-circle-plus add" @click="adddate1()"></i>
                <i class="el-icon-circle-close del" @click="deldate1(scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column sortable align="center" property="name" label="姓名">
              <template slot-scope="scope">
                <input
                  type="text"
                  v-model="scope.row.name"
                  @blur="showicon($event)"
                  @focus="hiddenicon($event)"
                  class="ipt"
                  readonly
                />
                <i class="fa fa-search searchname" @click="searchbox($event,scope.$index,2)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <br />
      <el-col align="right">
        <el-button size="mini" @click="close(0)">取消</el-button>
        <el-button type="primary" size="mini" @click="close(1)">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    ID: {},
    ID1: {},
    rtype: 0
  },
  watch: {
    ID: {
      handler: function(newv, oldv) {
        let obj = {
          name: newv.uName,
          dingding: newv.uDingding
        };
        let flag = true;
        this.tableData.map(item => {
          if (obj.name && item.name == obj.name) {
            flag = false;
          }
        });
        if (flag) {
          this.tableData.splice(this.rowindex, 1, obj);
        }
      },
      deep: true,
      immediate: true
    },
    ID1: {
      handler: function(newv, oldv) {
        let obj = {
          name: newv.uName,
          dingding: newv.uDingding
        };
        let flag = true;
        this.tableData1.map(item => {
          if (obj.name && item.name == obj.name) {
            flag = false;
          }
        });
        if (flag) {
          this.tableData1.splice(this.rowindex, 1, obj);
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      tableData: [{}, {}, {}],
      tableData1: [{}, {}, {}],
      rowindex: 0,
      value2: [],
      value1: [],
    };
  },
  created() {
    if (this.$props.rtype) {
      this.getperson();
    }
  },
  methods: {
    adddate() {
      if (this.tableData.length < 5) {
        this.tableData.push({});
      }
    },
    deldate(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    adddate1() {
      if (this.tableData1.length < 5) {
        this.tableData1.push({});
      }
    },
    deldate1(index) {
      if (this.tableData1.length > 1) {
        this.tableData1.splice(index, 1);
      }
    },
    showicon(e) {
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.opacity = "0";
      }
    },
    hiddenicon(e) {
      if (e.target.nextElementSibling) {
        this.icon = e.target.nextElementSibling;
        e.target.nextElementSibling.style.opacity = "1";
      }
    },
    searchbox(e, val, n) {
      this.rowindex = val;
      if (e.target === this.icon) {
        this.icon = "";
        this.$emit("openuser", n);
      }
    },
    getperson() {
      this.$api.Common.getPerson({ rtype: this.$props.rtype }).then(res => {
        if (res.data&&res.data.length) {
          this.tableData = [];
          this.tableData1 = [];
          res.data.map(item => {
            item.name = item.uname;
            item.dingding = item.udingding;
            if (item.div == 1) {
              this.tableData.push(item);
            } else {
              this.tableData1.push(item);
            }
          });
        }
        if(!this.tableData1.length){
          this.tableData1= [{}, {}, {}]
        }
      });
    },
    close(n) {
      if (!n) {
        this.$emit("close", false);
      } else {
        this.value2 = [];
        this.tableData.map(item => {
          if (item.dingding) {
            this.value2.push(item.dingding);
          }
        });
        this.tableData1.map(item => {
          if (item.dingding) {
            this.value1.push(item.dingding);
          }
        });
        if (this.value2.length > 0) {

          this.$emit("close", this.value2,this.value1);
        } else {
          this.$message("请选择审核人");
        }
      }
    }
  }
};
</script>
<style scoped>
.el-table {
  overflow-y: hidden;
}
</style>
