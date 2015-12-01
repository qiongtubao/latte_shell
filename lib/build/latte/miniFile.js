(function(define) {'use strict'
	define("latte_shell/build/miniFile", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
			(function() {
				var Fs = require("latte_lib").fs
					, latte_lib = require("latte_lib")
					, Path = require("path");
				this.latte = function(command, keys) {

					return function(callback) {
							var files = [];
							var cwd = process.cwd();
							var type = "."+(command.type || "js");
							var read = function(path) {
								if(!command.ignores || command.ignores.indexOf(path) == -1 ) {
									var stat = Fs.lstatSync(cwd + "/"+path);
									if(stat.isFile()) {
										if(Path.extname(path) == type){
											files.push(path);
										}

									}else{
											Fs.readdirSync(path).forEach(function(filename) {
												read(path+"/"+filename);
											});
									}
								};
							}
							command.in.forEach(function(filename) {
									read(filename);
							});
							var uglifyJs = require("uglify-js");
							var result = uglifyJs.minify(files);
							var data = latte_lib.format.templateStringFormat(result.code, keys);
							Fs.writeFile(cwd + "/"+command.out , data, callback);
					};
				}

			}).call(module.exports);
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
