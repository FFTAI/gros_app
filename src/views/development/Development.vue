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
                        <div class="itemChild">+92.12°</div>
                        <div class="itemChild middleCurr">Hip Pitch<div class="downArrow"></div>
                        </div>
                        <div class="itemChild">+92.12°</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">+48.13°</div>
                        <div class="itemChild middle">Hip Yaw</div>
                        <div class="itemChild">+48.13°</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">+157.02°</div>
                        <div class="itemChild middle">Hip Roll</div>
                        <div class="itemChild">+157.02°</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">+22.12°</div>
                        <div class="itemChild middle">Knee</div>
                        <div class="itemChild">+22.12°</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">+16.31°</div>
                        <div class="itemChild middle">Ankle Pitch</div>
                        <div class="itemChild">+16.31°</div>
                    </div>
                    <div class="tableItem">
                        <div class="itemChild">+76.78°</div>
                        <div class="itemChild middle">Ankle Roll</div>
                        <div class="itemChild">+76.78°</div>
                    </div>
                </div>
                <div class="speedChart">
                    <div class="xChart">
                        <div class="chatItem" style="flex: 1;">
                            <div>{{ $t('xSpeed') }}</div>
                            <div>+1.29m/s</div>
                        </div>
                        <div class="chatItem" style="flex: 2;">
                            <div class="sChartSize" id="xChart"></div>
                        </div>
                    </div>
                    <div class="yChart">
                        <div class="chatItem" style="flex: 1;">
                            <div>{{ $t('ySpeed') }}</div>
                            <div>-1.68m/s</div>
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
    created() {

    },
    mounted() {
        this.$robot.getType().then(r => {
          console.log('getType=========', r);
        })

        this.$robot.enable_debug_state(1)

        this.$robot.on_message(data => {
          console.log('on_message===============', data)
        })

        this.initSideCharts()
        this.initSpeedCharts()
    },
    data() {
        return {
            activated: "log",
            logList: [{
                content: '主程序已启动',
                timestamp: '2023/8/14 9:15',
                placement: 'top'
            }, {
                content: '绝对值编码器数值已归零',
                timestamp: '2023/8/14 9:30',
                placement: 'top'
            }, {
                content: '错误！XXXXXX',
                timestamp: '2023/8/14 9:52',
                placement: 'top',
                type: 'danger',
            }, {
                content: '绝对值编码器数值已归零',
                timestamp: '2023/8/15 10:13',
                placement: 'top'
            }, {
                content: '主程序已启动',
                timestamp: '2023/8/15 15:37',
                placement: 'top'
            }, {
                content: '主程序已启动',
                timestamp: '2023/8/15 15:37',
                placement: 'top'
            }, {
                content: '主程序已启动',
                timestamp: '2023/8/15 15:37',
                placement: 'top'
            }]
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
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8']
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        data: [5, 8, 6, 3, 4, 7, 9, 5],
                        type: 'line',
                        smooth: true
                    }
                ]
            })
            rightChart.setOption({
                xAxis: {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8']
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        data: [4, 5, 3, 1, 5, 8, 7, 5],
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
                    data: ['1', '2', '3', '4', '5', '6', '7', '8']
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        data: [11, 12, 8, 6, 3, 5, 10, 9],
                        type: 'line',
                        smooth: true
                    }
                ]
            })
            yChart.setOption({
                xAxis: {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8']
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        data: [10, 7, 15, 6, 2, 8, 11, 5],
                        type: 'line',
                        smooth: true
                    }
                ]
            })
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

            .sChartSize{
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