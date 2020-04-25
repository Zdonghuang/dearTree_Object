import Vue from 'vue'
/**权限指令**/
const has = Vue.directive('has', {
    bind: function (el, binding, vnode) {
        // 获取按钮权限
        let btnPermissions = binding.value;
        if (!Vue.prototype.$_has(btnPermissions)) {
            // el.parentNode.removeChild(el);
            el.style.display = 'none';
        }
    }
});
// 权限检查方法
Vue.prototype.$_has = function (value) {
    if(!value){
        return false
    }
    let isExist = false;
    let btnPermissionsStr =JSON.parse(sessionStorage.getItem("state")).permissions;
    if (btnPermissionsStr == undefined || btnPermissionsStr == null) {
        return false;
    }
    if (btnPermissionsStr.indexOf(value.toString()) > -1) {
        isExist = true;
    }
    return isExist;
};
export { has }
