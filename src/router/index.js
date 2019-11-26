/*
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-11-25 15:17:05
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

Vue.use(VueRouter)

const routes = [
  {
    path : "/",
    redirect : "/login"//如果访问的是根路径就重定向到login组件。
  },
  {
    path : "/login",
    component : Login
  },
  {
    path : "/home",
    component : Home,
    redirect : "/Welcome",
    children:[
      {
        path : "/Welcome",
        component : Welcome
      },
      {
        path : "/users",
        component : Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫：
//to 将要访问的路径
//from 代表从哪个路径跳转而来
//next 是一个函数，表示放行   next() 表示放行   nest('/login') 强制跳转
router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next();//如果访问的是登录页直接放行。
  const tokenStr = window.sessionStorage.getItem('token')//获取token。
  if(!tokenStr) return next('/login')//如果tokenStr不存在就跳转到登录页面
  next();//如果存在直接放行。
})

export default router
