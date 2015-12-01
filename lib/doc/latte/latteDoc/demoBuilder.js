(function(define) {'use strict'
	define("latte_shell/doc/latte/latteDoc/demoBuilder", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
     var Fs = require("latte_lib").fs;

      function getSetting(path,startFlag,endFlag){
          var start = path.indexOf(startFlag),end,setting;
          if (start > 0) {
              end = path.indexOf(endFlag);
              if(end > start){
                  return [path.substr(0, index),]
              }
              unit = path.substring(index + 1, path.length - 1);
              path = path.substr(0, index);
          }
      }
     (function() {
       this.build = function( path, config, target) {
         var index = path.indexOf("{"),
            unit,title, code,loader;

          path = path.replace(/\{([\s\S]*?)}/g, function (s, matched) {
              title = matched;
              return '';
          }).replace(/\[([\s\S]*?)]/g, function (s, matched) {
              unit = matched;
              return '';
          });

          function getCode(demoPath) {
              var data;
              try {
                  data = Fs.readFileSync(config.demoDir + demoPath.trim(), 'utf-8');
              } catch (err) {
                  console.error("demo 文件读取失败：" + err);
              }
              return data;
          }
          if(!title){
            title = path.substring(path.lastIndexOf('/') + 1,path.indexOf('.'));
        }

        if(unit){
            loader = require(config.codeLoader);
            code = loader.load(path, unit, getCode, this.formatCode);
        }
        else
             code = this.formatCode(getCode(path))

        return {
            code : code,
            title : title
        };
       }

       this.formatCode =  function(code) {
         if(code) {
           return "\t" + code.replace(/\n/g, '\n\t');
         }
       }
     }).call(module.exports);
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
