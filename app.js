var express = require("express");
var cfenv = require('cfenv');
var app = express();

var fs = require('fs');
var watson = require('watson-developer-cloud');
var appEnv = cfenv.getAppEnv();
var services = appEnv.getServices();
var serviceCredentials;
var environment_id;
var collection_id;

if (fs.existsSync('./env.js')) {
    Object.assign(process.env, require('./env.js'));
    
}
console.log("===process.env===");
console.log(process.env);
var app_env = cfenv.getAppEnv().services;
console.log("===app_env===")+
console.log(app_env);
environment_id = process.env.environment_id ? process.env.environment_id : app_env.environment_id;
collection_id =  process.env.collection_id ? process.env.collection_id : app_env.collection_id;

var discovery_credentials = cfenv.getAppEnv().getServiceCreds('discovery-service-1');
console.log("===discovery_credentials===");
console.log(discovery_credentials);
discovery = new watson.DiscoveryV1({
    version_date: '2017-04-27',
    username: discovery_credentials.username,
    password: discovery_credentials.password
});

app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});

app.use(express.static(__dirname + '/public'));
app.get("/query", function(req, res, next){
    var query = Object.assign({environment_id: environment_id,
                                collection_id: collection_id}, req.query);
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
