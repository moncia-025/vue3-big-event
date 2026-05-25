import { userUserInfo } from "@/api/user";
import { defineStore } from "pinia";
import { ref } from "vue";

// 用户模块
export const useUserStore=defineStore('user',()=>{
//   定义token
const token=ref('')  
const setToken=(t)=>token.value=t
// 清除token
const removeToken=()=>token.value=''
// 用户信息
const user=ref({})
const getUser=async()=>{
    const res=await userUserInfo()
    user.value=res.data.data
}
// 清除用户信息
const setUser=(obj)=>user.value=obj
return{
    token,
    setToken,
    removeToken,
    user,
    getUser,
   setUser
}

},
{
    persist:true //持久化
}
)