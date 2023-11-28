<template>
	<view class="class">
		<view class="search">
			<uni-search-bar class="search_inp" radius="5" placeholder="请输入班级名称" clearButton="auto" cancelButton="none"
				@confirm="search" />
			<button type="primary" size="mini" @click="append('append')">新增</button>
		</view>
		<view class="list">
			<view v-for="(item,index) in classList" :key="index" class="list_box">
				<uni-title :title="item.name"></uni-title>
				<view class="amount">
					<text>编号：{{item.id}}</text>
					<text>会员：{{item.memberNum}}</text>
					<text>学生：{{item.studentNum}}</text>
					<!-- <text>借阅：{{item.borrowNum}}</text> -->
				</view>
				<view class="time">
					毕业时间：<text class="timeColor">{{item.graduationTime}}</text>
				</view>
				<view class="handle">
					<uni-tag text="书库" type="primary" class="tag" @click="goBook(item)"></uni-tag>
					<uni-tag text="学生" type="success" class="tag" @click="goStudent(item)"></uni-tag>
					<uni-tag text="修改" type="warning" class="tag" v-if="type == 1" @click="goEdit('edit',item)"></uni-tag>
					<uni-tag text="删除" type="error"  v-if="type == 1" @click="remove(item)"></uni-tag>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classList:[
					// {
					// 	name:"小豆（1）班",
					// 	member:"8",
					// 	student:"9",
					// 	borrow:"102",
					// 	time:"2022-09-08",
					// }
				],
				pageSize: 10,
				type: 1

			}
		},
		onLoad() {
			this.pageSize = 10
		},
		onShow() {
			this.getList()
			this.pageSize = 10
			this.type = uni.getStorageSync('type')
			console.log(this.type,'===============type')
		},
		methods: {
			getList(name=''){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId'),
					name,
					pageNum: 1,
					pageSize:this.pageSize
				}
				this.$http('/min-program/class-grade/option','GET',data).then(res=>{
					console.log(res,'===========')
					this.classList = res
				})
			},
			search(e){
				this.getList(e.value)
			},
			goBook(item){
				console.log(item)
				uni.navigateTo({
					url: `../books/books?classId=${item.id}`
				})
			},
			goStudent(item){
				console.log(item)
				let json = JSON.stringify(item)
				uni.navigateTo({
					url: `../student/student?item=${json}`
				})
			},
			append(type){
				uni.navigateTo({
					url: `./edit/edit?type=${type}`
				})
			},
			goEdit(type,item){
				console.log(item)
				let json = JSON.stringify(item)
				uni.navigateTo({
					url: `./edit/edit?type=${type}&item=${json}`
				})
			},
			remove(item){
				const {student} = item
				if(student > 0){
					uni.showToast({
						icon: "none",
						title: '班级还有学生！'
					});
				}else{
					this.$http(`/min-program/class-grade/${item.id}`,'DELETE').then(res=>{
						this.pageSize = 10
						this.getList()
						
					})
					uni.showToast({
						icon: "none",
						title: '删除成功！'
					});
				}
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
	.search_inp {
		width: 80%;
		display: inline-block;
		vertical-align: super;
	}
	.list_box{
		width: 80%;
		margin: 30rpx auto;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		border: 1px solid #ebeef5;
		box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
		    padding: 30rpx;
		    line-height: 50rpx;
			border-radius: 30rpx;
	}
	.amount{
		font-size: 30rpx;
		color: #8f939c;
		    display: flex;
		    justify-content: space-between;
		
	}
	.time{
		font-size: 26rpx;
		color: #8f939c;
		    margin: 20rpx 0;
	}
	.timeColor{
		color: #18bc37;
	}
	.handle{
		text-align: right;
	}
	.tag{
		margin-right: 20rpx;
	}
</style>