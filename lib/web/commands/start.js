(function(define) {'use strict'
	define("latte_shell/web/commands/start.js", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
      (function() {
          var Fs = require("latte_lib").fs;
          this.latte = function() {
            var filePath;
            var fileIndex = process.argv.indexOf("-c");
            filePath = fileIndex == -1? "./.latte/web.json": process.argv[fileIndex];
            var config;
            try {
              var data = Fs.readFileSync(filePath);
              config = JSON.parse(data);
            }catch(e) {
              console.log(e);
            }
            var Server = require("latte_webServer3");
            var server = new Server(config);
            server.run();
          }
      }).call(module.exports);
  });
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
