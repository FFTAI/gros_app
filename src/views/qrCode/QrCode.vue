<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">扫描二维码</span>
      </div>
    </rtc-header>
    <img class="scanImg" src="@/assets/images/image_scanQRcode.png" />
    <canvas class="qrcode" id="qrcode"></canvas>
    <el-button style="position: absolute;top: 22vw;left: 42vw;" type="primary" @click="createQr()"
      >点击！！</el-button
    >
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import QRCode from "qrcode";
export default {
  components: { rtcHeader },
  data() {
    return {};
  },
  created() {},
  mounted() {},
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
      const qrCodeDiv = document.getElementById("qrcode");
      // 使用qrcode.js生成二维码
      QRCode.toCanvas(qrCodeDiv, wifiData, {
        width: 700,
        height: 700
      },(error) => {
        if (error) console.error("出错", error);
        console.log("QR Code generated successfully");
      });
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
.scanImg{
  position: absolute;
  left: 3.125vw;
  top: 7.2917vw;
  width: 37.5vw;
  height: 33.3333vw;
}
.qrcode{
  position: absolute;
  left: 55.2083vw;
  top: 7.2917vw;
  width: 33.3333vw;
  height: 33.3333vw;
}
</style>