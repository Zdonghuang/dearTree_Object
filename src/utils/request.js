import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'
import { MessageBox,Message } from 'element-ui'
import qs from 'qs'
import router from '../router'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL:'http://39.105.134.145:9081/',
  // withCredentials: true,
  timeout: 600000,
  transformRequest: [function (data) {
    data = qs.stringify(data, { allowDots: true })
    return data
  }],
  // #设置Content-Type
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['X-ACCESS-TOKEN'] = getToken()
    }

    if (router.history.current.query.from) {
      config.headers['from'] = 'dingding'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status == 200) {
      const res = response.data
      if (res.code === 401) {
        MessageBox.alert('你已经不再是登录状态，请重新登录', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/logout')
          sessionStorage.removeItem('state')
          removeToken()
          router.push('/login');
          window.location.reload()
          return false
        })
      } else {
        return response.data
      }
    } else {
      MessageBox.alert('服务器连接错误，请重新登录', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        // store.dispatch('user/logout')
        sessionStorage.removeItem('state')
        removeToken()
        router.push('/login');
        window.location.reload()
        return false
      })
    }

  },
  error => {
    // debugger
    Message({
      message: '服务器连接错误',
      type: 'error',
      duration: 5 * 1000
    })
    // let errCode = error.response;
    // if (errCode == undefined) {
    //   MessageBox.confirm('您已被登出，请重新登录！', '登陆超时', {
    //     confirmButtonText: '重新登录',
    //     type: 'warning'
    //   }).then(() => {
    //     // store.dispatch('user/logout')
    //     sessionStorage.removeItem('state')
    //     removeToken()
    //     router.push('/login');
    //     window.location.reload()
        // return false
    //   })
    // }
    return Promise.reject(error)
  }
)

export default service
