#!bin/bash

npwd=$(cd "$(dirname "$0")";pwd);

mkdir latte
cd latte 

git clone git@github.com:qiongtubao/latte_lib.git
git clone git@github.com:qiongtubao/latte_webServer3.git
git clone git@github.com:qiongtubao/latte_db.git
git clone git@github.com:qiongtubao/latte_watch.git
git clone git@github.com:qiongtubao/latte_require.git
git clone git@github.com:qiongtubao/latte_shell.git

cd latte_db
npm install redis
npm install mongodb
cd node_modules
ln -s ../../latte_lib latte_lib
cd ../../

cd latte_webServer3
npm install ws 
cd node_modules
ln -s ../../latte_lib latte_lib
ln -s ../../latte_db latte_db
ln -s ../../latte_webServer3  latte_webServer3
ln -s ../../latte_watch latte_watch
ln -s ../../latte_require latte_require
cd ../../

cd latte_watch
npm install 
cd ../

cd latte_shell
npm install 
cd node_modules
ln -s ../../latte_lib latte_lib
ln -s ../../latte_webServer3 latte_webServer3
cd ../../




cd /usr/local/bin
sudo ls -n $npwd/latte/latte_shell/bin/latte latte
sudo chmod 777 latte
