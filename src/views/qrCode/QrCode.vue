<template>
  <div class="qrcodeSty">
    <canvas class="vertically-centered" id="qrcode"></canvas>
    <el-button class="vertically-centered" type="primary" @click="createQr()"
      >点击！！</el-button
    >
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    createQr() {
      const MainActivity = plus.android.runtimeMainActivity();
      const Context = plus.android.importClass("android.content.Context");
      plus.android.importClass("android.net.wifi.WifiManager");
      plus.android.importClass("android.net.wifi.WifiInfo");
      const wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
      const wifiInfo = wifiManager.getConnectionInfo();
      const configuredNetworks = wifiManager.getConfiguredNetworks();
      console.log("configuredNetworks", JSON.stringify(configuredNetworks));
      console.log("configuredNetworks1",configuredNetworks.size())
      for (let i = 0; i < configuredNetworks.size().length; i++) {
        console.log("configuredNetworks2",configuredNetworks.get(i))
      }
      configuredNetworks.forEach(element => {
        console.log('config',element)
      });
      console.log("wifiInfo", wifiInfo.getSSID());
      const ssid = "fftai-12";
      const password = "fftai2015";
      //分享wifi二维码标准格式
      const wifiData = `WIFI:T:WPA;P:${password};S:${ssid};H:true;`;
      const qrCodeDiv = document.getElementById("qrcode");
      // 使用qrcode.js生成二维码
      QRCode.toCanvas(qrCodeDiv, wifiData, (error) => {
        if (error) console.error("出错", error);
        console.log("QR Code generated successfully");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qrcodeSty {
}
</style>