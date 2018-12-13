import * as latte_lib from "latte_lib"
import * as Path from "path"
import * as Fs from "fs"
let moduleJson;
try {
    moduleJson = require("../../data/modules.json");
} catch (err) {
    throw ("modules is bad");
}

export default class Module {
    constructor(methodName, ...args) {
        if (Module[methodName]) {
            Module[methodName].apply(null, args);
        } else {
            Module.help.apply(null, args);
        }
    }
    private static writeModules() {
        Fs.writeFileSync(__dirname + "/../../data/modules.json", latte_lib.format.jsonFormat(moduleJson));
    }
    static install(moduleName, modulePath) {
        let add = (moduleName, modulePath) => {
            let m;
            // try {
            //     m = require(modulePath);
            // } catch (err) {
            //     console.log(err);
            // }
            moduleJson[moduleName] = {
                path: modulePath
            }
        }
        if (moduleName == null || modulePath == null) {
            let config = require(process.cwd() + "/package.json");
            if (latte_lib.utils.isString(config.bin)) {
                moduleName = moduleName || config.bin;
                modulePath = modulePath || Path.join(process.cwd(), (config.bin || ""));
                add(moduleName, modulePath);
            } else {
                for (let name in config.bin) {
                    add(name, Path.join(process.cwd(), (config.bin[name])));
                }
            }
        } else {
            add(moduleName, modulePath);
        }
        Module.writeModules();

    }
    static remove(moduleName) {
        delete moduleJson[moduleName];
        Module.writeModules();
    }
    static find(moduleName) {
        if (moduleName == "module") {
            return console.error("if module have debugger you can send mail to  Author")
        }
        let moduleConfig = moduleJson[moduleName];
        if (!moduleConfig) {
            return console.log("you maybe no install or install failed " + moduleName);
        }
        console.log(moduleConfig.path);
    }
    static help() {
        console.log("you have help");
    }
    static findModule(moduleName) {
        if (moduleName == "module") {
            return Module;
        }
        let moduleConfig = moduleJson[moduleName];
        if (!moduleConfig) {
            return null;
        }
        let m;
        try {
            m = require(moduleConfig.path);
        } catch (err) {
            return null;
        }
        return m;
    }
}