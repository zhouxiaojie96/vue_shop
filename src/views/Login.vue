<!--
 * @Author: your name
 * @Date: 2019-11-20 19:31:40
 * @LastEditTime: 2019-11-28 11:57:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\Login.vue
 -->
<template>
  <transition name="login">
    <div class="login_container">
      <div class="login_box">
        <!-- 头像区 -->
        <div class="avatar_box">
          <img src="../assets/logo.png">
        </div>
        <!-- 登录表单区 -->
        <!-- model是绑定的表单数据 -->
        <!-- rules 是校验规则 -->
        <!-- ref是表单的引用对象  （用于清空表单数据时的表单对象 -->
        <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!-- 用户名 -->
          <!-- prop 是 loginFormRules 内具体的校验规则-->
          <el-form-item prop="username">
            <!-- v-model绑定的数据是在父标签的 :model绑定的表单数据对象 loginForm 里的属性 -->
            <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click.native="login">登录</el-button>
            <el-button type="info" @click.native="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        //这是登录表单的数据绑定对象。
        username: 'admin',
        password: '123456'
      },
      //这是表单的验证规则对象
      loginFormRules: {
        username: [
          //用户名校验规则
          // required代表是必填，message是提示消息，trigger是触发时机，当失去焦点时触发
          { required: true, message: '请输入登录名称', trigger: 'blur' }, //是否填写规则
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' } //长度规则
        ],
        password: [
          //密码校验规则
          { required: true, message: '请输入登录密码', trigger: 'blur' }, //是否填写规则
          { min: 6, max: 20, message: '长度在6到20个字符之间', trigger: 'blur' } //长度规则
        ]
      }
    }
  },
  methods: {
    //重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()//对整个表单进行重置，将所有字段值重置为初始值并移除校验结果。
    },
    //登录
    login() {
      //判断是否符合校验规则。
      //validate是一个回调函数，判断校验规则是否合法，如果合法就返回true,如果不合法就返回false 返回的第一个值valid是一个布尔值。箭头函数只有一个参数默认可以去掉小括号。
      //为了简化promise操作用到了await和async来进行优化，注意await方法只能用在被async修饰的方法中。
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false //判断valid是否合法，如果不合法就终止提交。
        //这里的{data:res}意思是通过{}把返回的对象解构复制出data属性重命名为res.
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        //1.将登录成功后的 token 保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        //1.1项目中除了登录之外的其他api接口，必须在登录之后才能访问
        //1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        //2.通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home') //重定向到home页。
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  // 一下样式可以让一个盒子放到页面的正中间。
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: white;
    // 这块样式是给头像定位
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>