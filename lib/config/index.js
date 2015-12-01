(function(define) {'use strict'
	define("latte_shell/config", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			this.get = function() {
	 			var cwd = process.cwd();
				var packageJson;
				try {
					packageJson = require(cwd + "/" + "package.json");
				}catch(e) {
					packageJson = {};
				}
				return packageJson;			
	 		}
 		}).call(module.exports);
 	});
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
