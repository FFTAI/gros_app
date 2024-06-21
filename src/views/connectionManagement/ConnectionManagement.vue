<template>
  <div class="mainBox">
    <rtc-header>
      <div class="headStateSr">
        <span class="headTxtSr common-font">连接管理</span>
      </div>
    </rtc-header>
    <div class="cmContent flex-center">
      <!-- 正常情况下的机器人列表 -->
      <div class="robotBox">
        <el-carousel indicator-position="none" :autoplay="false" arrow="nerver" height="28.125vw">
          <el-carousel-item v-for="(list, i) in carouselList" :key="i">
            <div class="carouselItem">
              <div class="addCard flex-center" @click="addRobot()">
                <div class="add flex-center">
                  <img class="addImg" src="@/assets/images/icon_add.png" />
                </div>
                <div class="addContent">添加机器人</div>
              </div>
              <!-- 机器人列表 -->
              <div class="robotCard uncheckedCard" :class="{ checkedCard: item.online }" v-for="(item, index) in list"
                :key="index" @click="choseCard(item)">
                <div class="cardTitle common-font flex-between">
                  <div v-if="item.online" class="flex-center">
                    <img style="
                        width: 1.5417vw;
                        height: 1.125vw;
                        margin-right: 0.375vw;
                      " src="@/assets/images/icon_Wi-Fi.png" />
                    <span v-if="item.online">Wi-Fi连接</span>
                  </div>
                  <div v-else class="flex-center">
                    <div class="redPoint"></div>
                    <span style="color: #FF6656;">未连接</span>
                  </div>
                </div>
                <div class="cardDivider"></div>
                <div class="cardContent flex-center">
                  <img style="width: 6.1849vw; height: 12.5vw" src="@/assets/images/image_robotModel.png" />
                  <span style="font-size: 1.6667vw; margin-top: 1.25vw">{{ item.name }}</span>
                  <span style="opacity: 0.5; margin-top: 0.625vw">GR-1</span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="wrapper flex-center" v-if="addRobotVisible">
      <div class="prompt vertically-centered common-font">
        <div class="promptInputContent">
          <span class="promtTitle">绑定机器人</span>
          <div class="promptInput">
            <el-input v-model="robotName" placeholder="输入需绑定机器人名"></el-input>
          </div>
        </div>
        <div class="btnBox flex-between">
          <div class="btn white01-bkg" @click="promptCancel()">{{ $t("cancel") }}</div>
          <div class="btn blue" @click="commitRobot()">
            {{ $t("confirm") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import http from "@/http/axios.js";
export default {
  components: { rtcHeader },
  data() {
    return {
      robotList: [],
      carouselList: [],
      addRobotVisible: false,
      robotName: ''
    };
  },
  created() { },
  mounted() {
    this.initRobotList();
    // localStorage.setItem('robotList', JSON.stringify([{online:true,name:'Gr2'},{online:true,name:'Gr3'}]))
  },
  methods: {
    async initRobotList() {
      // http
      //   .get("/list")
      //   .then((response) => {
      //     console.log(response);
      //     this.robotList = response.data.data
      //     for (let i = 0; i < this.robotList.length; i += 4) {
      //       if (i == 0) {
      //         this.carouselList.push(this.robotList.slice(0, 4));
      //       } else {
      //         this.carouselList.push(this.robotList.slice(i - 1, i + 4));
      //       }
      //     }
      //     console.log(this.carouselList);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });

      // localStorage.removeItem('robotList')
      this.robotList = JSON.parse(localStorage.getItem('robotList'))
      if (this.robotList == null) {
        this.robotList = []
        this.carouselList.push({})
      } else {
        const names = this.robotList;
        const promises = names.map(url => http.get("/query", { params: { robotName: url.name } }));
        Promise.all(promises)
          .then(results => {
            this.robotList = []
            results.forEach((item) => {
              this.robotList.push({ online: item.data.data.status, name: item.data.data.robotName })
            })
            for (let i = 0; i < this.robotList.length; i += 3) {
              if (i == 0) {
                this.carouselList.push(this.robotList.slice(0, 3));
              } else {
                this.carouselList.push({})
                this.carouselList.push(this.robotList.slice(i - 1, i + 3));
              }
            }
          })
          .catch(errors => {
            console.error('Errors occurred:', errors);
          });
      }
    },
    addRobot() {
      this.addRobotVisible = true;
    },
    choseCard(e) {
      if (!e.online) return
      this.$store.commit("setCurrRobot", e);
      this.$bus.$emit("initWs", e);
      this.$router.push({
        name: "loading",
      });
    },
    promptCancel() {
      this.addRobotVisible = false;
    },
    commitRobot() {
      http
        .get("/query", { params: { robotName: this.robotName } })
        .then((response) => {
          if (response.data.data.status) {
            this.robotList.push({ online: true, name: this.robotName })
            localStorage.setItem('robotList', JSON.stringify(this.robotList))
            this.addRobotVisible = false;
          } else {
            this.$message.error('该机器人名不存在');
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
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
  width: 21.7708vw;
  height: 26.9792vw;
  border-radius: 0.625vw;
  border: 0.0521vw dashed #0075b8;
  order: -2;
  flex-direction: column;

  .add {
    width: 10.4167vw;
    height: 10.4167vw;
    background: rgba(68, 216, 251, 0.1);
    border-radius: 50%;

    .addImg {
      width: 3.125vw;
      height: 3.125vw;
    }
  }

  .addContent {
    margin-top: 3.6979vw;
    font-family: AlibabaPuHuiTiM;
    font-size: 1.6667vw;
    color: #ffffff;
  }
}

.addCardMore {
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

.cmContent {
  position: absolute;
  left: 0;
  top: 4.4444vw;
  width: 100%;
  height: calc(100% - 4.4444vw);
  flex-direction: column;
}

.robotBox {
  width: 93.875vw;
  height: 27.125vw;

  .carouselItem {
    display: flex;
    flex-wrap: wrap;
    gap: 2.0833vw;
  }

  .robotCard {
    width: 21vw;
    height: 27.0313vw;
    border-radius: 0.8333vw;
    color: #ffffff;
    font-size: 1vw;

    .cardTitle {
      padding-left: 1.5625vw;
      padding-right: 1.4063vw;
      height: 3.0208vw;
      align-items: center;
    }

    .cardDivider {
      width: 21vw;
      height: 0.0521vw;
      background: #44d8fb;
      opacity: 0.3;
    }

    .cardContent {
      height: 24.0104vw;
      flex-direction: column;
    }
  }

  .robotCardMore {
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
    background: linear-gradient(180deg,
        rgba(0, 130, 187, 0.9) 0%,
        rgba(0, 75, 133, 0.8) 100%);
    border: 0.0417vw solid #0075b8;
  }

  .top {
    order: -1;
  }
}

.completeBtn {
  // position: absolute;
  // bottom: 3.9583vw;
  // left: 50%;
  // transform: translate(
  //   -50%,
  //   0
  // );
  margin-top: 4.6875vw;
  width: 18.4583vw;
  height: 4.1667vw;
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  border-radius: 2.0833vw;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
  font-size: 1.7083vw;
  color: #ffffff;
}

@media screen and (min-width: 2400px) and (max-height: 1080px) {
  .completeBtn {
    margin-top: 3.125vw;
  }
}

.redPoint {
  width: 0.4688vw;
  height: 0.4688vw;
  background: #ff6656;
  border-radius: 50%;
  margin-right: 0.625vw;
}

.modeChoseDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 62.5vw;
  height: 39.0625vw;
  background-image: url("../../assets/images/image_modeBkg.png");
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 999;
  display: flex;
  justify-content: center;
  font-family: AlibabaPuHuiTiM;
  font-size: 1.4583vw;
  color: #ffffff;

  .title {
    position: absolute;
    top: 2.8125vw;
    font-size: 1.6667vw;
  }

  .content {
    position: absolute;
    top: 10.625vw;
    width: 56.25vw;
    display: flex;
    gap: 3.125vw;

    .mode {
      width: 26.5625vw;
      height: 17.8125vw;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      justify-content: center;

      .modeTxt {
        position: absolute;
        bottom: 3.4375vw;
        font-size: 1.25vw;
        opacity: 0.7;
      }

      .modeName {
        position: absolute;
        bottom: -4.0625vw;
      }
    }

    .left {
      background-image: url("../../assets/images/image_Wi-Fimode.png");
    }

    .right {
      background-image: url("../../assets/images/image_apmode.png");
    }
  }
}

.cardPointSr {
  width: 5.1667vw;
  height: 0.75vw;
  margin-top: 3.125vw;

  .pointSr {
    width: 0.75vw;
    height: 0.75vw;
    background: #44d8fb;
    border-radius: 0.5vw;
    opacity: 0.2;
  }

  .pointSrActivity {
    opacity: 1;
    width: 2.4583vw;
  }
}

@media screen and (min-width: 2400px) and (max-height: 1080px) {
  .cardPointSr {
    margin-top: 2.0833vw;
  }
}

//弹框
.prompt {
  z-index: 999;
  width: 35.7083vw;
  height: 20.9167vw;
  background-image: url("../../assets/images/image_card.png");
  background-repeat: no-repeat;
  background-size: cover;
  font-size: $size-41;
  color: $white;
  display: flex;
  justify-content: center;
}

.btnBox {
  width: 27.0833vw;
  font-size: 1.7083vw;
  position: absolute;
  bottom: 2.7083vw;
}

.btn {
  width: 12.3333vw;
  height: 4.1667vw;
  border-radius: 2.2083vw;
  line-height: 4.1667vw;
  text-align: center;
}

.blue {
  background: $base-bkg;
}

.promptInputContent {
  display: flex;
  flex-direction: column;
  align-items: center;

  .promtTitle {
    font-family: AlibabaPuHuiTiM;
    font-size: 1.6667vw;
    color: #ffffff;
    font-style: normal;
    margin-top: 1.7917vw;
  }

  .promptInput {
    width: 15.5833vw;
    height: 2.3333vw;
    padding: 1.2917vw 5.7083vw 1.2917vw 5.7917vw;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.25vw;
    margin-top: 1.9583vw;
  }
}

.promptInputContent ::v-deep .el-input {
  font-size: 1.4583vw;
}

.promptInputContent ::v-deep .el-input .el-input__inner {
  height: 2.3333vw;
  padding: 0;
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  border: none;
}
</style>