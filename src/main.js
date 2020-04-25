import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI, {
  Message
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css' // 引入字体图标
import myFooter from './components/absfooter/footer'
import examine from './components/dialog/examine'
import pagination from './components/pagination/pagination'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './utils/filter'
import PublicJS from './utils/PublicJS'
import apis from './api/api'
import axios from 'axios'
import './utils/directives.js'
import echarts from 'echarts'
import has from './utils/btnPermissions.js'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import fileSaver from 'file-saver'
import xlsx from 'xlsx'
import '@/icons' // icon
// import '@/permission' // permission control
import {
  getToken
} from '@/utils/auth'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import {
  mockXHR
} from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
axios.defaults.headers = {
  'Content-Type': 'application/json'
}
// console.log($)
Vue.prototype.$echarts = echarts
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
Vue.prototype.baseUrl = process.env.VUE_APP_BASE_API
Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_API
axios.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['X-ACCESS-TOKEN'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
Vue.prototype.$ajax = axios
Vue.prototype.$html2canvas = html2canvas
Vue.prototype.$JsPDF = JsPDF
Vue.prototype.$fileSaver = fileSaver
Vue.prototype.$xlsx = xlsx

// set ElementUI lang to EN
Vue.use(ElementUI)
Vue.prototype.$api = apis
Vue.prototype.$PublicJS = PublicJS
Vue.component('my-footer', myFooter)
Vue.component('pagination', pagination)
Vue.component('examine', examine)
Vue.config.productionTip = false
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  Vue.prototype.$storage = JSON.parse(sessionStorage.getItem('state')) || {}
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    if (sessionStorage.getItem('state')) {
      const role = JSON.parse(sessionStorage.getItem('state')).permissions
      if (to.meta.roles && !role.includes(to.meta.roles[0])) {
        Message({
          message: '无权访问',
          type: 'warning'
        })
        next({
          path: from.path
        })
      } else {
        next()
      }
    } else {
      if (to.query.from) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    }

  }
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
