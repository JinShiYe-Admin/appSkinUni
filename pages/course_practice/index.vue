<template>
	<view class="tabs">
		<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled v-model="termValue" placeholder="学期" @iconClick="termClick" @onInputClick="termClick"></uni-easyinput>
		<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled v-model="courseValue" placeholder="课程" @iconClick="courseClick" @onInputClick="courseClick"></uni-easyinput>
		<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled v-model="statusValue" placeholder="状态" @iconClick="statusClick" @onInputClick="statusClick"></uni-easyinput>
		<u-tabbar :list="tabbar" ></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return { 
				tabbar: [],
				termValue:'',
				courseValue:'',
				statusValue:'',
				styles: {borderColor:'rgba(204,198,204,0.4)',borderRadius: '10px',margin: '0 1px 0'}
			}
		},
		methods: {
			termClick:function(){
				console.log(123);
			},
			courseClick:function(){
				console.log(123);
			},
			statusClick:function(){
				console.log(123);
			}
		},
		onLoad() {
			this.tabbar = util.getMenu();
		}
	}
</script>

<style>
	page {
	    width: 100%;
	    min-height: 100%;
	    display: flex;
		flex-direction: column;
		background-color: #EEF0F2;
	}
	.tabs {
	    display: flex;
	    flex-direction: row;
	    overflow: hidden;
	    background-color: #FFFFFF;
		padding: 3px;
	}
	.flex-box{
		 flex: 1;
	}
</style>
