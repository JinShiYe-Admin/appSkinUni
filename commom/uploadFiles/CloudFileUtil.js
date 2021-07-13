

	/**
	 * 获取多个上传token
	 * @param {Object} data
	 * @param {Object} callBack
	 */
	var getUpLoadTokens = function(data, callBack) {
//		console.log("getUpLoadTokens " + JSON.stringify(data));
		var appId = data.appId; //项目id
		var desKey = data.appKey; //项目名称
		var configure = {}; //配置的数据
		var params = []; //配置的参数信息

		if(data.type == "2" || data.type == "3") { //视频||音频
			configure.thumbKey = [];
		}
//		for(var i in data.fileArray) {
		for (var i = 0; i < data.fileArray.length; i++) {
			var filePaths = data.fileArray[i].split("/");
			var QNFileName = filePaths[filePaths.length - 1];
			var param = {
				Bucket: data.mainSpace,
				Key: data.uploadSpace + QNFileName,
				Pops: "",
				NotifyUrl: ""
			}
			switch(data.type) {
				case "0": //上传多个原文件
					break;
				case "2": //视频
					var uploadOptions = {
						type: 2
					}
					var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
					param.Pops = opsData.ops;
					configure.thumbKey.push(opsData.thumbKey);
					break;
				case "3": //音频
					var uploadOptions = {
						type: 3
					}
					var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
					param.Pops = opsData.ops;
					configure.thumbKey.push(opsData.thumbKey);
					break;
				default:
					break;
			}

//			console.log("参数数据 param " + JSON.stringify(param));
			params.push(param);
		}
		configure.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}

		// console.log("参数数据：" + JSON.stringify(configure.options))
		//获取token
		getQNUpTokenWithManage(this.globaData.QNGETUPLOADTOKEN, configure.options, function(data) {
			callBack({
				code: data.Status, //1成功
				configure: configure, //配置信息
				data: data, //回调信息
				message: data.Message //回调说明
			})
		}, function(xhr, type, errorThrown) {
			callBack({
				code: 0,
				message: type
			});
		});
	}

	/**
	 * 获取上传到七牛的uptoken（单/多个文件的uptoken）
	 * 使用到的地方：1.个人头像2.资料头像3.群头像4.上传到云存储5.记事
	 * @author 莫尚霖
	 * @param {Object} url 获取token的url
	 * @param {Object} data 数据 json
	 * @param {Object} successCB 成功的回调successCB(data)
	 * @param {Object} errorCB 失败的回调errorCB(xhr, type, errorThrown);
	 * data={
	 * 	type:'',//str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件；2上传需要生成缩略图的多个文件;3上传需要生成缩略图的多个视频文件；4上传多个音频文件
	 *  QNFileName:'',//str 必填 存放到七牛的文件名
	 * 	fileArray:[],//array 选填  type为2时有效，多个文件的路径
	 *  appId:'' , //int 必填 项目id
	 *  mainSpace:'', //str 必填 文件存放在私有空间或公有空间
	 *  uploadSpace: '',//str 必填  上传的空间（文件二级文件名）
	 *  imageThumb:'',//str json 选填 type为0时有效，缩略图存放在私有空间或公有空间，默认mainSpace
	 *  style:{ 	//json 选填 type为0，2时有效，配置生成缩略图的最大宽和高
	 * 		maxWidth:'', //int 选填 配置生成缩略图的最大宽,默认200
	 *  	maxHeight:'' //int 选填 配置生成缩略图的最大高，默认200
	 *  }
	 * }
	 */
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

