import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'
import pinia from './stores/index'

// ✅ 添加 Element Plus 导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)  // ✅ 注册 Element Plus

app.mount('#app')