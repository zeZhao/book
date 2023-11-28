<template>
	<view class="readLog">
		<view class="search">
			<uni-search-bar class="search_inp" radius="5" placeholder="请输入图书名称" clearButton="auto" cancelButton="none"
				@confirm="search" />
		</view>
		<view v-for="(item,index) in bookList" :key="index" class="list">
			<view class="card_cover" slot='cover'>
				<image :src="item.cover" class="cover"></image>
			</view>
			<view class="card_body" @click="goDetail(item)">
				<!-- <uni-tag :text="`${item.pages}页`" :mark="true" type="success"></uni-tag> -->
				<uni-title :title="item.name" type="h3"></uni-title>
				<p class="bookInfo">作者：{{item.author}}</p>
				<p class="bookInfo">状态：<uni-tag :text="item.borrowStatus == 0 ? '借阅中' : '已归还'" :type="item.borrowStatus == 0 ? 'success' : 'warning'" inverted size="small"></uni-tag></p> 
				<p class="bookInfo">借书时间：{{item.borrowTime}}</p>
				<!-- <uni-tag text="还书" type="warning" @click="returning(item)"></uni-tag> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookList: [],
				pageSize:10,
			}
		},
		onLoad(e) {
			this.pageSize = 10
			this.getList()
		},
		onShow(){
			this.pageSize = 10
			this.getList()
			
		},
		methods: {
			search(e){
				this.getList(e.value)
			},
			goDetail(item){
				let bookInfo = JSON.stringify(item)
				uni.navigateTo({
					url: `../../read/bookDetail/bookDetail?item=${encodeURIComponent(bookInfo)}`
				})
			},
			//还书
			returning(item){
				let data = {
					classId:uni.getStorageSync('user').classId,
					kindergarten:uni.getStorageSync('user').kindergarten,
					studentId:uni.getStorageSync('user').id,
					isbn:item.isbn
				}
				this.$http('/min-program/book/returning','POST',data).then(res=>{
					uni.showToast({
						title: `还书成功！`
					})
					this.getList()
				})
			},
			getList(name=''){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId'),
					pageNum:1,
					pageSize:this.pageSize,
					name,
					classId:uni.getStorageSync('user').classId,
					studentId:uni.getStorageSync('memberId')
				}
				this.$http('/min-program/book/borrow','GET',data).then(res=>{
					console.log(res,'============')
					this.bookList = res.records
					this.bookList.forEach(item=>{
						if(item.borrowTime){
							item.borrowTime = new Date(item.borrowTime).Format('yyyy-MM-dd')
						}
					})
				})
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
		width: 100%;
		display: inline-block;
		vertical-align: super;
	}

	.list {
		display: flex;
		align-items: center;
		    margin: 20rpx;
	}

	.card_cover {
		width: 30%;
		height: 250rpx;
	}

	.cover {
		width: 100%;
		height: 100%;
	}

	.card_body {
		display: flex;
		flex-direction: column;
		line-height: 50rpx;
		padding-left: 30rpx;
	}
	.bookInfo{
		font-size: 30rpx;
	}
</style>