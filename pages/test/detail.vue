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
			const eventChannel = this.getOpenerEventChannel()
			console.log('url 传参',pageData);
			this.name=pageData.user_name
			setTimeout(()=>{
				//向父页面发送信息
				eventChannel.emit('test1', {data: 'test1'});
				eventChannel.emit('test2', {data: 'test2'});
			},2000)
		}
	}
</script>

<style>

</style>
