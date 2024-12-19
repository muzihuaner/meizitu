// const axios = require('axios')
const instance = require("./axios.js");
const request = require("request-promise")

var proxy = {
  ip: "",
  port: "",
};

var maxCount = 10;

// 从ip池随机获取一个ip
async function getIpTool() {
  try {
    proxy = {
      ip: '',
      port: ''
    }
    const res = await instance.get("http://127.0.0.1:5010/get/");
    if(res?.data?.proxy) {
      const [ip, port] = res?.data?.proxy?.split(":");
      proxy = {
        ip,
        port,
      };
    } else {
      console.log('ip池已空，不走代理请求....')
    }
    return proxy;
  } catch (error) {
    console.error(error);
  }
}

// 从ip池删除某个ip
async function deleteProxy(proxy) {
  try {
    const res = await instance.get(
      `http://127.0.0.1:5010/delete/?proxy=${proxy}`
    );
    return true;
  } catch (error) {
    console.error(error);
  }
}

// 获取图集里的图片路径数组
function getImageArr(id) {
  return new Promise(async (resolve, reject) => {
    let retry_count = 0;
    while (retry_count <= maxCount) {
      try {
        // 若没有走代理ip，则获取代理ip
        if(!proxy.ip) {
          await getIpTool()
        }
        // 达到最大重试次数时，不走代理
        if(retry_count === maxCount) {
          console.log('达到最大重试次数时，不走代理请求....')
          proxy = {
            ip: '',
            port: ''
          }
        }
        const res = await instance.get("https://kkmzt.com/app/post/p", {
          params: {
            id: id,
          },
          timeout: 10000,
          proxy: proxy.ip
            ? {
                host: proxy.ip,
                port: proxy.port,
              }
            : undefined,
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            cookie:
              "_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712022327.2.1.1712023371.0.0.0",
            referer: "https://kkmzt.com/beauty/",
            "sec-ch-ua":
              '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
          },
        });
        return resolve(res);
      } catch (error) {
        console.log(`getImageArr： ${proxy.ip}:${proxy.port} 异常`);
        if(error?.code === 'ERR_SOCKET_CLOSED') {
          deleteProxy(`${proxy.ip}:${proxy.port}`);
        }
        await getIpTool();
        console.log(`getImageArr： 更新ip为 ${proxy.ip}:${proxy.port}`);
        if (retry_count === maxCount) {
          return reject(error);
        }
        retry_count++;
      }
    }
  });
}

// 获取潮拍馆HTML页面
function getBeautyPage(page = 1) {
  const url =
    page > 1
      ? "https://kkmzt.com/beauty/page/" + page + "/"
      : "https://kkmzt.com/beauty/";
  return new Promise(async (resolve, reject) => {
    let retry_count = 0;
    while (retry_count <= maxCount) {
      try {
        const { ip, port } = await getIpTool();
        console.log(ip, port, "ip and port");
        if (retry_count !== 0) {
          console.log(`IP池已重试${retry_count}次`);
        }
        // 当重试第八次时，不使用代理ip
        if (retry_count === maxCount) {
          console.log('达到最大重试次数时，不走代理请求....')
          proxy = {
            ip: "",
            port: "",
          };
        }

        // const data  = await request({
        //   url,
        //   proxy: 'http://127.0.0.1:24000',
        //   rejectUnauthorized: false,
        //   timeout: 10000,
        //   headers: {
        //     accept:
        //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        //     "accept-language": "zh-CN,zh;q=0.9",
        //     cookie:
        //       "_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712037535.4.1.1712038069.0.0.0",
        //     referer: "https://kkmzt.com/beauty/",
        //     "sec-ch-ua":
        //       '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        //     "sec-ch-ua-mobile": "?0",
        //     "sec-ch-ua-platform": '"macOS"',
        //     "sec-fetch-dest": "document",
        //     "sec-fetch-mode": "navigate",
        //     "sec-fetch-site": "same-origin",
        //     "sec-fetch-user": "?1",
        //     "upgrade-insecure-requests": "1",
        //     "user-agent":
        //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        //     "X-Originating-IP": "127.0.0.1",
        //   },
        // })
        // const res = {
        //   data
        // }

        const res = await instance.get(url, {
          // proxy: proxy.ip
          //   ? {
          //       ip: proxy.ip,
          //       port: proxy.port,
          //     }
          //   : undefined,
          timeout: 10000,
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            cookie:
              "_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712037535.4.1.1712038069.0.0.0",
            referer: "https://kkmzt.com/beauty/",
            "sec-ch-ua":
              '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "X-Originating-IP": "127.0.0.1",
          },
        });
        console.log("ip success");
        return resolve(res);
        break;
      } catch (error) {
        console.log("ip error", proxy.ip + ":" + proxy.port);
        if (error?.response?.status !== 404) {
          // deleteProxy(`${proxy.ip}:${proxy.port}`);
        }
        if (retry_count === maxCount) {
          return reject(error);
        }
        retry_count++;
      }
    }
  });
}

// 获取写真馆HTML页面
function getPhotePage(page = 1) {
  const url =
    page > 1
      ? "https://kkmzt.com/photo/page/" + page + "/"
      : "https://kkmzt.com/photo/";
  return new Promise(async (resolve, reject) => {
    let retry_count = 0;
    while (retry_count <= maxCount) {
      try {
        const { ip, port } = await getIpTool();
        console.log(ip, port, "ip and port");
        if (retry_count !== 0) {
          console.log(`IP池已重试${retry_count}次`);
        }
        // 当重试第八次时，不使用代理ip
        if (retry_count === maxCount) {
          console.log('达到最大重试次数时，不走代理请求....')
          proxy = {
            ip: "",
            port: "",
          };
        }

        const res = await instance.get(url, {
          timeout: 10000,
          headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cookie': '_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712416472.12.1.1712416507.0.0.0',
            'referer': 'https://kkmzt.com/photo/',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
          }
        });
        console.log("ip success");
        return resolve(res);
      } catch (error) {
        console.log("ip error", proxy.ip + ":" + proxy.port);
        if (error?.response?.status !== 404) {
          // deleteProxy(`${proxy.ip}:${proxy.port}`);
        }
        if (retry_count === maxCount) {
          return reject(error);
        }
        retry_count++;
      }
    }
  });
}

// 写真馆通过详情页获取年月
function getPhoteYearAndMonth(id) {
  return new Promise(async (resolve, reject) => {
    let retry_count = 0;
    while (retry_count <= maxCount) {
      try {
        // 达到最大重试次数时，不走代理
        if(retry_count === maxCount) {
          console.log('getPhoteYearAndMonth： 达到最大重试次数时....')
        }
        const res = await instance.get(`https://kkmzt.com/photo/${id}`, {
          // params: {
          //   id: id,
          // },
          timeout: 10000,
          headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cookie': '_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712416472.12.1.1712416516.0.0.0',
            'referer': 'https://kkmzt.com/photo/page/2/',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
          }
        });
        return resolve(res);
      } catch (error) {
        if (retry_count === maxCount) {
          return reject(error);
        }
        retry_count++;
      }
    }
  });
}

module.exports = {
  // 潮拍馆首页套图合计（通过id查询）
  getImageArr: getImageArr,
  getBeautyPage: getBeautyPage,
  getIpTool: getIpTool,
  getPhotePage,
  getPhoteYearAndMonth,
};
