<template>
    <div class="rb-card">
        <iframe ref="unityIfm" style="
            border: none;
            margin-top: 6vw;
            width: 15vw;
            height: 12vw;
          " :src="iframeUrl"></iframe>
    </div>
</template>

<script>
export default {
    name: "",
    props: {
        jointStates: {
            type: String,
            default: ""
        }
    },
    watch: {
        jointStates: {
            handler(newVal, oldVal) {
                const iframe = this.$refs.unityIfm.contentWindow;
                iframe.postMessage({ jointStates: newVal }, '*');
            },
        }
    },
    computed: {
    },
    data() {
        return {
            iframeUrl: "Build/index.html",
        };
    },
    mounted() {
        this.sendDataToIframe();
        window.addEventListener('message', this.receiveMessage, false);
    },
    beforeDestroy() {
        // 组件销毁前移除事件监听器
        window.removeEventListener('message', this.receiveMessage);
    },
    methods: {
        sendDataToIframe() {
            const iframe = this.$refs.unityIfm.contentWindow;
            iframe.postMessage({ connect: true }, '*');
        },
        receiveMessage(event) {
            console.log('vue接收消息', event)
            this.sendDataToIframe()
        }
    },
};
</script>

<style lang="scss" scoped>
// @keyframes slideFromRightToLeft {
//   0% {
//     transform: translateX(100%);
//   }
//   100% {
//     transform: translateX(0);
//   }
// }

.rb-card {
    position: absolute;
    top: 0.25vw;
    left: 1vw;
    // width: 20.8333vw;
    // height: 11.7188vw;
    // background: rgba(233, 246, 255, 0.6);
    // border-radius: .4167vw;
    z-index: 888;
    // animation: slideFromRightToLeft 2s ease-out forwards; /* 设置动画名称、时长、缓动函数和填充模式 */
}
</style>