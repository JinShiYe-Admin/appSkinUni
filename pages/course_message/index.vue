<template>
	<view>
		<mynavBar :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfdb" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<uni-card title="标题文字" isShadow @click="clickCard"><text class="content-box-text">1这是一个基础卡片示例，内容比较多，内容样式可自定义，卡片视图常用来显示完整独立的一段信息，比如一篇文章的预览图、作者信息、时间等，此示例带边框阴影。</text></uni-card>
			</view>
			<view v-if="current === 1">
				<uni-card title="标题文字" isShadow @click="clickCard"><text class="content-box-text">2这是一个基础卡片示例，内容比较多，内容样式可自定义，卡片视图常用来显示完整独立的一段信息，比如一篇文章的预览图、作者信息、时间等，此示例带边框阴影。</text></uni-card>
			</view>
			<view v-if="current === 2">
				<uni-card title="标题文字" isShadow @click="clickCard"><text class="content-box-text">3这是一个基础卡片示例，内容比较多，内容样式可自定义，卡片视图常用来显示完整独立的一段信息，比如一篇文章的预览图、作者信息、时间等，此示例带边框阴影。</text></uni-card>
			</view>
		</view>
		
		
		<u-tabbar :list="tabbar"></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				items: ['最新消息', '通知公告', '系统推送'],
				current: 0,
				personInfo: {},
				tabbar: [],
				tabBarItem: {}
			}
		},
		components: {
			mynavBar
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
		},
		onLoad(option) {
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			let tempMenu;
			if (util.getMenuMore().length == 0) {
				tempMenu = util.getTabbarMenu();
			} else {
				tempMenu = util.getPageData(option);
			}
			this.tabBarItem = tempMenu;
			console.log('tempMenu:' + JSON.stringify(tempMenu));
			this.getPermissionByPosition("add,delete",tempMenu.access.split("#")[1],response=>{
			})
			
		}
	}
</script>

<style>
	.content-box-text {
		font-size: 13px;
		line-height: 22px;
	}
</style>
