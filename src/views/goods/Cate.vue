<!--
 * @Author: your name
 * @Date: 2019-12-03 18:33:27
 * @LastEditTime: 2019-12-03 22:08:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\goods\Cate.vue
 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">

      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <!-- :data 是表格的数据源，:columns 是表格各列配置，:selection 是否为多选表格类型，:expand-type 是否为展开行类型表格 -->
      <!-- show-index 是否为索引列，index-text = "#" 数据索引列名称，border 是否显示纵向边框 -->
      <tree-table class="treetable" :data="catelist" :columns="columns" :selection-type='false' :expand-type="false" show-index
        index-text="#" border>
        <!-- 在表格的内部定义了一个插槽，名字叫isok,将来会被 data中的columns中的type是template的列对象引用 -->
        <!-- slot-scope 是通过作用域插槽的方式接收一下这一行数据域数据 -->
        <!-- 第一个模板，是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon='el-icon-edit' size="mini">编辑</el-button>
          <el-button type="danger" icon='el-icon-delete' size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <!-- @size-change 事件是改变了pagesize数据， @current-change 是pagenum发生改变时触发的 -->
      <!-- :current-page 是当前所绑定的页码数，第一个 :page-sizes 是每页显示多少条的几个可选值， 第二个 :page-size 是当前所绑定的每页显示多少条 -->
      <!-- layout 指定当前分页是由那部分功能组成, :total 绑定的是当前数据的总数量 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表列表                           
      catelist: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,//当前是第几页
        pagesize: 5//每页显示多少条
      },
      //总数据条数
      total: 0,
      //表格各列配置
      columns: [
        {
          label: '分类名称', //列名
          prop: 'cat_name', //具体的值
        },
        {
          label: '是否有效', //列名
          //将当前列定义为模板列
          type: 'template', //如果值是template，那这一列就是自定义模板列
          template: 'isok', //模板名称（指定插槽名字）
          align: "center",
          headerAlign: "center"
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          align: "center",
          headerAlign: "center"
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          align: "center",
          headerAlign: "center"
        }
      ]
    }
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$messge.error('获取商品列表失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //分页监听pagesize改变的事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize//拿到最新的页条数
        this.getCateList()//pagesize改变了就要立即刷新数据。
    },
    //分页监听pagenum改变的事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage//拿到最新的页码值
        this.getCateList()//pagenum改变了就要立即刷新数据。
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.treetable{
    margin-top:15px;
}
</style>