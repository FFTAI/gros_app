<template>
    <div class="loginMain">
        <rtc-header :is-logo="true" :is-login="true" @connect="toConnect()"></rtc-header>
        <div class="humanBody">
            <img class="openHuman" src="@/assets/images/image_onOpen.png" />
        </div>
        <div class="startContain" @click="startExplore()">
            <span class="startBtn">{{ $t('beginToExplore') }}</span>
        </div>
        <!-- <div class="circle">
            <div class="particle"></div>
        </div> -->
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import { mapState } from "vuex";
import { get_robot_type } from "gros-client";
export default {
    components: { rtcHeader },
    computed: {
        ...mapState(["connected"])
    },
    data() {
        return {

        }
    },
    mounted() {
        get_robot_type({host: '192.168.12.1', port: '8001'}).then(res=>{
            this.$store.commit('setConnected', true)
        })
    },
    methods: {
        startExplore() {
            console.log(this.connected)
            if (this.connected) {
                this.$router.push({
                    name: 'loading'
                })
            } else {
                this.toConnect()
            }

        },
        toConnect() {
            this.$router.push({
                name: "connect"
            })
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
    left: 16.667vw;
}

.openHuman {
    height: 32.1875vw;
    width: 22.9167vw;
}

.startContain {
    position: absolute;
    bottom: 5.7292vw;
    right: 13.0208vw;
    width: 29.5313vw;
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
</style>