<template>
	<view class="ranking">
		<view class="body" v-if="token">
			<view v-if="studentList.length>0">
				<view v-for="(item,index) in studentList" :key="index">
					<uni-list>
						<uni-list-item>
							<template v-slot:header>
								<view class="slot-box">
									<image class="slot-image" v-if="index === 0" src="../../static/one.png" mode="widthFix">
									</image>
									<image class="slot-image" v-else-if="index === 1" src="../../static/two.png"
										mode="widthFix"></image>
									<image class="slot-image" v-else-if="index === 2" src="../../static/three.png"
										mode="widthFix"></image>
									<image class="slot-image" v-else src="" mode="widthFix"></image>
									<image class="slot-image" :src="item.head" mode="widthFix"></image>
								</view>
							</template>
							<template v-slot:body>
								<text class="slot-box slot-text color">{{item.name}}</text>
							</template>
							<template v-slot:footer>
								<text class="slot-box slot-text" style="margin-right: -40px;"
									>共借阅{{item.count}}本</text>
							</template>
						</uni-list-item>
					</uni-list>
				</view>
			</view>
			<view v-if="studentList.length == 0" class="noData">
				暂时没有数据~
			</view>
		</view>

		<view class="login" v-else>
			<view class="noLogin">
				<image src="../../static/noLogin.jpg" mode="" class="noLogin_img"></image>
			</view>
			<view type="default" class="noLogin_btn"  @click="goLogin">点击登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				studentList: [
				// 	{
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "532",
				// }, {
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "432",
				// }, {
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "332",
				// }, {
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "232",
				// }, {
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "132",
				// }, {
				// 	photo: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				// 	name: "丁泽昭",
				// 	num: "32",
				// }, 
				],
				token:""
			}
		},
		onLoad() {
			let that = this
			console.log(this.token)
			that.token = uni.getStorageSync('token')
			
			if(that.token){
				this.getList()
			}
		},
		onShow(){
			let that = this
			that.token = uni.getStorageSync('token')
			if(that.token){
				this.getList()
			}
			
			
		},
		methods: {
			getList(){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId')
				}
				this.$http('/min-program/member/top20','GET',data).then(res=>{
					this.studentList = res
					console.log(res,'=======')
				})
			},
			color(index) {
				if (index === 0) {
					return 'one'
				} else if (index === 1) {
					return 'two'
				} else if (index === 2) {
					return 'three'
				} else {
					return ''
				}
			},
			goLogin(){
				uni.navigateTo({
					url: `../login/login`
				})
			}

		}
	}
</script>

<style>
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #94bcff;
		margin-right: 10px;
	}

	.color {
		color: #000000;
	}

	.one {
		color: red;
	}

	.two {
		color: blue;
	}

	.three {
		color: yellow;
	}
	.noData{
		text-align: center;
	}
	.noLogin,.noData {
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