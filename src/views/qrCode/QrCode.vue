<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">扫描二维码</span>
      </div>
    </rtc-header>
    <div class="scanImg">

    </div>
    <!-- <img class="scanImg" src="@/assets/images/image_scanQRcode.png" /> -->
    <canvas class="qrcodeL" id="qrcodeL"></canvas>
    <!-- <el-button
      style="position: absolute; top: 22vw; left: 42vw"
      type="primary"
      @click="createQr()"
      >点击！！</el-button
    > -->
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import QRCode from "qrcode";
export default {
  components: { rtcHeader },
  data() {
    return {
      screenWidth: document.body.clientWidth,
    };
  },
  created() {
    console.log(this.screenWidth)
  },
  mounted() {
    this.createQr();
  },
  methods: {
    createQr() {
      // const MainActivity = plus.android.runtimeMainActivity();
      // const Context = plus.android.importClass("android.content.Context");
      // plus.android.importClass('java.util.ArrayList');
      // plus.android.importClass("android.net.wifi.WifiManager");
      // plus.android.importClass("android.net.wifi.WifiInfo");
      // const wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
      // const wifiInfo = wifiManager.getConnectionInfo();
      // const configuredNetworks = wifiManager.getConfiguredNetworks();
      // let pwd = null;
      // for (let i = 0; i < configuredNetworks.size(); i++) {
      //   const item = configuredNetworks.get(i)
      //   if(item.plusGetAttribute('SSID') == wifiInfo.getSSID()) {
      //       // console.log("SSID",item.plusGetAttribute('SSID'))
      //       // console.log("PWD",item.plusGetAttribute('preSharedKey'))
      //       pwd = item.plusGetAttribute('preSharedKey')
      //   }
      // }
      // let Base64 = plus.android.importClass("java.util.Base64");
      // let decoder = Base64.getDecoder();
      // console.log('333',JSON.stringify(decoder))
      // console.log('444',pwd,'555',Base64.DEFAULT)
      // let decodedBytes = decoder.decode(pwd, Base64.DEFAULT);
      // let plainTextPassword = new String(decodedBytes);
      // console.log("wifiPWD", decodedBytes);
      // console.log("wifiInfo", wifiInfo.getSSID());
      const ssid = "fftai-12";
      const password = "fftai2015";
      //分享wifi二维码标准格式
      const wifiData = `WIFI:T:WPA;P:${password};S:${ssid};H:true;`;
      const qrCodeLDiv = document.getElementById("qrcodeL");
      let qrSize = 800;
      if(this.screenWidth < 1920){
        qrSize = qrSize * this.screenWidth / 1920;
      }
      // 使用qrcode.js生成二维码
      QRCode.toCanvas(
        qrCodeLDiv,
        wifiData,
        {
          width: qrSize,
          height: qrSize,
          color: {
            dark: "#44D8FB",
            light: "#FFFFFF00",
          },
        },
        (error) => {
          if (error) console.error("出错", error);
          console.log("QR Code generated successfully");
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/image_bkg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxt {
    font-size: 1.9792vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #ffffff;
    line-height: 2.7083vw;
  }
}
.scanImg {
  left: 3.125vw;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46.875vw;
  height: 41.6667vw;
  max-height: 75%;
  background-image: url("../../assets/images/image_scanQRcode.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.qrcodeL {
  position: absolute;
  right: 3.125vw;
  top: 50%;
  transform: translateY(-50%);
}
</style>