//		console.log("参数数据：" + JSON.stringify(configure.options))
		//获取token
		getQNUpTokenWithManage(url, configure.options, function(data) {
			successCB({
				configure: configure,
				data: data
			});
		}, function(xhr, type, errorThrown) {
			errorCB(xhr, type, errorThrown);
		});

	}
	/**
	 *获取参数
	 * @param {Object} manageOptions 处理参数
	 * @param {String} saveSpace 保存空间
	 * @param {String} mainSpace 主空间
	 * @param {String} QNFileName 文件名
	 */
	var getOptions = function(manageOptions, saveSpace, mainSpace, QNFileName) {
		var returnData = {};
		switch(manageOptions.type) {
			case 0: //缩略图
				var thumbSpace = saveSpace + 'thumb/';
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
				returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize.height + "/format/png|saveas/" + returnData.thumbKey;
				break;
			case 1: //裁剪
				var clipSpace = saveSpace + 'clip/';
				returnData.clipKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
				returnData.ops = "imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" + getIfExist(manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
				break;
			case 2: //视频
				var thumbSpace = saveSpace + 'thumb/';
				var tempFileName = QNFileName.split('.');
				var thumbName = tempFileName[0];
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.png');
				returnData.ops = "vframe/png/offset/1|saveas/" + returnData.thumbKey;
				break;
			case 3: //音频，转格式
				var thumbSpace = saveSpace + 'thumb/';
				var tempFileName = QNFileName.split('.');
				var thumbName = tempFileName[0];
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.mp3');
				returnData.ops = "avthumb/mp3/acodec/libmp3lame" + "|saveas/" + returnData.thumbKey;
				//console.log('3 ' + returnData.ops);
				break;
			case 10: //缩略图+裁剪
				var thumbSpace = saveSpace + 'thumb/';
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
				var clipSpace = saveSpace + 'clip/';
				returnData.clipKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
				returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize.height + "/format/png|saveas/" + returnData.thumbKey +
					";imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" + getIfExist(manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
				break;
			default:
				break;
		}
		return returnData;
	}
	var getIfExist = function(option) {
		return option ? option : '';
	}

	/**
	 * 获取上传的token
	 * @author 安琪
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 */
	var getQNUpTokenWithManage = function(url, data, successCB, errorCB) {
//		console.log('url:'+url);
//		console.log('data:'+data);
		uni.request(url, {
			async: false,
			data: data, //请求参数
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 60000, //超时时间设置为60秒
			success: function(data) {
				//服务器返回响应
				successCB(data);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理
				errorCB(xhr, type, errorThrown);
			}
		});
	}

	/**
	 * 创建上传任务
	 * @author 莫尚霖
	 * @param {Object} fPath 文件路径
	 * @param {Object} token 七牛上传token
	 * @param {Object} key 七牛上传key
	 * @param {Object} uploadCompletedCallBack 上传完成时的回调
	 * @param {Object} onStateChangedCallBack 上传任务状态监听的回调
	 * @param {Object} successCallBack 上传任务创建成功监听的回调
	 */
	var upload = function(fPath, token, key, uploadCompletedCallBack, onStateChangedCallBack, successCallBack) {
		// console.log('upload fPath: ' + fPath);
		// console.log('upload token: ' + token);
		// console.log('upload key: ' + key);
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				uploadCompletedCallBack(upload, status);
			}
		);
		task.addData("key", key);
		task.addData("token", token);
		task.addFile(fPath, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged",
			/**
			 * 上传状态变化的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				onStateChangedCallBack(upload, status);
			}, false);
		// console.log('upload2:' + fPath + '|' + type + "|" + QNUptoken);
		successCallBack(task);
		//task.start();
	}

	/**
	 * 单个文件上传
	 * @anthor an
	 * @param {Object} tokenInfo
	 * @param {String} fileName
	 * @param {Function} callback
	 */
	var uploadFile = function(tokenInfo, fileName, callback) {
		////console.log('upload:' + fPath);
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				callback(upload, status);
			}
		);

		task.addData("key", tokenInfo.Key);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", tokenInfo.Token);
		task.addFile(fileName, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
		task.start();
	}

	/**
	 * 多张图片上传
	 * @author an
	 * @param {Array} fileNames 本地路径
	 * @param {Object} QNUptokens 上传token
	 * @param {Function} callback 回调函数
	 */
	var uploadFiles = function(fileNames, tokenInfos, callback) {
		plus.uploader.clear();

		for(var i in tokenInfos) {
			////console.log('upload:' + fPath);
			createTask(tokenInfos[i], fileNames[i], i, callback);
		}
		plus.uploader.startAll();
	}

	function createTask(tokenInfo, fileName, index, callback) {
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				callback(upload, status, index);
			}
		);
		task.addData("key", tokenInfo.Key);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", tokenInfo.Token);
		task.addFile(fileName, {
			"key": 'file',
			"name": "file"
		});

		//上传状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
	}
	// 监听上传任务状态
	function onStateChanged(upload, status) {
		if(upload.state == 4 && status == 200) {
			// 上传完成
			//			//console.log("Upload success: " + upload.getFileName());
		}
	}

	// module.exports = {
	//     cloudFileUtil
	// }