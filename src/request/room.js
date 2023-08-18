import request from "./http.js"

/**
 *
 * 远程控制
 *
 * @param roomName 房间名
 * @param status 状态 1-控制 0或其他-退出控制
 * @returns {Promise}
 */
export async function remoteContr(roomName,status) {
    return await request({
        method: 'patch',
        url: '/robot',
        data: {
            name: roomName,
            status: status
        }
    })
}

/**
 * 创建房间
 *
 * @param userName 用户名
 * @param streamId 视频流id
 * @param host host
 * @param port port
 * @param type _type
 * @returns {Promise}
 */
export async function createRoom(userName, streamId, type) {
    return await request({
        method: 'post',
        url: '/robot',
        data: {
            name: userName,
            stream_id: streamId,
            kind: type
        }
    })
}

/**
 * 关闭房间
 *
 * @param roomName 房间名
 * @returns {Promise}
 */
export async function closeRoom(roomName) {
    return await request({
        method: 'delete',
        url: '/robot',
        data: {
            name: roomName,
        }
    })
}

/**
 * 获取房间列表
 *
 * @returns {Promise}
 */
export async function getRoomList() {
    return await  request({
        method: 'get',
        url: '/robot/list',
    })
}