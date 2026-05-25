import request from '@/utils/request'
// 注册接口
export const userRegisterSerive = (data) => {
    return request.post('/api/reg', {
        username: data.username,
        password: data.password,
        repassword: data.repassword
    })
}
// 登录接口
export const userLoginSerive=(data)=>{
    return request.post('/api/login',{
        username:data.username,
        password:data.password
    })
}
// 获取用户信息
export const userUserInfo=()=>{return request.get('/my/userinfo')}
// 更新用户信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })
// 上传头像
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })
// 更新密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })