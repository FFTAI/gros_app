<template>
    <div class="loginMain">
        <rtc-header :is-logo="true" :is-login="true" @connect="toConnect()" @shutDown="promptBoxOpen()"></rtc-header>
        <div class="humanBody">
            <img class="openHuman" src="@/assets/images/image_onOpen.png" />
        </div>
        <div class="startContain" @click="startExplore()">
            <span class="startBtn">{{ $t('beginToExplore') }}</span>
        </div>
        <prompt-box v-if="promptVisible" :prompt="'closeSh'" @cancel="promptBoxOpen()" @confirm="shutDown()"></prompt-box>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import { mapState } from "vuex";
import Heartbeat from '@/mixin/Heartbeat';
import promptBox from '@/components/promptBox.vue';
export default {
    mixins: [Heartbeat],
    components: { rtcHeader, promptBox },
    computed: {
        ...mapState(["connected", "robot"])
    },
    data() {
        return {
            getFlag: true,
            promptVisible: false
        }
    },
    methods: {
        startExplore() {
            if (this.getFlag) {
                this.getFlag = false
                this.robot.control_svr_status()
                    .then(res => {
                        this.getFlag = true
                        console.log(this.connected, res.data.data)
                        if (this.connected && res.data.data) {
                            this.$router.push({
                                name: 'loading'
                            })
                        } else {
                            this.toConnect()
                        }
                    }).catch(err => {
                        this.toConnect()
                    })
            }
        },
        toConnect() {
            this.$router.push({
                name: "robotStartup"
            })
        },
        promptBoxOpen() {
            this.promptVisible = !this.promptVisible
        },
        shutDown() {
            fetch(process.env.VUE_APP_URL + '/robot/sdk_ctrl/close')
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
            this.promptBoxOpen()
        }
    }
}

</script>

<style lang="scss" scoped>
.loginMain {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/images/image_bkg.png");
    background-repeat: no-repeat;
    background-size: cover;
}

.humanBody {
    position: absolute;
    bottom: 0;
    left: 15.2917vw;
}

.openHuman {
    height: 38.0417vw;
    width: 27.0833vw
}

.startContain {
    position: absolute;
    bottom: 5.7292vw;
    right: 13.0208vw;
    width: 28.3333vw;
    height: 4.1667vw;
    background: #0075B8;
    border-radius: 2.0833vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.startBtn {
    font-size: 1.7188vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
    line-height: 2.3438vw;
}

// .circle {
//     width: 100px;
//     height: 100px;
//     position: absolute;
//     bottom: 15.7292vw;
//     right: 13.0208vw;
//     animation: expand 5s infinite;
//     border: 8px solid rgb(55, 127, 234);
//     border-radius: 50%;
//     overflow: hidden;
// }

// .particle {
//     position: absolute;
//     width: 10px;
//     height: 10px;
//     background-color: rgb(71, 71, 218);
//     border-radius: 50%;
//     animation: particleExpand 2s infinite;
// }

// @keyframes expand {
//     0% {
//         transform: scale(1);
//     }

//     50% {
//         transform: scale(2);
//     }

//     100% {
//         transform: scale(1);
//     }
// }

// @keyframes particleExpand {
//     0% {
//         transform: scale(0);
//         opacity: 1;
//     }

//     100% {
//         transform: scale(2);
//         opacity: 0;
//     }
// }
.txtBox {
    width: 33.3333vw;
    height: 20.8333vw;
    position: absolute;
    right: 8.3333vw;
    bottom: 17.5vw;
    color: #FFFFFF;
}
</style>