var express = require('express');
// Encoding QueryString 
const qs = require('querystring');
var app = express();

/* geolocaion code --- start [ */
require('dotenv').config();
const axios = require('axios');
const CryptoJS = require("crypto-js");

const consumerKey = '08kP7bvdWL3X32pkB6wC';
const consumerSecret = 'eWJ1loEkLMkW3LjqupuDKiC1W1hzxv75xtR8cpbV';
const requestMethod = "GET";
const requestUrl= 'https://api.ncloud.com/geolocation/';

var res_data;
var res_getlocation;

const n = (length)=>{
  let last = null
    , repeat = 0;

  if (typeof length === 'undefined') length = 15;

  return function() {
    let now = Math.pow(10, 2) * +new Date();

    if (now === last) {
      repeat++
    } else {
      repeat = 0;
      last = now
    }

    let s = (now + repeat).toString();
    return +s.substr(s.length - length).toString()
  }
};

const generateNonce = n(10);

(()=>{
  const sortedSet = {};

  sortedSet["action"] = "getLocation";
  sortedSet["ext"] = "t";
  sortedSet["ip"] = "143.248.142.77";
  sortedSet["oauth_consumer_key"]= consumerKey;
  sortedSet["oauth_nonce"] = generateNonce();
  sortedSet["oauth_signature_method" ] = "HMAC-SHA1";
  sortedSet["oauth_timestamp"]= Math.floor((+new Date)/1000);
  sortedSet["oauth_version"]="1.0";
  sortedSet["responseFormatType"] = "json";
  

  let queryString = Object.keys(sortedSet).reduce( (prev, curr)=>{
    return prev + curr + '=' + sortedSet[curr] + '&';
  }, "");

  queryString = queryString.substr(0, queryString.length -1 );

  const baseString = requestMethod + "&" + encodeURIComponent( requestUrl ) + "&" + encodeURIComponent( queryString );
  const signature = CryptoJS.HmacSHA1( baseString, consumerSecret +'&').toString(CryptoJS.enc.Base64);

  queryString += '&oauth_signature=' + encodeURIComponent( signature );

  axios.get(
    // url.resolve( 'https://api.ncloud.com/geolocation/?', `/v1/users/join/init`),
    `https://api.ncloud.com/geolocation/?${queryString}`
  )
    .then( response=>{
      res_data = response.data;
      res_getlocation = res_data.geoLocation;

      console.log( response.data );
    })
    .catch( error =>{
      console.log( error.response.data );
    })

})();
/* geolocaion code --- end ]*/

app.get('/geolocationMap', function (req, res) {

  console.log(res_getlocation);
  var htmlStr;
  htmlStr = '<!DOCTYPE html>'+
    '<html>'+
    '<head>'+
      '<meta charset="UTF-8">'+
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">'+
      '<title>간단한 지도 표시하기</title>'+
      '<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=EEMXt6n2ZpNPF3noBdSI"></script>'+
    '</head>'+
    '<body>'+
    '<div id="map" style="width:100%;height:400px;"></div>'+
    
    '<script>'+
    'var mapOptions = {'+
    '    center: new naver.maps.LatLng('+res_getlocation.lat+', '+res_getlocation.long+'),'+
    '    zoom: 10'+
    '};'+
    
    'var map = new naver.maps.Map(\'map\', mapOptions);'+

    'var marker = new naver.maps.Marker({'+
     ' position: new naver.maps.LatLng('+res_getlocation.lat+', '+res_getlocation.long+'),'+
     ' map: map'+
  '});'+

    '</script>'+
    '</body>'+
    '</html>';

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(htmlStr);
  res.end();

});

app.get('/geolocationPano', function (req, res) {

  console.log(res_getlocation);
  var htmlStr;
  htmlStr = '<!DOCTYPE html>'+
    '<html>'+
    '<head>'+
      '<meta charset="UTF-8">'+
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">'+
      '<title>간단한 지도 표시하기</title>'+
      '<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=EEMXt6n2ZpNPF3noBdSI&amp;submodules=panorama,geocoder,drawing,visualization"></script>'+
    '</head>'+
    '<body>'+
    '<div id="pano" style="width:100%;height:600px;"></div>'+
    
    '<script> '+
    'var pano;'+
      'naver.maps.onJSContentLoaded = function() {'+
      //'// 아이디 혹은 지도좌표로 파노라마를 표시할 수 있습니다.'+
      'pano = new naver.maps.Panorama("pano", {'+
      //'    // panoId: "OregDk87L7tsQ35dcpp+Mg==",'+
      '    position: new naver.maps.LatLng('+res_getlocation.lat+', '+res_getlocation.long+'),'+
      '    pov: {'+
      '       pan: -135,'+
      '       tilt: 29,'+
      '       fov: 100'+
      '    }'+
      '});'+
  '};'+
  '</script>'+
    '</body>'+
    '</html>';

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(htmlStr);
  res.end();

});

app.get('/geolocationExtInfo/:query', function (req, res) {
  console.log('----- GEK JSON -----');

  var config = {
    headers: {
      'X-Naver-Client-Id' : 'Bx3k9QA02ShYeDVyLQpf',
      'X-Naver-Client-Secret' : 'DvfCZekAZs'
    }
  };

  axios.get(
    // url.resolve( 'https://api.ncloud.com/geolocation/?', `/v1/users/join/init`),
    `https://openapi.naver.com/v1/search/local.json?query=${qs.escape(req.query)}&display=10&start=1&sort=random`,
    config
  )
    .then( response=>{
      //console.log( response );
      res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
      res.write(JSON.stringify(response.data));
      res.end();
    })
    .catch( error =>{
      console.log( error );
    })

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
