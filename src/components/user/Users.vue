<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--搜索与添加区-->

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <!--@clear事件是点击clearable触发的事件-->
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col id="button" :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column> <!--加个索引列-->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态"> <!--为标签指定了作用域插槽 作用域插槽<template></template>就会覆盖掉原来的prop属性-->
                    <template slot-scope="scope"> <!--通过scope可以获取到当前列对象-->
                        <!--scope.row就对应了这一行的数据-->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.id)"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
            <!--分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--添加用户对话框-->
        <!--:visible.sync 是控制对话框的显示与隐藏需要一个布尔值控制-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%" >
            <!--内容主体区-->
            <el-form :model="addForm" :rules="addFormRueles" ref="addFormRef" label-width="70px" >
                <el-form-item label="用户名" prop="username"> <!--暂且不知道prop在这里的具体功能-->
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--底部按钮-->
            <span slot="footer" class="dialog-footer">
             <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户对话框-->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {  //rule表示验证规则，value表示需要验证的值 cb 表示回调函数
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }

                cb(new Error('请输入合法的邮箱'))
            }
            // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

                if (regMobile.test(value)) { //test为验证函数
                    return cb()
                }

                cb(new Error('请输入合法的手机号'))
            }

            return {
                //    获取用户列表的参数对象
                queryInfo: {
                    query: '', // 搜索关键字
                    pagenum: 1,// 当前页码
                    pagesize: 2// 每页显示多少条数据
                },
                userList: [],
                total: 0  ,//返回数据的条数
                addDialogVisible:false ,//控制添加用户对话框的显示与隐藏

                // 添加用户的表单项
                addForm:{
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //添加表单的验证规则对象
                addFormRueles:{
                    username:[
                        {required:true,message:'请输入用户名',trigger:'blur'},// trigger表示触发时机，blur表示失去焦点开始触发
                        {min: 2 ,max: 10 ,message: '用户名在长度在2~10个字符之间' ,trigger: 'blur'}

                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {
                            min: 6,
                            max: 15,
                            message: '密码的长度在6~15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                editDialogVisible:false, // 控制修改用户对话框的显示与隐藏
                editForm: { },
                // 修改表单的验证规则
                editFormRules: {
                    email: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入用户手机', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
                this.userList = res.data.users;
                this.total = res.data.total;
                console.log(res);
            },
            /*监听pagesize改变的事件*/
            handleSizeChange(newSize) {
                // console.log(newSize)
                //重置查询条件中的pagesize
                this.queryInfo.pagesize = newSize;
                //    重新发起请求请求数据
                this.getUserList();
            },
            /*监听页码值改变的事件*/
            handleCurrentChange(newPage) {
                // console.log(newPage)
                //从新为查询条件中的pagenum赋值
                this.queryInfo.pagenum = newPage
                //重新请求数据
                this.getUserList()
            },
            /*将状态栏里面的userState 存放入数据库 监听switch开关的改变 */
            async userStateChanged(userinfo) {
                // console.log(userinfo)
                /*调用api接口保存用户状态*/
                const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)//${}能够获取到参数
                if (res.meta.status != 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户失败！')
                }
                this.$message.success('更新用户状态成功');
            },
            //监听对话框关闭事件
            addDialogClosed(){
                /*重置对话框*/
                this.$refs.addFormRef.resetFields();
            },
            // 添加用户前进行的预校验
            addUser(){
                this.$refs.addFormRef.validate(async  valid=>{ // 参数valid可以获取到表单的填写数据
                    if (!valid) return
                    const {data : res}=await this.$http.post('users',this.addForm)
                    if(res.meta.status!=201) {
                        this.$message.error('添加用户失败！')
                    }
                    this.$message.success('添加用户成功')
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false
                    // 重新获取用户列表数据
                    this.getUserList()
                })
            },
            // 展示修改用户的对话框
           async showEditDialog(id){
                const {data:res} = await this.$http.get('users/'+id);
                if (res.meta.status!=200){
                    return this.$message.error('查询用户信息失败')
                }
                //为 editForm添加数据
                this.editForm=res.data;
                //打开对话框
               this.editDialogVisible = true
            },
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            //修改用户信息并且提交
            editUserInfo(){
                //拿到表格数据并经行预验证  然后异步提交
                this.$refs.editFormRef.validate( async valid=>{
                    // 如果验证不通过（valid则会返回值为false） 退出
                    if (!valid) return
                    // 这个put请求挺有意思的 能传对象 有空研究一下
                    let {data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile});
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败！')
                    }

                    // 关闭对话框
                    this.editDialogVisible = false
                    // 刷新数据列表
                    this.getUserList()
                    // 提示修改成功
                    this.$message.success('更新用户信息成功！')
                })
            },
            // 通过id 删除用户对应的信息
            async removeUserById(id){
                // 先弹出对话框询问是否删除用户数据
                let confirmResult = await this.$confirm(
                    '是否永久的删除用户？',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '消失',
                        type: 'warning'
                    }
                ).catch(err=>err); //对话框点击取消后会抛出一个异常 需要一个catch 来处理这个这个异常
                /*
                * 如果用户确认删除 返回一个字符串 confirm
                * 如果用户消失了删除 则返回一个字符串 cancel
                * */
                if (confirmResult!='confirm'){
                    return this.$message.info('已取消删除')
                }
                // 向后端发送数据经行删除
                let {data : res} = await  this.$http.delete('users/'+id);
                if (res.meta.status!=200){
                    return this.$message.error('删除用户失败')
                }
                this.$message.success('删除用户成功')
                this.getUserList()
            },
        }

    }
</script>

<style scoped>
    /*自己添加的 个人觉得添加用户向右偏点好看些*/
    #button {
        display: flex;
        margin-left: 50%;
    }
</style>