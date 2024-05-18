<template>
  <div>
    <video ref="rtc_media_player" @play="handlePlay" width="1000" height="350" controls muted autoplay></video>
    <el-button type="primary" @click="takeScreenshot">截图</el-button>
    <el-button type="warning" @click="testpoint">测试点</el-button>
    <canvas ref="canvas" width="1000" height="350" style="display:none;"></canvas>
  </div>
</template>

<script>
import http from "@/http/axios.js";
export default {
  data() {
    return {

    };
  },
  mounted() { 
    this.startPlay();
    
  },
  methods: {
    startPlay() {
      let sdk = new SrsRtcWhipWhepAsync();
      console.log(this.$refs.rtc_media_player)
      this.$refs.rtc_media_player.srcObject = sdk.stream
      // var url = 'http://101.133.149.215:1985/rtc/v1/whep/?app=live&stream=livestream'
      var url = 'http://192.168.9.84:1985/rtc/v1/whep/?app=live&stream=livestream'
      sdk.play(url).then(function (session) {
        console.log('media--play--success!!!!!!!')
        // $('#sessionid').html(session.sessionid);
        // $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid);
      }).catch(function (reason) {
        console.log('media--play--fail!!!')
        sdk.close();
        console.error(reason);
      });
    },
    handlePlay(event) {
      console.log('开始播放~~~~~~~~~~~~~~~~~',event)
    },
    takeScreenshot() {
      
      const video = this.$refs.rtc_media_player;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      // 将视频帧绘制到Canvas上
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("takeScreenshot",ctx);
      // 将Canvas保存为图片
      const dataURL = canvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = dataURL;
      console.log("takeScreenshot",dataURL);
      // 可以选择将img元素添加到文档中显示截图
      document.body.appendChild(img);
    },
    testpoint() {
      let data = {
        "command": 'walk',
        "data": {
          speed: 10,
          angle: 10,
        }
      }
      // http
      //   .get("/list")
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
      this.robotWs.robot.send(JSON.stringify(data));
    }
  },
};
</script>