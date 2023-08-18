<template>
    <div>
      <!-- 左侧操控区 -->
      <div class="leftControl">
        <div class="firstControl">
          <img class="controlImg" @click="choseMode(0)" :src="modeSrc[0].src" />
          <div class="controlTxt">Mode</div>
        </div>
        <div class="firstControl" style="margin-left: 0.6944vw">
          <img
            class="branchImg"
            @click="choseAction(0)"
            :src="actionSrc[0].src"
          />
          <div class="controlTxt">Action</div>
        </div>
        <div style="flex: 1; margin-left: 0.6944vw; z-index: 999">
          <img
            class="branchImg"
            src="@/assets/images/btn_camera.png"
            @click="doCamera()"
          />
          <div style="font-size: 0.9722vw; color: #ffffff">Camera</div>
        </div>
      </div>
      <div class="leftControlBranch branch1">
        <el-row :gutter="20">
          <el-col :span="8">
            <img
              class="controlImg"
              v-show="showMode"
              @click="choseMode(1)"
              :src="modeSrc[1].src"
            />
          </el-col>
          <el-col :span="8">
            <img
              class="controlImg"
              v-show="showMode"
              @click="choseMode(2)"
              :src="modeSrc[2].src"
            />
          </el-col>
          <el-col :span="8">
            <img
              class="controlImg"
              v-show="showMode"
              @click="choseMode(3)"
              :src="modeSrc[3].src"
            />
          </el-col>
        </el-row>
      </div>
      <div class="leftControlBranch branch2">
        <el-row :gutter="20">
          <el-col :span="6">
            <img
              class="branchImg"
              v-show="showAction"
              @click="choseAction(1)"
              :src="actionSrc[1].src"
            />
          </el-col>
          <el-col :span="6">
            <img
              class="branchImg"
              v-show="showAction"
              @click="choseAction(2)"
              :src="actionSrc[2].src"
            />
          </el-col>
          <el-col :span="6">
            <img
              class="branchImg"
              v-show="showAction"
              @click="choseAction(3)"
              :src="actionSrc[3].src"
            />
          </el-col>
          <el-col :span="6">
            <img
              class="branchImg"
              style="z-index: 1002;"
              v-show="showAction"
              @click="findingWay()"
              :src="actionSrc[4].src"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "rtcLeftControl",
    props: [ 'showMode', 'showAction', 'modeSrc', 'actionSrc'],
    methods: {
      choseMode(e) {
          this.$emit('choseMode',e)
      },
      choseAction(e) {
          this.$emit('choseAction',e)
      },
      doCamera() {
        this.$emit('doCamera')
      },
      findingWay() {
        this.$emit('findingWay')
      }
    }
  };
  </script>
  
  <style lang="scss">
  .leftControl {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    left: 5vw;
    top: 6.9444vw;
    height: 11.8056vw;
    width: 6.25vw;
  }
  
  .firstControl {
    flex: 1;
    margin-bottom: 1.4vw;
    z-index: 999;
    text-align: center;
  }
  
  .controlTxt {
    font-size: 0.9722vw;
    color: #ffffff;
    z-index: 999;
  }
  
  .leftControlBranch {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    left: 12vw;
    height: 3.8056vw;
    width: 19.25vw;
    text-align: center;
  }
  
  .branch1 {
    top: 6.9444vw;
    z-index: 999;
  }
  
  .branch2 {
    top: 13.6vw;
    z-index: 999;
  }
  
  .controlImg {
    width: 5.5556vw;
    height: 3.4722vw;
    margin: auto;
  }
  
  .branchImg {
    width: 4.1667vw;
    height: 4.1667vw;
    margin: auto;
  }
  </style>
  