(function(define) {'use strict'
	define("latte_shell/grunt", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
		(function() {
			var self = this;
			this.latte = function(path, type) {
				if(!self.help(path)) { return; }
				//var configs = require("../config").getConfig();
				process.argv.splice(1,1);
				require("grunt-cli/bin/grunt");

			}
			this.help = function(name) {
				if(name == "--help") {
					console.log(self.helps.join("\n"));
					return ;
				}else{
					return 1;
				}
			}
			this.helps = [];
		}).call(module.exports);
  });
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
