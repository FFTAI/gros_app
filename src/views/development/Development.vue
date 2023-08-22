<template>
    <div class="container">
        <rtc-header>
            <div class="headState">
                <span class="headTxt">{{ $t('developerMode') }}</span>
                <div class="arrow"></div>
            </div>
        </rtc-header>
        <div class="mainBox">
            <div class="leftBox">
                <img class="humanModel" src="@/assets/images/icon_model.png" v-show="activated == 'dynamic'" />
                <div class="logBox" v-show="activated == 'log'">
                    <div class="logTitle">{{ $t('logoFile') }}</div>
                    <div class="logMain">
                        <el-timeline>
                            <el-timeline-item v-for="(activity, index) in logList" :key="index" :type="activity.type"
                                :timestamp="activity.timestamp" :placement="activity.placement">
                                <p class="logTxt">{{ activity.content }}</p>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
                <div class="modelChose">
                    <div class="modelBtn" :class="{ 'activatedModel': activated == 'dynamic' }"
                        @click="changeModel('dynamic')">
                        <span class="btnTxt">{{ $t('dynamicShowcase') }}</span>
                    </div>
                    <div class="modelBtn" :class="{ 'activatedModel': activated == 'log' }" style="margin-left: .8854vw;"
                        @click="changeModel('log')">
                        <span class="btnTxt">{{ $t('logoFile') }}</span>
                    </div>
                </div>
            </div>
            <div class="rightBox">
                <div class="rightTitle logTitle">
                    <span>{{ $t('leftSide') }}</span>
                    <span>{{ $t('rightSide') }}</span>
                </div>
                <div class="sideChart">
                    <div class="chartSize" id="leftChart"></div>
                    <div class="chartSize" id="rightChart"></div>
                </div>
                <div class="rightTable">
                    <div class="tableItem">
                        <div class="itemChild">{{ leftHipPitch_qa ? leftHipPitch_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'hipPitch' ? 'middleCurr' : 'middle'"
                            @click="changeItem('hipPitch')">Hip Pitch<div class="downArrow"
                                v-if="activatedItem == 'hipPitch'"></div>
                        </div>
                        <div class="itemChild">{{ rightHipPitch_qa ? rightHipPitch_qa + '°' : '' }}</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">{{ leftHipYaw_qa ? leftHipYaw_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'hipYaw' ? 'middleCurr' : 'middle'"
                            @click="changeItem('hipYaw')">Hip Yaw<div class="downArrow" v-if="activatedItem == 'hipYaw'">
                            </div>
                        </div>
                        <div class="itemChild">{{ rightHipYaw_qa ? rightHipYaw_qa + '°' : '' }}</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">{{ leftHipRoll_qa ? leftHipRoll_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'hipRoll' ? 'middleCurr' : 'middle'"
                            @click="changeItem('hipRoll')">Hip Roll<div class="downArrow" v-if="activatedItem == 'hipRoll'">
                            </div>
                        </div>
                        <div class="itemChild">{{ rightHipRoll_qa ? rightHipRoll_qa + '°' : '' }}</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">{{ leftKnee_qa ? leftKnee_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'knee' ? 'middleCurr' : 'middle'"
                            @click="changeItem('knee')">Knee<div class="downArrow" v-if="activatedItem == 'knee'"></div>
                        </div>
                        <div class="itemChild">{{ rightKnee_qa ? rightKnee_qa + '°' : '' }}</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">{{ leftAnklePitch_qa ? leftAnklePitch_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'anklePitch' ? 'middleCurr' : 'middle'"
                            @click="changeItem('anklePitch')">Ankle Pitch
                            <div class="downArrow" v-if="activatedItem == 'anklePitch'"></div>
                        </div>
                        <div class="itemChild">{{ rightAnklePitch_qa ? rightAnklePitch_qa + '°' : '' }}</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">{{ leftAnkleRoll_qa ? leftAnkleRoll_qa + '°' : '' }}</div>
                        <div class="itemChild" :class="activatedItem == 'ankleRoll' ? 'middleCurr' : 'middle'"
                            @click="changeItem('ankleRoll')">Ankle Roll
                            <div class="downArrow" v-if="activatedItem == 'ankleRoll'"></div>
                        </div>
                        <div class="itemChild">{{ rightAnkleRoll_qa ? rightAnkleRoll_qa + '°' : '' }}</div>
                    </div>
                </div>
                <div class="speedChart">
                    <div class="xChart">
                        <div class="chatItem" style="flex: 1;">
                            <div>{{ $t('xSpeed') }}</div>
                            <div>{{ xSpeed }}m/s</div>
                        </div>
                        <div class="chatItem" style="flex: 2;">
                            <div class="sChartSize" id="xChart"></div>
                        </div>
                    </div>
                    <div class="yChart">
                        <div class="chatItem" style="flex: 1;">
                            <div>{{ $t('ySpeed') }}</div>
                            <div>{{ ySpeed }}m/s</div>
                        </div>
                        <div class="chatItem" style="flex: 2;">
                            <div class="sChartSize" id="yChart"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import * as echarts from 'echarts';

export default {
    components: { rtcHeader },
    data() {
        return {
            activated: "log",
            logList: [],
            leftHipPitch_qa: '',
            leftHipPitch_qdota: '',
            leftHipPitch_taua: '',
            leftHipYaw_qa: '',
            leftHipYaw_qdota: '',
            leftHipYaw_taua: '',
            leftHipRoll_qa: '',
            leftHipRoll_qdota: '',
            leftHipRoll_taua: '',
            leftKnee_qa: '',
            leftKnee_qdota: '',
            leftKnee_taua: '',
            leftAnklePitch_qa: '',
            leftAnklePitch_qdota: '',
            leftAnklePitch_taua: '',
            leftAnkleRoll_qa: '',
            leftAnkleRoll_qdota: '',
            leftAnkleRoll_taua: '',
            rightHipPitch_qa: '',
            rightHipPitch_qdota: '',
            rightHipPitch_taua: '',
            rightHipYaw_qa: '',
            rightHipYaw_qdota: '',
            rightHipYaw_taua: '',
            rightHipRoll_qa: '',
            rightHipRoll_qdota: '',
            rightHipRoll_taua: '',
            rightKnee_qa: '',
            rightKnee_qdota: '',
            rightKnee_taua: '',
            rightAnklePitch_qa: '',
            rightAnklePitch_qdota: '',
            rightAnklePitch_taua: '',
            rightAnkleRoll_qa: '',
            rightAnkleRoll_qdota: '',
            rightAnkleRoll_taua: '',
            xSpeed: '',
            ySpeed: '',
            leftSideChartData: [],
            rightSideChartData: [],
            leftSpeedChartData: [],
            rightSpeedChartData: [],
            activatedItem: 'hipPitch'
        }
    },
    created() {

    },
    mounted() {
        this.initSideCharts()
        this.initSpeedCharts()
        this.$robot.getType().then(r => {
            console.log('getType=========', r);
        })

        this.$robot.enable_debug_state(1)
        // this.$robot.jointStates()

        this.$robot.on_message(data => {
            let currData = JSON.parse(data.data)
            console.log('on_message===============', currData)
            this.assignData(JSON.parse(data.data).data.states)
            if (currData.data.log && currData.data.log.logBuffer)
                this.getLog(currData.data.log.logBuffer)
            this.updateSideCharts(this.activatedItem)
            this.updateSpeedCharts()
        })
    },
    watch: {
        activatedItem(newVal, oldVal) {
            console.log(newVal)
            this.updateSideCharts(newVal)
        }
    },
    methods: {
        changeModel(e) {
            this.activated = e
        },
        loadLog() {
            this.logList.push({
                content: '主程序已启动',
                timestamp: '2023/8/15 15:37',
                placement: 'top'
            })
        },
        initSideCharts() {
            var leftChart = echarts.init(document.getElementById('leftChart'));
            var rightChart = echarts.init(document.getElementById('rightChart'));
            leftChart.setOption({
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        name: 'angle',
                        data: this.leftSideChartData,
                        type: 'line',
                        smooth: true
                    }
                ]
            })
            rightChart.setOption({
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        name: 'angle',
                        data: this.rightSideChartData,
                        type: 'line',
                        smooth: true
                    }
                ]
            })
        },
        initSpeedCharts() {
            var xChart = echarts.init(document.getElementById('xChart'));
            var yChart = echarts.init(document.getElementById('yChart'));
            xChart.setOption({
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        name: 'speed',
                        data: this.leftSpeedChartData,
                        type: 'line',
                        smooth: true
                    }
                ]
            })
            yChart.setOption({
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        name: 'speed',
                        data: this.rightSpeedChartData,
                        type: 'line',
                        smooth: true
                    }
                ]
            })
        },
        assignData(data) {
            this.leftHipPitch_qa = this.toDegrees(data.jointStates[2].qa)
            this.leftHipPitch_qdota = data.jointStates[2].qdota
            this.leftHipPitch_taua = data.jointStates[2].taua
            this.leftHipYaw_qa = this.toDegrees(data.jointStates[1].qa)
            this.leftHipYaw_qdota = data.jointStates[1].qdota
            this.leftHipYaw_taua = data.jointStates[1].taua
            this.leftHipRoll_qa = this.toDegrees(data.jointStates[0].qa)
            this.leftHipRoll_qdota = data.jointStates[0].qdota
            this.leftHipRoll_taua = data.jointStates[0].taua
            this.leftKnee_qa = this.toDegrees(data.jointStates[3].qa)
            this.leftKnee_qdota = data.jointStates[3].qdota
            this.leftKnee_taua = data.jointStates[3].taua
            this.leftAnklePitch_qa = this.toDegrees(data.jointStates[4].qa)
            this.leftAnklePitch_qdota = data.jointStates[4].qdota
            this.leftAnklePitch_taua = data.jointStates[4].taua
            this.leftAnkleRoll_qa = this.toDegrees(data.jointStates[5].qa)
            this.leftAnkleRoll_qdota = data.jointStates[5].qdota
            this.leftAnkleRoll_taua = data.jointStates[5].taua
            this.rightHipPitch_qa = this.toDegrees(data.jointStates[8].qa)
            this.rightHipPitch_qdota = data.jointStates[8].qdota
            this.rightHipPitch_taua = data.jointStates[8].taua
            this.rightHipYaw_qa = this.toDegrees(data.jointStates[7].qa)
            this.rightHipYaw_qdota = data.jointStates[7].qdota
            this.rightHipYaw_taua = data.jointStates[7].taua
            this.rightHipRoll_qa = this.toDegrees(data.jointStates[6].qa)
            this.rightHipRoll_qdota = data.jointStates[6].qdota
            this.rightHipRoll_taua = data.jointStates[6].taua
            this.rightKnee_qa = this.toDegrees(data.jointStates[9].qa)
            this.rightKnee_qdota = data.jointStates[9].qdota
            this.rightKnee_taua = data.jointStates[9].taua
            this.rightAnklePitch_qa = this.toDegrees(data.jointStates[10].qa)
            this.rightAnklePitch_qdota = data.jointStates[10].qdota
            this.rightAnklePitch_taua = data.jointStates[10].taua
            this.rightAnkleRoll_qa = this.toDegrees(data.jointStates[11].qa)
            this.rightAnkleRoll_qdota = data.jointStates[11].qdota
            this.rightAnkleRoll_taua = data.jointStates[11].taua
            this.xSpeed = data.basestate.vx.toFixed(2)
            this.ySpeed = data.basestate.vy.toFixed(2)
        },
        getLog(data) {
            data.forEach(element => {
                let item = {}
                item.content = element.log
                item.placement = 'top'
                item.timestamp = this.dateFormart()
                this.logList.push(item)
            })
        },
        dateFormart() {
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth() + 1;
            var day = currentDate.getDate();
            var hours = currentDate.getHours();
            var minutes = currentDate.getMinutes();
            var formattedDate = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
            return formattedDate;
        },
        toDegrees(e) {
            var degrees = e * (180 / Math.PI);
            return degrees.toFixed(2)
        },
        updateSideCharts(e) {
            // this.leftSideChartData = []
            // this.rightSideChartData = []
            switch (e) {
                case 'hipPitch':
                    this.leftSideChartData.push(this.leftHipPitch_qa)
                    this.rightSideChartData.push(this.rightHipPitch_qa)
                    break;
                case 'hipYaw':
                    this.leftSideChartData.push(this.leftHipYaw_qa)
                    this.rightSideChartData.push(this.rightHipYaw_qa)
                    break;
                case 'hipRoll':
                    this.leftSideChartData.push(this.leftHipRoll_qa)
                    this.rightSideChartData.push(this.rightHipRoll_qa)
                    break;
                case 'knee':
                    this.leftSideChartData.push(this.leftKnee_qa)
                    this.rightSideChartData.push(this.rightKnee_qa)
                    break;
                case 'anklePitch':
                    this.leftSideChartData.push(this.leftAnklePitch_qa)
                    this.rightSideChartData.push(this.rightAnklePitch_qa)
                    break;
                case 'ankleRoll':
                    this.leftSideChartData.push(this.leftAnkleRoll_qa)
                    this.rightSideChartData.push(this.rightAnkleRoll_qa)
                    break;
                default:
                    break;
            }
            if (this.leftSideChartData.length > 10)
                this.leftSideChartData.shift()
            if (this.rightSideChartData.length > 10)
                this.rightSideChartData.shift()
            let leftChart = echarts.getInstanceByDom(document.getElementById('leftChart'))
            leftChart.setOption({
                series: [
                    {
                        name: 'angle',
                        data: this.leftSideChartData
                    }
                ]
            });
            let rightChart = echarts.getInstanceByDom(document.getElementById('rightChart'))
            rightChart.setOption({
                series: [
                    {
                        name: 'angle',
                        data: this.rightSideChartData
                    }
                ]
            });
        },
        updateSpeedCharts() {
            let xChart = echarts.getInstanceByDom(document.getElementById('xChart'))
            this.leftSpeedChartData.push(this.xSpeed)
            if (this.leftSpeedChartData.length > 10)
                this.leftSpeedChartData.shift()
            xChart.setOption({
                series: [
                    {
                        name: 'speed',
                        data: this.leftSpeedChartData
                    }
                ]
            });
            let yChart = echarts.getInstanceByDom(document.getElementById('yChart'))
            this.rightSpeedChartData.push(this.ySpeed)
            if (this.rightSpeedChartData.length > 10)
                this.rightSpeedChartData.shift()
            yChart.setOption({
                series: [
                    {
                        name: 'speed',
                        data: this.rightSpeedChartData
                    }
                ]
            });
        },
        changeItem(e) {
            this.activatedItem = e
            this.leftSideChartData = []
            this.rightSideChartData = []
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100vh;
    background: #121E29;
    position: relative;
}

