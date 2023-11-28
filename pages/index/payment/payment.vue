<template>
	<view class="stack">
		<uni-search-bar class="search_inp" radius="5" placeholder="请输入学生名称" clearButton="auto" cancelButton="none"
			@confirm="search" />
		<view v-for="(item,index) in stackList" :key="index" class="list">
			<view class="img">
				<image :src="item.sculpture" mode="" class="studentInfo_img"></image>
				<image src="../../../static/VIP6.png" class="vip" mode=""></image>
			</view>
			<view class="cnt">
				<text class="name">姓名：{{item.studentName}}</text>
				<view>班级：{{item.className}}</view>
				<view>
					创建时间：{{item.updateTime}}
				</view>
				<view class="endTime">
					会员到期时间：{{item.expiration}}
				</view>
				<!-- <uni-tag :text="`套餐：${item.tancao}`" type="success" style="margin-right: 10rpx;"></uni-tag> -->
				<uni-tag :text="`价格：${item.price}元`" type="success"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				stackList: [
				// 	{
				// 	sculpture: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "dingzz",
				// 	banji: "小（3）班",
				// 	createTime: "2023-03-16 16:22:31",
				// 	endTime: "2024-03-16 16:22:31",
				// 	num: 198,
				// 	tancao: "1年借阅会员"
				// },
				// {
				// 	sculpture: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "dingzz",
				// 	banji: "小（3）班",
				// 	createTime: "2023-03-16 16:22:31",
				// 	endTime: "2024-03-16 16:22:31",
				// 	num: 198,
				// 	tancao: "1年借阅会员"
				// },
				],
				pageSize:10

			}
		},
		onLoad(){
			this.pageSize = 10
			this.getList()
		},
		onShow(){
			this.pageSize = 10
			this.getList()
		},
		methods: {
			//获取统计
			getList(name=''){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId'),
					pageNum: 1,
					pageSize: this.pageSize,
					name
				}
				this.$http('/min-program/member/charge/kindergarten/record','GET',data).then(res=>{
					this.stackList = res.records
					this.stackList.forEach(item=>{
						item.expiration = new Date(item.expiration).Format('yyyy-MM-dd')
						item.updateTime = new Date(item.updateTime).Format('yyyy-MM-dd')
					})
					console.log(res,'========jiaofei')
				})
			},
			search(res){
				console.log(res,'=======sousuo')
				this.getList(res.value)
			},
			onReachBottom() {
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
		justify-content: space-evenly;
		align-items: center;
		border-bottom: 1px solid #e9e9eb;
		    height: 290rpx;
			position: relative;
	}

	.studentInfo_img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.vip {
		top: 150rpx;
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		left: 110rpx;
	}
	.cnt{
		font-size: 32rpx;
		line-height: 46rpx;
	}
	.name{
		margin-right: 20rpx;
	}
	.endTime{
		color: #8f939c;
		margin-bottom: 20rpx;
	}
</style>