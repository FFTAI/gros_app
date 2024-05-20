<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Human } from "rocs-client";
export default {
  name: "app",
  data() {
    return {
      reWs: false,
    };
  },
  created() {
    this.initRobotWs();
  },
  mounted() {
    let lang = localStorage.getItem("lang");
    if (lang == "en") {
      this.$i18n.locale = "en";
    } else if (lang == "tw") {
      this.$i18n.locale = "tw";
    } else {
      this.$i18n.locale = "zh";
      localStorage.setItem("lang", "zh");
    }
    window.addEventListener("gamepadconnected", this.gamepadcted);
    window.addEventListener("gamepaddisconnected", this.gamepaddiscted);
    this.$bus.$on("initWs", () => {
      console.log('bus-on-initws~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      this.initRobotWs()
    })
  },
  beforeDestroy() {
    window.removeEventListener("gamepadconnected", this.gamepadcted);
    window.removeEventListener("gamepaddisconnected", this.gamepaddiscted);
    this.$bus.$off("initWs");
  },
  methods: {
    //初始化Robot实例
    initRobotWs() {
      // var robot = new Human({
      //   host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
      // });
      // this.robotWs.setWs(robot);
      // robot.on_connected(() => {
      //   // console.log('robotWs成功！')
      //   this.$bus.$emit("robotOnconnected");
      //   this.reWs = false;
      // });
      // robot.on_message((data) => {
      //   var currData = JSON.parse(data.data);
      //   this.$bus.$emit("robotOnmessage", currData);
      // });
      // robot.on_close(() => {
      //   // console.log('robotWs关闭！')
      //   this.reconnectWs();
      // });
      // robot.on_error(() => {
      //   // console.log('robotWs出错！')
      //   this.reconnectWs();
      // });
      let robot = new WebSocket('ws://192.168.9.101:8000/remote/fftai-test');
      console.log(robot.onopen)
      this.robotWs.setWs(robot);
      robot.onopen = () => {
        console.log('robotWs成功！')
        this.$bus.$emit("robotOnconnected");
        this.reWs = false;
      };
      robot.onmessage = (data) => {
        var currData = JSON.parse(data.data);
        this.$bus.$emit("robotOnmessage", currData);
      };
      robot.onclose = () => {
        console.log('robotWs关闭！')
        // this.reconnectWs();
      };
      robot.onerror = () => {
        console.log('robotWs出错！')
        // this.reconnectWs();
      };
    },
    reconnectWs() {
      if (!this.reWs) {
        setTimeout(() => {
          this.initRobotWs();
          this.reWs = true;
        }, 2000);
      }
    },
    gamepadcted() {
      this.$store.commit("setGamepadConnected", true);
    },
    gamepaddiscted() {
      this.$store.commit("setGamepadConnected", false);
    },
  },
};
</script>

<style></style>
