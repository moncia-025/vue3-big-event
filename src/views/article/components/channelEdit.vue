<script setup>
import { artAddChannel, artEditChannel } from '@/api/article';
import { ref } from 'vue';
import { ElMessage } from 'element-plus'  // 导入 ElMessage
const dialogVisible=ref(false)//默认弹窗关闭
const formRef=ref()
const emit=defineEmits(['success'])
// 组件对外暴漏一个open方法用来区别是编辑还是添加
// open({})=>传来空数组--说明要添加
// open({id；...})=>传来的带有信息--说明要编辑
// open调用后可以打开弹窗
const open=(row)=>{
    console.log(row);
    dialogVisible.value=true
    formModel.value={...row} //添加-重置了表单  编辑-存储表单数据回显
}
const formModel=ref({
  cate_name:'',
  cate_alias:''
})
const rules={
  cate_name:[
    {required:true,message:'请输入分类名称',trigger:'blur'},
    {pattern:/^\S{1,10}$/,message:'请输入1-10的非空字符',trigger:'blur'}
  ],
  cate_alias:[
    {required:true,message:'请输入分类别名',trigger:'blur'},
    {pattern:/^\S{1,10}$/,message:'请输入1-10的非空字符',trigger:'blur'}
  ]
}
const onSubmit=async()=>{
  // 预校验
  await formRef.value.validate()
  const isEdit=formModel.value.id
  if(isEdit){
    await artEditChannel(formModel.value)
    ElMessage .success('编辑成功')
  }else{
  await artAddChannel(formModel.value)
   ElMessage .success('添加成功')
  }
  dialogVisible.value=false
  // 通知父组件修改数据--子传父
 emit('success')
}
// 向外暴露
defineExpose({
    open
})
</script>
<template>
     <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ?'编辑分类':'添加分类'"
    width="500"
  >
  <el-form :model="formModel" :rules="rules" ref="formRef">
    <el-form-item label="分类名称" prop="cate_name">
      <el-input placeholder="请输入文章类型" v-model="formModel.cate_name"></el-input>
    </el-form-item>
    <el-form-item label="分类别名" prop="cate_alias">
      <el-input placeholder="请输入文章别名" v-model="formModel.cate_alias"></el-input>
    </el-form-item>
  </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>