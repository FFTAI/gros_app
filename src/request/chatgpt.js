import axios from "axios";
import { apiKey, chatMessage, aliUrl } from "../utils/chat-ali";

/**
 *
 * 发送消息
 *
 * @returns {Promise}
 */
export async function sendMsg(chatContent, stream) {
    return await axios.request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        method: 'post',
        url: `${aliUrl}/v1/chat/completions`,
        data: {
            model: "gpt-3.5-turbo",
            messages: [chatMessage, { role: "user", content: chatContent }],
            stream: stream,
        }
    })
}