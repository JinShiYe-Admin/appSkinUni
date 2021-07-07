<template>
	<view>
		<view class="tabs">
			<progress  :percent="percent" show-info border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5" :stroke-width="10"/>
		</view>
		<view style="z-index: 5;"></view>
		<view v-for="(curr_question,index) in question_list">
			<template v-if="curr_question.is_que">
				<uni-card style="margin-top: 10px;" :title="`${curr_question.sort}.${curr_question.title}`" :isFull="true">
					<template v-if="curr_question.type=='2'"><!-- 多选 -->
						<checkbox-group @change="checkboxChange($event,curr_question)">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in curr_question.optionObjs" :key="item.value">
								<view style="margin: 0px 0;">
									<checkbox :value="item.value" :checked="item.isCheck" color="#00CFBD" style="transform:scale(0.7)" />
								</view>
								<view>{{item.label}}</view>
							</label>
						</checkbox-group>
					</template>
					<template v-else-if="curr_question.type=='1'"><!-- 单选 -->
						<radio-group @change="radioChange($event,curr_question)">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in curr_question.optionObjs" :key="item.value">
								<view style="margin: 0px 0;">
									<radio :value="item.value" :checked="item.isCheck" color="#00CFBD" style="transform:scale(0.7)"/>
								</view>
								<view>{{item.label}}</view>
							</label>
						</radio-group>
					</template>
				</uni-card>
			</template>
			<template v-else>
				<uni-section style="min-height:200rpx;" :title="curr_question.title" type="line"></uni-section>
			</template>
		</view>
		<template v-if="question_list.length>0">
			<view class="bottom-btn-tab">
				<button class="btn test-btn0" type="default" @click="cancel">取消</button>
				<button class="btn test-btn" type="primary" @click="onSubmit">交卷</button>
			</view>
		</template>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="还有题目未完成,是否现在提交" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal =util.getPersonal();
	export default {
		data() {
			return {
				itemData:{},
				percent:0,
				answer_list:[],
				question_list:[]
			}
		},
		methods: {
			getPageList(){
				let comData={
					test_id: this.itemData.test_id,
					stu_code:personal.user_code,
					index_code:this.itemData.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/detail',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.answer_list=response.answer_list
					this.question_list=response.question_list
					let questions=[]
					if(response.question_list.length>0){//过滤非题目
						for (var i = 0; i < response.question_list.length; i++) {
							if(response.question_list[i].is_que){
								questions.push(response.question_list[i])
							}
						}
					}
					if(response.answer_list.length>0 && response.question_list.length>0){
						let answers=0
						response.answer_list.map(item=>{
							let filter =item.answer.filter((item) => item!=null);
							if(filter.length>0){
								answers++
							}
						})
						let num=(answers/questions.length)*100
						this.percent=num
					}
					questions.map(question_item=>{
						question_item.optionObjs=[]
						question_item.options.map(question_item_options_item=>{
							let opt={
								value:question_item_options_item.split("．")[0],
								label:question_item_options_item,
								isCheck:false
							}
							question_item.optionObjs.push(opt)
						})
						response.answer_list.map(answer_item=>{
							if(question_item.id==answer_item.question_id){
								answer_item.answer.map(answer_item_item=>{
									question_item.optionObjs.map(question_item_optionObjs_item=>{
										if(answer_item_item==question_item_optionObjs_item.value){
											question_item_optionObjs_item.isCheck=true
										}
									})
								})
							}
						})
					})
					this.question_list.questions=questions
					this.hideLoading()
				})
			},
			checkboxChange(e,curr_question){
				let checkValue=e.detail.value
				let is_right=false
				let score="0.00"
				if(checkValue.length>0){
					curr_question.optionObjs.map(op_item=>{
						op_item.isCheck=false
					})
					checkValue.map(check_item=>{
						curr_question.optionObjs.map(op_item=>{
							if(check_item==op_item.value){
								op_item.isCheck=true
							}
						})
					})
					if(JSON.stringify(checkValue)==JSON.stringify(curr_question.answer)){
						is_right=true
						score=curr_question.score
					}
				}else{
					score="0.00"
					is_right=false
					curr_question.optionObjs.map(op_item=>{
						op_item.isCheck=false
					})
				}
				let answer_obj={
					score:score,
					answer:checkValue,
					is_right:is_right,
					question_id:curr_question.id,
				}
				let filter =this.answer_list.filter((item) => item.question_id!=answer_obj.question_id);
				filter.push(answer_obj)
				this.answer_list=filter
				this.answer_list.sort((a,b)=>{ return a.question_id-b.question_id})
				this.refreshPercent()
			},
			radioChange(e,curr_question){
				let checkValue=e.detail.value
				let is_right=false
				let score="0.00"
				curr_question.optionObjs.map(op_item=>{
					op_item.isCheck=false
				})
				curr_question.optionObjs.map(op_item=>{
					if(checkValue==op_item.value){
						op_item.isCheck=true
					}
				})
				if(checkValue==curr_question.answer){
					is_right=true
					score=curr_question.score
				}
				let answer_obj={
					score:score,
					answer:[checkValue],
					is_right:is_right,
					question_id:curr_question.id,
				}
				let filter =this.answer_list.filter((item) => item.question_id!=answer_obj.question_id);
				filter.push(answer_obj)
				this.answer_list=filter
				this.answer_list.sort((a,b)=>{ return a.question_id-b.question_id})
				this.refreshPercent()
			},
			onSubmit(){
				console.log("this.answer_list: " + JSON.stringify(this.answer_list));
				let showDialog=false
				this.answer_list.map(item=>{
					if(item.answer.length===0){
						showDialog=true
					}
				})
				if(showDialog){
					this.$refs.alertDialog.open()
				}else{
					this.submitData()
				}
			},
			dialogConfirm(){
				this.submitData()
			},
			submitData(){
				let score=0
				this.showLoading();
				this.answer_list.map(item=>{
					score+=parseFloat(item.score)
				})
				let comData={
					test_id: this.itemData.test_id,
					stu_code:personal.user_code,
					answer_list:this.answer_list,
					total_score:score,
					answer_number:this.answer_list.length,
					index_code:this.itemData.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/submit',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.hideLoading()
					this.showToast("交卷成功")
					setTimeout(()=>{
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refresh', {data: 'test'});
						uni.navigateBack();
					},1000)
				})
			},
			refreshPercent(){
				let answers=0
				this.answer_list.map(item=>{
					let filter =item.answer.filter((item) => item!=null);
					if(filter.length>0){
						answers++
					}
				})
				let num=(answers/this.question_list.questions.length)*100
				this.percent=num
			},
			cancel(){
				 uni.navigateBack();
			}
		},
		onLoad: function(option) {
			const itemData = util.getPageData(option);
			uni.setNavigationBarTitle({title: itemData.test_name})
			this.itemData=itemData
			this.showLoading()
			this.getPageList()
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
		 /* #ifndef APP-PLUS */
		 top: 44px;
		 /* #endif */
		 /* #ifdef APP-PLUS */
		 top: -1px;
		 /* #endif */
		position: sticky;
	    overflow: hidden;
	    background-color: #FFFFFF;
		padding: 10px;
		z-index: 10;
		height: 20px;
	}
	
	.uni-list-cell {
		justify-content: flex-start
	}
	
	.bottom-btn-tab{
		width: 100%;
		padding: 10px 0 ;
		margin: 10px 0 0;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		z-index: 10;
	}
	
	.test-btn{
		width: 30%;
		border-radius: 0;
		color: #FFFFFF;
		font-size: 15px;
		height: 50px;
		padding-top: 6px;
		background-color: #00CFBD !important;
	}
	.test-btn0{
		width: 30%;
		border-radius: 0;
		color: #353535;
		font-size: 15px;
		height: 50px;
		padding-top: 6px;
	}
</style>
