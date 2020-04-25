<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="true"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        >{{route}}</sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      if (sessionStorage.getItem("state")) {
        let role = JSON.parse(sessionStorage.getItem("state")).permissions;
        let deep = a => {
          a.map(item => {
            let n = false;
            let m = false;
            if (item.path == "/finances") return;
            if (item.meta && item.meta.roles) {
              item.meta.roles.map(item1 => {
                if (role.includes(item1)) {
                  n = role.includes(item1);
                }
              });
              role.map(item1 => {
                if (item.meta.roles.includes(item1)) {
                  m = item.meta.roles.includes(item1);
                }
              });
            }
            if (!n && !m) {
              item.hidden = true;
            }
            if (item.children && item.children.length) {
              deep(item.children);
            }
          });
        };
        deep(this.$router.options.routes);
        this.$router.options.routes[1].hidden = false;
        this.$router.options.routes[1].children[0].hidden = false;
        this.$router.options.routes[
          this.$router.options.routes.length - 2
        ].hidden = false;
        this.$router.options.routes[
          this.$router.options.routes.length - 2
        ].children[0].hidden = false;
        return this.$router.options.routes;
      } else {
        if (!this.$router.query.from) {
          this.$router.next({ path: "/login" });
        } else {
          next();
        }
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
