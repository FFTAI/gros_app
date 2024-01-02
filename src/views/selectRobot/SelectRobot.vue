<template>
  <div class="black-bkg">
    <rtc-header>
      <div class="headState">
        <span class="headTxt common-font">{{ $t("selectRobotModel") }}</span>
      </div>
    </rtc-header>
    <!-- 左侧卡片 -->
    <div class="robotCard leftCard">
      <img class="sideModelImg" src="@/assets/images/image_robotModel.png" />
      <span class="sideModelTxt">GR-1</span>
    </div>
    <!-- 中间卡片 -->
    <div class="robotCard middleCard">
      <img class="modelImg" src="@/assets/images/image_robotModel.png" />
      <span class="modelTxt">GR-1 Lite</span>
    </div>
    <!-- 右侧卡片 -->
    <div class="robotCard rightCard">
      <img class="sideModelImg" src="@/assets/images/image_robotModel.png" />
      <span class="sideModelTxt" style="right: 2.2083vw">GR-1 Pro</span>
    </div>
    <div class="cardPoint flex-between">
      <div class="point"></div>
      <div class="point" style="opacity: 1; width: 2.4583vw"></div>
      <div class="point"></div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { rtcHeader },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxt {
    font-size: $size-47;
    color: $white;
    line-height: 2.7083vw;
  }
}
.robotCard {
  background: linear-gradient(
    180deg,
    rgba(0, 130, 187, 0.7) 0%,
    rgba(0, 75, 133, 0.7) 100%
  );
  border-radius: 1vw;
  border: 0.0417vw solid #0075b8;
}
.middleCard {
  width: 30.7917vw;
  height: 24.625vw;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.leftCard {
  width: 24.625vw;
  height: 19.7083vw;
  opacity: 0.8;
  position: absolute;
  left: 6.9167vw;
  top: 12.0417vw;
}
.rightCard {
  width: 24.625vw;
  height: 19.7083vw;
  opacity: 0.8;
  position: absolute;
  right: 6.9167vw;
  top: 12.0417vw;
}
.modelImg {
  width: 12.3333vw;
  height: 25vw;
  position: absolute;
  left: 0.75vw;
  bottom: 1.375vw;
}
.sideModelImg {
  width: 9.9167vw;
  height: 20vw;
  position: absolute;
  left: 0.5417vw;
  bottom: 1.125vw;
}
.modelTxt {
  font-size: 2.9583vw;
  font-family: AlibabaPuHuiTiB;
  color: $white;
  position: absolute;
  top: 10.1667vw;
  right: 3.8333vw;
  font-weight: 900;
}
.sideModelTxt {
  font-size: 2.4583vw;
  font-family: AlibabaPuHuiTiB;
  color: $white;
  position: absolute;
  top: 8vw;
  right: 5.6667vw;
  font-weight: 900;
}
.cardPoint {
  width: 5.1667vw;
  height: 0.75vw;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 7.625vw;
  .point {
    width: 0.75vw;
    height: 0.75vw;
    background: #44d8fb;
    border-radius: 0.5vw;
    opacity: 0.2;
  }
}
</style>