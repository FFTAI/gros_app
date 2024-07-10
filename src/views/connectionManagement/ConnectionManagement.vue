<template>
  <div class="mainBox">
    <rtc-header :connection="true">
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
                    <span v-if="item.online">已连接</span>
                  </div>
                  <div v-else class="flex-center">
                    <div class="redPoint"></div>
                    <span>未连接</span>
                  </div>
                  <img style="
                        width: 1.1458vw;
                        height: 1.3542vw;
                      " src="@/assets/images/btn_del.png" @click.stop="delRobot(item.name)" />
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
    <transition name="fade">
      <div class="wrapper flex-center" v-if="addRobotVisible">
        <div class="prompt vertically-centered common-font">
          <div class="promptInputContent">
            <span class="promtTitle">绑定机器人</span>
            <div class="promptInput">
              <el-input v-model="robotName" placeholder="输入需绑定机器人名"></el-input>
            </div>
          </div>
          <div class="btnBox flex-between">
            <div class="btn white01-bkg" @click="promptCancel('a')">{{ $t("cancel") }}</div>
            <div class="btn purple" @click="commitRobot('a')">
              {{ $t("confirm") }}
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="wrapper flex-center" v-if="delRobotVisible">
        <div class="prompt vertically-centered common-font">
          <div class="promptInputContent" style="margin-top: 2.5vw;">
            <img style="width: 4.1667vw; height: 3.8542vw;" src="@/assets/images/warning1.png" />
            <span class="promtTitle">是否删除当前机器人?</span>
          </div>
          <div class="btnBox flex-between">
            <div class="btn white01-bkg" @click="promptCancel('d')">{{ $t("cancel") }}</div>
            <div class="btn purple" @click="commitRobot('d')">
              {{ $t("confirm") }}
            </div>
          </div>
        </div>
      </div>
    </transition>
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
      robotName: '',
      delRobotVisible: false,
      delRobotName: '',
    };
  },
  created() { },
  mounted() {
    this.initRobotList();
    // localStorage.setItem('robotList', JSON.stringify([{online:false,name:'Gr2'},{online:true,name:'jaxaxx'},{online:false,name:'fftai-5g-test'}]))
  },
  methods: {
    async initRobotList() {
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
            this.getCarouselList()
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
      this.$store.commit("setCurrRobot", e.name);
      this.$router.push({
        name: "controller",
        query: { robotName: e.name }
      });
    },
    promptCancel(e) {
      switch (e) {
        case 'a':
          this.addRobotVisible = false;
          this.robotName = ''
          break;
        case 'd':
          this.delRobotVisible = false;
          this.delRobotName = ''
          break;
        default:
          break;
      }
    },
    commitRobot(e) {
      if (e == 'a') {
        http
          .get("/query", { params: { robotName: this.robotName } })
          .then((response) => {
            if (response.data.data.status) {
              this.robotList.push({ online: true, name: this.robotName })
              this.carouselList = []
              this.getCarouselList()
              localStorage.setItem('robotList', JSON.stringify(this.robotList))
              this.addRobotVisible = false;
              this.robotName = ''
            } else {
              this.$message.error('该机器人名不存在');
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (e == 'd') {
        console.log(this.delRobotName, this.robotList, localStorage.getItem('robotList'))
        let list = this.robotList.filter(item => item.name != this.delRobotName)
        this.robotList = list
        this.carouselList = []
        this.getCarouselList()
        localStorage.setItem('robotList', JSON.stringify(list))
        this.delRobotVisible = false
        this.delRobotName = ''
      }
    },
    delRobot(e) {
      this.delRobotName = e
      this.delRobotVisible = true
    },
    getCarouselList() {
      for (let i = 0; i < this.robotList.length; i += 3) {
        if (i == 0) {
          this.carouselList.push(this.robotList.slice(0, 3));
        } else {
          this.carouselList.push({})
          this.carouselList.push(this.robotList.slice(i - 1, i + 3));
        }
      }
      console.log('carouselList', this.carouselList);
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
  width: 21.875vw;
  height: 27.0833vw;
  border-radius: 0.625vw;
  border: 0.0521vw dashed #D71AFF;
  order: -2;
  flex-direction: column;

  .add {
    width: 10.4167vw;
    height: 10.4167vw;
    background: rgba(218, 195, 255, 0.1);
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
      background: #FFFFFF;
      opacity: 0.2;
    }

    .cardContent {
      height: 24.0104vw;
      flex-direction: column;
    }
  }

  .uncheckedCard {
    background: linear-gradient(180deg,
        #484154 0%,
        #30293F 100%);
    border: 0.0417vw solid #484154;
  }

  .checkedCard {
    background: linear-gradient(180deg,
        rgba(139, 62, 255, 0.7) 0%,
        rgba(122, 36, 253, 0.7) 100%);
    border: 0.0417vw solid #484154;
  }

  .top {
    order: -1;
  }
}

.redPoint {
  width: 0.4688vw;
  height: 0.4688vw;
  background: #ff6656;
  border-radius: 50%;
  margin-right: 0.625vw;
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
  font-size: 1.4583vw;
  position: absolute;
  bottom: 2.7083vw;
}

.btn {
  width: 12.5vw;
  height: 4.1667vw;
  border-radius: 2.2083vw;
  line-height: 4.1667vw;
  text-align: center;
}

.purple {
  background: linear-gradient(180deg,
      rgba(139, 62, 255, 0.7) 0%,
      rgba(122, 36, 253, 0.7) 100%);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>