<template>
	<view class="administrator">
		<uni-steps :options="list1" :active="active" active-color="#1aad19" />
		<view class="identity" v-if="active === 0">
			<button type="primary" @click="change('1')" size="mini">园长</button>
			<button type="primary" @click="change('2')" size="mini">老师</button>
		</view>
		<view class="verify" v-if="active === 1">
			<!-- <uni-title>入园密码</uni-title> -->
			<view class="verify_item">
				<uni-easyinput v-model="name" placeholder="请输入姓名" style="margin-bottom: 30rpx;"></uni-easyinput>
			</view>
			<view class="verify_item">
				<uni-data-select v-model="park" :localdata="parkList" @change="changeSelect" placeholder="请选择园区"
					style="margin-bottom: 30rpx;"></uni-data-select>
			</view>
			<view class="verify_item">
				<uni-easyinput type="password" v-model="password" placeholder="请输入园区密码"
					style="margin-bottom: 30rpx;"></uni-easyinput>

			</view>
			<view class="verify_item">
				<uni-data-select v-model="parkClass" :localdata="classList" placeholder="请选择班级"
					style="margin-bottom: 30rpx;" v-show="identity === '2'"></uni-data-select>
			</view>
			<view class="button" @click="next">
				<uni-icons type="weixin" size="30"></uni-icons>微信登录
			</view>
		</view>
		<view class="accredit">

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,

				list1: [{
					title: '选择身份'
				}, {
					title: '登录校验'
				}],
				parkList: [{
						value: 0,
						text: "蓝天幼儿园"
					},
					{
						value: 1,
						text: "朝阳花语幼儿园"
					},
					{
						value: 2,
						text: "润天幼儿园"
					},
				],
				classList: [{
					value: 0,
					text: "小班"
				}, ],
				//身份
				identity: "",
				name: "",
				park: "",
				password: "",
				parkClass: "",
				code: "",
				avatarUrl: "",
				nickName: "",
				signature: ""
			}
		},
		onLoad() {
			let that = this
			uni.login({
				success: function(res) {
					that.code = res.code
					uni.setStorage({
						key: 'code',
						data: res.code
					})

				}
			})
			this.getKindergarten()
			// this.getClassGrade()

		},
		onShow(){
			let that = this
			uni.login({
				success: function(res) {
					that.code = res.code
					uni.setStorage({
						key: 'code',
						data: res.code
					})
			
				}
			})
			this.getKindergarten()
		},
		methods: {
			//获取幼儿园
			getKindergarten() {
				let that = this
				this.$http('/min-program/kindergarten/option', 'GET').then(res => {
					console.log(res, '======获取幼儿园')
					that.parkList = res
					that.parkList.forEach(item => {
						item.value = item.id
						item.text = item.name
					})
				})
			},

			//获取班级
			getClassGrade(kindergartenId) {
				let that = this
				this.$http('/min-program/class-grade/option', 'GET', {
					kindergartenId
				}).then(res => {
					that.classList = res
					that.classList.forEach(item => {
						item.value = item.id
						item.text = item.name
					})
				})
			},

			change(type) {
				let that = this
				if (this.active < this.list1.length - 1) {
					this.active += 1
				} else {
					this.active = 0
				}
				this.identity = type
				uni.getUserProfile({
					desc: "登录",
					success: function(res) {
						console.log(res, '=========getUserProfile')
						that.avatarUrl = res.userInfo.avatarUrl
						that.nickName = res.userInfo.nickName
						that.signature = res.signature
						uni.setStorage({
							key: 'info',
							data: res.userInfo
						})

					}
				})
			},
			changeSelect(e) {
				console.log("e:", e);
				this.getClassGrade(e)
			},
			next() {
				if (this.park !== '' && this.password) {
					if (this.identity === '2') {
						if (this.parkClass !== '') {
							this.loginSubmit()
						} else {
							uni.showToast({
								title: '请选择班级',
								icon: 'error'
							})
						}
					} else {
						this.loginSubmit()
					}
				} else {
					uni.showToast({
						title: '请填写完毕',
						icon: 'error'
					})
				}

			},
			//登录请求
			loginSubmit() {
				let that = this
				let data = {
					code: that.code,
					id: that.park,
					password: that.password,
					type: that.identity,
					avatarUrl: that.avatarUrl,
					nickName: that.nickName,
					signature: that.signature,
					name: that.name,
					classId: that.parkClass,
				}
				this.$http('/min-program/park/login', 'POST', data).then(res => {
					uni.setStorageSync('hasMember', false);
					uni.setStorageSync('type', that.identity);
					uni.setStorageSync('token', res.token);
					uni.setStorageSync('kindergartenId', res.kindergartenId);
					uni.setStorageSync('user', res.user);
					uni.showToast({
						title: '正在进入园区~',
						icon: 'loading'
					})
					uni.reLaunch({
						url: "../index/index"
					})
				}).catch(e=>{
					uni.login({
						success: function(res) {
							that.code = res.code
							uni.setStorage({
								key: 'code',
								data: res.code
							})
					
						}
					})
					console.log(e,'===')
				})
			},

		}
	}
</script>

<style>
	.administrator {
		padding: 40rpx;
	}

	.identity {
		margin-top: 50rpx;
	}

	.identity button {
		width: 300rpx;
		margin: 50rpx auto;
		display: block;
	}

	.verify {
		padding: 50rpx;
	}

	.verify_item {
		margin-bottom: 40rpx;
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		background: gray;
		background: #1aad19;
		color: #ffffff;
		border-radius: 10rpx;
	}
</style>