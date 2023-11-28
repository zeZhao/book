<template>
	<view class="content">
		<uni-swiper-dot :info="info" :current="current" field="content" :mode="mode">
			<swiper class="swiper-box" @change="change" autoplay="true">
				<swiper-item v-for="(item ,index) in info" :key="index" class="swiper_item">
					<view class="swiper-item">
						<image :src="item.content" mode="" class="swiper_img"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="config">
			<uni-title type="h1" title="免费借阅 " class="config_title"></uni-title>
			<view class="bookList">
				<view v-for="(item,index) in bookList" :key="index" class="list">
					<image :src="item.cover" mode="" class="list_img"></image>
					<text class="list_name">{{item.name}}</text>
					<button type="primary" size="mini" class="list_btn" plain="true"
						@click="goBookdetail(item)">阅读</button>
				</view>
			</view>

		</view>
		<view class="config" v-if="type !== 0 && token">
			<uni-title type="h1" title="控制台 " class="config_title"></uni-title>
			<view class="config_handle">
				<view class="list" @click="goDetail(item,index)" v-for="(item,index) in configList" :key="index">
					<image :src="item.icon" mode="" class="list_img"></image>
					<uni-title type="h5" :title="item.name" class="list_name"></uni-title>
				</view>
			</view>
		</view>
		<view class="config" v-if="type !== 0 && token">
			<uni-title type="h1" title="统计" class="config_title"></uni-title>
			<view class="config_handle">
				<view v-for="(item,index) in statisticsList" :key="index" class="list">
					<image :src="item.icon" mode="" class="list_img"></image>
					<uni-title type="h5" :title="item.num + item.name" class="list_name"></uni-title>
				</view>
			</view>
		</view>
		<uni-popup ref="popup">
			<view class="popupWrap">
				<view class="popupTitle">
					天天阅读隐私政策提示
				</view>
				<view class="popupTxt">
					在你使用【天天阅读借阅系统】之前，请仔细阅读<text class="blueColor"
						@click="handleOpenPrivacyContract">《天天阅读借阅系统隐私保护指引》</text>。如你同意《天天阅读借阅系统隐私保护指引》,请点击“同意”开始使用【天天阅读借阅系统】。
				</view>
				<view class="popupBot">
					<button id="disagree-btn" type="default" size="mini" @click="handleDisagree">拒绝</button>
					<button id="agree-btn" type="primary"  size="mini" open-type="agreePrivacyAuthorization"
						@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	export default {
		data() {
			return {
				title: 'Hello',
				info: [{
						content: 'https://tiantianhuiben.cc/image/4f979849-c8c9-46f8-92df-dd74eb01df88.png'
					}, {
						content: 'https://tiantianhuiben.cc/image/41c04a5d-c01b-4cfb-8d7e-2e4fd54fd076.png'
					},
					{
						content: 'https://tiantianhuiben.cc/profile/2023/08/21/1_20230821161957A702.png'
					},
					{
						content: 'https://tiantianhuiben.cc/profile/2023/08/21/2_20230821162116A703.jpg'
					},
					{
						content: 'https://tiantianhuiben.cc/profile/2023/08/21/3_20230821162204A704.jpg'
					}
				],
				current: 0,
				mode: 'round',
				teacher: [1, 3],
				handleList: [{
						num: 1,
						icon: "../../static/xuesheng.png",
						name: "学生列表"
					}, {
						num: 2,
						icon: "../../static/banji.png",
						name: "班级列表"
					}, {
						num: 3,
						icon: "../../static/tushu.png",
						name: "园区图书"
					}, {
						num: 4,
						icon: "../../static/laoshi.png",
						name: "老师列表"
					},
					// {
					// 	num:5,
					// 	icon: "../../static/jieyue.png",
					// 	name: "借阅记录"
					// },
					// {
					// 	num:6,
					// 	icon: "../../static/sunhuai.png",
					// 	name: "绘本损坏"
					// }, 
					{
						num: 7,
						icon: "../../static/jiaofei.png",
						name: "缴费记录"
					},
				],
				statisticsList: [
					// 	{
					// 	icon: "../../static/huiben.png",
					// 	name: "(绘本)",
					// 	num: 666
					// }, 

					{
						icon: "../../static/jieshu.png",
						name: "(借阅)",
						num: 1024
					}, {
						icon: "../../static/xuesheng1.png",
						name: "(学生)",
						num: 719
					}, {
						icon: "../../static/huiyuan.png",
						name: "(会员)",
						num: 100
					},
				],
				bookList: [{
						cover: "http://tiantianhuiben.cc/profile/2023/08/17/1692245625712_20230817121405A698.png",
						isbn: '9787558533358',
						pages: '29',
						name: "好奇的小栗子",
						briefIntro: "小栗子是一只岩松鼠。他对什么都很好奇，什么东西喜欢塞进嘴巴里。 只有吃的东西才能放到嘴里 妈妈刚说完就后悔了.......",
						author: "张子剑",
						path: "http://www.yuyaotech.cn/book/attachment/mp3/2019/0505020.mp3"
					},
					{
						cover: "http://tiantianhuiben.cc/profile/2023/08/17/1692245427941_20230817121052A697.png",
						isbn: '9787558533365',
						pages: '38',
						name: "踏着红霞采药去",
						briefIntro: "在遥远的白民国，居住着一位老医生。天还没亮，老医生就上山采药去了......",
						author: "张子剑",
						path: "http://www.yuyaotech.cn/book/attachment/mp3/2019/0505019.mp3"
					},
					{
						cover: "https://tiantianhuiben.cc/image/3d39b886-3bdb-4f84-abac-c3e1dfbf3e8f.jpg",
						isbn: '93258729523',
						pages: '32',
						name: "温暖的表达",
						briefIntro: "当你打开《温暖的表达》这本书时，你会发现一系列温馨、感人的故事，这些故事都是从作者亲身经历和他人身上汲取灵感而来。这本书不仅是一本故事集，更是一本启迪心灵的读物，它会让你重新审视人生，重新认识自己和身边的人。每一篇故事都像一束阳光，温暖着你的心灵，让你感受到生命中最美好的东西。如果你正在寻找一本可以让你感到温暖和舒适的书籍，那么《温暖的表达》绝对值得一读。",
						author: "檽米a",
					},
					{
						cover: "https://tiantianhuiben.cc/image/5d733e7c-2d5c-4a0c-9bea-ad3db1abddfc.jpg",
						isbn: '98672672354',
						pages: '22',
						name: "梦中的太空飞船",
						briefIntro: "《梦中的太空飞船》是一本适合青少年阅读的科幻小说。这本书讲述了一个少年的冒险故事，他在一个梦中发现了一艘神秘的太空飞船，并开始了一段穿越宇宙的旅程。在这个旅程中，他遇到了各种各样的外星生物，也发现了自己内心深处的勇气和力量。这本书不仅仅是一部科幻小说，更是一本关于成长和勇气的故事。如果你喜欢科幻小说和冒险故事，那么《梦中的太空飞船》一定会让你爱不释手。",
						author: "泽峰"
					},

				],
				token: "",
				type: 0,
				configList: [],
				showPrivacy: false //同意获取隐私

			}
		},
		onLoad() {
			uni.hideTabBar()
			this.$refs.popup.open('center')
			// wx.getPrivacySetting({
			// 	success: res => {
			// 		console.log(
			// 			res
			// 		) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
			// 		if (res.needAuthorization) {
			// 			this.$refs.popup.open('center')
			// 			// 需要弹出隐私协议
			// 			// this.setData({
			// 			// 	showPrivacy: true
			// 			// })
			// 		} else {
			// 			// 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
			// 			this.created()
			// 			console.log(11111111)
			// 		}
			// 	},
			// 	fail: () => {},
			// })


		},
		onShow() {
			let that = this
			that.token = uni.getStorageSync('token')
			that.type = uni.getStorageSync('type')
			if (that.token && that.type) {
				this.getStatistics()
			}
			this.getClassList()
		},
		methods: {
			created() {
				let that = this
				that.token = uni.getStorageSync('token')
				that.type = uni.getStorageSync('type')
				if (that.token && that.type) {
					this.getStatistics()
				}
				console.log(that.type, '================type')
				if (that.type == 2) {
					that.configList = []
					that.handleList.forEach(item => {
						if (that.teacher.includes(item.num)) {
							that.configList.push(item)
						}
					})
				} else if (that.type == 1) {
					that.configList = that.handleList
				}
			},
			handleDisagree(e) {
				this.$refs.popup.close()
				this.showPrivacy = true
				uni.hideTabBar()
			},
			handleAgreePrivacyAuthorization() {
				// 用户同意隐私协议事件回调
				let that = this
				that.showPrivacy = false
				// 用户同意隐私协议事件回调
				// 用户点击了同意，之后所有已声明过的隐私接口和组件都可以调用了
				this.$refs.popup.close()
				that.created()
				uni.showTabBar()
			},
			handleOpenPrivacyContract() {
				// 打开隐私协议页面
				wx.openPrivacyContract({
					success: () => {
						console.log('打开成功！')
					}, // 打开成功
					fail: () => {
						console.log('打开失败！')
					},
				})
			},
			//获取班级
			getClassList() {
				let data = {
					kindergartenId: uni.getStorageSync('kindergartenId')
				}
				this.$http('/min-program/class-grade/option', 'GET', data).then(res => {
					store.commit('setClassList', res)
					console.log(res, '=====获取班级')
				})
			},
			//获取统计
			getStatistics() {
				let data = {
					kindergartenId: uni.getStorageSync('kindergartenId')
				}
				this.$http('/min-program/member/statistics', 'GET', data).then(res => {
					// this.statisticsList[0].num = res.kindergartenCount
					this.statisticsList[0].num = res.borrowCount
					this.statisticsList[1].num = res.studentCount
					this.statisticsList[2].num = res.memberCount
				})
			},
			goBookdetail(item) {
				if(this.showPrivacy){
					this.$refs.popup.open('center')
					return
				}
				let bookInfo = JSON.stringify(item)
				uni.navigateTo({
					url: `../read/bookDetail/bookDetail?item=${bookInfo}`
				})
			},
			change(e) {
				this.current = e.detail.current;
			},
			goDetail(item, index) {
				if(this.showPrivacy){
					this.$refs.popup.open('center')
					return
				}
				if (item.name === '学生列表' && item.num === 1) {
					uni.navigateTo({
						url: "./student/student"
					})
				} else if (item.name === '园区图书' && item.num === 3) {
					uni.navigateTo({
						url: "./books/books"
					})
				} else if (item.name === '老师列表' && item.num === 4) {
					uni.navigateTo({
						url: "./teacher/teacher"
					})
				} else if (item.name === '班级列表' && item.num === 2) {
					uni.navigateTo({
						url: "./class/class"
					})
				} else if (item.name === '缴费记录' && item.num === 7) {
					uni.navigateTo({
						url: "./payment/payment"
					})
				}
				// console.log(item)
				// let bookInfo = JSON.stringify(item)

			}

		},
		

	}
