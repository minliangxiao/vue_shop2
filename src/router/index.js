import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from "@/components/user/Users"
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect:'welcome',
        children: [
            {path: '/welcome',component: Welcome},
            {path: '/users',component: Users},
            {path:'/rights',component: Rights},
            {path:'/roles',component: Roles}
        ]
    },

]

const router = new VueRouter({
    routes
});
//挂载一个路由守卫（路由守卫相当于拦截器）
router.beforeEach((to, form, next) => {
    /*
    * to 将要访问的路径
    * from 代表从那个路径跳转而来
    * next 是一个函数  表示放行  next() 放行  next('/login') 强制跳转到 /login路径下
    * */
      if (to.path=='/login') return next();// 表示用户访问的是登陆页面 直接放行
//    获取token
      const  tokenStr=window.sessionStorage.getItem('token');
      // console.log(tokenStr);
      if (!tokenStr) return next('/login'); // 如果token为空就跳转到/login页面  !tokenStr表示tokenStr为空 !null=true
       next();
})

export default router
