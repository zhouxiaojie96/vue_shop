<!--
 * @Author: your name
 * @Date: 2019-11-25 14:54:37
 * @LastEditTime: 2019-11-28 11:04:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\user\Users.vue
 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <!-- el-row 是 element 的栅格，相当于 bootstrap 的 row 类， 里面的 :gutter='20' 是列和列之间相差的距离 -->
      <el-row :gutter="20">
        <!-- el-col 是 element 的栅格，相当于 bootstrap 的 col-md-* 类， 里面的 :span='10' 是占几个格数，一共有24个格数。-->
        <el-col :span="10">
          <!-- clearable 属性是清空文本框内容里面的小叉叉  @clear 是清空文本框所触发的事件 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click.native="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click.native="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <!-- border 是添加表格的边框  stripe 是添加隔行变色-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 如果同时指定了 prop 和 作用域插槽，prop就不生效了 -->
        <el-table-column label="状态" prop="mg_state">
          <!-- 作用域插槽：父组件可以处理子组件的数据 -->
          <!-- 作用域插槽：slot-scope="scope" 其中scope是自定义的，然后子组件通过：:自定义属性名='要传的值' 传递给父组件，父组件通过 slot-scope="scope" 的 scope.子组件自定义属性名 获取到子组件传递给父组件的值-->
          <template slot-scope="scope">
            <!-- {{scope.row}}  代表这一行的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- 分配角色按钮 -->
            <!-- el-tooltip 是悬浮到按钮上就会有提示文字的作用 effect 用来设置颜色， content 用来设置提示内容， placement 用来设置提示在那个方向， :enterable='false' 作用是当鼠标悬浮到提示文字上要不要继续显示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <!-- layout 用来指定页面上都展示哪些功能组件 total：共有多少条的数据显示。 sizes:可以选择每页是多少条-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <!-- title是对话框的标题，:visible.sync="addDialogVisible" 是用来控制对话框的显示与隐藏  @close="addDialogClosed" 是监听关闭对话框事件-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主题区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新的角色：
            <!-- 下拉菜单 v-model 绑定的是选中之后的值 -->
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <!-- :label 绑定的是option显示的内容 :value 绑定的是option隐式内容 -->
              <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      
    </el-card>
  </div>
</template>

<script>
//import { async } from 'q'//我没有主动引入这个，不知道是什么时候有的
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      //用户数据列表
      userList: [],
      //总条数
      total: 0,
      //控制添加用户框的显示隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //定义添加用户的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          //自定义规则第二部：在这里使用 validator 是用来指定那个验证规则，trigger是用来指定什么时候触发验证时机
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          //自定义规则第二部：在这里使用 validator 是用来指定那个验证规则，trigger是用来指定什么时候触发验证时机
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制修改用户框的显示隐藏
      editDialogVisible: false,
      //查询到的单个用户信息对象
      editForm: {},
      //定义修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          //自定义规则第二部：在这里使用 validator 是用来指定那个验证规则，trigger是用来指定什么时候触发验证时机
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          //自定义规则第二部：在这里使用 validator 是用来指定那个验证规则，trigger是用来指定什么时候触发验证时机
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制分配角色的对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配用户角色的用户信息
      userInfo: {},
      //所有角色列表
      rolesList: [],
      //分配角色时已选中的角色id值
      selectedRoleId: '',
      
      
    }
    //自定义规则 一：定义规则
    //1.验证规则。2.需要验证的值。3.回调函数，只要验证通过了就可以在箭头函数中直接调cb就代表验证通过，如果验证不通过在调用cb的同时必须提供一个error对象，error对象里的字符串就是错误提示消息。
    //使用时在 表单的验证规则对象 里面使用。
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      //判断验证的值是否合法用test()方法
      if (regEmail.test(value)) {
        //合法的邮箱return cb。
        return cb()
      }
      //如果是非法的
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号的规则
    var checkMobile = () => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      //判断验证的值是否合法用test()方法
      if (regMobile.test(value)) {
        //合法的手机号return cb。
        return cb()
      }
      //如果是非法的
      cb(new Error('请输入合法的手机号'))
    }
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变的事件
    //这个触发的时机是只要切换了“每页显示多少条”的菜单就会执行这个函数，可以拿到最新的pagesize。
    handleSizeChange(newSize) {
      console.log('最新的每页显示多少条 也就是 pagesize：' + newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听 页码值 改变
    handleCurrentChange(newPage) {
      console.log('拿到最新的当前是第几页 也就是 newPage：' + newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听switch开关状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        //如果更新失败就把状态更新回原来的状态，并且提示用户。
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果。
    },
    //添加用户
    addUser() {
      //判断表单校验是否通过，不通过返回false，通过返回true。
      this.$refs.addFormRef.validate(async valid => {
        //判断表单校验是否通过
        if (!valid) return false
        //通过了，可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.addDialogVisible = false //添加成功后隐藏对话框
        this.getUserList() //重新获取列表数据。
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200)
        return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //重置修改对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields() //对修改对话框进行重置。
    },
    //提交修改对话框
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        //通过了发起修改用户的数据请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200)
          return this.$message.error('更新用户失败！')
        this.editDialogVisible = false //关闭对话框
        this.getUserList() //刷新用户列表
        this.$message.success('修改用户成功！') //提示修改成功
      })
    },
    //根据id删除对应的用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' //提示图标
        }
      ).catch(err => err) //简写前：.catch(err => { return err } )。如果函数体中只有一行代码可以简写把{}去掉，{}去掉了 return 也要去掉。
      //如果用户确认删除，则返回字符串"confirm"
      //如果用户取消删除，则返回字符串"cancel"
      //判断用户是否删除
      if (confirmResult !== 'confirm') return this.$message.info('已经取消删除')
      //确认了删除
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功！')
    },
    async setRole(userInfo) {
      this.userInfo = userInfo //赋值当前分配角色的用户信息
      //获取到所有角色
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolesList = res.data //获取到的所有角色列表存放到data中。
      this.setRoleDialogVisible = true
    },
    //点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择新的角色')
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      )
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')
      this.$message.success('更新角色成功!')
      this.getUserList()
      this.setRoleDialogVisible = false //关闭对话框
    },
    //监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>