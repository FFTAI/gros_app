<template>
    <div>
        <!-- 左侧操控区 -->
        <div class="leftControl">
            <div class="firstControl">
                <img class="controlImg" @click="zero()" src="@/assets/images/btn_home.png" />
                <div class="controlTxt">Zero</div>
            </div>
            <div class="firstControl">
                <img class="controlImg" @click="stand()" src="@/assets/images/btn_Lower.png" />
                <div class="controlTxt">Stand</div>
            </div>
            <div style="flex: 1; margin-left: 0.6944vw; z-index: 999">
                <img class="branchImg" src="@/assets/images/btn_camera.png" @click="camera()" />
                <div style="font-size: 0.9722vw; color: #ffffff">Camera</div>
            </div>
        </div>
        <el-dialog :visible.sync="dialogHeaderVisoble" custom-class="dialogClass" center>
            <el-input v-model="headData.a" id="a"></el-input>
            <el-input v-model="headData.b" id="b"></el-input>
            <el-input v-model="headData.c" id="c"></el-input>
            <el-button @click="submit()">提交</el-button>
        </el-dialog>
    </div>
</template>
  
<script>
import { zero, stand } from "@/request/control"
import { mapState } from "vuex";
export default {
    name: "rtcLeftControl",
    data() {
        return {
            zeroTime: undefined,
            standTime: undefined,
            dialogHeaderVisoble: false,
            headData: {
                a: 0,
                b: 0,
                c: 0
            }
        }
    },
    computed: {
        ...mapState(['iP'])
    },
    methods: {
        zero() {
            if (!this.zeroTime) {
                zero(this.iP).then(res => {
                    if (res.data.code == 0 && res.data.msg == 'ok') {
                        setTimeout(() => {
                            this.$emit('closeLoading')
                        }, 2000);
                    }
                }).catch(err => {

                })
                this.zeroTime = setTimeout(() => {
                    this.zeroTime = null;
                }, 3000);
            }

        },
        stand() {
            if (!this.standTime) {
                stand(this.iP, { a: 0, b: 0, c: 0 }).then(res => {
                    if (res.data.code == 0 && res.data.msg == 'ok') {
                    }
                }).catch(err => {

                })
                this.standTime = setTimeout(() => {
                    this.standTime = null
                }, 3000);
            }

        },
        camera() {
            this.dialogHeaderVisoble = true
        },
        submit() {
            let data = {
                a: Number(this.headData.a),
                b: Number(this.headData.b),
                c: Number(this.headData.c),
            }
        //     _data = {  腰部
        //         "body": {
        //             "x": 0,      +-0.03
                    // "y": 0.04, # +-0.03
                    // "z": 0,   # 高矮 + -0.03
                    // "a": 0,     # 侧身 + 左 - 右 + - 0.04
                    // "b": 0,     # 前倾 + 前 - 后 + -0.04
                    // "c": 0   # 转身 + 左 - 右 + - 1
                    //         },
        //         "head": {  头部
        //             "a": 0,
        //             "b": 0,
        //             "c": 0
        //         }
        //     }
        //     console.log('head...', data)
            stand(this.iP, data).then(res => {
            }).catch(err => {

            })
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
  