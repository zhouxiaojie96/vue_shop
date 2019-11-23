<!--
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-11-23 12:33:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\App.vue
 -->
<template>
  <transition name="app">
    <div id="app">
      <!-- 路由占位符 -->
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style scoped>

</style>>
