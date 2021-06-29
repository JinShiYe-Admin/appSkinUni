<template>
	<view class="tabs">
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<view class="line-h"></view>
		<uni-row class="demo-uni-row">
		    <uni-col :xs="12" :sm="12" :md="6" :lg="4" :xl="4" v-for="item in dataList">
		       <uni-card mode="style" :is-shadow="true" :thumbnail="item.book_img_url" @click="toDetail(item)">
					<text class="text">{{ item.sub_name }}</text>
		       </uni-card>
		    </uni-col>
		</uni-row>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal=util.getPersonal();
	const menuList=util.getMenu();
	export default {
		data() {
			return {
				dataList: [],
				cacheTab: [],
				tabIndex: 0,
				tabBars: [],
				scrollInto: "",
			}
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.showLoading();
				this.getList(index,this.tabBars[index].id)
				this.tabIndex=index
			},
			getTabList(){//获取tab栏列表 2.1学期列表
				let comData={
					stu_code:personal.user_code,
					index_code:"CourseStudy:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,response=>{
						if(response.list&&response.list.length>0){
							response.list.map(item=>{
								item.name=item.grd_name+item.term_name
								item.id=item.sys_grd_code+'_'+item.term_code
							})
							this.tabBars=response.list
							this.getList(0,response.list[0].id)
						}
				})
			},
			getList(index,id) {//2.2课程列表
			   let comData={
			    sys_grd_code:id.split("_")[0],
			    term_code:id.split("_")[1],
			   	stu_code:personal.user_code,
			   	index_code:"CourseStudy:Index",
			   }
			   this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/list',comData,response=>{
					this.dataList=response.list
				    this.hideLoading()
			   })
			},
			toDetail(item){
				util.openwithData('./detail',item,{
					callParent:data=>{
						console.log("data: " + JSON.stringify(data));
					}
				})
			}
		},
		onLoad:function(){
			setTimeout(()=>{
				this.showLoading();
				this.getTabList();
			},350)
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
 
	 
	 .example {
	 	padding: 0 15px 15px;
	 }
	 
	 .example-info {
	 	padding: 15px;
	 	color: #3b4144;
	 	background: #ffffff;
	 }
	 
	 .text {
	 	font-size: 26rpx;
	 	margin-top: 10rpx;
	 }
	 
	 .grid-dynamic-box {
	 	margin-bottom: 15px;
	 }
	 
	 .grid-item-box {
	 	flex: 1;
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: column;
	 	align-items: center;
	 	justify-content: center;
	 	padding: 15px 0;
	 }
	 
	 .grid-dot {
	 	position: absolute;
	 	top: 5px;
	 	right: 15px;
	 }
</style>
