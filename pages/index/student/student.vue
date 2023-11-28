<template>
	<view class="student">
		<view class="search">
			<uni-search-bar class="search_inp" radius="5" placeholder="请输入学生名称" clearButton="auto" cancelButton="none"
				@confirm="search" />
			<!-- <view class="total">
				<text>会员数：{{member}}</text>
				<text>学生数：{{student}}</text>
				<text>借阅数：{{borrowing}}</text>
			</view> -->

		</view>
		<view class="studentBox">
			<view v-for="(item,index) in studentList" :key="index" class="list">
				<view class="studentInfo">
					<image :src="item.head" mode="" class="studentInfo_img"></image>
					<image src="../../../static/VIP6.png" class="vip" mode="" v-if="item.hasMember"></image>
					<view class="content">
						<text class="content_name">{{item.name}}</text>
						<text class="content_info">班级：{{item.className}}</text>
						<text class="content_info" v-if="item.hasMember">到期时间：{{item.expiration}} </text>
					</view>
				</view>
				<view class="studentHandle">
					<uni-tag :inverted="true" text="扫码借书" type="success" @click="scanCode(item)"
						style="margin-right: 10rpx;" />
					<uni-tag :inverted="true" text="编辑" type="warning" @click="edit(item)" />
				</view>
				<view class="bookList" v-for="(boot,bootIn) in item.borrowList" :key="bootIn">
					<span class="name">{{boot.name}}</span>
					<span class="time">{{boot.borrowTime}}</span>
					<span class="btn" @click="returning(boot,item)">还书</span>
				</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="继续借阅" title="借阅" content="借过此书,是否继续借阅图书!"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>


	</view>
</template>

