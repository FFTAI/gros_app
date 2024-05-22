<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: "app",
  data() {
    return {
      reWs: false,
    };
  },
  created() {
    // this.initRobotWs();
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
    this.$bus.$on("initWs", (e) => {
      console.log('bus-on-initws~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',e)
      this.initRobotWs(e)
    })
  },
  beforeDestroy() {
    window.removeEventListener("gamepadconnected", this.gamepadcted);
    window.removeEventListener("gamepaddisconnected", this.gamepaddiscted);
    this.$bus.$off("initWs");
  },
  methods: {
    //初始化Robot实例
    initRobotWs(e) {
      let ip = process.env.VUE_APP_URL.split("//")[1];
      let robot = new WebSocket('ws://' + ip + '/remote/' + e);
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
