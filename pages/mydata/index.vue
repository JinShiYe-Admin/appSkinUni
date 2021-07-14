<template>
	<view>
		 <uni-section title="基本信息" type="line"></uni-section>
		 <uni-group mode="card">
			 <uni-row>
				<uni-col :span="24" style="margin: 7px 0;">学号：{{stuInfo.sno}}</uni-col>
			 	<uni-col :span="12" style="margin: 7px 0;">姓名：{{stuInfo.stu_name}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">性别：{{stuInfo.sex_txt}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">民族：{{stuInfo.ethnic}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">籍贯：{{stuInfo.birthplace}}</uni-col>
				<uni-col :span="24" style="margin: 7px 0;">身份证：{{stuInfo.id_number_txt}}</uni-col>
			 </uni-row>
		 </uni-group>
		 <uni-group mode="card">
			<uni-row>
				<uni-col :span="24" style="margin: 7px 0;">通讯地址：{{stuInfo.address}}</uni-col>
				<uni-col :span="24" style="margin: 7px 0;">工作单位：{{stuInfo.company}}</uni-col>
				<uni-col :span="24" style="margin: 7px 0;">邮政编码：{{stuInfo.postal_code}}</uni-col>
				<uni-col :span="24" style="margin: 7px 0;">联系电话：{{stuInfo.phone_txt}}</uni-col>
			</uni-row>
		 </uni-group>
		 <uni-section title="学籍信息" type="line"></uni-section>
		 <uni-group mode="card">
			<uni-row>
				<uni-col :span="12" style="margin: 7px 0;">层次：{{stuInfo.per_name}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">院系：{{stuInfo.coll_name}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">专业：{{stuInfo.major_name}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">年级：{{stuInfo.grd_name}}</uni-col>
				<uni-col :span="12" style="margin: 7px 0;">学籍状态：{{stuInfo.status_txt}}</uni-col>
			</uni-row>
		 </uni-group>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				personInfo:{},
				stuInfo:{},
			}
		},
		methods: {
			 getStuInfo(){
				 let comData={
				 	stu_code:this.personInfo.user_code,
				 	index_code:'MyData:Index',
				 }
				 this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/center/stuInfo',comData,response=>{
					 console.log("response: ",JSON.stringify(response));
					  setTimeout(function () {
						uni.stopPullDownRefresh();
					   }, 1000);
					   const statusList = [{ id: 1, name: '在读' }, { id: 2, name: '毕业' }, { id: 3, name: '休学' }]
					   const sexList = [{ id: 1, name: '男' }, { id: 0, name: '女' }]
					   let statusTxt = ''
					   if (response.stu && response.stu.status) {
						statusTxt =response.stu.status==1?'在读':response.stu.status==2?'毕业':response.stu.status==3?'休学':''
					   }
					   let sexTxt = ''
					   if (response.stu) {
						sexTxt = response.stu.sex==1?'男':'女'
					   }
					   
					   let phoneTxt=''
					   if (response.stu) {
					   	phoneTxt = response.stu.phone.substr(0,3)+'*******'
					   }
					   let id_numberTxt=''
					   if (response.stu) {
						id_numberTxt = response.stu.id_number.substr(0,5)+'************'
					   }
					   response.stu.phone_txt=phoneTxt
					   response.stu.id_number_txt=id_numberTxt
					   response.stu.status_txt=statusTxt
					   response.stu.sex_txt=sexTxt
					   this.stuInfo=response.stu
					   this.hideLoading()
				 })
			 }
		},
		onLoad:function(){
			this.personInfo = util.getPersonal();
			uni.setNavigationBarTitle({title: '我的资料'})
			//#ifndef APP-PLUS
				document.title=""
			//#endif
			setTimeout(()=>{
				this.showLoading();
				this.getStuInfo();
			},350)
		},
		onPullDownRefresh() {
			this.showLoading()
			this.getStuInfo()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		}
	}
</script>

<style>
	 
</style>
