<template>
    <el-container class="home-container">
        <!--    头部区-->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!--   侧部菜单页面-->
            <el-aside width="200px">
                <!--unique-opened=true表示一次只能打开一个菜单 router="true":表示开启路由菜单栏 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 default-active可以看api-->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :router="true" :default-active="activePath">
                    <!--一级菜单-->
                    <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
                        <!--一级菜单模板区-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconsObj[item.id]"></i>
                            <!--文本区-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavstate('/'+subItem.path)">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--    主体区-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        //当加载这个页面时必须立即获取菜单数据  所以必须创建一个生命周期
        data() {
            return {
                //左侧菜单数据
                menuList: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                //被激活的地址链接（选中高亮）
                activePath:''
            }
        },
        created() {
            this.getMenuList();
            //渲染选中高亮
            this.activePath=window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            //获取所有的菜单数据
            async getMenuList() {
                const {data: res} = await this.$http.get('menus');
                if (res.meta.status!==200) return  this.$message.error(res.meta.msg);//如果获取出现错误打印错误信息
                this.menuList=res.data;// 如果没有出现错误 将数据挂载到menuList中
            },
            //保存链接的激活状态（选中二级菜单就为高亮）
            saveNavstate(activepath){
                window.sessionStorage.setItem('activePath',activepath)
                this.activePath=activepath;
            }
        }

    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex; /*弹性布局*/
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #ffffff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }

    }

    .el-aside {
        background-color: #333744;
        .el-menu{
            border-right: none ;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }
    .iconfont{
        margin-right: 10px;
    }
</style>