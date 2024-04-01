<template>
  <div class="mainBox">
    <rtc-header>
      <div class="headStateSr">
        <span class="headTxtSr common-font">{{
          $t("connectionManagement")
        }}</span>
      </div>
    </rtc-header>
    <div class="robotBox">
      <el-carousel
        indicator-position="none"
        :autoplay="false"
        arrow="nerver"
        height="28.125vw"
      >
        <el-carousel-item v-for="(list,i) in carouselList" :key="i">
          <!-- 添加机器人 -->
          <div class="carouselItem">
            <div class="addCard" v-if="i==0">
              <div class="add">
                <img class="addImg" src="@/assets/images/icon_add.png" />
              </div>
              <div class="addContent">添加机器人</div>
            </div>
            <!-- 机器人列表 -->
            <div
              class="robotCard"
              :class="{
                checkedCard: item.isChosed,
                uncheckedCard: !item.isChosed,
                top: item.isMasterControl,
              }"
              v-for="(item, index) in list"
              :key="index"
              @click="choseCard(item)"
            >
              <div class="cardTitle common-font flex-between">
                <div class="flex-center">
                  <img
                    style="
                      width: 1.5417vw;
                      height: 1.125vw;
                      margin-right: 0.375vw;
                    "
                    src="@/assets/images/icon_Wi-Fi.png"
                  />
                  <span>Wi-Fi连接</span>
                </div>
                <span v-if="item.isMasterControl">主控</span>
                <img
                  v-else
                  style="width: 1vw; height: 1.125vw"
                  src="@/assets/images/btn_topping.png"
                  @click.stop="toTop(item)"
                />
              </div>
              <div class="cardDivider"></div>
              <div class="cardContent">
                <img
                  class="img"
                  src="@/assets/images/image_connectedAvatar.png"
                />
                <div>
                  <span class="name">{{ item.name }}</span>
                  <span class="type">GR-1 Lite</span>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="completeBtn flex-center" @click="completeChose()">完成选择</div>
  </div>
</template>
  
  <script>
import rtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { rtcHeader },
  data() {
    return {
      masterControl: true,
      robotList: [
        {
          name: "GR-0001",
          isMasterControl: true,
          isChosed: true,
        },
        {
          name: "GR-0002",
          isMasterControl: false,
          isChosed: true,
        },
        {
          name: "GR-0003",
          isMasterControl: false,
          isChosed: true,
        },
        {
          name: "GR-0004",
          isMasterControl: false,
          isChosed: false,
        },
        {
          name: "GR-0005",
          isMasterControl: false,
          isChosed: false,
        },
        {
          name: "GR-0006",
          isMasterControl: false,
          isChosed: false,
        },
        {
          name: "GR-0007",
          isMasterControl: false,
          isChosed: false,
        },
        {
          name: "GR-0008",
          isMasterControl: false,
          isChosed: true,
        },
        {
          name: "GR-0009",
          isMasterControl: false,
          isChosed: false,
        },
      ],
      carouselList: []
    };
  },
  created() {},
  mounted() {
    for (let i = 0; i < this.robotList.length; i += 8) {
      if(i == 0) {
        this.carouselList.push(this.robotList.slice(0, 7));
      } else {
        this.carouselList.push(this.robotList.slice(i - 1, i + 7));
      }
    }
    console.log(this.carouselList)
  },
  methods: {
    choseCard(e) {
      e.isChosed = !e.isChosed;
    },
    toTop(e) {
      this.robotList.forEach((i) => {
        if (i.isMasterControl) i.isMasterControl = false;
      });
      e.isMasterControl = true;
    },
    completeChose() {},
  },
};
</script>
  
<style lang="scss" scoped>
.mainBox {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/image_bkg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.headStateSr {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;
  .headTxtSr {
    font-size: 1.9583vw;
    color: #ffffff;
    line-height: 2.7083vw;
  }
}
.addCard {
  width: 21.5417vw;
  height: 12.3333vw;
  border-radius: 0.625vw;
  border: 0.0417vw dashed #0075b8;
  order: -2;
  .add {
    width: 8.625vw;
    height: 7.0833vw;
    background: rgba(68, 216, 251, 0.1);
    border-radius: 0 0 100% 0;
    .addImg {
      position: absolute;
      left: 2.1667vw;
      top: 1.5833vw;
      width: 2.9583vw;
      height: 2.9583vw;
    }
  }
  .addContent {
    position: absolute;
    left: 9.1667vw;
    top: 5.5417vw;
    font-family: AlibabaPuHuiTiM;
    font-size: 1.9583vw;
    color: #ffffff;
  }
}
.robotBox {
  position: absolute;
  top: 6.7917vw;
  left: 2.4583vw;
  width: 93.875vw;
  height: 27.125vw;
  .carouselItem {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4583vw;
  }
  .robotCard {
    width: 21.5417vw;
    height: 12.25vw;
    border-radius: 0.625vw;
    .cardTitle {
      width: 17vw;
      padding: 0.875vw 2.0833vw 0.7917vw 2.4583vw;
      font-size: 1vw;
      color: #ffffff;
    }
    .cardDivider {
      width: 21.5417vw;
      height: 0.0417vw;
      background: #44d8fb;
      opacity: 0.3;
    }
    .cardContent {
      position: relative;
      height: 9.25vw;
      width: 19.0833vw;
      padding-left: 2.4583vw;
      .img {
        position: absolute;
        top: 2.4583vw;
        left: 2.4583vw;
        width: 3.9583vw;
        height: 3.9583vw;
      }
      .name {
        position: absolute;
        top: 2.4583vw;
        left: 7.625vw;
        font-family: AlibabaPuHuiTiM;
        font-size: 1.9583vw;
        color: #ffffff;
      }
      .type {
        position: absolute;
        top: 5.1667vw;
        left: 7.625vw;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        font-size: 1vw;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .uncheckedCard {
    background: rgba(0, 75, 133, 0.3);
    border: 0.0417vw solid #0075b8;
  }
  .checkedCard {
    background: linear-gradient(
      180deg,
      rgba(0, 130, 187, 0.9) 0%,
      rgba(0, 75, 133, 0.8) 100%
    );
    border: 0.0417vw solid #0075b8;
  }
  .top {
    order: -1;
  }
}
.completeBtn {
  position: absolute;
  bottom: 3.9583vw;
  left: 50%;
  transform: translate(
    -50%,
    0
  ); /* 将子元素在水平和垂直方向上向上和向左移动50%，实现居中对齐 */
  width: 18.4583vw;
  height: 4.1667vw;
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  border-radius: 2.0833vw;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
  font-size: 1.7083vw;
  color: #ffffff;
}
</style>