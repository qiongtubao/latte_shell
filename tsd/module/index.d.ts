export default class Module {
    constructor(methodName: any, ...args: any[]);
    private static writeModules;
    static install(moduleName: any, modulePath: any): void;
    static remove(moduleName: any): void;
    static find(moduleName: any): void;
    static help(): void;
    static findModule(moduleName: any): any;
}
