<!--
 * @Author: your name
 * @Date: 2019-12-03 18:33:27
 * @LastEditTime: 2019-12-07 12:47:15
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
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <!-- 这里的表格用的是 vue-table-with-tree-grid treeTable 表格 -->
      <!-- :data 是表格的数据源，:columns 是表格各列配置，:selection 是否为多选表格类型，:expand-type 是否为展开行类型表格 -->
      <!-- show-index 是否为索引列，index-text = "#" 数据索引列名称，border 是否显示纵向边框 -->
      <tree-table class="treetable" :data="catelist" :columns="columns" :selection-type='false' :expand-type="false"
        show-index index-text="#" border>
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
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon='el-icon-edit' size="mini" @click="showUpdateCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon='el-icon-delete' size="mini" @click="delCate(scope.row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <!-- @size-change 事件是改变了pagesize数据， @current-change 是pagenum发生改变时触发的 -->
      <!-- :current-page 是当前所绑定的页码数，第一个 :page-sizes 是每页显示多少条的几个可选值， 第二个 :page-size 是当前所绑定的每页显示多少条 -->
      <!-- layout 指定当前分页是由那部分功能组成, :total 绑定的是当前数据的总数量 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <!-- prop是验证规则 -->
        <el-form-item label="分类名称" prop="cate_name">
          <!-- v-model 绑定的是 el-form :model 绑定的对象属性 -->
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <!-- v-model 是将选中的值双向绑定data中，必须绑定的是数组，:options 指定当前选择器的数据源， :props 是级联选择器的配置选项 -->
          <!-- @change 是级联选择器选择项发生变化触发函数，clearable 是否支持清空选项， -->
          <el-cascader v-model="selectedKeys" :options="parendCateList" :props="cascaderProps"
            @change="parentCateChanged" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="updateCateDialogVisible" width="50%" @close="updateCateDialogClose">
      <el-form :model="updateCateForm" :rules="addCateFormRules" ref="updateCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="updateCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <!-- v-model 当前选中的值，是双向绑定到data中的类型必须是数组，:options 指定当前选择器的数据源， :props 是级联选择器的配置选项 -->
          <!-- @change 是级联选择器选择项发生变化触发函数，clearable 是否支持清空选项， -->
          <el-cascader v-model="updateSelectedKeys" :options="parendCateList" :props="updateCascaderProps" clearable disabled>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
      </span>
    </el-dialog>

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
        pagenum: 1, //当前是第几页
        pagesize: 5 //每页显示多少条
      },
      //总数据条数
      total: 0,
      //表格各列配置
      columns: [
        {
          label: '分类名称', //列名
          prop: 'cat_name' //具体的值
        },
        {
          label: '是否有效', //列名
          //将当前列定义为模板列
          type: 'template', //如果值是template，那这一列就是自定义模板列
          template: 'isok', //模板名称（指定插槽名字）
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
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
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加对象的表单数据对象
      addCateForm: {
        cate_name: '',
        cat_pid: 0, //存储的是当前父级分类id；等级是0代表没有父级分类，就是一级分类，如果是1代表是二级分类。
        cat_level: 0 //存储当前等级；等级是0代表是一级分类
      },
      //添加分类时的分类父id
      cat_pid: 0,
      //添加分类时的分类等级
      cat_level: 1,
      //添加分类时的验证规则
      addCateFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ]
      },
      //添加分类的父级分类列表数组
      parendCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover', //指定是通过什么动作显示数据
        value: 'cat_id', //指定具体选中的隐式值
        label: 'cat_name', //指定所看到的显示内容
        children: 'children', //指定父子嵌套用那个属性
        checkStrictly: true //可以选择任意一级选项（也可以在标签中使用 change-on-select 属性）
      },
      //添加分类时选中的父级分类id数组
      selectedKeys: [],
      //控制编辑分类对话框的显示和隐藏
      updateCateDialogVisible: false,
      //编辑分类表单绑定的对象
      updateCateForm: {
        cate_name : "",
        cate_id : 0
      },
      //编辑分类的表单校验
      updateCateFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ]
      },
      //编辑分类的选中的父级分类id数组
      updateSelectedKeys: [],
      //编辑分类的父级分类列表数组
      updateParendCateList: [],
      //级联选择器的配置选项
      updateCascaderProps: {
        expandTrigger: 'hover', //指定是通过什么动作显示数据
        value: 'cat_id', //指定具体选中的隐式值
        label: 'cat_name', //指定所看到的显示内容
        children: 'children', //指定父子嵌套用那个属性
        checkStrictly: true //可以选择任意一级选项（也可以在标签中使用 change-on-select 属性）
      }
    }
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      // if (res.meta.status !== 200) return this.$messge.error('获取商品列表失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //分页监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize //拿到最新的页条数
      this.getCateList() //pagesize改变了就要立即刷新数据。
    },
    //分页监听pagenum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage //拿到最新的页码值
      this.getCateList() //pagenum改变了就要立即刷新数据。
    },
    //点击按钮显示添加对话框
    showAddCateDialog() {
      this.getParentCateList() //获取添加分类的父级分类数据
      this.addCateDialogVisible = true //展示对话框
    },
    //获取前两级分类的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类失败！')
      this.parendCateList = res.data
    },
    //级联选择器选择项发生变化触发函数
    parentCateChanged() {
      //如果 selectedKeys 数组中的 length 大于0 证明选中了父级分类，反之没有选中父级分类。
      if (this.selectedKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = this.addCateForm.cat_level = 0
      }
    },
    //点击确定添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败！')
        this.addCateDialogVisible = false
        this.$message.success('添加成功！')
        this.getCateList() //刷新数据列表
      })
    },
    //关闭对话框清空内容
    addCateDialogClose() {
      //拿到表单的引用并清空。
      this.$refs.addCateFormRef.resetFields()
      //清空级联选择器绑定的数组信息
      this.selectedKeys = []
      //把表单里的cate_pid 和 cate_level 都重置为0。
      this.addCateForm.cat_pid = this.addCateForm.cat_level = 0
    },
    //删除分类
    async delCate(scope) {
      const confirm = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$http.delete(
        `categories/${scope.cat_id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.selectedKeys = []
      this.$message.success('删除成功')
      this.getCateList()
    },
    //显示编辑对话框
    async showUpdateCateDialog(scope) {
      this.updateCateDialogVisible = true
      this.updateCateForm.cate_id = scope.cat_id //获取当前行信息放到form表单中
      this.updateCateForm.cate_name = scope.cat_name //获取当前行信息放到form表单中
      this.getParentCateList() //获取所有级联选择器绑定的前两级父分类数据
      //只要是当前等级大于0就不是一级分类，它上面肯定有父分类
      if (scope.cat_level > 0) {
        //如果大于0就查询出当前分类的父分类数据
        const {data:res} = await this.$http.get(`categories/${scope.cat_pid}`)
        if (res.meta.status !== 200) return false
        this.updateSelectedKeys.push(res.data.cat_id)//然后把查出来的当前id添加到显示默认值的数组里面。
        //判断一下这个父分类数据是不是一级分类，如果查询出来的父分类数据还不是一级分类，就向数组里添加这次查询出的数据的父分类id
        if(res.data.cat_level > 0) this.updateSelectedKeys.unshift(res.data.cat_pid)//一级分类数据的id添加到数组的最前面
      }
    },
    //确认编辑对话框
    async updateCate(){
      const {data:res} = await this.$http.put(`categories/${this.updateCateForm.cate_id}`,{ cat_name : this.updateCateForm.cate_name})
      if(res.meta.status !== 200) return this.$message.error("修改失败！")
      this.$message.success("修改成功！")
      this.updateCateDialogVisible = false
      this.getCateList()//刷新数据列表
    },
    //关闭编辑对话框
    updateCateDialogClose(){
      this.$refs.updateCateFormRef.resetFields()
      this.updateSelectedKeys = []
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>