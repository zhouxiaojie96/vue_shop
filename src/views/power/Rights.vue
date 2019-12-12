<!--
 * @Author: your name
 * @Date: 2019-11-26 19:00:24
 * @LastEditTime: 2019-12-07 12:48:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\views\power\Rights.vue
 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- table表格 -->
            <!-- 这里的table 用的 elementui 的 table表格 -->
            <el-table :data="rightstList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限姓名" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <!-- 因为要自定义这一列要渲染成什么样子，所以要通过作用域插槽的方式来自定义输出它的格式 -->
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //权限列表
            rightstList : []
        }
    },
    methods:{
        //获取所有权限
        async getRightsList(){
            const {data:res} = await this.$http.get("rights/list")
            if(res.meta.status !== 200) return this.$message.error("获取权限列表失败")
            this.rightstList = res.data
        }
    },
    created(){
        //获取所有权限
        this.getRightsList()
    }
}
</script>

<style lang="less" scoped>

</style>