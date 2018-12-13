#!bin/bash

#npwd=$(cd "$(dirname "$0")";pwd);
# npwd=$(cd "$(dirname "$0")";pwd); 
npwd=`pwd`
cd /usr/local/bin
sudo rm -rf latteJs
#全局安装 latteJs
sudo ln -s $npwd/bin/latteJs latteJs
sudo chmod 777 latteJs

# cd $npwd