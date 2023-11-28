<template>
	<view class="books">
		<view class="search">
			<uni-search-bar class="search_inp" radius="5" placeholder="请输入图书名称" clearButton="auto" cancelButton="none"
				@confirm="search" />
			<button type="primary" size="mini" @click="scanCode">扫码入库</button>
		</view>
		<view v-for="(item,index) in bookList" :key="index" class="list">
			<view class="card_cover" slot='cover'>
				<image :src="item.cover" class="cover"></image>
			</view>
			<view class="card_body">
				<uni-tag :text="`${item.pages}页`" :mark="true" type="success"></uni-tag>
				<uni-title :title="item.name" type="h3"></uni-title>
				<uni-tag text="删除" type="error" @click="deleteBook(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookList: [],
				pageNum:1,
				pageSize:10,
				classId:''
				

			}
		},
		onLoad(e) {
			this.classId = e.classId
			console.log()
			if(e.classId){
				this.getList('',this.classId)
			}else{
				this.getList()
			}
		
		},
		onShow(){
			if(this.classId){
				this.getList('',this.classId)
			}else{
				this.getList()
			}
			// this.getLists()
			this.pageSize = 10
		},
		methods: {
			scanCode(){
				let that = this
				uni.scanCode({
					success: function (res) {
						console.log(res,'========扫码借书')
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						let data = {
							// classId:item.clBum,
							kindergarten:uni.getStorageSync('kindergartenId'),
							// studentId:item.id,
							isbn:res.result
							// isbn:'11'
						}
						that.$http('/min-program/book/borrow','POST',data).then(res=>{
							uni.showToast({
								title: `借书成功！`
							})
							that.getList()
						})
						
					}
				});
			},
			search(e){
				this.getList(e.value)
			},
			deleteBook(item) {
				console.log(item)
				this.$http(`/min-program/book/${item.id}`,'DELETE').then(res=>{
					this.getList()
					this.pageNum = 1
					this.pageSize = 10
				})
				// uni.navigateTo({
				// 	url: "./teacher/teacher"
				// })
			},
			// getLists(){
			// 	let data = {
			// 		kindergartenId:uni.getStorageSync('kindergartenId'),
			// 	}
			// 	this.$http('/min-program/book/borrow','GET',data).then(res=>{
			// 		console.log(res,'==========daishijian')
			// 	})
			// },
			getList(name='',classId=''){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId'),
					pageNum:1,
					pageSize:this.pageSize,
					name,
					classId
				}
				this.$http('/min-program/book/list','GET',data).then(res=>{
					this.bookList = res.records
				})
				// this.$http('/min-program/book/park/borrow','GET',data).then(res=>{
				// 	this.bookList = res.records
				// })
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
		width: 70%;
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
		line-height: 80rpx;
		padding-left: 30rpx;
	}
</style>