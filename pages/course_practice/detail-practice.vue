<template>
	<view>
		<view class="tabs">
			<progress  :percent="percent" show-info border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5" :stroke-width="10"/>
		</view>
		<view :key="index" v-for="(curr_question,index) in question_list">
			<template v-if="curr_question.is_que">
				<uni-card-practice style="margin-top: 10px;word-break: break-all;" :title="`${curr_question.qusetion_num}.${curr_question.title}`" :isFull="true">
					<template v-if="curr_question.type=='2'"><!-- 多选 -->
						<checkbox-group @change="checkboxChange($event,curr_question)">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in curr_question.optionObjs" :key="item.value">
								<view style="margin: 0px 0;">
									<checkbox :value="item.value" :checked="item.isCheck" color="#00CFBD" style="transform:scale(0.7)" />
								</view>
								<text style="word-break: break-all;" v-html="item.label"></text>
							</label>
						</checkbox-group>
					</template>
					<template v-else-if="curr_question.type=='1'"><!-- 单选 -->
						<radio-group @change="radioChange($event,curr_question)">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in curr_question.optionObjs" :key="item.value">
								<view style="margin: 0px 0;">
									<radio :value="item.value" :checked="item.isCheck" color="#00CFBD" style="transform:scale(0.7)"/>
								</view>
								<text style="word-break: break-all;" v-html="item.label"></text>
							</label>
						</radio-group>
					</template>
				</uni-card-practice>
			</template>
			<template v-else>
				<uni-section style="min-height:200rpx;" :title="curr_question.title" type="line"></uni-section>
			</template>
		</view>
		<template v-if="question_list.length>0">
			<view class="bottom-btn-tab">
				<button class="btn test-btn0" type="default" @click="cancel">取消</button>
				<button class="btn test-btn1" type="warn" @click="onClearAnswer">清空答案</button>
				<button class="btn test-btn" type="primary" @click="onSubmit">交卷</button>
			</view>
		</template>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="还有题目未完成,是否现在提交" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="alertDialog2" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="是否确认清空答案" @confirm="dialogConfirm2"></uni-popup-dialog>
		</uni-popup>
		
		<uni-popup ref="alertDialog3" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="上次有修改未提交，是否恢复" @confirm="dialogConfirm3" @close="dialogClose3"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				personInfo:{},
				canSubmit:true,
				itemData:{},
				percent:0,
				answer_list:[],
				online_answer_list:[],
				question_list:[]
			}
		},
		methods: {
			setAnswers(answers){
				uni.setStorageSync(this.itemData.test_id+'_practice_answers',answers?JSON.stringify(answers):null)
			},
			getAnswers(){
				const answers=uni.getStorageSync(this.itemData.test_id+'_practice_answers')
				if(answers){return JSON.parse(answers)}else{return []}
			},
			getPageList(){
				let comData={
					test_id: this.itemData.test_id,
					stu_code:this.personInfo.user_code,
					index_code:this.itemData.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/detail',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.answer_list=response.answer_list
					this.online_answer_list=response.answer_list
					this.question_list=response.question_list
					let questions=[]
					if(response.question_list.length>0){//过滤非题目
						let que_num=0
						for (var i = 0; i < response.question_list.length; i++) {
							if(response.question_list[i].is_que){
								response.question_list[i].qusetion_num=++que_num
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
						this.percent=parseInt(num)
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
					this.itemData.questions=questions
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
				let showDialog=false
				this.answer_list.map(item=>{
					if(item.answer.length===0){
						showDialog=true
					}
				})
				if(showDialog){
					this.$refs.alertDialog.open()
				}else{
					if(this.canSubmit){
						this.canSubmit=false
						setTimeout(()=>{this.canSubmit=true},1000)
						this.submitData()
					}
				}
			},
			onClearAnswer(){
				this.$refs.alertDialog2.open()
			},
			onSetAnswer(){
				this.$refs.alertDialog3.open()
			},
			dialogConfirm(){
				this.submitData()
			},
			dialogConfirm2(){
				this.percent=0;
				this.answer_list=[]
				this.question_list.map(item=>{
					if(item.is_que){
						item.optionObjs.map(itemop=>{
							itemop.isCheck=false
						})
					}
				})
			},
			dialogConfirm3(){
				let answer_list=this.getAnswers()
				this.answer_list=answer_list
				this.question_list.map(question_item=>{
					if(question_item.is_que){
						question_item.optionObjs.map(question_item_optionObjs_item=>{
								question_item_optionObjs_item.isCheck=false
						})
						answer_list.map(answer_item=>{
							if(question_item.id==answer_item.question_id){
								// question_item.optionObjs.map(question_item_optionObjs_item=>{
								// 		question_item_optionObjs_item.isCheck=false
								// })
								answer_item.answer.map(answer_item_item=>{
									question_item.optionObjs.map(question_item_optionObjs_item=>{
										if(answer_item_item==question_item_optionObjs_item.value){
											question_item_optionObjs_item.isCheck=true
										}
									})
									 
								})
							}
						})
					}
				})
				this.question_list=[].concat(this.question_list)
				let answers=0
				answer_list.map(item=>{
					let filter =item.answer.filter((item) => item!=null);
					if(filter.length>0){
						answers++
					}
				})
				let num=(answers/this.itemData.questions.length)*100
				this.percent=parseInt(num)
				this.setAnswers(null);
			},
			dialogClose3(){
				this.setAnswers(null);
			},
			submitData(){
				console.log("this.answer_list: " + JSON.stringify(this.answer_list));
				console.log("this.itemData.questions: " + JSON.stringify(this.itemData.questions));
				let newAnswer=[]
				this.itemData.questions.map(qitem=>{
					let obj={
						question_id:qitem.id,
						answer:[],
						score:0,
						is_right:false,
					}
					this.answer_list.map(aitem=>{
						if(aitem.question_id==qitem.id){
							obj.answer=aitem.answer
							obj.score=aitem.score
							obj.is_right=aitem.is_right
						}
					})
					newAnswer.push(obj)
				})
				let score=0
				this.showLoading();
				newAnswer.map(item=>{
					score+=parseFloat(item.score)
				})
				
				let comData={
					test_id: this.itemData.test_id,
					stu_code:this.personInfo.user_code,
					answer_list:newAnswer,
					total_score:score,
					answer_number:this.answer_list.length,
					index_code:this.itemData.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/submit',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.showToast("交卷成功")
					this.setAnswers(null);
					this.online_answer_list=[]
					this.answer_list=[]
					setTimeout(()=>{
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refresh', {data: 'test'});
						uni.navigateBack();
						this.hideLoading()
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
				let num=(answers/this.itemData.questions.length)*100
				this.percent=parseInt(num)
			},
			cancel(){
				 uni.navigateBack();
			}
		},
		onLoad: function(option) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(option);
			this.itemData=itemData
			uni.setNavigationBarTitle({title: itemData.test_name})
			this.showLoading()
			this.getPageList()
			setTimeout(()=>{
				console.log("this.getAnswers(): " + JSON.stringify(this.getAnswers()));
				if(this.getAnswers().length>0){
					this.onSetAnswer()
				}
			},500)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
				//#ifndef APP-PLUS
					document.title=""
				//#endif
		},
		onUnload(){
			if(JSON.stringify(this.answer_list)!=JSON.stringify(this.online_answer_list)){
				this.setAnswers(this.answer_list)
			}
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
	
	
	.test-btn1{
		width: 30%;
		border-radius: 0;
		color: #FFFFFF;
		font-size: 15px;
		height: 50px;
		padding-top: 6px;
	}
</style>
