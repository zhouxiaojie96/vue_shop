<!--
 * @Author: your name
 * @Date: 2019-11-23 10:32:00
 * @LastEditTime: 2019-11-23 12:12:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\Home.vue
 -->
<template>
  <transition name="home">
    <div>
    <el-button type="info" @click.native="logout">退出</el-button>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    //退出功能
    //基于 token 的方式实现退出只需要销毁本地的 token 即可，这样后续的请求就不会携带 token 必须重新登录生成一个新的 token 之后才可以访问页面。
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>