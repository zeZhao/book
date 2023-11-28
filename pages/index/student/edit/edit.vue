<template>
	<view class="edit">
		<uni-forms ref="form" :modelValue="formData" label-position="top" label-width="90" :rules="rules">
			<uni-forms-item label="学生姓名" required name="name">
				<uni-easyinput v-model="formData.name" placeholder="请输入学生姓名" />
			</uni-forms-item>
			<uni-forms-item label="班级">
				<uni-data-select v-model="formData.clBum" :localdata="range" @change="change" :clear="false"></uni-data-select>
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
					name: "",
					clBum: 0,
				},
				range: [
					// {
					// 	value: 0,
					// 	text: "小班"
					// },
					// {
					// 	value: 1,
					// 	text: "中班"
					// },
					// {
					// 	value: 2,
					// 	text: "大班"
					// },
				],
				rules: {
					name: {
						rules:[
							{
								required: true,
								errorMessage: '请输入学生姓名',
							},
							{
								maxLength: 10,
								errorMessage: '名称长度不得超过 {maxLength} 个字符',
							} 
						]
					}
				},
				kindergartenId:"",
				token:""
				
			}
		},
		onLoad(option){
			console.log(option)
			this.formData = JSON.parse(option.item)
			this.kindergartenId = uni.getStorageSync("kindergartenId")
			this.token = uni.getStorageSync("token")
			this.getClass()
			console.log(this.formData)
		},
		methods: {
			change(e) {
				console.log("e:", e);
			},
			submit(ref) {
				let that = this
				this.$refs[ref].validate().then(res => {
					uni.request({
						url:"https://tiantianhuiben.cc/stage-api/min-program/member",
						method:"PUT",
						data:{
							...that.formData,
							name:that.formData.name,
							clBum:that.formData.clBum,
						},
						header:{
							Authorization:that.token
						},
						success:(res=>{
							if(res.data.code === 200){
								console.log('success', res);
								uni.showToast({
									title: `提交成功！`
								})
								uni.navigateBack()
								console.log(res,'=======banji')
								// that.range = res.data.data
								// that.range.forEach(item=>{
								// 	item.value=item.id
								// 	item.text = item.name
								// })
							}
							
						})
					})
					
				}).catch(err => {
					console.log('err', err);
				})
			},
			getClass(){
				let that = this
				uni.request({
					url:"https://tiantianhuiben.cc/stage-api/min-program/class-grade/option",
					data:{
						kindergartenId:that.kindergartenId
					},
					header:{
						Authorization:that.token
					},
					success:(res=>{
						if(res.data.code === 200){
							that.range = res.data.data
							that.range.forEach(item=>{
								item.value=item.id
								item.text = item.name
							})
						}
						console.log(res,'=======banji')
					})
				})
			}
			
		}
	}
</script>

<style>
	.edit{
		padding: 20rpx;
	}

</style>
