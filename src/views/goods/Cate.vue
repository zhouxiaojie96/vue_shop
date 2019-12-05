<!--
 * @Author: your name
 * @Date: 2019-12-03 18:33:27
 * @LastEditTime: 2019-12-05 19:32:22
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
          <el-button class='but' type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格 -->
      <tree-table :data="catList" :columns='columns' border :selection-type='false' :expand-type='false' show-index
        index-text='#'>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 等级 -->
        <template slot='level' slot-scope="scope">
          <el-tag v-if='scope.row.cat_level === 0'>一级</el-tag>
          <el-tag v-else-if='scope.row.cat_level === 1' type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot='opt' slot-scope="">
          <el-button type="primary" icon="el-icon-edit" size='mini'>修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="30%" @close="closeDialog">
      <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联表单 -->
          <el-cascader v-model="catKeysOptions" :options="parentCatList" :props="props" clearable @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatDialogVisibleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0, //一共多少条数据
      catList: [], //所有分类数据列表
      //表格的配置选项
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          headerAlign: 'center'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '等级',
          prop: 'cat_level',
          type: 'template',
          template: 'level',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          align: 'center',
          headerAlign: 'center'
        }
      ],
      //控制添加分类对话框的显示和隐藏
      addCatDialogVisible: false,
      //添加分类表单绑定的数据
      addCatForm: {},
      //添加分类的校验
      addCatFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ]
      },
      //级联表单配置项
      props:{
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id', //指定具体选中的隐式值
        label: 'cat_name', //指定所看到的显示内容
        children: 'children', //指定父子嵌套用那个属性


      },
      //级联选择器默认选中的值
      catKeysOptions:[],
      //级联选择器中父级数据
      parentCatList:[],
    }
  },
  methods: {
    //获取所有分类列表数据
    async getAllCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.pageInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取所有数据失败！')
      this.catList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getAllCatList()
    },
    handleCurrentChange(newNum) {
      this.pageInfo.pagenum = newNum
      this.getAllCatList()
    },
    //打开添加分类对话框
    async showAddCatDialog() {
      //获取所有的父分类数据
      const { data: res } = await this.$http.get('categories', {
        params: { type : 2}
      })
      if(res.meta.status !== 200) return this.$message.error("获取父级数据失败")
      this.parentCatList = res.data
      this.addCatDialogVisible = true
    },
    //当级联选择器的值发生改变时
    handleChange(value){
      this.catKeysOptions = value
    },
    //添加分类并关闭对话框
    addCatDialogVisibleClose(){
      //添加分类
      this.addCatForm.cat_name//名称
      this.addCatForm.cat_level = this.catKeysOptions.length//等级
      this.addCatForm.cat_pid = 0;
      if(this.catKeysOptions.length > 0){
        //大于0就不是一级分类，就要获取父分类
        this.addCatForm.cat_pid = this.catKeysOptions[this.catKeysOptions.length-1]//获取父分类的id
      }
      this.$refs.addCatFormRef.validate(async valid => {
        if(!valid) return false
        const {data:res} = await this.$http.post("categories",this.addCatForm)
        if(res.meta.status !== 201 ) return this.$message.error("添加失败")
        this.$message.success("添加成功")
        this.addCatDialogVisible = false
      })
      
    },
    //关闭添加对话框
    closeDialog(){
      // this.addCatForm = {}//清空添加时的参数对象
      this.$refs.addCatFormRef.resetFields()
      this.catKeysOptions = []//清空级联选择器选择的隐式值
      this.getAllCatList()//重置列表
    }
  },
  created() {
    this.getAllCatList()
  }
}
</script>

<style lang="less" scoped>
.but {
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>