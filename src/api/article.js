import request from '@/utils/request'
import { da } from 'element-plus/es/locales.mjs'
// 获取文章分类
export const artGetChannels=()=>request.get('/my/cate/list')
// 添加文章分类
export const artAddChannel=(data)=>request.post('/my/cate/add',data)
// 更新文章分类
export const artEditChannel=(data)=>request.put('/my/cate/info',data)
// 删除文章分类
export const artDelChannel=(id)=>request.delete('/my/cate/del',{
    params:{id}
})

// 获取文章列表
export const artGetList=(params)=>request.get('/my/article/list',{
    params
})
// 添加文章接口
export const artPublishService = (data) =>
  request.post('/my/article/add', data)
// 编辑文章接口
export const artGetDetailService = (id) =>
  request.get('my/article/info', { params: { id } })
// 提交文章
export const artEditService = (data) => request.put('my/article/info', data)
// 删除文章
export const artDelService = (id) => request.delete('my/article/info', { params: { id } })