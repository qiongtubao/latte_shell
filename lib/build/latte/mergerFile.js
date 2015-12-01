(function(define) {'use strict'
	define("latte_shell/build/mergerFile", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
			(function() {
				var Fs = require("latte_lib").fs
					, latte_lib = require("latte_lib")
					, Path = require("path");
				this.latte = function(command, keys) {
					return function(callback) {
							var files = [];
							var cwd = process.cwd();
							var type = "."+command.type || ".js";
							var read = function(path) {
								//console.log(path,!command.ignores  );
								if(!command.ignores || command.ignores.indexOf(path) == -1 ) {
									var stat = Fs.lstatSync(cwd + "/"+path);
									if(stat.isFile()) {
										if(Path.extname(path) == type){
											files.push(path);
										}
									}else if(stat.isDirectory()){
											Fs.readdirSync(path).forEach(function(filename) {
												read(path+"/"+filename);
											});
									}else if( stat.isSymbolicLink()){
											try{
												Fs.readdirSync(path).forEach(function(filename) {
													read(path+"/"+filename);
												});
											}catch(e) {
												files.push(path);
											}
									}
								};
							}
							command.in.forEach(function(filename) {
									read(filename);
							});
							var datas = files.map(function(filename) {
									return Fs.readFileSync(cwd + "/"+filename);
							});
							var data = datas.join("\n");
							data = latte_lib.format.templateStringFormat(data, keys);
							Fs.writeFile(cwd + "/"+command.out , data, callback);
					};
				}
			}).call(module.exports);
  });
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
