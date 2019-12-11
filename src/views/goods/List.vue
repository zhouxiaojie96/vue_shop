<!--
 * @Author: your name
 * @Date: 2019-12-10 11:23:39
 * @LastEditTime: 2019-12-10 14:53:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\goods\List.vue
 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="7">
          <!-- clear 是当文本框清空时触发的事件 -->
          <el-input placeholder="请输入内容" v-model="pageInfo.query" clearable @clear="gitAllList">
            <el-button slot="append" icon="el-icon-search" @click="gitAllList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="17">
          <el-button type="primary" @click="add">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="allList" border style="width: 100%" type="index">
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center" width="700">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" align="center" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" align="center" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" align="center">
          <!-- 使用过滤器过滤时间毫秒数 -->
          <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- background 属性是设置分页条有背景颜色 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageInfo: {
        query : "",//input搜索框绑定的内容
        pagesize: 3,
        pagenum: 1
      },
      total: 0, //存储所有数据数量
      allList: [] //存放所有商品列表数据
    }
  },
  methods: {
    //获取所有商品列表数据
    async gitAllList() {
      const {data:res} = await this.$http.get('goods', {
        params: this.pageInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取所有数据列表失败')
      this.allList = res.data.goods
      this.total = res.data.total
      
    },
    //当page发生改变时触发的函数
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.gitAllList()
    },
    //当pagenum发生改变时触发的函数
    handleCurrentChange(newNum) {
      this.pageInfo.pagenum = newNum
      this.gitAllList()
    },
    //删除商品
    async removeById(scope){
      //删除返回的数据也需要用 await 修饰一下
      const confirm = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirm !== 'confirm') return this.$message.info("已取消删除")
      const {data:res} = await this.$http.delete(`goods/${scope.goods_id}`)
      if(res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success("删除成功")
      this.gitAllList()
    },
    //跳转到添加商品页面
    add(){
        this.$router.push("/goods/add")
    }
  },
  created() {
    this.gitAllList()
  }
}
</script>

<style lang="less" scoped>
</style>