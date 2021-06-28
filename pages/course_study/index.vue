<template>
	<view class="tabs">
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		 <view class="line-h"></view>
		 <swiper disable-touch="true" :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
		     <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">
		 		<scroll-view class="scroll-v list" enableBackToTop="true" scroll-y @scrolltolower="loadMore(index1)">
		 			<view v-for="(newsitem,index2) in tab.data" :key="newsitem.id">
						<template v-for="item in 30">
							<div>aaaaaaaaaa</div>
						</template>
		 			</view>
		 			<view class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
		 				<text class="loading-more-text">{{tab.loadingText}}</text>
		 			</view>
		 		</scroll-view>
		     </swiper-item>
		 </swiper>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal=util.getPersonal();
	const menuList=util.getMenu();
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	
	const newsData = {
	    data0: {
	        "datetime": "40分钟前",
	        "article_type": 0,
	        "title": "uni-app行业峰会频频亮相，开发者反响热烈!",
	        "source": "DCloud",
	        "comment_count": 639
	    },
	    data1: {
	        "datetime": "一天前",
	        "article_type": 1,
	        "title": "DCloud完成B2轮融资，uni-app震撼发布!",
	        "image_url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg",
	        "source": "DCloud",
	        "comment_count": 11395
	    },
	    data2: {
	        "datetime": "一天前",
	        "article_type": 2,
	        "title": "中国技术界小奇迹：HBuilder开发者突破200万",
	        "image_url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b4cd3000-517d-11eb-a16f-5b3e54966275.jpg",
	        "source": "DCloud",
	        "comment_count": 11395
	    },
	    data3: {
	        "article_type": 3,
	        "image_list": [{
	            "url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b2e201d0-517d-11eb-8a36-ebb87efcf8c0.jpg",
	            "width": 563,
	            "height": 316
	        }, {
	            "url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b4cd3000-517d-11eb-a16f-5b3e54966275.jpg",
	            "width": 641,
	            "height": 360
	        }, {
	            "url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg",
	            "width": 640,
	            "height": 360
	        }],
	        "datetime": "5分钟前",
	        "title": "uni-app 支持使用 npm 安装第三方包，生态更趋丰富",
	        "source": "DCloud",
	        "comment_count": 11
	    },
	    data4: {
	        "datetime": "2小时前",
	        "article_type": 4,
	        "title": "uni-app 支持原生小程序自定义组件，更开放、更自由",
	        "image_url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b2e201d0-517d-11eb-8a36-ebb87efcf8c0.jpg",
	        "source": "DCloud",
	        "comment_count": 69
	    }
	};
	
	export default {
		data() {
			return {
				newsList: [],
				cacheTab: [],
				tabIndex: 0,
				tabBars: [{
				    name: '关注',
				    id: 'guanzhu'
				}, {
				    name: '推荐',
				    id: 'tuijian'
				}, {
				    name: '体育',
				    id: 'tiyu'
				}, {
				    name: '热点',
				    id: 'redian'
				}, {
				    name: '财经',
				    id: 'caijing'
				}, {
				    name: '娱乐',
				    id: 'yule'
				}, {
				    name: '军事',
				    id: 'junshi'
				}, {
				    name: '历史',
				    id: 'lishi'
				}, {
				    name: '本地',
				    id: 'bendi'
				}],
				scrollInto: "",
			}
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
			    this.switchTab(index);
			},
			switchTab(index) {
			    if (this.newsList[index].data.length === 0) {
			        this.getList(index);
			    }
			    if (this.tabIndex === index) {
			        return;
			    }
			    // 缓存 tabId
			    if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
			        let isExist = this.cacheTab.indexOf(this.tabIndex);
			        if (isExist < 0) {
			            this.cacheTab.push(this.tabIndex);
			            //console.log("cache index:: " + this.tabIndex);
			        }
			    }
			    this.tabIndex = index;
			    this.scrollInto = this.tabBars[index].id;
			    if (this.cacheTab.length > MAX_CACHE_PAGE) {
			        let cacheIndex = this.cacheTab[0];
			        this.clearTabData(cacheIndex);
			        this.cacheTab.splice(0, 1);
			    }
			},
			ontabchange(e) {
			    let index = e.target.current || e.detail.current;
			    this.switchTab(index);
			},
			getTabList(){//获取tab栏列表
				// this.showLoading();
				console.log("personal: " + JSON.stringify(personal));
				console.log("menuList: " + JSON.stringify(menuList));
				let comData={
					stu_code:personal.user_code,
					index_code:"CourseStudy:Index",
				}
				this.request.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,response=>{
						console.log("response: " + JSON.stringify(response));
				})
			},
			getList(index) {//
			    let activeTab = this.newsList[index];
			    let list = [];
			    for (let i = 1; i <= 10; i++) {
			        let item = Object.assign({}, newsData['data' + Math.floor(Math.random() * 5)]);
			        item.id = this.newGuid();
			        list.push(item);
			    }
			    activeTab.data = activeTab.data.concat(list);
			},
		},
		onLoad:function(){
			setTimeout(()=>{
			  // this.tabBars.forEach((tabBar) => {
			  //     this.newsList.push({
			  //         data: [],
			  //         isLoading: false,
			  //         refreshText: "",
			  //         loadingText: '加载更多...'
			  //     });
			  // });
			  // this.getList(0);
			  this.getTabList();
			},350)
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
	}
</script>

<style>
   /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */

    .tabs {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        height: 100vh;
        /* #endif */
    }

    .scroll-h {
        width: 750rpx;
		/* #ifdef H5 */
		width:100%;
		/* #endif */
		height: 80rpx;
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
        /* flex-wrap: nowrap; */
        /* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
    }

    .line-h {
        height: 1rpx;
        background-color: #cccccc;
    }

    .uni-tab-item {
        /* #ifndef APP-PLUS */
        display: inline-block;
        /* #endif */
        flex-wrap: nowrap;
        padding-left: 34rpx;
        padding-right: 34rpx;
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
    }

    .uni-tab-item-title-active {
        color: #007AFF;
    }

    .swiper-box {
        flex: 1;
    }

    .swiper-item {
        flex: 1;
        flex-direction: row;
    }

    .scroll-v {
        flex: 1;
        /* #ifndef MP-ALIPAY */
        flex-direction: column;
        /* #endif */
        width: 750rpx;
		width:100%;
    }

    .update-tips {
        position: absolute;
        left: 0;
        top: 41px;
        right: 0;
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #FDDD9B;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .update-tips-text {
        font-size: 14px;
        color: #ffffff;
    }

    .refresh {
        width: 750rpx;
		width:100%;
        height: 64px;
        justify-content: center;
    }

    .refresh-view {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
    }

	.refresh-icon {
		width: 30px;
		height: 30px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		color: #999999;
	}

    .loading-text {
        margin-left: 2px;
        font-size: 16px;
        color: #999999;
    }

    .loading-more {
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
    }

    .loading-more-text {
        font-size: 28rpx;
        color: #999;
    }
</style>
