<template>
	<view>
		 <view class="tabs">
		 	<picker class="flex-box" @change="termClick" :value="tremIndex" :range="tremArray" range-key="name">
		 		<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="tremArray[tremIndex].name" ></uni-easyinput>
		 	</picker>
		 	<picker class="flex-box" @change="courseClick" :value="subIndex" :range="subArray" range-key="sub_name">
		 		<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="subArray[subIndex].sub_name" ></uni-easyinput>
		 	</picker>
		 </view>
		 <view class="content-body">
			 <template v-for="(item,index) in pageData">
				<uni-card :key="index" isShadow><!--  @click="clickCard" -->
					<text v-if="item.pass" size="small" class="tag-right" style="color:#00CFBD;right: 15px;">通过</text>
					<text v-else  size="small" class="tag-right" style="color: #E64340;right: 15px">不通过</text>
					<uni-row>
						<uni-col :span="20"><uni-title class="h4" type="h4" :title="`${item.per_name} ${item.grd_name} ${item.term_name}`" style="word-break: break-all;"></uni-title></uni-col>
					</uni-row>
					<uni-row style="margin-top: 5px;">
						<uni-col :span="12" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><text style="font-size: 22rpx;">专业: {{item.major_name}}</text></uni-col>
						<uni-col :span="12"  style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><text style="font-size: 22rpx;">课程: {{item.sub_name}}</text></uni-col>
					</uni-row>
				</uni-card>
			</template>
		 </view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				personInfo:{},
				page_number:1,
				queryData:[],
				pageData:[],
				
				
				tremIndex:0,
				subIndex:0,
				tremArray: [{name:'全部学期',value:''}],
				subArray: [{sub_name:'全部科目',sub_code:''}],
				styles: {borderColor:'rgba(204,198,204,0.4)',borderRadius: '10px',margin: '0 1px 0'},
				
				status:'more',//加载更多的状态
				contentText: {
					contentdown: '',//上滑加载更多
					contentrefresh: '加载中',
					contentnomore: ''//没有更多
				},
				canload:true,//是否加载更多
				loadFlag:0,//0 刷新 1加载更多
			}
		},
		methods: {
			termClick:function(e){
				console.log("e.detail.value: ",e.detail.value);
				if(this.tremIndex!==e.detail.value){
					this.tremIndex=e.detail.value
					if(e.detail.value-1>=0){
						let term=this.queryData.list[(e.detail.value-1)]
						this.subArray=[{sub_name:'全部科目',sub_code:''}].concat(term.sub_list)
					}else{
						this.subArray=[{sub_name:'全部科目',sub_code:''}]
					}
					this.subIndex=0
					this.showLoading()
					this.loadFlag=0
					this.canload=true
					this.page_number=1
					this.getGradeList()
				}
			},
			courseClick:function(e){
				if(this.subIndex!==e.detail.value){
					this.subIndex=e.detail.value
					this.showLoading()
					this.loadFlag=0
					this.canload=true
					this.page_number=1
					this.getGradeList()
				}
			},
			 getQuery(){
				let comData={
					stu_code:this.personInfo.user_code,
					index_code:'Grades:Index',
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/center/scoreQuery',comData,response=>{
					console.log("response: ",JSON.stringify(response));
					this.queryData=response
					if(response.list&&response.list.length>0){
						response.list.map(item=>{
							item.name=item.grd_name+item.term_name
							item.value=item.term_code
						})
						this.tremArray=[{name:'全部学期',value:''}].concat(response.list)
					}else{
						this.showToast('暂无学期')
					}
					this.hideLoading()
				})
			 },
			 getGradeList(){
				let comData={
					page_number: this.page_number,
					page_size: 15,
					stu_code:this.personInfo.user_code,
					sub_code: this.subArray[this.subIndex].sub_code?this.subArray[this.subIndex].sub_code:'',
					sys_grd_code: this.tremArray[this.tremIndex].sys_grd_code?this.tremArray[this.tremIndex].sys_grd_code:'',
					term_code: this.tremArray[this.tremIndex].term_code?this.tremArray[this.tremIndex].term_code:'',
					index_code:'Grades:Index',
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/center/scorePage',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					if(this.loadFlag===0){
						this.pageData=[].concat(response.list)
					}else{
						this.pageData=this.pageData.concat(response.list)
					}
					if(this.page_number>=response.total_page){
						this.status = 'noMore';
						this.canload=false
					}else{
						this.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			 }
		},
		onLoad:function(){
			this.personInfo = util.getPersonal();
			uni.setNavigationBarTitle({title: '学习成绩'})
			//#ifndef APP-PLUS
				document.title=""
			//#endif
			setTimeout(()=>{
				this.showLoading();
				this.getQuery();
				this.getGradeList();
			},350)
		},
		onShow(){
				//#ifndef APP-PLUS
					document.title=""
				//#endif
		},
		onPullDownRefresh() {
			this.showLoading()
			this.getGradeList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.canload){
				this.loadFlag=1
				this.status = 'loading';
				this.page_number=this.page_number+1
				this.getGradeList()
			}
		},
	}
</script>

<style>
	 .tabs {
	 	top: 44px; 
	     display: flex;
	     flex-direction: row;
	     overflow: hidden;
	     background-color: #FFFFFF;
	 	padding: 3px;
	 	z-index: 10;
	 }
	 .flex-box{
	 	 flex: 1;
	 }
	 .tag-right{
	 	position: absolute;
	 	right: 10px;
	 	margin-top: 6px;
	 	font-size: 12px;
	 	height: 22px;
	 }
</style>
