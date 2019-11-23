/*
 * @Author: your name
 * @Date: 2019-11-20 11:28:16
 * @LastEditTime: 2019-11-23 12:36:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\plugins\element.js
 */
import Vue from 'vue'
// import { Button } from 'element-ui'//导入按钮组件
// import { Form } from 'element-ui'//导入表单组件
// import { FormItem } from 'element-ui'//导入表单组件
// import { Input } from 'element-ui'//导入表单组件内
// import { Message } from 'element-ui'//导入弹框提示
import { Button , Form , FormItem , Input , Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message;//把Message弹框组件挂载到Vue的原型对象上，这样每个组件都可以通过this.$message访问到Message来进行弹框提示。

