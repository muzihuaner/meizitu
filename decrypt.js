const CryptoJS = require('crypto-js')

module.exports =  function decrypt(id, data) {
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