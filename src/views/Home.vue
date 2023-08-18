<template>
    <div class="home-box">
        <video class="video-background" preload="auto" loop playsinline autoplay
            src="https://www.fftai.cn/assets/video/home.mp4" tabindex="-1" muted="muted"></video>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.home-box {
  position: relative;
  height: 97.9vh;
  background-color: #C1CFF7;
  /*进行视频裁剪*/
  overflow: hidden;
}
</style>