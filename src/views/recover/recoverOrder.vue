<template>
  <div v-if="load">
    <el-row :gutter="20" class="titleBox">
      <el-col :xs="24" :sm="8" align="left">
        <div v-if="BH">
          <span class="billNuber">NO.</span>
          <span class="billCode">{{ BH }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" align="center">
        <span class="title">回收报价单</span>
      </el-col>
      <el-col :xs="24" :sm="8" align="right">
        <el-button-group v-if="!$router.history.current.query.from">
          <el-button size="small" icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button size="small" icon="el-icon-download" v-has="383">导出</el-button>
          <el-button size="small" icon="el-icon-printer" @click="Printing" v-has="2011">打印</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6">
        <el-input
          placeholder="回收供应商"
          v-model="form.rCuidv"
          size="small"
          readonly
          :disabled="showbank"
        >
          <template slot="prepend">回收供应商</template>
          <!-- <i slot="suffix" class="el-input__icon el-icon-plus" @click="showDialog('showAddClient')"></i> -->
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showSelectClient')"
            v-if="!showbank"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rCid"
          placeholder="请选择联系人"
          size="small"
          @change="selectChange"
          :disabled="showbank"
        >
          <el-option
            v-for="item in contact"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="入库仓库"
          v-model="form.rWhidv"
          size="small"
          readonly
          :disabled="showbank&&!form.warehouseNum"
        >
          <template slot="prepend">入库仓库</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showSelectWarehouse')"
            v-if="!showbank&&form.warehouseNum"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input
          placeholder="经手人"
          v-model="form.rHandmanv"
          size="small"
          readonly
          :disabled="showbank"
        >
          <template slot="prepend">经手人</template>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="opendialog('showSelectUser')"
            v-if="!showbank"
          ></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-select
          v-model="form.rOid"
          filterable
          placeholder="请选择归属公司"
          size="small"
          @change="selectChanges('rOid')"
          class="selectSlot4"
        >
          <template slot="prefix">
            <span class="prefixSlot">
              <b>*</b>归属公司
            </span>
          </template>
          <el-option
            v-for="(item,index) in rOidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:40px">{{ index+1 }}</span>
            <span style="float: left; width:120px">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="联系电话" v-model="form.rCmobile" size="small" disabled>
          <template slot="prepend">联系电话</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-input placeholder="单据日期" v-model="form.rDate" size="small" disabled>
          <template slot="prepend">单据日期</template>
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-input placeholder="收货地址" v-model="form.rCaddr" size="small" disabled>
          <template slot="prepend">收货地址</template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>回收商品列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          size="mini"
          :height="rId?null:'300px'"
          :show-summary="true"
          :summary-method="getSummaries"
          sum-text="合计"
          @cell-click="checkTable"
        >
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column sortable width="100" align="center" property="gItemnum" label="货号"></el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            property="tools"
            label="操作"
            align="center"
            width="80"
            v-if="!showbank"
          >
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(1)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,1)"></i>
            </template>
          </el-table-column>
          <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
            <template slot-scope="scope" v-if="scope.row.gImage">
              <el-popover
                placement="right"
                trigger="hover"
                v-for="(url,i) in scope.row.gImage"
                :key="i"
              >
                <img :src="img" width="240" />
                <img
                  slot="reference"
                  :src="`${baseUrl}api${url}`"
                  @mouseover="setimg(`${baseUrl}api${url}`)"
                  v-if="i<3"
                  class="tableimg"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column sortable property="gName">
            <template slot="header">
              <i class="el-icon-question bluecolor"></i>
              <span>商品名称</span>
              <!-- <span class="bluecolor">&nbsp;&nbsp;&nbsp;扫描枪录入</span> -->
            </template>
            <template slot-scope="scope">
              <input
                type="text"
                v-model="scope.row.gName"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                class="ipt"
                readonly
              />
              <i
                class="fa fa-search searchname"
                v-if="!showbank"
                @click="searchbox($event,scope.$index,1)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column sortable property="rdQuantity" label="数量">
            <template slot-scope="scope">
              <input
                v-if="scope.row.rdQuantity"
                type="text"
                minlength="1"
                v-model="scope.row.rdQuantity"
                @blur="setnum(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable property="gUnitv" label="单位"></el-table-column>
          <el-table-column sortable property="iSellingprice" label="单价">
            <template slot-scope="scope">
              <input
                minlength="1"
                type="text"
                v-model="scope.row.iSellingprice"
                @blur="setdanjia(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable label="金额" property="money">
            <template v-if="money">{{money}}</template>
          </el-table-column>
          <el-table-column
            sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            label="品牌"
          ></el-table-column>
          <el-table-column sortable property="gSpec" label="规格"></el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            property="gPzysv"
            show-overflow-tooltip
            label="配置"
          ></el-table-column>
          <el-table-column sortable width="80" align="center" property="gColorv" label="颜色"></el-table-column>
          <el-table-column sortable property="gRemark" label="备注">
            <template slot-scope="scope">
              <input
                :readonly="showbank"
                type="text"
                v-model="scope.row.gRemark"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                class="ipt"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>清理商品列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData2"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          size="mini"
          :height="rId?null:'300px'"
          :show-summary="true"
          :summary-method="getSummaries2"
          sum-text="合计"
          @cell-click="checkTable"
        >
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column sortable width="100" align="center" property="gItemnum" label="货号"></el-table-column>
          <el-table-column
            sortable
            show-overflow-tooltip
            property="tools"
            label="操作"
            align="center"
            width="80"
            v-if="!showbank"
          >
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(2)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,2)"></i>
            </template>
          </el-table-column>
          <el-table-column sortable prop="gImage" label="图片" width="120" align="center">
            <template slot-scope="scope" v-if="scope.row.gImage">
              <el-popover
                placement="right"
                trigger="hover"
                v-for="(url,i) in scope.row.gImage"
                :key="i"
              >
                <img :src="img" width="240" />
                <img
                  slot="reference"
                  :src="`${baseUrl}api${url}`"
                  @mouseover="setimg(`${baseUrl}api${url}`)"
                  v-if="i<3"
                  class="tableimg"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column sortable property="gName">
            <template slot="header">
              <i class="el-icon-question bluecolor"></i>
              <span>商品名称</span>
              <!-- <span class="bluecolor">&nbsp;&nbsp;&nbsp;扫描枪录入</span> -->
            </template>
            <template slot-scope="scope">
              <input
                type="text"
                v-model="scope.row.gName"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                class="ipt"
                readonly
              />
              <i
                class="fa fa-search searchname"
                v-if="!showbank"
                @click="searchbox($event,scope.$index,2)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column sortable property="rdQuantity" label="数量">
            <template slot-scope="scope">
              <input
                v-if="scope.row.rdQuantity"
                type="text"
                minlength="1"
                v-model="scope.row.rdQuantity"
                @blur="setnum(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable property="gUnitv" label="单位"></el-table-column>
          <el-table-column sortable property="iSellingprice" label="单价">
            <template slot-scope="scope">
              <input
                v-if="scope.row.iSellingprice"
                minlength="1"
                type="text"
                v-model="scope.row.iSellingprice"
                @blur="setdanjia(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable label="金额" property="money">
            <template v-if="money2">{{money2}}</template>
          </el-table-column>
          <el-table-column
            sortable
            width="120"
            align="center"
            show-overflow-tooltip
            property="gBrandv"
            label="品牌"
          ></el-table-column>
          <el-table-column sortable property="gSpec" label="规格"></el-table-column>
          <el-table-column
            sortable
            width="100"
            align="center"
            property="gPzysv"
            show-overflow-tooltip
            label="配置"
          ></el-table-column>
          <el-table-column sortable property="gRemark" label="备注">
            <template slot-scope="scope">
              <input
                :readonly="showbank"
                type="text"
                v-model="scope.row.gRemark"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                class="ipt"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>其它服务列表</span>
      </div>
      <div class="text item">
        <el-table
          ref="singleTable"
          :data="tableData3"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          size="mini"
          :height="rId?null:'300px'"
          :show-summary="true"
          :summary-method="getSummaries3"
          sum-text="合计"
        >
          <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
          <el-table-column property="tools" label="操作" align="center" width="80" v-if="!showbank">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus add" @click="adddate(3)"></i>
              <i class="el-icon-circle-close del" @click="deldate(scope.$index,3)"></i>
            </template>
          </el-table-column>
          <el-table-column sortable label="服务类型" width="150" align="center">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.gId" placeholder="请选择" :disabled="showbank">
                <el-option
                  v-for="item in SPFL"
                  :key="item.gId"
                  :label="item.cAttrvalue"
                  :value="item.gId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column sortable property="rdQuantity" label="数量">
            <template slot-scope="scope">
              <input
                v-if="scope.row.gId"
                type="text"
                minlength="1"
                v-model="scope.row.rdQuantity"
                @blur="setnum(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable property="iSellingprice" label="单价">
            <template slot-scope="scope">
              <input
                v-if="scope.row.rdQuantity"
                minlength="1"
                type="text"
                v-model="scope.row.iSellingprice"
                @blur="setdanjia(scope.row)"
                class="ipt"
                :readonly="showbank"
              />
            </template>
          </el-table-column>
          <el-table-column sortable label="金额" property="money" align="center">
            <template v-if="money3">{{money3}}</template>
          </el-table-column>
          <el-table-column sortable property="gRemark" label="备注" align="center">
            <template slot-scope="scope">
              <input
                v-if="scope.row.gId"
                :readonly="showbank"
                type="text"
                v-model="scope.row.gRemark"
                @blur="showicon($event)"
                @focus="hiddenicon($event)"
                class="ipt"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>施工环境信息</span>
      </div>
      <div class="text item">
        <el-form label-width="110px" :model="Envform">
          <el-row :gutter="20" class="mbottom">
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工保护: ">
                <el-switch
                  v-model="Envform.rcSgbh"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="强弱电处理: ">
                <el-switch
                  v-model="Envform.rcQrdcl"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="交叉施工: ">
                <el-switch
                  v-model="Envform.rcJcsg"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="专梯: ">
                <el-switch
                  v-model="Envform.rcSqzt"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="出门条: ">
                <el-switch
                  v-model="Envform.rcCmt"
                  active-text="是"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="装车位置: ">
                <el-switch
                  v-model="Envform.rcZcwz"
                  active-text="地面"
                  :active-value="2"
                  :inactive-value="1"
                  inactive-text="地库"
                  :disabled="showbank"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="工地距离(公里): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcGdjl"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="搬运距离(米): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcByjl"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="地库限高(米): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcDkxg"
                  :precision="1"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯长(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccL"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯宽(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccW"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯高(cm): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtccH"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="停车费(元): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcTcf"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="专梯费用(元): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcZtfy"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工楼层(层): ">
                <el-input-number size="mini" v-model="Envform.rcSglc" :disabled="showbank"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯数量(部): ">
                <el-input-number
                  size="mini"
                  v-model="Envform.rcHtsl"
                  :precision="0"
                  :disabled="showbank"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="货梯用时(分): ">
                <el-input size="mini" v-model="Envform.rcHtsj" :disabled="showbank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-form-item label="施工日期: ">
                <el-date-picker
                  v-model="Envform.rcSgrq"
                  type="date"
                  size="mini"
                  style="width:160px"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :disabled="showbank"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="施工环境备注: ">
                <el-input size="mini" v-model="Envform.rcRemark" :disabled="showbank"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-row>
      <el-col :sm="18" :xs="24">
        <el-input v-model="form.rRemark" size="small" :disabled="showbank">
          <template slot="prepend">单据备注</template>
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
          <el-button size="mini" type="primary" v-if="form.rStatus==30">上传单据附件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <div class="flies" v-for="(url,i) in fileList" :key="i">
      <img
        width="140"
        @click="openlink(`${baseUrl}api${url}`)"
        v-if="url.indexOf('jpg')>=1||url.indexOf('png')>=1||url.indexOf('gif')>=1"
        :src="`${baseUrl}api${url}`"
        class="pointer"
      />
      <a v-else href="javascript:void(0);" @click="openlink(`${baseUrl}api${url}`)" title="文档连接">
        <i style="font-size:104px" class="fa fa-file-text-o"></i>
      </a>
    </div>
    <br />
    <br />
    <div class="bigbox" v-if="form.rStatus==32">
      <div class="litbox">
        <span>进行中</span>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==19">
      <div class="litbox">
        <span>单据完结</span>
      </div>
    </div>
    <div class="bigbox" v-if="form.rStatus==31">
      <div class="litbox">
        <span>已作废</span>
      </div>
    </div>
    <br />
    <br />
    <my-footer
      :number="number"
      :Totalamount="TotalPrice4"
      @opendialog="openDD({ ss: false })"
      @ctrls="openDD({ ss: true })"
      :hideBtn1="!showbank"
      :hideBtn2="!showbank"
      v-has="2011"
    ></my-footer>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectClient"
      width="60%"
    >
      <selectClient @emitClientData="getClientData" :status="64"></selectClient>
    </el-dialog>
    <el-dialog
      title="仓库"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectWarehouse"
      width="60%"
    >
      <selectWarehouse @emitWarehouseData="getWarehouseData"></selectWarehouse>
    </el-dialog>
    <el-dialog
      title="商品"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showselectGoods"
      width="60%"
    >
      <el-dialog
        width="60%"
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="addgoods"
        append-to-body
      >
        <goodsedit @closeAddGoods="closeAddGoods" :parent="2"></goodsedit>
      </el-dialog>
      <selectGoods
        @emitGoodsData="getGoodsData"
        :rWhidv="form.rWhidv"
        :rWhid="form.rWhid"
        :purorrecover="2"
        :idList="idList"
        @openadd="addgoods=true"
        v-if="!addgoods"
      ></selectGoods>
    </el-dialog>
    <el-dialog
      title="审核人"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showDD"
      width="50%"
    >
      <el-dialog
        title
        :close-on-click-modal="false"
        v-dialogDrag
        :visible.sync="showexamine"
        width="60%"
        append-to-body
      >
        <selectUser @emitUserData="getUser"></selectUser>
      </el-dialog>
      <examine :rtype="2" @close="close" @openuser="openuser" :ID="dingding" :ID1="dingding1"></examine>
    </el-dialog>
    <el-dialog
      title
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="showSelectUser"
      width="60%"
    >
      <selectUser @emitUserData="getUserData"></selectUser>
    </el-dialog>
  </div>
</template>

<script>
import { truncate, watch } from "fs";
import { constants } from "crypto";
import selectClient from "@/components/dialog/SelectClient";
import selectWarehouse from "@/components/dialog/SelectWarehouse";
import selectGoods from "@/components/dialog/SelectGoods";
import selectUser from "@/components/dialog/SelectUser";
import selectBankAccount from "@/components/dialog/SelectBankAccount";
import examine from "@/components/dialog/examine";
import selectLogistics from "@/components/dialog/SelectLogistics";
// import goodsedit from "@/views/setting/goodsControl/goodsedit";
export default {
  name: "recoverOrder",
  inject: ["reload"],
  components: {
    selectClient,
    selectWarehouse,
    selectGoods,
    examine,
    selectUser,
    selectBankAccount,
    selectLogistics
    // goodsedit
  },
  data() {
    return {
      tableData: [{}, {}, {}, {}, {}],
      tableData2: [{}, {}, {}, {}, {}],
      tableData3: [{}, {}, {}, {}, {}],
      addgoods: false,
      form: {
        rCuidv: "", //客户
        rCuid: "",
        rWhidv: this.$storage.warehouse ? this.$storage.warehouse.whName : "", //仓库
        rWhid: this.$storage.warehouse ? this.$storage.warehouse.whId : "",
        warehouseNum:
          this.$storage.warehouseNum > 1 || this.$storage.warehouseNum != null
            ? true
            : false,
        rHandmanv: this.$storage.userName, //经手人
        rHandman: this.$storage.userId,
        rRemark: "", //备注
        rType: 2,
        rCid: "",
        rFile: [],
        rDate: "",
        rCmobile: "",
        rCaddr: "",
        rApprovalid: "",
        rStatus: 30,
        rEstdelivery: this.$PublicJS.nowDate(),
        rTotalprice: 0,
        rBillingstatus: "0",
        rLogistics: "",
        rShipmentnumber: "",
        rOid: this.$storage.companyId,
        rOidv: this.$storage.companyName
        // rCuserid: this.$storage.userName
      },
      client: {},
      formData: null,
      activeName: "Subjectname",
      // 日期范围只能是今天以后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      fileList: [],
      fsAmount: 0,
      showbank: false,
      showSG: false,
      showSum: true,
      currentRow: null,
      showSelectUser: false,
      icon: "",
      showSelectClient: false,
      showSelectWarehouse: false,
      showselectGoods: false,
      showselectBankAccount1: false,
      showselectBankAccount2: false,
      showSelectLogistics: false,
      showexamine: false,
      dingding: {},
      dingding1: {},
      dataType: 0,
      rowindex: 0,
      TotalPrice: 0,
      TotalPrice2: 0,
      TotalPrice3: 0,
      number: 0,
      BH: null,
      dom: null,
      rId: null,
      showDD: false,
      contact: [],
      param: {},
      nowdata: "",
      daifu: 0,
      settable: 1,
      idList: [],
      i: 0,
      img: "",
      // 施工环境
      Envform: {
        rcZtfy: "",
        rcZcwz: 2,
        rcTcf: "",
        rcSqzt: 0,
        rcSgrq: "",
        rcSglc: "",
        rcSgbh: 0,
        rcRemark: "",
        rcRid: "",
        rcQrdcl: 0,
        rcJcsg: 0,
        rcHtsl: "",
        rcHtsj: 0,
        rcHtccW: "",
        rcHtccL: "",
        rcHtccH: "",
        rcGdjl: "",
        rcDkxg: "",
        rcCmt: 1,
        rcByjl: "",
        rcCip: ""
      },
      SPFL: [],
      load: true,
      loading: {},
      domb: null,
      rOidOptions: [],
      domc: null
    };
  },
  computed: {
    money: function() {
      this.tableData.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    money2: function() {
      this.tableData2.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    money3: function() {
      this.tableData3.map(item => {
        if (item.rdQuantity) {
          return (item.money = item.rdQuantity * item.iSellingprice);
        }
      });
    },
    TotalPrice4: function() {
      return this.TotalPrice - this.TotalPrice2 - this.TotalPrice3;
    }
  },
  created() {
    this.form.rDate = this.$PublicJS.nowDate();
    this.nowdata = this.$PublicJS.nowDate();
    if (this.$route.query.data) {
      this.rId = window.atob(this.$route.query.data);
      this.getrecoverOrder();
      this.loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.load = false;
    }
    // 归属公司
    this.$api.Common.getDIC({ typeCode: "ZZJG", value1: 1 }).then(res => {
      if (res.code == 200) {
        this.rOidOptions = res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        });
      }
    });
    this.getService();
    // window.addEventListener("keydown", this.checkTableNext);
  },
  methods: {
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]); //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    getrecoverOrder() {
      this.$api.Receipt.get({ rId: this.rId }).then(res => {
        this.form = res.data.records[0];
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId,
          whid: res.data.records[0].rWhid
        }).then(res => {
          this.tableData = [];
          this.tableData2 = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            item.gConstructcostweight = item.rdConstructcostweight;
            if (item.gImage) {
              item.gImage = item.gImage.split(",");
            }
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 2) {
              this.tableData.push(item);
            } else if (item.rdIotype == 3) {
              this.tableData2.push(item);
            }
          });
          this.tableData = this.deepCopy(this.tableData);
          this.tableData2 = this.deepCopy(this.tableData2);
          if (this.form.rStatus == 30) {
            if (!this.tableData2.length) this.tableData2.push({});
          }
        });
        this.$api.Receiptdts.getReceiptDtsGoods({
          rid: this.rId
        }).then(res => {
          this.loading.close();
          this.load = true;
          this.tableData3 = [];
          res.data.map((item, index) => {
            item.iQuantity = item.rdQuantity;
            item.iSellingprice = item.rdSellingprice;
            item.gRemark = item.rdRemark;
            if (item.rdIotype == 4) {
              item.gId = `${item.rdGid}`;
              item.iSellingprice = item.rdSellingprice;
              this.tableData3.push(item);
            }
          });
          this.tableData3 = this.deepCopy(this.tableData3);
          if (this.form.rStatus == 30) {
            if (!this.tableData3.length) this.tableData3.push({});
          }
        });
        this.BH = res.data.records[0].rItemnum;
        if (
          res.data.records[0].rApprovalstatus == 2 ||
          res.data.records[0].rApprovalstatus == 3 ||
          res.data.records[0].rStatus == 19 ||
          res.data.records[0].rStatus == 32 ||
          res.data.records[0].rStatus == 31
        ) {
          this.showbank = true;
        }
        if (res.data.records[0].rStatus == 30) this.showbank = false;
        if (this.form.rFile) {
          this.form.rFile = JSON.parse(this.form.rFile);
          this.fileList = this.form.rFile;
        }
        this.getrCid({ cuid: this.form.rCuid });
        this.$api.Receipt.gettconstruct({ rid: this.rId }).then(res => {
          if (res.data) {
            this.Envform = res.data;
          }
        });
      });
    },
    openuser(val) {
      this.dataType = val;
      this.showexamine = true;
    },
    getService() {
      this.SPFL = [];
      this.$api.Common.get({ attrCodeParent: "09", typeCode: "SPFL" }).then(
        res => {
          if (res.code == 200) {
            res.data.map(item => {
              this.SPFL.push({
                cAttrvalue: item.cAttrvalue,
                gId: item.cAttrcode
              });
            });
          }
        }
      );
    },
    checkTable(a, b, c, d) {
      this.domb = b;
      this.domc = c;
    },
    checkTableNext(e) {
      // if (!this.dom) return;
      // let mm = 0;
      // if (e.keyCode == 38) {
      //   //上键
      //   if (
      //     this.domc.children[0].children[0] &&
      //     this.domc.children[0].children[0].localName == "input"
      //   ) {
      //     let e = document.getElementsByClassName(this.domb.id);
      //     for (let i = 0; i < e.length; i++) {
      //       if (
      //         e[i] == this.domc &&
      //         e[i - 1].className == this.domb.id + "  " &&
      //         !mm &&
      //         e[i - 1].children[0].children[0]
      //       ) {
      //         mm++;
      //         e[i - 1].click();
      //         e[i - 1].children[0].children[0].focus();
      //       }
      //     }
      //   }
      //   e.preventDefault();
      // }
      // if (e.keyCode == 40) {
      //   //下键
      //   if (
      //     this.domc.children[0].children[0] &&
      //     this.domc.children[0].children[0].localName == "input"
      //   ) {
      //     let e = document.getElementsByClassName(this.domb.id);
      //     for (let i = 0; i < e.length; i++) {
      //       if (
      //         e[i] == this.domc &&
      //         e[i + 1].className == this.domb.id + "  " &&
      //         !mm &&
      //         e[i + 1].children[0].children[0]
      //       ) {
      //         mm++;
      //         e[i + 1].children[0].children[0].focus();
      //         e[i + 1].click();
      //       }
      //     }
      //   }
      //   e.preventDefault();
      // }
    },
    getUser(val) {
      if (this.dataType == 1) {
        this.dingding = val;
      } else {
        this.dingding1 = val;
      }
      this.showexamine = false;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    selectChange() {
      // 强制更新
      this.$forceUpdate();
      let obj = this.contact.find(item => {
        return item.value == this.form.rCid;
      });
      this.form.rCmobile = obj.rCmobile;
      this.form.rCaddr = obj.rCaddr;
    },
    closeAddGoods() {
      this.addgoods = false;
      this.$message.success("添加成功");
    },
    hiddenicon(e) {
      if (e.target.nextElementSibling) {
        this.dom = e.target;
        this.icon = e.target.nextElementSibling;
        e.target.nextElementSibling.style.opacity = "1";
      }
    },
    showicon(e) {
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.opacity = "0";
      }
    },
    getUserData(val) {
      if (val) {
        this.form.rHandman = val.uId;
        this.form.rHandmanv = val.uName;
      }

      this.showSelectUser = false;
    },
    getrCid(val) {
      this.contact = [];
      let cAddr = "";
      if (
        this.client.cuProvincevalue ||
        this.client.cuCityvalue ||
        this.client.cuDistrictvalue
      ) {
        cAddr = `${this.client.cuProvincevalue}${this.client.cuCityvalue}${this.client.cuDistrictvalue}`;
      }
      this.$api.Contact.get(val).then(res => {
        let Items = res.data.records;
        if (!res.data.records.length) {
          this.form.rCaddr = "";
          this.form.rCmobile = "";
          return (this.form.rCid = "");
        }
        Items.map((item, index) => {
          if (!index) {
            if (!this.form.rCaddr || this.form.rCid != item.cId) {
              this.form.rCaddr = cAddr + item.cAddr;
            }
            this.form.rCmobile = item.cMobile;
            this.form.rCid = item.cId;
          }
          this.contact.push({
            value: item.cId,
            label: item.cName,
            rCmobile: item.cMobile,
            rCaddr: cAddr + item.cAddr
          });
        });
      });
    },
    selectChanges(m) {
      // this.form[m] = val;
      let obj = {};
      obj = this[m + "Options"].find(item => {
        return item.value == this.form.rOid; //筛选出匹配数据
      });
      this.form[m + "v"] = obj.label; //获取label
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property === "money") ||
          column.property === "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice = sums[index];
          }
          if (column.property !== "rdQuantity") {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    setimg(url) {
      this.img = url;
    },
    handleExceed() {},
    handleChange() {},
    handleRemove() {},
    uploadImg(file) {
      if (file.file.name) {
        this.formData.append(`files${this.i}`, file.file);
        this.i++;
      }
    },
    getSummaries2(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property === "money") ||
          column.property === "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice2 = sums[index];
          }
          if (column.property !== "rdQuantity") {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    getSummaries3(param) {
      const { columns, data } = param;
      const sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (!values.every(value => isNaN(value)) &&
            column.property == "money") ||
          column.property == "rdQuantity"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toPrecision(12));
            } else {
              return prev;
            }
          }, 0);
          if (column.property === "money") {
            this.TotalPrice3 = sums[index];
          }
          if (column.property !== "rdQuantity") {
            sums[index] = this.$PublicJS.money(sums[index], 2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },
    searchbox(e, val, n) {
      if (!this.form.rWhidv) {
        this.$message({ message: "请选择仓库", type: "warning" });
        return false;
      } else {
        this.rowindex = val;
        if (e.target === this.icon) {
          this.icon = "";
          this.showselectGoods = true;
          this.settable = n;
          if (n == 1) {
            this.idList = [];
            this.tableData.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
          if (n == 2) {
            this.idList = [];
            this.tableData2.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
          if (n == 3) {
            this.idList = [];
            this.tableData3.map(item => {
              if (item.gId && !this.idList.includes(item.gId)) {
                this.idList.push(item.gId);
              }
            });
          }
        }
      }
    },
    setdanjia(e) {
      if (!isNaN(e.iSellingprice)) {
        if (e.iSellingprice == "") {
          e.iSellingprice = 0;
        } else if (e.iSellingprice < 0) {
          e.iSellingprice = 0;
          this.$message("商品单价不得小于0");
        } else {
          e.money = e.iSellingprice * e.rdQuantity;
        }
      } else {
        e.iSellingprice = 0;
        this.$message("请输入数字");
      }
    },
    setnum(e) {
      if (!isNaN(e.rdQuantity)) {
        if (!e.rdQuantity) {
          this.$message("请输入数量");
          e.rdQuantity = 1;
        } else if (e.rdQuantity < 1) {
          e.rdQuantity = 1;
          this.$message("数量不得小于1");
        }
      } else {
        e.rdQuantity = 1;
        this.$message("请输入数字");
      }
    },
    opendialog(n) {
      this[n] = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    adddate(n) {
      if (n == 1) {
        this.tableData.push({});
      }
      if (n == 2) {
        this.tableData2.push({});
      }
      if (n == 3) {
        this.tableData3.push({});
      }
    },
    deldate(index, n) {
      if (this.tableData.length > 1) {
        if (n == 1) {
          this.tableData.splice(index, 1);
        }
      }
      if (this.tableData2.length > 1) {
        if (n == 2) {
          this.tableData2.splice(index, 1);
        }
      }
      if (this.tableData3.length > 1) {
        if (n == 3) {
          this.tableData3.splice(index, 1);
        }
      }
    },
    Printing() {
      const data = this.$route.query.data;
      window.open(`/#/recover/printingRecover?data=${data}`, "_blank");
    },
    getClientData(val) {
      if (val) {
        this.form.rCuid = val.cuId;
        this.form.rCuidv = val.cuName;
        this.client = val;
        this.getrCid({ cuid: val.cuId });
      }

      this.showSelectClient = false;
    },
    getWarehouseData(val) {
      if (val) {
        this.form.rWhid = val.whId;
        this.form.rWhidv = val.whName;
      }
      this.showSelectWarehouse = false;
    },
    openlink(url) {
      window.open(url, "_blank");
    },
    getGoodsData(val) {
      if ( !this.tableData[this.rowindex].gId || !this.tableData2[this.rowindex].gId ) {
      } else {
        if ((this.tableData[this.rowindex].gId || this.tableData2[this.rowindex].gId) && Array.isArray(val)) {
          val = val[0];
        }
      }

      if (Array.isArray(val)) {
        val.map((item, i) => {
          item.rdQuantity = 1;
          item.iSellingprice = item.iUnitprice;
          const data = JSON.parse(JSON.stringify(item));
          if (i != 0) {
            if (
              this.tableData[this.rowindex + i] &&
              this.tableData[this.rowindex + i].gId &&
              this.settable == 1
            ) {
              this.tableData.push(data);
            } else if (this.settable == 1) {
              this.tableData.splice(this.rowindex + i, 1, data);
            }
            if (
              this.tableData2[this.rowindex + i] &&
              this.tableData2[this.rowindex + i].gId &&
              this.settable == 2
            ) {
              this.tableData2.push(data);
            } else if (this.settable == 2) {
              this.tableData2.splice(this.rowindex + i, 1, data);
            }
          } else {
            if (this.settable == 1) {
              this.tableData.splice(this.rowindex, 1, data);
            }
            if (this.settable == 2) {
              this.tableData2.splice(this.rowindex, 1, data);
            }
          }
        });
      } else if (val) {
        val.rdQuantity = 1;
        val.iSellingprice = val.iUnitprice;
        const data = JSON.parse(JSON.stringify(val));
        if (this.settable == 1) {
          this.tableData.splice(this.rowindex, 1, data);
        }
        if (this.settable == 2) {
          this.tableData2.splice(this.rowindex, 1, data);
        }
      }
      this.showselectGoods = false;
    },
    openDD(val) {
      let n = 0;
      this.tableData.map(item => {
        if (item.gName) {
          n += 1;
        }
      });
      if (!this.form.rCuidv) return this.$message("请选客户");
      if (!this.form.rWhidv) return this.$message("请选择仓库");
      if (!this.form.rHandmanv) return this.$message("请选择经手人");
      if (!this.form.rCid) return this.$message("请选择联系人");
      if (!n) return this.$message("请选择商品");
      if (!this.Envform.rcSgrq) return this.$message("请选择施工日期");
      this.form.rTotalprice = this.TotalPrice4;
      if (val.ss && this.form.rStatus == 30) {
        this.close("false");
      } else {
        this.showDD = true;
      }
    },
    close(data, val1) {
      if (!data) return (this.showDD = false);
      this.Envform.rcRid = this.form.rId;
      this.form.rDate = this.nowdata;
      this.Envform.rcSgrq = this.Envform.rcSgrq.replace(/\-/g, "");
      this.formData = new FormData();
      this.$refs.upload.submit();
      let params = {
        approve: data != "false" ? true : false,
        approvers: data != "false" ? data : null,
        receiptDtsList: [],
        receiptInfoVO: this.form,
        tReceiptconstruct: this.Envform
      };
      if (val1 && val1.length) params.cc = val1;
      let loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 2;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData2.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdConstructcostweight = item.gConstructcostweight;
          obj.rdIotype = 3;
          params.receiptDtsList.push(obj);
        }
      });
      this.tableData3.forEach((item, index) => {
        let obj = {};
        if (item.rdQuantity) {
          obj.rdGid = item.gId;
          obj.rdQuantity = item.rdQuantity;
          obj.rdSellingprice = item.iSellingprice;
          obj.rdRemark = item.gRemark;
          obj.rdIotype = 4;
          params.receiptDtsList.push(obj);
        }
      });
      if (params.approve) this.form.rStatus = 2;
      this.showDD = false;
      let filedata = [];
      this.$ajax.post("/system/upload", this.formData).then(res => {
        if (res.data.code === 200) {
          if (Object.values(res.data.data).length) {
            Object.values(res.data.data).map(item => {
              filedata.push(`/file/${item}`);
              params.receiptInfoVO.rFile.push(`/file/${item}`);
            });
          }
          if (params.receiptInfoVO.rFile && params.receiptInfoVO.rFile.length) {
            params.receiptInfoVO.rFile = JSON.stringify(
              params.receiptInfoVO.rFile
            );
          } else {
            delete params.receiptInfoVO.rFile;
          }
          this.$api.Receipt.saveall(params).then(res => {
            loading.close();
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push("/recover/recoverOrderList");
            } else {
              if (params.receiptInfoVO.rFile) {
                params.receiptInfoVO.rFile = JSON.parse(
                  params.receiptInfoVO.rFile
                );
                filedata.map(item => {
                  if (params.receiptInfoVO.rFile.indexOf(item) > -1) {
                    params.receiptInfoVO.rFile.splice(
                      params.receiptInfoVO.rFile.indexOf(item),
                      1
                    );
                  }
                });
              }
              this.$message.error("提交失败");
              this.form.rStatus = 30;
            }
          });
        } else {
          this.$message.error("提交失败");
          this.form.rStatus = 30;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mbottom {
  padding: 0 20px;
}
</style>