.headState {
    position: absolute;
    top: 2vh;
    left: 10.9375vw;
    z-index: 99;

    .headTxt {
        font-size: 1.9792vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 2.7083vw;
    }

    .arrow {
        position: absolute;
        top: 2vh;
        left: 11.2375vw;
        width: 0;
        height: 0;
        background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
        border-left: .4167vw solid transparent;
        border-right: .4167vw solid transparent;
        border-top: .5208vw solid #FFFFFF;
    }
}

.mainBox {
    position: absolute;
    display: flex;
    top: 11vh;
    left: 2.4479vw;
    height: 86vh;
    width: 95.1042vw;

    .logTitle {
        font-size: 1.6146vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
    }

    .leftBox {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .humanModel {
            margin-top: 1.875vw;
            width: 22.625vw;
            height: 62vh;
        }

        .logBox {
            height: 70vh;
            width: 34.8vw;
            padding: 1.0417vw 1.5625vw 0 1.5625vw;
            box-shadow: 0 .1042vw .2083vw 0 rgba(41, 72, 152, 0.01), 0 .4688vw .4167vw 0 rgba(41, 72, 152, 0.02);
            border-radius: .2604vw;
            background-color: rgba(81, 82, 85, 0.1);
            overflow-y: auto;

            .logMain {
                margin-top: 1.0417vw;

                .logTxt {
                    font-size: 1.25vw;
                    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
                    font-weight: normal;
                    color: #FFFFFF;
                }

                .txtErr {
                    color: #DC4253;
                }
            }
        }

        .logBox::-webkit-scrollbar {
            width: .4688vw;
        }

        .logBox::-webkit-scrollbar-track {
            background-color: rgba(81, 82, 85, 0.1);
        }

        .logBox::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: .1042vw;
        }

        .logBox::-webkit-scrollbar-corner {
            background-color: transparent;
        }

        .modelChose {
            height: 4.5021vw;
            width: 23.0729vw;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .modelBtn {
                flex: 1;
                width: 11.0938vw;
                height: 3.6979vw;
                display: flex;
                justify-content: center;
                align-items: center;

                .btnTxt {
                    font-size: 1.4583vw;
                    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
                    font-weight: normal;
                    color: #FFFFFF;
                    opacity: 1;
                    line-height: 2.0313vw;
                }
            }

            .activatedModel {
                border-radius: 1.8229vw;
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }

    .rightBox {
        flex: 3;
        width: 56.3021vw;
        height: 85vh;

        .rightTitle {
            height: 6vh;
            display: flex;
            justify-content: space-between;
            margin-left: 1.5625vw;
            padding: 1.0417vw 2.6042vw 0 2.6042vw;
            background-color: rgba(81, 82, 85, 0.1);
        }

        .sideChart {
            width: 100%;
            height: 20vh;
            background-color: rgba(81, 82, 85, 0.1);
            margin-left: 1.5625vw;
            display: flex;
            justify-content: space-between;

            .chartSize {
                width: 26.0417vw;
                height: 18vh;
            }
        }

        .rightTable {
            width: 100%;
            height: 35vh;
            background-color: rgba(81, 82, 85, 0.1);
            margin-left: 1.5625vw;

            .tableItem {
                height: 16.67%;
                width: 100%;
                display: flex;
                align-items: center;

                .itemChild {
                    color: #FFFFFF;
                    flex: 3;
                    font-size: 1.25vw;
                    text-align: center;
                }

                .middleCurr {
                    flex: 1;
                    background-color: #0075B8;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .middle {
                    flex: 1;
                    color: #85888b;
                }

                .downArrow {
                    margin-left: .2604vw;
                    width: 0;
                    height: 0;
                    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
                    border-left: .3125vw solid transparent;
                    border-right: .3125vw solid transparent;
                    border-bottom: .5208vw solid #FFFFFF;
                }
            }

            .tableItem:nth-child(odd) {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }

        .speedChart {
            width: 100%;
            height: 20vh;
            margin: 1.5625vw 0 0 1.5625vw;
            display: flex;
            justify-content: space-between;
            align-content: center;

            .sChartSize {
                width: 20vw;
                height: 18vh;
            }

            .xChart {
                width: 49%;
                background-color: rgba(81, 82, 85, 0.1);
                display: flex;
            }

            .yChart {
                width: 49%;
                background-color: rgba(81, 82, 85, 0.1);
                display: flex;
            }

            .chatItem {
                display: flex;
                justify-content: space-evenly;
                align-content: center;
                flex-direction: column;
                margin-left: 1.25vw;
                color: #FFFFFF;
                font-size: 1.25vw;
            }
        }
    }
}
</style>