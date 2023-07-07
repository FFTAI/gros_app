### 接口版本:

|版本号| 制定人 | 制定日期            | 修订日期           |
|:---- |:----|:----------------|----------------|
|1.0 | Jax | 2023-6-30 10:43 | 2023-7-6 13:00 |

## 1.模式切换

> POST  /control/mode

##### 请求参数

| 参数名  | 是否必须 | 类型     | 说明 | 范围  |
|:-----|:-----|:-------|--------|-----|
| mode | 是    | number | 模式code | 2132 |

##### 请求示例
```json
{
    "mode": "${mode_code}" 
}
```

##### 响应示例
```json
{
    "code": 0,
    "msg": "ok"
}
```


## 2.急停

> GET  /control/stop

##### 请求参数

> 无

##### 响应示例
```json
{
    "code": 0,
    "msg": "ok"
}
```

## 2.实时相机

> GET  /control/camera

##### 请求参数

> 无

##### 响应示例

> 响应实时视频流


## 4.是否开启相机

> GET  /control/cameraOpen

##### 请求参数

> 无

### 响应体
```json
{
    "code": 0,
    "msg": "ok",
    "data": "False"
}
```


## 5.WebSocket

> /ws

### 请求方式：

> ws://robot_host/ws

### 消息格式：

> JSON

### 消息描述：

| 参数名         | 是否必须                          | 类型        | 说明          | 范围                              |
|:------------|:------------------------------|:----------|-------------|---------------------------------|
| type        | 是                             | string    | 类型          | command-指令 slam-雷达              |
| client_type | 是                             | string    | 客户端类型       | car-车 dog-狗 people-人            |
| command     | 是                             | string    | 指令          | operate-操作 speed-获取速度 action-动作 |
| mode        | 当command==operate时必须          | number    | 模式          | 592385-四轮  592386-三轮  592387-两轮 |
| direction   | 当command==operate时必须          | number    | 角度          | -1到1 对应 左45度到右45度               |
| velocity    | 当command==operate时必须          | number    | 速度          | -1到1 -1向前的最大值 1 向后的最大值          |
| action      | 当command==action时必须           | string    | 速度          | rotation-旋转 graphics-菱形         |
| gear    | 当action==graphics和rotation时必须 | number    | 档位          | 1到10                            |
| cycle    | 当action==graphics时必须          | number    | 周期          | 对应走菱形的圈数                        |
| ws    | 是                             | websocket | socket客户端对象 | -1到1 -1向前的最大值 1 向后的最大值          |

### message示例：
#### 1.四轮车基本控制
```json
{
    "type": "command",
    "client_type": "car",
    "command": "operate",
    "mode": 444444,
    "direction": -1,
    "velocity": -1
}
```
#### 2.动作指令action
```json
{
    "type": "command",
    "client_type": "car",
    "command": "action",
    "action": "rotation",
    "gear": 2
}
```
#### 3.动作指令graphics
```json
{
    "type": "command",
    "client_type": "car",
    "command": "action",
    "action": "graphics",
    "gear": 2
}
```

####  备注：
> operate指令对于robot的控制 角度和速度最好线性的触发。且一次指令下发之后的执行周期是永久的，在无后续执行的情况下robot会维持上一次最后的指令

### 获取slam雷达数据
> 在获取slam数据的时候slam服务器会构建一个json格式的数据返回，包含了360个角度的距离值

#### 请求示例: 
```json
{
    "type": "slam"
}
```

#### 响应示例

```json
{
    "1": 21312.000,
    "2": "car",
    ......
    "360": 999.999
}
```
