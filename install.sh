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

## find the dir of the script
bindir="$(dirname "$(readlink -fn "$0")")"

## programs this installer handles
## if these programs are detected to be missing
## they will be queued for installation
queueNode=0
queueCowsay=0


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
function checkBox {
    if [[ $2 -eq 0 ]]; then
        echo -e "$1:  [${red}FAIL${nc}]"
    else
        echo -e "$1:  [${green}PASS${nc}]"
    fi
}


## check install dependencies
function checkDeps {

    echo "Checking dependencies..."
    
    node -v &> /dev/null  ## check installed node version
    if [[ $? -ne 0 ]]; then
        ## node is not installed
        echo $(checkBox node 0)
        queueNode=1
    else
        echo $(checkBox node 1)
    fi



    fart -v &> /dev/null
    if [[ $? -ne 0 ]]; then
        ## frt is not installed
        echo $(checkBox fart 0)
    else
        echo $(checkBox fart 1)
    fi
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

function installDeps {

    if [[ $queueNode -eq 1 ]]; then installNode; fi
    if [[ $queueCowsay -eq 1 ]]; then installCowsay; fi
        
}


## install dependencies
#apt-get update
#apt-get -y install nginx
#sudo ln -s /etc/nginx/sites-available/dwane /etc/nginx/sites-enabled/dwane

##
## RUNNER
##


checkDeps
installDeps

checkDeps


