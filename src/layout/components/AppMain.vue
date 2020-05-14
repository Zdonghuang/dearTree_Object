<template>
  <section class="app-main" ref="appmain">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" v-if="!$route.meta.keepAlive" />
    </transition>
    
    <!-- 缓存页面 -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  mounted() {
    let url = [
      "/warehouse/outbound/XSDeliveryPrinting",
      "/sales/printingOrder",
      "/recover/printingRecover",
      "/sales/printingReturnOrder",
      "/sales/printingReplaceOrder",
      "/warehouse/transfer/printingTransfer",
      "/warehouse/inbound/printingInbound",
      "/XStransfer/printingTransfer",
      "/CGBJprinting",
      "/recover/printingRecoverCon",
      "/recover/printingRecoverSettlement",
      "/warehouse/inventory/inventoryPrinting",
      "/printingFinancePay",
      "/printingJK",
      "/printingBXHX",
      "/printingFundFlowDetail"
    ];
    if (url.includes(this.$route.path)) {
      this.$refs.appmain.style.padding = "6px";
      this.$refs.appmain.style.top = "0px";
    }
  },
  computed: {
    key() {
      return this.$route.path;
    },
    alive() {
      let name = [
        "quotationsheetList",
        "quotationsheenexttList",
        "returngoodsList",
        "exchangegoodsList",
        "CGstatementList",
        "THstatementList",
        "HHstatementList",
        "recoverOrderList",
        "constructionbudgetList",
        "constructionList",
        "SGstatementList",
        "settlementList",
        "saleOrderList",
        "saleOutList",
        "saleReturnOrderList",
        "saleReplaceOrderList",
        "salesSettleOrderList",
        "returnSettleOrderList",
        "replaceSettleOrderList",
        "saleDistributionList",
        "leaseDistributionList",
        "saleOutboundList",
        "saleExchangeOutboundList",
        "BFoutboundList",
        "purchaseReturnOutboundList",
        "purchaseExchangeOutboundList",
        "transferoutbound",
        "XStransferoutbound",
        "ZZoutboundList",
        "CZoutboundList",
        "ZLoutboundList",
        "purchaseInboundList",
        "purchaseExchangeInboundList",
        "recoverInboundLista",
        "saleReturnInboundList",
        "saleExchangeInboundList",
        "transferInboundList",
        "XStransferInboundList",
        "ZZinboundList",
        "CZinboundList",
        "ZLinboundList",
        "fullList",
        "scrappedList",
        "scrappedSettleList",
        "transferList",
        "XStransferList",
        "RKstatementList",
        "CKstatementList",
        "assemblyList",
        "disassemblyList",
        "stock",
        "leaseList",
        "laseSettleList",
        "financeAccountList",
        "financeAdvanceList",
        "financialAdvancesList",
        "depositList",
        "payList",
        "collectList",
        "borrowingList",
        "reimburseList",
        "writeOffList",
        "goods",
        "clientele",
        "supplier",
        "logistics",
        "partners",
        "warehouseControl",
        "organization",
        "role",
        "operationLog"
      ];
      // return name.join();
      return "";
    }
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 30px;
  padding-bottom: 0px;
  top: 50px;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
@media screen and (max-width: 768px) {
  .fixed-header + .app-main {
    padding-bottom: 100px;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
