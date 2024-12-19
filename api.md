1. 潮拍馆首页
GET https://kkmzt.com/beauty/

3. 潮拍馆主页 获取套图id（通过dom获取）
GET https://kkmzt.com/beauty/
GET https://kkmzt.com/beauty/page/${page}

4. 潮拍馆套图详情页面
GET https://kkmzt.com/beauty/${id}  

5. 潮拍馆首页套图合计（通过id查询）
GET https://kkmzt.com/app/post/p?id=${id}  
返回数据格式：
{
  data: '4324323' // 密文
} 
解密方式：（解析返回图片文件名称数组）获取imgName
```
function _0x66f3q(id, data) {
  var _0x1bf6d1 = '';
  for (i = 2; i < 18; i++) {
    _0x1bf6d1 += (id % (i + 1) % 9).toString();
  }
  ;
  var _0x3bbf34 = CryptoJS.MD5(id + "Bxk80i9Rt").toString();
  var _0x53cd25 = CryptoJS.MD5(_0x1bf6d1 + _0x3bbf34).toString().substr(8, 16);
  var _0x2e67ed = data.split(_0x3bbf34)[1];
  var _0x3d45bd = CryptoJS.enc.Hex.parse(_0x2e67ed);
  var _0x4b0cd8 = CryptoJS.enc.Base64.stringify(_0x3d45bd);
  var _0x53cd25 = CryptoJS.enc.Utf8.parse(_0x53cd25);
  var _0x4ff557 = CryptoJS.AES.decrypt(_0x4b0cd8, _0x53cd25, {
    "iv": CryptoJS.enc.Utf8.parse(_0x1bf6d1),
    "mode": CryptoJS.mode.CBC,
    "padding": CryptoJS.pad.Pkcs7
  });
  return JSON.parse(_0x4ff557.toString(CryptoJS.enc.Utf8));
}
```
下载域名有两个：
i. https://image.baidu.com/search/down?url=https://wx1.sinaimg.cn/mw1024/${imageName}  （潮拍馆）
ii. https://p.meizitu.net/${YYYY}/${MM}/${imgName}  （写真馆） 

6. 写真馆主页 获取套图id（通过dom获取）
GET https://kkmzt.com/photo/
GET https://kkmzt.com/photo/page/${page}
const response = await axios.get('https://kkmzt.com/photo/page/2/', {
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

7. 写真馆套图详情页面(dom)
GET https://kkmzt.com/photo/${id}  
const response = await axios.get('https://kkmzt.com/photo/104076', {
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

var imgSrc = document.getElementsByTagName('figure')[0].querySelector('img').getAttribute('src')
var strArr = "https://p.meizitu.net/2024/01/02v02hmdyz.jpg".match(/https:\/\/p\.meizitu\.net\/(\d+)\/(\d+)/)
var year = strArr[1]
var month = strArr[2]