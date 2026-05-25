<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService ,artEditService} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
const emit = defineEmits(['success'])

// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}

// 准备数据
const formModel = ref({ ...defaultForm })
const imgUrl = ref('')
const editorRef = ref()
const formRef = ref()

// ✅ 修正：函数名改为 onSelect
const onSelect = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

// 将网络图片地址转换为 File 对象（保留一个就够了）
const imageUrlToFile = async (url, fileName) => {
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer' 
    })
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
    })
    const file = new File([blob], fileName, { type: blob.type })
    return file
  } catch (error) {
    console.error('图片转换失败:', error)
    throw error
  }
}

// 打开抽屉（父组件调用）
const open = async (row) => {
  visibleDrawer.value = true
  
  if (row && row.id) {
    console.log('编辑回显')
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    
    // 图片回显
    if (formModel.value.cover_img) {
      const fullImageUrl = baseURL + formModel.value.cover_img
      imgUrl.value = fullImageUrl
      
      // 将网络图片转成 file 对象，供提交时使用
      try {
        formModel.value.cover_img = await imageUrlToFile(fullImageUrl, formModel.value.cover_img)
      } catch (error) {
        console.error('图片转换失败，将使用原路径:', error)
        // 转换失败时保持原路径
      }
    }
    
    // 设置富文本内容
    if (editorRef.value && formModel.value.content) {
      editorRef.value.setHTML(formModel.value.content)
    }
    
  } else {
    console.log('添加功能')
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    if (editorRef.value) {
      editorRef.value.setHTML('')
    }
  }
}

// 发布/草稿
const onPublish = async (state) => {
  formModel.value.state = state
  
  const fd = new FormData()
  for (let key in formModel.value) {
    let value = formModel.value[key]
    // 跳过空值
    if (value !== null && value !== undefined && value !== '') {
      fd.append(key, value)
    }
  }
  
  if (formModel.value.id) {
     await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加模式
    try {
      await artPublishService(fd)
      ElMessage.success('添加成功')
      visibleDrawer.value = false
      emit('success', 'add')
    } catch (error) {
      ElMessage.error('添加失败')
      console.error(error)
    }
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%" />
      </el-form-item>
      
      <el-form-item label="文章封面" prop="cover_img">
        <!-- ✅ 修正：onSelect 不是 onSeclect -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelect"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          />
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep(.avatar) {
    width: 178px;
    height: 178px;
    display: block;
  }
  
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  
  :deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}

.editor {
  width: 100%;
  
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>