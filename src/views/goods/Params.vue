<!--
 * @Author: your name
 * @Date: 2019-12-06 14:15:25
 * @LastEditTime: 2019-12-10 10:35:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\goods\Params.vue
 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable='false'></el-alert>
      <!-- 级联选择器，商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="catListKeys" :options="catList" :props="props" clearable @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 标签 -->
      <!-- v-model 动态绑定的是当前 tab-pane 标签 的 name 值，@tab-click 是当前选中的标签发生改变时触发的函数 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- label 绑定的是当前标签的 头部切换标题 ，name 绑定的是 tabs 标签动态绑定的值 -->
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 这里的 :disabled 用到了计算属性 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 显示动态参数的表格 -->
          <el-table :data="manyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 这是自己写的想法，错误的 -->
                <!-- <el-tag v-for="(item,index) in manyTableData.attr_vals" :key='index' closable>{{item[index]}}</el-tag> -->
                <!-- 这是自己写的错误的判断的想法，判断一下这个数组里面是否有数据，如果没有数据就不要渲染tag标签了，具体解决方法在 methods 里的 handleTabClick 函数里  -->
                <!-- <el-tag v-if='scope.row.attr_vals.length > 0' @close='tagClose' v-for="(item,index) in scope.row.attr_vals" :key='index' closable>{{item}}</el-tag> -->
                <!-- 这是正确的 -->
                <el-tag @close='handleClose(scope.row,index)' v-for="(item,index) in scope.row.attr_vals" :key='index' closable>{{item}}</el-tag>
                <!-- 文本框与按钮之间的切换 -->
                <!-- v-if 绑定的是当前是显示文本框还是按钮；ref 是当前文本框的引用对象； size 控制大小；@keyup.enter.native 是当前文本框按下enter键后触发的函数；@blur 是当失去焦点时触发的函数 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- v-else 是和上面 el-input 的 v-if 绑定在一起的；控制显示文本框还是按钮；size 控制大小；@click是点击后出发的函数，一般用来控制显示文本框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 自增列 -->
            <el-table-column type='index' label='#' align='center'></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" align='center'></el-table-column>
            <el-table-column label="操作" align='center'>
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editMany(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 显示静态属性的表格 -->
          <el-table :data="onlyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag @close='handleClose(scope.row,index)' v-for="(item,index) in scope.row.attr_vals" :key='index' closable>{{item}}</el-tag>
                <!-- 文本框与按钮之间的切换 -->
                <!-- v-if 绑定的是当前是显示文本框还是按钮；ref 是当前文本框的引用对象； size 控制大小；@keyup.enter.native 是当前文本框按下enter键后触发的函数；@blur 是当失去焦点时触发的函数 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- v-else 是和上面 el-input 的 v-if 绑定在一起的；控制显示文本框还是按钮；size 控制大小；@click是点击后出发的函数，一般用来控制显示文本框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 自增列 -->
            <el-table-column type='index' label='#' align='center'></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" align='center'></el-table-column>
            <el-table-column label="操作" align='center'>
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editMany(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数和静态属性的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" @close='addDialogClosed'>
      <!-- 添加动态参数和静态属性的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数和静态属性的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" @close='editDialogClosed'>
      <!-- 修改动态参数和静态属性的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //级联选择器配置项
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      catList: [], //存放商品分类数据
      catListKeys: [], //存放商品分类选中的隐式值。
      activeName: 'many', //被激活的页签名称,  tabs 切换默认选中的页签，在 tab-pane 标签中的 name 属性使用
      manyTableData: [], //存放many动态参数的数据
      onlyTableData: [], //存放only静态参数的数据
      addDialogVisible: false, //控制添加动态参数和静态属性的对话框
      addForm: {}, //添加动态或者静态参数的表单数据对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符之间', trigger: 'blur' }
        ]
      },
      //修改动静态参数对话框
      editDialogVisible: false
    }
  },
  methods: {
    //获取级联选择器内所有的分类信息
    async getAllCat() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取所有商品分类数据列表错误')
      this.catList = res.data
    },
    //获取参数列表数据
    async handleTabClick() {
      const { data: res } = await this.$http.get(
        `categories/${this.catListKeys[2]}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')

      //将data里面的每一项都做循环，每循环一次就会拿到一个item 项，每拿到的这个item 项就把它的attr_vals的值用split做分割
      //然后它的返回值是数组，就把item的attr_vals从新赋一下值，然后item的attr_vals就是一个数组了。
      //这是用了三元表达式之前的
      // res.data.forEach(item => {
      //     item.attr_vals = item.attr_vals.split(' ')
      // })
      //这是用了三元表达式之后的
      //这里有一个判断，如果当前数组不为空就按空格分割，如果是空的就返回一个空数组
      //避免了如果 attr_vals 里面没有内容还渲染tag标签
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false //控制文本款的显示与隐藏
        item.inputValue = '' //文本框输入的值
      })

      //判断返回的是动态参数还是静态属性
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      console.log(res.data)
    },
    //当级联选择器内容发生改变时
    handleChange() {
      //判断当前分类是否是第三级，如过不是就提示。
      if (this.catListKeys.length < 3 && this.catListKeys.length > 0) {
        this.catListKeys = []
        //清空静态和动态参数
        this.manyTableData = [] 
        this.onlyTableData = []
        return this.$message.error('请选择第三级的分类')
        
      } else if (this.catListKeys.length === 3) {
        this.handleTabClick()
      }
    },
    //点击页签切换动态参数和静态属性
    handleClick() {
      //先判断是否有选中商品分类，判断计算属性返回的什么
      if (this.isBtnDisabled) {
        this.$message.info('请先选择商品分类')
      } else {
        this.handleTabClick()
      }
    },
    //点击添加动静态属性
    addParams() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return false
        const { data: res } = await this.$http.post(
          `categories/${this.catListKeys[2]}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.addDialogVisible = false
      })
    },
    //当添加对话框关闭时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() //清空表单内容
      this.handleTabClick() //刷新参数列表
    },
    //点击修改动态参数
    editMany(scope) {
      this.editDialogVisible = true
      this.addForm = scope
    },
    //当确认修改时
    editDialogOk() {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return false
        const { data: res } = await this.$http.put(
          `categories/${this.addForm.cat_id}/attributes/${this.addForm.attr_id}`,
          { attr_name: this.addForm.attr_name, attr_sel: this.addForm.attr_sel }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败！')
        this.$message.success('修改成功！')
        this.editDialogVisible = false
      })
    },
    //修改框关闭时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.addForm = {} //这里需要手动清除一下，不知道为什么，就算是和添加不共同用一个对象也需要手动清空
      this.handleTabClick() //刷新参数列表
    },
    //删除静态参数和动态属性
    async delAttr(scope) {
      const confirm = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') return this.$message.info('已取消删除')
      //执行删除操作
      const { data: res } = await this.$http.delete(
        `categories/${scope.cat_id}/attributes/${scope.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.handleTabClick()
    },
    //点击按钮显示文本框
    showInput(scope) {
      scope.inputVisible = true
      //让文本框自动获取焦点
      this.$nextTick(_ => {//$nextTick 方法的作用：当页面上元素被重新渲染之后，才会指定回调函数中的代码。
        //这里的代码是页面全部渲染完毕后才会执行。
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //修改 tag 数组的值
    async saveAttrValues(scope){
      const {data:res} = await this.$http.put(`categories/${this.catListKeys[2]}/attributes/${scope.attr_id}`,{attr_name : scope.attr_name , attr_sel : scope.attr_sel , attr_vals : scope.attr_vals.join(" ")})
      if(res.meta.status !== 200) return this.$message.error("修改参数顶失败")
      this.$message.success("修改参数顶成功")
    },
    //文本框失去焦点或按下了enter键都会触发
    async handleInputConfirm(scope) {
      //判断用户输入的内容是否正确，避免输入空格
      if(scope.inputValue.trim().length === 0){
        scope.inputValue = ''
        scope.inputVisible = false//隐藏文本框
        return false
      }
      //如果更新成功了
      scope.attr_vals.push(scope.inputValue.trim())//把输入的内容添加到tag数组里面进行保存
      scope.inputValue = ''//清空文本框内容输入的内容
      scope.inputVisible = false//隐藏文本框
      this.saveAttrValues(scope)//修改参数顶
    },
    //删除每个参数里的tag标签函数
    async handleClose(scope,index) {
      scope.attr_vals.splice(index,1);//删除存储tag标签数组里面的值
      this.saveAttrValues(scope)//修改参数顶
    }
  },
  //声明周期钩子
  created() {
    this.getAllCat()
  },
  //声明计算属性，计算属性一般是用于简化dom上的逻辑。
  //1.计算属性作用：实时监听，一般用于简化dom上的逻辑
  //和methods的不同：
  //1.methods在页面上用时是以方法的语法，而计算属性用时是以属性的写法
  //2.计算属性有缓存功能，只要值改变过一次直到它下次发生改变这段时间是不会重复执行的，因为只要值不变的情况下执行过一次之后就会缓存起来了。避免了像method的重复执行。
  computed: {
    //根据有无选择商品分类改变按钮的状态
    //如果按钮需要被禁用则返回true,否则返回false.
    isBtnDisabled() {
      if (this.catListKeys.length > 0) {
        return false
      } else {
        return true
      }
    },
    //动态计算添加对话框的标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>