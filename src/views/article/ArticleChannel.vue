<script setup>
import { artDelChannel, artGetChannels } from '@/api/article';
import { Delete, Edit } from '@element-plus/icons-vue';
import {ref} from 'vue'
import channelEdit from './components/channelEdit.vue';
import {ElMessageBox, ElMessage} from 'element-plus' 
const channelList=ref([])
const loading=ref(false)
const dialog=ref()
const getChannelList=async()=>{
loading.value=true
  const res=await artGetChannels()
  channelList.value=res.data.data
  loading.value=false
  
}
getChannelList()
const onEditChannel=(row)=>{
  dialog.value.open(row)
}
const onAddChannel=()=>{
  dialog.value.open({})
}
const onDelChannel=async(row)=>{
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannel(row.id)
  ElMessage.success('删除成功')
  getChannelList()

}
const onSuccess=()=>{
  getChannelList()
}

</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel()" type="primary"> 添加分类 </el-button>
    </template>
<el-table v-loading="loading" :data="channelList" style="width: 100%;">
  <el-table-column type="index" label="序号" width="180"></el-table-column>
  <el-table-column prop="cate_name" label="分类名称"></el-table-column>
  <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
  <el-table-column label="操作" width="180">
    <template #default="{row,$index}">
      <el-button :icon="Edit" circle type="primary" @click="onEditChannel(row,$index)"></el-button>
      <el-button :icon="Delete" circle type="danger" @click="onDelChannel(row,$index)"></el-button>
    </template>
  </el-table-column>
</el-table>
<channelEdit ref="dialog" @success="onSuccess"></channelEdit>
  </page-container>
</template>