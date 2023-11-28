<template>
	<view class="edit">
		<uni-forms ref="form" :modelValue="formData" label-position="top" label-width="90">
			<uni-forms-item label="班级名称">
				<uni-easyinput v-model="formData.name" placeholder="请填写班级名称" />
			</uni-forms-item>
			<uni-forms-item label="毕业时间">
				<uni-datetime-picker type="date" v-model="formData.graduationTime" />
				<!-- <uni-datetime-picker type="date" :clear-icon="false" v-model="single" @maskClick="maskClick" /> -->

				<!-- <uni-easyinput v-model="formData.graduate" placeholder="请选择毕业时间" /> -->
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
					graduationTime: '',
				},
				type: "append",
				kindergartenId: uni.getStorageSync('kindergartenId'),
				info: {}
			}
		},
		onLoad(option) {
			this.type = option.type
			if (option.type === 'edit') {
				let json = JSON.parse(option.item)
				this.formData = json
				// this.formData.graduate = '2021-2-12'
				// this.info = json
				// if(Object.keys(json).length !== 0){
				// 	this.formData.class = 0
				// }
			} else {
				this.formData.name = ''
				this.formData.graduationTime = ''
			}
		},
		methods: {
			change(e) {
				console.log("e:", e);
			},
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					let data = {
						...this.formData,
						kindergartenId:uni.getStorageSync('kindergartenId')
					}
					if (this.type === 'edit') {
						this.$http('/min-program/class-grade', 'PUT', data).then(res => {
							console.log(res, '===========edit')
							uni.showToast({
								title: `提交成功！`
							})
							uni.navigateBack()
						})
					} else if (this.type === 'append') {
						this.$http('/min-program/class-grade', 'POST', data).then(res => {
							console.log(res, '-=======append')
							uni.showToast({
								title: `提交成功！`
							})
							uni.navigateBack()
						})

					}
				}).catch(err => {
					console.log('err', err);
				})
			},

		}
	}
</script>

<style>
	.edit {
		padding: 20rpx;
	}
</style>