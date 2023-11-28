<template>
	<view class="login">
		<view class="verify">
			<!-- <uni-title type="h3">登录</uni-title> -->
			<uni-title type="h3" title="登录" class="verify_title"></uni-title>
			
			<view class="verify_item">
				<uni-easyinput v-model="name" placeholder="请输入姓名"  style="margin-bottom: 30rpx;"></uni-easyinput>
			</view>
			<view class="verify_item">
				<uni-data-select v-model="park" :localdata="parkList" @change="changeSelect"
					placeholder="请选择园区" style="margin-bottom: 30rpx;"></uni-data-select>
			</view>
			<view class="verify_item">
				<uni-data-select v-model="parkClass" :localdata="classList" placeholder="请选择班级"  style="margin-bottom: 30rpx;"></uni-data-select>
			</view>
			<!-- <button type="primary" @click="next"></button> -->
			<view class="button" @click="next">
				<uni-icons type="weixin" size="30"></uni-icons>微信登录
			</view>
			
		</view>
		<view class="accredit">
			<view class="admin" @click="goAdmin">
				管理员登录
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'	
	export default {
		data() {
			return {
				parkList: [
				],
				classList: [
				],
				identity: 0,
				name: "",
				park: "",
				parkClass: "",
				code:"",
				avatarUrl:"",
				nickName:"",
				signature:""
			}
		},
		onLoad() {
			let that = this
			uni.login({
				success: function(res){
					that.code = res.code
					uni.setStorage({
						key:'code',
						data:res.code
					})
					
					
				}
			});
			
			this.getKindergarten()
			// this.getClassGrade()
		},
		methods: {
			goAdmin(){
				uni.navigateTo({
					url: "./administrator"
				})
			},
			//获取幼儿园
			getKindergarten(){
				let that = this
				this.$http('/min-program/kindergarten/option','GET').then(res=>{
					console.log(res,'======获取幼儿园')
					that.parkList = res
					that.parkList.forEach(item=>{
						item.value = item.id
						item.text = item.name
					})
				})
			},
			//获取班级
			getClassGrade(kindergartenId){
				let that = this
				this.$http('/min-program/class-grade/option','GET',{kindergartenId}).then(res=>{
					that.classList = res
					that.classList.forEach(item=>{
						item.value = item.id
						item.text = item.name
					})
				})
			},
			changeSelect(e) {
				console.log("e:", e);
				this.getClassGrade(e)
			},
			next() {
				let that = this
				if(this.name && this.park !== '' && this.parkClass !== ''){
					// uni.requestSubscribeMessage({
					// 	tmplIds:["sfE0kbEZwjsTsMN77M081necp-ULm5mfBVCqSYJqxf8"],
					// 	success:res => {
					// 		console.log(res,'======resdingyue')
					// 	}
					// })
					uni.getUserProfile({
						desc:"登录",
						success:function(res){
							that.avatarUrl = res.userInfo.avatarUrl
							that.nickName = res.userInfo.nickName
							that.signature = res.signature
							uni.setStorageSync('info', res.userInfo);
							store.commit('setInfo', res.userInfo)
							that.loginSubmit()
						}
					})
				}else{
					uni.showToast({
						title: '请填写完毕',
						icon: 'error'
					})
				}
			},
			//获取用户信息
			// getUserInfo(){
			// 	debugger
			// 	let that = this
			// 	uni.getUserProfile({
			// 		desc:"登录",
			// 		success:function(res){
			// 			that.avatarUrl = res.userInfo.avatarUrl
			// 			that.nickName = res.userInfo.nickName
			// 			that.signature = res.signature
			// 			uni.setStorageSync('info', res.userInfo);
			// 			store.commit('setInfo', res.userInfo)
			// 			that.loginSubmit()
			// 		}
			// 	})
			// },
			//登录请求
			loginSubmit(){
				let that = this
				let data = {
						 code: that.code,
						    id: that.park,
							//登录类型:0学生，1园长，2老师"
						    type: 0,
						    avatarUrl: that.avatarUrl,
						    nickName: that.nickName,
						    signature: that.signature,
						    name: that.name,
						    classId: that.parkClass,
					}
				this.$http('/min-program/park/login','POST',data).then(res=>{
					store.commit('setType', 0)
					store.commit('setKindergartenId', res.kindergartenId)
					store.commit('setUser', res.user)
					uni.setStorageSync('hasMember', res.hasMember);
					uni.setStorageSync('token', res.token);
					uni.setStorageSync('type', 0);
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
	.identity button {
		width: 300rpx;
		margin: 50rpx auto;
		display: block;
	}

	.verify {
		padding: 50rpx;
	}
	.verify_item{
		margin-bottom: 40rpx;
	}
	.button{
		display: flex;
		    align-items: center;
		    justify-content: center;
		    height: 100rpx;
		    background: gray;
		    background: #1aad19;
		    color: #ffffff;
		    border-radius: 10rpx;
	}
	.accredit{
		    position: absolute;
		    bottom: 70rpx;
		    left: 37%;
		    color: #8f939c;
		    font-size: 30rpx;
	}
</style>