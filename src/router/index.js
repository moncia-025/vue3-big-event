import { useUserStore } from '@/stores/user'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // vite中的import.meta.env.BASE_URL就是vite.config.js中的base配置项
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/login',component:()=>import('@/views/login/LoginPage.vue')},
    {path:'/',component:()=>import('@/views/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
       { path:'/article/manage',component:()=>import('@/views/article/ArticleMange.vue')},
       { path:'/article/channel',component:()=>import('@/views/article/ArticleChannel.vue')},
       { path:'/user/profile',component:()=>import('@/views/user/UserProfile.vue')},
       { path:'/user/avatar',component:()=>import('@/views/user/UserAvatar.vue')},
       { path:'/user/password',component:()=>import('@/views/user/UserPassword.vue')},
      ]
    }
  ],
})
// 登录访问拦截-- 默认是直接放行
// 根据返回值决定是否放行
// 返回值：
// （1）：返回underfined和true--放行
// （2）：返回false返回到from
router.beforeEach((to)=>{
// 如果无token并且是非登录页面则拦截到登录页
const userStore=useUserStore()
if(!userStore.token && to.path!=='/login')
  return '/login'
})
export default router
