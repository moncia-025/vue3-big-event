// pinia独立维护 统一导出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia= createPinia()
pinia.use(persist)
export default pinia