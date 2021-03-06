/*
 * @Author: your name
 * @Date: 2019-11-20 11:28:16
 * @LastEditTime: 2019-12-11 22:04:55
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
import {
  //按钮部分
  Button,
  //表单部分
  Form,
  FormItem,
  Input,
  //弹窗部分
  Message,
  //整体框架框架部分
  Container,
  Header,
  Aside,
  Main,
  //侧边栏菜单部分
  Menu,
  Submenu,
  MenuItem,
  //面包屑导航部分
  Breadcrumb,
  BreadcrumbItem,
  //卡片视图部分
  Card,
  //栅格
  Row,
  Col,
  //表格
  Table,
  TableColumn,
  //开关
  Switch,
  //提示文字
  Tooltip,
  //分页
  Pagination,
  //添加用户弹框
  Dialog,
  //带提示弹框
  MessageBox,
  //tag标签
  Tag,
  //树形组件
  Tree,
  //下拉菜单
  Select,
  Option,
  //级联选择器
  Cascader,
  //警告提示
  Alert,
  //tabs 切换
  Tabs,
  TabPane,
  //步骤条
  Steps,
  Step,
  //多选框
  CheckboxGroup,
  Checkbox,
  //图片上传
  Upload,
  //时间线
  Timeline,
  TimelineItem,
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

  

Vue.prototype.$message = Message; //把Message弹框组件挂载到Vue的原型对象上，这样每个组件都可以通过this.$message访问到Message来进行弹框提示。
Vue.prototype.$confirm = MessageBox.confirm;//把带提问的弹框组件挂载到Vue的原型对象上。
