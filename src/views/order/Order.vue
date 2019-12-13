<!--
 * @Author: your name
 * @Date: 2019-12-11 17:19:51
 * @LastEditTime: 2019-12-12 14:19:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\order\Order.vue
 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-form>
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="pageInfo.query" class="queryInput">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-form>
      <!-- 表格 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单标号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot='scope'>
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showBox"></el-button>
            <el-button type="primary" icon="el-icon-location" size='mini' @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close='addressDialogClosed'>
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <!-- @change="handleChange" -->
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progresVisible" width="50%">
      <!-- el-timeline 时间线 -->
      <el-timeline>
          <!-- :timestamp 绑定的是时间 每一个时间点就是一个 el-timeline-item -->
        <el-timeline-item v-for="(activity, index) in progresInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata' //引入三级城市信息js
export default {
  data() {
    return {
      pageInfo: {
        query: '', //搜索条件
        //分页条件
        pagenum: 1,
        pagesize: 5
      },
      total: 0, //所有数据数量
      orderList: [], //所有数据列表
      addressVisible: false, //控制修改地址对话框的显示与隐藏
      addressForm: {}, //修改地址的表单对象
      addressFormRules: {
        //修改地址的验证规则对象
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData, //三级城市信息
      props: {
        expandTrigger: 'hover'
        // label: '',
        // values: '',
        // children: 'children'
      },
      progresVisible: false, //物流进度
      progresInfo: {} //存储物流信息
    }
  },
  methods: {
    //获取所有的订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.pageInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取数据列表失败')

      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newPageSize) {
      this.pageInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum) {
      this.pageInfo.pagenum = newPageNum
      this.getOrderList()
    },
    //展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      // this.cityData = []
      this.$refs.addressFormRef.resetFields()
    },
    //展示物流状态
    async showProgressBox() {
      this.progresVisible = true
      const { data: res } = await this.$http.get(`kuaidi/${1106975712662}`)
      if (res.meta.status !== 200)
        return this.$message.error('获取物流信息失败')
      this.progresInfo = res.data
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.queryInput{
    margin-bottom: 20px
}
</style>