/*
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-12-12 12:26:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Categories from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
import List from '../views/goods/List.vue'
import Add from '../views/goods/Add.vue'
import Order from '../views/order/Order.vue'
import Report from '../views/report/Report.vue';


Vue.use(VueRouter)

const routes = [
  { path : "/" , redirect : "/login" },//如果访问的是根路径就重定向到login组件。
  { path : "/login" , component : Login },
  { path : "/home" , component : Home , redirect: "/welcome",
    children: [
      { path : "/welcome" , component : Welcome },
      { path : "/users" , component : Users },
      { path : "/rights" , component : Rights },
      { path : "/roles" , component : Roles },
      { path : '/categories' , component : Categories },
      { path : '/params' , component : Params },
      { path : '/goods' , component : List },
      { path : '/goods/add' , component : Add },
      { path : '/orders' , component : Order },
      { path : '/reports' , component : Report },
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫，需要在 router 页面中的 export default router 之前配置：
//to 将要访问的路径
//from 代表从哪个路径跳转而来
//next 是一个函数，表示放行   next() 表示放行   nest('/login') 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next(); //如果访问的是登录页直接放行。
  const tokenStr = window.sessionStorage.getItem('token') //获取token。
  if (!tokenStr) return next('/login') //如果tokenStr不存在就跳转到登录页面
  next(); //如果存在直接放行。
})

export default router
