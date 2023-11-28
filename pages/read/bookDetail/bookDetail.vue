<template>
	<view class="bookDetail">
		<view class="banner">
			<image :src="info.cover" mode=""></image>
			
		</view>
		<view class="info">
			<view class="title">
				<view class="title_left">
					<uni-icons type="wallet-filled" size="18"></uni-icons>
					<text>图书详情</text>
				</view>
				<view class="btn_right">
					<button type="default" size="mini" plain v-if="info.path" @click="listening(info)">开始听书</button>
				</view>
			</view>
			<view class="content">
				<image :src="info.cover" mode="" class="cnt_img"></image>
				<view class="cnt_txt">
					<uni-title type="h3" :title="info.name"></uni-title>
					<p class="txt_isbn">页数:{{info.pages}}</p>
					<p class="txt_isbn">ISBN:{{info.isbn}}</p>
					<uni-title type="h4" :title="`作者:${info.author}`"></uni-title>
					<button open-type="share" plain size="mini">分享</button>
				</view>
			</view>
			<view class="briefIntro">
				<p class="briefIntro_title">图书简介</p>
				<p class="briefIntro_cnt">
					{{info.briefIntro}}
				</p>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}

			}
		},
		onLoad(option) {
			console.log(option, '======option')
			this.info = JSON.parse(decodeURIComponent(option.item))
			console.log(this.info,'==============info')
			uni.setNavigationBarTitle({
				title: this.info.name
			})

		},
		onHide(){
			
		},
		onUnload(){
			
		},
		methods: {
			listening(info){
				const bgAudioManager = uni.getBackgroundAudioManager();
				bgAudioManager.title  = info.name;
				bgAudioManager.singer  = info.author;
				bgAudioManager.coverImgUrl  = info.cover;
				bgAudioManager.src = encodeURI(info.path);
				bgAudioManager.onPlay(() => {
				  console.log('开始播放');
				});
				bgAudioManager.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
			}
		}
	}
</script>

<style>
	.banner image{
		width: 100%;
		height: 240px;
	}
	.info {
		padding: 20rpx;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e9e9eb;
		padding-bottom: 20rpx;
	}

	.content {
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		padding-top: 40rpx;

	}

	.cnt_txt {
		padding-left: 30rpx;
	}

	.cnt_img {
		width: 250rpx;
		height: 300rpx;
	}

	.txt_isbn {
		font-size: 30rpx;
		color: #ccc;
	}

	.briefIntro {
		padding-top: 30rpx;
	}

	.briefIntro_title {
		font-size: 34rpx;
		font-weight: bold;
	}

	.briefIntro_cnt {
		font-size: 30rpx;
		color: #909399;
		padding-top: 20rpx;
		padding-bottom: 50rpx;
	}
</style>