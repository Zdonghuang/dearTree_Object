import { getAllDicts } from '../../api/user'
const state = {
  dicts: {}
}

const mutations = {
  updateDicts(state, v) {
    state.dicts = v
  }
}

const actions = {
  getDicts({ commit }) {
    return new Promise((resolve, reject) => {
      getAllDicts().then(res => {
        commit('updateDicts', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

