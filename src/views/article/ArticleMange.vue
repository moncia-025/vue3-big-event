<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import channelSelect from './components/channelSelect.vue'
import { artGetList } from '@/api/article'
import { formatTime } from '@/utils/format'
import articleEdit from './components/articleEdit.vue'
import {artDelService} from '@/api/article'
import {ElMessageBox, ElMessage} from 'element-plus'
// 假数据
const articleList = ref([
])//文章列表
const total=ref(0)//默认总条数
// 定义请求参数
const params=ref({
  pagenum:1,
  pagesize:5,
  cate_id:'',
  state:''
})
const articleEditRef = ref()

// 编辑新增逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 基于params获取文章列表
const getList=async()=>{
  const res=await artGetList(params.value)
  articleList.value=res.data.data
  total.value=res.data.total
}
getList()

// 分页逻辑
const handleCurrentChange=(page)=>{
 params.value.pagenum = page
  getList()
}
const handleSizeChange=(size)=>{
  params.value.pagenum = 1
  params.value.pagesize = size
  getList()
}
// 搜索逻辑
const onSearch=()=>{
  params.value.pagenum=1//重置页面
  getList()

}
// 重置逻辑
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getList()
}
const onEditArticle = (row) => {
 articleEditRef.value.open(row)
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getList()
}
// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getList()
}
</script> 
 
 <template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
<!-- 表单区域 -->
  <el-form inline>
  <el-form-item label="文章分类：">
    <channelSelect v-model="params.cate_id"></channelSelect>
   </el-form-item>
  <el-form-item label="发布状态：">
    <el-select v-model="params.state" style="width: 150px;">
      <el-option label="已发布" value="已发布"></el-option>
      <el-option label="草稿" value="草稿"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button @click="onSearch" type="primary">搜索</el-button>
    <el-button @click="onReset">重置</el-button>
  </el-form-item>
</el-form>
<!-- 表格区域 -->
 <el-table :data="articleList">
  <el-table-column label="文章标题" prop="title">
   <template #default="{ row }">
      <el-link type="primary" :underline="false">{{ row.title }}</el-link>
    </template>
  </el-table-column>
  <el-table-column label="分类" prop="cate_name"></el-table-column>
  <el-table-column label="发表时间" prop="pub_date"> 
    <template #default="{row}">
      {{ formatTime(row.pub_date) }}

    </template>
  </el-table-column>
  <el-table-column label="状态" prop="state"></el-table-column>
  <el-table-column label="操作" width="100">
    <template #default="{ row }">
      <el-button
        :icon="Edit"
        circle
        plain
        type="primary"
        @click="onEditArticle(row)"
      ></el-button>
      <el-button
        :icon="Delete"
        circle
        plain
        type="danger"
        @click="onDeleteArticle(row)"
      ></el-button>
    </template>
  </el-table-column>
 </el-table>
 <!-- 分页区域 -->
   <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 4, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next, "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end;"
    />
    <!-- 抽屉区域 -->
   <article-edit ref="articleEditRef" @Success="onSuccess"></article-edit>
  </page-container>
</template>