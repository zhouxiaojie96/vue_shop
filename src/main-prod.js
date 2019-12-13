/*
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-12-13 09:23:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js' //导入elementsUi组件，这里注释掉了是因为后期项目优化需要，然后这个文件挪动到index.html文件里引入了CDN的形式
import "./assets/css/global.css" //导入全局样式表
import "./assets/fonts/iconfont.css" //导入全局样式
import './filter/filter'//导入过滤器

//treetable使用方法
import TreeTable from 'vue-table-with-tree-grid'//树样式的插件
Vue.component("tree-table",TreeTable) //注册组件
//Vue.use(TreeTable)//这个方法不能起名字，也没有那么正规，最正规的还是vue.component方式。

//vue-quill-editor富文本使用方法
import VueQuillEditor from 'vue-quill-editor'
//导入富文本全局样式
//这里把样式表注释了，因为后期项目优化需要，然后这个样式表修改到index.html文件里引入了cdn的形式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)//将富文本编辑器注册为全局可用的组件


//nprogress可以显示隐藏发起请求的进度条
//在请求拦截器中展示进度条，在响应拦截器中隐藏进度条
//1.导入nprogress包和样式
import NProgress from 'nprogress'
//这里把样式表注释了，因为后期项目优化需要，然后这个样式表修改到index.html文件里引入了cdn
// import 'nprogress/nprogress.css'


//使用axios配置方法
import axios from 'axios'
// import { Tree } from 'element-ui'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/" //全局配置发起请求的根路径
//请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()//展示进度条
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
//响应拦截器
axios.interceptors.response.use(config => {
  NProgress.done()//隐藏进度条
  return config;
})
//给Vue函数添加一个原型属性$axios 指向axios；这样做的好处是在vue实例或组件中不用再去重复引用Axios 直接用this.$http就能执行axios 方法了。
Vue.prototype.$http = axios;

//自带的
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
