/*
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-11-25 08:57:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js' //导入elementsUi组件
import "./assets/css/global.css" //导入全局样式表
import "./assets/fonts/iconfont.css" //导入全局样式
//使用axios配置方法
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/" //全局配置发起请求的根路径
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
//给Vue函数添加一个原型属性$axios 指向axios
//这样做的好处是在vue实例或组件中不用再去重复引用Axios 直接用this.$http就能执行axios 方法了。
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
