'use strict';

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();

const express = require("express");
const app = express();

var wml_service_credentials_url;
var wml_service_credentials_username;
var wml_service_credentials_password;

// 静的HTMLパスの指定
app.use(express.static(__dirname + '/public'));

// 構成情報の取得
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得します');
  require('dotenv').config({ path: 'local.env' });
  wml_service_credentials_url = process.env.WML_SERVICE_CREDENTIALS_URL;
  wml_service_credentials_username = process.env.WML_SERVICE_CREDENTIALS_USERNAME;
  wml_service_credentials_password = process.env.WML_SERVICE_CREDENTIALS_PASSWORD;
} else {
  console.log('構成情報を環境変数から取得します');
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var vcap = env['pm-20'];
  wml_service_credentials_url = vcap[0].credentials.url;
  wml_service_credentials_username = vcap[0].credentials.username;
  wml_service_credentials_password = vcap[0].credentials.password;
}

wml_credentials.set("url", wml_service_credentials_url);
wml_credentials.set("username", wml_service_credentials_username);
wml_credentials.set("password", wml_service_credentials_password);

function apiGet(url, username, password, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    const tokenHeader = "Basic " + btoa((username + ":" + password));
    const tokenUrl = url + "/v3/identity/token";

    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("GET", tokenUrl);
    oReq.setRequestHeader("Authorization", tokenHeader);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send();
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(payload);
    oReq.send(payload);
}

// Callback関数が入れ子になるので、戻り値用の変数はここで定義しておく
var ret = '';

// ML呼出し
app.get("/predict", function(req, res, next){
    console.log("started predict");
    apiGet(wml_credentials.get("url"),
        wml_credentials.get("username"),
        wml_credentials.get("password"),
        function (res) {
            let parsedGetResponse;
            try {
                parsedGetResponse = JSON.parse(this.responseText);
            } catch(ex) {
                // TODO: handle parsing exception
            }
            if (parsedGetResponse && parsedGetResponse.token) {
                const token = parsedGetResponse.token
                const wmlToken = "Bearer " + token;

                var payload = req.query;
                payload.values[0][1] = Number(payload.values[0][1]);
                payload = JSON.stringify(payload);
                console.log(payload);
                // 次の行は環境により異なります。
                // 自分のWatson MLのimplementationタブをコピペして自分の環境のURLを取得して下さい。
                const scoring_url = "https://ibm-watson-ml.mybluemix.net/v3/wml_instances/xxxxx";
    
                apiPost(scoring_url, wmlToken, payload, function (resp) {
                    var response;
                    try {
                        response = JSON.parse(this.responseText);
                    } catch (ex) {
                        // TODO: handle parsing exception
                    }
                    console.log("Scoring response");
                    console.log(response)
                    // 下記の場所が、確信度になる
                    ret = response.values[0][6];
                    console.log(ret);
                }, function (error) {
                    console.log(error);
                });
            } else {
                console.log("Failed to retrieve Bearer token");
            }
        }, function (err) {
            console.log(err);
        });

// 戻り値
    res.send(ret);

});

// VCAP_APP_PORTが設定されている場合はこのポートでlistenする (Bluemixのお作法)
var port = process.env.VCAP_APP_PORT || 6011;
app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
