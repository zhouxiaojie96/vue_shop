<!--
 * @Author: your name
 * @Date: 2019-11-26 19:50:30
 * @LastEditTime: 2019-12-12 14:20:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\power\Roles.vue
 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <!-- 这里的table 用的 elementui 的 table表格 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 权限展示 -->
            <!-- :css中的三元表达式，是判断是否是第一个，如果是第一个就加上那个类 -->
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
              :class="['bdbottom' , i1 === 0 ? 'bdtop' : '' , 'vcenter']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <!-- tag标签的 closable 属性是给标签添加了一个关闭按钮 -->
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop' , 'vcenter']">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning"
                      v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- pre标签会让输出的数据格式化 -->
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click.native="updateRoles(scope.row)">编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click.native="delRoleDialogVisible(scope.row.id)">删除
            </el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click.native="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框  每次关闭时要清空树控件的选中的key值-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="defKeys=[]">
      <!-- 树形控件 :data 是绑定的所有的数据， :props 指定数据绑定对象，show-checkbox 让控件有多选框，node-key="id" 给树控件的每一个节点绑定了一个唯一的值 ，它选中之后的这个值就是id，default-expand-all 是否默认展开所有节点，:default-checked-keys="defKeys" 默认勾选的节点的 key 的数组-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleClosed">
      <el-form :model="roleUser" :rules="roleUserRules" ref="roleUserRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="addROle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="updateRoleDialogVisible" width="30%">
      <el-form :model="updateRolesObj" :rules="roleUserRules" ref="updateRolesObjRef" label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateRolesObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="updateRolesObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="updateRoleDialogVisibleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限数据
      rightslist: [],
      //树形控件的数据绑定对象
      treeProps: {
        label: 'authName', //要显示那个属性的值
        children: 'children' //是通过那个属性进行父子嵌套的
      },
      //默认选中的节点id值数组
      defKeys: [],
      //给用户添加权限时的用户id，是在展示分配权限的对话框方法里赋值的。
      roleId: '',
      //控制添加角色对话框的显示隐藏
      addRoleDialogVisible: false,
      //添加角色对象
      roleUser: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色时的验证规则对象
      roleUserRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, message: '长度在3字符以上', trigger: 'blur' }
        ]
      },
      //控制编辑角色对话框的显示与隐藏
      updateRoleDialogVisible: false,
      //编辑角色信息
      updateRolesObj: {}
    }
  },
  methods: {
    //获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rolelist = res.data
    },
    //根据id删除对应的权限
    async removeRightById(scope, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(
        `roles/${scope.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      scope.children = res.data //执行完异步之后返回的data包含了删除完之后的所有最新的权限数据，然后从新赋下值就可以了。这样避免页面刷新。
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取失败！')
      this.rightslist = res.data
      this.getLeafKeys(role, this.defKeys) //递归获取三级节点的id。
      this.setRightDialogVisible = true
    },
    //通过递归的方式获取角色下所有三级权限的id，并保存到 defKeys 数组中  其中 node 是当前用户所有的数据就是role 也就是scope.row数据，arr 是要存放三级id的数组。
    getLeafKeys(node, arr) {
      //如果当前 node 节点不包含 children 属性则是三级节点
      if (!node.children) return arr.push(node.id)
      //如果当前 node 节点包含 children 就调用递归获取到三级节点
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //点击确定为角色添加权限
    async allotRights(role) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), //获取到所有已选中节点的id数组
        ...this.$refs.treeRef.getHalfCheckedKeys() //获取到所有半选中节点的id数组
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.setRightDialogVisible = false //关闭分配权限对话框
      this.$message.success('分配权限成功')
      this.getRolesList() //刷新用户列表
    },
    //监听添加角色对话框关闭事件
    addRoleClosed() {
      this.$refs.roleUserRef.resetFields() //对整个表单进行重置
    },
    //点击确定添加角色
    addROle() {
      this.$refs.roleUserRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('roles', {
          roleName: this.roleUser.roleName,
          roleDesc: this.roleUser.roleDesc
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败！')
        //刷新角色列表并且关闭对话框
        this.getRolesList()
        this.addRoleDialogVisible = false
        this.$message.success('添加成功！')
      })
    },
    //编辑角色
    updateRoles(role) {
      this.updateRolesObj = role //获取到当前角色信息
      this.updateRoleDialogVisible = true //打开编辑角色对话框
    },
    //确定编辑角色
    updateRoleDialogVisibleOk() {
      this.$refs.updateRolesObjRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          `roles/${this.updateRolesObj.id}`,
          {
            roleName: this.updateRolesObj.roleName,
            roleDesc: this.updateRolesObj.roleDesc
          }
        )
        if (res.meta.status != 200) return this.$message.error('编辑用户失败！')
        this.getRolesList()
        this.$message.success('编辑用户成功')
        this.updateRoleDialogVisible = false
      })
    },
    //删除角色
    async delRoleDialogVisible(id) {
      //提示是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== "confirm") return this.$message.info("已取消删除")
      //删除
      const {data:res} = await this.$http.delete(`roles/${id}`)
      if(res.meta.status !== 200) return this.$message.error("删除失败！")
      this.getRolesList()
      this.$message.success("删除成功！")
    }
  },
  created() {
    //获取所有角色的列表
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
</style>