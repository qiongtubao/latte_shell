"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var Path = require("path");
var Fs = require("fs");
var moduleJson;
try {
    moduleJson = require("../../data/modules.json");
}
catch (err) {
    throw ("modules is bad");
}
var Module = (function () {
    function Module(methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (Module[methodName]) {
            Module[methodName].apply(null, args);
        }
        else {
            Module.help.apply(null, args);
        }
    }
    Module.writeModules = function () {
        Fs.writeFileSync(__dirname + "/../../data/modules.json", latte_lib.format.jsonFormat(moduleJson));
    };
    Module.install = function (moduleName, modulePath) {
        var add = function (moduleName, modulePath) {
            var m;
            moduleJson[moduleName] = {
                path: modulePath
            };
        };
        if (moduleName == null || modulePath == null) {
            var config = require(process.cwd() + "/package.json");
            if (latte_lib.utils.isString(config.bin)) {
                moduleName = moduleName || config.bin;
                modulePath = modulePath || Path.join(process.cwd(), (config.bin || ""));
                add(moduleName, modulePath);
            }
            else {
                for (var name_1 in config.bin) {
                    add(name_1, Path.join(process.cwd(), (config.bin[name_1])));
                }
            }
        }
        else {
            add(moduleName, modulePath);
        }
        Module.writeModules();
    };
    Module.remove = function (moduleName) {
        delete moduleJson[moduleName];
        Module.writeModules();
    };
    Module.find = function (moduleName) {
        if (moduleName == "module") {
            return console.error("if module have debugger you can send mail to  Author");
        }
        var moduleConfig = moduleJson[moduleName];
        if (!moduleConfig) {
            return console.log("you maybe no install or install failed " + moduleName);
        }
        console.log(moduleConfig.path);
    };
    Module.help = function () {
        console.log("you have help");
    };
    Module.findModule = function (moduleName) {
        if (moduleName == "module") {
            return Module;
        }
        var moduleConfig = moduleJson[moduleName];
        if (!moduleConfig) {
            return null;
        }
        var m;
        try {
            m = require(moduleConfig.path);
        }
        catch (err) {
            return null;
        }
        return m;
    };
    return Module;
}());
exports.default = Module;
