<template>
    <div class="container">
        <el-container>
            <el-header height="4.4444vw">
                <div class="header"></div>
                <img class="headerLogo" src="@/assets/images/image_logo.png" />
                <div class="headerTitle">请选择需要操控的设备</div>
            </el-header>

            <el-main>
                <div class="roomBox">
                    <el-carousel trigger="click" :height="cheight" :autoplay="false">
                        <el-carousel-item v-for="item in totalPage" :key="item">
                            <div class="carouselItem">
                                <div class="box" v-for="(i, index) in roomList" :key="index">
                                    <div class="cardImg" @click="join(i)">
                                        <div class="cardImg-status">
                                            <span class="cardImg-statusF" style="color: #DC4253;"
                                                v-if="i.status != 1">Locked</span>
                                            <span class="cardImg-statusF" v-else>Free</span>
                                        </div>
                                        <div class="cardImg-pic">
                                            <div class="cardImg-picLogo"
                                                :class="i.status != 1 ? 'cardImg-colorL' : 'cardImg-colorF'">
                                                <img style="height:3.9583vw;width:3.9583vw;"
                                                    src="@/assets/images/icon_dog.png" v-if="i.type == 2" />
                                                <img style="height:3.9583vw;width:3.9583vw;"
                                                    src="@/assets/images/icon_wheel.png" v-else />
                                            </div>
                                        </div>
                                        <div class="cardImg-txt">
                                            {{ i.host }}:{{ i.port }}
                                        </div>
                                        <div class="cardImg-txt" style="font-size: 1.25vw;">
                                            {{ i.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
  
<script>
import { getRoomList } from "@/request/room";
export default {
    name: "RoomList",
    data() {
        return {
            roomList: [
                {
                    type: 1,
                    status: 1
                },
                {
                    type: 2,
                    status: 1
                },
                {
                    type: 3,
                    status: 2
                }
            ],
            totalPage: 1,
            screenHeight: window.innerHeight,
            cheight: '45.1389vw'
        }
    },
    created() {
        this.startFullScreen()//强制全屏
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.screenHeight = window.innerHeight
            })()
        }
        this.initData();
        this.timer = setInterval(() => {
            this.initData();
        }, 3000);
    },
    beforeDestroy() {
        // 销毁定时器
        this.$once('hook:beforeDestroy', () => {
            clearInterval(this.timer);
        })
    },
    watch: {
        //根据屏幕高度的变化，调整走马灯的高度
        screenHeight: function (n, o) {
            console.log('原屏幕高度', o, '现屏幕高度', n)
            if (n > 350 && n <= 400) {
                this.cheight = '37vw'
            } else if (n > 400 && n < 450) {
                this.cheight = '36vw'
            } else if (n <= 350) {
                this.cheight = '32vw'
            } else {
                this.cheight = '45.1389vw'
            }
        }
    },
    methods: {
        initData() {
            getRoomList().then((data) => {
                console.log('getRoomList', data);
                this.roomList = data.data.data
                this.totalPage = this.roomList.length
            }).catch((err) => {
                console.error('getRoomList', err);
            })
        },
        join(room) {
            if (room.status != 1) return
            this.$router.replace({
                path: '/controller',
                query: {
                    roomName: room.name,
                    streamId: room.stream_id,
                    host: room.host,
                    port: room.port,
                    type: room.kind
                }
            })
        },
        //强制全屏进入
        startFullScreen() {
            var el = document.documentElement;
            //element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
            var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
            } else if (typeof window.ActiveXObject != "undefined") {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            } else if (el.oRequestFullscreen) {
                el.oRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else {
                alert('浏览器不支持全屏调用！');
            }
        },
    }
}
</script>
  
<style scoped>
.container {
    height: 100%;
    background: linear-gradient(180deg, #004C81 0%, #0B1F2D 100%);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.header {
    width: 100%;
    height: 4.4444vw;
    background: linear-gradient(274deg, #1A1919 0%, #004C81 100%);
    opacity: 0.4;
}

.headerLogo {
    position: absolute;
    top: 2%;
    left: 2%;
    width: 8.3333vw;
    height: 2.4306vw;
    z-index: 999;
}

.headerTitle {
    position: absolute;
    top: 2%;
    left: 42%;
    font-size: 1.7361vw;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 1.9444vw;
}

.roomBox {
    height: 100%;
    width: 100%;
    /* padding: 0 6.1806vw; */
}

.el-header {
    padding: 0;
}

.carouselItem {
    width: 100%;
    height: 100%;
    /* background-color: rgb(219, 226, 224); */

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.box {
    width: 25%;
    height: 50%;
    /* background-color: #ccc; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6667vw;
    font-weight: bold;
    text-align: center;
}

.cardImg {
    position: relative;
    width: 21.3889vw;
    height: 14.7222vw;
    background-image: url("@/assets/images/image_normal.png");
    background-repeat: no-repeat;
    background-size: contain;
}

.cardImg-status {
    position: absolute;
    right: 0;
    top: 1.1111vw;
    width: 4.4444vw;
    height: 1.9444vw;
    background: rgba(3, 44, 73, 0.5);
    border-radius: .9722vw 0 0 .9722vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cardImg-statusF {
    font-size: 1.1111vw;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #3BCFAD;
    line-height: 1.4583vw;
}

.cardImg-pic {
    display: flex;
    justify-content: center;
    padding: 1.7361vw 0 .7639vw 0;
}

.cardImg-picLogo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5.6944vw;
    height: 5.6944vw;
    background: rgba(3, 44, 73, 0.5);
    border-radius: 50%;
}

.cardImg-colorF {
    border: .1389vw solid #3BCFAD;
}

.cardImg-colorL {
    border: .1389vw solid #DC4253;
}

.cardImg-txt {
    font-size: .9722vw;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 1.1111vw;
    padding-top: .7639vw;
}
</style>