# 网易动漫 EGO项目

## 项目介绍
> Ego 项目是一个为动漫玩家使用的网站，本身有很多功能，这里主要做了五个功能模块，分别是首页、登录、注册、我的作品和创建作品，这里没有使用任何类库，只用JavaScript实现的，下面介绍一下用到的组件和功能点。

+ 首页：Tab导航栏组件、搜索框、明日之星关注、登录和注册
+ 作品列表页：分页组件、用户创建的作品列表、作品编辑/删除组件、根据用户信息(注册模块需要写入生日和地所在地)计算用户星座和城市 
+ 作品创建页：设置作品风格标签、作品分类、作品权限、上传作品(支持单个上传、批量上传以及拖拽上传)


> 备注：原本有一个后端接口提供数据支持，但是github上必须要https的链接，访问http接口会被block，查找资料添加了一个
`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`，但是网易这边又不给过，就先凑合看吧，如果想要完整的演示效果需要安装nei，访问[http://59.111.103.100/](http://59.111.103.100/)。

> 对于组件我打算再重新梳理一下，之前有的部分为了省事没有考虑到继承或者更优化的方法，所以尽量写的健壮、可复用一点。  [传送门](https://github.com/suminhohu/Component/)

## 实现的功能

### 首页 
   + 顶部tab
      + 有选中效果
      + hover动画效果
   + 顶部搜索
      + 输入非空进行搜索操作
      + 回车和点击图标都可进行搜索操作
   +  登录后顶部展示用户信息
      + 用户名很长…显示
      + hover出现下拉列表
      + 点击“退出登录”退出，跳转到首页
   + 轮播图
      + 图片垂直剧中
      + 图片5s切换（500ms淡入淡出）
      + 点击指示器定位到指定图片
      + hover上去轮播停止，hover退出轮播继续
      + 图片可以通过鼠标拖动切换
    + 明日之星
      + 通过Ajax获取推荐关注列表
      + 未登录时，点击关注，弹出登录弹窗
      + 已登录时，关注和取消关注功能可用
    + 侧边热门话题2行显示，文字太多直接截断

### 登录
  + 数据验证
       + 手机号非空，11位数字
       + 密码非空
       +  验证失败，相应输入框变红
   +  登录
       +  登录功能可用
       +  登录成功后，如果在首页，首页的明日之星列表需要刷新数据
       +  登录不成功，显示错误
    +  点击立即注册，关闭登录弹窗，弹出注册弹窗
    +  点击关闭图标，弹窗关闭
###  注册
   +  级联选择器可用
       +  地区数据正确
       +  生日数据，大小月30/31日，闰年2月29日数据正确
  +   验证码
      +  验证码显示正确
      +  点击验证码更新
  +   表单验证
      +  手机号非空，11位数字
      +  昵称中文英文数字均可，至少8个字符
      +  密码长度6-16位字符
      +  验证失败，相应输入框变红
   +  注册
      +  注册功能可用
      +  注册成功关闭注册弹窗，打开登录弹窗
      +  注册不成功，显示错误

### 我的作品
   +   年龄、星座、城市名计算正确
   +  作品列表加载正常，加载列表期间要显示loading图标，没有作品时有文案提示
   +  分页功能正常可用

### 上传作品
   +  表单元素行为正常：
       +  作品分类按钮组状态互斥
       +  权限设置按钮组状态互斥
       +  作品授权的模拟下拉菜单
   +  图片上传功能可用：
       +  实现上传图片本地预览
       +  图片可以批量上传
       +  上传过程中可以添加新图片、取消未上传完成的旧图片
       +  每张图片上传过程中均有进度条
       +  单张图片的大小小于1MB
       +  每次最多选择10张图片，超过10张要有弹窗提示
       +  设置封面功能正常
   +  标签组件功能可用：
       +  加载系统推荐标签
       +  标签可删除
       +  标签可添加
   +  表单可正常提交
       +  不丢失任何数据信息
       +  提交前需要检查作品名称是否为空


## 预览效果

+ 首页：[https://suminhohu.github.io/ego/html/index.html](https://suminhohu.github.io/ego/html/index.html)
+ 作品列表页：[https://suminhohu.github.io/ego/html/works/myworks.html](https://suminhohu.github.io/ego/html/works/myworks.html)
+ 上传作品页：[https://suminhohu.github.io/ego/html/works/upload.html](https://suminhohu.github.io/ego/html/works/upload.html)


> 这里访问的时候有些地方就看不了，所以我也截图存放在'showImg'文件夹中，方便对比。如果你想看完整的交互你可以安装nei服务，具体步骤如下：

1. 通过npm安装nei，命令为 `npm install nei -g`
2. 然后在你的目录下创建ego项目，命令为 `nei build -k e389c52125abdd607c4455e4d448e5d3 -o ./ego`
3. 将源码放进public文件夹即可，修改server.config.js，然后启动nei，`nei server`



