<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card >
            <!--搜索与添加区-->

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"  >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col id="button" :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            return{
            //    获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,// 当前页码
                    pagesize: 2// 每页显示多少条数据
                }
            }
        },
        created(){
            this.getUserList()
        },
        methods:{
            async getUserList(){
                const {data:res} = await this.$http.get('users',{params:this.queryInfo})
                console.log(res);
             }
        }

    }
</script>

<style scoped>
    /*自己添加的 个人觉得添加用户向右偏点好看些*/
    #button{
        display: flex;
        margin-left: 50%;
    }
</style>