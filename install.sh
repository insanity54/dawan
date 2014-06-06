#!/bin/bash


## exit if not root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi


##
## CONFIG/INIT
##

## terminal colors
red='\e[0;31m'
green='\e[0;32m'
nc='\e[0m'

## find the dir of this script
bindir="$(dirname "$(readlink -fn "$0")")"

## programs this installer handles
## if these programs are detected to be missing
## they will be queued for installation
queueNode=0
queueCowsay=0
queueNginx=0


##
## FUNCTIONS
##

####
## checkBox()
## 
## creates a pretty shell output
## showing either PASS or FAIL
##
## @param name   The name of the dependency
## @param check  0 for unchecked (fail) or
##               1 for checked (pass)
##
function passBox {
    if [[ $2 -eq 0 ]]; then
        echo -e "$1:  [${red}FAIL${nc}]"
    else
        echo -e "$1:  [${green}PASS${nc}]"
    fi
}


## check install dependencies
function checkDeps {

    echo -e "\nChecking dependencies...\n"
    
    ## check installed node version
    node -v &> /dev/null
    if [[ $? -ne 0 ]]; then
        ## node is not installed
        echo $(passBox node 0)
        queueNode=1
    else
        echo $(passBox node 1)
    fi



    ## check installed cowsay
    dpkg -s cowsay &> /dev/null
    if [[ $? -ne 0 ]]; then
        ## cowsay is not installed
        echo $(passBox cowsay 0)
        queueCowsay=1
    else
        echo $(passBox cowsay 1)
    fi



    ## check installed nginx
    dpkg -s nginx &> /dev/null
    if [[ $? -ne 0 ]]; then
        ## nginx is not installed
        echo $(passBox nginx 0)
        queueNginx=1
    else
        echo $(passBox nginx 1)
    fi

    echo
}




function installNode {

    apt-get -y install python g++ make checkinstall fakeroot
    src=$(mktemp -d) && cd $src
    wget -N http://nodejs.org/dist/node-latest.tar.gz
    tar xzvf node-latest.tar.gz && cd node-v*
    ./configure
    fakeroot checkinstall -y --install=no --pkgversion $(echo $(pwd) | sed -n -re's/.+node-v(.+)$/\1/p') make -j$(($(nproc)+1)) install
    dpkg -i node_*
}

function installCowsay {
    apt-get -y install cowsay
}

function installNginx {
    apt-get -y install nginx

    cp $bindir/setup/dwane_nginx /etc/nginx/sites-available/dwane
    ln -s /etc/nginx/sites-available/dwane /etc/nginx/sites-enabled/dwane

    rm /etc/nginx/sites-enabled/default
}

function installDeps {

    if [[ $queueNode -eq 1 ]]; then installNode; fi
    if [[ $queueCowsay -eq 1 ]]; then installCowsay; fi
    if [[ $queueNginx -eq 1 ]]; then installNginx; fi
}



##
## RUNNER
##


checkDeps
installDeps

checkDeps


