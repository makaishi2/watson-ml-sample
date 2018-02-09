'use strict';

const btoa = require('btoa');
const async = require('async');
const request = require('request');
const express = require('express');
const app = express();

var credentials_url;
var credentials_username;
var credentials_password;
var wml_endpoint_url;

// 静的HTMLパスの指定
app.use(express.static(__dirname + '/public'));

// 構成情報の取得
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得します');
  require('dotenv').config({ path: 'local.env' });
  credentials_url = process.env.WML_SERVICE_CREDENTIALS_URL;
  credentials_username = process.env.WML_SERVICE_CREDENTIALS_USERNAME;
  credentials_password = process.env.WML_SERVICE_CREDENTIALS_PASSWORD;
} else {
  console.log('構成情報を環境変数から取得します');
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var vcap = env['pm-20'];
  credentials_url = vcap[0].credentials.url;
  credentials_username = vcap[0].credentials.username;
  credentials_password = vcap[0].credentials.password;
}

wml_endpoint_url = process.env.WML_ENDPOINT_URL;

// ML呼出し
app.get("/predict", function(req, res, next){
    console.log("started predict");
    async.waterfall([
        // step 1 token取得
        function (callback) {
            const tokenHeader = "Basic " + btoa((credentials_username + ":" + credentials_password));
            const tokenUrl = credentials_url + "/v3/identity/token";
            
            var headers = {
                Authorization: tokenHeader,
                'Content-Type': "application/json;charset=UTF-8"
            }
            var options = {
                url: tokenUrl,
                method: 'GET',
                headers: headers
            }
            // リクエスト実行
            console.log("before get token");
            request(options, function (error, response, body) {
                if ( error ) {
                    console.log('error');
                    console.log(error);
                    callback(1, '1st error');
                } else {
                    console.log('get token normal end');
                    const wmlToken = "Bearer " + JSON.parse(body).token;
                    callback(null, wmlToken);
                }
            })
        },
        // step 2 予測値取得
        function (arg, callback) {
            const wmlToken = arg;
            var payload = req.query;
            payload.values[0][1] = Number(payload.values[0][1]);

            var headers = {
                Authorization: wmlToken,
                Accept: "application/json",
                'Content-Type': "application/json;charset=UTF-8"
            }
            var options = {
                url: wml_endpoint_url,
                method: 'POST',
                headers: headers,
                json: payload
            }
            console.log("before predict");
            request(options, function (error, response, body) {
                if ( error ) {
                    console.log('2nd error');
                    console.log(error);
                    callbak(1, '2nd error');
                } else {
                    console.log('2nd normal end');
                    var retValue = body.values[0][6];
                    callback(null, retValue);
                }
            })
        },
    ], function (err, results) {
        if (err) {
            console.log("Error")
            console.log(err);
        } else {
            console.log("Normal End!");
            console.log(results);
            res.send(results);
        }
    });
});

// VCAP_APP_PORTが設定されている場合はこのポートでlistenする (Bluemixのお作法)
var port = process.env.VCAP_APP_PORT || 6011;
app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
