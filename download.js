const axios = require("./axios.js");
const fs = require("fs");

// 创建一个https agent并禁用SSL证书验证

// 潮拍馆 type = 1 写真馆 type = 2
module.exports = function download(
  imageName,
  type = "beauty",
  params = { year: "2024", month: "01", categoryid: "108366" }
) {
  const downloadUrl = {
    beauty: `https://image.baidu.com/search/down?url=https://wx1.sinaimg.cn/mw1024/${imageName}`,
    photo: `https://e.meizitu.net/image/${params.year}/${params.month}/${imageName}`,
  };
  const localPath = {
    beauty: `./images/beauty/${params.categoryid}`,
    photo: `./images/photo/${params.year}-${params.month}/${params.categoryid}`,
  };

  // 判断该文件夹是否存在，若不存在，则创建
  if (type === "photo") {
    if (!fs.existsSync(`./images/photo/${params.year}-${params.month}`)) {
      fs.mkdirSync(`./images/photo/${params.year}-${params.month}`);
    }
  }
  if (!fs.existsSync(localPath[type])) {
    fs.mkdirSync(localPath[type]);
  }

  // 判断localPath中是否有存在同名的图片了，若有则放回
  if (fs.existsSync(localPath[type] + "/" + imageName)) {
    // console.log(`${imageName}已存在本地目录中`);
    return new Promise((resolve, reject) => {
      resolve(imageName);
    });
  }

  return new Promise(async (resolve, reject) => {
    let retry_times = 0;
    while (retry_times <= 3) {
      try {
        if (retry_times !== 0) console.log(`重新下载图片${imageName}中`);
        const response = await axios({
          method: "get",
          timeout: 10000,
          headers:
            type === "beauty"
              ? {
                  Accept:
                    "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                  "Accept-Language": "zh-CN,zh;q=0.9",
                  Connection: "keep-alive",
                  Cookie:
                    "H_WISE_SIDS_BFESS=40206_40211_40215_40319_40079_40365_40351_40299_40381_40368_40403_40415_40310_40445_40464_40458; ZFY=6k8rIJ9N6Ct9sgEFx23xZNEXNsE9dDaGMPzRI0kp7ow:C; BAIDUID_BFESS=DF78701CF7BF6B4C4722ECEA1F4B27BB:FG=1; ab_sr=1.0.1_YzkxMjc0ZWQ2OWE2YzY3NmEwY2ZiNzI1MjJlZTNmMmEzNzhmM2I0ZGY3ZjVhM2UwMTAyOTNiZjQyN2EwZWY2NzVmNjI3MDc3NTUxZjY5YjEzNzdlMDIzOTY4NTM2YmY0MjgyZDU5ZGM2NDc2ZGVhNDgyNWNmYWMzY2Y0YWUwMWRhY2JmYzZjZDlhMWU3Yjc2MTdjNjY1ODFhNjkyNzk2YQ==",
                  "Sec-Fetch-Dest": "image",
                  "Sec-Fetch-Mode": "no-cors",
                  "Sec-Fetch-Site": "cross-site",
                  "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                  "sec-ch-ua":
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"macOS"',
                }
              : {
                  accept:
                    "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                  "accept-language": "zh-CN,zh;q=0.9",
                  referer: "https://kkmzt.com/",
                  "sec-ch-ua":
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"macOS"',
                  "sec-fetch-dest": "image",
                  "sec-fetch-mode": "no-cors",
                  "sec-fetch-site": "cross-site",
                  "user-agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                },
          url: downloadUrl[type],
          responseType: "stream", // 将响应数据流式传输，而不是将其加载到内存中
        });
        // 创建可写流并将数据写入本地文件
        response.data.pipe(
          fs.createWriteStream(localPath[type] + "/" + imageName)
        );
        console.log(`下载图片${imageName}成功`);
        return resolve(imageName);
      } catch (error) {
        console.log(`下载图片${imageName}失败`);
        if (retry_times === 3) return reject(error);
        retry_times++;
      }
    }
  });

  // 使用axios下载图片
  return axios({
    method: "get",
    headers: {
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
      Connection: "keep-alive",
      Cookie:
        "H_WISE_SIDS_BFESS=40206_40211_40215_40319_40079_40365_40351_40299_40381_40368_40403_40415_40310_40445_40464_40458; ZFY=6k8rIJ9N6Ct9sgEFx23xZNEXNsE9dDaGMPzRI0kp7ow:C; BAIDUID_BFESS=DF78701CF7BF6B4C4722ECEA1F4B27BB:FG=1; ab_sr=1.0.1_YzkxMjc0ZWQ2OWE2YzY3NmEwY2ZiNzI1MjJlZTNmMmEzNzhmM2I0ZGY3ZjVhM2UwMTAyOTNiZjQyN2EwZWY2NzVmNjI3MDc3NTUxZjY5YjEzNzdlMDIzOTY4NTM2YmY0MjgyZDU5ZGM2NDc2ZGVhNDgyNWNmYWMzY2Y0YWUwMWRhY2JmYzZjZDlhMWU3Yjc2MTdjNjY1ODFhNjkyNzk2YQ==",
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
    url: downloadUrl[type],
    responseType: "stream", // 将响应数据流式传输，而不是将其加载到内存中
  })
    .then((response) => {
      // 创建可写流并将数据写入本地文件
      response.data.pipe(
        fs.createWriteStream(localPath[type] + "/" + imageName)
      );
      console.log(`下载图片${imageName}成功`);
      return Promise.resolve(imageName);
    })
    .catch((error) => {
      // console.error('下载图片出错:', error);
      Promise.reject(error);
    });
};
