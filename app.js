var express = require("express");
var app = express();

// env.jsファイルがある場合は、この設定をprocess.envにマージする
// ローカル環境でのテスト用
var fs = require('fs');
if (fs.existsSync('./env.js')) {
    Object.assign(process.env, require('./env.js'));
}

// environment_id, collection_idの取得 (Discovery API呼出しの際に必要になる)
var environment_id = process.env.environment_id;
var collection_id =  process.env.collection_id;

// appEnvの取得 (app.listenでポート指定の際に必要となる)
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

// Discoveryインスタンスの生成
var watson = require('watson-developer-cloud');
var discovery_credentials = appEnv.getServiceCreds('discovery-service-1');
discovery = new watson.DiscoveryV1({
    version_date: '2017-04-27',
    username: discovery_credentials.username,
    password: discovery_credentials.password
});

// httpポートのlisten(ポート番号は環境変数で指定されたものを利用)
app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});

// 静的HTMLパスの指定
app.use(express.static(__dirname + '/public'));

// "/query"のパスが指定された場合、Discovery API呼出しを行う
// この呼出しはブラウザ側のajax関数から行われる
app.get("/query", function(req, res, next){

// req.queryに指定されているパラメータにenvironment_id, collection_idを追加する
    var query = Object.assign({environment_id: environment_id,
                                collection_id: collection_id}, req.query);
// diacovery API呼出し
    discovery.query( query,
    function(error, data) {
        if ( data ) {
            res.send(data);
        } else {
            console.log(error);
            res.send(error);
        }
    });
});
