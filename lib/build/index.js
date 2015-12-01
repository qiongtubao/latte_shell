(function(define) {'use strict'
	define("latte_shell/build", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
     (function() {
       var self = this;
       var latte_lib = require("latte_lib");
       this.latte = function(config) {
         if(!self.help(config)) { return; }
         var config;
         var cwd = process.cwd();
         try {
             config = require(cwd + "/.latte/build.json");
         }catch(e){
             return console.log("no find config File");
         }
         var keys = latte_lib.merger(require("../config").get(), config.keys);
         var config = JSON.parse(
           latte_lib.format.templateStringFormat(JSON.stringify(config), keys)
         );
         //sync
         var funcs = config.commands.map(function(command) {
             try {
                var handle = require("./latte/"+ command.command);
             } catch(e) {
                throw "no "+ command.command+" command";
             }
             return handle.latte(command, keys);
         });
         latte_lib.async.series(funcs, function(error) {
             if(error) {
               console.log("buiild not ok");
               return require("../clean")(config);
             }
             console.log("build ok!");
         });
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
