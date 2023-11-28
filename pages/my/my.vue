<template>
	<view class="my">
		<view class="body" v-if="token">
			<view class="info">
				<view class="info_name">
					<text class="info_name">{{user.name}}</text>
					<text>园区：{{park}}</text>
					<text v-if="hasMember && type === 0 ">会员到期时间：{{user.expiration}}</text>
				</view>
				<view class="info_cnt">
					<image :src="user.avatarUrl" mode="" class="info_img"></image>
					<image src="../../static/VIP6.png" class="vip" mode="" v-if="hasMember && type === 0 "></image>
					<text class="info_name">{{user.nickName}}</text>
					<button size="mini" plain @click="member" v-if="type === 0 && !hasMember">开通会员</button>
				</view>
			</view>
			<view class="list">
				<uni-list>
					<uni-list-item showArrow :extra-icon="extraIcon" :show-extra-icon="true" :to="`./info/info`"
						title="详细信息" />
					<uni-list-item showArrow :extra-icon="extraIcon0" :show-extra-icon="true" :to="`./readLog/readLog`" v-if="type == 0"
						title="借阅记录" />
					<uni-list-item showArrow :extra-icon="extraIcon1" :show-extra-icon="true" clickable v-if="type != 0"
						@click="dialogToggle('info')" title="退出登录" />
				</uni-list>
			</view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="再想想" confirmText="退出" title="通知" content="是否退出登录!"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
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
	export default {
		data() {
			return {
				name: "名字",
				park: "",
				avatar: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
				extraIcon: {
					size: '22',
					type: 'person'
				},
				extraIcon0: {
					size: '22',
					type: 'wallet'
				},
				extraIcon1: {
					size: '22',
					type: 'close'
				},
				token: "",
				type: "",
				user: "",
				kindergartenId: "",
				hasMember:false
			}
		},
		onLoad() {
			let that = this
			that.token = uni.getStorageSync('token')
			that.type = uni.getStorageSync('type')
			that.user = uni.getStorageSync('user')
			that.hasMember = uni.getStorageSync('hasMember')
			that.kindergartenId = uni.getStorageSync('kindergartenId')
			if(that.token){
				that.updateHasMember()
			}
			this.getPark()
		},
		onShow() {
			let that = this
			console.log(this.token)
			that.token = uni.getStorageSync('token')
			that.type = uni.getStorageSync('type')
			that.user = uni.getStorageSync('user')
			that.hasMember = uni.getStorageSync('hasMember')
			that.kindergartenId = uni.getStorageSync('kindergartenId')
			if(that.token){
				that.updateHasMember()
			}
			
			this.getPark()
		},
		methods: {
			//获取幼儿园
			getPark(){
				this.$http('/min-program/kindergarten/option','GET').then(res=>{
					let data = res
					 data.forEach(item=>{
						if(item.id === this.kindergartenId){
							console.log(item.name)
							this.park = item.name
						}
					})
				})
			},
			//开通会员
			member() {
				let that = this
				this.$http('/min-program/member/charge','POST').then(res=>{
					let order = res
					uni.requestPayment({
						provider: "wxpay",
						appId: order.appId,
						nonceStr: order.nonceStr,
						package: order.packageValue,
						paySign: order.paySign,
						signType: order.signType,
						timeStamp: order.timeStamp,
						success: function(res) {
							console.log(res, '============success=====res')
							uni.setStorageSync('hasMember',true)
							that.hasMember = true
							that.updateHasMember()
							// that.getMember()
							uni.showToast({
								title: '开通成功！'
							});
						},
						complete: function(e) {
							console.log(e, '========completecomplete')
						}
					})
				})
			},
			//获取会员状态
			updateHasMember(){
				let that = this
				this.$http('/min-program/member/info','GET').then(res=>{
					that.user = res.user
					uni.setStorageSync('memberId',res.memberId)
					console.log(res.expiration,'===========res.expiration')
					that.user.expiration = new Date(res.expiration).Format('yyyy-MM-dd')
				})
			},
			//获取会员详情
			getMember(){
				let that = this
				let id = uni.getStorageSync('user').id
				this.$http(`/min-program/member/${id}`,'GET').then(res=>{
					console.log(res,'========获取会员详情')
				})
			},
			onClick() {
				console.log(11111)
			},
			dialogToggle() {
				this.$refs.alertDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
				uni.showToast({
					icon: "none",
					title: '已取消'
				});
			},
			dialogConfirm() {
				console.log('点击确认')
				let that = this
				this.$http('/min-program/logout','GET').then(res=>{
					uni.clearStorage();
					uni.reLaunch({
						url: `../index/index`
					})
				})
			},
			goLogin() {
				uni.navigateTo({
					url: `../login/login`
				})
			}
		}
	}
</script>

<style>
	.info {
		width: 100%;
		height: 350rpx;
		background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.info_name {
		font-size: 34rpx;
		}
		.info_cnt{
			position: relative;
		}
	.info_cnt,
	.info_name {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.info_img {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
		border-radius: 50%;
	}

	.info_name {
		margin-bottom: 10rpx;
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
	.vip{
		    top: 70rpx;
		    position: absolute;
		    width: 40rpx;
		    height: 40rpx;
		    left: 75rpx;
		
	}
</style>