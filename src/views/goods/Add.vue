<!--
 * @Author: your name
 * @Date: 2019-12-10 14:49:30
 * @LastEditTime: 2019-12-11 16:30:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\goods\Add.vue
 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- :active 是激活的第几步步骤条，从0开始，这里的 activeIndex 是字符串，把一个数字型的字符串转换成数字直接 -0（减零） 就可以了 -->
      <!-- aligin-center 是控制步骤条的对齐方式 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <!-- 每一个 el-step 就是一个步骤，title 是这个步骤的标题 -->
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--  -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <!-- v-model 绑定的是当前选中的tab的name值 -->
        <!-- :tab-position 指定导航标签所在的区域，里面如果是文本就需要再用单引号包住，如果是个属性就不需要 -->
        <!-- :before-leave 是标签标题切换之前触发的钩子，只要触发了这个函数就证明要发生标签页的切换。 -->
        <!-- @tab-click 当标签页的页数发生改变时触发的事件 -->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave='beforeTableave' @tab-click="tabClicked">
          <!-- el-tab-pane 是每一个标签标题，是作为 el-tabs 的直接子标签 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <!-- type="number" 是限制只能输入数字 -->
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="props" clearable
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- v-model 绑定的是 checkbox 选中的值 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台api地址，:on-preview 点击图片触发预览图片事件，:on-remove 点击图片信息的右上角叉号时触发的事件 -->
            <!-- list-type 用来指定当前预览组件的呈现方式，:headers 用来上传时手动指定 headers 请求头，因为上传组件没有调用axios，所以要手动在请求头对象中绑定 Authorization 字段，指定 token 值 -->
            <!-- 图片上传成功是上传到服务器保存成功了，但是还没有保存到 addForm 表单对象中，需要调用图片成功上传到服务器的钩子 来进行存储到数据库 -->
            <!-- :on-success 是当图片成功上传到服务器的钩子，他有三个形参，分别是：response服务器返回的信息，file是文件的信息，fileList当前上传组件的文件列表 -->
            <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
              :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <!--  ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加表单项按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品文本</el-button>
          </el-tab-pane>
          <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!-- 显示预览图片的对话框 -->
    <el-dialog title="预览图片" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'//导入lodash，在这里用来使用深拷贝。
import { async } from 'q'
export default {
  data() {
    return {
      activeIndex: '0', //默认激活步骤条的第几个，也绑定到标签页的name属性上了
      addForm: {
        goods_name : '',
        goods_price : 0,
        goods_number : 0,
        goods_weight : 0,
        goods_cat: [], //这个是商品分类选择的值，如果不提前声明当执行 beforeTableave 函数时会报错没有声明这个参数。
        pics: [], //上传图片的数组
        goods_introduce : '',//商品详情描述
        attrs : [],//存储动态参数和静态属性的数组
      }, //添加商品的表单数据对象
      addFormRules: {
        //添加商品的表单验证规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [], //获取所有商品分类数据
      //级联选择器的配置对象
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [], //动态参数列表数据
      onlyTableData: [], //静态属性列表数据
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload', //上传图片的url服务器地址
      //图片上传组件的headers请求头对象
      headerObj: {
        //上传图片的时候手动为地址指定一个请求头，在请求头中包含了一个字段属性 Authorization 值就是保存在 sessionStorage 中的token值。
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '', //预览图片的图片路径
      dialogVisible: false //控制预览图片的对话框的显示与隐藏
    }
  },
  methods: {
    //获取所有商品分类信息
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败')
      this.cateList = res.data
      console.log(this.cateList)
    },
    //级联选择器值发生改变时
    handleChange() {
      //判断选择的是否是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.info('请选择三级分类')
      }
    },
    //当标签页切换前触发的钩子,第一个参数是即将要进入的标签页的名字，第二个参数是即将离开的标签页的名字
    beforeTableave(activeName, oldActiveName) {
      //判断即将离开的标签的名字是否是第一个，并且商品分类是不是三级。
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //当标签页发生改变时触发的事件
    async tabClicked() {
      //如果 activeIndex 的值是1 的话，就是访问的是动态参数标签页，就执行相应的操作。
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取动态参数列表失败')
        //把 attr_vals 转换为数组后再赋值
        //用三元表达式判断一下 attr_vals 字符串是否等于0，如果长度是0就返回空数组，如果不是等于0 就返回分割后的数组。
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        //如果 activeIndex 的值是2 的话，就是访问的是商品属性标签页，就执行相应的操作。
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取静态属性列表失败')
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    //处理图片预览效果,file是当前图片信息
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    //处理移除图片的操作
    handleRemove(file) {
      //获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //从pics数组中找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1) //移除对象
    },
    //监听图片上传成功的事件,response是图片上传成功后服务器返回的数据
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path } //拼接得到一个图片对象
      this.addForm.pics.push(picInfo) //把拼接的对象信息放到form表单对象的数组里
    },
    //添加表单项事件
    add(){
      //判断是否合法
      this.$refs.addFormRef.validate(async vali => {
        if(!vali) return this.$message.error("请填写必要的表单项！")
        //执行添加的业务逻辑
        //处理合并动态参数和静态属性。
        this.manyTableData.forEach(item => {//动态参数
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理商品参数数组转换为字符串
        //级联选择器只允许v-model绑定到数组，以其他方式会报错。（那怎么解决 goods_cat 数组转化为字符串的问题呢，需要用深拷贝 addForm）
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')//这个写法会报错。
        const newAddForm = _.cloneDeep(this.addForm)//深拷贝用 lodash 包的 cloneDeep(oldObj)方法
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')//操作新的对象
        
        //发起请求，添加商品
        const {data:res} = await this.$http.post('goods',newAddForm)
        if(res.meta.status !== 201) return this.$message.error("添加商品失败")
        this.$message.success("添加成功！")
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  },
  //计算属性
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd{
  margin-top: 20px
}
</style>