<template>
  <div id="app">
    <div class="mainBody">
      <transition name="fade">
        <router-view />
      </transition>
    </div>
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
      console.log('bus-on-initws~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', e)
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
        // console.log('robotWs收到数据：', data.data)
        if(data.data){
          var currData = JSON.parse(data.data);
          this.$bus.$emit("robotOnmessage", currData);
        }
      };
      robot.onclose = (error) => {
        console.log('robotWs关闭！', error)
      };
      robot.onerror = () => {
        console.log('robotWs出错！')
        this.reconnectWs(e);
      };
    },
    reconnectWs(e) {
      if (!this.reWs) {
        setTimeout(() => {
          this.initRobotWs(e);
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

<style>
.mainBody {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("assets/images/image_bkg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
