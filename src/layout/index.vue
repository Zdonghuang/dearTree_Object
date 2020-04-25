<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" v-if="hashide" />
    <div ref="container" class="main-container">
      <div :class="{'fixed-header':fixedHeader}" v-if="hashide">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      // return this.$store.state.settings.fixedHeader
      return true;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  data() {
    return {
      hashide: true
    };
  },
  created() {
    let url = [
      "/warehouse/outbound/XSDeliveryPrinting",
      "/sales/printingOrder",
      "/recover/printingRecover",
      "/sales/printingReturnOrder",
      "/sales/printingReplaceOrder",
      "/XStransfer/printingTransfer",
      "/warehouse/transfer/printingTransfer",
      "/warehouse/inbound/printingInbound",
      "/CGBJprinting",
      "/recover/printingRecoverCon",
      "/warehouse/inventory/inventoryPrinting",
      "/printingFinancePay",
      "/printingJK",
      "/printingBXHX",
      "/printingFundFlowDetail"
    ];
    if (this.$route.query.from || url.includes(this.$route.path)) {
      this.hashide = false;
      this.handleClickOutside();
    }
  },
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
      "/warehouse/inventory/inventoryPrinting",
      "/printingFinancePay",
      "/printingJK",
      "/printingBXHX",
      "/printingFundFlowDetail"
    ];
    if (url.includes(this.$route.path)) {
      this.$refs.container.style.marginLeft = "0";
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
