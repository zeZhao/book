<template>
	<view class="info">
		<uni-forms ref="form" :modelValue="formData" label-position="top" label-width="90" :rules="rules">
			<uni-forms-item label="选择头像" required label-align="center">
				<uni-file-picker v-model="formData.img" limit="1" :del-icon="false" disable-preview
					:imageStyles="imageStyles" file-mediatype="image" @success="upLoadSuccess" @select="upLoadSelect" @fail="upLoadFail">选择</uni-file-picker>
			</uni-forms-item>
			<uni-forms-item label="用户名称" required name="name">
				<uni-easyinput v-model="formData.name" placeholder="请输入用户名称" />
			</uni-forms-item>
			<uni-forms-item label="绑定用户">
				<uni-easyinput v-model="formData.bindUsers" disabled placeholder="请输入绑定用户" />
			</uni-forms-item>
			<uni-forms-item label="所在幼儿园">
				<uni-data-select v-model="formData.kindergarten" :localdata="parkList" disabled></uni-data-select>
				<!-- <uni-easyinput v-model="formData.kindergarten" disabled placeholder="请输入所在幼儿园" /> -->
			</uni-forms-item>
			<uni-forms-item label="教导班级">
				<uni-data-select v-model="formData.class" :localdata="range" @change="change" :disabled="type === 0"></uni-data-select>
			</uni-forms-item>

		</uni-forms>
		<button type="primary" @click="submit('form')">提交</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					name: "丁泽昭",
					bindUsers: "丁泽昭",
					kindergarten: "朝阳花园双语幼儿园",
					class: "",
					img: {
						url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png',
						extname: 'png',
						name: 'shuijiao.png'
					}
				},
				range: [],
				parkList: [],
				imageStyles: {
					width: 64,
					height: 64,
					border: {
						radius: '50%'
					}
				},
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入用户名称',
							},
							{
								maxLength: 10,
								errorMessage: '名称长度不得超过 {maxLength} 个字符',
							}
						]
					}
				},
				type:uni.getStorageSync('type'),
				userInfo:{}
			}
		},
		onLoad() {
			this.getInfo()
			this.getPark()
			
		},
		methods: {
			//获取用户信息
			getInfo() {
				this.$http('/min-program/member/info', 'GET').then(res => {
					const {
						user
					} = res
					this.formData.name = user.name
					this.formData.bindUsers = user.nickName
					this.formData.kindergarten = user.kindergarten
					this.formData.class = user.classId
					this.formData.img.url = user.avatarUrl
					this.getClassGrade(user.kindergarten)
					this.userInfo = res.user
					console.log(res, '=======')
				})
			},
			//获取幼儿园
			getPark() {
				this.$http('/min-program/kindergarten/option', 'GET').then(res => {
					this.parkList = res
					this.parkList.forEach(item=>{
						item.value = item.id
						item.text = item.name
					})
				})
			},
			//获取班级
			getClassGrade(kindergartenId){
				let that = this
				this.$http('/min-program/class-grade/option','GET',{kindergartenId}).then(res=>{
					that.range = res
					that.range.forEach(item=>{
						item.value = item.id
						item.text = item.name
					})
				})
			},
			//上传成功
			upLoadSuccess(e){
				console.log(e,'=====sahnghcuan ')
			},
			//上传失败
			upLoadFail(e){
				console.log(e,'=====upLoadFail ')
			},
			//选择文件
			upLoadSelect(e){
				this.formData.img.url = e.tempFilePaths[0]
				// console.log(e,'=====upLoadSelect ')
			},
			change(e) {
				console.log("e:", e);
			},
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					let data = {
						...this.userInfo,
						avatarUrl:this.formData.img.url,
						name:this.formData.name,
						classId:this.formData.class,
						role:this.type
					}
					// console.log(data,'=====')
					this.$http('/min-program/edit','PUT',data).then(res=>{
						console.log(res)
						uni.navigateBack()
					})
					console.log('success', res);
					uni.showToast({
						title: `提交成功！`
					})
				}).catch(err => {
					console.log('err', err);
				})
			},
		}
	}
</script>

<style>
	.info {
		padding: 20rpx;
	}

	.uni-file-picker {
		margin-left: 42%;
	}
</style>