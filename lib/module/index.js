(function(define) {'use strict'
	define("latte_shell/module/index", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var mmodule = function(methodName, dirname) {
 			var applyArray = Array.prototype.splice.call(arguments, 1);
 			switch(methodName) {
 				case "install":
 					mmodule.add.apply(null, applyArray);
 				break;
 				case "remove":
 					mmodule.remove.apply(null, applyArray);
 				break;
 				case "find":
 					mmodule.findPath.apply(null, applyArray);
 				break;
 				default:
 					mmodule.help();
 				break;
 			}
 		};
 		(function() {
 			try {
 				var modules = require("./modules.json");
 			}catch(e) {
 				throw ("modules is bad");
 			}
 			var latte_lib = require("latte_lib");
 			var writeModules = function() {
 				
 				latte_lib.fs.writeFileSync(__dirname+"/modules.json", latte_lib.format.jsonFormat(modules));
 			}
 			var self = this;
 			this.find = function(moduleName) {
 				if(moduleName == "module") {
 					return self;
 				}
 				try {
 					var m = require("../"+moduleName);
 					return m;
 				}catch(e) {

 				}
 				var moduleConfig = modules[moduleName];
 				if(!moduleConfig) {
 					return null;
 				}
 				return findModule(modules[moduleName]);
 			}
 			this.findPath = function(moduleName) {
 				if(moduleName == "module") {
 					return console.error("if module have debugger you can send mail to  Author");
 				} 
 				var moduleConfig = modules[moduleName];
 				if(!moduleConfig) {
 					return console.log("you maybe no install or install failed "+moduleName);
 				}
 				console.log(moduleConfig.path);
 			}
 			var findModule = function(config) {
 				var module = require(config.path);
 				return module;
 			}
			
			var Path = require("path");
 			this.add = function(moduleName, modulePath) {
 				var add = function(moduleName, modulePath) {
 					try {
	 					var module = require(modulePath);
	 				}catch(e) {
	 					console.log(e);
	 					return console.log("install",moduleName," module error");
	 				}
	 				modules[moduleName] = {
	 					path: modulePath
	 				};
 				}
 				if(moduleName == null || modulePath == null) {
 					var config = require(process.cwd() + "/package.json");
 					//moduleName = moduleName || config.name;
 					if(latte_lib.isString(config.bin)) {
 						moduleName = moduleName || config.name;
 						modulePath = modulePath || Path.join(process.cwd() , (config.bin  || "") ) ;
						add(moduleName, modulePath);
					}else{
						for(var name in config.bin) {
							add(name, Path.join(process.cwd() , (config.bin[name])));
						}
					}
 				}else{
 					add(moduleName, modulePath);
 				}
 				writeModules();
 			}
 			this.remove = function(moduleName) {
 				delete modules[moduleName];
 				writeModules();
 			}
 			this.help = function() {
 				console.log("you have help");
 			}

 		}).call(mmodule);
 		module.exports = mmodule;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
