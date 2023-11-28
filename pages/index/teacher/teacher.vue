<template>
	<view class="teacher">
		<uni-search-bar class="search_inp" radius="5" placeholder="请输入老师名称" clearButton="auto" cancelButton="none"
			@confirm="search" />
		<view v-for="(item,index) in teacherList" :key="index" class="list">
			<view class="info">
				<uni-title type="h2" :title="item.name"></uni-title>
				<uni-tag :text="item.classGradeName || '未选择班级'" :mark="true" type="success"></uni-tag>
			</view>
			<view class="handle">
				<text class="identity">身份：{{item.classGradeName ? '老师':'园长'}}</text>
				<view class="">
					<uni-tag text="修改" type="primary" inverted style="margin-right: 10rpx;" @click="edit(item)"></uni-tag>
					<uni-tag text="删除" type="error" inverted @click="dialogToggle(item)"></uni-tag>
				</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" content="是否确认删除!"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacherList: [],
				pageNum:1,
				pageSize:10,
				item:{}

			}
		},
		onLoad() {
			this.getList()
		},
		onShow() {
			this.pageNum = 1
			this.pageSize = 10
			this.getList()
		},
		methods: {
			search(e){
				this.getList(e.value)
			},
			//获取list数据
			getList(name=""){
				let data = {
					name,
					kindergarten:uni.getStorageSync('kindergartenId'),
					pageNum:this.pageNum,
					pageSize:this.pageSize 
				}
				this.$http('/min-program/conservator/list','GET',data).then(res=>{
					this.teacherList = res.records
					console.log(res,'=========laoshi')
				})
			},
			edit(item){
				console.log(item,'====item')
				let json = JSON.stringify(item)
				uni.navigateTo({
					url: `./edit/edit?item=${json}`
				})
			},
			dialogToggle(item) {
				this.item = item
				this.$refs.alertDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogConfirm() {
				this.$http(`/min-program/conservator/${this.item.id}`,'DELETE').then(res=>{
					this.getList()
					this.pageNum = 1
					this.pageSize = 10
					this.item = {}
				})
				console.log('点击确认')
				uni.showToast({
					icon: "none",
					title: '删除成功！'
				});
			},
			onReachBottom(){
				// this.pageNum +=1
				this.pageSize += 10
				this.getList()
				console.log('到底了~！！！！')
			}

		}
	}
</script>

<style>
	.list {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		border-bottom: 1px solid #e9e9eb;
		height: 180rpx;
	}

	.handle {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: flex-end;
	}

	.identity {
		color: #ccc;
		display: block;
		font-size: 30rpx;
		text-align: right;
	}
</style>