const axios = require('axios');
// https-proxy-agent 6.0.0 及以上版本用法
const {HttpsProxyAgent} = require("https-proxy-agent");
// https-proxy-agent 6.0.0 以下版本用法
// const HttpsProxyAgent = require("https-proxy-agent");

// 隧道域名和端口
let tunnelHost = 'a614.kdltps.com'
let tunnelPort = '15818'

// 配置用户名和密码
let username = 't11206769975756'
let password = 'k3vkg983'

axios({
    url: 'https://dev.kdlapi.com/testproxy',
    method: "get",
    httpAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
    httpsAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
}).then(
    res => {
        console.log(res.data);
    }
).catch(err => {
    console.log(err);
})