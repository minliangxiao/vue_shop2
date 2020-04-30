<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormrules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按扭区 -->
                <el-form-item class="bts">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script >
    export default {
        data () {
            return {
                // 这是一个登陆表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: ''
                },
                loginFormrules: {
                    // 验证用户名是否合法
                    username: [
                        { required: true, message: '请输入登陆名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
                    ],
                    // 验证密码是否合法
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 重置表单方法
            resetLoginForm: function() {
                this.$refs.loginFormRef.resetFields()// 更具this.$refs可以拿到ref="loginFormRef"定义的对象然后调用这个对象的resetFields方法可以重置这个对象
            },
            // 表单预校验写法
            login: function() {
                this.$refs.loginFormRef.validate(async valid => {
                        // eslint-disable-next-line no-useless-return
                        if (!valid) return;
                        const {data:res}=await this.$http.post('login',this.loginForm);//这种写法比较高级，{data:res} 将返回回来的对象中的data取出 然后重命名为res
                        if (res.meta.status!==200) return this.$message.error('登陆失败')// 从返回状态码上面判断数据库里有没有这个人
                        this.$message.success('登陆成功')
                    // 登陆成功后将token，保存到客户端的sessionStorage中
                        window.sessionStorage.setItem("token",res.data.token);
                    // 在通过编程式导航跳转到/home去
                        this.$router.push('/home');

                    }
                )
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        // 将盒子设置到中间
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar_box{
        height:130px ;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100% ;
            height: 100%;
            border-radius: 50%;
            background-color:#eee;
        }
    }
    .bts{
        //将按钮居右对其
        display: flex;
        justify-content: flex-end;

    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
