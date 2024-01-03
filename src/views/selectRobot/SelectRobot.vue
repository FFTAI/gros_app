<template>
  <div class="black-bkg">
    <rtc-header>
      <div class="headStateSr">
        <span class="headTxtSr common-font">{{ $t("selectRobotModel") }}</span>
      </div>
    </rtc-header>
    <el-carousel class="carouselSr" indicator-position="none" type="card" :autoplay="false" height="29.1667vw" @change="carouselChange">
      <el-carousel-item v-for="item in carouselItem" :key="item">
        <!-- 中间卡片 -->
        <div class="robotCardSr middleCardSr">
          <img class="modelImgSr" src="@/assets/images/image_robotModel.png" />
          <span class="modelTxtSr">{{ item }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 下方切换点 -->
    <div class="cardPointSr flex-between">
      <div class="pointSr" :class="{ pointSrActivity:  actIndex == 2}"></div>
      <div class="pointSr" :class="{ pointSrActivity:  actIndex == 0}"></div>
      <div class="pointSr" :class="{ pointSrActivity:  actIndex == 1}"></div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { rtcHeader },
  data() {
    return {
      carouselItem: ["GR-1","GR-1 Lite","GR-1 Pro"],
      actIndex: 0
    };
  },
  created() {},
  mounted() {},
  methods: {
    carouselChange(val,oldVal){
      this.actIndex = val
    }
  },
};
</script>

<style lang="scss">
.headStateSr {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxtSr {
    font-size: $size-47;
    color: $white;
    line-height: 2.7083vw;
  }
}
.carouselSr{
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.robotCardSr {
  background: linear-gradient(
    180deg,
    rgba(0, 130, 187, 0.7) 0%,
    rgba(0, 75, 133, 0.7) 100%
  );
  border-radius: 1vw;
  border: 0.0417vw solid #0075b8;
}
.middleCardSr {
  width: 29vw;
  height: 24.625vw;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modelImgSr {
  width: 12.3333vw;
  height: 25vw;
  position: absolute;
  left: 0.75vw;
  bottom: 1.375vw;
}
.modelTxtSr {
  font-size: 2.9583vw;
  font-family: AlibabaPuHuiTiB;
  color: $white;
  position: absolute;
  top: 10.1667vw;
  right: 3.8333vw;
  font-weight: 900;
  position: relative;
  left: 45%;
}
.cardPointSr {
  width: 5.1667vw;
  height: 0.75vw;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 7.0417vw;
  .pointSr {
    width: 0.75vw;
    height: 0.75vw;
    background: #44d8fb;
    border-radius: 0.5vw;
    opacity: 0.2;
  }
  .pointSrActivity{
    opacity: 1;
    width: 2.4583vw;
  }
}
.el-carousel__mask{
  background: transparent !important;
}
</style>