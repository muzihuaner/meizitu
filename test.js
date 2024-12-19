require('request-promise')({
  url: 'https://geo.brdtest.com/mygeo.json',
  proxy: 'http://127.0.0.1:24000',
  rejectUnauthorized: false
}).then(function(data){
  console.log(data);
}, function(err){
  console.error(err);
});