<!-- 
打包说明
1、按需修改mainfest.json 里的版本号
3、修改main.js 文件的以下内容：
	EnvKey
 -->

#### 页面方法
```javascript
//showLoading  hideLoading  showToast
this.showLoading(title:String = "加载中...");
this.showToast(title:String = "")
this.hideLoading();

//时间格式化
this.moment().format('YYYY-MM-DD HH:mm:sss')

//获取全局公共参数
const globaData = this.globaData

//获取登录用户信息
const personal =util.getPersonal();

//获取tabbar
this.tabbar = util.getMenu();

//获取当前tab的菜单参数，主要是获取index_code
let tempMenu;
if (util.getMenuMore().length==0) {
	tempMenu = util.getTabbarMenu();
} else{
	tempMenu = util.getPageData(option);
}

//页面跳转
util.openwithData(pageUrl,data,{
	refresh(data){//子页面调用父页面需要的方法
		console.log(data)
	}
})

//子页面给父页面传值
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('refresh', {data: 'test'});

//子页面获取父页面传入的data数据
onLoad: function(option) {
	const itemData = util.getPageData(option);
	console.log(itemData)
},

/**
 * post 请求
 * 注：responseData 为返回的对象 {"msg":"成功","code":"0000","data":{},"state":"ok"} data一层里面的内容
 * 如果想获取data外层整个返回参数，请使用response
 */

let comData={
	stu_code:personal.user_code,
	index_code:this.index_code,
}
this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,(responseData,response)=>{
	console.log(response)
},error=>{
	console.log(error)
})

//获取按钮权限
this.getPermissionByPosition("add,delete",tempMenu.access.split("#")[1],response=>{
	console.log("response: ",response);
})

//获取Vue 环境变量
process.env.NODE_ENV  "development":"production"
```

#### 模块说明
包名|说明|App|Api|流程
-|-|-|-|-
course_practice|课程练习|Liu|Meng(广西)|开发
course_study|课程学习|Liu|Meng(广西)|开发
course_examination|考试|Liu|Meng(广西)|开发