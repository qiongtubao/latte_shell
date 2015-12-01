(function(define) {'use strict'
	define("latte_shell/web", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
		(function() {
			var self = this;
      var Fs = require("latte_lib").fs
        , Path = require("path");
      var commands = Fs.readdirSync(__dirname + "/commands").map(function(file) {
        return Path.basename(file);
      });
			this.latte = function(path, type) {
				if(!self.help(path)) { return; }
				//var configs = require("../config").getConfig();
				//process.argv.splice(1,1);
				//require("gulp/bin/gulp");

        /**
         for(var i = 0, len = commands.length; i < len; i++) {
           var key = commands[i];
           if(process.argv.indexOf(key) != -1) {
             return handle = require("./commands/"+ key).latte();
           }
         }
         */

         require("./commands/start").latte();
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
