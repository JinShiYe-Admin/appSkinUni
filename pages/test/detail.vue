<template>
	<view>
		<p>你好：{{name}}</p>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				name:''
			}
		},
		methods: {
			
		},
		onLoad:function(option){
			//Url传参
			const that =this
			const pageData=util.getPageDataFromUrl(option)
			console.log('url 传参',pageData);
			this.name=pageData.user_name
			
			
			//非Url传参
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('pagedata', function(data) {
			     console.log('页面传参',JSON.stringify(data))
				 that.name=data.tec_name
			})
			
			//向父页面发送信息
			eventChannel.emit('test1', {data: 'test1'});
			eventChannel.emit('test2', {data: 'test2'});
		}
	}
</script>

<style>

</style>
