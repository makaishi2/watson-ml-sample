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

if (Object.keys(services).length === 0 && services.constructor === Object) {
    if (fs.existsSync('./env.js')) {
        Object.assign(process.env, require('./env.js'));
    }
    serviceCredentials = JSON.parse(process.env.VCAP_SERVICES);
    console.log( serviceCredentials.discovery[0]); 
    console.log( serviceCredentials); 
    discovery = new watson.DiscoveryV1({
        version_date: serviceCredentials.discovery[0].credentials.version,
        username: serviceCredentials.discovery[0].credentials.username,
        password: serviceCredentials.discovery[0].credentials.password
    });
    environment_id = serviceCredentials.environment_id;
    collection_id =  serviceCredentials.collection_id;
} else {
    serviceCredentials = null;
    discovery = new watson.DiscoveryV1({
        version_date: "2016-12-01",
        username: process.env.discovery_username,
        password: process.env.discovery_password
    });
    environment_id = process.env.environment_id;
    collection_id = process.env.collection_id;
}

app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
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
