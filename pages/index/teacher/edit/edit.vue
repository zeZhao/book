<template>
	<view class="edit">
		<uni-forms ref="form" :modelValue="formData" label-position="top" label-width="90" :rules="rules">
			<uni-forms-item label="所属班级">
				<uni-data-select v-model="formData.classId" :localdata="classList" @change="change"
					:clear="false"></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="老师姓名" required name="name">
				<uni-easyinput v-model="formData.name" placeholder="请输入老师姓名" />
			</uni-forms-item>
			<uni-forms-item label="职称">
				<uni-data-checkbox v-model="formData.role" :localdata="sexs" />
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
					classId: 0,
					role: 1
				},
				sexs: [{
					text: '园长',
					value: 1
				}, {
					text: '老师',
					value: 2
				}],
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入老师姓名',
							},
							{
								maxLength: 10,
								errorMessage: '名称长度不得超过 {maxLength} 个字符',
							}
						]
					}
				},
				classList : []

			}
		},
		onLoad(o) {
			console.log(o)
			this.formData = JSON.parse(o.item)
			this.getClassList()
		},
		methods: {
			//获取班级
			getClassList(){
				let data = {
					kindergartenId:uni.getStorageSync('kindergartenId')
				}
				this.$http('/min-program/class-grade/option','GET',data).then(res=>{
					this.classList = res
					this.classList.forEach(item=>{
						item.value = item.id
						item.text = item.name
					})
					console.log(res,'=====获取班级')
				})
			},
			change(e) {
				console.log("e:", e);
			},
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					let data = {
						...this.formData
					}
					this.$http('/min-program/conservator/edit','PUT',data).then(res=>{
						uni.showToast({
							title: `提交成功！`
						})
						uni.navigateBack()
					})
					
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