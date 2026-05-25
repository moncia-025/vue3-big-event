<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userUpdatePassService } from '@/api/user'
import { ElMessage } from 'element-plus'
const formRef = ref()
const router = useRouter()
const userStore = useUserStore()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const onSubmit = async () => {
  const valid = await formRef.value.validate()//校验表单
  if (valid) {
    await userUpdatePassService(pwdForm.value)//校验完后发请求
    ElMessage({ type: 'success', message: '更换密码成功' })
    userStore.setToken('')//清除token
    userStore.setUser({})//清除用户信息
    router.push('/login')//跳转到登录页
  }
}
// 重置密码表单
const onReset = () => {
  formRef.value.resetFields()
}
// 自定义校验函数
const checkOldSame = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))//如果原密码和新密码一样，校验失败，提示错误信息
  } else {
    cb()//校验成功，什么都不做
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}
// 表单校验规则
const rules = {
  // 原密码
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,//正则表达式，密码长度必须是6-15位的非空字符串
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  // 新密码
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }//自定义校验函数，校验原密码和新密码不能一样
  ],
  // 确认新密码
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }//自定义校验函数，校验新密码和确认再次输入的新密码必须一样
  ]
}
</script>
<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
    
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">修改密码</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>