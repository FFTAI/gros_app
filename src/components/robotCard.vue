<template>
    <div class="rb-card">
        <iframe ref="unityIfm" style="
            border: none;
            margin-top: 2vw;
            width: 34vw;
            height: 40.6563vw;
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
        },
        mouseAction: {
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
        },
        mouseAction: {
            handler(newVal, oldVal) {
                console.log('mouseAction',newVal)
                const iframe = this.$refs.unityIfm.contentWindow;
                iframe.postMessage({ mouseAction: newVal }, '*');
            },
        },
    },
    computed: {
    },
    mounted() {
    },
    data() {
        return {
            iframeUrl: "Build/index.html",
        };
    }
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