var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var fs = require('fs');
var swig = require('swig');
var unirest = require('unirest');
var HttpsProxyAgent = require('https-proxy-agent');
var urlM = require('url');

var apiProxy = httpProxy.createProxyServer();
var app = express();



var config = {
		express: {
			port: process.env.VCAP_APP_PORT || 3000
		}
	};
app.use(express.static('public'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
//To disable Swig's cache, do the following:
swig.setDefaults({ cache: false , varControls: ['[[', ']]'] });


app.use("/bower_components/app-router", express.static('bower_components/app-router'));
app.use("/bower_components/angular", express.static('bower_components/angular'));

var modulecontext = [];
var corporateProxyServer = process.env.http_proxy || process.env.HTTP_PROXY;

function loadRouting(uicomponent){

	console.log("Item:"+uicomponent.id);
		
	createProxyRouting({"context":uicomponent.context, "location":uicomponent.location});
}

function createProxyRouting(config){
	
	var context = "/"+config.context+"/";
	var contextAll = context+"*";
	console.log("Create proxy route [context:"+contextAll+",location:"+config.location+"]");
	
	app.all(contextAll, function(req, res) {
		
	    var path = req.originalUrl.split(context)[1];
	    var url = urlM.resolve(config.location , path);
	   	    
	    console.log("Routing ["+context+"\\"+path," ==> "+url+"]");
	    
	    var options = {target: url , ignorePath: true, secure:false, changeOrigin:true};
	    
	    if (corporateProxyServer) {
			console.log("Using corporateproxy:"+corporateProxyServer);
			options.agent = new HttpsProxyAgent(corporateProxyServer);
		}
	    
	    apiProxy.web(req, res, options);
	});
}


// loading view project details and configure the server proxy and routing
var uiconfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var compImportDefinitions=[];
var mainview;
var ng_modules = ['dynamicui'];

// create routing for view 
createProxyRouting({"context":uiconfig.view.context, "location":uiconfig.view.location});
compImportDefinitions.push(uiconfig.view.context+"/import.html");
modulecontext.push({"name":uiconfig.view.modulename, "context" : uiconfig.view.context});

/// Loading component definition and create proxy routing ////

uiconfig.components.forEach(function(item) { 
	loadRouting(item);
	compImportDefinitions.push(item.context+"/import.html");
	// add angularjs module info
	if(item.ngmodule){ // has angularj module
		ng_modules.push(item.ngmodule);
	}
	modulecontext.push({"name":item.modulename, "context" : item.context});
})


/// Finding view angularjs module name and main view html file ///
mainview = uiconfig.view.context +"/" + uiconfig.view.main;
ng_modules.push(uiconfig.view.ngmodule);

console.log("compImportDefinitions:::::"+compImportDefinitions);


app.get("/components", function(req, res){
	res.send(uiconfig);
});



app.get(['/index.html','/demo.html','/'], function (req, res) {
	  res.render('index', { "uiconfig":uiconfig, "mainview":mainview, "ng_modules":ng_modules , "modulecontext":modulecontext });
});


app.get('/base-libraries.html', function (req, res) {
  res.render('base-libraries', { "uiconfig":uiconfig ,"mainview":mainview, "impdefs":compImportDefinitions});
});


//console.log("App started on 3001")
//app.listen(3001);


var server = app.listen(config.express.port, function () {
  var host = server.address().address;
  var port = server.address().port;
	console.log ('Server Started at ' + host+":"+port);
});
