<template>
	<view>
		<view class="tabs">
			<picker class="flex-box" @change="termClick" :value="tremIndex" :range="tremArray" range-key="name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="tremArray[tremIndex].name" ></uni-easyinput>
			</picker>
			<picker class="flex-box" @change="courseClick" :value="subIndex" :range="subArray" range-key="sub_name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="subArray[subIndex].sub_name" ></uni-easyinput>
			</picker>
			<picker class="flex-box" @change="statusClick" :value="statusIndex" :range="statusArray" range-key="name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="statusArray[statusIndex].name" ></uni-easyinput>
			</picker>
			<!-- <u-tabbar :list="tabbar" ></u-tabbar> -->
		</view>
		<view class="content-body">
		<template v-for="item in pageData.list">
			<view>{{item}}</view>
		</template> 
		</view>
		<uni-load-more :status="status" :icon-size="17" :content-text="contentText" />
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal =util.getPersonal();
	export default {
		data() {
			return {
				queryData:{},//查询栏得到的数据
				pageData:{list:[1,2,3,4,5,6,7]},//页面列表数据
				
				page_number:1,//页码
				
				//picker数据
				tremIndex:0,
				subIndex:0,
				statusIndex:0,
				tremArray: [{name:'全部',value:''}],
				subArray: [{sub_name:'全部',sub_code:''}],
				statusArray: [{name:'全部',value:''},{name:'未评',value:1},{name:'已做',value:2},{name:'已评',value:3}],

				status:'more',//加载更多的状态
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				loadingShow:true,//是否加载更多
				
				tabbar: [],
				styles: {borderColor:'rgba(204,198,204,0.4)',borderRadius: '10px',margin: '0 1px 0'}
			}
		},
		methods: {
			termClick:function(e){
				this.tremIndex=e.detail.value
				if(e.detail.value-1>=0){
					let term=this.queryData.list[(e.detail.value-1)]
					this.subArray=[{sub_name:'全部',sub_code:''}].concat(term.sub_list)
				}
				this.loadingShow=true
				this.page_number=1
				this.getPageList()
			},
			courseClick:function(e){
				this.subIndex=e.detail.value
				this.loadingShow=true
				this.page_number=1
				this.getPageList()
			},
			statusClick:function(e){
				this.statusIndex=e.detail.value
				this.loadingShow=true
				this.page_number=1
				this.getPageList()
			},
			getTermList(){
				let comData={
					stu_code:personal.user_code,
					index_code:"CoursePractice:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/query',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.queryData=response
					if(response.list&&response.list.length>0){
						response.list.map(item=>{
							item.name=item.grd_name+item.term_name
							item.value=item.term_code
						})
						this.tremArray=[{name:'全部',value:''}].concat(response.list)
					}else{
						uni.showToast({
							icon:'none',
							title:'暂无学期',
							duration:1500
						});
					}
				})
			},
			getPageList(){
				let comData={
					page_number: this.page_number,
					page_size: 15,
					stu_code:personal.user_code,
					stu_test_status: this.statusArray[this.statusIndex].value,
					sub_code: this.subArray[this.subIndex].sub_code?this.subArray[this.subIndex].sub_code:'',
					sys_grd_code: this.tremArray[this.tremIndex].sys_grd_code?this.tremArray[this.tremIndex].sys_grd_code:'',
					term_code: this.tremArray[this.tremIndex].term_code?this.tremArray[this.tremIndex].term_code:'',
					stu_code:personal.user_code,
					index_code:"CoursePractice:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/page',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.pageData=response.list
					if(this.page_number>=response.total_page){
						this.status = 'noMore';
						this.loadingShow=false
					}else{
						this.status = 'more';
					}
					this.hideLoading()
				})
			}
		},
		onLoad() {
			this.tabbar = util.getMenu();
			this.showLoading()
			this.getTermList()
			this.getPageList()
		},
		onReachBottom() {
			if(this.loadingShow){
				this.status = 'loading';
				this.page_number=this.page_number+1
				this.getPageList()
			}
		},
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
		position: fixed;
	    display: flex;
	    flex-direction: row;
	    overflow: hidden;
	    background-color: #FFFFFF;
		padding: 3px;
	}
	.flex-box{
		 flex: 1;
	}
	.content-body{
		margin-top:50px
	}
</style>
