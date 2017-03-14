var Path = require("path")
	, latte_lib = require("latte_lib");
var GetConfig = function() {
	var config;
	var index = process.argv.indexOf("-c");
	if(index != -1) {
		config = process.argv[index+1];
	}
	config = config || ".latte/run.json";
	var buildConfigPath = Path.join(process.cwd()+"/"+config);
	var buildConfig;
	try {
		buildConfig = require(buildConfigPath);
	}catch(e) {
		return null;
	}
	return buildConfig;
}
var spawn = require("child_process").spawn;
var Config2Function = function(command, config) {
	return function(cb) {
		var params = [command].concat(config.params || []);
		config.optional = config.optional || {};
		for(var i in config.optional) {
			params.push(i);
			params.push(config.optional[i]);
		}
		var child = spawn("latte",params);
		console.log(params);
		child.stdout.on('data', (data) => {
		  	console.log(`stdout: ${data}`);
		});

		child.stderr.on('data', (data) => {
		  	console.log(`stderr: ${data}`);
		});
		child.on("exit" , function(code,sig) {
			console.log("进程", command, "结束",code, sig);
			cb();
		});
	}
}
module.exports = function() {
	var config = GetConfig();
	if(!config) {
		return console.log("not find config");
	}
	var funcs = {};
	Object.keys(config.commands).forEach(function(command) {
		if(latte_lib.isArray(config.commands[command])) {
			funcs[command] = config.commands[command].map(function(k) {
				if(latte_lib.isString(k)) {
					return k;
				}else{
					return Config2Function(command, k);
				}
			});
		}else{
			funcs[command] = Config2Function(command, config.commands[command]);
		}
	});
	latte_lib.async.auto(funcs, function(err) {
		if(err) {
			console.log("执行异常", err);
		}else{
			console.log("执行进程结束");
		}
	});

};