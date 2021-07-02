<template>
	<view>
		<view class="tabs">
			<progress percent="30" border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5" :stroke-width="10"/>
		</view>
		
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal =util.getPersonal();
	export default {
		data() {
			return {
				pageData:{}
			}
		},
		methods: {
			getPageList(){
				let comData={
					test_id: this.itemData.test_id,
					stu_code:personal.user_code,
					index_code:"CoursePractice:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/detail',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.hideLoading()
				})
			}
		},
		onLoad: function(option) {
			const itemData = util.getPageData(option);
			uni.setNavigationBarTitle({title: itemData.test_name})
			this.itemData=itemData
			console.log("itemData: " + JSON.stringify(itemData));
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
	    display: flex;
		flex: 1;
		align-items: center;
	    flex-direction: row;
	    overflow: hidden;
	    background-color: #FFFFFF;
		padding: 10px;
		z-index: 10;
		height: 50px;
	}
</style>