</script>

<style>
	.swiper_item {
		background-color: green;
	}

	.swiper_img {
		width: 100%;
		height: 350rpx;
		display: inline-block;
	}

	.config_title {
		padding: 50rpx 10rpx 30rpx;
		display: block;
	}

	.config_handle {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.config_handle .list {
		width: 25%;
		height: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 50rpx;
	}

	.list .list_img {
		width: 100rpx;
		height: 100rpx;
	}

	.bookList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.bookList .list {
		width: 38%;
		display: flex;
		flex-direction: column;
		/* border: 1px solid #000000; */
		/* margin-bottom: 40rpx; */
		background: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
	}

	.bookList .list .list_img {
		width: 100%;
		height: 250rpx;
	}

	.bookList .list .list_name {
		display: block;
		margin: 20rpx 0;
		font-size: 14px;
		text-align: left;
		font-weight: bold;
	}

	.bookList .list .list_btn {
		margin-left: 0px;
	}

	.popupWrap {
		width: 540rpx;
		box-sizing: border-box;
		padding: 42rpx;
		background: white;
		border-radius: 30rpx;

	}

	.blueColor {
		color: rgba(39, 152, 240, 1);
	}
	.popupTitle{
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
	}
	.popupTxt {
		line-height: 48rpx;
		font-size: 30rpx;
		    padding: 20rpx;
	}

	.popupBot {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 30rpx;
	}
</style>