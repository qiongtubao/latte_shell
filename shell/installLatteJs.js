

// let fs = require('fs')
let json = require('../package.json')
const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// const spawn = util.promisify(require('child_process').spawn);
const spawn = require('child_process').spawn
const async = require('latte_lib').async
// console.log(json.installShell)
/*
function runInstall(name) {
    return new Promise((resolve, rejects) => {
        const ls = exec(['latteJs', 'module', 'install'].join(' '), {
            cwd: process.cwd + '/node_modules/' + name,
            env: process.env
        })
        // ls.stderr.on('')
        ls.on('close', (code) => {
            console.log(code)
            resolve();  
        })
    })
}
*/
let install = function(name) {
    return function(callback) {
        let ls = spawn('latteJs', [ "module", "install"],  {
            cwd: process.cwd() + '/node_modules/' + name,
            env: process.env
        })
        ls.on('close', (code)=> {
            callback();
        })
    }
    
}
async.series(Object.keys(json.installShell).map((name)=> {
    return install(name)
}), (err, data) => {
    console.log('安装完成')
})
    // for(let name in json.installShell) {
    //     console.log('安装', name)
    //     install(name)
    // }



// let a = async function() {
//     console.log(process.cwd() + '/node_modules/typescript')
//     try {
//         let data = await exec( "latteJs module install", {//'latteJs',[ "module", "install"], {
//             cwd: process.cwd() + '/../node_modules/typescript',
//         })
//     }catch(err) {
//         console.log(err)
//     }
    
//     console.log('?????')
// }
// a()
