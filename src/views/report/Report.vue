<!--
 * @Author: your name
 * @Date: 2019-12-11 22:28:45
 * @LastEditTime: 2019-12-12 11:49:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\report\Report.vue
 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->、
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts文件
import echarts from 'echarts'
//这里的lodash用于合并两个配置对象
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  created() {},
  //初始化echarts图标是需要在页面dom渲染完之后
  //mounted钩子 此时页面上的dom元素已经渲染完毕了
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 4.发起请求获取配置项
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200)
      return this.$message.error('获取图标数据失败！')
    // 5.使用刚指定的配置项和数据显示图表。
    //放之前要把后台返回的配置项和一些代码合并一下。合并的话需要用到 lodash。
    //将后台返回的配置项和data中的options配置项合并返回一个新的配置项然后放到 myChart 实例中
    const result = _.merge(res.data,this.options)
    myChart.setOption(result)
  }
}
</script>