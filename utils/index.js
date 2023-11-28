
function http(url,method,data) {
	return new Promise((resolved, rejected) => {
		uni.request({
			url:'https://tiantianhuiben.cc/stage-api'+url,
			method,
			header:{
				Authorization:uni.getStorageSync('token')
			},
			data,
			success:function(res){
				if(res.data.code !== 200){
					// 非成功状态码弹窗
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: `${res.data.msg}`
					});
					if(res.data.code === 401){
						// uni.showToast({
						// 	icon: "none",
						// 	title: '请重新登录！'
						// });
						// if(uni.getStorageSync('type') == 0){
						// 	uni.reLaunch({
						// 		url: '/pages/login/login'
						// 	})
						// }else{
						// 	uni.reLaunch({
						// 		url: '/pages/login/administrator'
						// 	})
						// }
						// uni.clearStorage()
						let type = uni.getStorageSync('type')
						uni.login({
							success: function(res) {
								uni.setStorage({
									key: 'code',
									data: res.code
								})
							}
						})
						uni.request({
							url:"https://tiantianhuiben.cc/stage-api/min-program/park/login",
							method:"POST",
							header:{
								Authorization:uni.getStorageSync('token')
							},
							data:{
								code: uni.getStorageSync('code'),
								   id: uni.getStorageSync('kindergartenId'),
									//登录类型:0学生，1园长，2老师"
								   type: type,
								   avatarUrl: uni.getStorageSync('user').avatarUrl,
								   nickName: uni.getStorageSync('user').nickName,
								   signature: uni.getStorageSync('user').signature,
								   name: uni.getStorageSync('user').name,
								   classId: uni.getStorageSync('user').classId,
							},
							success:function(res){
								uni.setStorageSync('hasMember', res.hasMember);
								uni.setStorageSync('token', res.token);
								uni.setStorageSync('type', type);
								uni.setStorageSync('kindergartenId', res.kindergartenId);
								uni.setStorageSync('user', res.user);
							}
							
						})
						
					}
					rejected(res)
				}else{
					resolved(res.data.data)
				}
			},
			fail:function(error){
				console.log(error,'==========请求失败！')
			}
		})
	})
	
}

export default http;