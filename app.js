/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// 構成情報の取得
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得します');
  require('dotenv').config({ path: 'local.env' });
} else {
  console.log('環境変数から構成情報を取得します');
}

// Discoveryインスタンスの生成
const watson = require('watson-developer-cloud');
const discovery = new watson.DiscoveryV1({
    version_date: process.env.VERSION_DATE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
});

const express = require("express");
const app = express();

// 静的HTMLパスの指定
app.use(express.static(__dirname + '/public'));

// "/query"のパスが指定された場合、Discovery API呼出しを行う
// この呼出しはブラウザ側のajax関数から行われる
app.get("/query", function(req, res, next){

// diacovery API呼出し
    discovery.query( req.query,
        function(error, data) {
            if ( data ) {res.send(data);} 
            else {console.log(error); res.send(error);}
        });
});

// VCAP_APP_PORTが設定されている場合はこのポートでlistenする (Bluemixのお作法)
var port = process.env.VCAP_APP_PORT || 6011;
app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
