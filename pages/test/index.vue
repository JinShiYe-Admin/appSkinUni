<template>
	<view class="content">
		<!-- <image class="logo" src="/static/uview/common/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view> -->
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbar: ''
			}
		},
		onLoad() {
			this.tabbar = util.getMenu();
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

<!-- <template>
	<view class="content">
		<view class="u-page">
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						iconPath: "../../static/logo.png",
						selectedIconPath: "../../static/logo.png",
						text: 'tab1',
						count: 2,
						isDot: true,
						customIcon: false,
						pagePath: 'pages/test/tab1'
					},
					{
						iconPath: "../../static/logo.png",
						selectedIconPath: "../../static/logo.png",
						text: '更多',
						customIcon: false,
						pagePath: '/pages/more/index'
					},
					{
						iconPath: "../../static/logo.png",
						selectedIconPath: "../../static/logo.png",
						text: 'tab5',
						customIcon: false,
						pagePath: '/pages/test/tab5'
					},
					{
						iconPath: "../../static/logo.png",
						selectedIconPath: "../../static/logo.png",
						text: 'tab3',
						customIcon: false,
						pagePath: '/pages/test/tab3'
					},
				],
				current: 0
			}
		},
	}
</script> -->