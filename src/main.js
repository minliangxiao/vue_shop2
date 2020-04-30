/* eslint-disable space-infix-ops */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
// import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1'
// 设置请求拦截器（向服务器发送请求之前都挂载token的值在请求里面 好让后端判断是否已经授权）
axios.interceptors.request.use(config=> {
    //config.headers 可以获取到请求头
    config.headers.Authorization = window.sessionStorage.getItem('token');//在请求头中添加一个Authorization字段  值为session中的token值
    return config;
})
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.use(ElementUI)
//将elementUI中的message挂载到Vue中
Vue.prototype.$message=ElementUI.Message
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
