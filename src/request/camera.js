import request from "./http.js";


/**
 * 摄像头是否开启
 * @returns {Promise}
 */
export async function cameraOpen() {
  return await request({
    method: "get",
    url: "/control/cameraOpen"
  });
}
