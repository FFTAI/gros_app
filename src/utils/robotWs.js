export default {
    robot: {},
    setWs: function(newRobot) {
        this.robot = newRobot
    }
}
// import { Human } from "rocs-client";
// import Bus from '@/utils/bus.js'
// var robot = new Human({
//   host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
// });
// const initRobot = (robot) => {
//   robot.on_connected(() => {
//     Bus.$emit('robotOnconnected');
//   });
//   robot.on_message((data) => {
//     var currData = JSON.parse(data.data);
//     console.log('all====',currData)
//     Bus.$emit('robotOnmessage',currData);
//   });
//   robot.on_close(() => {
//     handleSocketClose
//   });
//   robot.on_error(() => {
//     handleSocketClose
//   });
// };
// //ws断连后重新创建
// const handleSocketClose = () => {
//   robot = new Human({
//     host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
//   });
//   setTimeout(() => {
//     initRobot(robot);
//   }, 1000);
// }
// const robotWs = { robot, initRobot, handleSocketClose }
// export default robotWs