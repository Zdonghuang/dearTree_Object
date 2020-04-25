<template>
  <div>
    <div id="myChartIpt" style="width:850px;height:1000px"></div>
    <div id="myChart" style="width:600px;height:1000px"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    this.toBeDone();
    this.toBeDoneReceipt();
  },
  methods: {
    toBeDone() {
      this.$api.Financialsettle.getToBeDone({ auth: 1,userId:this.$storage.userId  }).then(res => {
        if (!res) return;
        let _this = this;
        let data = res.map(item => {
          return `${item.rTypev}${item.sum}`;
        });
        let data1 = res.map(item => {
          let url = "";
          switch (item.rType) {
            case 81:
              url = `/financialAdvancesList?status=${item.rStatus}`;
              break;
            case 82:
              url = `/borrowingList?status=${item.rStatus}`;
              break;
            case 83:
              url = `/reimburseList?status=${item.rStatus}`;
              break;
            case 86:
              url = `/payList?status=${item.rStatus}`;
              break;
            case 88:
              url = `/ysjsdList?status=${item.rStatus}`;
              break;
            case 93:
              url = `/writeOffList?status=${item.rStatus}`;
              break;
          }
          return {
            value: item.sum,
            name: `${item.rTypev}${item.sum}`,
            url: url
          };
        });
        let option = {
          title: {
            text: "财务待办事项",
            // subtext: "纯属虚构",
            x: "center"
          },
          label: {
            fontSize: 17
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} "
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: data,
            textStyle: {
              fontSize: 17
            }
          },
          series: [
            {
              name: "待办事项",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: data1,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        let myChart = this.$echarts.init(document.getElementById("myChart"));
        myChart.on("click", function(params) {
          _this.$router.push(params.data.url);
        });
        // 绘制图表
        myChart.setOption(option);
      });
    },
    toBeDoneReceipt() {
      this.$api.Receipt.getToBeDone({ auth: 1}).then(res => {
        if (!res) return;
        let _this = this;
        let data = res.map(item => {
          return `${item.rTypev}${item.sum}`;
        });
        let data1 = res.map(item => {
          let url = "";
          switch (item.rType) {
            case 30:
              url = `/warehouse/outbound/purchaseReturnOutboundList?status=${item.rStatus}`;
              break;
            case 32:
              url = `/warehouse/outbound/purchaseExchangeOutboundList?status=${item.rStatus}`;
              break;
            case 15:
              url = `/warehouse/outbound/saleOutboundList?status=${item.rStatus}`;
              break;
            case 28:
              url = `/warehouse/outbound/saleExchangeOutboundList?status=${item.rStatus}`;
              break;
            case 43:
              url = `/warehouse/outbound/transferoutbound?status=${item.rStatus}`;
              break;
            case 46:
              url = `/warehouse/outbound/XStransferoutbound?status=${item.rStatus}`;
              break;
            case 57:
              url = `/warehouse/outbound/BFoutboundList?status=${item.rStatus}`;
              break;
            case 73:
              url = `/warehouse/outbound/ZLoutboundList?status=${item.rStatus}`;
              break;
            case 50:
              url = `/warehouse/outbound/ZZoutboundList?status=${item.rStatus}`;
              break;
            case 91:
              url = `/warehouse/outbound/CZoutboundList?status=${item.rStatus}`;
              break;
            case 44:
              url = `/warehouse/inbound/transferInboundList?status=${item.rStatus}`;
              break;
            case 47:
              url = `/warehouse/inbound/XStransferInboundList?status=${item.rStatus}`;
              break;
            case 5:
              url = `/warehouse/inbound/recoverInboundLista?status=${item.rStatus}`;
              break;
            case 9:
              url = `/warehouse/inbound/purchaseInboundList?status=${item.rStatus}`;
              break;
            case 33:
              url = `/warehouse/inbound/purchaseExchangeInboundList?status=${item.rStatus}`;
              break;
            case 29:
              url = `/warehouse/inbound/saleReturnInboundList?status=${item.rStatus}`;
              break;
            case 42:
              url = `/warehouse/inbound/saleExchangeInboundList?status=${item.rStatus}`;
              break;
            case 51:
              url = `/warehouse/inbound/ZZinboundList?status=${item.rStatus}`;
              break;
            case 92:
              url = `/warehouse/inbound/CZinboundList?status=${item.rStatus}`;
              break;
            case 75:
              url = `/warehouse/inbound/ZLinboundList?status=${item.rStatus}`;
              break;
            case 8:
              url = `/CGstatementList?status=${item.rStatus}`;
              break;
            case 40:
              url = `/THstatementList?status=${item.rStatus}`;
              break;
            case 41:
              url = `/HHstatementList?status=${item.rStatus}`;
              break;
            case 43:
              url = `/recover/statement/settlementList?status=${item.rStatus}`;
              break;
            case 26:
              url = `/recover/statement/SGstatementList?status=${item.rStatus}`;
              break;
            case 37:
              url = `/sales/settle/salesSettleOrderList?status=${item.rStatus}`;
              break;
            case 38:
              url = `/sales/settle/returnSettleOrderList?status=${item.rStatus}`;
              break;
            case 39:
              url = `/sales/settle/replaceSettleOrderList?status=${item.rStatus}`;
              break;
            case 58:
              url = `/warehouse/inventory/scrappedSettleList?status=${item.rStatus}`;
              break;
            case 48:
              url = `/XStransfer/statement/RKstatementList?status=${item.rStatus}`;
              break;
            case 61:
              url = `/XStransfer/statement/CKstatementList?status=${item.rStatus}`;
              break;
            case 74:
              url = `/lease/laseSettleList?status=${item.rStatus}`;
              break;
          }
          return {
            value: item.sum,
            name: `${item.rTypev}${item.sum}`,
            url: url
          };
        });
        let option = {
          title: {
            text: "单据待办事项",
            // subtext: "纯属虚构",
            x: "center"
          },
          label: {
            fontSize: 17
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} "
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: data,
            textStyle: {
              fontSize: 17
            }
          },
          series: [
            {
              name: "待办事项",
              type: "pie",
              radius: "43%",
              center: ["50%", "60%"],
              data: data1,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        let myChart = this.$echarts.init(document.getElementById("myChartIpt"));
        myChart.on("click", function(params) {
          _this.$router.push(params.data.url);
        });
        // 绘制图表
        myChart.setOption(option);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  display: inline-block;
  vertical-align: top;
}
#myChartIpt {
  margin-right: 140px;
}
</style>