<script>
	import {
		Format
	} from "@/utils/plugin.js"
	export default {
		data() {
			return {
				member: 110,
				student: 115,
				borrowing: 22211,
				studentList: [
					// {
					// 	name: "丁泽昭",
					// 	class: "小（2）班",
					// 	createTime: "2023-12-06",
					// 	sculpture: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
					// 	isMember: false
					// },
					// {
					// 	name: "邹双林",
					// 	class: "小（4）班",
					// 	createTime: "2023-12-06",
					// 	sculpture: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
					// 	isMember: true
					// },
				],
				token: "",
				kindergartenId: "",
				clBum: "",
				classList: [],
				pageSize: 10,
				bookLog: [],
				temporaryData:{}
			}
		},
		onUnload() {},
		onLoad(option) {

			this.pageSize = 10
			let item = JSON.parse(option.item)

			if (option !== undefined && option !== null) {
				console.log(option, '=======1111=')
				this.clBum = item.id
			} else {
				if (uni.getStorageSync('type') == 2) {
					this.clBum = uni.getStorageSync('user').classId
				} else {
					this.clBum = ''
				}
			}
			this.getClassList()
		},
		onShow(option) {
			if (this.$store.state.classList.length > 0) {
				this.classList = this.$store.state.classList
				console.log(this.classList, '=====classList')
			}
			this.pageSize = 10
			let that = this
			that.token = uni.getStorageSync("token")
			that.kindergartenId = uni.getStorageSync("kindergartenId")
			that.getClassList()
			if (uni.getStorageSync('type') == 2) {
				this.clBum = uni.getStorageSync('user').classId
			}
			that.getList()


		},
		methods: {
			//获取班级
			getClassList() {
				let data = {
					kindergartenId: uni.getStorageSync('kindergartenId')
				}
				this.$http('/min-program/class-grade/option', 'GET', data).then(res => {
					this.classList = res
					console.log(res, '=====获取班级')
				})
			},
			getList(name = "", clBum = '') {
				let that = this
				let data = {
					kindergarten: that.kindergartenId,
					name,
					clBum: that.clBum,
					pageNum: 1,
					pageSize: this.pageSize,

				}
				this.$http('/min-program/member/list', 'GET', data).then(res => {
					that.studentList = res.records
					that.studentList.forEach(item => {
						if (item.clBum) {
							that.classList.forEach(el => {
								if (item.clBum == el.id) {
									item.className = el.name
								}
							})
						}
						if (item.expiration) {
							item.expiration = new Date(item.expiration).Format('yyyy-MM-dd')
						}
					})
				})
			},
			search(res) {
				// uni.showToast({
				// 	title: '搜索：' + res.value,
				// 	icon: 'none'
				// })
				this.getList(res.value)
			},
			//还书
			returning(boot, item) {
				console.log(boot,'=============borrowId:item.borrowId,')
				let data = {
					kindergarten: item.kindergarten,
					studentId: item.id,
					isbn: boot.isbn,
					borrowId:boot.borrowId
				}
				this.$http('/min-program/book/returning', 'POST', data).then(res => {
					uni.showToast({
						title: `还书成功！`
					})
					this.getList()
				})
			},
			async getBookLog(studentId, classId, result) {
				let statu = false
				let data = {
					kindergartenId: uni.getStorageSync('kindergartenId'),
					pageNum: 1,
					pageSize: 99999,
					name: '',
					classId,
					studentId,
				}
				await this.$http('/min-program/book/borrow', 'GET', data).then(res => {
					this.bookLog = res.records
					this.bookLog.forEach(item => {
						if (item.isbn == result) {
							console.log(item.borrowStatus,'=======item')
							if (item.borrowStatus != 0) {
								statu = true
								return
							}
						}
					})
				})
				return statu
			},
			dialogClose() {
				console.log('点击关闭')
				this.temporaryData = {}
				uni.showToast({
					icon: "none",
					title: '已取消'
				});
			},
			dialogConfirm() {
				console.log('点击确认')
				let that = this
				let item = that.temporaryData
				let datas = {
					classId: item.clBum,
					kindergarten: item.kindergarten,
					studentId: item.id,
					isbn: item.result
					// isbn:'5544'
				}
				that.$http('/min-program/book/borrow', 'POST', datas).then(res => {
					uni.showToast({
						title: `借书成功！`
					})
					that.getList()
					that.temporaryData = {}
				})
			},
			scanCode(item) {
				let that = this
				if (item.hasMember) {
					uni.scanCode({
						success: async function(res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							let isLog = await that.getBookLog(item.id, item.clBum, res.result)
							console.log(isLog)
							if (isLog) {
								that.temporaryData = item
								that.temporaryData.result = res.result
								that.$refs.alertDialog.open()
							} else {
								let datas = {
									classId: item.clBum,
									kindergarten: item.kindergarten,
									studentId: item.id,
									isbn: res.result
									// isbn:'9787534291500'
								}
								that.$http('/min-program/book/borrow', 'POST', datas).then(res => {
									uni.showToast({
										title: `借书成功！`
									})
									that.getList()
									that.temporaryData = {}
								})
							}
						}
					});
				} else {
					uni.showToast({
						title: `该学生未开通会员~`,
						icon: 'none'
					})
				}

			},
			edit(item) {
				console.log(item, '====item')
				let json = JSON.stringify(item)
				uni.navigateTo({
					url: `./edit/edit?item=${json}`
				})
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
	.total {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-weight: bold;
		font-size: 30rpx;
		margin-bottom: 20rpx;
		/* border-bottom: 1px solid #e9e9eb; */
	}

	.studentBox .list {
		padding: 20rpx 10rpx;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		border-top: 1px solid #e9e9eb;
		box-shadow: 0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
	}

	.studentInfo {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.studentInfo_img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.vip {
		top: 85rpx;
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		left: 65rpx;

	}

	.studentInfo .content {}

	.content_name {
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.content_info {
		font-size: 24rpx;
		color: #ccc;
		display: block;
		margin-bottom: 10rpx;
	}

	.content_time {
		color: #18bc37;
	}

	.studentHandle {
		display: flex;
		align-items: center;
	}

	.bookList {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: #F8F8F8;
		border: 1px solid #e9e9eb;
		padding: 10rpx;
		width: 90%;
		font-size: 30rpx;
		margin-top: 10rpx;
	}

	.bookList .name{
		width: 200rpx;
	}
	.bookList .btn {
		color: #DEB481
	}
</style>