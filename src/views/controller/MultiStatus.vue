<template>
  <div class="mainBox black-bkg">
    <rtc-header>
      <div class="headState">
        <span class="headTxt">多人模式</span>
      </div>
    </rtc-header>
    <div class="sideTab">
      <div
        :class="activatedTab == 'control' ? 'activated' : 'disactivated'"
        @click="changeTab('control')"
      >
        <!-- <img class="control" src="@/assets/images/image_direction.png" /> -->
      </div>
      <div
        :class="activatedTab == 'status' ? 'activated' : 'disactivated'"
        @click="changeTab('status')"
      >
      
      </div>
    </div>
  </div>
</template>

<script>
import RtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { RtcHeader },
  data() {
    return {
      activatedTab: "status",
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeTab(e) {
      console.log(e);
      this.activatedTab = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.mainBox {
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
.sideTab {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 6.25vw;
  height: 52.0833vw;
  background: rgba(32, 59, 87, 0.3);
  .disactivated {
    width: 6.25vw;
    height: 6.25vw;
  }
  .activated {
    width: 6.25vw;
    height: 6.25vw;
    background: linear-gradient(274deg, rgba(0, 76, 129, 0.2) 0%, #004c81 100%);
  }
  .activated::after {
    content: "";
    position: absolute;
    left: 0;
    width: 0.5729vw;
    height: 6.25vw;
    background: #44d8fb;
  }
}
</style>