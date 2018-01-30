
'use strict';

// 構成情報の取得
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得します');
  require('dotenv').config({ path: 'local.env' });
}

// Discoveryインスタンスの生成
//const watson = require('watson-developer-cloud');
//const discovery = new watson.DiscoveryV1({
//    version_date: '2017-08-01'
//});

const express = require("express");
const app = express();

// 静的HTMLパスの指定
app.use(express.static(__dirname + '/public'));

// ML呼出し
app.get("/predict", function(req, res, next){

// diacovery API呼出し
//    discovery.query( req.query,
//        function(error, data) {
//            if ( data ) {res.send(data);} 
//            else {console.log(error); res.send(error);}
//        });
// dummy
    res.send("hello world");

});

// VCAP_APP_PORTが設定されている場合はこのポートでlistenする (Bluemixのお作法)
var port = process.env.VCAP_APP_PORT || 6011;
app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
