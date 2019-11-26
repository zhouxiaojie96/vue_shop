<!--
 * @Author: your name
 * @Date: 2019-11-23 10:32:00
 * @LastEditTime: 2019-11-25 15:48:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\Home.vue
 -->
<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="这是一张图片" width="50px" height="50px">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click.native="logout">退出</el-button>
    </el-header> 
    <!-- 页面主体区 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409eff"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index=" item.id + '' " v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index=" '/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist:[],//左侧菜单数据
      iconsObj:{
        125 : "iconfont icon-user",
        103 : "iconfont icon-shangpin",
        101 : "iconfont icon-lock_fill",
        102 : "iconfont icon-danju",
        145 : "iconfont icon-baobiao"
      },
      isCollapse : false,//是否折叠
      activePath : "",//被激活的链接地址
    }
  },
  methods: {
    //退出功能
    //基于 token 的方式实现退出只需要销毁本地的 token 即可，这样后续的请求就不会携带 token 必须重新登录生成一个新的 token 之后才可以访问页面。
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList(){
      const {data : res} = await this.$http.get("menus")
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
  created(){
    this.getMenuList();//获取所有菜单
    this.activePath = window.sessionStorage.getItem('activePath');//被激活的链接地址
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-container{
    background-color: #373d41;
  }
  .el-header{
    background-color: #333744;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color:#fff;
    font-size: 20opx;
    div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right:10px;
  }
  .toggle-button{
    background-color: #4a5064;
    color: white;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>