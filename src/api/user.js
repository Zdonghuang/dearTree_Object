import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getAllDicts() {
  return request({
    url: '/dic/queryAll',
    method: 'get'
  })
}

// 保存商品以及明细
export function savedts(params) {
  return request({
    url: '/goods/saveGoodsandGoodsdts',
    method: 'post',
    data: params
  })
}
