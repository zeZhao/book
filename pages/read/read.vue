<template>
	<view class="read">
		<view class="body" v-if="token">
			<view class="search">
				<uni-search-bar class="search_inp" radius="5" placeholder="请输入图书名称" clearButton="auto"
					cancelButton="none" @confirm="search" />
				<button type="primary" size="mini" @click="scanCode">扫码</button>
			</view>
			<view class="control">
				<scroll-view scroll-x="true">
					<uni-segmented-control class="control_title" :current="current" :values="items"
						@clickItem="onClickItem" styleType="text" activeColor="#007aff"></uni-segmented-control>
				</scroll-view>
				<view class="content">
					<view class="bookList">
						<view v-for="(item,index) in bookList" :key="index" class="list">
							<image :src="item.cover" mode="" class="list_img"></image>
							<text class="list_name">{{item.name}}</text>
							<button type="primary" size="mini" class="list_btn" plain="true"
								@click="goDetail(item)">阅读</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="login" v-else>
			<view class="noLogin">
				<image src="../../static/noLogin.jpg" mode="" class="noLogin_img"></image>
			</view>
			<view type="default" class="noLogin_btn" @click="goLogin">点击登录</view>
		</view>



	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex' //引入mapState
	export default {
		data() {
			return {
				items: ['国内经典', '性格养成', '习惯养成', '数学百科', '人际交往', '情绪管理'],
				control: [],
				current: 0,
				controlId: '',
				bookList: [],
				token: "",
				kindergartenId: "",
				pageSize: 10
			}
		},
		onLoad() {
			this.pageSize = 10
		},
		onShow() {
			let that = this
			that.pageSize = 10
			that.token = uni.getStorageSync("token")
			that.kindergartenId = uni.getStorageSync("kindergartenId")
			if(that.token){
				that.getCategory()
			}
			
		},
		methods: {
			search(res) {
				// uni.showToast({
				// 	title: '搜索：' + res.value,
				// 	icon: 'none'
				// })

				this.getBookList(this.control[this.current].id, res.value)
			},
			scanCode() {
				let that = this
				let hasMember = uni.getStorageSync('hasMember')
				if (hasMember) {
					uni.scanCode({
						success: function(res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							let data = {
								classId: uni.getStorageSync('user').classId,
								kindergarten: uni.getStorageSync('user').kindergarten,
								studentId: uni.getStorageSync('user').id,
								// isbn:res.result
								isbn: '9787558533358'
							}
							that.$http('/min-program/book/borrow', 'POST', data).then(res => {
								uni.showToast({
									title: `请前往借阅记录查看~`,
									duration: 3000
								})
							})
						}
					});
				} else {
					uni.showToast({
						title: '请先开通会员',
						icon: 'none'
					})
				}

			},
			onClickItem(e) {
				console.log(e, '=======tab')
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					this.pageSize = 10
					this.getBookList(this.control[e.currentIndex].id)
				}
			},
			goDetail(item) {
				let hasMember = uni.getStorageSync('hasMember')
				let type = uni.getStorageSync('type')
				if (hasMember || type != 0) {
					let bookInfo = JSON.stringify(item)
					uni.navigateTo({
						url: `./bookDetail/bookDetail?item=${encodeURIComponent(bookInfo)}`
					})
				} else {
					uni.showToast({
						title: '请先开通会员',
						icon: 'none'
					})
				}

			},
			goLogin() {
				uni.navigateTo({
					url: `../login/login`
				})
			},
			getCategory() {
				let that = this
				this.$http('/min-program/book-category/option', 'GET', ).then(res => {
					that.items = []
					that.control = res
					that.control.forEach(item => {
						that.items.push(item.name)
					})
					that.getBookList(that.control[0].id)
				})
			},
			getBookList(categoryId = 0, name = "") {
				let that = this
				let data = {
					categoryId,
					kindergartenId: this.kindergartenId,
					name,
					pageNum: 1,
					pageSize: this.pageSize
				}
				this.$http('/min-program/book/list', 'GET', data).then(res => {
					that.bookList = res.records
				})
			},
			onReachBottom() {
				// this.pageNum +=1
				this.pageSize += 10
				this.getBookList(this.control[this.current].id)
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

	.control_title {
		/* width: 800px; */
	}

	::v-deep .segmented-control {
		width: fit-content;
	}

	::v-deep .segmented-control__item {
		min-width: 200rpx;
		padding: 10rpx 19rpx;
	}

	.content {
		padding: 40rpx;
		background: #e9e9eb;
	}

	.bookList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.list {
		width: 38%;
		display: flex;
		flex-direction: column;
		/* border: 1px solid #000000; */
		margin-bottom: 40rpx;
		background: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
	}

	.list_img {
		width: 100%;
		height: 250rpx;
	}

	.list_name {
		display: block;
		margin: 20rpx 0;
		font-size: 14px;
		text-align: left;
		font-weight: bold;
	}

	.list_btn {
		margin-left: 0px;
	}

	.noLogin {
		width: 80%;
		height: 450rpx;
		margin: 40rpx auto;
	}

	.noLogin_img {
		width: 100%;
		height: 100%;
	}

	.noLogin_btn {
		border-radius: 30rpx;
		width: 400rpx;
		height: 100rpx;
		border: 1px solid;
		text-align: center;
		line-height: 100rpx;
		margin: 150rpx auto;
		color: #FF5F15;
	}
</style>