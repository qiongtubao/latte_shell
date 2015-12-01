(function(define) {'use strict'
	define("latte_shell/doc/latte/latteDoc/theme-smart/helpers/helpers", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
     (function() {
       this.publicClasses = function(context, options) {
          var ret = "";

          for(var i=0; i < context.length; i++) {
              if(!context[i].itemtype && context[i].access === 'public') {
                  ret = ret + options.fn(context[i]);
              } else if (context[i].itemtype) {
                  ret = ret + options.fn(context[i]);
              }
          }

          return ret;
       }
       this.search = function(classes, modules) {
          var ret = '';

          for(var i=0; i < classes.length; i++) {
              if(i > 0) {
                  ret += ', ';
              }
              ret += "\"" + 'classes/' + classes[i].displayName + "\"";
          }

          if(ret.length > 0 && modules.length > 0) {
              ret += ', ';
          }

          for(var j=0; j < modules.length; j++) {
              if(j > 0) {
                  ret += ', ';
              }
              ret += "\"" + 'modules/' + modules[j].displayName + "\"";
          }

          return ret;
       }
     }).call(module.exports);
  });
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
