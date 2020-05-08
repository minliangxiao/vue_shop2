<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!--添加角色按钮区-->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!--角色列表区域-->
            <el-table :data="rolelist" border stripe><!--表格表格绑定得数据:data是双向数据绑定-->
                <!--展开列-->
                <el-table-column type="expand" label="展开列">
                    <!--用作用域插槽渲染信息-->
                    <template slot-scope="scope">
                        <!--做栅格系统的布局-->
                        <el-row :class="['bdbutton',i1== 0? 'bdtop':'' ,'vcenter']"
                                v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级权限 和三级权限-->
                            <el-col :span="19">
                                <!--二级权限-->
                                <el-row :class="['bdtop','vcenter']" v-for="(item2, i2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级权限-->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3 , i3) in item2.children" :key="item3.id"
                                                closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}
                                        </el-tag>
                                    </el-col>

                                </el-row>
                            </el-col>

                        </el-row>
                    </template>
                </el-table-column>
                <!--索引列-->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"
                                       @click="showSetRightDialog(scope.row)" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--分配权限对话框-->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!--树型控件-->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                // 所有的角色列表数据
                rolelist: [],
                // 控制分配权限的对话框的显示与隐藏
                setRightDialogVisible: false,
                // 获取所有权限 数据
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的节点Id值数组
                defKeys: [],
                // 当前即将分配权限的角色id
                roleId: ''

            }
        },
        created() {
            this.getRolesList();
        },
        methods: {
            // 获取说有的 角色列表数据
            async getRolesList() {
                let {data: res} = await this.$http.get('roles');
                if (res.meta.status != 200) {
                    return this.$message.error('获取角色列表失败！')
                }
                this.rolelist = res.data
                console.log(this.rolelist)
            },
            // 根据id 删除对应的权限
            async removeRightById(role, rightId) {
                // 弹框提示 是否删除
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该文件，是否继续？',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '消失',
                        type: 'warning'
                    }
                ).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除！')
                }
                let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status != 200) {
                    return this.$message.error('删除权限失败！')
                }
                role.children = res.data
            },
            //分配权限对话框
            async showSetRightDialog(role) {
                //对计将操作的角色id 赋值
                this.roleId = role.id
                // 获取所有权限数据
                let {data: res} = await this.$http.get('rights/tree'); // 这个接口返回回来的数据自动就是树型结构

                if (res.meta.status != 200) {
                    return this.$message.error('获取数据失败！')
                }
                // 为权限数组赋值
                this.rightsList = res.data
                console.log(this.rightsList)
                // 递归获取三级节点的id
                this.getLeafKeys(role, this.defKeys)
                // 打开对话框
                this.setRightDialogVisible = true

            },
            // 监听关闭分配权限对话框
            setRightDialogClosed() {
                this.defKeys = []
            },
            // 通过递归的形式，获取角色权限下所有三级权限的id,并保存到defKeys 数组中 (这个函数运用了递归的思想可以多看看)
            getLeafKeys(node, arr) {
                // 如果当前node节点不包含children属性则 表示当前节点为三级节点 为三级节点 则将三级节点的id装进arr数组
                if (!node.children) {
                    return arr.push(node.id)
                }
                // 递归遍历
                node.children.forEach(item => this.getLeafKeys(item, arr))

            },
            // 点击为角色分配权限(将树结构中的全选和半选提交到后台)
            async allotRights() {
                // ...是展开运算符是将数组展开的操作
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // 将keys用，拼接
                const idStr = keys.join(',')
                let {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
                    rids: idStr
                });
                if (res.meta.status != 200) {
                    return this.$message.error('分配权限失败！')
                }
                this.$message.success('分配权限成功')
                // 重新获取 角色列表数据
                this.getRolesList()
                // 关闭对话框
                this.setRightDialogVisible = false

            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        border-left: 1px solid #eee;
    }

    .bdbutton {
        border-bottom: 1px solid #eeeeee;
        border-right: 1px solid #eee;
        border-left: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>