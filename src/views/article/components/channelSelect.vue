<script setup>
import { artGetChannels } from '@/api/article';
import { ref } from 'vue';
const channelList=ref([])
const getChannelList=async()=>{
    const res=await artGetChannels()
    channelList.value=res.data.data
}
getChannelList()
defineProps({
    modelValue:{
    type:[String,Number]
    }
})
const emit=defineEmits(['update:modelValue'])
</script>
<template>
     <el-select :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
     style="width: 150px;">
      <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
    </el-select>
  
</template>