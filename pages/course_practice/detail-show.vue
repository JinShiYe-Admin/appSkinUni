<template>
	<view>
		<view class="tabs">
			<!-- <uni-title class="h3" style="align-items: center;" type="h3" :title="`${itemData.test_name}`"></uni-title> -->
		</view>
		<view class="tabs">
			<uni-title class="h5" style="align-items: center;" type="h5" :title="`学期：${itemData.grd_name}${itemData.term_name}`"></uni-title>
			<uni-title class="h5" style="align-items: center;" type="h5" :title="`成绩：${parseInt(itemData.stu_total_score?itemData.stu_total_score:0)}/${parseInt(itemData.score)}`"></uni-title>
		</view>
		<template v-if="is_que">
			<uni-card-practice style="margin-top: 10px;margin-bottom: 80px;word-break: break-all;" :title="`${curr_question.question.qusetion_num}.${curr_question.question.title}`" :isFull="true">
				<template v-for="(item,index) in curr_question.question.options">
					<view :key="index" style="margin: 10px 0;"><text v-html="item" style="padding-left:20px ;word-break: break-all;"></text></view>
				</template> 
				<uni-row style="margin-top: 10px;">
					<uni-col :span="14">
						<uni-row>
							<uni-col :span="24">
								<uni-row>
									<uni-col :span="12">
										<uni-tag text="学生答案:" custom-style="background-color: #E5E5E5; color: #383838;"></uni-tag>
									</uni-col>
									<uni-col :span="12">
										<uni-title class="h5" type="h5" :title="(curr_answer && curr_answer.answer)==undefined?'':curr_answer.answer.join(',')"></uni-title>
										<!-- <text v-for="item in curr_answer.answer">{{item}}</text> -->
									</uni-col>
								</uni-row>
							</uni-col>
							<uni-col :span="24">
								<uni-row>
									<uni-col :span="12">
										<uni-tag text="正确答案:" custom-style="background-color: #E5E5E5; color: #383838;"></uni-tag>
									</uni-col>
									<uni-col :span="12">
										<uni-title class="h5" type="h5" :title="curr_question.question.answer.join(',')"></uni-title>
										<!-- <text v-for="item in curr_question.question.answer">{{item}}</text> -->
									</uni-col>
								</uni-row>
							</uni-col>
						</uni-row>
					</uni-col>
					<uni-col :span="10" style="text-align: right;">
						<uni-row>
							<uni-col :span="14">
								<uni-tag text="得分:" custom-style="background-color: #E5E5E5; color: #383838;"></uni-tag>
							</uni-col>
							<uni-col :span="10">
								<uni-title class="h5" style="align-items: center;" type="h5" :title="`${(curr_answer && curr_answer.score)==undefined?'0.00':curr_answer.score} 分`"></uni-title>
							</uni-col>
						</uni-row>
					</uni-col>
				</uni-row>
				<uni-row>
					<view style="width: 100vw;height: 1px;background-color: rgba(113,113,113,0.3);margin-left: -15px;margin-top: 10px;"></view>
					<template v-if="curr_question.question.parse==null || curr_question.question.parse=='null'">
						<view style="font-size: 12px;margin-top: 10px;">
							解析：无
						</view>
					</template>
					<template v-else>
						
						<view style="font-size: 12px;margin-top: 10px">
							解析：<view v-html="curr_question.question.parse"></view>
						</view>
					</template>
					<!-- {{curr_question.question.parse==null || curr_question.question.parse=='null')?'解析：无':`解析：${curr_question.question.parse}`}} -->
				</uni-row>
			</uni-card-practice>
		</template>
		<template v-else>
			<uni-section style="min-height:200rpx;" :title="curr_question.question.title" type="line"></uni-section>
		</template>
		<view class="bottom-btn-tab">
			<button class="btn test-btn" type="primary" :disabled="after_disabled" @click="after()">上一题</button>
			<button class="btn test-btn" type="primary" :disabled="next_disabled" @click="next()">下一题</button>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return { 
				personInfo:{},
				itemData:{},
				pageData:{},
				answer_list:[],
				question_list:[],
				curr_answer:{},
				curr_question:{question:{title:''}},
				is_que:false,//题型是否是介绍
				after_disabled:true,//后退按钮是否禁用
				next_disabled:true,//前进按钮是否禁用
			}
		},
		methods: {
			getPageList(){
				let comData={
					test_id: this.itemData.test_id,
					stu_code:this.personInfo.user_code,
					index_code:this.itemData.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/show',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.pageData=response
					this.answer_list=response.answer_list
					this.question_list=response.question_list
					if(response.question_list.length>0){
						let que_num=0
						for (var i = 0; i < response.question_list.length; i++) {
							if(response.question_list[i].is_que){
								response.question_list[i].qusetion_num=++que_num
							}
						}
						let question=response.question_list[0]
						if(question.is_que){
							let question_id=question.id
							response.answer_list.map(item=>{
								if(question_id==item.question_id){
									this.curr_answer=item
								}
							})
						}
						this.is_que=question.is_que
						this.curr_question={question:question,index:0}
						if(response.question_list.length>1){
							this.next_disabled=false
						}
					}else{
						this.next_disabled=true
					}
					this.hideLoading()
				})
			},
			after(){
				let index=this.curr_question.index-1
				let question=this.question_list[index]
				this.curr_answer={}
				if(question.is_que){
					let question_id=question.id
					this.answer_list.map(item=>{
						if(question_id==item.question_id){
							this.curr_answer=item
						}
					})
				}
				this.is_que=question.is_que
				this.curr_question={question:question,index:index}
				
				this.next_disabled=false
				if(index===0){
					this.after_disabled=true
				}
			},
			next(){
				let index=this.curr_question.index+1
				let question=this.question_list[index]
				this.curr_answer={}
				if(question.is_que){
					let question_id=question.id
					this.answer_list.map(item=>{
						if(question_id==item.question_id){
							this.curr_answer=item
						}
					})
				}
				this.is_que=question.is_que
				this.curr_question={question:question,index:index}
				
				this.after_disabled=false
				if(index===this.question_list.length-1){
					this.next_disabled=true
				}
			}
		},
		onLoad: function(option) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(option);
			uni.setNavigationBarTitle({title: itemData.test_name})
			this.itemData=itemData
			console.log("itemData: " + JSON.stringify(itemData));
			this.showLoading()
			this.getPageList()
			//#ifndef APP-PLUS
				document.title=""
			//#endif
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
		display: flex;
		flex-direction: row;
		overflow: hidden;
		background-color: #FFFFFF;
		z-index: 10;
	}
	.bottom-btn-tab{
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		z-index: 10;
	}
	uni-button:after{
		border-radius: 0;
	}
	uni-button[disabled][type=primary]{
		background-color: #b1b1b1 !important;
	}
	.test-btn{
		width: 100%;
		border-radius: 0;
		color: #FFFFFF;
		background-color: #00cfbd !important;
		font-size: 15px;
		height: 50px;
		padding-top: 6px;
	}
</style>
