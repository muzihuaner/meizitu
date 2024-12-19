const axios = require('axios-https-proxy-fix');

// 定义代理列表
// const proxies = [
//   // {
//   //   ip: '',
//   //   port: ''
//   // }
// ];

// 创建一个axios实例

module.exports = axios.create({
  // proxy: {
  //   host: '27.76.103.205', // 代理服务器的主机地址
  //   port: 4004, // 代理服务器的端口号
  //   // 协议
  //   // protocol: 'http', // 代理服务器的协议
  // },
});

// 请求拦截器，在每个请求前设置代理
// instance.interceptors.request.use(function(config) {
//   // config.proxy = false; // 禁用全局代理
//   // config.proxy = {
//   //     host: '45.90.218.215',
//   //     port: 4444 // 代理端口，根据实际情况修改
//   // };
//   return config;
// }, function (error) {
// });

// instance.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Do something with response error
//   console.log(error)
//   return Promise.reject(error);
// });

// module.exports = instance;