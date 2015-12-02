(function(define) {'use strict'
	define("latte_shell", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var Path = require("path")
 				, Fs = require("latte_lib").fs
 				, path = Path.normalize(__dirname + "/./lib")
 				, helps = [];
 			Fs.readdirSync(path).forEach(function(filename) {
 				try {
 					var handle = require("./lib/" + filename) ;
 					self[filename] = handle.latte;
 					helps.push(handle.help);
 				}catch(e) {
 					if(e.code != "MODULE_NOT_FOUND") {
 						console.log(e);
 					}else{
 						console.log(filename + "module is developing");
 					}
 				}
 			});

 		})
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
