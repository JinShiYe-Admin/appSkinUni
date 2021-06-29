<template>
	<view>
		<view style="flex: 1;">
			<video style="width: 100%;height: 200px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/3c1782e0-60ab-11eb-8ff1-d5dcf8779628.m4v" @error="videoErrorCallback" controls="false"></video>
		</view>
		<view class="uni-padding-wrap">
			<view class="uni-box">
				<uni-title class="h4" type="h4" :title="detailData.sub_name"></uni-title>
				<uni-title class="h5" type="h5" :title="`课程时长：21小时27分钟44秒`"></uni-title>
				<uni-title class="h5" type="h5" :title="`已学时长：27分钟44秒`"></uni-title>
				<uni-title class="h5" type="h5" :title="`本视频时长:1小时27分钟44秒`"></uni-title>
			</view>
			<view>
				<progress percent="67.89" border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5" stroke-width="6" active/>
			</view>
		</view>
		<view class="line-h"></view>
		<view class="uni-padding-wrap">
			<uni-section title="章节" type="line"></uni-section>
		</view>
		<view class="uni-padding-wrap">
			 <ly-tree :tree-data="treeData" node-key="id" @node-click="handleNodeClick"></ly-tree>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				detailData:'',
				 treeData:[{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 11,
                    label: '二级 1-1',
                    children: [{
                        id: 111,
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 21,
                    label: '二级 2-1',
                    children: [{
                        id: 211,
                        label: '三级 2-1-1'
                    }]
                }, {
                    id: 22,
                    label: '二级 2-2',
                    children: [{
                        id: 221,
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 31,
                    label: '二级 3-1',
                    children: [{
                        id: 311,
                        label: '三级 3-1-1'
                    }]
                }, {
                    id: 32,
                    label: '二级 3-2',
                    children: [{
                        id: 321,
                        label: '三级 3-2-1'
                    }]
                }]
            }]
			}
		},
		methods: {
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
			},
		},
		onLoad: function(option) {
			const detailData = util.getPageData(option);
			console.log("detailData: " + JSON.stringify(detailData));
			this.detailData=detailData
			uni.setNavigationBarTitle({title: "详情"})
		}
	}
</script>

<style>
	.line-h{
		margin-top: 10px;
		height: 5px;
		background-color: #EEF0F2;
	}
	
	.line-w{
		margin-top: 10px;
		width: 5px;
		background-color: #EEF0F2;
	}
</style>
