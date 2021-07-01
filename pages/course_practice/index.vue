<template>
	<view class="tabs">
		<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick"></uni-easyinput>
		<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick"></uni-easyinput>
		<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick"></uni-easyinput>
		<u-tabbar :list="tabbar" ></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return { 
				value:'',
				tabbar: []
			}
		},
		methods: {
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
