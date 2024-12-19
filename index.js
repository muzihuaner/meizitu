const {
  getImageArr,
  getBeautyPage,
  getPhotePage,
  getPhoteYearAndMonth,
} = require("./request.js");
const decrypt = require("./decrypt.js");
const download = require("./download.js");
const { JSDOM } = require("jsdom");
const fs = require("fs");

var isBeautyFinished = false;
var isPhoteFinished = false;

async function getImages(
  id,
  params = {
    year: "2024",
    month: "01",
    type: "beauty",
  }
) {
  try {
    console.log(`开始获取图集${id}的数组路径`);
    const res = await getImageArr(id);
    console.log(`获取完成图集${id}的数组路径`);
    const listArr = decrypt(id, res.data.data);
    return Promise.all(
      listArr.map((item, index) => {
        return download(item, params.type, {
          year: params.year,
          month: params.month,
          categoryid: id,
        });
      })
    ).then(
      (arr) => {
        // console.log(arr)
        console.log(`id为${id}的图册已全部下载完毕`);
      },
      (e) => {
        // console.log(e)
      }
    );
  } catch (error) {
    if (error?.response?.status === 403) {
      console.log("403限制访问");
      isBeautyFinished = true;
    } else if (error?.response?.status === 429) {
      console.log("429限制访问");
      isBeautyFinished = true;
    } else {
      console.error("获取图集失败", error);
    }
  }
}

async function getBeauty(page = 1) {
  try {
    console.log(`开始加载潮拍馆第${page}页数据...`);
    const res = await getBeautyPage(page);
    // 使用DOMParser解析HTML文档
    const dom = new JSDOM(res.data);
    const document = dom.window.document;

    // 现在你可以像在浏览器中一样使用document来操作文档了
    // 例如：
    let urls = [];
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      urls.push(link.href);
    });
    let beautyIds = urls
      .filter((url) => url.startsWith("https://kkmzt.com/beauty/"))
      .map((url) => {
        const match = url.match(/https:\/\/kkmzt\.com\/beauty\/(\d+)/);
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);
    beautyIds = [...new Set(beautyIds)];
    let i = 0;
    console.log("开始下载图片...");
    while (i < beautyIds.length) {
      await getImages(beautyIds[i]);
      i++;
    }
    console.log(`潮拍馆第${page}页数据已全部下载完毕\n`);
  } catch (error) {
    if (error?.response?.status === 404) {
      console.log("潮拍馆图片已全部下载完毕");
      isBeautyFinished = true;
    } else if (error?.response?.status === 403) {
      console.log("403限制访问");
      isBeautyFinished = true;
    } else if (error?.response?.status === 429) {
      console.log("429限制访问");
      isBeautyFinished = true;
    } else {
      console.log("获取文档数据出错:", error);
    }
  }
}

async function getPhoto(page = 1) {
  try {
    console.log(`开始加载写真馆第${page}页数据...`);
    const res = await getPhotePage(page);
    // 使用DOMParser解析HTML文档
    const dom = new JSDOM(res.data);
    const document = dom.window.document;

    // 现在你可以像在浏览器中一样使用document来操作文档了
    // 例如：
    let urls = [];
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      urls.push(link.href);
    });
    let photoIds = urls
      .filter((url) => url.startsWith("https://kkmzt.com/photo/"))
      .map((url) => {
        const match = url.match(/https:\/\/kkmzt\.com\/photo\/(\d+)/);
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);
    photoIds = [...new Set(photoIds)];
    let i = 0;
    console.log("开始下载图片...");
    while (i < photoIds.length) {
      const yearAndMonth = await getPhotoDetail(photoIds[i]);
      await getImages(photoIds[i], {
        type: "photo",
        year: yearAndMonth.year,
        month: yearAndMonth.month,  
      });
      i++;
    }
    console.log(`写真馆第${page}页数据已全部下载完毕\n`);
  } catch (error) {
    if (error?.response?.status === 404) {
      console.log("写真馆图片已全部下载完毕");
      isPhoteFinished = true;
    } else if (error?.response?.status === 403) {
      console.log("403限制访问");
      isPhoteFinished = true;
    } else if (error?.response?.status === 429) {
      console.log("429限制访问");
      isPhoteFinished = true;
    } else {
      console.log("获取文档数据出错:", error);
    }
  }
}

// 获取写真馆详情年月
async function getPhotoDetail(id) {
  try {
    console.log(`开始获取写真馆详情${id}年月...`);
    const res = await getPhoteYearAndMonth(id);
    // 使用DOMParser解析HTML文档
    const dom = new JSDOM(res.data);
    const document = dom.window.document;

    // 现在你可以像在浏览器中一样使用document来操作文档了
    // 例如：
    let urls = [];
    var imgSrc = document.getElementsByTagName('figure')[0].querySelector('img').getAttribute('src')
    var strArr = imgSrc.match(/https:\/\/e\.meizitu\.net\/image\/(\d+)\/(\d+)/)
    var year = strArr[1]
    var month = strArr[2]
    return {
      year,
      month
    }
  } catch (error) {
    console.log("获取写真馆详情文档数据出错:", error);
  }
}

// 判断是否存在images/beauty 以及 images/photo文件夹，若没有则创建
function mkdir() {
  const localPath = {
    beauty: `./images/beauty`,
    photo: `./images/photo`,
  };
  // 判断该文件夹是否存在，若不存在，则创建
  if (!fs.existsSync("./images")) {
    fs.mkdirSync("./images");
  }
  if (!fs.existsSync(localPath.beauty)) {
    fs.mkdirSync(localPath.beauty);
  }
  if (!fs.existsSync(localPath.photo)) {
    fs.mkdirSync(localPath.photo);
  }
}

// 延迟函数，用于等待指定的毫秒数
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function beauty() {
  // 下载潮拍馆的所有图片资源
  let i = 1;
  while (isBeautyFinished === false) {
    await getBeauty(i);
    await delay(1000);
    i++;
  }
  return true;
}

async function photo() {
  // 下载写真馆的所有图片资源
  let i = 1;
  while (isPhoteFinished === false) {
    await getPhoto(i);
    await delay(1000);
    i++;
  }
  return true;
}

function concantTime(second) {
  if(second <60) {
    return `${second}秒`;
  }
  if(second < 3600) {
    return `${Math.floor(second/60)}分${second%60}秒`;
  }
  if(second < 86400) {
    return `${Math.floor(second/3600)}小时${second%3600}秒`;
  }
  return `${Math.floor(second/86400)}天${second%86400}秒`;
}

async function main() {
  let beginTime = parseInt(new Date().getTime()/1000);
  mkdir();
  // 下载潮拍馆的所有图片资源
  await beauty();
  // 下载写真馆的所有图片资源
  await photo();
  let endTime = parseInt(new Date().getTime()/1000);
  let time = endTime - beginTime;
  console.log("所有图片资源下载完毕");
  console.log(`总共下载了${concantTime(time)}`);
}

// getImages('108366')
main();
