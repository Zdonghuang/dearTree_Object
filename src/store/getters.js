const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userName: state => state.user.name,
  dept: state => state.user.loginInfo.dept,
  position: state => state.user.loginInfo.position,
  avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  addRouters:state => state.permission.addRoutes,
  SGHJ: state => state.dic.dicts.SGHJ,
  WL: state => state.dic.dicts.WL,
  XB: state => state.dic.dicts.XB,
}
export default getters
