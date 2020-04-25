import {
  setToken,
  removeToken,
  getToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  login,
  logout
} from '../../api/user'
import {
  Message
} from 'element-ui'

const state = {
  loginInfo: {},
  avatar: './images/avatar/avatar.png',
  roles: [],
  token: getToken(),

}

const mutations = {
  SET_INFO: (state, v) => {
    state.loginInfo = v
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      phone,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        phone: phone.trim(),
        password: password
      }).then(res => {
        if (res.code == 200) {
          commit('SET_INFO', res.data)
          commit('SET_ROLES', res.data.permissions)
          commit('SET_TOKEN', res.data.token)
          setToken(res.data.token)
          if(password=='dT123123.'){
            resolve('firstLogin')
          }
          sessionStorage.setItem('state', JSON.stringify(res.data))
          resolve()
        } else {
          Message({
            message: res.err,
            type: "error"
          });
          // 延时3秒执行 防止 恶意登录
          setTimeout(function () {
            resolve()
          }, 3000)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_INFO', '')
        removeToken()
        sessionStorage.removeItem('state')
        resetRouter()
        resolve()
        window.location.reload()
      }).catch(error => {
        // reject(error)
        commit('SET_INFO', '')
        removeToken()
        sessionStorage.removeItem('state')
        resetRouter()
        resolve()
        window.location.reload()
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_INFO', '')
      removeToken()
      sessionStorage.removeItem('state')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
