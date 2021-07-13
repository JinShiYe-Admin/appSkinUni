<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell" @click="clickImg()">
				<view class="uni-list-cell-left" style="width: 80px;">
					头像
				</view>
				<view class="uni-list-cell-right">
					<image style="width: 35px;height: 35px;border-radius: 50%;margin-top: 5px;" :src="personInfo.img_url"></image>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					手机号
				</view>
				<view class="uni-list-cell-right">
					{{personInfo.peoplePhone}}
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					昵称
				</view>
				<view class="uni-list-cell-right">
					{{personInfo.user_name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import Qiniu from '../../commom/qiniu/qiniu.js';
	import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
			}
		},
		onLoad(option) {
			_this = this;
			uni.setNavigationBarTitle({title: '账号信息'});
			this.tabbar = util.getMenu();
			let tempInfo = util.getPersonal();
			console.log('tempInfo:' + JSON.stringify(this.tempInfo));
			if(this.isPoneAvailable(tempInfo.login_name)) {
				tempInfo.peoplePhone = tempInfo.login_name;
			}else{
				tempInfo.peoplePhone = '暂无手机号';
			}
			this.personInfo = tempInfo;
		},
		methods: {
			clickImg(){
				console.log('clickImgclickImg');
				uni.chooseImage({
					title:'12345678',
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    // sourceType: ['album'], //从相册选择
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
						console.log(JSON.stringify(res.tempFiles));
						var fileName = 'headimage111'  + '.png';
						var getToken = {
							type: '0', //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
							QNFileName: fileName, //str 必填 存放到七牛的文件名
							appId: _this.globaData.QN_APPID, //int 必填 项目id
							appKey: _this.globaData.QN_APPKEY,
							mainSpace: _this.QN_PB_NAME, //str 必填 私有空间或公有空间
							uploadSpace: 'headImg', //str 必填  上传的空间
						}
						console.log('getToken:'+JSON.stringify(getToken));
						getQNUpToken(_this.QNGETUPLOADTOKEN, getToken, data=> {
							var QNUptoken = data.data; //token数据
							var configure = data.configure; //获取token的配置信息
							console.log('七牛上传token:' + JSON.stringify(QNUptoken));
							if(QNUptoken.Status == 0) { //失败
								// mui.toast('获取上传凭证失败 ' + QNUptoken.Message);
								console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
								// wd.close();
							} else {
								cloudFileUtil.upload(fPath, QNUptoken.Data.Token, QNUptoken.Data.Key, function(upload, status) {
									//上传任务完成的监听
									console.log('上传任务完成:' + status);
									console.log('上传任务完成:' + JSON.stringify(upload));
									if(status == 200) { //上传任务成功
										//头像类型,个人头像0，资料头像1，群头像2
										var thumb = QNUptoken.Data.OtherKey[configure.thumbKey]; //缩略图地址
										var domain = QNUptoken.Data.Domain + QNUptoken.Data.Key; //文件地址
										console.log(thumb);
										console.log('domain:'+domain);
									} else { //上传失败
										// errorCallBack(upload.responseText);
										// wd.close();/
									}
								}, function(upload, status) {
									
								}, function(task) {
									//上传任务创建成功的回调
									task.start();
								});
							}
						});
				    }
				});
			},
			isPoneAvailable(str) {
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if(!myreg.test(str)) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
	var getQNUpToken = function(url, data, successCB, errorCB) {
		console.log('getQNUpToken ' + url + ' ' + JSON.stringify(data));
		var type = ''; //获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
		var QNFileName = ''; //存放到七牛的文件名
		var fileList = []; //上传文件的路径
		var desKey = ''; //项目名称
		var appId = 0; //项目id
		var mainSpace = ''; //文件存放在私有空间或公有空间
		var imageThumb = ''; //缩略图存放在私有空间或公有空间
		var saveSpace = ''; //上传的空间
		var configure = {}; //配置的数据
		var maxWidth = '200'; //type为0时 缩略图默认宽为200
		var maxHeight = '200'; //type为0时 缩略图默认高为200
	
		if(data) {
			if(data.type) {
				type = data.type
				if(type == 0 || type == 2) {
					if(data.style) {
						if(data.style.maxWidth) {
							maxWidth = data.style.maxWidth
						}
						if(data.style.maxHeight) {
							maxHeight = data.style.maxHeight
						}
					}
				}
				if(type == 2 || type == 3 || type == 4) {
					if(data.fileArray) {
						fileList = data.fileArray;
					}
				}
			}
			if(data.QNFileName) {
				QNFileName = data.QNFileName;
			}
			if(data.appId) {
				appId = data.appId;
				desKey = data.appKey;
			}
			if(data.mainSpace) {
				mainSpace = data.mainSpace;
			}
			if(data.imageThumb) {
				imageThumb = data.imageThumb;
			}
			if(imageThumb == '') {
				imageThumb = mainSpace;
			}
			if(data.uploadSpace) {
				saveSpace = data.uploadSpace;
			}
		}
	
		var thumbSpace = ''; //缩略图的七牛空间
		var ops = '' //七牛预持久化命令
		if(type == '0' || type == '1') {
			if(type == '0') {
				thumbSpace = saveSpace + 'Thumb/'; //缩略图的七牛空间
				var temp = QNFileName.split('.');
				//console.log(JSON.stringify(temp));
				var thumbName = temp[0];
				var thumbType = temp[1];
				if(thumbType == 'avi' || thumbType == 'mp4' || thumbType == 'flv' || thumbType == 'swf' || thumbType == '3gp' || thumbType == 'rm') {
					//视频
					configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					ops = "vframe/png/offset/1|saveas/" + configure.thumbKey;
				} else {
					//图片
					configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					ops = "imageView2/1/w/" + maxWidth + "/h/" + maxHeight + "/format/png|saveas/" + configure.thumbKey;
				}
			}
	
			var param = {
				Bucket: mainSpace,
				Key: saveSpace + QNFileName,
				Pops: ops,
				NotifyUrl: ''
			}
			//console.log("参数数据：" + JSON.stringify(param));
	
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(param))
			}
		} else if(type == '2') { //多个图片文件
			var params = [];
			configure.thumbKey = [];
			var uploadOptions = { //上传七牛后的处理参数
				type: 0, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
				thumbSize: {
					width: maxWidth, //缩略图最大宽度
					height: maxHeight //缩略图最大高度
				}
			}
			for(var i = 0; i < fileList.length; i++) {
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}
	
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		} else if(type == '3') { //多个视频文件
			var params = [];
			configure.thumbKey = [];
	
			for(var i = 0; i < fileList.length; i++) {
				var uploadOptions = { //上传七牛后的处理参数
					type: 2, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
					thumbSize: {
						width: fileList[i].width, //缩略图最大宽度
						height: fileList[i].height //缩略图最大高度
					}
				}
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].path.split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}
	
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		} else if(type == '4') { //多个音频文件
			var params = [];
			configure.thumbKey = [];
			for(var i = 0; i < fileList.length; i++) {
				var uploadOptions = { //上传七牛后的处理参数
					type: 3, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
				}
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].path.split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		}
		}
</script>

<style>
.uni-list-cell{
	height: 50px;
}
.uni-list-cell-right{
	margin-right: 20px;
	text-align: right;
}
</style>
