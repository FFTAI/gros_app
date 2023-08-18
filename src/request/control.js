import request from "./http.js";

/**
 * 获取当前设备IP和类型
 * @returns {Promise}
 */
export async function getType() {
  return await request({
    method: "get",
    url: "/robot/type",
  });
}

/**
 * 四轮车模式切换
 * @param {String} mode 模式
 * @returns {Promise}
 */
export async function changeMode(mode,ip) {
  return await request({
    method: "post",
    url: "/control/car/mode",
    data: {
      mode: mode,
      host: ip.host,
      port: ip.port
    },
  });
}

/**
 * 急停
 * @returns {Promise}
 */
export async function qStop(data) {
  return await request({
    method: "post",
    url: "/control/car/stop",
    data: data
  });
}

/**
 * 声音播放
 * @param {String} type 声音类型
 * @returns {Promise}
 */
export async function play(type) {
  return await request({
    method: "post",
    url: "/audio/play",
    data: {
      type: type,
    },
  });
}

/**
 * 停止播放
 * @returns {Promise}
 */
export async function mStop(data) {
  return await request({
    method: "post",
    url: "/audio/stop",
    data: data
  });
}

/**
 * 人形归零
 * @returns {Promise}
 */
export async function zero(data) {
  return await request({
    method: "post",
    url: "/control/human/zero",
    data: data
  });
}

/**
 * 人形急停
 * @returns {Promise}
 */
export async function hStop(data) {
  return await request({
    method: "post",
    url: "/control/human/stop",
    data: data
  });
}

/**
 * 人形站立
 * @returns {Promise}
 */
export async function stand(ip,data) {
  return await request({
    method: "post",
    url: "/control/human/stand",
    data: {
      data: data,
      host: ip.host,
      port: ip.port
    },
  });
}