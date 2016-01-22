#!bin/bash

#npwd=$(cd "$(dirname "$0")";pwd);
cd ../
npwd=$(cd "$(dirname "$0")";pwd);
cd /usr/local/bin
sudo rm -rf latte
sudo ln -s $npwd/bin/latte latte
sudo chmod 777 latte